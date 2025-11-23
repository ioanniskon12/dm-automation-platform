"use client";

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import ProtectedRoute from '../../../components/ProtectedRoute';
import NavigationSidebar from '../../../components/NavigationSidebar';
import { useSidebar } from '../../../contexts/SidebarContext';
import FlowBuilder from '../../../components/FlowBuilder';

function FlowViewContent() {
  const { isCollapsed } = useSidebar();
  const params = useParams();
  const router = useRouter();
  const flowId = params.id;
  const [isEditMode, setIsEditMode] = useState(false);

  // Mock flow data - in production, fetch from API based on flowId
  const [flow, setFlow] = useState({
    id: flowId,
    name: 'Instagram Story Reply Automation',
    description: 'Auto-reply to story mentions with welcome message',
    channel: 'Instagram',
    channelIcon: '📷',
    channelColor: 'from-pink-500 to-purple-600',
    status: 'active',
    createdAt: '2024-01-15',
    lastModified: '2024-01-20',
    triggers: 5,
    actions: 12,
    nodes: 17,
    analytics: {
      triggered: 342,
      completed: 318,
      failed: 24,
      successRate: 93,
      avgCompletionTime: '45s',
      peakHours: '2PM - 4PM',
      topTrigger: 'Story Mention',
      responseTime: {
        fastest: '12s',
        slowest: '2m 15s',
        average: '45s',
      },
      timeline: [
        { date: '2024-01-15', triggered: 45, completed: 42 },
        { date: '2024-01-16', triggered: 52, completed: 48 },
        { date: '2024-01-17', triggered: 38, completed: 36 },
        { date: '2024-01-18', triggered: 61, completed: 58 },
        { date: '2024-01-19', triggered: 72, completed: 67 },
        { date: '2024-01-20', triggered: 74, completed: 67 },
      ],
    },
  });

  // Mock nodes data for view-only flow visualization
  const mockNodes = [
    {
      id: '1',
      type: 'trigger',
      position: { x: 250, y: 50 },
      data: {
        label: 'Story Mention',
        triggerType: 'story_mention',
      },
    },
    {
      id: '2',
      type: 'action',
      position: { x: 250, y: 200 },
      data: {
        label: 'Send Welcome Message',
        actionType: 'send_message',
        message: 'Thanks for mentioning us! 🎉',
      },
    },
    {
      id: '3',
      type: 'action',
      position: { x: 250, y: 350 },
      data: {
        label: 'Add Tag: Story Responder',
        actionType: 'add_tag',
        tagName: 'story_responder',
      },
    },
  ];

  const mockEdges = [
    { id: 'e1-2', source: '1', target: '2', type: 'smoothstep' },
    { id: 'e2-3', source: '2', target: '3', type: 'smoothstep' },
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <NavigationSidebar />

      {isEditMode ? (
        // EDIT MODE - Full Flow Builder
        <div className={`transition-all duration-300 ${isCollapsed ? 'ml-20' : 'ml-64'} h-screen flex flex-col`}>
          {/* Edit Mode Header */}
          <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-black dark:text-white">{flow.name}</h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">Edit Mode</p>
            </div>
            <button
              onClick={() => setIsEditMode(false)}
              className="px-6 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-black dark:text-white font-semibold rounded-lg transition-colors"
            >
              ← Back to View
            </button>
          </div>

          {/* Flow Builder */}
          <div className="flex-1">
            <FlowBuilder initialNodes={mockNodes} initialEdges={mockEdges} />
          </div>
        </div>
      ) : (
        // VIEW MODE - Analytics and Read-only Flow
        <main className={`px-6 py-8 min-h-screen max-w-7xl mx-auto transition-all duration-300 ${isCollapsed ? 'ml-20' : 'ml-64'}`}>
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <Link
                  href="/flows-list"
                  className="inline-flex items-center text-sm text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white mb-3 transition-colors"
                >
                  ← Back to Flows
                </Link>
                <div className="flex items-center gap-4 mb-2">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${flow.channelColor} flex items-center justify-center text-2xl shadow-lg`}>
                    {flow.channelIcon}
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold text-black dark:text-white">{flow.name}</h1>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{flow.description}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 mt-4">
                  {flow.status === 'active' && (
                    <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 text-sm font-semibold rounded-full">
                      ● Active
                    </span>
                  )}
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {flow.channel} • {flow.nodes} nodes • Created {new Date(flow.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setIsEditMode(true)}
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all"
              >
                ✏️ Edit Flow
              </button>
            </div>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-5">
              <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total Triggered</div>
              <div className="text-3xl font-bold text-black dark:text-white">{flow.analytics.triggered}</div>
              <div className="text-xs text-green-600 dark:text-green-400 mt-1">+18% this week</div>
            </div>
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-5">
              <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Completed</div>
              <div className="text-3xl font-bold text-green-600 dark:text-green-400">{flow.analytics.completed}</div>
              <div className="text-xs text-gray-500 dark:text-gray-500 mt-1">{flow.analytics.failed} failed</div>
            </div>
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-5">
              <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Success Rate</div>
              <div className="text-3xl font-bold text-black dark:text-white">{flow.analytics.successRate}%</div>
              <div className="text-xs text-green-600 dark:text-green-400 mt-1">+2% improvement</div>
            </div>
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-5">
              <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Avg Completion</div>
              <div className="text-3xl font-bold text-black dark:text-white">{flow.analytics.avgCompletionTime}</div>
              <div className="text-xs text-gray-500 dark:text-gray-500 mt-1">Per execution</div>
            </div>
          </div>

          {/* Timeline Chart */}
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 mb-8">
            <h2 className="text-xl font-bold text-black dark:text-white mb-6">Performance Timeline</h2>
            <div className="space-y-4">
              {flow.analytics.timeline.map((day, idx) => {
                const maxValue = Math.max(...flow.analytics.timeline.map((d) => d.triggered));
                const triggeredWidth = (day.triggered / maxValue) * 100;
                const completedWidth = (day.completed / maxValue) * 100;
                return (
                  <div key={idx}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        {new Date(day.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </span>
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {day.completed}/{day.triggered}
                      </span>
                    </div>
                    <div className="space-y-1">
                      <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full transition-all duration-500"
                          style={{ width: `${triggeredWidth}%` }}
                        />
                      </div>
                      <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-green-500 to-emerald-500 rounded-full transition-all duration-500"
                          style={{ width: `${completedWidth}%` }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="mt-6 flex items-center gap-6 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-gradient-to-r from-blue-500 to-cyan-500 rounded"></div>
                <span className="text-gray-700 dark:text-gray-300">Triggered</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-gradient-to-r from-green-500 to-emerald-500 rounded"></div>
                <span className="text-gray-700 dark:text-gray-300">Completed</span>
              </div>
            </div>
          </div>

          {/* Additional Insights */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6">
              <h3 className="text-lg font-bold text-black dark:text-white mb-4">Response Times</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Fastest</span>
                  <span className="text-sm font-semibold text-green-600 dark:text-green-400">
                    {flow.analytics.responseTime.fastest}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Average</span>
                  <span className="text-sm font-semibold text-black dark:text-white">
                    {flow.analytics.responseTime.average}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Slowest</span>
                  <span className="text-sm font-semibold text-orange-600 dark:text-orange-400">
                    {flow.analytics.responseTime.slowest}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6">
              <h3 className="text-lg font-bold text-black dark:text-white mb-4">Top Trigger</h3>
              <div className="flex items-center gap-3 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center text-white font-bold">
                  #1
                </div>
                <div>
                  <div className="text-sm font-semibold text-black dark:text-white">{flow.analytics.topTrigger}</div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">
                    {flow.analytics.triggered} executions
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6">
              <h3 className="text-lg font-bold text-black dark:text-white mb-4">Peak Hours</h3>
              <div className="flex items-center gap-3">
                <div className="text-4xl">📊</div>
                <div>
                  <div className="text-xl font-bold text-black dark:text-white">{flow.analytics.peakHours}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Most active period</div>
                </div>
              </div>
            </div>
          </div>

          {/* Flow Visualization Preview */}
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-black dark:text-white">Flow Structure</h2>
              <span className="text-sm text-gray-600 dark:text-gray-400">View-only preview</span>
            </div>

            {/* Simple flow visualization */}
            <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-8 flex items-center justify-center min-h-[400px]">
              <div className="space-y-6 w-full max-w-md">
                {mockNodes.map((node, idx) => (
                  <div key={node.id}>
                    <div className={`bg-white dark:bg-gray-800 border-2 ${
                      node.type === 'trigger'
                        ? 'border-yellow-500'
                        : node.type === 'action'
                        ? 'border-green-500'
                        : 'border-blue-500'
                    } rounded-xl p-4 shadow-md`}>
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-lg ${
                          node.type === 'trigger'
                            ? 'bg-yellow-500'
                            : node.type === 'action'
                            ? 'bg-green-500'
                            : 'bg-blue-500'
                        } flex items-center justify-center text-white font-bold`}>
                          {node.type === 'trigger' ? '▶' : node.type === 'action' ? '⚡' : '🔀'}
                        </div>
                        <div className="flex-1">
                          <div className="text-sm font-semibold text-black dark:text-white">{node.data.label}</div>
                          <div className="text-xs text-gray-600 dark:text-gray-400 capitalize">{node.type}</div>
                        </div>
                      </div>
                    </div>
                    {idx < mockNodes.length - 1 && (
                      <div className="flex justify-center py-2">
                        <div className="w-0.5 h-8 bg-gray-300 dark:bg-gray-600"></div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6 text-center">
              <button
                onClick={() => setIsEditMode(true)}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
              >
                View Full Canvas →
              </button>
            </div>
          </div>
        </main>
      )}
    </div>
  );
}

export default function FlowView() {
  return (
    <ProtectedRoute>
      <FlowViewContent />
    </ProtectedRoute>
  );
}
