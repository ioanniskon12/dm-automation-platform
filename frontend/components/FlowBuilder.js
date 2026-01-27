'use client'

import { useCallback, useState, useEffect, useRef } from 'react'
import { useSearchParams } from 'next/navigation'

// Custom hook to detect mobile viewport
function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  return isMobile
}
import axios from 'axios'
import { fetchTriggersOnce, getCachedTriggersForChannel } from '../lib/triggers-cache'
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  BackgroundVariant,
  useReactFlow,
  ReactFlowProvider,
} from 'reactflow'
import 'reactflow/dist/style.css'

import TriggerNode from './nodes/TriggerNode'
import ConditionNode from './nodes/ConditionNode'
import ActionNode from './nodes/ActionNode'
import AINode from './nodes/AINode'
import MediaNode from './nodes/MediaNode'
import DeletableEdge from './edges/DeletableEdge'
import Sidebar from './Sidebar'
import NodeConfigPanel from './NodeConfigPanel'
import AIAssistant from './AIAssistant'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002';

const nodeTypes = {
  trigger: TriggerNode,
  condition: ConditionNode,
  action: ActionNode,
  ai: AINode,
  media: MediaNode,
}

const edgeTypes = {
  deletable: DeletableEdge,
}

const defaultInitialNodes = []
const defaultInitialEdges = []

// Wrapper component to provide ReactFlow context
export default function FlowBuilder(props) {
  return (
    <ReactFlowProvider>
      <FlowBuilderInner {...props} />
    </ReactFlowProvider>
  )
}

