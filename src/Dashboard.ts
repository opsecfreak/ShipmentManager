import { getShipments, getPendingShipments, getOverdueShipments } from "./ShipmentManager.js";
import { getRecentOrders, getTotalRevenue } from "./OrderManager.js";
import { DashboardData, Task } from "./models.js";
import prisma from "./db.js";
import { parseTagsFromJSON } from "./models.js";

export async function getDashboardData(): Promise<DashboardData> {
  const [
    pendingShipments, 
    urgentTasks, 
    customersNeedingAttention,
    recentOrders,
    totalRevenue
  ] = await Promise.all([
    getPendingShipments().then(shipments => shipments.length),
    prisma.task.count({ where: { priority: "HIGH" } }),
    prisma.customer.count({ where: { tags: { contains: "needs-attention" } } }),
    getRecentOrders(30).then(orders => orders.length), // Last 30 days
    getTotalRevenue(30) // Last 30 days
  ]);

  return {
    pendingShipments,
    urgentTasks,
    customersNeedingAttention,
    recentOrders,
    totalRevenue
  };
}

export async function getTodaysTasks(): Promise<Task[]> {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const tasks = await prisma.task.findMany({
    where: {
      dueDate: {
        gte: today,
        lt: tomorrow
      },
      status: { not: "COMPLETED" }
    }
  });

  return tasks;
}

export async function getTasksSummary() {
  const [
    total,
    incomplete,
    urgent,
    overdue,
    today
  ] = await Promise.all([
    prisma.task.count(),
    prisma.task.count({ where: { status: { not: "COMPLETED" } } }),
    prisma.task.count({ where: { priority: "HIGH" } }),
    prisma.task.count({ 
      where: { 
        dueDate: { lt: new Date() }, 
        status: { not: "COMPLETED" } 
      } 
    }),
    getTodaysTasks().then(tasks => tasks.length)
  ]);
  
  const completed = total - incomplete;

  return {
    total,
    incomplete,
    urgent,
    overdue,
    today,
    completed
  };
}

export async function getShipmentsSummary() {
  const [
    allShipments,
    pendingCount,
    overdueCount
  ] = await Promise.all([
    getShipments(),
    prisma.shipment.count({ where: { status: "PENDING" } }),
    prisma.shipment.count({
      where: {
        estimatedDelivery: { lt: new Date() },
        status: { not: "DELIVERED" }
      }
    })
  ]);
  
  // Calculate status counts
  const statusCounts: Record<string, number> = {};
  for (const shipment of allShipments) {
    statusCounts[shipment.status] = (statusCounts[shipment.status] || 0) + 1;
  }

  return {
    total: allShipments.length,
    pending: pendingCount,
    overdue: overdueCount,
    statusCounts
  };
}

export async function getCustomersSummary() {
  const [
    customers,
    customerCount,
    needingAttentionCount
  ] = await Promise.all([
    prisma.customer.findMany(),
    prisma.customer.count(),
    prisma.customer.count({ where: { tags: { contains: "needs-attention" } } })
  ]);
  
  // Get orders total for revenue calculations
  const orders = await prisma.order.findMany();
  const totalRevenue = orders.reduce((sum: number, order: any) => sum + order.totalAmount, 0);
  const averageOrderValue = orders.length > 0 ? totalRevenue / orders.length : 0;
  
  // Extract unique values
  const industries = Array.from(new Set(customers
    .map((c: any) => c.industry)
    .filter(Boolean))) as string[];
    
  // Extract tags from all customers
  const allTags: string[] = [];
  for (const customer of customers) {
    if (customer.tags) {
      const tags = parseTagsFromJSON(customer.tags);
      allTags.push(...tags);
    }
  }
  const uniqueTags = Array.from(new Set(allTags));
  
  const countries = Array.from(new Set(customers
    .map((c: any) => c.country)
    .filter(Boolean)));

  return {
    total: customerCount,
    needingAttention: needingAttentionCount,
    totalSpent: totalRevenue,
    averageOrderValue,
    industries,
    tags: uniqueTags,
    countries
  };
}

export async function getPersonalizedDailyTasks() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  const [
    urgent,
    overdue,
    todayTasks
  ] = await Promise.all([
    prisma.task.findMany({ where: { priority: "HIGH" } }),
    prisma.task.findMany({
      where: {
        dueDate: { lt: today },
        status: { not: "COMPLETED" }
      }
    }),
    prisma.task.findMany({
      where: {
        dueDate: {
          gte: today,
          lt: tomorrow
        },
        status: { not: "COMPLETED" }
      }
    })
  ]);
  
  // Get tasks related to customers
  const customerFollowUps = await prisma.task.findMany({
    where: {
      status: { not: "COMPLETED" },
      customerId: { not: null }
    },
    include: { customer: true }
  });
  
  // Get tasks related to shipments
  const shipmentTasks = await prisma.task.findMany({
    where: {
      status: { not: "COMPLETED" },
      shipmentId: { not: null }
    },
    include: { shipment: true }
  });

  return {
    urgent,
    customerFollowUps,
    shipmentTasks,
    overdue,
    today: todayTasks
  };
}

export async function getAttentionItems() {
  const [
    overdueShipments,
    urgentTasks,
    overdueTasks
  ] = await Promise.all([
    getOverdueShipments(),
    prisma.task.findMany({ where: { priority: "HIGH" } }),
    prisma.task.findMany({ 
      where: { 
        dueDate: { lt: new Date() }, 
        status: { not: "COMPLETED" } 
      } 
    })
  ]);
  
  // Get customers needing attention
  const customersNeedingAttention = await prisma.customer.findMany({
    where: { tags: { contains: "needs-attention" } }
  }).then((customers: any[]) => customers.map((customer: any) => ({
    ...customer,
    tags: customer.tags ? parseTagsFromJSON(customer.tags) : []
  })));

  return {
    customersNeedingAttention,
    overdueShipments,
    urgentTasks,
    overdueTasks
  };
}

export async function generateDailyReport(): Promise<string> {
  const [
    dashboard,
    tasksSummary,
    shipmentsSummary,
    attentionItems
  ] = await Promise.all([
    getDashboardData(),
    getTasksSummary(),
    getShipmentsSummary(),
    getAttentionItems()
  ]);
  
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
    attentionItems.urgentTasks.forEach((task: any) => {
      report += `  • ${task.title}\n`;
    });
    report += `\n`;
  }
  
  if (attentionItems.customersNeedingAttention.length > 0) {
    report += `👥 CUSTOMERS NEEDING ATTENTION:\n`;
    attentionItems.customersNeedingAttention.forEach((customer: any) => {
      report += `  • ${customer.name} (${customer.email})\n`;
    });
  }
  
  return report;
}
