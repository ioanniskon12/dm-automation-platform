"use client";

export const dynamic = 'force-dynamic';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import FlowBuilder from "../../components/FlowBuilder";
import NavigationSidebar from "../../components/NavigationSidebar";
import ProtectedRoute from "../../components/ProtectedRoute";
import { useSidebar } from "../../contexts/SidebarContext";

function FlowsPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isCollapsed } = useSidebar();
  const [loading, setLoading] = useState(true);
  const [brandData, setBrandData] = useState(null);
  const [channelData, setChannelData] = useState(null);
  const [error, setError] = useState(null);
  const [selectedTemplate, setSelectedTemplate] = useState(null);

  // Check if user wants to skip templates (start from scratch)
  const mode = searchParams.get('mode');
  const [showTemplates, setShowTemplates] = useState(mode !== 'scratch');

  // Instagram flow templates
  const instagramTemplates = [
    {
      id: 'ig-story-reply',
      name: 'Instagram Story Reply Automation',
      description: 'Auto-reply to story mentions with a welcome message and drive engagement',
      icon: '📖',
      complexity: 'Beginner',
      estimatedTime: '5 min',
      features: ['Story Mention Trigger', 'Auto Reply', 'Welcome Message'],
    },
    {
      id: 'ig-dm-welcome',
      name: 'Instagram DM Welcome Message',
      description: 'Send automated welcome message to new followers who send a DM',
      icon: '💬',
      complexity: 'Beginner',
      estimatedTime: '3 min',
      features: ['DM Trigger', 'Welcome Message', 'Auto Response'],
    },
    {
      id: 'ig-comment-reply',
      name: 'Instagram Comment Auto-Reply',
      description: 'Automatically reply to comments with specific keywords on posts',
      icon: '💭',
      complexity: 'Intermediate',
      estimatedTime: '7 min',
      features: ['Comment Trigger', 'Keyword Detection', 'Auto Reply to DM'],
    },
    {
      id: 'ig-lead-collection',
      name: 'Instagram Lead Collection',
      description: 'Collect customer information (name, email, phone) through DM conversations',
      icon: '📝',
      complexity: 'Advanced',
      estimatedTime: '10 min',
      features: ['DM Trigger', 'Data Collection', 'Form Builder', 'CRM Integration'],
    },
    {
      id: 'ig-post-engagement',
      name: 'Instagram Post Engagement Flow',
      description: 'Thank users who comment on your posts and drive them to DMs',
      icon: '❤️',
      complexity: 'Intermediate',
      estimatedTime: '8 min',
      features: ['Comment Trigger', 'Thank You Message', 'CTA to DM'],
    },
    {
      id: 'ig-faq-responder',
      name: 'Instagram FAQ Auto-Responder',
      description: 'Answer frequently asked questions automatically in DMs with AI',
      icon: '🤖',
      complexity: 'Advanced',
      estimatedTime: '12 min',
      features: ['DM Trigger', 'AI Response', 'Knowledge Base', 'Fallback to Human'],
    },
  ];

  useEffect(() => {
    const validateBrandAndChannel = async () => {
      const brandId = searchParams.get('brand');
      const channelType = searchParams.get('channel');

      // Check if both brand and channel are provided
      if (!brandId || !channelType) {
        router.push('/brands');
        return;
      }

      try {
        // Validate brand exists and get channel info
        const response = await fetch(`/api/brands/${brandId}/channels`);
        const data = await response.json();

        if (!data.success) {
          setError('Brand not found');
          setTimeout(() => router.push('/brands'), 2000);
          return;
        }

        // Find the specific channel
        const channel = data.channels.find(ch => ch.type === channelType);

        if (!channel) {
          setError('Channel not found');
          setTimeout(() => router.push(`/brands/${brandId}/channels`), 2000);
          return;
        }

        // Check if channel is connected
        if (channel.status !== 'connected') {
          setError(`${channelType} is not connected. Please connect it first.`);
          setTimeout(() => router.push(`/brands/${brandId}/channels`), 2000);
          return;
        }

        // Everything is valid
        console.log('🔍 flows/page.js - channel from API:', channel);
        console.log('🔍 flows/page.js - channel.type:', channel?.type);
        console.log('🔍 flows/page.js - brandData:', data.brand);
        console.log('🔍 flows/page.js - brandData.id:', data.brand?.id);
        setBrandData(data.brand);
        setChannelData(channel);
        setLoading(false);
      } catch (err) {
        console.error('Error validating brand/channel:', err);
        setError('Failed to validate brand and channel');
        setTimeout(() => router.push('/brands'), 2000);
      }
    };

    validateBrandAndChannel();
  }, [searchParams, router]);

  if (loading) {
    return (
      <>
        <NavigationSidebar />
        <div className={`h-screen flex items-center justify-center bg-white dark:bg-gray-900 transition-all duration-300 pt-14 md:pt-0 ${isCollapsed ? 'md:ml-20' : 'md:ml-64'}`}>
          <div className="text-center">
            <div className="inline-block w-8 h-8 border-2 border-black dark:border-white border-t-transparent rounded-full animate-spin mb-2"></div>
            <p className="text-black dark:text-white text-sm">Loading flow builder...</p>
          </div>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <NavigationSidebar />
        <div className={`h-screen flex items-center justify-center bg-white dark:bg-gray-900 transition-all duration-300 pt-14 md:pt-0 ${isCollapsed ? 'md:ml-20' : 'md:ml-64'}`}>
          <div className="text-center px-4">
            <div className="text-3xl mb-2">⚠️</div>
            <h2 className="text-lg font-bold text-black dark:text-white mb-2">Access Error</h2>
            <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">{error}</p>
            <p className="text-xs text-gray-500 dark:text-gray-500">Redirecting...</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <NavigationSidebar />

      {/* Main Content Area - positioned to the right of sidebar with smooth transition */}
      <div className={`fixed right-0 top-14 md:top-0 bottom-0 left-0 flex flex-col bg-white dark:bg-gray-900 transition-all duration-300 ${isCollapsed ? 'md:left-20' : 'md:left-64'}`}>
        {/* Brand/Channel Context Bar */}
        <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 px-3 md:px-4 py-2 md:py-2.5 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-2 md:gap-3 flex-1 min-w-0">
            <div className="flex items-center gap-1 md:gap-2 min-w-0">
              <span className="text-gray-600 dark:text-gray-400 text-xs hidden md:inline">Brand:</span>
              <span className="text-black dark:text-white font-semibold text-xs md:text-sm truncate max-w-[80px] md:max-w-none">{brandData?.name}</span>
            </div>
            <div className="w-px h-4 bg-gray-300 dark:bg-gray-700"></div>
            <div className="flex items-center gap-1 md:gap-2 min-w-0">
              <span className="text-gray-600 dark:text-gray-400 text-xs hidden md:inline">Channel:</span>
              <span className="text-black dark:text-white font-semibold text-xs md:text-sm capitalize">{channelData?.type}</span>
              {channelData?.accountName && (
                <span className="text-gray-500 dark:text-gray-500 text-xs hidden md:inline">({channelData.accountName})</span>
              )}
            </div>
          </div>
          <button
            onClick={() => router.push(`/brands/${searchParams.get('brand')}/channels`)}
            className="px-2 md:px-3 py-1.5 text-gray-600 dark:text-gray-400 hover:text-white hover:bg-gradient-to-r from-blue-600 to-purple-600 border border-gray-300 dark:border-gray-600 hover:border-transparent text-xs font-medium transition-all rounded-lg flex-shrink-0"
          >
            <span className="hidden md:inline">Change Channel</span>
            <span className="md:hidden">Change</span>
          </button>
        </div>

        {/* Template Selection or Flow Builder */}
        <div className="flex-1 overflow-hidden">
          {showTemplates && channelData?.type === 'instagram' ? (
            <div className="h-full overflow-y-auto bg-gray-50 dark:bg-gray-950 p-4 md:p-8">
              <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="mb-6 md:mb-8 text-center">
                  <h1 className="text-xl md:text-3xl font-bold text-black dark:text-white mb-2 md:mb-3">
                    Choose an Instagram Flow Template
                  </h1>
                  <p className="text-gray-600 dark:text-gray-400 text-xs md:text-sm max-w-2xl mx-auto">
                    Get started quickly with pre-built automation templates designed for Instagram.
                  </p>
                </div>

                {/* Templates Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-6">
                  {instagramTemplates.map((template) => (
                    <div
                      key={template.id}
                      className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-4 md:p-6 hover:shadow-lg hover:border-blue-500 dark:hover:border-blue-500 active:bg-gray-50 transition-all cursor-pointer touch-target"
                      onClick={() => {
                        setSelectedTemplate(template);
                        setShowTemplates(false);
                      }}
                    >
                      <div className="flex md:block items-center gap-3 md:gap-0">
                        <div className="text-3xl md:text-5xl md:mb-4">{template.icon}</div>
                        <div className="flex-1 md:flex-none">
                          <h3 className="text-base md:text-lg font-bold text-black dark:text-white mb-1 md:mb-2">
                            {template.name}
                          </h3>
                          <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400 line-clamp-2 md:line-clamp-none md:mb-4">
                            {template.description}
                          </p>
                        </div>
                      </div>

                      {/* Metadata */}
                      <div className="flex items-center gap-2 md:gap-3 mt-3 md:mt-0 md:mb-4">
                        <span className={`px-2 py-0.5 md:py-1 text-xs font-semibold rounded-full ${
                          template.complexity === 'Beginner'
                            ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                            : template.complexity === 'Intermediate'
                            ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300'
                            : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300'
                        }`}>
                          {template.complexity}
                        </span>
                        <span className="text-xs text-gray-500 dark:text-gray-500">
                          ⏱️ {template.estimatedTime}
                        </span>
                      </div>

                      {/* Features - Hidden on mobile */}
                      <div className="hidden md:block space-y-1.5">
                        {template.features.map((feature, idx) => (
                          <div key={idx} className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
                            <svg className="w-3.5 h-3.5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                            <span>{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Start from Scratch Option */}
                <div className="text-center pb-4 md:pb-0">
                  <button
                    onClick={() => setShowTemplates(false)}
                    className="w-full md:w-auto px-6 py-3 text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white active:bg-gray-100 border border-gray-300 dark:border-gray-600 hover:border-black dark:hover:border-white font-semibold rounded-lg transition-all touch-target"
                  >
                    Or Start from Scratch
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <FlowBuilder selectedTemplate={selectedTemplate} channelType={channelData?.type} workspaceId={brandData?.id} />
          )}
        </div>
      </div>
    </>
  );
}

export default function FlowsPage() {
  // Temporarily disabled ProtectedRoute for development
  return (
    <Suspense fallback={<div className="h-screen flex items-center justify-center"><div className="animate-spin w-8 h-8 border-2 border-black border-t-transparent rounded-full"></div></div>}>
      <FlowsPageContent />
    </Suspense>
  );
}
