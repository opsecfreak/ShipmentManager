import { type Customer, type CustomerWithRelations, type CreateCustomer, type Contact, type CreateContact } from "./models.js";
export declare function getCustomers(): Promise<Customer[]>;
export declare function getCustomersWithRelations(): Promise<CustomerWithRelations[]>;
export declare function getCustomerById(id: string): Promise<Customer | null>;
export declare function getCustomerWithRelations(id: string): Promise<CustomerWithRelations | null>;
export declare function addCustomer(customerData: CreateCustomer): Promise<Customer>;
export declare function updateCustomer(id: string, updates: Partial<Customer>): Promise<Customer | null>;
export declare function deleteCustomer(id: string): Promise<boolean>;
export declare function searchCustomers(query: string): Promise<Customer[]>;
export declare function filterCustomersByTag(tag: string): Promise<Customer[]>;
export declare function filterCustomersByIndustry(industry: string): Promise<Customer[]>;
export declare function filterCustomersByCountry(country: string): Promise<Customer[]>;
export declare function addTagToCustomer(id: string, tag: string): Promise<Customer | null>;
export declare function removeTagFromCustomer(id: string, tag: string): Promise<Customer | null>;
export declare function addContactToCustomer(customerId: string, contactData: Omit<CreateContact, 'customerId'>): Promise<Contact | null>;
export declare function removeContactFromCustomer(customerId: string, contactId: string): Promise<boolean>;
//# sourceMappingURL=CustomerManager.d.ts.map