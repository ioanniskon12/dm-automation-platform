import { Handle, Position } from 'reactflow'

export default function ActionNode({ data, isConnectable }) {
  const getActionIcon = (type) => {
    switch (type) {
      case 'send_message':
        return '💌'
      case 'add_tag':
        return '🏷️'
      case 'data_collection':
        return '📝'
      case 'delay':
        return '⏳'
      case 'send_to_human':
        return '👨‍💼'
      default:
        return '⚙️'
    }
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl border-2 border-green-500 min-w-[280px] max-w-[320px]">
      {/* Left Handle */}
      <Handle
        type="target"
        position={Position.Left}
        isConnectable={isConnectable}
        className="w-3 h-3 !bg-green-500"
      />

      {/* Header */}
      <div className="bg-gradient-to-r from-green-500 to-emerald-500 px-4 py-2 flex items-center gap-2">
        <span className="text-2xl">{getActionIcon(data.actionType)}</span>
        <div className="flex-1">
          <div className="text-xs font-bold text-white/90 uppercase tracking-wide">Action</div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        <div className="font-bold text-gray-900 dark:text-white text-sm">
          {data.label}
        </div>

        {data.message && (
          <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-3 border border-gray-200 dark:border-gray-700">
            <div className="text-xs text-gray-500 dark:text-gray-400 mb-1 font-semibold">Message Preview:</div>
            <div className="text-sm text-gray-700 dark:text-gray-300 line-clamp-3">
              {data.message}
            </div>
          </div>
        )}

        {/* Add Tag action */}
        {data.actionType === 'add_tag' && (
          <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-3 border border-purple-200 dark:border-purple-700">
            <div className="text-xs text-purple-600 dark:text-purple-400 font-semibold mb-2">
              Tags ({data.tags?.length || 0}):
            </div>
            {data.tags && data.tags.length > 0 ? (
              <div className="flex flex-wrap gap-1.5">
                {data.tags.map((tag) => (
                  <div
                    key={tag.id}
                    className="inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-semibold"
                    style={{
                      backgroundColor: `${tag.color || '#8b5cf6'}20`,
                      color: tag.color || '#8b5cf6',
                      border: `1px solid ${tag.color || '#8b5cf6'}40`,
                    }}
                  >
                    <span
                      className="w-2 h-2 rounded-full flex-shrink-0"
                      style={{ backgroundColor: tag.color || '#8b5cf6' }}
                    ></span>
                    {tag.name}
                    {tag.category && (
                      <span className="opacity-60 text-[10px]">({tag.category})</span>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-sm text-gray-500 dark:text-gray-400 italic">
                No tags configured
              </div>
            )}
          </div>
        )}

        {/* Delay action */}
        {data.actionType === 'delay' && (
          <div className="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-3 border border-orange-200 dark:border-orange-700">
            <div className="text-xs text-orange-600 dark:text-orange-400 font-semibold mb-1">Wait Duration:</div>
            {data.delay ? (
              <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                <span className="text-lg">⏱️</span>
                <span className="font-semibold">{data.delay} {data.delayUnit || 'seconds'}</span>
              </div>
            ) : (
              <div className="text-sm text-gray-500 dark:text-gray-400 italic">
                No delay configured
              </div>
            )}
          </div>
        )}

        {/* Send to Human action */}
        {data.actionType === 'send_to_human' && (
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3 border border-blue-200 dark:border-blue-700 space-y-2">
            <div className="text-xs text-blue-600 dark:text-blue-400 font-semibold">Handoff Settings:</div>
            {data.department && (
              <div className="text-xs">
                <span className="text-blue-600 dark:text-blue-400 font-semibold">Department:</span>
                <span className="text-gray-700 dark:text-gray-300 ml-1">{data.department}</span>
              </div>
            )}
            {data.priority && (
              <div className="text-xs">
                <span className="text-blue-600 dark:text-blue-400 font-semibold">Priority:</span>
                <span className={`ml-1 px-1.5 py-0.5 rounded text-xs font-medium ${
                  data.priority === 'high' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300' :
                  data.priority === 'medium' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300' :
                  'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
                }`}>
                  {data.priority}
                </span>
              </div>
            )}
            {data.handoffMessage && (
              <div className="text-xs">
                <span className="text-blue-600 dark:text-blue-400 font-semibold">Message:</span>
                <span className="text-gray-700 dark:text-gray-300 ml-1 line-clamp-2">{data.handoffMessage}</span>
              </div>
            )}
            {data.notes && (
              <div className="text-xs">
                <span className="text-blue-600 dark:text-blue-400 font-semibold">Notes:</span>
                <span className="text-gray-700 dark:text-gray-300 ml-1 line-clamp-2">{data.notes}</span>
              </div>
            )}
            {!data.department && !data.priority && !data.handoffMessage && !data.notes && (
              <div className="text-sm text-gray-500 dark:text-gray-400 italic">
                Transfer to human agent
              </div>
            )}
          </div>
        )}

        {/* Legacy tag display for non-add_tag actions */}
        {data.tag && data.actionType !== 'add_tag' && (
          <div className="flex items-center gap-2">
            <span className="px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded text-xs font-semibold">
              {data.tag}
            </span>
          </div>
        )}

        {data.actionType === 'data_collection' && (
          <>
            {data.prompt && (
              <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-3 border border-green-200 dark:border-green-700">
                <div className="text-xs text-green-600 dark:text-green-400 font-semibold mb-1">Prompt:</div>
                <div className="text-sm text-gray-700 dark:text-gray-300 line-clamp-2">
                  {data.prompt}
                </div>
              </div>
            )}
            <div className="flex items-center gap-2 text-xs">
              <span className="text-green-600 dark:text-green-400 font-semibold">Type:</span>
              <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded font-medium">
                {data.replyType || 'text'}
              </span>
            </div>
            {data.fieldName && (
              <div className="flex items-center gap-2 text-xs">
                <span className="text-green-600 dark:text-green-400 font-semibold">Save to:</span>
                <span className="text-gray-700 dark:text-gray-300 font-medium">
                  {data.fieldName}
                </span>
              </div>
            )}
            {(data.enableRetry !== false || data.timeoutEnabled || data.allowSkip) && (
              <div className="flex flex-wrap gap-1">
                {data.enableRetry !== false && (
                  <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded text-xs">
                    🔄 Retry
                  </span>
                )}
                {data.timeoutEnabled && (
                  <span className="px-2 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 rounded text-xs">
                    ⏱️ Timeout
                  </span>
                )}
                {data.allowSkip && (
                  <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded text-xs">
                    ⏭️ Skippable
                  </span>
                )}
              </div>
            )}
            {!data.prompt && !data.fieldName && (
              <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-3 border border-green-200 dark:border-green-700">
                <div className="text-sm text-gray-500 dark:text-gray-400 italic">
                  Not configured
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Right Handle */}
      <Handle
        type="source"
        position={Position.Right}
        isConnectable={isConnectable}
        className="w-3 h-3 !bg-green-500"
      />
    </div>
  )
}
