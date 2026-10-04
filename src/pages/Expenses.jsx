import { useMemo, useState } from "react";
import Card, { CardLabel } from "../components/ui/Card";
import Button from "../components/ui/Button";
import ErrorBanner from "../components/ui/ErrorBanner";
import EmptyState from "../components/ui/EmptyState";
import ExpenseTable from "../components/expenses/ExpenseTable";
import ExpenseFilters from "../components/expenses/ExpenseFilters";
import ExpenseModal from "../components/expenses/ExpenseModal";
import ConfirmDeleteDialog from "../components/expenses/ConfirmDeleteDialog";
import { SkeletonRows } from "../components/ui/Skeleton";
import { useExpenses } from "../context/useExpenses";
import { EMPTY_FILTERS } from "../lib/filters";
import { formatMoney } from "../lib/format";

export default function Expenses() {
  const { expenses, status, error, reload } = useExpenses();
  const [filters, setFilters] = useState(EMPTY_FILTERS);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [pendingDelete, setPendingDelete] = useState(null);

  const loading = status === "loading";

  // Derived from the categories actually present, so an unexpected value from
  // the server still shows up as a filter option.
  const categoryNames = useMemo(
    () => [...new Set(expenses.map((expense) => expense.category))].sort(),
    [expenses],
  );

  const visible = useMemo(() => {
    const search = filters.search.trim().toLowerCase();

    return expenses.filter((expense) => {
      if (search && !expense.title?.toLowerCase().includes(search)) return false;
      if (filters.category && expense.category !== filters.category) return false;
      if (filters.from && expense.expenseDate < filters.from) return false;
      if (filters.to && expense.expenseDate > filters.to) return false;
      return true;
    });
  }, [expenses, filters]);

  const filteredTotal = useMemo(
    () => visible.reduce((sum, expense) => sum + (Number(expense.amount) || 0), 0),
    [visible],
  );

  const openCreate = () => {
    setEditing(null);
    setFormOpen(true);
  };

  const openEdit = (expense) => {
    setEditing(expense);
    setFormOpen(true);
  };

  return (
    <>
      <div className="flex flex-col gap-6 px-5 py-6 md:px-7">
        <ErrorBanner error={error} onRetry={reload} />

        <Card className="p-5">
          <div className="mb-4 flex items-center justify-between gap-4">
            <CardLabel>All expenses</CardLabel>
            <Button size="sm" onClick={openCreate}>
              <i className="ti ti-plus" aria-hidden="true" />
              Add expense
            </Button>
          </div>

          <ExpenseFilters
            filters={filters}
            onChange={setFilters}
            categories={categoryNames}
            resultCount={visible.length}
          />
        </Card>

        <Card className="p-5">
          {loading ? (
            <SkeletonRows count={6} />
          ) : expenses.length === 0 ? (
            <EmptyState
              icon="ti-receipt"
              title={error ? "Nothing to show yet" : "No expenses recorded"}
              description={
                error
                  ? "Reconnect to the backend to load your transactions."
                  : "Add your first expense to start tracking spending."
              }
              action={
                !error && (
                  <Button size="sm" onClick={openCreate}>
                    <i className="ti ti-plus" aria-hidden="true" />
                    Add your first expense
                  </Button>
                )
              }
            />
          ) : visible.length === 0 ? (
            <EmptyState
              icon="ti-filter-off"
              title="No expenses match these filters"
              description="Try widening the date range or clearing the category."
              action={
                <Button variant="secondary" size="sm" onClick={() => setFilters(EMPTY_FILTERS)}>
                  Clear filters
                </Button>
              }
            />
          ) : (
            <>
              <div className="mb-3 flex items-center justify-between gap-4 border-b border-line-subtle pb-3">
                <span className="font-sans text-[11px] text-ink-faint">
                  {visible.length} {visible.length === 1 ? "expense" : "expenses"}
                </span>
                <span className="font-mono text-[11px] text-ink-subtle">
                  {formatMoney(filteredTotal)}
                </span>
              </div>

              <ExpenseTable
                expenses={visible}
                onEdit={openEdit}
                onDelete={setPendingDelete}
              />
            </>
          )}
        </Card>
      </div>

      <ExpenseModal
        open={formOpen}
        onClose={() => setFormOpen(false)}
        expense={editing}
      />

      <ConfirmDeleteDialog
        expense={pendingDelete}
        onClose={() => setPendingDelete(null)}
      />
    </>
  );
}