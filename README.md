# 🚀 ShipmentManager - Complete Business Management System

A comprehensive local business management system that helps you track shipments, manage customers, handle orders, and organize daily tasks. Built with TypeScript and CSV-based storage for simplicity and portability.

## ✨ Features

### 📋 Task Management
- Create personalized daily tasks with priorities (low, medium, high, urgent)
- Categorize tasks (customer, shipment, follow-up, general)
- Automatic overdue tracking
- Link tasks to customers and shipments
- Task search and filtering

### 👥 Customer Management
- Complete customer profiles with contact information
- Track customer attention status
- Automatic customer statistics (total orders, total spent)
- Customer search functionality
- Follow-up task automation

### 📦 Shipment Tracking
- Full shipment lifecycle management
- Multiple carriers support
- Real-time status updates
- Overdue shipment alerts
- Tracking number search
- Integration with orders and customers

### 📋 Order Management
- Complete order processing
- Multiple items per order
- Order status tracking
- Revenue calculations
- Order-to-shipment linking

### 📊 Dashboard & Reporting
- Daily business reports
- Personalized task recommendations
- Key performance indicators
- Attention items alerts
- Revenue tracking

## 🚀 Quick Start

### Installation
```bash
# Clone or create the project
npm install

# Run the application
npm start

# Or run in development mode with auto-reload
npm run dev
```

### First Run
The system will automatically create sample data to demonstrate all features:
- 2 sample customers
- 2 sample orders
- 2 sample shipments
- 5 sample tasks

## 📁 Data Storage

All data is stored in CSV files in the `src/data/` directory:
- `tasks.csv` - All tasks and to-dos
- `customers.csv` - Customer information
- `shipments.csv` - Shipment tracking data
- `orders.csv` - Order information

## 🛠️ Usage Examples

### Using the CLI Helper
```typescript
import { cli } from "./CLI.js";

// Quick operations
cli.quickAddTask("Follow up with customer", "high");
cli.quickAddCustomer("John Doe", "john@example.com", "ACME Corp");
cli.showDailyOverview();
cli.showUrgentTasks();
cli.searchEverything("invoice");
```

### Direct Manager Usage
```typescript
import { addTask, getTasks } from "./TaskManager.js";
import { addCustomer, getCustomersNeedingAttention } from "./CustomerManager.js";
import { addShipment, updateShipmentStatus } from "./ShipmentManager.js";

// Add a new task
const task = addTask(
  "Call customer about delivery", 
  "urgent", 
  "customer",
  "2025-08-28T10:00:00Z", // due date
  "customer-id-123"
);

// Add a new customer
const customer = addCustomer({
  name: "Jane Smith",
  email: "jane@company.com",
  phone: "555-0123",
  company: "Tech Solutions Inc",
  address: "123 Business St",
  city: "San Francisco",
  state: "CA",
  zipCode: "94105",
  needsAttention: false
});

// Create and track a shipment
const shipment = addShipment({
  trackingNumber: "1Z999AA1234567890",
  status: "pending",
  customerId: customer.id,
  orderNumber: "ORD-2025-001",
  items: "Laptop (1), Mouse (1)",
  carrier: "UPS",
  cost: 15.00,
  estimatedDelivery: "2025-08-30T17:00:00Z"
});

// Update shipment status
updateShipmentStatus(shipment.id, "shipped", "Package picked up by carrier");
```

## 📊 Dashboard Features

### Daily Report
Get a comprehensive overview of your business:
```typescript
import { generateDailyReport } from "./Dashboard.js";
console.log(generateDailyReport());
```

### Personalized Tasks
Get tasks organized by priority and type:
```typescript
import { getPersonalizedDailyTasks } from "./Dashboard.js";
const tasks = getPersonalizedDailyTasks();
// Returns: { urgent, customerFollowUps, shipmentTasks, overdue, today }
```

### Attention Items
Get items that need immediate attention:
```typescript
import { getAttentionItems } from "./Dashboard.js";
const items = getAttentionItems();
// Returns: { customersNeedingAttention, overdueShipments, urgentTasks, overdueTasks }
```

## 🔧 API Reference

### TaskManager
- `addTask(description, priority?, category?, dueDate?, customerId?, shipmentId?)` - Create a new task
- `getTasks()` - Get all tasks
- `getUrgentTasks()` - Get urgent tasks
- `getOverdueTasks()` - Get overdue tasks
- `completeTask(id)` - Mark task as completed
- `searchTasks(query)` - Search tasks by description

### CustomerManager
- `addCustomer(customerData)` - Add a new customer
- `getCustomers()` - Get all customers
- `getCustomersNeedingAttention()` - Get customers marked for attention
- `updateCustomer(id, updates)` - Update customer information
- `searchCustomers(query)` - Search customers by name, email, company, or phone

### ShipmentManager
- `addShipment(shipmentData)` - Create a new shipment
- `getShipments()` - Get all shipments
- `updateShipmentStatus(id, status, notes?)` - Update shipment status
- `getOverdueShipments()` - Get overdue shipments
- `searchShipments(query)` - Search shipments by tracking number, order, or carrier

### OrderManager
- `addOrder(orderData)` - Create a new order
- `getOrders()` - Get all orders
- `updateOrderStatus(id, status)` - Update order status
- `getTotalRevenue(days?)` - Calculate revenue for period
- `linkOrderToShipment(orderId, shipmentId)` - Link order to shipment

## 🎯 Recommended Daily Workflow

1. **Morning Review**
   ```bash
   npm start  # See daily overview and attention items
   ```

2. **Check Urgent Items**
   - Review urgent tasks
   - Check customers needing attention
   - Monitor overdue shipments

3. **Process New Orders**
   - Add new orders to the system
   - Create shipments for pending orders
   - Generate customer follow-up tasks

4. **Update Shipments**
   - Update tracking information
   - Mark deliveries as completed
   - Handle exceptions

5. **Plan Tomorrow**
   - Create tasks for next day
   - Schedule customer follow-ups
   - Review upcoming due dates

## 📈 Customization

### Adding New Fields
To add new fields to any entity, update the interface in `src/models.ts` and the CSV will automatically include the new columns.

### Custom Reports
Create custom reports by extending the Dashboard class:
```typescript
export function getCustomReport() {
  const data = getShipments();
  // Your custom logic here
  return customData;
}
```

### Integration
The CSV-based storage makes it easy to integrate with other tools:
- Import/export to Excel or Google Sheets
- Connect to BI tools
- Backup to cloud storage
- Version control your data

## 🔒 Data Security

- All data is stored locally in CSV files
- No external dependencies for data storage
- Easy to backup and restore
- Version control friendly

## 🤝 Contributing

This is a local business management tool. Feel free to customize it for your specific needs:
- Add new entity types
- Create custom workflows
- Build integrations
- Enhance the dashboard

## 📄 License

This project is designed for personal and business use. Modify as needed for your requirements.