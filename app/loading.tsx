export default function Loading() {
  return (
    <main className="min-h-screen">
      <div className="container-max py-12 space-y-8">
        <div className="rounded-[2rem] border border-white/10 bg-white/5 p-8">
          <div className="skeleton h-4 w-32" />
          <div className="skeleton mt-4 h-12 w-3/4" />
          <div className="skeleton mt-4 h-5 w-full max-w-2xl" />
          <div className="mt-6 flex gap-3">
            <div className="skeleton h-12 w-44 rounded-full" />
            <div className="skeleton h-12 w-36 rounded-full" />
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="rounded-[1.75rem] border border-white/10 bg-white/5 p-5">
              <div className="skeleton aspect-[4/5] rounded-[1.5rem]" />
              <div className="skeleton mt-4 h-5 w-24" />
              <div className="skeleton mt-3 h-7 w-3/4" />
              <div className="skeleton mt-3 h-4 w-full" />
              <div className="skeleton mt-3 h-4 w-5/6" />
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
