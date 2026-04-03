import Image from 'next/image';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import HeroSection from '@/components/HeroSection';
import ProductCard from '@/components/ProductCard';
import { BULK_TIERS, HOME_LINEUP_CARDS, getFeaturedProducts, getProductBySlug } from '@/lib/catalog';
import { Product } from '@/types';
import { FiArrowRight, FiCheckCircle, FiGrid, FiSearch, FiTruck } from 'react-icons/fi';

const lineupCards = HOME_LINEUP_CARDS.map((card) => ({
  ...card,
  products: card.productSlugs.map((slug) => getProductBySlug(slug)).filter(Boolean) as Product[],
}));

export default function Home() {
  const featuredProducts = getFeaturedProducts()
    .sort((a, b) => {
      if (a.slug === 'valvoline-all-fleet-multi-20w40') return -1;
      if (b.slug === 'valvoline-all-fleet-multi-20w40') return 1;
      return 0;
    })
    .slice(0, 3);

  return (
    <>
      <Navbar />
      <main>
        <HeroSection />

        <section className="py-16 md:py-20">
          <div className="container-max space-y-8">
            <div className="mx-auto max-w-5xl space-y-4 text-center">
              <p className="text-sm font-bold uppercase tracking-[0.3em] text-slate-400">Leading-edge lineup</p>
              <h2 className="text-3xl font-black tracking-tight text-white md:text-5xl">
                A powerful lineup of Valvoline lubricants, built to deliver performance, protection, and reliability across every vehicle segment.
              </h2>
              <p className="text-base leading-7 text-slate-300 md:text-lg">
                A streamlined lineup of Valvoline products, making it faster and easier to find the right solution for every vehicle.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {lineupCards.map((card, index) => (
                <Link
                  key={card.title}
                  href={card.href}
                  className="group overflow-hidden rounded-[2rem] border border-slate-800 bg-white/[0.04] shadow-[0_18px_50px_rgba(0,0,0,0.22)] transition-all duration-300 hover:-translate-y-1 hover:border-slate-700 hover:bg-white/[0.06]"
                >
                  <div
                    className="relative aspect-[5/4] overflow-hidden p-5"
                    style={{ background: card.surface }}
                  >
                    <div className="absolute inset-x-0 top-0 h-1.5" style={{ background: card.accent }} />
                    <div className="absolute right-5 top-5 rounded-full border border-white/40 bg-white/80 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.24em] text-slate-700">
                      {card.eyebrow}
                    </div>

                    {card.kind === 'selector' ? (
                      <div className="relative flex h-full items-end">
                        <div className="w-full rounded-[1.75rem] border border-slate-200 bg-white/95 p-4 shadow-[0_18px_45px_rgba(16,41,75,0.14)] backdrop-blur">
                          <div className="grid gap-3">
                            {[
                              'Choose vehicle type',
                              'Pick the model',
                              'Add kilometres driven',
                            ].map((step, stepIndex) => (
                              <div key={step} className="flex items-center gap-3 rounded-2xl bg-slate-50 px-3 py-3">
                                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#1d5db8] text-sm font-black text-white">
                                  {stepIndex + 1}
                                </span>
                                <p className="text-sm font-semibold text-slate-700">{step}</p>
                              </div>
                            ))}
                          </div>

                          {card.products[0] ? (
                            <div className="absolute -right-1 bottom-5 w-[32%] rounded-[1.4rem] border border-slate-200 bg-white p-2 shadow-[0_16px_40px_rgba(16,41,75,0.12)]">
                              <div className="relative aspect-[4/5] overflow-hidden rounded-[1rem] bg-[#eef3fb]">
                                <Image
                                  src={card.products[0].image}
                                  alt={card.products[0].name}
                                  fill
                                  className="object-contain p-3"
                                />
                              </div>
                            </div>
                          ) : null}
                        </div>
                      </div>
                    ) : (
                      <div className="relative h-full">
                        {card.coverImage ? (
                          <div className="absolute inset-0 overflow-hidden rounded-[1.7rem]">
                            <Image
                              src={card.coverImage}
                              alt={`${card.title} cover`}
                              fill
                              className="object-cover object-center"
                              sizes="(min-width: 1280px) 33vw, (min-width: 768px) 50vw, 100vw"
                            />
                          </div>
                        ) : (
                          <>
                            <div className="absolute -left-6 bottom-0 h-28 w-28 rounded-full bg-white/20 blur-3xl" />
                            <div className="absolute -right-4 top-10 h-24 w-24 rounded-full bg-white/20 blur-2xl" />

                            {card.products[0] ? (
                              <div className="absolute bottom-4 left-2 w-[48%] rounded-[1.6rem] border border-white/40 bg-white/90 p-3 shadow-[0_20px_50px_rgba(16,41,75,0.16)]">
                                <div className="relative aspect-[4/5] overflow-hidden rounded-[1.1rem] bg-white/80">
                                  <Image src={card.products[0].image} alt={card.products[0].name} fill className="object-contain p-4" />
                                </div>
                              </div>
                            ) : null}

                            {card.products[1] ? (
                              <div
                                className="absolute right-4 top-12 w-[34%] rounded-[1.35rem] border border-[rgba(255,255,255,0.25)] p-3 shadow-[0_20px_50px_rgba(16,41,75,0.18)]"
                                style={{ background: card.tone === 'dark' ? 'rgba(255,255,255,0.12)' : 'rgba(255,255,255,0.85)' }}
                              >
                                <div className="relative aspect-[4/5] overflow-hidden rounded-[1rem] bg-white/80">
                                  <Image src={card.products[1].image} alt={card.products[1].name} fill className="object-contain p-3" />
                                </div>
                              </div>
                            ) : null}

                            {card.products[2] ? (
                              <div className="absolute bottom-8 right-10 w-[28%] rounded-[1.15rem] border border-[rgba(255,255,255,0.25)] bg-[rgba(255,255,255,0.85)] p-2 shadow-[0_18px_40px_rgba(16,41,75,0.16)]">
                                <div className="relative aspect-[4/5] overflow-hidden rounded-[0.9rem] bg-white/80">
                                  <Image src={card.products[2].image} alt={card.products[2].name} fill className="object-contain p-2" />
                                </div>
                              </div>
                            ) : null}

                            <div
                              className={`absolute bottom-4 right-4 max-w-[44%] rounded-[1.2rem] border px-3 py-2 backdrop-blur ${
                                card.tone === 'dark'
                                  ? 'border-white/20 bg-white/10 text-white'
                                  : 'border-slate-200 bg-[rgba(255,255,255,0.85)] text-slate-700'
                              }`}
                            >
                              <p className="text-[11px] font-bold uppercase tracking-[0.24em]">Range focus</p>
                              <p className="mt-1 text-sm font-semibold">{card.bullets[0]}</p>
                            </div>
                          </>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="space-y-4 px-5 pb-5 pt-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="text-2xl font-black tracking-tight text-white">{card.title}</h3>
                        <p className="mt-2 text-sm leading-6 text-slate-300">{card.description}</p>
                      </div>
                      <FiArrowRight className="mt-1 shrink-0 text-slate-400 transition-transform duration-300 group-hover:translate-x-1 group-hover:text-white" size={18} />
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {card.bullets.map((bullet) => (
                        <span
                          key={bullet}
                          className="rounded-full border border-slate-700 bg-slate-900/70 px-3 py-1 text-xs font-semibold text-slate-200"
                        >
                          {bullet}
                        </span>
                      ))}
                    </div>

                    <div className="h-1 w-full rounded-full bg-slate-800">
                      <div className="h-full rounded-full" style={{ width: `${70 + index * 4}%`, background: card.accent }} />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="py-8 md:py-12">
          <div className="container-max">
            <div className="grid gap-6 rounded-[2.25rem] border border-slate-800 bg-[linear-gradient(145deg,rgba(255,255,255,0.97),rgba(237,244,251,0.94))] p-6 text-[#0f2140] shadow-[0_30px_80px_rgba(0,0,0,0.18)] md:grid-cols-[1.05fr_0.95fr] md:p-8">
              <div className="space-y-6">
                <div className="space-y-3">
                  <p className="text-sm font-bold uppercase tracking-[0.3em] text-slate-500">Smarter flow</p>
                  <h2 className="text-3xl font-black tracking-tight md:text-4xl">
                    Move from broad category browsing into a confident recommendation in three steps.
                  </h2>
                  <p className="max-w-2xl text-base leading-7 text-slate-600">
                    Familiar on the surface. Smarter where it matters.
                  </p>
                </div>

                <div className="grid gap-4 sm:grid-cols-3">
                  {[
                    {
                      icon: FiGrid,
                      title: 'Browse by range',
                      description: 'Start with product families that feel close to the reference layout, just cleaner and more premium.',
                    },
                    {
                      icon: FiSearch,
                      title: 'Narrow by fitment',
                      description: 'Filter by vehicle, brand, viscosity, or workshop need before the catalog starts to feel crowded.',
                    },
                    {
                      icon: FiCheckCircle,
                      title: 'Recommend with clarity',
                      description: 'Show the right oil, explain the reason, and move faster toward add-to-cart or B2B quoting.',
                    },
                  ].map((item) => {
                    const Icon = item.icon;
                    return (
                      <div key={item.title} className="rounded-[1.6rem] border border-slate-200 bg-white p-5 shadow-[0_14px_35px_rgba(16,41,75,0.08)]">
                        <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#1d5db8] text-white">
                          <Icon size={18} />
                        </span>
                        <h3 className="mt-4 text-lg font-black text-[#0f2140]">{item.title}</h3>
                        <p className="mt-2 text-sm leading-6 text-slate-600">{item.description}</p>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="rounded-[1.9rem] bg-[linear-gradient(160deg,#10294b,#173d72)] p-5 text-white md:p-6">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-bold uppercase tracking-[0.28em] text-slate-300">Bulk pricing</p>
                    <h3 className="mt-2 text-2xl font-black md:text-3xl">Dealer-ready offers without hiding the thresholds.</h3>
                  </div>
                  <FiTruck className="shrink-0 text-[#df3b2f]" size={28} />
                </div>

                <div className="mt-6 grid gap-3">
                  {BULK_TIERS.map((tier) => (
                    <div key={tier.title} className="rounded-[1.5rem] border border-white/10 bg-[rgba(255,255,255,0.08)] p-4 backdrop-blur">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-xs font-bold uppercase tracking-[0.24em] text-slate-300">{tier.range}</p>
                          <p className="mt-2 text-xl font-black">{tier.title}</p>
                        </div>
                        <span className="rounded-full bg-[#b42318] px-3 py-1 text-xs font-black uppercase tracking-[0.2em] text-white">
                          {tier.discount}
                        </span>
                      </div>
                      <p className="mt-3 text-sm leading-6 text-slate-200">{tier.description}</p>
                    </div>
                  ))}
                </div>

                <Link
                  href="/b2b"
                  className="btn mt-6 rounded-full border border-[rgba(255,255,255,0.15)] bg-white px-5 py-3 text-sm font-semibold text-[#0f2140] hover:-translate-y-1 hover:bg-slate-100"
                >
                  Open B2B tools
                  <FiArrowRight size={16} />
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16">
          <div className="container-max space-y-8">
            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div className="max-w-2xl space-y-3">
                <p className="text-sm font-bold uppercase tracking-[0.28em] text-slate-400">Trending this month</p>
                <h2 className="text-3xl font-black tracking-tight text-white md:text-4xl">
                  What smart garages in provience no. - 2 are ordering right now.
                </h2>
                <p className="text-base leading-7 text-slate-300">
                  Fleet Multi 10L leads the chart. Paired with seasonal recommendations for bikes, trucks, and cars. Same-day delivery • Competitive bulk pricing • No middleman markup.
                </p>
              </div>
              <Link href="/b2b" className="btn btn-outline rounded-full px-5 py-3 text-sm font-semibold">
                Bulk discounts
                <FiArrowRight size={16} />
              </Link>
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
              {featuredProducts.map((product) => (
                <ProductCard key={product.slug} product={product} />
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
