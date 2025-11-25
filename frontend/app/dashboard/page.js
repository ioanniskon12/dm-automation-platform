"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import ProtectedRoute from '../../components/ProtectedRoute';
import NavigationSidebar from '../../components/NavigationSidebar';
import { useSidebar } from '../../contexts/SidebarContext';
import { useBrandChannel } from '../../contexts/BrandChannelContext';

function DashboardContent() {
  const { isCollapsed } = useSidebar();
  const { getCurrentBrand } = useBrandChannel();
  const currentBrand = getCurrentBrand();
  // Mock analytics data - in production, fetch from API
  const [analytics, setAnalytics] = useState({
    totalMessages: 1247,
    totalConversations: 342,
    activeAutomations: 8,
    responseRate: 94.5,
    avgResponseTime: '2m 15s',
    channelBreakdown: [
      { name: 'Instagram', count: 523, color: 'from-pink-500 to-purple-600' },
      { name: 'Facebook', count: 412, color: 'from-blue-600 to-blue-700' },
      { name: 'WhatsApp', count: 198, color: 'from-green-500 to-green-600' },
      { name: 'Telegram', count: 114, color: 'from-blue-400 to-blue-500' },
    ],
  });

  const quickActions = [
    {
      id: 'flows',
      title: 'Build Automation Flow',
      description: 'Create custom workflows for your channels',
      icon: '⚡',
      href: '/flows-list',
      gradient: 'from-blue-600 to-cyan-600',
    },
    {
      id: 'knowledge',
      title: 'Add Knowledge Base',
      description: 'Train your AI with FAQs and documents',
      icon: '📚',
      href: '/knowledge-base',
      gradient: 'from-purple-600 to-pink-600',
    },
    {
      id: 'templates',
      title: 'Choose Template',
      description: 'Start with ready-made automation templates',
      icon: '🎨',
      href: '/templates',
      gradient: 'from-orange-600 to-red-600',
    },
    {
      id: 'inbox',
      title: 'Go to Inbox',
      description: 'Manage all your conversations',
      icon: '💬',
      href: '/inbox',
      gradient: 'from-green-600 to-emerald-600',
    },
    {
      id: 'analytics',
      title: 'Channel Analytics',
      description: 'View detailed analytics per channel',
      icon: '📊',
      href: '/analytics',
      gradient: 'from-indigo-600 to-purple-600',
    },
    {
      id: 'global-automations',
      title: 'Global Automations',
      description: 'Set up one-time global automation rules',
      icon: '🌐',
      href: '/global-automations',
      gradient: 'from-teal-600 to-cyan-600',
    },
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <NavigationSidebar />

      {/* Main Content - with left padding for sidebar */}
      <main className={`px-6 py-8 min-h-screen max-w-7xl mx-auto transition-all duration-300 ${isCollapsed ? 'ml-20' : 'ml-64'}`}>
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-black dark:text-white mb-2">
            {currentBrand ? `${currentBrand.name} Dashboard` : 'Brand Dashboard'}
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Overview of all channels and automation performance
          </p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Messages</span>
              <span className="text-2xl">💬</span>
            </div>
            <div className="text-2xl font-bold text-black dark:text-white">{analytics.totalMessages.toLocaleString()}</div>
            <div className="text-xs text-green-600 dark:text-green-400 mt-1">+12% from last month</div>
          </div>

          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Conversations</span>
              <span className="text-2xl">👥</span>
            </div>
            <div className="text-2xl font-bold text-black dark:text-white">{analytics.totalConversations}</div>
            <div className="text-xs text-green-600 dark:text-green-400 mt-1">+8% from last month</div>
          </div>

          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Active Automations</span>
              <span className="text-2xl">⚡</span>
            </div>
            <div className="text-2xl font-bold text-black dark:text-white">{analytics.activeAutomations}</div>
            <div className="text-xs text-gray-500 dark:text-gray-500 mt-1">Across all channels</div>
          </div>

          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Response Rate</span>
              <span className="text-2xl">✅</span>
            </div>
            <div className="text-2xl font-bold text-black dark:text-white">{analytics.responseRate}%</div>
            <div className="text-xs text-green-600 dark:text-green-400 mt-1">+3% improvement</div>
          </div>

          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Avg Response Time</span>
              <span className="text-2xl">⏱️</span>
            </div>
            <div className="text-2xl font-bold text-black dark:text-white">{analytics.avgResponseTime}</div>
            <div className="text-xs text-green-600 dark:text-green-400 mt-1">-30s faster</div>
          </div>
        </div>

        {/* Channel Breakdown */}
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 mb-8">
          <h2 className="text-xl font-bold text-black dark:text-white mb-6">Messages by Channel</h2>
          <div className="space-y-4">
            {analytics.channelBreakdown.map((channel) => {
              const percentage = (channel.count / analytics.totalMessages) * 100;
              return (
                <div key={channel.name}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{channel.name}</span>
                    <span className="text-sm font-bold text-black dark:text-white">{channel.count} ({percentage.toFixed(1)}%)</span>
                  </div>
                  <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className={`h-full bg-gradient-to-r ${channel.color} rounded-full transition-all duration-500`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-black dark:text-white mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {quickActions.map((action) => (
              <Link
                key={action.id}
                href={action.href}
                className="group bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-transparent hover:shadow-xl transition-all rounded-xl p-6 relative overflow-hidden"
              >
                {/* Gradient overlay on hover */}
                <div className={`absolute inset-0 bg-gradient-to-br ${action.gradient} opacity-0 group-hover:opacity-5 transition-opacity`}></div>

                <div className="relative">
                  <div className="flex items-start justify-between mb-3">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${action.gradient} flex items-center justify-center text-2xl shadow-lg`}>
                      {action.icon}
                    </div>
                    <svg className="w-5 h-5 text-gray-400 group-hover:text-black dark:group-hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-bold text-black dark:text-white mb-2">{action.title}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{action.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6">
          <h2 className="text-xl font-bold text-black dark:text-white mb-4">Recent Activity</h2>
          <div className="space-y-4">
            <div className="flex items-start gap-4 pb-4 border-b border-gray-200 dark:border-gray-700">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-white font-bold">
                ✓
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-black dark:text-white">New automation activated</p>
                <p className="text-xs text-gray-600 dark:text-gray-400">Instagram Story Reply - 2 hours ago</p>
              </div>
            </div>
            <div className="flex items-start gap-4 pb-4 border-b border-gray-200 dark:border-gray-700">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center text-white font-bold">
                💬
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-black dark:text-white">152 messages processed</p>
                <p className="text-xs text-gray-600 dark:text-gray-400">Across all channels - 5 hours ago</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center text-white font-bold">
                📚
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-black dark:text-white">Knowledge base updated</p>
                <p className="text-xs text-gray-600 dark:text-gray-400">3 new FAQs added - 1 day ago</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function Home() {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  );
}
