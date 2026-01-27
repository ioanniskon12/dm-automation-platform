import { Handle, Position } from 'reactflow'
import { useState, useRef } from 'react'

export default function MediaNode({ data, isConnectable }) {
  const [isPlaying, setIsPlaying] = useState(false)
  const videoRef = useRef(null)

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

  // Get all buttons to display on the node
  const getAllButtons = () => {
    let buttons = []

    // From send_message node (buttons)
    if (data.buttons && Array.isArray(data.buttons)) {
      data.buttons.forEach((btn, idx) => {
        buttons.push({ ...btn, index: idx, source: 'buttons', hasHandle: btn.actionType === 'goToNode' })
      })
    }

    // From send_card node
    if (data.cardButtons && Array.isArray(data.cardButtons)) {
      data.cardButtons.forEach((btn, idx) => {
        buttons.push({ ...btn, index: idx, source: 'cardButtons', hasHandle: btn.actionType === 'goToNode' })
      })
    }

    // From quick replies
    if (data.quickReplies && Array.isArray(data.quickReplies)) {
      data.quickReplies.forEach((btn, idx) => {
        buttons.push({ ...btn, index: idx, source: 'quickReplies', isQuickReply: true, hasHandle: btn.actionType === 'goToNode' })
      })
    }

    return buttons
  }

  const allButtons = getAllButtons()
  const hasButtons = allButtons.length > 0
  const hasButtonHandles = allButtons.some(btn => btn.hasHandle)

  const handleVideoClick = (e) => {
    e.stopPropagation()
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause()
        setIsPlaying(false)
      } else {
        videoRef.current.play()
        setIsPlaying(true)
      }
    }
  }

  const handleVideoEnded = () => {
    setIsPlaying(false)
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border-2 border-orange-500 min-w-[180px] max-w-[220px] overflow-hidden">
      {/* Left Handle */}
      <Handle
        type="target"
        position={Position.Left}
        isConnectable={isConnectable}
        className="!w-3 !h-3 !bg-orange-500 !border-2 !border-white"
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
          <div className="bg-orange-50 dark:bg-orange-900/20 rounded overflow-hidden border border-orange-200 dark:border-orange-700">
            {data.videoUrl ? (
              <div className="relative cursor-pointer" onClick={handleVideoClick}>
                <video
                  ref={videoRef}
                  src={data.videoUrl}
                  className="w-full h-20 object-cover"
                  preload="metadata"
                  onEnded={handleVideoEnded}
                  muted
                />
                {/* Play/Pause Button Overlay */}
                {!isPlaying && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                    <div className="w-8 h-8 bg-white/90 rounded-full flex items-center justify-center shadow-lg">
                      <svg className="w-4 h-4 text-orange-600 ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z"/>
                      </svg>
                    </div>
                  </div>
                )}
                {isPlaying && (
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity bg-black/20">
                    <div className="w-8 h-8 bg-white/90 rounded-full flex items-center justify-center shadow-lg">
                      <svg className="w-4 h-4 text-orange-600" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/>
                      </svg>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="p-2 text-xs text-gray-500 dark:text-gray-400 italic">No video</div>
            )}
          </div>
        )}

        {data.mediaType === 'send_voice' && (
          <div className="bg-orange-50 dark:bg-orange-900/20 rounded p-2 border border-orange-200 dark:border-orange-700">
            {data.voiceUrl ? (
              <div className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${data.voiceSource === 'recorded' ? 'bg-red-500' : 'bg-orange-500'}`}>
                  <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[10px] font-medium text-gray-800 dark:text-gray-200 truncate">
                    {data.voiceSource === 'recorded' ? 'Recorded' : 'Voice note'}
                  </div>
                  <div className="text-[9px] text-orange-600 dark:text-orange-400">
                    {data.duration || '0:00'}
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-xs text-gray-500 dark:text-gray-400 italic">No voice</div>
            )}
          </div>
        )}

        {data.mediaType === 'send_file' && (
          <div className="text-[10px] text-orange-600 dark:text-orange-400">
            {data.fileUrl ? `📎 ${data.fileName || 'File'}` : 'No file'}
          </div>
        )}

        {data.mediaType === 'send_carousel' && (
          <div className="bg-orange-50 dark:bg-orange-900/20 rounded overflow-hidden border border-orange-200 dark:border-orange-700">
            {data.carouselCards && data.carouselCards.length > 0 ? (
              <>
                {/* Mini carousel preview */}
                <div className="flex gap-0.5 p-1 overflow-hidden">
                  {data.carouselCards.slice(0, 3).map((card, idx) => (
                    <div key={card.id || idx} className="flex-shrink-0 w-12 h-14 bg-white dark:bg-gray-700 rounded overflow-hidden border border-gray-200 dark:border-gray-600">
                      {card.imageUrl ? (
                        <img src={card.imageUrl} alt="" className="w-full h-8 object-cover" />
                      ) : (
                        <div className="w-full h-8 bg-gradient-to-br from-orange-100 to-amber-100 dark:from-orange-800/30 dark:to-amber-800/30 flex items-center justify-center">
                          <span className="text-[8px] text-orange-400">{idx + 1}</span>
                        </div>
                      )}
                      <div className="p-0.5">
                        <div className="text-[7px] font-medium text-gray-800 dark:text-gray-200 truncate">
                          {card.title || `Card ${idx + 1}`}
                        </div>
                      </div>
                    </div>
                  ))}
                  {data.carouselCards.length > 3 && (
                    <div className="flex-shrink-0 w-6 h-14 flex items-center justify-center">
                      <span className="text-[8px] text-gray-400">+{data.carouselCards.length - 3}</span>
                    </div>
                  )}
                </div>
                <div className="px-1.5 pb-1">
                  <div className="text-[9px] text-orange-600 dark:text-orange-400">
                    {data.carouselCards.length} card{data.carouselCards.length > 1 ? 's' : ''}
                  </div>
                </div>
              </>
            ) : (
              <div className="p-2 text-xs text-gray-500 dark:text-gray-400 italic">No cards</div>
            )}
          </div>
        )}

        {data.mediaType === 'send_card' && (
          <div className="bg-orange-50 dark:bg-orange-900/20 rounded overflow-hidden border border-orange-200 dark:border-orange-700">
            {/* Mini card preview */}
            {data.cardImageUrl ? (
              <img src={data.cardImageUrl} alt="Card" className="w-full h-12 object-cover" />
            ) : (
              <div className="w-full h-12 bg-gradient-to-br from-orange-100 to-amber-100 dark:from-orange-800/30 dark:to-amber-800/30 flex items-center justify-center">
                <svg className="w-5 h-5 text-orange-300 dark:text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            )}
            <div className="p-1.5">
              <div className="text-[10px] font-semibold text-gray-800 dark:text-gray-200 truncate">
                {data.cardTitle || 'Card Title'}
              </div>
              {data.cardButtons && data.cardButtons.length > 0 && !data.cardButtons.some(b => b.actionType === 'goToNode') && (
                <div className="text-[9px] text-orange-600 dark:text-orange-400 mt-0.5">
                  {data.cardButtons.length} button{data.cardButtons.length > 1 ? 's' : ''}
                </div>
              )}
            </div>
          </div>
        )}

        {/* All buttons displayed on node */}
        {hasButtons && (
          <div className="mt-2 space-y-1">
            {allButtons.map((btn, idx) => (
              <div key={`${btn.source}-${btn.index}`} className="relative">
                <div className={`text-[10px] font-medium px-2 py-1.5 rounded border flex items-center justify-between ${
                  btn.isQuickReply
                    ? 'bg-purple-50 dark:bg-purple-900/20 border-purple-300 dark:border-purple-700 text-purple-700 dark:text-purple-300'
                    : btn.hasHandle
                      ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-300 dark:border-blue-700 text-blue-700 dark:text-blue-300'
                      : 'bg-gray-50 dark:bg-gray-700/50 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300'
                }`}>
                  <span className="truncate flex-1">{btn.label || `Button ${btn.index + 1}`}</span>
                  {btn.hasHandle && <span className="ml-1 text-[8px] opacity-60">→</span>}
                  {btn.actionType === 'openUrl' && <span className="ml-1 text-[8px]">🔗</span>}
                  {btn.actionType === 'callPhone' && <span className="ml-1 text-[8px]">📞</span>}
                  {btn.actionType === 'triggerFlow' && <span className="ml-1 text-[8px]">⚡</span>}
                </div>
                {/* Button-specific handle - only for goToNode buttons */}
                {btn.hasHandle && (
                  <Handle
                    type="source"
                    position={Position.Right}
                    id={`${btn.source}-${btn.index}`}
                    isConnectable={isConnectable}
                    className="!w-3 !h-3 !bg-blue-500 !border-2 !border-white !right-[-6px]"
                    style={{ top: '50%', transform: 'translateY(-50%)' }}
                  />
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Default Right Handle - only shown when NO goToNode buttons exist */}
      {!hasButtonHandles && (
        <Handle
          type="source"
          position={Position.Right}
          id="default"
          isConnectable={isConnectable}
          className="!w-3 !h-3 !bg-orange-500 !border-2 !border-white"
        />
      )}
    </div>
  )
}
