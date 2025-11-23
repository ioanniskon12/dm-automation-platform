import { Handle, Position } from 'reactflow'

export default function MediaNode({ data, isConnectable }) {
  const getMediaIcon = (type) => {
    switch (type) {
      case 'send_message':
        return '💌'
      case 'send_image':
        return '🖼️'
      case 'send_video':
        return '🎥'
      case 'send_voice':
        return '🎤'
      case 'send_carousel':
        return '🎠'
      case 'send_card':
        return '🃏'
      default:
        return '📤'
    }
  }

  // Mock CTR data - ready for API integration
  const getButtonCTR = (buttonIndex) => {
    const mockCTRs = [34, 12, 8, 27, 15, 9]
    return mockCTRs[buttonIndex % mockCTRs.length]
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl border-2 border-orange-500 min-w-[280px] max-w-[320px]">
      {/* Left Handle */}
      <Handle
        type="target"
        position={Position.Left}
        isConnectable={isConnectable}
        className="w-3 h-3 !bg-orange-500"
      />

      {/* Header */}
      <div className="bg-gradient-to-r from-orange-500 to-amber-500 px-4 py-2 flex items-center gap-2">
        <span className="text-2xl">{getMediaIcon(data.mediaType)}</span>
        <div className="flex-1">
          <div className="text-xs font-bold text-white/90 uppercase tracking-wide">Media Send</div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        <div className="font-bold text-gray-900 dark:text-white text-sm">
          {data.label}
        </div>

        {data.mediaType === 'send_message' && data.message && (
          <div className="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-3 border border-orange-200 dark:border-orange-700">
            <div className="text-xs text-orange-600 dark:text-orange-400 font-semibold mb-1">Message:</div>
            <div className="text-sm text-gray-700 dark:text-gray-300 line-clamp-3">
              {data.message}
            </div>
            {data.buttons && data.buttons.length > 1 && (
              <div className="mt-3 space-y-1.5">
                {data.buttons.map((button, index) => (
                  <div key={button.id || index} className="flex items-center justify-between text-xs">
                    <span className="text-gray-700 dark:text-gray-300 truncate flex-1">
                      {index + 1}. {button.text}
                    </span>
                    <span className="ml-2 px-1.5 py-0.5 rounded bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 font-semibold">
                      {getButtonCTR(index)}%
                    </span>
                  </div>
                ))}
              </div>
            )}
            {data.quickReplies && data.quickReplies.length > 0 && (
              <div className="mt-2 text-xs text-orange-600 dark:text-orange-400 font-semibold">
                ✓ {data.quickReplies.length} Quick {data.quickReplies.length === 1 ? 'Reply' : 'Replies'}
              </div>
            )}
            {data.includeButtons && !data.buttons && !data.quickReplies && (
              <div className="mt-2 text-xs text-orange-600 dark:text-orange-400 font-semibold">
                ✓ Quick Reply Buttons
              </div>
            )}
          </div>
        )}

        {data.mediaType === 'send_image' && data.imageUrl && (
          <div className="bg-orange-50 dark:bg-orange-900/20 rounded-lg overflow-hidden border border-orange-200 dark:border-orange-700">
            {data.imageUrl.startsWith('http') ? (
              <img src={data.imageUrl} alt="Preview" className="w-full h-32 object-cover" />
            ) : (
              <div className="p-3 text-xs text-orange-600 dark:text-orange-400 font-semibold">
                📷 {data.imageUrl}
              </div>
            )}
            {data.caption && (
              <div className="p-2 text-xs text-gray-700 dark:text-gray-300 border-t border-orange-200 dark:border-orange-700">
                {data.caption}
              </div>
            )}
          </div>
        )}

        {data.mediaType === 'send_video' && data.videoUrl && (
          <div className="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-3 border border-orange-200 dark:border-orange-700">
            <div className="text-xs text-orange-600 dark:text-orange-400 font-semibold mb-1">Video:</div>
            <div className="text-xs text-gray-700 dark:text-gray-300 line-clamp-1">
              🎬 {data.videoUrl}
            </div>
            {data.caption && (
              <div className="text-xs text-gray-600 dark:text-gray-400 mt-2 line-clamp-2">
                {data.caption}
              </div>
            )}
          </div>
        )}

        {data.mediaType === 'send_voice' && data.voiceUrl && (
          <div className="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-3 border border-orange-200 dark:border-orange-700">
            <div className="text-xs text-orange-600 dark:text-orange-400 font-semibold mb-1">Voice Note:</div>
            <div className="text-xs text-gray-700 dark:text-gray-300">
              🎙️ {data.duration || 'N/A'}
            </div>
          </div>
        )}

        {data.mediaType === 'send_carousel' && (
          <div className="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-3 border border-orange-200 dark:border-orange-700">
            <div className="text-xs text-orange-600 dark:text-orange-400 font-semibold">
              Carousel: {data.cards?.length || 0} cards
            </div>
          </div>
        )}

        {data.mediaType === 'send_card' && (
          <div className="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-3 border border-orange-200 dark:border-orange-700">
            {data.title && (
              <div className="text-sm font-bold text-gray-900 dark:text-white mb-1">
                {data.title}
              </div>
            )}
            {data.subtitle && (
              <div className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                {data.subtitle}
              </div>
            )}
            {data.buttons && data.buttons.length > 1 && (
              <div className="mt-2 space-y-1.5">
                {data.buttons.map((button, index) => (
                  <div key={button.id || index} className="flex items-center justify-between text-xs">
                    <span className="text-gray-700 dark:text-gray-300 truncate flex-1">
                      {index + 1}. {button.text}
                    </span>
                    <span className="ml-2 px-1.5 py-0.5 rounded bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 font-semibold">
                      {getButtonCTR(index)}%
                    </span>
                  </div>
                ))}
              </div>
            )}
            {data.buttons?.length === 1 && (
              <div className="text-xs text-orange-600 dark:text-orange-400 font-semibold">
                1 button
              </div>
            )}
          </div>
        )}

        <div className="text-xs text-gray-500 dark:text-gray-400">
          Send media content to the user
        </div>
      </div>

      {/* Right Handle */}
      <Handle
        type="source"
        position={Position.Right}
        isConnectable={isConnectable}
        className="w-3 h-3 !bg-orange-500"
      />
    </div>
  )
}
