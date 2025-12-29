"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useDarkMode } from '../contexts/DarkModeContext';
import { useBrandChannel } from '../contexts/BrandChannelContext';
import { useSidebar } from '../contexts/SidebarContext';
import BrandChannelSwitcher from './BrandChannelSwitcher';
import OnboardingModal from './OnboardingModal';

// Custom hook to detect mobile viewport
function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return isMobile;
}

export default function NavigationSidebar() {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const { isDarkMode, toggleDarkMode, mounted } = useDarkMode();
  const { getCurrentBrand, getCurrentChannel } = useBrandChannel();
  const { isCollapsed, toggleSidebar } = useSidebar();
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isMobile = useIsMobile();

  // Cookie helper functions
  const getCookie = (name) => {
    if (typeof document === 'undefined') return null;
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
  };

  const setCookie = (name, value, days = 365) => {
    if (typeof document === 'undefined') return;
    const expires = new Date();
    expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
    document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/`;
  };

  // Check for first-time user on mount
  useEffect(() => {
    const hasSeenOnboarding = getCookie('dm_automation_onboarding_seen');
    if (!hasSeenOnboarding && user) {
      // Small delay to ensure page is fully loaded
      setTimeout(() => {
        setShowOnboarding(true);
      }, 500);
    }
  }, [user]);

  const handleCloseOnboarding = () => {
    setShowOnboarding(false);
    setCookie('dm_automation_onboarding_seen', 'true');
  };

  const handleOpenOnboarding = () => {
    setShowOnboarding(true);
  };

  // Get current brand and channel to make links context-aware
  const currentBrand = getCurrentBrand();
  const currentChannel = getCurrentChannel();

  // Build context query string for navigation links
  const contextQuery = currentBrand && currentChannel
    ? `?brand=${currentBrand.id}&channel=${currentChannel.type}`
    : '';

  const navLinks = [
    {
      href: '/dashboard',
      label: 'Dashboard',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      )
    },
    {
      href: `/flows-list`,
      label: 'Automation Flows',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      )
    },
    {
      href: `/global-automations`,
      label: 'Global Automations',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
        </svg>
      )
    },
    {
      href: currentBrand ? `/brands/${currentBrand.id}/knowledge-base` : `/knowledge-base`,
      label: 'Knowledge Base',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      )
    },
    {
      href: `/templates${contextQuery}`,
      label: 'Templates',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
        </svg>
      )
    },
    {
      href: `/campaigns${contextQuery}`,
      label: 'Campaigns',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
        </svg>
      )
    },
    {
      href: `/inbox${contextQuery}`,
      label: 'Inbox',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
        </svg>
      )
    },
    {
      href: `/contacts${contextQuery}`,
      label: 'Contacts',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      )
    },
    {
      href: `/analytics${contextQuery}`,
      label: 'Analytics',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      )
    },
  ];

  // Close mobile menu when navigating
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  return (
    <>
      {/* Mobile Header Bar */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-14 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 z-50 flex items-center justify-between px-4 safe-area-top">
        <button
          onClick={() => setMobileMenuOpen(true)}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg touch-target"
          aria-label="Open menu"
        >
          <svg className="w-6 h-6 text-gray-700 dark:text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="w-7 h-7 border-2 border-black dark:border-white rounded-lg flex items-center justify-center font-mono text-xs font-bold text-black dark:text-white">
            DM
          </div>
          <span className="text-sm font-bold text-black dark:text-white">DM Automation</span>
        </Link>
        <div className="w-10"></div>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/50 z-[60] animate-fade-in"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar - Desktop: fixed sidebar, Mobile: slide-in drawer */}
      <aside className={`
        fixed left-0 top-0 h-screen bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 transition-all duration-300 flex flex-col
        ${isMobile
          ? `z-[70] w-72 transform ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`
          : `z-50 ${isCollapsed ? 'w-20' : 'w-64'}`
        }
      `}>
      {/* Sidebar Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
        {/* Mobile close button */}
        {isMobile && (
          <button
            onClick={() => setMobileMenuOpen(false)}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg mr-2 touch-target"
            aria-label="Close menu"
          >
            <svg className="w-5 h-5 text-gray-600 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
        {(!isCollapsed || isMobile) && (
          <Link href="/dashboard" className="flex items-center gap-2 hover:opacity-70 transition-opacity flex-1">
            <div className="w-8 h-8 border-2 border-black dark:border-white rounded-lg flex items-center justify-center font-mono text-xs font-bold text-black dark:text-white">
              DM
            </div>
            <span className="text-sm font-bold text-black dark:text-white">DM Automation</span>
          </Link>
        )}
        {isCollapsed && !isMobile && (
          <Link href="/dashboard" className="flex items-center justify-center w-full">
            <div className="w-8 h-8 border-2 border-black dark:border-white rounded-lg flex items-center justify-center font-mono text-xs font-bold text-black dark:text-white">
              DM
            </div>
          </Link>
        )}
        {!isMobile && (
          <button
            onClick={toggleSidebar}
            className={`p-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors ${isCollapsed ? 'absolute right-2' : ''}`}
            aria-label="Toggle sidebar"
          >
            <svg
              className={`w-5 h-5 text-gray-600 dark:text-gray-400 transition-transform ${isCollapsed ? 'rotate-180' : ''}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
            </svg>
          </button>
        )}
      </div>

      {/* Brand/Channel Context Switcher */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        {(!isCollapsed || isMobile) ? (
          <BrandChannelSwitcher />
        ) : (
          <div className="flex justify-center">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-sm shadow-sm">
              B
            </div>
          </div>
        )}
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 overflow-y-auto p-3">
        <div className="space-y-1">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-3 px-3 py-3 md:py-2.5 rounded-lg transition-all text-sm font-medium touch-target ${
                  isActive
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 active:bg-gray-200 dark:active:bg-gray-700'
                } ${isCollapsed && !isMobile ? 'justify-center' : ''}`}
                title={isCollapsed && !isMobile ? link.label : ''}
              >
                <span className={isActive ? 'text-white' : 'text-gray-500 dark:text-gray-400'}>
                  {link.icon}
                </span>
                {(!isCollapsed || isMobile) && (
                  <div className="flex-1 flex items-center justify-between">
                    <span>{link.label}</span>
                    {link.badge && (
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                        isActive
                          ? 'bg-white/20 text-white'
                          : 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                      }`}>
                        {link.badge}
                      </span>
                    )}
                  </div>
                )}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Sidebar Footer */}
      <div className="p-3 border-t border-gray-200 dark:border-gray-700 safe-area-bottom">
        {/* Admin Panel - Only visible to admin emails */}
        {(user?.email === 'gianniskon12@gmail.com' || user?.email === 'sotiris040197@gmail.com') && (
          <Link
            href="/admin"
            className={`flex items-center gap-3 w-full px-3 py-3 md:py-2.5 hover:bg-purple-50 dark:hover:bg-purple-900/20 active:bg-purple-100 rounded-lg transition-colors text-sm font-medium text-purple-600 dark:text-purple-400 mb-2 touch-target ${isCollapsed && !isMobile ? 'justify-center' : ''}`}
            title={isCollapsed && !isMobile ? 'Admin Panel' : ''}
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            {(!isCollapsed || isMobile) && <span>Admin Panel</span>}
          </Link>
        )}

        {/* Platform Guide */}
        <button
          onClick={handleOpenOnboarding}
          className={`flex items-center gap-3 w-full px-3 py-3 md:py-2.5 hover:bg-gray-100 dark:hover:bg-gray-800 active:bg-gray-200 rounded-lg transition-colors text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 touch-target ${isCollapsed && !isMobile ? 'justify-center' : ''}`}
          title={isCollapsed && !isMobile ? 'Platform Guide' : ''}
        >
          <svg className="w-5 h-5 text-gray-500 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
          {(!isCollapsed || isMobile) && <span>Platform Guide</span>}
        </button>

        {/* Account Settings */}
        {currentBrand && (
          <Link
            href={`/settings?brand=${currentBrand.id}`}
            className={`flex items-center gap-3 w-full px-3 py-3 md:py-2.5 hover:bg-gray-100 dark:hover:bg-gray-800 active:bg-gray-200 rounded-lg transition-colors text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 touch-target ${isCollapsed && !isMobile ? 'justify-center' : ''}`}
            title={isCollapsed && !isMobile ? 'Account Settings' : ''}
          >
            <svg className="w-5 h-5 text-gray-500 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            {(!isCollapsed || isMobile) && <span>Account Settings</span>}
          </Link>
        )}

        {/* Dark Mode Toggle */}
        {mounted && (
          <button
            onClick={toggleDarkMode}
            className={`flex items-center gap-3 w-full px-3 py-3 md:py-2.5 hover:bg-gray-100 dark:hover:bg-gray-800 active:bg-gray-200 rounded-lg transition-colors text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 touch-target ${isCollapsed && !isMobile ? 'justify-center' : ''}`}
            title={isCollapsed && !isMobile ? (isDarkMode ? 'Light Mode' : 'Dark Mode') : ''}
          >
            {isDarkMode ? (
              <svg className="w-5 h-5 text-gray-500 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            ) : (
              <svg className="w-5 h-5 text-gray-500 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            )}
            {(!isCollapsed || isMobile) && <span>{isDarkMode ? 'Light Mode' : 'Dark Mode'}</span>}
          </button>
        )}

        {/* Logout */}
        <button
          onClick={logout}
          className={`flex items-center gap-3 w-full px-3 py-3 md:py-2.5 hover:bg-red-50 dark:hover:bg-red-900/20 active:bg-red-100 rounded-lg transition-colors text-sm font-medium text-red-600 dark:text-red-400 touch-target ${isCollapsed && !isMobile ? 'justify-center' : ''}`}
          title={isCollapsed && !isMobile ? 'Logout' : ''}
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          {(!isCollapsed || isMobile) && <span>Logout</span>}
        </button>
      </div>

    </aside>

      {/* Onboarding Modal - rendered outside sidebar so it covers full screen */}
      <OnboardingModal isOpen={showOnboarding} onClose={handleCloseOnboarding} />
    </>
  );
}
