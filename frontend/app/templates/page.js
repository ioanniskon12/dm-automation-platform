"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import NavigationSidebar from '../../components/NavigationSidebar';
import ProtectedRoute from '../../components/ProtectedRoute';
import AIFlowModal from '../../components/AIFlowModal';
import BrandChannelSelectorModal from '../../components/BrandChannelSelectorModal';
import { useBrandChannel } from '../../contexts/BrandChannelContext';
import { useSidebar } from '../../contexts/SidebarContext';
import api from '../../utils/api';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002';

const templates = [
  {
    id: 'ai-builder',
    name: 'Build with AI',
    icon: '🤖',
    color: 'from-purple-600 to-pink-600',
    description: 'Describe your automation and let AI build it for you',
    features: ['AI-powered', 'Custom flows', 'Instant generation'],
    nodes: 0,
    category: 'AI',
    views: 0,
    createdAt: new Date().toISOString(),
    isAIBuilder: true, // Special flag to identify this template
  },
  {
    id: 'lead-qualification',
    name: 'Lead Qualification',
    icon: '🎯',
    color: 'from-blue-500 to-cyan-500',
    description: 'Automatically qualify leads by asking key questions and routing them appropriately',
    features: ['Multi-question flow', 'Conditional logic', 'CRM integration'],
    nodes: 5,
    category: 'Sales',
    views: 1247,
    createdAt: new Date('2024-01-15').toISOString(),
  },
  {
    id: 'faq-automation',
    name: 'FAQ Automation',
    icon: '❓',
    color: 'from-purple-500 to-pink-500',
    description: 'Instantly answer common questions using your knowledge base',
    features: ['AI-powered responses', 'Fallback to human', 'Multi-language'],
    nodes: 3,
    category: 'Support',
    views: 892,
    createdAt: '2024-01-20',
  },
  {
    id: 'appointment-booking',
    name: 'Appointment Booking',
    icon: '📅',
    color: 'from-green-500 to-teal-500',
    description: 'Schedule appointments automatically and send calendar invites',
    features: ['Calendar sync', 'Time slot selection', 'Confirmation emails'],
    nodes: 7,
    category: 'Sales',
    views: 1543,
    createdAt: '2024-01-10',
  },
  {
    id: 'product-recommendations',
    name: 'Product Recommendations',
    icon: '🛍️',
    color: 'from-orange-500 to-red-500',
    description: 'Suggest products based on customer preferences and behavior',
    features: ['Personalized suggestions', 'Product catalog integration', 'Order tracking'],
    nodes: 6,
    category: 'E-commerce',
    views: 678,
    createdAt: '2024-02-01',
  },
  {
    id: 'customer-support',
    name: 'Customer Support',
    icon: '🎧',
    color: 'from-indigo-500 to-purple-600',
    description: 'Handle support tickets with AI and escalate when needed',
    features: ['Ticket creation', 'Priority routing', 'AI troubleshooting'],
    nodes: 8,
    category: 'Support',
    views: 2105,
    createdAt: '2024-01-05',
  },
  {
    id: 'feedback-collection',
    name: 'Feedback Collection',
    icon: '⭐',
    color: 'from-yellow-500 to-orange-500',
    description: 'Gather customer feedback and reviews automatically',
    features: ['Rating system', 'Follow-up questions', 'Analytics integration'],
    nodes: 4,
    category: 'Engagement',
    views: 534,
    createdAt: '2024-02-10',
  },
  {
    id: 'welcome-sequence',
    name: 'Welcome Sequence',
    icon: '👋',
    color: 'from-pink-500 to-rose-500',
    description: 'Onboard new followers with a personalized welcome message series',
    features: ['Multi-step drip', 'Time delays', 'Engagement tracking'],
    nodes: 5,
    category: 'Engagement',
    views: 1821,
    createdAt: '2024-01-12',
  },
  {
    id: 'abandoned-cart',
    name: 'Abandoned Cart Recovery',
    icon: '🛒',
    color: 'from-red-500 to-pink-600',
    description: 'Recover abandoned carts with automated follow-up messages',
    features: ['Cart detection', 'Discount offers', 'Urgency messaging'],
    nodes: 6,
    category: 'E-commerce',
    views: 1392,
    createdAt: '2024-01-18',
  },
];

