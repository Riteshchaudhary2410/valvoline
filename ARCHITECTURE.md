# Architecture & Features Documentation

## 🏗️ System Architecture

### Frontend Stack
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **UI Components**: Custom + React Icons

### Backend Stack
- **Runtime**: Node.js (Next.js)
- **Database**: Prisma ORM
- **DB Provider**: SQLite (dev) / PostgreSQL (prod)
- **API**: RESTful with Next.js Route Handlers

### Key Patterns
- Server-Side Rendering for SEO
- Client-Side State with Zustand
- API Routes for CRUD operations
- Middleware for authentication (ready)
- Environment-based configuration

---

## 🎯 Core Features

### 1. **Smart Vehicle Selector** ⭐
**Location**: `/vehicle-selector`, `components/VehicleSelector.tsx`

**Flow**:
1. User selects Vehicle Type (Bike/Car/Truck)
2. Selects Brand from available options
3. Chooses Model based on brand
4. Picks Year of manufacture
5. Selects Engine variant
6. Gets recommended oils

**Data Source**: `lib/vehicleData.ts`
- 7 bike brands (Hero, Honda, Yamaha, etc.)
- 8 car brands (Honda, Hyundai, Maruti, etc.)
- 6 truck brands (Tata, Volvo, MAN, etc.)

**Database**: `VehicleCompatibility` model
- Maps vehicle specs to recommended products
- Future: AI-based recommendations

---

### 2. **Product Catalog** 📦
**Location**: `/products`

**Features**:
- **6 Product Types**:
  - Engine Oil (multiple viscosities)
  - Gear Oil
  - Hydraulic Oil
  - Grease (NLGI certified)
  - Industrial Oils

- **Filtering by**:
  - Oil Type (ENGINE_OIL, GEAR_OIL, etc.)
  - Viscosity (5W-30, 10W-40, 20W-50, etc.)
  - Price Range (₹0 - ₹10,000+)
  - Vehicle Type (Bike, Car, Truck)
  - Search Text

- **Sorting**:
  - Featured (default)
  - Price (Low to High / High to Low)
  - Newest First

**Product Info**:
```json
{
  "name": "Valvoline Advanced Full Synthetic 5W-30",
  "type": "ENGINE_OIL",
  "viscosity": "5W-30",
  "quantity": 1000,
  "quantityUnit": "ml",
  "price": 599,
  "bulkPrice": 499,
  "vehicleTypes": ["Car", "Bike"],
  "benefits": ["Superior protection", "Better fuel economy"],
  "specifications": ["API SN Plus", "ILSAC GF-6A"],
  "stock": 200,
  "featured": true
}
```

---

### 3. **Shopping Cart** 🛒
**Location**: `/cart`

**Features**:
- Add/Remove items
- Adjust quantities (1-stock limit)
- Persistent storage (localStorage via Zustand)
- Auto-calculate totals
- Tax calculation (18% GST)
- Shipping calculation
  - Free for orders ₹2000+
  - Fixed ₹199 otherwise
- Bulk discount alerts
- Cart summary

**Store**: `hooks/store.ts` - `useCart()`

---

### 4. **Product Details** 📄
**Location**: `/products/[slug]`

**Sections**:
1. **Image Gallery**
   - Main product image
   - Thumbnail carousel
   - Hover zoom effect

2. **Product Info**
   - Name, type, viscosity
   - Rating (5 stars, mock reviews)
   - Stock status
   - SKU and quantity

3. **Pricing**
   - Regular price
   - Bulk pricing (if available)
   - Discount percentage
   - GST included notice

4. **Benefits**
   - Bullet-point benefits
   - Check icons
   - Real-world applications

5. **Specifications**
   - API/OEM compliance
   - Temperature ranges
   - Performance advantages

6. **Related Info**
   - Shipping details
   - Returns policy
   - Quality guarantee

---

### 5. **B2B Dashboard** 🏢
**Location**: `/b2b`

**Features**:
- Tiered pricing structure
  - Starter: 10-50 units = 10% off
  - Professional: 50-200 units = 20% off
  - Enterprise: 200+ units = 30% off

- Business features (planned)
  - Order management
  - Inventory tracking
  - Team accounts
  - Bulk ordering
  - Reporting & analytics

- Benefits
  - Priority support
  - Custom pricing
  - API access
  - Monthly reports

---

### 6. **User Authentication** 🔐
**Location**: `/login`, `/signup`

**Features**:
- Email/Password login
- Social auth ready (Google, Facebook, Apple)
- User roles: CUSTOMER, MECHANIC, GARAGE, ADMIN
- Profile management
- Saved vehicles

**Store**: `hooks/store.ts` - `useAuth()`

