import { useState } from 'react'

export default function InstagramMessageWizard({ initialData, onComplete, onClose }) {
  const [step, setStep] = useState(1)

  // Step 1: Message trigger type
  const [triggerType, setTriggerType] = useState(initialData?.messageType || initialData?.triggerType || 'any')
  const [keywords, setKeywords] = useState(initialData?.keywords || '')
  const [aiIntents, setAiIntents] = useState(initialData?.aiIntents || [])

  // Step 2: Delay (optional)
  const [replyDelay, setReplyDelay] = useState(initialData?.replyDelay || 0)

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1)
    }
  }

  const handleNext = () => {
    if (step === 1 && triggerType === 'keyword' && !keywords.trim()) {
      alert('Please enter at least one keyword')
      return
    }
    if (step === 1 && triggerType === 'ai' && aiIntents.length === 0) {
      alert('Please select at least one intent')
      return
    }
    if (step < 2) {
      setStep(step + 1)
    }
  }

  const handleDone = () => {
    const config = {
      messageType: triggerType,
      triggerType,
      keywords: triggerType === 'keyword' ? keywords : '',
      aiIntents: triggerType === 'ai' ? aiIntents : [],
      replyDelay,
    }
    onComplete(config)
  }

  const progressPercentage = (step / 2) * 100

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

  const availableIntents = [
    { id: 'price', label: 'Price Inquiry', description: 'User asking about pricing or costs' },
    { id: 'support', label: 'Support Request', description: 'User needs help or has a problem' },
    { id: 'booking', label: 'Booking/Appointment', description: 'User wants to schedule or book' },
    { id: 'info', label: 'General Info', description: 'User asking for general information' },
    { id: 'feedback', label: 'Feedback/Review', description: 'User providing feedback or review' },
  ]

  const toggleIntent = (intentId) => {
    setAiIntents(prev =>
      prev.includes(intentId)
        ? prev.filter(id => id !== intentId)
        : [...prev, intentId]
    )
  }

  return (
    <div className="flex flex-col">
      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-3">
          <div className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${step >= 1 ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-500'}`}>
              {step > 1 ? '✓' : '1'}
            </div>
            <div className={`h-1 w-12 ${step >= 2 ? 'bg-gradient-to-r from-blue-500 to-cyan-500' : 'bg-gray-200 dark:bg-gray-700'}`}></div>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${step >= 2 ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-500'}`}>
              2
            </div>
          </div>
          <span className="text-sm text-gray-600 dark:text-gray-400 font-medium">Step {step} of 2</span>
        </div>

        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
          <div
            className="bg-gradient-to-r from-blue-500 to-cyan-500 h-full transition-all duration-300 ease-out"
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
      </div>

      {/* Step Content */}
      <div className="flex-1 overflow-y-auto">
        {/* STEP 1: Trigger Type */}
        {step === 1 && (
          <div className="space-y-6 animate-fadeIn">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Send a message when someone sends you:</h2>
              <p className="text-gray-600 dark:text-gray-400">Choose what triggers this automation</p>
            </div>

            <div className="space-y-3">
              {/* Any Message Option */}
              <button
                onClick={() => setTriggerType('any')}
                className={`w-full p-5 rounded-xl border-2 transition-all text-left ${
                  triggerType === 'any'
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                    : 'border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-700'
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center mt-1 ${
                    triggerType === 'any'
                      ? 'border-blue-500 bg-blue-500'
                      : 'border-gray-300 dark:border-gray-600'
                  }`}>
                    {triggerType === 'any' && (
                      <div className="w-3 h-3 bg-white rounded-full"></div>
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-900 dark:text-white mb-1">Any message</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Trigger for every message received, regardless of content
                    </p>
                  </div>
                </div>
              </button>

              {/* Specific Keyword Option */}
              <button
                onClick={() => setTriggerType('keyword')}
                className={`w-full p-5 rounded-xl border-2 transition-all text-left ${
                  triggerType === 'keyword'
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                    : 'border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-700'
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center mt-1 ${
                    triggerType === 'keyword'
                      ? 'border-blue-500 bg-blue-500'
                      : 'border-gray-300 dark:border-gray-600'
                  }`}>
                    {triggerType === 'keyword' && (
                      <div className="w-3 h-3 bg-white rounded-full"></div>
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-900 dark:text-white mb-1">Specific keyword</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Only trigger when the message contains certain keywords
                    </p>
                  </div>
                </div>
              </button>

              {/* Keywords Input - Shows when "Specific keyword" is selected */}
              {triggerType === 'keyword' && (
                <div className="ml-10 mt-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                    Enter keywords (comma-separated):
                  </label>
                  <input
                    type="text"
                    value={keywords}
                    onChange={(e) => setKeywords(e.target.value)}
                    placeholder="e.g., price, help, info, book"
                    className="w-full px-4 py-3 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-white placeholder-gray-400"
                  />
                  <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                    Separate multiple keywords with commas
                  </p>
                </div>
              )}

              {/* AI Intent Recognition Option */}
              <button
                onClick={() => setTriggerType('ai')}
                className={`w-full p-5 rounded-xl border-2 transition-all text-left ${
                  triggerType === 'ai'
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                    : 'border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-700'
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center mt-1 ${
                    triggerType === 'ai'
                      ? 'border-blue-500 bg-blue-500'
                      : 'border-gray-300 dark:border-gray-600'
                  }`}>
                    {triggerType === 'ai' && (
                      <div className="w-3 h-3 bg-white rounded-full"></div>
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-900 dark:text-white mb-1 flex items-center gap-2">
                      AI: recognize intent
                      <span className="text-xs bg-violet-500 text-white px-2 py-0.5 rounded-full">AI</span>
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Let AI understand what the user meant (e.g., "price", "support", "booking") and trigger the right reply
                    </p>
                  </div>
                </div>
              </button>

              {/* AI Intents Selection - Shows when "AI" is selected */}
              {triggerType === 'ai' && (
                <div className="ml-10 mt-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                    Select intents to recognize:
                  </label>
                  <div className="space-y-2">
                    {availableIntents.map((intent) => (
                      <button
                        key={intent.id}
                        onClick={() => toggleIntent(intent.id)}
                        className={`w-full p-3 rounded-lg border transition-all text-left ${
                          aiIntents.includes(intent.id)
                            ? 'border-violet-500 bg-violet-50 dark:bg-violet-900/20'
                            : 'border-gray-200 dark:border-gray-700 hover:border-violet-300'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div className={`w-5 h-5 rounded border-2 flex items-center justify-center mt-0.5 ${
                            aiIntents.includes(intent.id)
                              ? 'border-violet-500 bg-violet-500'
                              : 'border-gray-300 dark:border-gray-600'
                          }`}>
                            {aiIntents.includes(intent.id) && (
                              <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                              </svg>
                            )}
                          </div>
                          <div className="flex-1">
                            <div className="font-semibold text-gray-900 dark:text-white text-sm">{intent.label}</div>
                            <div className="text-xs text-gray-600 dark:text-gray-400 mt-0.5">{intent.description}</div>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                  <p className="mt-3 text-xs text-gray-500 dark:text-gray-400">
                    AI will analyze incoming messages and match them to these intents
                  </p>
                </div>
              )}
            </div>

            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                <strong>Default:</strong> Any message
              </p>
            </div>
          </div>
        )}

        {/* STEP 2: Delay */}
        {step === 2 && (
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
                className="w-full px-4 py-3 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-white text-base"
              >
                {delayOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <p className="mt-3 text-sm text-gray-500 dark:text-gray-400">
                A short delay makes your automated response feel more natural and human-like
              </p>
            </div>

            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <h4 className="font-semibold text-blue-900 dark:text-blue-200 mb-2">Summary</h4>
              <ul className="space-y-2 text-sm text-blue-800 dark:text-blue-300">
                <li>
                  <strong>Trigger:</strong>{' '}
                  {triggerType === 'any' && 'Any message'}
                  {triggerType === 'keyword' && `Keywords: ${keywords}`}
                  {triggerType === 'ai' && `AI Intent Recognition (${aiIntents.length} intents)`}
                </li>
                <li>
                  <strong>Delay:</strong> {delayOptions.find(d => d.value === replyDelay)?.label || '0 sec'}
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
          {step < 2 ? (
            <button
              onClick={handleNext}
              className="px-8 py-3 rounded-lg font-semibold bg-gradient-to-r from-blue-500 to-cyan-500 text-white hover:from-blue-600 hover:to-cyan-600 transition-all shadow-lg hover:shadow-xl"
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
