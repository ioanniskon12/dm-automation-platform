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
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border-2 border-purple-500 min-w-[180px] max-w-[220px] overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-500 to-pink-500 px-2.5 py-1.5 flex items-center gap-2">
        <span className="text-lg">{getTriggerIcon(data.triggerType)}</span>
        <div className="flex-1">
          <div className="text-[10px] font-bold text-white/90 uppercase tracking-wide">Trigger</div>
          <div className="text-xs font-semibold text-white">{data.label}</div>
        </div>
      </div>

      {/* Content */}
      <div className="p-2.5 space-y-1.5">
        {data.selectedPost && (
          <div className="mb-1.5">
            <img
              src={data.selectedPost.image}
              alt="Post"
              className="w-full h-20 object-cover rounded"
            />
          </div>
        )}

        {data.keyword && (
          <div className="bg-purple-50 dark:bg-purple-900/20 rounded p-2 border border-purple-200 dark:border-purple-700">
            <div className="text-[10px] text-purple-600 dark:text-purple-400 font-semibold">Keyword:</div>
            <div className="text-xs font-bold text-purple-900 dark:text-purple-300 truncate">
              "{data.keyword}"
            </div>
          </div>
        )}

        {data.replyType === 'ai' && (
          <div className="text-[10px] text-violet-600 dark:text-violet-400 font-semibold">💡 AI Reply</div>
        )}

        {data.replyType === 'rotating' && (
          <div className="text-[10px] text-blue-600 dark:text-blue-400 font-semibold">🔄 Rotating</div>
        )}

        {/* Story Reply Specific */}
        {data.triggerType === 'story_reply' && data.storySelection && (
          <>
            <div className="text-[10px] text-purple-600 dark:text-purple-400">
              {data.storySelection === 'all' ? 'All Stories' : 'Specific Story'}
            </div>
            {data.replyDelay > 0 && (
              <div className="text-[10px] text-orange-600 dark:text-orange-400">⏱️ {formatDelay(data.replyDelay)}</div>
            )}
            {data.autoReact && (
              <div className="text-[10px] text-pink-600 dark:text-pink-400">❤️ Auto-react</div>
            )}
          </>
        )}

        {/* Instagram Message Specific */}
        {data.triggerType === 'instagram_message' && data.messageType && (
          <>
            <div className="text-[10px] text-blue-600 dark:text-blue-400">
              {data.messageType === 'any' ? 'Any message' : data.messageType === 'keyword' ? 'Keywords' : 'AI intent'}
            </div>
            {data.keywords && (
              <div className="text-[10px] text-purple-600 dark:text-purple-400 truncate">"{data.keywords}"</div>
            )}
            {data.replyDelay > 0 && (
              <div className="text-[10px] text-orange-600 dark:text-orange-400">⏱️ {formatDelay(data.replyDelay)}</div>
            )}
          </>
        )}

        {/* Instagram Ads Specific */}
        {data.triggerType === 'instagram_ads' && data.adName && (
          <div className="text-[10px] text-pink-600 dark:text-pink-400 truncate">{data.adName}</div>
        )}

        {/* Instagram Shares Specific */}
        {data.triggerType === 'instagram_shares' && data.shareType && (
          <div className="text-[10px] text-cyan-600 dark:text-cyan-400">
            {data.shareType === 'any' ? 'Any post/reel' : 'Specific'}
          </div>
        )}

        {/* Live Comments Specific */}
        {data.triggerType === 'live_comments' && data.liveCommentMode && (
          <div className="text-[10px] text-red-600 dark:text-red-400">
            {data.liveCommentMode === 'any' ? 'Any comment' : 'Keywords'}
          </div>
        )}

        {/* Instagram Ref URL Specific */}
        {data.triggerType === 'instagram_ref_url' && data.refParameter && (
          <div className="text-[10px] text-indigo-600 dark:text-indigo-400 truncate">{data.refParameter}</div>
        )}

        {/* Story Mention Specific */}
        {data.triggerType === 'story_mention' && data.triggerFrequency && (
          <>
            <div className="text-[10px] text-purple-600 dark:text-purple-400">
              {data.triggerFrequency === 'every_time' ? 'Every mention' : 'Once/24h'}
            </div>
            {data.autoLike && <div className="text-[10px] text-pink-600 dark:text-pink-400">❤️ Auto-like</div>}
          </>
        )}

        {/* New Follower Specific */}
        {data.triggerType === 'new_follower' && data.followerReplyType && (
          <>
            <div className="text-[10px] text-green-600 dark:text-green-400">
              {data.followerReplyType === 'ai' ? '🤖 AI' : data.followerReplyType === 'predefined' ? '💬 Preset' : '🔄 Rotating'}
            </div>
            {data.askForEmail && <div className="text-[10px] text-blue-600 dark:text-blue-400">📧 Email</div>}
          </>
        )}
      </div>

      {/* Right Handle */}
      <Handle
        type="source"
        position={Position.Right}
        isConnectable={isConnectable}
        className="!w-3 !h-3 !border-2 !border-white !bg-purple-500"
      />
    </div>
  )
}
