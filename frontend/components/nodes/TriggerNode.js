import { Handle, Position } from 'reactflow'

export default function TriggerNode({ data, isConnectable }) {
  const getTriggerIcon = (type) => {
    switch (type) {
      case 'story_reply':
        return '📖'
      case 'story_mention':
        return '📣'
      case 'keyword_comment':
        return '💬'
      case 'instagram_message':
        return '📨'
      case 'instagram_shares':
        return '🔄'
      case 'instagram_ads':
        return '📢'
      case 'live_comments':
        return '🎥'
      case 'instagram_ref_url':
        return '🔗'
      case 'new_follower':
        return '👤'
      default:
        return '⚡'
    }
  }

  const formatDelay = (seconds) => {
    if (seconds === 0) return 'No delay'
    if (seconds < 60) return `${seconds}s delay`
    const minutes = Math.floor(seconds / 60)
    return `${minutes}min delay`
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl border-2 border-purple-500 min-w-[280px] max-w-[320px]">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-500 to-pink-500 px-4 py-3 flex items-center gap-3">
        <span className="text-3xl">{getTriggerIcon(data.triggerType)}</span>
        <div className="flex-1">
          <div className="text-xs font-bold text-white/90 uppercase tracking-wide">Trigger Start</div>
          <div className="text-sm font-semibold text-white mt-0.5">{data.label}</div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-2">
        {data.selectedPost && (
          <div className="mb-2">
            <img
              src={data.selectedPost.image}
              alt="Post"
              className="w-full h-32 object-cover rounded-lg"
            />
            <div className="mt-2 bg-purple-50 dark:bg-purple-900/20 rounded-lg p-2 border border-purple-200 dark:border-purple-700">
              <div className="text-xs text-purple-900 dark:text-purple-300 line-clamp-2">
                {data.selectedPost.caption}
              </div>
            </div>
          </div>
        )}

        {data.keyword && (
          <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-3 border border-purple-200 dark:border-purple-700">
            <div className="text-xs text-purple-600 dark:text-purple-400 font-semibold mb-1">Keyword:</div>
            <div className="text-sm font-bold text-purple-900 dark:text-purple-300">
              "{data.keyword}"
            </div>
          </div>
        )}

        {data.commentReply && data.replyType === 'predefined' && (
          <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-2 border border-green-200 dark:border-green-700">
            <div className="text-xs text-green-600 dark:text-green-400 font-semibold mb-1">Comment Reply:</div>
            <div className="text-xs text-green-900 dark:text-green-300 line-clamp-2">
              {data.commentReply}
            </div>
          </div>
        )}

        {data.replyType === 'ai' && (
          <div className="bg-violet-50 dark:bg-violet-900/20 rounded-lg p-2 border border-violet-200 dark:border-violet-700">
            <div className="text-xs text-violet-600 dark:text-violet-400 font-semibold">💡 AI Reply Enabled</div>
          </div>
        )}

        {data.replyType === 'rotating' && (
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-2 border border-blue-200 dark:border-blue-700">
            <div className="text-xs text-blue-600 dark:text-blue-400 font-semibold">🔄 Rotating Replies</div>
          </div>
        )}

        {/* Story Reply Specific */}
        {data.triggerType === 'story_reply' && data.storySelection && (
          <>
            <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-3 border border-purple-200 dark:border-purple-700">
              <div className="text-xs text-purple-600 dark:text-purple-400 font-semibold mb-1">Story:</div>
              <div className="text-sm font-bold text-purple-900 dark:text-purple-300">
                {data.storySelection === 'all' ? 'All Stories' : 'Specific Story'}
              </div>
            </div>

            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3 border border-blue-200 dark:border-blue-700">
              <div className="text-xs text-blue-600 dark:text-blue-400 font-semibold mb-1">Trigger:</div>
              <div className="text-sm font-bold text-blue-900 dark:text-blue-300">
                {data.triggerType === 'any' ? 'Any reply' : `Keywords: "${data.triggerKeywords}"`}
              </div>
            </div>

            {data.replyDelay > 0 && (
              <div className="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-2 border border-orange-200 dark:border-orange-700">
                <div className="flex items-center gap-2">
                  <span className="text-sm">⏱️</span>
                  <div className="text-xs text-orange-900 dark:text-orange-300 font-semibold">
                    {formatDelay(data.replyDelay)}
                  </div>
                </div>
              </div>
            )}

            {data.autoReact && (
              <div className="bg-pink-50 dark:bg-pink-900/20 rounded-lg p-2 border border-pink-200 dark:border-pink-700">
                <div className="flex items-center gap-2">
                  <span className="text-sm">❤️</span>
                  <div className="text-xs text-pink-900 dark:text-pink-300 font-semibold">
                    Auto-react enabled
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        {/* Instagram Message Specific */}
        {data.triggerType === 'instagram_message' && data.messageType && (
          <>
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3 border border-blue-200 dark:border-blue-700">
              <div className="text-xs text-blue-600 dark:text-blue-400 font-semibold mb-1">Mode:</div>
              <div className="text-sm font-bold text-blue-900 dark:text-blue-300">
                {data.messageType === 'any' ? 'Any message' : data.messageType === 'keyword' ? 'Specific keywords' : 'AI intent'}
              </div>
            </div>

            {data.keywords && (
              <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-3 border border-purple-200 dark:border-purple-700">
                <div className="text-xs text-purple-600 dark:text-purple-400 font-semibold mb-1">Keywords:</div>
                <div className="text-sm font-bold text-purple-900 dark:text-purple-300">
                  "{data.keywords}"
                </div>
              </div>
            )}

            {data.replyDelay > 0 && (
              <div className="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-2 border border-orange-200 dark:border-orange-700">
                <div className="flex items-center gap-2">
                  <span className="text-sm">⏱️</span>
                  <div className="text-xs text-orange-900 dark:text-orange-300 font-semibold">
                    {formatDelay(data.replyDelay)}
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        {/* Instagram Ads Specific */}
        {data.triggerType === 'instagram_ads' && data.adName && (
          <div className="bg-pink-50 dark:bg-pink-900/20 rounded-lg p-3 border border-pink-200 dark:border-pink-700">
            <div className="text-xs text-pink-600 dark:text-pink-400 font-semibold mb-1">Campaign:</div>
            <div className="text-sm font-bold text-pink-900 dark:text-pink-300">
              {data.adName}
            </div>
          </div>
        )}

        {/* Instagram Shares Specific */}
        {data.triggerType === 'instagram_shares' && data.shareType && (
          <div className="bg-cyan-50 dark:bg-cyan-900/20 rounded-lg p-3 border border-cyan-200 dark:border-cyan-700">
            <div className="text-xs text-cyan-600 dark:text-cyan-400 font-semibold mb-1">Share Type:</div>
            <div className="text-sm font-bold text-cyan-900 dark:text-cyan-300">
              {data.shareType === 'any' ? 'Any post/reel' : 'Specific content'}
            </div>
          </div>
        )}

        {/* Live Comments Specific */}
        {data.triggerType === 'live_comments' && data.liveCommentMode && (
          <>
            <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-3 border border-red-200 dark:border-red-700">
              <div className="text-xs text-red-600 dark:text-red-400 font-semibold mb-1">Trigger On:</div>
              <div className="text-sm font-bold text-red-900 dark:text-red-300">
                {data.liveCommentMode === 'any' ? 'Any comment' : 'Specific keywords'}
              </div>
            </div>

            {data.liveKeywords && (
              <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-3 border border-purple-200 dark:border-purple-700">
                <div className="text-xs text-purple-600 dark:text-purple-400 font-semibold mb-1">Keywords:</div>
                <div className="text-sm font-bold text-purple-900 dark:text-purple-300">
                  "{data.liveKeywords}"
                </div>
              </div>
            )}
          </>
        )}

        {/* Instagram Ref URL Specific */}
        {data.triggerType === 'instagram_ref_url' && data.refParameter && (
          <div className="bg-indigo-50 dark:bg-indigo-900/20 rounded-lg p-3 border border-indigo-200 dark:border-indigo-700">
            <div className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold mb-1">Ref Parameter:</div>
            <div className="text-sm font-bold text-indigo-900 dark:text-indigo-300">
              {data.refParameter}
            </div>
          </div>
        )}

        {/* Story Mention Specific */}
        {data.triggerType === 'story_mention' && data.triggerFrequency && (
          <>
            <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-3 border border-purple-200 dark:border-purple-700">
              <div className="text-xs text-purple-600 dark:text-purple-400 font-semibold mb-1">Frequency:</div>
              <div className="text-sm font-bold text-purple-900 dark:text-purple-300">
                {data.triggerFrequency === 'every_time' ? 'Every mention' : 'Once per 24h'}
              </div>
            </div>

            {data.replyDelay > 0 && (
              <div className="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-2 border border-orange-200 dark:border-orange-700">
                <div className="flex items-center gap-2">
                  <span className="text-sm">⏱️</span>
                  <div className="text-xs text-orange-900 dark:text-orange-300 font-semibold">
                    {data.replyDelay} {data.delayUnit} delay
                  </div>
                </div>
              </div>
            )}

            {data.autoLike && (
              <div className="bg-pink-50 dark:bg-pink-900/20 rounded-lg p-2 border border-pink-200 dark:border-pink-700">
                <div className="flex items-center gap-2">
                  <span className="text-sm">❤️</span>
                  <div className="text-xs text-pink-900 dark:text-pink-300 font-semibold">
                    Auto-like enabled
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        {/* New Follower Specific */}
        {data.triggerType === 'new_follower' && data.followerReplyType && (
          <>
            <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-3 border border-green-200 dark:border-green-700">
              <div className="text-xs text-green-600 dark:text-green-400 font-semibold mb-1">Reply Type:</div>
              <div className="text-sm font-bold text-green-900 dark:text-green-300">
                {data.followerReplyType === 'ai' ? '🤖 AI Reply' :
                 data.followerReplyType === 'predefined' ? '💬 Predefined Message' :
                 '🔄 Rotating Replies'}
              </div>
            </div>

            {data.askForEmail && (
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-2 border border-blue-200 dark:border-blue-700">
                <div className="flex items-center gap-2">
                  <span className="text-sm">📧</span>
                  <div className="text-xs text-blue-900 dark:text-blue-300 font-semibold">
                    Email collection enabled
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        <div className="text-xs text-gray-500 dark:text-gray-400">
          This flow starts when the trigger condition is met
        </div>
      </div>

      {/* Right Handle */}
      <Handle
        type="source"
        position={Position.Right}
        isConnectable={isConnectable}
        className="w-3 h-3 !bg-purple-500"
      />
    </div>
  )
}
