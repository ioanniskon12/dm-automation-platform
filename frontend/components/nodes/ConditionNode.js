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

        {(data.field || data.operator || data.value) && (
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3 border border-blue-200 dark:border-blue-700 space-y-1">
            {data.field && (
              <div className="text-xs">
                <span className="text-blue-600 dark:text-blue-400 font-semibold">Field:</span>
                <span className="text-gray-700 dark:text-gray-300 ml-1">{data.field}</span>
              </div>
            )}
            {data.operator && (
              <div className="text-xs">
                <span className="text-blue-600 dark:text-blue-400 font-semibold">Operator:</span>
                <span className="text-gray-700 dark:text-gray-300 ml-1">{data.operator}</span>
              </div>
            )}
            {data.value && (
              <div className="text-xs">
                <span className="text-blue-600 dark:text-blue-400 font-semibold">Value:</span>
                <span className="text-gray-700 dark:text-gray-300 ml-1">"{data.value}"</span>
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
