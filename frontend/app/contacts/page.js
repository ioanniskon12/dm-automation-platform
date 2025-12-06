"use client";

import { useState, useEffect } from 'react';
import NavigationSidebar from '../../components/NavigationSidebar';
import ProtectedRoute from '../../components/ProtectedRoute';
import { useBrandChannel } from '../../contexts/BrandChannelContext';
import { useSidebar } from '../../contexts/SidebarContext';

export default function Contacts() {
  const { isCollapsed } = useSidebar();
  const { selectedBrand, selectedChannel, getCurrentBrand, getCurrentChannel } = useBrandChannel();
  const [activeTab, setActiveTab] = useState('contacts'); // 'contacts' or 'tags'
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState('all'); // all, subscribed, unsubscribed
  const [selectedContact, setSelectedContact] = useState(null);
  const [loading, setLoading] = useState(false);

  // Mock data for contacts - ready for API integration
  const [contacts, setContacts] = useState([
    {
      id: '1',
      name: 'John Smith',
      username: '@johnsmith',
      email: 'john@example.com',
      phone: '+1 234 567 890',
      platform: 'instagram',
      avatar: 'https://i.pravatar.cc/150?img=12',
      status: 'subscribed',
      tags: ['VIP', 'Lead'],
      customFields: { company: 'Tech Corp', role: 'Manager' },
      firstContact: '2024-01-15',
      lastInteraction: '2024-12-05',
      totalMessages: 24,
      automationRuns: 3,
    },
    {
      id: '2',
      name: 'Sarah Johnson',
      username: '@sarahj',
      email: 'sarah@example.com',
      phone: '+1 345 678 901',
      platform: 'facebook',
      avatar: 'https://i.pravatar.cc/150?img=5',
      status: 'subscribed',
      tags: ['Customer', 'Newsletter'],
      customFields: { company: 'Design Studio', role: 'Designer' },
      firstContact: '2024-02-20',
      lastInteraction: '2024-12-04',
      totalMessages: 18,
      automationRuns: 5,
    },
    {
      id: '3',
      name: 'Mike Chen',
      username: '@mikechen',
      email: 'mike@example.com',
      phone: '+1 456 789 012',
      platform: 'whatsapp',
      avatar: 'https://i.pravatar.cc/150?img=33',
      status: 'subscribed',
      tags: ['Lead', 'Hot Lead'],
      customFields: { budget: '$5000', interest: 'Premium Plan' },
      firstContact: '2024-03-10',
      lastInteraction: '2024-12-03',
      totalMessages: 42,
      automationRuns: 8,
    },
    {
      id: '4',
      name: 'Emma Wilson',
      username: '@emmaw',
      email: 'emma@example.com',
      phone: '',
      platform: 'instagram',
      avatar: 'https://i.pravatar.cc/150?img=9',
      status: 'unsubscribed',
      tags: ['Customer'],
      customFields: {},
      firstContact: '2024-01-05',
      lastInteraction: '2024-11-20',
      totalMessages: 8,
      automationRuns: 2,
    },
    {
      id: '5',
      name: 'David Martinez',
      username: '@davidm',
      email: 'david@example.com',
      phone: '+1 567 890 123',
      platform: 'telegram',
      avatar: 'https://i.pravatar.cc/150?img=15',
      status: 'subscribed',
      tags: ['VIP', 'Customer', 'Newsletter'],
      customFields: { company: 'Martinez LLC', lifetime_value: '$12,500' },
      firstContact: '2024-04-01',
      lastInteraction: '2024-12-06',
      totalMessages: 67,
      automationRuns: 12,
    },
    {
      id: '6',
      name: 'Lisa Anderson',
      username: '@lisaa',
      email: '',
      phone: '+1 678 901 234',
      platform: 'facebook',
      avatar: 'https://i.pravatar.cc/150?img=20',
      status: 'subscribed',
      tags: ['Lead'],
      customFields: { source: 'Instagram Ad' },
      firstContact: '2024-05-15',
      lastInteraction: '2024-12-01',
      totalMessages: 12,
      automationRuns: 4,
    },
  ]);

  // Mock data for tags - ready for API integration
  const [tags, setTags] = useState([
    { id: '1', name: 'VIP', category: 'Status', color: 'purple', userCount: 2 },
    { id: '2', name: 'Lead', category: 'Status', color: 'blue', userCount: 3 },
    { id: '3', name: 'Hot Lead', category: 'Status', color: 'red', userCount: 1 },
    { id: '4', name: 'Customer', category: 'Status', color: 'green', userCount: 3 },
    { id: '5', name: 'Newsletter', category: 'Marketing', color: 'orange', userCount: 2 },
    { id: '6', name: 'Interested in Product A', category: 'Interest', color: 'cyan', userCount: 0 },
    { id: '7', name: 'Interested in Product B', category: 'Interest', color: 'pink', userCount: 0 },
  ]);

  const [categories, setCategories] = useState([
    { id: '1', name: 'Status', tagCount: 4 },
    { id: '2', name: 'Marketing', tagCount: 1 },
    { id: '3', name: 'Interest', tagCount: 2 },
  ]);

  const currentBrand = getCurrentBrand();
  const currentChannel = getCurrentChannel();

  // Filter contacts
  const filteredContacts = contacts.filter(contact => {
    const matchesSearch = !searchQuery ||
      contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.email?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesTag = !selectedTag || contact.tags.includes(selectedTag);

    const matchesStatus = selectedStatus === 'all' || contact.status === selectedStatus;

    return matchesSearch && matchesTag && matchesStatus;
  });

  // Get tag color classes
  const getTagColorClasses = (color) => {
    const colors = {
      purple: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300 border-purple-300 dark:border-purple-700',
      blue: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 border-blue-300 dark:border-blue-700',
      red: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300 border-red-300 dark:border-red-700',
      green: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300 border-green-300 dark:border-green-700',
      orange: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300 border-orange-300 dark:border-orange-700',
      cyan: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-300 border-cyan-300 dark:border-cyan-700',
      pink: 'bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-300 border-pink-300 dark:border-pink-700',
      gray: 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-300 border-gray-300 dark:border-gray-700',
    };
    return colors[color] || colors.gray;
  };

  // Get platform icon
  const getPlatformIcon = (platform) => {
    const icons = {
      instagram: (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
          <defs>
            <linearGradient id="ig-grad" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" style={{stopColor: '#F58529'}} />
              <stop offset="50%" style={{stopColor: '#DD2A7B'}} />
              <stop offset="100%" style={{stopColor: '#515BD4'}} />
            </linearGradient>
          </defs>
          <rect width="24" height="24" rx="6" fill="url(#ig-grad)" />
          <circle cx="12" cy="12" r="4" stroke="white" strokeWidth="1.5" fill="none" />
          <circle cx="17" cy="7" r="1" fill="white" />
        </svg>
      ),
      facebook: (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="#1877F2">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
        </svg>
      ),
      whatsapp: (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="#25D366">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
        </svg>
      ),
      telegram: (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="#0088cc">
          <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
        </svg>
      ),
    };
    return icons[platform] || <span className="w-4 h-4 bg-gray-400 rounded-full" />;
  };

  // Get tag by name
  const getTagByName = (tagName) => {
    return tags.find(t => t.name === tagName);
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-white dark:bg-gray-900">
        <NavigationSidebar />

        {/* Context Banner */}
        {currentBrand && (
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/10 dark:to-purple-900/10 border-b border-blue-200 dark:border-blue-800 px-4 py-3">
            <div className="max-w-7xl mx-auto flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="text-xs text-gray-600 dark:text-gray-400">
                  Contacts for:
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-blue-700 dark:text-blue-300">
                    {currentBrand.name}
                  </span>
                  {currentChannel && (
                    <>
                      <span className="text-gray-500 dark:text-gray-400">→</span>
                      <span className="text-sm font-semibold text-purple-700 dark:text-purple-300 capitalize">
                        {currentChannel.type}
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Main Content */}
        <main className={`transition-all duration-300 ${isCollapsed ? 'ml-20' : 'ml-64'} px-6 py-8`}>
          {/* Page Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-black dark:text-white mb-1">Contacts & Subscribers</h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Manage your contacts, view their info, and organize with tags
              </p>
            </div>
            <div className="flex gap-2">
              <button className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-semibold text-sm rounded-lg hover:border-gray-400 dark:hover:border-gray-500 transition-colors flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                </svg>
                Export
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-4 mb-6 border-b border-gray-200 dark:border-gray-700">
            <button
              onClick={() => setActiveTab('contacts')}
              className={`pb-3 px-1 text-sm font-semibold transition-colors relative ${
                activeTab === 'contacts'
                  ? 'text-blue-600 dark:text-blue-400'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
              }`}
            >
              Contacts
              <span className="ml-2 px-2 py-0.5 text-xs bg-gray-100 dark:bg-gray-800 rounded-full">
                {contacts.length}
              </span>
              {activeTab === 'contacts' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 dark:bg-blue-400" />
              )}
            </button>
            <button
              onClick={() => setActiveTab('tags')}
              className={`pb-3 px-1 text-sm font-semibold transition-colors relative ${
                activeTab === 'tags'
                  ? 'text-blue-600 dark:text-blue-400'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
              }`}
            >
              Tags & Categories
              <span className="ml-2 px-2 py-0.5 text-xs bg-gray-100 dark:bg-gray-800 rounded-full">
                {tags.length}
              </span>
              {activeTab === 'tags' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 dark:bg-blue-400" />
              )}
            </button>
          </div>

          {/* Contacts Tab */}
          {activeTab === 'contacts' && (
            <div className="flex gap-6">
              {/* Contacts List */}
              <div className="flex-1">
                {/* Search and Filters */}
                <div className="flex gap-3 mb-4">
                  <div className="flex-1 relative">
                    <svg className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <input
                      type="text"
                      placeholder="Search contacts..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                  <select
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    className="px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:border-blue-500 focus:outline-none"
                  >
                    <option value="all">All Status</option>
                    <option value="subscribed">Subscribed</option>
                    <option value="unsubscribed">Unsubscribed</option>
                  </select>
                  <select
                    value={selectedTag || ''}
                    onChange={(e) => setSelectedTag(e.target.value || null)}
                    className="px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:border-blue-500 focus:outline-none"
                  >
                    <option value="">All Tags</option>
                    {tags.map(tag => (
                      <option key={tag.id} value={tag.name}>{tag.name}</option>
                    ))}
                  </select>
                </div>

                {/* Contacts Table */}
                <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gray-50 dark:bg-gray-900/50 border-b border-gray-200 dark:border-gray-700">
                        <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">Contact</th>
                        <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">Platform</th>
                        <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">Tags</th>
                        <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">Status</th>
                        <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">Last Active</th>
                        <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">Messages</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredContacts.map((contact) => (
                        <tr
                          key={contact.id}
                          onClick={() => setSelectedContact(contact)}
                          className={`border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-900/30 cursor-pointer transition-colors ${
                            selectedContact?.id === contact.id ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                          }`}
                        >
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-3">
                              <img
                                src={contact.avatar}
                                alt={contact.name}
                                className="w-9 h-9 rounded-full object-cover"
                              />
                              <div>
                                <div className="text-sm font-semibold text-gray-900 dark:text-white">{contact.name}</div>
                                <div className="text-xs text-gray-500 dark:text-gray-400">{contact.username}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              {getPlatformIcon(contact.platform)}
                              <span className="text-xs text-gray-600 dark:text-gray-400 capitalize">{contact.platform}</span>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex flex-wrap gap-1">
                              {contact.tags.slice(0, 2).map(tagName => {
                                const tag = getTagByName(tagName);
                                return (
                                  <span
                                    key={tagName}
                                    className={`px-2 py-0.5 text-xs font-medium rounded-full border ${getTagColorClasses(tag?.color || 'gray')}`}
                                  >
                                    {tagName}
                                  </span>
                                );
                              })}
                              {contact.tags.length > 2 && (
                                <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400">
                                  +{contact.tags.length - 2}
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                              contact.status === 'subscribed'
                                ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300'
                                : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300'
                            }`}>
                              {contact.status === 'subscribed' ? 'Subscribed' : 'Unsubscribed'}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-xs text-gray-600 dark:text-gray-400">
                            {new Date(contact.lastInteraction).toLocaleDateString()}
                          </td>
                          <td className="px-4 py-3 text-xs text-gray-600 dark:text-gray-400">
                            {contact.totalMessages}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  {filteredContacts.length === 0 && (
                    <div className="p-8 text-center">
                      <div className="text-4xl mb-3">👥</div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">No contacts found</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Contact Details Sidebar */}
              {selectedContact && (
                <div className="w-80 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-5 h-fit sticky top-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-bold text-gray-900 dark:text-white">Contact Details</h3>
                    <button
                      onClick={() => setSelectedContact(null)}
                      className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>

                  {/* Profile */}
                  <div className="text-center mb-5">
                    <img
                      src={selectedContact.avatar}
                      alt={selectedContact.name}
                      className="w-16 h-16 rounded-full mx-auto mb-3 object-cover"
                    />
                    <h4 className="text-base font-bold text-gray-900 dark:text-white">{selectedContact.name}</h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{selectedContact.username}</p>
                    <div className="flex justify-center mt-2">
                      {getPlatformIcon(selectedContact.platform)}
                    </div>
                  </div>

                  {/* Status */}
                  <div className="flex justify-center mb-5">
                    <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                      selectedContact.status === 'subscribed'
                        ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300'
                        : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300'
                    }`}>
                      {selectedContact.status === 'subscribed' ? 'Subscribed' : 'Unsubscribed'}
                    </span>
                  </div>

                  {/* Contact Info */}
                  <div className="space-y-3 mb-5">
                    <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Contact Info</div>
                    {selectedContact.email && (
                      <div className="flex items-center gap-2 text-sm">
                        <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        <span className="text-gray-700 dark:text-gray-300">{selectedContact.email}</span>
                      </div>
                    )}
                    {selectedContact.phone && (
                      <div className="flex items-center gap-2 text-sm">
                        <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                        <span className="text-gray-700 dark:text-gray-300">{selectedContact.phone}</span>
                      </div>
                    )}
                    {!selectedContact.email && !selectedContact.phone && (
                      <p className="text-xs text-gray-400 dark:text-gray-500 italic">No contact info captured</p>
                    )}
                  </div>

                  {/* Tags */}
                  <div className="mb-5">
                    <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">Tags</div>
                    <div className="flex flex-wrap gap-1">
                      {selectedContact.tags.map(tagName => {
                        const tag = getTagByName(tagName);
                        return (
                          <span
                            key={tagName}
                            className={`px-2 py-1 text-xs font-medium rounded-full border ${getTagColorClasses(tag?.color || 'gray')}`}
                          >
                            {tagName}
                          </span>
                        );
                      })}
                      {selectedContact.tags.length === 0 && (
                        <p className="text-xs text-gray-400 dark:text-gray-500 italic">No tags</p>
                      )}
                    </div>
                  </div>

                  {/* Custom Fields */}
                  {Object.keys(selectedContact.customFields).length > 0 && (
                    <div className="mb-5">
                      <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">Custom Fields</div>
                      <div className="space-y-2">
                        {Object.entries(selectedContact.customFields).map(([key, value]) => (
                          <div key={key} className="flex justify-between text-sm">
                            <span className="text-gray-500 dark:text-gray-400 capitalize">{key.replace(/_/g, ' ')}</span>
                            <span className="text-gray-900 dark:text-white font-medium">{value}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Stats */}
                  <div>
                    <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">Activity</div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-3 text-center">
                        <div className="text-lg font-bold text-gray-900 dark:text-white">{selectedContact.totalMessages}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">Messages</div>
                      </div>
                      <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-3 text-center">
                        <div className="text-lg font-bold text-gray-900 dark:text-white">{selectedContact.automationRuns}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">Automations</div>
                      </div>
                    </div>
                    <div className="mt-3 text-xs text-gray-500 dark:text-gray-400">
                      <div>First contact: {new Date(selectedContact.firstContact).toLocaleDateString()}</div>
                      <div>Last active: {new Date(selectedContact.lastInteraction).toLocaleDateString()}</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Tags Tab */}
          {activeTab === 'tags' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Categories Overview */}
              <div className="lg:col-span-1">
                <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-5">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-bold text-gray-900 dark:text-white">Categories</h3>
                    <button className="text-xs text-blue-600 dark:text-blue-400 hover:underline">+ Add</button>
                  </div>
                  <div className="space-y-2">
                    {categories.map(category => (
                      <div
                        key={category.id}
                        className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-900 cursor-pointer transition-colors"
                      >
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-blue-500 rounded-full" />
                          <span className="text-sm font-medium text-gray-900 dark:text-white">{category.name}</span>
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">{category.tagCount} tags</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Summary Stats */}
                <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-5 mt-6">
                  <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-4">Tag Summary</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Total Tags</span>
                      <span className="text-sm font-bold text-gray-900 dark:text-white">{tags.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Categories</span>
                      <span className="text-sm font-bold text-gray-900 dark:text-white">{categories.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Total Tagged Users</span>
                      <span className="text-sm font-bold text-gray-900 dark:text-white">
                        {contacts.filter(c => c.tags.length > 0).length}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Tags List */}
              <div className="lg:col-span-2">
                <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl">
                  <div className="flex items-center justify-between p-5 border-b border-gray-200 dark:border-gray-700">
                    <h3 className="text-sm font-bold text-gray-900 dark:text-white">All Tags</h3>
                    <button className="px-3 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors">
                      + Create Tag
                    </button>
                  </div>

                  <div className="divide-y divide-gray-100 dark:divide-gray-700">
                    {tags.map(tag => (
                      <div key={tag.id} className="flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-900/30 transition-colors">
                        <div className="flex items-center gap-3">
                          <span className={`px-3 py-1 text-xs font-semibold rounded-full border ${getTagColorClasses(tag.color)}`}>
                            {tag.name}
                          </span>
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            in {tag.category}
                          </span>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-1">
                            <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                            <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">{tag.userCount}</span>
                            <span className="text-xs text-gray-500 dark:text-gray-400">users</span>
                          </div>
                          <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {tags.length === 0 && (
                    <div className="p-8 text-center">
                      <div className="text-4xl mb-3">🏷️</div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">No tags created yet</p>
                      <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Tags help you organize and segment your contacts</p>
                    </div>
                  )}
                </div>

                {/* Tag Usage Chart */}
                <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-5 mt-6">
                  <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-4">Tag Usage</h3>
                  <div className="space-y-3">
                    {tags.filter(t => t.userCount > 0).sort((a, b) => b.userCount - a.userCount).map(tag => {
                      const maxCount = Math.max(...tags.map(t => t.userCount));
                      const percentage = maxCount > 0 ? (tag.userCount / maxCount) * 100 : 0;
                      return (
                        <div key={tag.id}>
                          <div className="flex justify-between mb-1">
                            <span className="text-xs font-medium text-gray-700 dark:text-gray-300">{tag.name}</span>
                            <span className="text-xs text-gray-500 dark:text-gray-400">{tag.userCount} users</span>
                          </div>
                          <div className="w-full h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full bg-gradient-to-r from-blue-500 to-purple-500`}
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                    {tags.filter(t => t.userCount > 0).length === 0 && (
                      <p className="text-xs text-gray-400 dark:text-gray-500 italic text-center py-4">No tag usage data yet</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </ProtectedRoute>
  );
}
