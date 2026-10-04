import { useCallback, useEffect, useMemo, useReducer } from "react";
import { ExpensesContext } from "./ExpensesContext";
import {
  createExpense,
  listExpenses,
  removeExpense,
  updateExpense as updateExpenseRequest,
} from "../services/expenseService";
import { formatMonthKey, isSameMonth } from "../lib/format";
import { categoryColor } from "../lib/categories";

const initialState = {
  expenses: [],
  status: "loading", // loading | ready | error
  error: null,
  saving: false,
  deletingId: null,
};

function reducer(state, action) {
  switch (action.type) {
    case "loading":
      return { ...state, status: "loading", error: null };

    case "loaded":
      return { ...state, expenses: action.expenses, status: "ready", error: null };

    case "failed":
      return { ...state, status: "error", error: action.error };

    case "saving":
      return { ...state, saving: action.value };

    case "deleting":
      return { ...state, deletingId: action.id };

    case "created":
      return {
        ...state,
        saving: false,
        expenses: sortByDate([action.expense, ...state.expenses]),
      };

    case "updated":
      return {
        ...state,
        saving: false,
        expenses: sortByDate(
          state.expenses.map((item) =>
            item.id === action.expense.id ? action.expense : item,
          ),
        ),
      };

    case "deleted":
      return {
        ...state,
        deletingId: null,
        expenses: state.expenses.filter((item) => item.id !== action.id),
      };

    case "deleteFailed":
      return { ...state, deletingId: null };

    default:
      return state;
  }
}

function sortByDate(list) {
  return [...list].sort((a, b) => {
    const byDate = String(b.expenseDate ?? "").localeCompare(String(a.expenseDate ?? ""));
    return byDate !== 0 ? byDate : (b.id ?? 0) - (a.id ?? 0);
  });
}

/** Guards against a non-array payload (e.g. an HTML error page from nginx). */
function normalise(payload) {
  return Array.isArray(payload) ? payload : [];
}

/**
 * One fetch for the entire app. The previous Dashboard called getAllExpenses()
 * itself *and* rendered ExpenseList, which called it again, and forced a full
 * remount via `key={list-${refresh}}` to pick up changes. Mutations now patch
 * local state in place instead.
 */
export default function ExpensesProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { expenses, status, error, saving, deletingId } = state;

  const reload = useCallback(async () => {
    dispatch({ type: "loading" });
    try {
      const payload = await listExpenses();
      dispatch({ type: "loaded", expenses: sortByDate(normalise(payload)) });
    } catch (err) {
      dispatch({ type: "failed", error: err });
    }
  }, []);

  useEffect(() => {
    reload();
  }, [reload]);

  const addExpense = useCallback(async (draft) => {
    dispatch({ type: "saving", value: true });
    try {
      const created = await createExpense(draft);
      dispatch({ type: "created", expense: created ?? { ...draft, id: -Date.now() } });
      return created;
    } catch (err) {
      dispatch({ type: "saving", value: false });
      throw err;
    }
  }, []);

  const updateExpense = useCallback(async (id, draft) => {
    dispatch({ type: "saving", value: true });
    try {
      const updated = await updateExpenseRequest(id, draft);
      dispatch({ type: "updated", expense: updated ?? { ...draft, id } });
      return updated;
    } catch (err) {
      dispatch({ type: "saving", value: false });
      throw err;
    }
  }, []);

  const deleteExpense = useCallback(async (id) => {
    dispatch({ type: "deleting", id });
    try {
      await removeExpense(id);
      dispatch({ type: "deleted", id });
    } catch (err) {
      dispatch({ type: "deleteFailed" });
      throw err;
    }
  }, []);

  const stats = useMemo(() => {
    const total = expenses.reduce((sum, item) => sum + (Number(item.amount) || 0), 0);

    const categoryTotals = new Map();
    const monthTotals = new Map();
    let totalThisMonth = 0;

    for (const item of expenses) {
      const amount = Number(item.amount) || 0;

      categoryTotals.set(item.category, (categoryTotals.get(item.category) ?? 0) + amount);

      const monthKey = formatMonthKey(item.expenseDate);
      monthTotals.set(monthKey, (monthTotals.get(monthKey) ?? 0) + amount);

      if (isSameMonth(item.expenseDate)) totalThisMonth += amount;
    }

    const categories = [...categoryTotals.entries()]
      .map(([name, amount]) => ({ name, amount, color: categoryColor(name) }))
      .sort((a, b) => b.amount - a.amount);

    // Month keys are locale strings ("Mar 2026"), so sort by real date instead.
    const months = [...monthTotals.entries()]
      .map(([key, amount]) => ({ key, amount }))
      .sort((a, b) => new Date(a.key) - new Date(b.key));

    return {
      total,
      totalThisMonth,
      count: expenses.length,
      average: expenses.length ? total / expenses.length : 0,
      topCategory: categories[0] ?? null,
      categories,
      months,
    };
  }, [expenses]);

  const value = useMemo(
    () => ({
      expenses,
      status,
      error,
      saving,
      deletingId,
      stats,
      reload,
      addExpense,
      updateExpense,
      deleteExpense,
    }),
    [
      expenses,
      status,
      error,
      saving,
      deletingId,
      stats,
      reload,
      addExpense,
      updateExpense,
      deleteExpense,
    ],
  );

  return <ExpensesContext.Provider value={value}>{children}</ExpensesContext.Provider>;
}