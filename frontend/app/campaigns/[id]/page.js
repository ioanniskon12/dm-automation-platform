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

  // Message editor state
  const [editingMessage, setEditingMessage] = useState(null);
  const [newMessage, setNewMessage] = useState({ content: '', delayMinutes: 0 });
  const [showAddMessage, setShowAddMessage] = useState(false);

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

    try {
      setSaving(true);
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
        alert(data.error);
      }
    } catch (err) {
      alert('Failed to add message');
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
        alert(data.error);
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
                  <span>•</span>
                  <span>{messages.length} messages</span>
                  <span>•</span>
                  <span>{campaign._count?.subscribers || 0} subscribers</span>
                </div>
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
                          <textarea
                            defaultValue={message.content}
                            id={`edit-content-${message.id}`}
                            rows={3}
                            className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 resize-none"
                          />
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
                  <div className="space-y-4">
                    <textarea
                      value={newMessage.content}
                      onChange={(e) => setNewMessage({ ...newMessage, content: e.target.value })}
                      placeholder="Enter your message..."
                      rows={4}
                      className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 resize-none"
                    />
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
                        disabled={!newMessage.content.trim() || saving}
                        className={`px-4 py-2 rounded-lg font-medium transition-all ${
                          newMessage.content.trim() && !saving
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
