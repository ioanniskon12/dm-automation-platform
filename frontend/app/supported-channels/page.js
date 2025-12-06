"use client";

import { useState } from 'react';
import Link from 'next/link';

export default function IntegrationsPage() {
  const [activeChannel, setActiveChannel] = useState('all');

  const channels = [
    {
      id: 'instagram',
      name: 'Instagram',
      description: 'Automate Instagram DMs, respond to story mentions, comments, and engage with your audience automatically.',
      color: 'from-pink-500 to-purple-600',
      bgColor: 'bg-gradient-to-br from-pink-500 to-purple-600',
      icon: (
        <svg className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
        </svg>
      ),
      triggers: [
        { name: 'Direct Message', description: 'Auto-respond to DMs with keywords or AI', icon: '💬' },
        { name: 'Comment Automation', description: 'Engage with commenters on your posts', icon: '💭' },
        { name: 'Story Reply', description: 'Respond when someone replies to your story', icon: '📖' },
        { name: 'Post/Reel Share', description: 'Trigger when content is shared via DM', icon: '🔄' },
        { name: 'Instagram Ads', description: 'Capture leads from "Send Message" CTAs', icon: '📢' },
        { name: 'Ref URL', description: 'Track traffic from bio links and campaigns', icon: '🔗' },
        { name: 'Live Comments', description: 'Engage with viewers during live broadcasts', icon: '🎥' }
      ],
      capabilities: [
        { name: 'Text Messages', supported: true },
        { name: 'Images', supported: true, note: 'Up to 8MB' },
        { name: 'Videos', supported: true, note: 'Up to 25MB, 15 sec limit' },
        { name: 'Audio', supported: true },
        { name: 'Documents', supported: false }
      ],
      stats: [
        { value: '2B+', label: 'Monthly Users' },
        { value: '200M+', label: 'Business Accounts' },
        { value: '90%', label: 'Follow Brands' }
      ]
    },
    {
      id: 'messenger',
      name: 'Facebook Messenger',
      description: 'Connect with customers on Messenger with automated responses, chatbots, and seamless Facebook integration.',
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-gradient-to-br from-blue-500 to-blue-600',
      icon: (
        <svg className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2C6.36 2 2 6.13 2 11.7c0 2.91 1.19 5.44 3.14 7.17.16.15.26.37.26.61l.03 1.9c.01.52.57.85 1.03.62l2.12-.94c.16-.07.34-.09.51-.05.93.25 1.91.39 2.91.39 5.64 0 10-4.13 10-9.7C22 6.13 17.64 2 12 2zm5.89 7.58l-2.89 4.58c-.46.73-1.44.91-2.12.39l-2.3-1.72a.6.6 0 00-.72 0l-3.1 2.35c-.41.31-.96-.17-.69-.62l2.89-4.58c.46-.73 1.44-.91 2.12-.39l2.3 1.72a.6.6 0 00.72 0l3.1-2.35c.41-.31.96.17.69.62z"/>
        </svg>
      ),
      triggers: [
        { name: 'Messenger Message', description: 'Auto-respond with keywords or AI intent', icon: '💌' },
        { name: 'Facebook Ads', description: 'Capture leads from ad click-to-message', icon: '📢' },
        { name: 'Facebook Comments', description: 'Send DMs when users comment on posts', icon: '💬' },
        { name: 'Ref URL (m.me)', description: 'Track traffic sources with m.me links', icon: '🔗' },
        { name: 'QR Code', description: 'Engage users from scanned QR codes', icon: '📱' },
        { name: 'Facebook Shop', description: 'Handle product inquiries and orders', icon: '🛒' }
      ],
      capabilities: [
        { name: 'Text Messages', supported: true, note: 'Up to 2000 chars' },
        { name: 'Images', supported: true, note: 'Up to 25MB' },
        { name: 'Videos', supported: true, note: 'Up to 25MB' },
        { name: 'Audio', supported: true },
        { name: 'Documents', supported: true, note: 'PDF, Word, Excel' }
      ],
      stats: [
        { value: '1.3B+', label: 'Monthly Users' },
        { value: '40M+', label: 'Active Businesses' },
        { value: '20B+', label: 'Messages/Month' }
      ]
    },
    {
      id: 'whatsapp',
      name: 'WhatsApp Business',
      description: 'Scale your WhatsApp customer support with AI-powered automation and the official Business API.',
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-gradient-to-br from-green-500 to-green-600',
      icon: (
        <svg className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="currentColor">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
        </svg>
      ),
      triggers: [
        { name: 'WhatsApp Message', description: 'Auto-respond with keywords or AI', icon: '💬' },
        { name: 'Ref URL', description: 'Track traffic from wa.me links', icon: '🔗' }
      ],
      capabilities: [
        { name: 'Text Messages', supported: true, note: 'Up to 4096 chars' },
        { name: 'Images', supported: true, note: 'Up to 5MB' },
        { name: 'Videos', supported: true, note: 'Up to 16MB' },
        { name: 'Audio', supported: true },
        { name: 'Documents', supported: true, note: 'Up to 100MB' }
      ],
      stats: [
        { value: '2B+', label: 'Monthly Users' },
        { value: '50M+', label: 'Business Accounts' },
        { value: '100B+', label: 'Messages/Day' }
      ],
      note: 'Requires template messages for initial contact'
    },
    {
      id: 'telegram',
      name: 'Telegram',
      description: 'Build powerful Telegram bots for customer support, notifications, and automated engagement.',
      color: 'from-blue-400 to-blue-500',
      bgColor: 'bg-gradient-to-br from-blue-400 to-blue-500',
      icon: (
        <svg className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="currentColor">
          <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
        </svg>
      ),
      triggers: [
        { name: 'Telegram Message', description: 'Auto-respond with keywords or AI', icon: '✈️' },
        { name: 'Ref URL', description: 'Track traffic with t.me/bot?start= links', icon: '🔗' }
      ],
      capabilities: [
        { name: 'Text Messages', supported: true, note: 'Up to 4096 chars' },
        { name: 'Images', supported: true, note: 'Up to 10MB' },
        { name: 'Videos', supported: true, note: 'Up to 50MB' },
        { name: 'Audio', supported: true },
        { name: 'Documents', supported: true, note: 'Up to 50MB (2GB with local server)' }
      ],
      stats: [
        { value: '700M+', label: 'Monthly Users' },
        { value: '55M+', label: 'Daily Users' },
        { value: 'No Ads', label: 'Platform' }
      ]
    }
  ];

  const filteredChannels = activeChannel === 'all'
    ? channels
    : channels.filter(c => c.id === activeChannel);

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
            <Link href="/supported-channels" className="text-sm text-blue-600 font-medium">Channels</Link>
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
              4 Messaging Channels
            </span>
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              One platform for
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> all your DMs</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              Connect Instagram, Facebook Messenger, WhatsApp, and Telegram.
              Automate conversations across all channels from a single unified inbox.
            </p>

            {/* Channel Pills */}
            <div className="flex flex-wrap justify-center gap-3 mb-12">
              <button
                onClick={() => setActiveChannel('all')}
                className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all ${
                  activeChannel === 'all'
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                    : 'bg-white text-gray-600 border border-gray-200 hover:border-purple-300'
                }`}
              >
                All Channels
              </button>
              {channels.map((channel) => (
                <button
                  key={channel.id}
                  onClick={() => setActiveChannel(channel.id)}
                  className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all flex items-center gap-2 ${
                    activeChannel === channel.id
                      ? `bg-gradient-to-r ${channel.color} text-white shadow-lg`
                      : 'bg-white text-gray-600 border border-gray-200 hover:border-purple-300'
                  }`}
                >
                  <span className={`w-5 h-5 rounded-full bg-gradient-to-r ${channel.color} flex items-center justify-center`}>
                    <span className="text-white text-xs">{channel.name.charAt(0)}</span>
                  </span>
                  {channel.name}
                </button>
              ))}
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            {[
              { value: '4', label: 'Messaging Channels' },
              { value: '17+', label: 'Trigger Types' },
              { value: '99.9%', label: 'Uptime SLA' },
              { value: '<100ms', label: 'Response Time' }
            ].map((stat, index) => (
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

      {/* Channels Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="space-y-16">
            {filteredChannels.map((channel, index) => (
              <div
                key={channel.id}
                id={channel.id}
                className={`scroll-mt-24 ${index % 2 === 1 ? 'lg:flex-row-reverse' : ''}`}
              >
                <div className="bg-white rounded-3xl border border-gray-200 overflow-hidden hover:shadow-xl transition-shadow">
                  {/* Channel Header */}
                  <div className={`p-8 bg-gradient-to-r ${channel.color} text-white`}>
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                        {channel.icon}
                      </div>
                      <div>
                        <h2 className="text-3xl font-bold">{channel.name}</h2>
                        <p className="text-white/80">{channel.description}</p>
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-white/20">
                      {channel.stats.map((stat, i) => (
                        <div key={i} className="text-center">
                          <div className="text-2xl font-bold">{stat.value}</div>
                          <div className="text-sm text-white/70">{stat.label}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Channel Content */}
                  <div className="p-8">
                    <div className="grid md:grid-cols-2 gap-8">
                      {/* Triggers */}
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                          <svg className="w-5 h-5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                          </svg>
                          Available Triggers
                        </h3>
                        <div className="space-y-3">
                          {channel.triggers.map((trigger, i) => (
                            <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors">
                              <span className="text-2xl">{trigger.icon}</span>
                              <div>
                                <div className="font-medium text-gray-900">{trigger.name}</div>
                                <div className="text-sm text-gray-600">{trigger.description}</div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Capabilities */}
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                          <svg className="w-5 h-5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          Capabilities
                        </h3>
                        <div className="space-y-3">
                          {channel.capabilities.map((cap, i) => (
                            <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-gray-50">
                              <div className="flex items-center gap-3">
                                {cap.supported ? (
                                  <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                  </svg>
                                ) : (
                                  <svg className="w-5 h-5 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                  </svg>
                                )}
                                <span className={cap.supported ? 'text-gray-900' : 'text-gray-400'}>{cap.name}</span>
                              </div>
                              {cap.note && (
                                <span className="text-xs text-gray-500 bg-gray-200 px-2 py-1 rounded-full">{cap.note}</span>
                              )}
                            </div>
                          ))}
                        </div>

                        {channel.note && (
                          <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-xl">
                            <div className="flex items-start gap-2 text-amber-800 text-sm">
                              <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                              </svg>
                              {channel.note}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* CTA */}
                    <div className="mt-8 pt-6 border-t border-gray-100 flex items-center justify-between">
                      <div className="text-gray-600">
                        Ready to automate your {channel.name} messages?
                      </div>
                      <Link
                        href="/signup"
                        className={`px-6 py-3 bg-gradient-to-r ${channel.color} text-white rounded-xl font-medium hover:opacity-90 transition-all shadow-lg`}
                      >
                        Connect {channel.name}
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Unified Inbox Section */}
      <section className="py-20 bg-gradient-to-br from-gray-900 to-black">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <span className="inline-block px-4 py-1.5 text-sm font-semibold text-purple-400 bg-purple-900/30 rounded-full mb-6">
              Unified Inbox
            </span>
            <h2 className="text-4xl font-bold text-white mb-4">
              All your conversations in one place
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              No more switching between apps. Manage Instagram, Messenger, WhatsApp, and Telegram
              from a single, powerful dashboard.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: '📥',
                title: 'Single Inbox',
                description: 'View and respond to all messages from all channels in one unified inbox.'
              },
              {
                icon: '🤖',
                title: 'Cross-Channel Automation',
                description: 'Create flows that work across all connected platforms with consistent logic.'
              },
              {
                icon: '📊',
                title: 'Unified Analytics',
                description: 'Track performance metrics across all channels with combined reporting.'
              },
              {
                icon: '👥',
                title: 'Team Collaboration',
                description: 'Assign conversations to team members regardless of the source channel.'
              },
              {
                icon: '🏷️',
                title: 'Contact Unification',
                description: 'Recognize the same customer across different platforms automatically.'
              },
              {
                icon: '⚡',
                title: 'Quick Actions',
                description: 'Use templates and canned responses that work on any channel.'
              }
            ].map((feature, index) => (
              <div key={index} className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:border-purple-500/50 transition-colors">
                <span className="text-4xl mb-4 block">{feature.icon}</span>
                <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              href="/features#unified-inbox"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white text-gray-900 rounded-xl font-medium hover:bg-gray-100 transition-all"
            >
              Learn More About Unified Inbox
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Ready to automate your messaging?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Start your 14-day free trial and connect all your messaging channels in minutes.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/signup"
              className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-medium hover:opacity-90 transition-all shadow-lg shadow-purple-500/25"
            >
              Start Free Trial
            </Link>
            <Link
              href="/contact"
              className="px-8 py-4 border border-gray-300 text-gray-700 rounded-xl font-medium hover:border-purple-500 hover:text-purple-600 transition-all"
            >
              Contact Sales
            </Link>
          </div>
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
                <li><Link href="/supported-channels" className="hover:text-white transition-colors">Channels</Link></li>
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
