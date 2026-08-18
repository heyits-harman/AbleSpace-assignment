'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from './context/AuthContext';

export default function LoginPage() {
  const router = useRouter();
  const { user, login, signup, guestLogin, loading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isSignup, setIsSignup] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user && !loading) {
      router.push('/dashboard');
    }
  }, [user, loading, router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await login(email, password);
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await signup(email, password, name);
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Signup failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGuestLogin = async () => {
    setError('');
    setIsLoading(true);

    try {
      await guestLogin();
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Guest login failed');
    } finally {
      setIsLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white px-4">
      {/* Pyramid Logo Placeholder */}
      <div className="mb-8 flex items-center gap-2">
        <div className="w-8 h-8 bg-black rounded flex items-center justify-center">
          <span className="text-white text-sm font-bold">△</span>
        </div>
        <span className="text-xl font-bold text-black">Pyramid</span>
      </div>

      {/* Main Card */}
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-black mb-2">Let's get back on track</h1>
          <p className="text-gray-600 text-sm">Enter your email below to login to your account.</p>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
            {error}
          </div>
        )}

        {/* Login Form */}
        {!isSignup ? (
          <form onSubmit={handleLogin} className="space-y-4 mb-6">
            <div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-sm"
                placeholder="Email"
              />
            </div>

            <div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-sm"
                placeholder="Password"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-black text-white font-semibold py-3 rounded-full hover:bg-gray-900 disabled:opacity-50 transition text-sm"
            >
              {isLoading ? 'Loading...' : 'Continue'}
            </button>
          </form>
        ) : (
          /* Signup Form */
          <form onSubmit={handleSignup} className="space-y-4 mb-6">
            <div>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-sm"
                placeholder="Full Name"
              />
            </div>

            <div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-sm"
                placeholder="Email"
              />
            </div>

            <div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-sm"
                placeholder="Password"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-black text-white font-semibold py-3 rounded-full hover:bg-gray-900 disabled:opacity-50 transition text-sm"
            >
              {isLoading ? 'Loading...' : 'Create Account'}
            </button>
          </form>
        )}

        {/* Guest Login */}
        <button
          onClick={handleGuestLogin}
          disabled={isLoading}
          className="w-full bg-black text-white font-semibold py-3 rounded-full hover:bg-gray-900 disabled:opacity-50 transition mb-4 text-sm"
        >
          Continue as Guest
        </button>

        {/* Google Login Placeholder */}
        <button
          type="button"
          disabled
          className="w-full border border-gray-200 text-gray-700 font-semibold py-3 rounded-lg hover:bg-gray-50 transition text-sm"
        >
          🔍 Login with Google (Placeholder)
        </button>

        {/* Toggle Signup/Login */}
        <div className="text-center mt-6">
          <button
            type="button"
            onClick={() => {
              setIsSignup(!isSignup);
              setError('');
            }}
            className="text-gray-600 hover:text-black text-sm"
          >
            {isSignup ? 'Already have an account? Login' : "Don't have an account? Sign up"}
          </button>
        </div>

        {/* Terms & Privacy */}
        <div className="text-center mt-8 text-xs text-gray-600">
          <p>By clicking continue, you agree to our</p>
          <div className="flex justify-center gap-1">
            <a href="#" className="underline hover:text-black">Terms of Service</a>
            <span>and</span>
            <a href="#" className="underline hover:text-black">Privacy Policy</a>
          </div>
        </div>
      </div>
    </div>
  );
}