**User Data**:
```json
{
  "id": "unique-id",
  "name": "John Doe",
  "email": "john@example.com",
  "role": "CUSTOMER",
  "phone": "+91-98765-43210",
  "street": "123 Main St",
  "city": "Mumbai",
  "state": "Maharashtra",
  "zipCode": "400001",
  "country": "India",
  "company": "ABC Garage",
  "gstNumber": "27ABCDE9999X1Z0"
}
```

---

### 7. **User Dashboard** 👤
**Location**: `/dashboard`

**Tabs**:
1. **Orders**
   - Order history
   - Status tracking
   - Order details
   - Re-order option

2. **Profile**
   - Edit personal info
   - Update address
   - Change contact details

3. **My Vehicles**
   - Saved vehicle profiles
   - Quick access for recommendations
   - Edit/delete vehicles

4. **Settings**
   - Notification preferences
   - Account security
   - Password management
   - Delete account

---

### 8. **Responsive Design** 📱
**Breakpoints** (Tailwind):
- Mobile: 320px - 640px
- Tablet: 641px - 1024px
- Desktop: 1025px+

**Mobile-First Approach**:
- Touch-friendly buttons (min 44x44px)
- Collapsible navigation
- Stacked layouts
- Optimized images
- Fast loading

---

## 🗄️ Database Schema

### Tables

#### Users
```sql
CREATE TABLE User (
  id STRING PRIMARY KEY,
  name STRING,
  email STRING UNIQUE,
  password STRING,
  role ENUM (CUSTOMER, MECHANIC, GARAGE, ADMIN),
  phone STRING,
  street STRING,
  city STRING,
  state STRING,
  zipCode STRING,
  country STRING,
  company STRING,
  gstNumber STRING,
  createdAt DATETIME,
  updatedAt DATETIME
);
```

#### Products
```sql
CREATE TABLE Product (
  id STRING PRIMARY KEY,
  name STRING,
  slug STRING UNIQUE,
  description TEXT,
  type ENUM (ENGINE_OIL, GEAR_OIL, ...),
  viscosity STRING,
  quantity INT,
  price FLOAT,
  bulkPrice FLOAT,
  stock INT,
  sku STRING UNIQUE,
  featured BOOLEAN,
  active BOOLEAN,
  vehicleTypes JSON,
  benefits JSON,
  specifications JSON,
  createdAt DATETIME,
  updatedAt DATETIME
);
```

#### Orders
```sql
CREATE TABLE Order (
  id STRING PRIMARY KEY,
  orderNumber STRING UNIQUE,
  userId STRING,
  status ENUM (PENDING, CONFIRMED, SHIPPED, DELIVERED),
  subtotal FLOAT,
  tax FLOAT,
  shipping FLOAT,
  total FLOAT,
  paymentStatus ENUM (PENDING, COMPLETED, FAILED),
  paymentMethod STRING,
  createdAt DATETIME,
  updatedAt DATETIME
);
```

---

## 🔄 Data Flow

### Shopping Flow
```
1. User visits homepage
2. Browses products or uses vehicle selector
3. Adds items to cart (client-side with Zustand)
4. Views cart with totals calculated
5. Proceeds to checkout (API call)
6. Enters shipping address
7. Selects payment method
8. Submits order (creates Order in DB)
9. Gets order confirmation
```

### Vehicle Selector Flow
```
1. User selects vehicle type
2. Available brands loaded from VEHICLE_DATA
3. User selects brand → models loaded
4. User selects model → years loaded
5. User selects year → engines loaded
6. User selects engine → recommended products shown
7. User clicks "View Oils" → Products page with filter
```

---

## 🎨 Design System

### Colors
```
Primary Dark: #270301 (Deep Burgundy)
Accent: #F68B2C (Orange)
Background: #1a1a1a (Dark Gray)
Surface: #270301 with overlays
Text Primary: #FFFFFF
Text Secondary: #999999
Success: #10B981
Warning: #F59E0B
Error: #EF4444
```

### Typography
```
Font: Inter (system font fallback)
H1: 60px, 800 weight
H2: 48px, 700 weight
H3: 36px, 700 weight
Body: 16px, 400 weight
Small: 14px, 400 weight
```

### Spacing
```
Base unit: 4px
Used: 4, 8, 12, 16, 20, 24, 32, 40, 48px
```

### Components
- **Buttons**: Primary, Secondary, Outline, Ghost
- **Badges**: Primary, Secondary, Success, Warning, Danger
- **Cards**: Hover lift, glow effect
- **Inputs**: Dark theme with focus states
- **Modals**: Dark overlay with animation

---

## 🔌 API Endpoints

### Products
```
GET    /api/products              # List products with filters
GET    /api/products/[id]        # Get single product
POST   /api/products             # Create product (admin)
PUT    /api/products/[id]        # Update product (admin)
DELETE /api/products/[id]        # Delete product (admin)
```

