"use client";

import { useState } from 'react';
import Link from 'next/link';
import MarketingNavbar from '../../components/MarketingNavbar';
import MarketingFooter from '../../components/MarketingFooter';

export default function Terms() {
  const [activeSection, setActiveSection] = useState(0);

  const sections = [
    {
      id: 'agreement',
      title: 'Agreement to Terms',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      content: (
        <>
          <div className="bg-purple-50 border border-purple-200 rounded-xl p-4 mb-6">
            <p className="text-purple-700">By accessing or using DM Automation, you agree to be bound by these Terms and Conditions.</p>
          </div>
          <p className="text-gray-600 mb-4">
            If you disagree with any part of the terms, you may not access the service. These terms apply to all visitors, users, and others who access or use the Service.
          </p>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-gray-50 p-4 rounded-xl">
              <h4 className="font-semibold text-black mb-2">Age Requirement</h4>
              <p className="text-sm text-gray-600">You must be at least 16 years old to use our service.</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-xl">
              <h4 className="font-semibold text-black mb-2">Legal Authority</h4>
              <p className="text-sm text-gray-600">You must have legal authority to enter into these Terms.</p>
            </div>
          </div>
        </>
      )
    },
    {
      id: 'service',
      title: 'Service Description',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
      content: (
        <>
          <p className="text-gray-600 mb-6">DM Automation provides a platform for automating social media conversations:</p>
          <div className="grid md:grid-cols-2 gap-4">
            {[
              { icon: '💬', title: 'Unified Inbox', desc: 'Manage all conversations in one place' },
              { icon: '🤖', title: 'AI Responses', desc: 'Intelligent automated replies' },
              { icon: '🔧', title: 'Flow Builder', desc: 'Visual automation workflows' },
              { icon: '📚', title: 'Knowledge Base', desc: 'Train your AI assistant' },
              { icon: '📊', title: 'Analytics', desc: 'Track performance metrics' },
              { icon: '👥', title: 'Team Tools', desc: 'Collaborate with your team' },
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-3 p-4 bg-purple-50 rounded-xl border border-purple-100">
                <span className="text-2xl">{item.icon}</span>
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
      id: 'account',
      title: 'Account Terms',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      ),
      content: (
        <>
          <p className="text-gray-600 mb-6">When you create an account with us, you agree to:</p>
          <ul className="space-y-3">
            {[
              { title: 'Accurate Information', desc: 'Provide accurate, complete, and current information' },
              { title: 'Keep Updated', desc: 'Maintain and promptly update your account information' },
              { title: 'Secure Credentials', desc: 'Safeguard your password and account access' },
              { title: 'Report Issues', desc: 'Notify us immediately of any unauthorized access' },
              { title: 'No Sharing', desc: 'Do not share your account credentials with others' },
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-3">
                <div className="w-6 h-6 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <span className="font-medium text-black">{item.title}:</span>
                  <span className="text-gray-600"> {item.desc}</span>
                </div>
              </li>
            ))}
          </ul>
        </>
      )
    },
    {
      id: 'payment',
      title: 'Payment Terms',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
        </svg>
      ),
      content: (
        <>
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-100 mb-6">
            <div className="grid md:grid-cols-3 gap-6 text-center">
              <div>
                <div className="text-3xl font-bold text-purple-600 mb-1">Monthly</div>
                <p className="text-sm text-gray-600">Billed monthly</p>
              </div>
              <div>
                <div className="text-3xl font-bold text-pink-600 mb-1">Annual</div>
                <p className="text-sm text-gray-600">Save with yearly billing</p>
              </div>
              <div>
                <div className="text-3xl font-bold text-purple-600 mb-1">30-Day</div>
                <p className="text-sm text-gray-600">Money-back guarantee</p>
              </div>
            </div>
          </div>
          <div className="space-y-4">
            {[
              { title: 'Auto-Renewal', desc: 'Subscriptions automatically renew unless cancelled' },
              { title: 'Secure Payments', desc: 'All payments processed securely via Stripe' },
              { title: 'Cancellation', desc: 'Cancel anytime through your account settings' },
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-purple-600 font-bold text-sm">{i + 1}</span>
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
      id: 'acceptable',
      title: 'Acceptable Use',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      ),
      content: (
        <>
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
            <div className="flex items-center gap-2 text-red-700 font-semibold mb-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
              </svg>
              Prohibited Activities
            </div>
            <p className="text-sm text-red-600">The following activities are strictly prohibited on our platform.</p>
          </div>
          <div className="grid md:grid-cols-2 gap-3">
            {[
              'Sending spam or unsolicited messages',
              'Harassing or abusing other users',
              'Impersonating any person or entity',
              'Violating laws or regulations',
              'Interfering with the service',
              'Attempting unauthorized access',
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                <svg className="w-5 h-5 text-red-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                <span className="text-sm text-gray-600">{item}</span>
              </div>
            ))}
          </div>
        </>
      )
    },
    {
      id: 'ip',
      title: 'Intellectual Property',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
      content: (
        <>
          <p className="text-gray-600 mb-6">Understanding ownership and rights:</p>
          <div className="space-y-4">
            <div className="bg-purple-50 p-5 rounded-xl border border-purple-100">
              <h4 className="font-semibold text-black mb-2">Our Property</h4>
              <p className="text-sm text-gray-600">The service and its original content, features, and functionality are owned by DM Automation and protected by copyright, trademark, and other laws.</p>
            </div>
            <div className="bg-blue-50 p-5 rounded-xl border border-blue-100">
              <h4 className="font-semibold text-black mb-2">Your Content</h4>
              <p className="text-sm text-gray-600">You retain ownership of content you submit. By submitting content, you grant us a license to use it to provide our services.</p>
            </div>
            <div className="bg-green-50 p-5 rounded-xl border border-green-100">
              <h4 className="font-semibold text-black mb-2">Feedback</h4>
              <p className="text-sm text-gray-600">If you provide feedback or suggestions, we may use this information without obligation to you.</p>
            </div>
          </div>
        </>
      )
    },
    {
      id: 'termination',
      title: 'Termination',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
        </svg>
      ),
      content: (
        <>
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div className="bg-gray-50 p-5 rounded-xl">
              <h4 className="font-semibold text-black mb-3">Termination by You</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Cancel anytime via account settings</li>
                <li>• Contact support for assistance</li>
                <li>• Access continues until billing period ends</li>
              </ul>
            </div>
            <div className="bg-gray-50 p-5 rounded-xl">
              <h4 className="font-semibold text-black mb-3">Termination by Us</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Violation of these Terms</li>
                <li>• Required by law</li>
                <li>• Service discontinuation</li>
              </ul>
            </div>
          </div>
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
            <div className="flex items-center gap-2 text-yellow-700 font-semibold mb-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Effect of Termination
            </div>
            <p className="text-sm text-yellow-600">Upon termination, your right to use the service immediately ceases. We may delete your data within 30 days.</p>
          </div>
        </>
      )
    },
    {
      id: 'liability',
      title: 'Limitation of Liability',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
        </svg>
      ),
      content: (
        <>
          <div className="bg-gray-100 rounded-xl p-6 mb-6">
            <p className="text-gray-700 text-sm leading-relaxed">
              TO THE MAXIMUM EXTENT PERMITTED BY LAW, DM AUTOMATION SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL OR PUNITIVE DAMAGES.
            </p>
          </div>
          <p className="text-gray-600 mb-4">Our total liability is limited to the amount you paid us in the 12 months preceding any claim.</p>
          <div className="grid md:grid-cols-3 gap-4">
            {[
              { title: 'No Indirect Damages', desc: 'Lost profits or revenue' },
              { title: 'No Data Liability', desc: 'Loss of data or content' },
              { title: 'No Business Losses', desc: 'Lost opportunities' },
            ].map((item, i) => (
              <div key={i} className="text-center p-4 bg-gray-50 rounded-xl">
                <h4 className="font-semibold text-black text-sm mb-1">{item.title}</h4>
                <p className="text-xs text-gray-600">{item.desc}</p>
              </div>
            ))}
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
          <p className="text-gray-600 mb-6">Have questions about our terms? We're here to help.</p>
          <div className="bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl p-8 text-white">
            <h4 className="text-xl font-semibold mb-4">Get in Touch</h4>
            <div className="space-y-3">
              <a href="mailto:legal@dmautomation.com" className="flex items-center gap-3 text-white/90 hover:text-white transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                legal@dmautomation.com
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
      <section className="py-16 bg-gradient-to-b from-purple-50 to-white relative overflow-hidden">
        <div className="absolute top-0 left-0 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 -translate-x-1/2"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 translate-x-1/2"></div>

        <div className="max-w-4xl mx-auto px-6 text-center relative">
          <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <span className="inline-block px-4 py-1.5 text-sm font-semibold text-purple-600 bg-purple-100 rounded-full mb-4">
            Legal
          </span>
          <h1 className="text-4xl md:text-5xl font-bold text-black mb-4">
            Terms of Service
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-4">
            Please read these terms carefully before using DM Automation.
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
                          ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
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
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center text-white">
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
            <Link href="/privacy" className="flex items-center gap-4 p-4 bg-white rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all group">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <div>
                <h4 className="font-semibold text-black group-hover:text-blue-600 transition-colors">Privacy Policy</h4>
                <p className="text-sm text-gray-600">How we handle your data</p>
              </div>
            </Link>
            <Link href="/security" className="flex items-center gap-4 p-4 bg-white rounded-xl border border-gray-200 hover:border-green-300 hover:shadow-lg transition-all group">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <div>
                <h4 className="font-semibold text-black group-hover:text-green-600 transition-colors">Security</h4>
                <p className="text-sm text-gray-600">Our security measures</p>
              </div>
            </Link>
          </div>
        </div>
      </section>

      <MarketingFooter />
    </div>
  );
}
