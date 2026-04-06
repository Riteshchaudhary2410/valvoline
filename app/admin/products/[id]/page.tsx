import AdminEditProductForm from '@/components/admin/AdminEditProductForm';
import AdminLogoutButton from '@/components/admin/AdminLogoutButton';

interface AdminEditProductPageProps {
  params: {
    id: string;
  };
}

export default function AdminEditProductPage({ params }: AdminEditProductPageProps) {
  const adminKey = process.env.ADMIN_API_KEY ?? '';

  return (
    <main className="min-h-screen bg-[#120605] px-4 py-10 text-white">
      <div className="container-max max-w-3xl">
        <div className="mb-6 flex justify-end">
          <AdminLogoutButton />
        </div>
        <AdminEditProductForm adminKey={adminKey} productId={params.id} />
      </div>
    </main>
  );
}
