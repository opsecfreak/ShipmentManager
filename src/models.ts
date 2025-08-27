export interface Task {
  id: string;
  description: string;
  completed: boolean;
  dueDate?: string;
  priority: "low" | "medium" | "high" | "urgent";
  category: "customer" | "shipment" | "follow-up" | "general";
  customerId?: string;
  shipmentId?: string;
  createdAt: string;
}

export interface Shipment {
  id: string;
  trackingNumber: string;
  status: "pending" | "processing" | "shipped" | "in-transit" | "delivered" | "exception";
  customerId: string;
  orderNumber: string;
  items: string;
  shipDate?: string;
  estimatedDelivery?: string;
  actualDelivery?: string;
  carrier: string;
  cost: number;
  weight?: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  needsAttention: boolean;
  lastContactDate?: string;
  totalOrders: number;
  totalSpent: number;
  preferredCarrier?: string;
  notes?: string;
  createdAt: string;
  birthday?: string;
  website?: string;
  tags?: string[];
  industry?: string;
  vatNumber?: string;
  contacts?: Array<{
    name: string;
    email?: string;
    phone?: string;
    role?: string;
  }>;
}

export interface Order {
  id: string;
  customerId: string;
  orderNumber: string;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  items: OrderItem[];
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
  orderDate: string;
  shipmentId?: string;
  notes?: string;
}

export interface OrderItem {
  sku: string;
  name: string;
  quantity: number;
  price: number;
}

export interface DashboardData {
  pendingShipments: number;
  urgentTasks: number;
  customersNeedingAttention: number;
  recentOrders: number;
  totalRevenue: number;
}
