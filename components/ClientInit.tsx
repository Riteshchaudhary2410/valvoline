'use client';

import { useEffect, type ReactNode } from 'react';
import { useAuth, useCart, useVehicleSelector } from '@/hooks/store';

export default function ClientInit({ children }: { children: ReactNode }) {
  useEffect(() => {
    useCart.persist.rehydrate();
    useAuth.persist.rehydrate();
    useVehicleSelector.persist.rehydrate();
  }, []);

  return children;
}
