"use client";

export const dynamic = 'force-dynamic';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import NavigationSidebar from '../../components/NavigationSidebar';
import { useSidebar } from '../../contexts/SidebarContext';
import { useBrandChannel } from '../../contexts/BrandChannelContext';
import ChannelSelectorModal from '../../components/ChannelSelectorModal';
import ProtectedRoute from '../../components/ProtectedRoute';

// Channel configurations
const channelConfig = {
  instagram: {
    name: 'Instagram',
    color: 'from-pink-500 to-purple-500',
    bgColor: 'bg-gradient-to-br from-pink-500 to-purple-500',
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
      </svg>
    ),
  },
  facebook: {
    name: 'Facebook',
    color: 'from-blue-600 to-blue-700',
    bgColor: 'bg-gradient-to-br from-blue-600 to-blue-700',
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
      </svg>
    ),
  },
  messenger: {
    name: 'Messenger',
    color: 'from-blue-500 to-blue-600',
    bgColor: 'bg-gradient-to-br from-blue-500 to-blue-600',
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 0C5.373 0 0 4.974 0 11.111c0 3.498 1.744 6.614 4.469 8.654V24l4.088-2.242c1.092.301 2.246.464 3.443.464 6.627 0 12-4.974 12-11.111S18.627 0 12 0zm1.191 14.963l-3.055-3.26-5.963 3.26L10.732 8l3.131 3.259L19.752 8l-6.561 6.963z"/>
      </svg>
    ),
  },
  whatsapp: {
    name: 'WhatsApp',
    color: 'from-green-500 to-green-600',
    bgColor: 'bg-gradient-to-br from-green-500 to-green-600',
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
      </svg>
    ),
  },
  telegram: {
    name: 'Telegram',
    color: 'from-sky-500 to-blue-500',
    bgColor: 'bg-gradient-to-br from-sky-500 to-blue-500',
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
      </svg>
    ),
  },
  email: {
    name: 'Email',
    color: 'from-amber-500 to-orange-500',
    bgColor: 'bg-gradient-to-br from-amber-500 to-orange-500',
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
  },
  sms: {
    name: 'SMS',
    color: 'from-gray-500 to-gray-600',
    bgColor: 'bg-gradient-to-br from-gray-500 to-gray-600',
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
      </svg>
    ),
  },
};

