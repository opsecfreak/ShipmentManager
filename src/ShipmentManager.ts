import prisma from "./db.js";
import { 
  type Shipment, 
  type CreateShipment, 
  type ShipmentStatus, 
  parseDimensionsFromJSON, 
  stringifyDimensionsToJSON
} from "./models.js";
import { v4 as uuidv4 } from "uuid";

export async function getShipments(): Promise<Shipment[]> {
  const shipments = await prisma.shipment.findMany();
  return shipments.map((shipment: any) => ({
    ...shipment,
    dimensions: shipment.dimensions ? parseDimensionsFromJSON(shipment.dimensions) : null
  }));
}

export async function getShipmentById(id: string): Promise<Shipment | null> {
  const shipment = await prisma.shipment.findUnique({
    where: { id }
  });
  
  if (!shipment) return null;
  
  return {
    ...shipment,
    dimensions: shipment.dimensions ? parseDimensionsFromJSON(shipment.dimensions) : null
  };
}

export async function getShipmentsByCustomer(customerId: string): Promise<Shipment[]> {
  const shipments = await prisma.shipment.findMany({
    where: { customerId }
  });
  
  return shipments.map((shipment: any) => ({
    ...shipment,
    dimensions: shipment.dimensions ? parseDimensionsFromJSON(shipment.dimensions) : null
  }));
}

export async function getShipmentsByStatus(status: ShipmentStatus): Promise<Shipment[]> {
  const shipments = await prisma.shipment.findMany({
    where: { status: status as string }
  });
  
  return shipments.map((shipment: any) => ({
    ...shipment,
    dimensions: shipment.dimensions ? parseDimensionsFromJSON(shipment.dimensions) : null
  }));
}

export async function getPendingShipments(): Promise<Shipment[]> {
  return await getShipmentsByStatus("PENDING");
}

export async function getActiveShipments(): Promise<Shipment[]> {
  const shipments = await prisma.shipment.findMany({
    where: {
      status: {
        in: ["PENDING", "PICKED_UP", "IN_TRANSIT"]
      }
    }
  });
  
  return shipments.map((shipment: any) => ({
    ...shipment,
    dimensions: shipment.dimensions ? parseDimensionsFromJSON(shipment.dimensions) : null
  }));
}

export async function addShipment(shipmentData: CreateShipment): Promise<Shipment> {
  // Format dimensions as JSON string if they exist
  const formattedData = {
    ...shipmentData,
    dimensions: shipmentData.dimensions 
      ? stringifyDimensionsToJSON(shipmentData.dimensions) 
      : null,
    id: uuidv4()
  };
  
  const shipment = await prisma.shipment.create({
    data: formattedData
  });
  
  return {
    ...shipment,
    dimensions: shipment.dimensions ? parseDimensionsFromJSON(shipment.dimensions) : null
  };
}

export async function updateShipment(id: string, updates: Partial<Shipment>): Promise<Shipment> {
  // Handle dimensions if they exist
  const formattedUpdates = {
    ...updates,
    dimensions: updates.dimensions 
      ? stringifyDimensionsToJSON(updates.dimensions) 
      : undefined,
    updatedAt: new Date()
  };
  
  const shipment = await prisma.shipment.update({
    where: { id },
    data: formattedUpdates
  });
  
  return {
    ...shipment,
    dimensions: shipment.dimensions ? parseDimensionsFromJSON(shipment.dimensions) : null
  };
}

export async function updateShipmentStatus(
  id: string, 
  status: ShipmentStatus, 
  notes?: string
): Promise<Shipment> {
  const updates: Partial<Shipment> = { status };
  
  if (status === "DELIVERED") {
    updates.actualDelivery = new Date();
  }
  
  if (notes) {
    updates.notes = notes;
  }
  
  return await updateShipment(id, updates);
}

export async function deleteShipment(id: string): Promise<Shipment> {
  const shipment = await prisma.shipment.delete({
    where: { id }
  });
  
  return {
    ...shipment,
    dimensions: shipment.dimensions ? parseDimensionsFromJSON(shipment.dimensions) : null
  };
}

export async function getShipmentByTrackingNumber(trackingNumber: string): Promise<Shipment | null> {
  const shipment = await prisma.shipment.findUnique({
    where: { trackingNumber }
  });
  
  if (!shipment) return null;
  
  return {
    ...shipment,
    dimensions: shipment.dimensions ? parseDimensionsFromJSON(shipment.dimensions) : null
  };
}

export async function searchShipments(query: string): Promise<Shipment[]> {
  const lowerQuery = query.toLowerCase();
  
  const shipments = await prisma.shipment.findMany({
    where: {
      OR: [
        { trackingNumber: { contains: lowerQuery, mode: 'insensitive' } },
        { origin: { contains: lowerQuery, mode: 'insensitive' } },
        { destination: { contains: lowerQuery, mode: 'insensitive' } },
        { carrier: { contains: lowerQuery, mode: 'insensitive' } },
        { notes: { contains: lowerQuery, mode: 'insensitive' } }
      ]
    }
  });
  
  return shipments.map((shipment: any) => ({
    ...shipment,
    dimensions: shipment.dimensions ? parseDimensionsFromJSON(shipment.dimensions) : null
  }));
}

export async function getOverdueShipments(): Promise<Shipment[]> {
  const now = new Date();
  
  const shipments = await prisma.shipment.findMany({
    where: {
      estimatedDelivery: { lt: now },
      status: { not: "DELIVERED" }
    }
  });
  
  return shipments.map((shipment: any) => ({
    ...shipment,
    dimensions: shipment.dimensions ? parseDimensionsFromJSON(shipment.dimensions) : null
  }));
}
