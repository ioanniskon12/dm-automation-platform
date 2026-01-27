"use client";

import { useState, useEffect } from 'react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3003';

// Type labels for display
const typeLabels = {
  login: 'Login',
  login_failed: 'Login Failed',
  login_blocked: 'Login Blocked',
  signup: 'Signup',
  signup_failed: 'Signup Failed',
  password_reset_request: 'Password Reset Request',
  password_reset: 'Password Reset',
  admin_action: 'Admin Action',
};

const severityColors = {
  success: 'bg-green-100 text-green-700',
  info: 'bg-blue-100 text-blue-700',
  warning: 'bg-yellow-100 text-yellow-700',
  error: 'bg-red-100 text-red-700',
};

const typeColors = {
  login: 'bg-green-100 text-green-700',
  login_failed: 'bg-red-100 text-red-700',
  login_blocked: 'bg-red-100 text-red-700',
  signup: 'bg-purple-100 text-purple-700',
  signup_failed: 'bg-red-100 text-red-700',
  password_reset_request: 'bg-orange-100 text-orange-700',
  password_reset: 'bg-orange-100 text-orange-700',
  admin_action: 'bg-blue-100 text-blue-700',
};

export default function LogsPage() {
  const [logs, setLogs] = useState([]);
  const [stats, setStats] = useState({
    loginCount: 0,
    signupCount: 0,
    errorCount: 0,
    uniqueUsers: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterType, setFilterType] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedLog, setExpandedLog] = useState(null);

  // Fetch logs from backend API
  const fetchLogs = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('authToken');

      // Build query params
      const params = new URLSearchParams();
      if (filterType && filterType !== 'all') {
        params.append('type', filterType);
      }
      if (searchQuery) {
        params.append('email', searchQuery);
      }
      params.append('limit', '100');

      const response = await fetch(`${API_URL}/api/admin/logs?${params}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch logs');
      }

      const data = await response.json();
      if (data.success) {
        setLogs(data.logs);
      }
    } catch (err) {
      console.error('Error fetching logs:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Fetch stats from backend API
  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`${API_URL}/api/admin/logs/stats`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setStats(data.stats);
        }
      }
    } catch (err) {
      console.error('Error fetching stats:', err);
    }
  };

  useEffect(() => {
    fetchLogs();
    fetchStats();
  }, [filterType, searchQuery]);

  // Refresh logs
  const refreshLogs = () => {
    fetchLogs();
    fetchStats();
  };

  // Format timestamp
  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  // Get type label
  const getTypeLabel = (type) => {
    return typeLabels[type] || type;
  };

  if (loading && logs.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Activity Logs</h1>
          <p className="text-gray-600 mt-1">Track user activity, logins, and system events.</p>
        </div>
        <button
          onClick={refreshLogs}
          className="px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Refresh
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Summary Cards - Clickable Filters */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div
          onClick={() => setFilterType(filterType === 'login' ? 'all' : 'login')}
          className={`bg-white rounded-xl border-2 p-4 cursor-pointer transition-all hover:shadow-md ${
            filterType === 'login' ? 'border-green-500 ring-2 ring-green-200' : 'border-gray-200 hover:border-green-300'
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
              </svg>
            </div>
            <div>
              <p className="text-sm text-gray-600">Logins</p>
              <p className="text-xl font-bold text-green-600">{stats.loginCount}</p>
            </div>
          </div>
        </div>
        <div
          onClick={() => setFilterType(filterType === 'signup' ? 'all' : 'signup')}
          className={`bg-white rounded-xl border-2 p-4 cursor-pointer transition-all hover:shadow-md ${
            filterType === 'signup' ? 'border-purple-500 ring-2 ring-purple-200' : 'border-gray-200 hover:border-purple-300'
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
            </div>
            <div>
              <p className="text-sm text-gray-600">Signups</p>
              <p className="text-xl font-bold text-purple-600">{stats.signupCount}</p>
            </div>
          </div>
        </div>
        <div
          onClick={() => setFilterType(filterType === 'login_failed' ? 'all' : 'login_failed')}
          className={`bg-white rounded-xl border-2 p-4 cursor-pointer transition-all hover:shadow-md ${
            filterType === 'login_failed' ? 'border-red-500 ring-2 ring-red-200' : 'border-gray-200 hover:border-red-300'
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-sm text-gray-600">Failed Logins</p>
              <p className="text-xl font-bold text-red-600">{stats.errorCount}</p>
            </div>
          </div>
        </div>
        <div
          onClick={() => setFilterType('all')}
          className={`bg-white rounded-xl border-2 p-4 cursor-pointer transition-all hover:shadow-md ${
            filterType === 'all' ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-200 hover:border-blue-300'
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <div>
              <p className="text-sm text-gray-600">Unique Users</p>
              <p className="text-xl font-bold text-blue-600">{stats.uniqueUsers}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search by Email */}
      <div className="relative max-w-sm">
        <svg
          className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
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
          placeholder="Search by email..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-9 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
        />
      </div>

      {/* Logs Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            Activity Log
            <span className="ml-2 text-sm font-normal text-gray-500">
              ({logs.length} entries)
            </span>
          </h3>
        </div>
        <div className="divide-y divide-gray-200">
          {logs.map((log) => (
            <div key={log.id} className="hover:bg-gray-50">
              <div
                className="px-6 py-4 cursor-pointer"
                onClick={() => setExpandedLog(expandedLog === log.id ? null : log.id)}
              >
                <div className="flex items-start gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${severityColors[log.severity] || 'bg-gray-100 text-gray-700'}`}>
                        {log.severity}
                      </span>
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${typeColors[log.type] || 'bg-gray-100 text-gray-700'}`}>
                        {getTypeLabel(log.type)}
                      </span>
                      <span className="text-xs text-gray-500">{formatTime(log.timestamp)}</span>
                    </div>
                    <p className="text-sm font-medium text-gray-900">{log.message}</p>
                    <p className="text-sm text-blue-600 mt-1 font-medium">{log.email}</p>
                  </div>
                  <svg
                    className={`w-5 h-5 text-gray-400 transition-transform ${
                      expandedLog === log.id ? 'rotate-180' : ''
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
              {expandedLog === log.id && (
                <div className="px-6 pb-4">
                  <div className="bg-gray-50 rounded-lg p-4 text-sm space-y-2">
                    <div className="flex gap-2">
                      <span className="text-gray-500 w-24">IP Address:</span>
                      <span className="text-gray-900">{log.ip || 'unknown'}</span>
                    </div>
                    <div className="flex gap-2">
                      <span className="text-gray-500 w-24">User Agent:</span>
                      <span className="text-gray-900 break-all">{log.userAgent || 'unknown'}</span>
                    </div>
                    {log.details && Object.keys(log.details).length > 0 && (
                      <div className="flex gap-2">
                        <span className="text-gray-500 w-24">Details:</span>
                        <pre className="text-gray-900 text-xs bg-gray-100 p-2 rounded overflow-x-auto">
                          {JSON.stringify(log.details, null, 2)}
                        </pre>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {logs.length === 0 && !loading && (
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
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <p className="text-gray-500">No activity logs yet. Logs will appear when users login or signup.</p>
          </div>
        )}
      </div>
    </div>
  );
}
