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
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border-2 border-orange-500 min-w-[180px] max-w-[220px] overflow-hidden">
      {/* Left Handle */}
      <Handle
        type="target"
        position={Position.Left}
        isConnectable={isConnectable}
        className="w-2.5 h-2.5 !bg-orange-500"
      />

      {/* Header */}
      <div className="bg-gradient-to-r from-orange-500 to-amber-500 px-2.5 py-1.5 flex items-center gap-1.5">
        <span className="text-base">{getMediaIcon(data.mediaType)}</span>
        <div className="flex-1">
          <div className="text-[10px] font-bold text-white/90 uppercase tracking-wide">Media</div>
        </div>
      </div>

      {/* Content */}
      <div className="p-2.5 space-y-2">
        <div className="font-bold text-gray-900 dark:text-white text-xs">
          {data.label}
        </div>

        {data.mediaType === 'send_message' && (
          <div className="bg-orange-50 dark:bg-orange-900/20 rounded p-2 border border-orange-200 dark:border-orange-700">
            {data.message ? (
              <>
                <div className="text-xs text-gray-700 dark:text-gray-300 line-clamp-2">{data.message}</div>
                {data.buttons && data.buttons.length > 0 && (
                  <div className="text-[10px] text-orange-600 dark:text-orange-400 mt-1">{data.buttons.length} buttons</div>
                )}
              </>
            ) : (
              <div className="text-xs text-gray-500 dark:text-gray-400 italic">No message</div>
            )}
          </div>
        )}

        {data.mediaType === 'send_image' && (
          <div className="bg-orange-50 dark:bg-orange-900/20 rounded overflow-hidden border border-orange-200 dark:border-orange-700">
            {data.imageUrl ? (
              data.imageUrl.startsWith('http') ? (
                <img src={data.imageUrl} alt="Preview" className="w-full h-16 object-cover" />
              ) : (
                <div className="p-2 text-[10px] text-orange-600 dark:text-orange-400">📷 Image</div>
              )
            ) : (
              <div className="p-2 text-xs text-gray-500 dark:text-gray-400 italic">No image</div>
            )}
          </div>
        )}

        {data.mediaType === 'send_video' && (
          <div className="text-[10px] text-orange-600 dark:text-orange-400">
            {data.videoUrl ? '🎬 Video attached' : 'No video'}
          </div>
        )}

        {data.mediaType === 'send_voice' && (
          <div className="text-[10px] text-orange-600 dark:text-orange-400">
            {data.voiceUrl ? '🎙️ Voice note' : 'No voice'}
          </div>
        )}

        {data.mediaType === 'send_file' && (
          <div className="text-[10px] text-orange-600 dark:text-orange-400">
            {data.fileUrl ? `📎 ${data.fileName || 'File'}` : 'No file'}
          </div>
        )}

        {data.mediaType === 'send_carousel' && (
          <div className="text-[10px] text-orange-600 dark:text-orange-400">
            {data.cards?.length > 0 ? `🎠 ${data.cards.length} cards` : 'No cards'}
          </div>
        )}

        {data.mediaType === 'send_card' && (
          <div className="text-[10px] text-orange-600 dark:text-orange-400">
            {data.title || 'Card'}
          </div>
        )}
      </div>

      {/* Right Handle */}
      <Handle
        type="source"
        position={Position.Right}
        isConnectable={isConnectable}
        className="w-2.5 h-2.5 !bg-orange-500"
      />
    </div>
  )
}
