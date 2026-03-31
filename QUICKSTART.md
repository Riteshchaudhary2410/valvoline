# 🚀 Valvoline eCommerce Platform - Quick Start Guide

## Project Overview

This is a **production-ready eCommerce platform** for Valvoline lubricant dealers with intelligent vehicle selection, advanced filtering, B2B features, and a premium dark industrial UI.

### ✨ Key Highlights

- 🎯 **Smart Vehicle Selector** - Multi-step vehicle selection with auto oil recommendations
- 🛍️ **Complete Shopping Experience** - Product browsing, filtering, cart, checkout
- 👥 **B2B Dashboard** - Bulk pricing, order management, team accounts
- 📱 **Responsive Design** - Mobile-first with dark industrial theme
- 🔐 **User Authentication** - Login, profiles, saved vehicles
- ⚡ **Performance Optimized** - Next.js, TypeScript, Prisma, Tailwind CSS
- 🎨 **Custom Theme** - Dark (#270301) + Orange (#F68B2C) color scheme

---

## 📦 Installation & Setup

### Step 1: Environment Setup

```bash
cd /Users/riteshchaudhary/project_valvoline

# Install dependencies
npm install

# Create environment file
cp .env.example .env.local
```

### Step 2: Database Setup

```bash
# Generate Prisma client
npm run prisma:generate

# Create and migrate database
npm run prisma:migrate

# Seed sample data
npm run seed
```

### Step 3: Start Development Server

```bash
npm run dev
```

Visit `http://localhost:3000` 🎉

---

## 📂 Project Structure

```
app/                          # Next.js App Router
├── layout.tsx               # Root layout
├── page.tsx                 # Homepage
├── api/                     # API routes
├── products/                # Product pages
├── vehicle-selector/        # Vehicle selector
├── cart/                    # Shopping cart
├── login/                   # Authentication
├── dashboard/               # User dashboard
└── b2b/                     # B2B features

components/                 # Reusable components
├── Navbar.tsx
├── Footer.tsx
├── HeroSection.tsx
├── ProductCard.tsx
├── ProductFilters.tsx
└── VehicleSelector.tsx

hooks/store.ts              # Zustand stores
lib/                        # Utilities
├── prisma.ts
├── utils.ts
└── vehicleData.ts

types/index.ts              # TypeScript types
styles/globals.css          # Tailwind styles
prisma/                     # Database
├── schema.prisma
└── seed.ts
```

---

## 🎨 Features Walkthrough

### 1️⃣ Homepage (`/`)
- Hero section with industrial theme
- Featured product categories
- Call-to-action buttons
- Benefits showcase

### 2️⃣ Vehicle Selector (`/vehicle-selector`)
- **Step 1**: Select Vehicle Type (Bike, Car, Truck)
- **Step 2**: Choose Brand
- **Step 3**: Select Model
- **Step 4**: Pick Year
- **Step 5**: Choose Engine
- Auto-recommendation of oils

### 3️⃣ Products (`/products`)
- Grid view of products
- Advanced filtering (type, viscosity, price, vehicle)
- Search functionality
- Sort by featured, price, newest
- Add to cart functionality

### 4️⃣ Product Detail (`/products/[slug]`)
- Full product specs
- Benefits and features
- Vehicle compatibility
- Bulk pricing info
- Add to cart with quantity

### 5️⃣ Shopping Cart (`/cart`)
- View all items
- Adjust quantities
- Calculate total with tax & shipping
- Free shipping over ₹2000
- Bulk discount alerts

### 6️⃣ User Dashboard (`/dashboard`)
- Order history
- Profile management
- Saved vehicles
- Account settings

### 7️⃣ B2B Features (`/b2b`)
- Tiered pricing (10%, 20%, 30% discounts)
- Business dashboard
- Team management
- Bulk order management

---

## 🔧 Configuration

### Environment Variables

Create `.env.local`:

```env
# Database
DATABASE_URL="file:./dev.db"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="generate-a-random-string-here"

# Stripe (Optional)
STRIPE_PUBLIC_KEY="pk_test_..."
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."

# Database (PostgreSQL alternative)
# DATABASE_URL="postgresql://user:pass@localhost:5432/valvoline"
```

### Customization

**Change Theme Colors** (`tailwind.config.ts`):
```ts
colors: {
  primary: {
    dark: '#270301',   // Dark burgundy
    accent: '#F68B2C', // Orange
  },
}
```

**Add New Vehicles** (`lib/vehicleData.ts`):
```ts
export const VEHICLE_DATA = {
  Bike: { brands: [...], models: {...} },
  Car: { brands: [...], models: {...} },
  Truck: { brands: [...], models: {...} },
  // Add more here
}
```

**Modify Products** (`prisma/seed.ts`):
```ts
// Edit or add products before running npm run seed
```

---

## 🚀 Deployment

### Deploy to Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Deploy to Docker

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

Build & run:
```bash
docker build -t valvoline .
docker run -p 3000:3000 valvoline
```

### Environment Setup for Production

```env
DATABASE_URL="postgresql://user:pass@prod-db:5432/valvoline"
NEXTAUTH_URL="https://yourdomain.com"
NEXTAUTH_SECRET="long-random-string-here"
NODE_ENV="production"
```

---

## 📊 Database Schema

### Key Models

**Users**
- Email, password, profile info
- Roles: CUSTOMER, MECHANIC, GARAGE, ADMIN

**Products**
- Name, description, type, viscosity
- Price, bulk pricing, compatibility
- Stock, SKU, featured flag

**Orders**
- Order number, user, items, status
- Total, tax, shipping
- Payment status

**Vehicles**
- User vehicles (saved profiles)
- Vehicle type, brand, model, year, engine

**VehicleCompatibility**
- Cross-reference vehicle → recommended products

---

## 🔒 Security Features

- ✅ Input validation with Zod
- ✅ Password hashing (bcrypt ready)
- ✅ CSRF protection
- ✅ SQL injection prevention (Prisma)
- ✅ Rate limiting ready
- ✅ HTTPS ready

---

## 📈 Performance

- **Image Optimization**: Next.js Image component
- **Code Splitting**: Automatic with Next.js
- **Caching**: Server-side and client-side strategies
- **Database**: Indexed queries with Prisma
- **CSS**: Tailwind purging of unused styles

---

## 🧪 Testing the App

### Demo Credentials
```
Email: demo@valvoline.com
Password: demo123
```

### Test Flows

1. **Browse Products**
   - Go to `/products`
   - Filter by type, viscosity
   - Add items to cart

2. **Vehicle Selector**
   - Go to `/vehicle-selector`
   - Select vehicle details (e.g., Honda City 2023)
   - View recommended oils

3. **Shopping**
   - Add items to cart
   - Go to `/cart`
   - See total with tax & shipping
   - (Checkout not yet integrated)

4. **User Dashboard**
   - Go to `/login`
   - View order history, profile

---

## 📁 Key Files to Edit

| File | Purpose |
|------|---------|
| `tailwind.config.ts` | Change colors, theme |
| `prisma/seed.ts` | Add sample products |
| `lib/vehicleData.ts` | Add vehicle models |
| `components/HeroSection.tsx` | Customize homepage |
| `app/page.tsx` | Homepage layout |

---

## ⚠️ Common Issues & Solutions

### Port 3000 Already in Use
```bash
npm run dev -- -p 3001
```

### Database Error
```bash
rm prisma/dev.db prisma/dev.db-journal
npm run prisma:migrate
npm run seed
```

### Prisma Client Not Found
```bash
npm run prisma:generate
```

### Tailwind Not Working
```bash
npm install -D tailwindcss postcss autoprefixer
npm run dev
```

---

## 📚 Technology Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: Prisma + SQLite (PostgreSQL ready)
- **State**: Zustand
- **Icons**: React Icons
- **Payment**: Stripe (ready to integrate)

---

## 🎯 Next Steps for Production

1. **Integrate Stripe Payment** - Complete checkout flow
2. **Add Email Notifications** - Order confirmations, updates
3. **Implement Admin Panel** - Manage products, orders
4. **Setup Analytics** - Google Analytics, Mixpanel
5. **Database Migration** - Move to PostgreSQL/MongoDB
6. **API Documentation** - Swagger/OpenAPI specs
7. **Performance Monitoring** - Sentry, New Relic
8. **SEO Optimization** - Meta tags, sitemaps

---

## 🤝 Support

- 📖 [Next.js Docs](https://nextjs.org/docs)
- 🎨 [Tailwind CSS Docs](https://tailwindcss.com)
- 🗄️ [Prisma Docs](https://www.prisma.io/docs)
- ⚛️ [React Docs](https://react.dev)

---

## 📄 License

MIT License - Free for commercial use

---

**Happy coding! 🚀 Build something amazing with Valvoline eCommerce Platform.**
