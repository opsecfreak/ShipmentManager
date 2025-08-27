import { readCSV, writeCSV, updateCSV, deleteFromCSV } from "./db.js";
import { Task } from "./models.js";
import { v4 as uuidv4 } from "uuid";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const TASKS_FILE = path.join(__dirname, "data", "tasks.csv");

export function getTasks(): Task[] {
  return readCSV<Task>(TASKS_FILE);
}

export function getTaskById(id: string): Task | undefined {
  return getTasks().find(task => task.id === id);
}

export function getTasksByPriority(priority: Task["priority"]): Task[] {
  return getTasks().filter(task => task.priority === priority && !task.completed);
}

export function getTasksByCategory(category: Task["category"]): Task[] {
  return getTasks().filter(task => task.category === category && !task.completed);
}

export function getUrgentTasks(): Task[] {
  return getTasks().filter(task => task.priority === "urgent" && !task.completed);
}

export function getOverdueTasks(): Task[] {
  const now = new Date();
  return getTasks().filter(task => {
    if (!task.dueDate || task.completed) return false;
    return new Date(task.dueDate) < now;
  });
}

export function getTasksByCustomer(customerId: string): Task[] {
  return getTasks().filter(task => task.customerId === customerId);
}

export function getTasksByShipment(shipmentId: string): Task[] {
  return getTasks().filter(task => task.shipmentId === shipmentId);
}

export function addTask(
  description: string, 
  priority: Task["priority"] = "medium",
  category: Task["category"] = "general",
  dueDate?: string,
  customerId?: string,
  shipmentId?: string
): Task {
  const task: Task = {
    id: uuidv4(),
    description,
    completed: false,
    priority,
    category,
    createdAt: new Date().toISOString(),
    ...(dueDate && { dueDate }),
    ...(customerId && { customerId }),
    ...(shipmentId && { shipmentId })
  };
  
  const tasks = getTasks();
  tasks.push(task);
  writeCSV(TASKS_FILE, tasks);
  return task;
}

export function updateTask(id: string, updates: Partial<Task>): boolean {
  return updateCSV(TASKS_FILE, id, updates);
}

export function completeTask(id: string): boolean {
  return updateTask(id, { completed: true });
}

export function deleteTask(id: string): boolean {
  return deleteFromCSV(TASKS_FILE, id);
}

export function createCustomerFollowUpTask(customerId: string, description: string, dueDate?: string): Task {
  return addTask(
    description,
    "medium",
    "follow-up",
    dueDate || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days from now
    customerId
  );
}

export function createShipmentTask(shipmentId: string, description: string, priority: Task["priority"] = "medium"): Task {
  return addTask(description, priority, "shipment", undefined, undefined, shipmentId);
}

export function searchTasks(query: string): Task[] {
  const tasks = getTasks();
  const lowerQuery = query.toLowerCase();
  
  return tasks.filter(task => 
    task.description.toLowerCase().includes(lowerQuery)
  );
}