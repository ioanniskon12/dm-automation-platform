"use client";

import { useState, useEffect } from 'react';

// Activity log types
const LOG_TYPES = {
  LOGIN: 'Login',
  LOGOUT: 'Logout',
  SIGNUP: 'Signup',
  PASSWORD_RESET: 'Password Reset',
  FLOW_CREATED: 'Flow Created',
  FLOW_ACTIVATED: 'Flow Activated',
  MESSAGE_SENT: 'Message Sent',
  API_ERROR: 'API Error',
};

const severityColors = {
  success: 'bg-green-100 text-green-700',
  info: 'bg-blue-100 text-blue-700',
  warning: 'bg-yellow-100 text-yellow-700',
  error: 'bg-red-100 text-red-700',
};

const typeColors = {
  [LOG_TYPES.LOGIN]: 'bg-green-100 text-green-700',
  [LOG_TYPES.LOGOUT]: 'bg-gray-100 text-gray-700',
  [LOG_TYPES.SIGNUP]: 'bg-purple-100 text-purple-700',
  [LOG_TYPES.PASSWORD_RESET]: 'bg-orange-100 text-orange-700',
  [LOG_TYPES.FLOW_CREATED]: 'bg-blue-100 text-blue-700',
  [LOG_TYPES.FLOW_ACTIVATED]: 'bg-cyan-100 text-cyan-700',
  [LOG_TYPES.MESSAGE_SENT]: 'bg-indigo-100 text-indigo-700',
  [LOG_TYPES.API_ERROR]: 'bg-red-100 text-red-700',
};

