import { z } from "zod";
import { TaskSchema, CustomerSchema, ShipmentSchema, OrderSchema } from "./schemas.js";
import { readCSV, writeCSV } from "./db.js";

export function validateTask(data: unknown): z.infer<typeof TaskSchema> {
  return TaskSchema.parse(data);
}

export function validateCustomer(data: unknown): z.infer<typeof CustomerSchema> {
  return CustomerSchema.parse(data);
}

export function validateShipment(data: unknown): z.infer<typeof ShipmentSchema> {
  return ShipmentSchema.parse(data);
}

export function validateOrder(data: unknown): z.infer<typeof OrderSchema> {
  return OrderSchema.parse(data);
}

export function validateAndWriteCSV<T>(filePath: string, records: T[], schema: z.ZodSchema<T>): void {
  const validatedRecords = records.map(record => schema.parse(record));
  writeCSV(filePath, validatedRecords);
}

export function readAndValidateCSV<T>(filePath: string, schema: z.ZodSchema<T>): T[] {
  const records = readCSV<T>(filePath);
  return records.map(record => {
    try {
      return schema.parse(record);
    } catch (error) {
      console.warn(`Validation error for record in ${filePath}:`, error);
      // Return original record if validation fails (for backward compatibility)
      return record;
    }
  });
}
