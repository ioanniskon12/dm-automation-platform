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
    <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-lg border-2 border-violet-500 min-w-[180px] max-w-[220px] overflow-hidden ${data.aiType === 'ai_decision' ? 'flex' : ''}`}>
      {/* Left Handle */}
      <Handle
        type="target"
        position={Position.Left}
        isConnectable={isConnectable}
        className="!w-3 !h-3 !border-2 !border-white !bg-violet-500"
      />

      {/* Main Content */}
      <div className="flex-1">
        {/* Header */}
        <div className={`bg-gradient-to-r from-violet-500 to-purple-600 px-2.5 py-1.5 flex items-center gap-1.5 ${data.aiType === 'ai_decision' ? 'rounded-tl-md' : ''}`}>
          <span className="text-base">{getAIIcon(data.aiType)}</span>
          <div className="flex-1">
            <div className="text-[10px] font-bold text-white/90 uppercase tracking-wide flex items-center gap-1">
              <span>AI</span>
              <span className="inline-block w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-2.5 space-y-2">
          <div className="font-bold text-gray-900 dark:text-white text-xs">
            {data.label}
          </div>

          {/* AI Response node */}
          {data.aiType === 'ai_response' && (
            <>
              {data.prompt && (
                <div className="bg-violet-50 dark:bg-violet-900/20 rounded p-2 border border-violet-200 dark:border-violet-700">
                  <div className="text-[10px] text-violet-600 dark:text-violet-400 font-semibold">Prompt:</div>
                  <div className="text-xs text-gray-700 dark:text-gray-300 line-clamp-2">
                    {data.prompt}
                  </div>
                </div>
              )}
              {!data.prompt && (
                <div className="text-xs text-gray-500 dark:text-gray-400 italic">Not configured</div>
              )}
            </>
          )}

          {/* AI Fallback node */}
          {data.aiType === 'ai_fallback' && (
            <>
              {data.fallbackMessage && (
                <div className="text-xs text-orange-600 dark:text-orange-400 line-clamp-2">{data.fallbackMessage}</div>
              )}
              {!data.prompt && !data.fallbackMessage && (
                <div className="text-xs text-gray-500 dark:text-gray-400 italic">Not configured</div>
              )}
            </>
          )}

          {/* AI Decision Router node */}
          {data.aiType === 'ai_decision' && (
            <>
              {!data.route1Label && !data.route2Label && (
                <div className="text-xs text-gray-500 dark:text-gray-400 italic">Not configured</div>
              )}
              {(data.route1Label || data.route2Label) && (
                <div className="text-[10px] text-violet-600 dark:text-violet-400">Routes configured</div>
              )}
            </>
          )}

          {/* Legacy prompt display for unknown aiTypes */}
          {!['ai_response', 'ai_fallback', 'ai_decision'].includes(data.aiType) && data.prompt && (
            <div className="text-xs text-gray-700 dark:text-gray-300 line-clamp-2">{data.prompt}</div>
          )}
        </div>
      </div>

      {/* Right Handle(s) */}
      {data.aiType === 'ai_decision' ? (
        <div className="flex flex-col border-l border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 rounded-r-md">
          {/* Route 1 */}
          <div className="flex-1 flex items-center justify-center px-2 py-3 border-b border-gray-200 dark:border-gray-700 relative">
            <span className="text-[10px] font-bold text-yellow-600 dark:text-yellow-400">R1</span>
            <Handle
              type="source"
              position={Position.Right}
              id="route1"
              isConnectable={isConnectable}
              className="!absolute !right-[-5px] !top-1/2 !-translate-y-1/2 w-2.5 h-2.5 !bg-yellow-500"
            />
          </div>
          {/* Route 2 */}
          <div className="flex-1 flex items-center justify-center px-2 py-3 relative">
            <span className="text-[10px] font-bold text-orange-600 dark:text-orange-400">R2</span>
            <Handle
              type="source"
              position={Position.Right}
              id="route2"
              isConnectable={isConnectable}
              className="!absolute !right-[-5px] !top-1/2 !-translate-y-1/2 w-2.5 h-2.5 !bg-orange-500"
            />
          </div>
        </div>
      ) : (
        <Handle
          type="source"
          position={Position.Right}
          isConnectable={isConnectable}
          className="!w-3 !h-3 !border-2 !border-white !bg-violet-500"
        />
      )}
    </div>
  )
}
