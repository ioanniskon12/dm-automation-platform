"use client";

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import NavigationSidebar from '../../components/NavigationSidebar';
import ProtectedRoute from '../../components/ProtectedRoute';
import { useAuth } from '../../contexts/AuthContext';
import { useBrandChannel } from '../../contexts/BrandChannelContext';
import { useSidebar } from '../../contexts/SidebarContext';

function SettingsPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuth();
  const { getCurrentBrand } = useBrandChannel();
  const { isCollapsed } = useSidebar();
  const [activeTab, setActiveTab] = useState('account');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const currentBrand = getCurrentBrand();
  const brandId = searchParams.get('brand') || currentBrand?.id;

  // Form states
  const [accountForm, setAccountForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    company: '',
    phone: '',
  });

  const [subscriptionData, setSubscriptionData] = useState({
    plan: 'Professional',
    status: 'Active',
    nextBilling: '2025-12-11',
    amount: '$99/month',
    features: [
      '10,000 messages/month',
      'Unlimited flows',
      'All channels',
      'Priority support',
      'Advanced analytics',
    ],
  });

  const handleSaveAccount = async () => {
    setSaving(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setSaving(false);
    alert('Account settings saved!');
  };

  const handleCancelSubscription = () => {
    if (confirm('Are you sure you want to cancel your subscription?')) {
      alert('Subscription cancellation requested');
    }
  };

  const handleDeleteBrand = async () => {
    if (!currentBrand) {
      alert('No brand selected');
      return;
    }

    const confirmDelete = confirm(
      `Are you sure you want to delete "${currentBrand.name}"?\n\nThis will permanently delete:\n• All flows\n• All channels\n• All knowledge base data\n• All analytics data\n\nThis action cannot be undone.`
    );

    if (!confirmDelete) return;

    const doubleConfirm = prompt(
      `To confirm deletion, please type the brand name: "${currentBrand.name}"`
    );

    if (doubleConfirm !== currentBrand.name) {
      alert('Brand name does not match. Deletion cancelled.');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`/api/brands/${currentBrand.id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete brand');
      }

      const data = await response.json();
      alert('Brand deleted successfully');
      // Redirect to brands page
      router.push('/brands');
    } catch (error) {
      console.error('Error deleting brand:', error);
      alert(`Failed to delete brand: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-white dark:bg-gray-900">
        <NavigationSidebar />

        {/* Main Content */}
        <div className={`transition-all duration-300 pt-16 md:pt-0 ${isCollapsed ? 'md:ml-20' : 'md:ml-64'}`}>
          {/* Header */}
          <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 px-4 md:px-8 py-4 md:py-6">
            <div className="max-w-6xl mx-auto">
              <div className="flex items-center justify-between mb-4 md:mb-6">
                <div>
                  <h1 className="text-xl md:text-3xl font-bold text-black dark:text-white mb-1 md:mb-2">Settings</h1>
                  <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400">
                    Manage your account, subscription, and preferences
                  </p>
                </div>
              </div>

              {/* Tabs - horizontally scrollable on mobile */}
              <div className="flex gap-1 overflow-x-auto pb-1 -mx-4 px-4 md:mx-0 md:px-0 scrollbar-hide">
                <button
                  onClick={() => setActiveTab('account')}
                  className={`px-3 md:px-4 py-2 rounded-t-lg font-medium transition-colors whitespace-nowrap text-sm md:text-base ${
                    activeTab === 'account'
                      ? 'bg-white dark:bg-gray-900 text-black dark:text-white border-t border-l border-r border-gray-200 dark:border-gray-700'
                      : 'text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white'
                  }`}
                >
                  Account
                </button>
                <button
                  onClick={() => setActiveTab('subscription')}
                  className={`px-3 md:px-4 py-2 rounded-t-lg font-medium transition-colors whitespace-nowrap text-sm md:text-base ${
                    activeTab === 'subscription'
                      ? 'bg-white dark:bg-gray-900 text-black dark:text-white border-t border-l border-r border-gray-200 dark:border-gray-700'
                      : 'text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white'
                  }`}
                >
                  Subscription
                </button>
                <button
                  onClick={() => setActiveTab('brand')}
                  className={`px-3 md:px-4 py-2 rounded-t-lg font-medium transition-colors whitespace-nowrap text-sm md:text-base ${
                    activeTab === 'brand'
                      ? 'bg-white dark:bg-gray-900 text-black dark:text-white border-t border-l border-r border-gray-200 dark:border-gray-700'
                      : 'text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white'
                  }`}
                >
                  Brand
                </button>
                <button
                  onClick={() => setActiveTab('security')}
                  className={`px-3 md:px-4 py-2 rounded-t-lg font-medium transition-colors whitespace-nowrap text-sm md:text-base ${
                    activeTab === 'security'
                      ? 'bg-white dark:bg-gray-900 text-black dark:text-white border-t border-l border-r border-gray-200 dark:border-gray-700'
                      : 'text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white'
                  }`}
                >
                  Security
                </button>
              </div>
            </div>
          </div>

          {/* Content Area */}
          <div className="max-w-6xl mx-auto p-4 md:p-8">
            {/* Account Tab */}
            {activeTab === 'account' && (
              <div className="space-y-4 md:space-y-6">
                <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4 md:p-6">
                  <h2 className="text-base md:text-xl font-bold text-black dark:text-white mb-4 md:mb-6">Account Information</h2>

                  <div className="space-y-3 md:space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                      <div>
                        <label className="block text-xs md:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 md:mb-2">
                          Full Name
                        </label>
                        <input
                          type="text"
                          value={accountForm.name}
                          onChange={(e) => setAccountForm({...accountForm, name: e.target.value})}
                          className="w-full px-3 md:px-4 py-2 text-sm md:text-base border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-black dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent"
                        />
                      </div>

                      <div>
                        <label className="block text-xs md:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 md:mb-2">
                          Email Address
                        </label>
                        <input
                          type="email"
                          value={accountForm.email}
                          onChange={(e) => setAccountForm({...accountForm, email: e.target.value})}
                          className="w-full px-3 md:px-4 py-2 text-sm md:text-base border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-black dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                      <div>
                        <label className="block text-xs md:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 md:mb-2">
                          Company Name
                        </label>
                        <input
                          type="text"
                          value={accountForm.company}
                          onChange={(e) => setAccountForm({...accountForm, company: e.target.value})}
                          className="w-full px-3 md:px-4 py-2 text-sm md:text-base border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-black dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent"
                        />
                      </div>

                      <div>
                        <label className="block text-xs md:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 md:mb-2">
                          Phone Number
                        </label>
                        <input
                          type="tel"
                          value={accountForm.phone}
                          onChange={(e) => setAccountForm({...accountForm, phone: e.target.value})}
                          className="w-full px-3 md:px-4 py-2 text-sm md:text-base border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-black dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent"
                        />
                      </div>
                    </div>

                    <div className="flex justify-end pt-2 md:pt-4">
                      <button
                        onClick={handleSaveAccount}
                        disabled={saving}
                        className="px-4 md:px-6 py-2 text-sm md:text-base bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium rounded-lg transition-all disabled:opacity-50"
                      >
                        {saving ? 'Saving...' : 'Save Changes'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Subscription Tab */}
            {activeTab === 'subscription' && (
              <div className="space-y-4 md:space-y-6">
                <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4 md:p-6">
                  <h2 className="text-base md:text-xl font-bold text-black dark:text-white mb-4 md:mb-6">Current Plan</h2>

                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-4 md:mb-6">
                    <div>
                      <h3 className="text-xl md:text-2xl font-bold text-black dark:text-white mb-2">
                        {subscriptionData.plan}
                      </h3>
                      <div className="flex items-center gap-2 mb-2 md:mb-4">
                        <span className="inline-flex items-center gap-2 bg-green-100 dark:bg-green-900/30 border border-green-600 dark:border-green-600/50 rounded-lg px-2 md:px-3 py-1">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <span className="text-xs md:text-sm text-green-700 dark:text-green-400 font-medium">
                            {subscriptionData.status}
                          </span>
                        </span>
                      </div>
                      <p className="text-gray-600 dark:text-gray-400 text-xs md:text-sm">
                        Next billing date: {subscriptionData.nextBilling}
                      </p>
                    </div>

                    <div className="md:text-right">
                      <div className="text-xl md:text-3xl font-bold text-black dark:text-white mb-1 md:mb-2">
                        {subscriptionData.amount}
                      </div>
                      <button
                        onClick={() => alert('Upgrade plan')}
                        className="text-xs md:text-sm text-blue-600 dark:text-blue-400 hover:underline"
                      >
                        Upgrade Plan
                      </button>
                    </div>
                  </div>

                  <div className="border-t border-gray-200 dark:border-gray-700 pt-4 md:pt-6">
                    <h4 className="text-xs md:text-sm font-semibold text-black dark:text-white mb-3 md:mb-4">Plan Features</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-3">
                      {subscriptionData.features.map((feature, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          <svg className="w-4 h-4 md:w-5 md:h-5 text-green-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          <span className="text-xs md:text-sm text-gray-700 dark:text-gray-300">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4 md:p-6">
                  <h2 className="text-base md:text-xl font-bold text-black dark:text-white mb-3 md:mb-4">Billing History</h2>
                  <div className="space-y-2 md:space-y-3">
                    {[
                      { date: '2025-11-11', amount: '$99.00', status: 'Paid' },
                      { date: '2025-10-11', amount: '$99.00', status: 'Paid' },
                      { date: '2025-09-11', amount: '$99.00', status: 'Paid' },
                    ].map((invoice, idx) => (
                      <div key={idx} className="flex items-center justify-between p-3 md:p-4 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg">
                        <div>
                          <div className="text-xs md:text-sm font-semibold text-black dark:text-white">{invoice.date}</div>
                          <div className="text-xs text-gray-600 dark:text-gray-400">{invoice.status}</div>
                        </div>
                        <div className="flex items-center gap-2 md:gap-4">
                          <span className="text-xs md:text-sm font-bold text-black dark:text-white">{invoice.amount}</span>
                          <button className="text-xs md:text-sm text-blue-600 dark:text-blue-400 hover:underline">
                            Download
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4 md:p-6">
                  <h3 className="text-sm md:text-lg font-bold text-red-900 dark:text-red-400 mb-1 md:mb-2">Cancel Subscription</h3>
                  <p className="text-xs md:text-sm text-red-700 dark:text-red-300 mb-3 md:mb-4">
                    Cancelling your subscription will disable all features at the end of your billing period.
                  </p>
                  <button
                    onClick={handleCancelSubscription}
                    className="px-3 md:px-4 py-2 text-sm md:text-base bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors"
                  >
                    Cancel Subscription
                  </button>
                </div>
              </div>
            )}

            {/* Brand Settings Tab */}
            {activeTab === 'brand' && (
              <div className="space-y-4 md:space-y-6">
                <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4 md:p-6">
                  <h2 className="text-base md:text-xl font-bold text-black dark:text-white mb-4 md:mb-6">Brand Settings</h2>

                  <div className="space-y-3 md:space-y-4">
                    <div>
                      <label className="block text-xs md:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 md:mb-2">
                        Brand Name
                      </label>
                      <input
                        type="text"
                        defaultValue={currentBrand?.name || ''}
                        className="w-full px-3 md:px-4 py-2 text-sm md:text-base border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-black dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-xs md:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 md:mb-2">
                        Website URL
                      </label>
                      <input
                        type="url"
                        placeholder="https://yourbrand.com"
                        className="w-full px-3 md:px-4 py-2 text-sm md:text-base border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-black dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-xs md:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 md:mb-2">
                        Description
                      </label>
                      <textarea
                        rows={4}
                        className="w-full px-3 md:px-4 py-2 text-sm md:text-base border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-black dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent"
                        placeholder="Tell us about your brand..."
                      />
                    </div>

                    <div className="flex justify-end pt-2 md:pt-4">
                      <button className="px-4 md:px-6 py-2 text-sm md:text-base bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium rounded-lg transition-all">
                        Save Brand Settings
                      </button>
                    </div>
                  </div>
                </div>

                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4 md:p-6">
                  <h3 className="text-sm md:text-lg font-bold text-red-900 dark:text-red-400 mb-1 md:mb-2">Delete Brand</h3>
                  <p className="text-xs md:text-sm text-red-700 dark:text-red-300 mb-3 md:mb-4">
                    Permanently delete this brand and all associated data. This action cannot be undone.
                  </p>
                  <button
                    onClick={handleDeleteBrand}
                    disabled={loading}
                    className="px-3 md:px-4 py-2 text-sm md:text-base bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Deleting...' : 'Delete Brand'}
                  </button>
                </div>
              </div>
            )}

            {/* Security Tab */}
            {activeTab === 'security' && (
              <div className="space-y-4 md:space-y-6">
                <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4 md:p-6">
                  <h2 className="text-base md:text-xl font-bold text-black dark:text-white mb-4 md:mb-6">Change Password</h2>

                  <div className="space-y-3 md:space-y-4">
                    <div>
                      <label className="block text-xs md:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 md:mb-2">
                        Current Password
                      </label>
                      <input
                        type="password"
                        className="w-full px-3 md:px-4 py-2 text-sm md:text-base border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-black dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-xs md:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 md:mb-2">
                        New Password
                      </label>
                      <input
                        type="password"
                        className="w-full px-3 md:px-4 py-2 text-sm md:text-base border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-black dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-xs md:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 md:mb-2">
                        Confirm New Password
                      </label>
                      <input
                        type="password"
                        className="w-full px-3 md:px-4 py-2 text-sm md:text-base border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-black dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent"
                      />
                    </div>

                    <div className="flex justify-end pt-2 md:pt-4">
                      <button className="px-4 md:px-6 py-2 text-sm md:text-base bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium rounded-lg transition-all">
                        Update Password
                      </button>
                    </div>
                  </div>
                </div>

                <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4 md:p-6">
                  <h2 className="text-base md:text-xl font-bold text-black dark:text-white mb-3 md:mb-4">Two-Factor Authentication</h2>
                  <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400 mb-3 md:mb-4">
                    Add an extra layer of security to your account by enabling two-factor authentication.
                  </p>
                  <button className="px-3 md:px-4 py-2 text-sm md:text-base bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors">
                    Enable 2FA
                  </button>
                </div>

                <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4 md:p-6">
                  <h2 className="text-base md:text-xl font-bold text-black dark:text-white mb-3 md:mb-4">Active Sessions</h2>
                  <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400 mb-3 md:mb-4">
                    Manage devices where you're currently logged in.
                  </p>
                  <div className="space-y-2 md:space-y-3">
                    {[
                      { device: 'MacBook Pro', location: 'New York, US', lastActive: '5 mins ago', current: true },
                      { device: 'iPhone 13', location: 'New York, US', lastActive: '2 hours ago', current: false },
                    ].map((session, idx) => (
                      <div key={idx} className="flex items-center justify-between p-3 md:p-4 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg">
                        <div className="min-w-0 flex-1">
                          <div className="text-xs md:text-sm font-semibold text-black dark:text-white flex items-center gap-2 flex-wrap">
                            <span className="truncate">{session.device}</span>
                            {session.current && (
                              <span className="text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-2 py-0.5 rounded flex-shrink-0">
                                Current
                              </span>
                            )}
                          </div>
                          <div className="text-xs text-gray-600 dark:text-gray-400 truncate">
                            {session.location} · {session.lastActive}
                          </div>
                        </div>
                        {!session.current && (
                          <button className="text-xs md:text-sm text-red-600 dark:text-red-400 hover:underline ml-2 flex-shrink-0">
                            Revoke
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}

export default function SettingsPage() {
  return (
    <Suspense fallback={<div className="h-screen flex items-center justify-center"><div className="animate-spin w-8 h-8 border-2 border-black border-t-transparent rounded-full"></div></div>}>
      <SettingsPageContent />
    </Suspense>
  );
}
