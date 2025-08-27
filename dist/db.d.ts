import { PrismaClient } from '@prisma/client';
export declare const prisma: PrismaClient<import(".prisma/client").Prisma.PrismaClientOptions, never, import("@prisma/client/runtime/library").DefaultArgs>;
export declare function connectDB(): Promise<PrismaClient<import(".prisma/client").Prisma.PrismaClientOptions, never, import("@prisma/client/runtime/library").DefaultArgs>>;
export declare function disconnectDB(): Promise<void>;
export declare function healthCheck(): Promise<{
    status: string;
    timestamp: string;
    error?: never;
} | {
    status: string;
    error: string;
    timestamp: string;
}>;
export declare function paginate<T>(query: Promise<T[]>, page?: number, pageSize?: number): Promise<{
    data: T[];
    total: number;
    page: number;
    pageSize: number;
    pages: number;
}>;
import { z } from 'zod';
export declare function parseJsonField<T>(jsonString: string | null | undefined, schema: z.ZodType<T>, defaultValue: T): T;
export declare function stringifyJsonField<T>(value: T | null | undefined): string | null;
export declare function readCSV<T>(_filePath: string): T[];
export declare function writeCSV<T>(_filePath: string, _records: T[]): void;
export declare function updateCSV<T>(_filePath: string, _id: string, _updates: Partial<T>): boolean;
export declare function deleteFromCSV(_filePath: string, _id: string): boolean;
export default prisma;
//# sourceMappingURL=db.d.ts.map