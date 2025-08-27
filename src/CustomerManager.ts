import prisma from "./db.js";
import { 
  type Customer, 
  type CustomerWithRelations,
  type CreateCustomer,
  type Contact,
  type CreateContact,
  parseTagsFromJSON,
  stringifyTagsToJSON
} from "./models.js";

export async function getCustomers(): Promise<Customer[]> {
  const customers = await prisma.customer.findMany();
  return customers.map((customer: any) => ({
    ...customer,
    tags: customer.tags ? parseTagsFromJSON(customer.tags) : []
  }));
}

export async function getCustomersWithRelations(): Promise<CustomerWithRelations[]> {
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
  
  return customers.map((customer: any) => ({
    ...customer,
    tags: customer.tags ? parseTagsFromJSON(customer.tags) : []
  }));
}

export async function getCustomerById(id: string): Promise<Customer | null> {
  const customer = await prisma.customer.findUnique({
    where: { id }
  });
  
  if (!customer) return null;
  
  return {
    ...customer,
    tags: customer.tags ? parseTagsFromJSON(customer.tags) : []
  };
}

export async function getCustomerWithRelations(id: string): Promise<CustomerWithRelations | null> {
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
  
  if (!customer) return null;
  
  return {
    ...customer,
    tags: customer.tags ? parseTagsFromJSON(customer.tags) : []
  };
}

export async function addCustomer(customerData: CreateCustomer): Promise<Customer> {
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

export async function updateCustomer(id: string, updates: Partial<Customer>): Promise<Customer | null> {
  // Ensure the customer exists
  const existingCustomer = await prisma.customer.findUnique({
    where: { id }
  });
  
  if (!existingCustomer) return null;
  
  // Prepare data for Prisma by stringifying the tags array if present
  const prismaUpdates: any = {
    ...updates
  };
  
  if (updates.tags) {
    prismaUpdates.tags = stringifyTagsToJSON(updates.tags);
  }
  
  // Remove relations from direct updates as they need to be handled separately
  if ('contacts' in prismaUpdates) delete prismaUpdates.contacts;
  if ('tasks' in prismaUpdates) delete prismaUpdates.tasks;
  if ('shipments' in prismaUpdates) delete prismaUpdates.shipments;
  if ('orders' in prismaUpdates) delete prismaUpdates.orders;
  
  const updatedCustomer = await prisma.customer.update({
    where: { id },
    data: prismaUpdates
  });
  
  return {
    ...updatedCustomer,
    tags: updatedCustomer.tags ? parseTagsFromJSON(updatedCustomer.tags) : []
  };
}

export async function deleteCustomer(id: string): Promise<boolean> {
  try {
    await prisma.customer.delete({
      where: { id }
    });
    return true;
  } catch (error) {
    console.error('Failed to delete customer:', error);
    return false;
  }
}

export async function searchCustomers(query: string): Promise<Customer[]> {
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
    .map((customer: any) => ({
      ...customer,
      tags: customer.tags ? parseTagsFromJSON(customer.tags) : []
    }))
    .filter((customer: any) => {
      // If no tags, skip tag filtering
      if (!query || !customer.tags || customer.tags.length === 0) {
        return true;
      }
      
      // Check if any tag contains the query
      return customer.tags.some((tag: string) => tag.toLowerCase().includes(lowerQuery));
    });
}

// Advanced filtering
export async function filterCustomersByTag(tag: string): Promise<Customer[]> {
  const customers = await getCustomers();
  return customers.filter(c => 
    c.tags && c.tags.includes(tag)
  );
}

export async function filterCustomersByIndustry(industry: string): Promise<Customer[]> {
  return prisma.customer.findMany({
    where: { industry }
  }).then((customers: any) => customers.map((customer: any) => ({
    ...customer,
    tags: customer.tags ? parseTagsFromJSON(customer.tags) : []
  })));
}

export async function filterCustomersByCountry(country: string): Promise<Customer[]> {
  return prisma.customer.findMany({
    where: { country }
  }).then((customers: any) => customers.map((customer: any) => ({
    ...customer,
    tags: customer.tags ? parseTagsFromJSON(customer.tags) : []
  })));
}

export async function addTagToCustomer(id: string, tag: string): Promise<Customer | null> {
  const customer = await getCustomerById(id);
  if (!customer) return null;
  
  const tags = customer.tags || [];
  if (!tags.includes(tag)) {
    tags.push(tag);
    return updateCustomer(id, { tags });
  }
  
  return customer;
}

export async function removeTagFromCustomer(id: string, tag: string): Promise<Customer | null> {
  const customer = await getCustomerById(id);
  if (!customer || !customer.tags) return null;
  
  const tags = customer.tags.filter(t => t !== tag);
  return updateCustomer(id, { tags });
}

export async function addContactToCustomer(
  customerId: string, 
  contactData: Omit<CreateContact, 'customerId'>
): Promise<Contact | null> {
  try {
    const contact = await prisma.contact.create({
      data: {
        ...contactData,
        customerId
      }
    });
    
    return contact;
  } catch (error) {
    console.error('Failed to add contact:', error);
    return null;
  }
}

export async function removeContactFromCustomer(customerId: string, contactId: string): Promise<boolean> {
  try {
    await prisma.contact.delete({
      where: {
        id: contactId,
        customerId
      }
    });
    
    return true;
  } catch (error) {
    console.error('Failed to remove contact:', error);
    return false;
  }
}
