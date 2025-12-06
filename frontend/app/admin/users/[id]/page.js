"use client";

import { useParams } from 'next/navigation';
import Link from 'next/link';

// Mock data - replace with real API calls later
const mockUserData = {
  '1': {
    id: '1',
    workspace: 'Kleima Home',
    email: 'hello@kleimahome.com',
    plan: 'Pro',
    status: 'Active',
    createdAt: '2024-01-15',
    lastActive: '2024-12-06',
    messagesThisMonth: 12500,
    botsCount: 5,
    automationsCount: 12,
    integrations: ['Instagram', 'WhatsApp', 'Messenger'],
  },
  '2': {
    id: '2',
    workspace: 'Perfect U Cosmetics',
    email: 'info@perfectu.com',
    plan: 'Starter',
    status: 'Active',
    createdAt: '2024-02-20',
    lastActive: '2024-12-05',
    messagesThisMonth: 3200,
    botsCount: 2,
    automationsCount: 4,
    integrations: ['Instagram'],
  },
};

const recentAutomations = [
  { id: 1, name: 'Welcome Flow', status: 'Success', runAt: '2024-12-06 14:30', duration: '1.2s' },
  { id: 2, name: 'Lead Capture', status: 'Success', runAt: '2024-12-06 12:15', duration: '0.8s' },
  { id: 3, name: 'Order Update', status: 'Failed', runAt: '2024-12-06 10:45', duration: '2.1s' },
  { id: 4, name: 'Support Reply', status: 'Success', runAt: '2024-12-05 18:20', duration: '0.5s' },
];

export default function UserDetailPage() {
  const params = useParams();
  const userId = params.id;

  // Get user data (mock for now)
  const user = mockUserData[userId] || {
    id: userId,
    workspace: `User #${userId}`,
    email: 'unknown@example.com',
    plan: 'Free',
    status: 'Unknown',
    createdAt: 'N/A',
    lastActive: 'N/A',
    messagesThisMonth: 0,
    botsCount: 0,
    automationsCount: 0,
    integrations: [],
  };

  return (
    <div className="space-y-6">
      {/* Breadcrumb & Header */}
      <div>
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
          <Link href="/admin/users" className="hover:text-blue-600">
            Users
          </Link>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
          <span className="text-gray-900">{user.workspace}</span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-xl">
                {user.workspace.charAt(0)}
              </span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{user.workspace}</h1>
              <p className="text-gray-600">{user.email}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
              Suspend
            </button>
            <button className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700">
              Edit User
            </button>
          </div>
        </div>
      </div>

      {/* Info Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Profile Card */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Profile</h3>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-500">Email</p>
              <p className="text-sm font-medium text-gray-900">{user.email}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Plan</p>
              <span
                className={`inline-block text-xs font-medium px-2.5 py-1 rounded-full ${
                  user.plan === 'Pro'
                    ? 'bg-purple-100 text-purple-700'
                    : user.plan === 'Starter'
                    ? 'bg-blue-100 text-blue-700'
                    : 'bg-gray-100 text-gray-700'
                }`}
              >
                {user.plan}
              </span>
            </div>
            <div>
              <p className="text-sm text-gray-500">Status</p>
              <span
                className={`inline-block text-xs font-medium px-2.5 py-1 rounded-full ${
                  user.status === 'Active'
                    ? 'bg-green-100 text-green-700'
                    : user.status === 'Trial'
                    ? 'bg-yellow-100 text-yellow-700'
                    : 'bg-red-100 text-red-700'
                }`}
              >
                {user.status}
              </span>
            </div>
            <div>
              <p className="text-sm text-gray-500">Created At</p>
              <p className="text-sm font-medium text-gray-900">{user.createdAt}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Last Active</p>
              <p className="text-sm font-medium text-gray-900">{user.lastActive}</p>
            </div>
          </div>
        </div>

        {/* Usage Card */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Usage</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <span className="text-sm text-gray-600">Messages this month</span>
              </div>
              <span className="text-lg font-bold text-gray-900">{user.messagesThisMonth.toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <span className="text-sm text-gray-600">Bots created</span>
              </div>
              <span className="text-lg font-bold text-gray-900">{user.botsCount}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                </div>
                <span className="text-sm text-gray-600">Automations</span>
              </div>
              <span className="text-lg font-bold text-gray-900">{user.automationsCount}</span>
            </div>
          </div>
        </div>

        {/* Integrations Card */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Integrations</h3>
          {user.integrations.length > 0 ? (
            <div className="space-y-3">
              {user.integrations.map((integration, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
                >
                  <div
                    className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      integration === 'Instagram'
                        ? 'bg-gradient-to-br from-purple-500 to-pink-500'
                        : integration === 'WhatsApp'
                        ? 'bg-green-500'
                        : 'bg-blue-500'
                    }`}
                  >
                    <span className="text-white text-xs font-bold">
                      {integration.charAt(0)}
                    </span>
                  </div>
                  <span className="text-sm font-medium text-gray-900">{integration}</span>
                  <span className="ml-auto text-xs text-green-600 font-medium">Connected</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <p>No integrations connected</p>
            </div>
          )}
        </div>
      </div>

      {/* Recent Automations */}
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Recent Automations</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="text-left text-xs font-semibold text-gray-600 uppercase tracking-wider px-6 py-3">
                  Flow Name
                </th>
                <th className="text-left text-xs font-semibold text-gray-600 uppercase tracking-wider px-6 py-3">
                  Status
                </th>
                <th className="text-left text-xs font-semibold text-gray-600 uppercase tracking-wider px-6 py-3">
                  Run At
                </th>
                <th className="text-left text-xs font-semibold text-gray-600 uppercase tracking-wider px-6 py-3">
                  Duration
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {recentAutomations.map((automation) => (
                <tr key={automation.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <p className="text-sm font-medium text-gray-900">{automation.name}</p>
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
                    <p className="text-sm text-gray-600">{automation.runAt}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-gray-600">{automation.duration}</p>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
