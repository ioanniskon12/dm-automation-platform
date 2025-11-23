'use client'

import { useState } from 'react'

export default function TextMessageNodeConfig({ node, onUpdate }) {
  const [message, setMessage] = useState(node.data.message || '')
  const [interactionType, setInteractionType] = useState(node.data.interactionType || 'none') // 'none', 'buttons', 'quickReplies'
  const [buttons, setButtons] = useState(node.data.buttons || [])
  const [quickReplies, setQuickReplies] = useState(node.data.quickReplies || [])
  const [showSwitchWarning, setShowSwitchWarning] = useState(false)
  const [pendingType, setPendingType] = useState(null)

  // Mock CTR data - in real app, this would come from analytics API
  const getButtonCTR = (buttonIndex) => {
    const mockCTRs = [34, 12, 8, 27, 15, 9]
    return mockCTRs[buttonIndex % mockCTRs.length]
  }

  const handleMessageChange = (value) => {
    setMessage(value)
    onUpdate(node.id, { message: value })
  }

  const handleInteractionTypeChange = (newType) => {
    // If switching from one type to another (not from 'none')
    if (interactionType !== 'none' && interactionType !== newType && newType !== 'none') {
      const hasContent = (interactionType === 'buttons' && buttons.length > 0) ||
                         (interactionType === 'quickReplies' && quickReplies.length > 0)

      if (hasContent) {
        setPendingType(newType)
        setShowSwitchWarning(true)
        return
      }
    }

    applyInteractionTypeChange(newType)
  }

  const applyInteractionTypeChange = (newType) => {
    setInteractionType(newType)
    if (newType === 'buttons') {
      setQuickReplies([])
      onUpdate(node.id, { interactionType: newType, buttons, quickReplies: [] })
    } else if (newType === 'quickReplies') {
      setButtons([])
      onUpdate(node.id, { interactionType: newType, quickReplies, buttons: [] })
    } else {
      onUpdate(node.id, { interactionType: newType })
    }
  }

  const confirmSwitch = () => {
    applyInteractionTypeChange(pendingType)
    setShowSwitchWarning(false)
    setPendingType(null)
  }

  const cancelSwitch = () => {
    setShowSwitchWarning(false)
    setPendingType(null)
  }

  const addButton = () => {
    if (buttons.length < 3) {
      const newButtons = [...buttons, { label: '', actionType: 'goToNode', actionValue: '', id: Date.now() }]
      setButtons(newButtons)
      onUpdate(node.id, { buttons: newButtons })
    }
  }

  const updateButton = (index, field, value) => {
    const newButtons = [...buttons]
    newButtons[index][field] = value
    setButtons(newButtons)
    onUpdate(node.id, { buttons: newButtons })
  }

  const removeButton = (index) => {
    const newButtons = buttons.filter((_, i) => i !== index)
    setButtons(newButtons)
    onUpdate(node.id, { buttons: newButtons })
  }

  const addQuickReply = () => {
    const newQuickReplies = [...quickReplies, { label: '', actionType: 'goToNode', actionValue: '', id: Date.now() }]
    setQuickReplies(newQuickReplies)
    onUpdate(node.id, { quickReplies: newQuickReplies })
  }

  const updateQuickReply = (index, field, value) => {
    const newQuickReplies = [...quickReplies]
    newQuickReplies[index][field] = value
    setQuickReplies(newQuickReplies)
    onUpdate(node.id, { quickReplies: newQuickReplies })
  }

  const removeQuickReply = (index) => {
    const newQuickReplies = quickReplies.filter((_, i) => i !== index)
    setQuickReplies(newQuickReplies)
    onUpdate(node.id, { quickReplies: newQuickReplies })
  }

  return (
    <div className="space-y-6">
      {/* Message Input */}
      <div>
        <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
          Message Text
        </label>
        <textarea
          value={message}
          onChange={(e) => handleMessageChange(e.target.value)}
          placeholder="Hey there! Want to know more?"
          rows={4}
          className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent resize-none"
        />
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          💡 Use {'{name}'}, {'{username}'} for personalization
        </p>
      </div>

      {/* Interaction Type Toggle */}
      <div>
        <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-3">
          Add Interaction (Optional)
        </label>
        <div className="grid grid-cols-3 gap-2 p-1 bg-gray-100 dark:bg-gray-800 rounded-lg">
          <button
            onClick={() => handleInteractionTypeChange('none')}
            className={`py-2 px-4 rounded-md font-medium text-sm transition-all ${
              interactionType === 'none'
                ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            None
          </button>
          <button
            onClick={() => handleInteractionTypeChange('buttons')}
            className={`py-2 px-4 rounded-md font-medium text-sm transition-all ${
              interactionType === 'buttons'
                ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            🔘 Buttons
          </button>
          <button
            onClick={() => handleInteractionTypeChange('quickReplies')}
            className={`py-2 px-4 rounded-md font-medium text-sm transition-all ${
              interactionType === 'quickReplies'
                ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            💬 Quick Replies
          </button>
        </div>
      </div>

      {/* Buttons Section */}
      {interactionType === 'buttons' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Buttons (Max 3)</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Large buttons displayed below the message
              </p>
            </div>
            {buttons.length < 3 && (
              <button
                onClick={addButton}
                className="px-4 py-2 rounded-lg bg-blue-500 text-white text-sm font-semibold hover:bg-blue-600 transition-colors"
              >
                + Add Button
              </button>
            )}
          </div>

          {buttons.length === 0 && (
            <div className="text-center py-8 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg">
              <div className="text-4xl mb-2">🔘</div>
              <p className="text-gray-600 dark:text-gray-400 text-sm">No buttons yet. Add your first button!</p>
            </div>
          )}

          {buttons.map((button, index) => (
            <div key={button.id} className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 space-y-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-500 text-white text-xs font-bold">
                    {index + 1}
                  </span>
                  <span className="text-sm font-semibold text-gray-900 dark:text-white">Button {index + 1}</span>
                  {buttons.length > 1 && (
                    <span className="px-2 py-0.5 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-semibold">
                      CTR {getButtonCTR(index)}%
                    </span>
                  )}
                </div>
                <button
                  onClick={() => removeButton(index)}
                  className="text-red-500 hover:text-red-700 dark:hover:text-red-400 text-sm font-semibold"
                >
                  Remove
                </button>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Button Label
                </label>
                <input
                  type="text"
                  value={button.label}
                  onChange={(e) => updateButton(index, 'label', e.target.value)}
                  placeholder="e.g., Get Offer, More Info, Contact Us"
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Action
                </label>
                <select
                  value={button.actionType}
                  onChange={(e) => updateButton(index, 'actionType', e.target.value)}
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent"
                >
                  <option value="goToNode">Go to Next Step</option>
                  <option value="openUrl">Open URL</option>
                  <option value="triggerFlow">Trigger Flow</option>
                </select>
              </div>

              {button.actionType === 'openUrl' && (
                <div>
                  <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                    URL
                  </label>
                  <input
                    type="url"
                    value={button.actionValue}
                    onChange={(e) => updateButton(index, 'actionValue', e.target.value)}
                    placeholder="https://example.com"
                    className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent"
                  />
                </div>
              )}

              {button.actionType === 'goToNode' && (
                <div>
                  <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Target Node
                  </label>
                  <input
                    type="text"
                    value={button.actionValue}
                    onChange={(e) => updateButton(index, 'actionValue', e.target.value)}
                    placeholder="Select or create a node"
                    className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent"
                  />
                </div>
              )}

              {button.actionType === 'triggerFlow' && (
                <div>
                  <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Flow Name
                  </label>
                  <input
                    type="text"
                    value={button.actionValue}
                    onChange={(e) => updateButton(index, 'actionValue', e.target.value)}
                    placeholder="Enter flow name"
                    className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent"
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Quick Replies Section */}
      {interactionType === 'quickReplies' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Quick Replies (Unlimited)</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Small bubble replies above the keyboard
              </p>
            </div>
            <button
              onClick={addQuickReply}
              className="px-4 py-2 rounded-lg bg-purple-500 text-white text-sm font-semibold hover:bg-purple-600 transition-colors"
            >
              + Add Reply
            </button>
          </div>

          {quickReplies.length === 0 && (
            <div className="text-center py-8 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg">
              <div className="text-4xl mb-2">💬</div>
              <p className="text-gray-600 dark:text-gray-400 text-sm">No quick replies yet. Add your first one!</p>
            </div>
          )}

          <div className="grid grid-cols-1 gap-3">
            {quickReplies.map((reply, index) => (
              <div key={reply.id} className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-700 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-purple-900 dark:text-purple-300">Reply {index + 1}</span>
                  <button
                    onClick={() => removeQuickReply(index)}
                    className="text-red-500 hover:text-red-700 dark:hover:text-red-400 text-xs font-semibold"
                  >
                    Remove
                  </button>
                </div>

                <input
                  type="text"
                  value={reply.label}
                  onChange={(e) => updateQuickReply(index, 'label', e.target.value)}
                  placeholder="e.g., Yes, No, Maybe"
                  className="w-full p-2 border border-purple-300 dark:border-purple-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400 focus:border-transparent"
                />

                <select
                  value={reply.actionType}
                  onChange={(e) => updateQuickReply(index, 'actionType', e.target.value)}
                  className="w-full p-2 border border-purple-300 dark:border-purple-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400 focus:border-transparent"
                >
                  <option value="goToNode">Go to Next Step</option>
                  <option value="openUrl">Open URL</option>
                  <option value="triggerFlow">Trigger Flow</option>
                </select>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Switch Warning Modal */}
      {showSwitchWarning && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-md w-full p-6 space-y-4">
            <div className="text-center">
              <div className="text-5xl mb-3">⚠️</div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                Switch Interaction Type?
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Switching will remove your existing {interactionType === 'buttons' ? 'buttons' : 'quick replies'}.
                This action cannot be undone.
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={cancelSwitch}
                className="flex-1 px-4 py-3 rounded-lg font-semibold text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmSwitch}
                className="flex-1 px-4 py-3 rounded-lg font-semibold text-white bg-red-500 hover:bg-red-600 transition-colors"
              >
                Continue
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
