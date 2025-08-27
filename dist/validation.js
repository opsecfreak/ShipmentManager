import { TaskSchema, CustomerSchema, ShipmentSchema, OrderSchema, ContactSchema, OrderItemSchema } from "./schemas.js";
import prisma from "./db.js";
// Validate types before creating or updating records
export async function validateTask(data) {
    return TaskSchema.parseAsync(data);
}
export async function validateCustomer(data) {
    return CustomerSchema.parseAsync(data);
}
export async function validateShipment(data) {
    return ShipmentSchema.parseAsync(data);
}
export async function validateOrder(data) {
    return OrderSchema.parseAsync(data);
}
export async function validateContact(data) {
    return ContactSchema.parseAsync(data);
}
export async function validateOrderItem(data) {
    return OrderItemSchema.parseAsync(data);
}
// Helper functions for safe Prisma operations with validation
export async function safeCreateTask(data) {
    const validatedData = await validateTask(data);
    return prisma.task.create({
        data: validatedData,
    });
}
export async function safeCreateCustomer(data) {
    const validatedData = await validateCustomer(data);
    return prisma.customer.create({
        data: validatedData,
    });
}
export async function safeCreateShipment(data) {
    const validatedData = await validateShipment(data);
    return prisma.shipment.create({
        data: validatedData,
    });
}
export async function safeCreateOrder(data) {
    const validatedData = await validateOrder(data);
    return prisma.order.create({
        data: validatedData,
    });
}
// Generic validation helper for any Prisma model
export async function validateAndCreate(schema, data, createFn) {
    const validatedData = await schema.parseAsync(data);
    return createFn(validatedData);
}
// Validate before updating
export async function validateAndUpdate(schema, id, data, updateFn) {
    const validatedData = await schema.partial().parseAsync(data);
    return updateFn(id, validatedData);
}
//# sourceMappingURL=validation.js.map