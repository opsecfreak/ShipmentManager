import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { readCSV, writeCSV } from "./db.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.join(__dirname, "data");

export class DataUtils {
  
  // Backup all data to a timestamped directory
  static backupData(): string {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupDir = path.join(__dirname, "backups", `backup-${timestamp}`);
    
    if (!fs.existsSync(backupDir)) {
      fs.mkdirSync(backupDir, { recursive: true });
    }
    
    const files = ['tasks.csv', 'customers.csv', 'shipments.csv', 'orders.csv'];
    
    files.forEach(file => {
      const sourcePath = path.join(DATA_DIR, file);
      const destPath = path.join(backupDir, file);
      
      if (fs.existsSync(sourcePath)) {
        fs.copyFileSync(sourcePath, destPath);
        console.log(`✅ Backed up ${file}`);
      }
    });
    
    console.log(`📦 Backup created at: ${backupDir}`);
    return backupDir;
  }
  
  // Clear all data (useful for starting fresh)
  static clearAllData(): void {
    const files = ['tasks.csv', 'customers.csv', 'shipments.csv', 'orders.csv'];
    
    files.forEach(file => {
      const filePath = path.join(DATA_DIR, file);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        console.log(`🗑️  Deleted ${file}`);
      }
    });
    
    console.log("🧹 All data cleared");
  }
  
  // Export data as JSON for easy viewing/editing
  static exportToJSON(): string {
    const data: any = {};
    const files = ['tasks.csv', 'customers.csv', 'shipments.csv', 'orders.csv'];
    
    files.forEach(file => {
      const filePath = path.join(DATA_DIR, file);
      const tableName = file.replace('.csv', '');
      data[tableName] = readCSV(filePath);
    });
    
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const exportPath = path.join(__dirname, "exports", `export-${timestamp}.json`);
    
    if (!fs.existsSync(path.dirname(exportPath))) {
      fs.mkdirSync(path.dirname(exportPath), { recursive: true });
    }
    
    fs.writeFileSync(exportPath, JSON.stringify(data, null, 2));
    console.log(`📄 Data exported to: ${exportPath}`);
    return exportPath;
  }
  
  // Import data from JSON
  static importFromJSON(jsonPath: string): void {
    if (!fs.existsSync(jsonPath)) {
      console.log(`❌ File not found: ${jsonPath}`);
      return;
    }
    
    const data = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));
    
    Object.keys(data).forEach(tableName => {
      const filePath = path.join(DATA_DIR, `${tableName}.csv`);
      writeCSV(filePath, data[tableName]);
      console.log(`✅ Imported ${tableName}.csv`);
    });
    
    console.log("📥 Data import completed");
  }
  
  // Get data statistics
  static getDataStats(): void {
    const files = ['tasks.csv', 'customers.csv', 'shipments.csv', 'orders.csv'];
    
    console.log("📊 DATA STATISTICS");
    console.log("=" .repeat(25));
    
    files.forEach(file => {
      const filePath = path.join(DATA_DIR, file);
      const tableName = file.replace('.csv', '');
      
      if (fs.existsSync(filePath)) {
        const records = readCSV(filePath);
        const stats = fs.statSync(filePath);
        console.log(`${tableName.padEnd(12)}: ${records.length.toString().padStart(4)} records (${(stats.size / 1024).toFixed(1)}KB)`);
      } else {
        console.log(`${tableName.padEnd(12)}: ${' '.repeat(4)}0 records (file not found)`);
      }
    });
  }
  
  // List all backups
  static listBackups(): string[] {
    const backupsDir = path.join(__dirname, "backups");
    
    if (!fs.existsSync(backupsDir)) {
      console.log("📁 No backups found");
      return [];
    }
    
    const backups = fs.readdirSync(backupsDir)
      .filter(dir => dir.startsWith('backup-'))
      .sort()
      .reverse();
    
    if (backups.length === 0) {
      console.log("📁 No backups found");
      return [];
    }
    
    console.log("📁 AVAILABLE BACKUPS:");
    backups.forEach((backup, index) => {
      const timestamp = backup.replace('backup-', '').replace(/-/g, ':');
      console.log(`  ${index + 1}. ${timestamp}`);
    });
    
    return backups;
  }
}

// Convenience exports
export const { backupData, clearAllData, exportToJSON, importFromJSON, getDataStats, listBackups } = DataUtils;
