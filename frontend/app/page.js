"use client";

import { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '../contexts/AuthContext';

export default function Home() {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && isAuthenticated) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="w-12 h-12 border-2 border-black rounded-lg flex items-center justify-center font-mono text-sm font-bold mx-auto mb-3 animate-pulse">
            DM
          </div>
          <p className="text-gray-600 text-sm">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 hover:opacity-70 transition-opacity">
            <div className="w-7 h-7 border border-black rounded-lg flex items-center justify-center font-mono text-xs font-bold">
              DM
            </div>
            <span className="font-medium text-sm">DM Automation</span>
          </Link>

          <div className="flex items-center gap-4">
            <Link
              href="/login"
              className="text-sm text-gray-600 hover:text-black transition-colors"
            >
              Sign In
            </Link>
            <Link
              href="/signup"
              className="px-4 py-2 text-sm bg-black text-white hover:bg-blue-600 transition-colors rounded-lg"
            >
              Get Started
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-3xl mx-auto px-6 py-32 text-center">
        <h1 className="text-5xl font-bold text-black mb-6 leading-tight">
          Automate your social media conversations with AI
        </h1>
        <p className="text-lg text-gray-600 mb-12 leading-relaxed">
          Connect Instagram, Messenger, WhatsApp, and Telegram. Build powerful automation flows in minutes.
        </p>

        <div className="flex items-center justify-center gap-4">
          <Link
            href="/signup"
            className="px-6 py-3 bg-black text-white text-sm font-medium hover:bg-blue-600 transition-all rounded-xl shadow-sm hover:shadow-md"
          >
            Get Started →
          </Link>
          <Link
            href="/login"
            className="px-6 py-3 text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors border border-gray-200 rounded-xl hover:border-blue-600"
          >
            Sign In
          </Link>
        </div>

        <p className="text-xs text-gray-400 mt-8">No credit card required</p>
      </section>

      {/* Features Grid */}
      <section className="border-t border-gray-200 py-24">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="text-2xl font-bold text-black text-center mb-12">Everything you need to automate</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 border border-gray-200 rounded-xl hover:border-purple-500 hover:shadow-lg transition-all group bg-white">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-purple-500 transition-colors">
                <span className="text-2xl group-hover:scale-110 transition-transform">🔗</span>
              </div>
              <h3 className="text-sm font-semibold text-black mb-2">Multi-Channel</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Connect Instagram, Messenger, WhatsApp, and Telegram in one place.
              </p>
            </div>

            <div className="p-6 border border-gray-200 rounded-xl hover:border-blue-500 hover:shadow-lg transition-all group bg-white">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-blue-500 transition-colors">
                <span className="text-2xl group-hover:scale-110 transition-transform">🤖</span>
              </div>
              <h3 className="text-sm font-semibold text-black mb-2">AI-Powered</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Train AI with your FAQs and docs. Get intelligent responses automatically.
              </p>
            </div>

            <div className="p-6 border border-gray-200 rounded-xl hover:border-green-500 hover:shadow-lg transition-all group bg-white">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-green-500 transition-colors">
                <span className="text-2xl group-hover:scale-110 transition-transform">🎨</span>
              </div>
              <h3 className="text-sm font-semibold text-black mb-2">Visual Builder</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Build automation workflows with drag-and-drop. No coding required.
              </p>
            </div>

            <div className="p-6 border border-gray-200 rounded-xl hover:border-orange-500 hover:shadow-lg transition-all group bg-white">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-orange-500 transition-colors">
                <span className="text-2xl group-hover:scale-110 transition-transform">📊</span>
              </div>
              <h3 className="text-sm font-semibold text-black mb-2">Analytics</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Track performance, response times, and customer satisfaction.
              </p>
            </div>

            <div className="p-6 border border-gray-200 rounded-xl hover:border-indigo-500 hover:shadow-lg transition-all group bg-white">
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-indigo-500 transition-colors">
                <span className="text-2xl group-hover:scale-110 transition-transform">📚</span>
              </div>
              <h3 className="text-sm font-semibold text-black mb-2">Knowledge Base</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Upload PDFs, scrape websites, or paste content to train your AI.
              </p>
            </div>

            <div className="p-6 border border-gray-200 rounded-xl hover:border-pink-500 hover:shadow-lg transition-all group bg-white">
              <div className="w-12 h-12 bg-pink-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-pink-500 transition-colors">
                <span className="text-2xl group-hover:scale-110 transition-transform">🚀</span>
              </div>
              <h3 className="text-sm font-semibold text-black mb-2">Templates</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Launch in minutes with pre-built templates for FAQ, leads, and support.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="border-t border-gray-200 py-24">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-black mb-4">Ready to get started?</h2>
          <p className="text-base text-gray-600 mb-8">
            Join businesses automating their customer conversations
          </p>
          <Link
            href="/signup"
            className="inline-block px-6 py-3 bg-black text-white text-sm font-medium hover:bg-green-600 transition-all rounded-xl shadow-sm hover:shadow-md"
          >
            Start Free Trial →
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 py-12">
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
