// Per-channel cache for triggers to prevent duplicate fetches
// Each channel has its own cache entry
const triggersCache = {
  // Structure: { instagram: { data, promise, fetchTime }, messenger: { data, promise, fetchTime }, ... }
  channels: {},
  fetchCount: 0, // Track total fetch attempts for debugging
}

// Rate limiter: minimum time between fetches per channel in ms
const MIN_FETCH_INTERVAL = 1000

// Normalize channel type (facebook -> messenger for backend)
function normalizeChannel(channelType) {
  return channelType === 'facebook' ? 'messenger' : channelType
}

// Get the cache entry for a specific channel
function getChannelCache(channelType) {
  const normalizedChannel = normalizeChannel(channelType)
  return triggersCache.channels[normalizedChannel] || null
}

// Get cached triggers for a specific channel (returns null if no cache for this channel)
export function getCachedTriggersForChannel(channelType) {
  const channelCache = getChannelCache(channelType)
  if (channelCache && channelCache.data) {
    return channelCache.data
  }
  return null
}

// Set cache data for a specific channel
function setChannelCache(channelType, data) {
  const normalizedChannel = normalizeChannel(channelType)
  if (!triggersCache.channels[normalizedChannel]) {
    triggersCache.channels[normalizedChannel] = {}
  }
  triggersCache.channels[normalizedChannel].data = data
  triggersCache.channels[normalizedChannel].promise = null
}

// Set fetch promise for a specific channel
function setChannelFetchPromise(channelType, promise) {
  const normalizedChannel = normalizeChannel(channelType)
  if (!triggersCache.channels[normalizedChannel]) {
    triggersCache.channels[normalizedChannel] = {}
  }
  triggersCache.channels[normalizedChannel].promise = promise
  triggersCache.channels[normalizedChannel].fetchTime = Date.now()
}

// Clear all cached triggers
export function clearTriggersCache() {
  triggersCache.channels = {}
  triggersCache.fetchCount = 0
}

// Clear cache for a specific channel
export function clearChannelTriggersCache(channelType) {
  const normalizedChannel = normalizeChannel(channelType)
  delete triggersCache.channels[normalizedChannel]
}

// Fetch triggers for a specific channel with deduplication and rate limiting
export async function fetchTriggersOnce(channelType, axiosInstance) {
  const normalizedChannel = normalizeChannel(channelType)

  // If we have cached data for this channel, return it immediately
  const channelCache = triggersCache.channels[normalizedChannel]
  if (channelCache && channelCache.data) {
    return channelCache.data
  }

  // If a fetch is already in progress for this channel, wait for it
  if (channelCache && channelCache.promise) {
    return channelCache.promise
  }

  // Rate limiting per channel: prevent rapid-fire fetches
  const now = Date.now()
  if (channelCache && channelCache.fetchTime && (now - channelCache.fetchTime) < MIN_FETCH_INTERVAL) {
    // Too soon since last fetch for this channel
    if (channelCache.data) {
      return channelCache.data
    }
    if (channelCache.promise) {
      return channelCache.promise
    }
  }

  // Safety check: if too many fetches overall, something is wrong
  triggersCache.fetchCount++
  if (triggersCache.fetchCount > 20) {
    console.warn(`Triggers fetch called ${triggersCache.fetchCount} times - possible infinite loop detected`)
    if (triggersCache.fetchCount > 50) {
      console.error('Too many trigger fetch attempts - returning empty array')
      return channelCache?.data || []
    }
  }

  // Initialize channel cache if not exists
  if (!triggersCache.channels[normalizedChannel]) {
    triggersCache.channels[normalizedChannel] = {}
  }
  triggersCache.channels[normalizedChannel].fetchTime = now

  // Start a new fetch for this channel
  const fetchPromise = (async () => {
    try {
      const response = await axiosInstance.get(`/api/triggers/types?channel=${normalizedChannel}`)

      if (response.data.success) {
        setChannelCache(normalizedChannel, response.data.triggerTypes)
        return response.data.triggerTypes
      }
      return []
    } catch (error) {
      console.error(`Error fetching triggers for ${normalizedChannel}:`, error)
      // Clear the promise on error
      if (triggersCache.channels[normalizedChannel]) {
        triggersCache.channels[normalizedChannel].promise = null
      }
      return []
    }
  })()

  setChannelFetchPromise(normalizedChannel, fetchPromise)

  return fetchPromise
}

// Legacy exports for backwards compatibility (deprecated)
export function getTriggersCache() {
  console.warn('getTriggersCache() is deprecated. Use getCachedTriggersForChannel(channelType) instead.')
  return { data: null, channel: null, promise: null }
}

export function setTriggersCache(channel, data) {
  console.warn('setTriggersCache() is deprecated. Cache is now per-channel and managed automatically.')
  setChannelCache(channel, data)
}

export function setTriggersFetchPromise(channel, promise) {
  console.warn('setTriggersFetchPromise() is deprecated. Cache is now per-channel and managed automatically.')
  setChannelFetchPromise(channel, promise)
}
