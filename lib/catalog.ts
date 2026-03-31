import { Product, ProductType, Recommendation, VehicleSelection } from '@/types';
import { formatNumber } from '@/lib/utils';

type VehicleType = 'Bike' | 'Car' | 'Truck';

type ProductSeed = Omit<Product, 'id' | 'createdAt' | 'updatedAt'>;

export interface BulkTier {
  title: string;
  range: string;
  discount: string;
  minimumUnits: number;
  description: string;
}

export interface CategoryHighlight {
  title: string;
  href: string;
  description: string;
  accent: string;
}

export interface HomeLineupCard {
  title: string;
  eyebrow: string;
  href: string;
  description: string;
  accent: string;
  surface: string;
  tone: 'light' | 'dark';
  productSlugs: string[];
  bullets: string[];
  kind?: 'products' | 'selector';
}

export interface OrderPreview {
  id: string;
  orderNumber: string;
  date: string;
  status: string;
  total: number;
  items: Array<{ productSlug: string; quantity: number }>;
}

const createSvgPlaceholder = (title: string, subtitle: string, accent = '#F68B2C') => {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="900" height="1200" viewBox="0 0 900 1200">
      <defs>
        <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#170100" />
          <stop offset="100%" stop-color="#3a1206" />
        </linearGradient>
        <linearGradient id="shine" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="${accent}" stop-opacity="0.9" />
          <stop offset="100%" stop-color="#ffce8a" stop-opacity="0.5" />
        </linearGradient>
      </defs>
      <rect width="900" height="1200" rx="48" fill="url(#bg)" />
      <circle cx="160" cy="180" r="120" fill="${accent}" fill-opacity="0.16" />
      <circle cx="760" cy="980" r="220" fill="${accent}" fill-opacity="0.12" />
      <path d="M90 980L360 600L540 760L810 390" stroke="url(#shine)" stroke-width="34" stroke-linecap="round" stroke-linejoin="round" fill="none" opacity="0.5" />
      <rect x="120" y="120" width="660" height="720" rx="36" fill="#0f0a08" fill-opacity="0.7" stroke="${accent}" stroke-opacity="0.2" />
      <rect x="170" y="210" width="220" height="520" rx="24" fill="${accent}" fill-opacity="0.95" />
      <rect x="230" y="280" width="100" height="250" rx="16" fill="#fff2e4" fill-opacity="0.22" />
      <text x="470" y="250" fill="#fff9f0" font-size="64" font-family="Arial, Helvetica, sans-serif" font-weight="700">${title}</text>
      <text x="470" y="335" fill="#ffb66e" font-size="40" font-family="Arial, Helvetica, sans-serif">${subtitle}</text>
      <text x="470" y="430" fill="#f2d9bf" font-size="26" font-family="Arial, Helvetica, sans-serif">Premium lubricants for automotive and industrial applications</text>
      <text x="470" y="500" fill="#f2d9bf" font-size="26" font-family="Arial, Helvetica, sans-serif">Valvoline dealer trusted by retailers and garages</text>
      <rect x="470" y="610" width="260" height="70" rx="18" fill="${accent}" fill-opacity="0.95" />
      <text x="520" y="656" fill="#1b0c04" font-size="28" font-family="Arial, Helvetica, sans-serif" font-weight="700">Valvoline</text>
    </svg>
  `;

  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
};

const makeProduct = (product: ProductSeed): Product => ({
  ...product,
  id: product.slug,
  createdAt: new Date('2026-01-01T00:00:00.000Z'),
  updatedAt: new Date('2026-01-01T00:00:00.000Z'),
});

export const CATEGORY_HIGHLIGHTS: CategoryHighlight[] = [
  {
    title: 'Engine Oil',
    href: '/products?oilType=ENGINE_OIL',
    description: 'Passenger car, bike, and light truck oils with the right viscosity guidance.',
    accent: '#F68B2C',
  },
  {
    title: 'Grease',
    href: '/products?oilType=GREASE',
    description: 'Multipurpose and chassis grease for service bays and workshop use.',
    accent: '#ffb15d',
  },
  {
    title: 'Industrial Oils',
    href: '/products?oilType=INDUSTRIAL_OILS',
    description: 'Hydraulic and machine oils for fleets, plants, and industrial equipment.',
    accent: '#c76c1f',
  },
];

export const HOME_LINEUP_CARDS: HomeLineupCard[] = [
  {
    title: 'Motorcycle Oils',
    eyebrow: 'Two-wheeler range',
    href: '/products?oilType=ENGINE_OIL&vehicleType=Bike',
    description: 'Bike-focused lubricants built around the Champ, Fit, SynPower, and 4T Premium range for daily riders and workshop counters.',
    accent: '#df3b2f',
    surface: 'linear-gradient(145deg, rgba(15,33,68,0.96), rgba(26,67,136,0.9))',
    tone: 'dark',
    productSlugs: ['valvoline-synpower-4t-10w40', 'valvoline-champ-4t-fuel-efficient', 'valvoline-fit-4t-20w40'],
    bullets: ['Champ, Fit, and SynPower', 'Commuter to premium bike viscosities'],
  },
  {
    title: 'Passenger Car Motor Oil',
    eyebrow: 'Passenger car lineup',
    href: '/products?oilType=ENGINE_OIL&vehicleType=Car',
    description: 'Full synthetic and high-mileage picks tailored to modern cars and repeat maintenance visits.',
    accent: '#1d5db8',
    surface: 'linear-gradient(145deg, rgba(232,240,251,0.98), rgba(255,255,255,0.96))',
    tone: 'light',
    productSlugs: ['valvoline-all-climate-10w40'],
    bullets: ['Daily commute viscosities', 'High-kilometre recommendations'],
  },
  {
    title: 'Heavy Duty & Fleet',
    eyebrow: 'Commercial use',
    href: '/products?vehicleType=Truck',
    description: 'Service-bay friendly protection for loaded vehicles, fleet maintenance, and harder operating cycles.',
    accent: '#df3b2f',
    surface: 'linear-gradient(145deg, rgba(255,244,241,0.96), rgba(255,255,255,0.98))',
    tone: 'light',
    productSlugs: ['valvoline-all-climate-10w40', 'valvoline-synthetic-gear-oil-75w110', 'valvoline-hydraulic-oil-iso32'],
    bullets: ['Truck and drivetrain support', 'Built for higher load intervals'],
  },
  {
    title: 'Grease & Gear Protection',
    eyebrow: 'Workshop essentials',
    href: '/products?search=gear',
    description: 'Counter-ready grease and drivetrain products for joints, bearings, gearboxes, and workshop upkeep.',
    accent: '#1d5db8',
    surface: 'linear-gradient(145deg, rgba(244,248,255,0.98), rgba(227,237,251,0.94))',
    tone: 'light',
    productSlugs: ['valvoline-multi-purpose-grease-nlgi2', 'valvoline-gear-oil-80w90', 'valvoline-chassis-grease-ep'],
    bullets: ['Bearings to final drives', 'Multipurpose workshop coverage'],
  },
  {
    title: 'Industrial & Hydraulic',
    eyebrow: 'Plant and equipment',
    href: '/products?search=hydraulic',
    description: 'Hydraulic and machine-oil support for lifts, shop equipment, and industrial service environments.',
    accent: '#df3b2f',
    surface: 'linear-gradient(145deg, rgba(13,23,45,0.98), rgba(38,52,78,0.94))',
    tone: 'dark',
    productSlugs: ['valvoline-hydraulic-oil-iso32', 'valvoline-industrial-machine-oil'],
    bullets: ['Lift and machine support', 'Useful beyond vehicle-only catalogs'],
  },
  {
    title: 'Compatibility Finder',
    eyebrow: 'Smart selection',
    href: '/vehicle-selector',
    description: 'Guide drivers or mechanics through vehicle type, model, and kilometres before recommending a product.',
    accent: '#1d5db8',
    surface: 'linear-gradient(145deg, rgba(255,255,255,0.98), rgba(242,246,252,0.98))',
    tone: 'light',
    productSlugs: ['valvoline-all-climate-10w40'],
    bullets: ['Vehicle, model, and km logic', 'Designed for confident upsell conversations'],
    kind: 'selector',
  },
];

export const BULK_TIERS: BulkTier[] = [
  {
    title: 'Starter',
    range: '10-50 units',
    discount: '10% OFF',
    minimumUnits: 10,
    description: 'Ideal for small garages and retail repeat orders.',
  },
  {
    title: 'Professional',
    range: '50-200 units',
    discount: '20% OFF',
    minimumUnits: 50,
    description: 'Best fit for busy service centres and lubricant dealers.',
  },
  {
    title: 'Enterprise',
    range: '200+ units',
    discount: '30% OFF',
    minimumUnits: 200,
    description: 'Built for distributors, large garages, and fleet operators.',
  },
];

export const RECENT_ORDERS: OrderPreview[] = [
  {
    id: 'order-1',
    orderNumber: 'ORD-VAL-24018',
    date: 'March 12, 2026',
    status: 'Delivered',
    total: 4299,
    items: [
      { productSlug: 'valvoline-all-climate-10w40', quantity: 4 },
      { productSlug: 'valvoline-multi-purpose-grease-nlgi2', quantity: 6 },
    ],
  },
  {
    id: 'order-2',
    orderNumber: 'ORD-VAL-24042',
    date: 'March 20, 2026',
    status: 'Processing',
    total: 8999,
    items: [
      { productSlug: 'valvoline-gear-oil-80w90', quantity: 12 },
      { productSlug: 'valvoline-hydraulic-oil-iso32', quantity: 4 },
    ],
  },
];

const productSeeds: ProductSeed[] = [
  {
  name: 'Valvoline(Bullet Oil)15W-50',
  slug: 'valvoline-advanced-full-synthetic-15w50',
  
  brand: 'Valvoline(Bullet Oil)15W-50',
  description: 'Full synthetic high-performance engine oil specially suited for Royal Enfield and other high-capacity motorcycles.',
  longDescription:
    'Valvoline Advanced Full Synthetic 15W-50 is engineered for high-capacity motorcycles like Royal Enfield that operate under higher heat and load conditions. It provides superior engine protection, maintains viscosity under stress, and ensures smooth performance on long rides and highway cruising.',
  image: "/champ-4t-15w50-bullet-oil.webp",
  images: [
    "/champ-4t-15w50-bullet-oil.webp",
    "/Oil_with_bike.png",
  ],
  type: 'ENGINE_OIL',
  viscosity: '15W-50',
  quantity: 2500,
  quantityUnit: 'ml',
  price: 799,
  bulkPrice: 699,
  discount: 12,
  vehicleTypes: ['Bike'],
  useCase: 'Royal Enfield bikes, long rides, highway cruising, and high-temperature riding conditions',
  benefits: [
    'Strong oil film for heavy engines',
    'Excellent heat resistance',
    'Smooth gear shifting',
    'Enhanced engine life under load'
  ],
  specifications: [
    '15W-50 grade',
    'Full synthetic formulation',
    'API SN / JASO MA2 compliant',
    'High-temperature stability'
  ],
  compatibilityNotes: [
    'Highly recommended for Royal Enfield Classic, Bullet, Meteor, Himalayan, and similar high-capacity bikes'
  ],
  recommendedKmRange: [0, 150000],
  serviceIntervalKm: 8000,
  stock: 180,
  sku: 'VLV-ADV-15W50-2.5L',
  featured: true,
  active: true,
},
  {
    name: 'Valvoline SynPower 4T 10W-40',
    slug: 'valvoline-synpower-4t-10w40',
    brand: 'Valvoline SynPower 4T',
    description: 'Premium synthetic motorcycle engine oil for riders who want smooth response, cleaner running, and heat stability.',
    longDescription:
      'SynPower 4T 10W-40 is the premium bike option in the lineup, suited to riders who expect stronger thermal stability, smooth clutch feel, and confident protection across city traffic and longer highway runs.',
    image: '/synpower-4t-10w-40.webp',
    images: ['/synpower-4t-10w-40.webp', '/Syn_pwer_last.png'],
    type: 'ENGINE_OIL',
    viscosity: '10W-40',
    quantity: 1000,
    quantityUnit: 'ml',
    price: 749,
    bulkPrice: 679,
    discount: 9,
    vehicleTypes: ['Bike'],
    useCase: 'Premium commuter bikes, sporty motorcycles, and riders who face heat and mixed-road use',
    benefits: ['Synthetic protection', 'Smooth clutch response', 'Heat stability', 'Cleaner engine operation'],
    specifications: ['Synthetic 4T formulation', 'Motorcycle-ready wear protection', 'Balanced hot and cold response'],
    compatibilityNotes: ['Best fit for riders upgrading from regular commuter oil to a more premium 10W-40 option'],
    recommendedKmRange: [0, 70000],
    serviceIntervalKm: 7000,
    stock: 140,
    sku: 'VLV-SYN4T-10W40-1L',
    featured: true,
    active: true,
  },
  {
    name: 'Valvoline Champ 4T Fuel Efficient',
    slug: 'valvoline-champ-4t-fuel-efficient',
    brand: 'Valvoline Champ 4T',
    description: 'Fuel-efficient 4T oil designed for daily bike commuting, regular service intervals, and stop-start traffic.',
    longDescription:
      'Champ 4T Fuel Efficient is aimed at the fast-moving commuter segment. It is a dependable recommendation for customers who want a smoother everyday ride, cleaner response in traffic, and a practical engine oil for routine bike maintenance.',
    image: '/champ-4t.webp',
    images: ['/champ-4t.webp', '/champ_4t_Last.png'],
    type: 'ENGINE_OIL',
    viscosity: '10W-30',
    quantity: 1000,
    quantityUnit: 'ml',
    price: 449,
    bulkPrice: 389,
    discount: 13,
    vehicleTypes: ['Bike'],
    useCase: 'Daily commuter bikes and workshop counter sales for frequent service customers',
    benefits: ['Fuel-efficient running', 'Reliable city-bike protection', 'Smooth pickup feel', 'Cleaner everyday operation'],
    specifications: ['4T commuter blend', 'Bike-focused wear protection', 'Balanced performance for everyday riding'],
    compatibilityNotes: ['A strong match for everyday motorcycles that need a lightweight, city-friendly engine oil'],
    recommendedKmRange: [0, 50000],
    serviceIntervalKm: 6000,
    stock: 220,
    sku: 'VLV-CHAMP4T-FE-1L',
    featured: true,
    active: true,
  },
  {
    name: 'Valvoline Fit 4T 20W-40',
    slug: 'valvoline-fit-4t-20w40',
    brand: 'Valvoline Fit 4T',
    description: 'Dependable bike engine oil for commuter motorcycles that need balanced viscosity and daily wear protection.',
    longDescription:
      'Fit 4T 20W-40 sits in the core commuter-bike slot. It is easy to recommend for frequent riders who want a stable, value-focused lubricant that supports smoother operation through daily starts, traffic, and local rides.',
    image: '/fit-_4t_20w40-_1l.webp',
    images: ['/fit-_4t_20w40-_1l.webp', '/fit-4t_last.png'],
    type: 'ENGINE_OIL',
    viscosity: '20W-40',
    quantity: 1000,
    quantityUnit: 'ml',
    price: 399,
    bulkPrice: 349,
    discount: 13,
    vehicleTypes: ['Bike'],
    useCase: 'Commuter bikes, regular city use, and cost-conscious service recommendations',
    benefits: ['Balanced viscosity', 'Daily wear protection', 'Smooth running in traffic', 'Workshop-friendly value'],
    specifications: ['20W-40 grade', '4T commuter formulation', 'Built for everyday two-wheeler service'],
    compatibilityNotes: ['Ideal for routine commuter-bike maintenance where 20W-40 is preferred'],
    recommendedKmRange: [0, 60000],
    serviceIntervalKm: 5000,
    stock: 260,
    sku: 'VLV-FIT4T-20W40-1L',
    featured: true,
    active: true,
  },
  {
    name: 'Valvoline 4T Premium 20W-50',
    slug: 'valvoline-4t-premium-20w50',
    brand: 'Valvoline 4T Premium',
    description: 'Thicker motorcycle oil for bikes that run hotter, carry more load, or need a stronger 20W-50 recommendation.',
    longDescription:
      '4T Premium 20W-50 is positioned for riders and workshops that prefer a heavier bike oil for hotter conditions, older engines, or motorcycles that benefit from a stronger lubricating film under load.',
    image: '/4t_premium_20w50.webp',
    images: ['/4t_premium_20w50.webp', '/4t_Prem_1L_last.png'],
    type: 'ENGINE_OIL',
    viscosity: '20W-50',
    quantity: 1000,
    quantityUnit: 'ml',
    price: 499,
    bulkPrice: 439,
    discount: 12,
    vehicleTypes: ['Bike'],
    useCase: 'Older bikes, hotter weather, longer rides, and motorcycles that need a thicker oil',
    benefits: ['Stronger oil film', 'Heat-ready stability', 'Dependable wear protection', 'Confident heavy-use support'],
    specifications: ['20W-50 grade', '4T bike formulation', 'Built for higher-heat operation'],
    compatibilityNotes: ['A better fit for bikes that perform well on a thicker motorcycle oil'],
    recommendedKmRange: [15000, 120000],
    serviceIntervalKm: 6000,
    stock: 170,
    sku: 'VLV-4TPREM-20W50-1L',
    featured: true,
    active: true,
  },
  {
  name: 'ChampExtra Scooter oil 10W-30',
  slug: 'ChampExtra-scooter-oil-10w30',
  brand: 'champ–Extra Scooter oil',
  description: 'High-quality scooter engine oil designed for smooth city rides, better fuel efficiency, and reliable engine protection.',
  longDescription:
    'Valvoline Champ-Extra Scooter Premium oil 10W-30 is specially formulated for modern scooters operating in stop-and-go city traffic. It ensures smooth acceleration, reduced engine wear, and improved fuel efficiency, making it ideal for daily commuting and urban riding conditions.',
  image: '/champ_Extra.webp',
  images: ['/champ_Extra.webp', '/champExtra_last.png'],
  type: 'ENGINE_OIL', 
  viscosity: '10W-30',
  quantity: 800,
  quantityUnit: 'ml',
  price: 459,
  bulkPrice: 409,
  discount: 11,
  vehicleTypes: ['Bike'],
  useCase: 'Daily commuting, city riding, stop-and-go traffic, and modern scooters requiring smoother performance',
  benefits: [
    'Smooth acceleration',
    'Improved fuel efficiency',
    'Enhanced engine cleanliness',
    'Reliable wear protection in traffic conditions'
  ],
  specifications: [
    '10W-30 grade',
    '4T scooter-specific formulation',
    'Optimized for urban riding conditions'
  ],
  compatibilityNotes: [
    'Recommended for most modern scooters using 10W-30 engine oil'
  ],
  recommendedKmRange: [0, 80000],
  serviceIntervalKm: 5000,
  stock: 150,
  sku: 'VLV-4TSCOOT-10W30-0.8L',
  featured: true,
  active: true,
},
  {
    name: 'Valvoline 4T Premium 20W-50-1.2L',
    slug: 'valvoline-4t-premium-20w50-1.2L',
    brand: 'Valvoline 4T Premium 1.2L',
    description: 'Thicker motorcycle oil for bikes that run hotter, carry more load, or need a stronger 20W-50 recommendation.',
    longDescription:
      '4T Premium 20W-50 is positioned for riders and workshops that prefer a heavier bike oil for hotter conditions, older engines, or motorcycles that benefit from a stronger lubricating film under load.',
    image: '/4T_premmium_1,2l_20w50.png',
    images: ['/4T_premmium_1,2l_20w50.png', '/4T_Prem_1.2L_last.png'],
    type: 'ENGINE_OIL',
    viscosity: '20W-50',
    quantity: 1200,
    quantityUnit: 'ml',
    price: 550,
    bulkPrice: 480,
    discount: 12,
    vehicleTypes: ['Bike'],
    useCase: 'Older bikes, hotter weather, longer rides, and motorcycles that need a thicker oil',
    benefits: ['Stronger oil film', 'Heat-ready stability', 'Dependable wear protection', 'Confident heavy-use support'],
    specifications: ['20W-50 grade', '4T bike formulation', 'Built for higher-heat operation'],
    compatibilityNotes: ['A better fit for bikes that perform well on a thicker motorcycle oil'],
    recommendedKmRange: [15000, 120000],
    serviceIntervalKm: 6000,
    stock: 170,
    sku: 'VLV-4TPREM-20W50-1.2L',
    featured: true,
    active: true,
  },
  {
    name: 'Valvoline All Climate 10W-40',
    slug: 'valvoline-all-climate-10w40',
    brand: 'Valvoline All Climate',
    description: 'Formulated for higher-kilometre engines that need extra sealing and wear support.',
    longDescription:
      'A robust choice for vehicles with more kilometres on the odometer. Helps reduce oil consumption, supports smoother operation, and gives garages a reliable recommendation for older engines.',
    image: "/all-climate-premium-10w40-3.5l.webp",
    images: [createSvgPlaceholder('10W-40', 'Front', '#b85c1c'), createSvgPlaceholder('10W-40', 'Mileage Pack', '#b85c1c')],
    type: 'ENGINE_OIL',
    viscosity: '10W-40',
    quantity: 1000,
    quantityUnit: 'ml',
    price: 499,
    bulkPrice: 429,
    discount: 14,
    vehicleTypes: ['Car', 'Truck'],
    useCase: 'Higher mileage cars, older daily drivers, and light commercial use',
    benefits: ['Seal support', 'Reduced consumption', 'Engine cleanliness', 'Balanced protection'],
    specifications: ['API SN', 'High detergency', 'Seal conditioner blend'],
    compatibilityNotes: ['Useful for vehicles with 40,000 km and above'],
    recommendedKmRange: [40000, 200000],
    serviceIntervalKm: 10000,
    stock: 160,
    sku: 'VLV-ENG-10W40-1L',
    featured: true,
    active: true,
  },
  {
    name: 'Valvoline Gear Oil SAE 80W-90',
    slug: 'valvoline-gear-oil-80w90',
    brand: 'Valvoline Gear',
    description: 'Reliable gear oil for manual transmissions, differentials, and drivetrain service.',
    longDescription:
      'A staple for workshops servicing transmissions and differentials. It improves smooth gear engagement and keeps metal surfaces protected under load.',
    image: createSvgPlaceholder('80W-90', 'Gear Oil', '#da7a22'),
    images: [createSvgPlaceholder('80W-90', 'Gear Front', '#da7a22')],
    type: 'GEAR_OIL',
    viscosity: '80W-90',
    quantity: 1000,
    quantityUnit: 'ml',
    price: 549,
    bulkPrice: 449,
    discount: 18,
    vehicleTypes: ['Bike', 'Car', 'Truck'],
    useCase: 'Manual transmissions, differentials, and final drives',
    benefits: ['Smooth shifting', 'Pressure resistance', 'Extended gear life'],
    specifications: ['GL-4/GL-5 style protection', 'EP additives', 'Workshop friendly'],
    compatibilityNotes: ['Suitable for service bays and fleet maintenance'],
    serviceIntervalKm: 30000,
    stock: 150,
    sku: 'VLV-GEAR-80W90-1L',
    featured: false,
    active: true,
  },
  {
    name: 'Valvoline Synthetic Gear Oil 75W-110',
    slug: 'valvoline-synthetic-gear-oil-75w110',
    brand: 'Valvoline Gear Pro',
    description: 'High-load synthetic gear oil designed for commercial and heavy-duty applications.',
    longDescription:
      'This synthetic gear oil supports heavier loads and hotter operating conditions, making it a smart recommendation for trucks and high-torque drivetrains.',
    image: createSvgPlaceholder('75W-110', 'Synthetic Gear', '#c44d0e'),
    images: [createSvgPlaceholder('75W-110', 'Front', '#c44d0e')],
    type: 'GEAR_OIL',
    viscosity: '75W-110',
    quantity: 1000,
    quantityUnit: 'ml',
    price: 699,
    bulkPrice: 579,
    discount: 17,
    vehicleTypes: ['Car', 'Truck'],
    useCase: 'Heavy-duty gearboxes, loaded vehicles, and heat-stressed drivetrains',
    benefits: ['Extreme pressure support', 'Thermal stability', 'Longer service life'],
    specifications: ['Synthetic EP base', 'Heavy-load protection', 'Fleet ready'],
    compatibilityNotes: ['Best match for trucks and high torque vehicles'],
    serviceIntervalKm: 35000,
    stock: 120,
    sku: 'VLV-GEAR-75W110-1L',
    featured: false,
    active: true,
  },
  {
    name: 'Valvoline Multi-Purpose Grease NLGI 2',
    slug: 'valvoline-multi-purpose-grease-nlgi2',
    brand: 'Valvoline Grease',
    description: 'Universal grease for bearings, joints, and general workshop maintenance.',
    longDescription:
      'A dependable workshop grease used for bearings, chassis points, and service routines. It is easy to recommend for garages serving mixed vehicle types.',
    image: createSvgPlaceholder('NLGI 2', 'Grease', '#f2a65a'),
    images: [createSvgPlaceholder('NLGI 2', 'Front', '#f2a65a')],
    type: 'GREASE',
    quantity: 500,
    quantityUnit: 'gm',
    price: 299,
    bulkPrice: 249,
    discount: 17,
    vehicleTypes: ['Bike', 'Car', 'Truck'],
    useCase: 'Bearings, joints, chassis fittings, and workshop maintenance',
    benefits: ['Water resistance', 'Long service life', 'Universal application'],
    specifications: ['NLGI 2', 'Lithium complex', 'Multipurpose'],
    compatibilityNotes: ['Essential for workshops and service centres'],
    serviceIntervalKm: 20000,
    stock: 300,
    sku: 'VLV-GREASE-NLGI2-500G',
    featured: true,
    active: true,
  },
  {
    name: 'Valvoline Chassis Grease EP',
    slug: 'valvoline-chassis-grease-ep',
    brand: 'Valvoline Heavy Duty',
    description: 'Extreme-pressure chassis grease for load-bearing joints and suspensions.',
    longDescription:
      'For heavier commercial applications, this grease adds load capacity and durability where chassis components need more protection.',
    image: createSvgPlaceholder('EP', 'Chassis Grease', '#bb681e'),
    images: [createSvgPlaceholder('EP', 'Front', '#bb681e')],
    type: 'GREASE',
    quantity: 500,
    quantityUnit: 'gm',
    price: 399,
    bulkPrice: 329,
    discount: 18,
    vehicleTypes: ['Car', 'Truck'],
    useCase: 'Suspension joints, chassis points, and heavy-duty load zones',
    benefits: ['Extreme pressure protection', 'Heavy-load capacity', 'Temperature resistance'],
    specifications: ['EP additive package', 'Heavy-duty chassis use'],
    compatibilityNotes: ['Great for commercial fleets and large service centres'],
    serviceIntervalKm: 25000,
    stock: 200,
    sku: 'VLV-GREASE-CHASSIS-500G',
    featured: false,
    active: true,
  },
  {
    name: 'Valvoline Hydraulic Oil ISO 32',
    slug: 'valvoline-hydraulic-oil-iso32',
    brand: 'Valvoline Industrial',
    description: 'Hydraulic fluid for fleet equipment, lift systems, and industrial machinery.',
    longDescription:
      'Built for hydraulic systems that need reliable anti-wear performance and smooth fluid response in temperature changes.',
    image: createSvgPlaceholder('ISO 32', 'Hydraulic', '#e27b24'),
    images: [createSvgPlaceholder('ISO 32', 'Front', '#e27b24')],
    type: 'HYDRAULIC_OIL',
    viscosity: 'ISO 32',
    quantity: 1000,
    quantityUnit: 'ml',
    price: 399,
    bulkPrice: 349,
    discount: 13,
    vehicleTypes: ['Truck', 'Car'],
    useCase: 'Hydraulic lifts, equipment, and workshop machinery',
    benefits: ['Anti-wear protection', 'Stable flow', 'Foam control'],
    specifications: ['ISO 32', 'Anti-foam', 'Corrosion resistant'],
    compatibilityNotes: ['A core pickup for garages with hydraulic equipment'],
    serviceIntervalKm: 40000,
    stock: 250,
    sku: 'VLV-HYD-ISO32-1L',
    featured: false,
    active: true,
  },
  {
    name: 'Valvoline Industrial Machine Oil',
    slug: 'valvoline-industrial-machine-oil',
    brand: 'Valvoline Industrial',
    description: 'Versatile machine oil for plant equipment, pumps, and general industrial service.',
    longDescription:
      'A flexible service oil for industrial use where oxidation stability and dependable lubrication are more important than vehicle compatibility.',
    image: createSvgPlaceholder('IND', 'Machine Oil', '#8f4214'),
    images: [createSvgPlaceholder('IND', 'Front', '#8f4214')],
    type: 'INDUSTRIAL_OILS',
    quantity: 1000,
    quantityUnit: 'ml',
    price: 299,
    bulkPrice: 249,
    discount: 17,
    vehicleTypes: ['Truck'],
    useCase: 'Industrial equipment, pumps, and light machinery',
    benefits: ['Oxidation stability', 'General lubrication', 'Wide application range'],
    specifications: ['Industrial grade', 'Machine oil class'],
    compatibilityNotes: ['Best for industrial fleets and workshop machinery'],
    serviceIntervalKm: 50000,
    stock: 300,
    sku: 'VLV-IND-MACHINE-1L',
    featured: false,
    active: true,
  },
];

export const PRODUCT_CATALOG: Product[] = productSeeds.map(makeProduct);

const recommendationProfiles: Record<VehicleType, { model: string; productSlugs: string[]; note: string }[]> = {
  Bike: [
    {
      model: 'Honda CB Shine',
      productSlugs: ['valvoline-champ-4t-fuel-efficient', 'valvoline-fit-4t-20w40'],
      note: 'A practical commuter-bike pairing for smooth daily riding and regular workshop service intervals.',
    },
    {
      model: 'Hero Splendor',
      productSlugs: ['valvoline-fit-4t-20w40', 'valvoline-champ-4t-fuel-efficient'],
      note: 'Built around popular commuter-bike viscosities for city-focused riding and value-conscious maintenance.',
    },
    {
      model: 'Royal Enfield Classic',
      productSlugs: ['valvoline-4t-premium-20w50', 'valvoline-synpower-4t-10w40'],
      note: 'Heavier bikes usually need a stronger heat-handling oil recommendation with a premium backup option.',
    },
  ],
  Car: [
    {
      model: 'Hyundai Creta',
      productSlugs: ['valvoline-all-climate-10w40', 'valvoline-gear-oil-80w90'],
      note: 'Modern SUVs benefit from a dependable passenger-car engine oil and matching drivetrain protection.',
    },
    {
      model: 'Honda City',
      productSlugs: ['valvoline-all-climate-10w40', 'valvoline-multi-purpose-grease-nlgi2'],
      note: 'A reliable everyday recommendation for passenger-car service visits and repeat maintenance.',
    },
    {
      model: 'Toyota Innova',
      productSlugs: ['valvoline-all-climate-10w40', 'valvoline-synthetic-gear-oil-75w110'],
      note: 'A strong fit for family and fleet vehicles that see long-haul use.',
    },
  ],
  Truck: [
    {
      model: 'Tata 407',
      productSlugs: ['valvoline-all-climate-10w40', 'valvoline-synthetic-gear-oil-75w110', 'valvoline-hydraulic-oil-iso32'],
      note: 'Commercial workhorses need heavier protection and support fluids.',
    },
    {
      model: 'Volvo FH',
      productSlugs: ['valvoline-all-climate-10w40', 'valvoline-synthetic-gear-oil-75w110'],
      note: 'Long-haul trucks benefit from heat stability and EP gear protection.',
    },
  ],
};

const scoreFromKm = (kmDriven?: number) => {
  if (!kmDriven) return 0;
  if (kmDriven > 120000) return 18;
  if (kmDriven > 60000) return 12;
  if (kmDriven > 25000) return 8;
  return 4;
};

export const getProducts = () => PRODUCT_CATALOG;

export const getFeaturedProducts = () => PRODUCT_CATALOG.filter((product) => product.featured);

export const getProductBySlug = (slug: string) => PRODUCT_CATALOG.find((product) => product.slug === slug);

export const getBrandOptions = () => [...new Set(PRODUCT_CATALOG.map((product) => product.brand))].sort();

export const getViscosityOptions = () =>
  [...new Set(PRODUCT_CATALOG.map((product) => product.viscosity).filter(Boolean) as string[])].sort();

export const getProductsByType = (type: ProductType) => PRODUCT_CATALOG.filter((product) => product.type === type);

export const filterProducts = (filters: {
  search?: string;
  vehicleType?: string;
  oilType?: string;
  viscosity?: string;
  brand?: string;
  minPrice?: number;
  maxPrice?: number;
}) => {
  const search = filters.search?.trim().toLowerCase();
  const inferEngineOilOnly =
    !!filters.vehicleType && !filters.oilType && !search;

  return PRODUCT_CATALOG.filter((product) => {
    if (inferEngineOilOnly && product.type !== 'ENGINE_OIL') return false;
    if (filters.oilType && product.type !== filters.oilType) return false;
    if (filters.viscosity && product.viscosity !== filters.viscosity) return false;
    if (filters.vehicleType && !product.vehicleTypes?.includes(filters.vehicleType)) return false;
    if (filters.brand && product.brand !== filters.brand) return false;
    if (filters.minPrice !== undefined && product.price < filters.minPrice) return false;
    if (filters.maxPrice !== undefined && product.price > filters.maxPrice) return false;

    if (search) {
      const haystack = [
        product.name,
        product.description,
        product.brand,
        product.type.replace(/_/g, ' '),
        product.viscosity,
        product.useCase,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();

      if (!haystack.includes(search)) return false;
    }

    return true;
  });
};

export const getVehicleRecommendations = (selection: VehicleSelection): Recommendation[] => {
  if (!selection.type) return [];

  const selectedType = selection.type as VehicleType;
  const selectedBrand = selection.brand?.toLowerCase();
  const selectedModel = selection.model?.toLowerCase();
  const matches: Recommendation[] = [];

  const exactProfiles = recommendationProfiles[selectedType] || [];
  const exactProfile = selectedModel
    ? exactProfiles.find((profile) => profile.model.toLowerCase() === selectedModel)
    : undefined;

  const candidateProducts = PRODUCT_CATALOG.filter((product) => {
    if (!product.vehicleTypes?.includes(selectedType)) return false;
    if (selectedBrand && product.brand.toLowerCase().includes(selectedBrand)) return true;
    return true;
  });

  candidateProducts.forEach((product) => {
    let score = 48;
    const reasons: string[] = [];

    if (product.vehicleTypes?.includes(selectedType)) {
      score += 12;
      reasons.push(`Compatible with ${selectedType.toLowerCase()}s`);
    }

    if (selectedBrand && product.brand.toLowerCase().includes(selectedBrand)) {
      score += 10;
      reasons.push(`Aligned with ${selection.brand}`);
    }

    if (selectedModel && exactProfile && exactProfile.productSlugs.includes(product.slug)) {
      score += 18;
      reasons.push(`${exactProfile.model} reference matched`);
    }

    if (selection.kmDriven) {
      score += scoreFromKm(selection.kmDriven);
      if (product.recommendedKmRange) {
        const [minKm, maxKm] = product.recommendedKmRange;
        if (selection.kmDriven >= minKm && selection.kmDriven <= maxKm) {
          reasons.push(`Fits your ${formatNumber(selection.kmDriven)} km running profile`);
        }
      }
    }

    if (selection.type === 'Bike' && ['10W-30', '10W-40', '20W-40', '20W-50'].includes(product.viscosity || '')) {
      score += 8;
      reasons.push('Configured for common motorcycle viscosity needs');
    }

    if (selection.type === 'Car' && product.viscosity === '5W-30') {
      score += 8;
      reasons.push('Preferred low-viscosity car oil');
    }

    if (selection.type === 'Truck' && (product.viscosity === '10W-40' || product.viscosity === '75W-110')) {
      score += 10;
      reasons.push('Suited to heavy-duty fleet use');
    }

    const note = exactProfile?.note || product.useCase || product.description;

    matches.push({
      product,
      score,
      reason: reasons[0] || note,
      note,
    });
  });

  return matches.sort((a, b) => b.score - a.score).slice(0, 4);
};

export const getRecommendedByOrderHistory = (order: OrderPreview) => {
  return order.items
    .map((item) => {
      const product = getProductBySlug(item.productSlug);
      return product ? { product, quantity: item.quantity } : null;
    })
    .filter(Boolean) as Array<{ product: Product; quantity: number }>;
};
