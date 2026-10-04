import { api } from "../lib/api";

const BASE = "/expenses";

export const listExpenses = (options) => api.get(BASE, options);

export const createExpense = (expense, options) => api.post(BASE, expense, options);

export const updateExpense = (id, expense, options) =>
  api.put(`${BASE}/${id}`, expense, options);

export const removeExpense = (id, options) => api.del(`${BASE}/${id}`, options);

export const fetchTotalSum = (options) => api.get(`${BASE}/total`, options);

// The backend exposes exact-match /category/{category} and /date/{date}
// endpoints, but no range support. Filtering runs client-side over the
// already-loaded list instead, so these are kept for direct API access only.
export const fetchByCategory = (category, options) =>
  api.get(`${BASE}/category/${encodeURIComponent(category)}`, options);

export const fetchByDate = (date, options) =>
  api.get(`${BASE}/date/${date}`, options);