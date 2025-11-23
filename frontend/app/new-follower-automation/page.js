"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ProtectedRoute from '../../components/ProtectedRoute';
import NavigationSidebar from '../../components/NavigationSidebar';
import { useSidebar } from '../../contexts/SidebarContext';
import { useBrandChannel } from '../../contexts/BrandChannelContext';

function NewFollowerAutomationContent() {
  const { isCollapsed } = useSidebar();
  const { getCurrentBrand, getCurrentChannel } = useBrandChannel();
  const currentBrand = getCurrentBrand();
  const currentChannel = getCurrentChannel();
  const router = useRouter();

  const [status, setStatus] = useState('draft'); // 'draft' | 'live'
  const [delay, setDelay] = useState(0);
  const [delayUnit, setDelayUnit] = useState('sec'); // 'sec' | 'min' | 'hrs'

  // Opening DM
  const [openingMessage, setOpeningMessage] = useState(
    "Hey there! Thanks for following 🙌\n\nWant me to send you our best starter guide?"
  );
  const [ctaButtonLabel, setCtaButtonLabel] = useState("Yes, send it over!");

  // Email prompt
  const [askForEmail, setAskForEmail] = useState(false);

  // DM with link
  const [linkDmMessage, setLinkDmMessage] = useState("");
  const [linkUrl, setLinkUrl] = useState("");

  // Follow-up if no click
  const [followUpEnabled, setFollowUpEnabled] = useState(false);
  const [followUpDelay, setFollowUpDelay] = useState(1);
  const [followUpUnit, setFollowUpUnit] = useState('hrs');
  const [followUpMessage, setFollowUpMessage] = useState("");

  const [showHelperModal, setShowHelperModal] = useState(false);
  const [validationErrors, setValidationErrors] = useState([]);

  // Validate form
  useEffect(() => {
    const errors = [];

    if (!ctaButtonLabel.trim()) {
      errors.push("Add a button that sends a message to open the 24-hour window.");
    }

    if (!linkUrl.trim()) {
      errors.push("Add at least one link to the DM with a link section.");
    }

    if (followUpEnabled && !linkUrl.trim()) {
      errors.push("Follow-up requires the previous step to contain at least one link.");
    }

    // Check 24-hour window
    const totalDelayMs = calculateTotalDelay();
    if (totalDelayMs > 24 * 60 * 60 * 1000) {
      errors.push("Total delay exceeds 24-hour messaging window. Adjust your timing.");
    }

    setValidationErrors(errors);
  }, [ctaButtonLabel, linkUrl, followUpEnabled, delay, delayUnit, followUpDelay, followUpUnit]);

  const calculateTotalDelay = () => {
    let total = 0;

    // Initial delay
    if (delayUnit === 'sec') total += delay * 1000;
    else if (delayUnit === 'min') total += delay * 60 * 1000;
    else if (delayUnit === 'hrs') total += delay * 60 * 60 * 1000;

    // Follow-up delay
    if (followUpEnabled) {
      if (followUpUnit === 'sec') total += followUpDelay * 1000;
      else if (followUpUnit === 'min') total += followUpDelay * 60 * 1000;
      else if (followUpUnit === 'hrs') total += followUpDelay * 60 * 60 * 1000;
    }

    return total;
  };

  const handleGoLive = () => {
    if (validationErrors.length > 0) {
      alert("Please fix validation errors before going live.");
      return;
    }

    // TODO: API call to save and activate automation
    console.log('Going live with config:', {
      delay,
      delayUnit,
      openingMessage,
      ctaButtonLabel,
      askForEmail,
      linkDmMessage,
      linkUrl,
      followUpEnabled,
      followUpDelay,
      followUpUnit,
      followUpMessage
    });

    setStatus('live');
  };

  const handlePreview = () => {
    // TODO: Send test to connected test user
    alert("Preview sent to test user!");
  };

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
                Please select a brand and channel to set up new follower automation
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

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <NavigationSidebar />

      <main className={`px-6 py-8 min-h-screen transition-all duration-300 ${isCollapsed ? 'ml-20' : 'ml-64'}`}>
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <button
                onClick={() => router.push('/global-automations')}
                className="text-gray-500 hover:text-black dark:hover:text-white transition-colors"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <div>
                <h1 className="text-3xl font-bold text-black dark:text-white">Say hi to new followers</h1>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Send a welcome DM when someone follows you (1st time only)
                </p>
              </div>
            </div>

            {/* Top-right Actions */}
            <div className="flex items-center gap-3">
              {/* Status Pill */}
              <div className={`px-3 py-1 rounded-full text-xs font-semibold ${
                status === 'live'
                  ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
              }`}>
                {status === 'live' ? 'Live' : 'Draft'}
              </div>

              {/* Preview Button */}
              <button
                onClick={handlePreview}
                className="px-4 py-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500 text-gray-700 dark:text-gray-300 font-medium rounded-lg transition-all text-sm"
              >
                Preview
              </button>

              {/* Go Live Button */}
              <button
                onClick={handleGoLive}
                disabled={validationErrors.length > 0}
                className={`px-6 py-2 font-semibold rounded-lg transition-all text-sm ${
                  validationErrors.length > 0
                    ? 'bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white'
                }`}
              >
                Go Live
              </button>
            </div>
          </div>

          {/* Validation Errors */}
          {validationErrors.length > 0 && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
              <div className="flex items-start gap-2">
                <svg className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <div className="flex-1">
                  <h3 className="text-sm font-bold text-red-700 dark:text-red-300 mb-1">
                    Please fix these issues before going live:
                  </h3>
                  <ul className="text-sm text-red-600 dark:text-red-400 space-y-1">
                    {validationErrors.map((error, idx) => (
                      <li key={idx}>• {error}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Main Content: Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Config Panel */}
          <div className="space-y-6">
            {/* 1. Trigger Timing */}
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6">
              <h3 className="text-lg font-bold text-black dark:text-white mb-1">
                When someone new follows you
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
                Add a short delay to feel human, not robotic.
              </p>

              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-700 dark:text-gray-300">Send after</span>
                <input
                  type="number"
                  min="0"
                  value={delay}
                  onChange={(e) => setDelay(parseInt(e.target.value) || 0)}
                  className="w-20 px-3 py-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg text-sm text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <select
                  value={delayUnit}
                  onChange={(e) => setDelayUnit(e.target.value)}
                  className="px-3 py-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg text-sm text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="sec">sec</option>
                  <option value="min">min</option>
                  <option value="hrs">hrs</option>
                </select>
              </div>
            </div>

            {/* 2. First Message */}
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6">
              <h3 className="text-lg font-bold text-black dark:text-white mb-1">
                They will get
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
                Opening DM with required CTA
              </p>

              {/* Opening DM Toggle (always on, not removable) */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded bg-blue-600 flex items-center justify-center">
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span className="text-sm font-semibold text-black dark:text-white">Opening DM (required)</span>
                  </div>
                  <button
                    onClick={() => setShowHelperModal(true)}
                    className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    Why does an opening DM matter?
                  </button>
                </div>

                {/* Message Editor */}
                <textarea
                  value={openingMessage}
                  onChange={(e) => setOpeningMessage(e.target.value)}
                  rows={4}
                  className="w-full px-4 py-3 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg text-sm text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 mb-3"
                  placeholder="Your opening message..."
                />

                {/* CTA Button */}
                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-blue-700 dark:text-blue-300">Required CTA Button</span>
                    <span className="text-xs text-blue-600 dark:text-blue-400">Cannot be deleted</span>
                  </div>
                  <input
                    type="text"
                    value={ctaButtonLabel}
                    onChange={(e) => setCtaButtonLabel(e.target.value)}
                    className="w-full px-3 py-2 bg-white dark:bg-gray-900 border border-blue-300 dark:border-blue-700 rounded-lg text-sm text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Button label"
                  />
                  <p className="text-xs text-blue-600 dark:text-blue-400 mt-2">
                    This first button opens the 24-hour messaging window.
                  </p>
                </div>
              </div>

              {/* Ask for Email Toggle */}
              <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-semibold text-black dark:text-white">Ask for email (optional)</span>
                  <button
                    onClick={() => setAskForEmail(!askForEmail)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      askForEmail ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        askForEmail ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
                {askForEmail && (
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    A quick-reply email chip will be shown (prepopulated if Meta provides; otherwise user input).
                  </p>
                )}
              </div>
            </div>

            {/* 3. Follow-up Step */}
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6">
              <h3 className="text-lg font-bold text-black dark:text-white mb-1">
                And then, they will get
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
                Send them something valuable
              </p>

              {/* DM with a link */}
              <div className="mb-4">
                <label className="text-sm font-semibold text-black dark:text-white block mb-2">
                  DM with a link
                </label>
                <textarea
                  value={linkDmMessage}
                  onChange={(e) => setLinkDmMessage(e.target.value)}
                  rows={3}
                  className="w-full px-4 py-3 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg text-sm text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2"
                  placeholder="Your message with a link..."
                />

                <div className="flex items-center gap-2">
                  <input
                    type="url"
                    value={linkUrl}
                    onChange={(e) => setLinkUrl(e.target.value)}
                    className="flex-1 px-3 py-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg text-sm text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="https://example.com/guide"
                  />
                  <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors">
                    Add Link
                  </button>
                </div>

                {!linkUrl.trim() && (
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                    No link added yet — add one to continue.
                  </p>
                )}
              </div>

              {/* Follow-up if no click */}
              <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-semibold text-black dark:text-white">Follow-up if no click (optional)</span>
                  <button
                    onClick={() => setFollowUpEnabled(!followUpEnabled)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      followUpEnabled ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        followUpEnabled ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                {followUpEnabled && (
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-gray-700 dark:text-gray-300">Schedule after</span>
                      <input
                        type="number"
                        min="1"
                        value={followUpDelay}
                        onChange={(e) => setFollowUpDelay(parseInt(e.target.value) || 1)}
                        className="w-20 px-3 py-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg text-sm text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <select
                        value={followUpUnit}
                        onChange={(e) => setFollowUpUnit(e.target.value)}
                        className="px-3 py-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg text-sm text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="sec">sec</option>
                        <option value="min">min</option>
                        <option value="hrs">hrs</option>
                      </select>
                    </div>

                    <textarea
                      value={followUpMessage}
                      onChange={(e) => setFollowUpMessage(e.target.value)}
                      rows={3}
                      className="w-full px-4 py-3 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg text-sm text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Gentle reminder message..."
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Panel: Live Preview */}
          <div className="flex items-start justify-center sticky top-8">
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
                  <div className="flex-1 bg-white dark:bg-gray-900 p-4 overflow-y-auto">
                    <div className="flex flex-col gap-4">
                      {/* Opening Message */}
                      {openingMessage && (
                        <div className="flex items-start gap-2">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-xs flex-shrink-0">
                            {currentBrand.name?.charAt(0).toUpperCase()}
                          </div>
                          <div className="flex flex-col gap-2 max-w-[220px]">
                            <div className="bg-gray-100 dark:bg-gray-800 rounded-2xl rounded-tl-none px-4 py-2">
                              <p className="text-sm text-black dark:text-white whitespace-pre-wrap">
                                {openingMessage}
                              </p>
                            </div>
                            {/* CTA Button */}
                            {ctaButtonLabel && (
                              <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-full py-2 px-4 text-xs transition-colors text-center">
                                {ctaButtonLabel}
                              </button>
                            )}
                            {/* Email Prompt */}
                            {askForEmail && (
                              <div className="bg-gray-100 dark:bg-gray-800 rounded-lg px-3 py-2 text-xs text-gray-700 dark:text-gray-300">
                                📧 Share your email
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {/* User Response (simulated) */}
                      {ctaButtonLabel && (
                        <div className="flex justify-end">
                          <div className="bg-blue-600 text-white rounded-2xl rounded-tr-none px-4 py-2 max-w-[220px]">
                            <p className="text-sm">{ctaButtonLabel}</p>
                          </div>
                        </div>
                      )}

                      {/* DM with Link */}
                      {linkDmMessage && linkUrl && (
                        <div className="flex items-start gap-2">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-xs flex-shrink-0">
                            {currentBrand.name?.charAt(0).toUpperCase()}
                          </div>
                          <div className="bg-gray-100 dark:bg-gray-800 rounded-2xl rounded-tl-none px-4 py-2 max-w-[220px]">
                            <p className="text-sm text-black dark:text-white whitespace-pre-wrap mb-2">
                              {linkDmMessage}
                            </p>
                            <a href="#" className="text-xs text-blue-600 dark:text-blue-400 underline break-all">
                              {linkUrl}
                            </a>
                          </div>
                        </div>
                      )}

                      {/* Follow-up Message */}
                      {followUpEnabled && followUpMessage && (
                        <div className="flex items-start gap-2">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-xs flex-shrink-0">
                            {currentBrand.name?.charAt(0).toUpperCase()}
                          </div>
                          <div className="bg-gray-100 dark:bg-gray-800 rounded-2xl rounded-tl-none px-4 py-2 max-w-[220px]">
                            <p className="text-sm text-black dark:text-white whitespace-pre-wrap">
                              {followUpMessage}
                            </p>
                          </div>
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

              {/* Preview Label */}
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gray-800 dark:bg-gray-700 text-white px-3 py-1 rounded-full text-xs font-semibold">
                Live Preview
              </div>
            </div>
          </div>
        </div>

        {/* Helper Modal */}
        {showHelperModal && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50" onClick={() => setShowHelperModal(false)}>
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-lg w-full mx-4 overflow-hidden" onClick={(e) => e.stopPropagation()}>
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4 flex items-center justify-between">
                <h2 className="text-xl font-bold text-white">Why does an opening DM matter?</h2>
                <button
                  onClick={() => setShowHelperModal(false)}
                  className="text-white hover:text-gray-200 text-2xl font-light"
                >
                  ✕
                </button>
              </div>
              <div className="p-6">
                <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">
                  Instagram's 24-hour messaging window only opens when a user sends you a message first. Without user action, you can't send them proactive messages.
                </p>
                <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">
                  This opening DM with a CTA button ensures the user taps the button (which counts as a message from them), opening the 24-hour window so you can send follow-up messages.
                </p>
                <p className="text-sm font-semibold text-blue-600 dark:text-blue-400">
                  Without this, your automation won't be able to send any messages!
                </p>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default function NewFollowerAutomation() {
  return (
    <ProtectedRoute>
      <NewFollowerAutomationContent />
    </ProtectedRoute>
  );
}