const statusConfig = {
  draft: { label: 'Draft', color: 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300' },
  scheduled: { label: 'Scheduled', color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' },
  sending: { label: 'Sending', color: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' },
  sent: { label: 'Sent', color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' },
  failed: { label: 'Failed', color: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' },
  cancelled: { label: 'Cancelled', color: 'bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400' },
};

function BroadcastingContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isCollapsed } = useSidebar();
  const { getCurrentBrand, getCurrentChannel, selectChannel } = useBrandChannel();
  const currentBrand = getCurrentBrand();
  const currentChannel = getCurrentChannel();

  const [activeTab, setActiveTab] = useState('drafts');
  const [broadcasts, setBroadcasts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ drafts: 0, scheduled: 0, history: 0 });
  const [actionMenuId, setActionMenuId] = useState(null);
  const [showChannelSelector, setShowChannelSelector] = useState(false);

  const workspaceId = currentBrand?.id || searchParams.get('brand') || 'brand-1';
  const channelType = currentChannel?.type || searchParams.get('channel'); // e.g., 'messenger', 'instagram'

  useEffect(() => {
    fetchBroadcasts();
  }, [activeTab, workspaceId, channelType]);

  // Close action menu when clicking outside
  useEffect(() => {
    const handleClickOutside = () => setActionMenuId(null);
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const fetchBroadcasts = async () => {
    setLoading(true);
    try {
      const statusMap = {
        drafts: 'draft',
        scheduled: 'scheduled',
        history: 'sent',
      };
      const status = statusMap[activeTab] || '';

      // Include channel filter to only show broadcasts for the selected channel
      const channelQuery = channelType ? `&channel=${channelType}` : '';
      const response = await fetch(
        `http://localhost:4000/api/broadcasts?workspaceId=${workspaceId}&status=${status}${channelQuery}`
      );
      const data = await response.json();

      if (data.success) {
        // Filter broadcasts by channel on frontend as backup (in case backend doesn't filter)
        const filteredBroadcasts = channelType
          ? (data.broadcasts || []).filter(b => b.channel === channelType)
          : (data.broadcasts || []);
        setBroadcasts(filteredBroadcasts);

        // Recalculate stats based on filtered broadcasts
        const channelBroadcasts = channelType
          ? (data.broadcasts || []).filter(b => b.channel === channelType)
          : (data.broadcasts || []);
        setStats({
          drafts: channelBroadcasts.filter(b => b.status === 'draft').length,
          scheduled: channelBroadcasts.filter(b => b.status === 'scheduled').length,
          history: channelBroadcasts.filter(b => ['sent', 'failed', 'cancelled'].includes(b.status)).length,
        });
      }
    } catch (error) {
      console.error('Error fetching broadcasts:', error);
      setBroadcasts([]);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleCreateBroadcast = () => {
    // Check if we have a brand
    if (!currentBrand) {
      router.push('/brands');
      return;
    }

    // Check if we have a channel selected
    if (!currentChannel) {
      setShowChannelSelector(true);
      return;
    }

    // If we have both brand and channel, go to create page
    router.push(`/broadcasting/new?brand=${workspaceId}&channel=${channelType}`);
  };

  const handleChannelSelect = (channel) => {
    selectChannel(channel.id);
    setShowChannelSelector(false);
    // Navigate to create page after channel selection
    setTimeout(() => {
      router.push(`/broadcasting/new?brand=${workspaceId}&channel=${channel.type}`);
    }, 100);
  };

  const handleEditBroadcast = (id) => {
    router.push(`/broadcasting/${id}/edit?brand=${workspaceId}`);
  };

  const handleViewReport = (id) => {
    router.push(`/broadcasting/${id}/report?brand=${workspaceId}`);
  };

  const handleDuplicate = async (broadcast) => {
    try {
      const response = await fetch(`http://localhost:4000/api/broadcasts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          workspaceId,
          name: `${broadcast.name} (Copy)`,
          channel: broadcast.channel,
          contentJson: broadcast.contentJson,
          audienceFilterJson: broadcast.audienceFilterJson,
          status: 'draft',
        }),
      });

      if (response.ok) {
        fetchBroadcasts();
      }
    } catch (error) {
      console.error('Error duplicating broadcast:', error);
    }
  };

  const handleCancelSchedule = async (id) => {
    if (!confirm('Are you sure you want to cancel this scheduled broadcast?')) return;

    try {
      const response = await fetch(`http://localhost:4000/api/broadcasts/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'cancelled' }),
      });

      if (response.ok) {
        fetchBroadcasts();
      }
    } catch (error) {
      console.error('Error cancelling broadcast:', error);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this broadcast?')) return;

    try {
      const response = await fetch(`http://localhost:4000/api/broadcasts/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        fetchBroadcasts();
      }
    } catch (error) {
      console.error('Error deleting broadcast:', error);
    }
  };

  const tabs = [
    { id: 'drafts', label: 'Drafts', count: stats.drafts },
    { id: 'scheduled', label: 'Scheduled', count: stats.scheduled },
    { id: 'history', label: 'History', count: stats.history },
  ];

  // If no brand at all, show redirect prompt
  if (!currentBrand) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
        <NavigationSidebar />
        <main className={`transition-all duration-300 ${isCollapsed ? 'md:ml-20' : 'md:ml-64'} pt-14 md:pt-0`}>
          <div className="p-4 md:p-8">
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <div className="text-5xl mb-4">⚠️</div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Select a Brand</h2>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Please select a brand first to view broadcasts
                </p>
                <button
                  onClick={() => router.push('/brands')}
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-lg transition-all"
                >
                  Go to Brands
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // If brand exists but no channel, show channel selector prompt
  if (!currentChannel) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
        <NavigationSidebar />
        <main className={`transition-all duration-300 ${isCollapsed ? 'md:ml-20' : 'md:ml-64'} pt-14 md:pt-0`}>
          <div className="p-4 md:p-8">
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <div className="text-5xl mb-4">📱</div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Select a Channel</h2>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Please select a channel for <strong>{currentBrand.name}</strong> to view broadcasts
                </p>
                <button
                  onClick={() => setShowChannelSelector(true)}
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-lg transition-all"
                >
                  Select Channel
                </button>
              </div>
            </div>
          </div>
        </main>

        {/* Channel Selector Modal */}
        <ChannelSelectorModal
          isOpen={showChannelSelector}
          onClose={() => setShowChannelSelector(false)}
          onSelectChannel={(channel) => {
            selectChannel(channel.id);
            setShowChannelSelector(false);
          }}
          brand={currentBrand}
          title="Select a Channel"
          message="Choose a channel to view and create broadcasts"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <NavigationSidebar />

      <main className={`transition-all duration-300 ${isCollapsed ? 'md:ml-20' : 'md:ml-64'} pt-14 md:pt-0`}>
        <div className="p-4 md:p-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Broadcasting</h1>
                <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs font-semibold rounded-full">
                  {currentBrand.name} · {currentChannel.type}
                </span>
              </div>
              <p className="text-gray-600 dark:text-gray-400">
                Send one-time messages to your audience at scale
              </p>
            </div>
            <button
              onClick={handleCreateBroadcast}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all font-medium shadow-lg shadow-blue-500/25"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              New Broadcast
            </button>
          </div>

          {/* Tabs */}
          <div className="border-b border-gray-200 dark:border-gray-700 mb-6">
            <nav className="flex gap-6">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`pb-3 px-1 border-b-2 font-medium text-sm transition-all ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                      : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                  }`}
                >
                  {tab.label}
                  <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
                    activeTab === tab.id
                      ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                  }`}>
                    {tab.count}
                  </span>
                </button>
              ))}
            </nav>
          </div>

          {/* Content */}
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : broadcasts.length === 0 ? (
            <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-12 text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
                <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.14 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                No {activeTab === 'drafts' ? 'draft' : activeTab === 'scheduled' ? 'scheduled' : 'sent'} broadcasts
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
                {activeTab === 'drafts'
                  ? 'Create your first broadcast to reach your audience with targeted messages.'
                  : activeTab === 'scheduled'
                  ? 'Schedule a broadcast to send at a specific time.'
                  : 'Your sent broadcasts will appear here.'}
              </p>
              {activeTab === 'drafts' && (
                <button
                  onClick={handleCreateBroadcast}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all font-medium"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Create Your First Broadcast
                </button>
              )}
            </div>
          ) : (
            <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
              {/* Table Header */}
              <div className="hidden md:grid md:grid-cols-12 gap-4 px-6 py-3 bg-gray-50 dark:bg-gray-800/50 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                <div className="col-span-4">Broadcast</div>
                <div className="col-span-2">Channel</div>
                <div className="col-span-2">Status</div>
                <div className="col-span-2">{activeTab === 'history' ? 'Recipients' : 'Audience'}</div>
                <div className="col-span-2">{activeTab === 'scheduled' ? 'Scheduled' : 'Created'}</div>
              </div>

              {/* Table Rows */}
              <div className="divide-y divide-gray-200 dark:divide-gray-800">
                {broadcasts.map((broadcast) => {
                  const channel = channelConfig[broadcast.channel] || channelConfig.email;
                  const status = statusConfig[broadcast.status] || statusConfig.draft;

                  return (
                    <div
                      key={broadcast.id}
                      className="grid grid-cols-1 md:grid-cols-12 gap-4 px-6 py-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                    >
                      {/* Broadcast Name */}
                      <div className="col-span-4 flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-lg ${channel.bgColor} flex items-center justify-center text-white flex-shrink-0`}>
                          {channel.icon}
                        </div>
                        <div className="min-w-0">
                          <h3 className="font-medium text-gray-900 dark:text-white truncate">
                            {broadcast.name}
                          </h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                            {broadcast.contentJson?.[0]?.text?.substring(0, 50) || 'No content'}...
                          </p>
                        </div>
                      </div>

                      {/* Channel */}
                      <div className="col-span-2 flex items-center">
                        <span className="text-sm text-gray-700 dark:text-gray-300">
                          {channel.name}
                        </span>
                      </div>

                      {/* Status */}
                      <div className="col-span-2 flex items-center">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${status.color}`}>
                          {status.label}
                        </span>
                      </div>

                      {/* Audience/Recipients */}
                      <div className="col-span-2 flex items-center">
                        <div className="text-sm">
                          {activeTab === 'history' ? (
                            <div>
                              <span className="font-medium text-gray-900 dark:text-white">
                                {(broadcast.totalSent || 0).toLocaleString()}
                              </span>
                              <span className="text-gray-500 dark:text-gray-400"> sent</span>
                            </div>
                          ) : (
                            <div>
                              <span className="font-medium text-gray-900 dark:text-white">
                                {(broadcast.audienceEstimate || 0).toLocaleString()}
                              </span>
                              <span className="text-gray-500 dark:text-gray-400"> est.</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Date */}
                      <div className="col-span-2 flex items-center justify-between">
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          {formatDate(activeTab === 'scheduled' ? broadcast.scheduleAt : broadcast.createdAt)}
                        </span>

                        {/* Actions Menu */}
                        <div className="relative">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setActionMenuId(actionMenuId === broadcast.id ? null : broadcast.id);
                            }}
                            className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                          >
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                            </svg>
                          </button>

                          {actionMenuId === broadcast.id && (
                            <div className="absolute right-0 top-full mt-1 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-1 z-10">
                              {broadcast.status === 'draft' && (
                                <button
                                  onClick={() => handleEditBroadcast(broadcast.id)}
                                  className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
                                >
                                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                  </svg>
                                  Edit
                                </button>
                              )}
                              <button
                                onClick={() => handleDuplicate(broadcast)}
                                className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
                              >
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                </svg>
                                Duplicate
                              </button>
                              {broadcast.status === 'scheduled' && (
                                <button
                                  onClick={() => handleCancelSchedule(broadcast.id)}
                                  className="w-full px-4 py-2 text-left text-sm text-orange-600 dark:text-orange-400 hover:bg-orange-50 dark:hover:bg-orange-900/20 flex items-center gap-2"
                                >
                                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                  </svg>
                                  Cancel Schedule
                                </button>
                              )}
                              {['sent', 'failed'].includes(broadcast.status) && (
                                <button
                                  onClick={() => handleViewReport(broadcast.id)}
                                  className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
                                >
                                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                  </svg>
                                  View Report
                                </button>
                              )}
                              <hr className="my-1 border-gray-200 dark:border-gray-700" />
                              <button
                                onClick={() => handleDelete(broadcast.id)}
                                className="w-full px-4 py-2 text-left text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-2"
                              >
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                                Delete
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Broadcasting Tips Panel */}
          <div className="mt-8">
            <details className="bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
              <summary className="px-6 py-4 cursor-pointer flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <span className="font-medium text-blue-900 dark:text-blue-100">Broadcasting Best Practices</span>
                </div>
                <svg className="w-5 h-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <div className="px-6 pb-4 space-y-3 text-sm text-blue-800 dark:text-blue-200">
                <div className="flex items-start gap-2">
                  <span className="text-blue-500 mt-0.5">•</span>
                  <span><strong>Provide value:</strong> Engage with valuable content or incentives, not spam.</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-blue-500 mt-0.5">•</span>
                  <span><strong>Easy unsubscribe:</strong> Always include unsubscribe options to reduce blocks/reports.</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-blue-500 mt-0.5">•</span>
                  <span><strong>Use buttons:</strong> Provide clear reply options instead of open-ended questions.</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-blue-500 mt-0.5">•</span>
                  <span><strong>Choose wisely:</strong> Evaluate reach and effectiveness of each channel for your audience.</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-blue-500 mt-0.5">•</span>
                  <span><strong>Mind the costs:</strong> SMS costs add up; Messenger/Telegram may be free.</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-blue-500 mt-0.5">•</span>
                  <span><strong>Stay compliant:</strong> Follow regulations and platform policies, especially for SMS.</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-blue-500 mt-0.5">•</span>
                  <span><strong>Respect windows:</strong> Use alternative channels (SMS, Email) for promotional content outside 24h windows.</span>
                </div>
              </div>
            </details>
          </div>
        </div>
      </main>

      {/* Channel Selector Modal */}
      <ChannelSelectorModal
        isOpen={showChannelSelector}
        onClose={() => setShowChannelSelector(false)}
        onSelectChannel={handleChannelSelect}
        brand={currentBrand}
        title="Select a Channel"
        message="Choose a channel for your broadcast"
      />
    </div>
  );
}

export default function BroadcastingPage() {
  return (
    <ProtectedRoute>
      <Suspense fallback={<div className="h-screen flex items-center justify-center"><div className="animate-spin w-8 h-8 border-2 border-black border-t-transparent rounded-full"></div></div>}>
        <BroadcastingContent />
      </Suspense>
    </ProtectedRoute>
  );
}
