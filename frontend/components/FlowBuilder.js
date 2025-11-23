'use client'

import { useCallback, useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import axios from 'axios'
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
import ConditionNode from './nodes/ConditionNode'
import ActionNode from './nodes/ActionNode'
import AINode from './nodes/AINode'
import MediaNode from './nodes/MediaNode'
import Sidebar from './Sidebar'
import NodeConfigPanel from './NodeConfigPanel'
import AIAssistant from './AIAssistant'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

const nodeTypes = {
  trigger: TriggerNode,
  condition: ConditionNode,
  action: ActionNode,
  ai: AINode,
  media: MediaNode,
}

const defaultInitialNodes = []
const defaultInitialEdges = []

export default function FlowBuilder({ automationType = null, selectedTemplate = null, prePopulatedTrigger = null, channelType = 'instagram' }) {
  const searchParams = useSearchParams()
  const templateId = searchParams.get('templateId')
  const flowId = searchParams.get('flowId')
  const [availableTriggers, setAvailableTriggers] = useState([])

  // Get automation type labels
  const getAutomationLabels = () => {
    if (automationType === 'opt-in') {
      return {
        saveButton: 'Save Opt-in Automation',
        modalTitle: 'Save Opt-in Automation',
        modalDescription: 'Configure the automation that triggers when users opt-in (type START or SUBSCRIBE).',
        savingText: 'Saving Opt-in...',
        savedText: 'Opt-in Saved'
      };
    } else if (automationType === 'opt-out') {
      return {
        saveButton: 'Save Opt-out Automation',
        modalTitle: 'Save Opt-out Automation',
        modalDescription: 'Configure the automation that triggers when users opt-out (type STOP or UNSUBSCRIBE).',
        savingText: 'Saving Opt-out...',
        savedText: 'Opt-out Saved'
      };
    } else if (automationType === 'story-mention') {
      return {
        saveButton: 'Save Story Mention Reply',
        modalTitle: 'Save Story Mention Reply',
        modalDescription: 'Configure the automation that triggers when someone mentions your account in their story.',
        savingText: 'Saving Story Reply...',
        savedText: 'Story Reply Saved'
      };
    } else {
      return {
        saveButton: 'Save Flow',
        modalTitle: 'Save Flow',
        modalDescription: 'Give your automation flow a name and choose where to save it.',
        savingText: 'Saving...',
        savedText: 'Flow Saved'
      };
    }
  };

  const automationLabels = getAutomationLabels()
  const [nodes, setNodes, onNodesChange] = useNodesState(defaultInitialNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(defaultInitialEdges)
  const [selectedNodeId, setSelectedNodeId] = useState(null)
  const [loading, setLoading] = useState(false)
  const [sidebarMinimized, setSidebarMinimized] = useState(false)
  const [showSaveModal, setShowSaveModal] = useState(false)
  const [showTriggerModal, setShowTriggerModal] = useState(!prePopulatedTrigger)
  const [flowName, setFlowName] = useState('')
  const [selectedCategories, setSelectedCategories] = useState(['My Flows'])
  const [newCategory, setNewCategory] = useState('')
  const [validationErrors, setValidationErrors] = useState([])
  const [notification, setNotification] = useState(null)
  const [availableCategories, setAvailableCategories] = useState(['My Flows', 'Sales', 'Support', 'E-commerce', 'Engagement'])

  // Get the current selected node from the nodes array to ensure we always have fresh data
  const selectedNode = selectedNodeId ? nodes.find(n => n.id === selectedNodeId) : null

  // Prevent body scrolling when modals are open
  useEffect(() => {
    if (showSaveModal || showTriggerModal || selectedNodeId) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    // Cleanup on unmount
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [showSaveModal, showTriggerModal, selectedNodeId])

  // Load template or saved flow data when templateId or flowId is present
  useEffect(() => {
    const loadFlow = async () => {
      if (!templateId && !flowId) return

      setLoading(true)
      try {
        let response

        if (flowId) {
          // Load saved flow from /api/flows/:id
          response = await axios.get(`${API_URL}/api/flows/${flowId}`)
          if (response.data.success && response.data.flow) {
            const flow = response.data.flow
            if (flow.nodes && flow.nodes.length > 0) {
              setNodes(flow.nodes)
              setEdges(flow.edges || [])
              setFlowName(flow.name || '')
              setSelectedCategories(flow.categories || ['My Flows'])
            }
          }
        } else if (templateId) {
          // Load template from /api/templates/:id
          response = await axios.get(`${API_URL}/api/templates/${templateId}`)
          if (response.data.success && response.data.template) {
            const template = response.data.template
            if (template.nodes && template.nodes.length > 0) {
              setNodes(template.nodes)
              setEdges(template.edges || [])
            }
          }
        }
      } catch (error) {
        console.error('Error loading flow:', error)
      } finally {
        setLoading(false)
      }
    }

    loadFlow()
  }, [templateId, flowId, setNodes, setEdges])

  // Hide trigger modal if nodes exist
  useEffect(() => {
    if (nodes.length > 0) {
      setShowTriggerModal(false)
    }
  }, [nodes])

  // Pre-populate trigger if provided
  useEffect(() => {
    if (prePopulatedTrigger && nodes.length === 0) {
      handleTriggerSelect(prePopulatedTrigger)
      setShowTriggerModal(false)
    }
  }, [prePopulatedTrigger])

  // Fetch available triggers based on channel type
  useEffect(() => {
    const fetchTriggers = async () => {
      try {
        // Map channel type: facebook -> messenger (backend uses 'messenger')
        const backendChannelType = channelType === 'facebook' ? 'messenger' : channelType

        const response = await axios.get(`/api/triggers/types?channel=${backendChannelType}`)

        if (response.data.success) {
          setAvailableTriggers(response.data.triggerTypes)
        }
      } catch (error) {
        console.error('Error fetching triggers:', error)
        setAvailableTriggers([])
      }
    }

    if (channelType) {
      fetchTriggers()
    }
  }, [channelType])

  // Handle trigger selection
  const handleTriggerSelect = useCallback((triggerTypeId) => {
    // Find the selected trigger from available triggers
    const selectedTrigger = availableTriggers.find(t => t.id === triggerTypeId)

    if (!selectedTrigger) {
      console.error('Trigger not found:', triggerTypeId)
      return
    }

    // Create initial configuration from trigger's config schema
    const initialConfig = {}
    if (selectedTrigger.configSchema) {
      selectedTrigger.configSchema.forEach(field => {
        initialConfig[field.field] = field.defaultValue !== undefined ? field.defaultValue : ''
      })
    }

    const newNode = {
      id: '1',
      type: 'trigger',
      data: {
        label: selectedTrigger.name,
        triggerType: selectedTrigger.id,
        ...initialConfig
      },
      position: { x: 250, y: 50 },
    }

    setNodes([newNode])
    setShowTriggerModal(false)
  }, [availableTriggers, setNodes])

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

  const addNode = useCallback((typeOrNodes, dataOrEdges) => {
    // Check if we're receiving arrays (new signature for multiple nodes)
    if (Array.isArray(typeOrNodes)) {
      const newNodes = typeOrNodes
      const newEdges = dataOrEdges || []
      setNodes((nds) => [...nds, ...newNodes])
      setEdges((eds) => [...eds, ...newEdges])
    } else {
      // Original signature for single node
      const type = typeOrNodes
      const data = dataOrEdges
      const newNode = {
        id: `${Date.now()}`,
        type,
        data,
        position: {
          x: Math.random() * 400 + 100,
          y: Math.random() * 400 + 100,
        },
      }
      setNodes((nds) => [...nds, newNode])
    }
  }, [setNodes, setEdges])

  const updateNodeData = useCallback((nodeId, newData) => {
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === nodeId) {
          return {
            ...node,
            data: { ...node.data, ...newData },
          }
        }
        return node
      })
    )
  }, [setNodes])

  const deleteNode = useCallback((nodeId) => {
    setNodes((nds) => nds.filter((node) => node.id !== nodeId))
    setEdges((eds) => eds.filter((edge) => edge.source !== nodeId && edge.target !== nodeId))
    setSelectedNodeId(null)
  }, [setNodes, setEdges])

  const addConnectedNode = useCallback((sourceNodeId, nodeType, nodeConfig) => {
    // Find the source node position
    const sourceNode = nodes.find(n => n.id === sourceNodeId)
    if (!sourceNode) return

    // Create new node positioned to the right of the source
    const newNodeId = `${Date.now()}`
    const data = { label: nodeConfig.label }

    if (nodeType === 'action') {
      data.actionType = nodeConfig.actionType
      if (nodeConfig.actionType === 'send_message') {
        data.message = ''
      }
    } else if (nodeType === 'ai') {
      data.aiType = nodeConfig.aiType
      data.prompt = ''
    } else if (nodeType === 'media') {
      data.mediaType = nodeConfig.mediaType
      if (nodeConfig.mediaType === 'send_message') {
        data.message = ''
        data.includeButtons = false
      } else if (nodeConfig.mediaType === 'send_image') {
        data.imageUrl = ''
        data.caption = ''
      } else if (nodeConfig.mediaType === 'send_video') {
        data.videoUrl = ''
        data.caption = ''
      } else if (nodeConfig.mediaType === 'send_voice') {
        data.voiceUrl = ''
        data.duration = ''
      } else if (nodeConfig.mediaType === 'send_carousel') {
        data.cards = []
      } else if (nodeConfig.mediaType === 'send_card') {
        data.title = ''
        data.subtitle = ''
        data.imageUrl = ''
        data.buttons = []
      }
    }

    const newNode = {
      id: newNodeId,
      type: nodeType,
      data,
      position: {
        x: sourceNode.position.x + 400,
        y: sourceNode.position.y
      }
    }

    // Create edge connecting the nodes
    const newEdge = {
      id: `e${sourceNodeId}-${newNodeId}`,
      source: sourceNodeId,
      target: newNodeId
    }

    setNodes((nds) => [...nds, newNode])
    setEdges((eds) => [...eds, newEdge])
  }, [nodes, setNodes, setEdges])

  const validateNodes = useCallback(() => {
    const errors = []

    nodes.forEach(node => {
      const nodeErrors = []

      // Validate trigger nodes
      if (node.type === 'trigger') {
        if (node.data.triggerType === 'keyword_comment' || node.data.triggerType === 'keyword_dm') {
          if (!node.data.keyword || node.data.keyword.trim() === '') {
            nodeErrors.push('Keyword is required')
          }
        }
        if (node.data.triggerType === 'keyword_comment' && !node.data.postId) {
          nodeErrors.push('Post selection is required')
        }
      }

      // Validate action nodes
      if (node.type === 'action') {
        if (node.data.actionType === 'send_message' && (!node.data.message || node.data.message.trim() === '')) {
          nodeErrors.push('Message is required')
        }
        if (node.data.actionType === 'data_collection') {
          if (!node.data.prompt || node.data.prompt.trim() === '') {
            nodeErrors.push('Prompt message is required')
          }
          if (!node.data.fieldName || node.data.fieldName.trim() === '') {
            nodeErrors.push('Field name is required')
          }
        }
        if (node.data.actionType === 'delay' && !node.data.delay) {
          nodeErrors.push('Delay duration is required')
        }
      }

      // Validate AI nodes
      if (node.type === 'ai') {
        if (!node.data.prompt || node.data.prompt.trim() === '') {
          nodeErrors.push('AI prompt is required')
        }
      }

      // Validate media nodes
      if (node.type === 'media') {
        if (node.data.mediaType === 'send_message' && (!node.data.message || node.data.message.trim() === '')) {
          nodeErrors.push('Message is required')
        }
        if (node.data.mediaType === 'send_image' && (!node.data.imageUrl || node.data.imageUrl.trim() === '')) {
          nodeErrors.push('Image URL is required')
        }
        if (node.data.mediaType === 'send_video' && (!node.data.videoUrl || node.data.videoUrl.trim() === '')) {
          nodeErrors.push('Video URL is required')
        }
        if (node.data.mediaType === 'send_voice' && (!node.data.voiceUrl || node.data.voiceUrl.trim() === '')) {
          nodeErrors.push('Voice URL is required')
        }
      }

      if (nodeErrors.length > 0) {
        errors.push({
          nodeId: node.id,
          nodeName: node.data.label,
          errors: nodeErrors
        })
      }
    })

    return errors
  }, [nodes])

  const fetchAllCategories = useCallback(async () => {
    try {
      const response = await axios.get(`${API_URL}/api/flows`)
      if (response.data && response.data.flows) {
        const baseCategories = ['My Flows', 'Sales', 'Support', 'E-commerce', 'Engagement']
        const customCategories = [...new Set(
          response.data.flows
            .flatMap(flow => flow.categories || [])
            .filter(cat => !baseCategories.includes(cat))
        )]
        setAvailableCategories([...baseCategories, ...customCategories])
      }
    } catch (error) {
      console.error('Error fetching categories:', error)
    }
  }, [])

  const saveFlow = useCallback(async () => {
    // Validate nodes first
    const errors = validateNodes()

    if (errors.length > 0) {
      setValidationErrors(errors)
      // Highlight error nodes with red border
      setNodes((nds) => nds.map(node => {
        const hasError = errors.find(e => e.nodeId === node.id)
        return {
          ...node,
          style: hasError ? { border: '2px solid #ef4444' } : {}
        }
      }))
      return
    }

    // Clear any previous validation errors
    setValidationErrors([])
    setNodes((nds) => nds.map(node => ({ ...node, style: {} })))

    // Clear the new category field to ensure clean state
    setNewCategory('')

    // Fetch latest categories before showing modal
    await fetchAllCategories()

    // Show save modal
    setShowSaveModal(true)
  }, [nodes, validateNodes, setNodes, fetchAllCategories])

  const handleSaveConfirm = useCallback(async () => {
    if (!flowName || flowName.trim() === '') {
      setNotification({ type: 'error', message: 'Please enter a flow name' })
      setTimeout(() => setNotification(null), 3000)
      return
    }

    // Add new category if provided
    let finalCategories = [...selectedCategories]
    if (newCategory && newCategory.trim() !== '') {
      finalCategories.push(newCategory.trim())
    }

    if (finalCategories.length === 0) {
      setNotification({ type: 'error', message: 'Please select at least one category' })
      setTimeout(() => setNotification(null), 3000)
      return
    }

    setLoading(true)

    try {
      const response = await axios.post(`${API_URL}/api/flows/save`, {
        name: flowName,
        nodes,
        edges,
        categories: finalCategories
      })

      if (response.data.success) {
        setShowSaveModal(false)
        setFlowName('')
        setSelectedCategories(['My Flows'])
        setNewCategory('')
        setNotification({ type: 'success', message: 'Flow saved successfully!' })
        setTimeout(() => setNotification(null), 3000)
      }
    } catch (error) {
      console.error('Error saving flow:', error)
      setNotification({ type: 'error', message: 'Failed to save flow. Please try again.' })
      setTimeout(() => setNotification(null), 3000)
    } finally {
      setLoading(false)
    }
  }, [flowName, nodes, edges, selectedCategories, newCategory])

  const testFlow = useCallback(() => {
    console.log('Testing flow with nodes:', nodes, 'and edges:', edges)
    alert('Test mode - flow execution would start here!')
  }, [nodes, edges])

  const handleAIFlowUpdate = useCallback((flowData) => {
    if (flowData.nodes) {
      setNodes(flowData.nodes)
    }
    if (flowData.edges) {
      setEdges(flowData.edges)
    }
  }, [setNodes, setEdges])

  return (
    <div className="flex h-full w-full overflow-hidden relative">
      {/* Loading Indicator */}
      {loading && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-white/80 dark:bg-gray-900/80">
          <div className="text-center">
            <div className="animate-spin h-12 w-12 border-2 border-black dark:border-white border-t-transparent mx-auto mb-3"></div>
            <p className="text-black dark:text-white font-semibold text-sm">Loading template...</p>
          </div>
        </div>
      )}

      {/* Sidebar */}
      <div className="flex-shrink-0 h-full overflow-hidden bg-gray-900">
        <Sidebar
          addNode={addNode}
          isMinimized={sidebarMinimized}
          onToggleMinimize={() => setSidebarMinimized(!sidebarMinimized)}
          channelType={channelType}
        />
      </div>

      {/* Flow Canvas */}
      <div className="flex-1 relative bg-white dark:bg-gray-900 h-full overflow-hidden">
        {/* Fixed Action Buttons */}
        <div className="fixed top-20 right-4 z-[60] flex gap-2">
          <button
            onClick={testFlow}
            className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 hover:border-black dark:hover:border-white text-black dark:text-white font-semibold py-2 px-4 text-sm transition-colors flex items-center gap-2"
          >
            <span>▶️</span>
            <span>Test Flow</span>
          </button>
          <button
            onClick={saveFlow}
            className="bg-black dark:bg-white text-white dark:text-black font-semibold py-2 px-4 text-sm hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors flex items-center gap-2"
          >
            <span>💾</span>
            <span>{automationLabels.saveButton}</span>
          </button>
        </div>

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
        >
          <Controls />
          <MiniMap
            className="!bg-gray-100 dark:!bg-gray-800"
            maskColor="rgb(0, 0, 0, 0.1)"
          />
          <Background
            variant={BackgroundVariant.Dots}
            gap={12}
            size={1}
            className="bg-white dark:bg-gray-900"
            color="#374151"
          />
        </ReactFlow>
      </div>

      {/* Config Panel */}
      {selectedNode && (
        <NodeConfigPanel
          node={selectedNode}
          onUpdate={updateNodeData}
          onDelete={deleteNode}
          onClose={() => setSelectedNodeId(null)}
          onAddConnectedNode={addConnectedNode}
        />
      )}

      {/* AI Assistant */}
      <AIAssistant
        nodes={nodes}
        edges={edges}
        onUpdateFlow={handleAIFlowUpdate}
      />

      {/* Validation Errors */}
      {validationErrors.length > 0 && (
        <div className="fixed bottom-4 left-4 z-50 bg-white dark:bg-gray-800 border-2 border-red-600 dark:border-red-400 p-4 max-w-md">
          <div className="flex items-start gap-3">
            <span className="text-2xl">⚠️</span>
            <div className="flex-1">
              <h3 className="text-base font-bold text-black dark:text-white mb-2">Configuration Required</h3>
              <p className="text-xs text-gray-600 dark:text-gray-400 mb-3">
                Please complete the following nodes before saving:
              </p>
              <div className="space-y-2">
                {validationErrors.map((error, idx) => (
                  <div key={idx} className="bg-gray-50 dark:bg-gray-900 p-2 border border-gray-300 dark:border-gray-600">
                    <div className="font-semibold text-black dark:text-white text-xs">{error.nodeName}</div>
                    <ul className="list-disc list-inside text-xs text-gray-600 dark:text-gray-400 mt-1">
                      {error.errors.map((err, errIdx) => (
                        <li key={errIdx}>{err}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
              <button
                onClick={() => {
                  setValidationErrors([])
                  setNodes((nds) => nds.map(node => ({ ...node, style: {} })))
                }}
                className="mt-3 w-full bg-black dark:bg-white text-white dark:text-black font-semibold py-2 px-4 text-sm hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors"
              >
                Got it
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Trigger Selection Modal */}
      {showTriggerModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-black dark:text-white">Choose Your Trigger</h2>
              <button
                onClick={() => setShowTriggerModal(false)}
                className="text-gray-400 hover:text-black dark:hover:text-white text-xl"
              >
                ✕
              </button>
            </div>
            <p className="text-gray-600 dark:text-gray-400 text-sm mb-6">
              Select how you want your automation to start
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {availableTriggers.length > 0 ? (
                availableTriggers.map((trigger) => (
                  <button
                    key={trigger.id}
                    onClick={() => handleTriggerSelect(trigger.id)}
                    className="p-4 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 hover:border-black dark:hover:border-white transition-all text-left"
                  >
                    <div className="text-xl mb-2">{trigger.icon}</div>
                    <h3 className="text-sm font-bold text-black dark:text-white mb-1">{trigger.name}</h3>
                    <p className="text-xs text-gray-600 dark:text-gray-400">{trigger.description}</p>
                  </button>
                ))
              ) : (
                <div className="col-span-3 text-center py-8">
                  <div className="text-4xl mb-4">⚠️</div>
                  <p className="text-black dark:text-white font-bold mb-2">No triggers available</p>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">channelType: {channelType || 'undefined'}</p>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">availableTriggers length: {availableTriggers.length}</p>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    Expected API: http://localhost:3001/api/triggers/types?channel={channelType === 'facebook' ? 'messenger' : channelType}
                  </p>
                  <p className="text-red-600 dark:text-red-400 text-xs mt-4 font-mono">
                    Check browser console (F12) for API errors
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Save Modal */}
      {showSaveModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold text-black dark:text-white mb-2">{automationLabels.modalTitle}</h2>
            <p className="text-gray-600 dark:text-gray-400 text-sm mb-6">
              {automationLabels.modalDescription}
            </p>

            {/* Flow Name */}
            <div className="mb-4">
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Flow Name
              </label>
              <input
                type="text"
                value={flowName}
                onChange={(e) => setFlowName(e.target.value)}
                placeholder="My Awesome Flow"
                className="w-full p-2 text-sm border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-black dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:border-black dark:focus:border-white focus:outline-none"
                autoFocus
              />
            </div>

            {/* Categories */}
            <div className="mb-4">
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Categories (Select one or more)
              </label>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {availableCategories.map((category) => (
                  <label
                    key={category}
                    className="flex items-center gap-2 p-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 hover:border-black dark:hover:border-white cursor-pointer transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={selectedCategories.includes(category)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedCategories([...selectedCategories, category])
                        } else {
                          setSelectedCategories(selectedCategories.filter(c => c !== category))
                        }
                      }}
                      className="w-4 h-4"
                    />
                    <span className="text-black dark:text-white text-sm">{category}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Create New Category */}
            <div className="mb-6">
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Or Create New Category
              </label>
              <input
                type="text"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                placeholder="e.g., Marketing, Customer Service"
                className="w-full p-2 text-sm border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-black dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:border-black dark:focus:border-white focus:outline-none"
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowSaveModal(false)
                  setFlowName('')
                  setSelectedCategories(['My Flows'])
                  setNewCategory('')
                }}
                className="flex-1 px-4 py-2 bg-gray-200 dark:bg-gray-700 text-black dark:text-white text-sm font-semibold hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                onClick={handleSaveConfirm}
                disabled={loading}
                className="flex-1 px-4 py-2 bg-black dark:bg-white text-white dark:text-black text-sm font-semibold hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? automationLabels.savingText : automationLabels.modalTitle.replace('Save ', '')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success/Error Notification */}
      {notification && (
        <div className={`fixed top-4 right-4 z-50 p-4 flex items-center gap-3 border-2 ${
          notification.type === 'success'
            ? 'bg-white dark:bg-gray-800 border-black dark:border-white'
            : 'bg-white dark:bg-gray-800 border-red-600 dark:border-red-400'
        }`}>
          <span className="text-xl">
            {notification.type === 'success' ? '✅' : '❌'}
          </span>
          <span className="font-semibold text-black dark:text-white text-sm">
            {notification.message}
          </span>
        </div>
      )}
    </div>
  )
}
