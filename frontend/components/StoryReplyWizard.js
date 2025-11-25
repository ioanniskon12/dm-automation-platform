import { useState } from 'react'

export default function StoryReplyWizard({ initialData, onComplete, onClose }) {
  const [step, setStep] = useState(1)

  // Step 1: Story selection
  const [storySelection, setStorySelection] = useState(initialData?.storySelection || 'all')
  const [selectedStoryId, setSelectedStoryId] = useState(initialData?.selectedStoryId || '')
  const [showStoryModal, setShowStoryModal] = useState(false)

  // Step 2: Trigger type
  const [triggerType, setTriggerType] = useState(initialData?.triggerType || 'any')
  const [triggerKeywords, setTriggerKeywords] = useState(initialData?.triggerKeywords || '')

  // Step 3: Delay
  const [replyDelay, setReplyDelay] = useState(initialData?.replyDelay || 0)

  // Step 4: Auto-react
  const [autoReact, setAutoReact] = useState(initialData?.autoReact || false)

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1)
    }
  }

  const handleNext = () => {
    if (step === 1 && storySelection === 'specific' && !selectedStoryId) {
      alert('Please select a story')
      return
    }
    if (step < 4) {
      setStep(step + 1)
    }
  }

  const handleDone = () => {
    const config = {
      storySelection,
      selectedStoryId: storySelection === 'specific' ? selectedStoryId : null,
      triggerType,
      triggerKeywords: triggerType === 'specific' ? triggerKeywords : '',
      replyDelay,
      autoReact,
    }
    onComplete(config)
  }

  const progressPercentage = (step / 4) * 100

  // Mock story data - replace with actual API call
  const availableStories = [
    { id: 'story-1', thumbnail: '', timestamp: '2 hours ago' },
    { id: 'story-2', thumbnail: '', timestamp: '5 hours ago' },
    { id: 'story-3', thumbnail: '', timestamp: '1 day ago' },
  ]

  const delayOptions = [
    { value: 0, label: '0 sec' },
    { value: 5, label: '5 sec' },
    { value: 10, label: '10 sec' },
    { value: 15, label: '15 sec' },
    { value: 30, label: '30 sec' },
    { value: 60, label: '1 min' },
    { value: 120, label: '2 min' },
    { value: 300, label: '5 min' },
  ]

  return (
    <div className="flex flex-col">
      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-3">
          <div className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${step >= 1 ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-500'}`}>
              {step > 1 ? '✓' : '1'}
            </div>
            <div className={`h-1 w-12 ${step >= 2 ? 'bg-gradient-to-r from-purple-500 to-pink-500' : 'bg-gray-200 dark:bg-gray-700'}`}></div>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${step >= 2 ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-500'}`}>
              {step > 2 ? '✓' : '2'}
            </div>
            <div className={`h-1 w-12 ${step >= 3 ? 'bg-gradient-to-r from-purple-500 to-pink-500' : 'bg-gray-200 dark:bg-gray-700'}`}></div>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${step >= 3 ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-500'}`}>
              {step > 3 ? '✓' : '3'}
            </div>
            <div className={`h-1 w-12 ${step >= 4 ? 'bg-gradient-to-r from-purple-500 to-pink-500' : 'bg-gray-200 dark:bg-gray-700'}`}></div>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${step >= 4 ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-500'}`}>
              4
            </div>
          </div>
          <span className="text-sm text-gray-600 dark:text-gray-400 font-medium">Step {step} of 4</span>
        </div>

        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
          <div
            className="bg-gradient-to-r from-purple-500 to-pink-500 h-full transition-all duration-300 ease-out"
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
      </div>

      {/* Step Content */}
      <div className="flex-1 overflow-y-auto">
        {/* STEP 1: Choose Story */}
        {step === 1 && (
          <div className="space-y-6 animate-fadeIn">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Choose the Story</h2>
              <p className="text-gray-600 dark:text-gray-400">Send a message when someone replies to:</p>
            </div>

            <div className="space-y-3">
              {/* All Stories Option */}
              <button
                onClick={() => setStorySelection('all')}
                className={`w-full p-5 rounded-xl border-2 transition-all text-left ${
                  storySelection === 'all'
                    ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                    : 'border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-700'
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center mt-1 ${
                    storySelection === 'all'
                      ? 'border-purple-500 bg-purple-500'
                      : 'border-gray-300 dark:border-gray-600'
                  }`}>
                    {storySelection === 'all' && (
                      <div className="w-3 h-3 bg-white rounded-full"></div>
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-900 dark:text-white mb-1">All Stories</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Trigger when someone replies to any of your stories
                    </p>
                  </div>
                </div>
              </button>

              {/* Specific Story Option */}
              <button
                onClick={() => setStorySelection('specific')}
                className={`w-full p-5 rounded-xl border-2 transition-all text-left ${
                  storySelection === 'specific'
                    ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                    : 'border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-700'
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center mt-1 ${
                    storySelection === 'specific'
                      ? 'border-purple-500 bg-purple-500'
                      : 'border-gray-300 dark:border-gray-600'
                  }`}>
                    {storySelection === 'specific' && (
                      <div className="w-3 h-3 bg-white rounded-full"></div>
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-900 dark:text-white mb-1">Specific Story</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Choose a particular story to trigger this automation
                    </p>
                  </div>
                </div>
              </button>

              {/* Story Selector Button - Shows when "Specific Story" is selected */}
              {storySelection === 'specific' && (
                <div className="ml-10 mt-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                    Selected story:
                  </label>
                  <button
                    onClick={() => setShowStoryModal(true)}
                    className="w-full px-4 py-3 bg-white dark:bg-gray-900 border-2 border-purple-300 dark:border-purple-700 rounded-lg hover:border-purple-500 transition-colors text-left flex items-center justify-between"
                  >
                    <span className="text-gray-900 dark:text-white">
                      {selectedStoryId
                        ? `Story from ${availableStories.find(s => s.id === selectedStoryId)?.timestamp || 'unknown'}`
                        : 'Click to choose a story'}
                    </span>
                    <span className="text-purple-500">📖</span>
                  </button>
                  <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                    Only active stories from the last 24 hours are shown
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* STEP 2: Trigger Type */}
        {step === 2 && (
          <div className="space-y-6 animate-fadeIn">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Choose the Trigger Type</h2>
              <p className="text-gray-600 dark:text-gray-400">Trigger when their reply:</p>
            </div>

            <div className="space-y-3">
              {/* Any Reply Option */}
              <button
                onClick={() => setTriggerType('any')}
                className={`w-full p-5 rounded-xl border-2 transition-all text-left ${
                  triggerType === 'any'
                    ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                    : 'border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-700'
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center mt-1 ${
                    triggerType === 'any'
                      ? 'border-purple-500 bg-purple-500'
                      : 'border-gray-300 dark:border-gray-600'
                  }`}>
                    {triggerType === 'any' && (
                      <div className="w-3 h-3 bg-white rounded-full"></div>
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-900 dark:text-white mb-1">Contains any words or reactions</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Trigger for every reply to the story, regardless of content
                    </p>
                  </div>
                </div>
              </button>

              {/* Specific Keywords Option */}
              <button
                onClick={() => setTriggerType('specific')}
                className={`w-full p-5 rounded-xl border-2 transition-all text-left ${
                  triggerType === 'specific'
                    ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                    : 'border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-700'
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center mt-1 ${
                    triggerType === 'specific'
                      ? 'border-purple-500 bg-purple-500'
                      : 'border-gray-300 dark:border-gray-600'
                  }`}>
                    {triggerType === 'specific' && (
                      <div className="w-3 h-3 bg-white rounded-full"></div>
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-900 dark:text-white mb-1">Contains specific words or reactions</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Only trigger when the reply contains certain keywords
                    </p>
                  </div>
                </div>
              </button>

              {/* Keywords Input - Shows when "Specific" is selected */}
              {triggerType === 'specific' && (
                <div className="ml-10 mt-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                    Enter keywords or reactions (comma-separated):
                  </label>
                  <input
                    type="text"
                    value={triggerKeywords}
                    onChange={(e) => setTriggerKeywords(e.target.value)}
                    placeholder="e.g., yes, interested, 👍, ❤️"
                    className="w-full px-4 py-3 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900 dark:text-white placeholder-gray-400"
                  />
                  <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                    Supports text and emoji reactions. Separate multiple keywords with commas.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* STEP 3: Delay */}
        {step === 3 && (
          <div className="space-y-6 animate-fadeIn">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Add a Delay (Optional)</h2>
              <p className="text-gray-600 dark:text-gray-400">Wait before sending your reply</p>
            </div>

            <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Wait before sending your reply:
              </label>
              <select
                value={replyDelay}
                onChange={(e) => setReplyDelay(Number(e.target.value))}
                className="w-full px-4 py-3 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900 dark:text-white text-base"
              >
                {delayOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <p className="mt-3 text-sm text-gray-500 dark:text-gray-400">
                💡 Use this if you want viewers to finish watching your story before replying.
              </p>
            </div>

            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <p className="text-sm text-blue-800 dark:text-blue-200">
                <strong>Tip:</strong> A short delay makes your automated response feel more natural and human-like.
              </p>
            </div>
          </div>
        )}

        {/* STEP 4: Auto-React */}
        {step === 4 && (
          <div className="space-y-6 animate-fadeIn">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Auto-React (Optional)</h2>
              <p className="text-gray-600 dark:text-gray-400">❤️ Automatically like their reply</p>
            </div>

            <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
              <div className="flex items-start gap-4">
                <input
                  type="checkbox"
                  id="auto-react"
                  checked={autoReact}
                  onChange={(e) => setAutoReact(e.target.checked)}
                  className="w-5 h-5 mt-1 text-purple-500 border-gray-300 rounded focus:ring-2 focus:ring-purple-500"
                />
                <label htmlFor="auto-react" className="flex-1 cursor-pointer">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-2xl">❤️</span>
                    <h3 className="font-bold text-gray-900 dark:text-white">React with ❤️ when they reply</h3>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Automatically like their story reply before sending your DM. This shows engagement and makes the interaction feel more personal.
                  </p>
                </label>
              </div>
            </div>

            <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg p-4">
              <h4 className="font-semibold text-purple-900 dark:text-purple-200 mb-2">Summary</h4>
              <ul className="space-y-2 text-sm text-purple-800 dark:text-purple-300">
                <li>
                  <strong>Story:</strong> {storySelection === 'all' ? 'All stories' : 'Specific story'}
                </li>
                <li>
                  <strong>Trigger:</strong> {triggerType === 'any' ? 'Any reply' : `Specific keywords: ${triggerKeywords}`}
                </li>
                <li>
                  <strong>Delay:</strong> {delayOptions.find(d => d.value === replyDelay)?.label || '0 sec'}
                </li>
                <li>
                  <strong>Auto-react:</strong> {autoReact ? 'Yes ❤️' : 'No'}
                </li>
              </ul>
            </div>
          </div>
        )}
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between items-center mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
        <button
          onClick={handleBack}
          disabled={step === 1}
          className="px-6 py-3 rounded-lg font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          ← Back
        </button>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="px-6 py-3 rounded-lg font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            Cancel
          </button>
          {step < 4 ? (
            <button
              onClick={handleNext}
              className="px-8 py-3 rounded-lg font-semibold bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 transition-all shadow-lg hover:shadow-xl"
            >
              Next →
            </button>
          ) : (
            <button
              onClick={handleDone}
              className="px-8 py-3 rounded-lg font-semibold bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:from-green-600 hover:to-emerald-600 transition-all shadow-lg hover:shadow-xl"
            >
              Done ✓
            </button>
          )}
        </div>
      </div>

      {/* Story Selection Modal */}
      {showStoryModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[300]">
          <div className="bg-white dark:bg-gray-800 rounded-xl border-2 border-purple-500 p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto m-4">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Choose a Story</h2>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Select which story will trigger this automation
                </p>
              </div>
              <button
                onClick={() => setShowStoryModal(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-white text-3xl leading-none"
              >
                ×
              </button>
            </div>

            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6">
              <p className="text-sm text-blue-800 dark:text-blue-200">
                <strong>Note:</strong> Stories are only available for 24 hours. Only your active stories from the last 24 hours are shown below.
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {availableStories.map((story) => (
                <button
                  key={story.id}
                  onClick={() => {
                    setSelectedStoryId(story.id)
                    setShowStoryModal(false)
                  }}
                  className={`relative aspect-[9/16] rounded-lg border-3 overflow-hidden transition-all hover:scale-105 ${
                    selectedStoryId === story.id
                      ? 'border-purple-500 ring-4 ring-purple-300 dark:ring-purple-700'
                      : 'border-gray-300 dark:border-gray-600 hover:border-purple-400'
                  }`}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-400 via-pink-400 to-orange-400 flex items-center justify-center">
                    <span className="text-6xl">📖</span>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3">
                    <p className="text-white text-xs font-semibold">{story.timestamp}</p>
                  </div>
                  {selectedStoryId === story.id && (
                    <div className="absolute top-2 right-2 bg-purple-500 text-white rounded-full w-8 h-8 flex items-center justify-center">
                      ✓
                    </div>
                  )}
                </button>
              ))}
            </div>

            {availableStories.length === 0 && (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">📭</div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                  No Active Stories
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  You don't have any active stories in the last 24 hours.
                </p>
              </div>
            )}

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setShowStoryModal(false)}
                className="px-6 py-3 rounded-lg font-semibold bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  )
}
