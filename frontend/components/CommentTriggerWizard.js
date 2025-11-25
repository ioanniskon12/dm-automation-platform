'use client'

import { useState } from 'react'

export default function CommentTriggerWizard({ node, onUpdate, onClose, isPro = false }) {
  const [step, setStep] = useState(1)
  const [selectedPost, setSelectedPost] = useState(node.data.selectedPost || null)
  const [triggerMode, setTriggerMode] = useState(node.data.triggerMode || 'keywords')
  const [keywords, setKeywords] = useState(node.data.keyword || '')
  const [enablePublicReply, setEnablePublicReply] = useState(node.data.enablePublicReply !== false)
  const [replyMessages, setReplyMessages] = useState(node.data.commentReply || '')

  // Mock Instagram posts/reels data
  const mockPosts = [
    { id: '1', type: 'post', image: 'https://picsum.photos/400/400?random=1', caption: 'Check out our new product launch! 🚀 Limited time offer!', likes: '2.4k', comments: '156' },
    { id: '2', type: 'reel', image: 'https://picsum.photos/400/400?random=2', caption: 'Behind the scenes of our latest shoot 📸 ✨', likes: '5.2k', comments: '289' },
    { id: '3', type: 'post', image: 'https://picsum.photos/400/400?random=3', caption: 'Summer sale is now live! Get 30% off 🌞', likes: '3.8k', comments: '234' },
    { id: '4', type: 'reel', image: 'https://picsum.photos/400/400?random=4', caption: 'Customer testimonial: "Best service ever!" ⭐', likes: '4.1k', comments: '178' },
    { id: '5', type: 'post', image: 'https://picsum.photos/400/400?random=5', caption: 'Join us for our webinar next week! Limited spots', likes: '1.9k', comments: '92' },
    { id: '6', type: 'reel', image: 'https://picsum.photos/400/400?random=6', caption: 'Quick tutorial on how to use our app 🎯', likes: '6.3k', comments: '412' },
  ]

  const handleNext = () => {
    if (step === 1 && !selectedPost) {
      alert('Please select a post or choose "All Posts" / "Next Post"')
      return
    }
    if (step === 2 && triggerMode === 'keywords' && !keywords.trim()) {
      alert('Please enter at least one keyword')
      return
    }
    if (step < 3) {
      setStep(step + 1)
    }
  }

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1)
    }
  }

  const handleDone = () => {
    // Save all the configuration
    onUpdate(node.id, {
      selectedPost,
      triggerMode,
      keyword: keywords,
      enablePublicReply,
      commentReply: enablePublicReply ? replyMessages : '',
    })
    onClose()
  }

  const progressPercentage = (step / 3) * 100

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
              3
            </div>
          </div>
          <span className="text-sm text-gray-600 dark:text-gray-400 font-medium">Step {step} of 3</span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>

      {/* Step Content */}
      <div className="flex-1 overflow-y-auto">
        {/* STEP 1: Pick a Post or Reel */}
        {step === 1 && (
          <div className="space-y-6 animate-fadeIn">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Pick a Post or Reel</h2>
              <p className="text-gray-600 dark:text-gray-400">Choose which Instagram content should trigger the DM automation</p>
            </div>

            {/* Pro Options */}
            {isPro && (
              <div className="grid grid-cols-2 gap-3 mb-4">
                <button
                  onClick={() => setSelectedPost({ id: 'all', type: 'special', caption: 'All Posts', image: null })}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    selectedPost?.id === 'all'
                      ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                      : 'border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-700'
                  }`}
                >
                  <div className="text-3xl mb-2">🌟</div>
                  <div className="font-semibold text-gray-900 dark:text-white">All Posts</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">Works on every post</div>
                </button>
                <button
                  onClick={() => setSelectedPost({ id: 'next', type: 'special', caption: 'Next Post', image: null })}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    selectedPost?.id === 'next'
                      ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                      : 'border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-700'
                  }`}
                >
                  <div className="text-3xl mb-2">✨</div>
                  <div className="font-semibold text-gray-900 dark:text-white">Next Post</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">Your next publish</div>
                </button>
              </div>
            )}

            {/* Posts Grid */}
            <div className="grid grid-cols-2 gap-4">
              {mockPosts.map((post) => (
                <button
                  key={post.id}
                  onClick={() => setSelectedPost(post)}
                  className={`group relative rounded-xl overflow-hidden border-3 transition-all ${
                    selectedPost?.id === post.id
                      ? 'border-purple-500 ring-4 ring-purple-200 dark:ring-purple-900/50'
                      : 'border-transparent hover:border-purple-300 dark:hover:border-purple-700'
                  }`}
                >
                  <div className="aspect-square relative">
                    <img
                      src={post.image}
                      alt={post.caption}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent">
                      <div className="absolute top-2 right-2">
                        <span className="px-2 py-1 rounded-full bg-black/50 text-white text-xs font-semibold backdrop-blur-sm">
                          {post.type === 'reel' ? '🎬 Reel' : '📸 Post'}
                        </span>
                      </div>
                      <div className="absolute bottom-0 left-0 right-0 p-3">
                        <div className="text-white text-xs line-clamp-2 mb-2">{post.caption}</div>
                        <div className="flex gap-3 text-white/80 text-xs">
                          <span>❤️ {post.likes}</span>
                          <span>💬 {post.comments}</span>
                        </div>
                      </div>
                    </div>
                    {selectedPost?.id === post.id && (
                      <div className="absolute inset-0 flex items-center justify-center bg-purple-500/20">
                        <div className="w-12 h-12 rounded-full bg-purple-500 flex items-center justify-center">
                          <span className="text-white text-2xl">✓</span>
                        </div>
                      </div>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* STEP 2: Choose what kind of comment starts the DM */}
        {step === 2 && (
          <div className="space-y-6 animate-fadeIn">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">When should the DM start?</h2>
              <p className="text-gray-600 dark:text-gray-400">Choose what kind of comments should trigger the automation</p>
            </div>

            <div className="space-y-3">
              <button
                onClick={() => setTriggerMode('keywords')}
                className={`w-full p-5 rounded-xl border-2 transition-all text-left ${
                  triggerMode === 'keywords'
                    ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                    : 'border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-700'
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className="text-3xl">🔑</div>
                  <div className="flex-1">
                    <div className="font-bold text-gray-900 dark:text-white mb-1">Specific Keywords</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      Trigger when comment contains specific words like "info", "price", etc.
                    </div>
                  </div>
                  {triggerMode === 'keywords' && (
                    <div className="w-6 h-6 rounded-full bg-purple-500 flex items-center justify-center flex-shrink-0">
                      <span className="text-white text-sm">✓</span>
                    </div>
                  )}
                </div>
              </button>

              <button
                onClick={() => setTriggerMode('any')}
                className={`w-full p-5 rounded-xl border-2 transition-all text-left ${
                  triggerMode === 'any'
                    ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                    : 'border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-700'
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className="text-3xl">💬</div>
                  <div className="flex-1">
                    <div className="font-bold text-gray-900 dark:text-white mb-1">Any comment</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      Trigger for every comment on the selected post
                    </div>
                  </div>
                  {triggerMode === 'any' && (
                    <div className="w-6 h-6 rounded-full bg-purple-500 flex items-center justify-center flex-shrink-0">
                      <span className="text-white text-sm">✓</span>
                    </div>
                  )}
                </div>
              </button>
            </div>

            {/* Keywords Input */}
            {triggerMode === 'keywords' && (
              <div className="mt-4 p-5 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700">
                <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-3">
                  Enter Keywords (one per line)
                </label>
                <textarea
                  value={keywords}
                  onChange={(e) => setKeywords(e.target.value)}
                  placeholder="info&#10;price&#10;interested&#10;dm me&#10;details"
                  rows={5}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400 focus:border-transparent"
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                  💡 Pro tip: Add common variations like "info", "information", "details"
                </p>
              </div>
            )}
          </div>
        )}

        {/* STEP 3: Set Up Public Reply */}
        {step === 3 && (
          <div className="space-y-6 animate-fadeIn">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Set Up Public Reply</h2>
              <p className="text-gray-600 dark:text-gray-400">Do you want to automatically reply under the comment?</p>
            </div>

            {/* Yes/No Selection */}
            <div className="space-y-3">
              <button
                onClick={() => setEnablePublicReply(true)}
                className={`w-full p-5 rounded-xl border-2 transition-all text-left ${
                  enablePublicReply
                    ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                    : 'border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-700'
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className="text-3xl">✅</div>
                  <div className="flex-1">
                    <div className="font-bold text-gray-900 dark:text-white mb-1">Yes, reply publicly</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      Automatically reply under comments that match
                    </div>
                  </div>
                  {enablePublicReply && (
                    <div className="w-6 h-6 rounded-full bg-purple-500 flex items-center justify-center flex-shrink-0">
                      <span className="text-white text-sm">✓</span>
                    </div>
                  )}
                </div>
              </button>

              <button
                onClick={() => setEnablePublicReply(false)}
                className={`w-full p-5 rounded-xl border-2 transition-all text-left ${
                  !enablePublicReply
                    ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                    : 'border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-700'
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className="text-3xl">⏭️</div>
                  <div className="flex-1">
                    <div className="font-bold text-gray-900 dark:text-white mb-1">No, skip public reply</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      Only send a DM, don't reply publicly
                    </div>
                  </div>
                  {!enablePublicReply && (
                    <div className="w-6 h-6 rounded-full bg-purple-500 flex items-center justify-center flex-shrink-0">
                      <span className="text-white text-sm">✓</span>
                    </div>
                  )}
                </div>
              </button>
            </div>

            {/* Reply Messages (shown only if Yes is selected) */}
            {enablePublicReply && (
              <div className="p-5 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl border border-purple-200 dark:border-purple-800">
                <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-3">
                  Reply Messages (one per line)
                </label>
                <textarea
                  value={replyMessages}
                  onChange={(e) => setReplyMessages(e.target.value)}
                  placeholder="Thanks! Check your inbox 👋&#10;Sent you a message! 📨&#10;DM on the way! ✉️&#10;Check your DMs 💌"
                  rows={5}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400 focus:border-transparent"
                />
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">
                  💡 Add multiple messages (one per line) for variety — we'll rotate through them automatically
                </p>
              </div>
            )}
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
          {step < 3 ? (
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

