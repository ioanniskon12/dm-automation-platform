"use client";

import { useState } from 'react';
import Link from 'next/link';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3003';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await axios.post(`${API_URL}/api/auth/forgot-password`, { email });

      if (response.data.success) {
        setSubmitted(true);
      }
    } catch (err) {
      // Still show success message for security (don't reveal if email exists)
      setSubmitted(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Navbar */}
      <header className="border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 hover:opacity-70 transition-opacity">
            <div className="w-8 h-8 border border-black rounded-lg flex items-center justify-center font-mono text-xs font-bold">
              DM
            </div>
            <span className="font-medium text-sm">DM Automation</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-sm text-gray-600 hover:text-black transition-colors">
              Sign in
            </Link>
            <Link href="/signup" className="text-sm px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors">
              Sign up
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center px-6 py-24">
        <div className="w-full max-w-md">
          {submitted ? (
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h1 className="text-2xl font-bold text-black mb-4">Check your email</h1>
              <p className="text-sm text-gray-600 mb-2">
                If an account exists with <strong>{email}</strong>, you'll receive a password reset link.
              </p>
              <p className="text-xs text-gray-500 mb-8">
                The link will expire in 1 hour. Check your spam folder if you don't see it.
              </p>

              {/* Development Mode Alert */}
              {process.env.NODE_ENV !== 'production' && (
                <div className="mb-6 p-4 bg-yellow-50 border border-yellow-300 rounded-lg text-left">
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">🛠️</span>
                    <div>
                      <p className="font-semibold text-yellow-800 text-sm">Development Mode</p>
                      <p className="text-yellow-700 text-xs mt-1">
                        Emails are not actually sent in development. Check your <strong>backend terminal</strong> to see the reset link.
                      </p>
                      <p className="text-yellow-600 text-xs mt-2 font-mono bg-yellow-100 p-2 rounded">
                        Look for: 🔗 Reset Link: http://localhost:3001/reset-password?token=...
                      </p>
                    </div>
                  </div>
                </div>
              )}
              <div className="space-y-3">
                <Link
                  href="/login"
                  className="block w-full px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white text-sm font-medium transition-all rounded-lg text-center"
                >
                  Back to sign in
                </Link>
                <button
                  onClick={() => {
                    setSubmitted(false);
                    setEmail('');
                  }}
                  className="block w-full px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-all text-center"
                >
                  Try a different email
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="mb-8">
                <h1 className="text-2xl font-bold text-black mb-2">Reset your password</h1>
                <p className="text-sm text-gray-600">
                  Enter your email and we'll send you a reset link
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-black mb-2">
                    Email address
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                    placeholder="you@company.com"
                  />
                </div>

                {error && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-red-700 text-sm">{error}</p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white text-sm font-medium transition-all rounded-lg shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Sending...' : 'Send reset link'}
                </button>

                <div className="text-center">
                  <Link
                    href="/login"
                    className="text-sm text-gray-600 hover:text-black transition-colors"
                  >
                    ← Back to sign in
                  </Link>
                </div>
              </form>
            </>
          )}
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-200 py-8">
        <div className="max-w-5xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 border border-black rounded-lg flex items-center justify-center font-mono text-xs font-bold">
                DM
              </div>
              <span className="text-sm font-medium">DM Automation</span>
            </div>

            <div className="flex items-center gap-6 text-sm text-gray-600">
              <Link href="/terms" className="hover:text-black transition-colors">Terms</Link>
              <Link href="/privacy" className="hover:text-black transition-colors">Privacy</Link>
              <span className="text-gray-400">© 2025</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
