import { Type } from 'class-transformer';
import { IsNumber, IsPositive } from 'class-validator';

/// Este un DTO para validar cada uno de los item que recibimos del Otro DTO
export class OrderItemDto {
  @IsNumber()
  @IsPositive()
  productId: number;

  @IsNumber()
  @IsPositive()
  quantity: number;

  @IsNumber()
  @IsPositive()
  @Type(() => Number)
  price: number;
}