export default function LogsPage() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState(LOG_TYPES.LOGIN);
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedLog, setExpandedLog] = useState(null);

  // Fetch logs from API or localStorage
  useEffect(() => {
    const fetchLogs = async () => {
      try {
        // Try to get logs from localStorage (for demo purposes)
        const storedLogs = localStorage.getItem('activityLogs');
        if (storedLogs) {
          setLogs(JSON.parse(storedLogs));
        } else {
          // Initialize with sample data
          const sampleLogs = [
            {
              id: 1,
              timestamp: new Date().toISOString(),
              type: LOG_TYPES.LOGIN,
              email: 'gianniskon12@gmail.com',
              severity: 'success',
              message: 'User logged in successfully',
              ip: '192.168.1.1',
              userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
              details: { method: 'email/password' }
            },
            {
              id: 2,
              timestamp: new Date(Date.now() - 3600000).toISOString(),
              type: LOG_TYPES.SIGNUP,
              email: 'newuser@example.com',
              severity: 'success',
              message: 'New user registered',
              ip: '10.0.0.50',
              userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0)',
              details: { source: 'organic' }
            },
            {
              id: 3,
              timestamp: new Date(Date.now() - 7200000).toISOString(),
              type: LOG_TYPES.API_ERROR,
              email: 'sotiris040197@gmail.com',
              severity: 'error',
              message: 'Instagram API rate limit exceeded',
              ip: '192.168.1.2',
              userAgent: 'Mozilla/5.0',
              details: { error: 'Rate limit exceeded', endpoint: '/api/instagram/messages' }
            },
            {
              id: 4,
              timestamp: new Date(Date.now() - 10800000).toISOString(),
              type: LOG_TYPES.FLOW_CREATED,
              email: 'gianniskon12@gmail.com',
              severity: 'info',
              message: 'New automation flow created',
              ip: '192.168.1.1',
              userAgent: 'Mozilla/5.0',
              details: { flowName: 'Welcome Message', channel: 'instagram' }
            },
            {
              id: 5,
              timestamp: new Date(Date.now() - 14400000).toISOString(),
              type: LOG_TYPES.LOGIN,
              email: 'sotiris040197@gmail.com',
              severity: 'success',
              message: 'User logged in successfully',
              ip: '10.0.0.100',
              userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
              details: { method: 'email/password' }
            },
          ];
          setLogs(sampleLogs);
          localStorage.setItem('activityLogs', JSON.stringify(sampleLogs));
        }
      } catch (error) {
        console.error('Error fetching logs:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLogs();
  }, []);

  // Get unique emails
  const uniqueEmails = [...new Set(logs.map(log => log.email))];

  // Filter logs - only by email search
  const filteredLogs = logs.filter((log) => {
    if (!searchQuery) return filterType === 'all' || log.type === filterType;
    return log.email.toLowerCase().includes(searchQuery.toLowerCase());
  });

  // Count by severity
  const errorCount = logs.filter((l) => l.severity === 'error').length;
  const warningCount = logs.filter((l) => l.severity === 'warning').length;
  const loginCount = logs.filter((l) => l.type === LOG_TYPES.LOGIN).length;
  const signupCount = logs.filter((l) => l.type === LOG_TYPES.SIGNUP).length;

  // Format timestamp
  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  // Add a new log entry (can be called from other parts of the app)
  const addLog = (logEntry) => {
    const newLog = {
      id: Date.now(),
      timestamp: new Date().toISOString(),
      ...logEntry
    };
    const updatedLogs = [newLog, ...logs];
    setLogs(updatedLogs);
    localStorage.setItem('activityLogs', JSON.stringify(updatedLogs));
  };

  // Clear all logs
  const clearLogs = () => {
    if (confirm('Are you sure you want to clear all logs?')) {
      setLogs([]);
      localStorage.removeItem('activityLogs');
    }
  };

  if (loading) {
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
          <p className="text-gray-600 mt-1">Track user activity, logins, and system events by email.</p>
        </div>
        <button
          onClick={clearLogs}
          className="px-4 py-2 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
        >
          Clear Logs
        </button>
      </div>

      {/* Summary Cards - Clickable Filters */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div
          onClick={() => setFilterType(filterType === LOG_TYPES.LOGIN ? 'all' : LOG_TYPES.LOGIN)}
          className={`bg-white rounded-xl border-2 p-4 cursor-pointer transition-all hover:shadow-md ${
            filterType === LOG_TYPES.LOGIN ? 'border-green-500 ring-2 ring-green-200' : 'border-gray-200 hover:border-green-300'
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
              <p className="text-xl font-bold text-green-600">{loginCount}</p>
            </div>
          </div>
        </div>
        <div
          onClick={() => setFilterType(filterType === LOG_TYPES.SIGNUP ? 'all' : LOG_TYPES.SIGNUP)}
          className={`bg-white rounded-xl border-2 p-4 cursor-pointer transition-all hover:shadow-md ${
            filterType === LOG_TYPES.SIGNUP ? 'border-purple-500 ring-2 ring-purple-200' : 'border-gray-200 hover:border-purple-300'
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
              <p className="text-xl font-bold text-purple-600">{signupCount}</p>
            </div>
          </div>
        </div>
        <div
          onClick={() => setFilterType(filterType === LOG_TYPES.API_ERROR ? 'all' : LOG_TYPES.API_ERROR)}
          className={`bg-white rounded-xl border-2 p-4 cursor-pointer transition-all hover:shadow-md ${
            filterType === LOG_TYPES.API_ERROR ? 'border-red-500 ring-2 ring-red-200' : 'border-gray-200 hover:border-red-300'
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-sm text-gray-600">Errors</p>
              <p className="text-xl font-bold text-red-600">{errorCount}</p>
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
              <p className="text-xl font-bold text-blue-600">{uniqueEmails.length}</p>
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
              ({filteredLogs.length} entries)
            </span>
          </h3>
        </div>
        <div className="divide-y divide-gray-200">
          {filteredLogs.map((log) => (
            <div key={log.id} className="hover:bg-gray-50">
              <div
                className="px-6 py-4 cursor-pointer"
                onClick={() => setExpandedLog(expandedLog === log.id ? null : log.id)}
              >
                <div className="flex items-start gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${severityColors[log.severity]}`}>
                        {log.severity}
                      </span>
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${typeColors[log.type]}`}>
                        {log.type}
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
                      <span className="text-gray-900">{log.ip}</span>
                    </div>
                    <div className="flex gap-2">
                      <span className="text-gray-500 w-24">User Agent:</span>
                      <span className="text-gray-900 break-all">{log.userAgent}</span>
                    </div>
                    {log.details && (
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

        {filteredLogs.length === 0 && (
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
            <p className="text-gray-500">No logs found matching your criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
}
