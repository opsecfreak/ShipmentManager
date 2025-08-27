import { type Order, type OrderWithRelations, type CreateOrder, type OrderStatus } from "./models.js";
export declare function getOrders(): Promise<Order[]>;
export declare function getOrdersWithRelations(): Promise<OrderWithRelations[]>;
export declare function getOrderById(id: string): Promise<Order | null>;
export declare function getOrderWithRelationsById(id: string): Promise<OrderWithRelations | null>;
export declare function getOrdersByCustomer(customerId: string): Promise<Order[]>;
export declare function getOrdersByStatus(status: OrderStatus): Promise<Order[]>;
export declare function getRecentOrders(days?: number): Promise<Order[]>;
export declare function addOrder(orderData: CreateOrder): Promise<Order>;
export declare function updateOrder(id: string, updates: Partial<Order>): Promise<Order | null>;
export declare function updateOrderStatus(id: string, status: OrderStatus): Promise<Order | null>;
export declare function linkOrderToShipment(orderId: string, shipmentId: string): Promise<boolean>;
export declare function deleteOrder(id: string): Promise<boolean>;
export declare function searchOrders(query: string): Promise<Order[]>;
export declare function getOrdersByDateRange(startDate: Date, endDate: Date): Promise<Order[]>;
export declare function getTotalRevenue(days?: number): Promise<number>;
//# sourceMappingURL=OrderManager.d.ts.map