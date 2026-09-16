/**
 * Base API client for theCanteen.online
 * 
 * Wraps fetch with:
 * - Configurable base URL (NEXT_PUBLIC_API_URL)
 * - Automatic Bearer token injection
 * - Standardized response unwrapping ({ success, message, data })
 * - Structured error handling on non-2xx responses
 */

let _getToken = null;

/**
 * Register a function that returns the current auth token.
 * Called once at app bootstrap from authStore.
 */
export function setTokenProvider(fn) {
  _getToken = fn;
}

function getBaseUrl() {
  return process.env.NEXT_PUBLIC_API_URL || 'https://api.thecanteen.online/v1';
}

function buildUrl(path, query = {}) {
  const url = new URL(`${getBaseUrl()}${path}`);
  Object.entries(query).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      url.searchParams.set(key, String(value));
    }
  });
  return url.toString();
}

function buildHeaders(extra = {}) {
  const headers = {
    'Content-Type': 'application/json',
    ...extra,
  };

  if (_getToken) {
    const token = _getToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }

  return headers;
}

/**
 * Parse the response body, handling both JSON and empty responses.
 */
async function parseBody(res) {
  const text = await res.text();
  if (!text) return {};
  try {
    return JSON.parse(text);
  } catch {
    return { message: text };
  }
}

export class ApiError extends Error {
  constructor(status, body) {
    const message = body?.message || `Request failed with status ${status}`;
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.body = body;
  }
}

/**
 * Recursively normalize MongoDB _id → id on objects and arrays.
 * This ensures all downstream code can use .id consistently.
 */
function normalizeIds(obj) {
  if (Array.isArray(obj)) {
    return obj.map(normalizeIds);
  }
  if (obj !== null && typeof obj === 'object') {
    const result = {};
    for (const [key, value] of Object.entries(obj)) {
      if (key === '_id') {
        result.id = typeof value === 'object' ? String(value) : value;
      } else {
        result[key] = normalizeIds(value);
      }
    }
    return result;
  }
  return obj;
}

async function request(method, path, options = {}) {
  const { body, query, headers: extraHeaders, signal } = options;

  const url = buildUrl(path, query);
  const headers = buildHeaders(extraHeaders);

  const fetchOptions = {
    method,
    headers,
    signal,
  };

  if (body !== undefined) {
    fetchOptions.body = JSON.stringify(body);
  }

  let res;
  try {
    res = await fetch(url, fetchOptions);
  } catch (err) {
    // Network error / timeout / abort
    throw new ApiError(0, { message: err.message || 'Network error' });
  }

  const parsed = await parseBody(res);

  if (!res.ok) {
    // Auto-logout on 401 if token provider exists
    if (res.status === 401 && _getToken && _getToken()) {
      // Dispatch a custom event that authStore can listen to
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('auth:unauthorized'));
      }
    }

    throw new ApiError(res.status, parsed);
  }

  // Normalize MongoDB _id → id on all response data
  const normalized = normalizeIds(parsed);

  // Wrap non-standard responses that don't have the { success, data } shape
  // but still come as 2xx
  if (normalized.success !== undefined) {
    return normalized; // { success, message, data }
  }

  // If the response doesn't follow the standard shape, assume the whole body is data
  return {
    success: true,
    message: 'Success',
    data: normalized,
  };
}

// Convenience methods
export const api = {
  get: (path, options) => request('GET', path, options),
  post: (path, options) => request('POST', path, { ...options, body: options?.body }),
  put: (path, options) => request('PUT', path, { ...options, body: options?.body }),
  patch: (path, options) => request('PATCH', path, { ...options, body: options?.body }),
  delete: (path, options) => request('DELETE', path, options),
};

export default api;