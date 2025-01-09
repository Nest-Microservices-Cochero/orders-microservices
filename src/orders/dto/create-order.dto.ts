import { Type } from 'class-transformer';
import { ArrayMinSize, IsArray, ValidateNested } from 'class-validator';
import { OrderItemDto } from './order-item.dto';

export class CreateOrderDto {
  /// Que reciba un arreglo y por lo menos tenga un elemento
  @IsArray()
  @ArrayMinSize(1)

  //- esto es para iterar cada item, y validarlos con el type
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto) // OrderItemDto DTO para sus respectivas validaciones
  items: OrderItemDto[];
}
