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

        {/* AI Response node */}
        {data.aiType === 'ai_response' && (
          <>
            {data.prompt && (
              <div className="bg-violet-50 dark:bg-violet-900/20 rounded-lg p-3 border border-violet-200 dark:border-violet-700">
                <div className="text-xs text-violet-600 dark:text-violet-400 font-semibold mb-1">AI Prompt:</div>
                <div className="text-sm text-gray-700 dark:text-gray-300 line-clamp-3">
                  {data.prompt}
                </div>
              </div>
            )}
            {data.model && (
              <div className="text-xs">
                <span className="text-violet-600 dark:text-violet-400 font-semibold">Model:</span>
                <span className="text-gray-700 dark:text-gray-300 ml-1">{data.model}</span>
              </div>
            )}
            {data.temperature !== undefined && (
              <div className="text-xs">
                <span className="text-violet-600 dark:text-violet-400 font-semibold">Temperature:</span>
                <span className="text-gray-700 dark:text-gray-300 ml-1">{data.temperature}</span>
              </div>
            )}
            {!data.prompt && (
              <div className="bg-violet-50 dark:bg-violet-900/20 rounded-lg p-3 border border-violet-200 dark:border-violet-700">
                <div className="text-sm text-gray-500 dark:text-gray-400 italic">
                  Not configured
                </div>
              </div>
            )}
          </>
        )}

        {/* AI Fallback node */}
        {data.aiType === 'ai_fallback' && (
          <>
            {data.prompt && (
              <div className="bg-violet-50 dark:bg-violet-900/20 rounded-lg p-3 border border-violet-200 dark:border-violet-700">
                <div className="text-xs text-violet-600 dark:text-violet-400 font-semibold mb-1">Fallback Prompt:</div>
                <div className="text-sm text-gray-700 dark:text-gray-300 line-clamp-3">
                  {data.prompt}
                </div>
              </div>
            )}
            {data.fallbackMessage && (
              <div className="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-3 border border-orange-200 dark:border-orange-700">
                <div className="text-xs text-orange-600 dark:text-orange-400 font-semibold mb-1">Fallback Message:</div>
                <div className="text-sm text-gray-700 dark:text-gray-300 line-clamp-2">
                  {data.fallbackMessage}
                </div>
              </div>
            )}
            {data.maxRetries && (
              <div className="text-xs">
                <span className="text-violet-600 dark:text-violet-400 font-semibold">Max Retries:</span>
                <span className="text-gray-700 dark:text-gray-300 ml-1">{data.maxRetries}</span>
              </div>
            )}
            {!data.prompt && !data.fallbackMessage && (
              <div className="bg-violet-50 dark:bg-violet-900/20 rounded-lg p-3 border border-violet-200 dark:border-violet-700">
                <div className="text-sm text-gray-500 dark:text-gray-400 italic">
                  Not configured
                </div>
              </div>
            )}
          </>
        )}

        {/* AI Decision Router node */}
        {data.aiType === 'ai_decision' && (
          <>
            {data.prompt && (
              <div className="bg-violet-50 dark:bg-violet-900/20 rounded-lg p-3 border border-violet-200 dark:border-violet-700">
                <div className="text-xs text-violet-600 dark:text-violet-400 font-semibold mb-1">Decision Prompt:</div>
                <div className="text-sm text-gray-700 dark:text-gray-300 line-clamp-3">
                  {data.prompt}
                </div>
              </div>
            )}
            <div className="space-y-2">
              {data.route1Label && (
                <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-2 border border-yellow-200 dark:border-yellow-700">
                  <div className="text-xs">
                    <span className="text-yellow-600 dark:text-yellow-400 font-semibold">Route 1:</span>
                    <span className="text-gray-700 dark:text-gray-300 ml-1">{data.route1Label}</span>
                  </div>
                  {data.route1Description && (
                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-1">
                      {data.route1Description}
                    </div>
                  )}
                </div>
              )}
              {data.route2Label && (
                <div className="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-2 border border-orange-200 dark:border-orange-700">
                  <div className="text-xs">
                    <span className="text-orange-600 dark:text-orange-400 font-semibold">Route 2:</span>
                    <span className="text-gray-700 dark:text-gray-300 ml-1">{data.route2Label}</span>
                  </div>
                  {data.route2Description && (
                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-1">
                      {data.route2Description}
                    </div>
                  )}
                </div>
              )}
            </div>
            {!data.prompt && !data.route1Label && !data.route2Label && (
              <div className="bg-violet-50 dark:bg-violet-900/20 rounded-lg p-3 border border-violet-200 dark:border-violet-700">
                <div className="text-sm text-gray-500 dark:text-gray-400 italic">
                  Not configured
                </div>
              </div>
            )}
          </>
        )}

        {/* Legacy prompt display for unknown aiTypes */}
        {!['ai_response', 'ai_fallback', 'ai_decision'].includes(data.aiType) && data.prompt && (
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
