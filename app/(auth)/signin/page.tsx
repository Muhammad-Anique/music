'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';
import Header from '@/components/header';
import { Loader, Loader2Icon } from 'lucide-react';

export default function SignIn() {
  const router = useRouter();
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // ✅ Redirect to dashboard if already signed in
  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session?.user) {
        router.push('/dashboard'); // or wherever you want to go
      }
    };
    checkSession();
  }, [router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: form.email,
      password: form.password,
    });

    
    if (signInError) {
      setError(signInError.message);
      setLoading(false);
    } else {
      router.push('/dashboard'); // Redirect after successful sign in
    }
  };

  return (
    <div className='bg-gradient-to-b from-[#38b6ff] via-blue-300 to-blue-400'>
      <Header />
      {!loading ? (<div className="flex justify-center items-center min-h-screen  px-4">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-md p-6 bg-white rounded-lg shadow-md"
        >
          <h2 className="text-2xl font-semibold text-center text-blue-600 mb-6">Sign In</h2>

          {error && (
            <p className="text-red-500 text-sm text-center mb-4">{error}</p>
          )}

          <div className="mb-4">
            <label htmlFor="email" className="block mb-1 text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#38b6ff]"
              required
            />
          </div>

          <div className="mb-6">
            <label htmlFor="password" className="block mb-1 text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#38b6ff]"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-md transition disabled:opacity-50"
          >
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>
      </div>
      ) : (
        <div className="flex justify-center items-center min-h-screen">
          <p className="text-white text-lg flex flex-row items-center gap-2"><span >
            <Loader2Icon className='h-6 w-6 animate-spin'/>
            </span>
            Loading...
            </p>
        </div>
      )}
    </div>
  );
}
