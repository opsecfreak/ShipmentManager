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
    tags: customerData.tags || [],
    contacts: customerData.contacts || [],
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
    customer.phone?.includes(query) ||
    customer.country?.toLowerCase().includes(lowerQuery) ||
    customer.industry?.toLowerCase().includes(lowerQuery) ||
    (customer.tags && customer.tags.some(tag => tag.toLowerCase().includes(lowerQuery))) ||
    (customer.contacts && customer.contacts.some(contact =>
      contact.name.toLowerCase().includes(lowerQuery) ||
      contact.email?.toLowerCase().includes(lowerQuery) ||
      contact.phone?.includes(query) ||
      contact.role?.toLowerCase().includes(lowerQuery)
    ))
  );
}

// Advanced filtering
export function filterCustomersByTag(tag: string): Customer[] {
  return getCustomers().filter(c => c.tags && c.tags.includes(tag));
}

export function filterCustomersByIndustry(industry: string): Customer[] {
  return getCustomers().filter(c => c.industry === industry);
}

export function filterCustomersByCountry(country: string): Customer[] {
  return getCustomers().filter(c => c.country === country);
}

export function addTagToCustomer(id: string, tag: string): boolean {
  const customer = getCustomerById(id);
  if (!customer) return false;
  const tags = customer.tags || [];
  if (!tags.includes(tag)) tags.push(tag);
  return updateCustomer(id, { tags });
}

export function removeTagFromCustomer(id: string, tag: string): boolean {
  const customer = getCustomerById(id);
  if (!customer || !customer.tags) return false;
  const tags = customer.tags.filter(t => t !== tag);
  return updateCustomer(id, { tags });
}

export function addContactToCustomer(id: string, contact: { name: string; email?: string; phone?: string; role?: string }): boolean {
  const customer = getCustomerById(id);
  if (!customer) return false;
  const contacts = customer.contacts || [];
  contacts.push(contact);
  return updateCustomer(id, { contacts });
}

export function removeContactFromCustomer(id: string, contactName: string): boolean {
  const customer = getCustomerById(id);
  if (!customer || !customer.contacts) return false;
  const contacts = customer.contacts.filter(c => c.name !== contactName);
  return updateCustomer(id, { contacts });
}
