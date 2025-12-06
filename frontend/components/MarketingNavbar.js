"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function MarketingNavbar() {
  const pathname = usePathname();

  const navLinks = [
    { href: '/features', label: 'Features' },
    { href: '/pricing', label: 'Pricing' },
    { href: '/supported-channels', label: 'Channels' },
    { href: '/faq', label: 'FAQ' },
  ];

  const isActive = (href) => pathname === href;

  return (
    <header className="sticky top-0 bg-white/80 backdrop-blur-md z-50 border-b border-gray-100">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 hover:opacity-70 transition-opacity group">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center font-mono text-xs font-bold text-white group-hover:animate-pulse-glow transition-all">
            DM
          </div>
          <span className="font-semibold text-lg">DM Automation</span>
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm transition-colors relative group ${
                isActive(link.href)
                  ? 'text-blue-600 font-medium'
                  : 'text-gray-600 hover:text-blue-600'
              }`}
            >
              {link.label}
              <span className={`absolute -bottom-1 left-0 h-0.5 bg-gradient-to-r from-blue-600 to-purple-600 transition-all duration-300 ${
                isActive(link.href) ? 'w-full' : 'w-0 group-hover:w-full'
              }`}></span>
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="text-sm text-gray-600 hover:text-black transition-colors px-4 py-2"
          >
            Sign In
          </Link>
          <Link
            href="/signup"
            className="relative px-5 py-2.5 text-sm bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:opacity-90 transition-all rounded-lg font-medium shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/30 hover:-translate-y-0.5 overflow-hidden group"
          >
            <span className="relative z-10">Start Free Trial</span>
            <div className="absolute inset-0 animate-shimmer"></div>
          </Link>
        </div>
      </div>
    </header>
  );
}
