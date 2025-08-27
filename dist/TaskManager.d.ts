import type { CreateTask, Task, Priority, TaskStatus } from "./models.js";
export declare function getTasks(): Promise<Task[]>;
export declare function getTaskById(id: string): Promise<Task | null>;
export declare function getTasksByPriority(priority: Priority): Promise<Task[]>;
export declare function getTasksByStatus(status: TaskStatus): Promise<Task[]>;
export declare function getUrgentTasks(): Promise<Task[]>;
export declare function getOverdueTasks(): Promise<Task[]>;
export declare function getTasksByCustomer(customerId: string): Promise<Task[]>;
export declare function getTasksByShipment(shipmentId: string): Promise<Task[]>;
export declare function getTasksByOrder(orderId: string): Promise<Task[]>;
export declare function addTask(taskData: CreateTask): Promise<Task>;
export declare function updateTask(id: string, updates: Partial<Task>): Promise<Task>;
export declare function completeTask(id: string): Promise<Task>;
export declare function deleteTask(id: string): Promise<Task>;
export declare function createCustomerFollowUpTask(customerId: string, title: string, dueDate?: string | Date): Promise<Task>;
export declare function createShipmentTask(shipmentId: string, title: string, priority?: Priority): Promise<Task>;
export declare function searchTasks(query: string): Promise<Task[]>;
//# sourceMappingURL=TaskManager.d.ts.map