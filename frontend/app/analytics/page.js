"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import axios from 'axios';
import NavigationSidebar from '../../components/NavigationSidebar';
import ProtectedRoute from '../../components/ProtectedRoute';
import { useBrandChannel } from '../../contexts/BrandChannelContext';
import { useSidebar } from '../../contexts/SidebarContext';
import api from '../../utils/api';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002';

export default function Analytics() {
  const { isCollapsed } = useSidebar();
  const { selectedBrand, selectedChannel, getCurrentBrand, getCurrentChannel } = useBrandChannel();
  const [timeRange, setTimeRange] = useState('7d'); // 24h, 7d, 30d, all
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, [timeRange, selectedBrand, selectedChannel]); // Re-fetch when context changes

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      // Use API utility which automatically includes brand/channel context
      const url = `/api/analytics?timeRange=${timeRange}`;
      const response = await api.get(url, true); // requireContext = true
      const data = await response.json();
      if (data.success) {
        setAnalytics(data.analytics);
      }
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  // Mock data for demo
  const mockAnalytics = {
    overview: {
      totalMessages: 1247,
      automatedMessages: 892,
      manualMessages: 355,
      avgResponseTime: '2.3 min',
      automationRate: 71.5,
      satisfactionScore: 4.6,
    },
    channels: [
      { name: 'Instagram', messages: 567, automated: 425, color: 'from-pink-500 to-purple-600' },
      { name: 'Messenger', messages: 389, automated: 256, color: 'from-blue-500 to-blue-600' },
      { name: 'WhatsApp', messages: 201, automated: 152, color: 'from-green-500 to-green-600' },
      { name: 'Telegram', messages: 90, automated: 59, color: 'from-blue-400 to-cyan-500' },
    ],
    topFlows: [
      { name: 'FAQ Automation', executions: 234, successRate: 94.2 },
      { name: 'Lead Qualification', executions: 156, successRate: 87.8 },
      { name: 'Appointment Booking', executions: 89, successRate: 91.0 },
      { name: 'Product Recommendations', executions: 67, successRate: 85.1 },
    ],
    hourlyActivity: [
      { hour: '00:00', messages: 12 },
      { hour: '03:00', messages: 8 },
      { hour: '06:00', messages: 15 },
      { hour: '09:00', messages: 45 },
      { hour: '12:00', messages: 78 },
      { hour: '15:00', messages: 92 },
      { hour: '18:00', messages: 67 },
      { hour: '21:00', messages: 34 },
    ],
  };

  const currentBrand = getCurrentBrand();
  const currentChannel = getCurrentChannel();

  // Filter data based on whether we're viewing a specific channel or brand-wide
  let data = analytics || mockAnalytics;
  const isChannelSpecific = currentBrand && currentChannel;

  if (isChannelSpecific && !analytics) {
    // When viewing specific channel, filter mock data to only show that channel
    data = {
      ...mockAnalytics,
      overview: {
        ...mockAnalytics.overview,
        totalMessages: 567,  // Instagram specific
        automatedMessages: 425,
        manualMessages: 142,
      },
      channels: mockAnalytics.channels.filter(ch =>
        ch.name.toLowerCase() === currentChannel.type.toLowerCase()
      ),
    };
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-white dark:bg-gray-900">
        <NavigationSidebar />

        {/* Context Banner */}
        {currentBrand && (
          <div className={`bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/10 dark:to-purple-900/10 border-b border-blue-200 dark:border-blue-800 px-4 py-3 ${isCollapsed ? 'md:ml-20' : 'md:ml-64'}`}>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-1">
              <div className="flex items-center gap-2 md:gap-3">
                <div className="text-xs text-gray-600 dark:text-gray-400 hidden md:block">
                  Analytics for:
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-blue-700 dark:text-blue-300">
                    {currentBrand.name}
                  </span>
                  {currentChannel && (
                    <>
                      <span className="text-gray-500 dark:text-gray-400">→</span>
                      <span className="text-sm font-semibold text-purple-700 dark:text-purple-300 capitalize">
                        {currentChannel.type}
                      </span>
                    </>
                  )}
                </div>
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400 hidden md:block">
                {isChannelSpecific ? 'Data scoped to this channel' : 'Data scoped to all channels in this brand'}
              </div>
            </div>
          </div>
        )}

      {/* Main Content - with left padding for sidebar */}
      <main className={`transition-all duration-300 ${isCollapsed ? 'md:ml-20' : 'md:ml-64'} px-4 md:px-6 py-6 md:py-12 pt-16 md:pt-12`}>
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 md:mb-8 gap-4">
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-black dark:text-white mb-1 md:mb-2">Analytics</h1>
            <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400">
              Track performance and optimize workflows
            </p>
          </div>

          {/* Time Range Selector */}
          <div className="flex gap-1 md:gap-2 overflow-x-auto scrollbar-hide">
            {[
              { value: '24h', label: '24h' },
              { value: '7d', label: '7d' },
              { value: '30d', label: '30d' },
              { value: 'all', label: 'All' },
            ].map((range) => (
              <button
                key={range.value}
                onClick={() => setTimeRange(range.value)}
                className={`px-3 py-1.5 border font-semibold text-xs transition-all rounded-lg whitespace-nowrap touch-target ${
                  timeRange === range.value
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white border-transparent shadow-md'
                    : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:border-blue-500 dark:hover:border-blue-500'
                }`}
              >
                {range.label}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-gray-400 dark:text-gray-500">Loading analytics...</div>
          </div>
        ) : (
          <>
            {/* Overview Cards - Top Row: Total Messages & Avg Response Time */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-6 mb-3 md:mb-6">
              <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4 md:p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-center justify-between mb-2 md:mb-4">
                  <h3 className="text-gray-600 dark:text-gray-400 font-semibold text-xs md:text-sm">Total Messages</h3>
                  <span className="text-xl md:text-2xl">💬</span>
                </div>
                <p className="text-2xl md:text-3xl font-bold text-black dark:text-white mb-1 md:mb-2">{data.overview.totalMessages.toLocaleString()}</p>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-green-600 dark:text-green-400 font-semibold">↑ 12%</span>
                  <span className="text-xs text-gray-500 dark:text-gray-500">vs last period</span>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4 md:p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-center justify-between mb-2 md:mb-4">
                  <h3 className="text-gray-600 dark:text-gray-400 font-semibold text-xs md:text-sm">Avg Response</h3>
                  <span className="text-xl md:text-2xl">⏱️</span>
                </div>
                <p className="text-2xl md:text-3xl font-bold text-black dark:text-white mb-1 md:mb-2">{data.overview.avgResponseTime}</p>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-green-600 dark:text-green-400 font-semibold">↓ 18%</span>
                  <span className="text-xs text-gray-500 dark:text-gray-500">faster</span>
                </div>
              </div>

              {/* Automation Rate - Full width on mobile, third column on desktop */}
              <div className="col-span-2 md:col-span-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4 md:p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-center justify-between mb-2 md:mb-4">
                  <h3 className="text-gray-600 dark:text-gray-400 font-semibold text-xs md:text-sm">Automation Rate</h3>
                  <span className="text-xl md:text-2xl">⚡</span>
                </div>
                <p className="text-2xl md:text-3xl font-bold text-black dark:text-white mb-1 md:mb-2">{data.overview.automationRate}%</p>
                <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden mt-2 md:mt-3">
                  <div
                    className="h-full bg-gradient-to-r from-blue-600 to-purple-600 rounded-full transition-all duration-500"
                    style={{ width: `${data.overview.automationRate}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Channels Performance - only show for brand-wide view */}
            {!isChannelSpecific && (
              <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4 md:p-6 mb-6 md:mb-8">
                <h2 className="text-base md:text-lg font-bold text-black dark:text-white mb-3 md:mb-4">Channel Performance</h2>
                <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-2 md:gap-4">
                  {data.channels.map((channel) => {
                    const automationRate = ((channel.automated / channel.messages) * 100).toFixed(1);
                    return (
                      <div key={channel.name} className="p-3 md:p-4 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl hover:border-blue-500 dark:hover:border-blue-500 transition-all hover:shadow-lg">
                        <div className="flex items-center justify-between mb-2 md:mb-4">
                          <h3 className="text-sm md:text-base font-bold text-black dark:text-white">{channel.name}</h3>
                        </div>
                        <div className="space-y-2 md:space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-gray-600 dark:text-gray-400 text-xs">Messages</span>
                            <span className="font-bold text-black dark:text-white text-xs md:text-sm">{channel.messages}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-gray-600 dark:text-gray-400 text-xs">Auto</span>
                            <span className="font-bold text-black dark:text-white text-xs md:text-sm">{channel.automated}</span>
                          </div>
                          <div>
                            <div className="flex items-center justify-between mb-1 md:mb-2">
                              <span className="text-gray-600 dark:text-gray-400 text-xs hidden md:inline">Automation Rate</span>
                              <span className="text-gray-600 dark:text-gray-400 text-xs md:hidden">Rate</span>
                              <span className="font-bold text-black dark:text-white text-xs md:text-sm">
                                {automationRate}%
                              </span>
                            </div>
                            <div className="w-full h-1.5 md:h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                              <div
                                className={`h-full bg-gradient-to-r ${channel.color} rounded-full transition-all duration-500`}
                                style={{ width: `${automationRate}%` }}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Top Performing Flows */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 md:gap-6 mb-6 md:mb-8">
              <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4 md:p-6 hover:shadow-lg transition-shadow">
                <h2 className="text-base md:text-lg font-bold text-black dark:text-white mb-3 md:mb-4">Top Performing Flows</h2>
                <div className="space-y-3 md:space-y-4">
                  {data.topFlows.map((flow, idx) => {
                    const gradients = [
                      'from-blue-600 to-cyan-600',
                      'from-purple-600 to-pink-600',
                      'from-orange-600 to-red-600',
                      'from-green-600 to-emerald-600',
                    ];
                    return (
                      <div key={flow.name} className="flex items-center gap-2 md:gap-3">
                        <div className={`w-7 h-7 md:w-8 md:h-8 rounded-lg bg-gradient-to-br ${gradients[idx]} flex items-center justify-center text-xs md:text-sm font-bold text-white shadow-md flex-shrink-0`}>
                          {idx + 1}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1 md:mb-2">
                            <span className="font-semibold text-black dark:text-white text-xs md:text-sm truncate mr-2">{flow.name}</span>
                            <span className="text-xs text-green-600 dark:text-green-400 font-semibold whitespace-nowrap">
                              {flow.successRate}%
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="flex-1 h-1.5 md:h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                              <div
                                className={`h-full bg-gradient-to-r ${gradients[idx]} rounded-full transition-all duration-500`}
                                style={{ width: `${flow.successRate}%` }}
                              />
                            </div>
                            <span className="text-xs text-gray-600 dark:text-gray-400 font-medium whitespace-nowrap">{flow.executions}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Hourly Activity */}
              <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4 md:p-6 hover:shadow-lg transition-shadow">
                <h2 className="text-base md:text-lg font-bold text-black dark:text-white mb-3 md:mb-4">Message Activity</h2>
                <div className="space-y-1.5 md:space-y-2">
                  {data.hourlyActivity.map((item) => {
                    const percentage = (item.messages / 92) * 100;
                    return (
                      <div key={item.hour} className="flex items-center gap-2 md:gap-3">
                        <span className="text-xs font-semibold text-gray-600 dark:text-gray-400 w-10 md:w-12">{item.hour}</span>
                        <div className="flex-1 h-5 md:h-6 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full transition-all duration-500"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                        <span className="text-xs font-semibold text-black dark:text-white w-8 md:w-10 text-right">
                          {item.messages}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Additional Metrics */}
            <div className="grid grid-cols-2 gap-3 md:gap-6">
              <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-3 md:p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-center justify-between mb-2 md:mb-4">
                  <h3 className="text-xs md:text-lg font-bold text-black dark:text-white">Satisfaction</h3>
                  <span className="text-lg md:text-2xl">😊</span>
                </div>
                <p className="text-xl md:text-3xl font-bold text-black dark:text-white mb-1 md:mb-2">⭐ {data.overview.satisfactionScore}</p>
                <p className="text-xs text-gray-600 dark:text-gray-400 hidden md:block">Based on 234 ratings</p>
                <div className="w-full h-1.5 md:h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden mt-2 md:mt-3">
                  <div
                    className="h-full bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full transition-all duration-500"
                    style={{ width: `${(data.overview.satisfactionScore / 5) * 100}%` }}
                  />
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-3 md:p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-center justify-between mb-2 md:mb-4">
                  <h3 className="text-xs md:text-lg font-bold text-black dark:text-white">Time Saved</h3>
                  <span className="text-lg md:text-2xl">⏰</span>
                </div>
                <p className="text-xl md:text-3xl font-bold text-black dark:text-white mb-1 md:mb-2">127h</p>
                <p className="text-xs text-green-600 dark:text-green-400 font-semibold mb-1">↑ 23%</p>
                <p className="text-xs text-gray-600 dark:text-gray-400">Automated responses saved your team time</p>
              </div>
            </div>
          </>
        )}
      </main>
      </div>
    </ProtectedRoute>
  );
}
