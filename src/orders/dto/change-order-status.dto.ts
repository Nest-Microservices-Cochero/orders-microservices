import { IsEnum, IsUUID } from 'class-validator';
import { OrderStatusList } from '../enum/order.enum';
import { OrdersStatus } from '@prisma/client';

/// DTO para cambiar el estado de una orden, Recuerda que aca definimos como recibe la información nuestro endpoint
export class ChangeOrderStatusDto {
  @IsUUID()
  id: string;

  /// Agregamos la opción de obtener un estado de orden para filtrarlas
  @IsEnum(OrderStatusList, {
    message: `Valid status are ${OrderStatusList}`,
  })
  status: OrdersStatus;
}
