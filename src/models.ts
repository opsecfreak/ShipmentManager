// Re-export Prisma types for convenience
export {
  type Customer,
  type Contact,
  type Task,
  type Shipment,
  type Order,
  type OrderItem,
  Priority,
  TaskStatus,
  ShipmentStatus,
  OrderStatus,
} from '@prisma/client';

// Extended types for creating new records (without auto-generated fields)
export type CreateCustomer = {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
  website?: string;
  vatNumber?: string;
  industry?: string;
  tags?: string[];
  notes?: string;
};

export type CreateContact = {
  customerId: string;
  name: string;
  email?: string;
  phone?: string;
  role?: string;
  isPrimary?: boolean;
};

export type CreateTask = {
  title: string;
  description?: string;
  priority?: Priority;
  status?: TaskStatus;
  dueDate?: Date;
  assignedTo?: string;
  customerId?: string;
  shipmentId?: string;
  orderId?: string;
  tags?: string[];
  estimatedHours?: number;
  actualHours?: number;
};

export type CreateShipment = {
  trackingNumber: string;
  customerId: string;
  origin: string;
  destination: string;
  carrier: string;
  status?: ShipmentStatus;
  estimatedDelivery?: Date;
  actualDelivery?: Date;
  weight?: number;
  dimensions?: { length: number; width: number; height: number };
  value?: number;
  insurance?: number;
  notes?: string;
};

export type CreateOrder = {
  orderNumber: string;
  customerId: string;
  status?: OrderStatus;
  orderDate?: Date;
  dueDate?: Date;
  notes?: string;
};

export type CreateOrderItem = {
  orderId: string;
  productName: string;
  description?: string;
  quantity?: number;
  unitPrice?: number;
};

// Utility types for queries
export type CustomerWithRelations = Customer & {
  contacts: Contact[];
  tasks: Task[];
  shipments: Shipment[];
  orders: (Order & { items: OrderItem[] })[];
};

export type TaskWithRelations = Task & {
  customer: Customer | null;
  shipment: Shipment | null;
  order: Order | null;
};

export type ShipmentWithRelations = Shipment & {
  customer: Customer;
  tasks: Task[];
  orders: Order[];
};

export type OrderWithRelations = Order & {
  customer: Customer;
  items: OrderItem[];
  tasks: Task[];
  shipments: Shipment[];
};

export interface DashboardData {
  pendingShipments: number;
  urgentTasks: number;
  customersNeedingAttention: number;
  recentOrders: number;
  totalRevenue: number;
}

// Helper functions for working with JSON fields
export function parseTagsFromJSON(tagsJson: string | string[]): string[] {
  if (Array.isArray(tagsJson)) return tagsJson;
  if (typeof tagsJson === 'string' && tagsJson) {
    try {
      return JSON.parse(tagsJson);
    } catch {
      return [tagsJson];
    }
  }
  return [];
}

export function stringifyTagsToJSON(tags: string[]): string {
  return JSON.stringify(tags);
}

export function parseDimensionsFromJSON(dimensionsJson: string | null): { length: number; width: number; height: number } | null {
  if (!dimensionsJson) return null;
  try {
    return JSON.parse(dimensionsJson);
  } catch {
    return null;
  }
}

export function stringifyDimensionsToJSON(dimensions: { length: number; width: number; height: number }): string {
  return JSON.stringify(dimensions);
}
