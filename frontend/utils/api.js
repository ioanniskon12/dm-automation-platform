/**
 * API Utility with Automatic Brand/Channel Context
 *
 * This utility automatically injects brand and channel context into all API requests.
 * It reads from localStorage where the BrandChannelContext stores the active context.
 */

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3003';

/**
 * Get current brand/channel context from localStorage
 */
export const getActiveContext = () => {
  if (typeof window === 'undefined') return null;

  try {
    const savedContext = localStorage.getItem('brandChannelContext');
    if (savedContext) {
      return JSON.parse(savedContext);
    }
  } catch (error) {
    console.error('Error reading context:', error);
  }
  return null;
};

/**
 * API request wrapper that automatically includes brand/channel context
 *
 * @param {string} endpoint - API endpoint (e.g., '/api/templates')
 * @param {object} options - Fetch options (method, body, headers, etc.)
 * @param {boolean} requireContext - If true, throws error when context is missing
 * @returns {Promise<Response>}
 */
export const apiRequest = async (endpoint, options = {}, requireContext = false) => {
  const context = getActiveContext();

  // Throw error if context is required but missing
  if (requireContext && (!context || !context.brandId)) {
    throw new Error('Brand context is required for this request. Please select a brand first.');
  }

  // Build headers
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  // Add context to headers if available
  if (context) {
    if (context.brandId) {
      headers['X-Brand-Id'] = context.brandId;
    }
    if (context.channelId) {
      headers['X-Channel-Id'] = context.channelId;
    }
  }

  // Build URL with query params if context exists
  let url = `${API_URL}${endpoint}`;

  // If GET request, add context as query params as well
  if (context && (!options.method || options.method === 'GET')) {
    const params = new URLSearchParams();
    if (context.brandId) params.append('brandId', context.brandId);
    if (context.channelId) params.append('channelId', context.channelId);

    const queryString = params.toString();
    if (queryString) {
      url += (url.includes('?') ? '&' : '?') + queryString;
    }
  }

  // Merge options
  const fetchOptions = {
    ...options,
    headers,
  };

  // If body exists and is an object, add context to body
  if (options.body && typeof options.body === 'object' && context) {
    const bodyData = options.body instanceof FormData
      ? options.body
      : JSON.parse(options.body);

    if (!(bodyData instanceof FormData)) {
      bodyData.brandId = context.brandId;
      bodyData.channelId = context.channelId;
      fetchOptions.body = JSON.stringify(bodyData);
    }
  }

  return fetch(url, fetchOptions);
};

/**
 * Convenience methods for common HTTP verbs
 */
export const api = {
  get: (endpoint, requireContext = false) =>
    apiRequest(endpoint, { method: 'GET' }, requireContext),

  post: (endpoint, data, requireContext = false) =>
    apiRequest(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    }, requireContext),

  put: (endpoint, data, requireContext = false) =>
    apiRequest(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    }, requireContext),

  delete: (endpoint, requireContext = false) =>
    apiRequest(endpoint, { method: 'DELETE' }, requireContext),

  patch: (endpoint, data, requireContext = false) =>
    apiRequest(endpoint, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }, requireContext),
};

/**
 * Example usage:
 *
 * // Basic GET with automatic context injection
 * const response = await api.get('/api/templates');
 *
 * // POST with data and required context
 * const response = await api.post('/api/flows', { name: 'New Flow' }, true);
 *
 * // Manual control with apiRequest
 * const response = await apiRequest('/api/analytics', {
 *   method: 'POST',
 *   body: JSON.stringify({ dateRange: '7d' })
 * }, true);
 */

export default api;
