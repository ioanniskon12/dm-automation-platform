"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import ProtectedRoute from '../../components/ProtectedRoute';
import NavigationSidebar from '../../components/NavigationSidebar';
import { useSidebar } from '../../contexts/SidebarContext';
import { useBrandChannel } from '../../contexts/BrandChannelContext';

function GlobalAutomationsContent() {
  const { isCollapsed } = useSidebar();
  const { getCurrentBrand, getCurrentChannel, getChannelsForCurrentBrand, selectChannel } = useBrandChannel();
  const currentBrand = getCurrentBrand();
  const currentChannel = getCurrentChannel();
  const router = useRouter();
  const [showExistingFlowsModal, setShowExistingFlowsModal] = useState(false);
  const [selectedAutomation, setSelectedAutomation] = useState(null);
  const [showChannelSelectorModal, setShowChannelSelectorModal] = useState(false);

  // Instagram global automations
  const instagramAutomations = [
    {
      id: 'default-reply',
      name: 'Default Reply',
      description: 'Sends a reply when the bot doesn\'t understand a message.',
      status: 'inactive',
      actions: [
        { type: 'create', label: 'Create manually' },
        { type: 'ai', label: 'Train with AI' }
      ]
    },
    {
      id: 'main-menu',
      name: 'Main Menu',
      description: 'Quick menu users can open from Instagram DMs.',
      status: 'active',
      actions: [
        { type: 'edit', label: 'Edit' }
      ]
    },
    {
      id: 'welcome-followers',
      name: 'Say hi to new followers',
      description: 'Send a welcome DM to people the moment they follow you (1st time only).',
      status: 'inactive',
      actions: [
        { type: 'setup', label: 'Set up' },
        { type: 'existing', label: 'Select existing' }
      ]
    },
    {
      id: 'conversation-starters',
      name: 'Conversation Starters',
      description: 'Preset buttons that appear when someone opens your chat.',
      status: 'active',
      actions: [
        { type: 'edit', label: 'Edit' }
      ]
    },
    {
      id: 'opt-in',
      name: 'Opt-in Automation',
      description: 'Triggers when user types START or SUBSCRIBE (system keywords, not editable).',
      status: 'inactive',
      actions: [
        { type: 'edit', label: 'Edit' }
      ]
    },
    {
      id: 'opt-out',
      name: 'Opt-out Automation',
      description: 'Triggers when user types STOP or UNSUBSCRIBE.',
      status: 'inactive',
      actions: [
        { type: 'edit', label: 'Edit' }
      ]
    },
    {
      id: 'story-mention',
      name: 'Story Mention Reply',
      description: 'Sends an auto-reply when someone mentions your account in their story.',
      status: 'active',
      actions: [
        { type: 'edit', label: 'Send / Edit' }
      ]
    }
  ];

  // Facebook/Messenger global automations (same as Instagram but without story mention)
  const facebookAutomations = [
    {
      id: 'default-reply',
      name: 'Default Reply',
      description: 'Sends a reply when the bot doesn\'t understand a message.',
      status: 'inactive',
      actions: [
        { type: 'create', label: 'Create manually' },
        { type: 'ai', label: 'Train with AI' }
      ]
    },
    {
      id: 'main-menu',
      name: 'Main Menu',
      description: 'Quick menu users can open from Messenger.',
      status: 'active',
      actions: [
        { type: 'edit', label: 'Edit' }
      ]
    },
    {
      id: 'welcome-followers',
      name: 'Say hi to new followers',
      description: 'Send a welcome message to people the moment they follow your page (1st time only).',
      status: 'inactive',
      actions: [
        { type: 'setup', label: 'Set up' },
        { type: 'existing', label: 'Select existing' }
      ]
    },
    {
      id: 'conversation-starters',
      name: 'Conversation Starters',
      description: 'Preset buttons that appear when someone opens your chat.',
      status: 'active',
      actions: [
        { type: 'edit', label: 'Edit' }
      ]
    },
    {
      id: 'opt-in',
      name: 'Opt-in Automation',
      description: 'Triggers when user types START or SUBSCRIBE (system keywords, not editable).',
      status: 'inactive',
      actions: [
        { type: 'edit', label: 'Edit' }
      ]
    },
    {
      id: 'opt-out',
      name: 'Opt-out Automation',
      description: 'Triggers when user types STOP or UNSUBSCRIBE.',
      status: 'inactive',
      actions: [
        { type: 'edit', label: 'Edit' }
      ]
    }
  ];

  // Telegram global automations (default reply, welcome message, opt-in, opt-out)
  const telegramAutomations = [
    {
      id: 'default-reply',
      name: 'Default Reply',
      description: 'Sends a reply when the bot doesn\'t understand a message.',
      status: 'inactive',
      actions: [
        { type: 'create', label: 'Create manually' },
        { type: 'ai', label: 'Train with AI' }
      ]
    },
    {
      id: 'welcome-message',
      name: 'Welcome Message',
      description: 'Send a welcome message when someone starts a conversation with your bot.',
      status: 'inactive',
      actions: [
        { type: 'setup', label: 'Set up' },
        { type: 'existing', label: 'Select existing' }
      ]
    },
    {
      id: 'opt-in',
      name: 'Opt-in Automation',
      description: 'Triggers when user types START or SUBSCRIBE (system keywords, not editable).',
      status: 'inactive',
      actions: [
        { type: 'edit', label: 'Edit' }
      ]
    },
    {
      id: 'opt-out',
      name: 'Opt-out Automation',
      description: 'Triggers when user types STOP or UNSUBSCRIBE.',
      status: 'inactive',
      actions: [
        { type: 'edit', label: 'Edit' }
      ]
    }
  ];

  // Get the appropriate automations based on channel type
  const currentAutomations = currentChannel?.type === 'telegram'
    ? telegramAutomations
    : currentChannel?.type === 'facebook' || currentChannel?.type === 'messenger'
    ? facebookAutomations
    : instagramAutomations;

  const handleAction = (automation, actionType) => {
    if (actionType === 'existing') {
      setSelectedAutomation(automation);
      setShowExistingFlowsModal(true);
    } else if (actionType === 'create' || actionType === 'setup') {
      // Route to specific setup pages based on automation type
      if (automation.id === 'welcome-followers') {
        router.push('/new-follower-automation');
      } else {
        // Open flow builder for other automations
        router.push(`/flows?brand=${currentBrand?.id}&channel=${currentChannel?.type}&automation=${automation.id}`);
      }
    } else if (actionType === 'edit') {
      // Route to specific edit pages based on automation type
      if (automation.id === 'main-menu') {
        router.push('/main-menu');
      } else if (automation.id === 'conversation-starters') {
        router.push('/conversation-starters');
      } else if (automation.id === 'opt-in') {
        router.push('/opt-in-automation');
      } else if (automation.id === 'opt-out') {
        router.push('/opt-out-automation');
      } else if (automation.id === 'story-mention') {
        router.push('/story-mention-reply');
      } else {
        // Open edit panel/modal for other automations (implement later)
        console.log('Edit:', automation.id);
      }
    } else if (actionType === 'ai') {
      // Open AI training flow
      console.log('AI training for:', automation.id);
    }
  };

  // Mock existing flows for modal
  const existingFlows = [
    { id: 'flow-1', name: 'Instagram Story Reply Automation', channel: 'Instagram' },
    { id: 'flow-2', name: 'Instagram DM Welcome Message', channel: 'Instagram' },
    { id: 'flow-3', name: 'Instagram Comment Auto-Reply', channel: 'Instagram' }
  ];

  // Channel Selector Modal Component (defined early to avoid hoisting issues)
  const ChannelSelectorModal = () => {
    const channels = getChannelsForCurrentBrand().filter(c => c.status === 'connected');
    const channelIcons = {
      instagram: '📷',
      facebook: '📘',
      whatsapp: '💬',
      telegram: '✈️',
      sms: '📱',
      tiktok: '🎵'
    };

    return (
      <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50" onClick={() => setShowChannelSelectorModal(false)}>
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-md w-full mx-4 overflow-hidden" onClick={(e) => e.stopPropagation()}>
          {/* Modal Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-white">Select a Channel</h2>
              <p className="text-sm text-blue-100 mt-1">Choose a channel for {currentBrand?.name}</p>
            </div>
            <button
              onClick={() => setShowChannelSelectorModal(false)}
              className="text-white hover:text-gray-200 text-2xl font-light"
            >
              ✕
            </button>
          </div>

          {/* Modal Body */}
          <div className="p-6">
            {channels.length > 0 ? (
              <>
                <div className="space-y-3 mb-4">
                  {channels.map((channel) => (
                    <button
                      key={channel.id}
                      onClick={() => {
                        selectChannel(channel.id);
                        setShowChannelSelectorModal(false);
                      }}
                      className="w-full bg-white dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-500 rounded-lg p-4 text-left transition-all hover:shadow-md group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="text-3xl">
                          {channelIcons[channel.type]}
                        </div>
                        <div className="flex-1">
                          <h3 className="text-sm font-bold text-black dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 capitalize">
                            {channel.type}
                          </h3>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {channel.name || 'Connected'}
                          </p>
                        </div>
                        <svg className="w-5 h-5 text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </button>
                  ))}
                </div>

                {/* Divider */}
                <div className="border-t border-gray-200 dark:border-gray-700 my-4"></div>

                {/* Connect New Channel Button */}
                <button
                  onClick={() => {
                    setShowChannelSelectorModal(false);
                    router.push(`/brands/${currentBrand.id}/channels`);
                  }}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium rounded-lg transition-all hover:shadow-md"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Connect New Channel
                </button>
              </>
            ) : (
              <div className="text-center py-8">
                <div className="text-4xl mb-3">📭</div>
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                  No connected channels found for this brand.
                </p>
                <button
                  onClick={() => {
                    setShowChannelSelectorModal(false);
                    router.push(`/brands/${currentBrand.id}/channels`);
                  }}
                  className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium rounded-lg transition-all"
                >
                  Connect a Channel
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  // If no brand at all, redirect to brands page
  if (!currentBrand) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900">
        <NavigationSidebar />
        <main className={`px-6 py-8 min-h-screen max-w-7xl mx-auto transition-all duration-300 ${isCollapsed ? 'ml-20' : 'ml-64'}`}>
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="text-5xl mb-4">⚠️</div>
              <h2 className="text-xl font-bold text-black dark:text-white mb-2">Select a Brand</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Please select a brand first
              </p>
              <button
                onClick={() => router.push('/brands')}
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-lg transition-all"
              >
                Go to Brands
              </button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // If brand exists but no channel, show channel selector modal
  if (!currentChannel) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900">
        <NavigationSidebar />
        <main className={`px-6 py-8 min-h-screen max-w-7xl mx-auto transition-all duration-300 ${isCollapsed ? 'ml-20' : 'ml-64'}`}>
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="text-5xl mb-4">📱</div>
              <h2 className="text-xl font-bold text-black dark:text-white mb-2">Select a Channel</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Please select a channel for <strong>{currentBrand.name}</strong> to view global automations
              </p>
              <button
                onClick={() => setShowChannelSelectorModal(true)}
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-lg transition-all"
              >
                Select Channel
              </button>
            </div>
          </div>
        </main>

        {/* Channel Selector Modal */}
        {showChannelSelectorModal && <ChannelSelectorModal />}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <NavigationSidebar />

      <main className={`px-6 py-8 min-h-screen max-w-5xl mx-auto transition-all duration-300 ${isCollapsed ? 'ml-20' : 'ml-64'}`}>
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-bold text-black dark:text-white">Global Automations</h1>
            <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs font-semibold rounded-full">
              {currentBrand.name} · {currentChannel.type}
            </span>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Set the automations that should always run for this channel (welcome, default reply, story mentions, opt-in/out, etc.)
          </p>
        </div>

        {/* Automations List */}
        <div className="space-y-3">
          {currentAutomations.map((automation) => (
            <div
              key={automation.id}
              className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-5 hover:border-gray-300 dark:hover:border-gray-600 transition-all"
            >
              <div className="flex items-start justify-between gap-4">
                {/* Left: Name and Description */}
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    {/* Status Indicator */}
                    <div className={`w-2 h-2 rounded-full ${
                      automation.status === 'active'
                        ? 'bg-green-500'
                        : 'bg-yellow-500'
                    }`} />
                    <h3 className="text-lg font-bold text-black dark:text-white">
                      {automation.name}
                    </h3>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 ml-5">
                    {automation.description}
                  </p>
                  {automation.status === 'inactive' && (
                    <span className="inline-block ml-5 mt-2 text-xs text-yellow-600 dark:text-yellow-400">
                      Not active
                    </span>
                  )}
                </div>

                {/* Right: Action Buttons */}
                <div className="flex items-center gap-2 flex-shrink-0">
                  {automation.actions.map((action, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleAction(automation, action.type)}
                      className={`px-4 py-2 font-medium text-sm rounded-lg transition-all ${
                        action.type === 'ai'
                          ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white'
                          : action.type === 'create' || action.type === 'setup'
                          ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white'
                          : action.type === 'existing'
                          ? 'bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 hover:border-blue-500 dark:hover:border-blue-500 text-gray-700 dark:text-gray-300'
                          : 'bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500 text-gray-700 dark:text-gray-300'
                      }`}
                    >
                      {action.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Future Note */}
        <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
          <p className="text-sm text-blue-700 dark:text-blue-300">
            💡 <strong>Tip:</strong> These automations are channel-specific. Switch to a different channel (e.g., Facebook, WhatsApp) to see their global automations.
          </p>
        </div>

        {/* Select Existing Flow Modal */}
        {showExistingFlowsModal && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50" onClick={() => setShowExistingFlowsModal(false)}>
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-2xl w-full mx-4 overflow-hidden" onClick={(e) => e.stopPropagation()}>
              {/* Modal Header */}
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4 flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-white">Select Existing Flow</h2>
                  <p className="text-sm text-blue-100 mt-1">Choose a flow to use for "{selectedAutomation?.name}"</p>
                </div>
                <button
                  onClick={() => setShowExistingFlowsModal(false)}
                  className="text-white hover:text-gray-200 text-2xl font-light"
                >
                  ✕
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-6">
                <div className="space-y-3">
                  {existingFlows.map((flow) => (
                    <button
                      key={flow.id}
                      onClick={() => {
                        console.log('Selected flow:', flow.id, 'for automation:', selectedAutomation?.id);
                        setShowExistingFlowsModal(false);
                      }}
                      className="w-full bg-white dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-500 rounded-lg p-4 text-left transition-all hover:shadow-md group"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-sm">
                            📷
                          </div>
                          <div>
                            <h3 className="text-sm font-bold text-black dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400">
                              {flow.name}
                            </h3>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              {flow.channel}
                            </p>
                          </div>
                        </div>
                        <svg className="w-5 h-5 text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </button>
                  ))}
                </div>

                {existingFlows.length === 0 && (
                  <div className="text-center py-12">
                    <div className="text-4xl mb-3">📭</div>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                      No existing flows found. Create a new flow instead.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default function GlobalAutomations() {
  return (
    <ProtectedRoute>
      <GlobalAutomationsContent />
    </ProtectedRoute>
  );
}
