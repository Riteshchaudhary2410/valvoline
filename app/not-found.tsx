import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="min-h-screen">
      <div className="container-max py-16">
        <div className="mx-auto max-w-2xl rounded-[2rem] border border-white/10 bg-white/5 p-8 text-center backdrop-blur">
          <p className="text-sm uppercase tracking-[0.28em] text-gray-500">Not found</p>
          <h1 className="mt-4 text-3xl font-bold md:text-4xl">
            We could not find that page.
          </h1>
          <p className="mt-3 text-gray-300">
            If you followed a product link, the slug may be incorrect or the item
            is no longer active.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link href="/products" className="btn btn-primary rounded-full px-6 py-3">
              Browse products
            </Link>
            <Link href="/" className="btn btn-outline rounded-full px-6 py-3">
              Go home
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}

