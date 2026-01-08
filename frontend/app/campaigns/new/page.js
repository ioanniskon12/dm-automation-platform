"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ProtectedRoute from '../../../components/ProtectedRoute';
import NavigationSidebar from '../../../components/NavigationSidebar';
import { useSidebar } from '../../../contexts/SidebarContext';
import { useBrandChannel } from '../../../contexts/BrandChannelContext';

function NewCampaignContent() {
  const { isCollapsed } = useSidebar();
  const { getCurrentBrand } = useBrandChannel();
  const currentBrand = getCurrentBrand();
  const router = useRouter();

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [loadingChannels, setLoadingChannels] = useState(true);
  const [error, setError] = useState(null);

  // Channels and rules
  const [channels, setChannels] = useState([]);
  const [channelRules, setChannelRules] = useState({});
  const [selectedChannel, setSelectedChannel] = useState(null);

  // Form state
  const [campaignType, setCampaignType] = useState(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [editorType, setEditorType] = useState('simple');

  // Channel icons and colors
  const channelMeta = {
    whatsapp: {
      icon: (
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
        </svg>
      ),
      color: '#25D366',
      gradient: 'from-green-500 to-green-600',
    },
    messenger: {
      icon: (
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 0C5.373 0 0 4.974 0 11.111c0 3.498 1.744 6.614 4.469 8.654V24l4.088-2.242c1.092.301 2.246.464 3.443.464 6.627 0 12-4.975 12-11.111S18.627 0 12 0zm1.191 14.963l-3.055-3.26-5.963 3.26L10.732 8l3.131 3.259L19.752 8l-6.561 6.963z"/>
        </svg>
      ),
      color: '#0084FF',
      gradient: 'from-blue-500 to-blue-600',
    },
    instagram: {
      icon: (
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
        </svg>
      ),
      color: '#E4405F',
      gradient: 'from-pink-500 to-purple-600',
    },
    sms: {
      icon: (
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
          <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H5.17L4 17.17V4h16v12zM7 9h2v2H7V9zm4 0h2v2h-2V9zm4 0h2v2h-2V9z"/>
        </svg>
      ),
      color: '#4CAF50',
      gradient: 'from-green-500 to-teal-600',
    },
    telegram: {
      icon: (
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
          <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
        </svg>
      ),
      color: '#0088CC',
      gradient: 'from-blue-400 to-blue-600',
    },
  };

  const campaignTypes = [
    {
      id: 'evergreen',
      name: 'Evergreen Campaign',
      description: 'Automated sequences that run continuously for each subscriber',
      icon: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
      ),
      color: 'from-green-500 to-emerald-600',
      features: ['Welcome sequences', '5-day challenges', 'Drip campaigns', 'Onboarding series'],
    },
    {
      id: 'broadcast',
      name: 'Broadcast Campaign',
      description: 'One-time messages sent to all contacts or a filtered segment',
      icon: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
        </svg>
      ),
      color: 'from-blue-500 to-indigo-600',
      features: ['Promotions', 'Announcements', 'Updates', 'Scheduled messages'],
    },
  ];

  const editorTypes = [
    {
      id: 'simple',
      name: 'Simple Editor',
      description: 'Easy-to-use message composer for basic campaigns',
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
        </svg>
      ),
      recommended: true,
    },
    {
      id: 'flow',
      name: 'Flow Builder',
      description: 'Advanced visual flow builder for complex automations',
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
        </svg>
      ),
      recommended: false,
    },
  ];

  // Fetch channels and rules on mount
  useEffect(() => {
    const fetchData = async () => {
      if (!currentBrand) return;

      setLoadingChannels(true);
      try {
        // Fetch channels for this workspace
        const channelsRes = await fetch(`http://localhost:3002/api/channels?workspaceId=${currentBrand.id}`);
        const channelsData = await channelsRes.json();

        // Fetch channel rules
        const rulesRes = await fetch('http://localhost:3002/api/campaigns/channel-rules');
        const rulesData = await rulesRes.json();

        if (channelsData.success) {
          setChannels(channelsData.channels || []);
        }
        if (rulesData.success) {
          setChannelRules(rulesData.rules || {});
        }
      } catch (err) {
        console.error('Error fetching data:', err);
      } finally {
        setLoadingChannels(false);
      }
    };

    fetchData();
  }, [currentBrand]);

  // Get selected channel rules
  const selectedChannelRules = selectedChannel?.type ? channelRules[selectedChannel.type] : null;

  // Get available campaign types based on channel
  const getAvailableCampaignTypes = () => {
    if (!selectedChannelRules) return campaignTypes;
    return campaignTypes.filter(type =>
      selectedChannelRules.supportedCampaignTypes?.includes(type.id)
    );
  };

  const handleCreateCampaign = async () => {
    if (!name.trim()) {
      setError('Please enter a campaign name');
      return;
    }

    if (!currentBrand) {
      setError('Please select a brand first');
      return;
    }

    if (!selectedChannel) {
      setError('Please select a channel for this campaign');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('http://localhost:3002/api/campaigns', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          workspaceId: currentBrand.id,
          channelId: selectedChannel.id,
          name: name.trim(),
          description: description.trim() || null,
          type: campaignType,
          editorType,
        }),
      });

      const data = await response.json();

      if (data.success) {
        router.push(`/campaigns/${data.campaign.id}`);
      } else {
        setError(data.error || 'Failed to create campaign');
      }
    } catch (err) {
      console.error('Campaign creation error:', err);
      setError(err.message || 'Failed to create campaign');
    } finally {
      setLoading(false);
    }
  };

  const canProceed = () => {
    if (step === 1) return !!selectedChannel;
    if (step === 2) return !!campaignType;
    if (step === 3) return !!name.trim();
    if (step === 4) return !!editorType;
    return false;
  };

  const handleNext = () => {
    if (step < 4) {
      setStep(step + 1);
    } else {
      handleCreateCampaign();
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
      // Reset campaign type if going back to channel selection
      if (step === 2) {
        setCampaignType(null);
      }
    }
  };

  const handleChannelSelect = (channel) => {
    setSelectedChannel(channel);
    // Reset campaign type when channel changes
    setCampaignType(null);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <NavigationSidebar />

      <main className={`transition-all duration-300 pt-16 md:pt-8 px-4 md:px-6 py-6 md:py-8 ${isCollapsed ? 'md:ml-20' : 'md:ml-64'}`}>
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <button
              onClick={() => router.push('/campaigns')}
              className="flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-4 transition-colors"
            >
              <svg className="w-5 h-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Campaigns
            </button>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
              Create New Campaign
            </h1>
          </div>

          {/* Progress Steps */}
          <div className="flex items-center justify-between mb-8">
            {[1, 2, 3, 4].map((s) => (
              <div key={s} className="flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center font-medium transition-colors ${
                    s === step
                      ? 'bg-blue-600 text-white'
                      : s < step
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
                  }`}
                >
                  {s < step ? (
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    s
                  )}
                </div>
                {s < 4 && (
                  <div
                    className={`w-16 md:w-24 h-1 mx-2 rounded ${
                      s < step ? 'bg-green-500' : 'bg-gray-200 dark:bg-gray-700'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>

          {/* Step Content */}
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 md:p-8">
            {/* Step 1: Choose Channel */}
            {step === 1 && (
              <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  Select Channel
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Choose the messaging channel for this campaign
                </p>

                {loadingChannels ? (
                  <div className="flex items-center justify-center py-12">
                    <svg className="animate-spin h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                  </div>
                ) : channels.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                      No channels connected
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                      Connect a messaging channel first to create campaigns
                    </p>
                    <button
                      onClick={() => router.push('/channels')}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Connect Channel
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {channels.map((channel) => {
                      const meta = channelMeta[channel.type] || {};
                      const rules = channelRules[channel.type];

                      return (
                        <button
                          key={channel.id}
                          onClick={() => handleChannelSelect(channel)}
                          className={`p-5 rounded-xl border-2 text-left transition-all ${
                            selectedChannel?.id === channel.id
                              ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                              : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                          }`}
                        >
                          <div className="flex items-start gap-4">
                            <div
                              className={`w-12 h-12 rounded-xl bg-gradient-to-br ${meta.gradient || 'from-gray-500 to-gray-600'} flex items-center justify-center text-white`}
                            >
                              {meta.icon || (
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                </svg>
                              )}
                            </div>
                            <div className="flex-1">
                              <h3 className="font-semibold text-gray-900 dark:text-white">
                                {channel.name}
                              </h3>
                              <p className="text-sm text-gray-500 dark:text-gray-400 capitalize">
                                {channel.type}
                              </p>
                              {rules && (
                                <div className="mt-2 flex flex-wrap gap-1">
                                  {rules.hasMessagingWindow && (
                                    <span className="text-xs px-2 py-0.5 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 rounded">
                                      {rules.messagingWindowHours}h window
                                    </span>
                                  )}
                                  {rules.requiresTemplateApproval && (
                                    <span className="text-xs px-2 py-0.5 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded">
                                      Templates required
                                    </span>
                                  )}
                                  <span className="text-xs px-2 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded">
                                    {rules.messageConstraints?.maxLength} chars
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}

                {/* Channel warnings */}
                {selectedChannelRules?.warnings && selectedChannelRules.warnings.length > 0 && (
                  <div className="mt-6 p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
                    <div className="flex items-start gap-3">
                      <svg className="w-5 h-5 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                      <div>
                        <h4 className="text-sm font-medium text-amber-800 dark:text-amber-200 mb-1">
                          {selectedChannelRules.name} Campaign Requirements
                        </h4>
                        <ul className="text-sm text-amber-700 dark:text-amber-300 space-y-1">
                          {selectedChannelRules.warnings.map((warning, i) => (
                            <li key={i}>- {warning}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Step 2: Choose Type */}
            {step === 2 && (
              <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  Choose Campaign Type
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Select the type of campaign you want to create for {selectedChannel?.name}
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {getAvailableCampaignTypes().map((type) => (
                    <button
                      key={type.id}
                      onClick={() => setCampaignType(type.id)}
                      className={`p-6 rounded-xl border-2 text-left transition-all ${
                        campaignType === type.id
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                          : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                      }`}
                    >
                      <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${type.color} flex items-center justify-center text-white mb-4`}>
                        {type.icon}
                      </div>
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                        {type.name}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                        {type.description}
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {type.features.map((feature, i) => (
                          <span
                            key={i}
                            className="text-xs px-2 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded"
                          >
                            {feature}
                          </span>
                        ))}
                      </div>
                    </button>
                  ))}
                </div>

                {getAvailableCampaignTypes().length < campaignTypes.length && (
                  <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
                    Some campaign types are not available for {selectedChannel?.type}
                  </p>
                )}
              </div>
            )}

            {/* Step 3: Campaign Details */}
            {step === 3 && (
              <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  Campaign Details
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Give your campaign a name and description
                </p>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Campaign Name *
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g., Welcome Series, Black Friday Promo"
                      className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Description (optional)
                    </label>
                    <textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Describe what this campaign does..."
                      rows={3}
                      className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                    />
                  </div>

                  {/* Channel info badge */}
                  <div className="flex items-center gap-2 p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                    <div
                      className={`w-8 h-8 rounded-lg bg-gradient-to-br ${channelMeta[selectedChannel?.type]?.gradient || 'from-gray-500 to-gray-600'} flex items-center justify-center text-white`}
                    >
                      {channelMeta[selectedChannel?.type]?.icon}
                    </div>
                    <div className="text-sm">
                      <span className="text-gray-500 dark:text-gray-400">Channel: </span>
                      <span className="font-medium text-gray-900 dark:text-white">{selectedChannel?.name}</span>
                    </div>
                    <div className="ml-auto text-sm">
                      <span className="text-gray-500 dark:text-gray-400">Type: </span>
                      <span className="font-medium text-gray-900 dark:text-white capitalize">{campaignType}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Choose Editor */}
            {step === 4 && (
              <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  Choose Editor Type
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Select how you want to create your campaign messages
                </p>

                <div className="space-y-3">
                  {editorTypes.map((editor) => (
                    <button
                      key={editor.id}
                      onClick={() => setEditorType(editor.id)}
                      className={`w-full p-4 rounded-xl border-2 text-left transition-all flex items-center gap-4 ${
                        editorType === editor.id
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                          : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                      }`}
                    >
                      <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                        editorType === editor.id
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                      }`}>
                        {editor.icon}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-gray-900 dark:text-white">
                            {editor.name}
                          </h3>
                          {editor.recommended && (
                            <span className="text-xs px-2 py-0.5 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 rounded-full">
                              Recommended
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {editor.description}
                        </p>
                      </div>
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        editorType === editor.id
                          ? 'border-blue-500 bg-blue-500'
                          : 'border-gray-300 dark:border-gray-600'
                      }`}>
                        {editorType === editor.id && (
                          <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </div>
                    </button>
                  ))}
                </div>

                {/* Summary */}
                <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Campaign Summary</h4>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <span className="text-gray-500 dark:text-gray-400">Channel:</span>
                      <div className="font-medium text-gray-900 dark:text-white">{selectedChannel?.name}</div>
                    </div>
                    <div>
                      <span className="text-gray-500 dark:text-gray-400">Type:</span>
                      <div className="font-medium text-gray-900 dark:text-white capitalize">{campaignType}</div>
                    </div>
                    <div>
                      <span className="text-gray-500 dark:text-gray-400">Name:</span>
                      <div className="font-medium text-gray-900 dark:text-white">{name}</div>
                    </div>
                    <div>
                      <span className="text-gray-500 dark:text-gray-400">Max message:</span>
                      <div className="font-medium text-gray-900 dark:text-white">
                        {selectedChannelRules?.messageConstraints?.maxLength || 'N/A'} chars
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={handleBack}
                disabled={step === 1}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  step === 1
                    ? 'text-gray-400 cursor-not-allowed'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                Back
              </button>

              <button
                onClick={handleNext}
                disabled={!canProceed() || loading}
                className={`px-6 py-2 rounded-lg font-medium transition-all ${
                  canProceed() && !loading
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-400 cursor-not-allowed'
                }`}
              >
                {loading ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Creating...
                  </span>
                ) : step === 4 ? (
                  'Create Campaign'
                ) : (
                  'Continue'
                )}
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function NewCampaignPage() {
  return (
    <ProtectedRoute>
      <NewCampaignContent />
    </ProtectedRoute>
  );
}
