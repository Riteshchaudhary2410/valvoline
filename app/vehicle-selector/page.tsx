import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import VehicleSelector from '@/components/VehicleSelector';

export default function VehicleSelectorPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen">
        <section className="border-b border-white/10 bg-[#120605]/80 py-14 md:py-20">
          <div className="container-max max-w-4xl space-y-5 text-center">
            <p className="text-sm uppercase tracking-[0.28em] text-gray-500">Smart vehicle selector</p>
            <h1 className="text-4xl font-bold md:text-5xl">
              Find the <span className="text-gradient">perfect oil</span> for your vehicle
            </h1>
            <p className="text-gray-300">
              Choose the vehicle type, brand, and model. Add kilometres driven to make the recommendation even more accurate.
            </p>
          </div>
        </section>

        <section className="py-12 md:py-16">
          <div className="container-max space-y-10">
            <div className="rounded-[2rem] border border-white/10 bg-white/5 p-4 md:p-8">
              <VehicleSelector />
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              {[
                {
                  title: 'Precision fitment',
                  description: 'Match by vehicle type, brand, model, and operating distance.',
                },
                {
                  title: 'Actionable output',
                  description: 'See viscosity, pack size, compatibility, and a direct product path.',
                },
                {
                  title: 'Garage ready',
                  description: 'Built to help service counters recommend a lubricant with confidence.',
                },
              ].map((item) => (
                <div key={item.title} className="rounded-[1.75rem] border border-white/10 bg-white/5 p-5">
                  <h3 className="text-xl font-bold">{item.title}</h3>
                  <p className="mt-2 text-sm text-gray-400">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
