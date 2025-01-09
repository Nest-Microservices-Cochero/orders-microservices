import {
  Injectable,
  OnModuleInit,
  Logger,
  HttpStatus,
  Inject,
} from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { PrismaClient } from '@prisma/client';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { OrderPaginationDto } from './dto/order-pagination.dto';
import { ChangeOrderStatusDto } from './dto/change-order-status.dto';
import { NATS_SERVICE, PRODUCTS_SERVICE } from 'src/config/services';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class OrdersService extends PrismaClient implements OnModuleInit {
  private readonly logger = new Logger('OrdersService');

  ///1)  Necesitamos inyectar nuestro Servicio De NATS aca
  constructor(
    @Inject(NATS_SERVICE) private readonly client: ClientProxy,
  ) {
    super();
  }

  async onModuleInit() {
    await this.$connect();
    this.logger.log('Connected to the database');
  }

  async create(createOrderDto: CreateOrderDto) {
    //- envolvemos en un try por que esto puede fallar
    try {
      // confirmar los ids de los productos
      const productsIds = createOrderDto.items.map((item) => item.productId);
      const products = await firstValueFrom(
        this.client.send({ cmd: 'validate_products' }, productsIds),
      );

      // Cálculos de los valores de la orden
      const totalAmount = createOrderDto.items.reduce((acc, orderItem) => {
        const price = products.find((p) => p.id === orderItem.productId).price;

        return acc + price * orderItem.quantity;
      }, 0);

      const totalItems = createOrderDto.items.reduce((acc, orderItem) => {
        return acc + orderItem.quantity;
      }, 0);

      //- Crear una transacción de bases de datos

      const order = await this.order.create({
        data: {
          // esto es lo único que necesito para una orden
          totalAmount,
          totalItems,
          /// 1) Barrer nuestros items inserción multiple
          OrderItem: {
            createMany: {
              data: createOrderDto.items.map((item) => ({
                price: products.find((product) => product.id === item.productId)
                  .price,
                productId: item.productId,
                quantity: item.quantity,
              })),
            },
          },
        },
        ///2) Justo a la order traer todos sus items relacionados
        include: {
          // OrderItem: true,
          //- retornar solo lo necesario de los items
          OrderItem: {
            select: {
              productId: true,
              quantity: true,
              price: true,
            },
          }

        }
      });

      /// 3, incluir el nombre del producto también
      return {
        ...order,
        OrderItem: order.OrderItem.map( (item) => ({
          ...item,
          name: products.find( product => product.id === item.productId).name
        }))
      };
    } catch (error) {
      throw new RpcException(error);
    }
  }

  async findAll(orderPaginationDto: OrderPaginationDto) {
    const totalPages = await this.order.count({
      where: {
        status: orderPaginationDto.status,
      },
    });

    const currenPage = orderPaginationDto.page;
    const perPage = orderPaginationDto.limit;

    return {
      data: await this.order.findMany({
        where: {
          status: orderPaginationDto.status,
        },
        take: perPage,
        skip: (currenPage - 1) * perPage,
      }),
      meta: {
        totalPages,
        currentPage: currenPage,
        lastPage: Math.ceil(totalPages / perPage),
      },
    };
  }

  async findOne(id: string) {
    const order = await this.order.findFirst({
      where: { id },

      /// traer los detalles
      include: {
        OrderItem: {
          select: {
            productId: true,
            quantity: true,
            price: true
          },
        },
      }
    });

    if (!order) {
      throw new RpcException({
        status: HttpStatus.NOT_FOUND,
        message: `Order with id ${id} not found`,
      });
    }

    /// consultar info de los productos
    const productsIds = order.OrderItem.map((item) => item.productId)

    const products = await firstValueFrom(
      this.client.send({ cmd: 'validate_products' }, productsIds),
    );

    /// mandar con el nombre del producto
    return {
      ...order,
      OrderItem: order.OrderItem.map( (item) => ({
        ...item,
        name: products.find( product => product.id === item.productId).name
      }))
    };
  }

  async changeStatus(changeOrderStatusDto: ChangeOrderStatusDto) {
    const { id, status } = changeOrderStatusDto;

    const order = await this.findOne(id);

    if (order.status === status) {
      return order;
    }

    return this.order.update({
      where: { id },
      data: { status },
    });
  }
}
