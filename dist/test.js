import { addCustomer, getCustomers } from "./CustomerManager.js";
import { addTask, getTasks } from "./TaskManager.js";
import { addShipment, getShipments } from "./ShipmentManager.js";
import { generateDailyReport } from "./Dashboard.js";
// Simple test to verify everything works
console.log("🧪 Running basic functionality test...");
try {
    // Test customer creation
    const testCustomer = addCustomer({
        name: "Test Customer",
        email: "test@example.com",
        phone: "555-1234",
        company: "Test Company",
        address: "123 Test St",
        city: "Test City",
        state: "TS",
        zipCode: "12345",
        country: "USA",
        needsAttention: false,
        industry: "Technology",
        tags: ["test", "vip"]
    });
    console.log("✅ Customer creation: SUCCESS");
    // Test task creation
    addTask("Test task for customer", "medium", "customer", new Date().toISOString(), testCustomer.id);
    console.log("✅ Task creation: SUCCESS");
    // Test shipment creation
    addShipment({
        trackingNumber: "TEST123456",
        status: "pending",
        customerId: testCustomer.id,
        orderNumber: "TEST-ORDER-001",
        items: "Test Item (1)",
        carrier: "Test Carrier",
        cost: 10.00,
        estimatedDelivery: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString()
    });
    console.log("✅ Shipment creation: SUCCESS");
    // Test dashboard generation
    generateDailyReport();
    console.log("✅ Dashboard generation: SUCCESS");
    console.log("\n📊 Current System Status:");
    console.log(`Customers: ${getCustomers().length}`);
    console.log(`Tasks: ${getTasks().length}`);
    console.log(`Shipments: ${getShipments().length}`);
    console.log("\n🎉 All tests passed! The system is working correctly.");
}
catch (error) {
    console.error("❌ Test failed:", error);
    process.exit(1);
}
//# sourceMappingURL=test.js.map