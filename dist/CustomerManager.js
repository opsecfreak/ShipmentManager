import prisma from "./db.js";
import { parseTagsFromJSON, stringifyTagsToJSON } from "./models.js";
export async function getCustomers() {
    const customers = await prisma.customer.findMany();
    return customers.map((customer) => ({
        ...customer,
        tags: customer.tags ? parseTagsFromJSON(customer.tags) : []
    }));
}
export async function getCustomersWithRelations() {
    const customers = await prisma.customer.findMany({
        include: {
            contacts: true,
            tasks: true,
            shipments: true,
            orders: {
                include: {
                    items: true
                }
            }
        }
    });
    return customers.map((customer) => ({
        ...customer,
        tags: customer.tags ? parseTagsFromJSON(customer.tags) : []
    }));
}
export async function getCustomerById(id) {
    const customer = await prisma.customer.findUnique({
        where: { id }
    });
    if (!customer)
        return null;
    return {
        ...customer,
        tags: customer.tags ? parseTagsFromJSON(customer.tags) : []
    };
}
export async function getCustomerWithRelations(id) {
    const customer = await prisma.customer.findUnique({
        where: { id },
        include: {
            contacts: true,
            tasks: true,
            shipments: true,
            orders: {
                include: {
                    items: true
                }
            }
        }
    });
    if (!customer)
        return null;
    return {
        ...customer,
        tags: customer.tags ? parseTagsFromJSON(customer.tags) : []
    };
}
export async function addCustomer(customerData) {
    // Prepare data for Prisma by stringifying the tags array
    const prismaData = {
        ...customerData,
        tags: customerData.tags ? stringifyTagsToJSON(customerData.tags) : null
    };
    const customer = await prisma.customer.create({
        data: prismaData
    });
    return {
        ...customer,
        tags: customer.tags ? parseTagsFromJSON(customer.tags) : []
    };
}
export async function updateCustomer(id, updates) {
    // Ensure the customer exists
    const existingCustomer = await prisma.customer.findUnique({
        where: { id }
    });
    if (!existingCustomer)
        return null;
    // Prepare data for Prisma by stringifying the tags array if present
    const prismaUpdates = {
        ...updates
    };
    if (updates.tags) {
        prismaUpdates.tags = stringifyTagsToJSON(updates.tags);
    }
    // Remove relations from direct updates as they need to be handled separately
    if ('contacts' in prismaUpdates)
        delete prismaUpdates.contacts;
    if ('tasks' in prismaUpdates)
        delete prismaUpdates.tasks;
    if ('shipments' in prismaUpdates)
        delete prismaUpdates.shipments;
    if ('orders' in prismaUpdates)
        delete prismaUpdates.orders;
    const updatedCustomer = await prisma.customer.update({
        where: { id },
        data: prismaUpdates
    });
    return {
        ...updatedCustomer,
        tags: updatedCustomer.tags ? parseTagsFromJSON(updatedCustomer.tags) : []
    };
}
export async function deleteCustomer(id) {
    try {
        await prisma.customer.delete({
            where: { id }
        });
        return true;
    }
    catch (error) {
        console.error('Failed to delete customer:', error);
        return false;
    }
}
export async function searchCustomers(query) {
    const lowerQuery = query.toLowerCase();
    const customers = await prisma.customer.findMany({
        include: {
            contacts: true
        },
        where: {
            OR: [
                { name: { contains: lowerQuery, mode: 'insensitive' } },
                { email: { contains: lowerQuery, mode: 'insensitive' } },
                { company: { contains: lowerQuery, mode: 'insensitive' } },
                { phone: { contains: query } },
                { country: { contains: lowerQuery, mode: 'insensitive' } },
                { industry: { contains: lowerQuery, mode: 'insensitive' } },
                { contacts: {
                        some: {
                            OR: [
                                { name: { contains: lowerQuery, mode: 'insensitive' } },
                                { email: { contains: lowerQuery, mode: 'insensitive' } },
                                { phone: { contains: query } },
                                { role: { contains: lowerQuery, mode: 'insensitive' } }
                            ]
                        }
                    }
                }
            ]
        }
    });
    // Handle tag search and convert tags from JSON
    return customers
        .map((customer) => ({
        ...customer,
        tags: customer.tags ? parseTagsFromJSON(customer.tags) : []
    }))
        .filter((customer) => {
        // If no tags, skip tag filtering
        if (!query || !customer.tags || customer.tags.length === 0) {
            return true;
        }
        // Check if any tag contains the query
        return customer.tags.some((tag) => tag.toLowerCase().includes(lowerQuery));
    });
}
// Advanced filtering
export async function filterCustomersByTag(tag) {
    const customers = await getCustomers();
    return customers.filter(c => c.tags && c.tags.includes(tag));
}
export async function filterCustomersByIndustry(industry) {
    return prisma.customer.findMany({
        where: { industry }
    }).then((customers) => customers.map((customer) => ({
        ...customer,
        tags: customer.tags ? parseTagsFromJSON(customer.tags) : []
    })));
}
export async function filterCustomersByCountry(country) {
    return prisma.customer.findMany({
        where: { country }
    }).then((customers) => customers.map((customer) => ({
        ...customer,
        tags: customer.tags ? parseTagsFromJSON(customer.tags) : []
    })));
}
export async function addTagToCustomer(id, tag) {
    const customer = await getCustomerById(id);
    if (!customer)
        return null;
    const tags = customer.tags || [];
    if (!tags.includes(tag)) {
        tags.push(tag);
        return updateCustomer(id, { tags });
    }
    return customer;
}
export async function removeTagFromCustomer(id, tag) {
    const customer = await getCustomerById(id);
    if (!customer || !customer.tags)
        return null;
    const tags = customer.tags.filter(t => t !== tag);
    return updateCustomer(id, { tags });
}
export async function addContactToCustomer(customerId, contactData) {
    try {
        const contact = await prisma.contact.create({
            data: {
                ...contactData,
                customerId
            }
        });
        return contact;
    }
    catch (error) {
        console.error('Failed to add contact:', error);
        return null;
    }
}
export async function removeContactFromCustomer(customerId, contactId) {
    try {
        await prisma.contact.delete({
            where: {
                id: contactId,
                customerId
            }
        });
        return true;
    }
    catch (error) {
        console.error('Failed to remove contact:', error);
        return false;
    }
}
//# sourceMappingURL=CustomerManager.js.map