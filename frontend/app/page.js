"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '../contexts/AuthContext';
import MarketingNavbar from '../components/MarketingNavbar';
import MarketingFooter from '../components/MarketingFooter';

export default function Home() {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();
  const [openFaq, setOpenFaq] = useState(null);

  useEffect(() => {
    if (!loading && isAuthenticated) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, loading, router]);

  const testimonials = [
    {
      quote: "DM Automation increased our response rate by 300%. We're closing deals while we sleep. Best investment we've made this year.",
      name: "Sarah Mitchell",
      role: "CEO, StyleBox",
      initials: "SM",
      gradient: "from-blue-500 to-purple-500",
      bgGradient: "from-blue-50 to-purple-50",
      borderColor: "border-blue-100"
    },
    {
      quote: "Setup took 10 minutes. Now our AI handles 80% of customer inquiries automatically. Our team can focus on what matters.",
      name: "Marcus Rodriguez",
      role: "Founder, FitLife Pro",
      initials: "MR",
      gradient: "from-green-500 to-emerald-500",
      bgGradient: "from-green-50 to-emerald-50",
      borderColor: "border-green-100"
    },
    {
      quote: "We went from 2 hours daily managing DMs to just 20 minutes. The ROI paid for itself in the first week.",
      name: "Emily Wang",
      role: "Director, GrowthLabs",
      initials: "EW",
      gradient: "from-orange-500 to-amber-500",
      bgGradient: "from-orange-50 to-amber-50",
      borderColor: "border-orange-100"
    },
    {
      quote: "The AI understands context like a human. Our customers can't tell they're talking to a bot. Absolutely game-changing.",
      name: "James Chen",
      role: "CTO, TechFlow",
      initials: "JC",
      gradient: "from-pink-500 to-rose-500",
      bgGradient: "from-pink-50 to-rose-50",
      borderColor: "border-pink-100"
    },
    {
      quote: "We scaled from 100 to 10,000 monthly conversations without hiring anyone. DM Automation is our secret weapon.",
      name: "Lisa Thompson",
      role: "VP Marketing, ScaleUp",
      initials: "LT",
      gradient: "from-indigo-500 to-violet-500",
      bgGradient: "from-indigo-50 to-violet-50",
      borderColor: "border-indigo-100"
    }
  ];

  const faqs = [
    {
      question: "How does the AI automation work?",
      answer: "Our AI learns from your knowledge base, FAQs, and past conversations to generate intelligent, contextual responses. You can customize the AI's personality and set rules for when to escalate to human agents."
    },
    {
      question: "Which platforms do you support?",
      answer: "We support Instagram DMs, Facebook Messenger, WhatsApp Business, and Telegram. You can manage all conversations from a single unified inbox."
    },
    {
      question: "Can I try it before committing?",
      answer: "Yes! We offer a 14-day free trial with full access to all features. No credit card required to start."
    },
    {
      question: "How long does setup take?",
      answer: "Most users are up and running within 15 minutes. Connect your accounts, upload your knowledge base, and start automating immediately."
    },
    {
      question: "Is my data secure?",
      answer: "Absolutely. We use enterprise-grade encryption, are SOC 2 compliant, and never share your data with third parties. Your conversations stay private."
    }
  ];

  const brands = ['Shopify', 'Stripe', 'Notion', 'Figma', 'Webflow', 'Vercel', 'Slack', 'Discord'];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center font-mono text-sm font-bold text-white mx-auto mb-3 animate-pulse">
            DM
          </div>
          <p className="text-gray-600 text-sm">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white overflow-hidden">
      <MarketingNavbar />

      {/* Hero Section */}
      <section className="pt-20 pb-20 px-6 relative overflow-hidden">
        {/* Animated background elements - positioned at edges, non-overlapping */}
        <div className="absolute -top-20 -left-20 w-64 h-64 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-25 animate-float"></div>
        <div className="absolute top-1/4 -right-20 w-56 h-56 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-25 animate-float-delayed"></div>
        <div className="absolute -bottom-16 left-1/4 w-48 h-48 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float"></div>
        <div className="absolute bottom-1/3 -left-16 w-40 h-40 bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float-delayed"></div>

        <div className="max-w-6xl mx-auto relative">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-100 rounded-full px-4 py-2 mb-8 animate-slide-up opacity-0" style={{animationDelay: '0s', animationFillMode: 'forwards'}}>
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              <span className="text-sm text-gray-700">Trusted by 2,500+ businesses worldwide</span>
              <span className="px-2 py-0.5 bg-gradient-to-r from-green-400 to-emerald-500 text-white text-xs font-semibold rounded-full">NEW</span>
            </div>

            <h1 className="text-5xl md:text-6xl font-bold text-black mb-6 leading-tight animate-slide-up opacity-0" style={{animationDelay: '0.1s', animationFillMode: 'forwards'}}>
              Automate DMs.
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent animate-gradient-x"> Close More Deals.</span>
            </h1>

            <p className="text-xl text-gray-600 mb-10 leading-relaxed max-w-2xl mx-auto animate-slide-up opacity-0" style={{animationDelay: '0.2s', animationFillMode: 'forwards'}}>
              The all-in-one platform to automate Instagram, Messenger, WhatsApp & Telegram conversations with AI. Convert leads 24/7 without lifting a finger.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12 animate-slide-up opacity-0" style={{animationDelay: '0.3s', animationFillMode: 'forwards'}}>
              <Link
                href="/signup"
                className="relative w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 animate-gradient-x text-white text-base font-semibold hover:opacity-90 transition-all rounded-xl shadow-xl shadow-blue-500/25 hover:shadow-2xl hover:shadow-blue-500/30 hover:-translate-y-1 overflow-hidden group"
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  Start Free 14-Day Trial
                  <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </span>
                <div className="absolute inset-0 animate-shimmer"></div>
              </Link>
              <Link
                href="#demo"
                className="w-full sm:w-auto px-8 py-4 text-base font-medium text-gray-700 hover:text-black transition-colors border border-gray-200 rounded-xl hover:border-blue-300 hover:bg-blue-50/50 flex items-center justify-center gap-2 group"
              >
                <svg className="w-5 h-5 text-blue-600 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                </svg>
                Watch Demo
              </Link>
            </div>

            <p className="text-sm text-gray-500 animate-slide-up opacity-0" style={{animationDelay: '0.4s', animationFillMode: 'forwards'}}>
              <span className="inline-flex items-center gap-1"><svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg> No credit card required</span>
              <span className="mx-3 text-gray-300">|</span>
              <span className="inline-flex items-center gap-1"><svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg> Setup in 5 minutes</span>
              <span className="mx-3 text-gray-300">|</span>
              <span className="inline-flex items-center gap-1"><svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg> Cancel anytime</span>
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-20 max-w-4xl mx-auto">
            <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border border-blue-100 hover:border-blue-200 hover:shadow-lg hover:-translate-y-1 transition-all group">
              <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-1 group-hover:scale-110 transition-transform">2,500+</div>
              <div className="text-sm text-gray-600">Active Businesses</div>
            </div>
            <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl border border-purple-100 hover:border-purple-200 hover:shadow-lg hover:-translate-y-1 transition-all group">
              <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-1 group-hover:scale-110 transition-transform">15M+</div>
              <div className="text-sm text-gray-600">Messages Automated</div>
            </div>
            <div className="text-center p-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl border border-green-100 hover:border-green-200 hover:shadow-lg hover:-translate-y-1 transition-all group">
              <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-1 group-hover:scale-110 transition-transform">98%</div>
              <div className="text-sm text-gray-600">Customer Satisfaction</div>
            </div>
            <div className="text-center p-6 bg-gradient-to-br from-orange-50 to-amber-50 rounded-2xl border border-orange-100 hover:border-orange-200 hover:shadow-lg hover:-translate-y-1 transition-all group">
              <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent mb-1 group-hover:scale-110 transition-transform">24/7</div>
              <div className="text-sm text-gray-600">Instant Responses</div>
            </div>
          </div>
        </div>
      </section>

      {/* Trusted By Section - Infinite Scroll */}
      <section className="py-16 border-t border-gray-100 overflow-hidden">
        <div className="max-w-6xl mx-auto px-6">
          <p className="text-center text-sm text-gray-500 mb-8 uppercase tracking-wider">Trusted by leading brands</p>
          <div className="relative">
            <div className="flex animate-marquee whitespace-nowrap">
              {[...brands, ...brands].map((brand, i) => (
                <div key={i} className="mx-12 text-2xl font-bold text-gray-300 hover:text-gray-500 transition-colors cursor-default">
                  {brand}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-gradient-to-b from-gray-50 to-white relative">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(99,102,241,0.05),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(168,85,247,0.05),transparent_50%)]"></div>

        <div className="max-w-6xl mx-auto px-6 relative">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-1.5 text-sm font-semibold text-blue-600 bg-blue-50 rounded-full uppercase tracking-wider mb-4">Features</span>
            <h2 className="text-4xl font-bold text-black mt-3 mb-4">Everything you need to scale</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Powerful tools to automate conversations, engage customers, and grow your business
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { icon: "M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z", title: "Unified Inbox", desc: "Manage Instagram, Messenger, WhatsApp, and Telegram conversations in one beautiful inbox.", color: "blue", link: "/features#unified-inbox" },
              { icon: "M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z", title: "AI-Powered Responses", desc: "Train your AI with your knowledge base. Get intelligent, brand-aligned responses.", color: "purple", link: "/features#ai-responses" },
              { icon: "M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z", title: "Visual Flow Builder", desc: "Build complex automation workflows with drag-and-drop simplicity. No coding required.", color: "green", link: "/features#flow-builder" },
              { icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z", title: "Advanced Analytics", desc: "Track response times, conversion rates, and customer satisfaction.", color: "orange", link: "/features#analytics" },
              { icon: "M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253", title: "Knowledge Base", desc: "Upload PDFs, scrape websites, or paste content. Your AI learns everything.", color: "indigo", link: "/features#knowledge-base" },
              { icon: "M13 10V3L4 14h7v7l9-11h-7z", title: "Instant Templates", desc: "Launch in seconds with pre-built templates for FAQ bots, lead capture, and more.", color: "pink", link: "/features#templates" }
            ].map((feature, i) => (
              <div key={i} className={`bg-white p-8 rounded-2xl border border-gray-100 hover:border-${feature.color}-200 hover:shadow-2xl transition-all duration-300 group hover:-translate-y-2`}>
                <div className={`w-14 h-14 bg-gradient-to-br from-${feature.color}-500 to-${feature.color}-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all shadow-lg shadow-${feature.color}-500/30`}>
                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={feature.icon} />
                  </svg>
                </div>
                <h3 className={`text-xl font-semibold text-black mb-3 group-hover:text-${feature.color}-600 transition-colors`}>{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed mb-4">{feature.desc}</p>
                <Link
                  href={feature.link}
                  className={`inline-flex items-center gap-2 text-sm font-medium text-${feature.color}-600 hover:text-${feature.color}-700 transition-colors group/link`}
                >
                  Learn more
                  <svg className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section - Infinite Loop Carousel */}
      <section id="testimonials" className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 via-purple-600/5 to-pink-600/5"></div>

        <div className="relative">
          <div className="text-center mb-16 px-6">
            <span className="inline-block px-4 py-1.5 text-sm font-semibold text-purple-600 bg-purple-50 rounded-full uppercase tracking-wider mb-4">Testimonials</span>
            <h2 className="text-4xl font-bold text-black mt-3 mb-4">Loved by businesses worldwide</h2>
            <p className="text-lg text-gray-600">See what our customers have to say</p>
          </div>

          {/* Infinite Scroll Carousel - Full Width */}
          <div className="relative overflow-hidden w-full">
            <div className="flex animate-testimonial-scroll">
              {/* Double the testimonials for seamless loop */}
              {[...testimonials, ...testimonials].map((testimonial, index) => (
                <div key={index} className="flex-shrink-0 w-[400px] px-4">
                  <div className={`bg-gradient-to-br ${testimonial.bgGradient} p-8 rounded-3xl border ${testimonial.borderColor} shadow-lg hover:shadow-xl transition-shadow h-full`}>
                    <div className="flex items-center gap-1 mb-4">
                      {[...Array(5)].map((_, i) => (
                        <svg key={i} className="w-5 h-5 text-yellow-400 drop-shadow" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    <p className="text-gray-700 mb-6 leading-relaxed italic text-base">
                      &quot;{testimonial.quote}&quot;
                    </p>
                    <div className="flex items-center gap-3">
                      <div className={`w-12 h-12 bg-gradient-to-br ${testimonial.gradient} rounded-full flex items-center justify-center text-white font-bold shadow-lg`}>
                        {testimonial.initials}
                      </div>
                      <div>
                        <div className="font-semibold text-black">{testimonial.name}</div>
                        <div className="text-gray-600 text-sm">{testimonial.role}</div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24 bg-gradient-to-b from-white to-gray-50 relative">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(99,102,241,0.05),transparent_70%)]"></div>

        <div className="max-w-6xl mx-auto px-6 relative">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-1.5 text-sm font-semibold text-green-600 bg-green-50 rounded-full uppercase tracking-wider mb-4">Pricing</span>
            <h2 className="text-4xl font-bold text-black mt-3 mb-4">Simple, transparent pricing</h2>
            <p className="text-lg text-gray-600">Start free, upgrade when you&apos;re ready</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Starter Plan */}
            <div className="bg-white p-8 rounded-2xl border border-gray-200 hover:border-blue-200 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <h3 className="text-xl font-semibold text-black mb-2">Starter</h3>
              <p className="text-gray-600 mb-6">Perfect for small businesses</p>
              <div className="mb-6">
                <span className="text-5xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">$29</span>
                <span className="text-gray-600">/month</span>
              </div>
              <ul className="space-y-4 mb-8">
                {['1 connected channel', '1,000 messages/month', 'Basic AI responses', '5 automation flows', 'Email support'].map((feature, i) => (
                  <li key={i} className="flex items-center gap-3 text-gray-700">
                    <svg className="w-5 h-5 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>
              <Link
                href="/signup"
                className="block w-full py-3.5 text-center text-gray-700 font-medium border border-gray-300 rounded-xl hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50 transition-all"
              >
                Start Free Trial
              </Link>
            </div>

            {/* Pro Plan */}
            <div className="bg-gradient-to-br from-blue-600 via-purple-600 to-blue-600 animate-gradient-x p-8 rounded-2xl relative transform hover:scale-105 transition-all duration-300 shadow-2xl shadow-purple-500/30">
              <div className="absolute -top-4 left-1/2 animate-bounce-slow bg-gradient-to-r from-orange-400 to-pink-500 text-white text-sm font-semibold px-4 py-1.5 rounded-full shadow-lg">
                Most Popular
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Pro</h3>
              <p className="text-blue-100 mb-6">For growing businesses</p>
              <div className="mb-6">
                <span className="text-5xl font-bold text-white">$79</span>
                <span className="text-blue-100">/month</span>
              </div>
              <ul className="space-y-4 mb-8">
                {['4 connected channels', '10,000 messages/month', 'Advanced AI + Knowledge Base', 'Unlimited automation flows', 'Priority support + Analytics'].map((feature, i) => (
                  <li key={i} className="flex items-center gap-3 text-white">
                    <svg className="w-5 h-5 text-green-300 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>
              <Link
                href="/signup"
                className="block w-full py-3.5 text-center bg-white text-blue-600 font-semibold rounded-xl hover:bg-gray-100 transition-all shadow-lg"
              >
                Start Free Trial
              </Link>
            </div>

            {/* Enterprise Plan */}
            <div className="bg-white p-8 rounded-2xl border border-gray-200 hover:border-purple-200 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <h3 className="text-xl font-semibold text-black mb-2">Enterprise</h3>
              <p className="text-gray-600 mb-6">For large organizations</p>
              <div className="mb-6">
                <span className="text-5xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">Custom</span>
              </div>
              <ul className="space-y-4 mb-8">
                {['Unlimited channels', 'Unlimited messages', 'Custom AI training', 'Dedicated account manager', 'SLA + SSO + API access'].map((feature, i) => (
                  <li key={i} className="flex items-center gap-3 text-gray-700">
                    <svg className="w-5 h-5 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>
              <Link
                href="/signup"
                className="block w-full py-3.5 text-center text-gray-700 font-medium border border-gray-300 rounded-xl hover:border-purple-400 hover:text-purple-600 hover:bg-purple-50 transition-all"
              >
                Contact Sales
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-24 bg-white">
        <div className="max-w-3xl mx-auto px-6">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-1.5 text-sm font-semibold text-orange-600 bg-orange-50 rounded-full uppercase tracking-wider mb-4">FAQ</span>
            <h2 className="text-4xl font-bold text-black mt-3 mb-4">Frequently asked questions</h2>
            <p className="text-lg text-gray-600">Everything you need to know</p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className={`border rounded-2xl overflow-hidden transition-all duration-300 ${
                  openFaq === index
                    ? 'border-blue-200 shadow-lg bg-gradient-to-r from-blue-50/50 to-purple-50/50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <button
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className="w-full px-6 py-5 text-left flex items-center justify-between hover:bg-gray-50/50 transition-colors"
                >
                  <span className="font-medium text-black text-lg">{faq.question}</span>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
                    openFaq === index
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 rotate-180'
                      : 'bg-gray-100'
                  }`}>
                    <svg
                      className={`w-5 h-5 transition-colors ${openFaq === index ? 'text-white' : 'text-gray-500'}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </button>
                <div className={`overflow-hidden transition-all duration-300 ${openFaq === index ? 'max-h-96' : 'max-h-0'}`}>
                  <div className="px-6 pb-5 text-gray-600 leading-relaxed">
                    {faq.answer}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 relative overflow-hidden">
        <div className="absolute inset-0">
          {/* Floating elements at edges - non-overlapping */}
          <div className="absolute -top-24 -left-24 w-72 h-72 bg-white/10 rounded-full blur-3xl animate-float"></div>
          <div className="absolute -top-16 -right-16 w-56 h-56 bg-white/8 rounded-full blur-3xl animate-float-delayed"></div>
          <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-white/10 rounded-full blur-3xl animate-float"></div>
          <div className="absolute -bottom-16 left-1/4 w-48 h-48 bg-white/6 rounded-full blur-3xl animate-float-delayed"></div>
        </div>

        <div className="max-w-4xl mx-auto px-6 text-center relative">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Ready to automate your DMs?</h2>
          <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto">
            Join 2,500+ businesses saving hours every day with AI-powered automation
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/signup"
              className="w-full sm:w-auto px-8 py-4 bg-white text-blue-600 text-base font-semibold hover:bg-gray-100 transition-all rounded-xl shadow-xl hover:shadow-2xl hover:-translate-y-1 flex items-center justify-center gap-2"
            >
              Start Free 14-Day Trial
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
            <Link
              href="/login"
              className="w-full sm:w-auto px-8 py-4 text-base font-medium text-white border-2 border-white/30 rounded-xl hover:bg-white/10 hover:border-white/50 transition-all"
            >
              Sign In
            </Link>
          </div>
          <p className="text-blue-200 text-sm mt-6 flex items-center justify-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            No credit card required
          </p>
        </div>
      </section>

      <MarketingFooter />
    </div>
  );
}
