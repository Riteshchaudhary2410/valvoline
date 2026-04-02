import Image from 'next/image';
import Link from 'next/link';
import { FiArrowRight, FiCheckCircle, FiLayers, FiTruck } from 'react-icons/fi';
import { getProductBySlug, HOME_LINEUP_CARDS } from '@/lib/catalog';

export default function HeroSection() {
  const segmentCards = HOME_LINEUP_CARDS.slice(0, 3);

  // Get products for each segment
  const getSegmentProducts = (card: typeof HOME_LINEUP_CARDS[0]) => {
    return card.productSlugs
      .map((slug) => getProductBySlug(slug))
      .filter(Boolean);
  };
  const commercialProduct = segmentCards[2] ? getSegmentProducts(segmentCards[2])[0] : undefined;

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
              Serving Sagarmatha Zone's garages since 2010 • Trusted by 500+ mechanics
            </div>

            <div className="max-w-3xl space-y-5">
              <h1 className="max-w-3xl text-4xl font-black leading-[0.95] tracking-tight text-white md:text-6xl xl:text-7xl">
                Premium <span className="text-[#7cb1ff]">Valvoline</span> oils for your engine.
              </h1>
              <p className="max-w-2xl text-lg leading-8 text-slate-200 md:text-xl">
                From bikes to heavy vehicles — stock, supply, and support for workshops, garages, and bulk buyers. Your trusted partner for Valvoline lubricants.
              </p>
            </div>

            <div className="flex flex-col gap-4 sm:flex-row">
              <Link
                href="/vehicle-selector"
                className="btn rounded-full border border-[#df3b2f] bg-[#df3b2f] px-6 py-3 text-base font-semibold text-white shadow-[0_18px_42px_rgba(223,59,47,0.3)] hover:-translate-y-1 hover:bg-[#ef4d41]"
              >
                Find your oil now
                <FiArrowRight size={18} />
              </Link>
              <Link
                href="/b2b"
                className="btn rounded-full border border-[rgba(255,255,255,0.15)] bg-[rgba(255,255,255,0.08)] px-6 py-3 text-base font-semibold text-white hover:border-white/30 hover:bg-[rgba(255,255,255,0.12)]"
              >
                Bulk orders for garages
              </Link>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              {[
                { icon: FiCheckCircle, value: '15+', label: 'Years of trust' },
                { icon: FiTruck, value: '500+', label: 'Garage partners' },
                { icon: FiLayers, value: 'Fast', label: 'Delivery to Pradesh no. - 2' },
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

            {/* Customer Testimonials Section */}
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-[1.5rem] border border-[rgba(255,255,255,0.15)] bg-[rgba(255,255,255,0.08)] backdrop-blur p-4 hover:bg-[rgba(255,255,255,0.12)] transition-all">
                <p className="text-sm leading-6 text-slate-200 italic">"Best lubricant quality with instant delivery. Saved us thousands in fleet maintenance costs."</p>
                <p className="mt-3 text-xs font-bold text-[#7cb1ff]">— Mechanic, Madhesh Pardesh</p>
              </div>
              <div className="rounded-[1.5rem] border border-[rgba(255,255,255,0.15)] bg-[rgba(255,255,255,0.08)] backdrop-blur p-4 hover:bg-[rgba(255,255,255,0.12)] transition-all">
                <p className="text-sm leading-6 text-slate-200 italic">"Reliable partner for bulk orders. Their bulk discounts are unbeatable in the market."</p>
                <p className="mt-3 text-xs font-bold text-[#df3b2f]">— Workshop Owner, Madhesh Pardesh</p>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -left-10 top-8 h-48 w-48 rounded-full bg-[rgba(223,59,47,0.15)] blur-3xl" />
            <div className="absolute right-0 top-0 h-56 w-56 rounded-full bg-[rgba(29,93,184,0.25)] blur-3xl" />

            <div className="relative overflow-hidden rounded-[2.25rem] border border-[rgba(255,255,255,0.12)] bg-[linear-gradient(160deg,rgba(255,255,255,0.98),rgba(237,244,251,0.95))] p-5 text-[#0f2140] shadow-[0_35px_90px_rgba(2,8,23,0.4)] md:p-6">
              <div className="absolute inset-x-0 top-0 h-2 bg-[linear-gradient(90deg,#1d5db8,#df3b2f)]" />

              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.34em] text-slate-500">Shree Laxmi Narayan Traders</p>
                  <h2 className="mt-3 max-w-md text-3xl font-black leading-tight text-[#0f2140]">
                    Authentic Valvoline oils, built for every garage.
                  </h2>
                </div>
                <div className="rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-bold uppercase tracking-[0.24em] text-[#1d5db8]">
                  Kalyanpur-7, Saptari
                </div>
              </div>

              <div className="mt-8 grid gap-4 md:grid-cols-[1.08fr_0.92fr]">
                <div className="relative overflow-hidden rounded-[2rem] bg-[linear-gradient(140deg,#e5eefb,#ffffff)] p-6 md:p-8">
                  <div className="absolute -right-12 top-8 h-36 w-36 rounded-full bg-[rgba(29,93,184,0.12)] blur-3xl" />
                  <div className="absolute -left-8 bottom-4 h-32 w-32 rounded-full blur-3xl" style={{ backgroundColor: 'rgba(223,59,47,0.1)' }} />

                  <div className="relative space-y-4">
                    {/* Motorcycle Segment Card */}
                    <div className="rounded-[1.75rem] border border-white/80 bg-white/95 backdrop-blur overflow-hidden shadow-[0_12px_30px_rgba(16,41,75,0.12)] hover:shadow-[0_18px_40px_rgba(16,41,75,0.18)] transition-all hover:-translate-y-0.5">
                      <div className="relative overflow-hidden rounded-[1.5rem] h-40">
                        <Image src="/motorcycle_segment_img.png" alt="Motorcycle Oils" fill className="object-cover" />
                      </div>
                    </div>

                    {/* Passenger Car Segment Card */}
                    <div className="rounded-[1.75rem] border border-white/80 bg-white/95 backdrop-blur overflow-hidden shadow-[0_12px_30px_rgba(16,41,75,0.12)] hover:shadow-[0_18px_40px_rgba(16,41,75,0.18)] transition-all hover:-translate-y-0.5">
                      <div className="relative overflow-hidden rounded-[1.5rem] h-40">
                        <Image src="/passerger_car_img.png" alt="Passenger Car Motor Oil" fill className="object-cover" />
                      </div>
                    </div>

                    {/* Commercial Segment Card */}
                    <div className="rounded-[1.75rem] border border-white/80 bg-white/95 backdrop-blur overflow-hidden shadow-[0_12px_30px_rgba(16,41,75,0.12)] hover:shadow-[0_18px_40px_rgba(16,41,75,0.18)] transition-all hover:-translate-y-0.5">
                      <div className="relative overflow-hidden rounded-[1.5rem] h-40">
                        {commercialProduct ? (
                            <Image src={"/heavy_truck_img.png"} alt="Commercial Vehicle" fill className="object-cover" />
                        ) : null}
                      </div>
                    </div>

                    {/* Product Highlights Section */}
                    <div className="rounded-[1.5rem] border border-white/60 bg-white/90 backdrop-blur p-4 shadow-[0_12px_30px_rgba(16,41,75,0.08)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_45px_rgba(16,41,75,0.15)] hover:border-white/80">
                      <div className="space-y-4">
                        <div>
                          <p className="text-xs font-bold uppercase tracking-[0.3em] text-slate-500">Why Choose Us</p>
                          <h3 className="mt-2 text-base font-black text-[#0f2140]">Premium Engine Care</h3>
                        </div>
                        
                        <div className="space-y-2.5">
                          <div className="flex items-start gap-2 rounded-lg p-2 transition-all duration-200 hover:bg-[rgba(29,93,184,0.08)] hover:translate-x-1">
                            <span className="mt-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-[#1d5db8] text-xs font-bold text-white transform transition-transform duration-200 hover:scale-110">✓</span>
                            <div>
                              <p className="text-xs font-semibold text-[#0f2140]">100% Genuine</p>
                              <p className="text-xs text-slate-600">Authorized distributor</p>
                            </div>
                          </div>
                          
                          <div className="flex items-start gap-2 rounded-lg p-2 transition-all duration-200 hover:bg-[rgba(223,59,47,0.08)] hover:translate-x-1">
                            <span className="mt-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-[#df3b2f] text-xs font-bold text-white transform transition-transform duration-200 hover:scale-110">✓</span>
                            <div>
                              <p className="text-xs font-semibold text-[#0f2140]">Long Engine Life</p>
                              <p className="text-xs text-slate-600">Advanced protection</p>
                            </div>
                          </div>
                          
                          <div className="flex items-start gap-2 rounded-lg p-2 transition-all duration-200 hover:bg-[rgba(29,93,184,0.08)] hover:translate-x-1">
                            <span className="mt-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-[#1d5db8] text-xs font-bold text-white transform transition-transform duration-200 hover:scale-110">✓</span>
                            <div>
                              <p className="text-xs font-semibold text-[#0f2140]">Trusted by Many</p>
                              <p className="text-xs text-slate-600">1000+ customers</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid gap-3">
                  {segmentCards.map((card, index) => {
                    return (
                      <Link
                        key={card.title}
                        href={card.href}
                        className="group rounded-[1.5rem] border border-slate-200 bg-white p-4 transition-all duration-300 hover:-translate-y-1 hover:border-slate-300 hover:shadow-[0_18px_50px_rgba(16,41,75,0.12)]"
                      >
                        <div className="flex items-start justify-between gap-3 mb-3">
                          <div className="flex-1">
                            <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-slate-500">{card.eyebrow}</p>
                            <h3 className="mt-2 text-lg font-black text-[#0f2140]">{card.title}</h3>
                          </div>
                          <span
                            className="mt-1 h-3 w-14 rounded-full shrink-0"
                            style={{ background: index === 1 ? '#1d5db8' : '#df3b2f' }}
                          />
                        </div>
                        <p className="text-sm leading-6 text-slate-600">{card.description}</p>
                      </Link>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
