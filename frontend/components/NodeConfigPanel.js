'use client'

import { useState } from 'react'
import StoryReplyWizard from './StoryReplyWizard'
import TextMessageNodeConfig from './TextMessageNodeConfig'
import InstagramAdsTriggerWizard from './InstagramAdsTriggerWizard'
import InstagramMessageWizard from './InstagramMessageWizard'
import CommentTriggerWizard from './CommentTriggerWizard'

export default function NodeConfigPanel({ node, onUpdate, onDelete, onClose, onAddConnectedNode }) {
  const [showPostSelector, setShowPostSelector] = useState(false)
  const [showDmActionSelector, setShowDmActionSelector] = useState(false)
  const [showStoryWizard, setShowStoryWizard] = useState(true)
  const [showInstagramAdsWizard, setShowInstagramAdsWizard] = useState(true)
  const [showInstagramMessageWizard, setShowInstagramMessageWizard] = useState(true)
  const [showCommentWizard, setShowCommentWizard] = useState(true)
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
    { id: '1', platform: 'instagram', image: 'https://picsum.photos/200/200?random=1', caption: 'Check out our new product launch! 🚀', date: '2 hours ago' },
    { id: '2', platform: 'instagram', image: 'https://picsum.photos/200/200?random=2', caption: 'Behind the scenes of our latest shoot 📸', date: '1 day ago' },
    { id: '3', platform: 'facebook', image: 'https://picsum.photos/200/200?random=3', caption: 'Summer sale is now live! Get 30% off 🌞', date: '2 days ago' },
    { id: '4', platform: 'instagram', image: 'https://picsum.photos/200/200?random=4', caption: 'Customer testimonial: "Best service ever!" ⭐⭐⭐⭐⭐', date: '3 days ago' },
    { id: '5', platform: 'facebook', image: 'https://picsum.photos/200/200?random=5', caption: 'Join us for our webinar next week!', date: '5 days ago' },
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
            <>
              {showInstagramMessageWizard ? (
                <InstagramMessageWizard
                  initialData={node.data}
                  onComplete={(config) => {
                    onUpdate(node.id, config)
                    setShowInstagramMessageWizard(false)
                  }}
                  onClose={() => setShowInstagramMessageWizard(false)}
                />
              ) : (
                <div className="text-center py-8">
                  <div className="mb-6">
                    <div className="text-6xl mb-4">📨</div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                      Instagram Message Trigger
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm max-w-md mx-auto">
                      {node.data.triggerType ? (
                        'Your Instagram message trigger is configured. Click below to edit.'
                      ) : (
                        'Trigger automation when someone sends you a message on Instagram.'
                      )}
                    </p>
                  </div>

                  {node.data.triggerType && (
                    <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-700 max-w-md mx-auto">
                      <div className="text-sm text-blue-900 dark:text-blue-300 space-y-1">
                        <div><span className="font-semibold">Mode:</span> {node.data.triggerType === 'any' ? 'Any message' : node.data.triggerType === 'keyword' ? 'Specific keywords' : 'AI intent'}</div>
                        {node.data.keywords && <div><span className="font-semibold">Keywords:</span> {node.data.keywords}</div>}
                        {node.data.replyDelay > 0 && <div><span className="font-semibold">Delay:</span> {node.data.replyDelay}s</div>}
                      </div>
                    </div>
                  )}

                  <button
                    onClick={() => setShowInstagramMessageWizard(true)}
                    className="px-8 py-4 rounded-xl font-bold bg-gradient-to-r from-blue-500 to-cyan-500 text-white hover:from-blue-600 hover:to-cyan-600 transition-all shadow-lg hover:shadow-xl text-lg"
                  >
                    {node.data.triggerType ? '✏️ Edit Setup' : '🚀 Start Setup Wizard'}
                  </button>
                </div>
              )}
            </>
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

          {node.data.triggerType === 'instagram_shares' && (
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
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-3">
                  When someone shares:
                </label>
                <div className="space-y-2">
                  <label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 border-gray-300 dark:border-gray-600">
                    <input
                      type="radio"
                      checked={node.data.shareType === 'specific'}
                      onChange={() => handleUpdate('shareType', 'specific')}
                      className="w-4 h-4 text-purple-500"
                    />
                    <div className="flex-1">
                      <span className="text-sm font-medium text-gray-900 dark:text-white">A specific post or reel</span>
                      {node.data.shareType === 'specific' && (
                        <button
                          onClick={() => setShowPostSelector(true)}
                          className="mt-2 text-xs text-purple-600 dark:text-purple-400 underline"
                        >
                          Click to choose → {node.data.selectedPost ? '✓ Selected' : 'Not selected'}
                        </button>
                      )}
                    </div>
                  </label>
                  <label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 border-gray-300 dark:border-gray-600">
                    <input
                      type="radio"
                      checked={node.data.shareType === 'any'}
                      onChange={() => handleUpdate('shareType', 'any')}
                      className="w-4 h-4 text-purple-500"
                    />
                    <span className="text-sm font-medium text-gray-900 dark:text-white">Any post</span>
                  </label>
                  <label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 border-gray-300 dark:border-gray-600">
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

              {/* Delay Before Replying */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-3">
                  Delay before replying:
                </label>
                <div className="flex gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-700 dark:text-gray-300">Wait</span>
                    <input
                      type="number"
                      min="0"
                      value={node.data.replyDelay || 0}
                      onChange={(e) => handleUpdate('replyDelay', parseInt(e.target.value) || 0)}
                      className="w-20 p-2 border rounded-lg bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 text-center"
                    />
                  </div>
                  <select
                    value={node.data.delayUnit || 'seconds'}
                    onChange={(e) => handleUpdate('delayUnit', e.target.value)}
                    className="flex-1 p-2 border rounded-lg bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="seconds">seconds</option>
                    <option value="minutes">minutes</option>
                    <option value="hours">hours</option>
                    <option value="days">days</option>
                  </select>
                  <span className="flex items-center text-sm text-gray-700 dark:text-gray-300">before sending the message.</span>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                  💡 Tip: Add a short delay to make your reply feel more natural — not instant or robotic.
                </p>
              </div>
            </div>
          )}

          {node.data.triggerType === 'live_comments' && (
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

          {node.data.triggerType === 'story_mention' && (
            <div className="py-8">
              <div className="mb-6 text-center">
                <div className="text-6xl mb-4">📣</div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                  Story Mention Reply
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm max-w-md mx-auto mb-4">
                  Send a message when someone mentions you in their story.
                </p>
              </div>

              {/* Trigger Frequency */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-3">
                  When to trigger:
                </label>
                <div className="space-y-2">
                  <label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 border-gray-300 dark:border-gray-600">
                    <input
                      type="radio"
                      checked={node.data.triggerFrequency === 'every_time'}
                      onChange={() => handleUpdate('triggerFrequency', 'every_time')}
                      className="w-4 h-4 text-purple-500"
                    />
                    <span className="text-sm text-gray-900 dark:text-white">Every time someone mentions you in their Story</span>
                  </label>
                  <label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 border-gray-300 dark:border-gray-600">
                    <input
                      type="radio"
                      checked={node.data.triggerFrequency === 'once_per_24h'}
                      onChange={() => handleUpdate('triggerFrequency', 'once_per_24h')}
                      className="w-4 h-4 text-purple-500"
                    />
                    <span className="text-sm text-gray-900 dark:text-white">Only once per 24 hours per user</span>
                  </label>
                </div>
              </div>

              {/* Delay */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-3">
                  Delay (optional):
                </label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    min="0"
                    value={node.data.replyDelay || 0}
                    onChange={(e) => handleUpdate('replyDelay', parseInt(e.target.value) || 0)}
                    className="w-24 p-3 border rounded-lg bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500"
                  />
                  <select
                    value={node.data.delayUnit || 'sec'}
                    onChange={(e) => handleUpdate('delayUnit', e.target.value)}
                    className="flex-1 p-3 border rounded-lg bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="sec">seconds</option>
                    <option value="min">minutes</option>
                    <option value="hrs">hours</option>
                  </select>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                  Tip: add a small delay so it doesn't look instant/robotic.
                </p>
              </div>

              {/* Auto-like */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-3">
                  Auto-like (optional):
                </label>
                <label className="flex items-center gap-3 p-4 bg-pink-50 dark:bg-pink-900/20 rounded-lg border border-pink-200 dark:border-pink-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={node.data.autoLike || false}
                    onChange={(e) => handleUpdate('autoLike', e.target.checked)}
                    className="w-5 h-5 text-pink-500 border-gray-300 rounded focus:ring-pink-500"
                  />
                  <span className="text-sm font-medium text-pink-900 dark:text-pink-300">
                    ❤️ React with ❤️ to their Story mention
                  </span>
                </label>
              </div>
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
              <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-white">Tag Name</label>
              <input
                type="text"
                value={node.data.tagName || ''}
                onChange={(e) => handleUpdate('tagName', e.target.value)}
                placeholder="e.g., interested, vip, lead"
                className="w-full p-2 border rounded bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400 focus:border-transparent"
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
                <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-white">Video URL</label>
                <input
                  type="text"
                  value={node.data.videoUrl || ''}
                  onChange={(e) => handleUpdate('videoUrl', e.target.value)}
                  placeholder="https://example.com/video.mp4 or /path/to/video.mp4"
                  className="w-full p-2 border rounded bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-orange-500 dark:focus:ring-orange-400 focus:border-transparent"
                />
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
                <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-white">Voice File URL</label>
                <input
                  type="text"
                  value={node.data.voiceUrl || ''}
                  onChange={(e) => handleUpdate('voiceUrl', e.target.value)}
                  placeholder="https://example.com/audio.mp3 or /path/to/audio.mp3"
                  className="w-full p-2 border rounded bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-orange-500 dark:focus:ring-orange-400 focus:border-transparent"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-white">Duration</label>
                <input
                  type="text"
                  value={node.data.duration || ''}
                  onChange={(e) => handleUpdate('duration', e.target.value)}
                  placeholder="e.g., 0:15"
                  className="w-full p-2 border rounded bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-orange-500 dark:focus:ring-orange-400 focus:border-transparent"
                />
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
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-white">Carousel Cards</label>
              <div className="p-3 bg-orange-50 dark:bg-orange-900/20 rounded border border-orange-200 dark:border-orange-700">
                <p className="text-sm text-orange-800 dark:text-orange-300">
                  Carousel contains {node.data.cards?.length || 0} card(s)
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">
                  Configure individual cards in the carousel
                </p>
              </div>
            </div>
          )}

          {node.data.mediaType === 'send_card' && (
            <>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-white">Card Title</label>
                <input
                  type="text"
                  value={node.data.title || ''}
                  onChange={(e) => handleUpdate('title', e.target.value)}
                  placeholder="Card title"
                  className="w-full p-2 border rounded bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-orange-500 dark:focus:ring-orange-400 focus:border-transparent"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-white">Subtitle</label>
                <input
                  type="text"
                  value={node.data.subtitle || ''}
                  onChange={(e) => handleUpdate('subtitle', e.target.value)}
                  placeholder="Card subtitle"
                  className="w-full p-2 border rounded bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-orange-500 dark:focus:ring-orange-400 focus:border-transparent"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-white">Image URL (Optional)</label>
                <input
                  type="text"
                  value={node.data.imageUrl || ''}
                  onChange={(e) => handleUpdate('imageUrl', e.target.value)}
                  placeholder="https://example.com/image.jpg"
                  className="w-full p-2 border rounded bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-orange-500 dark:focus:ring-orange-400 focus:border-transparent"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-white">Buttons</label>
                <div className="p-3 bg-orange-50 dark:bg-orange-900/20 rounded border border-orange-200 dark:border-orange-700">
                  <p className="text-sm text-orange-800 dark:text-orange-300">
                    {node.data.buttons?.length || 0} button(s) configured
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">
                    Add action buttons to this card
                  </p>
                </div>
              </div>
            </>
          )}
        </>
      )
    }

    return null
  }

  return (
    <div className="w-96 h-full bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700 p-6 overflow-y-auto shadow-xl">
      <div className="flex justify-between items-center mb-4 sticky top-0 bg-white dark:bg-gray-800 pb-4 z-10">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">{getNodeCategory()}</h2>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 text-2xl"
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
          className="w-full bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
        >
          💾 Save Changes
        </button>
        <button
          onClick={() => onDelete(node.id)}
          className="w-full bg-red-600 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-800 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
        >
          🗑️ Delete Node
        </button>
      </div>

      {/* Post Selector Modal */}
      {showPostSelector && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowPostSelector(false)}>
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-3xl max-h-[80vh] overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">Select Post</h3>
                <button
                  onClick={() => setShowPostSelector(false)}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 text-2xl"
                >
                  ×
                </button>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Choose which post to monitor for keyword comments</p>
            </div>
            <div className="p-6 overflow-y-auto max-h-[60vh]">
              <div className="grid gap-4">
                {mockPosts.map((post) => (
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
  )
}
