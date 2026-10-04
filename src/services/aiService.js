import { requestAt } from "../lib/api";

/**
 * Defaults to a same-origin path so the request is proxied rather than hitting
 * a hardcoded host: `/ai-api` is forwarded by nginx (Docker) and by the Vite dev
 * server. An absolute URL is only needed on Vercel, which has no proxy.
 */
const AI_BASE = String(import.meta.env.VITE_AI_URL ?? "/ai-api").replace(/\/+$/, "");

/**
 * Caps how much spending history travels with each question. The old
 * implementation posted the entire expense list on every message, so the
 * payload — and the amount of personal financial data leaving the browser —
 * grew without bound.
 */
const MAX_CONTEXT_ITEMS = 50;

/**
 * Most recent N expenses, which is what the model actually needs for context.
 * Keys must match what the AI service reads (`main.py` indexes
 * `e['expenseDate']`), so this field cannot be renamed.
 */
export function buildExpenseContext(expenses, limit = MAX_CONTEXT_ITEMS) {
  if (!Array.isArray(expenses) || expenses.length === 0) return [];

  return [...expenses]
    .sort((a, b) => String(b.expenseDate).localeCompare(String(a.expenseDate)))
    .slice(0, limit)
    .map(({ title, amount, category, expenseDate }) => ({
      title,
      amount,
      category,
      expenseDate,
    }));
}

export async function askAdvisor({ message, expenses, signal }) {
  const payload = await requestAt(
    AI_BASE,
    "/chat",
    {
      method: "POST",
      signal,
      body: { message, expenses: buildExpenseContext(expenses) },
    },
  );

  const reply = payload?.reply ?? payload?.response ?? payload?.message;
  if (typeof reply !== "string" || !reply.trim()) {
    throw new Error("The AI service returned an unexpected response.");
  }
  return reply;
}