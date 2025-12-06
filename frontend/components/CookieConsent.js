"use client";

import { useState, useEffect } from 'react';
import Script from 'next/script';
import Link from 'next/link';

// To use Cookiebot:
// 1. Sign up at https://www.cookiebot.com/
// 2. Add your domain to get your Cookiebot ID (CBID)
// 3. Add NEXT_PUBLIC_COOKIEBOT_ID to your .env.local file

const COOKIEBOT_ID = process.env.NEXT_PUBLIC_COOKIEBOT_ID;

export default function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [preferences, setPreferences] = useState({
    necessary: true,
    analytics: false,
    marketing: false,
    preferences: false
  });

  useEffect(() => {
    // If Cookiebot ID is configured, let Cookiebot handle everything
    if (COOKIEBOT_ID) {
      // Cookiebot callback handlers
      window.addEventListener('CookiebotOnAccept', function() {
        if (typeof window.Cookiebot !== 'undefined') {
          if (window.Cookiebot.consent.statistics) {
            console.log('Statistics cookies accepted');
          }
          if (window.Cookiebot.consent.marketing) {
            console.log('Marketing cookies accepted');
          }
        }
      });
      return;
    }

    // Fallback: Use custom banner if no Cookiebot ID
    const consent = localStorage.getItem('cookie-consent');
    if (!consent) {
      const timer = setTimeout(() => setShowBanner(true), 500);
      return () => clearTimeout(timer);
    } else {
      try {
        const savedPrefs = JSON.parse(consent);
        setPreferences(savedPrefs);
      } catch (e) {
        setShowBanner(true);
      }
    }
  }, []);

  const handleAcceptAll = () => {
    const allAccepted = {
      necessary: true,
      analytics: true,
      marketing: true,
      preferences: true
    };
    localStorage.setItem('cookie-consent', JSON.stringify(allAccepted));
    setPreferences(allAccepted);
    setShowBanner(false);
    setShowSettings(false);
  };

  const handleRejectAll = () => {
    const onlyNecessary = {
      necessary: true,
      analytics: false,
      marketing: false,
      preferences: false
    };
    localStorage.setItem('cookie-consent', JSON.stringify(onlyNecessary));
    setPreferences(onlyNecessary);
    setShowBanner(false);
    setShowSettings(false);
  };

  const handleSavePreferences = () => {
    localStorage.setItem('cookie-consent', JSON.stringify(preferences));
    setShowBanner(false);
    setShowSettings(false);
  };

  const togglePreference = (key) => {
    if (key === 'necessary') return;
    setPreferences(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  // If Cookiebot is configured, use their script
  if (COOKIEBOT_ID) {
    return (
      <Script
        id="Cookiebot"
        src="https://consent.cookiebot.com/uc.js"
        data-cbid={COOKIEBOT_ID}
        data-blockingmode="auto"
        strategy="beforeInteractive"
      />
    );
  }

  // Fallback custom banner
  if (!showBanner) return null;

  const cookieTypes = [
    {
      key: 'necessary',
      title: 'Strictly Necessary',
      description: 'These cookies are essential for the website to function properly. They cannot be disabled.',
      required: true
    },
    {
      key: 'analytics',
      title: 'Analytics Cookies',
      description: 'Help us understand how visitors interact with our website by collecting anonymous information.',
      required: false
    },
    {
      key: 'marketing',
      title: 'Marketing Cookies',
      description: 'Used to track visitors across websites to display relevant advertisements.',
      required: false
    },
    {
      key: 'preferences',
      title: 'Preference Cookies',
      description: 'Allow the website to remember choices you make and provide enhanced features.',
      required: false
    }
  ];

  return (
    <>
      {/* Main Cookie Banner */}
      <div className={`fixed bottom-0 left-0 right-0 z-50 transition-transform duration-500 ${showSettings ? 'translate-y-full' : 'translate-y-0'}`}>
        <div className="bg-white border-t border-gray-200 shadow-2xl">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-6">
            <div className="flex flex-col lg:flex-row items-start lg:items-center gap-4 lg:gap-6">
              {/* Cookie Icon */}
              <div className="hidden sm:flex w-12 h-12 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10c0-.46-.04-.91-.1-1.35a4.007 4.007 0 01-3.06-2.04c-.59-.39-1.01-.97-1.18-1.63-.17-.66-.09-1.36.22-1.98.31-.62.82-1.11 1.44-1.4-.2-.49-.44-.96-.71-1.4a3.98 3.98 0 01-4.24-1.3c-.71-.68-1.09-1.61-1.05-2.54.03-.72.29-1.42.73-1.99-.52-.27-1.06-.48-1.63-.63a4.017 4.017 0 01-3.71 2.23c-.15 0-.3-.01-.45-.03C2.06 10.72 2 11.35 2 12c0 5.52 4.48 10 10 10s10-4.48 10-10c0-.65-.06-1.28-.17-1.9-.15.02-.3.03-.45.03A4.007 4.007 0 0112 2zM7 13c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm3-4c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm4 0c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm0 4c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1z"/>
                </svg>
              </div>

              {/* Text Content */}
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-1">We value your privacy</h3>
                <p className="text-sm text-gray-600">
                  We use cookies to enhance your browsing experience, serve personalized content, and analyze our traffic.
                  By clicking &quot;Accept All&quot;, you consent to our use of cookies.
                  <Link href="/cookies" className="text-blue-600 hover:text-blue-800 ml-1">
                    Read our Cookie Policy
                  </Link>
                </p>
              </div>

              {/* Buttons */}
              <div className="flex flex-col sm:flex-row gap-2 w-full lg:w-auto">
                <button
                  onClick={() => setShowSettings(true)}
                  className="px-4 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors order-3 sm:order-1"
                >
                  Customize
                </button>
                <button
                  onClick={handleRejectAll}
                  className="px-4 py-2.5 text-sm font-medium text-gray-700 border border-gray-300 hover:bg-gray-50 rounded-lg transition-colors order-2"
                >
                  Reject All
                </button>
                <button
                  onClick={handleAcceptAll}
                  className="px-6 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 rounded-lg transition-all shadow-md order-1 sm:order-3"
                >
                  Accept All
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Cookie Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
            onClick={() => setShowSettings(false)}
          />

          {/* Modal */}
          <div className="flex min-h-full items-center justify-center p-4">
            <div className="relative bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
              {/* Header */}
              <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
                    </svg>
                  </div>
                  <h2 className="text-xl font-semibold text-gray-900">Cookie Preferences</h2>
                </div>
                <button
                  onClick={() => setShowSettings(false)}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Content */}
              <div className="px-6 py-4 overflow-y-auto max-h-[60vh]">
                <p className="text-sm text-gray-600 mb-6">
                  We use different types of cookies to optimize your experience on our website.
                  Click on the categories below to learn more and change your preferences.
                  Note that blocking some types of cookies may impact your experience on our website.
                </p>

                <div className="space-y-4">
                  {cookieTypes.map((cookie) => (
                    <div
                      key={cookie.key}
                      className={`p-4 rounded-xl border transition-all ${
                        preferences[cookie.key]
                          ? 'border-blue-200 bg-blue-50/50'
                          : 'border-gray-200 bg-gray-50'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-medium text-gray-900">{cookie.title}</h3>
                            {cookie.required && (
                              <span className="px-2 py-0.5 text-xs font-medium bg-gray-200 text-gray-600 rounded-full">
                                Required
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-600">{cookie.description}</p>
                        </div>
                        <button
                          onClick={() => togglePreference(cookie.key)}
                          disabled={cookie.required}
                          className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                            preferences[cookie.key]
                              ? 'bg-blue-600'
                              : 'bg-gray-300'
                          } ${cookie.required ? 'opacity-60 cursor-not-allowed' : ''}`}
                        >
                          <span
                            className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                              preferences[cookie.key] ? 'translate-x-5' : 'translate-x-0'
                            }`}
                          />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Footer */}
              <div className="sticky bottom-0 bg-white border-t border-gray-200 px-6 py-4 flex flex-col sm:flex-row gap-3 justify-end">
                <button
                  onClick={handleRejectAll}
                  className="px-4 py-2.5 text-sm font-medium text-gray-700 border border-gray-300 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  Reject All
                </button>
                <button
                  onClick={handleAcceptAll}
                  className="px-4 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                >
                  Accept All
                </button>
                <button
                  onClick={handleSavePreferences}
                  className="px-6 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 rounded-lg transition-all shadow-md"
                >
                  Save Preferences
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// Helper component to show Cookiebot's cookie declaration on policy pages
export function CookieDeclaration() {
  const CBID = process.env.NEXT_PUBLIC_COOKIEBOT_ID;

  if (!CBID) {
    return (
      <div className="p-6 bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl border border-amber-200">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center flex-shrink-0">
            <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <h4 className="font-semibold text-amber-900 mb-1">Cookie Declaration</h4>
            <p className="text-sm text-amber-700">
              The automatic cookie declaration will appear here once Cookiebot is configured.
              For now, please refer to the cookie categories described above.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <Script
        id="CookieDeclaration"
        src={`https://consent.cookiebot.com/${CBID}/cd.js`}
        strategy="afterInteractive"
      />
      <div id="CookieDeclaration" />
    </>
  );
}

// Helper function to manually show cookie consent dialog
export function showCookieConsent() {
  if (typeof window !== 'undefined') {
    if (typeof window.Cookiebot !== 'undefined') {
      window.Cookiebot.show();
    } else {
      // Fallback: remove consent and reload
      localStorage.removeItem('cookie-consent');
      window.location.reload();
    }
  }
}

// Helper function to renew/withdraw consent
export function renewCookieConsent() {
  if (typeof window !== 'undefined') {
    if (typeof window.Cookiebot !== 'undefined') {
      window.Cookiebot.renew();
    } else {
      // Fallback: remove consent and reload
      localStorage.removeItem('cookie-consent');
      window.location.reload();
    }
  }
}
