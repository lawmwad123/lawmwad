// ARC Framework — Security Utilities
// XSS prevention, input sanitization, validation

const ENTITY_MAP = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#039;',
};

export function escape(str) {
  if (str == null) return '';
  return String(str).replace(/[&<>"']/g, (ch) => ENTITY_MAP[ch]);
}

export function sanitize(str, maxLength = 1000) {
  if (str == null) return '';
  return String(str)
    .replace(/<[^>]*>/g, '')
    .trim()
    .slice(0, maxLength);
}

export function validateEmail(email) {
  if (!email) return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function validateRequired(obj, fields) {
  const errors = [];
  for (const field of fields) {
    const val = obj[field];
    if (val == null || (typeof val === 'string' && val.trim() === '')) {
      errors.push({ field, message: `${field} is required` });
    }
  }
  return { valid: errors.length === 0, errors };
}

export function getCsrfToken() {
  const match = document.cookie.match(/(?:^|;\s*)arc_csrf=([^;]*)/);
  return match ? decodeURIComponent(match[1]) : '';
}

export function nonce(length = 16) {
  const arr = new Uint8Array(length);
  crypto.getRandomValues(arr);
  return Array.from(arr, (b) => b.toString(16).padStart(2, '0')).join('');
}
