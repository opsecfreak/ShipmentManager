// Helper constants for relation loading
export const customerIncludes = {
    contacts: true,
    tasks: true,
    shipments: true,
    orders: {
        include: {
            items: true
        }
    }
};
export const taskIncludes = {
    customer: true,
    shipment: true,
    order: true
};
export const shipmentIncludes = {
    customer: true,
    tasks: true,
    orders: true
};
export const orderIncludes = {
    customer: true,
    items: true,
    tasks: true,
    shipments: true
};
// Helper functions for working with JSON fields in SQLite
import { parseJsonField, stringifyJsonField } from './db.js';
import { z } from 'zod';
// Parse tags from JSON string or array
export function parseTagsFromJSON(tagsJson) {
    if (Array.isArray(tagsJson))
        return tagsJson;
    return parseJsonField(tagsJson, z.array(z.string()), []);
}
// Stringify tags for JSON storage
export function stringifyTagsToJSON(tags) {
    return stringifyJsonField(tags) || '[]';
}
// Parse dimensions from JSON string
export function parseDimensionsFromJSON(dimensionsJson) {
    if (!dimensionsJson)
        return null;
    const DimensionsSchema = z.object({
        length: z.number(),
        width: z.number(),
        height: z.number(),
    });
    return parseJsonField(dimensionsJson, DimensionsSchema, null);
}
// Stringify dimensions for JSON storage
export function stringifyDimensionsToJSON(dimensions) {
    return stringifyJsonField(dimensions);
}
//# sourceMappingURL=models.js.map