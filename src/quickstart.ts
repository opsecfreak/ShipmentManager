import { DataUtils } from "./DataUtils.js";

// 🎯 QUICK START GUIDE FOR SHIPMENTMANAGER
console.log("🎯 SHIPMENTMANAGER QUICK START GUIDE");
console.log("=" .repeat(45));

console.log(`
📋 ESSENTIAL COMMANDS:

1. 📊 VIEW DASHBOARD
   cli.showDailyOverview()     - Complete daily report
   cli.showStats()             - System statistics  
   cli.showMyTasks()           - Your personalized tasks

2. ⚡ QUICK ACTIONS
   cli.quickAddTask("Task description", "priority")
   cli.quickAddCustomer("Name", "email@domain.com", "Company")
   cli.quickUpdateShipmentStatus("tracking#", "status")

3. 🔍 SEARCH & FIND
   cli.searchEverything("query")        - Search across all data
   cli.showUrgentTasks()                - See urgent tasks
   cli.showCustomersNeedingAttention()  - Customers to contact

4. 💾 DATA MANAGEMENT
   DataUtils.backupData()               - Backup all data
   DataUtils.exportToJSON()             - Export to JSON
   DataUtils.getDataStats()             - View data statistics

📝 TASK PRIORITIES:
   • "urgent" - Needs immediate attention
   • "high"   - Important, do today
   • "medium" - Normal priority (default)
   • "low"    - When you have time

📦 SHIPMENT STATUSES:
   • "pending"    - Ready to ship
   • "processing" - Being prepared
   • "shipped"    - In transit
   • "delivered"  - Completed
   • "exception"  - Issue occurred

🎯 TASK CATEGORIES:
   • "customer"   - Customer-related tasks
   • "shipment"   - Shipping tasks
   • "follow-up"  - Follow-up calls/emails
   • "general"    - Other business tasks

💡 TIPS:
   • Run 'npm start' each morning for daily overview
   • Use 'npm run demo' to see quick operations
   • All data is stored in src/data/ as CSV files
   • Backup regularly with DataUtils.backupData()
   • Link tasks to customers/shipments for better tracking

🚀 GET STARTED:
   1. Run this guide: npm run quickstart
   2. Try the demo: npm run demo  
   3. View full system: npm start
`);

// Show current system status
console.log("\n📊 CURRENT SYSTEM STATUS:");
DataUtils.getDataStats();

console.log("\n🎉 You're ready to manage your business with ShipmentManager!");
console.log("💬 Need help? Check the README.md file for complete documentation.");
