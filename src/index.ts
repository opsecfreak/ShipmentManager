import { addTask, getTasks, createCustomerFollowUpTask } from "./TaskManager.js";
import { addCustomer, getCustomers } from "./CustomerManager.js";
import { addShipment, getShipments } from "./ShipmentManager.js";
import { addOrder } from "./OrderManager.js";
import { generateDailyReport, getPersonalizedDailyTasks, getAttentionItems } from "./Dashboard.js";

// 🚀 ShipmentManager - Complete Business Management System
console.log("🚀 ShipmentManager - Complete Business Management System");
console.log("=" .repeat(60));

// Create sample data to demonstrate the system
console.log("\n� Setting up sample data...");

// Add sample customers
const customer1 = addCustomer({
  name: "John Smith",
  email: "john@techcorp.com",
  phone: "555-0123",
  company: "TechCorp Solutions",
  address: "123 Business Ave",
  city: "San Francisco",
  state: "CA",
  zipCode: "94105",
  needsAttention: false
});

const customer2 = addCustomer({
  name: "Sarah Johnson",
  email: "sarah@innovate.com",
  phone: "555-0456",
  company: "Innovate Inc",
  address: "456 Innovation Dr",
  city: "Austin",
  state: "TX",
  zipCode: "73301",
  needsAttention: true
});

// Add sample orders
const order1 = addOrder({
  customerId: customer1.id,
  orderNumber: "ORD-2025-001",
  status: "pending",
  items: [
    { sku: "SKU-001", name: "Wireless Headphones", quantity: 2, price: 149.99 },
    { sku: "SKU-002", name: "USB-C Cable", quantity: 3, price: 19.99 }
  ],
  subtotal: 359.95,
  tax: 28.80,
  shipping: 15.00,
  total: 403.75,
  orderDate: new Date().toISOString()
});

const order2 = addOrder({
  customerId: customer2.id,
  orderNumber: "ORD-2025-002",
  status: "processing",
  items: [
    { sku: "SKU-003", name: "Bluetooth Speaker", quantity: 1, price: 89.99 }
  ],
  subtotal: 89.99,
  tax: 7.20,
  shipping: 10.00,
  total: 107.19,
  orderDate: new Date().toISOString()
});

// Add sample shipments
const shipment1 = addShipment({
  trackingNumber: "TRK123456789",
  status: "pending",
  customerId: customer1.id,
  orderNumber: order1.orderNumber,
  items: "Wireless Headphones (2), USB-C Cable (3)",
  carrier: "FedEx",
  cost: 15.00,
  weight: 2.5,
  estimatedDelivery: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days from now
  notes: "Handle with care - fragile electronics"
});

addShipment({
  trackingNumber: "TRK987654321",
  status: "shipped",
  customerId: customer2.id,
  orderNumber: order2.orderNumber,
  items: "Bluetooth Speaker (1)",
  carrier: "UPS",
  cost: 10.00,
  weight: 1.0,
  shipDate: new Date().toISOString(),
  estimatedDelivery: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString() // 2 days from now
});

// Add sample tasks
addTask("Follow up with TechCorp Solutions on order status", "high", "customer", 
        new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), customer1.id);

addTask("Ship pending order ORD-2025-001", "urgent", "shipment", 
        new Date().toISOString(), undefined, shipment1.id);

addTask("Contact Innovate Inc about payment terms", "medium", "follow-up", 
        new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(), customer2.id);

addTask("Update inventory system", "low", "general", 
        new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString());

// Create a follow-up task automatically
createCustomerFollowUpTask(customer2.id, "Check satisfaction with recent order", 
                          new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString());

console.log("✅ Sample data created successfully!");

// Display dashboard and reports
console.log("\n" + generateDailyReport());

// Display personalized daily tasks
console.log("\n🎯 YOUR PERSONALIZED DAILY TASKS");
console.log("=" .repeat(40));

const dailyTasks = getPersonalizedDailyTasks();

if (dailyTasks.urgent.length > 0) {
  console.log("\n🔥 URGENT TASKS:");
  dailyTasks.urgent.forEach(task => {
    console.log(`  • ${task.description}`);
  });
}

if (dailyTasks.overdue.length > 0) {
  console.log("\n⏰ OVERDUE TASKS:");
  dailyTasks.overdue.forEach(task => {
    console.log(`  • ${task.description} (Due: ${task.dueDate})`);
  });
}

if (dailyTasks.today.length > 0) {
  console.log("\n📅 DUE TODAY:");
  dailyTasks.today.forEach(task => {
    console.log(`  • ${task.description}`);
  });
}

if (dailyTasks.customerFollowUps.length > 0) {
  console.log("\n👥 CUSTOMER FOLLOW-UPS:");
  dailyTasks.customerFollowUps.forEach(task => {
    console.log(`  • ${task.description}`);
  });
}

if (dailyTasks.shipmentTasks.length > 0) {
  console.log("\n📦 SHIPMENT TASKS:");
  dailyTasks.shipmentTasks.forEach(task => {
    console.log(`  • ${task.description}`);
  });
}

// Display attention items
console.log("\n⚠️  ITEMS REQUIRING IMMEDIATE ATTENTION");
console.log("=" .repeat(45));

const attentionItems = getAttentionItems();

if (attentionItems.customersNeedingAttention.length > 0) {
  console.log("\n👥 CUSTOMERS NEEDING ATTENTION:");
  attentionItems.customersNeedingAttention.forEach(customer => {
    console.log(`  • ${customer.name} (${customer.email}) - ${customer.company || 'No company'}`);
  });
}

// Display summary tables
console.log("\n📊 SYSTEM OVERVIEW");
console.log("=" .repeat(30));

console.log("\n📋 All Tasks:");
console.table(getTasks().map(task => ({
  Description: task.description.substring(0, 30) + (task.description.length > 30 ? '...' : ''),
  Priority: task.priority,
  Category: task.category,
  Completed: task.completed ? '✅' : '❌',
  'Due Date': task.dueDate?.split('T')[0] || 'No due date'
})));

console.log("\n👥 All Customers:");
console.table(getCustomers().map(customer => ({
  Name: customer.name,
  Company: customer.company || 'N/A',
  Email: customer.email,
  'Needs Attention': customer.needsAttention ? '⚠️' : '✅',
  'Total Orders': customer.totalOrders,
  'Total Spent': `$${customer.totalSpent.toFixed(2)}`
})));

console.log("\n🚚 All Shipments:");
console.table(getShipments().map(shipment => ({
  'Tracking #': shipment.trackingNumber,
  Status: shipment.status,
  Carrier: shipment.carrier,
  'Order #': shipment.orderNumber,
  'Est. Delivery': shipment.estimatedDelivery?.split('T')[0] || 'TBD'
})));

console.log("\n🎉 ShipmentManager is ready to help you manage your business!");
console.log("💡 Tips:");
console.log("  • Run `npm start` to see this overview anytime");
console.log("  • Check the /src/data directory for your CSV databases");
console.log("  • Use the various Manager classes to programmatically manage your data");
console.log("  • Customize the Dashboard to show the metrics that matter to you");