### Cart
```
GET    /api/cart?userId=[id]     # Get user cart
POST   /api/cart                 # Add item to cart
PUT    /api/cart/[itemId]        # Update cart item
DELETE /api/cart/[itemId]        # Remove from cart
```

### Orders (Planned)
```
GET    /api/orders               # List user orders
GET    /api/orders/[id]          # Get order details
POST   /api/orders               # Create order
PUT    /api/orders/[id]          # Update order status
```

### Users (Planned)
```
POST   /api/auth/signup          # Create account
POST   /api/auth/login           # Login user
POST   /api/auth/logout          # Logout
GET    /api/users/me             # Get current user
PUT    /api/users/me             # Update profile
```

---

## 🚀 Performance Optimizations

### Frontend
- Image lazy loading with Next.js Image
- Code splitting by route
- Zustand for minimal re-renders
- Tailwind CSS purging
- CSS-in-JS optimization

### Backend
- Prisma query optimization with `.select()`
- Database indexes on foreign keys
- Pagination ready
- Caching strategies defined

### Database
- Indexed columns: userId, productId, type, viscosity
- Unique constraints on email, sku, slug
- Proper relationships defined

---

## 🔐 Security Considerations

1. **Input Validation**: Zod schema validation
2. **SQL Injection**: Prisma parameterized queries
3. **CSRF**: Next.js built-in protection
4. **XSS**: React escaping + Server-Side Rendering
5. **Authentication**: JWT ready (NextAuth)
6. **Rate Limiting**: Ready to implement
7. **HTTPS**: Required for production

---

## 📈 Scalability

### Current Limits
- 1000s of products
- 10,000s of users
- SQLite: Single connection

### For Scale-up
1. **Database**: Migrate to PostgreSQL
2. **Caching**: Redis for sessions/products
3. **CDN**: CloudFlare for assets
4. **Queuing**: Bull for async jobs
5. **Search**: Elasticsearch for advanced search
6. **Load Balancing**: Multiple instances

---

## 🧩 Component Hierarchy

```
RootLayout
├── Navbar
│   ├── Logo
│   ├── Menu
│   ├── Search
│   └── Cart Badge
├── Page Components
│   ├── HeroSection
│   ├── ProductGrid
│   ├── ProductCard (x many)
│   ├── VehicleSelector
│   └── etc.
└── Footer
    ├── Links
    └── Copyright
```

---

## 📚 State Management

### Zustand Stores

**useCart()**
```ts
{
  items: CartItem[]
  addItem(product, quantity)
  removeItem(productId)
  updateQuantity(productId, quantity)
  clearCart()
  getCartTotal()
  getItemCount()
}
```

**useVehicleSelector()**
```ts
{
  selectedVehicle: VehicleProfile
  setVehicleType(type)
  setVehicleBrand(brand)
  setVehicleModel(model)
  setVehicleYear(year)
  setVehicleEngine(engine)
  resetVehicle()
}
```

**useFilters()**
```ts
{
  filters: FilterOptions
  setFilter(key, value)
  resetFilters()
}
```

**useAuth()**
```ts
{
  user: User | null
  isLoggedIn: boolean
  setUser(user)
  logout()
}
```

---

## 🎯 Future Roadmap

### Phase 1 (Current)
- ✅ Product catalog
- ✅ Vehicle selector
- ✅ Shopping cart
- ✅ User authentication
- ✅ B2B features

### Phase 2 (Next)
- Stripe payment integration
- Email notifications
- Admin dashboard
- Advanced analytics

### Phase 3 (Future)
- Mobile app (React Native)
- AI recommendations
- Dealer locator
- Live chat support
- Inventory management

---

## 🎓 Code Examples

### Adding Product to Cart
```tsx
import { useCart } from '@/hooks/store';

export function ProductCard({ product }) {
  const { addItem } = useCart();
  
  const handleAdd = () => {
    addItem(product, quantity);
  };
  
  return <button onClick={handleAdd}>Add to Cart</button>;
}
```

### Using Vehicle Selector
```tsx
import { useVehicleSelector } from '@/hooks/store';

export function VehicleFilter() {
  const { selectedVehicle, setVehicleType } = useVehicleSelector();
  
  return (
    <select onChange={(e) => setVehicleType(e.target.value)}>
      <option>Bike</option>
      <option>Car</option>
      <option>Truck</option>
    </select>
  );
}
```

### API Call Example
```tsx
async function getProducts(filters) {
  const params = new URLSearchParams(filters);
  const response = await fetch(`/api/products?${params}`);
  return response.json();
}
```

---

**This architecture is designed for scalability, maintainability, and optimal user experience.**
