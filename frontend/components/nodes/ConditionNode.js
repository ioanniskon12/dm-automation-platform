import { Handle, Position } from 'reactflow'

export default function ConditionNode({ data, isConnectable }) {
  const getConditionIcon = (type) => {
    switch (type) {
      case 'is_follower':
        return '👥'
      case 'has_interacted':
        return '🔄'
      case 'time_based':
        return '⏰'
      case 'custom_field':
        return '📋'
      default:
        return '❓'
    }
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl border-2 border-blue-500 min-w-[280px] max-w-[320px]">
      {/* Left Handle */}
      <Handle
        type="target"
        position={Position.Left}
        isConnectable={isConnectable}
        className="w-3 h-3 !bg-blue-500"
      />

      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 to-cyan-500 px-4 py-2 flex items-center gap-2">
        <span className="text-2xl">{getConditionIcon(data.conditionType)}</span>
        <div className="flex-1">
          <div className="text-xs font-bold text-white/90 uppercase tracking-wide">Condition</div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="font-bold text-gray-900 dark:text-white text-sm mb-3">
          {data.label}
        </div>

        {/* Is Follower condition */}
        {data.conditionType === 'is_follower' && (
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3 border border-blue-200 dark:border-blue-700">
            <div className="text-xs text-blue-600 dark:text-blue-400 font-semibold mb-1">Check:</div>
            <div className="text-sm text-gray-700 dark:text-gray-300">
              Is user following this account?
            </div>
          </div>
        )}

        {/* Has Interacted condition */}
        {data.conditionType === 'has_interacted' && (
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3 border border-blue-200 dark:border-blue-700 space-y-2">
            <div className="text-xs text-blue-600 dark:text-blue-400 font-semibold">Check:</div>
            <div className="text-sm text-gray-700 dark:text-gray-300">
              Has user interacted before?
            </div>
            {data.interactionType && (
              <div className="text-xs">
                <span className="text-blue-600 dark:text-blue-400 font-semibold">Type:</span>
                <span className="text-gray-700 dark:text-gray-300 ml-1">{data.interactionType}</span>
              </div>
            )}
            {data.timeframe && (
              <div className="text-xs">
                <span className="text-blue-600 dark:text-blue-400 font-semibold">Within:</span>
                <span className="text-gray-700 dark:text-gray-300 ml-1">{data.timeframe}</span>
              </div>
            )}
          </div>
        )}

        {/* Time-Based condition */}
        {data.conditionType === 'time_based' && (
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3 border border-blue-200 dark:border-blue-700 space-y-2">
            <div className="text-xs text-blue-600 dark:text-blue-400 font-semibold">Schedule:</div>
            {data.scheduleType && (
              <div className="text-xs">
                <span className="text-blue-600 dark:text-blue-400 font-semibold">Type:</span>
                <span className="text-gray-700 dark:text-gray-300 ml-1">{data.scheduleType}</span>
              </div>
            )}
            {data.startTime && (
              <div className="text-xs">
                <span className="text-blue-600 dark:text-blue-400 font-semibold">From:</span>
                <span className="text-gray-700 dark:text-gray-300 ml-1">{data.startTime}</span>
              </div>
            )}
            {data.endTime && (
              <div className="text-xs">
                <span className="text-blue-600 dark:text-blue-400 font-semibold">To:</span>
                <span className="text-gray-700 dark:text-gray-300 ml-1">{data.endTime}</span>
              </div>
            )}
            {data.days && data.days.length > 0 && (
              <div className="text-xs">
                <span className="text-blue-600 dark:text-blue-400 font-semibold">Days:</span>
                <span className="text-gray-700 dark:text-gray-300 ml-1">{data.days.join(', ')}</span>
              </div>
            )}
            {data.timezone && (
              <div className="text-xs">
                <span className="text-blue-600 dark:text-blue-400 font-semibold">Timezone:</span>
                <span className="text-gray-700 dark:text-gray-300 ml-1">{data.timezone}</span>
              </div>
            )}
            {!data.scheduleType && !data.startTime && !data.endTime && (
              <div className="text-sm text-gray-500 dark:text-gray-400 italic">
                Not configured
              </div>
            )}
          </div>
        )}

        {/* Custom Field condition */}
        {data.conditionType === 'custom_field' && (
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3 border border-blue-200 dark:border-blue-700">
            <div className="text-xs text-blue-600 dark:text-blue-400 font-semibold mb-1">Custom Field Check:</div>
            {(data.fieldName || data.fieldCondition) ? (
              <div className="space-y-1">
                {data.fieldName && (
                  <div className="text-xs">
                    <span className="text-blue-600 dark:text-blue-400 font-semibold">Field:</span>
                    <span className="text-gray-700 dark:text-gray-300 ml-1">{data.fieldName}</span>
                  </div>
                )}
                {data.fieldCondition && (
                  <div className="text-xs">
                    <span className="text-blue-600 dark:text-blue-400 font-semibold">Condition:</span>
                    <span className="text-gray-700 dark:text-gray-300 ml-1">{data.fieldCondition}</span>
                  </div>
                )}
                {data.fieldValue && (
                  <div className="text-xs">
                    <span className="text-blue-600 dark:text-blue-400 font-semibold">Value:</span>
                    <span className="text-gray-700 dark:text-gray-300 ml-1">"{data.fieldValue}"</span>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-sm text-gray-500 dark:text-gray-400 italic">
                Not configured
              </div>
            )}
          </div>
        )}
      </div>

      {/* Branch Handles */}
      <div className="flex border-t border-gray-200 dark:border-gray-700">
        <div className="flex-1 relative py-2 text-center border-r border-gray-200 dark:border-gray-700">
          <Handle
            type="source"
            position={Position.Right}
            id="yes"
            isConnectable={isConnectable}
            className="!top-[50%] !right-[-6px] w-3 h-3 !bg-green-500"
          />
          <div className="text-xs font-bold text-green-600 dark:text-green-400">
            ✓ YES
          </div>
        </div>
        <div className="flex-1 relative py-2 text-center">
          <Handle
            type="source"
            position={Position.Right}
            id="no"
            isConnectable={isConnectable}
            className="!top-[50%] !right-[-6px] w-3 h-3 !bg-red-500"
          />
          <div className="text-xs font-bold text-red-600 dark:text-red-400">
            ✗ NO
          </div>
        </div>
      </div>
    </div>
  )
}
