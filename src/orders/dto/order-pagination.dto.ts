import { IsEnum, IsOptional } from "class-validator";

//- Copiar también la carpeta common de el api gateway 
import { PaginationDto } from 'src/common';
import { OrderStatusList } from "../enum/order.enum";
import { OrdersStatus } from "@prisma/client";

/// Extendemos del DTO generar de paginación
export class OrderPaginationDto extends PaginationDto {


    /// Agregamos la opción de obtener un estado de orden para filtrarlas
    @IsOptional()
    @IsEnum( OrderStatusList, {
        message: `Valid status are ${OrderStatusList}`
    })
    /// aca el ordersStatus lo tomamos de prisma
    // recuerda que aca cometí el error de ponerlo con doble ss pero no importa es lo mismo
    status: OrdersStatus;
}