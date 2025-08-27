import { readCSV, writeCSV } from "./db";
import { Task } from "./models";
import { v4 as uuidv4 } from "uuid";
import path from "path";

const TASKS_FILE = path.join(__dirname, "data", "tasks.csv");

export function getTasks(): Task[] {
  return readCSV<Task>(TASKS_FILE);
}

export function addTask(description: string, dueDate?: string): void {
  const tasks = getTasks();
  tasks.push({ id: uuidv4(), description, completed: false, dueDate });
  writeCSV(TASKS_FILE, tasks);
}

export function completeTask(id: string): void {
  const tasks = getTasks().map(task =>
    task.id === id ? { ...task, completed: true } : task
  );
  writeCSV(TASKS_FILE, tasks);
}