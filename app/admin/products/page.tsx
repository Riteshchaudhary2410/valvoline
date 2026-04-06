import AdminProductManager from '@/components/admin/AdminProductManager';
import AdminLogoutButton from '@/components/admin/AdminLogoutButton';

export default function AdminProductsPage() {
  const adminKey = process.env.ADMIN_API_KEY ?? '';

  return (
    <main className="min-h-screen bg-[#120605] px-4 py-10 text-white">
      <div className="container-max">
        <div className="mb-6 flex justify-end">
          <AdminLogoutButton />
        </div>
        <AdminProductManager adminKey={adminKey} />
      </div>
    </main>
  );
}
