'use client'

import { useState, useEffect } from 'react'
import axios from 'axios'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

export default function Sidebar({ addNode, isMinimized, onToggleMinimize, channelType = 'instagram' }) {
  const [showTriggersModal, setShowTriggersModal] = useState(false)
  const [triggerTypes, setTriggerTypes] = useState([])

  // Fetch available triggers based on channel type
  useEffect(() => {
    const fetchTriggers = async () => {
      try {
        console.log('🔍 Sidebar - channelType received:', channelType)

        // Map channel type: facebook -> messenger (backend uses 'messenger')
        const backendChannelType = channelType === 'facebook' ? 'messenger' : channelType

        console.log('🔍 Sidebar - backendChannelType:', backendChannelType)
        console.log('🔍 Sidebar - API URL:', `/api/triggers/types?channel=${backendChannelType}`)

        const response = await axios.get(`/api/triggers/types?channel=${backendChannelType}`)

        console.log('🔍 Sidebar - API response:', response.data)

        if (response.data.success) {
          // Map backend trigger format to sidebar format
          const mappedTriggers = response.data.triggerTypes.map(trigger => ({
            type: trigger.id,
            label: trigger.name,
            icon: trigger.icon
          }))

          console.log('🔍 Sidebar - Mapped triggers count:', mappedTriggers.length)
          setTriggerTypes(mappedTriggers)
        }
      } catch (error) {
        console.error('❌ Sidebar - Error fetching triggers:', error)
        // Fallback to empty array if API fails
        setTriggerTypes([])
      }
    }

    if (channelType) {
      console.log('✅ Sidebar - channelType exists, fetching triggers...')
      fetchTriggers()
    } else {
      console.log('⚠️ Sidebar - No channelType provided!')
    }
  }, [channelType])

  const conditionTypes = [
    { type: 'is_follower', label: 'Is Follower?', icon: '👥' },
    { type: 'has_interacted', label: 'Has Interacted?', icon: '🔄' },
    { type: 'time_based', label: 'Time-Based', icon: '⏰' },
    { type: 'custom_field', label: 'Custom Field Check', icon: '📋' },
  ]

  const actionTypes = [
    { type: 'add_tag', label: 'Add Tag', icon: '🏷️' },
    { type: 'data_collection', label: 'Data Collection', icon: '📝' },
    { type: 'delay', label: 'Delay', icon: '⏳' },
    { type: 'send_to_human', label: 'Send to Human', icon: '👨‍💼' },
  ]

  const aiTypes = [
    { type: 'ai_response', label: 'AI Response', icon: '🤖' },
    { type: 'ai_fallback', label: 'AI Fallback', icon: '🛟' },
    { type: 'ai_decision', label: 'AI Decision Router', icon: '🧠' },
  ]

  // All media types for Instagram and Facebook
  const allMediaTypes = [
    { type: 'send_message', label: 'Send Message', icon: '💌' },
    { type: 'send_image', label: 'Send Image', icon: '🖼️' },
    { type: 'send_video', label: 'Send Video', icon: '🎥' },
    { type: 'send_voice', label: 'Send Voice', icon: '🎤' },
    { type: 'send_file', label: 'Send File', icon: '📎' },
    { type: 'send_carousel', label: 'Send Carousel', icon: '🎠' },
    { type: 'send_card', label: 'Send Card', icon: '🃏' },
  ]

  // Telegram and WhatsApp media types (only 5 basic types)
  const basicMediaTypes = [
    { type: 'send_message', label: 'Send Message', icon: '💌' },
    { type: 'send_image', label: 'Send Image', icon: '🖼️' },
    { type: 'send_video', label: 'Send Video', icon: '🎥' },
    { type: 'send_voice', label: 'Send Voice', icon: '🎤' },
    { type: 'send_file', label: 'Send File', icon: '📎' },
  ]

  // Select media types based on channel
  const mediaTypes = (channelType === 'telegram' || channelType === 'whatsapp')
    ? basicMediaTypes
    : allMediaTypes

  const handleAddNode = (nodeType, specificType, label) => {
    const data = { label }

    if (nodeType === 'trigger') {
      data.triggerType = specificType

      // Keyword DM trigger
      if (specificType === 'keyword_dm') {
        data.keyword = ''
      }

      // Instagram Ref URL trigger
      if (specificType === 'instagram_ref_url') {
        data.refUrl = ''
      }

      // Instagram Ads trigger
      if (specificType === 'instagram_ads') {
        data.adId = ''
        data.campaignId = ''
      }

      // Story Reply trigger
      if (specificType === 'story_reply') {
        data.storySelection = 'all'
        data.selectedStoryId = null
        data.triggerType = 'any'
        data.triggerKeywords = ''
        data.replyDelay = 0
        data.autoReact = false
      }

      // Comment trigger (Instagram and Facebook)
      if (specificType === 'keyword_comment' || specificType === 'instagram_comment') {
        data.selectedPost = null
        data.triggerMode = 'keywords'
        data.keyword = ''
        data.replyType = null
        data.commentReply = ''
      }

      // Story Mention trigger
      if (specificType === 'story_mention') {
        data.triggerFrequency = 'every_time'
        data.replyDelay = 0
        data.delayUnit = 'sec'
        data.autoLike = false
      }

      // Instagram Message trigger
      if (specificType === 'instagram_message') {
        data.messageType = 'any'
        data.keywords = ''
        data.aiIntents = []
        data.replyDelay = 0
      }

      // Telegram Message trigger
      if (specificType === 'telegram_message') {
        data.triggerType = 'any'
        data.keywords = ''
      }

      // Telegram Ref URL trigger
      if (specificType === 'telegram_ref_url') {
        data.refParameter = ''
        data.linkUrl = ''
      }

      // WhatsApp Message trigger
      if (specificType === 'whatsapp_message') {
        data.triggerType = 'any'
        data.keywords = ''
      }

      // WhatsApp Ref URL trigger
      if (specificType === 'whatsapp_ref_url') {
        data.refParameter = ''
        data.linkUrl = ''
      }
    } else if (nodeType === 'condition') {
      data.conditionType = specificType
    } else if (nodeType === 'action') {
      data.actionType = specificType
      if (specificType === 'send_message') {
        data.message = ''
      } else if (specificType === 'data_collection') {
        data.prompt = ''
        data.replyType = 'text'
        data.fieldType = 'custom'
        data.fieldName = ''
        data.allowSkip = false
        data.skipButtonText = 'Skip'
        data.includeQuickReplies = false
        data.quickReplies = []
        data.enableRetry = true
        data.maxRetries = 3
        data.retryMessage = 'Invalid input. Please try again.'
        data.timeoutEnabled = false
        data.timeoutMinutes = 5
        data.enableOptIn = false
        data.optInType = 'email'
        data.onSuccessActions = []
      }
    } else if (nodeType === 'ai') {
      data.aiType = specificType
      data.prompt = ''
    } else if (nodeType === 'media') {
      data.mediaType = specificType
      if (specificType === 'send_message') {
        data.message = ''
        data.includeButtons = false
      } else if (specificType === 'send_image') {
        data.imageUrl = ''
        data.caption = ''
      } else if (specificType === 'send_video') {
        data.videoUrl = ''
        data.caption = ''
      } else if (specificType === 'send_voice') {
        data.voiceUrl = ''
        data.duration = ''
      } else if (specificType === 'send_file') {
        data.fileUrl = ''
        data.fileName = ''
        data.caption = ''
      } else if (specificType === 'send_carousel') {
        data.cards = []
      } else if (specificType === 'send_card') {
        data.title = ''
        data.subtitle = ''
        data.imageUrl = ''
        data.buttons = []
      }
    }

    addNode(nodeType, data)
  }

  return (
    <div
      className={`bg-gray-900 text-white shadow-2xl flex-shrink-0 transition-all duration-300 ${
        isMinimized ? 'w-16' : 'w-64'
      } p-3 pb-24 relative h-full overflow-y-auto`}
    >
      {/* Toggle Button */}
      <button
        onClick={onToggleMinimize}
        className={`absolute top-4 bg-gray-800 hover:bg-gray-700 text-white rounded-full w-8 h-8 flex items-center justify-center shadow-lg z-50 border border-gray-600 transition-all ${
          isMinimized ? 'right-2' : 'right-2'
        }`}
      >
        <span className="text-lg">{isMinimized ? '→' : '←'}</span>
      </button>

      {!isMinimized && (
        <>
          <div className="mb-6">
            <h1 className="text-2xl font-bold mb-2">Automation Builder</h1>
            <p className="text-sm text-gray-400">Drag and connect nodes to build your flow</p>
          </div>
        </>
      )}

      {!isMinimized ? (
        <>
          {/* Triggers Button */}
          <div className="mb-6">
            <button
              onClick={() => setShowTriggersModal(true)}
              className="w-full bg-yellow-800/30 hover:bg-yellow-700/50 text-left p-3 rounded-lg transition-colors border border-yellow-600/30 hover:border-yellow-500"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-yellow-400 uppercase tracking-wider">
                    Triggers
                  </h3>
                  <p className="text-xs text-gray-400 mt-1">Click to select a trigger</p>
                </div>
                <span className="text-2xl">⚡</span>
              </div>
            </button>
          </div>

          {/* Conditions */}
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-blue-400 mb-2 uppercase tracking-wider">
              Conditions
            </h3>
            <div className="space-y-2">
              {conditionTypes.map((condition) => (
                <button
                  key={condition.type}
                  onClick={() => handleAddNode('condition', condition.type, condition.label)}
                  className="w-full bg-blue-800/30 hover:bg-blue-700/50 text-left p-3 rounded-lg transition-colors border border-blue-600/30 hover:border-blue-500"
                >
                  <span className="mr-2">{condition.icon}</span>
                  <span className="text-sm">{condition.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-green-400 mb-2 uppercase tracking-wider">
              Actions
            </h3>
            <div className="space-y-2">
              {actionTypes.map((action) => (
                <button
                  key={action.type}
                  onClick={() => handleAddNode('action', action.type, action.label)}
                  className="w-full bg-green-800/30 hover:bg-green-700/50 text-left p-3 rounded-lg transition-colors border border-green-600/30 hover:border-green-500"
                >
                  <span className="mr-2">{action.icon}</span>
                  <span className="text-sm">{action.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* AI Nodes */}
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-violet-400 mb-2 uppercase tracking-wider flex items-center gap-2">
              <span>AI Nodes</span>
              <span className="inline-block w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
            </h3>
            <div className="space-y-2">
              {aiTypes.map((ai) => (
                <button
                  key={ai.type}
                  onClick={() => handleAddNode('ai', ai.type, ai.label)}
                  className="w-full bg-violet-800/30 hover:bg-violet-700/50 text-left p-3 rounded-lg transition-colors border border-violet-600/30 hover:border-violet-500"
                >
                  <span className="mr-2">{ai.icon}</span>
                  <span className="text-sm">{ai.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Media Nodes */}
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-orange-400 mb-2 uppercase tracking-wider">
              Media Nodes
            </h3>
            <div className="space-y-2">
              {mediaTypes.map((media) => (
                <button
                  key={media.type}
                  onClick={() => handleAddNode('media', media.type, media.label)}
                  className="w-full bg-orange-800/30 hover:bg-orange-700/50 text-left p-3 rounded-lg transition-colors border border-orange-600/30 hover:border-orange-500"
                >
                  <span className="mr-2">{media.icon}</span>
                  <span className="text-sm">{media.label}</span>
                </button>
              ))}
            </div>
          </div>
        </>
      ) : (
        <div className="flex flex-col gap-4 items-center mt-8">
          <div className="text-2xl">💬</div>
          <div className="text-2xl">🔄</div>
          <div className="text-2xl">💌</div>
          <div className="text-2xl">🤖</div>
          <div className="text-2xl">🖼️</div>
        </div>
      )}

      {/* Triggers Modal */}
      {showTriggersModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[200]">
          <div className="bg-gray-900 rounded-xl border border-gray-700 p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto m-4">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">Select a Trigger</h2>
              <button
                onClick={() => setShowTriggersModal(false)}
                className="text-gray-400 hover:text-white text-2xl"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {triggerTypes.length > 0 ? (
                triggerTypes.map((trigger) => (
                  <button
                    key={trigger.type}
                    onClick={() => {
                      handleAddNode('trigger', trigger.type, trigger.label)
                      setShowTriggersModal(false)
                    }}
                    className="bg-yellow-800/30 hover:bg-yellow-700/50 text-left p-4 rounded-lg transition-colors border border-yellow-600/30 hover:border-yellow-500"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">{trigger.icon}</span>
                      <span className="text-sm font-medium text-white">{trigger.label}</span>
                    </div>
                  </button>
                ))
              ) : (
                <div className="col-span-2 text-center py-8">
                  <div className="text-4xl mb-4">⚠️</div>
                  <p className="text-white font-bold mb-2">No triggers available</p>
                  <p className="text-gray-400 text-sm">channelType: {channelType || 'undefined'}</p>
                  <p className="text-gray-400 text-sm">triggerTypes length: {triggerTypes.length}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
