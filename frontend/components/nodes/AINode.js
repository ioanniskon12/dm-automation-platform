import { Handle, Position } from 'reactflow'

export default function AINode({ data, isConnectable }) {
  const getAIIcon = (type) => {
    switch (type) {
      case 'ai_response':
        return '🤖'
      case 'ai_fallback':
        return '🛟'
      case 'ai_decision':
        return '🧠'
      default:
        return '✨'
    }
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl border-2 border-violet-500 min-w-[280px] max-w-[320px]">
      {/* Left Handle */}
      <Handle
        type="target"
        position={Position.Left}
        isConnectable={isConnectable}
        className="w-3 h-3 !bg-violet-500"
      />

      {/* Header */}
      <div className="bg-gradient-to-r from-violet-500 to-purple-600 px-4 py-2 flex items-center gap-2">
        <span className="text-2xl">{getAIIcon(data.aiType)}</span>
        <div className="flex-1">
          <div className="text-xs font-bold text-white/90 uppercase tracking-wide flex items-center gap-1.5">
            <span>AI Assistant</span>
            <span className="inline-block w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        <div className="font-bold text-gray-900 dark:text-white text-sm">
          {data.label}
        </div>

        {data.prompt && (
          <div className="bg-violet-50 dark:bg-violet-900/20 rounded-lg p-3 border border-violet-200 dark:border-violet-700">
            <div className="text-xs text-violet-600 dark:text-violet-400 font-semibold mb-1">AI Prompt:</div>
            <div className="text-sm text-gray-700 dark:text-gray-300 line-clamp-3">
              {data.prompt}
            </div>
          </div>
        )}

        <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
          <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
          <span>Powered by AI</span>
        </div>
      </div>

      {/* Right Handle(s) */}
      {data.aiType === 'ai_decision' ? (
        <div className="flex border-t border-gray-200 dark:border-gray-700">
          <div className="flex-1 relative py-2 text-center border-r border-gray-200 dark:border-gray-700">
            <Handle
              type="source"
              position={Position.Right}
              id="route1"
              isConnectable={isConnectable}
              className="!top-[50%] !right-[-6px] w-3 h-3 !bg-yellow-500"
            />
            <div className="text-xs font-bold text-yellow-600 dark:text-yellow-400">
              Route 1
            </div>
          </div>
          <div className="flex-1 relative py-2 text-center">
            <Handle
              type="source"
              position={Position.Right}
              id="route2"
              isConnectable={isConnectable}
              className="!top-[50%] !right-[-6px] w-3 h-3 !bg-orange-500"
            />
            <div className="text-xs font-bold text-orange-600 dark:text-orange-400">
              Route 2
            </div>
          </div>
        </div>
      ) : (
        <Handle
          type="source"
          position={Position.Right}
          isConnectable={isConnectable}
          className="w-3 h-3 !bg-violet-500"
        />
      )}
    </div>
  )
}
