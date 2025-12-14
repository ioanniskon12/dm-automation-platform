"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import ProtectedRoute from '../../components/ProtectedRoute';
import NavigationSidebar from '../../components/NavigationSidebar';
import { useSidebar } from '../../contexts/SidebarContext';
import { useBrandChannel } from '../../contexts/BrandChannelContext';
import ChannelSelectorModal from '../../components/ChannelSelectorModal';

function FlowsListContent() {
  const { isCollapsed } = useSidebar();
  const { getCurrentBrand, getCurrentChannel, selectChannel } = useBrandChannel();
  const currentBrand = getCurrentBrand();
  const currentChannel = getCurrentChannel();
  const router = useRouter();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showChannelSelector, setShowChannelSelector] = useState(false);
  const [pendingAction, setPendingAction] = useState(null);

  // Determine the create flow URL based on context
  const getCreateFlowUrl = () => {
    if (currentBrand && currentChannel) {
      return `/flows?brand=${currentBrand.id}&channel=${currentChannel.type}`;
    }
    return '/brands';
  };

  const handleCreateFlowClick = () => {
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

    // If we have both brand and channel, show create modal
    setShowCreateModal(true);
  };

  const handleChannelSelect = (channel) => {
    selectChannel(channel.id);
    setShowChannelSelector(false);

    // If there's a pending action, execute it after a brief delay to let context update
    if (pendingAction) {
      setTimeout(() => {
        handleCreateOption(pendingAction);
        setPendingAction(null);
      }, 100);
    } else {
      // Otherwise just show the create modal
      setTimeout(() => {
        setShowCreateModal(true);
      }, 100);
    }
  };

  const handleCreateOption = (option) => {
    // If no channel selected, show selector and save the pending action
    if (!currentChannel) {
      setPendingAction(option);
      setShowCreateModal(false);
      setShowChannelSelector(true);
      return;
    }

    setShowCreateModal(false);

    if (option === 'template') {
      // Redirect to templates page with context
      const contextQuery = currentBrand && currentChannel
        ? `?brand=${currentBrand.id}&channel=${currentChannel.type}`
        : '';
      router.push(`/templates${contextQuery}`);
    } else if (option === 'scratch') {
      // Go directly to flow builder, skip templates
      router.push(`${getCreateFlowUrl()}&mode=scratch`);
    } else if (option === 'ai') {
      // Go to flow builder with AI mode (can be implemented later)
      router.push(`${getCreateFlowUrl()}&mode=ai`);
    }
  };

  // Mock flows data - in production, fetch from API
  const [flows, setFlows] = useState([
    {
      id: 'flow-1',
      name: 'Instagram Story Reply Automation',
      description: 'Auto-reply to story mentions with welcome message',
      channel: 'Instagram',
      channelIcon: '📷',
      channelColor: 'from-pink-500 to-purple-600',
      status: 'draft',
      createdAt: '2024-01-15',
      lastModified: '2024-01-20',
      triggers: 3,
      actions: 5,
      analytics: {
        triggered: 0,
        completed: 0,
        successRate: 0,
        avgCompletionTime: '-',
      },
    },
    {
      id: 'flow-2',
      name: 'Instagram DM Welcome Message',
      description: 'Send automated welcome message to new followers who DM',
      channel: 'Instagram',
      channelIcon: '📷',
      channelColor: 'from-pink-500 to-purple-600',
      status: 'draft',
      createdAt: '2024-01-10',
      lastModified: '2024-01-18',
      triggers: 2,
      actions: 4,
      analytics: {
        triggered: 0,
        completed: 0,
        successRate: 0,
        avgCompletionTime: '-',
      },
    },
    {
      id: 'flow-3',
      name: 'Instagram Comment Auto-Reply',
      description: 'Automatically reply to comments with specific keywords',
      channel: 'Instagram',
      channelIcon: '📷',
      channelColor: 'from-pink-500 to-purple-600',
      status: 'draft',
      createdAt: '2024-01-08',
      lastModified: '2024-01-12',
      triggers: 2,
      actions: 3,
      analytics: {
        triggered: 0,
        completed: 0,
        successRate: 0,
        avgCompletionTime: '-',
      },
    },
    {
      id: 'flow-4',
      name: 'Instagram Lead Collection',
      description: 'Collect customer information through DM conversations',
      channel: 'Instagram',
      channelIcon: '📷',
      channelColor: 'from-pink-500 to-purple-600',
      status: 'draft',
      createdAt: '2024-01-22',
      lastModified: '2024-01-22',
      triggers: 2,
      actions: 6,
      analytics: {
        triggered: 0,
        completed: 0,
        successRate: 0,
        avgCompletionTime: '-',
      },
    },
    {
      id: 'flow-5',
      name: 'Instagram Post Engagement Flow',
      description: 'Thank users who comment on your posts and drive to DMs',
      channel: 'Instagram',
      channelIcon: '📷',
      channelColor: 'from-pink-500 to-purple-600',
      status: 'draft',
      createdAt: '2024-01-20',
      lastModified: '2024-01-20',
      triggers: 3,
      actions: 4,
      analytics: {
        triggered: 0,
        completed: 0,
        successRate: 0,
        avgCompletionTime: '-',
      },
    },
    {
      id: 'flow-6',
      name: 'Instagram FAQ Auto-Responder',
      description: 'Answer frequently asked questions automatically in DMs',
      channel: 'Instagram',
      channelIcon: '📷',
      channelColor: 'from-pink-500 to-purple-600',
      status: 'draft',
      createdAt: '2024-01-18',
      lastModified: '2024-01-18',
      triggers: 2,
      actions: 5,
      analytics: {
        triggered: 0,
        completed: 0,
        successRate: 0,
        avgCompletionTime: '-',
      },
    },
    {
      id: 'flow-7',
      name: 'Facebook Lead Generation',
      description: 'Collect leads from Facebook Messenger ads',
      channel: 'Facebook',
      channelIcon: '📘',
      channelColor: 'from-blue-600 to-blue-700',
      status: 'draft',
      createdAt: '2024-01-10',
      lastModified: '2024-01-18',
      triggers: 3,
      actions: 8,
      analytics: {
        triggered: 0,
        completed: 0,
        successRate: 0,
        avgCompletionTime: '-',
      },
    },
    {
      id: 'flow-8',
      name: 'WhatsApp Customer Support',
      description: 'Automated FAQ responses for common questions',
      channel: 'WhatsApp',
      channelIcon: '💬',
      channelColor: 'from-green-500 to-green-600',
      status: 'draft',
      createdAt: '2024-01-08',
      lastModified: '2024-01-12',
      triggers: 2,
      actions: 6,
      analytics: {
        triggered: 0,
        completed: 0,
        successRate: 0,
        avgCompletionTime: '-',
      },
    },
    {
      id: 'flow-9',
      name: 'Telegram Welcome Sequence',
      description: 'Welcome new subscribers with product info',
      channel: 'Telegram',
      channelIcon: '✈️',
      channelColor: 'from-blue-400 to-blue-500',
      status: 'draft',
      createdAt: '2024-01-22',
      lastModified: '2024-01-22',
      triggers: 1,
      actions: 4,
      analytics: {
        triggered: 0,
        completed: 0,
        successRate: 0,
        avgCompletionTime: '-',
      },
    },
  ]);

  const [filterStatus, setFilterStatus] = useState('all');
  const [filterChannel, setFilterChannel] = useState('all');

  // Filter flows based on current channel context and user filters
  const filteredFlows = flows.filter((flow) => {
    // If a channel is selected in context, only show flows for that channel (case-insensitive)
    if (currentChannel && flow.channel.toLowerCase() !== currentChannel.type.toLowerCase()) return false;
    // Apply user's status filter
    if (filterStatus !== 'all' && flow.status !== filterStatus) return false;
    // Apply user's channel filter (only if no channel context exists)
    if (!currentChannel && filterChannel !== 'all' && flow.channel !== filterChannel) return false;
    return true;
  });

  // Calculate stats based on filtered flows (channel context aware, case-insensitive)
  const channelFilteredFlows = currentChannel
    ? flows.filter((f) => f.channel.toLowerCase() === currentChannel.type.toLowerCase())
    : flows;

  const stats = {
    total: channelFilteredFlows.length,
    active: channelFilteredFlows.filter((f) => f.status === 'active').length,
    paused: channelFilteredFlows.filter((f) => f.status === 'paused').length,
    draft: channelFilteredFlows.filter((f) => f.status === 'draft').length,
    totalTriggered: channelFilteredFlows.reduce((sum, f) => sum + f.analytics.triggered, 0),
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <NavigationSidebar />

      <main className={`px-4 md:px-6 py-6 md:py-8 min-h-screen transition-all duration-300 pt-16 md:pt-8 ${isCollapsed ? 'md:ml-20' : 'md:ml-64'}`}>
        {/* Header */}
        <div className="mb-6 md:mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
            <div>
              <h1 className="text-xl md:text-3xl font-bold text-black dark:text-white mb-1 md:mb-2">Automation Flows</h1>
              <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400">
                Manage and monitor all your automation workflows
              </p>
              {currentBrand && currentChannel && (
                <div className="flex items-center gap-2 mt-2 md:mt-3">
                  <span className="text-xs text-gray-500 dark:text-gray-500 hidden md:inline">Viewing flows for:</span>
                  <span className="px-2 md:px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs font-semibold rounded-full">
                    {currentBrand.name} • {currentChannel.type}
                  </span>
                </div>
              )}
            </div>
            <button
              onClick={handleCreateFlowClick}
              className="px-4 md:px-6 py-2.5 md:py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all text-sm md:text-base touch-target"
            >
              + Create Flow
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-2 md:gap-4">
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-3 md:p-4">
              <div className="text-xl md:text-2xl font-bold text-black dark:text-white">{stats.total}</div>
              <div className="text-xs text-gray-600 dark:text-gray-400">Total</div>
            </div>
            <div className="bg-white dark:bg-gray-800 border border-green-200 dark:border-green-700 rounded-lg p-3 md:p-4">
              <div className="text-xl md:text-2xl font-bold text-green-600 dark:text-green-400">{stats.active}</div>
              <div className="text-xs text-gray-600 dark:text-gray-400">Active</div>
            </div>
            <div className="bg-white dark:bg-gray-800 border border-yellow-200 dark:border-yellow-700 rounded-lg p-3 md:p-4">
              <div className="text-xl md:text-2xl font-bold text-yellow-600 dark:text-yellow-400">{stats.paused}</div>
              <div className="text-xs text-gray-600 dark:text-gray-400">Paused</div>
            </div>
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-3 md:p-4">
              <div className="text-xl md:text-2xl font-bold text-gray-600 dark:text-gray-400">{stats.draft}</div>
              <div className="text-xs text-gray-600 dark:text-gray-400">Drafts</div>
            </div>
            <div className="col-span-2 md:col-span-1 bg-white dark:bg-gray-800 border border-blue-200 dark:border-blue-700 rounded-lg p-3 md:p-4">
              <div className="text-xl md:text-2xl font-bold text-blue-600 dark:text-blue-400">{stats.totalTriggered.toLocaleString()}</div>
              <div className="text-xs text-gray-600 dark:text-gray-400">Triggered</div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-4 md:mb-6 flex flex-wrap gap-2 md:gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs md:text-sm font-medium text-gray-700 dark:text-gray-300">Status:</span>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-2 md:px-3 py-1.5 md:py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-xs md:text-sm text-black dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              <option value="all">All</option>
              <option value="active">Active</option>
              <option value="paused">Paused</option>
              <option value="draft">Draft</option>
            </select>
          </div>
          {/* Only show channel filter if no channel is selected in context */}
          {!currentChannel && (
            <div className="flex items-center gap-2">
              <span className="text-xs md:text-sm font-medium text-gray-700 dark:text-gray-300">Channel:</span>
              <select
                value={filterChannel}
                onChange={(e) => setFilterChannel(e.target.value)}
                className="px-2 md:px-3 py-1.5 md:py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-xs md:text-sm text-black dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
              >
                <option value="all">All Channels</option>
                <option value="Instagram">Instagram</option>
                <option value="Facebook">Facebook</option>
                <option value="WhatsApp">WhatsApp</option>
                <option value="Telegram">Telegram</option>
              </select>
            </div>
          )}
        </div>

        {/* Flows List */}
        <div className="space-y-3 md:space-y-4">
          {filteredFlows.length === 0 ? (
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-8 md:p-12 text-center">
              <div className="text-4xl md:text-6xl mb-3 md:mb-4">🤖</div>
              <h3 className="text-lg md:text-xl font-bold text-black dark:text-white mb-2">No flows found</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 md:mb-6">
                {filterStatus !== 'all' || (!currentChannel && filterChannel !== 'all')
                  ? 'Try adjusting your filters'
                  : currentChannel
                  ? `Create your first ${currentChannel.type} flow to get started`
                  : 'Create your first automation flow to get started'}
              </p>
              {filterStatus === 'all' && (!currentChannel || filterChannel === 'all') && (
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="inline-block px-4 md:px-6 py-2.5 md:py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all text-sm md:text-base"
                >
                  Create Your First Flow
                </button>
              )}
            </div>
          ) : (
            filteredFlows.map((flow) => (
              <Link
                key={flow.id}
                href={`/flows-list/${flow.id}`}
                className="block bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-500 hover:shadow-lg transition-all rounded-xl p-4 md:p-6"
              >
                <div className="flex items-start gap-3 md:gap-4">
                  {/* Channel Icon */}
                  <div className={`w-10 h-10 md:w-14 md:h-14 rounded-xl bg-gradient-to-br ${flow.channelColor} flex items-center justify-center text-lg md:text-2xl flex-shrink-0 shadow-lg`}>
                    {flow.channelIcon}
                  </div>

                  {/* Flow Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-1 md:mb-2">
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm md:text-lg font-bold text-black dark:text-white mb-0.5 md:mb-1 truncate pr-2">
                          {flow.name}
                        </h3>
                        <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400 line-clamp-1 hidden md:block">
                          {flow.description}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        {flow.status === 'active' && (
                          <span className="px-2 md:px-3 py-0.5 md:py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 text-xs font-semibold rounded-full">
                            Active
                          </span>
                        )}
                        {flow.status === 'paused' && (
                          <span className="px-2 md:px-3 py-0.5 md:py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 text-xs font-semibold rounded-full">
                            Paused
                          </span>
                        )}
                        {flow.status === 'draft' && (
                          <span className="px-2 md:px-3 py-0.5 md:py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs font-semibold rounded-full">
                            Draft
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Flow Stats */}
                    <div className="grid grid-cols-4 md:grid-cols-5 gap-2 md:gap-4 mt-2 md:mt-4">
                      <div className="hidden md:block">
                        <div className="text-xs text-gray-500 dark:text-gray-500 mb-1">Channel</div>
                        <div className="text-sm font-semibold text-black dark:text-white">{flow.channel}</div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-500 dark:text-gray-500 mb-0.5 md:mb-1">Nodes</div>
                        <div className="text-xs md:text-sm font-semibold text-black dark:text-white">
                          {flow.triggers + flow.actions}
                        </div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-500 dark:text-gray-500 mb-0.5 md:mb-1">Runs</div>
                        <div className="text-xs md:text-sm font-semibold text-black dark:text-white">
                          {flow.analytics.triggered}
                        </div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-500 dark:text-gray-500 mb-0.5 md:mb-1">Success</div>
                        <div className="text-xs md:text-sm font-semibold text-green-600 dark:text-green-400">
                          {flow.analytics.successRate}%
                        </div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-500 dark:text-gray-500 mb-0.5 md:mb-1">Time</div>
                        <div className="text-xs md:text-sm font-semibold text-black dark:text-white">
                          {flow.analytics.avgCompletionTime}
                        </div>
                      </div>
                    </div>

                    {/* Last Modified - hidden on mobile */}
                    <div className="hidden md:block mt-3 text-xs text-gray-500 dark:text-gray-500">
                      Last modified: {new Date(flow.lastModified).toLocaleDateString()}
                    </div>
                  </div>

                  {/* Arrow - hidden on mobile */}
                  <svg className="hidden md:block w-6 h-6 text-gray-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </Link>
            ))
          )}
        </div>

        {/* Create Flow Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black/60 flex items-end md:items-center justify-center z-50" onClick={() => setShowCreateModal(false)}>
            <div className="bg-white dark:bg-gray-800 rounded-t-2xl md:rounded-xl shadow-2xl max-w-2xl w-full md:mx-4 overflow-hidden safe-area-bottom" onClick={(e) => e.stopPropagation()}>
              {/* Mobile drag handle */}
              <div className="md:hidden flex justify-center pt-3 pb-2">
                <div className="w-10 h-1 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
              </div>

              {/* Modal Header */}
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-4 md:px-6 py-3 md:py-4 flex items-center justify-between">
                <h2 className="text-base md:text-xl font-bold text-white">Create New Flow</h2>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="text-white hover:text-gray-200 text-xl md:text-2xl font-light touch-target"
                >
                  ✕
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-4 md:p-6">
                <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400 mb-4 md:mb-6">
                  Choose how you want to create your automation flow
                </p>

                <div className="space-y-2 md:space-y-3">
                  {/* Choose Template Option */}
                  <button
                    onClick={() => handleCreateOption('template')}
                    className="w-full bg-white dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-500 rounded-lg p-3 md:p-5 text-left transition-all hover:shadow-md group touch-target"
                  >
                    <div className="flex items-start gap-3 md:gap-4">
                      <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-xl md:text-2xl flex-shrink-0">
                        🎨
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm md:text-lg font-bold text-black dark:text-white mb-0.5 md:mb-1 group-hover:text-blue-600 dark:group-hover:text-blue-400">
                          Choose Template
                        </h3>
                        <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400">
                          Start with a pre-built template
                        </p>
                      </div>
                      <svg className="w-5 h-5 md:w-6 md:h-6 text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </button>

                  {/* Start from Scratch Option */}
                  <button
                    onClick={() => handleCreateOption('scratch')}
                    className="w-full bg-white dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700 hover:border-green-500 dark:hover:border-green-500 rounded-lg p-3 md:p-5 text-left transition-all hover:shadow-md group touch-target"
                  >
                    <div className="flex items-start gap-3 md:gap-4">
                      <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center text-xl md:text-2xl flex-shrink-0">
                        ✏️
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm md:text-lg font-bold text-black dark:text-white mb-0.5 md:mb-1 group-hover:text-green-600 dark:group-hover:text-green-400">
                          Start from Scratch
                        </h3>
                        <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400">
                          Build from the ground up
                        </p>
                      </div>
                      <svg className="w-5 h-5 md:w-6 md:h-6 text-gray-400 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </button>

                  {/* Build with AI Option */}
                  <button
                    onClick={() => handleCreateOption('ai')}
                    className="w-full bg-white dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700 hover:border-purple-500 dark:hover:border-purple-500 rounded-lg p-3 md:p-5 text-left transition-all hover:shadow-md group touch-target"
                  >
                    <div className="flex items-start gap-3 md:gap-4">
                      <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-xl md:text-2xl flex-shrink-0">
                        🤖
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm md:text-lg font-bold text-black dark:text-white mb-0.5 md:mb-1 group-hover:text-purple-600 dark:group-hover:text-purple-400">
                          Build with AI
                        </h3>
                        <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400">
                          Let AI generate the flow
                        </p>
                        <span className="inline-block mt-1 md:mt-2 px-2 py-0.5 md:py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 text-xs font-semibold rounded-full">
                          Coming Soon
                        </span>
                      </div>
                      <svg className="w-5 h-5 md:w-6 md:h-6 text-gray-400 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Channel Selector Modal */}
        <ChannelSelectorModal
          isOpen={showChannelSelector}
          onClose={() => setShowChannelSelector(false)}
          onSelectChannel={handleChannelSelect}
          brand={currentBrand}
          title="Select a Channel to Build Flow"
          message="Please select a channel for your automation flow. Each flow is specific to one channel."
        />
      </main>
    </div>
  );
}

export default function FlowsList() {
  return (
    <ProtectedRoute>
      <FlowsListContent />
    </ProtectedRoute>
  );
}
