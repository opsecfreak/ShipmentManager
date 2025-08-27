import { getTasks, getUrgentTasks, getOverdueTasks } from "./TaskManager.js";
import { getShipments, getPendingShipments, getOverdueShipments } from "./ShipmentManager.js";
import { getCustomers, getCustomersNeedingAttention } from "./CustomerManager.js";
import { getRecentOrders, getTotalRevenue } from "./OrderManager.js";
import { DashboardData, Task, Shipment, Customer } from "./models.js";

export function getDashboardData(): DashboardData {
  const pendingShipments = getPendingShipments().length;
  const urgentTasks = getUrgentTasks().length;
  const customersNeedingAttention = getCustomersNeedingAttention().length;
  const recentOrders = getRecentOrders(30).length; // Last 30 days
  const totalRevenue = getTotalRevenue(30); // Last 30 days

  return {
    pendingShipments,
    urgentTasks,
    customersNeedingAttention,
    recentOrders,
    totalRevenue
  };
}

export function getTodaysTasks(): Task[] {
  const today = new Date().toISOString().split('T')[0];
  return getTasks().filter(task => {
    return !task.completed && 
           task.dueDate != null && 
           task.dueDate.startsWith(today);
  });
}

export function getTasksSummary() {
  const allTasks = getTasks();
  const incompleteTasks = allTasks.filter(task => !task.completed);
  const urgentTasks = getUrgentTasks();
  const overdueTasks = getOverdueTasks();
  const todaysTasks = getTodaysTasks();

  return {
    total: allTasks.length,
    incomplete: incompleteTasks.length,
    urgent: urgentTasks.length,
    overdue: overdueTasks.length,
    today: todaysTasks.length,
    completed: allTasks.length - incompleteTasks.length
  };
}

export function getShipmentsSummary() {
  const allShipments = getShipments();
  const pendingShipments = getPendingShipments();
  const overdueShipments = getOverdueShipments();
  
  const statusCounts = allShipments.reduce((acc, shipment) => {
    acc[shipment.status] = (acc[shipment.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return {
    total: allShipments.length,
    pending: pendingShipments.length,
    overdue: overdueShipments.length,
    statusCounts
  };
}

export function getCustomersSummary() {
  const allCustomers = getCustomers();
  const needingAttention = getCustomersNeedingAttention();
  
  return {
    total: allCustomers.length,
    needingAttention: needingAttention.length,
    totalSpent: allCustomers.reduce((sum, customer) => sum + customer.totalSpent, 0),
    averageOrderValue: allCustomers.reduce((sum, customer) => sum + customer.totalSpent, 0) / 
                      Math.max(allCustomers.reduce((sum, customer) => sum + customer.totalOrders, 0), 1)
  };
}

export function getPersonalizedDailyTasks(): {
  urgent: Task[];
  customerFollowUps: Task[];
  shipmentTasks: Task[];
  overdue: Task[];
  today: Task[];
} {
  const urgent = getUrgentTasks();
  const customerFollowUps = getTasks().filter(task => 
    task.category === "follow-up" && !task.completed
  );
  const shipmentTasks = getTasks().filter(task => 
    task.category === "shipment" && !task.completed
  );
  const overdue = getOverdueTasks();
  const today = getTodaysTasks();

  return {
    urgent,
    customerFollowUps,
    shipmentTasks,
    overdue,
    today
  };
}

export function getAttentionItems(): {
  customersNeedingAttention: Customer[];
  overdueShipments: Shipment[];
  urgentTasks: Task[];
  overdueTasks: Task[];
} {
  return {
    customersNeedingAttention: getCustomersNeedingAttention(),
    overdueShipments: getOverdueShipments(),
    urgentTasks: getUrgentTasks(),
    overdueTasks: getOverdueTasks()
  };
}

export function generateDailyReport(): string {
  const dashboard = getDashboardData();
  const tasksSummary = getTasksSummary();
  const shipmentsSummary = getShipmentsSummary();
  const attentionItems = getAttentionItems();
  
  let report = `📊 DAILY BUSINESS REPORT - ${new Date().toLocaleDateString()}\n`;
  report += `${"=".repeat(50)}\n\n`;
  
  report += `💰 REVENUE: $${dashboard.totalRevenue.toFixed(2)} (Last 30 days)\n`;
  report += `📦 ORDERS: ${dashboard.recentOrders} new orders (Last 30 days)\n\n`;
  
  report += `📋 TASKS OVERVIEW:\n`;
  report += `  • Total: ${tasksSummary.total} | Incomplete: ${tasksSummary.incomplete}\n`;
  report += `  • Urgent: ${tasksSummary.urgent} | Overdue: ${tasksSummary.overdue}\n`;
  report += `  • Due Today: ${tasksSummary.today}\n\n`;
  
  report += `🚚 SHIPMENTS OVERVIEW:\n`;
  report += `  • Total: ${shipmentsSummary.total} | Pending: ${shipmentsSummary.pending}\n`;
  report += `  • Overdue: ${shipmentsSummary.overdue}\n\n`;
  
  report += `⚠️  ITEMS NEEDING ATTENTION:\n`;
  report += `  • Customers: ${attentionItems.customersNeedingAttention.length}\n`;
  report += `  • Urgent Tasks: ${attentionItems.urgentTasks.length}\n`;
  report += `  • Overdue Tasks: ${attentionItems.overdueTasks.length}\n`;
  report += `  • Overdue Shipments: ${attentionItems.overdueShipments.length}\n\n`;
  
  if (attentionItems.urgentTasks.length > 0) {
    report += `🔥 URGENT TASKS:\n`;
    attentionItems.urgentTasks.forEach(task => {
      report += `  • ${task.description}\n`;
    });
    report += `\n`;
  }
  
  if (attentionItems.customersNeedingAttention.length > 0) {
    report += `👥 CUSTOMERS NEEDING ATTENTION:\n`;
    attentionItems.customersNeedingAttention.forEach(customer => {
      report += `  • ${customer.name} (${customer.email})\n`;
    });
  }
  
  return report;
}
