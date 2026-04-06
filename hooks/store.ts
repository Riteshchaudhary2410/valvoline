import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Product, CartItem, VehicleSelection, UserRole } from '@/types';

interface CartStore {
  items: CartItem[];
  addItem: (product: Product, quantity: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  getItemCount: () => number;
}

export const useCart = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (product: Product, quantity: number) => {
        set((state) => {
          const existingItem = state.items.find((item) => item.product.id === product.id);

          if (existingItem) {
            return {
              items: state.items.map((item) =>
                item.product.id === product.id
                  ? { ...item, quantity: item.quantity + quantity }
                  : item
              ),
            };
          }

          return {
            items: [
              ...state.items,
              {
                id: `${product.id}-${Date.now()}`,
                cartId: '',
                product,
                quantity,
                price: product.price,
              },
            ],
          };
        });
      },

      removeItem: (productId: string) => {
        set((state) => ({
          items: state.items.filter((item) => item.product.id !== productId),
        }));
      },

      updateQuantity: (productId: string, quantity: number) => {
        if (quantity <= 0) {
          get().removeItem(productId);
          return;
        }

        set((state) => ({
          items: state.items.map((item) =>
            item.product.id === productId ? { ...item, quantity } : item
          ),
        }));
      },

      clearCart: () => {
        set({ items: [] });
      },

      getCartTotal: () => {
        return get().items.reduce((total, item) => total + item.price * item.quantity, 0);
      },

      getItemCount: () => {
        return get().items.reduce((count, item) => count + item.quantity, 0);
      },
    }),
    {
      name: 'cart-storage',
      skipHydration: true,
      partialize: (state) => ({ items: state.items }),
    }
  )
);

interface VehicleStore {
  selectedVehicle: VehicleSelection;
  setVehicleType: (type: string) => void;
  setVehicleBrand: (brand: string) => void;
  setVehicleModel: (model: string) => void;
  setVehicleYear: (year: number) => void;
  setVehicleEngine: (engine: string) => void;
  setKmDriven: (kmDriven: number) => void;
  resetVehicle: () => void;
}

export const useVehicleSelector = create<VehicleStore>()(
  persist(
    (set) => ({
      selectedVehicle: {},

      setVehicleType: (type: string) =>
        set((state) => ({
          selectedVehicle: {
            type,
            kmDriven: state.selectedVehicle.kmDriven,
          },
        })),

      setVehicleBrand: (brand: string) =>
        set((state) => ({
          selectedVehicle: {
            ...state.selectedVehicle,
            brand,
            model: undefined,
            year: undefined,
            engine: undefined,
          },
        })),

      setVehicleModel: (model: string) =>
        set((state) => ({
          selectedVehicle: {
            ...state.selectedVehicle,
            model,
            year: undefined,
            engine: undefined,
          },
        })),

      setVehicleYear: (year: number) =>
        set((state) => ({
          selectedVehicle: { ...state.selectedVehicle, year },
        })),

      setVehicleEngine: (engine: string) =>
        set((state) => ({
          selectedVehicle: { ...state.selectedVehicle, engine },
        })),

      setKmDriven: (kmDriven: number) =>
        set((state) => ({
          selectedVehicle: { ...state.selectedVehicle, kmDriven },
        })),

      resetVehicle: () =>
        set({
          selectedVehicle: {},
        }),
    }),
    {
      name: 'vehicle-selector-storage',
      skipHydration: true,
      partialize: (state) => ({ selectedVehicle: state.selectedVehicle }),
    }
  )
);

type FilterKey = 'vehicleType' | 'oilType' | 'viscosity' | 'brand' | 'minPrice' | 'maxPrice' | 'search';

interface FilterStore {
  filters: {
    vehicleType?: string;
    oilType?: string;
    viscosity?: string;
    brand?: string;
    minPrice?: number;
    maxPrice?: number;
    search?: string;
  };
  setFilter: <K extends FilterKey>(key: K, value: FilterStore['filters'][K]) => void;
  resetFilters: () => void;
}

export const useFilters = create<FilterStore>()((set) => ({
  filters: {},

  setFilter: <K extends FilterKey>(key: K, value: FilterStore['filters'][K]) =>
    set((state) => ({
      filters: { ...state.filters, [key]: value },
    })),

  resetFilters: () =>
    set({
      filters: {},
    }),
}));

interface AuthStore {
  user: {
    id: string;
    name: string;
    email: string;
    role: UserRole;
    company?: string;
    phone?: string;
    gstNumber?: string;
  } | null;
  isLoggedIn: boolean;
  setUser: (user: AuthStore['user']) => void;
  logout: () => void;
}

export const useAuth = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      isLoggedIn: false,

      setUser: (user) =>
        set({
          user,
          isLoggedIn: !!user,
        }),

      logout: () =>
        set({
          user: null,
          isLoggedIn: false,
        }),
    }),
    {
      name: 'auth-storage',
      skipHydration: true,
      partialize: (state) => ({ user: state.user, isLoggedIn: state.isLoggedIn }),
    }
  )
);
