import { cli } from "./CLI.js";

// 🎮 DEMO: Quick ShipmentManager Operations
console.log("🎮 SHIPMENTMANAGER DEMO");
console.log("=" .repeat(30));

// Show current stats
console.log("\n📊 Current System Status:");
cli.showStats();

// Show daily overview  
console.log("\n📋 Daily Overview:");
cli.showMyTasks();

// Quick search demo
console.log("\n🔍 Search Demo:");
cli.searchEverything("tech");

// Show urgent items
console.log("\n🔥 Urgent Items:");
cli.showUrgentTasks();

// Show customers needing attention
console.log("\n👥 Customer Attention:");
cli.showCustomersNeedingAttention();

console.log("\n🎉 Demo complete! Use the CLI class for quick operations.");
console.log("💡 Try: cli.quickAddTask('Your task here', 'urgent')");
