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
  coverImage?: string;
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

export const getProductImage = (
  product: Pick<ProductSeed, 'slug' | 'packageGroup'> & Partial<Pick<ProductSeed, 'image'>>,
): string => {
  const existingImage = product.image?.trim();
  if (existingImage) {
    return existingImage;
  }

  const imageKey = product.packageGroup ?? product.slug;
  return `/products/${imageKey}.webp`;
};

const makeProduct = (product: ProductSeed): Product => {
  const image = getProductImage(product);
  const images = product.images?.length ? product.images : [image];

  return {
    ...product,
    image,
    images,
    id: product.slug,
    createdAt: new Date('2026-01-01T00:00:00.000Z'),
    updatedAt: new Date('2026-01-01T00:00:00.000Z'),
  };
};

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
    coverImage: '/motorcycle_segment_img.png',
    tone: 'dark',
    productSlugs: ['valvoline-synpower-4t-10w40', 'valvoline-champ-4t-fuel-efficient', 'valvoline-fit-4t-20w40'],
    bullets: ['Champ, Fit, and SynPower', 'Commuter to premium bike viscosities'],
  },
  {
    title: 'Passenger Car Motor Oil',
    eyebrow: 'Passenger car lineup',
    href: '/products?oilType=ENGINE_OIL&vehicleType=Car',
    description: 'Everyday 10W-40 and 20W-50 picks tailored to higher-kilometre cars and repeat maintenance visits.',
    accent: '#1d5db8',
    surface: 'linear-gradient(145deg, rgba(232,240,251,0.98), rgba(255,255,255,0.96))',
    coverImage: '/passerger_car_img.png',
    tone: 'light',
    productSlugs: ['valvoline-all-climate-10w40', 'valvoline-universal-20w50'],
    bullets: ['1L to 4L packs', 'High-kilometre recommendations'],
  },
  {
    title: 'Heavy Duty & Fleet',
    eyebrow: 'Commercial use',
    href: '/products?vehicleType=Truck',
    description: 'Service-bay friendly protection for loaded vehicles, fleet maintenance, and harder operating cycles.',
    accent: '#df3b2f',
    surface: 'linear-gradient(145deg, rgba(255,244,241,0.96), rgba(255,255,255,0.98))',
    coverImage: '/heavy_truck_img.png',
    tone: 'light',
    productSlugs: ['valvoline-all-fleet-multi-20w40', 'valvoline-geargard-ep-80w90', 'valvoline-hydraulic-oil-iso32'],
    bullets: ['10L to 20L packs', 'Built for higher load intervals'],
  },
  {
    title: 'Grease & Gear Protection',
    eyebrow: 'Workshop essentials',
    href: '/products?search=gear',
    description: 'Counter-ready grease and drivetrain products for joints, bearings, gearboxes, and workshop upkeep.',
    accent: '#1d5db8',
    surface: 'linear-gradient(145deg, rgba(244,248,255,0.98), rgba(227,237,251,0.94))',
    coverImage: '/Graeseand_gearguard_img.png',
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
    coverImage: '/Hydrolic_instustry_covr_img.png',
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
    productSlugs: ['valvoline-advanced-full-synthetic-5w30'],
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
      { productSlug: 'valvoline-advanced-full-synthetic-5w30', quantity: 4 },
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

export const productSeeds: ProductSeed[] = [
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
    name: 'Valvoline 4T Premium 20W-50',
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
    name: 'Valvoline All Climate 10W-40',
    slug: 'valvoline-all-climate-10w40-3.5l',
    brand: 'Valvoline All Climate',
    description: 'Formulated for higher-kilometre engines that need extra sealing and wear support.',
    longDescription:
      'A robust choice for vehicles with more kilometres on the odometer. Helps reduce oil consumption, supports smoother operation, and gives garages a reliable recommendation for older engines.',
    image: '/all-climate-premium-10w40-3.5l.webp',
    images: [createSvgPlaceholder('10W-40', 'Front', '#b85c1c'), createSvgPlaceholder('10W-40', 'Mileage Pack', '#b85c1c')],
    type: 'ENGINE_OIL',
    viscosity: '10W-40',
    quantity: 3500,
    quantityUnit: 'ml',
    price: 1499,
    bulkPrice: 1349,
    discount: 10,
    vehicleTypes: ['Car', 'Truck'],
    useCase: 'Higher mileage cars, older daily drivers, and light commercial use',
    benefits: ['Seal support', 'Reduced consumption', 'Engine cleanliness', 'Balanced protection'],
    specifications: ['API SN', 'High detergency', 'Seal conditioner blend'],
    compatibilityNotes: ['Useful for vehicles with 40,000 km and above'],
    recommendedKmRange: [40000, 200000],
    serviceIntervalKm: 10000,
    stock: 90,
    sku: 'VLV-ENG-10W40-3.5L',
    featured: false,
    active: true,
  },
  {
    name: 'Valvoline All Climate 10W-40',
    slug: 'valvoline-all-climate-10w40-4l',
    brand: 'Valvoline All Climate',
    description: 'Formulated for higher-kilometre engines that need extra sealing and wear support.',
    longDescription:
      'A robust choice for vehicles with more kilometres on the odometer. Helps reduce oil consumption, supports smoother operation, and gives garages a reliable recommendation for older engines.',
    image: '/all-climate-premium-10w40-3.5l.webp',
    images: [createSvgPlaceholder('10W-40', 'Front', '#b85c1c'), createSvgPlaceholder('10W-40', 'Mileage Pack', '#b85c1c')],
    type: 'ENGINE_OIL',
    viscosity: '10W-40',
    quantity: 4000,
    quantityUnit: 'ml',
    price: 1699,
    bulkPrice: 1549,
    discount: 9,
    vehicleTypes: ['Car', 'Truck'],
    useCase: 'Higher mileage cars, older daily drivers, and light commercial use',
    benefits: ['Seal support', 'Reduced consumption', 'Engine cleanliness', 'Balanced protection'],
    specifications: ['API SN', 'High detergency', 'Seal conditioner blend'],
    compatibilityNotes: ['Useful for vehicles with 40,000 km and above'],
    recommendedKmRange: [40000, 200000],
    serviceIntervalKm: 10000,
    stock: 70,
    sku: 'VLV-ENG-10W40-4L',
    featured: false,
    active: true,
  },
  {
  name: 'Valvoline Universal 20W-50',
  slug: 'valvoline-universal-20w50',
  brand: 'Valvoline Universal',
  description: 'Reliable multi-grade engine oil designed for older cars and vehicles operating under tougher conditions.',
  longDescription:
    'Valvoline Universal 20W-50 is a durable engine oil formulated to provide dependable protection for older engines and vehicles operating in high-temperature or heavy-load conditions. Its thicker viscosity helps maintain oil pressure, reduce engine wear, and ensure consistent performance in demanding environments. Ideal for daily drivers, taxis, and commercial vehicles that require a strong and stable lubricant.',
  image: "/universal.webp",
  images: [
    createSvgPlaceholder('20W-50', 'Front'),
    createSvgPlaceholder('20W-50', 'Back'),
    createSvgPlaceholder('20W-50', 'Workshop'),
  ],
  type: 'ENGINE_OIL',
  viscosity: '20W-50',
  quantity: 3000, // based on image (3L)
  quantityUnit: 'ml',
  price: 999,
  bulkPrice: 899,
  discount: 10,
  vehicleTypes: ['Car', 'Truck'],
  useCase: 'Older cars, high-temperature driving, taxis, and commercial vehicles',
  benefits: [
    'Strong oil film for engine protection',
    'Maintains oil pressure in older engines',
    'Good heat resistance',
    'Reliable performance under heavy load'
  ],
  specifications: [
    '20W-50 grade',
    'API SM/CF',
    'Multi-grade engine oil',
    'Suitable for petrol and diesel engines'
  ],
  compatibilityNotes: [
    'Best suited for older engines or vehicles requiring thicker viscosity oil'
  ],
  recommendedKmRange: [50000, 250000],
  serviceIntervalKm: 8000,
  stock: 140,
  sku: 'VLV-UNI-20W50-3L',
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
    image: "/geargard-80w90-1L.webp",
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
    name: 'Valvoline Gear Oil SAE 80W-90',
    slug: 'valvoline-gear-oil-80w90-4l',
    brand: 'Valvoline Gear',
    description: 'Reliable gear oil for manual transmissions, differentials, and drivetrain service.',
    longDescription:
      'A staple for workshops servicing transmissions and differentials. It improves smooth gear engagement and keeps metal surfaces protected under load.',
    image: '/geargard-80w90-1L.webp',
    images: [createSvgPlaceholder('80W-90', 'Gear Pack', '#da7a22')],
    type: 'GEAR_OIL',
    viscosity: '80W-90',
    quantity: 4000,
    quantityUnit: 'ml',
    price: 1999,
    bulkPrice: 1799,
    discount: 10,
    vehicleTypes: ['Bike', 'Car', 'Truck'],
    useCase: 'Manual transmissions, differentials, and final drives',
    benefits: ['Smooth shifting', 'Pressure resistance', 'Extended gear life'],
    specifications: ['GL-4/GL-5 style protection', 'EP additives', 'Workshop friendly'],
    compatibilityNotes: ['Suitable for service bays and fleet maintenance'],
    serviceIntervalKm: 30000,
    stock: 80,
    sku: 'VLV-GEAR-80W90-4L',
    featured: false,
    active: true,
  },
  {
    name: 'Valvoline Gear Oil SAE 80W-90',
    slug: 'valvoline-gear-oil-80w90-20l',
    brand: 'Valvoline Gear',
    description: 'Reliable gear oil for manual transmissions, differentials, and drivetrain service.',
    longDescription:
      'A staple for workshops servicing transmissions and differentials. It improves smooth gear engagement and keeps metal surfaces protected under load.',
    image: '/geargard-80w90-1L.webp',
    images: [createSvgPlaceholder('80W-90', 'Drum', '#da7a22')],
    type: 'GEAR_OIL',
    viscosity: '80W-90',
    quantity: 20000,
    quantityUnit: 'ml',
    price: 8899,
    bulkPrice: 8299,
    discount: 7,
    vehicleTypes: ['Car', 'Truck', 'Bus'],
    useCase: 'Manual transmissions, differentials, and final drives',
    benefits: ['Smooth shifting', 'Pressure resistance', 'Extended gear life'],
    specifications: ['GL-4/GL-5 style protection', 'EP additives', 'Workshop friendly'],
    compatibilityNotes: ['Suitable for service bays and fleet maintenance'],
    serviceIntervalKm: 30000,
    stock: 35,
    sku: 'VLV-GEAR-80W90-20L',
    featured: false,
    active: true,
  },
  {
    name: 'Valvoline Multi-Purpose Grease NLGI 2',
    slug: 'valvoline-multi-purpose-grease-nlgi2',
    brand: 'Valvoline Grease',
    packageGroup: 'valvoline-multi-purpose-grease',
    description: 'Universal grease for bearings, joints, and general workshop maintenance.',
    longDescription:
      'A dependable workshop grease used for bearings, chassis points, and service routines. It is easy to recommend for garages serving mixed vehicle types.',
    image: "/Multipurpose_graese_500gm.jpg",
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
    name: 'Valvoline Multi-Purpose Grease NLGI 2',
    slug: 'valvoline-multi-purpose-grease-nlgi2-1kg',
    brand: 'Valvoline Grease',
    packageGroup: 'valvoline-multi-purpose-grease',
    description: 'Universal grease for bearings, joints, and general workshop maintenance.',
    longDescription:
      'A dependable workshop grease used for bearings, chassis points, and service routines. It is easy to recommend for garages serving mixed vehicle types.',
    image: '/Multipurpose_graese_500gm.jpg',
    images: [createSvgPlaceholder('NLGI 2', 'Tub', '#f2a65a')],
    type: 'GREASE',
    quantity: 1000,
    quantityUnit: 'gm',
    price: 549,
    bulkPrice: 499,
    discount: 9,
    vehicleTypes: ['Car', 'Truck', 'Industrial'],
    useCase: 'Bearings, joints, chassis fittings, and workshop maintenance',
    benefits: ['Water resistance', 'Long service life', 'Universal application'],
    specifications: ['NLGI 2', 'Lithium complex', 'Multipurpose'],
    compatibilityNotes: ['Essential for workshops and service centres'],
    serviceIntervalKm: 20000,
    stock: 140,
    sku: 'VLV-GREASE-NLGI2-1KG',
    featured: false,
    active: true,
  },
{
  name: 'Valvoline All Fleet Multi 20W-40',
  slug: 'valvoline-all-fleet-multi-20w40',
  brand: 'Valvoline All Fleet Multi',
  description: 'Heavy-duty diesel engine oil designed for commercial vehicles and fleet operations.',
  longDescription:
    'Valvoline All Fleet Multi 20W-40 is engineered for diesel engines operating under heavy load and demanding conditions. It delivers strong protection against wear, maintains engine cleanliness, and ensures reliable performance for trucks, tractors, and fleet vehicles. Ideal for long operating hours and commercial usage where durability and consistency are essential.',
  image: '/All_FleetMulti_10L.png',
  images: [
    "/All_FleetMulti_10L.png",
    createSvgPlaceholder('20W-40', 'Bucket'),
    createSvgPlaceholder('20W-40', 'Fleet Use'),
  ],
  type: 'ENGINE_OIL',
  viscosity: '20W-40',
  quantity: 10000, // bucket approx (10L)
  quantityUnit: 'ml',
  price: 3999,
  bulkPrice: 3599,
  discount: 10,
  vehicleTypes: ['Truck', 'Tractor', 'Bus'],
  useCase: 'Fleet vehicles, trucks, tractors, and commercial diesel engines',
  benefits: [
    'Strong wear protection under heavy load',
    'Maintains engine cleanliness',
    'Stable performance in long operations',
    'Reliable for fleet usage'
  ],
  specifications: [
    '20W-40 grade',
    'API CH-4',
    'Diesel engine oil',
    'Heavy-duty formulation'
  ],
  compatibilityNotes: [
    'Recommended for commercial diesel engines and fleet operations'
  ],
  recommendedKmRange: [20000, 300000],
  serviceIntervalKm: 8000,
  stock: 80,
  sku: 'VLV-FLEET-20W40-10L',
  featured: true,
  active: true,
},
{
  name: 'Valvoline All Fleet Multi 20W-40',
  slug: 'valvoline-all-fleet-multi-20w40-15l',
  brand: 'Valvoline All Fleet Multi',
  description: 'Heavy-duty diesel engine oil designed for commercial vehicles and fleet operations.',
  longDescription:
    'Valvoline All Fleet Multi 20W-40 is engineered for diesel engines operating under heavy load and demanding conditions. It delivers strong protection against wear, maintains engine cleanliness, and ensures reliable performance for trucks, tractors, and fleet vehicles. Ideal for long operating hours and commercial usage where durability and consistency are essential.',
  image: '/All_FleetMulti_10L.png',
  images: [
    '/All_FleetMulti_10L.png',
    createSvgPlaceholder('20W-40', 'Drum', '#f68b2c'),
    createSvgPlaceholder('20W-40', 'Fleet Use'),
  ],
  type: 'ENGINE_OIL',
  viscosity: '20W-40',
  quantity: 15000,
  quantityUnit: 'ml',
  price: 5599,
  bulkPrice: 5199,
  discount: 7,
  vehicleTypes: ['Truck', 'Tractor', 'Bus'],
  useCase: 'Fleet vehicles, trucks, tractors, and commercial diesel engines',
  benefits: ['Strong wear protection under heavy load', 'Maintains engine cleanliness', 'Stable performance in long operations', 'Reliable for fleet usage'],
  specifications: ['20W-40 grade', 'API CH-4', 'Diesel engine oil', 'Heavy-duty formulation'],
  compatibilityNotes: ['Recommended for commercial diesel engines and fleet operations'],
  recommendedKmRange: [20000, 300000],
  serviceIntervalKm: 8000,
  stock: 55,
  sku: 'VLV-FLEET-20W40-15L',
  featured: false,
  active: true,
},
{
  name: 'Valvoline All Fleet Multi 20W-40',
  slug: 'valvoline-all-fleet-multi-20w40-20l',
  brand: 'Valvoline All Fleet Multi',
  description: 'Heavy-duty diesel engine oil designed for commercial vehicles and fleet operations.',
  longDescription:
    'Valvoline All Fleet Multi 20W-40 is engineered for diesel engines operating under heavy load and demanding conditions. It delivers strong protection against wear, maintains engine cleanliness, and ensures reliable performance for trucks, tractors, and fleet vehicles. Ideal for long operating hours and commercial usage where durability and consistency are essential.',
  image: '/All_FleetMulti_10L.png',
  images: [
    '/All_FleetMulti_10L.png',
    createSvgPlaceholder('20W-40', 'Drum', '#f68b2c'),
    createSvgPlaceholder('20W-40', 'Fleet Use'),
  ],
  type: 'ENGINE_OIL',
  viscosity: '20W-40',
  quantity: 20000,
  quantityUnit: 'ml',
  price: 7399,
  bulkPrice: 6899,
  discount: 7,
  vehicleTypes: ['Truck', 'Tractor', 'Bus'],
  useCase: 'Fleet vehicles, trucks, tractors, and commercial diesel engines',
  benefits: ['Strong wear protection under heavy load', 'Maintains engine cleanliness', 'Stable performance in long operations', 'Reliable for fleet usage'],
  specifications: ['20W-40 grade', 'API CH-4', 'Diesel engine oil', 'Heavy-duty formulation'],
  compatibilityNotes: ['Recommended for commercial diesel engines and fleet operations'],
  recommendedKmRange: [20000, 300000],
  serviceIntervalKm: 8000,
  stock: 40,
  sku: 'VLV-FLEET-20W40-20L',
  featured: false,
  active: true,
},
{
  name: 'Valvoline Multi Purpose Grease NLGI 3',
  slug: 'valvoline-multi-purpose-grease-nlgi-3',
  brand: 'Valvoline',
  packageGroup: 'valvoline-multi-purpose-grease',
  description: 'High-performance multi-purpose grease for general lubrication across automotive and industrial applications.',
  longDescription:
    'Valvoline Multi Purpose Grease NLGI 3 is a versatile, high-performance grease designed for a wide range of lubrication needs. It provides excellent protection against wear, corrosion, and moisture, making it suitable for automotive components, machinery, and general-purpose applications. Its consistency ensures stable performance in varying temperatures and load conditions.',
  image: "/multipurpose_grease_5Kg.png",
  images: [
    "/multipurpose_grease_5Kg.png",
    createSvgPlaceholder('NLGI 3', 'Bucket'),
    createSvgPlaceholder('NLGI 3', 'Application'),
  ],
  type: 'GREASE',
  viscosity: "",
  quantity: 5000,
  quantityUnit: 'gm',
  price: 2999,
  bulkPrice: 2699,
  discount: 10,
  vehicleTypes: ['Car', 'Truck', 'Industrial'],
  useCase: 'General lubrication, wheel bearings, chassis points, and industrial machinery',
  benefits: [
    'Excellent wear protection',
    'Resistant to water and corrosion',
    'Stable under varying temperatures',
    'Reliable multi-purpose performance'
  ],
  specifications: [
    'NLGI Grade 3',
    'High performance grease',
    'Multi-purpose application',
    'Good mechanical stability'
  ],
  compatibilityNotes: [
    'Suitable for automotive, agricultural, and industrial lubrication needs'
  ],
  recommendedKmRange: [0, 200000],
  serviceIntervalKm: 20000,
  stock: 120,
  sku: 'VLV-GREASE-MP-5KG',
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
    image:"/crimson20.webp",
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
  name: 'Valvoline Geargard EP 80W-90',
  slug: 'valvoline-geargard-ep-80w90',
  brand: 'Valvoline Geargard',
  description: 'High-performance gear oil designed to protect manual transmissions and differentials under load.',
  longDescription:
    'Valvoline Geargard EP 80W-90 is formulated with extreme pressure (EP) additives to provide reliable protection for gears operating under heavy load and stress. It helps reduce wear, ensures smooth gear shifting, and maintains performance in both passenger and commercial vehicles. Ideal for manual gearboxes, differentials, and axle applications requiring API GL-4 specification.',
  image: '/geargard20ep_5L.webp',
  images: [
    createSvgPlaceholder('80W-90', 'Front'),
    createSvgPlaceholder('80W-90', 'Back'),
    createSvgPlaceholder('80W-90', 'Gear Use'),
  ],
  type: 'GEAR_OIL',
  viscosity: '80W-90',
  quantity: 5000,
  quantityUnit: 'ml',
  price: 3499,
  bulkPrice: 3199,
  discount: 9,
  vehicleTypes: ['Car', 'Truck', 'Bus'],
  useCase: 'Manual transmissions, differentials, and axle systems in cars and commercial vehicles',
  benefits: [
    'Excellent gear protection under load',
    'Reduces wear and tear',
    'Smooth gear shifting',
    'Enhanced durability for gear components'
  ],
  specifications: [
    'SAE 80W-90',
    'API GL-4',
    'Extreme Pressure (EP) formulation'
  ],
  compatibilityNotes: [
    'Suitable for manual gearboxes and differential systems requiring GL-4 specification'
  ],
  recommendedKmRange: [0, 200000],
  serviceIntervalKm: 20000,
  stock: 90,
  sku: 'VLV-GEAR-80W90-5L',
  featured: true,
  active: true,
},
  {
    name: 'Valvoline Hydraulic Oil ISO 32',
    slug: 'valvoline-hydraulic-oil-iso32',
    brand: 'Valvoline Industrial',
    description: 'Hydraulic fluid for fleet equipment, lift systems, and industrial machinery.',
    longDescription:
      'Built for hydraulic systems that need reliable anti-wear performance and smooth fluid response in temperature changes.',
    image:"/hydraulic-oil.jpg",
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
    image: "/drum_Oil.webp",
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
  {
    name: 'Valvoline Industrial Machine Oil',
    slug: 'valvoline-industrial-machine-oil-5l',
    brand: 'Valvoline Industrial',
    description: 'Versatile machine oil for plant equipment, pumps, and general industrial service.',
    longDescription:
      'A flexible service oil for industrial use where oxidation stability and dependable lubrication are more important than vehicle compatibility.',
    image: '/drum_Oil.webp',
    images: [createSvgPlaceholder('IND', 'Pack', '#8f4214')],
    type: 'INDUSTRIAL_OILS',
    quantity: 5000,
    quantityUnit: 'ml',
    price: 1299,
    bulkPrice: 1199,
    discount: 8,
    vehicleTypes: ['Truck', 'Industrial'],
    useCase: 'Industrial equipment, pumps, and light machinery',
    benefits: ['Oxidation stability', 'General lubrication', 'Wide application range'],
    specifications: ['Industrial grade', 'Machine oil class'],
    compatibilityNotes: ['Best for industrial fleets and workshop machinery'],
    serviceIntervalKm: 50000,
    stock: 120,
    sku: 'VLV-IND-MACHINE-5L',
    featured: false,
    active: true,
  },
  {
  name: 'Valvoline All Fleet Turbo 15W-40',
  slug: 'valvoline-all-fleet-turbo-10l',
  brand: 'Valvoline All Fleet Turbo',
  description: 'Heavy-duty diesel engine oil designed for turbocharged commercial engines.',
  longDescription:
    'Valvoline All Fleet Turbo is engineered for high-load diesel engines. It provides strong protection against wear, maintains engine cleanliness, and supports long operating hours in demanding fleet environments.',
  image: '/All_FleetMulti_10L.png',
  images: ['/All_FleetMulti_10L.png'],
  type: 'ENGINE_OIL',
  viscosity: '15W-40',
  quantity: 10000,
  quantityUnit: 'ml',
  price: 3999,
  bulkPrice: 3599,
  discount: 10,
  vehicleTypes: ['Truck', 'Bus'],
  useCase: 'Turbo diesel engines, fleet vehicles, heavy-duty trucks',
  benefits: [
    'Excellent wear protection',
    'High thermal stability',
    'Maintains engine cleanliness',
    'Reliable under heavy load'
  ],
  specifications: [
    '15W-40 grade',
    'API CH-4',
    'Turbo diesel formulation'
  ],
  compatibilityNotes: [
    'Recommended for commercial vehicles and heavy-duty diesel engines'
  ],
  recommendedKmRange: [20000, 300000],
  serviceIntervalKm: 8000,
  stock: 60,
  sku: 'VLV-FLEET-TURBO-10L',
  featured: false,
  active: true,
},

{
  name: 'Valvoline AWH Hydraulic Oil',
  slug: 'valvoline-awh-46-20l',
  brand: 'Valvoline Hydraulic',
  description: 'Hydraulic oil designed for industrial and heavy-duty machinery.',
  longDescription:
    'Valvoline AWH 46 is formulated for hydraulic systems requiring stable viscosity and reliable anti-wear protection. It ensures smooth operation and long service life for machinery and equipment.',
  image: '/hydraulic-oil.jpg',
  images: ['/hydraulic-oil.jpg'],
  type: 'HYDRAULIC_OIL',
  viscosity: 'ISO 46',
  quantity: 20000,
  quantityUnit: 'ml',
  price: 4999,
  bulkPrice: 4599,
  discount: 8,
  vehicleTypes: ['Industrial', 'Truck'],
  useCase: 'Hydraulic systems, machinery, lifts',
  benefits: [
    'Anti-wear protection',
    'Stable viscosity',
    'Smooth operation',
    'Corrosion resistance'
  ],
  specifications: [
    'ISO 46',
    'Anti-wear hydraulic oil'
  ],
  compatibilityNotes: [
    'Suitable for industrial and hydraulic equipment'
  ],
  recommendedKmRange: [0, 200000],
  serviceIntervalKm: 40000,
  stock: 50,
  sku: 'VLV-AWH46-20L',
  featured: false,
  active: true,
},

{
  name: 'Valvoline AWH Hydraulic Oil',
  slug: 'valvoline-awh-68-20l',
  brand: 'Valvoline Hydraulic',
  description: 'High-performance hydraulic oil for industrial systems.',
  longDescription:
    'AWH 68 provides enhanced protection for hydraulic systems under high pressure and temperature conditions.',
  image: '/hydraulic-oil.jpg',
  images: ['/hydraulic-oil.jpg'],
  type: 'HYDRAULIC_OIL',
  viscosity: 'ISO 68',
  quantity: 20000,
  quantityUnit: 'ml',
  price: 5199,
  bulkPrice: 4799,
  discount: 8,
  vehicleTypes: ['Industrial', 'Truck'],
  useCase: 'Heavy-duty hydraulic systems',
  benefits: [
    'High pressure protection',
    'Stable performance',
    'Reduced wear'
  ],
  specifications: [
    'ISO 68',
    'Hydraulic oil'
  ],
  compatibilityNotes: [
    'Ideal for industrial applications'
  ],
  recommendedKmRange: [0, 200000],
  serviceIntervalKm: 40000,
  stock: 40,
  sku: 'VLV-AWH68-20L',
  featured: false,
  active: true,
},

{
  name: 'Valvoline Champ Extra Scooter Oil',
  slug: 'valvoline-champ-extra-0.8l',
  brand: 'Valvoline Champ Extra',
  description: 'Scooter engine oil designed for smooth city riding.',
  longDescription:
    'Champ Extra is optimized for modern scooters, ensuring smooth acceleration, fuel efficiency, and reliable performance in urban conditions.',
  image: '/champ_Extra.webp',
  images: ['/champ_Extra.webp'],
  type: 'ENGINE_OIL',
  viscosity: '10W-30',
  quantity: 800,
  quantityUnit: 'ml',
  price: 459,
  bulkPrice: 409,
  discount: 10,
  vehicleTypes: ['Bike'],
  useCase: 'Scooters and city commuting',
  benefits: [
    'Smooth acceleration',
    'Fuel efficiency',
    'Engine cleanliness'
  ],
  specifications: [
    '10W-30',
    'Scooter oil'
  ],
  compatibilityNotes: [
    'Suitable for modern scooters'
  ],
  recommendedKmRange: [0, 80000],
  serviceIntervalKm: 5000,
  stock: 120,
  sku: 'VLV-CHAMP-EXTRA-0.8L',
  featured: false,
  active: true,
},

{
  name: 'Valvoline Front Fork Oil',
  slug: 'valvoline-front-fork-175ml',
  brand: 'Valvoline',
  description: 'Specialized fork oil for smooth suspension performance.',
  longDescription:
    'Designed for motorcycle suspension systems, ensuring smooth damping and improved ride comfort.',
  image: '/fork.webp',
  images: ['/fork.webp'],
  type: 'INDUSTRIAL_OILS',
  quantity: 175,
  quantityUnit: 'ml',
  price: 199,
  bulkPrice: 179,
  discount: 10,
  vehicleTypes: ['Bike'],
  useCase: 'Motorcycle suspension',
  benefits: [
    'Smooth suspension',
    'Improved handling',
    'Consistent damping'
  ],
  specifications: [
    'Fork oil',
    'Suspension fluid'
  ],
  compatibilityNotes: [
    'Suitable for motorcycle forks'
  ],
  recommendedKmRange: [0, 50000],
  serviceIntervalKm: 10000,
  stock: 80,
  sku: 'VLV-FORK-175ML',
  featured: false,
  active: true,
},
// ---------------- ALL CLIMATE ----------------
{
  name: 'Valvoline All Climate D/P',
  slug: 'valvoline-all-climate-dp-1l',
  brand: 'Valvoline All Climate',
  description: 'Reliable engine oil for diesel and petrol engines.',
  longDescription: 'Designed for consistent lubrication and engine protection across mixed fleet usage.',
  image: '/all-climate.webp',
  images: ['/all-climate.webp'],
  type: 'ENGINE_OIL',
  viscosity: '15W-40',
  quantity: 1000,
  quantityUnit: 'ml',
  price: 499,
  bulkPrice: 429,
  discount: 10,
  vehicleTypes: ['Car','Truck'],
  useCase: 'Mixed fleet engines',
  benefits: ['Engine cleanliness','Wear protection','Stable viscosity'],
  specifications: ['15W-40','Multi-grade'],
  compatibilityNotes: ['Suitable for diesel and petrol engines'],
  recommendedKmRange: [20000,200000],
  serviceIntervalKm: 8000,
  stock: 120,
  sku: 'VLV-ACDP-1L',
  featured: false,
  active: true,
},

// ---------------- ALL FLEET MULTI VARIANTS ----------------
{
  name: 'Valvoline All Fleet Multi 20W-40',
  slug: 'valvoline-all-fleet-multi-6l',
  brand: 'Valvoline All Fleet Multi',
  description: 'Heavy-duty engine oil for commercial vehicles.',
  longDescription: 'Provides protection under load and ensures long engine life.',
  image: '/All_FleetMulti_10L.png',
  images: ['/All_FleetMulti_10L.png'],
  type: 'ENGINE_OIL',
  viscosity: '20W-40',
  quantity: 6000,
  quantityUnit: 'ml',
  price: 2799,
  bulkPrice: 2499,
  discount: 8,
  vehicleTypes: ['Truck'],
  useCase: 'Fleet vehicles',
  benefits: ['Wear protection','Heat resistance'],
  specifications: ['20W-40','Diesel oil'],
  compatibilityNotes: ['For commercial vehicles'],
  recommendedKmRange: [20000,300000],
  serviceIntervalKm: 8000,
  stock: 50,
  sku: 'VLV-FLEET-6L',
  featured: false,
  active: true,
},

{
  name: 'Valvoline All Fleet Multi 20W-40',
  slug: 'valvoline-all-fleet-multi-7.5l',
  brand: 'Valvoline All Fleet Multi',
  description: 'Heavy-duty engine oil for commercial fleets.',
  longDescription: 'Ensures reliable performance under heavy load conditions.',
  image: '/All_FleetMulti_10L.png',
  images: ['/All_FleetMulti_10L.png'],
  type: 'ENGINE_OIL',
  viscosity: '20W-40',
  quantity: 7500,
  quantityUnit: 'ml',
  price: 3299,
  bulkPrice: 2999,
  discount: 7,
  vehicleTypes: ['Truck'],
  useCase: 'Fleet engines',
  benefits: ['Durability','Clean engine'],
  specifications: ['20W-40'],
  compatibilityNotes: ['Heavy-duty diesel engines'],
  recommendedKmRange: [20000,300000],
  serviceIntervalKm: 8000,
  stock: 45,
  sku: 'VLV-FLEET-7.5L',
  featured: false,
  active: true,
},

{
  name: 'Valvoline All Fleet Multi 20W-40',
  slug: 'valvoline-all-fleet-multi-8.5l',
  brand: 'Valvoline All Fleet Multi',
  description: 'Commercial engine oil for high-load conditions.',
  longDescription: 'Maintains engine performance and reduces wear.',
  image: '/All_FleetMulti_10L.png',
  images: ['/All_FleetMulti_10L.png'],
  type: 'ENGINE_OIL',
  viscosity: '20W-40',
  quantity: 8500,
  quantityUnit: 'ml',
  price: 3599,
  bulkPrice: 3299,
  discount: 7,
  vehicleTypes: ['Truck'],
  useCase: 'Heavy-duty fleet',
  benefits: ['Wear protection','Heat stability'],
  specifications: ['20W-40'],
  compatibilityNotes: ['Diesel engines'],
  recommendedKmRange: [20000,300000],
  serviceIntervalKm: 8000,
  stock: 40,
  sku: 'VLV-FLEET-8.5L',
  featured: false,
  active: true,
},

// ---------------- CRIMSON GREASE FULL ----------------
{
  name: 'Valvoline Crimson Grease',
  slug: 'valvoline-crimson-grease-1kg',
  brand: 'Valvoline Grease',
  description: 'Multi-purpose grease for automotive and industrial use.',
  longDescription: 'Provides lubrication, corrosion protection, and long service life.',
  image: '/multipurpose_graese_5Kg.png',
  images: ['/multipurpose_graese_5Kg.png'],
  type: 'GREASE',
  quantity: 1000,
  quantityUnit: 'gm',
  price: 549,
  bulkPrice: 499,
  discount: 10,
  vehicleTypes: ['Car','Truck','Industrial'],
  useCase: 'Bearings and joints',
  benefits: ['Water resistance','Durability'],
  specifications: ['Grease NLGI'],
  compatibilityNotes: ['Multipurpose'],
  recommendedKmRange: [0,200000],
  serviceIntervalKm: 20000,
  stock: 150,
  sku: 'VLV-GREASE-1KG',
  featured: false,
  active: true,
},

{
  name: 'Valvoline Crimson Grease',
  slug: 'valvoline-crimson-grease-18kg',
  brand: 'Valvoline Grease',
  description: 'Bulk grease for industrial and fleet use.',
  longDescription: 'Suitable for heavy-duty lubrication requirements.',
  image: '/multipurpose_graese_5Kg.png',
  images: ['/multipurpose_graese_5Kg.png'],
  type: 'GREASE',
  quantity: 18000,
  quantityUnit: 'gm',
  price: 8999,
  bulkPrice: 8499,
  discount: 5,
  vehicleTypes: ['Industrial','Truck'],
  useCase: 'Industrial lubrication',
  benefits: ['Heavy load support','Long life'],
  specifications: ['NLGI grease'],
  compatibilityNotes: ['Bulk usage'],
  recommendedKmRange: [0,200000],
  serviceIntervalKm: 20000,
  stock: 40,
  sku: 'VLV-GREASE-18KG',
  featured: false,
  active: true,
},

// ---------------- UNIVERSAL ----------------
{
  name: 'Valvoline Universal 20W-50',
  slug: 'valvoline-universal-1l',
  brand: 'Valvoline Universal',
  description: 'Engine oil for older vehicles.',
  longDescription: 'Maintains oil pressure and ensures durability.',
  image: '/universal.webp',
  images: ['/universal.webp'],
  type: 'ENGINE_OIL',
  viscosity: '20W-50',
  quantity: 1000,
  quantityUnit: 'ml',
  price: 399,
  bulkPrice: 349,
  discount: 10,
  vehicleTypes: ['Car','Truck'],
  useCase: 'Older engines',
  benefits: ['Thick oil film','Reliable performance'],
  specifications: ['20W-50'],
  compatibilityNotes: ['Older engines'],
  recommendedKmRange: [50000,250000],
  serviceIntervalKm: 8000,
  stock: 100,
  sku: 'VLV-UNI-1L',
  featured: false,
  active: true,
},

{
  name: 'Valvoline Universal 20W-50',
  slug: 'valvoline-universal-8l',
  brand: 'Valvoline Universal',
  description: 'Engine oil for commercial vehicles.',
  longDescription: 'Provides durability and consistent performance.',
  image: '/universal.webp',
  images: ['/universal.webp'],
  type: 'ENGINE_OIL',
  viscosity: '20W-50',
  quantity: 8000,
  quantityUnit: 'ml',
  price: 2599,
  bulkPrice: 2299,
  discount: 8,
  vehicleTypes: ['Truck'],
  useCase: 'Fleet engines',
  benefits: ['Wear protection','Heat resistance'],
  specifications: ['20W-50'],
  compatibilityNotes: ['Heavy-duty engines'],
  recommendedKmRange: [50000,250000],
  serviceIntervalKm: 8000,
  stock: 60,
  sku: 'VLV-UNI-8L',
  featured: false,
  active: true,
},

// ---------------- INDUSTRIAL ----------------
{
  name: 'Valvoline Unitrack',
  slug: 'valvoline-unitrack-20l',
  brand: 'Valvoline Industrial',
  description: 'Transmission oil for tractors and industrial vehicles.',
  longDescription: 'Designed for agricultural and heavy-duty machinery.',
  image: '/drum_Oil.webp',
  images: ['/drum_Oil.webp'],
  type: 'INDUSTRIAL_OILS',
  quantity: 20000,
  quantityUnit: 'ml',
  price: 5999,
  bulkPrice: 5599,
  discount: 7,
  vehicleTypes: ['Industrial','Tractor'],
  useCase: 'Agricultural machinery',
  benefits: ['Smooth operation','Durability'],
  specifications: ['Transmission oil'],
  compatibilityNotes: ['Tractors'],
  recommendedKmRange: [0,200000],
  serviceIntervalKm: 30000,
  stock: 30,
  sku: 'VLV-UNITRACK-20L',
  featured: false,
  active: true,
},

// ---------------- BRAKE OIL ----------------
{
  name: 'Valvoline Brake Oil',
  slug: 'valvoline-brake-oil-250ml',
  brand: 'Valvoline Brake Fluid',
  description: 'Reliable brake fluid for safe braking.',
  longDescription: 'Ensures efficient braking performance and system protection.',
  image: '/brake.webp',
  images: ['/brake.webp'],
  type: 'BRAKE_OIL',
  quantity: 250,
  quantityUnit: 'ml',
  price: 199,
  bulkPrice: 179,
  discount: 10,
  vehicleTypes: ['Bike','Car'],
  useCase: 'Brake systems',
  benefits: ['High boiling point','Safe braking'],
  specifications: ['DOT standard'],
  compatibilityNotes: ['Hydraulic brakes'],
  recommendedKmRange: [0,100000],
  serviceIntervalKm: 20000,
  stock: 120,
  sku: 'VLV-BRAKE-250ML',
  featured: false,
  active: true,
},

{
  name: 'Valvoline Airshield',
  slug: 'valvoline-airshield-20l',
  brand: 'Valvoline Industrial',
  description: 'Compressor oil for air systems and industrial usage.',
  longDescription:
    'Airshield oil is designed for air compressors, providing stable lubrication and protection against wear and oxidation.',
  image: '/drum_Oil.webp',
  images: ['/drum_Oil.webp'],
  type: 'INDUSTRIAL_OILS',
  quantity: 20000,
  quantityUnit: 'ml',
  price: 5599,
  bulkPrice: 5199,
  discount: 8,
  vehicleTypes: ['Industrial'],
  useCase: 'Air compressors and industrial systems',
  benefits: [
    'Oxidation stability',
    'Reduced wear',
    'Long service life'
  ],
  specifications: [
    'Compressor oil',
    'Industrial grade'
  ],
  compatibilityNotes: [
    'Suitable for air compressors'
  ],
  recommendedKmRange: [0, 200000],
  serviceIntervalKm: 40000,
  stock: 40,
  sku: 'VLV-AIR-20L',
  featured: false,
  active: true,
},
  {
    name: 'Valvoline Industrial Machine Oil',
    slug: 'valvoline-industrial-machine-oil-20l',
    brand: 'Valvoline Industrial',
    description: 'Versatile machine oil for plant equipment, pumps, and general industrial service.',
    longDescription:
      'A flexible service oil for industrial use where oxidation stability and dependable lubrication are more important than vehicle compatibility.',
    image: '/drum_Oil.webp',
    images: [createSvgPlaceholder('IND', 'Drum', '#8f4214')],
    type: 'INDUSTRIAL_OILS',
    quantity: 20000,
    quantityUnit: 'ml',
    price: 4599,
    bulkPrice: 4299,
    discount: 7,
    vehicleTypes: ['Truck', 'Industrial'],
    useCase: 'Industrial equipment, pumps, and light machinery',
    benefits: ['Oxidation stability', 'General lubrication', 'Wide application range'],
    specifications: ['Industrial grade', 'Machine oil class'],
    compatibilityNotes: ['Best for industrial fleets and workshop machinery'],
    serviceIntervalKm: 50000,
    stock: 45,
    sku: 'VLV-IND-MACHINE-20L',
    featured: false,
    active: true,
  },

// ================== MISSING PRODUCTS FROM EXCEL ==================

// ALL CLIMATE ADVANCE & MODERN VARIANTS
{
  name: 'Valvoline All Climate Advance',
  slug: 'valvoline-all-climate-advance-3.5l',
  brand: 'Valvoline All Climate',
  description: 'Advanced formulation for high-mileage engines with extra protection.',
  longDescription: 'All Climate Advance offers enhanced seal conditioning and wear protection for vehicles with higher mileage.',
  image: '/all-climate.webp',
  images: [createSvgPlaceholder('ADVANCE', 'Front', '#b85c1c')],
  type: 'ENGINE_OIL',
  viscosity: '10W-40',
  quantity: 3500,
  quantityUnit: 'ml',
  price: 1499,
  bulkPrice: 1349,
  discount: 10,
  vehicleTypes: ['Car', 'Truck'],
  useCase: 'High-mileage engines needing advanced protection',
  benefits: ['Enhanced seal conditioning', 'Better wear protection', 'Improved engine cleanliness'],
  specifications: ['10W-40', 'Advanced formulation'],
  compatibilityNotes: ['Suitable for high-mileage vehicles'],
  recommendedKmRange: [50000, 200000],
  serviceIntervalKm: 10000,
  stock: 85,
  sku: 'VLV-AC-ADV-3.5L',
  featured: false,
  active: true,
},

{
  name: 'Valvoline All Climate D/P',
  slug: 'valvoline-all-climate-dp-5l',
  brand: 'Valvoline All Climate',
  description: 'Diesel and petrol multi-grade engine oil.',
  longDescription: 'Suitable for both diesel and petrol engines in commercial and passenger vehicles.',
  image: '/all-climate.webp',
  images: [createSvgPlaceholder('D/P', 'Front', '#b85c1c')],
  type: 'ENGINE_OIL',
  viscosity: '15W-40',
  quantity: 5000,
  quantityUnit: 'ml',
  price: 1999,
  bulkPrice: 1799,
  discount: 10,
  vehicleTypes: ['Car', 'Truck'],
  useCase: 'Mixed fleet with diesel and petrol engines',
  benefits: ['Multi-fuel compatible', 'Stable viscosity', 'Good protection'],
  specifications: ['15W-40', 'Multi-grade'],
  compatibilityNotes: ['Suitable for diesel and petrol engines'],
  recommendedKmRange: [20000, 200000],
  serviceIntervalKm: 8000,
  stock: 70,
  sku: 'VLV-ACDP-5L',
  featured: false,
  active: true,
},

{
  name: 'Valvoline All Climate D/P',
  slug: 'valvoline-all-climate-dp-7l',
  brand: 'Valvoline All Climate',
  description: 'Diesel and petrol multi-grade engine oil.',
  longDescription: 'Suitable for both diesel and petrol engines in commercial and passenger vehicles.',
  image: '/all-climate.webp',
  images: [createSvgPlaceholder('D/P', 'Drum', '#b85c1c')],
  type: 'ENGINE_OIL',
  viscosity: '15W-40',
  quantity: 7000,
  quantityUnit: 'ml',
  price: 2599,
  bulkPrice: 2299,
  discount: 11,
  vehicleTypes: ['Car', 'Truck'],
  useCase: 'Mixed fleet with diesel and petrol engines',
  benefits: ['Multi-fuel compatible', 'Stable viscosity', 'Good protection'],
  specifications: ['15W-40', 'Multi-grade'],
  compatibilityNotes: ['Suitable for diesel and petrol engines'],
  recommendedKmRange: [20000, 200000],
  serviceIntervalKm: 8000,
  stock: 55,
  sku: 'VLV-ACDP-7L',
  featured: false,
  active: true,
},

{
  name: 'Valvoline All Climate Modern',
  slug: 'valvoline-all-climate-modern-3l',
  brand: 'Valvoline All Climate',
  description: 'Modern engine oil for current vehicle models.',
  longDescription: 'Formulated for modern engines with tighter tolerances and advanced emission control systems.',
  image: '/all-climate.webp',
  images: [createSvgPlaceholder('MODERN', 'Front', '#b85c1c')],
  type: 'ENGINE_OIL',
  viscosity: '5W-30',
  quantity: 3000,
  quantityUnit: 'ml',
  price: 1299,
  bulkPrice: 1149,
  discount: 11,
  vehicleTypes: ['Car'],
  useCase: 'Modern passenger cars with current emissions standards',
  benefits: ['Low viscosity efficiency', 'Clean engine operation', 'Extended drain intervals'],
  specifications: ['5W-30', 'Modern formulation'],
  compatibilityNotes: ['Suitable for modern vehicles'],
  recommendedKmRange: [0, 100000],
  serviceIntervalKm: 10000,
  stock: 100,
  sku: 'VLV-AC-MOD-3L',
  featured: false,
  active: true,
},

{
  name: 'Valvoline All Climate Modern',
  slug: 'valvoline-all-climate-modern-3.5l',
  brand: 'Valvoline All Climate',
  description: 'Modern engine oil for current vehicle models.',
  longDescription: 'Formulated for modern engines with tighter tolerances and advanced emission control systems.',
  image: '/all-climate.webp',
  images: [createSvgPlaceholder('MODERN', 'Pack', '#b85c1c')],
  type: 'ENGINE_OIL',
  viscosity: '5W-30',
  quantity: 3500,
  quantityUnit: 'ml',
  price: 1449,
  bulkPrice: 1299,
  discount: 10,
  vehicleTypes: ['Car'],
  useCase: 'Modern passenger cars with current emissions standards',
  benefits: ['Low viscosity efficiency', 'Clean engine operation', 'Extended drain intervals'],
  specifications: ['5W-30', 'Modern formulation'],
  compatibilityNotes: ['Suitable for modern vehicles'],
  recommendedKmRange: [0, 100000],
  serviceIntervalKm: 10000,
  stock: 90,
  sku: 'VLV-AC-MOD-3.5L',
  featured: false,
  active: true,
},

// ALL FLEET PRODUCTS
{
  name: 'Valvoline All Fleet Gold',
  slug: 'valvoline-all-fleet-gold-1l',
  brand: 'Valvoline All Fleet',
  description: 'Premium heavy-duty engine oil for commercial vehicles.',
  longDescription: 'Valvoline All Fleet Gold is engineered for heavy-duty diesel engines in commercial applications.',
  image: '/All_FleetMulti_10L.png',
  images: [createSvgPlaceholder('GOLD', 'Front', '#f68b2c')],
  type: 'ENGINE_OIL',
  viscosity: '15W-40',
  quantity: 1000,
  quantityUnit: 'ml',
  price: 499,
  bulkPrice: 429,
  discount: 14,
  vehicleTypes: ['Truck'],
  useCase: 'Premium fleet-grade diesel engines',
  benefits: ['Premium protection', 'Long service life', 'Wear reduction'],
  specifications: ['15W-40', 'Heavy-duty formulation'],
  compatibilityNotes: ['Commercial diesel engines'],
  recommendedKmRange: [20000, 300000],
  serviceIntervalKm: 8000,
  stock: 100,
  sku: 'VLV-FLEET-GOLD-1L',
  featured: false,
  active: true,
},

{
  name: 'Valvoline All Fleet Turbo 15W-40',
  slug: 'valvoline-all-fleet-turbo-1l',
  brand: 'Valvoline All Fleet Turbo',
  description: 'Turbo-charged engine oil for performance diesel engines.',
  longDescription: 'Designed for turbocharged diesel engines requiring enhanced thermal stability.',
  image: '/All_FleetMulti_10L.png',
  images: [createSvgPlaceholder('TURBO', 'Small', '#f68b2c')],
  type: 'ENGINE_OIL',
  viscosity: '15W-40',
  quantity: 1000,
  quantityUnit: 'ml',
  price: 499,
  bulkPrice: 429,
  discount: 14,
  vehicleTypes: ['Truck'],
  useCase: 'Turbocharged diesel fleet vehicles',
  benefits: ['Turbo protection', 'Thermal stability', 'Extended service'],
  specifications: ['15W-40', 'Turbo formulation'],
  compatibilityNotes: ['Turbocharged diesel engines'],
  recommendedKmRange: [20000, 300000],
  serviceIntervalKm: 8000,
  stock: 80,
  sku: 'VLV-FLEET-TURBO-1L',
  featured: false,
  active: true,
},

{
  name: 'Valvoline All Fleet Turbo 15W-40',
  slug: 'valvoline-all-fleet-turbo-6l',
  brand: 'Valvoline All Fleet Turbo',
  description: 'Turbo-charged engine oil for performance diesel engines.',
  longDescription: 'Designed for turbocharged diesel engines requiring enhanced thermal stability.',
  image: '/All_FleetMulti_10L.png',
  images: [createSvgPlaceholder('TURBO', 'Medium', '#f68b2c')],
  type: 'ENGINE_OIL',
  viscosity: '15W-40',
  quantity: 6000,
  quantityUnit: 'ml',
  price: 2299,
  bulkPrice: 1999,
  discount: 13,
  vehicleTypes: ['Truck'],
  useCase: 'Turbocharged diesel fleet vehicles',
  benefits: ['Turbo protection', 'Thermal stability', 'Extended service'],
  specifications: ['15W-40', 'Turbo formulation'],
  compatibilityNotes: ['Turbocharged diesel engines'],
  recommendedKmRange: [20000, 300000],
  serviceIntervalKm: 8000,
  stock: 65,
  sku: 'VLV-FLEET-TURBO-6L',
  featured: false,
  active: true,
},

{
  name: 'Valvoline All Fleet Turbo 15W-40',
  slug: 'valvoline-all-fleet-turbo-15l',
  brand: 'Valvoline All Fleet Turbo',
  description: 'Turbo-charged engine oil for performance diesel engines.',
  longDescription: 'Designed for turbocharged diesel engines requiring enhanced thermal stability.',
  image: '/All_FleetMulti_10L.png',
  images: [createSvgPlaceholder('TURBO', 'Drum', '#f68b2c')],
  type: 'ENGINE_OIL',
  viscosity: '15W-40',
  quantity: 15000,
  quantityUnit: 'ml',
  price: 5299,
  bulkPrice: 4799,
  discount: 9,
  vehicleTypes: ['Truck'],
  useCase: 'Turbocharged diesel fleet vehicles',
  benefits: ['Turbo protection', 'Thermal stability', 'Extended service'],
  specifications: ['15W-40', 'Turbo formulation'],
  compatibilityNotes: ['Turbocharged diesel engines'],
  recommendedKmRange: [20000, 300000],
  serviceIntervalKm: 8000,
  stock: 45,
  sku: 'VLV-FLEET-TURBO-15L',
  featured: false,
  active: true,
},

{
  name: 'Valvoline All Fleet Turbo 15W-40',
  slug: 'valvoline-all-fleet-turbo-17l',
  brand: 'Valvoline All Fleet Turbo',
  description: 'Turbo-charged engine oil for performance diesel engines.',
  longDescription: 'Designed for turbocharged diesel engines requiring enhanced thermal stability.',
  image: '/All_FleetMulti_10L.png',
  images: [createSvgPlaceholder('TURBO', 'Large', '#f68b2c')],
  type: 'ENGINE_OIL',
  viscosity: '15W-40',
  quantity: 17000,
  quantityUnit: 'ml',
  price: 5999,
  bulkPrice: 5399,
  discount: 10,
  vehicleTypes: ['Truck'],
  useCase: 'Turbocharged diesel fleet vehicles',
  benefits: ['Turbo protection', 'Thermal stability', 'Extended service'],
  specifications: ['15W-40', 'Turbo formulation'],
  compatibilityNotes: ['Turbocharged diesel engines'],
  recommendedKmRange: [20000, 300000],
  serviceIntervalKm: 8000,
  stock: 40,
  sku: 'VLV-FLEET-TURBO-17L',
  featured: false,
  active: true,
},

// CHAMP VARIANTS
{
  name: 'Valvoline Champ 4T',
  slug: 'valvoline-champ-4t-1l',
  brand: 'Valvoline Champ 4T',
  description: 'Standard commuter bike oil for daily use.',
  longDescription: 'Valvoline Champ 4T is a reliable motorcycle oil for everyday commuting and city riding.',
  image: '/champ-4t.webp',
  images: ['/champ-4t.webp'],
  type: 'ENGINE_OIL',
  viscosity: '10W-30',
  quantity: 1000,
  quantityUnit: 'ml',
  price: 449,
  bulkPrice: 389,
  discount: 13,
  vehicleTypes: ['Bike'],
  useCase: 'Daily commuter bikes',
  benefits: ['Reliable protection', 'Smooth operation', 'Cost-effective'],
  specifications: ['10W-30', '4T formulation'],
  compatibilityNotes: ['Standard motorcycles'],
  recommendedKmRange: [0, 80000],
  serviceIntervalKm: 5000,
  stock: 110,
  sku: 'VLV-CHAMP-4T-1L',
  featured: false,
  active: true,
},

{
  name: 'Valvoline Champ Extra',
  slug: 'valvoline-champ-extra-by-2.5l',
  brand: 'Valvoline Champ Extra',
  description: 'Premium scooter oil with enhanced performance.',
  longDescription: 'Champ Extra By is formulated for modern scooters requiring smooth acceleration and fuel efficiency.',
  image: '/champ_Extra.webp',
  images: ['/champ_Extra.webp'],
  type: 'ENGINE_OIL',
  viscosity: '10W-30',
  quantity: 2500,
  quantityUnit: 'ml',
  price: 999,
  bulkPrice: 899,
  discount: 10,
  vehicleTypes: ['Bike'],
  useCase: 'Modern scooters and city commuting',
  benefits: ['Smooth acceleration', 'Fuel efficiency', 'Engine cleanliness'],
  specifications: ['10W-30', 'Premium scooter oil'],
  compatibilityNotes: ['Modern scooters'],
  recommendedKmRange: [0, 80000],
  serviceIntervalKm: 5000,
  stock: 85,
  sku: 'VLV-CHAMP-EXTRA-BY-2.5L',
  featured: false,
  active: true,
},

// CNG & SPECIALTY OILS
{
  name: 'Valvoline C.N.G. Extra',
  slug: 'valvoline-cng-extra-2l',
  brand: 'Valvoline CNG',
  description: 'Special engine oil for CNG vehicles.',
  longDescription: 'Formulated to protect engines running on compressed natural gas with reduced sludge formation.',
  image: '/drum_Oil.webp',
  images: [createSvgPlaceholder('CNG', 'Front', '#c76c1f')],
  type: 'ENGINE_OIL',
  viscosity: '10W-40',
  quantity: 2000,
  quantityUnit: 'ml',
  price: 799,
  bulkPrice: 699,
  discount: 12,
  vehicleTypes: ['Car'],
  useCase: 'CNG-powered vehicles',
  benefits: ['CNG-specific protection', 'Sludge resistance', 'Extended life'],
  specifications: ['10W-40', 'CNG formulation'],
  compatibilityNotes: ['CNG vehicles'],
  recommendedKmRange: [0, 150000],
  serviceIntervalKm: 8000,
  stock: 60,
  sku: 'VLV-CNG-EXTRA-2L',
  featured: false,
  active: true,
},

{
  name: 'Valvoline AX-4000',
  slug: 'valvoline-ax-4000-1.5l',
  brand: 'Valvoline AX',
  description: 'Advanced synthetic gear oil.',
  longDescription: 'Valvoline AX-4000 is a high-performance gear protection fluid for advanced automotive applications.',
  image: '/drum_Oil.webp',
  images: [createSvgPlaceholder('AX-4000', 'Front', '#da7a22')],
  type: 'GEAR_OIL',
  viscosity: '80W-140',
  quantity: 1500,
  quantityUnit: 'ml',
  price: 899,
  bulkPrice: 799,
  discount: 11,
  vehicleTypes: ['Car', 'Truck'],
  useCase: 'Advanced automotive gearboxes',
  benefits: ['Superior gear protection', 'High performance', 'Extended service life'],
  specifications: ['80W-140', 'Synthetic gear oil'],
  compatibilityNotes: ['Advanced transmission systems'],
  recommendedKmRange: [0, 200000],
  serviceIntervalKm: 30000,
  stock: 70,
  sku: 'VLV-AX-4000-1.5L',
  featured: false,
  active: true,
},

// CRIMSON GREASE VARIANTS
{
  name: 'Valvoline Crimson Grease',
  slug: 'valvoline-crimson-grease-0.5kg',
  brand: 'Valvoline Grease',
  description: 'Multi-purpose grease for small maintenance tasks.',
  longDescription: 'Compact grease cartridge for workshop use.',
  image: '/multipurpose_graese_5Kg.png',
  images: [createSvgPlaceholder('CRIMSON', 'Small', '#c76c1f')],
  type: 'GREASE',
  quantity: 500,
  quantityUnit: 'gm',
  price: 299,
  bulkPrice: 249,
  discount: 17,
  vehicleTypes: ['Car', 'Truck'],
  useCase: 'Small maintenance jobs',
  benefits: ['Water resistance', 'Compact size', 'Convenient'],
  specifications: ['Multi-purpose', 'NLGI 2'],
  compatibilityNotes: ['General bearings and joints'],
  recommendedKmRange: [0, 200000],
  serviceIntervalKm: 20000,
  stock: 120,
  sku: 'VLV-GREASE-CRIM-0.5KG',
  featured: false,
  active: true,
},

{
  name: 'Valvoline Crimson Grease',
  slug: 'valvoline-crimson-grease-2kg',
  brand: 'Valvoline Grease',
  description: 'Multi-purpose grease for regular maintenance.',
  longDescription: 'Standard grease tub for routine workshop maintenance.',
  image: '/multipurpose_graese_5Kg.png',
  images: [createSvgPlaceholder('CRIMSON', 'Medium', '#c76c1f')],
  type: 'GREASE',
  quantity: 2000,
  quantityUnit: 'gm',
  price: 1099,
  bulkPrice: 999,
  discount: 9,
  vehicleTypes: ['Car', 'Truck', 'Industrial'],
  useCase: 'Regular workshop maintenance',
  benefits: ['Water resistance', 'Long service life', 'Versatile'],
  specifications: ['Multi-purpose', 'NLGI 2'],
  compatibilityNotes: ['General bearings and joints'],
  recommendedKmRange: [0, 200000],
  serviceIntervalKm: 20000,
  stock: 90,
  sku: 'VLV-GREASE-CRIM-2KG',
  featured: false,
  active: true,
},

{
  name: 'Valvoline Crimson Grease',
  slug: 'valvoline-crimson-grease-3kg',
  brand: 'Valvoline Grease',
  description: 'Multi-purpose grease for heavy workshop use.',
  longDescription: 'Large grease container for frequent use in busy workshops.',
  image: '/multipurpose_graese_5Kg.png',
  images: [createSvgPlaceholder('CRIMSON', 'Large', '#c76c1f')],
  type: 'GREASE',
  quantity: 3000,
  quantityUnit: 'gm',
  price: 1599,
  bulkPrice: 1399,
  discount: 12,
  vehicleTypes: ['Car', 'Truck', 'Industrial'],
  useCase: 'Heavy workshop use',
  benefits: ['Water resistance', 'Extended life', 'Cost-effective'],
  specifications: ['Multi-purpose', 'NLGI 2'],
  compatibilityNotes: ['General bearings and joints'],
  recommendedKmRange: [0, 200000],
  serviceIntervalKm: 20000,
  stock: 75,
  sku: 'VLV-GREASE-CRIM-3KG',
  featured: false,
  active: true,
},

{
  name: 'Valvoline Crimson Grease',
  slug: 'valvoline-crimson-grease-5kg',
  brand: 'Valvoline Grease',
  description: 'Multi-purpose grease for fleet and industrial use.',
  longDescription: 'Large bucket of grease for commercial and fleet operations.',
  image: '/multipurpose_graese_5Kg.png',
  images: [createSvgPlaceholder('CRIMSON', 'Bucket', '#c76c1f')],
  type: 'GREASE',
  quantity: 5000,
  quantityUnit: 'gm',
  price: 2499,
  bulkPrice: 2199,
  discount: 12,
  vehicleTypes: ['Car', 'Truck', 'Industrial'],
  useCase: 'Fleet and industrial maintenance',
  benefits: ['Water resistance', 'Long service life', 'Bulk savings'],
  specifications: ['Multi-purpose', 'NLGI 2'],
  compatibilityNotes: ['General bearings and joints'],
  recommendedKmRange: [0, 200000],
  serviceIntervalKm: 20000,
  stock: 55,
  sku: 'VLV-GREASE-CRIM-5KG',
  featured: false,
  active: true,
},

{
  name: 'Valvoline Crimson Grease',
  slug: 'valvoline-crimson-grease-7kg',
  brand: 'Valvoline Grease',
  description: 'Heavy-duty multi-purpose grease.',
  longDescription: 'Large bulk grease container for high-volume industrial and fleet use.',
  image: '/multipurpose_graese_5Kg.png',
  images: [createSvgPlaceholder('CRIMSON', 'Drum', '#c76c1f')],
  type: 'GREASE',
  quantity: 7000,
  quantityUnit: 'gm',
  price: 3299,
  bulkPrice: 2899,
  discount: 12,
  vehicleTypes: ['Industrial', 'Truck'],
  useCase: 'High-volume industrial applications',
  benefits: ['Water resistance', 'Extended life', 'Industrial grade'],
  specifications: ['Multi-purpose', 'NLGI 2'],
  compatibilityNotes: ['Industrial and fleet use'],
  recommendedKmRange: [0, 200000],
  serviceIntervalKm: 20000,
  stock: 40,
  sku: 'VLV-GREASE-CRIM-7KG',
  featured: false,
  active: true,
},

// GEAR OIL & GEAR GARD VARIANTS
{
  name: 'Valvoline Gear Gard 80W90',
  slug: 'valvoline-gear-gard-80w90-5l',
  brand: 'Valvoline Gear Gard',
  description: 'Premium gear protection oil for commercial vehicles.',
  longDescription: 'Valvoline Gear Gard provides exceptional protection for manual transmissions and differentials.',
  image: '/geargard20ep_5L.webp',
  images: [createSvgPlaceholder('GEAR GARD', 'Medium', '#da7a22')],
  type: 'GEAR_OIL',
  viscosity: '80W-90',
  quantity: 5000,
  quantityUnit: 'ml',
  price: 2199,
  bulkPrice: 1999,
  discount: 9,
  vehicleTypes: ['Car', 'Truck'],
  useCase: 'Manual transmissions and differentials',
  benefits: ['Gear protection', 'Smooth shifting', 'Extended life'],
  specifications: ['80W-90', 'Gear protection oil'],
  compatibilityNotes: ['Manual gearboxes'],
  recommendedKmRange: [0, 200000],
  serviceIntervalKm: 20000,
  stock: 65,
  sku: 'VLV-GEAR-GARD-5L',
  featured: false,
  active: true,
},

{
  name: 'Valvoline Gear Gard 80W90',
  slug: 'valvoline-gear-gard-80w90-20l',
  brand: 'Valvoline Gear Gard',
  description: 'Premium bulk gear protection oil.',
  longDescription: 'Large drum of gear oil for fleet and commercial maintenance.',
  image: '/geargard20ep_5L.webp',
  images: [createSvgPlaceholder('GEAR GARD', 'Drum', '#da7a22')],
  type: 'GEAR_OIL',
  viscosity: '80W-90',
  quantity: 20000,
  quantityUnit: 'ml',
  price: 7899,
  bulkPrice: 7199,
  discount: 9,
  vehicleTypes: ['Truck', 'Industrial'],
  useCase: 'Fleet gear systems',
  benefits: ['Gear protection', 'Bulk efficiency', 'Extended life'],
  specifications: ['80W-90', 'Gear protection oil'],
  compatibilityNotes: ['Manual gearboxes and fleets'],
  recommendedKmRange: [0, 200000],
  serviceIntervalKm: 20000,
  stock: 35,
  sku: 'VLV-GEAR-GARD-20L',
  featured: false,
  active: true,
},

{
  name: 'Valvoline Gear Oil 80W90',
  slug: 'valvoline-gear-oil-90-1l',
  brand: 'Valvoline Gear Oil',
  description: 'Standard gear oil for manual transmissions.',
  longDescription: 'Reliable gear oil for everyday transmission maintenance.',
  image: '/geargard20ep_5L.webp',
  images: [createSvgPlaceholder('GEAR OIL', 'Small', '#da7a22')],
  type: 'GEAR_OIL',
  viscosity: '80W-90',
  quantity: 1000,
  quantityUnit: 'ml',
  price: 449,
  bulkPrice: 389,
  discount: 13,
  vehicleTypes: ['Car'],
  useCase: 'Standard transmission service',
  benefits: ['Reliable protection', 'Smooth operation', 'Cost-effective'],
  specifications: ['80W-90', 'Standard gear oil'],
  compatibilityNotes: ['Manual transmissions'],
  recommendedKmRange: [0, 150000],
  serviceIntervalKm: 20000,
  stock: 95,
  sku: 'VLV-GEAR-OIL-90-1L',
  featured: false,
  active: true,
},

{
  name: 'Valvoline Gear Oil 80W90',
  slug: 'valvoline-gear-oil-90-5l',
  brand: 'Valvoline Gear Oil',
  description: 'Bulk gear oil for transmission service.',
  longDescription: 'Medium-size container for workshop and service center use.',
  image: '/geargard20ep_5L.webp',
  images: [createSvgPlaceholder('GEAR OIL', 'Medium', '#da7a22')],
  type: 'GEAR_OIL',
  viscosity: '80W-90',
  quantity: 5000,
  quantityUnit: 'ml',
  price: 1799,
  bulkPrice: 1599,
  discount: 11,
  vehicleTypes: ['Car', 'Truck'],
  useCase: 'Workshop transmission service',
  benefits: ['Bulk savings', 'Reliable protection', 'Smooth operation'],
  specifications: ['80W-90', 'Gear oil'],
  compatibilityNotes: ['Manual transmissions'],
  recommendedKmRange: [0, 150000],
  serviceIntervalKm: 20000,
  stock: 70,
  sku: 'VLV-GEAR-OIL-90-5L',
  featured: false,
  active: true,
},

{
  name: 'Valvoline Gear Oil 80W90',
  slug: 'valvoline-gear-oil-90-20l',
  brand: 'Valvoline Gear Oil',
  description: 'Large drum of gear oil for commercial use.',
  longDescription: 'Bulk container for fleet and large-scale maintenance operations.',
  image: '/geargard20ep_5L.webp',
  images: [createSvgPlaceholder('GEAR OIL', 'Drum', '#da7a22')],
  type: 'GEAR_OIL',
  viscosity: '80W-90',
  quantity: 20000,
  quantityUnit: 'ml',
  price: 6899,
  bulkPrice: 6199,
  discount: 10,
  vehicleTypes: ['Truck', 'Industrial'],
  useCase: 'Fleet transmission maintenance',
  benefits: ['Bulk efficiency', 'Extended life', 'Cost savings'],
  specifications: ['80W-90', 'Gear oil'],
  compatibilityNotes: ['Manual transmissions'],
  recommendedKmRange: [0, 150000],
  serviceIntervalKm: 20000,
  stock: 40,
  sku: 'VLV-GEAR-OIL-90-20L',
  featured: false,
  active: true,
},

// MULTI SPECIAL & PREMIUM PLUS
{
  name: 'Valvoline Multi Special 20W-50',
  slug: 'valvoline-multi-special-1l',
  brand: 'Valvoline Multi Special',
  description: 'Special-purpose multi-grade engine oil.',
  longDescription: 'Formulated for diverse vehicle applications with universal compatibility.',
  image: '/universal.webp',
  images: [createSvgPlaceholder('MULTI SPECIAL', 'Front', '#8f4214')],
  type: 'ENGINE_OIL',
  viscosity: '20W-50',
  quantity: 1000,
  quantityUnit: 'ml',
  price: 499,
  bulkPrice: 429,
  discount: 14,
  vehicleTypes: ['Car', 'Truck'],
  useCase: 'Multi-vehicle fleet applications',
  benefits: ['Universal compatibility', 'Solid protection', 'Value pricing'],
  specifications: ['20W-50', 'Multi-grade'],
  compatibilityNotes: ['Various vehicle types'],
  recommendedKmRange: [30000, 200000],
  serviceIntervalKm: 8000,
  stock: 85,
  sku: 'VLV-MULTI-SPEC-1L',
  featured: false,
  active: true,
},

{
  name: 'Valvoline Multi Special 20W-50',
  slug: 'valvoline-multi-special-5l',
  brand: 'Valvoline Multi Special',
  description: 'Special-purpose bulk engine oil.',
  longDescription: 'Larger container for mixed-fleet workshop use.',
  image: '/universal.webp',
  images: [createSvgPlaceholder('MULTI SPECIAL', 'Pack', '#8f4214')],
  type: 'ENGINE_OIL',
  viscosity: '20W-50',
  quantity: 5000,
  quantityUnit: 'ml',
  price: 1899,
  bulkPrice: 1699,
  discount: 11,
  vehicleTypes: ['Car', 'Truck'],
  useCase: 'Multi-vehicle fleet maintenance',
  benefits: ['Bulk savings', 'Universal compatibility', 'Cost-effective'],
  specifications: ['20W-50', 'Multi-grade'],
  compatibilityNotes: ['Various vehicle types'],
  recommendedKmRange: [30000, 200000],
  serviceIntervalKm: 8000,
  stock: 60,
  sku: 'VLV-MULTI-SPEC-5L',
  featured: false,
  active: true,
},

{
  name: 'Valvoline Premium Plus 15W-40',
  slug: 'valvoline-premium-plus-1l',
  brand: 'Valvoline Premium',
  description: 'Premium-grade engine oil for discerning users.',
  longDescription: 'Valvoline Premium Plus delivers enhanced performance and protection.',
  image: '/universal.webp',
  images: [createSvgPlaceholder('PREMIUM PLUS', 'Front', '#b85c1c')],
  type: 'ENGINE_OIL',
  viscosity: '15W-40',
  quantity: 1000,
  quantityUnit: 'ml',
  price: 599,
  bulkPrice: 529,
  discount: 12,
  vehicleTypes: ['Car', 'Truck'],
  useCase: 'Premium vehicle maintenance',
  benefits: ['Enhanced protection', 'Superior performance', 'Extended intervals'],
  specifications: ['15W-40', 'Premium formulation'],
  compatibilityNotes: ['Cars and light trucks'],
  recommendedKmRange: [0, 150000],
  serviceIntervalKm: 10000,
  stock: 100,
  sku: 'VLV-PREM-PLUS-1L',
  featured: false,
  active: true,
},

{
  name: 'Valvoline Premium Plus 15W-40',
  slug: 'valvoline-premium-plus-7.5l',
  brand: 'Valvoline Premium',
  description: 'Premium bulk engine oil for professional use.',
  longDescription: 'Medium-sized container of premium oil for workshop servicing.',
  image: '/universal.webp',
  images: [createSvgPlaceholder('PREMIUM PLUS', 'Medium', '#b85c1c')],
  type: 'ENGINE_OIL',
  viscosity: '15W-40',
  quantity: 7500,
  quantityUnit: 'ml',
  price: 3599,
  bulkPrice: 3199,
  discount: 11,
  vehicleTypes: ['Car', 'Truck'],
  useCase: 'Professional workshop use',
  benefits: ['Premium quality', 'Bulk efficiency', 'Superior protection'],
  specifications: ['15W-40', 'Premium formulation'],
  compatibilityNotes: ['Cars and light trucks'],
  recommendedKmRange: [0, 150000],
  serviceIntervalKm: 10000,
  stock: 70,
  sku: 'VLV-PREM-PLUS-7.5L',
  featured: false,
  active: true,
},

{
  name: 'Valvoline Premium Plus 15W-40',
  slug: 'valvoline-premium-plus-15l',
  brand: 'Valvoline Premium',
  description: 'Large premium engine oil for fleet operations.',
  longDescription: 'Large drum of premium oil for fleet and commercial operations.',
  image: '/universal.webp',
  images: [createSvgPlaceholder('PREMIUM PLUS', 'Drum', '#b85c1c')],
  type: 'ENGINE_OIL',
  viscosity: '15W-40',
  quantity: 15000,
  quantityUnit: 'ml',
  price: 6999,
  bulkPrice: 6299,
  discount: 10,
  vehicleTypes: ['Car', 'Truck'],
  useCase: 'Fleet engine maintenance',
  benefits: ['Bulk savings', 'Premium protection', 'Commercial grade'],
  specifications: ['15W-40', 'Premium formulation'],
  compatibilityNotes: ['Fleet vehicles'],
  recommendedKmRange: [0, 150000],
  serviceIntervalKm: 10000,
  stock: 50,
  sku: 'VLV-PREM-PLUS-15L',
  featured: false,
  active: true,
},

// SYNPOWER VARIANTS
{
  name: 'Valvoline SynPower 4T 10W-40',
  slug: 'valvoline-synpower-4t-4l',
  brand: 'Valvoline SynPower 4T',
  description: 'Bulk synthetic motorcycle oil for workshops.',
  longDescription: 'Large container of premium synthetic oil for busy service centers.',
  image: '/synpower-4t-10w-40.webp',
  images: ['/synpower-4t-10w-40.webp'],
  type: 'ENGINE_OIL',
  viscosity: '10W-40',
  quantity: 4000,
  quantityUnit: 'ml',
  price: 2499,
  bulkPrice: 2199,
  discount: 12,
  vehicleTypes: ['Bike'],
  useCase: 'Workshop bulk purchasing',
  benefits: ['Synthetic protection', 'Heat stability', 'Bulk savings'],
  specifications: ['10W-40', 'Synthetic 4T'],
  compatibilityNotes: ['Premium motorcycles'],
  recommendedKmRange: [0, 70000],
  serviceIntervalKm: 7000,
  stock: 50,
  sku: 'VLV-SYN4T-4L',
  featured: false,
  active: true,
},

// TASA FLUID
{
  name: 'Valvoline TASA Fluid',
  slug: 'valvoline-tasa-fluid-1l',
  brand: 'Valvoline TASA',
  description: 'Transmission automatic service fluid.',
  longDescription: 'Specialized fluid for automatic transmission service and maintenance.',
  image: '/drum_Oil.webp',
  images: [createSvgPlaceholder('TASA', 'Front', '#e27b24')],
  type: 'HYDRAULIC_OIL',
  viscosity: 'ATF',
  quantity: 1000,
  quantityUnit: 'ml',
  price: 399,
  bulkPrice: 349,
  discount: 12,
  vehicleTypes: ['Car'],
  useCase: 'Automatic transmission maintenance',
  benefits: ['Smooth shifting', 'Thermal stability', 'Friction control'],
  specifications: ['ATF', 'Transmission fluid'],
  compatibilityNotes: ['Automatic transmissions'],
  recommendedKmRange: [0, 200000],
  serviceIntervalKm: 50000,
  stock: 80,
  sku: 'VLV-TASA-1L',
  featured: false,
  active: true,
},

// UNITRACK / UNIVERSAL VARIANTS
{
  name: 'Valvoline Unitrack',
  slug: 'valvoline-unitrack-5l',
  brand: 'Valvoline Industrial',
  description: 'Transmission oil for tractors and agricultural equipment.',
  longDescription: 'Designed for agricultural vehicles and transmission systems requiring universal compatibility.',
  image: '/drum_Oil.webp',
  images: [createSvgPlaceholder('UNITRACK', 'Medium', '#8f4214')],
  type: 'INDUSTRIAL_OILS',
  quantity: 5000,
  quantityUnit: 'ml',
  price: 1899,
  bulkPrice: 1699,
  discount: 10,
  vehicleTypes: ['Industrial', 'Tractor'],
  useCase: 'Agricultural machinery',
  benefits: ['Universal compatibility', 'Smooth operation', 'Durability'],
  specifications: ['Transmission oil', 'Universal'],
  compatibilityNotes: ['Tractors and agricultural use'],
  recommendedKmRange: [0, 200000],
  serviceIntervalKm: 30000,
  stock: 45,
  sku: 'VLV-UNITRACK-5L',
  featured: false,
  active: true,
},

// COOLANT CLASSIC
{
  name: 'Valvoline Coolant Classic',
  slug: 'valvoline-coolant-classic-1l',
  brand: 'Valvoline Coolant',
  description: 'Standard engine coolant for traditional vehicles.',
  longDescription: 'Reliable coolant formulation for conventional engine cooling systems.',
  image: '/drum_Oil.webp',
  images: [createSvgPlaceholder('COOLANT', 'Front', '#1d5db8')],
  type: 'INDUSTRIAL_OILS',
  quantity: 1000,
  quantityUnit: 'ml',
  price: 249,
  bulkPrice: 199,
  discount: 20,
  vehicleTypes: ['Car', 'Truck'],
  useCase: 'Engine cooling systems',
  benefits: ['Thermal protection', 'Corrosion resistance', 'Freeze protection'],
  specifications: ['Standard coolant', 'Green formula'],
  compatibilityNotes: ['Traditional engines'],
  recommendedKmRange: [0, 200000],
  serviceIntervalKm: 40000,
  stock: 110,
  sku: 'VLV-COOLANT-1L',
  featured: false,
  active: true,
},

// XLD OIL
{
  name: 'Valvoline XLD 10W-20',
  slug: 'valvoline-xld-10w20-1l',
  brand: 'Valvoline XLD',
  description: 'Extra light-duty engine oil for fuel efficiency.',
  longDescription: 'Lightweight oil formulation designed to improve fuel economy without compromising protection.',
  image: '/universal.webp',
  images: [createSvgPlaceholder('XLD', 'Front', '#df3b2f')],
  type: 'ENGINE_OIL',
  viscosity: '10W-20',
  quantity: 1000,
  quantityUnit: 'ml',
  price: 359,
  bulkPrice: 309,
  discount: 14,
  vehicleTypes: ['Car'],
  useCase: 'Fuel-efficient vehicles',
  benefits: ['Improved fuel economy', 'Low-viscosity efficiency', 'Environmental friendly'],
  specifications: ['10W-20', 'Light-duty formulation'],
  compatibilityNotes: ['Modern fuel-efficient vehicles'],
  recommendedKmRange: [0, 100000],
  serviceIntervalKm: 10000,
  stock: 95,
  sku: 'VLV-XLD-10W20-1L',
  featured: false,
  active: true,
},

// BRAKE OIL VARIANTS
{
  name: 'Valvoline Brake Oil',
  slug: 'valvoline-brake-oil-500ml',
  brand: 'Valvoline Brake Fluid',
  description: 'Standard brake fluid for hydraulic systems.',
  longDescription: 'Reliable hydraulic fluid for brake system maintenance and service.',
  image: '/brake.webp',
  images: ['/brake.webp'],
  type: 'BRAKE_OIL',
  quantity: 500,
  quantityUnit: 'ml',
  price: 349,
  bulkPrice: 299,
  discount: 14,
  vehicleTypes: ['Bike', 'Car', 'Truck'],
  useCase: 'Brake system maintenance',
  benefits: ['High boiling point', 'Corrosion resistance', 'Safe braking'],
  specifications: ['DOT 3', 'Hydraulic brake fluid'],
  compatibilityNotes: ['Hydraulic brakes'],
  recommendedKmRange: [0, 150000],
  serviceIntervalKm: 30000,
  stock: 100,
  sku: 'VLV-BRAKE-500ML',
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
      productSlugs: ['valvoline-advanced-full-synthetic-5w30', 'valvoline-gear-oil-80w90'],
      note: 'Modern SUVs benefit from a low-viscosity synthetic engine oil and matching drivetrain protection.',
    },
    {
      model: 'Honda City',
      productSlugs: ['valvoline-advanced-full-synthetic-5w30', 'valvoline-multi-purpose-grease-nlgi2'],
      note: 'A reliable everyday recommendation for refined petrol sedans.',
    },
    {
      model: 'Toyota Innova',
      productSlugs: ['valvoline-high-mileage-10w40', 'valvoline-synthetic-gear-oil-75w110'],
      note: 'A strong fit for family and fleet vehicles that see long-haul use.',
    },
  ],
  Truck: [
    {
      model: 'Tata 407',
      productSlugs: ['valvoline-high-mileage-10w40', 'valvoline-synthetic-gear-oil-75w110', 'valvoline-hydraulic-oil-iso32'],
      note: 'Commercial workhorses need heavier protection and support fluids.',
    },
    {
      model: 'Volvo FH',
      productSlugs: ['valvoline-high-mileage-10w40', 'valvoline-synthetic-gear-oil-75w110'],
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

export const getBaseSku = (sku: string) => sku.replace(/-(\d+(?:\.\d+)?)(?:ML|L|KG|GM|G)$/i, '');

export const formatPackSize = (product: Pick<Product, 'quantity' | 'quantityUnit'>) => {
  const rawUnit = product.quantityUnit.toLowerCase();

  if (rawUnit === 'ml') {
    if (product.quantity >= 1000) {
      const liters = product.quantity / 1000;
      const display = Number.isInteger(liters) ? liters.toFixed(0) : liters.toFixed(1);
      return `${display} L`;
    }
    return `${product.quantity} ml`;
  }

  if (rawUnit === 'gm' || rawUnit === 'g') {
    if (product.quantity >= 1000) {
      const kilograms = product.quantity / 1000;
      const display = Number.isInteger(kilograms) ? kilograms.toFixed(0) : kilograms.toFixed(1);
      return `${display} kg`;
    }
    return `${product.quantity} ${rawUnit === 'gm' ? 'gm' : 'g'}`;
  }

  return `${product.quantity} ${product.quantityUnit}`;
};

export const getPackageVariants = (product: Pick<Product, 'name' | 'sku' | 'packageGroup'>) => {
  if (product.packageGroup) {
    return PRODUCT_CATALOG.filter((item) => item.packageGroup === product.packageGroup).sort((a, b) => a.quantity - b.quantity);
  }

  const baseSku = getBaseSku(product.sku);
  const variants = PRODUCT_CATALOG.filter((item) => item.name === product.name && getBaseSku(item.sku) === baseSku);
  return variants.sort((a, b) => a.quantity - b.quantity);
};

/** Interface for grouped products with same name but different pack sizes */
export interface ProductGroup {
  name: string;
  brand: string;
  description: string;
  longDescription?: string;
  type: ProductType;
  image: string;
  images?: string[];
  viscosity?: string;
  vehicleTypes?: string[];
  useCase?: string;
  benefits?: string[];
  specifications?: string[];
  compatibilityNotes?: string[];
  recommendedKmRange?: [number, number];
  serviceIntervalKm?: number;
  featured: boolean;
  variants: Product[];
}

/** Get all products organized into groups by name with pack size variants */
export const getGroupedProducts = (): ProductGroup[] => {
  const groups = new Map<string, Product[]>();

  // Group products by name
  PRODUCT_CATALOG.forEach((product) => {
    if (!groups.has(product.name)) {
      groups.set(product.name, []);
    }
    groups.get(product.name)!.push(product);
  });

  // Convert groups to ProductGroup format, sorted by quantity
  return Array.from(groups.values())
    .map((products) => {
      const sorted = products.sort((a, b) => a.quantity - b.quantity);
      const primary = sorted[0]; // Use first (smallest) variant as primary

      return {
        name: primary.name,
        brand: primary.brand,
        description: primary.description,
        longDescription: primary.longDescription,
        type: primary.type,
        image: primary.image,
        images: primary.images,
        viscosity: primary.viscosity,
        vehicleTypes: primary.vehicleTypes,
        useCase: primary.useCase,
        benefits: primary.benefits,
        specifications: primary.specifications,
        compatibilityNotes: primary.compatibilityNotes,
        recommendedKmRange: primary.recommendedKmRange,
        serviceIntervalKm: primary.serviceIntervalKm,
        featured: sorted.some((p) => p.featured), // Group is featured if any variant is featured
        variants: sorted,
      };
    })
    .sort((a, b) => {
      // Sort by featured first, then by type, then by name
      if (a.featured !== b.featured) return b.featured ? 1 : -1;
      if (a.type !== b.type) return a.type.localeCompare(b.type);
      return a.name.localeCompare(b.name);
    });
};

/** Get a specific product group by name */
export const getProductGroupByName = (name: string): ProductGroup | undefined => {
  const groups = getGroupedProducts();
  return groups.find((group) => group.name === name);
};

/** Get pack size options for a product (other variants with same name) */
export const getPackSizeOptions = (productSlug: string) => {
  const product = getProductBySlug(productSlug);
  if (!product) return [];

  const variants = getPackageVariants({
    name: product.name,
    sku: product.sku,
    packageGroup: product.packageGroup,
  });

  return variants.map((v) => ({
    slug: v.slug,
    size: formatPackSize(v),
    quantity: v.quantity,
    quantityUnit: v.quantityUnit,
    price: v.price,
    stock: v.stock,
  }));
};

export const getBrandOptions = () => [...new Set(PRODUCT_CATALOG.map((product) => product.brand))].sort();

export const getViscosityOptions = () =>
  [...new Set(PRODUCT_CATALOG.map((product) => product.viscosity).filter(Boolean) as string[])].sort();

export const getProductsByType = (type: ProductType, products: Product[] = PRODUCT_CATALOG) =>
  products.filter((product) => product.type === type);

export const filterProducts = (
  filters: {
  search?: string;
  vehicleType?: string;
  oilType?: string;
  viscosity?: string;
  brand?: string;
  minPrice?: number;
  maxPrice?: number;
  },
  products: Product[] = PRODUCT_CATALOG,
) => {
  const search = filters.search?.trim().toLowerCase();

  return products.filter((product) => {
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
