'use client'

import { useState } from 'react'

export default function TextMessageNodeConfig({ node, onUpdate }) {
  const [message, setMessage] = useState(node.data.message || '')
  // Independent toggles for buttons and quick replies
  const [showButtons, setShowButtons] = useState(node.data.showButtons || (node.data.buttons?.length > 0) || false)
  const [showQuickReplies, setShowQuickReplies] = useState(node.data.showQuickReplies || (node.data.quickReplies?.length > 0) || false)
  const [buttons, setButtons] = useState(node.data.buttons || [])
  const [quickReplies, setQuickReplies] = useState(node.data.quickReplies || [])

  // Mock CTR data - in real app, this would come from analytics API
  const getButtonCTR = (buttonIndex) => {
    const mockCTRs = [34, 12, 8, 27, 15, 9]
    return mockCTRs[buttonIndex % mockCTRs.length]
  }

  const handleMessageChange = (value) => {
    setMessage(value)
    onUpdate(node.id, { message: value })
  }

  const handleToggleButtons = (enabled) => {
    setShowButtons(enabled)
    if (!enabled) {
      setButtons([])
      onUpdate(node.id, { showButtons: enabled, buttons: [] })
    } else {
      onUpdate(node.id, { showButtons: enabled })
    }
  }

  const handleToggleQuickReplies = (enabled) => {
    setShowQuickReplies(enabled)
    if (!enabled) {
      setQuickReplies([])
      onUpdate(node.id, { showQuickReplies: enabled, quickReplies: [] })
    } else {
      onUpdate(node.id, { showQuickReplies: enabled })
    }
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

      {/* Interaction Toggles - Independent toggles for both */}
      <div className="space-y-3">
        <label className="block text-sm font-semibold text-gray-900 dark:text-white">
          Add Interactions (Optional)
        </label>

        {/* Buttons Toggle */}
        <div
          onClick={() => handleToggleButtons(!showButtons)}
          className={`flex items-center justify-between p-3 rounded-lg border-2 cursor-pointer transition-all ${
            showButtons
              ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
              : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
          }`}
        >
          <div className="flex items-center gap-3">
            <span className="text-2xl">🔘</span>
            <div>
              <p className="font-medium text-gray-900 dark:text-white text-sm">Buttons</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Large action buttons below message (max 3)</p>
            </div>
          </div>
          <div className={`w-11 h-6 rounded-full transition-colors ${showButtons ? 'bg-blue-500' : 'bg-gray-300 dark:bg-gray-600'}`}>
            <div className={`w-5 h-5 rounded-full bg-white shadow-sm transform transition-transform mt-0.5 ${showButtons ? 'translate-x-5 ml-0.5' : 'translate-x-0.5'}`} />
          </div>
        </div>

        {/* Quick Replies Toggle */}
        <div
          onClick={() => handleToggleQuickReplies(!showQuickReplies)}
          className={`flex items-center justify-between p-3 rounded-lg border-2 cursor-pointer transition-all ${
            showQuickReplies
              ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
              : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
          }`}
        >
          <div className="flex items-center gap-3">
            <span className="text-2xl">💬</span>
            <div>
              <p className="font-medium text-gray-900 dark:text-white text-sm">Quick Replies</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Small bubble replies above keyboard</p>
            </div>
          </div>
          <div className={`w-11 h-6 rounded-full transition-colors ${showQuickReplies ? 'bg-purple-500' : 'bg-gray-300 dark:bg-gray-600'}`}>
            <div className={`w-5 h-5 rounded-full bg-white shadow-sm transform transition-transform mt-0.5 ${showQuickReplies ? 'translate-x-5 ml-0.5' : 'translate-x-0.5'}`} />
          </div>
        </div>
      </div>

      {/* Buttons Section */}
      {showButtons && (
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
                <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-md border border-blue-200 dark:border-blue-700">
                  <div className="flex items-center gap-2">
                    <span className="text-blue-500">●→</span>
                    <p className="text-xs text-blue-700 dark:text-blue-300">
                      Drag from the button's handle on the canvas to connect to another node
                    </p>
                  </div>
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
      {showQuickReplies && (
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

    </div>
  )
}
