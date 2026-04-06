'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLogoutButton() {
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);

    try {
      const response = await fetch('/api/admin/logout', {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error('Logout failed');
      }

      localStorage.removeItem('admin-authenticated');
      router.replace('/admin/login');
      router.refresh();
    } catch {
      router.replace('/admin/login');
      router.refresh();
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleLogout}
      disabled={isLoggingOut}
      className="rounded-full border border-white/15 bg-white/5 px-5 py-3 text-sm font-semibold text-gray-200 transition-colors hover:border-primary-accent hover:text-primary-accent disabled:cursor-not-allowed disabled:opacity-60"
    >
      {isLoggingOut ? 'Signing out...' : 'Logout'}
    </button>
  );
}