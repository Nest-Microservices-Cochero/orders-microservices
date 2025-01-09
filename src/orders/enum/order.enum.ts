import { OrdersStatus } from "@prisma/client";

/// Aca lo que estamos haciendo es un arreglo para centralizar todos los posibles estados de una orden
export const OrderStatusList = [
    OrdersStatus.CANCELLED,
    OrdersStatus.DELIVERED,
    OrdersStatus.PENDING,
    OrdersStatus.SHIPPED,
]