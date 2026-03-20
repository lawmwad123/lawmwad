// ARC Framework — HTTP Client
// Fetch wrapper with auth, CSRF, error handling, GET deduplication

import { getCsrfToken } from './security.js';
import { store } from './store.js';

const BASE_URL = '/api/admin';
const _pending = new Map();

async function request(method, url, body, options = {}) {
  const fullUrl = url.startsWith('/') ? url : `${BASE_URL}/${url}`;
  const cacheKey = `${method}:${fullUrl}`;

  // Deduplicate in-flight GET requests
  if (method === 'GET' && _pending.has(cacheKey)) {
    return _pending.get(cacheKey);
  }

  const headers = { 'Content-Type': 'application/json' };

  // Attach CSRF token for mutating requests
  if (['POST', 'PUT', 'DELETE', 'PATCH'].includes(method)) {
    headers['X-CSRF-Token'] = getCsrfToken();
  }

  const fetchOptions = {
    method,
    headers,
    credentials: 'same-origin',
    ...options,
  };

  if (body && method !== 'GET') {
    fetchOptions.body = JSON.stringify(body);
  }

  const promise = fetch(fullUrl, fetchOptions)
    .then(async (res) => {
      _pending.delete(cacheKey);

      if (res.status === 401) {
        store.set('auth.user', null);
        window.location.hash = '#/login';
        throw new Error('Session expired');
      }

      if (res.status === 403) {
        throw new Error('Access denied');
      }

      const data = await res.json();

      if (!res.ok) {
        const err = new Error(data.error || `Request failed (${res.status})`);
        err.status = res.status;
        err.details = data.details;
        throw err;
      }

      return data;
    })
    .catch((err) => {
      _pending.delete(cacheKey);
      throw err;
    });

  if (method === 'GET') {
    _pending.set(cacheKey, promise);
  }

  return promise;
}

async function upload(url, formData) {
  const fullUrl = url.startsWith('/') ? url : `${BASE_URL}/${url}`;

  const res = await fetch(fullUrl, {
    method: 'POST',
    credentials: 'same-origin',
    headers: {
      'X-CSRF-Token': getCsrfToken(),
    },
    body: formData, // browser sets Content-Type with boundary
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || 'Upload failed');
  }

  return res.json();
}

export const http = {
  get: (url, opts) => request('GET', url, null, opts),
  post: (url, body) => request('POST', url, body),
  put: (url, body) => request('PUT', url, body),
  del: (url) => request('DELETE', url),
  upload,
};
