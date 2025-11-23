"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ProtectedRoute from '../../components/ProtectedRoute';
import NavigationSidebar from '../../components/NavigationSidebar';
import { useSidebar } from '../../contexts/SidebarContext';
import { useBrandChannel } from '../../contexts/BrandChannelContext';
import FlowBuilder from '../../components/FlowBuilder';

function OptInAutomationContent() {
  const { isCollapsed } = useSidebar();
  const { getCurrentBrand, getCurrentChannel } = useBrandChannel();
  const currentBrand = getCurrentBrand();
  const currentChannel = getCurrentChannel();
  const router = useRouter();

  if (!currentBrand || !currentChannel) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900">
        <NavigationSidebar />
        <main className={`px-6 py-8 min-h-screen max-w-7xl mx-auto transition-all duration-300 ${isCollapsed ? 'ml-20' : 'ml-64'}`}>
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="text-5xl mb-4">⚠️</div>
              <h2 className="text-xl font-bold text-black dark:text-white mb-2">Select a Brand and Channel</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Please select a brand and channel to configure opt-in automation
              </p>
              <button
                onClick={() => router.push('/brands')}
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-lg transition-all"
              >
                Select Brand & Channel
              </button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (currentChannel.type !== 'instagram') {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900">
        <NavigationSidebar />
        <main className={`px-6 py-8 min-h-screen max-w-7xl mx-auto transition-all duration-300 ${isCollapsed ? 'ml-20' : 'ml-64'}`}>
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="text-5xl mb-4">📷</div>
              <h2 className="text-xl font-bold text-black dark:text-white mb-2">Instagram Only</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                This automation is only available for Instagram channels
              </p>
              <button
                onClick={() => router.push('/global-automations')}
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-lg transition-all"
              >
                Back to Global Automations
              </button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <>
      <NavigationSidebar />
      <div className={`fixed right-0 top-0 bottom-0 flex flex-col bg-white dark:bg-gray-900 transition-all duration-300 ${isCollapsed ? 'left-20' : 'left-64'}`}>
        {/* Brand/Channel Context Bar */}
        <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 px-4 py-2.5 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push('/global-automations')}
              className="text-gray-500 hover:text-black dark:hover:text-white transition-colors"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <div className="flex items-center gap-2">
              <span className="text-gray-600 dark:text-gray-400 text-xs">Brand:</span>
              <span className="text-black dark:text-white font-semibold text-sm">{currentBrand?.name}</span>
            </div>
            <div className="w-px h-4 bg-gray-300 dark:bg-gray-700"></div>
            <div className="flex items-center gap-2">
              <span className="text-gray-600 dark:text-gray-400 text-xs">Channel:</span>
              <span className="text-black dark:text-white font-semibold text-sm capitalize">{currentChannel?.type}</span>
            </div>
            <div className="w-px h-4 bg-gray-300 dark:bg-gray-700"></div>
            <div className="flex items-center gap-2">
              <span className="text-green-600 dark:text-green-400 text-xs font-semibold">📥 OPT-IN AUTOMATION</span>
            </div>
          </div>
        </div>

        {/* Flow Builder */}
        <div className="flex-1 overflow-hidden">
          <FlowBuilder automationType="opt-in" />
        </div>
      </div>
    </>
  );
}

export default function OptInAutomation() {
  return (
    <ProtectedRoute>
      <OptInAutomationContent />
    </ProtectedRoute>
  );
}
