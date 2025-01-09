import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { PRODUCTS_SERVICE } from 'src/config/services';
import { envs } from 'src/config/envs';

@Module({
  controllers: [OrdersController],
  providers: [OrdersService],
  /// Inyectar el MS de productos para consumir sus métodos
  imports: [
    ClientsModule.register([
      {
        name: PRODUCTS_SERVICE,
        transport: Transport.TCP,
        options: {
          host: envs.productsMicroserviceHost,
          port: envs.productsMicroservicePort,
        },
      },
    ]),
  ],
})
export class OrdersModule {}
