'use client'

import { useState } from 'react'

export default function InstagramAdsTriggerWizard({ node, onUpdate, onClose }) {
  const [adName, setAdName] = useState(node.data.adName || '')

  const handleDone = () => {
    // Save the configuration
    onUpdate(node.id, {
      adName,
      triggerType: 'instagram_ads',
      setupComplete: true,
    })
    onClose()
  }

  return (
    <div className="flex flex-col">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center text-2xl">
            📢
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Instagram Ads Trigger</h2>
            <p className="text-gray-600 dark:text-gray-400">Send a message to people who click your Instagram ads</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="space-y-6">
          {/* Ad Name Input */}
          <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-5 border border-gray-200 dark:border-gray-700">
            <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-3">
              Automation Name (Optional)
            </label>
            <input
              type="text"
              value={adName}
              onChange={(e) => setAdName(e.target.value)}
              placeholder="e.g., Black Friday Ad Campaign"
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-pink-500 dark:focus:ring-pink-400 focus:border-transparent"
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
              Give this automation a memorable name to identify it in Ads Manager
            </p>
          </div>

          {/* Setup Instructions */}
          <div className="bg-gradient-to-br from-pink-50 to-purple-50 dark:from-pink-900/20 dark:to-purple-900/20 rounded-xl p-6 border border-pink-200 dark:border-pink-800">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <span className="text-xl">📋</span>
              How to set it up:
            </h3>

            <div className="space-y-4">
              {/* Step 1 */}
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-pink-500 text-white flex items-center justify-center font-bold text-sm">
                  1
                </div>
                <div className="flex-1 pt-1">
                  <h4 className="font-bold text-gray-900 dark:text-white mb-1">Save this trigger</h4>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    This connects your ad to your automation.
                  </p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-pink-500 text-white flex items-center justify-center font-bold text-sm">
                  2
                </div>
                <div className="flex-1 pt-1">
                  <h4 className="font-bold text-gray-900 dark:text-white mb-1">Add your welcome message</h4>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    Create the first message users will see after clicking your ad.
                  </p>
                </div>
              </div>

              {/* Important Note */}
              <div className="ml-12 p-4 bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-400 dark:border-yellow-600 rounded-r-lg">
                <div className="flex items-start gap-2">
                  <span className="text-yellow-600 dark:text-yellow-400 font-bold text-sm">⚠️ Important:</span>
                  <p className="text-sm text-yellow-800 dark:text-yellow-300">
                    Include at least one Quick Reply in your first message.
                  </p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-pink-500 text-white flex items-center justify-center font-bold text-sm">
                  3
                </div>
                <div className="flex-1 pt-1">
                  <h4 className="font-bold text-gray-900 dark:text-white mb-1">Turn your automation live</h4>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    Make sure it's active.
                  </p>
                </div>
              </div>

              {/* Step 4 */}
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-pink-500 text-white flex items-center justify-center font-bold text-sm">
                  4
                </div>
                <div className="flex-1 pt-1">
                  <h4 className="font-bold text-gray-900 dark:text-white mb-1">Link it in Ads Manager</h4>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    Choose this automation for your ad.
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-2 italic">
                    Your ad flow will only appear if this trigger is active in your workspace.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Learn More Section */}
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-5 border border-blue-200 dark:border-blue-800">
            <div className="flex items-start gap-3">
              <div className="text-2xl">💡</div>
              <div className="flex-1">
                <h4 className="font-bold text-blue-900 dark:text-blue-200 mb-2">Need help setting up?</h4>
                <p className="text-sm text-blue-800 dark:text-blue-300 mb-3">
                  Check out our comprehensive guide on connecting Instagram ads to your automation flows.
                </p>
                <a
                  href="https://help.example.com/instagram-ads-setup"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm rounded-lg transition-colors"
                >
                  Learn more →
                </a>
              </div>
            </div>
          </div>

          {/* Pro Tips */}
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl p-5 border border-purple-200 dark:border-purple-800">
            <h4 className="font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
              <span className="text-xl">✨</span>
              Pro Tips
            </h4>
            <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
              <li className="flex items-start gap-2">
                <span className="text-purple-500 dark:text-purple-400 font-bold">•</span>
                <span>Use Quick Replies to guide users through your flow and increase engagement</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-500 dark:text-purple-400 font-bold">•</span>
                <span>Keep your first message short and welcoming - you'll have time to share more later</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-500 dark:text-purple-400 font-bold">•</span>
                <span>Test your automation before launching your ad campaign</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-500 dark:text-purple-400 font-bold">•</span>
                <span>Monitor your automation performance and optimize based on user responses</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between items-center mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
        <button
          onClick={onClose}
          className="px-6 py-3 rounded-lg font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        >
          Cancel
        </button>

        <button
          onClick={handleDone}
          className="px-8 py-3 rounded-lg font-semibold bg-gradient-to-r from-pink-500 to-purple-600 text-white hover:from-pink-600 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl flex items-center gap-2"
        >
          Save Trigger ✓
        </button>
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
