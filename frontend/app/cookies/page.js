"use client";

import { useState } from 'react';
import Link from 'next/link';
import MarketingNavbar from '../../components/MarketingNavbar';
import MarketingFooter from '../../components/MarketingFooter';
import { CookieDeclaration, renewCookieConsent } from '../../components/CookieConsent';

export default function CookiesPolicy() {
  const [activeSection, setActiveSection] = useState(0);

  const sections = [
    {
      id: 'overview',
      title: 'What Are Cookies',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      content: (
        <div className="space-y-6">
          <p className="text-gray-600 leading-relaxed">
            Cookies are small text files that are stored on your device (computer, tablet, or mobile) when you visit a website. They are widely used to make websites work more efficiently and provide information to the website owners.
          </p>
          <div className="bg-amber-50 p-6 rounded-xl border border-amber-100">
            <h4 className="font-semibold text-black mb-3">How Cookies Work</h4>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start gap-3">
                <span className="w-6 h-6 bg-amber-200 text-amber-800 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">1</span>
                When you visit our website, your browser sends a request to our server
              </li>
              <li className="flex items-start gap-3">
                <span className="w-6 h-6 bg-amber-200 text-amber-800 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">2</span>
                Our server responds with the webpage content and may set cookies
              </li>
              <li className="flex items-start gap-3">
                <span className="w-6 h-6 bg-amber-200 text-amber-800 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">3</span>
                Your browser stores these cookies on your device
              </li>
              <li className="flex items-start gap-3">
                <span className="w-6 h-6 bg-amber-200 text-amber-800 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">4</span>
                On subsequent visits, your browser sends these cookies back to our server
              </li>
            </ul>
          </div>
          <p className="text-gray-600 leading-relaxed">
            This allows us to remember your preferences, understand how you use our website, and provide a better experience tailored to your needs.
          </p>
        </div>
      )
    },
    {
      id: 'necessary',
      title: 'Strictly Necessary',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
      content: (
        <div className="space-y-6">
          <p className="text-gray-600 leading-relaxed">
            These cookies are essential for the website to function properly. They enable core functionality such as security, network management, and account access. You cannot opt out of these cookies as the website would not function correctly without them.
          </p>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-50">
                  <th className="text-left p-3 border border-gray-200 font-semibold text-gray-900">Cookie Name</th>
                  <th className="text-left p-3 border border-gray-200 font-semibold text-gray-900">Purpose</th>
                  <th className="text-left p-3 border border-gray-200 font-semibold text-gray-900">Duration</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="p-3 border border-gray-200 font-mono text-sm">session_id</td>
                  <td className="p-3 border border-gray-200 text-sm text-gray-600">Maintains your session while using the platform</td>
                  <td className="p-3 border border-gray-200 text-sm text-gray-600">Session</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="p-3 border border-gray-200 font-mono text-sm">csrf_token</td>
                  <td className="p-3 border border-gray-200 text-sm text-gray-600">Protects against cross-site request forgery attacks</td>
                  <td className="p-3 border border-gray-200 text-sm text-gray-600">Session</td>
                </tr>
                <tr>
                  <td className="p-3 border border-gray-200 font-mono text-sm">auth_token</td>
                  <td className="p-3 border border-gray-200 text-sm text-gray-600">Keeps you logged in securely</td>
                  <td className="p-3 border border-gray-200 text-sm text-gray-600">30 days</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="p-3 border border-gray-200 font-mono text-sm">cookie-consent</td>
                  <td className="p-3 border border-gray-200 text-sm text-gray-600">Stores your cookie preferences</td>
                  <td className="p-3 border border-gray-200 text-sm text-gray-600">1 year</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )
    },
    {
      id: 'analytics',
      title: 'Analytics Cookies',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      content: (
        <div className="space-y-6">
          <p className="text-gray-600 leading-relaxed">
            These cookies help us understand how visitors interact with our website by collecting and reporting information anonymously. This helps us improve our website and services.
          </p>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-white p-5 rounded-xl border border-gray-200">
              <h4 className="font-semibold text-black mb-3">What We Track</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-amber-500 rounded-full"></span>
                  Pages you visit and time spent
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-amber-500 rounded-full"></span>
                  How you navigate through the site
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-amber-500 rounded-full"></span>
                  Error messages encountered
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-amber-500 rounded-full"></span>
                  Device and browser information
                </li>
              </ul>
            </div>
            <div className="bg-white p-5 rounded-xl border border-gray-200">
              <h4 className="font-semibold text-black mb-3">Providers</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-amber-500 rounded-full"></span>
                  Google Analytics
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-amber-500 rounded-full"></span>
                  Mixpanel
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-amber-500 rounded-full"></span>
                  Hotjar
                </li>
              </ul>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-50">
                  <th className="text-left p-3 border border-gray-200 font-semibold text-gray-900">Cookie Name</th>
                  <th className="text-left p-3 border border-gray-200 font-semibold text-gray-900">Provider</th>
                  <th className="text-left p-3 border border-gray-200 font-semibold text-gray-900">Duration</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="p-3 border border-gray-200 font-mono text-sm">_ga</td>
                  <td className="p-3 border border-gray-200 text-sm text-gray-600">Google Analytics</td>
                  <td className="p-3 border border-gray-200 text-sm text-gray-600">2 years</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="p-3 border border-gray-200 font-mono text-sm">_gid</td>
                  <td className="p-3 border border-gray-200 text-sm text-gray-600">Google Analytics</td>
                  <td className="p-3 border border-gray-200 text-sm text-gray-600">24 hours</td>
                </tr>
                <tr>
                  <td className="p-3 border border-gray-200 font-mono text-sm">mp_*</td>
                  <td className="p-3 border border-gray-200 text-sm text-gray-600">Mixpanel</td>
                  <td className="p-3 border border-gray-200 text-sm text-gray-600">1 year</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="p-3 border border-gray-200 font-mono text-sm">_hjid</td>
                  <td className="p-3 border border-gray-200 text-sm text-gray-600">Hotjar</td>
                  <td className="p-3 border border-gray-200 text-sm text-gray-600">1 year</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )
    },
    {
      id: 'marketing',
      title: 'Marketing Cookies',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
        </svg>
      ),
      content: (
        <div className="space-y-6">
          <p className="text-gray-600 leading-relaxed">
            These cookies are used to track visitors across websites. The intention is to display ads that are relevant and engaging for the individual user. They help measure the effectiveness of advertising campaigns.
          </p>
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 p-6 rounded-xl border border-amber-100">
            <h4 className="font-semibold text-black mb-4">How Marketing Cookies Work</h4>
            <ul className="space-y-3">
              {[
                'Track your browsing activity across websites',
                'Build a profile of your interests and preferences',
                'Show you relevant advertisements on other websites',
                'Measure the effectiveness of our advertising campaigns',
                'Limit the number of times you see an advertisement'
              ].map((item, index) => (
                <li key={index} className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-700">{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-50">
                  <th className="text-left p-3 border border-gray-200 font-semibold text-gray-900">Cookie Name</th>
                  <th className="text-left p-3 border border-gray-200 font-semibold text-gray-900">Provider</th>
                  <th className="text-left p-3 border border-gray-200 font-semibold text-gray-900">Duration</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="p-3 border border-gray-200 font-mono text-sm">_fbp</td>
                  <td className="p-3 border border-gray-200 text-sm text-gray-600">Facebook Pixel</td>
                  <td className="p-3 border border-gray-200 text-sm text-gray-600">3 months</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="p-3 border border-gray-200 font-mono text-sm">_gcl_au</td>
                  <td className="p-3 border border-gray-200 text-sm text-gray-600">Google Ads</td>
                  <td className="p-3 border border-gray-200 text-sm text-gray-600">3 months</td>
                </tr>
                <tr>
                  <td className="p-3 border border-gray-200 font-mono text-sm">li_sugr</td>
                  <td className="p-3 border border-gray-200 text-sm text-gray-600">LinkedIn</td>
                  <td className="p-3 border border-gray-200 text-sm text-gray-600">3 months</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )
    },
    {
      id: 'preferences',
      title: 'Preference Cookies',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
        </svg>
      ),
      content: (
        <div className="space-y-6">
          <p className="text-gray-600 leading-relaxed">
            These cookies allow the website to remember choices you make (such as your username, language, or the region you are in) and provide enhanced, more personalized features.
          </p>
          <div className="grid md:grid-cols-2 gap-4">
            {[
              { title: 'Language Settings', desc: 'Remember your preferred language' },
              { title: 'Theme Preferences', desc: 'Dark mode or light mode selection' },
              { title: 'Region Settings', desc: 'Your timezone and location preferences' },
              { title: 'Display Options', desc: 'Table views, sidebar settings, etc.' }
            ].map((item, index) => (
              <div key={index} className="bg-amber-50 p-4 rounded-xl border border-amber-100">
                <h4 className="font-semibold text-black mb-1">{item.title}</h4>
                <p className="text-sm text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-50">
                  <th className="text-left p-3 border border-gray-200 font-semibold text-gray-900">Cookie Name</th>
                  <th className="text-left p-3 border border-gray-200 font-semibold text-gray-900">Purpose</th>
                  <th className="text-left p-3 border border-gray-200 font-semibold text-gray-900">Duration</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="p-3 border border-gray-200 font-mono text-sm">locale</td>
                  <td className="p-3 border border-gray-200 text-sm text-gray-600">Stores your language preference</td>
                  <td className="p-3 border border-gray-200 text-sm text-gray-600">1 year</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="p-3 border border-gray-200 font-mono text-sm">theme</td>
                  <td className="p-3 border border-gray-200 text-sm text-gray-600">Stores dark/light mode preference</td>
                  <td className="p-3 border border-gray-200 text-sm text-gray-600">1 year</td>
                </tr>
                <tr>
                  <td className="p-3 border border-gray-200 font-mono text-sm">sidebar_collapsed</td>
                  <td className="p-3 border border-gray-200 text-sm text-gray-600">Remembers sidebar state</td>
                  <td className="p-3 border border-gray-200 text-sm text-gray-600">1 year</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )
    },
    {
      id: 'manage',
      title: 'Managing Cookies',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      content: (
        <div className="space-y-6">
          <p className="text-gray-600 leading-relaxed">
            You have several options for managing cookies. You can update your preferences on our website or configure your browser settings directly.
          </p>
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 p-6 rounded-xl border border-amber-100">
            <h4 className="font-semibold text-black mb-4">Update Your Preferences</h4>
            <p className="text-gray-600 mb-4">
              Click the button below to open our cookie preference center and update your choices at any time.
            </p>
            <button
              onClick={() => renewCookieConsent()}
              className="px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold rounded-xl hover:opacity-90 transition-all"
            >
              Manage Cookie Settings
            </button>
          </div>
          <div className="space-y-4">
            <h4 className="font-semibold text-black">Browser Settings</h4>
            <p className="text-gray-600 text-sm">
              You can also control cookies through your browser settings. Here are links to instructions for common browsers:
            </p>
            <div className="grid md:grid-cols-2 gap-3">
              {[
                { name: 'Google Chrome', url: 'https://support.google.com/chrome/answer/95647' },
                { name: 'Mozilla Firefox', url: 'https://support.mozilla.org/en-US/kb/cookies-information-websites-store-on-your-computer' },
                { name: 'Safari', url: 'https://support.apple.com/guide/safari/manage-cookies-sfri11471/mac' },
                { name: 'Microsoft Edge', url: 'https://support.microsoft.com/en-us/microsoft-edge/delete-cookies-in-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09' }
              ].map((browser, index) => (
                <a
                  key={index}
                  href={browser.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 p-3 bg-white rounded-lg border border-gray-200 hover:border-amber-300 hover:shadow-md transition-all text-sm font-medium text-gray-700"
                >
                  {browser.name}
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              ))}
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'declaration',
      title: 'Cookie Declaration',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      content: (
        <div className="space-y-6">
          <p className="text-gray-600 leading-relaxed">
            Below is an automatically generated list of all cookies used on our website, categorized by their purpose. This declaration is updated automatically by our cookie consent management platform.
          </p>
          <CookieDeclaration />
        </div>
      )
    },
    {
      id: 'updates',
      title: 'Policy Updates',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      content: (
        <div className="space-y-6">
          <p className="text-gray-600 leading-relaxed">
            We may update this Cookie Policy from time to time to reflect changes in our practices or for other operational, legal, or regulatory reasons.
          </p>
          <div className="bg-gray-50 p-5 rounded-xl">
            <h4 className="font-semibold text-black mb-3">What Happens When We Update</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-amber-500 rounded-full"></span>
                We will post the updated policy on this page
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-amber-500 rounded-full"></span>
                The &quot;Last Updated&quot; date will be revised
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-amber-500 rounded-full"></span>
                For significant changes, we may notify you via email
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-amber-500 rounded-full"></span>
                Continued use of the site means you accept the changes
              </li>
            </ul>
          </div>
          <p className="text-gray-600 leading-relaxed">
            We encourage you to review this Cookie Policy periodically to stay informed about our use of cookies and related technologies.
          </p>
        </div>
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
        <div className="space-y-6">
          <p className="text-gray-600 leading-relaxed">
            If you have any questions about our use of cookies or this Cookie Policy, please don&apos;t hesitate to contact us.
          </p>
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 p-6 rounded-xl border border-amber-100">
            <h4 className="font-semibold text-black mb-4">Get In Touch</h4>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <a href="mailto:privacy@dmautomation.com" className="text-amber-600 hover:text-amber-700 font-medium">
                    privacy@dmautomation.com
                  </a>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Address</p>
                  <p className="text-gray-700">123 Privacy Street, Tech City, TC 12345</p>
                </div>
              </div>
            </div>
            <div className="mt-6">
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold rounded-xl hover:opacity-90 transition-all"
              >
                Contact Support
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      )
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <MarketingNavbar />

      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-amber-500 via-orange-500 to-yellow-500 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-72 h-72 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-yellow-400/20 rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-4xl mx-auto px-6 text-center relative">
          <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
            </svg>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Cookie Policy
          </h1>
          <p className="text-xl text-amber-100 max-w-2xl mx-auto">
            Learn about how we use cookies and similar technologies to improve your experience on our platform.
          </p>
          <p className="text-sm text-amber-200 mt-6">Last updated: December 2024</p>
        </div>
      </section>

      {/* Main Content with Tabs */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar Navigation */}
            <div className="lg:w-72 flex-shrink-0">
              <div className="bg-gray-50 rounded-2xl p-4 sticky top-24">
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4 px-3">
                  Cookie Topics
                </h3>
                <nav className="space-y-1">
                  {sections.map((section, index) => (
                    <button
                      key={section.id}
                      onClick={() => setActiveSection(index)}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all ${
                        activeSection === index
                          ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg'
                          : 'text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      <span className={activeSection === index ? 'text-white' : 'text-gray-400'}>
                        {section.icon}
                      </span>
                      <span className="text-sm font-medium">{section.title}</span>
                    </button>
                  ))}
                </nav>
              </div>
            </div>

            {/* Content Area */}
            <div className="flex-1">
              <div className="bg-white rounded-2xl border border-gray-200 p-8">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl flex items-center justify-center text-white">
                    {sections[activeSection].icon}
                  </div>
                  <h2 className="text-2xl font-bold text-black">
                    {sections[activeSection].title}
                  </h2>
                </div>

                {sections[activeSection].content}

                {/* Navigation Buttons */}
                <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
                  <button
                    onClick={() => setActiveSection(Math.max(0, activeSection - 1))}
                    disabled={activeSection === 0}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                      activeSection === 0
                        ? 'text-gray-300 cursor-not-allowed'
                        : 'text-gray-600 hover:text-amber-600 hover:bg-amber-50'
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
                        ? 'text-gray-300 cursor-not-allowed'
                        : 'text-gray-600 hover:text-amber-600 hover:bg-amber-50'
                    }`}
                  >
                    Next
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Related Links */}
              <div className="mt-8 bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl p-6">
                <h3 className="font-semibold text-black mb-4">Related Legal Documents</h3>
                <div className="flex flex-wrap gap-3">
                  <Link
                    href="/privacy"
                    className="px-4 py-2 bg-white rounded-lg text-sm font-medium text-gray-700 hover:text-amber-600 hover:shadow-md transition-all"
                  >
                    Privacy Policy
                  </Link>
                  <Link
                    href="/terms"
                    className="px-4 py-2 bg-white rounded-lg text-sm font-medium text-gray-700 hover:text-amber-600 hover:shadow-md transition-all"
                  >
                    Terms of Service
                  </Link>
                  <Link
                    href="/security"
                    className="px-4 py-2 bg-white rounded-lg text-sm font-medium text-gray-700 hover:text-amber-600 hover:shadow-md transition-all"
                  >
                    Security
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <MarketingFooter />
    </div>
  );
}
