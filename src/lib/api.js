/**
 * Single fetch wrapper for the whole app.
 *
 * One base URL resolves all three deployment targets:
 *   dev      -> "/api", proxied to localhost:8080 by vite.config.js
 *   docker   -> "/api", proxied to backend:8080 by nginx.conf
 *   vercel   -> absolute origin, e.g. https://<backend>.onrender.com/api
 */
const RAW_BASE = import.meta.env.VITE_API_URL ?? '/api';
export const API_BASE = String(RAW_BASE).replace(/\/+$/, '');

export class ApiError extends Error {
  constructor(message, { status = 0, fieldErrors = null } = {}) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    /** @type {Record<string,string>|null} field -> message, for inline form errors */
    this.fieldErrors = fieldErrors;
  }
}

const STATUS_MESSAGES = {
  400: 'That request was invalid.',
  404: 'Not found.',
  500: 'The server had a problem. Please try again.',
};

const DEFAULT_FIELD_MESSAGE = 'Please fix the highlighted fields.';

/**
 * The backend returns two different error shapes:
 *   400 validation -> { amount: "Amount must be positive" }
 *   everything else -> { status, message, timestamp }
 * Collapse both into one predictable object.
 */
function parseErrorBody(body, status) {
  if (body && typeof body === 'object' && !Array.isArray(body)) {
    const keys = Object.keys(body);
    const looksLikeFieldMap =
      keys.length > 0 &&
      keys.every((key) => typeof body[key] === 'string') &&
      !('message' in body) &&
      !('status' in body);

    if (looksLikeFieldMap) {
      return { message: DEFAULT_FIELD_MESSAGE, fieldErrors: body };
    }
    if (typeof body.message === 'string') {
      return { message: body.message, fieldErrors: null };
    }
  }
  return {
    message: STATUS_MESSAGES[status] ?? `Request failed (${status}).`,
    fieldErrors: null,
  };
}

/** Tolerates empty bodies and the plain-text "Deleted!" response. */
async function readBody(response) {
  if (response.status === 204) return null;
  const text = await response.text();
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

async function request(path, { method = 'GET', body, signal, baseUrl = API_BASE } = {}) {
  let response;
  try {
    response = await fetch(`${baseUrl}${path}`, {
      method,
      signal,
      headers: body === undefined ? undefined : { 'Content-Type': 'application/json' },
      body: body === undefined ? undefined : JSON.stringify(body),
    });
  } catch (cause) {
    if (cause?.name === 'AbortError') throw cause;
    throw new ApiError('Cannot reach the server. Is the backend running?', {
      status: 0,
    });
  }

  const payload = await readBody(response);

  if (!response.ok) {
    const { message, fieldErrors } = parseErrorBody(payload, response.status);
    throw new ApiError(message, { status: response.status, fieldErrors });
  }
  return payload;
}

/** Absolute-URL escape hatch, for services on a different origin (the AI service). */
export const requestAt = (baseUrl, path, options) =>
  request(path, { ...options, baseUrl: String(baseUrl).replace(/\/+$/, '') });

export const api = {
  get: (path, options) => request(path, { ...options, method: 'GET' }),
  post: (path, body, options) => request(path, { ...options, method: 'POST', body }),
  put: (path, body, options) => request(path, { ...options, method: 'PUT', body }),
  del: (path, options) => request(path, { ...options, method: 'DELETE' }),
};