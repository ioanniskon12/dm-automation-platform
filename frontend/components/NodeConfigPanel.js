'use client'

import { useState } from 'react'
import StoryReplyWizard from './StoryReplyWizard'
import TextMessageNodeConfig from './TextMessageNodeConfig'
import InstagramAdsTriggerWizard from './InstagramAdsTriggerWizard'
import InstagramMessageWizard from './InstagramMessageWizard'
import CommentTriggerWizard from './CommentTriggerWizard'
import TagSelector from './TagSelector'

// Video size limits by channel (in MB)
const VIDEO_LIMITS = {
  instagram: { maxSize: 15, maxDuration: 60, label: 'Instagram DM' },
  messenger: { maxSize: 25, maxDuration: 120, label: 'Messenger' },
  facebook: { maxSize: 25, maxDuration: 120, label: 'Messenger' },
  whatsapp: { maxSize: 16, maxDuration: 180, label: 'WhatsApp' },
  telegram: { maxSize: 2000, maxDuration: null, label: 'Telegram' }, // 2GB, no duration limit
};

// Audio/Voice size limits by channel (in MB)
const AUDIO_LIMITS = {
  instagram: { maxSize: 25, maxDuration: 60, label: 'Instagram DM' },
  messenger: { maxSize: 25, maxDuration: null, label: 'Messenger' },
  facebook: { maxSize: 25, maxDuration: null, label: 'Messenger' },
  whatsapp: { maxSize: 16, maxDuration: null, label: 'WhatsApp' },
  telegram: { maxSize: 2000, maxDuration: null, label: 'Telegram' }, // 2GB
};

