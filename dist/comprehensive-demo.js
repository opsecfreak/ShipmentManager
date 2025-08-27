import { addCustomer, addTagToCustomer, addContactToCustomer, filterCustomersByTag, filterCustomersByIndustry } from "./CustomerManager.js";
import { addTask, getUrgentTasks } from "./TaskManager.js";
import { addShipment, updateShipmentStatus } from "./ShipmentManager.js";
import { addOrder, getTotalRevenue } from "./OrderManager.js";
import { generateDailyReport, getPersonalizedDailyTasks } from "./Dashboard.js";
import { validateCustomer, validateTask, validateShipment } from "./validation.js";
import { DataUtils } from "./DataUtils.js";
console.log("🚀 COMPLETE SHIPMENTMANAGER FUNCTIONALITY DEMO");
console.log("=".repeat(60));
try {
    // Clear any existing data for a fresh start
    console.log("\n🧹 Clearing existing data for demo...");
    DataUtils.clearAllData();
    console.log("✅ Starting with clean slate");
    // 1. Advanced Customer Management Demo
    console.log("\n👥 ADVANCED CUSTOMER MANAGEMENT");
    console.log("-".repeat(40));
    // Create customers with enhanced data
    const customer1 = addCustomer({
        name: "Tech Innovators Inc",
        email: "contact@techinnovators.com",
        phone: "+1-555-0100",
        company: "Tech Innovators Inc",
        address: "123 Innovation Drive, Suite 400",
        city: "San Francisco",
        state: "CA",
        zipCode: "94105",
        country: "USA",
        needsAttention: false,
        industry: "Technology",
        website: "https://techinnovators.com",
        vatNumber: "US123456789",
        birthday: "2020-03-15",
        tags: ["enterprise", "tech", "high-value"],
        notes: "Large enterprise client with recurring orders"
    });
    const customer2 = addCustomer({
        name: "Sarah's Marketing Agency",
        email: "sarah@marketingpro.com",
        phone: "+1-555-0200",
        company: "Marketing Pro Solutions",
        address: "456 Creative Street",
        city: "Austin",
        state: "TX",
        zipCode: "73301",
        country: "USA",
        needsAttention: true,
        industry: "Marketing",
        website: "https://marketingpro.com",
        tags: ["agency", "marketing", "needs-follow-up"],
        notes: "Payment overdue, needs immediate attention"
    });
    console.log(`✅ Created customer: ${customer1.name}`);
    console.log(`✅ Created customer: ${customer2.name}`);
    // Add contacts to customers
    addContactToCustomer(customer1.id, {
        name: "John Smith",
        email: "john@techinnovators.com",
        phone: "+1-555-0101",
        role: "CTO"
    });
    addContactToCustomer(customer1.id, {
        name: "Alice Johnson",
        email: "alice@techinnovators.com",
        phone: "+1-555-0102",
        role: "Procurement Manager"
    });
    addContactToCustomer(customer2.id, {
        name: "Sarah Williams",
        email: "sarah@marketingpro.com",
        phone: "+1-555-0201",
        role: "Owner"
    });
    console.log("✅ Added customer contacts");
    // Add more tags
    addTagToCustomer(customer1.id, "priority");
    addTagToCustomer(customer2.id, "urgent");
    console.log("✅ Added customer tags");
    // 2. Advanced Task Management
    console.log("\n📋 ADVANCED TASK MANAGEMENT");
    console.log("-".repeat(40));
    const urgentTask = addTask("Contact Sarah's Marketing Agency about overdue payment", "urgent", "customer", new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(), // Due in 2 hours
    customer2.id);
    const shipmentTask = addTask("Prepare bulk order for Tech Innovators", "high", "shipment", new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // Due tomorrow
    customer1.id);
    const followUpTask = addTask("Schedule quarterly business review with Tech Innovators", "medium", "follow-up", new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // Due in a week
    customer1.id);
    console.log(`✅ Created urgent task: ${urgentTask.description}`);
    console.log(`✅ Created shipment task: ${shipmentTask.description}`);
    console.log(`✅ Created follow-up task: ${followUpTask.description}`);
    // 3. Order Management
    console.log("\n📦 ORDER MANAGEMENT");
    console.log("-".repeat(30));
    const order1 = addOrder({
        customerId: customer1.id,
        orderNumber: "ORD-2025-TI-001",
        status: "processing",
        items: [
            { sku: "LAPTOP-PRO-15", name: "Professional Laptop 15\"", quantity: 10, price: 1299.99 },
            { sku: "MOUSE-WIRELESS", name: "Wireless Mouse", quantity: 10, price: 49.99 },
            { sku: "KEYBOARD-MECH", name: "Mechanical Keyboard", quantity: 10, price: 129.99 }
        ],
        subtotal: 14799.70,
        tax: 1183.98,
        shipping: 149.99,
        total: 16133.67,
        orderDate: new Date().toISOString(),
        notes: "Bulk order for new employee onboarding"
    });
    const order2 = addOrder({
        customerId: customer2.id,
        orderNumber: "ORD-2025-MP-001",
        status: "pending",
        items: [
            { sku: "CAM-4K-PRO", name: "4K Professional Camera", quantity: 2, price: 899.99 },
            { sku: "MIC-STUDIO", name: "Studio Microphone", quantity: 2, price: 199.99 }
        ],
        subtotal: 2199.96,
        tax: 175.99,
        shipping: 29.99,
        total: 2405.94,
        orderDate: new Date().toISOString(),
        notes: "Equipment for content creation"
    });
    console.log(`✅ Created order: ${order1.orderNumber} ($${order1.total})`);
    console.log(`✅ Created order: ${order2.orderNumber} ($${order2.total})`);
    // 4. Shipment Tracking
    console.log("\n🚚 SHIPMENT TRACKING");
    console.log("-".repeat(30));
    const shipment1 = addShipment({
        trackingNumber: "1Z999AA1234567890",
        status: "processing",
        customerId: customer1.id,
        orderNumber: order1.orderNumber,
        items: "Laptops (10), Mice (10), Keyboards (10)",
        carrier: "UPS",
        cost: 149.99,
        weight: 35.5,
        estimatedDelivery: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
        notes: "Fragile - Handle with care. Business delivery required."
    });
    const shipment2 = addShipment({
        trackingNumber: "1Z888BB9876543210",
        status: "pending",
        customerId: customer2.id,
        orderNumber: order2.orderNumber,
        items: "Cameras (2), Microphones (2)",
        carrier: "FedEx",
        cost: 29.99,
        weight: 8.2,
        estimatedDelivery: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
        notes: "Signature required upon delivery"
    });
    console.log(`✅ Created shipment: ${shipment1.trackingNumber} (${shipment1.status})`);
    console.log(`✅ Created shipment: ${shipment2.trackingNumber} (${shipment2.status})`);
    // Update shipment status
    updateShipmentStatus(shipment1.id, "shipped", "Package picked up and in transit");
    console.log(`✅ Updated ${shipment1.trackingNumber} to 'shipped'`);
    // 5. Data Validation Demo
    console.log("\n🔍 DATA VALIDATION WITH ZOD");
    console.log("-".repeat(35));
    try {
        validateCustomer(customer1);
        console.log("✅ Customer validation passed");
        validateTask(urgentTask);
        console.log("✅ Task validation passed");
        validateShipment(shipment1);
        console.log("✅ Shipment validation passed");
    }
    catch (error) {
        console.log("❌ Validation error:", error);
    }
    // 6. Advanced Search and Filtering
    console.log("\n🔍 ADVANCED SEARCH & FILTERING");
    console.log("-".repeat(40));
    const techCustomers = filterCustomersByIndustry("Technology");
    console.log(`🏢 Technology industry customers: ${techCustomers.length}`);
    const enterpriseCustomers = filterCustomersByTag("enterprise");
    console.log(`🏷️  Enterprise tagged customers: ${enterpriseCustomers.length}`);
    const urgentTasks = getUrgentTasks();
    console.log(`🔥 Urgent tasks: ${urgentTasks.length}`);
    // 7. Business Intelligence Dashboard
    console.log("\n📊 BUSINESS INTELLIGENCE DASHBOARD");
    console.log("-".repeat(45));
    const totalRevenue = getTotalRevenue();
    console.log(`💰 Total Revenue: $${totalRevenue.toFixed(2)}`);
    const taskBreakdown = getPersonalizedDailyTasks();
    console.log(`📋 Task Breakdown:`);
    console.log(`   • Urgent: ${taskBreakdown.urgent.length}`);
    console.log(`   • Customer Follow-ups: ${taskBreakdown.customerFollowUps.length}`);
    console.log(`   • Shipment Tasks: ${taskBreakdown.shipmentTasks.length}`);
    console.log(`   • Overdue: ${taskBreakdown.overdue.length}`);
    console.log(`   • Due Today: ${taskBreakdown.today.length}`);
    // 8. Generate comprehensive report
    console.log("\n📋 DAILY BUSINESS REPORT");
    console.log("-".repeat(35));
    console.log(generateDailyReport());
    // 9. Data Management
    console.log("\n💾 DATA MANAGEMENT");
    console.log("-".repeat(25));
    console.log("📊 Current Data Statistics:");
    DataUtils.getDataStats();
    const backupPath = DataUtils.backupData();
    console.log(`📦 Data backed up to: ${backupPath}`);
    const exportPath = DataUtils.exportToJSON();
    console.log(`📄 Data exported to: ${exportPath}`);
    console.log("\n🎉 DEMO COMPLETED SUCCESSFULLY!");
    console.log("\n📝 Summary of Features Demonstrated:");
    console.log("✅ Advanced customer management with tags, contacts, and industry tracking");
    console.log("✅ Comprehensive task management with priorities and categories");
    console.log("✅ Order processing with multiple items and calculations");
    console.log("✅ Shipment tracking with status updates and carrier information");
    console.log("✅ Data validation using Zod schemas");
    console.log("✅ Advanced search and filtering capabilities");
    console.log("✅ Business intelligence dashboard with metrics");
    console.log("✅ Automated reporting and data export");
    console.log("✅ Data backup and management utilities");
    console.log("\n🚀 Your ShipmentManager system is fully operational!");
    console.log("💡 Use the CLI module for quick daily operations:");
    console.log("   • cli.showDailyOverview()");
    console.log("   • cli.quickAddTask('description', 'priority')");
    console.log("   • cli.searchEverything('query')");
}
catch (error) {
    console.error("❌ Demo failed with error:", error);
    console.error("\n🔧 Troubleshooting tips:");
    console.error("1. Ensure all dependencies are installed (npm install)");
    console.error("2. Check that the src/data directory is writable");
    console.error("3. Verify TypeScript configuration is correct");
    console.error("4. Check for any syntax errors in the code");
    // Show the exact error details
    if (error instanceof Error) {
        console.error("\n📋 Error Details:");
        console.error(`Name: ${error.name}`);
        console.error(`Message: ${error.message}`);
        if (error.stack) {
            console.error(`Stack: ${error.stack}`);
        }
    }
    process.exit(1);
}
//# sourceMappingURL=comprehensive-demo.js.map