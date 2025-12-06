"use client";

import { useState, useMemo } from 'react';
import Link from 'next/link';

export default function FAQPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [openFaq, setOpenFaq] = useState(null);

  const categories = [
    { id: 'all', name: 'All Questions', icon: 'M4 6h16M4 12h16M4 18h16' },
    { id: 'getting-started', name: 'Getting Started', icon: 'M13 10V3L4 14h7v7l9-11h-7z' },
    { id: 'pricing', name: 'Pricing & Billing', icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
    { id: 'features', name: 'Features', icon: 'M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' },
    { id: 'integrations', name: 'Integrations', icon: 'M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1' },
    { id: 'security', name: 'Security & Privacy', icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z' },
    { id: 'support', name: 'Support', icon: 'M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z' }
  ];

  const faqs = [
    // Getting Started
    {
      category: 'getting-started',
      question: 'How do I get started with DM Automation?',
      answer: 'Getting started is easy! Simply sign up for a free 14-day trial, connect your social media accounts (Instagram, Messenger, WhatsApp, or Telegram), and start building your first automation flow using our visual drag-and-drop builder. No credit card required to start.'
    },
    {
      category: 'getting-started',
      question: 'How long does it take to set up?',
      answer: 'Most users are up and running within 15 minutes. Connect your accounts, choose a template or build your own flow, and you\'re ready to automate. Our onboarding wizard guides you through each step.'
    },
    {
      category: 'getting-started',
      question: 'Do I need technical skills to use DM Automation?',
      answer: 'No technical skills required! Our visual flow builder uses drag-and-drop functionality, making it easy for anyone to create powerful automations. We also provide templates and tutorials to help you get started quickly.'
    },
    {
      category: 'getting-started',
      question: 'Can I import my existing contacts?',
      answer: 'Yes! You can import contacts via CSV file or sync them from your connected platforms. We also integrate with popular CRMs like Salesforce, HubSpot, and Pipedrive for seamless data synchronization.'
    },
    {
      category: 'getting-started',
      question: 'Is there a free trial available?',
      answer: 'Yes, we offer a 14-day free trial with full access to all features. No credit card required to start. You can upgrade to a paid plan at any time during or after your trial.'
    },

    // Pricing & Billing
    {
      category: 'pricing',
      question: 'What payment methods do you accept?',
      answer: 'We accept all major credit cards (Visa, MasterCard, American Express, Discover), PayPal, and bank transfers for annual Enterprise plans. All payments are processed securely through Stripe.'
    },
    {
      category: 'pricing',
      question: 'Can I change my plan later?',
      answer: 'Yes! You can upgrade or downgrade your plan at any time. When upgrading, you\'ll be charged the prorated difference immediately. When downgrading, the credit will be applied to your future invoices.'
    },
    {
      category: 'pricing',
      question: 'What happens if I exceed my message limit?',
      answer: 'We\'ll notify you when you\'re approaching your limit (at 80% and 100%). You can upgrade your plan or purchase additional message credits. We never cut off your automation mid-conversation to ensure a smooth customer experience.'
    },
    {
      category: 'pricing',
      question: 'Do you offer refunds?',
      answer: 'Yes, we offer a 30-day money-back guarantee for all paid plans. If you\'re not satisfied with our service, contact us within 30 days of your purchase for a full refund, no questions asked.'
    },
    {
      category: 'pricing',
      question: 'Are there any hidden fees?',
      answer: 'No hidden fees! The price you see is the price you pay. All features listed in your plan are included. Optional add-ons and overages are clearly communicated before any charges.'
    },
    {
      category: 'pricing',
      question: 'Do you offer discounts for nonprofits or startups?',
      answer: 'Yes! We offer 50% off for registered nonprofits and educational institutions. We also have a startup program with special pricing for early-stage companies. Contact our sales team with proof of status to apply.'
    },

    // Features
    {
      category: 'features',
      question: 'Which social media platforms do you support?',
      answer: 'We currently support Instagram DMs, Facebook Messenger, WhatsApp Business, and Telegram. All platforms can be managed from a single unified inbox. We\'re constantly adding new platform integrations based on user feedback.'
    },
    {
      category: 'features',
      question: 'How does the AI-powered response feature work?',
      answer: 'Our AI learns from your knowledge base, FAQs, past conversations, and brand guidelines to generate intelligent, contextual responses. You can customize the AI\'s personality, set guardrails, and define escalation rules for when to hand off to human agents.'
    },
    {
      category: 'features',
      question: 'Can I customize the automation flows?',
      answer: 'Absolutely! Our visual flow builder allows you to create custom automation workflows with conditional logic, delays, A/B testing, and integrations. You can start from scratch or customize our pre-built templates.'
    },
    {
      category: 'features',
      question: 'What is the Knowledge Base feature?',
      answer: 'The Knowledge Base is where you store information for your AI to learn from. You can upload PDFs, documents, scrape websites, or paste content directly. The AI uses this information to provide accurate, helpful responses to customer inquiries.'
    },
    {
      category: 'features',
      question: 'Can I schedule messages to be sent later?',
      answer: 'Yes! You can schedule messages, campaigns, and automation triggers for specific dates and times. Our scheduling feature supports multiple time zones and recurring schedules.'
    },
    {
      category: 'features',
      question: 'Does DM Automation support multiple languages?',
      answer: 'Yes! Our AI supports 50+ languages and can automatically detect the language of incoming messages to respond appropriately. You can also set preferred languages for your knowledge base and responses.'
    },

    // Integrations
    {
      category: 'integrations',
      question: 'What integrations are available?',
      answer: 'We integrate with popular tools including CRMs (Salesforce, HubSpot, Pipedrive), e-commerce platforms (Shopify, WooCommerce), payment processors (Stripe, PayPal), and productivity tools (Slack, Zapier, Google Sheets). Enterprise plans include custom integration development.'
    },
    {
      category: 'integrations',
      question: 'Do you have an API?',
      answer: 'Yes! Our REST API allows you to programmatically manage conversations, contacts, automations, and more. API access is included in Pro and Enterprise plans. Comprehensive documentation and SDKs are available for popular programming languages.'
    },
    {
      category: 'integrations',
      question: 'Can I connect my CRM?',
      answer: 'Yes! We offer native integrations with Salesforce, HubSpot, Pipedrive, Zoho CRM, and more. You can sync contacts, log conversations, and trigger automations based on CRM events. Custom CRM integrations are available for Enterprise plans.'
    },
    {
      category: 'integrations',
      question: 'Does DM Automation work with Zapier?',
      answer: 'Yes! Our Zapier integration allows you to connect DM Automation with 5,000+ apps. Create automated workflows that trigger based on new messages, contact updates, or custom events.'
    },
    {
      category: 'integrations',
      question: 'Can I use webhooks?',
      answer: 'Yes! Webhooks allow you to receive real-time notifications when events occur in DM Automation. You can configure webhooks for new messages, conversation updates, contact changes, and more. Webhook access is included in Pro and Enterprise plans.'
    },

    // Security & Privacy
    {
      category: 'security',
      question: 'Is my data secure?',
      answer: 'Absolutely. We use enterprise-grade security including AES-256 encryption at rest and TLS 1.3 in transit. Our infrastructure is hosted on AWS with SOC 2 Type II compliance. We undergo regular security audits and penetration testing.'
    },
    {
      category: 'security',
      question: 'Are you GDPR compliant?',
      answer: 'Yes, we are fully GDPR compliant. We provide tools for data export, deletion requests, and consent management. Our Data Processing Agreement (DPA) is available for all customers upon request.'
    },
    {
      category: 'security',
      question: 'Do you share my data with third parties?',
      answer: 'Never. Your data belongs to you. We do not sell, rent, or share your data with third parties for marketing purposes. Data is only shared with service providers necessary for operating our platform, and they are bound by strict confidentiality agreements.'
    },
    {
      category: 'security',
      question: 'Can I delete my data?',
      answer: 'Yes! You can request complete deletion of your data at any time. We will remove all your data from our systems within 30 days, as required by GDPR and other privacy regulations.'
    },
    {
      category: 'security',
      question: 'Do you offer SSO (Single Sign-On)?',
      answer: 'Yes! SSO with SAML 2.0 is available for Enterprise plans. We support popular identity providers including Okta, Azure AD, Google Workspace, and OneLogin.'
    },
    {
      category: 'security',
      question: 'What is your uptime guarantee?',
      answer: 'We guarantee 99.9% uptime for all paid plans. Enterprise plans include a Service Level Agreement (SLA) with uptime guarantees and financial credits for any downtime.'
    },

    // Support
    {
      category: 'support',
      question: 'How can I contact support?',
      answer: 'You can reach our support team via email at support@dmautomation.com, through the in-app chat, or by phone (Enterprise plans). We also have an extensive knowledge base with tutorials, guides, and video walkthroughs.'
    },
    {
      category: 'support',
      question: 'What are your support hours?',
      answer: 'Our support team is available Monday through Friday, 9 AM to 6 PM in your local time zone. Enterprise plans include 24/7 priority support with dedicated account managers.'
    },
    {
      category: 'support',
      question: 'Do you offer onboarding assistance?',
      answer: 'Yes! All plans include access to our onboarding resources including video tutorials, documentation, and email support. Pro plans include a personalized onboarding call, and Enterprise plans include dedicated onboarding with a customer success manager.'
    },
    {
      category: 'support',
      question: 'Is there a community or forum?',
      answer: 'Yes! Join our community of 10,000+ users on our forum and Slack channel. Share tips, ask questions, get inspiration from other users, and stay updated on new features and best practices.'
    },
    {
      category: 'support',
      question: 'Do you offer training or webinars?',
      answer: 'Yes! We host weekly webinars covering various topics from beginner basics to advanced automation strategies. All webinars are recorded and available in our resource library. Enterprise plans include custom training sessions.'
    }
  ];

  const filteredFaqs = useMemo(() => {
    return faqs.filter(faq => {
      const matchesCategory = activeCategory === 'all' || faq.category === activeCategory;
      const matchesSearch = searchQuery === '' ||
        faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchQuery]);

  const faqsByCategory = useMemo(() => {
    if (activeCategory !== 'all') {
      return { [activeCategory]: filteredFaqs };
    }
    return filteredFaqs.reduce((acc, faq) => {
      if (!acc[faq.category]) {
        acc[faq.category] = [];
      }
      acc[faq.category].push(faq);
      return acc;
    }, {});
  }, [filteredFaqs, activeCategory]);

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="sticky top-0 bg-white/80 backdrop-blur-md z-50 border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 hover:opacity-70 transition-opacity group">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center font-mono text-xs font-bold text-white">
              DM
            </div>
            <span className="font-semibold text-lg">DM Automation</span>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            <Link href="/features" className="text-sm text-gray-600 hover:text-blue-600 transition-colors">Features</Link>
            <Link href="/pricing" className="text-sm text-gray-600 hover:text-blue-600 transition-colors">Pricing</Link>
            <Link href="/#testimonials" className="text-sm text-gray-600 hover:text-blue-600 transition-colors">Testimonials</Link>
            <Link href="/faq" className="text-sm text-blue-600 font-medium">FAQ</Link>
          </nav>

          <div className="flex items-center gap-3">
            <Link href="/login" className="text-sm text-gray-600 hover:text-black transition-colors px-4 py-2">
              Sign In
            </Link>
            <Link
              href="/signup"
              className="px-5 py-2.5 text-sm bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:opacity-90 transition-all rounded-lg font-medium shadow-lg shadow-blue-500/25"
            >
              Start Free Trial
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-20 pb-12 px-6 relative overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-orange-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-float"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-float-delayed"></div>

        <div className="max-w-4xl mx-auto text-center relative">
          <span className="inline-block px-4 py-1.5 text-sm font-semibold text-orange-600 bg-orange-50 rounded-full uppercase tracking-wider mb-6">
            FAQ
          </span>
          <h1 className="text-5xl md:text-6xl font-bold text-black mb-6 leading-tight">
            Frequently Asked
            <span className="bg-gradient-to-r from-orange-600 via-pink-600 to-purple-600 bg-clip-text text-transparent"> Questions</span>
          </h1>
          <p className="text-xl text-gray-600 mb-10 leading-relaxed max-w-2xl mx-auto">
            Find answers to common questions about DM Automation. Can't find what you're looking for? Contact our support team.
          </p>

          {/* Search Bar */}
          <div className="max-w-xl mx-auto relative">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for answers..."
              className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none text-lg shadow-sm"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute inset-y-0 right-4 flex items-center text-gray-400 hover:text-gray-600"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Category Tabs */}
      <section className="border-b border-gray-100 sticky top-[73px] bg-white/95 backdrop-blur-sm z-40">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex overflow-x-auto gap-2 py-4 scrollbar-hide">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => {
                  setActiveCategory(category.id);
                  setOpenFaq(null);
                }}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-full whitespace-nowrap transition-all ${
                  activeCategory === category.id
                    ? 'bg-gradient-to-r from-orange-500 to-pink-500 text-white shadow-lg shadow-orange-500/30'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={category.icon} />
                </svg>
                <span className="text-sm font-medium">{category.name}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Content */}
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto">
          {filteredFaqs.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No results found</h3>
              <p className="text-gray-600 mb-6">We couldn't find any questions matching "{searchQuery}"</p>
              <button
                onClick={() => setSearchQuery('')}
                className="px-6 py-3 bg-gray-100 text-gray-700 font-medium rounded-xl hover:bg-gray-200 transition-colors"
              >
                Clear search
              </button>
            </div>
          ) : (
            Object.entries(faqsByCategory).map(([categoryId, categoryFaqs]) => {
              const category = categories.find(c => c.id === categoryId);
              return (
                <div key={categoryId} className="mb-12">
                  {activeCategory === 'all' && (
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-pink-500 rounded-lg flex items-center justify-center">
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={category?.icon} />
                        </svg>
                      </div>
                      <h2 className="text-2xl font-bold text-black">{category?.name}</h2>
                    </div>
                  )}

                  <div className="space-y-4">
                    {categoryFaqs.map((faq, index) => {
                      const faqKey = `${categoryId}-${index}`;
                      return (
                        <div
                          key={faqKey}
                          className={`border rounded-2xl overflow-hidden transition-all duration-300 ${
                            openFaq === faqKey
                              ? 'border-orange-200 shadow-lg bg-gradient-to-r from-orange-50/50 to-pink-50/50'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <button
                            onClick={() => setOpenFaq(openFaq === faqKey ? null : faqKey)}
                            className="w-full px-6 py-5 text-left flex items-center justify-between hover:bg-gray-50/50 transition-colors"
                          >
                            <span className="font-medium text-black text-lg pr-4">{faq.question}</span>
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 flex-shrink-0 ${
                              openFaq === faqKey
                                ? 'bg-gradient-to-r from-orange-500 to-pink-500 rotate-180'
                                : 'bg-gray-100'
                            }`}>
                              <svg
                                className={`w-5 h-5 transition-colors ${openFaq === faqKey ? 'text-white' : 'text-gray-500'}`}
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                              </svg>
                            </div>
                          </button>
                          <div className={`overflow-hidden transition-all duration-300 ${openFaq === faqKey ? 'max-h-96' : 'max-h-0'}`}>
                            <div className="px-6 pb-5 text-gray-600 leading-relaxed">
                              {faq.answer}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </section>

      {/* Still Have Questions CTA */}
      <section className="py-20 px-6 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-br from-orange-500 via-pink-500 to-purple-500 rounded-3xl p-12 text-center relative overflow-hidden">
            <div className="absolute top-0 left-1/4 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>

            <div className="relative">
              <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Still have questions?</h2>
              <p className="text-xl text-white/90 mb-8 max-w-xl mx-auto">
                Can't find the answer you're looking for? Our friendly support team is here to help.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  href="/contact"
                  className="w-full sm:w-auto px-8 py-4 bg-white text-orange-600 text-base font-semibold hover:bg-gray-100 transition-all rounded-xl shadow-xl hover:shadow-2xl hover:-translate-y-1 flex items-center justify-center gap-2"
                >
                  Contact Support
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Link>
                <a
                  href="mailto:support@dmautomation.com"
                  className="w-full sm:w-auto px-8 py-4 text-base font-medium text-white border-2 border-white/30 rounded-xl hover:bg-white/10 hover:border-white/50 transition-all flex items-center justify-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  Email Us
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Links */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold text-black text-center mb-10">Helpful Resources</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253',
                title: 'Documentation',
                description: 'In-depth guides and API references',
                link: '#',
                color: 'blue'
              },
              {
                icon: 'M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z',
                title: 'Video Tutorials',
                description: 'Step-by-step video walkthroughs',
                link: '#',
                color: 'purple'
              },
              {
                icon: 'M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z',
                title: 'Community Forum',
                description: 'Connect with other users',
                link: '#',
                color: 'green'
              }
            ].map((resource, i) => (
              <a
                key={i}
                href={resource.link}
                className="group p-6 bg-white border border-gray-200 rounded-2xl hover:border-blue-200 hover:shadow-lg transition-all"
              >
                <div className={`w-12 h-12 bg-gradient-to-br from-${resource.color}-500 to-${resource.color}-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={resource.icon} />
                  </svg>
                </div>
                <h3 className="font-semibold text-black mb-2 group-hover:text-blue-600 transition-colors">{resource.title}</h3>
                <p className="text-sm text-gray-600">{resource.description}</p>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-16">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
            <div className="col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center font-mono text-xs font-bold text-white">
                  DM
                </div>
                <span className="font-semibold text-lg text-white">DM Automation</span>
              </div>
              <p className="text-sm leading-relaxed mb-4 max-w-xs">
                Automate your social media conversations with AI. Save time, close more deals, delight customers.
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-white mb-4">Product</h4>
              <ul className="space-y-3 text-sm">
                <li><Link href="/features" className="hover:text-white transition-colors">Features</Link></li>
                <li><Link href="/pricing" className="hover:text-white transition-colors">Pricing</Link></li>
                <li><a href="/supported-channels" className="hover:text-white transition-colors">Channels</a></li>
                <li><a href="#" className="hover:text-white transition-colors">API</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-white mb-4">Company</h4>
              <ul className="space-y-3 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                <li><Link href="/contact" className="hover:text-white transition-colors">Contact</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-white mb-4">Support</h4>
              <ul className="space-y-3 text-sm">
                <li><Link href="/faq" className="hover:text-white transition-colors">FAQ</Link></li>
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><Link href="/contact" className="hover:text-white transition-colors">Contact Support</Link></li>
                <li><a href="#" className="hover:text-white transition-colors">Status</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm">&copy; 2025 DM Automation. All rights reserved.</p>
            <p className="text-sm flex items-center gap-1">
              Made with <span className="text-red-500 animate-pulse">&#10084;</span> for businesses everywhere
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
