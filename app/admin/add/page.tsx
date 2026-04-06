import AdminProductForm from '@/components/admin/AdminProductForm';
import AdminLogoutButton from '@/components/admin/AdminLogoutButton';

export default function AdminAddPage() {
  const adminKey = process.env.ADMIN_API_KEY ?? '';

  return (
    <main className="min-h-screen bg-[#120605] px-4 py-10 text-white">
      <div className="container-max max-w-3xl">
        <div className="mb-6 flex justify-end">
          <AdminLogoutButton />
        </div>
        <AdminProductForm adminKey={adminKey} />
      </div>
    </main>
  );
}
