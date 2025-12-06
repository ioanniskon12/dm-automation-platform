"use client";

import { useState } from 'react';

// Mock data - replace with real API calls later
const mockAutomations = [
  { id: 1, flowName: 'Welcome Flow', user: 'Kleima Home', status: 'Success', duration: '1.2s', runAt: '2024-12-06 14:30:22', error: null },
  { id: 2, flowName: 'Lead Capture', user: 'Perfect U Cosmetics', status: 'Success', duration: '0.8s', runAt: '2024-12-06 14:28:15', error: null },
  { id: 3, flowName: 'Order Update', user: 'TechFlow Agency', status: 'Failed', duration: '2.1s', runAt: '2024-12-06 14:25:45', error: 'API timeout: Instagram API did not respond within 30s' },
  { id: 4, flowName: 'Support Reply', user: 'Green Garden Shop', status: 'Success', duration: '0.5s', runAt: '2024-12-06 14:20:10', error: null },
  { id: 5, flowName: 'Promo Message', user: 'Fashion Forward', status: 'Success', duration: '1.5s', runAt: '2024-12-06 14:15:30', error: null },
  { id: 6, flowName: 'Cart Reminder', user: 'Healthy Bites', status: 'Failed', duration: '0.3s', runAt: '2024-12-06 14:10:00', error: 'User not found in database' },
  { id: 7, flowName: 'New Subscriber', user: 'Auto Parts Plus', status: 'Success', duration: '0.9s', runAt: '2024-12-06 14:05:45', error: null },
  { id: 8, flowName: 'Feedback Request', user: 'Kleima Home', status: 'Success', duration: '1.1s', runAt: '2024-12-06 14:00:20', error: null },
];

const metrics = [
  { label: 'Total Runs (24h)', value: '2,847', icon: '🔄' },
  { label: 'Success Rate', value: '98.2%', icon: '✅' },
  { label: 'Avg Duration', value: '0.9s', icon: '⏱️' },
  { label: 'Failed Runs', value: '52', icon: '❌' },
];

export default function AutomationsPage() {
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredAutomations = mockAutomations.filter((automation) => {
    const matchesSearch =
      automation.flowName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      automation.user.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'all' || automation.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Automations</h1>
        <p className="text-gray-600 mt-1">Global view of all automation runs.</p>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric, index) => (
          <div
            key={index}
            className="bg-white rounded-xl border border-gray-200 p-4 flex items-center gap-4"
          >
            <span className="text-2xl">{metric.icon}</span>
            <div>
              <p className="text-sm text-gray-600">{metric.label}</p>
              <p className="text-xl font-bold text-gray-900">{metric.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <svg
                className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <input
                type="text"
                placeholder="Search flows or users..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
            </div>
          </div>

          {/* Status Filter */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white"
          >
            <option value="all">All Status</option>
            <option value="Success">Success</option>
            <option value="Failed">Failed</option>
          </select>
        </div>
      </div>

      {/* Automations Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            Automation Runs
            <span className="ml-2 text-sm font-normal text-gray-500">
              ({filteredAutomations.length} runs)
            </span>
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="text-left text-xs font-semibold text-gray-600 uppercase tracking-wider px-6 py-3">
                  Flow Name
                </th>
                <th className="text-left text-xs font-semibold text-gray-600 uppercase tracking-wider px-6 py-3">
                  User
                </th>
                <th className="text-left text-xs font-semibold text-gray-600 uppercase tracking-wider px-6 py-3">
                  Status
                </th>
                <th className="text-left text-xs font-semibold text-gray-600 uppercase tracking-wider px-6 py-3">
                  Duration
                </th>
                <th className="text-left text-xs font-semibold text-gray-600 uppercase tracking-wider px-6 py-3">
                  Run At
                </th>
                <th className="text-left text-xs font-semibold text-gray-600 uppercase tracking-wider px-6 py-3">
                  Error
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredAutomations.map((automation) => (
                <tr key={automation.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <p className="text-sm font-medium text-gray-900">{automation.flowName}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-gray-600">{automation.user}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                        automation.status === 'Success'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {automation.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-gray-600">{automation.duration}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-gray-600">{automation.runAt}</p>
                  </td>
                  <td className="px-6 py-4">
                    {automation.error ? (
                      <p className="text-sm text-red-600 max-w-xs truncate" title={automation.error}>
                        {automation.error}
                      </p>
                    ) : (
                      <span className="text-sm text-gray-400">-</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredAutomations.length === 0 && (
          <div className="p-12 text-center">
            <svg
              className="w-12 h-12 text-gray-400 mx-auto mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
              />
            </svg>
            <p className="text-gray-500">No automations found matching your criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
}
