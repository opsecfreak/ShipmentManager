import { type Shipment, type CreateShipment, type ShipmentStatus } from "./models.js";
export declare function getShipments(): Promise<Shipment[]>;
export declare function getShipmentById(id: string): Promise<Shipment | null>;
export declare function getShipmentsByCustomer(customerId: string): Promise<Shipment[]>;
export declare function getShipmentsByStatus(status: ShipmentStatus): Promise<Shipment[]>;
export declare function getPendingShipments(): Promise<Shipment[]>;
export declare function getActiveShipments(): Promise<Shipment[]>;
export declare function addShipment(shipmentData: CreateShipment): Promise<Shipment>;
export declare function updateShipment(id: string, updates: Partial<Shipment>): Promise<Shipment>;
export declare function updateShipmentStatus(id: string, status: ShipmentStatus, notes?: string): Promise<Shipment>;
export declare function deleteShipment(id: string): Promise<Shipment>;
export declare function getShipmentByTrackingNumber(trackingNumber: string): Promise<Shipment | null>;
export declare function searchShipments(query: string): Promise<Shipment[]>;
export declare function getOverdueShipments(): Promise<Shipment[]>;
//# sourceMappingURL=ShipmentManager.d.ts.map