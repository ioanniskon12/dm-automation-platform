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
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border-2 border-blue-500 min-w-[180px] max-w-[220px] flex overflow-hidden">
      {/* Left Handle */}
      <Handle
        type="target"
        position={Position.Left}
        isConnectable={isConnectable}
        className="w-2.5 h-2.5 !bg-blue-500"
      />

      {/* Main Content */}
      <div className="flex-1">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500 to-cyan-500 px-2.5 py-1.5 flex items-center gap-1.5 rounded-tl-md">
          <span className="text-base">{getConditionIcon(data.conditionType)}</span>
          <div className="flex-1">
            <div className="text-[10px] font-bold text-white/90 uppercase tracking-wide">Condition</div>
          </div>
        </div>

        {/* Content */}
        <div className="p-2.5">
          <div className="font-bold text-gray-900 dark:text-white text-xs mb-2">
            {data.label}
          </div>

          {/* Is Follower condition */}
          {data.conditionType === 'is_follower' && (
            <div className="text-[10px] text-blue-600 dark:text-blue-400">Is following?</div>
          )}

          {/* Has Interacted condition */}
          {data.conditionType === 'has_interacted' && (
            <div className="text-[10px] text-blue-600 dark:text-blue-400">
              Interacted?
              {data.timeframe && <span className="ml-1">({data.timeframe})</span>}
            </div>
          )}

          {/* Time-Based condition */}
          {data.conditionType === 'time_based' && (
            <div className="text-[10px] text-blue-600 dark:text-blue-400">
              {data.startTime && data.endTime ? `${data.startTime}-${data.endTime}` : 'Schedule'}
            </div>
          )}

          {/* Custom Field condition */}
          {data.conditionType === 'custom_field' && (
            <div className="text-[10px] text-blue-600 dark:text-blue-400">
              {data.fieldName ? `${data.fieldName} ${data.fieldCondition || ''}` : 'Custom field'}
            </div>
          )}
        </div>
      </div>

      {/* Right Side Branch Panel */}
      <div className="flex flex-col border-l border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 rounded-r-md">
        {/* YES Branch */}
        <div className="flex-1 flex items-center justify-center px-2 py-3 border-b border-gray-200 dark:border-gray-700 relative">
          <div className="flex items-center gap-1">
            <span className="text-[10px] font-bold text-green-600 dark:text-green-400">YES</span>
          </div>
          <Handle
            type="source"
            position={Position.Right}
            id="yes"
            isConnectable={isConnectable}
            className="!absolute !right-[-5px] !top-1/2 !-translate-y-1/2 w-2.5 h-2.5 !bg-green-500"
          />
        </div>
        {/* NO Branch */}
        <div className="flex-1 flex items-center justify-center px-2 py-3 relative">
          <div className="flex items-center gap-1">
            <span className="text-[10px] font-bold text-red-600 dark:text-red-400">NO</span>
          </div>
          <Handle
            type="source"
            position={Position.Right}
            id="no"
            isConnectable={isConnectable}
            className="!absolute !right-[-5px] !top-1/2 !-translate-y-1/2 w-2.5 h-2.5 !bg-red-500"
          />
        </div>
      </div>
    </div>
  )
}
