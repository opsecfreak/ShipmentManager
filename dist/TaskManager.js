import prisma from "./db.js";
import { stringifyTagsToJSON } from "./models.js";
import { v4 as uuidv4 } from "uuid";
export async function getTasks() {
    const tasks = await prisma.task.findMany();
    return tasks;
}
export async function getTaskById(id) {
    return await prisma.task.findUnique({
        where: { id }
    });
}
export async function getTasksByPriority(priority) {
    return await prisma.task.findMany({
        where: {
            priority: priority,
            status: { not: "COMPLETED" }
        }
    });
}
export async function getTasksByStatus(status) {
    return await prisma.task.findMany({
        where: { status: status }
    });
}
export async function getUrgentTasks() {
    return await prisma.task.findMany({
        where: {
            priority: "URGENT",
            status: { not: "COMPLETED" }
        }
    });
}
export async function getOverdueTasks() {
    const now = new Date();
    return await prisma.task.findMany({
        where: {
            dueDate: { lt: now },
            status: { not: "COMPLETED" }
        }
    });
}
export async function getTasksByCustomer(customerId) {
    return await prisma.task.findMany({
        where: { customerId }
    });
}
export async function getTasksByShipment(shipmentId) {
    return await prisma.task.findMany({
        where: { shipmentId }
    });
}
export async function getTasksByOrder(orderId) {
    return await prisma.task.findMany({
        where: { orderId }
    });
}
export async function addTask(taskData) {
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
export async function updateTask(id, updates) {
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
export async function completeTask(id) {
    return await prisma.task.update({
        where: { id },
        data: {
            status: "COMPLETED",
            completedAt: new Date()
        }
    });
}
export async function deleteTask(id) {
    return await prisma.task.delete({
        where: { id }
    });
}
export async function createCustomerFollowUpTask(customerId, title, dueDate) {
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
export async function createShipmentTask(shipmentId, title, priority = "MEDIUM") {
    return await addTask({
        title,
        priority,
        status: "PENDING",
        shipmentId,
        tags: ["shipment"]
    });
}
export async function searchTasks(query) {
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
//# sourceMappingURL=TaskManager.js.map