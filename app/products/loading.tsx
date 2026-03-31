export default function Loading() {
  return (
    <main className="min-h-screen py-12">
      <div className="container-max grid gap-8 lg:grid-cols-[320px_1fr]">
        <div className="rounded-[1.75rem] border border-white/10 bg-white/5 p-5">
          <div className="skeleton h-5 w-28" />
          <div className="skeleton mt-6 h-12 w-full" />
          <div className="skeleton mt-4 h-12 w-full" />
          <div className="skeleton mt-4 h-12 w-full" />
          <div className="skeleton mt-4 h-12 w-full" />
        </div>
        <div className="space-y-6">
          <div className="rounded-[1.75rem] border border-white/10 bg-white/5 p-5">
            <div className="skeleton h-5 w-32" />
            <div className="skeleton mt-3 h-10 w-full" />
          </div>
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="rounded-[1.75rem] border border-white/10 bg-white/5 p-5">
                <div className="skeleton aspect-[4/5] rounded-[1.5rem]" />
                <div className="skeleton mt-4 h-5 w-20" />
                <div className="skeleton mt-3 h-6 w-3/4" />
                <div className="skeleton mt-3 h-4 w-full" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
