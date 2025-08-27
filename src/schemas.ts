import { z } from "zod";

export const TaskSchema = z.object({
  id: z.string().uuid(),
  description: z.string().min(1),
  completed: z.boolean(),
  dueDate: z.string().datetime().optional(),
  priority: z.enum(["low", "medium", "high", "urgent"]),
  category: z.enum(["customer", "shipment", "follow-up", "general"]),
  customerId: z.string().uuid().optional(),
  shipmentId: z.string().uuid().optional(),
  createdAt: z.string().datetime(),
});

export const CustomerSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1),
  email: z.string().email(),
  phone: z.string().optional(),
  company: z.string().optional(),
  address: z.string().min(1),
  city: z.string().min(1),
  state: z.string().min(1),
  zipCode: z.string().min(1),
  country: z.string().min(1),
  needsAttention: z.boolean(),
  lastContactDate: z.string().datetime().optional(),
  totalOrders: z.number().int().nonnegative(),
  totalSpent: z.number().nonnegative(),
  preferredCarrier: z.string().optional(),
  notes: z.string().optional(),
  createdAt: z.string().datetime(),
  birthday: z.string().optional(),
  website: z.string().url().optional(),
  tags: z.array(z.string()).optional(),
  industry: z.string().optional(),
  vatNumber: z.string().optional(),
  contacts: z.array(z.object({
    name: z.string(),
    email: z.string().email().optional(),
    phone: z.string().optional(),
    role: z.string().optional(),
  })).optional(),
});

export const ShipmentSchema = z.object({
  id: z.string().uuid(),
  trackingNumber: z.string().min(1),
  status: z.enum(["pending", "processing", "shipped", "in-transit", "delivered", "exception"]),
  customerId: z.string().uuid(),
  orderNumber: z.string().min(1),
  items: z.string().min(1),
  shipDate: z.string().datetime().optional(),
  estimatedDelivery: z.string().datetime().optional(),
  actualDelivery: z.string().datetime().optional(),
  carrier: z.string().min(1),
  cost: z.number().nonnegative(),
  weight: z.number().nonnegative().optional(),
  notes: z.string().optional(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export const OrderItemSchema = z.object({
  sku: z.string().min(1),
  name: z.string().min(1),
  quantity: z.number().int().positive(),
  price: z.number().nonnegative(),
});

export const OrderSchema = z.object({
  id: z.string().uuid(),
  customerId: z.string().uuid(),
  orderNumber: z.string().min(1),
  status: z.enum(["pending", "processing", "shipped", "delivered", "cancelled"]),
  items: z.array(OrderItemSchema),
  subtotal: z.number().nonnegative(),
  tax: z.number().nonnegative(),
  shipping: z.number().nonnegative(),
  total: z.number().nonnegative(),
  orderDate: z.string().datetime(),
  shipmentId: z.string().uuid().optional(),
  notes: z.string().optional(),
});
