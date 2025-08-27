// We don't need to import Prisma directly anymore
import {
  Task,
  Contact,
  Customer,
  Shipment,
  Order,
  OrderItem,
  Dimensions,
  TaskWithRelations,
  ShipmentWithRelations,
  OrderWithRelations,
  CustomerWithRelations,
  DashboardData,
  Priority,
  TaskStatus,
  ShipmentStatus,
  OrderStatus,
} from './schemas.js';

// Export types from our schemas
export type {
  Task,
  Contact,
  Customer,
  Shipment,
  Order,
  OrderItem,
  Dimensions,
  TaskWithRelations,
  ShipmentWithRelations,
  OrderWithRelations,
  CustomerWithRelations,
  DashboardData,
  Priority,
  TaskStatus,
  ShipmentStatus,
  OrderStatus,
};

// Extended types for creating new records (without auto-generated fields)
export type CreateCustomer = Omit<Customer, 'id' | 'createdAt' | 'updatedAt' | 'contacts' | 'tasks' | 'shipments' | 'orders'>;

export type CreateContact = Omit<Contact, 'id'>;

export type CreateTask = Omit<Task, 'id' | 'createdAt' | 'updatedAt' | 'completedAt'>;

export type CreateShipment = Omit<Shipment, 'id' | 'createdAt' | 'updatedAt' | 'customer' | 'tasks' | 'orders'>;

export type CreateOrder = Omit<Order, 'id' | 'createdAt' | 'updatedAt' | 'customer' | 'items' | 'tasks' | 'shipments'> & {
  items?: CreateOrderItem[];
};

export type CreateOrderItem = Omit<OrderItem, 'id' | 'order'>;

// Helper constants for relation loading
export const customerIncludes = {
  contacts: true,
  tasks: true,
  shipments: true,
  orders: {
    include: {
      items: true
    }
  }
};

export const taskIncludes = {
  customer: true,
  shipment: true,
  order: true
};

export const shipmentIncludes = {
  customer: true,
  tasks: true,
  orders: true
};

export const orderIncludes = {
  customer: true,
  items: true,
  tasks: true,
  shipments: true
};

// Helper functions for working with JSON fields in SQLite
import { parseJsonField, stringifyJsonField } from './db.js';
import { z } from 'zod';

// Parse tags from JSON string or array
export function parseTagsFromJSON(tagsJson: string[] | string | null): string[] {
  if (Array.isArray(tagsJson)) return tagsJson;
  return parseJsonField(tagsJson, z.array(z.string()), []);
}

// Stringify tags for JSON storage
export function stringifyTagsToJSON(tags: string[]): string {
  return stringifyJsonField(tags) || '[]';
}

// Parse dimensions from JSON string
export function parseDimensionsFromJSON(dimensionsJson: string | null): Dimensions | null {
  if (!dimensionsJson) return null;
  
  const DimensionsSchema = z.object({
    length: z.number(),
    width: z.number(),
    height: z.number(),
  });
  
  return parseJsonField(dimensionsJson, DimensionsSchema, null);
}

// Stringify dimensions for JSON storage
export function stringifyDimensionsToJSON(dimensions: Dimensions | null): string | null {
  return stringifyJsonField(dimensions);
}
