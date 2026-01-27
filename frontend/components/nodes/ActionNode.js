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
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border-2 border-green-500 min-w-[180px] max-w-[220px] overflow-hidden">
      {/* Left Handle */}
      <Handle
        type="target"
        position={Position.Left}
        isConnectable={isConnectable}
        className="!w-3 !h-3 !border-2 !border-white !bg-green-500"
      />

      {/* Header */}
      <div className="bg-gradient-to-r from-green-500 to-emerald-500 px-2.5 py-1.5 flex items-center gap-1.5">
        <span className="text-base">{getActionIcon(data.actionType)}</span>
        <div className="flex-1">
          <div className="text-[10px] font-bold text-white/90 uppercase tracking-wide">Action</div>
        </div>
      </div>

      {/* Content */}
      <div className="p-2.5 space-y-2">
        <div className="font-bold text-gray-900 dark:text-white text-xs">
          {data.label}
        </div>

        {data.message && (
          <div className="bg-gray-50 dark:bg-gray-900 rounded p-2 border border-gray-200 dark:border-gray-700">
            <div className="text-[10px] text-gray-500 dark:text-gray-400 mb-0.5 font-semibold">Message:</div>
            <div className="text-xs text-gray-700 dark:text-gray-300 line-clamp-2">
              {data.message}
            </div>
          </div>
        )}

        {/* Add Tag action */}
        {data.actionType === 'add_tag' && (
          <div className="bg-purple-50 dark:bg-purple-900/20 rounded p-2 border border-purple-200 dark:border-purple-700">
            <div className="text-[10px] text-purple-600 dark:text-purple-400 font-semibold mb-1">
              Tags ({data.tags?.length || 0}):
            </div>
            {data.tags && data.tags.length > 0 ? (
              <div className="flex flex-wrap gap-1">
                {data.tags.map((tag) => (
                  <div
                    key={tag.id}
                    className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-semibold"
                    style={{
                      backgroundColor: `${tag.color || '#8b5cf6'}20`,
                      color: tag.color || '#8b5cf6',
                      border: `1px solid ${tag.color || '#8b5cf6'}40`,
                    }}
                  >
                    <span
                      className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                      style={{ backgroundColor: tag.color || '#8b5cf6' }}
                    ></span>
                    {tag.name}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-xs text-gray-500 dark:text-gray-400 italic">
                No tags
              </div>
            )}
          </div>
        )}

        {/* Delay action */}
        {data.actionType === 'delay' && (
          <div className="bg-orange-50 dark:bg-orange-900/20 rounded p-2 border border-orange-200 dark:border-orange-700">
            <div className="text-[10px] text-orange-600 dark:text-orange-400 font-semibold">Wait:</div>
            {data.delay ? (
              <div className="flex items-center gap-1 text-xs text-gray-700 dark:text-gray-300">
                <span>⏱️</span>
                <span className="font-semibold">{data.delay} {data.delayUnit || 's'}</span>
              </div>
            ) : (
              <div className="text-xs text-gray-500 dark:text-gray-400 italic">Not set</div>
            )}
          </div>
        )}

        {/* Send to Human action */}
        {data.actionType === 'send_to_human' && (
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded p-2 border border-blue-200 dark:border-blue-700 space-y-1">
            <div className="text-[10px] text-blue-600 dark:text-blue-400 font-semibold">Handoff:</div>
            {data.department && (
              <div className="text-[10px] text-gray-700 dark:text-gray-300">{data.department}</div>
            )}
            {data.priority && (
              <span className={`inline-block px-1 py-0.5 rounded text-[10px] font-medium ${
                data.priority === 'high' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300' :
                data.priority === 'medium' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300' :
                'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
              }`}>
                {data.priority}
              </span>
            )}
            {!data.department && !data.priority && (
              <div className="text-xs text-gray-500 dark:text-gray-400 italic">To human</div>
            )}
          </div>
        )}

        {/* Legacy tag display for non-add_tag actions */}
        {data.tag && data.actionType !== 'add_tag' && (
          <span className="px-1.5 py-0.5 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded text-[10px] font-semibold">
            {data.tag}
          </span>
        )}

        {data.actionType === 'data_collection' && (
          <>
            {data.prompt && (
              <div className="bg-green-50 dark:bg-green-900/20 rounded p-2 border border-green-200 dark:border-green-700">
                <div className="text-[10px] text-green-600 dark:text-green-400 font-semibold">Prompt:</div>
                <div className="text-xs text-gray-700 dark:text-gray-300 line-clamp-2">
                  {data.prompt}
                </div>
              </div>
            )}
            {data.fieldName && (
              <div className="text-[10px] text-gray-600 dark:text-gray-400">
                Save to: <span className="font-medium">{data.fieldName}</span>
              </div>
            )}
            {!data.prompt && !data.fieldName && (
              <div className="text-xs text-gray-500 dark:text-gray-400 italic">Not configured</div>
            )}
          </>
        )}
      </div>

      {/* Right Handle */}
      <Handle
        type="source"
        position={Position.Right}
        isConnectable={isConnectable}
        className="!w-3 !h-3 !border-2 !border-white !bg-green-500"
      />
    </div>
  )
}
