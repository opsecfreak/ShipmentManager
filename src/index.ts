import { addTask, getTasks, completeTask } from "./TaskManager";

console.log("📦 Simple CRM CLI");

// Add a new task
addTask("Email customer about shipment", "2025-08-30");

// Show all tasks
console.table(getTasks());

// Mark task done
// completeTask("some-id");
