import Image from 'next/image';
import Link from 'next/link';
import { FiArrowRight, FiCheckCircle, FiLayers, FiTruck } from 'react-icons/fi';
import { getProductBySlug, HOME_LINEUP_CARDS } from '@/lib/catalog';

const heroProducts = [
  getProductBySlug('valvoline-synpower-4t-10w40'),
  getProductBySlug('valvoline-champ-4t-fuel-efficient'),
  getProductBySlug('valvoline-fit-4t-20w40'),
].filter(Boolean);

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden border-b border-white/10 pb-10 pt-8 md:pb-14 md:pt-10">
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(29,93,184,0.24),transparent_28%),radial-gradient(circle_at_86%_14%,rgba(223,59,47,0.16),transparent_22%),linear-gradient(180deg,#081224_0%,#0d1931_42%,#0c1220_100%)]" />
        <div className="absolute inset-0 opacity-20 [background-image:linear-gradient(rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.06)_1px,transparent_1px)] [background-size:72px_72px]" />
        <div className="absolute -left-24 top-12 h-72 w-72 rounded-full blur-3xl" style={{ backgroundColor: 'rgba(29,93,184,0.2)' }} />
        <div className="absolute right-0 top-24 h-80 w-80 rounded-full bg-[rgba(223,59,47,0.15)] blur-3xl" />
      </div>

      <div className="container-max">
        <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 rounded-full border border-[rgba(255,255,255,0.15)] bg-[rgba(255,255,255,0.08)] px-4 py-2 text-sm text-white/90 backdrop-blur">
              <span className="h-2.5 w-2.5 rounded-full bg-[#df3b2f]" />
              Nepal-ready lubricant catalog with garage-first buying flows
            </div>

            <div className="max-w-3xl space-y-5">
              <h1 className="max-w-3xl text-4xl font-black leading-[0.95] tracking-tight text-white md:text-6xl xl:text-7xl">
                A sharper <span className="text-[#7cb1ff]">Valvoline</span> storefront for category-led discovery.
              </h1>
              <p className="max-w-2xl text-lg leading-8 text-slate-200 md:text-xl">
                We kept the product-first feel of a lubricant lineup page, then modernized it with cleaner hierarchy, bolder surfaces,
                and a smarter path from category browse to vehicle-specific recommendation.
              </p>
            </div>

            <div className="flex flex-col gap-4 sm:flex-row">
              <Link
                href="/products"
                className="btn rounded-full border border-[#df3b2f] bg-[#df3b2f] px-6 py-3 text-base font-semibold text-white shadow-[0_18px_42px_rgba(223,59,47,0.3)] hover:-translate-y-1 hover:bg-[#ef4d41]"
              >
                Explore product lineup
                <FiArrowRight size={18} />
              </Link>
              <Link
                href="/vehicle-selector"
                className="btn rounded-full border border-[rgba(255,255,255,0.15)] bg-[rgba(255,255,255,0.08)] px-6 py-3 text-base font-semibold text-white hover:border-white/30 hover:bg-[rgba(255,255,255,0.12)]"
              >
                Use compatibility finder
              </Link>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              {[
                { icon: FiLayers, value: '6', label: 'High-intent lineup groups' },
                { icon: FiTruck, value: 'B2B', label: 'Dealer and fleet friendly' },
                { icon: FiCheckCircle, value: 'Fitment', label: 'Vehicle-based selection' },
              ].map((item, index) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.label}
                    className="rounded-[1.5rem] border border-[rgba(255,255,255,0.12)] bg-[rgba(255,255,255,0.08)] p-4 backdrop-blur animate-reveal-up"
                    style={{ animationDelay: `${index * 120}ms` }}
                  >
                    <div className="flex items-center gap-3">
                      <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10 text-[#7cb1ff]">
                        <Icon size={18} />
                      </span>
                      <div>
                        <p className="text-2xl font-black text-white">{item.value}</p>
                        <p className="text-sm text-slate-300">{item.label}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="relative">
            <div className="absolute -left-10 top-8 h-48 w-48 rounded-full bg-[rgba(223,59,47,0.15)] blur-3xl" />
            <div className="absolute right-0 top-0 h-56 w-56 rounded-full bg-[rgba(29,93,184,0.25)] blur-3xl" />

            <div className="relative overflow-hidden rounded-[2.25rem] border border-[rgba(255,255,255,0.12)] bg-[linear-gradient(160deg,rgba(255,255,255,0.98),rgba(237,244,251,0.95))] p-5 text-[#0f2140] shadow-[0_35px_90px_rgba(2,8,23,0.4)] md:p-6">
              <div className="absolute inset-x-0 top-0 h-2 bg-[linear-gradient(90deg,#1d5db8,#df3b2f)]" />

              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.34em] text-slate-500">Leading-edge lineup</p>
                  <h2 className="mt-3 max-w-md text-3xl font-black leading-tight text-[#0f2140]">
                    Product families arranged the way garages and drivers actually shop.
                  </h2>
                </div>
                <div className="rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-bold uppercase tracking-[0.24em] text-[#1d5db8]">
                  Modern retail + B2B
                </div>
              </div>

              <div className="mt-8 grid gap-4 md:grid-cols-[1.08fr_0.92fr]">
                <div className="relative min-h-[340px] overflow-hidden rounded-[2rem] bg-[linear-gradient(140deg,#e5eefb,#ffffff)] p-5">
                  <div className="absolute -right-12 top-8 h-36 w-36 rounded-full bg-[rgba(29,93,184,0.12)] blur-3xl" />
                  <div className="absolute -left-8 bottom-4 h-32 w-32 rounded-full blur-3xl" style={{ backgroundColor: 'rgba(223,59,47,0.1)' }} />

                  {heroProducts[0] ? (
                    <div className="absolute left-5 top-6 w-[46%] rounded-[1.75rem] border border-white/90 bg-white p-3 shadow-[0_18px_45px_rgba(16,41,75,0.15)] animate-float-card">
                      <div className="relative aspect-[4/5] overflow-hidden rounded-[1.2rem] bg-[#f3f6fb]">
                        <Image src={heroProducts[0].image} alt={heroProducts[0].name} fill className="object-contain p-4" />
                      </div>
                    </div>
                  ) : null}

                  {heroProducts[1] ? (
                    <div
                      className="absolute right-5 top-16 w-[36%] rounded-[1.5rem] border border-[rgba(223,59,47,0.15)] p-3 text-white shadow-[0_20px_50px_rgba(16,41,75,0.24)] animate-float-card"
                      style={{ animationDelay: '1.2s', backgroundColor: '#0f2140' }}
                    >
                      <div className="relative aspect-[4/5] overflow-hidden rounded-[1.1rem] bg-[linear-gradient(180deg,#17345e,#0b1527)]">
                        <Image src={heroProducts[1].image} alt={heroProducts[1].name} fill className="object-contain p-4" />
                      </div>
                    </div>
                  ) : null}

                  {heroProducts[2] ? (
                    <div
                      className="absolute bottom-5 right-10 w-[40%] rounded-[1.5rem] border border-slate-200 bg-white p-3 shadow-[0_18px_45px_rgba(16,41,75,0.18)] animate-float-card"
                      style={{ animationDelay: '2.2s' }}
                    >
                      <div className="relative aspect-[4/5] overflow-hidden rounded-[1.1rem] bg-[#eef3fb]">
                        <Image src={heroProducts[2].image} alt={heroProducts[2].name} fill className="object-contain p-4" />
                      </div>
                    </div>
                  ) : null}

                  <div className="absolute bottom-4 left-4 max-w-[58%] rounded-[1.4rem] border border-white/80 bg-white/90 p-4 backdrop-blur">
                    <p className="text-xs font-bold uppercase tracking-[0.26em] text-slate-500">Built for quick browsing</p>
                    <p className="mt-2 text-sm font-semibold leading-6 text-slate-700">
                      Product cards, vehicle fitment, and bulk-ready buying cues are all visible before checkout.
                    </p>
                  </div>
                </div>

                <div className="grid gap-3">
                  {HOME_LINEUP_CARDS.slice(0, 3).map((card, index) => (
                    <Link
                      key={card.title}
                      href={card.href}
                      className="group rounded-[1.5rem] border border-slate-200 bg-white p-4 transition-all duration-300 hover:-translate-y-1 hover:border-slate-300 hover:shadow-[0_18px_50px_rgba(16,41,75,0.12)]"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-slate-500">{card.eyebrow}</p>
                          <h3 className="mt-2 text-lg font-black text-[#0f2140]">{card.title}</h3>
                        </div>
                        <span
                          className="mt-1 h-3 w-14 rounded-full"
                          style={{ background: index === 1 ? '#1d5db8' : '#df3b2f' }}
                        />
                      </div>
                      <p className="mt-3 text-sm leading-6 text-slate-600">{card.description}</p>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
