import { PrismaClient } from '@prisma/client';

type ProductTypeValue =
  | 'ENGINE_OIL'
  | 'GEAR_OIL'
  | 'HYDRAULIC_OIL'
  | 'GREASE'
  | 'INDUSTRIAL_OILS';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Clear existing data
  await prisma.cartItem.deleteMany();
  await prisma.cart.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.review.deleteMany();
  await prisma.product.deleteMany();
  await prisma.vehicleProfile.deleteMany();
  await prisma.user.deleteMany();
  await prisma.vehicleCompatibility.deleteMany();

  // Create engine oils
  const engineOils = await Promise.all([
    prisma.product.create({
      data: {
        name: 'Valvoline Advanced Full Synthetic 5W-30',
        slug: 'valvoline-advanced-full-synthetic-5w30',
        description: 'Premium full synthetic engine oil for modern vehicles',
        longDescription: 'Advanced full synthetic formulation provides superior protection and performance for modern vehicles. Exceeds all major OEM specifications.',
        type: 'ENGINE_OIL' as ProductTypeValue,
        viscosity: '5W-30',
        quantity: 1000,
        quantityUnit: 'ml',
        price: 599,
        bulkPrice: 499,
        image: '/valvoline-synpower-5w40-5l.png',
        images: JSON.stringify([
          '/valvoline-synpower-5w40-5l.png',
        ]),
        sku: 'VLV-ENG-5W30-1L',
        featured: true,
        active: true,
        stock: 200,
        vehicleTypes: JSON.stringify(['Car', 'Bike']),
        benefits: JSON.stringify([
          'Superior protection',
          'Better fuel economy',
          'Cleaner engine',
          'Longer oil life',
        ]),
        specifications: JSON.stringify([
          'API SN Plus',
          'ILSAC GF-6A',
          'Cold flow: -35°C',
          'High temperature: 100°C',
        ]),
      },
    }),
    prisma.product.create({
      data: {
        name: 'Valvoline SynPower 4T 10W-40',
        slug: 'valvoline-synpower-4t-10w40',
        description: 'Premium synthetic motorcycle engine oil for smooth response and stronger heat stability.',
        longDescription: 'SynPower 4T 10W-40 is the premium bike option in the lineup, built for riders who want smoother performance through traffic, mixed-road use, and longer runs.',
        type: 'ENGINE_OIL' as ProductTypeValue,
        viscosity: '10W-40',
        quantity: 1000,
        quantityUnit: 'ml',
        price: 749,
        bulkPrice: 679,
        image: '/synpower-4t-10w-40.webp',
        images: JSON.stringify([
          '/synpower-4t-10w-40.webp',
        ]),
        sku: 'VLV-SYN4T-10W40-1L',
        featured: true,
        active: true,
        stock: 140,
        vehicleTypes: JSON.stringify(['Bike']),
        benefits: JSON.stringify([
          'Synthetic protection',
          'Smooth clutch response',
          'Heat stability',
          'Cleaner engine operation',
        ]),
        specifications: JSON.stringify([
          'Synthetic 4T formulation',
          'Motorcycle-ready wear protection',
          'Balanced hot and cold response',
        ]),
      },
    }),
    prisma.product.create({
      data: {
        name: 'Valvoline Champ 4T Fuel Efficient',
        slug: 'valvoline-champ-4t-fuel-efficient',
        description: 'Fuel-efficient 4T oil for everyday commuter bikes and routine service intervals.',
        longDescription: 'Champ 4T Fuel Efficient is a strong everyday recommendation for commuter motorcycles that need reliable stop-start protection and practical workshop-friendly performance.',
        type: 'ENGINE_OIL' as ProductTypeValue,
        viscosity: '10W-30',
        quantity: 1000,
        quantityUnit: 'ml',
        price: 449,
        bulkPrice: 389,
        image: '/champ-4t.webp',
        images: JSON.stringify([
          '/champ-4t.webp',
        ]),
        sku: 'VLV-CHAMP4T-FE-1L',
        featured: true,
        active: true,
        stock: 220,
        vehicleTypes: JSON.stringify(['Bike']),
        benefits: JSON.stringify([
          'Fuel-efficient running',
          'Reliable city-bike protection',
          'Smooth pickup feel',
          'Cleaner everyday operation',
        ]),
        specifications: JSON.stringify([
          '4T commuter blend',
          'Bike-focused wear protection',
          'Balanced performance for everyday riding',
        ]),
      },
    }),
    prisma.product.create({
      data: {
        name: 'Valvoline Fit 4T 20W-40',
        slug: 'valvoline-fit-4t-20w40',
        description: 'Dependable bike engine oil for commuter motorcycles that need balanced viscosity and daily wear protection.',
        longDescription: 'Fit 4T 20W-40 is built for the core commuter-bike segment and works well for regular service cycles, city traffic, and value-focused maintenance.',
        type: 'ENGINE_OIL' as ProductTypeValue,
        viscosity: '20W-40',
        quantity: 1000,
        quantityUnit: 'ml',
        price: 399,
        bulkPrice: 349,
        image: '/fit-_4t_20w40-_1l.webp',
        images: JSON.stringify([
          '/fit-_4t_20w40-_1l.webp',
        ]),
        sku: 'VLV-FIT4T-20W40-1L',
        featured: true,
        active: true,
        stock: 260,
        vehicleTypes: JSON.stringify(['Bike']),
        benefits: JSON.stringify([
          'Balanced viscosity',
          'Daily wear protection',
          'Smooth running in traffic',
          'Workshop-friendly value',
        ]),
        specifications: JSON.stringify([
          '20W-40 grade',
          '4T commuter formulation',
          'Built for everyday two-wheeler service',
        ]),
      },
    }),
    prisma.product.create({
      data: {
        name: 'Valvoline 4T Premium 20W-50',
        slug: 'valvoline-4t-premium-20w50',
        description: 'Thicker motorcycle oil for bikes that run hotter or need a stronger 20W-50 recommendation.',
        longDescription: '4T Premium 20W-50 is positioned for older bikes, hotter riding conditions, and motorcycles that benefit from a heavier lubricating film under load.',
        type: 'ENGINE_OIL' as ProductTypeValue,
        viscosity: '20W-50',
        quantity: 1000,
        quantityUnit: 'ml',
        price: 499,
        bulkPrice: 439,
        image: '/4t_premium_20w50.webp',
        images: JSON.stringify([
          '/4t_premium_20w50.webp',
        ]),
        sku: 'VLV-4TPREM-20W50-1L',
        featured: true,
        active: true,
        stock: 170,
        vehicleTypes: JSON.stringify(['Bike']),
        benefits: JSON.stringify([
          'Stronger oil film',
          'Heat-ready stability',
          'Dependable wear protection',
          'Confident heavy-use support',
        ]),
        specifications: JSON.stringify([
          '20W-50 grade',
          '4T bike formulation',
          'Built for higher-heat operation',
        ]),
      },
    }),
    prisma.product.create({
      data: {
        name: 'Valvoline High Mileage 10W-40',
        slug: 'valvoline-high-mileage-10w40',
        description: 'Specially formulated for vehicles with 75,000+ miles',
        longDescription: 'Contains extra detergents and seal conditioners to help reduce leaks and prevent sludge buildup in higher mileage engines.',
        type: 'ENGINE_OIL' as ProductTypeValue,
        viscosity: '10W-40',
        quantity: 1000,
        quantityUnit: 'ml',
        price: 449,
        bulkPrice: 379,
        image: 'https://via.placeholder.com/300x400?text=10W-40+Oil',
        images: JSON.stringify([
          'https://via.placeholder.com/300x400?text=10W-40+Oil',
          'https://via.placeholder.com/300x400?text=10W-40+Back',
        ]),
        sku: 'VLV-ENG-10W40-1L',
        featured: false,
        active: true,
        stock: 180,
        vehicleTypes: JSON.stringify(['Car', 'Truck']),
        benefits: JSON.stringify([
          'Reduces oil leaks',
          'Prevents sludge',
          'Enhanced protection',
          'Better seal conditioning',
        ]),
        specifications: JSON.stringify([
          'API SN',
          'ILSAC GF-5',
          'Cold flow: -25°C',
          'High temperature: 100°C',
        ]),
      },
    }),
  ]);

  // Create gear oils
  const gearOils = await Promise.all([
    prisma.product.create({
      data: {
        name: 'Valvoline Gear Oil SAE 80W-90',
        slug: 'valvoline-gear-oil-80w90',
        description: 'Premium gear oil for manual transmissions and differentials',
        type: 'GEAR_OIL' as ProductTypeValue,
        viscosity: '80W-90',
        quantity: 1000,
        quantityUnit: 'ml',
        price: 549,
        bulkPrice: 449,
        image: 'https://via.placeholder.com/300x400?text=Gear+Oil',
        sku: 'VLV-GEAR-80W90-1L',
        featured: false,
        active: true,
        stock: 150,
        vehicleTypes: JSON.stringify(['Car', 'Truck', 'Bike']),
        benefits: JSON.stringify([
          'Smooth shifting',
          'Better protection',
          'Extended drain intervals',
        ]),
      },
    }),
    prisma.product.create({
      data: {
        name: 'Valvoline Synthetic Gear Oil 75W-110',
        slug: 'valvoline-synthetic-gear-110',
        description: 'Full synthetic for extreme pressure conditions',
        type: 'GEAR_OIL' as ProductTypeValue,
        viscosity: '75W-110',
        quantity: 1000,
        quantityUnit: 'ml',
        price: 699,
        bulkPrice: 579,
        image: 'https://via.placeholder.com/300x400?text=Synthetic+Gear',
        sku: 'VLV-GEAR-75W110-1L',
        featured: false,
        active: true,
        stock: 120,
        vehicleTypes: JSON.stringify(['Truck', 'Car']),
        benefits: JSON.stringify([
          'Extreme pressure protection',
          'Longer service life',
          'Better thermal stability',
        ]),
      },
    }),
  ]);

  // Create greases
  const greases = await Promise.all([
    prisma.product.create({
      data: {
        name: 'Valvoline Multi-Purpose Grease NLGI 2',
        slug: 'valvoline-multipurpose-grease',
        description: 'General purpose grease for all applications',
        type: 'GREASE' as ProductTypeValue,
        quantity: 500,
        quantityUnit: 'gm',
        price: 299,
        bulkPrice: 249,
        image: 'https://via.placeholder.com/300x400?text=Grease+NLGI2',
        sku: 'VLV-GREASE-NLGI2-500G',
        featured: true,
        active: true,
        stock: 300,
        vehicleTypes: JSON.stringify(['Car', 'Bike', 'Truck']),
        benefits: JSON.stringify([
          'Universal application',
          'Water resistant',
          'Long service life',
        ]),
      },
    }),
    prisma.product.create({
      data: {
        name: 'Valvoline Chassis Grease EP',
        slug: 'valvoline-chassis-grease-ep',
        description: 'Heavy duty grease for chassis and joint applications',
        type: 'GREASE' as ProductTypeValue,
        quantity: 500,
        quantityUnit: 'gm',
        price: 399,
        bulkPrice: 329,
        image: 'https://via.placeholder.com/300x400?text=Chassis+Grease',
        sku: 'VLV-GREASE-CHASSIS-500G',
        featured: false,
        active: true,
        stock: 200,
        vehicleTypes: JSON.stringify(['Truck', 'Car']),
        benefits: JSON.stringify([
          'Extreme pressure protection',
          'Heavy load capacity',
          'Temperature resistance',
        ]),
      },
    }),
  ]);

  // Create hydraulic oils
  const hydraulicOils = await Promise.all([
    prisma.product.create({
      data: {
        name: 'Valvoline Hydraulic Oil ISO 32',
        slug: 'valvoline-hydraulic-iso32',
        description: 'Industrial hydraulic fluid for machinery and equipment',
        type: 'HYDRAULIC_OIL' as ProductTypeValue,
        quantity: 1000,
        quantityUnit: 'ml',
        price: 399,
        bulkPrice: 349,
        image: 'https://via.placeholder.com/300x400?text=Hydraulic+ISO32',
        sku: 'VLV-HYD-ISO32-1L',
        featured: false,
        active: true,
        stock: 250,
        vehicleTypes: JSON.stringify(['Truck', 'Car']),
        benefits: JSON.stringify([
          'Optimal viscosity',
          'Anti-foam properties',
          'Corrosion protection',
        ]),
      },
    }),
    prisma.product.create({
      data: {
        name: 'Valvoline Hydraulic Oil ISO 46',
        slug: 'valvoline-hydraulic-iso46',
        description: 'Premium hydraulic fluid for heavy industrial use',
        type: 'HYDRAULIC_OIL' as ProductTypeValue,
        quantity: 1000,
        quantityUnit: 'ml',
        price: 449,
        bulkPrice: 379,
        image: 'https://via.placeholder.com/300x400?text=Hydraulic+ISO46',
        sku: 'VLV-HYD-ISO46-1L',
        featured: false,
        active: true,
        stock: 200,
        vehicleTypes: JSON.stringify(['Truck']),
        benefits: JSON.stringify([
          'Heavy load protection',
          'Temperature stability',
          'Extended bearing life',
        ]),
      },
    }),
  ]);

  // Create industrial oils
  const industrialOils = await Promise.all([
    prisma.product.create({
      data: {
        name: 'Valvoline Industrial Machine Oil',
        slug: 'valvoline-industrial-machine',
        description: 'Versatile machine oil for industrial applications',
        type: 'INDUSTRIAL_OILS' as ProductTypeValue,
        quantity: 1000,
        quantityUnit: 'ml',
        price: 299,
        bulkPrice: 249,
        image: 'https://via.placeholder.com/300x400?text=Industrial+Oil',
        sku: 'VLV-IND-MACHINE-1L',
        featured: false,
        active: true,
        stock: 300,
        vehicleTypes: JSON.stringify(['Truck']),
        benefits: JSON.stringify([
          'Wide application range',
          'Excellent lubrication',
          'Oxidation stability',
        ]),
      },
    }),
  ]);

  // Create sample user with cart
  const user = await prisma.user.create({
    data: {
      name: 'John Doe',
      email: 'john@example.com',
      password: 'hashed_password_here',
      phone: '+91-9876543210',
      role: 'CUSTOMER',
      street: '123 Main St',
      city: 'Mumbai',
      state: 'Maharashtra',
      zipCode: '400001',
      country: 'India',
    },
  });

  // Create cart and add items
  await prisma.cart.create({
    data: {
      userId: user.id,
      items: {
        create: [
          {
            productId: engineOils[0].id,
            quantity: 2,
            price: engineOils[0].price,
          },
          {
            productId: greases[0].id,
            quantity: 1,
            price: greases[0].price,
          },
        ],
      },
    },
  });

  // Create vehicle compatibility data
  await Promise.all([
    prisma.vehicleCompatibility.create({
      data: {
        vehicleType: 'Car',
        brand: 'Honda',
        model: 'Civic',
        year: 2023,
        engine: '1.5L Petrol',
        recommendedProducts: JSON.stringify([engineOils[0].id, gearOils[0].id]),
      },
    }),
    prisma.vehicleCompatibility.create({
      data: {
        vehicleType: 'Car',
        brand: 'Hyundai',
        model: 'i20',
        year: 2023,
        engine: '1.2L Petrol',
        recommendedProducts: JSON.stringify([engineOils[0].id]),
      },
    }),
    prisma.vehicleCompatibility.create({
      data: {
        vehicleType: 'Bike',
        brand: 'Hero',
        model: 'Hero Splendor',
        year: 2023,
        engine: '100cc',
        recommendedProducts: JSON.stringify([engineOils[1].id, greases[0].id]),
      },
    }),
    prisma.vehicleCompatibility.create({
      data: {
        vehicleType: 'Truck',
        brand: 'Tata',
        model: 'Tata 407',
        year: 2023,
        engine: '4.2L Diesel',
        recommendedProducts: JSON.stringify([engineOils[2].id, gearOils[1].id]),
      },
    }),
  ]);

  console.log('✅ Database seed completed successfully!');
  console.log(`Created ${engineOils.length} engine oils`);
  console.log(`Created ${gearOils.length} gear oils`);
  console.log(`Created ${greases.length} greases`);
  console.log(`Created ${hydraulicOils.length} hydraulic oils`);
  console.log(`Created ${industrialOils.length} industrial oils`);
  console.log(`Created 1 sample user: ${user.email}`);
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
