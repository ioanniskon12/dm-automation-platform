"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import ProtectedRoute from '../../components/ProtectedRoute';
import NavigationSidebar from '../../components/NavigationSidebar';
import { useSidebar } from '../../contexts/SidebarContext';
import { useBrandChannel } from '../../contexts/BrandChannelContext';
import { api } from '../../utils/api';

function CampaignsContent() {
  const { isCollapsed } = useSidebar();
  const { getCurrentBrand, getCurrentChannel } = useBrandChannel();
  const currentBrand = getCurrentBrand();
  const currentChannel = getCurrentChannel();
  const router = useRouter();

  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  // Fetch campaigns
  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        setLoading(true);
        const params = new URLSearchParams();
        if (currentBrand) params.append('workspaceId', currentBrand.id);
        if (typeFilter !== 'all') params.append('type', typeFilter);
        if (statusFilter !== 'all') params.append('status', statusFilter);

        const response = await api.get(`/api/campaigns?${params.toString()}`);
        const data = await response.json();

        if (data.success) {
          setCampaigns(data.campaigns);
        } else {
          setError(data.error);
        }
      } catch (err) {
        setError('Failed to fetch campaigns');
      } finally {
        setLoading(false);
      }
    };

    fetchCampaigns();
  }, [currentBrand, typeFilter, statusFilter]);

  const handleDeleteCampaign = async (id, e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!confirm('Are you sure you want to delete this campaign?')) return;

    try {
      const response = await api.delete(`/api/campaigns/${id}`);
      const data = await response.json();

      if (data.success) {
        setCampaigns(campaigns.filter(c => c.id !== id));
      }
    } catch (err) {
      alert('Failed to delete campaign');
    }
  };

  const handleDuplicateCampaign = async (id, e) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      const response = await api.post(`/api/campaigns/${id}/duplicate`);
      const data = await response.json();

      if (data.success) {
        setCampaigns([data.campaign, ...campaigns]);
      }
    } catch (err) {
      alert('Failed to duplicate campaign');
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

  const getTypeIcon = (type) => {
    if (type === 'evergreen') {
      return (
        <svg className="w-5 h-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
      );
    }
    return (
      <svg className="w-5 h-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
      </svg>
    );
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <NavigationSidebar />

      <main className={`transition-all duration-300 pt-16 md:pt-8 px-4 md:px-6 py-6 md:py-8 ${isCollapsed ? 'md:ml-20' : 'md:ml-64'}`}>
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                Campaigns
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Create and manage your evergreen sequences and broadcast campaigns
              </p>
            </div>

            <Link
              href="/campaigns/new"
              className="inline-flex items-center justify-center px-4 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl font-medium"
            >
              <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Create Campaign
            </Link>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-4 mb-6">
            {/* Type Filter */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600 dark:text-gray-400">Type:</span>
              <div className="flex rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
                {[
                  { value: 'all', label: 'All' },
                  { value: 'evergreen', label: 'Evergreen' },
                  { value: 'broadcast', label: 'Broadcast' },
                ].map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setTypeFilter(option.value)}
                    className={`px-3 py-1.5 text-sm font-medium transition-colors ${
                      typeFilter === option.value
                        ? 'bg-blue-600 text-white'
                        : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Status Filter */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600 dark:text-gray-400">Status:</span>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-1.5 text-sm rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300"
              >
                <option value="all">All Statuses</option>
                <option value="draft">Draft</option>
                <option value="active">Active</option>
                <option value="paused">Paused</option>
                <option value="scheduled">Scheduled</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6">
              <p className="text-red-600 dark:text-red-400">{error}</p>
            </div>
          )}

          {/* Empty State */}
          {!loading && !error && campaigns.length === 0 && (
            <div className="text-center py-16 bg-gray-50 dark:bg-gray-800/50 rounded-xl border-2 border-dashed border-gray-200 dark:border-gray-700">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                No campaigns yet
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
                Create your first campaign to start engaging with your audience through automated sequences or one-time broadcasts.
              </p>
              <Link
                href="/campaigns/new"
                className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all font-medium"
              >
                <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Create Your First Campaign
              </Link>
            </div>
          )}

          {/* Campaigns Grid */}
          {!loading && !error && campaigns.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {campaigns.map((campaign) => (
                <Link
                  key={campaign.id}
                  href={`/campaigns/${campaign.id}`}
                  className="group bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg hover:border-blue-300 dark:hover:border-blue-600 transition-all"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      {getTypeIcon(campaign.type)}
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                          {campaign.name}
                        </h3>
                        <span className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                          {campaign.type}
                        </span>
                      </div>
                    </div>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(campaign.status)}`}>
                      {campaign.status}
                    </span>
                  </div>

                  {campaign.description && (
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                      {campaign.description}
                    </p>
                  )}

                  <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-4">
                    <span>{campaign._count?.messages || 0} messages</span>
                    <span>{campaign._count?.subscribers || 0} subscribers</span>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-700">
                    <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                      <span>{campaign.totalSent || 0} sent</span>
                      <span>•</span>
                      <span>{campaign.totalDelivered || 0} delivered</span>
                    </div>

                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={(e) => handleDuplicateCampaign(campaign.id, e)}
                        className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                        title="Duplicate"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                      </button>
                      <button
                        onClick={(e) => handleDeleteCampaign(campaign.id, e)}
                        className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                        title="Delete"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default function CampaignsPage() {
  return (
    <ProtectedRoute>
      <CampaignsContent />
    </ProtectedRoute>
  );
}
