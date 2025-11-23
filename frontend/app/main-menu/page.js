"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ProtectedRoute from '../../components/ProtectedRoute';
import NavigationSidebar from '../../components/NavigationSidebar';
import { useSidebar } from '../../contexts/SidebarContext';
import { useBrandChannel } from '../../contexts/BrandChannelContext';

function MainMenuContent() {
  const { isCollapsed } = useSidebar();
  const { getCurrentBrand, getCurrentChannel } = useBrandChannel();
  const currentBrand = getCurrentBrand();
  const currentChannel = getCurrentChannel();
  const router = useRouter();

  const [isEnabled, setIsEnabled] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [menuButtons, setMenuButtons] = useState([
    { id: 1, label: 'Contact Us', clicks: 245, flowId: 'flow-1' },
    { id: 2, label: 'See Products', clicks: 412, flowId: 'flow-2' },
    { id: 3, label: 'Track Order', clicks: 178, flowId: 'flow-3' },
  ]);
  const [showFlowSelector, setShowFlowSelector] = useState(false);
  const [editingButtonId, setEditingButtonId] = useState(null);
  const [hasChanges, setHasChanges] = useState(false);

  // Mock flows for selector
  const availableFlows = [
    { id: 'flow-1', name: 'Contact Support Flow', channel: 'Instagram' },
    { id: 'flow-2', name: 'Product Catalog Flow', channel: 'Instagram' },
    { id: 'flow-3', name: 'Order Tracking Flow', channel: 'Instagram' },
    { id: 'flow-4', name: 'Welcome Message Flow', channel: 'Instagram' },
    { id: 'flow-5', name: 'FAQ Responder Flow', channel: 'Instagram' },
  ];

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
                Please select a brand and channel to manage the main menu
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

  const handleAddButton = () => {
    if (menuButtons.length >= 20) return;
    const newButton = {
      id: Date.now(),
      label: 'New Button',
      clicks: 0,
      flowId: null
    };
    setMenuButtons([...menuButtons, newButton]);
    setHasChanges(true);
  };

  const handleDeleteButton = (id) => {
    setMenuButtons(menuButtons.filter(btn => btn.id !== id));
    setHasChanges(true);
  };

  const handleUpdateLabel = (id, newLabel) => {
    setMenuButtons(menuButtons.map(btn =>
      btn.id === id ? { ...btn, label: newLabel } : btn
    ));
    setHasChanges(true);
  };

  const handleSelectFlow = (buttonId, flowId) => {
    setMenuButtons(menuButtons.map(btn =>
      btn.id === buttonId ? { ...btn, flowId } : btn
    ));
    setShowFlowSelector(false);
    setEditingButtonId(null);
    setHasChanges(true);
  };

  const handleSave = () => {
    // TODO: API call to save menu buttons
    console.log('Saving menu buttons:', menuButtons);
    setIsEditing(false);
    setHasChanges(false);
  };

  const handleCancel = () => {
    // TODO: Revert to last saved state
    setIsEditing(false);
    setHasChanges(false);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <NavigationSidebar />

      <main className={`px-6 py-8 min-h-screen transition-all duration-300 ${isCollapsed ? 'ml-20' : 'ml-64'}`}>
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <button
                  onClick={() => router.push('/global-automations')}
                  className="text-gray-500 hover:text-black dark:hover:text-white transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <h1 className="text-3xl font-bold text-black dark:text-white">Main Menu</h1>
                <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs font-semibold rounded-full">
                  {currentBrand.name} · {currentChannel.type}
                </span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 ml-8">
                Create quick-reply buttons that appear when someone opens your DMs
              </p>
            </div>

            <div className="flex items-center gap-3">
              {/* Enable/Disable Toggle */}
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {isEnabled ? 'Enabled' : 'Disabled'}
                </span>
                <button
                  onClick={() => setIsEnabled(!isEnabled)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    isEnabled ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      isEnabled ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              {/* Edit Menu Button */}
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-lg transition-all text-sm"
                >
                  Edit Menu
                </button>
              ) : (
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCancel}
                    className="px-4 py-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500 text-gray-700 dark:text-gray-300 font-medium rounded-lg transition-all text-sm"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    className="px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold rounded-lg transition-all text-sm"
                  >
                    Save Changes
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Main Content: Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Panel: Menu Buttons List */}
          <div>
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
              {/* Table Header */}
              <div className="bg-gray-50 dark:bg-gray-900 px-6 py-3 border-b border-gray-200 dark:border-gray-700">
                <div className="grid grid-cols-12 gap-4 text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                  <div className="col-span-6">Button</div>
                  <div className="col-span-2 text-center">Clicks</div>
                  <div className="col-span-4 text-center">Action</div>
                </div>
              </div>

              {/* Table Body */}
              <div className="divide-y divide-gray-200 dark:divide-gray-700">
                {menuButtons.map((button, index) => (
                  <div key={button.id} className="px-6 py-4">
                    <div className="grid grid-cols-12 gap-4 items-center">
                      {/* Button Label */}
                      <div className="col-span-6">
                        {isEditing ? (
                          <input
                            type="text"
                            value={button.label}
                            onChange={(e) => handleUpdateLabel(button.id, e.target.value)}
                            className="w-full px-3 py-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg text-sm text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Button label"
                          />
                        ) : (
                          <div className="font-medium text-black dark:text-white text-sm">
                            {button.label}
                          </div>
                        )}
                      </div>

                      {/* Click Count */}
                      <div className="col-span-2 text-center">
                        <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                          {button.clicks}
                        </span>
                      </div>

                      {/* Actions */}
                      <div className="col-span-4 flex items-center justify-center gap-2">
                        {/* Open Flow Button */}
                        <button
                          onClick={() => {
                            setEditingButtonId(button.id);
                            setShowFlowSelector(true);
                          }}
                          className="p-2 bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/40 text-blue-600 dark:text-blue-400 rounded-lg transition-colors"
                          title="Select flow"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                          </svg>
                        </button>

                        {/* Delete Button (only in editing mode) */}
                        {isEditing && (
                          <button
                            onClick={() => handleDeleteButton(button.id)}
                            className="p-2 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/40 text-red-600 dark:text-red-400 rounded-lg transition-colors"
                            title="Delete button"
                          >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}

                {/* Empty State */}
                {menuButtons.length === 0 && (
                  <div className="px-6 py-12 text-center">
                    <div className="text-4xl mb-3">💬</div>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                      No menu buttons yet. Add one to get started.
                    </p>
                  </div>
                )}
              </div>

              {/* Add Button (only in editing mode and if less than 20 buttons) */}
              {isEditing && menuButtons.length < 20 && (
                <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700">
                  <button
                    onClick={handleAddButton}
                    className="w-full px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium rounded-lg transition-all text-sm flex items-center justify-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Add Menu Button ({menuButtons.length}/20)
                  </button>
                </div>
              )}

              {/* Max Limit Notice */}
              {menuButtons.length === 20 && (
                <div className="px-6 py-3 bg-blue-50 dark:bg-blue-900/20 border-t border-blue-200 dark:border-blue-800">
                  <p className="text-xs text-blue-700 dark:text-blue-300 text-center">
                    Maximum of 20 menu buttons reached
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Right Panel: Phone Mockup Preview */}
          <div className="flex items-start justify-center">
            <div className="relative">
              {/* Phone Frame */}
              <div className="w-[340px] bg-black rounded-[3rem] p-3 shadow-2xl">
                <div className="bg-white dark:bg-gray-900 rounded-[2.5rem] overflow-hidden h-[680px] flex flex-col">
                  {/* Phone Status Bar */}
                  <div className="bg-gray-100 dark:bg-gray-950 px-6 py-2 flex items-center justify-between">
                    <span className="text-xs font-semibold text-black dark:text-white">9:41</span>
                    <div className="flex items-center gap-1">
                      <svg className="w-4 h-4 text-black dark:text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
                      </svg>
                    </div>
                  </div>

                  {/* Chat Header */}
                  <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 px-4 py-3 flex items-center gap-3">
                    <button className="text-blue-600">
                      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                    </button>
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-sm">
                      {currentBrand.name?.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-bold text-black dark:text-white">
                        {currentBrand.name}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        Usually replies instantly
                      </div>
                    </div>
                  </div>

                  {/* Chat Area */}
                  <div className="flex-1 bg-white dark:bg-gray-900 p-4">
                    <div className="flex flex-col gap-2">
                      {/* Sample Message */}
                      <div className="flex items-start gap-2">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-xs flex-shrink-0">
                          {currentBrand.name?.charAt(0).toUpperCase()}
                        </div>
                        <div className="bg-gray-100 dark:bg-gray-800 rounded-2xl rounded-tl-none px-4 py-2 max-w-[220px]">
                          <p className="text-sm text-black dark:text-white">
                            Hey! How can I help you today? 👋
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Main Menu Section */}
                  <div className="bg-gray-50 dark:bg-gray-950 border-t border-gray-200 dark:border-gray-700 px-4 py-4">
                    <div className="mb-3">
                      <div className="text-sm font-bold text-black dark:text-white mb-1">
                        More options
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        Tap to send a suggestion from {currentBrand.name}
                      </div>
                    </div>

                    {/* Menu Buttons */}
                    <div className="space-y-2">
                      {menuButtons.map((button) => (
                        <button
                          key={button.id}
                          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-full py-3 px-4 text-sm transition-colors"
                        >
                          {button.label}
                        </button>
                      ))}

                      {menuButtons.length === 0 && (
                        <div className="text-center py-4">
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            No menu buttons configured
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Message Input */}
                  <div className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 px-4 py-3 flex items-center gap-2">
                    <button className="text-blue-600">
                      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                    </button>
                    <div className="flex-1 bg-gray-100 dark:bg-gray-800 rounded-full px-4 py-2">
                      <span className="text-sm text-gray-500 dark:text-gray-400">Message...</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Status Badge */}
              {!isEnabled && (
                <div className="absolute -top-2 -right-2 bg-yellow-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                  Disabled
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Flow Selector Modal */}
        {showFlowSelector && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50" onClick={() => setShowFlowSelector(false)}>
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-2xl w-full mx-4 overflow-hidden" onClick={(e) => e.stopPropagation()}>
              {/* Modal Header */}
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4 flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-white">Select Flow</h2>
                  <p className="text-sm text-blue-100 mt-1">Choose which flow to trigger when this button is clicked</p>
                </div>
                <button
                  onClick={() => setShowFlowSelector(false)}
                  className="text-white hover:text-gray-200 text-2xl font-light"
                >
                  ✕
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-6">
                {/* Start from Scratch Button */}
                <div className="mb-4">
                  <button
                    onClick={() => {
                      setShowFlowSelector(false);
                      const contextQuery = currentBrand && currentChannel
                        ? `?brand=${currentBrand.id}&channel=${currentChannel.type}&mode=scratch`
                        : '?mode=scratch';
                      router.push(`/flows${contextQuery}`);
                    }}
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 border-2 border-transparent rounded-lg p-4 text-left transition-all hover:shadow-md group"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center text-white font-bold text-lg">
                          ✨
                        </div>
                        <div>
                          <h3 className="text-sm font-bold text-white">
                            Start from Scratch
                          </h3>
                          <p className="text-xs text-blue-100">
                            Create a new flow for this button
                          </p>
                        </div>
                      </div>
                      <svg className="w-5 h-5 text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </button>
                </div>

                {/* Divider */}
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex-1 border-t border-gray-200 dark:border-gray-700"></div>
                  <span className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider">Or select existing</span>
                  <div className="flex-1 border-t border-gray-200 dark:border-gray-700"></div>
                </div>

                {/* Existing Flows List */}
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {availableFlows.map((flow) => (
                    <button
                      key={flow.id}
                      onClick={() => handleSelectFlow(editingButtonId, flow.id)}
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

                {availableFlows.length === 0 && (
                  <div className="text-center py-12">
                    <div className="text-4xl mb-3">📭</div>
                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                      No flows found. Create a flow first.
                    </p>
                    <button
                      onClick={() => router.push('/flows-list')}
                      className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium rounded-lg transition-all text-sm"
                    >
                      Create Flow
                    </button>
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

export default function MainMenu() {
  return (
    <ProtectedRoute>
      <MainMenuContent />
    </ProtectedRoute>
  );
}
