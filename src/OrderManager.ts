import { readCSV, writeCSV, updateCSV, deleteFromCSV } from "./db.js";
import { Order } from "./models.js";
import { v4 as uuidv4 } from "uuid";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ORDERS_FILE = path.join(__dirname, "data", "orders.csv");

export function getOrders(): Order[] {
  return readCSV<Order>(ORDERS_FILE);
}

export function getOrderById(id: string): Order | undefined {
  return getOrders().find(order => order.id === id);
}

export function getOrdersByCustomer(customerId: string): Order[] {
  return getOrders().filter(order => order.customerId === customerId);
}

export function getOrdersByStatus(status: Order["status"]): Order[] {
  return getOrders().filter(order => order.status === status);
}

export function getRecentOrders(days: number = 7): Order[] {
  const cutoffDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
  return getOrders().filter(order => new Date(order.orderDate) >= cutoffDate);
}

export function addOrder(orderData: Omit<Order, "id">): Order {
  const order: Order = {
    ...orderData,
    id: uuidv4(),
  };
  
  const orders = getOrders();
  orders.push(order);
  writeCSV(ORDERS_FILE, orders);
  return order;
}

export function updateOrder(id: string, updates: Partial<Order>): boolean {
  return updateCSV(ORDERS_FILE, id, updates);
}

export function updateOrderStatus(id: string, status: Order["status"]): boolean {
  return updateOrder(id, { status });
}

export function linkOrderToShipment(orderId: string, shipmentId: string): boolean {
  return updateOrder(orderId, { shipmentId });
}

export function deleteOrder(id: string): boolean {
  return deleteFromCSV(ORDERS_FILE, id);
}

export function searchOrders(query: string): Order[] {
  const orders = getOrders();
  const lowerQuery = query.toLowerCase();
  
  return orders.filter(order => 
    order.orderNumber.toLowerCase().includes(lowerQuery) ||
    order.items.some(item => item.name.toLowerCase().includes(lowerQuery) || item.sku.toLowerCase().includes(lowerQuery))
  );
}

export function getOrdersByDateRange(startDate: string, endDate: string): Order[] {
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  return getOrders().filter(order => {
    const orderDate = new Date(order.orderDate);
    return orderDate >= start && orderDate <= end;
  });
}

export function getTotalRevenue(days?: number): number {
  let orders = getOrders().filter(order => order.status !== "cancelled");
  
  if (days) {
    const cutoffDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
    orders = orders.filter(order => new Date(order.orderDate) >= cutoffDate);
  }
  
  return orders.reduce((total, order) => total + order.total, 0);
}
