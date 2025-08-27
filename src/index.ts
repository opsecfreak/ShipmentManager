import { addTask, getTasks, createCustomerFollowUpTask } from "./TaskManager.js";
import { addCustomer, getCustomers } from "./CustomerManager.js";
import { addShipment, getShipments } from "./ShipmentManager.js";
import { addOrder } from "./OrderManager.js";
import { generateDailyReport, getPersonalizedDailyTasks, getAttentionItems } from "./Dashboard.js";
import prisma from "./db.js";

// Main async function to handle all operations
async function main() {
  // 🚀 ShipmentManager - Complete Business Management System
  console.log("🚀 ShipmentManager - Complete Business Management System");
  console.log("=" .repeat(60));
  
  try {
    // Create sample data to demonstrate the system
    console.log("\n📊 Setting up sample data...");
    
    // Add sample customers
    const customer1 = await addCustomer({
      name: "John Smith",
      email: "john@techcorp.com",
      phone: "555-0123",
      company: "TechCorp Solutions",
      address: "123 Business Ave",
      city: "San Francisco",
      state: "CA",
      zipCode: "94105",
      country: "USA",
      tags: ["vip", "tech-industry"]
    });
    
    const customer2 = await addCustomer({
      name: "Sarah Johnson",
      email: "sarah@innovate.com",
      phone: "555-0456",
      company: "Innovate Inc",
      address: "456 Innovation Dr",
      city: "Austin",
      state: "TX",
      zipCode: "73301",
      country: "USA",
      tags: ["needs-attention"]
    });
    
    // Add sample orders
    const order1 = await addOrder({
      customerId: customer1.id,
      orderNumber: "ORD-2025-001",
      status: "PENDING",
      totalAmount: 403.75,
      orderDate: new Date(),
      notes: "Priority shipping requested",
      items: []
    });
    
    // We need to add items after order creation since they require the orderId
    await prisma.orderItem.createMany({
      data: [
        { 
          orderId: order1.id,
          productName: "Wireless Headphones", 
          quantity: 2, 
          unitPrice: 149.99,
          totalPrice: 299.98, 
          description: "Premium noise-cancelling" 
        },
        {
          orderId: order1.id, 
          productName: "USB-C Cable", 
          quantity: 3, 
          unitPrice: 19.99,
          totalPrice: 59.97, 
          description: "Fast charging" 
        }
      ]
    });
    
    const order2 = await addOrder({
      customerId: customer2.id,
      orderNumber: "ORD-2025-002",
      status: "PROCESSING",
      totalAmount: 107.19,
      orderDate: new Date(),
      items: []
    });
    
    // Add item after order creation
    await prisma.orderItem.create({
      data: { 
        orderId: order2.id,
        productName: "Bluetooth Speaker", 
        quantity: 1, 
        unitPrice: 89.99,
        totalPrice: 89.99, 
        description: "Waterproof model" 
      }
    });
    
    // Add sample shipments
    const shipment1 = await addShipment({
      trackingNumber: "TRK123456789",
      status: "PENDING",
      customerId: customer1.id,
      origin: "Warehouse #4",
      destination: "123 Business Ave, San Francisco, CA 94105",
      carrier: "FedEx",
      weight: 2.5,
      value: 403.75,
      insurance: 500,
      estimatedDelivery: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
      notes: "Handle with care - fragile electronics"
    });
    
    await addShipment({
      trackingNumber: "TRK987654321",
      status: "IN_TRANSIT",
      customerId: customer2.id,
      origin: "Warehouse #2",
      destination: "456 Innovation Dr, Austin, TX 73301",
      carrier: "UPS",
      weight: 1.0,
      value: 107.19,
      estimatedDelivery: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000) // 2 days from now
    });
    
    // Link orders to shipments
    await prisma.order.update({
      where: { id: order1.id },
      data: {
        shipments: {
          connect: { id: shipment1.id }
        }
      }
    });
    
    // Add sample tasks
    await addTask({
      title: "Follow up with TechCorp Solutions on order status",
      priority: "HIGH",
      description: "Call John Smith to confirm order requirements",
      status: "PENDING",
      dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000),
      customerId: customer1.id,
      tags: ["follow-up", "customer"]
    });
    
    await addTask({
      title: "Ship pending order ORD-2025-001",
      priority: "URGENT",
      description: "Package needs to be prepared and shipped today",
      status: "PENDING",
      dueDate: new Date(),
      shipmentId: shipment1.id,
      tags: ["shipment"]
    });
    
    await addTask({
      title: "Contact Innovate Inc about payment terms",
      priority: "MEDIUM",
      description: "Discuss new payment options for future orders",
      status: "PENDING",
      dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
      customerId: customer2.id,
      tags: ["follow-up"]
    });
    
    await addTask({
      title: "Update inventory system",
      priority: "LOW",
      description: "Sync inventory counts with warehouse",
      status: "PENDING",
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      tags: ["general"]
    });
    
    // Create a follow-up task automatically
    await createCustomerFollowUpTask(customer2.id, "Check satisfaction with recent order", 
                                new Date(Date.now() + 5 * 24 * 60 * 60 * 1000));
    
    console.log("✅ Sample data created successfully!");
    
    // Display dashboard and reports
    const report = await generateDailyReport();
    console.log("\n" + report);
    
    // Display personalized daily tasks
    console.log("\n🎯 YOUR PERSONALIZED DAILY TASKS");
    console.log("=" .repeat(40));
    
    const dailyTasks = await getPersonalizedDailyTasks();
    
    if (dailyTasks.urgent.length > 0) {
      console.log("\n🔥 URGENT TASKS:");
      dailyTasks.urgent.forEach((task: any) => {
        console.log(`  • ${task.title}`);
      });
    }
    
    if (dailyTasks.overdue.length > 0) {
      console.log("\n⏰ OVERDUE TASKS:");
      dailyTasks.overdue.forEach((task: any) => {
        console.log(`  • ${task.title} (Due: ${task.dueDate.toISOString().split('T')[0]})`);
      });
    }
    
    if (dailyTasks.today.length > 0) {
      console.log("\n📅 DUE TODAY:");
      dailyTasks.today.forEach((task: any) => {
        console.log(`  • ${task.title}`);
      });
    }
    
    if (dailyTasks.customerFollowUps.length > 0) {
      console.log("\n👥 CUSTOMER FOLLOW-UPS:");
      dailyTasks.customerFollowUps.forEach((task: any) => {
        console.log(`  • ${task.title}`);
      });
    }
    
    if (dailyTasks.shipmentTasks.length > 0) {
      console.log("\n📦 SHIPMENT TASKS:");
      dailyTasks.shipmentTasks.forEach((task: any) => {
        console.log(`  • ${task.title}`);
      });
    }
    
    // Display attention items
    console.log("\n⚠️  ITEMS REQUIRING IMMEDIATE ATTENTION");
    console.log("=" .repeat(45));
    
    const attentionItems = await getAttentionItems();
    
    if (attentionItems.customersNeedingAttention.length > 0) {
      console.log("\n👥 CUSTOMERS NEEDING ATTENTION:");
      attentionItems.customersNeedingAttention.forEach((customer: any) => {
        console.log(`  • ${customer.name} (${customer.email}) - ${customer.company || 'No company'}`);
      });
    }
    
    // Display summary tables
    console.log("\n📊 SYSTEM OVERVIEW");
    console.log("=" .repeat(30));
    
    const tasks = await getTasks();
    console.log("\n📋 All Tasks:");
    console.table(tasks.map((task: any) => ({
      Title: task.title.substring(0, 30) + (task.title.length > 30 ? '...' : ''),
      Priority: task.priority,
      Status: task.status,
      'Due Date': task.dueDate?.toISOString().split('T')[0] || 'No due date'
    })));
    
    const customers = await getCustomers();
    console.log("\n👥 All Customers:");
    console.table(customers.map((customer: any) => ({
      Name: customer.name,
      Company: customer.company || 'N/A',
      Email: customer.email,
      Tags: customer.tags?.join(", ") || '',
      Country: customer.country
    })));
    
    const shipments = await getShipments();
    console.log("\n🚚 All Shipments:");
    console.table(shipments.map((shipment: any) => ({
      'Tracking #': shipment.trackingNumber,
      Status: shipment.status,
      Carrier: shipment.carrier,
      Origin: shipment.origin,
      'Est. Delivery': shipment.estimatedDelivery?.toISOString().split('T')[0] || 'TBD'
    })));
    
    console.log("\n🎉 ShipmentManager is ready to help you manage your business!");
    console.log("💡 Tips:");
    console.log("  • Run `npm start` to see this overview anytime");
    console.log("  • Use the prisma client to access your database");
    console.log("  • Use the various Manager classes to programmatically manage your data");
    console.log("  • Customize the Dashboard to show the metrics that matter to you");
  } catch (error) {
    console.error("An error occurred:", error);
  } finally {
    // Close Prisma client connection
    await prisma.$disconnect();
  }
}

// Run the main function
main().catch(error => {
  console.error("Fatal error:", error);
  prisma.$disconnect();
});
