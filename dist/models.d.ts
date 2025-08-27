import { Task, Contact, Customer, Shipment, Order, OrderItem, Dimensions, TaskWithRelations, ShipmentWithRelations, OrderWithRelations, CustomerWithRelations, DashboardData, Priority, TaskStatus, ShipmentStatus, OrderStatus } from './schemas.js';
export type { Task, Contact, Customer, Shipment, Order, OrderItem, Dimensions, TaskWithRelations, ShipmentWithRelations, OrderWithRelations, CustomerWithRelations, DashboardData, Priority, TaskStatus, ShipmentStatus, OrderStatus, };
export type CreateCustomer = Omit<Customer, 'id' | 'createdAt' | 'updatedAt' | 'contacts' | 'tasks' | 'shipments' | 'orders'>;
export type CreateContact = Omit<Contact, 'id'>;
export type CreateTask = Omit<Task, 'id' | 'createdAt' | 'updatedAt' | 'completedAt'>;
export type CreateShipment = Omit<Shipment, 'id' | 'createdAt' | 'updatedAt' | 'customer' | 'tasks' | 'orders'>;
export type CreateOrder = Omit<Order, 'id' | 'createdAt' | 'updatedAt' | 'customer' | 'items' | 'tasks' | 'shipments'> & {
    items?: CreateOrderItem[];
};
export type CreateOrderItem = Omit<OrderItem, 'id' | 'order'>;
export declare const customerIncludes: {
    contacts: boolean;
    tasks: boolean;
    shipments: boolean;
    orders: {
        include: {
            items: boolean;
        };
    };
};
export declare const taskIncludes: {
    customer: boolean;
    shipment: boolean;
    order: boolean;
};
export declare const shipmentIncludes: {
    customer: boolean;
    tasks: boolean;
    orders: boolean;
};
export declare const orderIncludes: {
    customer: boolean;
    items: boolean;
    tasks: boolean;
    shipments: boolean;
};
export declare function parseTagsFromJSON(tagsJson: string[] | string | null): string[];
export declare function stringifyTagsToJSON(tags: string[]): string;
export declare function parseDimensionsFromJSON(dimensionsJson: string | null): Dimensions | null;
export declare function stringifyDimensionsToJSON(dimensions: Dimensions | null): string | null;
//# sourceMappingURL=models.d.ts.map