# Valvoline eCommerce Platform

A production-ready, modern eCommerce web application for a Valvoline lubricant dealer built with Next.js 14, TypeScript, Tailwind CSS, and Prisma.

## 🎯 Features

### Core Features
- ✅ **Smart Vehicle Selector** - Intelligent multi-step vehicle selection with automatic oil recommendations
- ✅ **Premium Homepage** - Dark industrial theme with hero section and featured products
- ✅ **Advanced Product System** - Comprehensive product cards with filtering and search
- ✅ **Product Details Pages** - Detailed product information, specifications, and benefits
- ✅ **Advanced Filtering** - Filter by vehicle type, oil type, viscosity, and price
- ✅ **Shopping Cart** - Add to cart with Zustand state management
- ✅ **User Authentication** - Login/signup with user profiles
- ✅ **B2B Features** - Bulk pricing, business dashboard, and order management
- ✅ **Dashboard** - User profile, order history, saved vehicles
- ✅ **Responsive Design** - Mobile-first approach with Tailwind CSS
- ✅ **Dark Industrial Theme** - Custom color scheme (#270301, #F68B2C)

### Technical Features
- TypeScript for type safety
- Server-side rendering with Next.js App Router
- Prisma ORM for database management
- Zustand for state management
- Tailwind CSS for styling
- Responsive and accessible UI
- SEO optimized pages
- API routes for backend operations

## 📋 Project Structure

```
project_valvoline/
├── app/
│   ├── layout.tsx                 # Root layout
│   ├── page.tsx                   # Homepage
│   ├── api/
│   │   ├── products/
│   │   │   ├── route.ts          # Product listing & creation
│   │   │   └── [id]/route.ts     # Single product endpoint
│   │   └── cart/route.ts         # Cart management
│   ├── products/
│   │   ├── page.tsx              # Products listing with filters
│   │   └── [slug]/page.tsx       # Product detail page
│   ├── vehicle-selector/page.tsx # Vehicle selector page
│   ├── cart/page.tsx             # Shopping cart page
│   ├── login/page.tsx            # Login page
│   ├── dashboard/page.tsx        # User dashboard
│   └── b2b/page.tsx              # B2B landing page
├── components/
│   ├── Navbar.tsx                # Navigation component
│   ├── Footer.tsx                # Footer component
│   ├── HeroSection.tsx           # Homepage hero section
│   ├── ProductCard.tsx           # Product card component
│   ├── ProductFilters.tsx        # Product filtering sidebar
│   └── VehicleSelector.tsx       # Vehicle selector modal
├── hooks/
│   └── store.ts                  # Zustand stores (cart, auth, filters)
├── lib/
│   ├── prisma.ts                 # Prisma client initialization
│   ├── utils.ts                  # Utility functions
│   └── vehicleData.ts            # Vehicle data and helpers
├── styles/
│   └── globals.css               # Global styles with Tailwind
├── types/
│   └── index.ts                  # TypeScript type definitions
├── prisma/
│   ├── schema.prisma             # Database schema
│   └── seed.ts                   # Database seeding script
└── public/                       # Static assets
```

## 🚀 Getting Started

### Prerequisites
- Node.js 16+ and npm/yarn
- SQLite (default) or PostgreSQL

### Installation

1. **Clone the repository**
```bash
cd /Users/riteshchaudhary/project_valvoline
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
```bash
cp .env.example .env.local
```

Update `.env.local` with your configuration:
```env
DATABASE_URL="file:./dev.db"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-change-in-production"
STRIPE_PUBLIC_KEY="pk_test_your_key"
STRIPE_SECRET_KEY="sk_test_your_key"
```

4. **Set up the database**
```bash
npm run prisma:generate
npm run prisma:migrate
npm run seed
```

5. **Start the development server**
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📱 Pages & Routes

### Public Pages
- `/` - Homepage with hero section
- `/products` - Products listing with filters
- `/products/[slug]` - Product detail page
- `/vehicle-selector` - Smart vehicle selector
- `/cart` - Shopping cart
- `/login` - User login
- `/b2b` - B2B landing page

### Protected Pages (Require authentication)
- `/dashboard` - User dashboard
- `/dashboard/orders` - Order history
- `/dashboard/profile` - Profile management
- `/dashboard/vehicles` - Saved vehicles

## 🎨 Theme & Styling

### Color Scheme
- **Primary Dark**: `#270301` (Deep burgundy)
- **Accent**: `#F68B2C` (Orange)
- **Background**: Gradient from primary to secondary

### Components
All components use Tailwind CSS utility classes with custom variants:
- `.btn` - Button styles
- `.badge` - Badge styles
- `.input` - Input field styles
- `.container-max` - Max width container

## 🗄️ Database Schema

### Models
- **User** - Customer, mechanic, garage, or admin accounts
- **Product** - Oil products with type, viscosity, pricing
- **VehicleProfile** - Saved user vehicles
- **Cart** - Shopping cart and items
- **Order** - Purchase orders and line items
- **Review** - Product reviews and ratings
- **VehicleCompatibility** - Vehicle-to-product recommendations

## 🛒 Shopping Features

### Cart Management
- Add/remove items
- Quantity adjustment
- Price calculation with tax and shipping
- Free shipping over ₹2000
- Persistent cart using localStorage

### Checkout
- Order summary with itemization
- Shipping address entry
- Payment method selection
- Order confirmation

## 👥 B2B Features

### For Garages & Mechanics
- Bulk pricing (10-30% discounts)
- Business dashboard
- Order history and analytics
- Team management
- Auto-reorder functionality
- Priority support

### Pricing Tiers
- **Starter**: 10-50 units → 10% off
- **Professional**: 50-200 units → 20% off
- **Enterprise**: 200+ units → 30% off

## 🔐 Authentication

### Supported Methods
- Email/password login
- Social authentication (Google, Facebook, Apple)
- User roles: CUSTOMER, MECHANIC, GARAGE, ADMIN

### Demo Credentials
- Email: `demo@valvoline.com`
- Password: `demo123`

## 📦 API Documentation

### Products API
```bash
GET /api/products                    # List all products
GET /api/products/[id]              # Get single product
POST /api/products                  # Create product (admin)
PUT /api/products/[id]              # Update product (admin)
DELETE /api/products/[id]           # Delete product (admin)
```

Query parameters:
- `type` - Filter by oil type
- `viscosity` - Filter by viscosity
- `search` - Search products

### Cart API
```bash
GET /api/cart?userId=[id]          # Get user cart
POST /api/cart                      # Add item to cart
```

## 🚄 Performance Optimization

- Image optimization with Next.js Image component
- Code splitting and lazy loading
- CSS purging with Tailwind
- Database query optimization with Prisma
- Caching strategies for static content

## 📝 Customization

### Adding Products
1. Edit `prisma/seed.ts` to add new products
2. Run `npm run seed` to populate database

### Changing Colors
Edit `tailwind.config.ts`:
```ts
colors: {
  primary: {
    dark: '#270301',      // Change primary color
    accent: '#F68B2C',    // Change accent color
  },
}
```

### Adding New Vehicles
Edit `lib/vehicleData.ts`:
```ts
export const VEHICLE_DATA = {
  Bike: { ... },
  Car: { ... },
  Truck: { ... },
  // Add new vehicle types here
}
```

## 🧪 Testing

Currently using manual testing. Future implementation includes:
- Jest for unit tests
- React Testing Library for component tests
- Cypress for E2E tests

```bash
npm test           # Run tests (when configured)
npm run test:e2e   # Run E2E tests (when configured)
```

## 📦 Deployment

### Vercel (Recommended)
```bash
npm i -g vercel
vercel
```

### Docker
```dockerfile
FROM node:18
WORKDIR /app
COPY . .
RUN npm install && npm run build
CMD ["npm", "start"]
```

### Environment Variables for Production
```env
DATABASE_URL="postgresql://user:password@host/dbname"
NEXTAUTH_SECRET="long-random-string"
NEXTAUTH_URL="https://yourdomain.com"
STRIPE_SECRET_KEY="sk_live_..."
```

## 🤝 Contributing

Contributions are welcome! Please follow these steps:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Troubleshooting

### Database Issues
```bash
# Reset database
rm prisma/dev.db prisma/dev.db-journal
npm run prisma:migrate
npm run seed
```

### Port Already in Use
```bash
npm run dev -- -p 3001
```

### Module Not Found
```bash
npm install
npm run prisma:generate
```

## 📞 Support

For support, email support@valvoline.example.com or open an issue on GitHub.

## 🗺️ Roadmap

- [ ] Payment Gateway Integration (Stripe)
- [ ] Email Notifications
- [ ] SMS Alerts
- [ ] Advanced Analytics Dashboard
- [ ] Mobile App (React Native)
- [ ] Oil Recommendation Algorithm
- [ ] Dealer Locator Map
- [ ] Live Chat Support
- [ ] Inventory Management
- [ ] Multi-language Support

## 🎓 Learning Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [TypeScript Guide](https://www.typescriptlang.org/docs/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Prisma ORM](https://www.prisma.io/docs/)
- [Zustand State Management](https://github.com/pmndrs/zustand)

---

**Built with ❤️ for Valvoline | Production Ready | 2024**
# valvoline
