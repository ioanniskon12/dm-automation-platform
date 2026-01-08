"use client";

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import ProtectedRoute from '../../../components/ProtectedRoute';
import NavigationSidebar from '../../../components/NavigationSidebar';
import { useSidebar } from '../../../contexts/SidebarContext';
import { api } from '../../../utils/api';

function CampaignDetailContent() {
  const { id } = useParams();
  const router = useRouter();
  const { isCollapsed } = useSidebar();

  const [campaign, setCampaign] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('messages');
  const [messageError, setMessageError] = useState(null);

  // Message editor state
  const [editingMessage, setEditingMessage] = useState(null);
  const [newMessage, setNewMessage] = useState({ content: '', delayMinutes: 0 });
  const [showAddMessage, setShowAddMessage] = useState(false);

  // Channel icons
  const channelIcons = {
    whatsapp: {
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
        </svg>
      ),
      color: 'text-green-500',
      bgColor: 'bg-green-100 dark:bg-green-900/30',
    },
    messenger: {
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 0C5.373 0 0 4.974 0 11.111c0 3.498 1.744 6.614 4.469 8.654V24l4.088-2.242c1.092.301 2.246.464 3.443.464 6.627 0 12-4.975 12-11.111S18.627 0 12 0zm1.191 14.963l-3.055-3.26-5.963 3.26L10.732 8l3.131 3.259L19.752 8l-6.561 6.963z"/>
        </svg>
      ),
      color: 'text-blue-500',
      bgColor: 'bg-blue-100 dark:bg-blue-900/30',
    },
    instagram: {
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
        </svg>
      ),
      color: 'text-pink-500',
      bgColor: 'bg-pink-100 dark:bg-pink-900/30',
    },
    sms: {
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H5.17L4 17.17V4h16v12zM7 9h2v2H7V9zm4 0h2v2h-2V9zm4 0h2v2h-2V9z"/>
        </svg>
      ),
      color: 'text-green-600',
      bgColor: 'bg-green-100 dark:bg-green-900/30',
    },
    telegram: {
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
        </svg>
      ),
      color: 'text-blue-400',
      bgColor: 'bg-blue-100 dark:bg-blue-900/30',
    },
  };

  // Get channel info
  const getChannelInfo = (channel) => {
    if (!channel) return null;
    const info = channelIcons[channel.type] || {
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      ),
      color: 'text-gray-500',
      bgColor: 'bg-gray-100 dark:bg-gray-700',
    };
    return { ...info, name: channel.name, type: channel.type };
  };

  // Fetch campaign
  useEffect(() => {
    const fetchCampaign = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/api/campaigns/${id}`);
        const data = await response.json();

        if (data.success) {
          setCampaign(data.campaign);
          setMessages(data.campaign.messages || []);
        } else {
          setError(data.error);
        }
      } catch (err) {
        setError('Failed to fetch campaign');
      } finally {
        setLoading(false);
      }
    };

    fetchCampaign();
  }, [id]);

  // Get channel rules
  const channelRules = campaign?.channelRules;
  const maxLength = channelRules?.messageConstraints?.maxLength || 4096;
  const currentLength = newMessage.content.length;
  const isOverLimit = currentLength > maxLength;

  const handleStatusChange = async (newStatus) => {
    try {
      setSaving(true);
      const endpoint = `/api/campaigns/${id}/${newStatus}`;
      const response = await api.post(endpoint);
      const data = await response.json();

      if (data.success) {
        setCampaign(data.campaign);
      } else {
        alert(data.error || 'Failed to update status');
      }
    } catch (err) {
      alert('Failed to update status');
    } finally {
      setSaving(false);
    }
  };

  const handleAddMessage = async () => {
    if (!newMessage.content.trim()) return;

    if (isOverLimit) {
      setMessageError(`Message exceeds ${maxLength} character limit for ${channelRules?.name || 'this channel'}`);
      return;
    }

    try {
      setSaving(true);
      setMessageError(null);
      const response = await api.post(`/api/campaigns/${id}/messages`, {
        content: newMessage.content,
        delayMinutes: parseInt(newMessage.delayMinutes) || 0,
      });
      const data = await response.json();

      if (data.success) {
        setMessages([...messages, data.message]);
        setNewMessage({ content: '', delayMinutes: 0 });
        setShowAddMessage(false);
      } else {
        setMessageError(data.validationErrors?.join(', ') || data.error);
      }
    } catch (err) {
      setMessageError('Failed to add message');
    } finally {
      setSaving(false);
    }
  };

  const handleUpdateMessage = async (messageId, updates) => {
    try {
      setSaving(true);
      const response = await api.put(`/api/campaigns/${id}/messages/${messageId}`, updates);
      const data = await response.json();

      if (data.success) {
        setMessages(messages.map(m => m.id === messageId ? data.message : m));
        setEditingMessage(null);
      } else {
        alert(data.validationErrors?.join(', ') || data.error);
      }
    } catch (err) {
      alert('Failed to update message');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteMessage = async (messageId) => {
    if (!confirm('Are you sure you want to delete this message?')) return;

    try {
      setSaving(true);
      const response = await api.delete(`/api/campaigns/${id}/messages/${messageId}`);
      const data = await response.json();

      if (data.success) {
        setMessages(messages.filter(m => m.id !== messageId));
      } else {
        alert(data.error);
      }
    } catch (err) {
      alert('Failed to delete message');
    } finally {
      setSaving(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      draft: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
      active: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
      paused: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
      scheduled: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
      completed: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
    };
    return colors[status] || colors.draft;
  };

  const formatDelay = (minutes) => {
    if (minutes === 0) return 'Immediately';
    if (minutes < 60) return `${minutes} min`;
    if (minutes < 1440) return `${Math.floor(minutes / 60)} hr`;
    return `${Math.floor(minutes / 1440)} day${Math.floor(minutes / 1440) > 1 ? 's' : ''}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !campaign) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900">
        <NavigationSidebar />
        <main className={`transition-all duration-300 pt-16 md:pt-8 px-4 md:px-6 py-6 md:py-8 ${isCollapsed ? 'md:ml-20' : 'md:ml-64'}`}>
          <div className="max-w-4xl mx-auto text-center py-12">
            <p className="text-red-500">{error || 'Campaign not found'}</p>
            <button
              onClick={() => router.push('/campaigns')}
              className="mt-4 text-blue-600 hover:underline"
            >
              Back to Campaigns
            </button>
          </div>
        </main>
      </div>
    );
  }

  const channelInfo = getChannelInfo(campaign.channel);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <NavigationSidebar />

      <main className={`transition-all duration-300 pt-16 md:pt-8 px-4 md:px-6 py-6 md:py-8 ${isCollapsed ? 'md:ml-20' : 'md:ml-64'}`}>
        <div className="max-w-4xl mx-auto">
          {/* Back Button */}
          <button
            onClick={() => router.push('/campaigns')}
            className="flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-4 transition-colors"
          >
            <svg className="w-5 h-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Campaigns
          </button>

          {/* Campaign Header */}
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 mb-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {campaign.name}
                  </h1>
                  <span className={`px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(campaign.status)}`}>
                    {campaign.status}
                  </span>
                </div>
                {campaign.description && (
                  <p className="text-gray-600 dark:text-gray-400">{campaign.description}</p>
                )}
                <div className="flex items-center gap-4 mt-2 text-sm text-gray-500 dark:text-gray-400">
                  <span className="capitalize">{campaign.type}</span>
                  <span>-</span>
                  <span>{messages.length} messages</span>
                  <span>-</span>
                  <span>{campaign._count?.subscribers || 0} subscribers</span>
                </div>

                {/* Channel Badge */}
                {channelInfo && (
                  <div className="flex items-center gap-2 mt-3">
                    <div className={`flex items-center gap-1.5 px-2 py-1 rounded-lg ${channelInfo.bgColor}`}>
                      <span className={channelInfo.color}>{channelInfo.icon}</span>
                      <span className={`text-sm font-medium ${channelInfo.color}`}>
                        {channelInfo.name}
                      </span>
                    </div>
                    {channelRules && (
                      <>
                        <span className="text-xs text-gray-400">-</span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          Max {channelRules.messageConstraints?.maxLength} chars
                        </span>
                        {channelRules.hasMessagingWindow && (
                          <>
                            <span className="text-xs text-gray-400">-</span>
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              {channelRules.messagingWindowHours}h messaging window
                            </span>
                          </>
                        )}
                      </>
                    )}
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2">
                {campaign.status === 'draft' && (
                  <button
                    onClick={() => handleStatusChange('activate')}
                    disabled={saving || messages.length === 0}
                    className={`px-4 py-2 rounded-lg font-medium transition-all ${
                      messages.length === 0
                        ? 'bg-gray-200 dark:bg-gray-700 text-gray-400 cursor-not-allowed'
                        : 'bg-green-600 text-white hover:bg-green-700'
                    }`}
                  >
                    Activate
                  </button>
                )}
                {campaign.status === 'active' && (
                  <button
                    onClick={() => handleStatusChange('pause')}
                    disabled={saving}
                    className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 font-medium transition-all"
                  >
                    Pause
                  </button>
                )}
                {campaign.status === 'paused' && (
                  <button
                    onClick={() => handleStatusChange('resume')}
                    disabled={saving}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium transition-all"
                  >
                    Resume
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Channel Rules Warning */}
          {channelRules?.warnings && channelRules.warnings.length > 0 && (
            <div className="mb-6 p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <div>
                  <h4 className="text-sm font-medium text-amber-800 dark:text-amber-200 mb-1">
                    {channelRules.name} Requirements
                  </h4>
                  <ul className="text-sm text-amber-700 dark:text-amber-300 space-y-1">
                    {channelRules.warnings.slice(0, 3).map((warning, i) => (
                      <li key={i}>- {warning}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Tabs */}
          <div className="flex border-b border-gray-200 dark:border-gray-700 mb-6">
            {['messages', 'subscribers', 'analytics'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-3 font-medium text-sm capitalize transition-colors ${
                  activeTab === tab
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Messages Tab */}
          {activeTab === 'messages' && (
            <div>
              {/* Message List */}
              <div className="space-y-4 mb-6">
                {messages.length === 0 ? (
                  <div className="text-center py-12 bg-gray-50 dark:bg-gray-800/50 rounded-xl border-2 border-dashed border-gray-200 dark:border-gray-700">
                    <svg className="w-12 h-12 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    <p className="text-gray-500 dark:text-gray-400 mb-4">No messages yet</p>
                    <button
                      onClick={() => setShowAddMessage(true)}
                      className="text-blue-600 hover:underline font-medium"
                    >
                      Add your first message
                    </button>
                  </div>
                ) : (
                  messages.map((message, index) => (
                    <div
                      key={message.id}
                      className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4"
                    >
                      {editingMessage === message.id ? (
                        <div className="space-y-4">
                          <div className="relative">
                            <textarea
                              defaultValue={message.content}
                              id={`edit-content-${message.id}`}
                              rows={3}
                              className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 resize-none"
                            />
                            {channelRules && (
                              <div className="absolute bottom-2 right-2 text-xs text-gray-400">
                                {message.content.length} / {maxLength}
                              </div>
                            )}
                          </div>
                          {campaign.type === 'evergreen' && (
                            <div className="flex items-center gap-2">
                              <label className="text-sm text-gray-600 dark:text-gray-400">Delay:</label>
                              <input
                                type="number"
                                defaultValue={message.delayMinutes}
                                id={`edit-delay-${message.id}`}
                                min="0"
                                className="w-24 px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                              />
                              <span className="text-sm text-gray-500">minutes</span>
                            </div>
                          )}
                          <div className="flex gap-2">
                            <button
                              onClick={() => {
                                const content = document.getElementById(`edit-content-${message.id}`).value;
                                const delay = document.getElementById(`edit-delay-${message.id}`)?.value || 0;
                                handleUpdateMessage(message.id, { content, delayMinutes: parseInt(delay) });
                              }}
                              className="px-3 py-1.5 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700"
                            >
                              Save
                            </button>
                            <button
                              onClick={() => setEditingMessage(null)}
                              className="px-3 py-1.5 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white text-sm"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div>
                          <div className="flex items-start justify-between">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-600 dark:text-blue-400 text-sm font-medium">
                                {index + 1}
                              </div>
                              <div>
                                {campaign.type === 'evergreen' && index > 0 && (
                                  <span className="text-xs text-gray-500 dark:text-gray-400 block mb-1">
                                    Wait {formatDelay(message.delayMinutes)}
                                  </span>
                                )}
                                <p className="text-gray-900 dark:text-white whitespace-pre-wrap">
                                  {message.content}
                                </p>
                                <span className="text-xs text-gray-400 mt-1">
                                  {message.content.length} chars
                                </span>
                              </div>
                            </div>
                            <div className="flex items-center gap-1">
                              <button
                                onClick={() => setEditingMessage(message.id)}
                                className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg"
                              >
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                              </button>
                              <button
                                onClick={() => handleDeleteMessage(message.id)}
                                className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"
                              >
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>

              {/* Add Message Form */}
              {showAddMessage ? (
                <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Add Message</h3>

                  {/* Channel constraints info */}
                  {channelRules && (
                    <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <span className={channelInfo?.color}>{channelInfo?.icon}</span>
                        <span>{channelRules.name} - Max {maxLength} characters</span>
                        {channelRules.messageConstraints?.supportsButtons && (
                          <>
                            <span>-</span>
                            <span>Max {channelRules.messageConstraints.maxButtons} buttons</span>
                          </>
                        )}
                      </div>
                    </div>
                  )}

                  <div className="space-y-4">
                    <div className="relative">
                      <textarea
                        value={newMessage.content}
                        onChange={(e) => {
                          setNewMessage({ ...newMessage, content: e.target.value });
                          setMessageError(null);
                        }}
                        placeholder="Enter your message..."
                        rows={4}
                        className={`w-full px-4 py-3 rounded-lg border bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 resize-none ${
                          isOverLimit
                            ? 'border-red-500 focus:ring-red-500'
                            : 'border-gray-200 dark:border-gray-700 focus:ring-blue-500'
                        }`}
                      />
                      <div className={`absolute bottom-2 right-2 text-xs ${
                        isOverLimit ? 'text-red-500' : 'text-gray-400'
                      }`}>
                        {currentLength} / {maxLength}
                      </div>
                    </div>

                    {isOverLimit && (
                      <p className="text-sm text-red-500">
                        Message exceeds {maxLength} character limit for {channelRules?.name}
                      </p>
                    )}

                    {messageError && (
                      <p className="text-sm text-red-500">{messageError}</p>
                    )}

                    {campaign.type === 'evergreen' && messages.length > 0 && (
                      <div className="flex items-center gap-2">
                        <label className="text-sm text-gray-600 dark:text-gray-400">
                          Wait before sending:
                        </label>
                        <input
                          type="number"
                          value={newMessage.delayMinutes}
                          onChange={(e) => setNewMessage({ ...newMessage, delayMinutes: e.target.value })}
                          min="0"
                          className="w-24 px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                        />
                        <span className="text-sm text-gray-500 dark:text-gray-400">minutes</span>
                      </div>
                    )}
                    <div className="flex gap-2">
                      <button
                        onClick={handleAddMessage}
                        disabled={!newMessage.content.trim() || saving || isOverLimit}
                        className={`px-4 py-2 rounded-lg font-medium transition-all ${
                          newMessage.content.trim() && !saving && !isOverLimit
                            ? 'bg-blue-600 text-white hover:bg-blue-700'
                            : 'bg-gray-200 dark:bg-gray-700 text-gray-400 cursor-not-allowed'
                        }`}
                      >
                        {saving ? 'Adding...' : 'Add Message'}
                      </button>
                      <button
                        onClick={() => {
                          setShowAddMessage(false);
                          setNewMessage({ content: '', delayMinutes: 0 });
                          setMessageError(null);
                        }}
                        className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => setShowAddMessage(true)}
                  className="w-full py-3 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-xl text-gray-500 dark:text-gray-400 hover:border-blue-400 hover:text-blue-600 dark:hover:border-blue-600 dark:hover:text-blue-400 transition-colors flex items-center justify-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Add Message
                </button>
              )}
            </div>
          )}

          {/* Subscribers Tab */}
          {activeTab === 'subscribers' && (
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
              <p className="text-center text-gray-500 dark:text-gray-400 py-8">
                Subscriber management coming soon...
              </p>
            </div>
          )}

          {/* Analytics Tab */}
          {activeTab === 'analytics' && (
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4">
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">{campaign.totalSent || 0}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Sent</p>
                </div>
                <div className="text-center p-4">
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">{campaign.totalDelivered || 0}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Delivered</p>
                </div>
                <div className="text-center p-4">
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">{campaign._count?.subscribers || 0}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Subscribers</p>
                </div>
                <div className="text-center p-4">
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">
                    {campaign.totalSent > 0
                      ? `${((campaign.totalDelivered / campaign.totalSent) * 100).toFixed(1)}%`
                      : '0%'}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Delivery Rate</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default function CampaignDetailPage() {
  return (
    <ProtectedRoute>
      <CampaignDetailContent />
    </ProtectedRoute>
  );
}
