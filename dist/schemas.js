import { z } from "zod";
// Define enum-like string literal unions for consistency
export const PriorityEnum = z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]);
export const TaskStatusEnum = z.enum(["PENDING", "IN_PROGRESS", "COMPLETED", "CANCELLED", "ON_HOLD"]);
export const ShipmentStatusEnum = z.enum(["PENDING", "PICKED_UP", "IN_TRANSIT", "OUT_FOR_DELIVERY", "DELIVERED", "EXCEPTION", "RETURNED"]);
export const OrderStatusEnum = z.enum(["PENDING", "CONFIRMED", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED", "REFUNDED"]);
export const DimensionsSchema = z.object({
    length: z.number(),
    width: z.number(),
    height: z.number(),
});
// Define schemas without relations first to avoid circular references
const BaseTaskSchema = z.object({
    id: z.string().uuid(),
    title: z.string().min(1),
    description: z.string().optional(),
    priority: PriorityEnum,
    status: TaskStatusEnum,
    dueDate: z.date().optional(),
    assignedTo: z.string().optional(),
    customerId: z.string().uuid().optional().nullable(),
    shipmentId: z.string().uuid().optional().nullable(),
    orderId: z.string().uuid().optional().nullable(),
    tags: z.array(z.string()).optional(),
    estimatedHours: z.number().optional(),
    actualHours: z.number().optional(),
    createdAt: z.date(),
    updatedAt: z.date(),
    completedAt: z.date().optional().nullable(),
});
const BaseContactSchema = z.object({
    id: z.string().uuid(),
    customerId: z.string().uuid(),
    name: z.string().min(1),
    email: z.string().email().optional().nullable(),
    phone: z.string().optional().nullable(),
    role: z.string().optional().nullable(),
    isPrimary: z.boolean().default(false),
});
const BaseCustomerSchema = z.object({
    id: z.string().uuid(),
    name: z.string().min(1),
    email: z.string().email(),
    phone: z.string().optional().nullable(),
    company: z.string().optional().nullable(),
    address: z.string().optional().nullable(),
    city: z.string().optional().nullable(),
    state: z.string().optional().nullable(),
    zipCode: z.string().optional().nullable(),
    country: z.string().min(1),
    website: z.string().url().optional().nullable(),
    vatNumber: z.string().optional().nullable(),
    industry: z.string().optional().nullable(),
    tags: z.array(z.string()).optional(),
    notes: z.string().optional().nullable(),
    createdAt: z.date(),
    updatedAt: z.date(),
});
const BaseShipmentSchema = z.object({
    id: z.string().uuid(),
    trackingNumber: z.string().min(1),
    customerId: z.string().uuid(),
    origin: z.string().min(1),
    destination: z.string().min(1),
    carrier: z.string().min(1),
    status: ShipmentStatusEnum,
    estimatedDelivery: z.date().optional().nullable(),
    actualDelivery: z.date().optional().nullable(),
    weight: z.number().optional().nullable(),
    dimensions: DimensionsSchema.optional().nullable(),
    value: z.number().optional().nullable(),
    insurance: z.number().optional().nullable(),
    notes: z.string().optional().nullable(),
    createdAt: z.date(),
    updatedAt: z.date(),
});
const BaseOrderItemSchema = z.object({
    id: z.string().uuid(),
    orderId: z.string().uuid(),
    productName: z.string().min(1),
    description: z.string().optional().nullable(),
    quantity: z.number().int().positive(),
    unitPrice: z.number().nonnegative(),
    totalPrice: z.number().nonnegative(),
});
const BaseOrderSchema = z.object({
    id: z.string().uuid(),
    orderNumber: z.string().min(1),
    customerId: z.string().uuid(),
    status: OrderStatusEnum,
    orderDate: z.date(),
    dueDate: z.date().optional().nullable(),
    totalAmount: z.number().nonnegative(),
    notes: z.string().optional().nullable(),
    createdAt: z.date(),
    updatedAt: z.date(),
});
// Now extend these schemas to include relations
export const TaskSchema = BaseTaskSchema.extend({});
export const ContactSchema = BaseContactSchema.extend({});
export const OrderItemSchema = BaseOrderItemSchema.extend({});
export const ShipmentSchema = BaseShipmentSchema.extend({});
export const OrderSchema = BaseOrderSchema.extend({
    items: z.array(OrderItemSchema).optional(),
});
export const CustomerSchema = BaseCustomerSchema.extend({
    contacts: z.array(ContactSchema).optional(),
});
// Define schemas for complete objects with all relations
export const TaskWithRelationsSchema = TaskSchema.extend({
    customer: CustomerSchema.nullable().optional(),
    shipment: ShipmentSchema.nullable().optional(),
    order: OrderSchema.nullable().optional(),
});
export const ShipmentWithRelationsSchema = ShipmentSchema.extend({
    customer: CustomerSchema.optional(),
    tasks: z.array(TaskSchema).optional(),
    orders: z.array(OrderSchema).optional(),
});
export const OrderWithRelationsSchema = OrderSchema.extend({
    customer: CustomerSchema.optional(),
    items: z.array(OrderItemSchema).optional(),
    tasks: z.array(TaskSchema).optional(),
    shipments: z.array(ShipmentSchema).optional(),
});
export const CustomerWithRelationsSchema = CustomerSchema.extend({
    contacts: z.array(ContactSchema).optional(),
    tasks: z.array(TaskSchema).optional(),
    shipments: z.array(ShipmentSchema).optional(),
    orders: z.array(OrderSchema).optional(),
});
// Schema for dashboard data
export const DashboardDataSchema = z.object({
    pendingShipments: z.number(),
    urgentTasks: z.number(),
    customersNeedingAttention: z.number(),
    recentOrders: z.number(),
    totalRevenue: z.number(),
});
//# sourceMappingURL=schemas.js.map