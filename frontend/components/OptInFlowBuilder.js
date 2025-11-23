'use client'

import { useCallback, useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useBrandChannel } from '../contexts/BrandChannelContext'
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  BackgroundVariant,
} from 'reactflow'
import 'reactflow/dist/style.css'

import TriggerNode from './nodes/TriggerNode'
import ActionNode from './nodes/ActionNode'
import NodeConfigPanel from './NodeConfigPanel'

const nodeTypes = {
  trigger: TriggerNode,
  action: ActionNode,
}

// Pre-configured nodes for opt-in automation
const initialNodes = [
  {
    id: 'trigger-1',
    type: 'trigger',
    position: { x: 250, y: 50 },
    data: {
      label: 'Keyword Trigger',
      triggerType: 'keyword',
      config: {
        keywords: ['start', 'subscribe'],
        matchType: 'exact',
        caseSensitive: false,
      },
    },
  },
  {
    id: 'action-1',
    type: 'action',
    position: { x: 250, y: 200 },
    data: {
      label: 'Instagram Opt-in',
      actionType: 'instagram_opt_in',
      config: {
        action: 'subscribe',
        description: 'Sets Instagram opt-in status to subscribed',
      },
    },
  },
  {
    id: 'action-2',
    type: 'action',
    position: { x: 250, y: 350 },
    data: {
      label: 'Send Message',
      actionType: 'send_message',
      config: {
        messageType: 'text',
        text: 'You have successfully subscribed to {{instagram_account_name}}!\n\nP.S. If you want to unsubscribe again, just type "stop".',
        channel: 'instagram',
        buttons: [],
      },
    },
  },
]

const initialEdges = [
  {
    id: 'e-trigger-action',
    source: 'trigger-1',
    target: 'action-1',
    animated: true,
    style: { stroke: '#3b82f6', strokeWidth: 2 },
  },
  {
    id: 'e-action-message',
    source: 'action-1',
    target: 'action-2',
    animated: true,
    style: { stroke: '#3b82f6', strokeWidth: 2 },
  },
]

export default function OptInFlowBuilder() {
  const router = useRouter()
  const { getCurrentBrand, getCurrentChannel } = useBrandChannel()
  const currentBrand = getCurrentBrand()
  const currentChannel = getCurrentChannel()

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges)
  const [selectedNodeId, setSelectedNodeId] = useState(null)
  const [status, setStatus] = useState('draft')

  // Get the current selected node
  const selectedNode = selectedNodeId ? nodes.find(n => n.id === selectedNodeId) : null

  // Update brand name in confirmation message
  useEffect(() => {
    if (currentBrand) {
      setNodes((nds) =>
        nds.map((node) => {
          if (node.id === 'action-2' && node.data.config.text) {
            return {
              ...node,
              data: {
                ...node.data,
                config: {
                  ...node.data.config,
                  text: node.data.config.text.replace(
                    '{{instagram_account_name}}',
                    currentBrand.name
                  ),
                },
              },
            }
          }
          return node
        })
      )
    }
  }, [currentBrand, setNodes])

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  )

  const onNodeClick = useCallback((event, node) => {
    setSelectedNodeId(node.id)
  }, [])

  const onPaneClick = useCallback(() => {
    setSelectedNodeId(null)
  }, [])

  const updateNodeData = useCallback(
    (nodeId, newData) => {
      setNodes((nds) =>
        nds.map((node) => {
          if (node.id === nodeId) {
            return {
              ...node,
              data: {
                ...node.data,
                ...newData,
              },
            }
          }
          return node
        })
      )
    },
    [setNodes]
  )

  const handleSave = async () => {
    // TODO: API call to save opt-in automation
    console.log('Saving opt-in automation:', { nodes, edges })
    alert('Opt-in automation saved!')
  }

  const handleGoLive = async () => {
    if (!currentChannel || currentChannel.status !== 'connected') {
      alert('Channel must be connected before going live.')
      return
    }

    // TODO: API call to activate automation
    console.log('Going live with opt-in automation:', { nodes, edges })
    setStatus('live')
    alert('Opt-in automation is now live!')
  }

  return (
    <div className="flex-1 flex flex-col">
      {/* Top Bar */}
      <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.push('/global-automations')}
            className="text-gray-500 hover:text-black dark:hover:text-white transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div>
            <h1 className="text-xl font-bold text-black dark:text-white">
              Opt-in Automation
            </h1>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              Triggers when user types START or SUBSCRIBE
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Status Badge */}
          <div
            className={`px-3 py-1 rounded-full text-xs font-semibold ${
              status === 'live'
                ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
            }`}
          >
            {status === 'live' ? 'Live' : 'Draft'}
          </div>

          {/* Save Button */}
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500 text-gray-700 dark:text-gray-300 font-medium rounded-lg transition-all text-sm"
          >
            Save
          </button>

          {/* Go Live Button */}
          <button
            onClick={handleGoLive}
            className="px-6 py-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold rounded-lg transition-all text-sm"
          >
            {status === 'live' ? 'Update' : 'Go Live'}
          </button>
        </div>
      </div>

      {/* Info Banner */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border-b border-blue-200 dark:border-blue-800 px-6 py-3">
        <div className="flex items-start gap-2">
          <svg
            className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
              clipRule="evenodd"
            />
          </svg>
          <div className="flex-1">
            <p className="text-sm text-blue-700 dark:text-blue-300">
              <strong>Opt-in Automation:</strong> This flow automatically subscribes users when they send
              specific keywords. Click on any node to customize its settings, including keywords, opt-in
              action, and confirmation message.
            </p>
          </div>
        </div>
      </div>

      {/* Flow Canvas */}
      <div className="flex-1 relative">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onNodeClick={onNodeClick}
          onPaneClick={onPaneClick}
          nodeTypes={nodeTypes}
          fitView
          className="bg-gray-50 dark:bg-gray-950"
        >
          <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
          <Controls />
          <MiniMap
            nodeColor={(node) => {
              if (node.type === 'trigger') return '#f59e0b'
              if (node.type === 'action' && node.data.actionType === 'instagram_opt_in')
                return '#10b981'
              if (node.type === 'action' && node.data.actionType === 'send_message')
                return '#3b82f6'
              return '#6b7280'
            }}
          />
        </ReactFlow>

        {/* Node Config Panel */}
        {selectedNode && (
          <NodeConfigPanel
            node={selectedNode}
            onUpdate={(newData) => updateNodeData(selectedNode.id, newData)}
            onClose={() => setSelectedNodeId(null)}
          />
        )}
      </div>

      {/* Validation Warning */}
      {currentChannel?.status !== 'connected' && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 max-w-2xl w-full mx-4">
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 shadow-lg">
            <div className="flex items-start gap-2">
              <svg
                className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
              <div>
                <h3 className="text-sm font-bold text-red-700 dark:text-red-300 mb-1">
                  Channel Not Connected
                </h3>
                <p className="text-sm text-red-600 dark:text-red-400">
                  Your Instagram channel must be connected before you can activate this automation.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
