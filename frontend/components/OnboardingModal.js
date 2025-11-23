"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function OnboardingModal({ isOpen, onClose }) {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    {
      title: "Welcome to DM Automation Platform! 🎉",
      description: "Let's get you started with automating your social media conversations",
      icon: "👋",
      content: (
        <div className="space-y-4">
          <p className="text-gray-600 dark:text-gray-300">
            This platform helps you automate your social media conversations across multiple channels like Instagram, Facebook, WhatsApp, and more.
          </p>
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-xl p-4">
            <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">What you can do:</h4>
            <ul className="space-y-2 text-sm text-blue-800 dark:text-blue-200">
              <li className="flex items-start gap-2">
                <span className="text-blue-600 dark:text-blue-400 mt-0.5">✓</span>
                <span>Automate replies to messages and comments</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 dark:text-blue-400 mt-0.5">✓</span>
                <span>Create custom workflows with our visual flow builder</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 dark:text-blue-400 mt-0.5">✓</span>
                <span>Train AI with your knowledge base</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 dark:text-blue-400 mt-0.5">✓</span>
                <span>Track analytics and performance</span>
              </li>
            </ul>
          </div>
        </div>
      ),
    },
    {
      title: "Step 1: Create a Brand 🏷️",
      description: "Organize your automation by brands or businesses",
      icon: "🏷️",
      content: (
        <div className="space-y-4">
          <p className="text-gray-600 dark:text-gray-300">
            A brand represents your business or organization. You can have multiple brands, each with its own channels and automations.
          </p>
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border border-purple-200 dark:border-purple-700 rounded-xl p-4">
            <h4 className="font-semibold text-purple-900 dark:text-purple-100 mb-3">How to create a brand:</h4>
            <ol className="space-y-2 text-sm text-purple-800 dark:text-purple-200 list-decimal list-inside">
              <li>Go to <strong>Brands</strong> from the sidebar</li>
              <li>Click <strong>"+ Create New Brand"</strong></li>
              <li>Enter your brand name and details</li>
              <li>Save and you're ready to connect channels!</li>
            </ol>
          </div>
          <button
            onClick={() => {
              onClose();
              router.push('/brands');
            }}
            className="w-full px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors"
          >
            Go to Brands Page →
          </button>
        </div>
      ),
    },
    {
      title: "Step 2: Connect Your Channels 🔗",
      description: "Link your social media accounts to start automating",
      icon: "🔗",
      content: (
        <div className="space-y-4">
          <p className="text-gray-600 dark:text-gray-300">
            Connect channels like Instagram, Facebook, WhatsApp, and Telegram to your brand. Each channel can have its own automations.
          </p>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-3">
              <div className="text-2xl mb-2">📷</div>
              <div className="font-semibold text-sm text-gray-900 dark:text-white">Instagram</div>
              <div className="text-xs text-gray-600 dark:text-gray-400">DMs, Stories, Comments</div>
            </div>
            <div className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-3">
              <div className="text-2xl mb-2">📘</div>
              <div className="font-semibold text-sm text-gray-900 dark:text-white">Facebook</div>
              <div className="text-xs text-gray-600 dark:text-gray-400">Messenger, Comments</div>
            </div>
            <div className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-3">
              <div className="text-2xl mb-2">💬</div>
              <div className="font-semibold text-sm text-gray-900 dark:text-white">WhatsApp</div>
              <div className="text-xs text-gray-600 dark:text-gray-400">Business Messages</div>
            </div>
            <div className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-3">
              <div className="text-2xl mb-2">✈️</div>
              <div className="font-semibold text-sm text-gray-900 dark:text-white">Telegram</div>
              <div className="text-xs text-gray-600 dark:text-gray-400">Bot Messages</div>
            </div>
          </div>
          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 rounded-xl p-3">
            <p className="text-sm text-green-800 dark:text-green-200">
              💡 <strong>Tip:</strong> After creating a brand, click "Manage Channels" to connect your social media accounts.
            </p>
          </div>
        </div>
      ),
    },
    {
      title: "Step 3: Build Your First Automation 🤖",
      description: "Create workflows to automate your conversations",
      icon: "⚡",
      content: (
        <div className="space-y-4">
          <p className="text-gray-600 dark:text-gray-300">
            Use our visual flow builder to create automation workflows. Choose from templates or build from scratch!
          </p>
          <div className="space-y-3">
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg p-3">
              <div className="flex items-start gap-3">
                <div className="text-2xl">🎨</div>
                <div>
                  <div className="font-semibold text-blue-900 dark:text-blue-100 text-sm">Use Templates</div>
                  <div className="text-xs text-blue-700 dark:text-blue-300">Start with pre-built automation templates</div>
                </div>
              </div>
            </div>
            <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-700 rounded-lg p-3">
              <div className="flex items-start gap-3">
                <div className="text-2xl">🔧</div>
                <div>
                  <div className="font-semibold text-purple-900 dark:text-purple-100 text-sm">Build from Scratch</div>
                  <div className="text-xs text-purple-700 dark:text-purple-300">Create custom flows with full control</div>
                </div>
              </div>
            </div>
            <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-700 rounded-lg p-3">
              <div className="flex items-start gap-3">
                <div className="text-2xl">🤖</div>
                <div>
                  <div className="font-semibold text-orange-900 dark:text-orange-100 text-sm">AI-Powered</div>
                  <div className="text-xs text-orange-700 dark:text-orange-300">Let AI help you build your automation</div>
                </div>
              </div>
            </div>
          </div>
          <button
            onClick={() => {
              onClose();
              router.push('/flows-list');
            }}
            className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
          >
            Go to Automation Flows →
          </button>
        </div>
      ),
    },
    {
      title: "You're All Set! 🚀",
      description: "Start automating your conversations today",
      icon: "🎉",
      content: (
        <div className="space-y-4">
          <p className="text-gray-600 dark:text-gray-300 text-center">
            You now know the basics! Here are some helpful resources:
          </p>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => {
                onClose();
                router.push('/dashboard');
              }}
              className="p-4 bg-gradient-to-br from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white rounded-xl transition-all hover:shadow-lg"
            >
              <div className="text-2xl mb-2">📊</div>
              <div className="font-semibold text-sm">Dashboard</div>
              <div className="text-xs opacity-90">View overview</div>
            </button>
            <button
              onClick={() => {
                onClose();
                router.push('/templates');
              }}
              className="p-4 bg-gradient-to-br from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-xl transition-all hover:shadow-lg"
            >
              <div className="text-2xl mb-2">🎨</div>
              <div className="font-semibold text-sm">Templates</div>
              <div className="text-xs opacity-90">Browse templates</div>
            </button>
            <button
              onClick={() => {
                onClose();
                router.push('/inbox');
              }}
              className="p-4 bg-gradient-to-br from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-xl transition-all hover:shadow-lg"
            >
              <div className="text-2xl mb-2">💬</div>
              <div className="font-semibold text-sm">Inbox</div>
              <div className="text-xs opacity-90">Manage messages</div>
            </button>
            <button
              onClick={() => {
                onClose();
                router.push('/analytics');
              }}
              className="p-4 bg-gradient-to-br from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white rounded-xl transition-all hover:shadow-lg"
            >
              <div className="text-2xl mb-2">📈</div>
              <div className="font-semibold text-sm">Analytics</div>
              <div className="text-xs opacity-90">Track performance</div>
            </button>
          </div>
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border border-blue-200 dark:border-blue-700 rounded-xl p-4">
            <p className="text-sm text-gray-700 dark:text-gray-300 text-center">
              💡 You can always access this guide from <strong>Account Settings</strong> in the sidebar!
            </p>
          </div>
        </div>
      ),
    },
  ];

  // Close modal on Escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const currentStepData = steps[currentStep];
  const isLastStep = currentStep === steps.length - 1;
  const isFirstStep = currentStep === 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-2xl w-full border border-gray-200 dark:border-gray-700 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
          <div className="flex items-start justify-between mb-2">
            <div className="flex items-center gap-3">
              <div className="text-4xl">{currentStepData.icon}</div>
              <div>
                <h2 className="text-2xl font-bold">{currentStepData.title}</h2>
                <p className="text-blue-100 text-sm mt-1">{currentStepData.description}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Progress Bar */}
          <div className="mt-4 flex gap-2">
            {steps.map((_, index) => (
              <div
                key={index}
                className={`h-1 flex-1 rounded-full transition-all ${
                  index <= currentStep ? 'bg-white' : 'bg-white/30'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {currentStepData.content}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 dark:border-gray-700 p-6 flex items-center justify-between bg-gray-50 dark:bg-gray-900/50">
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Step {currentStep + 1} of {steps.length}
          </div>
          <div className="flex gap-3">
            {!isFirstStep && (
              <button
                onClick={() => setCurrentStep(prev => prev - 1)}
                className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 font-medium transition-colors"
              >
                Previous
              </button>
            )}
            {!isLastStep ? (
              <button
                onClick={() => setCurrentStep(prev => prev + 1)}
                className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg font-medium transition-all shadow-md hover:shadow-lg"
              >
                Next →
              </button>
            ) : (
              <button
                onClick={onClose}
                className="px-6 py-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-lg font-medium transition-all shadow-md hover:shadow-lg"
              >
                Get Started! 🚀
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
