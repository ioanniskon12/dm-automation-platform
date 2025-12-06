"use client";

import { useState } from 'react';
import Link from 'next/link';

export default function IntegrationsPage() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = [
    { id: 'all', name: 'All Integrations' },
    { id: 'messaging', name: 'Messaging' },
    { id: 'crm', name: 'CRM' },
    { id: 'ecommerce', name: 'E-Commerce' },
    { id: 'marketing', name: 'Marketing' },
    { id: 'analytics', name: 'Analytics' },
    { id: 'productivity', name: 'Productivity' }
  ];

  const integrations = [
    // Messaging
    {
      id: 'instagram',
      name: 'Instagram',
      category: 'messaging',
      description: 'Automate Instagram DMs, respond to story mentions, and engage with comments automatically.',
      features: ['Direct Messages', 'Story Replies', 'Comment Automation', 'Post Engagement'],
      logo: '/integrations/instagram.svg',
      color: 'from-pink-500 to-purple-600',
      popular: true
    },
    {
      id: 'messenger',
      name: 'Facebook Messenger',
      category: 'messaging',
      description: 'Connect with customers on Messenger with automated responses and chatbots.',
      features: ['Automated Replies', 'Chat Flows', 'Quick Replies', 'Persistent Menu'],
      logo: '/integrations/messenger.svg',
      color: 'from-blue-500 to-blue-600',
      popular: true
    },
    {
      id: 'whatsapp',
      name: 'WhatsApp Business',
      category: 'messaging',
      description: 'Scale your WhatsApp customer support with AI-powered automation.',
      features: ['Business API', 'Message Templates', 'Quick Replies', 'Catalog Sharing'],
      logo: '/integrations/whatsapp.svg',
      color: 'from-green-500 to-green-600',
      popular: true
    },
    {
      id: 'telegram',
      name: 'Telegram',
      category: 'messaging',
      description: 'Build powerful Telegram bots for customer support and engagement.',
      features: ['Bot API', 'Inline Keyboards', 'Group Management', 'Channel Posts'],
      logo: '/integrations/telegram.svg',
      color: 'from-blue-400 to-blue-500'
    },
    {
      id: 'twitter',
      name: 'X (Twitter)',
      category: 'messaging',
      description: 'Manage Twitter DMs and automate responses to mentions and messages.',
      features: ['Direct Messages', 'Mention Tracking', 'Auto Replies', 'Tweet Monitoring'],
      logo: '/integrations/twitter.svg',
      color: 'from-gray-800 to-black',
      comingSoon: true
    },

    // CRM
    {
      id: 'salesforce',
      name: 'Salesforce',
      category: 'crm',
      description: 'Sync conversations and contacts with Salesforce for complete customer visibility.',
      features: ['Contact Sync', 'Lead Creation', 'Activity Logging', 'Custom Fields'],
      logo: '/integrations/salesforce.svg',
      color: 'from-blue-500 to-cyan-500',
      popular: true
    },
    {
      id: 'hubspot',
      name: 'HubSpot',
      category: 'crm',
      description: 'Connect DM Automation with HubSpot CRM for seamless lead management.',
      features: ['Contact Sync', 'Deal Pipeline', 'Activity Timeline', 'Workflow Triggers'],
      logo: '/integrations/hubspot.svg',
      color: 'from-orange-500 to-orange-600',
      popular: true
    },
    {
      id: 'pipedrive',
      name: 'Pipedrive',
      category: 'crm',
      description: 'Manage your sales pipeline with automatic contact and deal syncing.',
      features: ['Deal Management', 'Contact Sync', 'Activity Tracking', 'Custom Fields'],
      logo: '/integrations/pipedrive.svg',
      color: 'from-green-600 to-green-700'
    },
    {
      id: 'zoho',
      name: 'Zoho CRM',
      category: 'crm',
      description: 'Integrate with Zoho CRM to keep your customer data in sync.',
      features: ['Lead Sync', 'Contact Management', 'Deal Tracking', 'Custom Modules'],
      logo: '/integrations/zoho.svg',
      color: 'from-red-500 to-red-600'
    },

    // E-Commerce
    {
      id: 'shopify',
      name: 'Shopify',
      category: 'ecommerce',
      description: 'Connect your Shopify store to automate order updates and customer support.',
      features: ['Order Notifications', 'Product Lookup', 'Cart Recovery', 'Customer Sync'],
      logo: '/integrations/shopify.svg',
      color: 'from-green-500 to-green-600',
      popular: true
    },
    {
      id: 'woocommerce',
      name: 'WooCommerce',
      category: 'ecommerce',
      description: 'Integrate your WooCommerce store for seamless e-commerce automation.',
      features: ['Order Status', 'Product Info', 'Customer Data', 'Abandoned Cart'],
      logo: '/integrations/woocommerce.svg',
      color: 'from-purple-600 to-purple-700'
    },
    {
      id: 'stripe',
      name: 'Stripe',
      category: 'ecommerce',
      description: 'Accept payments and manage subscriptions directly in conversations.',
      features: ['Payment Links', 'Invoice Sending', 'Subscription Management', 'Refund Processing'],
      logo: '/integrations/stripe.svg',
      color: 'from-purple-500 to-indigo-600'
    },
    {
      id: 'bigcommerce',
      name: 'BigCommerce',
      category: 'ecommerce',
      description: 'Connect BigCommerce for automated customer communication.',
      features: ['Order Updates', 'Product Catalog', 'Customer Profiles', 'Shipping Info'],
      logo: '/integrations/bigcommerce.svg',
      color: 'from-blue-600 to-blue-700',
      comingSoon: true
    },

    // Marketing
    {
      id: 'mailchimp',
      name: 'Mailchimp',
      category: 'marketing',
      description: 'Sync contacts with Mailchimp and trigger email campaigns from conversations.',
      features: ['List Sync', 'Campaign Triggers', 'Tag Management', 'Audience Segmentation'],
      logo: '/integrations/mailchimp.svg',
      color: 'from-yellow-400 to-yellow-500'
    },
    {
      id: 'klaviyo',
      name: 'Klaviyo',
      category: 'marketing',
      description: 'Power your email marketing with conversation data from Klaviyo.',
      features: ['Profile Sync', 'Flow Triggers', 'Event Tracking', 'Segmentation'],
      logo: '/integrations/klaviyo.svg',
      color: 'from-green-600 to-teal-600'
    },
    {
      id: 'activecampaign',
      name: 'ActiveCampaign',
      category: 'marketing',
      description: 'Combine marketing automation with conversational messaging.',
      features: ['Contact Sync', 'Automation Triggers', 'Deal Pipeline', 'Email Sequences'],
      logo: '/integrations/activecampaign.svg',
      color: 'from-blue-600 to-blue-700'
    },

    // Analytics
    {
      id: 'google-analytics',
      name: 'Google Analytics',
      category: 'analytics',
      description: 'Track conversation metrics and customer behavior in Google Analytics.',
      features: ['Event Tracking', 'Conversion Goals', 'User Journey', 'Custom Reports'],
      logo: '/integrations/google-analytics.svg',
      color: 'from-orange-500 to-yellow-500'
    },
    {
      id: 'mixpanel',
      name: 'Mixpanel',
      category: 'analytics',
      description: 'Analyze user behavior and conversation patterns with Mixpanel.',
      features: ['Event Tracking', 'Funnel Analysis', 'User Profiles', 'Retention Reports'],
      logo: '/integrations/mixpanel.svg',
      color: 'from-purple-500 to-purple-600'
    },
    {
      id: 'segment',
      name: 'Segment',
      category: 'analytics',
      description: 'Route conversation data to all your analytics tools with Segment.',
      features: ['Data Routing', 'Identity Resolution', 'Event Tracking', 'Destinations'],
      logo: '/integrations/segment.svg',
      color: 'from-green-500 to-teal-500'
    },

    // Productivity
    {
      id: 'slack',
      name: 'Slack',
      category: 'productivity',
      description: 'Get notifications and manage conversations directly from Slack.',
      features: ['Real-time Alerts', 'Reply from Slack', 'Team Handoffs', 'Channel Updates'],
      logo: '/integrations/slack.svg',
      color: 'from-purple-600 to-pink-500',
      popular: true
    },
    {
      id: 'zapier',
      name: 'Zapier',
      category: 'productivity',
      description: 'Connect DM Automation with 5,000+ apps through Zapier.',
      features: ['Custom Triggers', 'Multi-step Zaps', 'Data Mapping', 'Filters & Paths'],
      logo: '/integrations/zapier.svg',
      color: 'from-orange-500 to-orange-600',
      popular: true
    },
    {
      id: 'notion',
      name: 'Notion',
      category: 'productivity',
      description: 'Sync conversation data and create tasks in your Notion workspace.',
      features: ['Database Sync', 'Page Creation', 'Task Management', 'Note Taking'],
      logo: '/integrations/notion.svg',
      color: 'from-gray-800 to-black'
    },
    {
      id: 'google-sheets',
      name: 'Google Sheets',
      category: 'productivity',
      description: 'Export conversation data and leads to Google Sheets automatically.',
      features: ['Data Export', 'Real-time Sync', 'Custom Columns', 'Automated Reports'],
      logo: '/integrations/google-sheets.svg',
      color: 'from-green-500 to-green-600'
    },
    {
      id: 'calendly',
      name: 'Calendly',
      category: 'productivity',
      description: 'Let customers book appointments directly within conversations.',
      features: ['Booking Links', 'Availability Sync', 'Confirmation Messages', 'Reminders'],
      logo: '/integrations/calendly.svg',
      color: 'from-blue-500 to-blue-600'
    }
  ];

  const filteredIntegrations = integrations.filter(integration => {
    const matchesCategory = activeCategory === 'all' || integration.category === activeCategory;
    const matchesSearch = searchQuery === '' ||
      integration.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      integration.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const stats = [
    { value: '50+', label: 'Integrations' },
    { value: '5M+', label: 'API Calls Daily' },
    { value: '99.9%', label: 'Uptime SLA' },
    { value: '<100ms', label: 'Avg Response Time' }
  ];

  return (
    <main className="min-h-screen bg-white">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">DM</span>
            </div>
            <span className="font-semibold text-gray-900">DM Automation</span>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            <Link href="/features" className="text-sm text-gray-600 hover:text-blue-600 transition-colors">Features</Link>
            <Link href="/pricing" className="text-sm text-gray-600 hover:text-blue-600 transition-colors">Pricing</Link>
            <Link href="/integrations" className="text-sm text-blue-600 font-medium">Integrations</Link>
            <Link href="/faq" className="text-sm text-gray-600 hover:text-blue-600 transition-colors">FAQ</Link>
          </nav>

          <div className="flex items-center gap-3">
            <Link href="/login" className="text-sm text-gray-600 hover:text-black transition-colors px-4 py-2">
              Sign In
            </Link>
            <Link href="/signup" className="px-5 py-2.5 text-sm bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-medium hover:opacity-90 transition-all">
              Start Free Trial
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50"></div>
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-400/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-400/20 rounded-full blur-3xl"></div>

        <div className="max-w-7xl mx-auto px-6 relative">
          <div className="text-center max-w-3xl mx-auto">
            <span className="inline-block px-4 py-1.5 text-sm font-semibold text-purple-600 bg-purple-100 rounded-full mb-6">
              50+ Integrations
            </span>
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Connect with your
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> favorite tools</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              Seamlessly integrate DM Automation with your existing tech stack.
              From CRMs to e-commerce platforms, we've got you covered.
            </p>

            {/* Search Bar */}
            <div className="max-w-xl mx-auto relative">
              <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search integrations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 rounded-xl border border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition-all text-gray-900 bg-white shadow-lg"
              />
            </div>
          </div>

          {/* Stats */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  {stat.value}
                </div>
                <div className="text-gray-600 mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Category Filter */}
      <section className="py-8 border-b border-gray-100 sticky top-16 bg-white/95 backdrop-blur-sm z-40">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`px-5 py-2.5 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                  activeCategory === category.id
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Integrations Grid */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          {filteredIntegrations.length === 0 ? (
            <div className="text-center py-20">
              <svg className="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No integrations found</h3>
              <p className="text-gray-600">Try adjusting your search or filter criteria</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredIntegrations.map((integration) => (
                <div
                  key={integration.id}
                  className={`group relative bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-xl hover:border-purple-200 transition-all duration-300 ${
                    integration.comingSoon ? 'opacity-75' : ''
                  }`}
                >
                  {integration.popular && (
                    <span className="absolute -top-3 right-4 px-3 py-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-xs font-semibold rounded-full">
                      Popular
                    </span>
                  )}
                  {integration.comingSoon && (
                    <span className="absolute -top-3 right-4 px-3 py-1 bg-gray-800 text-white text-xs font-semibold rounded-full">
                      Coming Soon
                    </span>
                  )}

                  <div className="flex items-start gap-4 mb-4">
                    <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${integration.color} flex items-center justify-center shadow-lg`}>
                      <span className="text-white font-bold text-lg">{integration.name.charAt(0)}</span>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 group-hover:text-purple-600 transition-colors">
                        {integration.name}
                      </h3>
                      <span className="text-sm text-gray-500 capitalize">{integration.category}</span>
                    </div>
                  </div>

                  <p className="text-gray-600 mb-4 line-clamp-2">
                    {integration.description}
                  </p>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {integration.features.slice(0, 3).map((feature, index) => (
                      <span key={index} className="px-2.5 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                        {feature}
                      </span>
                    ))}
                    {integration.features.length > 3 && (
                      <span className="px-2.5 py-1 bg-gray-100 text-gray-500 text-xs rounded-full">
                        +{integration.features.length - 3} more
                      </span>
                    )}
                  </div>

                  {!integration.comingSoon && (
                    <button className="w-full py-2.5 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:border-purple-500 hover:text-purple-600 transition-all group-hover:border-purple-500 group-hover:text-purple-600">
                      View Integration
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* API Section */}
      <section className="py-20 bg-gradient-to-br from-gray-900 to-black">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="inline-block px-4 py-1.5 text-sm font-semibold text-purple-400 bg-purple-900/30 rounded-full mb-6">
                Developer API
              </span>
              <h2 className="text-4xl font-bold text-white mb-6">
                Build custom integrations with our API
              </h2>
              <p className="text-gray-400 text-lg mb-8 leading-relaxed">
                Need a custom integration? Our RESTful API gives you full access to all DM Automation features.
                Build exactly what you need with comprehensive documentation and SDKs.
              </p>

              <div className="space-y-4 mb-8">
                {[
                  'RESTful API with comprehensive documentation',
                  'Webhooks for real-time event notifications',
                  'SDKs for Node.js, Python, and PHP',
                  'OAuth 2.0 authentication',
                  'Rate limits up to 10,000 requests/min'
                ].map((feature, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <svg className="w-5 h-5 text-green-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-300">{feature}</span>
                  </div>
                ))}
              </div>

              <div className="flex gap-4">
                <Link href="/docs" className="px-6 py-3 bg-white text-gray-900 rounded-lg font-medium hover:bg-gray-100 transition-all">
                  View Documentation
                </Link>
                <Link href="/signup" className="px-6 py-3 border border-gray-600 text-white rounded-lg font-medium hover:border-gray-500 transition-all">
                  Get API Key
                </Link>
              </div>
            </div>

            <div className="relative">
              <div className="bg-gray-800 rounded-xl p-6 font-mono text-sm overflow-hidden">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  <span className="ml-4 text-gray-500 text-xs">api-example.js</span>
                </div>
                <pre className="text-gray-300 overflow-x-auto">
                  <code>{`import { DMAutomation } from '@dm-automation/sdk';

const client = new DMAutomation({
  apiKey: process.env.DM_API_KEY
});

// Send a message
const response = await client.messages.send({
  channel: 'instagram',
  recipient: 'user_123',
  message: {
    type: 'text',
    content: 'Hello! How can I help you?'
  }
});

console.log('Message sent:', response.id);`}</code>
                </pre>
              </div>
              <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl opacity-20 blur-2xl"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Request Integration */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Don't see your tool?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            We're always adding new integrations. Let us know what you need and we'll prioritize it.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-medium hover:opacity-90 transition-all shadow-lg shadow-purple-500/25"
          >
            Request an Integration
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">DM</span>
                </div>
                <span className="font-semibold text-white">DM Automation</span>
              </div>
              <p className="text-sm leading-relaxed">
                The all-in-one platform for automating your social media conversations and growing your business.
              </p>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/features" className="hover:text-white transition-colors">Features</Link></li>
                <li><Link href="/pricing" className="hover:text-white transition-colors">Pricing</Link></li>
                <li><Link href="/integrations" className="hover:text-white transition-colors">Integrations</Link></li>
                <li><Link href="/faq" className="hover:text-white transition-colors">FAQ</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/about" className="hover:text-white transition-colors">About</Link></li>
                <li><Link href="/blog" className="hover:text-white transition-colors">Blog</Link></li>
                <li><Link href="/careers" className="hover:text-white transition-colors">Careers</Link></li>
                <li><Link href="/contact" className="hover:text-white transition-colors">Contact</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link></li>
                <li><Link href="/terms" className="hover:text-white transition-colors">Terms</Link></li>
                <li><Link href="/security" className="hover:text-white transition-colors">Security</Link></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 text-sm text-center">
            <p>© 2024 DM Automation. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </main>
  );
}
