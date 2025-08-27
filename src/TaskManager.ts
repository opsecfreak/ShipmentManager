import prisma from "./db.js";
import { parseTagsFromJSON, stringifyTagsToJSON } from "./models.js";
import type { CreateTask, Task, Priority, TaskStatus } from "./models.js";
import { v4 as uuidv4 } from "uuid";

export async function getTasks(): Promise<Task[]> {
  const tasks = await prisma.task.findMany();
  return tasks;
}

export async function getTaskById(id: string): Promise<Task | null> {
  return await prisma.task.findUnique({
    where: { id }
  });
}

export async function getTasksByPriority(priority: Priority): Promise<Task[]> {
  return await prisma.task.findMany({
    where: { 
      priority: priority as string,
      status: { not: "COMPLETED" } 
    }
  });
}

export async function getTasksByStatus(status: TaskStatus): Promise<Task[]> {
  return await prisma.task.findMany({
    where: { status: status as string }
  });
}

export async function getUrgentTasks(): Promise<Task[]> {
  return await prisma.task.findMany({
    where: {
      priority: "URGENT",
      status: { not: "COMPLETED" }
    }
  });
}

export async function getOverdueTasks(): Promise<Task[]> {
  const now = new Date();
  return await prisma.task.findMany({
    where: {
      dueDate: { lt: now },
      status: { not: "COMPLETED" }
    }
  });
}

export async function getTasksByCustomer(customerId: string): Promise<Task[]> {
  return await prisma.task.findMany({
    where: { customerId }
  });
}

export async function getTasksByShipment(shipmentId: string): Promise<Task[]> {
  return await prisma.task.findMany({
    where: { shipmentId }
  });
}

export async function getTasksByOrder(orderId: string): Promise<Task[]> {
  return await prisma.task.findMany({
    where: { orderId }
  });
}

export async function addTask(
  taskData: CreateTask
): Promise<Task> {
  // Handle tags if they exist
  const formattedTask = {
    ...taskData,
    tags: taskData.tags ? stringifyTagsToJSON(taskData.tags) : null,
    id: uuidv4(),
  };
  
  return await prisma.task.create({
    data: formattedTask
  });
}

export async function updateTask(id: string, updates: Partial<Task>): Promise<Task> {
  // Handle tags if they exist
  const formattedUpdates = {
    ...updates,
    tags: updates.tags ? stringifyTagsToJSON(updates.tags) : undefined,
    updatedAt: new Date()
  };
  
  return await prisma.task.update({
    where: { id },
    data: formattedUpdates
  });
}

export async function completeTask(id: string): Promise<Task> {
  return await prisma.task.update({
    where: { id },
    data: { 
      status: "COMPLETED",
      completedAt: new Date()
    }
  });
}

export async function deleteTask(id: string): Promise<Task> {
  return await prisma.task.delete({
    where: { id }
  });
}

export async function createCustomerFollowUpTask(
  customerId: string, 
  title: string, 
  dueDate?: string | Date
): Promise<Task> {
  const dueDateValue = dueDate 
    ? new Date(dueDate) 
    : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days from now
  
  return await addTask({
    title,
    priority: "MEDIUM",
    status: "PENDING",
    dueDate: dueDateValue,
    customerId,
    tags: ["follow-up"]
  });
}

export async function createShipmentTask(
  shipmentId: string, 
  title: string, 
  priority: Priority = "MEDIUM"
): Promise<Task> {
  return await addTask({
    title,
    priority,
    status: "PENDING",
    shipmentId,
    tags: ["shipment"]
  });
}

export async function searchTasks(query: string): Promise<Task[]> {
  const lowerQuery = query.toLowerCase();
  
  return await prisma.task.findMany({
    where: {
      OR: [
        { title: { contains: lowerQuery, mode: 'insensitive' } },
        { description: { contains: lowerQuery, mode: 'insensitive' } },
      ]
    }
  });
}