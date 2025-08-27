import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Load environment variables
dotenv.config();

// Create .env file if it doesn't exist
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const envPath = path.join(__dirname, '..', '.env');

if (!fs.existsSync(envPath)) {
  fs.writeFileSync(
    envPath,
    'DATABASE_URL="file:../prisma/dev.db"\n'
  );
  console.log('✅ Created .env file with SQLite database URL');
}

// Global Prisma instance with extensions
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// Create Prisma client with extensions for better performance
export const prisma = globalForPrisma.prisma ?? 
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });

// Save Prisma client in global scope in development
if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

// Database connection utilities
export async function connectDB() {
  try {
    await prisma.$connect();
    console.log('✅ Database connected successfully');
    return prisma;
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    throw error;
  }
}

export async function disconnectDB() {
  try {
    await prisma.$disconnect();
    console.log('✅ Database disconnected successfully');
  } catch (error) {
    console.error('❌ Database disconnection failed:', error);
    throw error;
  }
}

// Health check
export async function healthCheck() {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return { status: 'healthy', timestamp: new Date().toISOString() };
  } catch (error) {
    return { 
      status: 'unhealthy', 
      error: error instanceof Error ? error.message : 'Unknown error', 
      timestamp: new Date().toISOString() 
    };
  }
}

// Database utilities for pagination and common queries
export async function paginate<T>(
  query: Promise<T[]>,
  page = 1,
  pageSize = 10
): Promise<{ data: T[]; total: number; page: number; pageSize: number; pages: number }> {
  const skip = (page - 1) * pageSize;
  const [data, total] = await Promise.all([
    query.then(data => data.slice(skip, skip + pageSize)),
    query.then(data => data.length),
  ]);
  
  return {
    data,
    total,
    page,
    pageSize,
    pages: Math.ceil(total / pageSize),
  };
}

// JSON helpers for SQLite since it doesn't natively support arrays or objects
import { z } from 'zod';

export function parseJsonField<T>(
  jsonString: string | null | undefined,
  schema: z.ZodType<T>,
  defaultValue: T
): T {
  if (!jsonString) return defaultValue;
  try {
    const parsed = JSON.parse(jsonString);
    return schema.parse(parsed);
  } catch (e) {
    console.warn('Error parsing JSON field:', e);
    return defaultValue;
  }
}

export function stringifyJsonField<T>(
  value: T | null | undefined
): string | null {
  if (value === null || value === undefined) return null;
  return JSON.stringify(value);
}

// CSV handling for backward compatibility
// Using noSonar to suppress linting warnings about unused parameters
export function readCSV<T>(_filePath: string): T[] { // noSonar
  console.warn('⚠️ readCSV is deprecated. Use Prisma client directly.');
  return [];
}

export function writeCSV<T>(_filePath: string, _records: T[]): void { // noSonar
  console.warn('⚠️ writeCSV is deprecated. Use Prisma client directly.');
}

export function updateCSV<T>(_filePath: string, _id: string, _updates: Partial<T>): boolean { // noSonar
  console.warn('⚠️ updateCSV is deprecated. Use Prisma client directly.');
  return false;
}

export function deleteFromCSV(_filePath: string, _id: string): boolean { // noSonar
  console.warn('⚠️ deleteFromCSV is deprecated. Use Prisma client directly.');
  return false;
}

export default prisma;
