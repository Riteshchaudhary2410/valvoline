import Link from 'next/link';
import AdminLogoutButton from '@/components/admin/AdminLogoutButton';

const adminLinks = [
  {
    title: 'Add Product',
    href: '/admin/add',
    description: 'Create a new product with a simple form and automatic slug generation.',
  },
  {
    title: 'Manage Products',
    href: '/admin/products',
    description: 'View the product catalog, inspect records, and remove items when needed.',
  },
  {
    title: 'Manage Orders',
    href: '/admin/orders',
    description: 'Review customer orders and update delivery status in one place.',
  },
];

export default function AdminPage() {
  return (
    <main className="min-h-screen bg-[#120605] text-white">
      <section className="border-b border-white/10 bg-gradient-to-b from-[#1c0d07] to-[#120605]">
        <div className="container-max py-14">
          <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-primary-accent">Admin Panel</p>
              <h1 className="mt-4 text-4xl font-bold md:text-5xl">Product management</h1>
              <p className="mt-4 max-w-2xl text-gray-300">
                Use the links below to add products or manage the existing catalog.
              </p>
            </div>
            <AdminLogoutButton />
          </div>
        </div>
      </section>

      <section className="py-10">
        <div className="container-max grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {adminLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="group rounded-[1.75rem] border border-white/10 bg-white/5 p-6 transition-all hover:-translate-y-1 hover:border-primary-accent/40 hover:bg-white/10"
            >
              <p className="text-sm uppercase tracking-[0.28em] text-gray-500">Admin action</p>
              <h2 className="mt-4 text-2xl font-bold text-white">{link.title}</h2>
              <p className="mt-3 text-gray-300">{link.description}</p>
              <span className="mt-6 inline-flex text-sm font-semibold text-primary-accent transition-transform group-hover:translate-x-1">
                Open section →
              </span>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
