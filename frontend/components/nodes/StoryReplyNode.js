import { Handle, Position } from 'reactflow'

export default function StoryReplyNode({ data, isConnectable }) {
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
        <span className="text-3xl">📖</span>
        <div className="flex-1">
          <div className="text-xs font-bold text-white/90 uppercase tracking-wide">Trigger Start</div>
          <div className="text-sm font-semibold text-white mt-0.5">Story Reply</div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-2">
        {/* Story Selection */}
        <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-3 border border-purple-200 dark:border-purple-700">
          <div className="text-xs text-purple-600 dark:text-purple-400 font-semibold mb-1">Story:</div>
          <div className="text-sm font-bold text-purple-900 dark:text-purple-300">
            {data.storySelection === 'all' ? 'All Stories' : 'Specific Story'}
          </div>
        </div>

        {/* Trigger Type */}
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3 border border-blue-200 dark:border-blue-700">
          <div className="text-xs text-blue-600 dark:text-blue-400 font-semibold mb-1">Trigger:</div>
          <div className="text-sm font-bold text-blue-900 dark:text-blue-300">
            {data.triggerType === 'any' ? (
              'Any reply'
            ) : (
              <>Keywords: "{data.triggerKeywords}"</>
            )}
          </div>
        </div>

        {/* Delay - Only show if there's a delay */}
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

        {/* Auto-react - Only show if enabled */}
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

        <div className="text-xs text-gray-500 dark:text-gray-400">
          This flow starts when someone replies to the story
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
