import Header from '@/components/header';

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-100">
      <Header />
      <section className="flex flex-col items-center justify-center py-20 px-4 text-center">
        <h2 className="text-4xl font-bold text-gray-800 mb-4">
          AI that builds your resume, cover letter & HR email
        </h2>
        <p className="text-lg text-gray-600 max-w-xl mb-8">
          Auto Talent App helps you land your dream job by generating polished, professional documents in seconds.
        </p>
        <a href="/signup">
          <button className="bg-blue-600 text-white px-6 py-3 rounded-lg text-lg hover:bg-blue-700 transition">
            Get Started
          </button>
        </a>
      </section>
    </main>
  );
}
