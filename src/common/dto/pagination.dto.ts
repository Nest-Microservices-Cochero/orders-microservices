import { Type } from 'class-transformer';
import { IsOptional, IsPositive } from 'class-validator';

///1) Crear nuestro DTO y valores por defecto
export class PaginationDto {
  @IsPositive()
  @IsOptional()
  @Type(() => Number)
  page?: number = 1;

  @IsPositive()
  @IsOptional()
  @Type(() => Number)
  limit?: number = 10;
}