export default function NodeConfigPanel({ node, onUpdate, onDelete, onClose, onAddConnectedNode, workspaceId, channelType = 'instagram' }) {
  const videoLimit = VIDEO_LIMITS[channelType] || VIDEO_LIMITS.instagram;
  const audioLimit = AUDIO_LIMITS[channelType] || AUDIO_LIMITS.instagram;
  const [showPostSelector, setShowPostSelector] = useState(false)
  const [postSelectorTab, setPostSelectorTab] = useState('posts')
  const [showDmActionSelector, setShowDmActionSelector] = useState(false)
  const [showStoryWizard, setShowStoryWizard] = useState(!node.data.storySelection)
  const [showInstagramAdsWizard, setShowInstagramAdsWizard] = useState(false)
  const [showInstagramMessageWizard, setShowInstagramMessageWizard] = useState(false)
  const [showCommentWizard, setShowCommentWizard] = useState(!node.data.selectedPost)
  const [notification, setNotification] = useState(null)

  const handleUpdate = (field, value) => {
    onUpdate(node.id, { [field]: value })
  }

  const validateNode = () => {
    const errors = []

    // Validate trigger nodes
    if (node.type === 'trigger') {
      // Keyword DM trigger validation
      if (node.data.triggerType === 'keyword_dm') {
        if (!node.data.keyword || node.data.keyword.trim() === '') {
          errors.push('Keyword is required')
        }
      }
      // Comment trigger validation (handled by wizard)
      if ((node.data.triggerType === 'keyword_comment' || node.data.triggerType === 'instagram_comment')) {
        if (!node.data.selectedPost) {
          errors.push('Post selection is required')
        }
        if (node.data.triggerMode === 'keywords' && (!node.data.keyword || node.data.keyword.trim() === '')) {
          errors.push('Keywords are required when using keyword mode')
        }
      }
    }

    // Validate action nodes
    if (node.type === 'action') {
      if (node.data.actionType === 'send_message' && (!node.data.message || node.data.message.trim() === '')) {
        errors.push('Message is required')
      }
      if (node.data.actionType === 'data_collection') {
        if (!node.data.prompt || node.data.prompt.trim() === '') {
          errors.push('Prompt message is required')
        }
        if (!node.data.fieldName || node.data.fieldName.trim() === '') {
          errors.push('Field name is required')
        }
      }
      if (node.data.actionType === 'delay' && !node.data.delay) {
        errors.push('Delay duration is required')
      }
    }

    // Validate AI nodes
    if (node.type === 'ai') {
      if (!node.data.prompt || node.data.prompt.trim() === '') {
        errors.push('AI prompt is required')
      }
    }

    // Validate media nodes
    if (node.type === 'media') {
      if (node.data.mediaType === 'send_message' && (!node.data.message || node.data.message.trim() === '')) {
        errors.push('Message is required')
      }
      if (node.data.mediaType === 'send_image' && (!node.data.imageUrl || node.data.imageUrl.trim() === '')) {
        errors.push('Image URL is required')
      }
      if (node.data.mediaType === 'send_video' && (!node.data.videoUrl || node.data.videoUrl.trim() === '')) {
        errors.push('Video URL is required')
      }
      if (node.data.mediaType === 'send_voice' && (!node.data.voiceUrl || node.data.voiceUrl.trim() === '')) {
        errors.push('Voice URL is required')
      }
      if (node.data.mediaType === 'send_file' && (!node.data.fileUrl || node.data.fileUrl.trim() === '')) {
        errors.push('File URL is required')
      }
    }

    return errors
  }

  const handleSave = () => {
    const errors = validateNode()

    if (errors.length > 0) {
      setNotification({ type: 'error', message: errors.join(', ') })
      setTimeout(() => setNotification(null), 4000)
      return
    }

    setNotification({ type: 'success', message: 'Node saved successfully!' })
    setTimeout(() => {
      setNotification(null)
      onClose()
    }, 1000)
  }

  const getNodeCategory = () => {
    switch (node.type) {
      case 'trigger':
        return 'Trigger'
      case 'condition':
        return 'Condition'
      case 'action':
        return 'Action'
      case 'ai':
        return 'AI'
      case 'media':
        return 'Media'
      default:
        return 'Node'
    }
  }

  const dmActionOptions = [
    { id: 'send_message', label: 'Send Message', icon: '💌', type: 'media', mediaType: 'send_message' },
    { id: 'send_image', label: 'Send Image', icon: '🖼️', type: 'media', mediaType: 'send_image' },
    { id: 'send_video', label: 'Send Video', icon: '🎥', type: 'media', mediaType: 'send_video' },
    { id: 'send_voice', label: 'Send Voice', icon: '🎤', type: 'media', mediaType: 'send_voice' },
    { id: 'send_file', label: 'Send File', icon: '📎', type: 'media', mediaType: 'send_file' },
    { id: 'send_carousel', label: 'Send Carousel', icon: '🎠', type: 'media', mediaType: 'send_carousel' },
    { id: 'send_card', label: 'Send Card', icon: '🃏', type: 'media', mediaType: 'send_card' },
    { id: 'data_collection', label: 'Data Collection', icon: '📝', type: 'action', actionType: 'data_collection' },
    { id: 'ai_response', label: 'AI Response', icon: '🤖', type: 'ai', aiType: 'ai_response' },
  ]

  const handleAddDmAction = (option) => {
    if (onAddConnectedNode) {
      onAddConnectedNode(node.id, option.type, option)
    }
    setShowDmActionSelector(false)
  }

  // Mock posts data - in real app, this would come from API
  const mockPosts = [
    { id: '1', platform: 'instagram', type: 'post', image: 'https://picsum.photos/200/200?random=1', caption: 'Check out our new product launch! 🚀', date: '2 hours ago' },
    { id: '2', platform: 'instagram', type: 'reel', image: 'https://picsum.photos/200/200?random=2', caption: 'Behind the scenes of our latest shoot 📸', date: '1 day ago' },
    { id: '3', platform: 'instagram', type: 'post', image: 'https://picsum.photos/200/200?random=3', caption: 'Summer sale is now live! Get 30% off 🌞', date: '2 days ago' },
    { id: '4', platform: 'instagram', type: 'reel', image: 'https://picsum.photos/200/200?random=4', caption: 'Customer testimonial: "Best service ever!" ⭐⭐⭐⭐⭐', date: '3 days ago' },
    { id: '5', platform: 'instagram', type: 'post', image: 'https://picsum.photos/200/200?random=5', caption: 'Join us for our webinar next week!', date: '5 days ago' },
    { id: '6', platform: 'instagram', type: 'reel', image: 'https://picsum.photos/200/200?random=6', caption: 'Quick tutorial on how to use our product 🎯', date: '1 week ago' },
  ]

  const renderConfig = () => {
    // TRIGGER NODE CONFIG
    if (node.type === 'trigger') {
      return (
        <>
          {(node.data.triggerType === 'story_reply' || node.data.triggerType === 'instagram_story_reply') && (
            <>
              {showStoryWizard ? (
                <StoryReplyWizard
                  initialData={node.data}
                  onComplete={(config) => {
                    onUpdate(node.id, config)
                    setShowStoryWizard(false)
                  }}
                  onClose={() => setShowStoryWizard(false)}
                />
              ) : (
                <div className="text-center py-8">
                  <div className="mb-6">
                    <div className="text-6xl mb-4">📖</div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                      Story Reply Trigger Setup
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm max-w-md mx-auto">
                      {node.data.storySelection ? (
                        'Your story reply trigger is configured. Click below to edit the setup.'
                      ) : (
                        'Set up your Instagram story reply trigger in 4 easy steps - choose story, set triggers, configure delay, and enable auto-react.'
                      )}
                    </p>
                  </div>

                  {node.data.storySelection && (
                    <div className="mb-6 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-700 max-w-md mx-auto">
                      <div className="text-sm text-purple-900 dark:text-purple-300 space-y-1">
                        <div><span className="font-semibold">Story:</span> {node.data.storySelection === 'all' ? 'All Stories' : 'Specific Story'}</div>
                        <div><span className="font-semibold">Trigger:</span> {node.data.triggerType === 'any' ? 'Any reply' : `Keywords: ${node.data.triggerKeywords}`}</div>
                        {node.data.replyDelay > 0 && (
                          <div><span className="font-semibold">Delay:</span> {node.data.replyDelay}s</div>
                        )}
                        {node.data.autoReact && (
                          <div><span className="font-semibold">Auto-react:</span> ❤️ Enabled</div>
                        )}
                      </div>
                    </div>
                  )}

                  <button
                    onClick={() => setShowStoryWizard(true)}
                    className="px-8 py-4 rounded-xl font-bold bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 transition-all shadow-lg hover:shadow-xl text-lg"
                  >
                    {node.data.storySelection ? '✏️ Edit Setup' : '🚀 Start Setup Wizard'}
                  </button>
                </div>
              )}
            </>
          )}

          {node.data.triggerType === 'keyword_dm' && (
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-white">Keyword</label>
              <input
                type="text"
                value={node.data.keyword || ''}
                onChange={(e) => handleUpdate('keyword', e.target.value)}
                placeholder="Enter keyword to watch for"
                className="w-full p-2 border rounded bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400 focus:border-transparent"
              />
            </div>
          )}

          {node.data.triggerType === 'instagram_ads' && (
            <>
              {showInstagramAdsWizard ? (
                <InstagramAdsTriggerWizard
                  node={node}
                  onUpdate={onUpdate}
                  onClose={() => setShowInstagramAdsWizard(false)}
                />
              ) : (
                <div className="text-center py-8">
                  <div className="mb-6">
                    <div className="text-6xl mb-4">📢</div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                      Instagram Ads Trigger Setup
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm max-w-md mx-auto">
                      {node.data.setupComplete ? (
                        'Your Instagram ads trigger is configured. Click below to view or edit the setup instructions.'
                      ) : (
                        'Set up your Instagram ads trigger to automatically message people who click your ads.'
                      )}
                    </p>
                  </div>

                  {node.data.adName && (
                    <div className="mb-6 p-4 bg-pink-50 dark:bg-pink-900/20 rounded-lg border border-pink-200 dark:border-pink-700 max-w-md mx-auto">
                      <div className="text-sm text-pink-900 dark:text-pink-300">
                        <div><span className="font-semibold">Campaign:</span> {node.data.adName}</div>
                      </div>
                    </div>
                  )}

                  <button
                    onClick={() => setShowInstagramAdsWizard(true)}
                    className="px-8 py-4 rounded-xl font-bold bg-gradient-to-r from-pink-500 to-purple-600 text-white hover:from-pink-600 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl text-lg"
                  >
                    {node.data.setupComplete ? '✏️ View Setup' : '🚀 View Setup Instructions'}
                  </button>
                </div>
              )}
            </>
          )}

          {node.data.triggerType === 'instagram_message' && (
            <div className="py-8">
              <div className="mb-6 text-center">
                <div className="text-6xl mb-4">📨</div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                  Instagram Message
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm max-w-md mx-auto mb-4">
                  Trigger when someone sends you a message on Instagram.
                </p>
              </div>

              {/* Message Type Selection */}
              <div className="mb-6">
                <div className="space-y-3">
                  {/* Any message */}
                  <label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 border-gray-300 dark:border-gray-600">
                    <input
                      type="radio"
                      checked={!node.data.messageType || node.data.messageType === 'any'}
                      onChange={() => handleUpdate('messageType', 'any')}
                      className="w-4 h-4 text-blue-500"
                    />
                    <span className="text-sm font-medium text-gray-900 dark:text-white">Any message</span>
                  </label>

                  {/* Specific keyword */}
                  <div className="p-3 border rounded-lg border-gray-300 dark:border-gray-600">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="radio"
                        checked={node.data.messageType === 'keyword'}
                        onChange={() => handleUpdate('messageType', 'keyword')}
                        className="w-4 h-4 text-blue-500"
                      />
                      <span className="text-sm font-medium text-gray-900 dark:text-white">Specific keyword →</span>
                      <input
                        type="text"
                        value={node.data.keywords || ''}
                        onChange={(e) => handleUpdate('keywords', e.target.value)}
                        onClick={() => handleUpdate('messageType', 'keyword')}
                        placeholder="enter keywords"
                        className="flex-1 px-3 py-1.5 border rounded-lg bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 placeholder-gray-400 dark:placeholder-gray-500"
                      />
                    </label>
                  </div>

                  {/* AI: recognize intent */}
                  <label className="flex items-start gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 border-gray-300 dark:border-gray-600">
                    <input
                      type="radio"
                      checked={node.data.messageType === 'ai'}
                      onChange={() => handleUpdate('messageType', 'ai')}
                      className="w-4 h-4 text-blue-500 mt-0.5"
                    />
                    <div className="flex-1">
                      <div className="text-sm font-medium text-gray-900 dark:text-white mb-1">AI: recognize intent</div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">
                        Let AI understand what the user meant (e.g., "price", "support", "booking") and trigger the right reply.
                      </div>
                    </div>
                  </label>
                </div>

                <p className="text-xs text-gray-500 dark:text-gray-400 mt-4">
                  (Default: Any message)
                </p>
              </div>
            </div>
          )}

          {(node.data.triggerType === 'keyword_comment' || node.data.triggerType === 'instagram_comment') && (
            <>
              {showCommentWizard ? (
                <CommentTriggerWizard
                  node={node}
                  onUpdate={onUpdate}
                  onClose={() => setShowCommentWizard(false)}
                  isPro={true}
                />
              ) : (
                <div className="text-center py-8">
                  <div className="mb-6">
                    <div className="text-6xl mb-4">💬</div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                      Comment Trigger Setup
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm max-w-md mx-auto">
                      {node.data.selectedPost ? (
                        'Your comment trigger is configured. Click below to edit.'
                      ) : (
                        'Trigger automation when someone comments on your post.'
                      )}
                    </p>
                  </div>

                  {node.data.selectedPost && (
                    <div className="mb-6 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-700 max-w-md mx-auto">
                      <div className="text-sm text-purple-900 dark:text-purple-300 space-y-1">
                        <div><span className="font-semibold">Post:</span> {node.data.selectedPost.caption?.substring(0, 50)}...</div>
                        <div><span className="font-semibold">Mode:</span> {node.data.triggerMode === 'keywords' ? 'Specific keywords' : 'Any comment'}</div>
                      </div>
                    </div>
                  )}

                  <button
                    onClick={() => setShowCommentWizard(true)}
                    className="px-8 py-4 rounded-xl font-bold bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 transition-all shadow-lg hover:shadow-xl text-lg"
                  >
                    {node.data.selectedPost ? '✏️ Edit Setup' : '🚀 Start Setup Wizard'}
                  </button>
                </div>
              )}
            </>
          )}

          {(node.data.triggerType === 'instagram_shares' || node.data.triggerType === 'instagram_post_share') && (
            <div className="py-8">
              <div className="mb-6 text-center">
                <div className="text-6xl mb-4">🔄</div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                  Instagram Shares
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm max-w-md mx-auto mb-4">
                  Trigger when someone shares your post or reel to their story.
                </p>
              </div>

              {/* Share Type Selection */}
              <div className="mb-6 pb-6 border-b border-gray-200 dark:border-gray-700">
                <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-3">
                  When someone shares:
                </label>
                <div className="space-y-3">
                  {/* A specific post or reel */}
                  <div className="p-3 border rounded-lg border-gray-300 dark:border-gray-600">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="radio"
                        checked={!node.data.shareType || node.data.shareType === 'specific'}
                        onChange={() => handleUpdate('shareType', 'specific')}
                        className="w-4 h-4 text-purple-500"
                      />
                      <span className="text-sm font-medium text-gray-900 dark:text-white">A specific post or reel</span>
                    </label>
                    {(!node.data.shareType || node.data.shareType === 'specific') && (
                      <button
                        onClick={() => setShowPostSelector(true)}
                        className="mt-3 ml-7 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm rounded-lg transition-colors flex items-center gap-2"
                      >
                        Click to choose →
                        {node.data.selectedPost && (
                          <span className="bg-white/20 px-2 py-0.5 rounded text-xs">✓ Selected</span>
                        )}
                      </button>
                    )}
                  </div>

                  {/* Any post */}
                  <div className="p-3 border rounded-lg border-gray-300 dark:border-gray-600">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="radio"
                        checked={node.data.shareType === 'any'}
                        onChange={() => handleUpdate('shareType', 'any')}
                        className="w-4 h-4 text-purple-500"
                      />
                      <span className="text-sm font-medium text-gray-900 dark:text-white">Any post</span>
                    </label>
                  </div>

                  {/* Next post */}
                  <div className="p-3 border rounded-lg border-gray-300 dark:border-gray-600">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="radio"
                        checked={node.data.shareType === 'next'}
                        onChange={() => handleUpdate('shareType', 'next')}
                        className="w-4 h-4 text-purple-500"
                      />
                      <span className="text-sm font-medium text-gray-900 dark:text-white">Next post</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Delay Before Replying */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-3">
                  Delay before replying:
                </label>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-sm text-gray-700 dark:text-gray-300">Wait</span>
                  <input
                    type="number"
                    min="0"
                    value={node.data.replyDelay || 0}
                    onChange={(e) => handleUpdate('replyDelay', parseInt(e.target.value) || 0)}
                    className="w-20 px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 text-center"
                  />
                  <select
                    value={node.data.delayUnit || 'seconds'}
                    onChange={(e) => handleUpdate('delayUnit', e.target.value)}
                    className="px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="seconds">seconds</option>
                    <option value="minutes">minutes</option>
                    <option value="hours">hours</option>
                    <option value="days">days</option>
                  </select>
                  <span className="text-sm text-gray-700 dark:text-gray-300">before sending the message.</span>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-3 italic">
                  💡 Tip: Add a short delay to make your reply feel more natural — not instant or robotic.
                </p>
              </div>
            </div>
          )}

          {(node.data.triggerType === 'live_comments' || node.data.triggerType === 'instagram_live_comment') && (
            <div className="py-8">
              <div className="mb-6 text-center">
                <div className="text-6xl mb-4">🎥</div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                  Live Comments Trigger
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm max-w-md mx-auto mb-4">
                  Trigger replies when someone comments using these keywords during your live stream.
                </p>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-3">
                  Trigger replies when someone comments using these keywords:
                </label>
                <input
                  type="text"
                  value={node.data.liveKeywords || ''}
                  onChange={(e) => handleUpdate('liveKeywords', e.target.value)}
                  placeholder="hello, interested, price, sign me up"
                  className="w-full p-3 border rounded-lg bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 placeholder-gray-400 dark:placeholder-gray-500"
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                  📝 Note: Keywords are not case-sensitive — for example, "Hello" and "hello" are treated the same.
                </p>
              </div>
            </div>
          )}

          {node.data.triggerType === 'instagram_ref_url' && (
            <div className="py-8">
              <div className="mb-6 text-center">
                <div className="text-6xl mb-4">🔗</div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                  Instagram Ref URL
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm max-w-md mx-auto mb-4">
                  Create a trackable link to trigger automation when users click it.
                </p>
              </div>

              {/* Generated URL Display */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-3">
                  Your Instagram Ref URL
                </label>
                <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 border border-gray-300 dark:border-gray-600">
                  <div className="text-sm font-mono text-gray-900 dark:text-white break-all mb-3">
                    https://ig.me/m/connected_ig_account?ref={node.data.refParameter || 'Customize_your_URL'}
                  </div>
                  <button
                    onClick={() => {
                      const url = `https://ig.me/m/connected_ig_account?ref=${node.data.refParameter || 'Customize_your_URL'}`
                      navigator.clipboard.writeText(url)
                      // Show a brief success indicator
                      const btn = event.target
                      const originalText = btn.textContent
                      btn.textContent = '✓ Copied!'
                      setTimeout(() => {
                        btn.textContent = originalText
                      }, 2000)
                    }}
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
                  >
                    Copy URL
                  </button>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                    Save this trigger to copy the link.
                  </p>
                </div>
              </div>

              {/* Customization Toggle */}
              <div className="mb-4">
                <button
                  onClick={() => handleUpdate('showCustomization', !node.data.showCustomization)}
                  className="flex items-center justify-between w-full text-left text-sm font-semibold text-gray-900 dark:text-white"
                >
                  <span>Additional settings</span>
                  <span className="text-gray-400">{node.data.showCustomization ? '▼' : '▶'}</span>
                </button>
              </div>

              {/* Customization Section */}
              {node.data.showCustomization && (
                <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 border border-gray-300 dark:border-gray-600 mb-4">
                  <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                    Customize your URL
                  </label>
                  <input
                    type="text"
                    value={node.data.refParameter || ''}
                    onChange={(e) => handleUpdate('refParameter', e.target.value)}
                    placeholder="loyalty_program"
                    className="w-full p-3 border rounded-lg bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
                  />
                  <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                    This changes only the part after ref= so your link looks nicer
                  </p>
                </div>
              )}
            </div>
          )}

          {node.data.triggerType === 'new_follower' && (
            <div className="py-8">
              <div className="mb-6 text-center">
                <div className="text-6xl mb-4">👤</div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                  New Follower
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm max-w-md mx-auto mb-4">
                  Send message when someone follows you
                </p>
              </div>

              {/* Required Message Type */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-3">
                  First Message (Required) *
                </label>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
                  They MUST send at least one message with a button
                </p>

                <div className="space-y-2">
                  {/* AI Reply */}
                  <label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 border-gray-300 dark:border-gray-600">
                    <input
                      type="radio"
                      name="followerReplyType"
                      checked={node.data.followerReplyType === 'ai'}
                      onChange={() => handleUpdate('followerReplyType', 'ai')}
                      className="w-4 h-4 text-green-500"
                    />
                    <span className="text-sm text-gray-900 dark:text-white">AI reply</span>
                  </label>

                  {/* Predefined Message */}
                  <label className="flex items-start gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 border-gray-300 dark:border-gray-600">
                    <input
                      type="radio"
                      name="followerReplyType"
                      checked={node.data.followerReplyType === 'predefined'}
                      onChange={() => handleUpdate('followerReplyType', 'predefined')}
                      className="w-4 h-4 text-green-500 mt-0.5"
                    />
                    <div className="flex-1">
                      <span className="text-sm text-gray-900 dark:text-white">Predefined message:</span>
                      {node.data.followerReplyType === 'predefined' && (
                        <textarea
                          value={node.data.followerMessage || ''}
                          onChange={(e) => handleUpdate('followerMessage', e.target.value)}
                          placeholder="Enter your welcome message..."
                          className="w-full mt-2 p-2 border rounded-lg bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-green-500"
                          rows={3}
                        />
                      )}
                    </div>
                  </label>

                  {/* Rotating Replies */}
                  <label className="flex items-start gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 border-gray-300 dark:border-gray-600">
                    <input
                      type="radio"
                      name="followerReplyType"
                      checked={node.data.followerReplyType === 'rotating'}
                      onChange={() => handleUpdate('followerReplyType', 'rotating')}
                      className="w-4 h-4 text-green-500 mt-0.5"
                    />
                    <div className="flex-1">
                      <span className="text-sm text-gray-900 dark:text-white">Rotating replies</span>
                      {node.data.followerReplyType === 'rotating' && (
                        <button
                          onClick={() => {
                            // Initialize empty array if not exists
                            const messages = node.data.followerRotatingMessages || []
                            handleUpdate('followerRotatingMessages', [...messages, ''])
                          }}
                          className="mt-2 w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors text-sm"
                        >
                          + Add Message
                        </button>
                      )}
                      {node.data.followerReplyType === 'rotating' && node.data.followerRotatingMessages?.length > 0 && (
                        <div className="mt-2 space-y-2">
                          {node.data.followerRotatingMessages.map((msg, idx) => (
                            <div key={idx} className="flex gap-2">
                              <input
                                type="text"
                                value={msg}
                                onChange={(e) => {
                                  const newMessages = [...node.data.followerRotatingMessages]
                                  newMessages[idx] = e.target.value
                                  handleUpdate('followerRotatingMessages', newMessages)
                                }}
                                placeholder={`Message ${idx + 1}`}
                                className="flex-1 p-2 border rounded-lg bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white text-sm"
                              />
                              <button
                                onClick={() => {
                                  const newMessages = node.data.followerRotatingMessages.filter((_, i) => i !== idx)
                                  handleUpdate('followerRotatingMessages', newMessages)
                                }}
                                className="px-3 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm"
                              >
                                ✕
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </label>
                </div>

                {/* Warning if no message configured */}
                {!node.data.followerReplyType && (
                  <div className="mt-3 p-3 bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-400 dark:border-yellow-600 rounded-r-lg">
                    <div className="flex items-start gap-2">
                      <span className="text-yellow-600 dark:text-yellow-400 font-bold text-sm">⚠️</span>
                      <p className="text-sm text-yellow-800 dark:text-yellow-300">
                        You must add at least one message with a button for this trigger to work.
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Optional Email Collection */}
              <div className="mb-4">
                <label className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-300 dark:border-gray-600">
                  <input
                    type="checkbox"
                    checked={node.data.askForEmail || false}
                    onChange={(e) => handleUpdate('askForEmail', e.target.checked)}
                    className="w-4 h-4 text-green-500 border-gray-300 rounded focus:ring-green-500"
                  />
                  <span className="text-sm text-gray-900 dark:text-white">
                    Also ask for email after they send first message
                  </span>
                </label>
              </div>
            </div>
          )}

          {node.data.triggerType === 'telegram_message' && (
            <div className="py-8">
              <div className="mb-6 text-center">
                <div className="text-6xl mb-4">✈️</div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                  Telegram Message
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm max-w-md mx-auto mb-4">
                  Trigger when user sends a message on Telegram.
                </p>
              </div>

              {/* Trigger Type */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-3">
                  Trigger On:
                </label>
                <div className="space-y-2">
                  <label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 border-gray-300 dark:border-gray-600">
                    <input
                      type="radio"
                      checked={node.data.triggerType === 'any'}
                      onChange={() => handleUpdate('triggerType', 'any')}
                      className="w-4 h-4 text-blue-500"
                    />
                    <span className="text-sm text-gray-900 dark:text-white">Any Message</span>
                  </label>
                  <label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 border-gray-300 dark:border-gray-600">
                    <input
                      type="radio"
                      checked={node.data.triggerType === 'keywords'}
                      onChange={() => handleUpdate('triggerType', 'keywords')}
                      className="w-4 h-4 text-blue-500"
                    />
                    <span className="text-sm text-gray-900 dark:text-white">Specific Keywords</span>
                  </label>
                </div>
              </div>

              {/* Keywords Input (conditional) */}
              {node.data.triggerType === 'keywords' && (
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                    Keywords:
                  </label>
                  <input
                    type="text"
                    value={node.data.keywords || ''}
                    onChange={(e) => handleUpdate('keywords', e.target.value)}
                    placeholder="e.g., help, support, info"
                    className="w-full p-3 border rounded-lg bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                    Enter keywords separated by commas. Case-insensitive.
                  </p>
                </div>
              )}
            </div>
          )}

          {node.data.triggerType === 'telegram_ref_url' && (
            <div className="py-8">
              <div className="mb-6 text-center">
                <div className="text-6xl mb-4">🔗</div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                  Telegram Ref URL
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm max-w-md mx-auto mb-4">
                  Create a trackable deep link to trigger automation when users click it.
                </p>
              </div>

              {/* Ref Parameter Input */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-3">
                  Ref Parameter:
                </label>
                <input
                  type="text"
                  value={node.data.refParameter || ''}
                  onChange={(e) => handleUpdate('refParameter', e.target.value)}
                  placeholder="e.g., promo_code or campaign_id"
                  className="w-full p-3 border rounded-lg bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                  The ref parameter in your Telegram deep link
                </p>
              </div>

              {/* Generated URL Display */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-3">
                  Your Telegram Deep Link:
                </label>
                <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 border border-gray-300 dark:border-gray-600">
                  <div className="text-sm font-mono text-gray-900 dark:text-white break-all mb-3">
                    https://t.me/yourbot?start={node.data.refParameter || 'your_ref_parameter'}
                  </div>
                  <button
                    onClick={() => {
                      const url = `https://t.me/yourbot?start=${node.data.refParameter || 'your_ref_parameter'}`
                      navigator.clipboard.writeText(url)
                      // Show a brief success indicator
                      const btn = event.target
                      const originalText = btn.textContent
                      btn.textContent = '✓ Copied!'
                      setTimeout(() => {
                        btn.textContent = originalText
                      }, 2000)
                    }}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
                  >
                    Copy URL
                  </button>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                    Replace "yourbot" with your actual Telegram bot username
                  </p>
                </div>
              </div>

              {/* Link URL (optional, for reference) */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                  Full Link (for reference):
                </label>
                <input
                  type="text"
                  value={node.data.linkUrl || ''}
                  onChange={(e) => handleUpdate('linkUrl', e.target.value)}
                  placeholder="https://t.me/yourbot?start=promo_code"
                  className="w-full p-3 border rounded-lg bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                  Optional: Store the full link for your reference
                </p>
              </div>
            </div>
          )}

          {node.data.triggerType === 'whatsapp_message' && (
            <div className="py-8">
              <div className="mb-6 text-center">
                <div className="text-6xl mb-4">💬</div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                  WhatsApp Message
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm max-w-md mx-auto mb-4">
                  Trigger when user sends a message on WhatsApp.
                </p>
              </div>

              {/* Trigger Type */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-3">
                  Trigger On:
                </label>
                <div className="space-y-2">
                  <label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 border-gray-300 dark:border-gray-600">
                    <input
                      type="radio"
                      checked={node.data.triggerType === 'any'}
                      onChange={() => handleUpdate('triggerType', 'any')}
                      className="w-4 h-4 text-green-500"
                    />
                    <span className="text-sm text-gray-900 dark:text-white">Any Message</span>
                  </label>
                  <label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 border-gray-300 dark:border-gray-600">
                    <input
                      type="radio"
                      checked={node.data.triggerType === 'keywords'}
                      onChange={() => handleUpdate('triggerType', 'keywords')}
                      className="w-4 h-4 text-green-500"
                    />
                    <span className="text-sm text-gray-900 dark:text-white">Specific Keywords</span>
                  </label>
                </div>
              </div>

              {/* Keywords Input (conditional) */}
              {node.data.triggerType === 'keywords' && (
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                    Keywords:
                  </label>
                  <input
                    type="text"
                    value={node.data.keywords || ''}
                    onChange={(e) => handleUpdate('keywords', e.target.value)}
                    placeholder="e.g., help, support, info"
                    className="w-full p-3 border rounded-lg bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500"
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                    Enter keywords separated by commas. Case-insensitive.
                  </p>
                </div>
              )}
            </div>
          )}

          {node.data.triggerType === 'whatsapp_ref_url' && (
            <div className="py-8">
              <div className="mb-6 text-center">
                <div className="text-6xl mb-4">🔗</div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                  WhatsApp Ref URL
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm max-w-md mx-auto mb-4">
                  Create a trackable WhatsApp link to trigger automation when users click it.
                </p>
              </div>

              {/* Ref Parameter Input */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-3">
                  Ref Parameter:
                </label>
                <input
                  type="text"
                  value={node.data.refParameter || ''}
                  onChange={(e) => handleUpdate('refParameter', e.target.value)}
                  placeholder="e.g., promo_code or campaign_id"
                  className="w-full p-3 border rounded-lg bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500"
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                  The ref parameter in your WhatsApp link
                </p>
              </div>

              {/* Generated URL Display */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-3">
                  Your WhatsApp Link:
                </label>
                <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 border border-gray-300 dark:border-gray-600">
                  <div className="text-sm font-mono text-gray-900 dark:text-white break-all mb-3">
                    https://wa.me/YOUR_PHONE?text={node.data.refParameter || 'your_ref_parameter'}
                  </div>
                  <button
                    onClick={() => {
                      const url = `https://wa.me/YOUR_PHONE?text=${node.data.refParameter || 'your_ref_parameter'}`
                      navigator.clipboard.writeText(url)
                      // Show a brief success indicator
                      const btn = event.target
                      const originalText = btn.textContent
                      btn.textContent = '✓ Copied!'
                      setTimeout(() => {
                        btn.textContent = originalText
                      }, 2000)
                    }}
                    className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
                  >
                    Copy URL
                  </button>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                    Replace "YOUR_PHONE" with your WhatsApp business number (e.g., 1234567890)
                  </p>
                </div>
              </div>

              {/* Link URL (optional, for reference) */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                  Full Link (for reference):
                </label>
                <input
                  type="text"
                  value={node.data.linkUrl || ''}
                  onChange={(e) => handleUpdate('linkUrl', e.target.value)}
                  placeholder="https://wa.me/1234567890?text=promo_code"
                  className="w-full p-3 border rounded-lg bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500"
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                  Optional: Store the full link for your reference
                </p>
              </div>
            </div>
          )}
        </>
      )
    }

    // CONDITION NODE CONFIG
    if (node.type === 'condition') {
      return (
        <>
          {node.data.conditionType === 'is_follower' && (
            <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded border border-blue-200 dark:border-blue-700">
              <p className="text-sm text-blue-800 dark:text-blue-300">
                This will check if the user is following your account.
              </p>
            </div>
          )}

          {node.data.conditionType === 'time_based' && (
            <>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-white">Day of Week</label>
                <select
                  value={node.data.dayOfWeek || 'any'}
                  onChange={(e) => handleUpdate('dayOfWeek', e.target.value)}
                  className="w-full p-2 border rounded bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent"
                >
                  <option value="any">Any Day</option>
                  <option value="monday">Monday</option>
                  <option value="tuesday">Tuesday</option>
                  <option value="wednesday">Wednesday</option>
                  <option value="thursday">Thursday</option>
                  <option value="friday">Friday</option>
                  <option value="saturday">Saturday</option>
                  <option value="sunday">Sunday</option>
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-white">Time Range</label>
                <div className="flex gap-2">
                  <input
                    type="time"
                    value={node.data.startTime || '09:00'}
                    onChange={(e) => handleUpdate('startTime', e.target.value)}
                    className="flex-1 p-2 border rounded bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent"
                  />
                  <span className="self-center text-gray-900 dark:text-white">to</span>
                  <input
                    type="time"
                    value={node.data.endTime || '17:00'}
                    onChange={(e) => handleUpdate('endTime', e.target.value)}
                    className="flex-1 p-2 border rounded bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent"
                  />
                </div>
              </div>
            </>
          )}

          {node.data.conditionType === 'custom_field' && (
            <>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-white">Field Name</label>
                <input
                  type="text"
                  value={node.data.fieldName || ''}
                  onChange={(e) => handleUpdate('fieldName', e.target.value)}
                  placeholder="e.g., email, phone"
                  className="w-full p-2 border rounded bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-white">Condition</label>
                <select
                  value={node.data.fieldCondition || 'exists'}
                  onChange={(e) => handleUpdate('fieldCondition', e.target.value)}
                  className="w-full p-2 border rounded bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent"
                >
                  <option value="exists">Exists</option>
                  <option value="not_exists">Does Not Exist</option>
                  <option value="equals">Equals</option>
                  <option value="contains">Contains</option>
                </select>
              </div>
            </>
          )}
        </>
      )
    }

    // ACTION NODE CONFIG
    if (node.type === 'action') {
      return (
        <>
          {node.data.actionType === 'send_message' && (
            <>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-white">Message</label>
                <textarea
                  value={node.data.message || ''}
                  onChange={(e) => handleUpdate('message', e.target.value)}
                  placeholder="Hi {name}! Thanks for reaching out..."
                  rows={4}
                  className="w-full p-2 border rounded bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400 focus:border-transparent"
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Use {'{name}'}, {'{username}'} for personalization
                </p>
              </div>
              <div className="mb-4">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={node.data.includeButtons || false}
                    onChange={(e) => handleUpdate('includeButtons', e.target.checked)}
                    className="rounded border-gray-300 dark:border-gray-600 text-green-600 focus:ring-green-500 dark:focus:ring-green-400 dark:bg-gray-700"
                  />
                  <span className="text-sm text-gray-900 dark:text-white">Include Quick Reply Buttons</span>
                </label>
              </div>
            </>
          )}

          {node.data.actionType === 'add_tag' && (
            <div className="mb-4">
              <label className="block text-sm font-medium mb-3 text-gray-900 dark:text-white">Select or Create Tags</label>
              <TagSelector
                workspaceId={workspaceId}
                selectedTags={node.data.selectedTags || []}
                onSelectTags={(tags) => {
                  onUpdate(node.id, {
                    selectedTags: tags,
                    tags: tags.map(t => ({
                      id: t.id,
                      name: t.name,
                      color: t.color,
                      category: t.category?.name || null,
                    })),
                  })
                }}
                multiple={true}
              />
            </div>
          )}

          {node.data.actionType === 'data_collection' && (
            <>
              {/* Prompt Message */}
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-white">Prompt Message</label>
                <textarea
                  value={node.data.prompt || ''}
                  onChange={(e) => handleUpdate('prompt', e.target.value)}
                  placeholder="What's your email address?"
                  rows={3}
                  className="w-full p-2 border rounded bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400 focus:border-transparent"
                />
              </div>

              {/* Reply Type */}
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-white">Expected Reply Type</label>
                <select
                  value={node.data.replyType || 'text'}
                  onChange={(e) => handleUpdate('replyType', e.target.value)}
                  className="w-full p-2 border rounded bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400 focus:border-transparent"
                >
                  <option value="text">Text</option>
                  <option value="email">Email</option>
                  <option value="phone">Phone Number</option>
                  <option value="number">Number</option>
                  <option value="url">URL</option>
                  <option value="date">Date</option>
                  <option value="multiple_choice">Multiple Choice</option>
                </select>
              </div>

              {/* Multiple Choice Options */}
              {node.data.replyType === 'multiple_choice' && (
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-white">Choice Options</label>
                  <div className="space-y-2">
                    {(node.data.multipleChoiceOptions || []).map((choice, index) => (
                      <div key={index} className="flex gap-2">
                        <input
                          type="text"
                          value={choice}
                          onChange={(e) => {
                            const newChoices = [...(node.data.multipleChoiceOptions || [])]
                            newChoices[index] = e.target.value
                            handleUpdate('multipleChoiceOptions', newChoices)
                          }}
                          placeholder={`Choice ${index + 1}`}
                          className="flex-1 p-2 border rounded bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400 focus:border-transparent"
                        />
                        <button
                          onClick={() => {
                            const newChoices = (node.data.multipleChoiceOptions || []).filter((_, i) => i !== index)
                            handleUpdate('multipleChoiceOptions', newChoices)
                          }}
                          className="px-3 py-2 bg-red-600 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-800 text-white rounded transition-colors"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                    <button
                      onClick={() => {
                        const newChoices = [...(node.data.multipleChoiceOptions || []), '']
                        handleUpdate('multipleChoiceOptions', newChoices)
                      }}
                      className="w-full p-2 border-2 border-dashed border-green-300 dark:border-green-700 rounded bg-green-50 dark:bg-green-900/20 hover:bg-green-100 dark:hover:bg-green-900/30 text-green-700 dark:text-green-300 font-medium transition-colors"
                    >
                      + Add Choice
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                    Users will see these options as quick reply buttons
                  </p>
                </div>
              )}

              {/* Field Settings */}
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-white">Save To Field</label>
                <div className="space-y-2">
                  <select
                    value={node.data.fieldType || 'custom'}
                    onChange={(e) => handleUpdate('fieldType', e.target.value)}
                    className="w-full p-2 border rounded bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400 focus:border-transparent"
                  >
                    <option value="custom">Custom Field</option>
                    <option value="system">System Field</option>
                  </select>

                  {node.data.fieldType === 'system' ? (
                    <select
                      value={node.data.fieldName || ''}
                      onChange={(e) => handleUpdate('fieldName', e.target.value)}
                      className="w-full p-2 border rounded bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400 focus:border-transparent"
                    >
                      <option value="">Select a system field...</option>
                      <option value="email">Email</option>
                      <option value="phone">Phone Number</option>
                      <option value="first_name">First Name</option>
                      <option value="last_name">Last Name</option>
                      <option value="full_name">Full Name</option>
                      <option value="gender">Gender</option>
                      <option value="birthday">Birthday</option>
                      <option value="address">Address</option>
                      <option value="city">City</option>
                      <option value="state">State/Province</option>
                      <option value="country">Country</option>
                      <option value="zip_code">Zip/Postal Code</option>
                      <option value="company">Company</option>
                      <option value="job_title">Job Title</option>
                      <option value="website">Website</option>
                    </select>
                  ) : (
                    <input
                      type="text"
                      value={node.data.fieldName || ''}
                      onChange={(e) => handleUpdate('fieldName', e.target.value)}
                      placeholder="Enter custom field name (e.g., favorite_color, pet_name)"
                      className="w-full p-2 border rounded bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400 focus:border-transparent"
                    />
                  )}
                </div>
              </div>

              {/* Skip Option */}
              <div className="mb-4">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={node.data.allowSkip || false}
                    onChange={(e) => handleUpdate('allowSkip', e.target.checked)}
                    className="rounded border-gray-300 dark:border-gray-600 text-green-600 focus:ring-green-500 dark:focus:ring-green-400 dark:bg-gray-700"
                  />
                  <span className="text-sm text-gray-900 dark:text-white">Allow users to skip this question</span>
                </label>
                {node.data.allowSkip && (
                  <input
                    type="text"
                    value={node.data.skipButtonText || 'Skip'}
                    onChange={(e) => handleUpdate('skipButtonText', e.target.value)}
                    placeholder="Skip button text"
                    className="w-full mt-2 p-2 border rounded bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400 focus:border-transparent"
                  />
                )}
              </div>

              {/* Retry Settings */}
              <div className="mb-4 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-700">
                <label className="flex items-center gap-2 mb-2">
                  <input
                    type="checkbox"
                    checked={node.data.enableRetry !== false}
                    onChange={(e) => handleUpdate('enableRetry', e.target.checked)}
                    className="rounded border-gray-300 dark:border-gray-600 text-green-600 focus:ring-green-500 dark:focus:ring-green-400"
                  />
                  <span className="text-sm font-medium text-gray-900 dark:text-white">Enable Retry on Invalid Input</span>
                </label>
                {node.data.enableRetry !== false && (
                  <>
                    <div className="mt-2">
                      <label className="block text-xs font-medium mb-1 text-gray-900 dark:text-white">Max Retries</label>
                      <input
                        type="number"
                        value={node.data.maxRetries || 3}
                        onChange={(e) => handleUpdate('maxRetries', parseInt(e.target.value))}
                        min="1"
                        max="10"
                        className="w-full p-2 border rounded bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400 focus:border-transparent"
                      />
                    </div>
                    <div className="mt-2">
                      <label className="block text-xs font-medium mb-1 text-gray-900 dark:text-white">Retry Message</label>
                      <input
                        type="text"
                        value={node.data.retryMessage || 'Invalid input. Please try again.'}
                        onChange={(e) => handleUpdate('retryMessage', e.target.value)}
                        placeholder="Invalid input. Please try again."
                        className="w-full p-2 border rounded bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400 focus:border-transparent"
                      />
                    </div>
                  </>
                )}
              </div>

              {/* Timeout Settings */}
              <div className="mb-4 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-700">
                <label className="flex items-center gap-2 mb-2">
                  <input
                    type="checkbox"
                    checked={node.data.timeoutEnabled || false}
                    onChange={(e) => handleUpdate('timeoutEnabled', e.target.checked)}
                    className="rounded border-gray-300 dark:border-gray-600 text-green-600 focus:ring-green-500 dark:focus:ring-green-400"
                  />
                  <span className="text-sm font-medium text-gray-900 dark:text-white">Enable Response Timeout</span>
                </label>
                {node.data.timeoutEnabled && (
                  <div className="mt-2">
                    <label className="block text-xs font-medium mb-1 text-gray-900 dark:text-white">Timeout (minutes)</label>
                    <input
                      type="number"
                      value={node.data.timeoutMinutes || 5}
                      onChange={(e) => handleUpdate('timeoutMinutes', parseInt(e.target.value))}
                      min="1"
                      max="1440"
                      className="w-full p-2 border rounded bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400 focus:border-transparent"
                    />
                  </div>
                )}
              </div>

              {/* Opt-in Settings */}
              <div className="mb-4 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-700">
                <label className="flex items-center gap-2 mb-2">
                  <input
                    type="checkbox"
                    checked={node.data.enableOptIn || false}
                    onChange={(e) => handleUpdate('enableOptIn', e.target.checked)}
                    className="rounded border-gray-300 dark:border-gray-600 text-green-600 focus:ring-green-500 dark:focus:ring-green-400"
                  />
                  <span className="text-sm font-medium text-gray-900 dark:text-white">Marketing Consent Opt-in</span>
                </label>
                {node.data.enableOptIn && (
                  <select
                    value={node.data.optInType || 'email'}
                    onChange={(e) => handleUpdate('optInType', e.target.value)}
                    className="w-full mt-2 p-2 border rounded bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400 focus:border-transparent"
                  >
                    <option value="email">Email Marketing</option>
                    <option value="sms">SMS Marketing</option>
                    <option value="whatsapp">WhatsApp Marketing</option>
                  </select>
                )}
              </div>

              {/* Info Box */}
              <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded border border-blue-200 dark:border-blue-700">
                <p className="text-xs text-blue-800 dark:text-blue-300">
                  💡 This block will wait for user input, validate it based on the reply type, and save it to the specified field. Special commands like "stop" or "unsubscribe" will cancel the collection.
                </p>
              </div>
            </>
          )}

          {node.data.actionType === 'delay' && (
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-white">Delay Duration</label>
              <div className="flex gap-2">
                <input
                  type="number"
                  value={node.data.delayAmount || 1}
                  onChange={(e) => handleUpdate('delayAmount', e.target.value)}
                  min="1"
                  className="w-20 p-2 border rounded bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400 focus:border-transparent"
                />
                <select
                  value={node.data.delayUnit || 'minutes'}
                  onChange={(e) => handleUpdate('delayUnit', e.target.value)}
                  className="flex-1 p-2 border rounded bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400 focus:border-transparent"
                >
                  <option value="seconds">Seconds</option>
                  <option value="minutes">Minutes</option>
                  <option value="hours">Hours</option>
                  <option value="days">Days</option>
                </select>
              </div>
            </div>
          )}
        </>
      )
    }

    // AI NODE CONFIG
    if (node.type === 'ai') {
      return (
        <>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-white">System Prompt</label>
            <textarea
              value={node.data.prompt || ''}
              onChange={(e) => handleUpdate('prompt', e.target.value)}
              placeholder="You are a helpful assistant for my business. You should respond in a friendly, professional tone..."
              rows={5}
              className="w-full p-2 border rounded bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-violet-500 dark:focus:ring-violet-400 focus:border-transparent"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-white">Temperature</label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={node.data.temperature || 0.7}
              onChange={(e) => handleUpdate('temperature', parseFloat(e.target.value))}
              className="w-full accent-violet-600 dark:accent-violet-400"
            />
            <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
              <span>Precise</span>
              <span>{node.data.temperature || 0.7}</span>
              <span>Creative</span>
            </div>
          </div>

          <div className="mb-4">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={node.data.useContext || true}
                onChange={(e) => handleUpdate('useContext', e.target.checked)}
                className="rounded border-gray-300 dark:border-gray-600 text-violet-600 focus:ring-violet-500 dark:focus:ring-violet-400 dark:bg-gray-700"
              />
              <span className="text-sm text-gray-900 dark:text-white">Use conversation history as context</span>
            </label>
          </div>

          <div className="mb-4">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={node.data.useBrandVoice || false}
                onChange={(e) => handleUpdate('useBrandVoice', e.target.checked)}
                className="rounded border-gray-300 dark:border-gray-600 text-violet-600 focus:ring-violet-500 dark:focus:ring-violet-400 dark:bg-gray-700"
              />
              <span className="text-sm text-gray-900 dark:text-white">Use account's trained brand voice</span>
            </label>
          </div>

          {node.data.aiType === 'ai_fallback' && (
            <div className="p-3 bg-violet-50 dark:bg-violet-900/20 rounded border border-violet-200 dark:border-violet-700">
              <p className="text-sm text-violet-800 dark:text-violet-300">
                This AI will respond when no other triggers match the user's message.
              </p>
            </div>
          )}

          {node.data.aiType === 'ai_decision' && (
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-white">Decision Criteria</label>
              <textarea
                value={node.data.decisionCriteria || ''}
                onChange={(e) => handleUpdate('decisionCriteria', e.target.value)}
                placeholder="Route 1: If user is asking about pricing&#10;Route 2: If user needs support"
                rows={3}
                className="w-full p-2 border rounded bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-violet-500 dark:focus:ring-violet-400 focus:border-transparent"
              />
            </div>
          )}
        </>
      )
    }

    // MEDIA NODE CONFIG
    if (node.type === 'media') {
      return (
        <>
          {node.data.mediaType === 'send_message' && (
            <TextMessageNodeConfig node={node} onUpdate={onUpdate} />
          )}

          {node.data.mediaType === 'send_image' && (
            <>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-white">Image URL</label>
                <input
                  type="text"
                  value={node.data.imageUrl || ''}
                  onChange={(e) => handleUpdate('imageUrl', e.target.value)}
                  placeholder="https://example.com/image.jpg or /path/to/image.jpg"
                  className="w-full p-2 border rounded bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-orange-500 dark:focus:ring-orange-400 focus:border-transparent"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-white">Caption (Optional)</label>
                <textarea
                  value={node.data.caption || ''}
                  onChange={(e) => handleUpdate('caption', e.target.value)}
                  placeholder="Add a caption for the image..."
                  rows={2}
                  className="w-full p-2 border rounded bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-orange-500 dark:focus:ring-orange-400 focus:border-transparent"
                />
              </div>
            </>
          )}

          {node.data.mediaType === 'send_video' && (
            <>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-white">Video</label>

                {/* Mode Toggle: Upload vs Record */}
                {!node.data.videoUrl && (
                  <div className="flex gap-2 mb-3">
                    <button
                      onClick={() => handleUpdate('videoInputMode', 'upload')}
                      className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2 ${
                        (node.data.videoInputMode || 'upload') === 'upload'
                          ? 'bg-orange-500 text-white'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                      }`}
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                      Upload
                    </button>
                    <button
                      onClick={() => handleUpdate('videoInputMode', 'record')}
                      className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2 ${
                        node.data.videoInputMode === 'record'
                          ? 'bg-red-500 text-white'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                      }`}
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <circle cx="12" cy="12" r="6" />
                      </svg>
                      Record
                    </button>
                  </div>
                )}

                {/* Upload Area */}
                {!node.data.videoUrl && (node.data.videoInputMode || 'upload') === 'upload' && (
                  <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-orange-300 dark:border-orange-700 rounded-lg cursor-pointer bg-orange-50 dark:bg-orange-900/20 hover:bg-orange-100 dark:hover:bg-orange-900/30 transition-colors">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <svg className="w-8 h-8 mb-2 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                      <p className="text-sm text-orange-600 dark:text-orange-400 font-medium">Click to upload video</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">MP4, MOV (max {videoLimit.maxSize}MB)</p>
                    </div>
                    <input
                      type="file"
                      accept="video/mp4,video/quicktime,video/x-msvideo,.mp4,.mov,.avi"
                      className="hidden"
                      onChange={async (e) => {
                        const file = e.target.files?.[0]
                        if (!file) return

                        // Check file size
                        const fileSizeMB = file.size / (1024 * 1024)
                        if (fileSizeMB > videoLimit.maxSize) {
                          alert(`Video is too large (${fileSizeMB.toFixed(1)}MB). Maximum for ${videoLimit.label} is ${videoLimit.maxSize}MB.`)
                          return
                        }

                        // Create local preview URL
                        const localUrl = URL.createObjectURL(file)
                        handleUpdate('videoUrl', localUrl)
                        handleUpdate('videoFileName', file.name)
                        handleUpdate('videoFileSize', fileSizeMB.toFixed(1))
                        handleUpdate('videoSource', 'upload')
                      }}
                    />
                  </label>
                )}

                {/* Record Area */}
                {!node.data.videoUrl && node.data.videoInputMode === 'record' && (
                  <div className="border-2 border-red-300 dark:border-red-700 rounded-lg overflow-hidden bg-black">
                    <div className="relative">
                      {/* Camera Preview / Recording */}
                      <video
                        id={`video-preview-${node.id}`}
                        className="w-full h-40 object-cover"
                        autoPlay
                        muted
                        playsInline
                      />

                      {/* Recording indicator */}
                      {node.data.isRecording && (
                        <div className="absolute top-2 left-2 flex items-center gap-2 bg-red-500 text-white text-xs px-2 py-1 rounded">
                          <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
                          REC
                        </div>
                      )}
                    </div>

                    {/* Record Controls */}
                    <div className="p-3 bg-gray-900 flex items-center justify-center gap-3">
                      {!node.data.isRecording ? (
                        <button
                          onClick={async () => {
                            try {
                              const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true })
                              const videoEl = document.getElementById(`video-preview-${node.id}`)
                              if (videoEl) videoEl.srcObject = stream

                              const mediaRecorder = new MediaRecorder(stream, { mimeType: 'video/webm' })
                              const chunks = []

                              mediaRecorder.ondataavailable = (e) => chunks.push(e.data)
                              mediaRecorder.onstop = () => {
                                const blob = new Blob(chunks, { type: 'video/webm' })
                                const url = URL.createObjectURL(blob)
                                const fileSizeMB = blob.size / (1024 * 1024)

                                handleUpdate('videoUrl', url)
                                handleUpdate('videoFileName', 'recorded-video.webm')
                                handleUpdate('videoFileSize', fileSizeMB.toFixed(1))
                                handleUpdate('videoSource', 'recorded')
                                handleUpdate('isRecording', false)

                                stream.getTracks().forEach(track => track.stop())
                              }

                              mediaRecorder.start()
                              handleUpdate('isRecording', true)
                              window[`mediaRecorder_${node.id}`] = mediaRecorder
                              window[`stream_${node.id}`] = stream
                            } catch (err) {
                              alert('Could not access camera. Please allow camera permissions.')
                            }
                          }}
                          className="w-14 h-14 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center transition-colors"
                        >
                          <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                            <circle cx="12" cy="12" r="6" />
                          </svg>
                        </button>
                      ) : (
                        <button
                          onClick={() => {
                            const mediaRecorder = window[`mediaRecorder_${node.id}`]
                            if (mediaRecorder) {
                              mediaRecorder.stop()
                            }
                          }}
                          className="w-14 h-14 bg-gray-700 hover:bg-gray-600 rounded-full flex items-center justify-center transition-colors"
                        >
                          <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                            <rect x="6" y="6" width="12" height="12" rx="2" />
                          </svg>
                        </button>
                      )}
                    </div>

                    <p className="text-xs text-gray-400 text-center py-2 bg-gray-900">
                      {node.data.isRecording ? 'Recording... Click stop when done' : 'Click the red button to start recording'}
                    </p>
                  </div>
                )}

                {/* Video Preview with Remove Option */}
                {node.data.videoUrl && (
                  <div className="relative rounded-lg overflow-hidden bg-black">
                    <video
                      src={node.data.videoUrl}
                      className="w-full h-40 object-contain"
                      controls
                      preload="metadata"
                    />
                    {/* File info overlay */}
                    <div className="absolute top-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded flex items-center gap-1">
                      {node.data.videoSource === 'recorded' && (
                        <svg className="w-3 h-3 text-red-400" fill="currentColor" viewBox="0 0 24 24">
                          <circle cx="12" cy="12" r="6" />
                        </svg>
                      )}
                      {node.data.videoFileName || 'video.mp4'} • {node.data.videoFileSize || '?'}MB
                    </div>
                    {/* Remove button */}
                    <button
                      onClick={() => {
                        handleUpdate('videoUrl', '')
                        handleUpdate('videoFileName', '')
                        handleUpdate('videoFileSize', '')
                        handleUpdate('videoSource', '')
                        handleUpdate('videoInputMode', 'upload')
                      }}
                      className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white p-1.5 rounded-full transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                )}

                {/* Channel-specific size limits */}
                <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-lg">📱</span>
                    <p className="text-xs font-semibold text-blue-800 dark:text-blue-300">
                      {videoLimit.label} Limits
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="bg-blue-100 dark:bg-blue-800/30 rounded p-2">
                      <p className="text-blue-600 dark:text-blue-400 font-medium">Max Size</p>
                      <p className="text-blue-900 dark:text-blue-200 font-bold">{videoLimit.maxSize >= 1000 ? `${videoLimit.maxSize / 1000}GB` : `${videoLimit.maxSize}MB`}</p>
                    </div>
                    <div className="bg-blue-100 dark:bg-blue-800/30 rounded p-2">
                      <p className="text-blue-600 dark:text-blue-400 font-medium">Max Duration</p>
                      <p className="text-blue-900 dark:text-blue-200 font-bold">{videoLimit.maxDuration ? `${videoLimit.maxDuration}s` : 'No limit'}</p>
                    </div>
                  </div>
                </div>

                {/* Video format guidelines */}
                <div className="mt-3 p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 rounded-lg">
                  <p className="text-xs font-medium text-amber-800 dark:text-amber-300 mb-2">Supported Formats:</p>
                  <div className="flex flex-wrap gap-2 text-xs">
                    <span className="bg-green-100 dark:bg-green-800/50 text-green-700 dark:text-green-300 px-2 py-0.5 rounded">MP4</span>
                    <span className="bg-green-100 dark:bg-green-800/50 text-green-700 dark:text-green-300 px-2 py-0.5 rounded">MOV</span>
                    <span className="bg-green-100 dark:bg-green-800/50 text-green-700 dark:text-green-300 px-2 py-0.5 rounded">AVI</span>
                  </div>
                  <p className="text-xs text-amber-600 dark:text-amber-500 mt-2">
                    Recommended: 720p-1080p, 30 FPS, H.264 codec
                  </p>
                </div>

                {/* Cross-platform tip */}
                {channelType !== 'telegram' && (
                  <div className="mt-3 p-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      💡 Keep under <strong>15MB</strong> & <strong>60s</strong> to work on all channels.
                    </p>
                  </div>
                )}
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-white">Caption (Optional)</label>
                <textarea
                  value={node.data.caption || ''}
                  onChange={(e) => handleUpdate('caption', e.target.value)}
                  placeholder="Add a caption for the video..."
                  rows={2}
                  className="w-full p-2 border rounded bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-orange-500 dark:focus:ring-orange-400 focus:border-transparent"
                />
              </div>
            </>
          )}

          {node.data.mediaType === 'send_voice' && (
            <>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-white">Voice Note</label>

                {/* Mode Toggle: Upload vs Record */}
                {!node.data.voiceUrl && (
                  <div className="flex gap-2 mb-3">
                    <button
                      onClick={() => handleUpdate('voiceInputMode', 'upload')}
                      className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2 ${
                        (node.data.voiceInputMode || 'upload') === 'upload'
                          ? 'bg-orange-500 text-white'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                      }`}
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                      Upload
                    </button>
                    <button
                      onClick={() => handleUpdate('voiceInputMode', 'record')}
                      className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2 ${
                        node.data.voiceInputMode === 'record'
                          ? 'bg-red-500 text-white'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                      }`}
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <circle cx="12" cy="12" r="6" />
                      </svg>
                      Record
                    </button>
                  </div>
                )}

                {/* Upload Area */}
                {!node.data.voiceUrl && (node.data.voiceInputMode || 'upload') === 'upload' && (
                  <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-orange-300 dark:border-orange-700 rounded-lg cursor-pointer bg-orange-50 dark:bg-orange-900/20 hover:bg-orange-100 dark:hover:bg-orange-900/30 transition-colors">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <svg className="w-8 h-8 mb-2 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                      </svg>
                      <p className="text-sm text-orange-600 dark:text-orange-400 font-medium">Click to upload audio</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">MP3, M4A, OGG, WAV (max {audioLimit.maxSize}MB)</p>
                    </div>
                    <input
                      type="file"
                      accept="audio/mpeg,audio/mp4,audio/ogg,audio/wav,audio/x-m4a,.mp3,.m4a,.ogg,.wav"
                      className="hidden"
                      onChange={async (e) => {
                        const file = e.target.files?.[0]
                        if (!file) return

                        // Check file size
                        const fileSizeMB = file.size / (1024 * 1024)
                        if (fileSizeMB > audioLimit.maxSize) {
                          alert(`Audio is too large (${fileSizeMB.toFixed(1)}MB). Maximum for ${audioLimit.label} is ${audioLimit.maxSize}MB.`)
                          return
                        }

                        // Create local preview URL
                        const localUrl = URL.createObjectURL(file)

                        // Get audio duration
                        const audio = new Audio(localUrl)
                        audio.addEventListener('loadedmetadata', () => {
                          const duration = audio.duration
                          const minutes = Math.floor(duration / 60)
                          const seconds = Math.floor(duration % 60)
                          const formattedDuration = `${minutes}:${seconds.toString().padStart(2, '0')}`

                          handleUpdate('voiceUrl', localUrl)
                          handleUpdate('voiceFileName', file.name)
                          handleUpdate('voiceFileSize', fileSizeMB.toFixed(1))
                          handleUpdate('duration', formattedDuration)
                          handleUpdate('durationSeconds', Math.floor(duration))
                          handleUpdate('voiceSource', 'upload')
                        })
                      }}
                    />
                  </label>
                )}

                {/* Record Area */}
                {!node.data.voiceUrl && node.data.voiceInputMode === 'record' && (
                  <div className="border-2 border-red-300 dark:border-red-700 rounded-lg overflow-hidden bg-gray-900">
                    {/* Microphone visualization */}
                    <div className="relative h-32 flex items-center justify-center">
                      {/* Animated rings when recording */}
                      {node.data.isRecordingVoice && (
                        <>
                          <div className="absolute w-24 h-24 rounded-full bg-red-500/20 animate-ping" />
                          <div className="absolute w-20 h-20 rounded-full bg-red-500/30 animate-pulse" />
                        </>
                      )}
                      {/* Microphone icon */}
                      <div className={`relative w-16 h-16 rounded-full flex items-center justify-center ${node.data.isRecordingVoice ? 'bg-red-500' : 'bg-gray-700'}`}>
                        <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                        </svg>
                      </div>
                      {/* Recording indicator */}
                      {node.data.isRecordingVoice && (
                        <div className="absolute top-2 left-2 flex items-center gap-2 bg-red-500 text-white text-xs px-2 py-1 rounded">
                          <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
                          REC
                        </div>
                      )}
                      {/* Recording timer */}
                      {node.data.isRecordingVoice && (
                        <div className="absolute bottom-2 text-white text-sm font-mono">
                          {node.data.recordingTime || '0:00'}
                        </div>
                      )}
                    </div>

                    {/* Record Controls */}
                    <div className="p-3 bg-gray-800 flex items-center justify-center gap-3">
                      {!node.data.isRecordingVoice ? (
                        <button
                          onClick={async () => {
                            try {
                              const stream = await navigator.mediaDevices.getUserMedia({ audio: true })

                              const mediaRecorder = new MediaRecorder(stream, { mimeType: 'audio/webm' })
                              const chunks = []
                              let startTime = Date.now()

                              // Timer update interval
                              const timerInterval = setInterval(() => {
                                const elapsed = Math.floor((Date.now() - startTime) / 1000)
                                const minutes = Math.floor(elapsed / 60)
                                const seconds = elapsed % 60
                                handleUpdate('recordingTime', `${minutes}:${seconds.toString().padStart(2, '0')}`)
                              }, 1000)

                              mediaRecorder.ondataavailable = (e) => chunks.push(e.data)
                              mediaRecorder.onstop = () => {
                                clearInterval(timerInterval)
                                const blob = new Blob(chunks, { type: 'audio/webm' })
                                const url = URL.createObjectURL(blob)
                                const fileSizeMB = blob.size / (1024 * 1024)
                                const elapsed = Math.floor((Date.now() - startTime) / 1000)
                                const minutes = Math.floor(elapsed / 60)
                                const seconds = elapsed % 60

                                handleUpdate('voiceUrl', url)
                                handleUpdate('voiceFileName', 'recorded-voice.webm')
                                handleUpdate('voiceFileSize', fileSizeMB.toFixed(1))
                                handleUpdate('duration', `${minutes}:${seconds.toString().padStart(2, '0')}`)
                                handleUpdate('durationSeconds', elapsed)
                                handleUpdate('voiceSource', 'recorded')
                                handleUpdate('isRecordingVoice', false)
                                handleUpdate('recordingTime', '')

                                stream.getTracks().forEach(track => track.stop())
                              }

                              mediaRecorder.start()
                              handleUpdate('isRecordingVoice', true)
                              handleUpdate('recordingTime', '0:00')
                              window[`voiceRecorder_${node.id}`] = mediaRecorder
                              window[`voiceStream_${node.id}`] = stream
                            } catch (err) {
                              alert('Could not access microphone. Please allow microphone permissions.')
                            }
                          }}
                          className="w-14 h-14 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center transition-colors"
                        >
                          <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                            <circle cx="12" cy="12" r="6" />
                          </svg>
                        </button>
                      ) : (
                        <button
                          onClick={() => {
                            const mediaRecorder = window[`voiceRecorder_${node.id}`]
                            if (mediaRecorder) {
                              mediaRecorder.stop()
                            }
                          }}
                          className="w-14 h-14 bg-gray-700 hover:bg-gray-600 rounded-full flex items-center justify-center transition-colors"
                        >
                          <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                            <rect x="6" y="6" width="12" height="12" rx="2" />
                          </svg>
                        </button>
                      )}
                    </div>

                    <p className="text-xs text-gray-400 text-center py-2 bg-gray-800">
                      {node.data.isRecordingVoice ? 'Recording... Click stop when done' : 'Click the red button to start recording'}
                    </p>
                  </div>
                )}

                {/* Audio Preview with Remove Option */}
                {node.data.voiceUrl && (
                  <div className="relative rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800 p-4">
                    {/* Audio info */}
                    <div className="flex items-center gap-3 mb-3">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center ${node.data.voiceSource === 'recorded' ? 'bg-red-500' : 'bg-orange-500'}`}>
                        <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900 dark:text-white truncate flex items-center gap-2">
                          {node.data.voiceSource === 'recorded' && (
                            <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                          )}
                          {node.data.voiceFileName || 'audio.mp3'}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {node.data.voiceFileSize || '?'}MB • {node.data.duration || '0:00'}
                        </p>
                      </div>
                      {/* Remove button */}
                      <button
                        onClick={() => {
                          handleUpdate('voiceUrl', '')
                          handleUpdate('voiceFileName', '')
                          handleUpdate('voiceFileSize', '')
                          handleUpdate('duration', '')
                          handleUpdate('durationSeconds', '')
                          handleUpdate('voiceSource', '')
                          handleUpdate('voiceInputMode', 'upload')
                        }}
                        className="bg-red-500 hover:bg-red-600 text-white p-1.5 rounded-full transition-colors"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>

                    {/* Audio player */}
                    <audio
                      src={node.data.voiceUrl}
                      controls
                      className="w-full h-10"
                      preload="metadata"
                    />
                  </div>
                )}

                {/* Channel-specific size limits */}
                <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-lg">🎤</span>
                    <p className="text-xs font-semibold text-blue-800 dark:text-blue-300">
                      {audioLimit.label} Limits
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="bg-blue-100 dark:bg-blue-800/30 rounded p-2">
                      <p className="text-blue-600 dark:text-blue-400 font-medium">Max Size</p>
                      <p className="text-blue-900 dark:text-blue-200 font-bold">{audioLimit.maxSize >= 1000 ? `${audioLimit.maxSize / 1000}GB` : `${audioLimit.maxSize}MB`}</p>
                    </div>
                    <div className="bg-blue-100 dark:bg-blue-800/30 rounded p-2">
                      <p className="text-blue-600 dark:text-blue-400 font-medium">Max Duration</p>
                      <p className="text-blue-900 dark:text-blue-200 font-bold">{audioLimit.maxDuration ? `${audioLimit.maxDuration}s` : 'No limit'}</p>
                    </div>
                  </div>
                </div>

                {/* Audio format guidelines */}
                <div className="mt-3 p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 rounded-lg">
                  <p className="text-xs font-medium text-amber-800 dark:text-amber-300 mb-2">Supported Formats:</p>
                  <div className="flex flex-wrap gap-2 text-xs">
                    <span className="bg-green-100 dark:bg-green-800/50 text-green-700 dark:text-green-300 px-2 py-0.5 rounded">MP3</span>
                    <span className="bg-green-100 dark:bg-green-800/50 text-green-700 dark:text-green-300 px-2 py-0.5 rounded">M4A</span>
                    <span className="bg-green-100 dark:bg-green-800/50 text-green-700 dark:text-green-300 px-2 py-0.5 rounded">OGG</span>
                    <span className="bg-green-100 dark:bg-green-800/50 text-green-700 dark:text-green-300 px-2 py-0.5 rounded">WAV</span>
                  </div>
                  <p className="text-xs text-amber-600 dark:text-amber-500 mt-2">
                    Voice notes are sent as audio messages in chat
                  </p>
                </div>
              </div>
            </>
          )}

          {node.data.mediaType === 'send_file' && (
            <>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-white">File URL</label>
                <input
                  type="text"
                  value={node.data.fileUrl || ''}
                  onChange={(e) => handleUpdate('fileUrl', e.target.value)}
                  placeholder="https://example.com/document.pdf or /path/to/file.pdf"
                  className="w-full p-2 border rounded bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-orange-500 dark:focus:ring-orange-400 focus:border-transparent"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-white">File Name</label>
                <input
                  type="text"
                  value={node.data.fileName || ''}
                  onChange={(e) => handleUpdate('fileName', e.target.value)}
                  placeholder="e.g., product-catalog.pdf"
                  className="w-full p-2 border rounded bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-orange-500 dark:focus:ring-orange-400 focus:border-transparent"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-white">Caption (Optional)</label>
                <textarea
                  value={node.data.caption || ''}
                  onChange={(e) => handleUpdate('caption', e.target.value)}
                  placeholder="Add a caption for the file..."
                  rows={2}
                  className="w-full p-2 border rounded bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-orange-500 dark:focus:ring-orange-400 focus:border-transparent"
                />
              </div>
            </>
          )}

          {node.data.mediaType === 'send_carousel' && (
            <>
              {/* Carousel Preview - Scrollable */}
              <div className="mb-6">
                <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-white">Preview</label>
                <div className="bg-gray-100 dark:bg-gray-900 rounded-lg p-4">
                  <div className="flex gap-3 overflow-x-auto pb-2">
                    {(!node.data.carouselCards || node.data.carouselCards.length === 0) ? (
                      <div className="flex-shrink-0 w-[200px] h-[180px] border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl flex flex-col items-center justify-center">
                        <span className="text-3xl mb-2">🎠</span>
                        <span className="text-xs text-gray-400">No cards yet</span>
                      </div>
                    ) : (
                      node.data.carouselCards.map((card, idx) => (
                        <div
                          key={card.id}
                          onClick={() => handleUpdate('selectedCarouselCard', idx)}
                          className={`flex-shrink-0 w-[180px] bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg border-2 cursor-pointer transition-all ${
                            node.data.selectedCarouselCard === idx
                              ? 'border-orange-500 scale-[1.02]'
                              : 'border-gray-200 dark:border-gray-700 hover:border-orange-300'
                          }`}
                        >
                          {/* Card Image */}
                          {card.imageUrl ? (
                            <img src={card.imageUrl} alt="" className="w-full h-24 object-cover" />
                          ) : (
                            <div className="w-full h-24 bg-gradient-to-br from-orange-100 to-amber-100 dark:from-orange-900/30 dark:to-amber-900/30 flex items-center justify-center">
                              <svg className="w-8 h-8 text-orange-300 dark:text-orange-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                            </div>
                          )}
                          {/* Card Content */}
                          <div className="p-2">
                            <h4 className="font-bold text-gray-900 dark:text-white text-xs truncate">
                              {card.title || `Card ${idx + 1}`}
                            </h4>
                            <p className="text-[10px] text-gray-600 dark:text-gray-400 mt-0.5 truncate">
                              {card.subtitle || 'No subtitle'}
                            </p>
                          </div>
                          {/* Preview Buttons */}
                          {card.buttons && card.buttons.length > 0 && (
                            <div className="border-t border-gray-200 dark:border-gray-700">
                              {card.buttons.slice(0, 2).map((btn, btnIdx) => (
                                <div
                                  key={btnIdx}
                                  className="px-2 py-1.5 text-center text-[10px] font-medium text-blue-600 dark:text-blue-400 border-b border-gray-100 dark:border-gray-700 last:border-b-0"
                                >
                                  {btn.label || `Button ${btnIdx + 1}`}
                                </div>
                              ))}
                              {card.buttons.length > 2 && (
                                <div className="px-2 py-1 text-center text-[9px] text-gray-400">
                                  +{card.buttons.length - 2} more
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                  {node.data.carouselCards && node.data.carouselCards.length > 0 && (
                    <p className="text-[10px] text-gray-500 dark:text-gray-400 text-center mt-2">
                      ← Scroll to see all cards • Click to edit →
                    </p>
                  )}
                </div>
              </div>

              {/* Card Tabs */}
              <div className="mb-4">
                <div className="flex items-center gap-2 mb-3 overflow-x-auto pb-1">
                  {node.data.carouselCards && node.data.carouselCards.map((card, idx) => (
                    <button
                      key={card.id}
                      onClick={() => handleUpdate('selectedCarouselCard', idx)}
                      className={`flex-shrink-0 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                        node.data.selectedCarouselCard === idx
                          ? 'bg-orange-500 text-white shadow-md'
                          : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                      }`}
                    >
                      Card {idx + 1}
                    </button>
                  ))}
                  {(!node.data.carouselCards || node.data.carouselCards.length < 10) && (
                    <button
                      onClick={() => {
                        const currentCards = node.data.carouselCards || []
                        const newCard = {
                          id: Date.now(),
                          imageUrl: '',
                          title: '',
                          subtitle: '',
                          buttons: []
                        }
                        handleUpdate('carouselCards', [...currentCards, newCard])
                        handleUpdate('selectedCarouselCard', currentCards.length)
                      }}
                      className="flex-shrink-0 px-3 py-1.5 rounded-lg text-xs font-medium bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 hover:bg-orange-200 dark:hover:bg-orange-900/50 transition-all"
                    >
                      + Add Card
                    </button>
                  )}
                </div>

                {/* Card Count */}
                {node.data.carouselCards && node.data.carouselCards.length > 0 && (
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
                    {node.data.carouselCards.length} of 10 cards
                  </p>
                )}
              </div>

              {/* Empty State */}
              {(!node.data.carouselCards || node.data.carouselCards.length === 0) && (
                <div className="text-center py-8 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg mb-4">
                  <div className="text-4xl mb-2">🎠</div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">No cards in carousel</p>
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Add at least 2 cards to create a carousel</p>
                </div>
              )}

              {/* Card Editor - Same layout as send_card */}
              {node.data.carouselCards && node.data.carouselCards.length > 0 && node.data.selectedCarouselCard !== undefined && node.data.carouselCards[node.data.selectedCarouselCard] && (
                <>
                  {/* Card Actions Bar */}
                  <div className="flex items-center justify-between mb-4 p-2 bg-gray-100 dark:bg-gray-700/50 rounded-lg">
                    <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                      Editing Card {(node.data.selectedCarouselCard || 0) + 1}
                    </span>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => {
                          const idx = node.data.selectedCarouselCard
                          if (idx > 0) {
                            const cards = [...node.data.carouselCards]
                            const temp = cards[idx]
                            cards[idx] = cards[idx - 1]
                            cards[idx - 1] = temp
                            handleUpdate('carouselCards', cards)
                            handleUpdate('selectedCarouselCard', idx - 1)
                          }
                        }}
                        disabled={node.data.selectedCarouselCard === 0}
                        className="p-1.5 rounded hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-30"
                        title="Move left"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                      </button>
                      <button
                        onClick={() => {
                          const idx = node.data.selectedCarouselCard
                          if (idx < node.data.carouselCards.length - 1) {
                            const cards = [...node.data.carouselCards]
                            const temp = cards[idx]
                            cards[idx] = cards[idx + 1]
                            cards[idx + 1] = temp
                            handleUpdate('carouselCards', cards)
                            handleUpdate('selectedCarouselCard', idx + 1)
                          }
                        }}
                        disabled={node.data.selectedCarouselCard === node.data.carouselCards.length - 1}
                        className="p-1.5 rounded hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-30"
                        title="Move right"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                      <button
                        onClick={() => {
                          const idx = node.data.selectedCarouselCard
                          const cards = node.data.carouselCards.filter((_, i) => i !== idx)
                          handleUpdate('carouselCards', cards)
                          if (cards.length > 0) {
                            handleUpdate('selectedCarouselCard', Math.max(0, idx - 1))
                          }
                        }}
                        className="p-1.5 rounded hover:bg-red-100 dark:hover:bg-red-900/30 text-red-500"
                        title="Delete card"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>

                  {/* Card Image Upload - Same as send_card */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-white">Card Image</label>
                    {!node.data.carouselCards[node.data.selectedCarouselCard]?.imageUrl ? (
                      <label className="flex flex-col items-center justify-center w-full h-28 border-2 border-dashed border-orange-300 dark:border-orange-700 rounded-lg cursor-pointer bg-orange-50 dark:bg-orange-900/20 hover:bg-orange-100 dark:hover:bg-orange-900/30 transition-colors">
                        <div className="flex flex-col items-center justify-center py-4">
                          <svg className="w-8 h-8 mb-2 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          <p className="text-sm text-orange-600 dark:text-orange-400 font-medium">Upload image</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">JPG, PNG (1.91:1 ratio recommended)</p>
                        </div>
                        <input
                          type="file"
                          accept="image/jpeg,image/png,image/webp"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0]
                            if (!file) return
                            const localUrl = URL.createObjectURL(file)
                            const cards = [...node.data.carouselCards]
                            cards[node.data.selectedCarouselCard].imageUrl = localUrl
                            handleUpdate('carouselCards', cards)
                          }}
                        />
                      </label>
                    ) : (
                      <div className="relative rounded-lg overflow-hidden">
                        <img
                          src={node.data.carouselCards[node.data.selectedCarouselCard].imageUrl}
                          alt=""
                          className="w-full h-28 object-cover"
                        />
                        <button
                          onClick={() => {
                            const cards = [...node.data.carouselCards]
                            cards[node.data.selectedCarouselCard].imageUrl = ''
                            handleUpdate('carouselCards', cards)
                          }}
                          className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white p-1.5 rounded-full transition-colors"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Card Title - Same as send_card */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-white">
                      Title <span className="text-gray-400 font-normal">({(node.data.carouselCards[node.data.selectedCarouselCard]?.title || '').length}/80)</span>
                    </label>
                    <input
                      type="text"
                      value={node.data.carouselCards[node.data.selectedCarouselCard]?.title || ''}
                      onChange={(e) => {
                        if (e.target.value.length <= 80) {
                          const cards = [...node.data.carouselCards]
                          cards[node.data.selectedCarouselCard].title = e.target.value
                          handleUpdate('carouselCards', cards)
                        }
                      }}
                      placeholder="e.g., Check out our new product!"
                      className="w-full p-2 border rounded bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-orange-500 dark:focus:ring-orange-400 focus:border-transparent"
                    />
                  </div>

                  {/* Card Subtitle - Same as send_card */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-white">
                      Subtitle <span className="text-gray-400 font-normal">({(node.data.carouselCards[node.data.selectedCarouselCard]?.subtitle || '').length}/80)</span>
                    </label>
                    <textarea
                      value={node.data.carouselCards[node.data.selectedCarouselCard]?.subtitle || ''}
                      onChange={(e) => {
                        if (e.target.value.length <= 80) {
                          const cards = [...node.data.carouselCards]
                          cards[node.data.selectedCarouselCard].subtitle = e.target.value
                          handleUpdate('carouselCards', cards)
                        }
                      }}
                      placeholder="Add a short description..."
                      rows={2}
                      className="w-full p-2 border rounded bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-orange-500 dark:focus:ring-orange-400 focus:border-transparent resize-none"
                    />
                  </div>

                  {/* Card Buttons - Same as send_card */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <label className="block text-sm font-medium text-gray-900 dark:text-white">
                        Buttons <span className="text-gray-400 font-normal">(max 3)</span>
                      </label>
                      {(!node.data.carouselCards[node.data.selectedCarouselCard]?.buttons ||
                        node.data.carouselCards[node.data.selectedCarouselCard].buttons.length < 3) && (
                        <button
                          onClick={() => {
                            const cards = [...node.data.carouselCards]
                            const cardButtons = cards[node.data.selectedCarouselCard].buttons || []
                            cards[node.data.selectedCarouselCard].buttons = [
                              ...cardButtons,
                              { id: Date.now(), label: '', actionType: 'openUrl', actionValue: '' }
                            ]
                            handleUpdate('carouselCards', cards)
                          }}
                          className="text-xs px-3 py-1 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors font-medium"
                        >
                          + Add Button
                        </button>
                      )}
                    </div>

                    {(!node.data.carouselCards[node.data.selectedCarouselCard]?.buttons ||
                      node.data.carouselCards[node.data.selectedCarouselCard].buttons.length === 0) ? (
                      <div className="text-center py-6 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg">
                        <div className="text-3xl mb-2">🔘</div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">No buttons yet</p>
                        <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Add buttons to make your card interactive</p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {node.data.carouselCards[node.data.selectedCarouselCard].buttons.map((button, index) => (
                          <div key={button.id} className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-xs font-semibold text-gray-600 dark:text-gray-300 flex items-center gap-2">
                                <span className="w-5 h-5 rounded-full bg-orange-500 text-white flex items-center justify-center text-xs">
                                  {index + 1}
                                </span>
                                Button {index + 1}
                              </span>
                              <button
                                onClick={() => {
                                  const cards = [...node.data.carouselCards]
                                  cards[node.data.selectedCarouselCard].buttons = cards[node.data.selectedCarouselCard].buttons.filter((_, i) => i !== index)
                                  handleUpdate('carouselCards', cards)
                                }}
                                className="text-red-500 hover:text-red-700 text-xs font-medium"
                              >
                                Remove
                              </button>
                            </div>

                            {/* Button Label */}
                            <input
                              type="text"
                              value={button.label}
                              onChange={(e) => {
                                if (e.target.value.length <= 20) {
                                  const cards = [...node.data.carouselCards]
                                  cards[node.data.selectedCarouselCard].buttons[index].label = e.target.value
                                  handleUpdate('carouselCards', cards)
                                }
                              }}
                              placeholder="Button label (max 20 chars)"
                              className="w-full p-2 mb-2 border rounded bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 text-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                            />

                            {/* Action Type */}
                            <select
                              value={button.actionType}
                              onChange={(e) => {
                                const cards = [...node.data.carouselCards]
                                cards[node.data.selectedCarouselCard].buttons[index].actionType = e.target.value
                                cards[node.data.selectedCarouselCard].buttons[index].actionValue = ''
                                handleUpdate('carouselCards', cards)
                              }}
                              className="w-full p-2 mb-2 border rounded bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                            >
                              <option value="openUrl">Open URL</option>
                              <option value="goToNode">Go to Next Step</option>
                              <option value="triggerFlow">Trigger Flow</option>
                              <option value="callPhone">Call Phone Number</option>
                            </select>

                            {/* Action Value */}
                            {button.actionType === 'openUrl' && (
                              <input
                                type="url"
                                value={button.actionValue}
                                onChange={(e) => {
                                  const cards = [...node.data.carouselCards]
                                  cards[node.data.selectedCarouselCard].buttons[index].actionValue = e.target.value
                                  handleUpdate('carouselCards', cards)
                                }}
                                placeholder="https://example.com"
                                className="w-full p-2 border rounded bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 text-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                              />
                            )}

                            {button.actionType === 'callPhone' && (
                              <input
                                type="tel"
                                value={button.actionValue}
                                onChange={(e) => {
                                  const cards = [...node.data.carouselCards]
                                  cards[node.data.selectedCarouselCard].buttons[index].actionValue = e.target.value
                                  handleUpdate('carouselCards', cards)
                                }}
                                placeholder="+1 234 567 8900"
                                className="w-full p-2 border rounded bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 text-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                              />
                            )}

                            {button.actionType === 'goToNode' && (
                              <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-md border border-blue-200 dark:border-blue-700">
                                <div className="flex items-center gap-2">
                                  <span className="text-blue-500">●→</span>
                                  <p className="text-xs text-blue-700 dark:text-blue-300">
                                    Drag from the button's handle on the canvas to connect
                                  </p>
                                </div>
                              </div>
                            )}

                            {button.actionType === 'triggerFlow' && (
                              <input
                                type="text"
                                value={button.actionValue}
                                onChange={(e) => {
                                  const cards = [...node.data.carouselCards]
                                  cards[node.data.selectedCarouselCard].buttons[index].actionValue = e.target.value
                                  handleUpdate('carouselCards', cards)
                                }}
                                placeholder="Flow name"
                                className="w-full p-2 border rounded bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 text-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                              />
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </>
              )}

              {/* Validation Warning */}
              {node.data.carouselCards && node.data.carouselCards.length === 1 && (
                <div className="mb-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-lg">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">⚠️</span>
                    <p className="text-xs text-yellow-800 dark:text-yellow-300">
                      Carousels need at least 2 cards. Add one more card!
                    </p>
                  </div>
                </div>
              )}

              {/* Platform Info */}
              <div className="p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-lg">📱</span>
                  <p className="text-xs font-semibold text-blue-800 dark:text-blue-300">Platform Support</p>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-green-500"></span>
                    <span className="text-gray-600 dark:text-gray-400">Messenger (10 cards)</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-green-500"></span>
                    <span className="text-gray-600 dark:text-gray-400">Instagram (10 cards)</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-yellow-500"></span>
                    <span className="text-gray-600 dark:text-gray-400">WhatsApp (limited)</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-green-500"></span>
                    <span className="text-gray-600 dark:text-gray-400">Telegram (10 cards)</span>
                  </div>
                </div>
              </div>

              {/* Tips */}
              <div className="mt-3 p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 rounded-lg">
                <p className="text-xs font-medium text-amber-800 dark:text-amber-300 mb-1">Tips:</p>
                <ul className="text-xs text-amber-700 dark:text-amber-400 space-y-1">
                  <li>• Image ratio: 1.91:1 works best (e.g., 1200x628)</li>
                  <li>• First card is most visible - make it count!</li>
                  <li>• Keep 2-5 cards for best engagement</li>
                </ul>
              </div>
            </>
          )}

          {node.data.mediaType === 'send_card' && (
            <>
              {/* Live Preview */}
              <div className="mb-6">
                <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-white">Preview</label>
                <div className="bg-gray-100 dark:bg-gray-900 rounded-lg p-4">
                  <div className="max-w-[280px] mx-auto bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg border border-gray-200 dark:border-gray-700">
                    {/* Card Image */}
                    {node.data.cardImageUrl ? (
                      <img
                        src={node.data.cardImageUrl}
                        alt="Card preview"
                        className="w-full h-36 object-cover"
                      />
                    ) : (
                      <div className="w-full h-36 bg-gradient-to-br from-orange-100 to-amber-100 dark:from-orange-900/30 dark:to-amber-900/30 flex items-center justify-center">
                        <svg className="w-12 h-12 text-orange-300 dark:text-orange-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                    )}
                    {/* Card Content */}
                    <div className="p-3">
                      <h4 className="font-bold text-gray-900 dark:text-white text-sm truncate">
                        {node.data.cardTitle || 'Card Title'}
                      </h4>
                      <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
                        {node.data.cardSubtitle || 'Add a subtitle or description for your card'}
                      </p>
                    </div>
                    {/* Preview Buttons */}
                    {node.data.cardButtons && node.data.cardButtons.length > 0 && (
                      <div className="border-t border-gray-200 dark:border-gray-700">
                        {node.data.cardButtons.map((btn, idx) => (
                          <div
                            key={idx}
                            className="px-3 py-2 text-center text-xs font-medium text-blue-600 dark:text-blue-400 border-b border-gray-200 dark:border-gray-700 last:border-b-0 hover:bg-gray-50 dark:hover:bg-gray-700/50"
                          >
                            {btn.label || `Button ${idx + 1}`}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Card Image Upload */}
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-white">Card Image</label>
                {!node.data.cardImageUrl ? (
                  <label className="flex flex-col items-center justify-center w-full h-28 border-2 border-dashed border-orange-300 dark:border-orange-700 rounded-lg cursor-pointer bg-orange-50 dark:bg-orange-900/20 hover:bg-orange-100 dark:hover:bg-orange-900/30 transition-colors">
                    <div className="flex flex-col items-center justify-center py-4">
                      <svg className="w-8 h-8 mb-2 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <p className="text-sm text-orange-600 dark:text-orange-400 font-medium">Upload image</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">JPG, PNG (1.91:1 ratio recommended)</p>
                    </div>
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp,.jpg,.jpeg,.png,.webp"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0]
                        if (!file) return
                        const fileSizeMB = file.size / (1024 * 1024)
                        if (fileSizeMB > 8) {
                          alert('Image is too large. Maximum size is 8MB.')
                          return
                        }
                        const localUrl = URL.createObjectURL(file)
                        handleUpdate('cardImageUrl', localUrl)
                        handleUpdate('cardImageFileName', file.name)
                      }}
                    />
                  </label>
                ) : (
                  <div className="relative rounded-lg overflow-hidden">
                    <img
                      src={node.data.cardImageUrl}
                      alt="Card"
                      className="w-full h-28 object-cover"
                    />
                    <button
                      onClick={() => {
                        handleUpdate('cardImageUrl', '')
                        handleUpdate('cardImageFileName', '')
                      }}
                      className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white p-1.5 rounded-full transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                    <div className="absolute bottom-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                      {node.data.cardImageFileName || 'image.jpg'}
                    </div>
                  </div>
                )}
              </div>

              {/* Card Title */}
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-white">
                  Title <span className="text-gray-400 font-normal">({(node.data.cardTitle || '').length}/80)</span>
                </label>
                <input
                  type="text"
                  value={node.data.cardTitle || ''}
                  onChange={(e) => {
                    if (e.target.value.length <= 80) {
                      handleUpdate('cardTitle', e.target.value)
                    }
                  }}
                  placeholder="e.g., Check out our new product!"
                  className="w-full p-2 border rounded bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-orange-500 dark:focus:ring-orange-400 focus:border-transparent"
                />
              </div>

              {/* Card Subtitle */}
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-white">
                  Subtitle <span className="text-gray-400 font-normal">({(node.data.cardSubtitle || '').length}/80)</span>
                </label>
                <textarea
                  value={node.data.cardSubtitle || ''}
                  onChange={(e) => {
                    if (e.target.value.length <= 80) {
                      handleUpdate('cardSubtitle', e.target.value)
                    }
                  }}
                  placeholder="Add a short description..."
                  rows={2}
                  className="w-full p-2 border rounded bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-orange-500 dark:focus:ring-orange-400 focus:border-transparent resize-none"
                />
              </div>

              {/* Card Buttons */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-gray-900 dark:text-white">
                    Buttons <span className="text-gray-400 font-normal">(max 3)</span>
                  </label>
                  {(!node.data.cardButtons || node.data.cardButtons.length < 3) && (
                    <button
                      onClick={() => {
                        const currentButtons = node.data.cardButtons || []
                        if (currentButtons.length < 3) {
                          handleUpdate('cardButtons', [
                            ...currentButtons,
                            { id: Date.now(), label: '', actionType: 'openUrl', actionValue: '' }
                          ])
                        }
                      }}
                      className="text-xs px-3 py-1 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors font-medium"
                    >
                      + Add Button
                    </button>
                  )}
                </div>

                {(!node.data.cardButtons || node.data.cardButtons.length === 0) ? (
                  <div className="text-center py-6 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg">
                    <div className="text-3xl mb-2">🔘</div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">No buttons yet</p>
                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Add buttons to make your card interactive</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {node.data.cardButtons.map((button, index) => (
                      <div key={button.id} className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-semibold text-gray-600 dark:text-gray-300 flex items-center gap-2">
                            <span className="w-5 h-5 rounded-full bg-orange-500 text-white flex items-center justify-center text-xs">
                              {index + 1}
                            </span>
                            Button {index + 1}
                          </span>
                          <button
                            onClick={() => {
                              const newButtons = node.data.cardButtons.filter((_, i) => i !== index)
                              handleUpdate('cardButtons', newButtons)
                            }}
                            className="text-red-500 hover:text-red-700 text-xs font-medium"
                          >
                            Remove
                          </button>
                        </div>

                        {/* Button Label */}
                        <input
                          type="text"
                          value={button.label}
                          onChange={(e) => {
                            if (e.target.value.length <= 20) {
                              const newButtons = [...node.data.cardButtons]
                              newButtons[index].label = e.target.value
                              handleUpdate('cardButtons', newButtons)
                            }
                          }}
                          placeholder="Button label (max 20 chars)"
                          className="w-full p-2 mb-2 border rounded bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 text-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        />

                        {/* Action Type */}
                        <select
                          value={button.actionType}
                          onChange={(e) => {
                            const newButtons = [...node.data.cardButtons]
                            newButtons[index].actionType = e.target.value
                            newButtons[index].actionValue = ''
                            handleUpdate('cardButtons', newButtons)
                          }}
                          className="w-full p-2 mb-2 border rounded bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        >
                          <option value="openUrl">Open URL</option>
                          <option value="goToNode">Go to Next Step</option>
                          <option value="triggerFlow">Trigger Flow</option>
                          <option value="callPhone">Call Phone Number</option>
                        </select>

                        {/* Action Value */}
                        {button.actionType === 'openUrl' && (
                          <input
                            type="url"
                            value={button.actionValue}
                            onChange={(e) => {
                              const newButtons = [...node.data.cardButtons]
                              newButtons[index].actionValue = e.target.value
                              handleUpdate('cardButtons', newButtons)
                            }}
                            placeholder="https://example.com"
                            className="w-full p-2 border rounded bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 text-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                          />
                        )}

                        {button.actionType === 'callPhone' && (
                          <input
                            type="tel"
                            value={button.actionValue}
                            onChange={(e) => {
                              const newButtons = [...node.data.cardButtons]
                              newButtons[index].actionValue = e.target.value
                              handleUpdate('cardButtons', newButtons)
                            }}
                            placeholder="+1 234 567 8900"
                            className="w-full p-2 border rounded bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 text-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                          />
                        )}

                        {button.actionType === 'goToNode' && (
                          <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-md border border-blue-200 dark:border-blue-700">
                            <div className="flex items-center gap-2">
                              <span className="text-blue-500">●→</span>
                              <p className="text-xs text-blue-700 dark:text-blue-300">
                                Drag from the button's handle on the canvas to connect
                              </p>
                            </div>
                          </div>
                        )}

                        {button.actionType === 'triggerFlow' && (
                          <input
                            type="text"
                            value={button.actionValue}
                            onChange={(e) => {
                              const newButtons = [...node.data.cardButtons]
                              newButtons[index].actionValue = e.target.value
                              handleUpdate('cardButtons', newButtons)
                            }}
                            placeholder="Flow name"
                            className="w-full p-2 border rounded bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 text-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                          />
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Platform Info */}
              <div className="p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-lg">📱</span>
                  <p className="text-xs font-semibold text-blue-800 dark:text-blue-300">Platform Support</p>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-green-500"></span>
                    <span className="text-gray-600 dark:text-gray-400">Messenger</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-green-500"></span>
                    <span className="text-gray-600 dark:text-gray-400">Instagram</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-yellow-500"></span>
                    <span className="text-gray-600 dark:text-gray-400">WhatsApp (limited)</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-green-500"></span>
                    <span className="text-gray-600 dark:text-gray-400">Telegram</span>
                  </div>
                </div>
              </div>

              {/* Tips */}
              <div className="mt-3 p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 rounded-lg">
                <p className="text-xs font-medium text-amber-800 dark:text-amber-300 mb-1">Tips:</p>
                <ul className="text-xs text-amber-700 dark:text-amber-400 space-y-1">
                  <li>• Image ratio: 1.91:1 works best (e.g., 1200x628)</li>
                  <li>• Keep titles short and compelling</li>
                  <li>• Use action-oriented button labels</li>
                </ul>
              </div>
            </>
          )}
        </>
      )
    }

    return null
  }

  return (
    <>
      {/* Mobile overlay */}
      <div
        className="md:hidden fixed inset-0 bg-black/50 z-[80]"
        onClick={onClose}
      />
      {/* Panel - Full screen on mobile, side panel on desktop */}
      <div className="fixed inset-0 md:relative md:inset-auto md:w-96 h-full bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700 p-4 md:p-6 overflow-y-auto shadow-xl z-[90] md:z-auto safe-area-top safe-area-bottom">
        <div className="flex justify-between items-center mb-4 sticky top-0 bg-white dark:bg-gray-800 pb-4 z-10">
          <h2 className="text-lg md:text-xl font-bold text-gray-900 dark:text-white">{getNodeCategory()}</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 text-2xl touch-target flex items-center justify-center"
          >
            ×
          </button>
        </div>

      <div className="mb-6">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 pb-3 border-b border-gray-200 dark:border-gray-700">
          {node.data.label}
        </h3>
      </div>

      {renderConfig()}

      <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700 space-y-3 mb-6">
        {/* Notification */}
        {notification && (
          <div className={`p-3 rounded-lg border-2 flex items-center gap-2 ${
            notification.type === 'success'
              ? 'bg-green-50 dark:bg-green-900/20 border-green-500 dark:border-green-400'
              : 'bg-red-50 dark:bg-red-900/20 border-red-500 dark:border-red-400'
          }`}>
            <span className="text-xl">
              {notification.type === 'success' ? '✅' : '⚠️'}
            </span>
            <span className={`text-sm font-semibold ${
              notification.type === 'success'
                ? 'text-green-900 dark:text-green-100'
                : 'text-red-900 dark:text-red-100'
            }`}>
              {notification.message}
            </span>
          </div>
        )}

        <button
          onClick={handleSave}
          className="w-full bg-blue-600 hover:bg-blue-700 active:bg-blue-800 dark:bg-blue-700 dark:hover:bg-blue-800 text-white font-semibold py-3 md:py-2 px-4 rounded-lg transition-colors touch-target"
        >
          💾 Save Changes
        </button>
        <button
          onClick={() => onDelete(node.id)}
          className="w-full bg-red-600 hover:bg-red-700 active:bg-red-800 dark:bg-red-700 dark:hover:bg-red-800 text-white font-semibold py-3 md:py-2 px-4 rounded-lg transition-colors touch-target"
        >
          🗑️ Delete Node
        </button>
      </div>

      {/* Post Selector Modal */}
      {showPostSelector && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowPostSelector(false)}>
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-3xl max-h-[80vh] overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">Select Post or Reel</h3>
                <button
                  onClick={() => setShowPostSelector(false)}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 text-2xl"
                >
                  ×
                </button>
              </div>

              {/* Tabs */}
              <div className="flex gap-2 border-b border-gray-200 dark:border-gray-700">
                <button
                  onClick={() => setPostSelectorTab('posts')}
                  className={`px-4 py-2 font-medium text-sm transition-colors ${
                    postSelectorTab === 'posts'
                      ? 'text-purple-600 dark:text-purple-400 border-b-2 border-purple-600 dark:border-purple-400'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                  }`}
                >
                  Posts
                </button>
                <button
                  onClick={() => setPostSelectorTab('reels')}
                  className={`px-4 py-2 font-medium text-sm transition-colors ${
                    postSelectorTab === 'reels'
                      ? 'text-purple-600 dark:text-purple-400 border-b-2 border-purple-600 dark:border-purple-400'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                  }`}
                >
                  Reels
                </button>
              </div>
            </div>
            <div className="p-6 overflow-y-auto max-h-[60vh]">
              <div className="grid gap-4">
                {mockPosts.filter(post => post.type === postSelectorTab.slice(0, -1)).map((post) => (
                  <button
                    key={post.id}
                    onClick={() => {
                      handleUpdate('selectedPost', post)
                      setShowPostSelector(false)
                    }}
                    className="flex gap-4 p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-left border-gray-200 dark:border-gray-600"
                  >
                    <img
                      src={post.image}
                      alt="Post"
                      className="w-24 h-24 rounded-lg object-cover flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs font-semibold px-2 py-1 rounded bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300">
                          {post.platform}
                        </span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">{post.date}</span>
                      </div>
                      <p className="text-sm text-gray-900 dark:text-white line-clamp-2">{post.caption}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* DM Action Selector Modal */}
      {showDmActionSelector && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowDmActionSelector(false)}>
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-2xl max-h-[80vh] overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">Choose DM Action</h3>
                <button
                  onClick={() => setShowDmActionSelector(false)}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 text-2xl"
                >
                  ×
                </button>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Select which action to perform in the DM</p>
            </div>
            <div className="p-6 overflow-y-auto max-h-[60vh]">
              <div className="grid grid-cols-2 gap-4">
                {dmActionOptions.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => handleAddDmAction(option)}
                    className="p-6 border-2 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-center border-gray-200 dark:border-gray-600 hover:border-purple-500 dark:hover:border-purple-500 group"
                  >
                    <div className="text-4xl mb-3">{option.icon}</div>
                    <div className="font-semibold text-gray-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400">
                      {option.label}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
    </>
  )
}
