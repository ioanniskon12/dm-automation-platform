"use client";

import { useState, useEffect } from 'react';
import { useSidebar } from '../../contexts/SidebarContext';
import Link from 'next/link';
import axios from 'axios';
import NavigationSidebar from '../../components/NavigationSidebar';
import ProtectedRoute from '../../components/ProtectedRoute';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export default function Channels() {
  const { isCollapsed } = useSidebar();
  const [channels, setChannels] = useState({
    instagram: { connected: false, loading: false, username: null },
    messenger: { connected: false, loading: false, username: null },
    whatsapp: { connected: false, loading: false, phoneNumber: null },
    telegram: { connected: false, loading: false, username: null },
  });

  const channelInfo = [
    {
      id: 'instagram',
      name: 'Instagram',
      icon: '📷',
      description: 'Automate Instagram DMs and comments',
      features: ['Auto-reply to DMs', 'Comment triggers', 'Story replies'],
    },
    {
      id: 'messenger',
      name: 'Facebook Messenger',
      icon: '💬',
      description: 'Respond to Facebook messages automatically',
      features: ['Auto-reply to messages', 'Lead qualification', 'FAQ responses'],
    },
    {
      id: 'whatsapp',
      name: 'WhatsApp Business',
      icon: '📱',
      description: 'Automate WhatsApp Business conversations',
      features: ['Business API integration', 'Template messages', 'Quick replies'],
    },
    {
      id: 'telegram',
      name: 'Telegram',
      icon: '✈️',
      description: 'Manage Telegram bot conversations',
      features: ['Bot automation', 'Group management', 'Command triggers'],
    },
  ];

  useEffect(() => {
    fetchConnectedChannels();
  }, []);

  const fetchConnectedChannels = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/channels`);
      if (response.data.success) {
        const connected = response.data.channels;
        setChannels(prev => ({
          instagram: { ...prev.instagram, connected: connected.instagram?.connected || false, username: connected.instagram?.username },
          messenger: { ...prev.messenger, connected: connected.messenger?.connected || false, username: connected.messenger?.username },
          whatsapp: { ...prev.whatsapp, connected: connected.whatsapp?.connected || false, phoneNumber: connected.whatsapp?.phoneNumber },
          telegram: { ...prev.telegram, connected: connected.telegram?.connected || false, username: connected.telegram?.username },
        }));
      }
    } catch (error) {
      console.error('Error fetching channels:', error);
    }
  };

  const connectChannel = async (channelId) => {
    setChannels(prev => ({
      ...prev,
      [channelId]: { ...prev[channelId], loading: true }
    }));

    try {
      const response = await axios.post(`${API_URL}/api/channels/connect`, {
        platform: channelId
      });

      if (response.data.authUrl) {
        // Open OAuth window
        window.location.href = response.data.authUrl;
      }
    } catch (error) {
      console.error(`Error connecting ${channelId}:`, error);
      setChannels(prev => ({
        ...prev,
        [channelId]: { ...prev[channelId], loading: false }
      }));
    }
  };

  const disconnectChannel = async (channelId) => {
    if (!confirm(`Are you sure you want to disconnect ${channelId}?`)) return;

    try {
      await axios.post(`${API_URL}/api/channels/disconnect`, {
        platform: channelId
      });

      setChannels(prev => ({
        ...prev,
        [channelId]: { connected: false, loading: false, username: null, phoneNumber: null }
      }));

      // Update onboarding progress
      updateOnboardingProgress();
    } catch (error) {
      console.error(`Error disconnecting ${channelId}:`, error);
    }
  };

  const updateOnboardingProgress = () => {
    const anyConnected = Object.values(channels).some(ch => ch.connected);
    const progress = JSON.parse(localStorage.getItem('onboardingProgress') || '{}');
    progress.channelsConnected = anyConnected;
    localStorage.setItem('onboardingProgress', JSON.stringify(progress));
  };

  const connectedCount = Object.values(channels).filter(ch => ch.connected).length;

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-white dark:bg-gray-900">
        <NavigationSidebar />

      {/* Main Content - with left padding for sidebar */}
      <main className={`transition-all duration-300 ${isCollapsed ? 'ml-20' : 'ml-64'} max-w-7xl mx-auto px-6 py-16`}>
        {/* Page Header */}
        <div className="mb-12">
          <h1 className="text-3xl font-bold text-black dark:text-white mb-2">Connect Your Channels</h1>
          <p className="text-sm text-gray-600 dark:text-gray-400 max-w-3xl">
            Link your social media accounts to start automating conversations. You can connect multiple channels and manage them all in one place.
          </p>

          {/* Progress Indicator */}
          <div className="mt-6 flex items-center gap-3">
            <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 border border-blue-300 dark:border-blue-700 rounded-lg">
              <span className="text-blue-700 dark:text-blue-300 font-semibold text-sm">{connectedCount}/4 Channels Connected</span>
            </div>
            {connectedCount > 0 && (
              <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 border border-green-300 dark:border-green-700 rounded-lg">
                <span className="font-medium text-green-700 dark:text-green-300 text-sm">Ready to automate</span>
              </div>
            )}
          </div>
        </div>

        {/* Channel Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {channelInfo.map((channel) => {
            const state = channels[channel.id];
            const isConnected = state.connected;

            return (
              <div
                key={channel.id}
                className="bg-white dark:bg-gray-800 p-6 border border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-500 hover:shadow-xl transition-all rounded-xl"
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center text-2xl shadow-sm">
                      {channel.icon}
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-black dark:text-white">{channel.name}</h3>
                      {isConnected && (
                        <div className="flex items-center gap-2 mt-1">
                          <div className="w-2 h-2 bg-green-500 dark:bg-green-400 rounded-full"></div>
                          <span className="text-xs text-green-600 dark:text-green-400 font-medium">
                            {state.username || state.phoneNumber || 'Connected'}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Status Badge */}
                  {isConnected && (
                    <div className="px-3 py-1 bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 border border-green-300 dark:border-green-700 text-green-700 dark:text-green-300 text-xs font-semibold rounded-lg">
                      Active
                    </div>
                  )}
                </div>

                {/* Description */}
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">{channel.description}</p>

                {/* Features */}
                <div className="mb-6">
                  <h4 className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">Features:</h4>
                  <ul className="space-y-1">
                    {channel.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
                        <span className="text-gray-400 dark:text-gray-500">·</span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Action Button */}
                {isConnected ? (
                  <div className="flex gap-3">
                    <button
                      onClick={() => disconnectChannel(channel.id)}
                      className="flex-1 px-4 py-2 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 text-sm font-semibold hover:border-red-500 dark:hover:border-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 hover:text-red-600 dark:hover:text-red-400 transition-all rounded-lg"
                    >
                      Disconnect
                    </button>
                    <button className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white text-sm font-semibold transition-all rounded-lg shadow-sm hover:shadow-md">
                      Manage
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => connectChannel(channel.id)}
                    disabled={state.loading}
                    className={`w-full px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white text-sm font-semibold transition-all rounded-lg shadow-sm hover:shadow-md ${state.loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    {state.loading ? 'Connecting...' : `Connect ${channel.name}`}
                  </button>
                )}
              </div>
            );
          })}
        </div>

        {/* Next Steps */}
        {connectedCount > 0 && (
          <div className="mt-12 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/10 dark:to-purple-900/10 border border-blue-200 dark:border-blue-800 p-6 rounded-xl">
            <h3 className="text-lg font-bold text-black dark:text-white mb-2">Great! You're connected</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Now add some knowledge to your AI assistant so it can answer questions accurately.
            </p>
            <div className="flex gap-4">
              <Link
                href="/knowledge-base"
                className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white text-sm font-semibold transition-all rounded-lg shadow-sm hover:shadow-md"
              >
                Add Knowledge
              </Link>
              <Link
                href="/templates"
                className="px-6 py-2 border border-gray-300 dark:border-gray-600 text-black dark:text-white text-sm font-semibold hover:border-purple-500 dark:hover:border-purple-500 transition-all rounded-lg"
              >
                Browse Templates
              </Link>
            </div>
          </div>
        )}
      </main>
      </div>
    </ProtectedRoute>
  );
}
