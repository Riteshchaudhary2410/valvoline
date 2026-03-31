import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { BULK_TIERS } from '@/lib/catalog';
import { FiArrowRight, FiCheck, FiRefreshCw, FiTruck } from 'react-icons/fi';

export default function B2BPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen">
        <section className="border-b border-white/10 bg-[#120605]/80 py-16 md:py-20">
          <div className="container-max grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            <div className="space-y-6">
              <p className="text-sm uppercase tracking-[0.28em] text-gray-500">B2B lubricant program</p>
              <h1 className="text-4xl font-bold md:text-5xl">
                Bulk pricing, repeat ordering, and fitment support for garages and mechanics.
              </h1>
              <p className="max-w-2xl text-gray-300">
                Built for workshop buyers who need a fast way to compare lubricant options, repeat proven orders, and keep service counters moving.
              </p>
              <div className="flex flex-col gap-3 sm:flex-row">
                <Link href="/signup" className="btn btn-primary rounded-full px-5 py-3">
                  Create B2B account
                  <FiArrowRight size={16} />
                </Link>
                <Link href="/vehicle-selector" className="btn btn-outline rounded-full px-5 py-3">
                  Try vehicle selector
                </Link>
              </div>
            </div>

            <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6 backdrop-blur">
              <div className="flex items-center gap-3 rounded-3xl border border-white/10 bg-black/20 p-4">
                <FiTruck className="text-primary-accent" size={22} />
                <div>
                  <p className="text-sm uppercase tracking-[0.24em] text-gray-500">Garage ready</p>
                  <p className="font-semibold">Order again and bulk tier visibility</p>
                </div>
              </div>
              <div className="mt-4 rounded-3xl border border-primary-accent/20 bg-primary-accent/10 p-4 text-sm text-gray-200">
                Garages can later connect to live Stripe or invoice checkout while keeping the same product catalog and repeat order flow.
              </div>
            </div>
          </div>
        </section>

        <section className="py-16">
          <div className="container-max space-y-8">
            <div className="max-w-2xl space-y-3">
              <p className="text-sm uppercase tracking-[0.28em] text-gray-500">Bulk tiers</p>
              <h2 className="text-3xl font-bold md:text-4xl">Pricing shaped around actual lubricant consumption.</h2>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              {BULK_TIERS.map((tier) => (
                <div key={tier.title} className={`rounded-[2rem] border p-6 ${tier.title === 'Professional' ? 'border-primary-accent bg-primary-accent/10' : 'border-white/10 bg-white/5'}`}>
                  <p className="text-sm uppercase tracking-[0.24em] text-gray-500">{tier.range}</p>
                  <h3 className="mt-3 text-2xl font-bold">{tier.title}</h3>
                  <p className="mt-4 text-4xl font-bold text-primary-accent">{tier.discount}</p>
                  <p className="mt-4 text-sm text-gray-300">{tier.description}</p>
                  <ul className="mt-6 space-y-3 text-sm text-gray-200">
                    {['Order again workflow', 'Compatibility guidance', 'Business purchase history'].map((item) => (
                      <li key={item} className="flex items-center gap-2">
                        <FiCheck className="text-primary-accent" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 border-y border-white/10">
          <div className="container-max grid gap-8 lg:grid-cols-[1fr_1fr]">
            <div className="space-y-4">
              <p className="text-sm uppercase tracking-[0.28em] text-gray-500">What garages get</p>
              <h2 className="text-3xl font-bold">A dashboard built for service counters.</h2>
              <p className="text-gray-300">
                The dashboard supports repeat orders, saved vehicles, and a quick overview of bulk buying activity.
              </p>
            </div>

            <div className="grid gap-4">
              {[
                {
                  title: 'Order again',
                  description: 'Repeat the same lubricant basket from a prior invoice or dashboard entry.',
                  icon: FiRefreshCw,
                },
                {
                  title: 'Vehicle matching',
                  description: 'Use the selector to pair the vehicle with the right viscosity and pack size.',
                  icon: FiTruck,
                },
                {
                  title: 'Business tracking',
                  description: 'Keep a lightweight order trail for workshop procurement.',
                  icon: FiCheck,
                },
              ].map((feature) => {
                const Icon = feature.icon;
                return (
                  <div key={feature.title} className="rounded-3xl border border-white/10 bg-white/5 p-5">
                    <div className="flex items-start gap-4">
                      <Icon className="mt-1 text-primary-accent" size={20} />
                      <div>
                        <h3 className="text-lg font-bold">{feature.title}</h3>
                        <p className="mt-2 text-sm text-gray-400">{feature.description}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
