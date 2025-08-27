export interface Task {
  id: string;
  description: string;
  completed: boolean;
  dueDate?: string;
}

export interface Shipment {
  id: string;
  trackingNumber: string;
  status: "pending" | "shipped" | "delivered";
  customerId: string;
  date: string;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  needsAttention: boolean;
}
