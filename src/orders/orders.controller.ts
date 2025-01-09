import { Controller, ParseUUIDPipe } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrderPaginationDto } from './dto/order-pagination.dto';
import { ChangeOrderStatusDto } from './dto/change-order-status.dto';

@Controller()
export class OrdersController {


  constructor(private readonly ordersService: OrdersService) {}

  @MessagePattern('createOrder')
  create(@Payload() createOrderDto: CreateOrderDto) {
    return this.ordersService.create(createOrderDto);
  }

  @MessagePattern('findAllOrders')
  findAll(@Payload() orderPaginationDto : OrderPaginationDto) {
    console.log(orderPaginationDto, ' controller')
    return this.ordersService.findAll(orderPaginationDto);
  }

  @MessagePattern('findOneOrder')
  findOne(@Payload('id', ParseUUIDPipe ) id : string) {
    return this.ordersService.findOne(id);
  }

  /// controlador
  @MessagePattern('changeOrderStatus')
  changeOrderStatus(@Payload() changeOrderStatusDto:ChangeOrderStatusDto) {
    return this.ordersService.changeStatus(changeOrderStatusDto)
  }
}
