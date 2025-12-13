"use client";

import { useState } from 'react';
import Link from 'next/link';
import MarketingNavbar from '../../components/MarketingNavbar';
import MarketingFooter from '../../components/MarketingFooter';

export default function FeaturesPage() {
  const [activeFeature, setActiveFeature] = useState(0);

  const features = [
    {
      id: 'unified-inbox',
      icon: "M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z",
      title: "Unified Inbox",
      tagline: "All your conversations in one place",
      description: "Manage Instagram, Messenger, WhatsApp, and Telegram conversations from a single, beautiful inbox. Never miss a message again.",
      color: "blue",
      benefits: [
        "Connect all major platforms in minutes",
        "Real-time message syncing across devices",
        "Smart filters and labels for organization",
        "Team collaboration with assignments",
        "Read receipts and typing indicators",
        "Mobile app for on-the-go management"
      ],
      stats: [
        { value: "4+", label: "Platforms supported" },
        { value: "50%", label: "Less time switching apps" },
        { value: "99.9%", label: "Message delivery rate" }
      ]
    },
    {
      id: 'ai-responses',
      icon: "M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z",
      title: "AI-Powered Responses",
      tagline: "Intelligent automation that sounds human",
      description: "Train your AI with your knowledge base and brand voice. Get intelligent, contextual responses that your customers will love.",
      color: "purple",
      benefits: [
        "Custom AI personality and tone settings",
        "Learn from your existing conversations",
        "Context-aware responses",
        "Automatic language detection",
        "Smart escalation to human agents",
        "Continuous learning and improvement"
      ],
      stats: [
        { value: "80%", label: "Queries handled automatically" },
        { value: "< 1s", label: "Average response time" },
        { value: "95%", label: "Customer satisfaction" }
      ]
    },
    {
      id: 'flow-builder',
      icon: "M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z",
      title: "Visual Flow Builder",
      tagline: "Drag, drop, and automate",
      description: "Build complex automation workflows with our intuitive drag-and-drop interface. No coding required - just pure creativity.",
      color: "green",
      benefits: [
        "Intuitive drag-and-drop interface",
        "Pre-built templates to get started",
        "Conditional logic and branching",
        "A/B testing for messages",
        "Scheduled triggers and delays",
        "Integration with external tools"
      ],
      stats: [
        { value: "100+", label: "Pre-built templates" },
        { value: "15min", label: "Average setup time" },
        { value: "∞", label: "Automation possibilities" }
      ]
    },
    {
      id: 'analytics',
      icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z",
      title: "Advanced Analytics",
      tagline: "Data-driven decisions made easy",
      description: "Track response times, conversion rates, and customer satisfaction. Get actionable insights to optimize your messaging strategy.",
      color: "orange",
      benefits: [
        "Real-time performance dashboard",
        "Conversion tracking and attribution",
        "Response time analytics",
        "Customer satisfaction scores",
        "Team performance metrics",
        "Custom report builder"
      ],
      stats: [
        { value: "50+", label: "Metrics tracked" },
        { value: "Real-time", label: "Data updates" },
        { value: "CSV/PDF", label: "Export formats" }
      ]
    },
    {
      id: 'knowledge-base',
      icon: "M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253",
      title: "Knowledge Base",
      tagline: "Your AI's brain, supercharged",
      description: "Upload PDFs, scrape websites, or paste content directly. Your AI learns everything and uses it to provide accurate, helpful responses.",
      color: "indigo",
      benefits: [
        "Upload PDFs, DOCs, and more",
        "Website scraping and import",
        "FAQ management system",
        "Version control for content",
        "Auto-sync with your website",
        "Multi-language support"
      ],
      stats: [
        { value: "10GB", label: "Storage included" },
        { value: "50+", label: "File formats supported" },
        { value: "Auto", label: "Content updates" }
      ]
    },
    {
      id: 'templates',
      icon: "M13 10V3L4 14h7v7l9-11h-7z",
      title: "Instant Templates",
      tagline: "Launch in seconds, not hours",
      description: "Get started instantly with pre-built templates for FAQ bots, lead capture, appointment booking, and more. Customize to match your brand.",
      color: "pink",
      benefits: [
        "Industry-specific templates",
        "One-click installation",
        "Fully customizable designs",
        "Regular template updates",
        "Community template library",
        "Save your own templates"
      ],
      stats: [
        { value: "100+", label: "Ready-to-use templates" },
        { value: "12", label: "Industry categories" },
        { value: "Weekly", label: "New templates added" }
      ]
    }
  ];

  const colorClasses = {
    blue: {
      bg: "from-blue-500 to-blue-600",
      bgLight: "from-blue-50 to-indigo-50",
      border: "border-blue-100",
      text: "text-blue-600",
      badge: "bg-blue-50 text-blue-600",
      shadow: "shadow-blue-500/30",
      gradient: "from-blue-600 to-indigo-600"
    },
    purple: {
      bg: "from-purple-500 to-purple-600",
      bgLight: "from-purple-50 to-pink-50",
      border: "border-purple-100",
      text: "text-purple-600",
      badge: "bg-purple-50 text-purple-600",
      shadow: "shadow-purple-500/30",
      gradient: "from-purple-600 to-pink-600"
    },
    green: {
      bg: "from-green-500 to-green-600",
      bgLight: "from-green-50 to-emerald-50",
      border: "border-green-100",
      text: "text-green-600",
      badge: "bg-green-50 text-green-600",
      shadow: "shadow-green-500/30",
      gradient: "from-green-600 to-emerald-600"
    },
    orange: {
      bg: "from-orange-500 to-orange-600",
      bgLight: "from-orange-50 to-amber-50",
      border: "border-orange-100",
      text: "text-orange-600",
      badge: "bg-orange-50 text-orange-600",
      shadow: "shadow-orange-500/30",
      gradient: "from-orange-600 to-amber-600"
    },
    indigo: {
      bg: "from-indigo-500 to-indigo-600",
      bgLight: "from-indigo-50 to-violet-50",
      border: "border-indigo-100",
      text: "text-indigo-600",
      badge: "bg-indigo-50 text-indigo-600",
      shadow: "shadow-indigo-500/30",
      gradient: "from-indigo-600 to-violet-600"
    },
    pink: {
      bg: "from-pink-500 to-pink-600",
      bgLight: "from-pink-50 to-rose-50",
      border: "border-pink-100",
      text: "text-pink-600",
      badge: "bg-pink-50 text-pink-600",
      shadow: "shadow-pink-500/30",
      gradient: "from-pink-600 to-rose-600"
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <MarketingNavbar />

      {/* Hero Section */}
      <section className="pt-20 pb-16 px-6 relative overflow-hidden">
        {/* Floating elements at edges - non-overlapping */}
        <div className="absolute -top-16 -left-16 w-56 h-56 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-25 animate-float"></div>
        <div className="absolute top-1/4 -right-20 w-48 h-48 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-25 animate-float-delayed"></div>
        <div className="absolute -bottom-12 left-1/3 w-40 h-40 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float"></div>

        <div className="max-w-4xl mx-auto text-center relative">
          <span className="inline-block px-4 py-1.5 text-sm font-semibold text-blue-600 bg-blue-50 rounded-full uppercase tracking-wider mb-6">
            Features
          </span>
          <h1 className="text-5xl md:text-6xl font-bold text-black mb-6 leading-tight">
            Everything you need to
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent"> automate & scale</span>
          </h1>
          <p className="text-xl text-gray-600 mb-10 leading-relaxed max-w-2xl mx-auto">
            Powerful tools designed to help you automate conversations, engage customers, and grow your business effortlessly.
          </p>
        </div>
      </section>

      {/* Feature Navigation */}
      <section className="border-b border-gray-100 sticky top-[73px] bg-white/95 backdrop-blur-sm z-40">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex overflow-x-auto gap-2 py-4 scrollbar-hide">
            {features.map((feature, index) => {
              const colors = colorClasses[feature.color];
              return (
                <button
                  key={feature.id}
                  onClick={() => {
                    setActiveFeature(index);
                    document.getElementById(feature.id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap transition-all ${
                    activeFeature === index
                      ? `bg-gradient-to-r ${colors.bg} text-white shadow-lg ${colors.shadow}`
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={feature.icon} />
                  </svg>
                  <span className="text-sm font-medium">{feature.title}</span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Feature Sections */}
      {features.map((feature, index) => {
        const colors = colorClasses[feature.color];
        const isEven = index % 2 === 0;

        return (
          <section
            key={feature.id}
            id={feature.id}
            className={`py-24 ${isEven ? 'bg-white' : 'bg-gray-50'} scroll-mt-32`}
          >
            <div className="max-w-6xl mx-auto px-6">
              <div className={`flex flex-col ${isEven ? 'lg:flex-row' : 'lg:flex-row-reverse'} gap-12 lg:gap-20 items-center`}>
                {/* Content */}
                <div className="flex-1">
                  <span className={`inline-block px-3 py-1 text-xs font-semibold ${colors.badge} rounded-full uppercase tracking-wider mb-4`}>
                    Feature {index + 1}
                  </span>
                  <h2 className="text-4xl font-bold text-black mb-3">{feature.title}</h2>
                  <p className={`text-xl ${colors.text} font-medium mb-4`}>{feature.tagline}</p>
                  <p className="text-gray-600 text-lg mb-8 leading-relaxed">{feature.description}</p>

                  {/* Benefits List */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
                    {feature.benefits.map((benefit, i) => (
                      <div key={i} className="flex items-start gap-3">
                        <div className={`w-5 h-5 rounded-full bg-gradient-to-br ${colors.bg} flex items-center justify-center flex-shrink-0 mt-0.5`}>
                          <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <span className="text-gray-700 text-sm">{benefit}</span>
                      </div>
                    ))}
                  </div>

                  {/* Stats */}
                  <div className="flex flex-wrap gap-6">
                    {feature.stats.map((stat, i) => (
                      <div key={i} className="text-center">
                        <div className={`text-3xl font-bold bg-gradient-to-r ${colors.gradient} bg-clip-text text-transparent`}>
                          {stat.value}
                        </div>
                        <div className="text-sm text-gray-500">{stat.label}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Visual */}
                <div className="flex-1 w-full">
                  <div className={`bg-gradient-to-br ${colors.bgLight} rounded-3xl p-8 border ${colors.border} relative overflow-hidden`}>
                    {/* Decorative elements */}
                    <div className={`absolute top-4 right-4 w-20 h-20 bg-gradient-to-br ${colors.bg} rounded-full opacity-10`}></div>
                    <div className={`absolute bottom-4 left-4 w-16 h-16 bg-gradient-to-br ${colors.bg} rounded-full opacity-10`}></div>

                    {/* Main Icon */}
                    <div className="relative">
                      <div className={`w-24 h-24 bg-gradient-to-br ${colors.bg} rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl ${colors.shadow}`}>
                        <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={feature.icon} />
                        </svg>
                      </div>

                      {/* Feature Preview Card */}
                      <div className="bg-white rounded-2xl p-6 shadow-xl">
                        <div className="flex items-center gap-3 mb-4">
                          <div className={`w-10 h-10 bg-gradient-to-br ${colors.bg} rounded-lg flex items-center justify-center`}>
                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={feature.icon} />
                            </svg>
                          </div>
                          <div>
                            <div className="font-semibold text-black">{feature.title}</div>
                            <div className="text-xs text-gray-500">Active</div>
                          </div>
                          <div className="ml-auto">
                            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                          </div>
                        </div>

                        {/* Mock UI elements */}
                        <div className="space-y-3">
                          <div className="h-2 bg-gray-100 rounded-full w-full"></div>
                          <div className="h-2 bg-gray-100 rounded-full w-4/5"></div>
                          <div className="h-2 bg-gray-100 rounded-full w-3/5"></div>
                        </div>

                        <div className="flex gap-2 mt-4">
                          <div className={`px-3 py-1.5 bg-gradient-to-r ${colors.bg} text-white text-xs font-medium rounded-lg`}>
                            Configure
                          </div>
                          <div className="px-3 py-1.5 bg-gray-100 text-gray-600 text-xs font-medium rounded-lg">
                            View Stats
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        );
      })}

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 relative overflow-hidden">
        <div className="absolute inset-0">
          {/* Floating elements at edges - non-overlapping */}
          <div className="absolute -top-20 -left-20 w-64 h-64 bg-white/10 rounded-full blur-3xl animate-float"></div>
          <div className="absolute -top-12 -right-12 w-48 h-48 bg-white/8 rounded-full blur-3xl animate-float-delayed"></div>
          <div className="absolute -bottom-16 -right-16 w-56 h-56 bg-white/10 rounded-full blur-3xl animate-float"></div>
          <div className="absolute -bottom-12 left-1/4 w-40 h-40 bg-white/6 rounded-full blur-3xl animate-float-delayed"></div>
        </div>

        <div className="max-w-4xl mx-auto px-6 text-center relative">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Ready to try all features?</h2>
          <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto">
            Start your 14-day free trial and experience the power of automated conversations.
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
              href="/pricing"
              className="w-full sm:w-auto px-8 py-4 text-base font-medium text-white border-2 border-white/30 rounded-xl hover:bg-white/10 hover:border-white/50 transition-all"
            >
              View Pricing
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
