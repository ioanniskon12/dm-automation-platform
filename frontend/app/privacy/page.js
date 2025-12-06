"use client";

import { useState } from 'react';
import Link from 'next/link';
import MarketingNavbar from '../../components/MarketingNavbar';
import MarketingFooter from '../../components/MarketingFooter';

export default function Privacy() {
  const [activeSection, setActiveSection] = useState(0);

  const sections = [
    {
      id: 'collect',
      title: 'Information We Collect',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      content: (
        <>
          <p className="text-gray-600 mb-4">We collect information that you provide directly to us, including:</p>
          <div className="grid md:grid-cols-2 gap-4">
            {[
              { title: 'Account Information', desc: 'Name, email, password, company details' },
              { title: 'Profile Data', desc: 'Avatar, preferences, settings' },
              { title: 'Conversation Data', desc: 'Messages managed through our platform' },
              { title: 'Payment Info', desc: 'Billing details processed via Stripe' },
              { title: 'Usage Data', desc: 'How you interact with our service' },
              { title: 'Device Info', desc: 'Browser, IP address, device type' },
            ].map((item, i) => (
              <div key={i} className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                <h4 className="font-semibold text-black mb-1">{item.title}</h4>
                <p className="text-sm text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </>
      )
    },
    {
      id: 'use',
      title: 'How We Use Your Data',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      content: (
        <>
          <p className="text-gray-600 mb-4">We use the information we collect to:</p>
          <ul className="space-y-3">
            {[
              'Provide, maintain, and improve our services',
              'Process transactions and send related information',
              'Send technical notices and support messages',
              'Respond to your comments and questions',
              'Monitor and analyze trends and usage',
              'Detect, investigate, and prevent fraudulent activity',
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-3">
                <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="text-gray-600">{item}</span>
              </li>
            ))}
          </ul>
        </>
      )
    },
    {
      id: 'sharing',
      title: 'Information Sharing',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      content: (
        <>
          <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6">
            <div className="flex items-center gap-2 text-green-700 font-semibold mb-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              We Never Sell Your Data
            </div>
            <p className="text-sm text-green-600">Your personal information is never sold to third parties for marketing or any other purposes.</p>
          </div>
          <p className="text-gray-600 mb-4">We may share information only with:</p>
          <ul className="space-y-3">
            {[
              { title: 'Service Providers', desc: 'Companies that help us operate (hosting, payments)' },
              { title: 'Legal Requirements', desc: 'When required by law or legal process' },
              { title: 'With Your Consent', desc: 'When you explicitly agree to sharing' },
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-blue-600 font-bold text-sm">{i + 1}</span>
                </div>
                <div>
                  <h4 className="font-semibold text-black">{item.title}</h4>
                  <p className="text-sm text-gray-600">{item.desc}</p>
                </div>
              </li>
            ))}
          </ul>
        </>
      )
    },
    {
      id: 'security',
      title: 'Data Security',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
      ),
      content: (
        <>
          <p className="text-gray-600 mb-6">We implement industry-standard security measures to protect your information:</p>
          <div className="grid md:grid-cols-2 gap-4">
            {[
              { icon: '🔐', title: 'AES-256 Encryption', desc: 'Data encrypted at rest' },
              { icon: '🔒', title: 'TLS 1.3', desc: 'Secure data in transit' },
              { icon: '☁️', title: 'AWS Infrastructure', desc: 'Enterprise-grade hosting' },
              { icon: '🛡️', title: 'SOC 2 Compliant', desc: 'Regular security audits' },
            ].map((item, i) => (
              <div key={i} className="bg-gradient-to-br from-gray-50 to-gray-100 p-4 rounded-xl border border-gray-200">
                <div className="text-2xl mb-2">{item.icon}</div>
                <h4 className="font-semibold text-black">{item.title}</h4>
                <p className="text-sm text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </>
      )
    },
    {
      id: 'rights',
      title: 'Your Rights',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      content: (
        <>
          <p className="text-gray-600 mb-6">You have the following rights regarding your personal information:</p>
          <div className="space-y-3">
            {[
              { title: 'Access', desc: 'Request a copy of your personal data', color: 'blue' },
              { title: 'Correction', desc: 'Update or correct inaccurate information', color: 'green' },
              { title: 'Deletion', desc: 'Request deletion of your data', color: 'red' },
              { title: 'Portability', desc: 'Export your data in a readable format', color: 'purple' },
              { title: 'Objection', desc: 'Object to certain types of processing', color: 'orange' },
            ].map((item, i) => (
              <div key={i} className={`flex items-center gap-4 p-4 rounded-xl bg-${item.color}-50 border border-${item.color}-100`}>
                <div className={`w-10 h-10 bg-gradient-to-br from-${item.color}-500 to-${item.color}-600 rounded-xl flex items-center justify-center`}>
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-semibold text-black">{item.title}</h4>
                  <p className="text-sm text-gray-600">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </>
      )
    },
    {
      id: 'cookies',
      title: 'Cookies',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      content: (
        <>
          <p className="text-gray-600 mb-6">We use cookies and similar technologies to enhance your experience:</p>
          <div className="space-y-4">
            {[
              { type: 'Essential', desc: 'Required for the platform to function properly', required: true },
              { type: 'Analytics', desc: 'Help us understand how you use our service', required: false },
              { type: 'Preferences', desc: 'Remember your settings and choices', required: false },
            ].map((item, i) => (
              <div key={i} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-semibold text-black">{item.type}</h4>
                    {item.required && (
                      <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">Required</span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600">{item.desc}</p>
                </div>
                <div className={`w-12 h-6 rounded-full ${item.required ? 'bg-blue-500' : 'bg-gray-300'} relative`}>
                  <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 ${item.required ? 'right-0.5' : 'left-0.5'} shadow`}></div>
                </div>
              </div>
            ))}
          </div>
        </>
      )
    },
    {
      id: 'retention',
      title: 'Data Retention',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      ),
      content: (
        <>
          <p className="text-gray-600 mb-6">We retain your data only as long as necessary:</p>
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6 border border-blue-100">
            <div className="grid md:grid-cols-3 gap-6 text-center">
              <div>
                <div className="text-3xl font-bold text-blue-600 mb-1">Active</div>
                <p className="text-sm text-gray-600">While your account is active</p>
              </div>
              <div>
                <div className="text-3xl font-bold text-purple-600 mb-1">30 Days</div>
                <p className="text-sm text-gray-600">After account closure</p>
              </div>
              <div>
                <div className="text-3xl font-bold text-pink-600 mb-1">On Request</div>
                <p className="text-sm text-gray-600">Immediate deletion available</p>
              </div>
            </div>
          </div>
        </>
      )
    },
    {
      id: 'contact',
      title: 'Contact Us',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
      content: (
        <>
          <p className="text-gray-600 mb-6">Have questions about your privacy? We're here to help.</p>
          <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
            <h4 className="text-xl font-semibold mb-4">Get in Touch</h4>
            <div className="space-y-3">
              <a href="mailto:privacy@dmautomation.com" className="flex items-center gap-3 text-white/90 hover:text-white transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                privacy@dmautomation.com
              </a>
              <p className="text-white/70 text-sm">We respond to all inquiries within 48 hours</p>
            </div>
          </div>
        </>
      )
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      <MarketingNavbar />

      {/* Hero Section */}
      <section className="py-16 bg-gradient-to-b from-blue-50 to-white relative overflow-hidden">
        <div className="absolute top-0 left-0 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 -translate-x-1/2"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 translate-x-1/2"></div>

        <div className="max-w-4xl mx-auto px-6 text-center relative">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <span className="inline-block px-4 py-1.5 text-sm font-semibold text-blue-600 bg-blue-100 rounded-full mb-4">
            Legal
          </span>
          <h1 className="text-4xl md:text-5xl font-bold text-black mb-4">
            Privacy Policy
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-4">
            Your privacy is important to us. This policy explains how we collect, use, and protect your information.
          </p>
          <p className="text-sm text-gray-500">
            Last updated: December 1, 2025
          </p>
        </div>
      </section>

      {/* Content with Tabs */}
      <section className="py-12">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar Navigation */}
            <div className="lg:w-72 flex-shrink-0">
              <div className="lg:sticky lg:top-24">
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">Sections</h3>
                <nav className="space-y-1">
                  {sections.map((section, index) => (
                    <button
                      key={section.id}
                      onClick={() => setActiveSection(index)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all ${
                        activeSection === index
                          ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <span className={activeSection === index ? 'text-white' : 'text-gray-400'}>
                        {section.icon}
                      </span>
                      <span className="font-medium text-sm">{section.title}</span>
                    </button>
                  ))}
                </nav>
              </div>
            </div>

            {/* Main Content */}
            <div className="flex-1">
              <div className="bg-white rounded-2xl border border-gray-200 p-8">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center text-white">
                    {sections[activeSection].icon}
                  </div>
                  <h2 className="text-2xl font-bold text-black">{sections[activeSection].title}</h2>
                </div>
                <div className="prose prose-gray max-w-none">
                  {sections[activeSection].content}
                </div>
              </div>

              {/* Navigation Buttons */}
              <div className="flex justify-between mt-6">
                <button
                  onClick={() => setActiveSection(Math.max(0, activeSection - 1))}
                  disabled={activeSection === 0}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                    activeSection === 0
                      ? 'text-gray-400 cursor-not-allowed'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  Previous
                </button>
                <button
                  onClick={() => setActiveSection(Math.min(sections.length - 1, activeSection + 1))}
                  disabled={activeSection === sections.length - 1}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                    activeSection === sections.length - 1
                      ? 'text-gray-400 cursor-not-allowed'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  Next
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Related Links */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-4xl mx-auto px-6">
          <h3 className="text-xl font-bold text-black text-center mb-8">Related Legal Documents</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <Link href="/terms" className="flex items-center gap-4 p-4 bg-white rounded-xl border border-gray-200 hover:border-purple-300 hover:shadow-lg transition-all group">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div>
                <h4 className="font-semibold text-black group-hover:text-purple-600 transition-colors">Terms of Service</h4>
                <p className="text-sm text-gray-600">Read our terms and conditions</p>
              </div>
            </Link>
            <Link href="/security" className="flex items-center gap-4 p-4 bg-white rounded-xl border border-gray-200 hover:border-green-300 hover:shadow-lg transition-all group">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <div>
                <h4 className="font-semibold text-black group-hover:text-green-600 transition-colors">Security</h4>
                <p className="text-sm text-gray-600">Learn about our security measures</p>
              </div>
            </Link>
          </div>
        </div>
      </section>

      <MarketingFooter />
    </div>
  );
}
