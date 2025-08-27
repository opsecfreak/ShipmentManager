export declare class ShipmentManagerCLI {
    static quickAddTask(description: string, priority?: "low" | "medium" | "high" | "urgent"): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        priority: "LOW" | "MEDIUM" | "HIGH" | "URGENT";
        status: "PENDING" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED" | "ON_HOLD";
        tags?: string[] | undefined;
        description?: string | undefined;
        dueDate?: Date | undefined;
        assignedTo?: string | undefined;
        customerId?: string | null | undefined;
        shipmentId?: string | null | undefined;
        orderId?: string | null | undefined;
        estimatedHours?: number | undefined;
        actualHours?: number | undefined;
        completedAt?: Date | null | undefined;
    }>;
    static showUrgentTasks(): void;
    static showDailyOverview(): void;
    static showMyTasks(): void;
    static quickAddCustomer(name: string, email: string, company?: string): Promise<{
        name: string;
        id: string;
        email: string;
        country: string;
        createdAt: Date;
        updatedAt: Date;
        phone?: string | null | undefined;
        company?: string | null | undefined;
        address?: string | null | undefined;
        city?: string | null | undefined;
        state?: string | null | undefined;
        zipCode?: string | null | undefined;
        website?: string | null | undefined;
        vatNumber?: string | null | undefined;
        industry?: string | null | undefined;
        tags?: string[] | undefined;
        notes?: string | null | undefined;
        contacts?: {
            name: string;
            id: string;
            customerId: string;
            isPrimary: boolean;
            email?: string | null | undefined;
            phone?: string | null | undefined;
            role?: string | null | undefined;
        }[] | undefined;
    }>;
    static showCustomersNeedingAttention(): void;
    static quickAddShipment(trackingNumber: string, customerId: string, orderNumber: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: "PENDING" | "PICKED_UP" | "IN_TRANSIT" | "OUT_FOR_DELIVERY" | "DELIVERED" | "EXCEPTION" | "RETURNED";
        customerId: string;
        trackingNumber: string;
        origin: string;
        destination: string;
        carrier: string;
        notes?: string | null | undefined;
        estimatedDelivery?: Date | null | undefined;
        actualDelivery?: Date | null | undefined;
        weight?: number | null | undefined;
        dimensions?: {
            length: number;
            width: number;
            height: number;
        } | null | undefined;
        value?: number | null | undefined;
        insurance?: number | null | undefined;
    }>;
    static quickUpdateShipmentStatus(trackingNumber: string, status: "pending" | "processing" | "shipped" | "in-transit" | "delivered" | "exception"): false | Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: "PENDING" | "PICKED_UP" | "IN_TRANSIT" | "OUT_FOR_DELIVERY" | "DELIVERED" | "EXCEPTION" | "RETURNED";
        customerId: string;
        trackingNumber: string;
        origin: string;
        destination: string;
        carrier: string;
        notes?: string | null | undefined;
        estimatedDelivery?: Date | null | undefined;
        actualDelivery?: Date | null | undefined;
        weight?: number | null | undefined;
        dimensions?: {
            length: number;
            width: number;
            height: number;
        } | null | undefined;
        value?: number | null | undefined;
        insurance?: number | null | undefined;
    }>;
    static searchEverything(query: string): void;
    static showStats(): void;
}
export declare const cli: typeof ShipmentManagerCLI;
//# sourceMappingURL=CLI.d.ts.map