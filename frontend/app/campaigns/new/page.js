"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import ProtectedRoute from '../../../components/ProtectedRoute';
import NavigationSidebar from '../../../components/NavigationSidebar';
import { useSidebar } from '../../../contexts/SidebarContext';
import { useBrandChannel } from '../../../contexts/BrandChannelContext';
import { api } from '../../../utils/api';

function NewCampaignContent() {
  const { isCollapsed } = useSidebar();
  const { getCurrentBrand } = useBrandChannel();
  const currentBrand = getCurrentBrand();
  const router = useRouter();

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Form state
  const [campaignType, setCampaignType] = useState(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [editorType, setEditorType] = useState('simple');

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

  const handleCreateCampaign = async () => {
    if (!name.trim()) {
      setError('Please enter a campaign name');
      return;
    }

    if (!currentBrand) {
      setError('Please select a brand first');
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
    if (step === 1) return !!campaignType;
    if (step === 2) return !!name.trim();
    if (step === 3) return !!editorType;
    return false;
  };

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      handleCreateCampaign();
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
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
            {[1, 2, 3].map((s) => (
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
                {s < 3 && (
                  <div
                    className={`w-24 md:w-32 h-1 mx-2 rounded ${
                      s < step ? 'bg-green-500' : 'bg-gray-200 dark:bg-gray-700'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>

          {/* Step Content */}
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 md:p-8">
            {/* Step 1: Choose Type */}
            {step === 1 && (
              <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  Choose Campaign Type
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Select the type of campaign you want to create
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {campaignTypes.map((type) => (
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
              </div>
            )}

            {/* Step 2: Campaign Details */}
            {step === 2 && (
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
                </div>
              </div>
            )}

            {/* Step 3: Choose Editor */}
            {step === 3 && (
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
                ) : step === 3 ? (
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
