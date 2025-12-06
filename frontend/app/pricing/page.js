"use client";

import { useState } from 'react';
import Link from 'next/link';
import MarketingNavbar from '../../components/MarketingNavbar';
import MarketingFooter from '../../components/MarketingFooter';

export default function PricingPage() {
  const [billingCycle, setBillingCycle] = useState('monthly');

  const plans = [
    {
      name: "Starter",
      description: "Perfect for small businesses getting started",
      monthlyPrice: 29,
      yearlyPrice: 290,
      color: "blue",
      popular: false,
      cta: "Start Free Trial",
      features: {
        channels: "1 channel",
        messages: "1,000/month",
        automations: "5 flows",
        aiResponses: "Basic AI",
        knowledgeBase: "1 GB storage",
        analytics: "Basic analytics",
        support: "Email support",
        teamMembers: "1 user",
        customBranding: false,
        apiAccess: false,
        webhooks: false,
        prioritySupport: false,
        dedicatedManager: false,
        sla: false,
        sso: false,
        customIntegrations: false
      }
    },
    {
      name: "Pro",
      description: "For growing businesses that need more power",
      monthlyPrice: 79,
      yearlyPrice: 790,
      color: "purple",
      popular: true,
      cta: "Start Free Trial",
      features: {
        channels: "4 channels",
        messages: "10,000/month",
        automations: "Unlimited flows",
        aiResponses: "Advanced AI",
        knowledgeBase: "10 GB storage",
        analytics: "Advanced analytics",
        support: "Priority support",
        teamMembers: "5 users",
        customBranding: true,
        apiAccess: true,
        webhooks: true,
        prioritySupport: true,
        dedicatedManager: false,
        sla: false,
        sso: false,
        customIntegrations: false
      }
    },
    {
      name: "Enterprise",
      description: "For large organizations with custom needs",
      monthlyPrice: null,
      yearlyPrice: null,
      color: "gray",
      popular: false,
      cta: "Contact Sales",
      features: {
        channels: "Unlimited",
        messages: "Unlimited",
        automations: "Unlimited flows",
        aiResponses: "Custom AI training",
        knowledgeBase: "Unlimited storage",
        analytics: "Custom reports",
        support: "24/7 phone support",
        teamMembers: "Unlimited users",
        customBranding: true,
        apiAccess: true,
        webhooks: true,
        prioritySupport: true,
        dedicatedManager: true,
        sla: true,
        sso: true,
        customIntegrations: true
      }
    }
  ];

  const featureCategories = [
    {
      name: "Core Features",
      features: [
        { key: "channels", label: "Connected Channels", tooltip: "Number of social media platforms you can connect" },
        { key: "messages", label: "Messages per Month", tooltip: "Total automated messages sent per month" },
        { key: "automations", label: "Automation Flows", tooltip: "Number of automation workflows you can create" },
        { key: "aiResponses", label: "AI Responses", tooltip: "AI capability level for automated responses" },
        { key: "knowledgeBase", label: "Knowledge Base Storage", tooltip: "Storage for PDFs, documents, and training data" }
      ]
    },
    {
      name: "Analytics & Reporting",
      features: [
        { key: "analytics", label: "Analytics Dashboard", tooltip: "Level of analytics and reporting available" }
      ]
    },
    {
      name: "Team & Support",
      features: [
        { key: "teamMembers", label: "Team Members", tooltip: "Number of users who can access the account" },
        { key: "support", label: "Support Level", tooltip: "Type of customer support included" },
        { key: "prioritySupport", label: "Priority Support", tooltip: "Get faster response times from our support team", boolean: true },
        { key: "dedicatedManager", label: "Dedicated Account Manager", tooltip: "Personal account manager for your business", boolean: true }
      ]
    },
    {
      name: "Advanced Features",
      features: [
        { key: "customBranding", label: "Custom Branding", tooltip: "Remove DM Automation branding and add your own", boolean: true },
        { key: "apiAccess", label: "API Access", tooltip: "Access to our REST API for custom integrations", boolean: true },
        { key: "webhooks", label: "Webhooks", tooltip: "Real-time event notifications to your systems", boolean: true },
        { key: "customIntegrations", label: "Custom Integrations", tooltip: "Build custom integrations with your tools", boolean: true }
      ]
    },
    {
      name: "Enterprise",
      features: [
        { key: "sla", label: "SLA Agreement", tooltip: "Service Level Agreement with uptime guarantees", boolean: true },
        { key: "sso", label: "SSO / SAML", tooltip: "Single Sign-On integration for enterprise security", boolean: true }
      ]
    }
  ];

  const faqs = [
    {
      question: "Can I change plans later?",
      answer: "Yes! You can upgrade or downgrade your plan at any time. When upgrading, you'll be charged the prorated difference. When downgrading, the credit will be applied to future invoices."
    },
    {
      question: "What happens if I exceed my message limit?",
      answer: "We'll notify you when you're approaching your limit. You can upgrade your plan or purchase additional message credits. We never cut off your automation mid-conversation."
    },
    {
      question: "Is there a free trial?",
      answer: "Yes! All plans come with a 14-day free trial with full access to all features. No credit card required to start."
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept all major credit cards (Visa, MasterCard, American Express), PayPal, and bank transfers for annual Enterprise plans."
    },
    {
      question: "Can I get a refund?",
      answer: "We offer a 30-day money-back guarantee for all paid plans. If you're not satisfied, contact us within 30 days of your purchase for a full refund."
    },
    {
      question: "Do you offer discounts for nonprofits?",
      answer: "Yes! We offer 50% off for registered nonprofits and educational institutions. Contact our sales team with proof of nonprofit status."
    }
  ];

  const [openFaq, setOpenFaq] = useState(null);

  return (
    <div className="min-h-screen bg-white">
      <MarketingNavbar />

      {/* Hero Section */}
      <section className="pt-20 pb-16 px-6 relative overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-green-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-float"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-float-delayed"></div>

        <div className="max-w-4xl mx-auto text-center relative">
          <span className="inline-block px-4 py-1.5 text-sm font-semibold text-green-600 bg-green-50 rounded-full uppercase tracking-wider mb-6">
            Pricing
          </span>
          <h1 className="text-5xl md:text-6xl font-bold text-black mb-6 leading-tight">
            Simple, transparent
            <span className="bg-gradient-to-r from-green-600 via-blue-600 to-purple-600 bg-clip-text text-transparent"> pricing</span>
          </h1>
          <p className="text-xl text-gray-600 mb-10 leading-relaxed max-w-2xl mx-auto">
            Choose the perfect plan for your business. Start free, upgrade when you need more.
          </p>

          {/* Billing Toggle */}
          <div className="inline-flex items-center gap-4 bg-gray-100 p-1.5 rounded-xl">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-6 py-2.5 rounded-lg text-sm font-medium transition-all ${
                billingCycle === 'monthly'
                  ? 'bg-white text-black shadow-sm'
                  : 'text-gray-600 hover:text-black'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingCycle('yearly')}
              className={`px-6 py-2.5 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
                billingCycle === 'yearly'
                  ? 'bg-white text-black shadow-sm'
                  : 'text-gray-600 hover:text-black'
              }`}
            >
              Yearly
              <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs font-semibold rounded-full">
                Save 17%
              </span>
            </button>
          </div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="pb-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {plans.map((plan, index) => (
              <div
                key={plan.name}
                className={`relative rounded-2xl p-8 transition-all duration-300 ${
                  plan.popular
                    ? 'bg-gradient-to-br from-blue-600 via-purple-600 to-blue-600 animate-gradient-x shadow-2xl shadow-purple-500/30 scale-105 z-10'
                    : 'bg-white border border-gray-200 hover:border-gray-300 hover:shadow-xl'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1.5 bg-gradient-to-r from-orange-400 to-pink-500 text-white text-sm font-semibold rounded-full shadow-lg">
                    Most Popular
                  </div>
                )}

                <div className={plan.popular ? 'text-white' : 'text-black'}>
                  <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                  <p className={`text-sm mb-6 ${plan.popular ? 'text-blue-100' : 'text-gray-600'}`}>
                    {plan.description}
                  </p>

                  <div className="mb-6">
                    {plan.monthlyPrice ? (
                      <>
                        <span className="text-5xl font-bold">
                          ${billingCycle === 'monthly' ? plan.monthlyPrice : Math.round(plan.yearlyPrice / 12)}
                        </span>
                        <span className={plan.popular ? 'text-blue-100' : 'text-gray-600'}>/month</span>
                        {billingCycle === 'yearly' && (
                          <p className={`text-sm mt-1 ${plan.popular ? 'text-blue-200' : 'text-gray-500'}`}>
                            Billed ${plan.yearlyPrice}/year
                          </p>
                        )}
                      </>
                    ) : (
                      <span className="text-4xl font-bold">Custom</span>
                    )}
                  </div>

                  <Link
                    href={plan.monthlyPrice ? '/signup' : '/contact'}
                    className={`block w-full py-3.5 text-center font-semibold rounded-xl transition-all mb-8 ${
                      plan.popular
                        ? 'bg-white text-blue-600 hover:bg-gray-100 shadow-lg'
                        : 'bg-black text-white hover:bg-gray-800'
                    }`}
                  >
                    {plan.cta}
                  </Link>

                  <div className="space-y-4">
                    <p className={`text-sm font-semibold ${plan.popular ? 'text-white' : 'text-gray-900'}`}>
                      Includes:
                    </p>
                    {Object.entries(plan.features).slice(0, 8).map(([key, value]) => {
                      if (typeof value === 'boolean') return null;
                      return (
                        <div key={key} className="flex items-center gap-3">
                          <svg className={`w-5 h-5 flex-shrink-0 ${plan.popular ? 'text-green-300' : 'text-green-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          <span className={`text-sm ${plan.popular ? 'text-blue-50' : 'text-gray-700'}`}>
                            {value}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison Table */}
      <section className="py-20 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-black mb-4">Compare all features</h2>
            <p className="text-gray-600">See what's included in each plan</p>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
            {/* Table Header */}
            <div className="grid grid-cols-4 border-b border-gray-200">
              <div className="p-6 bg-gray-50">
                <span className="font-semibold text-gray-900">Features</span>
              </div>
              {plans.map((plan) => (
                <div key={plan.name} className={`p-6 text-center ${plan.popular ? 'bg-gradient-to-b from-purple-600 to-purple-700' : 'bg-gray-50'}`}>
                  <span className={`font-semibold ${plan.popular ? 'text-white' : 'text-gray-900'}`}>
                    {plan.name}
                  </span>
                  {plan.popular && (
                    <span className="ml-2 px-2 py-0.5 bg-white/20 text-white text-xs font-medium rounded-full">
                      Popular
                    </span>
                  )}
                </div>
              ))}
            </div>

            {/* Feature Categories */}
            {featureCategories.map((category, catIndex) => (
              <div key={category.name}>
                {/* Category Header */}
                <div className="grid grid-cols-4 border-b border-gray-100 bg-gray-50/50">
                  <div className="p-4 col-span-4">
                    <span className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
                      {category.name}
                    </span>
                  </div>
                </div>

                {/* Features */}
                {category.features.map((feature, featIndex) => (
                  <div
                    key={feature.key}
                    className={`grid grid-cols-4 ${
                      featIndex < category.features.length - 1 || catIndex < featureCategories.length - 1
                        ? 'border-b border-gray-100'
                        : ''
                    } hover:bg-gray-50/50 transition-colors`}
                  >
                    <div className="p-4 flex items-center gap-2">
                      <span className="text-sm text-gray-700">{feature.label}</span>
                      <div className="group relative">
                        <svg className="w-4 h-4 text-gray-400 cursor-help" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <div className="absolute left-0 bottom-full mb-2 w-48 p-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10">
                          {feature.tooltip}
                        </div>
                      </div>
                    </div>
                    {plans.map((plan) => (
                      <div key={plan.name} className={`p-4 text-center ${plan.popular ? 'bg-purple-50' : ''}`}>
                        {feature.boolean ? (
                          plan.features[feature.key] ? (
                            <svg className={`w-5 h-5 mx-auto ${plan.popular ? 'text-purple-600' : 'text-green-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          ) : (
                            <svg className="w-5 h-5 text-gray-300 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          )
                        ) : (
                          <span className={`text-sm ${plan.popular ? 'text-purple-700 font-medium' : 'text-gray-700'}`}>{plan.features[feature.key]}</span>
                        )}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            ))}

            {/* CTA Buttons Row */}
            <div className="grid grid-cols-4 border-t border-gray-200">
              <div className="p-6 bg-gray-50">
                <span className="font-semibold text-gray-900">Get Started</span>
              </div>
              {plans.map((plan) => (
                <div key={plan.name} className={`p-6 text-center ${plan.popular ? 'bg-purple-50' : 'bg-gray-50'}`}>
                  <Link
                    href={plan.monthlyPrice ? '/signup' : '/contact'}
                    className={`inline-block w-full py-3 px-4 text-sm font-semibold rounded-xl transition-all ${
                      plan.popular
                        ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:opacity-90 shadow-lg shadow-purple-500/25 hover:shadow-xl'
                        : 'bg-black text-white hover:bg-gray-800'
                    }`}
                  >
                    {plan.cta}
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 px-6">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <span className="inline-block px-4 py-1.5 text-sm font-semibold text-orange-600 bg-orange-50 rounded-full uppercase tracking-wider mb-4">
              FAQ
            </span>
            <h2 className="text-3xl font-bold text-black mb-4">Pricing questions</h2>
            <p className="text-gray-600">Everything you need to know about our pricing</p>
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
                  <span className="font-medium text-black">{faq.question}</span>
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
      <section className="py-24 bg-gradient-to-br from-green-600 via-blue-600 to-purple-600 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-float"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-float-delayed"></div>
        </div>

        <div className="max-w-4xl mx-auto px-6 text-center relative">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Start your free trial today</h2>
          <p className="text-xl text-green-100 mb-10 max-w-2xl mx-auto">
            14 days free. No credit card required. Cancel anytime.
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
              href="/contact"
              className="w-full sm:w-auto px-8 py-4 text-base font-medium text-white border-2 border-white/30 rounded-xl hover:bg-white/10 hover:border-white/50 transition-all"
            >
              Contact Sales
            </Link>
          </div>
        </div>
      </section>

      <MarketingFooter />
    </div>
  );
}
