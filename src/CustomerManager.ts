import { readCSV, writeCSV, updateCSV, deleteFromCSV } from "./db.js";
import { Customer } from "./models.js";
import { v4 as uuidv4 } from "uuid";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const CUSTOMERS_FILE = path.join(__dirname, "data", "customers.csv");

export function getCustomers(): Customer[] {
  return readCSV<Customer>(CUSTOMERS_FILE);
}

export function getCustomerById(id: string): Customer | undefined {
  return getCustomers().find(customer => customer.id === id);
}

export function getCustomersNeedingAttention(): Customer[] {
  return getCustomers().filter(customer => customer.needsAttention);
}

export function addCustomer(customerData: Omit<Customer, "id" | "createdAt" | "totalOrders" | "totalSpent">): Customer {
  const customer: Customer = {
    ...customerData,
    id: uuidv4(),
    totalOrders: 0,
    totalSpent: 0,
    createdAt: new Date().toISOString(),
  };
  
  const customers = getCustomers();
  customers.push(customer);
  writeCSV(CUSTOMERS_FILE, customers);
  return customer;
}

export function updateCustomer(id: string, updates: Partial<Customer>): boolean {
  return updateCSV(CUSTOMERS_FILE, id, updates);
}

export function markCustomerNeedsAttention(id: string, needsAttention: boolean = true): boolean {
  return updateCustomer(id, { needsAttention, lastContactDate: new Date().toISOString() });
}

export function updateCustomerStats(customerId: string, orderValue: number): boolean {
  const customer = getCustomerById(customerId);
  if (!customer) return false;
  
  return updateCustomer(customerId, {
    totalOrders: customer.totalOrders + 1,
    totalSpent: customer.totalSpent + orderValue
  });
}

export function deleteCustomer(id: string): boolean {
  return deleteFromCSV(CUSTOMERS_FILE, id);
}

export function searchCustomers(query: string): Customer[] {
  const customers = getCustomers();
  const lowerQuery = query.toLowerCase();
  
  return customers.filter(customer => 
    customer.name.toLowerCase().includes(lowerQuery) ||
    customer.email.toLowerCase().includes(lowerQuery) ||
    customer.company?.toLowerCase().includes(lowerQuery) ||
    customer.phone?.includes(query)
  );
}
