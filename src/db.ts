import fs from "fs";
import path from "path";
import { parse } from "csv-parse/sync";
import { stringify } from "csv-stringify/sync";

export function ensureDirectoryExists(filePath: string): void {
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

export function readCSV<T>(filePath: string): T[] {
  if (!fs.existsSync(filePath)) return [];
  const data = fs.readFileSync(filePath, "utf-8");
  return parse(data, { columns: true, skip_empty_lines: true }) as T[];
}

export function writeCSV<T>(filePath: string, records: T[]): void {
  ensureDirectoryExists(filePath);
  const csv = stringify(records, { header: true });
  fs.writeFileSync(filePath, csv);
}

export function appendCSV<T>(filePath: string, record: T): void {
  ensureDirectoryExists(filePath);
  const records = readCSV<T>(filePath);
  records.push(record);
  writeCSV(filePath, records);
}

export function updateCSV<T extends { id: string }>(filePath: string, id: string, updates: Partial<T>): boolean {
  const records = readCSV<T>(filePath);
  const index = records.findIndex(record => record.id === id);
  if (index === -1) return false;
  
  records[index] = { ...records[index], ...updates } as T;
  writeCSV(filePath, records);
  return true;
}

export function deleteFromCSV<T extends { id: string }>(filePath: string, id: string): boolean {
  const records = readCSV<T>(filePath);
  const filteredRecords = records.filter(record => record.id !== id);
  if (filteredRecords.length === records.length) return false;
  
  writeCSV(filePath, filteredRecords);
  return true;
}
