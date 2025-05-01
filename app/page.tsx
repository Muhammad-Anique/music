import Header from '@/components/header';
import BlurredCircle from '@/components/ui-global/BlurredCircle';

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center bg-white px-4 py-10 relative">
      <Header />

      {/* Blurred circles */}
      <div className="absolute left-0 top-0 opacity-60">
        <BlurredCircle />
      </div>
      <div className="absolute right-0 top-0 opacity-60 scale-x-[-1]">
        <BlurredCircle />
      </div>
      

      {/* Main Content */}
      <section className="flex-grow flex items-center justify-center w-full z-50 mt-20">
      <div className="bg-white/70 backdrop-blur-md rounded-2xl p-10 max-w-2xl w-full text-center shadow-[0_4px_30px_rgba(0,0,0,0.3)]">
          <h2 className="text-3xl md:text-4xl font-semibold text-gray-800 mb-4">
            AI that builds your Resume, Cover Letter & HR Email
          </h2>
          <p className="text-base md:text-lg text-gray-600 max-w-xl mx-auto mb-8">
            Auto Talent App helps you land your dream job by generating polished, professional documents in seconds.
          </p>
          <a href="/signup">
            <button className="bg-blue-900 text-white px-6 py-3 rounded-lg text-lg hover:bg-blue-700 transition">
              Get Started
            </button>
          </a>
        </div>
      </section>
    </main>
  );
}