function FlowBuilderInner({ automationType = null, selectedTemplate = null, prePopulatedTrigger = null, channelType = 'instagram', workspaceId = null }) {
  console.log('🔧 FlowBuilder: workspaceId =', workspaceId)
  const searchParams = useSearchParams()
  const isMobile = useIsMobile()
  const { fitView } = useReactFlow()
  const lastTapRef = useRef(0)
  const [showMobileSidebar, setShowMobileSidebar] = useState(false)
  const [showMobileActions, setShowMobileActions] = useState(false)
  const templateId = searchParams.get('templateId')
  const flowId = searchParams.get('flowId')
  const hasFetchedTriggersRef = useRef(false)
  const [availableTriggers, setAvailableTriggers] = useState(() => {
    // Initialize with cached data ONLY if it matches this channel
    // This prevents showing Instagram triggers when opening a Messenger flow
    const cachedTriggers = getCachedTriggersForChannel(channelType)
    return cachedTriggers || []
  })

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

  // Undo/Redo history
  const [history, setHistory] = useState([])  // Past states
  const [future, setFuture] = useState([])    // Future states (for redo)
  const historyRef = useRef({ nodes: [], edges: [] })  // Track last saved state
  const isUndoRedoAction = useRef(false)  // Prevent saving during undo/redo
  const MAX_HISTORY = 50  // Limit history size

  // Get the current selected node from the nodes array to ensure we always have fresh data
  const selectedNode = selectedNodeId ? nodes.find(n => n.id === selectedNodeId) : null

  // Save current state to history (call before making changes)
  const saveToHistory = useCallback(() => {
    if (isUndoRedoAction.current) return  // Don't save during undo/redo

    const currentState = {
      nodes: JSON.parse(JSON.stringify(historyRef.current.nodes)),
      edges: JSON.parse(JSON.stringify(historyRef.current.edges))
    }

    setHistory(prev => {
      const newHistory = [...prev, currentState]
      // Limit history size
      if (newHistory.length > MAX_HISTORY) {
        return newHistory.slice(-MAX_HISTORY)
      }
      return newHistory
    })
    setFuture([])  // Clear redo stack when new action is taken
  }, [])

  // Track node/edge changes for history
  useEffect(() => {
    if (isUndoRedoAction.current) {
      isUndoRedoAction.current = false
      historyRef.current = { nodes, edges }
      return
    }

    // Check if there's an actual change
    const prevNodes = JSON.stringify(historyRef.current.nodes)
    const prevEdges = JSON.stringify(historyRef.current.edges)
    const currNodes = JSON.stringify(nodes)
    const currEdges = JSON.stringify(edges)

    if (prevNodes !== currNodes || prevEdges !== currEdges) {
      // Save previous state to history before updating ref
      if (historyRef.current.nodes.length > 0 || historyRef.current.edges.length > 0) {
        saveToHistory()
      }
      historyRef.current = { nodes, edges }
    }
  }, [nodes, edges, saveToHistory])

  // Undo - go back to previous state
  const undo = useCallback(() => {
    if (history.length === 0) return

    const newHistory = [...history]
    const previousState = newHistory.pop()

    // Save current state to future for redo
    setFuture(prev => [...prev, {
      nodes: JSON.parse(JSON.stringify(nodes)),
      edges: JSON.parse(JSON.stringify(edges))
    }])

    setHistory(newHistory)
    isUndoRedoAction.current = true
    setNodes(previousState.nodes)
    setEdges(previousState.edges)
  }, [history, nodes, edges, setNodes, setEdges])

  // Redo - go forward to next state
  const redo = useCallback(() => {
    if (future.length === 0) return

    const newFuture = [...future]
    const nextState = newFuture.pop()

    // Save current state to history
    setHistory(prev => [...prev, {
      nodes: JSON.parse(JSON.stringify(nodes)),
      edges: JSON.parse(JSON.stringify(edges))
    }])

    setFuture(newFuture)
    isUndoRedoAction.current = true
    setNodes(nextState.nodes)
    setEdges(nextState.edges)
  }, [future, nodes, edges, setNodes, setEdges])

  // Keyboard shortcuts for undo/redo
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Ignore if typing in an input
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return

      // Cmd/Ctrl + Z = Undo
      if ((e.metaKey || e.ctrlKey) && e.key === 'z' && !e.shiftKey) {
        e.preventDefault()
        undo()
      }
      // Cmd/Ctrl + Shift + Z OR Cmd/Ctrl + Y = Redo
      if ((e.metaKey || e.ctrlKey) && (e.key === 'y' || (e.key === 'z' && e.shiftKey))) {
        e.preventDefault()
        redo()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [undo, redo])

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

  // Fetch available triggers based on channel type - only once per mount
  useEffect(() => {
    if (!channelType) return
    if (hasFetchedTriggersRef.current) return
    hasFetchedTriggersRef.current = true

    const loadTriggers = async () => {
      try {
        // fetchTriggersOnce handles deduplication, rate limiting, and loop protection via singleton cache
        const triggers = await fetchTriggersOnce(channelType, axios)
        setAvailableTriggers(triggers)
      } catch (error) {
        console.error('Error fetching triggers:', error)
        setAvailableTriggers([])
      }
    }

    loadTriggers()
  }, [channelType])

  // Handle trigger selection
  const handleTriggerSelect = useCallback((triggerTypeId) => {
    // Find the selected trigger from available triggers
    const selectedTrigger = availableTriggers.find(t => t.id === triggerTypeId)

    if (!selectedTrigger) {
      console.error('Trigger not found:', triggerTypeId)
      return
    }

    // Initialize data with trigger-specific defaults (matching Sidebar.js logic)
    const data = { label: selectedTrigger.name, triggerType: selectedTrigger.id }

    // Keyword DM trigger
    if (triggerTypeId === 'keyword_dm') {
      data.keyword = ''
    }

    // Instagram Ref URL trigger
    if (triggerTypeId === 'instagram_ref_url') {
      data.refUrl = ''
    }

    // Instagram Ads trigger
    if (triggerTypeId === 'instagram_ads') {
      data.adId = ''
      data.campaignId = ''
    }

    // Story Reply trigger (Instagram) - leave empty so wizard opens
    if (triggerTypeId === 'story_reply' || triggerTypeId === 'instagram_story_reply') {
      // Don't initialize values - let the wizard handle it
    }

    // Comment trigger (Instagram and Facebook) - leave empty so wizard opens
    if (triggerTypeId === 'keyword_comment' || triggerTypeId === 'instagram_comment') {
      // Don't initialize values - let the wizard handle it
    }

    // Instagram Live Comment trigger
    if (triggerTypeId === 'instagram_live_comment' || triggerTypeId === 'live_comments') {
      data.liveKeywords = ''
    }

    // Instagram Post Share trigger
    if (triggerTypeId === 'instagram_post_share' || triggerTypeId === 'instagram_shares') {
      data.shareType = 'specific'
      data.selectedPost = null
      data.replyDelay = 0
      data.delayUnit = 'seconds'
    }

    // Instagram Message trigger
    if (triggerTypeId === 'instagram_message') {
      data.messageType = 'any'
      data.keywords = ''
    }

    // Telegram Message trigger
    if (triggerTypeId === 'telegram_message') {
      data.triggerType = 'any'
      data.keywords = ''
    }

    // Telegram Ref URL trigger
    if (triggerTypeId === 'telegram_ref_url') {
      data.refParameter = ''
      data.linkUrl = ''
    }

    // WhatsApp Message trigger
    if (triggerTypeId === 'whatsapp_message') {
      data.triggerType = 'any'
      data.keywords = ''
    }

    // WhatsApp Ref URL trigger
    if (triggerTypeId === 'whatsapp_ref_url') {
      data.refParameter = ''
      data.linkUrl = ''
    }

    const newNode = {
      id: '1',
      type: 'trigger',
      data,
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

  // Focus on the first node (trigger node)
  const focusFirstNode = useCallback(() => {
    if (nodes.length === 0) return

    // Find the first node (usually the trigger node with id '1' or the first in array)
    const firstNode = nodes.find(n => n.id === '1') || nodes[0]

    if (firstNode) {
      fitView({
        nodes: [firstNode],
        padding: 0.5,
        duration: 300,
        maxZoom: 1.5
      })
    }
  }, [nodes, fitView])

  // Track clicks/taps for double-click/double-tap detection
  const handlePaneClickWithDoubleTap = useCallback((event) => {
    const now = Date.now()
    const DOUBLE_TAP_DELAY = 400 // ms - slightly longer for better detection

    const timeSinceLastTap = now - lastTapRef.current

    if (lastTapRef.current !== 0 && timeSinceLastTap < DOUBLE_TAP_DELAY) {
      // Double tap/click detected - focus on first node
      focusFirstNode()
      lastTapRef.current = 0 // Reset after successful double-tap
    } else {
      // First tap - record the time
      lastTapRef.current = now
    }
  }, [focusFirstNode])

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

      // Find the rightmost node to position new node to its right
      setNodes((nds) => {
        let maxX = 100
        let avgY = 150
        if (nds.length > 0) {
          maxX = Math.max(...nds.map(n => n.position.x)) + 280
          avgY = nds.reduce((sum, n) => sum + n.position.y, 0) / nds.length
        }

        const newNode = {
          id: `${Date.now()}`,
          type,
          data,
          position: {
            x: maxX,
            y: avgY,
          },
        }
        return [...nds, newNode]
      })
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
        x: sourceNode.position.x + 260,
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

  // Auto-arrange nodes: Step 1 → Step 2 → Step 3 → etc.
  // Multiple nodes in the same step stack vertically, then flow continues right
  const rearrangeNodes = useCallback(() => {
    if (nodes.length === 0) return

    const nodeWidth = 280
    const nodeHeight = 180
    const horizontalGap = 120  // Gap between steps (columns)
    const verticalGap = 40     // Gap between stacked nodes in same step
    const startX = 50
    const startY = 50

    // Build adjacency maps
    const children = {}  // parentId -> [childIds]
    const parents = {}   // childId -> [parentIds]

    edges.forEach(edge => {
      if (edge.source && edge.target) {
        if (!children[edge.source]) children[edge.source] = []
        if (!parents[edge.target]) parents[edge.target] = []
        if (!children[edge.source].includes(edge.target)) {
          children[edge.source].push(edge.target)
        }
        if (!parents[edge.target].includes(edge.source)) {
          parents[edge.target].push(edge.source)
        }
      }
    })

    // Step 1: Assign each node to a step (column) using BFS
    const nodeStep = {}  // nodeId -> step number (0, 1, 2, ...)
    const visited = new Set()

    // Identify trigger nodes (these are LOCKED at step 0, never move)
    const triggerIds = new Set(nodes.filter(n => n.type === 'trigger').map(n => n.id))

    // Find root nodes (triggers first, then nodes with no parents)
    const roots = []
    triggerIds.forEach(id => roots.push(id))

    nodes.forEach(n => {
      if (!triggerIds.has(n.id) && (!parents[n.id] || parents[n.id].length === 0)) {
        if (!roots.includes(n.id)) roots.push(n.id)
      }
    })

    // BFS from roots - initial step assignment
    const queue = []
    roots.forEach(id => {
      nodeStep[id] = 0
      visited.add(id)
      queue.push(id)
    })

    while (queue.length > 0) {
      const currentId = queue.shift()
      const currentStep = nodeStep[currentId]
      const nodeChildren = children[currentId] || []

      nodeChildren.forEach(childId => {
        // BACK EDGE CHECK: Skip if already visited OR if it's a trigger
        // Triggers are always at step 0, connections back to them are just visual
        if (visited.has(childId) || triggerIds.has(childId)) return

        nodeStep[childId] = currentStep + 1
        visited.add(childId)
        queue.push(childId)
      })
    }

    // Handle disconnected nodes
    let maxStep = Math.max(0, ...Object.values(nodeStep).filter(s => s !== undefined))
    nodes.forEach(n => {
      if (nodeStep[n.id] === undefined) {
        nodeStep[n.id] = maxStep + 1
      }
    })

    // Second pass: ensure each node is after ALL its forward parents
    // SKIP triggers - they are locked at step 0
    // SKIP back edges - edges where parent step >= node step
    let changed = true
    let iterations = 0
    const maxIterations = nodes.length + 1

    while (changed && iterations < maxIterations) {
      changed = false
      iterations++

      nodes.forEach(n => {
        // Never move triggers
        if (triggerIds.has(n.id)) return

        const nodeParents = parents[n.id] || []
        nodeParents.forEach(parentId => {
          const parentStep = nodeStep[parentId]
          // Only forward edges: parent must have SMALLER step
          if (parentStep !== undefined && parentStep < nodeStep[n.id]) {
            const minStep = parentStep + 1
            if (nodeStep[n.id] < minStep) {
              nodeStep[n.id] = minStep
              changed = true
            }
          }
        })
      })
    }

    // Step 2: Group nodes by step
    const steps = {}  // step -> [nodes]
    nodes.forEach(n => {
      const step = nodeStep[n.id]
      if (!steps[step]) steps[step] = []
      steps[step].push(n)
    })

    const sortedSteps = Object.keys(steps).map(Number).sort((a, b) => a - b)

    // Step 3: Order nodes within each step
    // - Group by parent so siblings stay together
    // - Order groups by parent's vertical position
    const nodeY = {}  // nodeId -> y index for ordering

    // First step: triggers on top, then others
    if (sortedSteps.length > 0) {
      const firstStep = steps[sortedSteps[0]]
      firstStep.sort((a, b) => {
        if (a.type === 'trigger' && b.type !== 'trigger') return -1
        if (b.type === 'trigger' && a.type !== 'trigger') return 1
        return (a.position?.y || 0) - (b.position?.y || 0)
      })
      firstStep.forEach((n, i) => { nodeY[n.id] = i })
    }

    // Subsequent steps: group siblings, sort by parent position
    for (let i = 1; i < sortedSteps.length; i++) {
      const stepNum = sortedSteps[i]
      const stepNodes = steps[stepNum]

      // Group by parent (only consider FORWARD parents - earlier steps)
      const groups = {}  // parentId -> { parentY, nodes }
      const noParent = []

      stepNodes.forEach(n => {
        const nodeParents = parents[n.id] || []
        // Find the best FORWARD parent (must be at earlier step)
        let bestParent = null
        let bestParentY = Infinity
        nodeParents.forEach(pid => {
          // Only consider forward edges: parent step must be < current step
          const parentStep = nodeStep[pid]
          if (parentStep === undefined || parentStep >= stepNum) return  // Skip back edges

          if (nodeY[pid] !== undefined && nodeY[pid] < bestParentY) {
            bestParent = pid
            bestParentY = nodeY[pid]
          }
        })

        if (bestParent !== null) {
          if (!groups[bestParent]) {
            groups[bestParent] = { parentY: bestParentY, nodes: [] }
          }
          groups[bestParent].nodes.push(n)
        } else {
          noParent.push(n)
        }
      })

      // Sort groups by parent Y position
      const sortedGroups = Object.values(groups).sort((a, b) => a.parentY - b.parentY)

      // Sort nodes within each group by their current Y
      sortedGroups.forEach(g => {
        g.nodes.sort((a, b) => (a.position?.y || 0) - (b.position?.y || 0))
      })

      // Flatten into ordered list
      const orderedNodes = []
      sortedGroups.forEach(g => orderedNodes.push(...g.nodes))
      orderedNodes.push(...noParent)

      // Update step and Y indices
      steps[stepNum] = orderedNodes
      orderedNodes.forEach((n, idx) => { nodeY[n.id] = idx })
    }

    // Step 4: Calculate positions
    const positions = {}

    sortedSteps.forEach((stepNum, colIdx) => {
      const stepNodes = steps[stepNum]
      const x = startX + colIdx * (nodeWidth + horizontalGap)

      // Calculate total height for this column
      const colHeight = stepNodes.length * nodeHeight + (stepNodes.length - 1) * verticalGap

      // Start Y position (can center later if needed)
      let y = startY

      stepNodes.forEach((n, rowIdx) => {
        positions[n.id] = { x, y }
        y += nodeHeight + verticalGap
      })
    })

    // Apply positions
    setNodes(nds => nds.map(n => ({
      ...n,
      position: positions[n.id] || n.position
    })))
  }, [nodes, edges, setNodes])

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

      {/* Mobile Sidebar Overlay */}
      {isMobile && showMobileSidebar && (
        <div
          className="fixed inset-0 bg-black/50 z-[70] animate-fade-in"
          onClick={() => setShowMobileSidebar(false)}
        />
      )}

      {/* Sidebar - Desktop: always visible, Mobile: slide-in drawer */}
      <div className={`
        ${isMobile
          ? `fixed inset-y-0 left-0 z-[80] transform transition-transform duration-300 ease-in-out ${showMobileSidebar ? 'translate-x-0' : '-translate-x-full'}`
          : 'flex-shrink-0 h-full overflow-hidden'
        } bg-gray-900
      `}>
        <Sidebar
          addNode={(type, data) => {
            addNode(type, data)
            if (isMobile) setShowMobileSidebar(false)
          }}
          isMinimized={isMobile ? false : sidebarMinimized}
          onToggleMinimize={() => {
            if (isMobile) {
              setShowMobileSidebar(false)
            } else {
              setSidebarMinimized(!sidebarMinimized)
            }
          }}
          channelType={channelType}
        />
      </div>

      {/* Flow Canvas */}
      <div className="flex-1 relative bg-white dark:bg-gray-900 h-full overflow-hidden">
        {/* Desktop Action Buttons */}
        <div className="hidden md:flex fixed top-20 right-4 z-[60] gap-2">
          {/* Undo/Redo buttons */}
          <button
            onClick={undo}
            disabled={history.length === 0}
            className={`bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 hover:border-black dark:hover:border-white text-black dark:text-white font-semibold py-2 px-3 text-sm transition-colors flex items-center gap-1 ${history.length === 0 ? 'opacity-40 cursor-not-allowed' : ''}`}
            title="Undo (Ctrl+Z)"
          >
            <span>↩️</span>
            <span>Undo</span>
          </button>
          <button
            onClick={redo}
            disabled={future.length === 0}
            className={`bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 hover:border-black dark:hover:border-white text-black dark:text-white font-semibold py-2 px-3 text-sm transition-colors flex items-center gap-1 ${future.length === 0 ? 'opacity-40 cursor-not-allowed' : ''}`}
            title="Redo (Ctrl+Shift+Z)"
          >
            <span>↪️</span>
            <span>Redo</span>
          </button>
          <div className="w-px bg-gray-300 dark:bg-gray-600 mx-1"></div>
          <button
            onClick={rearrangeNodes}
            className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 hover:border-black dark:hover:border-white text-black dark:text-white font-semibold py-2 px-4 text-sm transition-colors flex items-center gap-2"
          >
            <span>✨</span>
            <span>Rearrange</span>
          </button>
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

        {/* Mobile Floating Action Buttons */}
        {isMobile && (
          <>
            {/* Add Node Button - Bottom Left */}
            <button
              onClick={() => setShowMobileSidebar(true)}
              className="fixed bottom-6 left-4 z-[60] bg-purple-600 text-white w-14 h-14 rounded-full shadow-lg flex items-center justify-center text-2xl touch-target safe-area-bottom"
            >
              ➕
            </button>

            {/* More Actions Button - Bottom Right (positioned to avoid AI Assistant) */}
            <button
              onClick={() => setShowMobileActions(!showMobileActions)}
              className="fixed bottom-24 right-4 z-[60] bg-black dark:bg-white text-white dark:text-black w-14 h-14 rounded-full shadow-lg flex items-center justify-center text-xl touch-target"
            >
              {showMobileActions ? '✕' : '⋮'}
            </button>

            {/* Mobile Actions Menu */}
            {showMobileActions && (
              <div className="fixed bottom-40 right-4 z-[60] flex flex-col gap-2 animate-slide-in-bottom">
                {/* Undo/Redo row */}
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      undo()
                      setShowMobileActions(false)
                    }}
                    disabled={history.length === 0}
                    className={`flex-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-black dark:text-white font-semibold py-3 px-4 text-sm rounded-lg shadow-lg flex items-center justify-center gap-2 touch-target ${history.length === 0 ? 'opacity-40' : ''}`}
                  >
                    <span>↩️</span>
                    <span>Undo</span>
                  </button>
                  <button
                    onClick={() => {
                      redo()
                      setShowMobileActions(false)
                    }}
                    disabled={future.length === 0}
                    className={`flex-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-black dark:text-white font-semibold py-3 px-4 text-sm rounded-lg shadow-lg flex items-center justify-center gap-2 touch-target ${future.length === 0 ? 'opacity-40' : ''}`}
                  >
                    <span>↪️</span>
                    <span>Redo</span>
                  </button>
                </div>
                <button
                  onClick={() => {
                    saveFlow()
                    setShowMobileActions(false)
                  }}
                  className="bg-black dark:bg-white text-white dark:text-black font-semibold py-3 px-4 text-sm rounded-lg shadow-lg flex items-center gap-2 touch-target"
                >
                  <span>💾</span>
                  <span>Save</span>
                </button>
                <button
                  onClick={() => {
                    testFlow()
                    setShowMobileActions(false)
                  }}
                  className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-black dark:text-white font-semibold py-3 px-4 text-sm rounded-lg shadow-lg flex items-center gap-2 touch-target"
                >
                  <span>▶️</span>
                  <span>Test</span>
                </button>
                <button
                  onClick={() => {
                    rearrangeNodes()
                    setShowMobileActions(false)
                  }}
                  className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-black dark:text-white font-semibold py-3 px-4 text-sm rounded-lg shadow-lg flex items-center gap-2 touch-target"
                >
                  <span>✨</span>
                  <span>Rearrange</span>
                </button>
              </div>
            )}
          </>
        )}

        <ReactFlow
          nodes={nodes}
          edges={edges.map(edge => ({
            ...edge,
            type: 'deletable',
            data: { ...edge.data, onDelete: (edgeId) => setEdges(eds => eds.filter(e => e.id !== edgeId)) }
          }))}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onNodeClick={onNodeClick}
          onPaneClick={(event) => {
            onPaneClick()
            if (isMobile) setShowMobileActions(false)
            handlePaneClickWithDoubleTap(event)
          }}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          defaultEdgeOptions={{ type: 'deletable' }}
          fitView
          minZoom={0.2}
          maxZoom={2}
        >
          <Controls className="!bottom-4 !left-4 md:!bottom-auto md:!left-auto" />
          {!isMobile && (
            <MiniMap
              className="!bg-gray-100 dark:!bg-gray-800"
              maskColor="rgb(0, 0, 0, 0.1)"
            />
          )}
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
          workspaceId={workspaceId}
          channelType={channelType}
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
        <div className="fixed bottom-24 md:bottom-4 left-2 right-2 md:left-4 md:right-auto z-[70] bg-white dark:bg-gray-800 border-2 border-red-600 dark:border-red-400 p-3 md:p-4 md:max-w-md rounded-lg md:rounded-none safe-area-bottom">
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
        <div className="fixed inset-0 bg-black/70 flex items-end md:items-center justify-center z-[200]">
          <div className="bg-gray-900 rounded-t-2xl md:rounded-xl border border-gray-700 p-4 md:p-6 w-full md:max-w-2xl max-h-[85vh] md:max-h-[80vh] overflow-y-auto md:m-4 safe-area-bottom">
            {/* Mobile drag handle */}
            <div className="md:hidden flex justify-center mb-3">
              <div className="w-10 h-1 bg-gray-600 rounded-full"></div>
            </div>
            <div className="flex items-center justify-between mb-4 md:mb-6">
              <h2 className="text-xl md:text-2xl font-bold text-white">Select a Trigger</h2>
              <button
                onClick={() => setShowTriggerModal(false)}
                className="text-gray-400 hover:text-white text-2xl touch-target flex items-center justify-center"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {availableTriggers.length > 0 ? (
                availableTriggers.map((trigger) => (
                  <button
                    key={trigger.id}
                    onClick={() => handleTriggerSelect(trigger.id)}
                    className="bg-yellow-800/30 hover:bg-yellow-700/50 active:bg-yellow-700/70 text-left p-4 rounded-lg transition-colors border border-yellow-600/30 hover:border-yellow-500 touch-target"
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-2xl md:text-3xl">{trigger.icon}</span>
                      <span className="text-sm font-medium text-white">{trigger.name}</span>
                    </div>
                    {trigger.description && (
                      <p className="text-xs text-gray-400 ml-10 md:ml-12">{trigger.description}</p>
                    )}
                  </button>
                ))
              ) : (
                <div className="col-span-1 md:col-span-2 text-center py-8">
                  <div className="text-4xl mb-4">⚠️</div>
                  <p className="text-white font-bold mb-2">No triggers available</p>
                  <p className="text-gray-400 text-sm">channelType: {channelType || 'undefined'}</p>
                  <p className="text-gray-400 text-sm">availableTriggers length: {availableTriggers.length}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Save Modal */}
      {showSaveModal && (
        <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-black/50 p-0 md:p-4">
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-4 md:p-6 w-full md:max-w-lg max-h-[90vh] overflow-y-auto rounded-t-2xl md:rounded-lg safe-area-bottom">
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
        <div className={`fixed top-4 left-4 right-4 md:left-auto md:right-4 md:w-auto z-[100] p-3 md:p-4 flex items-center gap-3 border-2 rounded-lg md:rounded-none ${
          notification.type === 'success'
            ? 'bg-white dark:bg-gray-800 border-black dark:border-white'
            : 'bg-white dark:bg-gray-800 border-red-600 dark:border-red-400'
        }`}>
          <span className="text-xl">
            {notification.type === 'success' ? '✅' : '❌'}
          </span>
          <span className="font-semibold text-black dark:text-white text-sm flex-1">
            {notification.message}
          </span>
        </div>
      )}
    </div>
  )
}
