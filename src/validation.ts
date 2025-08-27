import { z } from "zod";
import { 
  TaskSchema, 
  CustomerSchema, 
  ShipmentSchema, 
  OrderSchema, 
  ContactSchema,
  OrderItemSchema
} from "./schemas.js";
import { PrismaClient } from "@prisma/client";
import prisma from "./db.js";

// Type definitions for convenience
export type Task = z.infer<typeof TaskSchema>;
export type Customer = z.infer<typeof CustomerSchema>;
export type Shipment = z.infer<typeof ShipmentSchema>;
export type Order = z.infer<typeof OrderSchema>;
export type Contact = z.infer<typeof ContactSchema>;
export type OrderItem = z.infer<typeof OrderItemSchema>;

// Validate types before creating or updating records
export async function validateTask(data: unknown): Promise<Task> {
  return TaskSchema.parseAsync(data);
}

export async function validateCustomer(data: unknown): Promise<Customer> {
  return CustomerSchema.parseAsync(data);
}

export async function validateShipment(data: unknown): Promise<Shipment> {
  return ShipmentSchema.parseAsync(data);
}

export async function validateOrder(data: unknown): Promise<Order> {
  return OrderSchema.parseAsync(data);
}

export async function validateContact(data: unknown): Promise<Contact> {
  return ContactSchema.parseAsync(data);
}

export async function validateOrderItem(data: unknown): Promise<OrderItem> {
  return OrderItemSchema.parseAsync(data);
}

// Helper functions for safe Prisma operations with validation
export async function safeCreateTask<T extends Omit<Task, "id" | "createdAt" | "updatedAt">>(
  data: T
) {
  const validatedData = await validateTask(data);
  return prisma.task.create({
    data: validatedData,
  });
}

export async function safeCreateCustomer<T extends Omit<Customer, "id" | "createdAt" | "updatedAt">>(
  data: T
) {
  const validatedData = await validateCustomer(data);
  return prisma.customer.create({
    data: validatedData,
  });
}

export async function safeCreateShipment<T extends Omit<Shipment, "id" | "createdAt" | "updatedAt">>(
  data: T
) {
  const validatedData = await validateShipment(data);
  return prisma.shipment.create({
    data: validatedData,
  });
}

export async function safeCreateOrder<T extends Omit<Order, "id" | "createdAt" | "updatedAt">>(
  data: T
) {
  const validatedData = await validateOrder(data);
  return prisma.order.create({
    data: validatedData,
  });
}

// Generic validation helper for any Prisma model
export async function validateAndCreate<T, U extends z.ZodType<T>>(
  schema: U,
  data: any,
  createFn: (data: T) => Promise<any>
) {
  const validatedData = await schema.parseAsync(data);
  return createFn(validatedData);
}

// Validate before updating
export async function validateAndUpdate<T, U extends z.ZodType<Partial<T>>>(
  schema: U,
  id: string,
  data: any,
  updateFn: (id: string, data: Partial<T>) => Promise<any>
) {
  const validatedData = await schema.partial().parseAsync(data);
  return updateFn(id, validatedData);
}
