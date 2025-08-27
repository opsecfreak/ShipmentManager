import prisma from "./db.js";
import { orderIncludes } from "./models.js";
import { OrderStatusEnum } from "./schemas.js";
export async function getOrders() {
    return prisma.order.findMany();
}
export async function getOrdersWithRelations() {
    return prisma.order.findMany({
        include: orderIncludes
    });
}
export async function getOrderById(id) {
    return prisma.order.findUnique({
        where: { id }
    });
}
export async function getOrderWithRelationsById(id) {
    return prisma.order.findUnique({
        where: { id },
        include: orderIncludes
    });
}
export async function getOrdersByCustomer(customerId) {
    return prisma.order.findMany({
        where: { customerId }
    });
}
export async function getOrdersByStatus(status) {
    return prisma.order.findMany({
        where: { status }
    });
}
export async function getRecentOrders(days = 7) {
    const cutoffDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
    return prisma.order.findMany({
        where: {
            orderDate: {
                gte: cutoffDate
            }
        }
    });
}
export async function addOrder(orderData) {
    // Extract items from order data to create separately
    const { items: orderItems, ...orderInfo } = orderData;
    // Create order with items using nested writes
    return prisma.order.create({
        data: {
            ...orderInfo,
            // Handle nested items creation if provided
            items: orderItems ? {
                create: orderItems
            } : undefined
        },
        include: {
            items: true
        }
    });
}
export async function updateOrder(id, updates) {
    // Extract items from update data as we need to handle them separately
    const { items, ...orderUpdates } = updates;
    try {
        // Update the order
        return prisma.order.update({
            where: { id },
            data: orderUpdates,
            include: {
                items: true
            }
        });
    }
    catch (error) {
        console.error('Failed to update order:', error);
        return null;
    }
}
export async function updateOrderStatus(id, status) {
    try {
        return prisma.order.update({
            where: { id },
            data: { status }
        });
    }
    catch (error) {
        console.error('Failed to update order status:', error);
        return null;
    }
}
export async function linkOrderToShipment(orderId, shipmentId) {
    try {
        // First check if shipment exists
        const shipment = await prisma.shipment.findUnique({
            where: { id: shipmentId }
        });
        if (!shipment)
            return false;
        // Link the shipment to the order in the junction table
        await prisma.order.update({
            where: { id: orderId },
            data: {
                shipments: {
                    connect: { id: shipmentId }
                }
            }
        });
        return true;
    }
    catch (error) {
        console.error('Failed to link order to shipment:', error);
        return false;
    }
}
export async function deleteOrder(id) {
    try {
        await prisma.order.delete({
            where: { id }
        });
        return true;
    }
    catch (error) {
        console.error('Failed to delete order:', error);
        return false;
    }
}
export async function searchOrders(query) {
    const lowerQuery = query.toLowerCase();
    // First get orders with matching order numbers
    const ordersByNumber = await prisma.order.findMany({
        where: {
            orderNumber: {
                contains: lowerQuery,
                mode: 'insensitive'
            }
        },
        include: {
            items: true
        }
    });
    // Then get orders with matching items
    const ordersByItems = await prisma.order.findMany({
        where: {
            items: {
                some: {
                    OR: [
                        {
                            productName: {
                                contains: lowerQuery,
                                mode: 'insensitive'
                            }
                        },
                        {
                            description: {
                                contains: lowerQuery,
                                mode: 'insensitive'
                            }
                        }
                    ]
                }
            }
        },
        include: {
            items: true
        }
    });
    // Combine results, removing duplicates by filtering out duplicates from ordersByItems
    return [
        ...ordersByNumber,
        ...ordersByItems.filter((o) => !ordersByNumber.some((on) => on.id === o.id))
    ];
}
export async function getOrdersByDateRange(startDate, endDate) {
    return prisma.order.findMany({
        where: {
            orderDate: {
                gte: startDate,
                lte: endDate
            }
        }
    });
}
export async function getTotalRevenue(days) {
    const whereClause = {
        status: {
            not: OrderStatusEnum.enum.CANCELLED
        }
    };
    if (days) {
        const cutoffDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
        whereClause.orderDate = {
            gte: cutoffDate
        };
    }
    // Use aggregation to sum the totalAmount
    const result = await prisma.order.aggregate({
        where: whereClause,
        _sum: {
            totalAmount: true
        }
    });
    return result._sum.totalAmount || 0;
}
//# sourceMappingURL=OrderManager.js.map