import { addTask, getTasks, getUrgentTasks, searchTasks } from "./TaskManager.js";
import { addCustomer, getCustomers, getCustomersNeedingAttention, searchCustomers } from "./CustomerManager.js";
import { addShipment, getShipments, updateShipmentStatus, searchShipments } from "./ShipmentManager.js";
import { generateDailyReport, getPersonalizedDailyTasks } from "./Dashboard.js";
// CLI Utility Functions for easy interaction with the system
export class ShipmentManagerCLI {
    // Quick task operations
    static quickAddTask(description, priority = "medium") {
        const task = addTask(description, priority);
        console.log(`✅ Task created: ${task.description} (${task.priority} priority)`);
        return task;
    }
    static showUrgentTasks() {
        const urgent = getUrgentTasks();
        if (urgent.length === 0) {
            console.log("🎉 No urgent tasks!");
            return;
        }
        console.log("🔥 URGENT TASKS:");
        urgent.forEach((task, index) => {
            console.log(`  ${index + 1}. ${task.description}`);
        });
    }
    static showDailyOverview() {
        console.log(generateDailyReport());
    }
    static showMyTasks() {
        const tasks = getPersonalizedDailyTasks();
        console.log("🎯 YOUR DAILY TASKS OVERVIEW");
        console.log("=".repeat(35));
        if (tasks.urgent.length > 0) {
            console.log(`\n🔥 Urgent: ${tasks.urgent.length} tasks`);
        }
        if (tasks.overdue.length > 0) {
            console.log(`⏰ Overdue: ${tasks.overdue.length} tasks`);
        }
        if (tasks.today.length > 0) {
            console.log(`📅 Due Today: ${tasks.today.length} tasks`);
        }
        if (tasks.customerFollowUps.length > 0) {
            console.log(`👥 Customer Follow-ups: ${tasks.customerFollowUps.length} tasks`);
        }
        if (tasks.shipmentTasks.length > 0) {
            console.log(`📦 Shipment Tasks: ${tasks.shipmentTasks.length} tasks`);
        }
    }
    // Quick customer operations
    static quickAddCustomer(name, email, company) {
        const customer = addCustomer({
            name,
            email,
            ...(company && { company }),
            address: "TBD",
            city: "TBD",
            state: "TBD",
            zipCode: "TBD",
            country: "TBD",
            needsAttention: false
        });
        console.log(`✅ Customer created: ${customer.name} (${customer.email})`);
        return customer;
    }
    static showCustomersNeedingAttention() {
        const customers = getCustomersNeedingAttention();
        if (customers.length === 0) {
            console.log("🎉 All customers are up to date!");
            return;
        }
        console.log("⚠️  CUSTOMERS NEEDING ATTENTION:");
        customers.forEach((customer, index) => {
            console.log(`  ${index + 1}. ${customer.name} (${customer.email}) - ${customer.company || 'No company'}`);
        });
    }
    // Quick shipment operations  
    static quickAddShipment(trackingNumber, customerId, orderNumber) {
        const shipment = addShipment({
            trackingNumber,
            status: "pending",
            customerId,
            orderNumber,
            items: "TBD",
            carrier: "TBD",
            cost: 0
        });
        console.log(`✅ Shipment created: ${shipment.trackingNumber} for order ${shipment.orderNumber}`);
        return shipment;
    }
    static quickUpdateShipmentStatus(trackingNumber, status) {
        const shipments = getShipments();
        const shipment = shipments.find(s => s.trackingNumber === trackingNumber);
        if (!shipment) {
            console.log(`❌ Shipment not found: ${trackingNumber}`);
            return false;
        }
        const success = updateShipmentStatus(shipment.id, status);
        if (success) {
            console.log(`✅ Shipment ${trackingNumber} status updated to: ${status}`);
        }
        else {
            console.log(`❌ Failed to update shipment: ${trackingNumber}`);
        }
        return success;
    }
    // Search operations
    static searchEverything(query) {
        console.log(`🔍 SEARCH RESULTS FOR: "${query}"`);
        console.log("=".repeat(40));
        const tasks = searchTasks(query);
        const customers = searchCustomers(query);
        const shipments = searchShipments(query);
        if (tasks.length > 0) {
            console.log(`\n📋 Tasks (${tasks.length}):`);
            tasks.forEach(task => {
                console.log(`  • ${task.description} (${task.priority})`);
            });
        }
        if (customers.length > 0) {
            console.log(`\n👥 Customers (${customers.length}):`);
            customers.forEach(customer => {
                console.log(`  • ${customer.name} - ${customer.email}`);
            });
        }
        if (shipments.length > 0) {
            console.log(`\n📦 Shipments (${shipments.length}):`);
            shipments.forEach(shipment => {
                console.log(`  • ${shipment.trackingNumber} - ${shipment.status}`);
            });
        }
        if (tasks.length === 0 && customers.length === 0 && shipments.length === 0) {
            console.log("No results found.");
        }
    }
    // Show statistics
    static showStats() {
        const allTasks = getTasks();
        const allCustomers = getCustomers();
        const allShipments = getShipments();
        console.log("📊 SYSTEM STATISTICS");
        console.log("=".repeat(25));
        console.log(`📋 Total Tasks: ${allTasks.length}`);
        console.log(`   • Completed: ${allTasks.filter(t => t.completed).length}`);
        console.log(`   • Pending: ${allTasks.filter(t => !t.completed).length}`);
        console.log(`   • Urgent: ${allTasks.filter(t => t.priority === 'urgent' && !t.completed).length}`);
        console.log(`\n👥 Total Customers: ${allCustomers.length}`);
        console.log(`   • Need Attention: ${allCustomers.filter(c => c.needsAttention).length}`);
        console.log(`   • Total Revenue: $${allCustomers.reduce((sum, c) => sum + c.totalSpent, 0).toFixed(2)}`);
        console.log(`\n📦 Total Shipments: ${allShipments.length}`);
        console.log(`   • Pending: ${allShipments.filter(s => s.status === 'pending').length}`);
        console.log(`   • In Transit: ${allShipments.filter(s => ['shipped', 'in-transit'].includes(s.status)).length}`);
        console.log(`   • Delivered: ${allShipments.filter(s => s.status === 'delivered').length}`);
    }
}
// Export convenience functions
export const cli = ShipmentManagerCLI;
//# sourceMappingURL=CLI.js.map