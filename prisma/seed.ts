import { PrismaClient } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting seed...');

  // Create sample customers
  const customer1 = await prisma.customer.create({
    data: {
      id: uuidv4(),
      name: 'John Smith',
      email: 'john.smith@techcorp.com',
      phone: '+1-555-0101',
      company: 'TechCorp Solutions',
      address: '123 Tech Street',
      city: 'San Francisco',
      state: 'CA',
      zipCode: '94102',
      country: 'US',
      website: 'https://techcorp.com',
      vatNumber: 'US123456789',
      industry: 'Technology',
      tags: JSON.stringify(['premium', 'enterprise', 'tech']),
      notes: 'Premium enterprise customer with high volume requirements',
    },
  });

  const customer2 = await prisma.customer.create({
    data: {
      id: uuidv4(),
      name: 'Sarah Johnson',
      email: 'sarah.johnson@retailplus.com',
      phone: '+1-555-0102',
      company: 'RetailPlus Inc',
      address: '456 Commerce Ave',
      city: 'New York',
      state: 'NY',
      zipCode: '10001',
      country: 'US',
      website: 'https://retailplus.com',
      industry: 'Retail',
      tags: JSON.stringify(['retail', 'volume']),
      notes: 'Large retail chain with seasonal volume spikes',
    },
  });

  // Create contacts for customers
  await prisma.contact.create({
    data: {
      id: uuidv4(),
      customerId: customer1.id,
      name: 'John Smith',
      email: 'john.smith@techcorp.com',
      phone: '+1-555-0101',
      role: 'CEO',
      isPrimary: true,
    },
  });

  await prisma.contact.create({
    data: {
      id: uuidv4(),
      customerId: customer1.id,
      name: 'Jane Doe',
      email: 'jane.doe@techcorp.com',
      phone: '+1-555-0103',
      role: 'CTO',
      isPrimary: false,
    },
  });

  await prisma.contact.create({
    data: {
      id: uuidv4(),
      customerId: customer2.id,
      name: 'Sarah Johnson',
      email: 'sarah.johnson@retailplus.com',
      phone: '+1-555-0102',
      role: 'Operations Manager',
      isPrimary: true,
    },
  });

  // Create sample orders
  const order1 = await prisma.order.create({
    data: {
      id: uuidv4(),
      orderNumber: 'ORD-2025-001',
      customerId: customer1.id,
      status: 'PROCESSING',
      orderDate: new Date('2025-01-15'),
      dueDate: new Date('2025-02-15'),
      totalAmount: 2500.00,
      notes: 'Rush order for Q1 deployment',
    },
  });

  const order2 = await prisma.order.create({
    data: {
      id: uuidv4(),
      orderNumber: 'ORD-2025-002',
      customerId: customer2.id,
      status: 'CONFIRMED',
      orderDate: new Date('2025-01-20'),
      dueDate: new Date('2025-03-01'),
      totalAmount: 5000.00,
      notes: 'Seasonal inventory restock',
    },
  });

  // Create order items
  await prisma.orderItem.createMany({
    data: [
      {
        id: uuidv4(),
        orderId: order1.id,
        productName: 'Enterprise Software License',
        description: 'Annual enterprise license for 100 users',
        quantity: 1,
        unitPrice: 2000.00,
        totalPrice: 2000.00,
      },
      {
        id: uuidv4(),
        orderId: order1.id,
        productName: 'Professional Services',
        description: 'Setup and configuration services',
        quantity: 10,
        unitPrice: 50.00,
        totalPrice: 500.00,
      },
      {
        id: uuidv4(),
        orderId: order2.id,
        productName: 'Retail Widget Pro',
        description: 'Premium retail widgets for stores',
        quantity: 100,
        unitPrice: 25.00,
        totalPrice: 2500.00,
      },
      {
        id: uuidv4(),
        orderId: order2.id,
        productName: 'Widget Accessories',
        description: 'Essential accessories for retail widgets',
        quantity: 200,
        unitPrice: 12.50,
        totalPrice: 2500.00,
      },
    ],
  });

  // Create sample shipments
  const shipment1 = await prisma.shipment.create({
    data: {
      id: uuidv4(),
      trackingNumber: 'TRK-2025-001',
      customerId: customer1.id,
      origin: 'San Francisco, CA',
      destination: 'San Francisco, CA',
      carrier: 'FedEx',
      status: 'IN_TRANSIT',
      estimatedDelivery: new Date('2025-02-01'),
      weight: 5.5,
      dimensions: JSON.stringify({ length: 12, width: 8, height: 6 }),
      value: 2500.00,
      insurance: 100.00,
      notes: 'Handle with care - fragile contents',
    },
  });

  const shipment2 = await prisma.shipment.create({
    data: {
      id: uuidv4(),
      trackingNumber: 'TRK-2025-002',
      customerId: customer2.id,
      origin: 'Los Angeles, CA',
      destination: 'New York, NY',
      carrier: 'UPS',
      status: 'PENDING',
      estimatedDelivery: new Date('2025-02-28'),
      weight: 150.0,
      dimensions: JSON.stringify({ length: 48, width: 36, height: 24 }),
      value: 5000.00,
      insurance: 250.00,
      notes: 'Bulk shipment - multiple packages',
    },
  });

  // Create sample tasks
  await prisma.task.createMany({
    data: [
      {
        id: uuidv4(),
        title: 'Configure enterprise software',
        description: 'Set up and configure the enterprise software for TechCorp',
        priority: 'HIGH',
        status: 'IN_PROGRESS',
        dueDate: new Date('2025-02-01'),
        assignedTo: 'Tech Team Lead',
        customerId: customer1.id,
        orderId: order1.id,
        tags: JSON.stringify(['setup', 'configuration', 'enterprise']),
        estimatedHours: 20.0,
        actualHours: 8.0,
      },
      {
        id: uuidv4(),
        title: 'Prepare shipment documentation',
        description: 'Generate all required shipping documents and labels',
        priority: 'MEDIUM',
        status: 'PENDING',
        dueDate: new Date('2025-01-30'),
        assignedTo: 'Shipping Coordinator',
        customerId: customer1.id,
        shipmentId: shipment1.id,
        tags: JSON.stringify(['shipping', 'documentation']),
        estimatedHours: 2.0,
      },
      {
        id: uuidv4(),
        title: 'Quality check for retail widgets',
        description: 'Perform quality assurance on retail widget order',
        priority: 'HIGH',
        status: 'PENDING',
        dueDate: new Date('2025-02-20'),
        assignedTo: 'QA Team',
        customerId: customer2.id,
        orderId: order2.id,
        tags: JSON.stringify(['quality', 'inspection', 'retail']),
        estimatedHours: 15.0,
      },
      {
        id: uuidv4(),
        title: 'Follow up on delivery',
        description: 'Contact customer to confirm delivery and satisfaction',
        priority: 'LOW',
        status: 'PENDING',
        dueDate: new Date('2025-03-01'),
        assignedTo: 'Customer Success',
        customerId: customer2.id,
        shipmentId: shipment2.id,
        tags: JSON.stringify(['follow-up', 'customer-service']),
        estimatedHours: 1.0,
      },
    ],
  });

  console.log('✅ Seed completed successfully!');
  console.log('📊 Created:');
  console.log('  - 2 Customers');
  console.log('  - 3 Contacts');
  console.log('  - 2 Orders');
  console.log('  - 4 Order Items');
  console.log('  - 2 Shipments');
  console.log('  - 4 Tasks');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
