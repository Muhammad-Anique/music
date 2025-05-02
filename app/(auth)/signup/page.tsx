'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import Header from '@/components/header';

export default function SignUp() {
    const router = useRouter();
    const supabase = createClientComponentClient();

    const [form, setForm] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
    });

    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(''); // Reset error message
    
        // Check if passwords match
        if (form.password !== form.confirmPassword) {
            return setError("Passwords do not match.");
        }
    
        setLoading(true);
    
        try {
            // 1. Sign up user with Supabase Authentication
            const { data, error: signUpError } = await supabase.auth.signUp({
                email: form.email,
                password: form.password,
            });
    
            if (signUpError) {
                throw new Error(signUpError.message);
            }
    
            const { error: insertError } = await supabase
                .from('users')
                .insert([
                    {
                        email: form.email,
                        username: form.username,
                        id: data.user?.id, 
                    }
                ]);
    
            if (insertError) {
                throw new Error(insertError.message);
            }
    
            setLoading(false);
            router.push('/dashboard'); 
    
        } catch (err) {
            setLoading(false);
            
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError('An unexpected error occurred.');
            }
        }
        
    };
    

    return (
        <main className="min-h-screen bg-gray-100">
            <Header />
            <div className="max-w-md mx-auto mt-10 bg-white p-8 rounded shadow">
                <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
                    Create Your Account
                </h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        type="text"
                        name="username"
                        placeholder="Username"
                        value={form.username}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 border rounded"
                    />
                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={form.email}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 border rounded"
                    />
                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        value={form.password}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 border rounded"
                    />
                    <input
                        type="password"
                        name="confirmPassword"
                        placeholder="Confirm Password"
                        value={form.confirmPassword}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 border rounded"
                    />
                    {error && <p className="text-red-600">{error}</p>}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
                    >
                        {loading ? 'Signing up...' : 'Sign Up'}
                    </button>
                </form>
            </div>
        </main>
    );
}
