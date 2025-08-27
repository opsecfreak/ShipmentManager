import { readCSV, writeCSV, updateCSV, deleteFromCSV } from "./db.js";
import { Shipment } from "./models.js";
import { v4 as uuidv4 } from "uuid";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const SHIPMENTS_FILE = path.join(__dirname, "data", "shipments.csv");

export function getShipments(): Shipment[] {
  return readCSV<Shipment>(SHIPMENTS_FILE);
}

export function getShipmentById(id: string): Shipment | undefined {
  return getShipments().find(shipment => shipment.id === id);
}

export function getShipmentsByCustomer(customerId: string): Shipment[] {
  return getShipments().filter(shipment => shipment.customerId === customerId);
}

export function getShipmentsByStatus(status: Shipment["status"]): Shipment[] {
  return getShipments().filter(shipment => shipment.status === status);
}

export function getPendingShipments(): Shipment[] {
  return getShipmentsByStatus("pending");
}

export function getActiveShipments(): Shipment[] {
  return getShipments().filter(shipment => 
    ["pending", "processing", "shipped", "in-transit"].includes(shipment.status)
  );
}

export function addShipment(shipmentData: Omit<Shipment, "id" | "createdAt" | "updatedAt">): Shipment {
  const shipment: Shipment = {
    ...shipmentData,
    id: uuidv4(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  
  const shipments = getShipments();
  shipments.push(shipment);
  writeCSV(SHIPMENTS_FILE, shipments);
  return shipment;
}

export function updateShipment(id: string, updates: Partial<Shipment>): boolean {
  const updatesWithTimestamp = {
    ...updates,
    updatedAt: new Date().toISOString()
  };
  return updateCSV(SHIPMENTS_FILE, id, updatesWithTimestamp);
}

export function updateShipmentStatus(id: string, status: Shipment["status"], notes?: string): boolean {
  const updates: Partial<Shipment> = { status };
  
  if (status === "shipped" && !getShipmentById(id)?.shipDate) {
    updates.shipDate = new Date().toISOString();
  }
  
  if (status === "delivered") {
    updates.actualDelivery = new Date().toISOString();
  }
  
  if (notes) {
    updates.notes = notes;
  }
  
  return updateShipment(id, updates);
}

export function deleteShipment(id: string): boolean {
  return deleteFromCSV(SHIPMENTS_FILE, id);
}

export function getShipmentsByTrackingNumber(trackingNumber: string): Shipment | undefined {
  return getShipments().find(shipment => shipment.trackingNumber === trackingNumber);
}

export function searchShipments(query: string): Shipment[] {
  const shipments = getShipments();
  const lowerQuery = query.toLowerCase();
  
  return shipments.filter(shipment => 
    shipment.trackingNumber.toLowerCase().includes(lowerQuery) ||
    shipment.orderNumber.toLowerCase().includes(lowerQuery) ||
    shipment.carrier.toLowerCase().includes(lowerQuery) ||
    shipment.items.toLowerCase().includes(lowerQuery)
  );
}

export function getOverdueShipments(): Shipment[] {
  const now = new Date();
  return getShipments().filter(shipment => {
    if (!shipment.estimatedDelivery || shipment.status === "delivered") return false;
    return new Date(shipment.estimatedDelivery) < now;
  });
}