const categoryColors = {
  'All': 'bg-gradient-to-r from-gray-500 to-gray-600',
  'Sales': 'bg-gradient-to-r from-blue-500 to-blue-600',
  'Support': 'bg-gradient-to-r from-green-500 to-green-600',
  'E-commerce': 'bg-gradient-to-r from-orange-500 to-orange-600',
  'Engagement': 'bg-gradient-to-r from-pink-500 to-pink-600',
  'My Flows': 'bg-gradient-to-r from-indigo-500 to-purple-600',
};

export default function Templates() {
  const { isCollapsed } = useSidebar();
  const router = useRouter();
  const { selectedBrand, selectedChannel, getCurrentBrand, getCurrentChannel, selectBrand, selectChannel } = useBrandChannel();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [loadingTemplate, setLoadingTemplate] = useState(null);
  const [showAIModal, setShowAIModal] = useState(false);
  const [showBrandChannelModal, setShowBrandChannelModal] = useState(false);
  const [brands, setBrands] = useState([]);
  const [savedFlows, setSavedFlows] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('newest'); // newest, oldest, mostViewed
  const [showDeleteCategoryModal, setShowDeleteCategoryModal] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');

  // Fetch brands on mount
  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const response = await fetch('/api/brands');
        const data = await response.json();
        if (data.success) {
          setBrands(data.brands);
        }
      } catch (error) {
        console.error('Error fetching brands:', error);
      }
    };

    fetchBrands();
  }, []);

  // Fetch saved flows from backend (scoped to current brand/channel)
  useEffect(() => {
    const fetchSavedFlows = async () => {
      try {
        // Use api utility which automatically includes brand/channel context
        const response = await api.get('/api/flows');
        const data = await response.json();
        if (data && data.flows) {
          setSavedFlows(data.flows);
        }
      } catch (error) {
        console.error('Error fetching saved flows:', error);
      }
    };

    // Fetch on mount
    fetchSavedFlows();

    // Refresh flows when page becomes visible (user navigates back)
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        fetchSavedFlows();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Also refresh when window gains focus
    window.addEventListener('focus', fetchSavedFlows);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', fetchSavedFlows);
    };
  }, []);

  // Combine static templates with saved flows
  const allTemplates = [...templates, ...savedFlows];

  // Extract unique categories from all templates
  const baseCategories = ['All', 'Sales', 'Support', 'E-commerce', 'Engagement', 'My Flows'];
  const customCategories = [...new Set(
    savedFlows
      .flatMap(flow => flow.categories || [])
      .filter(cat => !baseCategories.includes(cat))
  )];
  const categories = [...baseCategories, ...customCategories];

  // Filter templates based on selected category and search
  let filteredAndSearched = selectedCategory === 'All'
    ? allTemplates.filter(t => {
        if (t.categories && Array.isArray(t.categories)) {
          return t.categories.some(cat => cat !== 'My Flows');
        }
        return t.category !== 'My Flows';
      })
    : allTemplates.filter(t => {
        if (t.categories && Array.isArray(t.categories)) {
          return t.categories.includes(selectedCategory);
        }
        return t.category === selectedCategory;
      });

  // Apply search filter
  if (searchQuery) {
    filteredAndSearched = filteredAndSearched.filter(t =>
      t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }

  // Apply sorting
  const filteredTemplates = [...filteredAndSearched].sort((a, b) => {
    if (sortBy === 'newest') {
      return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
    } else if (sortBy === 'oldest') {
      return new Date(a.createdAt || 0) - new Date(b.createdAt || 0);
    } else if (sortBy === 'mostViewed') {
      return (b.views || 0) - (a.views || 0);
    }
    return 0;
  });

  const deleteFlow = async (flowId) => {
    if (!confirm('Are you sure you want to delete this flow?')) {
      return;
    }

    try {
      await axios.delete(`${API_URL}/api/flows/${flowId}`);
      // Refresh saved flows
      const response = await axios.get(`${API_URL}/api/flows`);
      if (response.data && response.data.flows) {
        setSavedFlows(response.data.flows);
      }
    } catch (error) {
      console.error('Error deleting flow:', error);
      alert('Failed to delete flow. Please try again.');
    }
  };

  const handleDeleteCategory = (category) => {
    setCategoryToDelete(category);
    setDeleteConfirmText('');
    setShowDeleteCategoryModal(true);
  };

  const confirmDeleteCategory = async () => {
    if (deleteConfirmText.toLowerCase() !== 'delete') {
      return;
    }

    try {
      await axios.delete(`${API_URL}/api/flows/categories/${encodeURIComponent(categoryToDelete)}`);

      // Refresh flows to see updated categories
      const response = await axios.get(`${API_URL}/api/flows`);
      if (response.data && response.data.flows) {
        setSavedFlows(response.data.flows);
      }

      // Close modal and reset
      setShowDeleteCategoryModal(false);
      setCategoryToDelete(null);
      setDeleteConfirmText('');

      // If we deleted the currently selected category, switch to "All"
      if (selectedCategory === categoryToDelete) {
        setSelectedCategory('All');
      }
    } catch (error) {
      console.error('Error deleting category:', error);
      alert('Failed to delete category. Please try again.');
    }
  };

  const launchTemplate = async (template) => {
    const templateId = typeof template === 'string' ? template : template.id;

    // Handle AI builder template differently
    if (templateId === 'ai-builder') {
      setShowAIModal(true);
      return;
    }

    // Check if brand and channel are selected
    const currentBrand = getCurrentBrand();
    const currentChannel = getCurrentChannel();

    // If brand or channel not selected, redirect to brands page
    if (!currentBrand || !currentChannel) {
      router.push('/brands');
      return;
    }

    // Brand and channel are selected - proceed directly to flow builder
    setLoadingTemplate(templateId);

    try {
      // Check if this is a saved flow (has categories array)
      const isSavedFlow = typeof template === 'object' && template.categories && Array.isArray(template.categories);

      if (isSavedFlow) {
        // For saved flows, redirect directly to flow builder with flowId
        // Update onboarding progress
        const progress = JSON.parse(localStorage.getItem('onboardingProgress') || '{}');
        progress.templateLaunched = true;
        localStorage.setItem('onboardingProgress', JSON.stringify(progress));

        // Redirect to flow builder with the saved flow (context included automatically)
        router.push(`/flows?flowId=${templateId}`);
      } else {
        // For built-in templates, call the launch API with context
        const response = await api.post('/api/templates/launch', {
          templateId
        }, true); // requireContext = true

        const data = await response.json();
        if (data.success) {
          // Update onboarding progress
          const progress = JSON.parse(localStorage.getItem('onboardingProgress') || '{}');
          progress.templateLaunched = true;
          localStorage.setItem('onboardingProgress', JSON.stringify(progress));

          // Redirect to flow builder with the template
          router.push(`/flows?templateId=${templateId}`);
        }
      }
    } catch (error) {
      console.error('Error launching template:', error);
    } finally {
      setLoadingTemplate(null);
    }
  };

  const handleAIFlowGenerated = (flowData) => {
    // Update onboarding progress
    const progress = JSON.parse(localStorage.getItem('onboardingProgress') || '{}');
    progress.templateLaunched = true;
    localStorage.setItem('onboardingProgress', JSON.stringify(progress));

    // Redirect to flow builder with the AI-generated flow
    router.push(`/flows?ai=true`);
  };

  const handleBuildCustomFlow = () => {
    setShowBrandChannelModal(true);
  };

  const handleBrandChannelSelect = (brand, channel) => {
    // Set the selected brand and channel in context
    selectBrand(brand.id);
    selectChannel(channel.id);

    // Navigate to flow builder
    router.push('/flows');
  };

  const currentBrand = getCurrentBrand();
  const currentChannel = getCurrentChannel();

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-white dark:bg-gray-900">
        <NavigationSidebar />

        {/* Context Banner - Shows current brand/channel */}
        {currentBrand && currentChannel && (
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/10 dark:to-purple-900/10 border-b border-blue-200 dark:border-blue-800 px-4 py-3">
            <div className="max-w-6xl mx-auto flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="text-xs text-gray-600 dark:text-gray-400">
                  Templates scoped to:
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-blue-700 dark:text-blue-300">
                    {currentBrand.name}
                  </span>
                  <span className="text-gray-500 dark:text-gray-400">→</span>
                  <span className="text-sm font-semibold text-purple-700 dark:text-purple-300 capitalize">
                    {currentChannel.type}
                  </span>
                </div>
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                Templates will launch in this context
              </div>
            </div>
          </div>
        )}

      {/* Main Content - with left padding for sidebar */}
      <main className={`transition-all duration-300 ${isCollapsed ? 'ml-20' : 'ml-64'} max-w-6xl mx-auto px-4 py-12`}>
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-black dark:text-white mb-2">Template Gallery</h1>
          <p className="text-sm text-gray-600 dark:text-gray-400 max-w-3xl">
            Launch pre-built automation workflows in seconds. Each template is fully customizable and ready to use.
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-6 flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search templates..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:border-blue-500 dark:focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900 focus:outline-none transition-all"
            />
          </div>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:border-blue-500 dark:focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900 focus:outline-none transition-all"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="mostViewed">Most Viewed</option>
          </select>
        </div>

        {/* Category Filter */}
        <div className="flex items-center gap-4 mb-8 overflow-x-auto">
          {categories.map((category) => {
            const isCustomCategory = !baseCategories.includes(category);
            return (
              <div key={category} className="relative">
                <button
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 border font-semibold whitespace-nowrap transition-all text-xs rounded-lg ${
                    selectedCategory === category
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white border-transparent shadow-md'
                      : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:border-purple-500 dark:hover:border-purple-500 hover:shadow-sm'
                  } ${isCustomCategory ? 'pr-8' : ''}`}
                >
                  {category}
                </button>
                {isCustomCategory && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteCategory(category);
                    }}
                    className="absolute right-1 top-1/2 -translate-y-1/2 w-4 h-4 flex items-center justify-center text-xs font-bold text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white"
                    title={`Delete ${category} category`}
                  >
                    ×
                  </button>
                )}
              </div>
            );
          })}
        </div>

        {/* Templates Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {filteredTemplates.map((template) => (
            <div
              key={template.id}
              className={`p-6 rounded-xl transition-all ${
                template.isAIBuilder
                  ? 'bg-gradient-to-br from-purple-600 to-pink-600 border-2 border-purple-400 shadow-2xl shadow-purple-500/50 ring-4 ring-purple-300/30 hover:shadow-purple-500/70 hover:scale-105'
                  : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-500 hover:shadow-xl'
              }`}
            >
              {/* Icon & Categories */}
              <div className="flex items-start justify-between mb-4">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-xl ${
                  template.isAIBuilder ? 'border-2 border-white bg-white/20' : 'border border-black dark:border-white'
                }`}>
                  {template.icon}
                </div>
                <div className="flex flex-wrap gap-2 justify-end">
                  {template.categories && Array.isArray(template.categories) ? (
                    template.categories.map((cat, idx) => (
                      <span key={idx} className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        template.isAIBuilder ? 'bg-white/30 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
                      }`}>
                        {cat}
                      </span>
                    ))
                  ) : (
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      template.isAIBuilder ? 'bg-white/30 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
                    }`}>
                      {template.category}
                    </span>
                  )}
                </div>
              </div>

              {/* Title & Description */}
              <h3 className={`text-base font-bold mb-2 ${
                template.isAIBuilder ? 'text-white' : 'text-gray-900 dark:text-white'
              }`}>{template.name}</h3>
              <p className={`text-xs mb-4 ${
                template.isAIBuilder ? 'text-white/90' : 'text-gray-600 dark:text-gray-400'
              }`}>{template.description}</p>

              {/* Features */}
              <div className="mb-4">
                <h4 className={`text-xs font-semibold mb-2 ${
                  template.isAIBuilder ? 'text-white' : 'text-gray-700 dark:text-gray-300'
                }`}>Includes:</h4>
                <ul className="space-y-1">
                  {template.features.map((feature, idx) => (
                    <li key={idx} className={`flex items-center gap-2 text-xs ${
                      template.isAIBuilder ? 'text-white/90' : 'text-gray-600 dark:text-gray-400'
                    }`}>
                      <span className={template.isAIBuilder ? 'text-white/70' : 'text-gray-400 dark:text-gray-500'}>·</span>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Stats */}
              <div className={`flex items-center justify-between mb-4 text-xs ${
                template.isAIBuilder ? 'text-white/80' : 'text-gray-500 dark:text-gray-400'
              }`}>
                <div>{Array.isArray(template.nodes) ? template.nodes.length : template.nodes} nodes</div>
                <div>{template.views || 0} views</div>
              </div>

              {/* Launch Button */}
              <button
                onClick={() => launchTemplate(template)}
                disabled={loadingTemplate === template.id}
                className={`w-full px-4 py-2 text-sm font-semibold transition-all rounded-lg shadow-sm hover:shadow-md ${
                  template.isAIBuilder
                    ? 'bg-white text-purple-600 hover:bg-purple-50 hover:text-purple-700'
                    : 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white'
                } ${loadingTemplate === template.id ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {loadingTemplate === template.id ? 'Launching...' : 'Launch Template'}
              </button>

              {/* Delete Button - Only for user-created flows */}
              {template.categories && Array.isArray(template.categories) && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteFlow(template.id);
                  }}
                  className="w-full mt-2 px-4 py-2 bg-white dark:bg-gray-800 text-red-600 dark:text-red-400 text-sm font-semibold hover:bg-red-50 dark:hover:bg-gray-700 hover:border-red-500 transition-all border border-red-200 dark:border-red-800 rounded-lg"
                >
                  Delete Flow
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Custom Flow CTA */}
        <div className="border border-gray-200 dark:border-gray-700 p-8 text-center">
          <h2 className="text-xl font-bold text-black dark:text-white mb-2">Need Something Custom?</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-6 max-w-2xl mx-auto">
            Start from scratch and build your own automation flow with our visual builder.
          </p>
          <button
            onClick={handleBuildCustomFlow}
            className="inline-block px-6 py-2 bg-black dark:bg-white text-white dark:text-black text-sm font-semibold hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors"
          >
            Build Custom Flow
          </button>
        </div>
      </main>

      {/* AI Flow Modal */}
      <AIFlowModal
        isOpen={showAIModal}
        onClose={() => setShowAIModal(false)}
        onFlowGenerated={handleAIFlowGenerated}
      />

      {/* Brand and Channel Selector Modal */}
      <BrandChannelSelectorModal
        isOpen={showBrandChannelModal}
        onClose={() => setShowBrandChannelModal(false)}
        onSelectComplete={handleBrandChannelSelect}
        brands={brands}
        title="Select Brand and Channel"
        message="Please select a brand and channel to build your custom automation flow"
      />

      {/* Delete Category Confirmation Modal */}
      {showDeleteCategoryModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 max-w-md w-full p-6 border border-gray-200 dark:border-gray-700">
            <div className="text-center mb-6">
              <div className="text-3xl mb-4">⚠️</div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Delete Category</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Are you sure you want to delete the <span className="font-semibold">"{categoryToDelete}"</span> category?
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
                This will remove the category from all flows. Flows will not be deleted.
              </p>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Type <span className="font-mono">delete</span> to confirm:
              </label>
              <input
                type="text"
                value={deleteConfirmText}
                onChange={(e) => setDeleteConfirmText(e.target.value)}
                placeholder="delete"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:border-black dark:focus:border-white focus:outline-none"
                autoFocus
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowDeleteCategoryModal(false);
                  setCategoryToDelete(null);
                  setDeleteConfirmText('');
                }}
                className="flex-1 px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm font-semibold hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmDeleteCategory}
                disabled={deleteConfirmText.toLowerCase() !== 'delete'}
                className={`flex-1 px-4 py-2 text-sm font-semibold transition-colors ${
                  deleteConfirmText.toLowerCase() === 'delete'
                    ? 'bg-red-600 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-800 text-white'
                    : 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                }`}
              >
                Delete Category
              </button>
            </div>
          </div>
        </div>
      )}
      </div>
    </ProtectedRoute>
  );
}
