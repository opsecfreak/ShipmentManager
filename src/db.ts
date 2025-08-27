import fs from "fs";
import { parse } from "csv-parse/sync";
import { stringify } from "csv-stringify/sync";

export function readCSV<T>(filePath: string): T[] {
  if (!fs.existsSync(filePath)) return [];
  const data = fs.readFileSync(filePath, "utf-8");
  return parse(data, { columns: true }) as T[];
}

export function writeCSV<T>(filePath: string, records: T[]) {
  const csv = stringify(records, { header: true });
  fs.writeFileSync(filePath, csv);
}
