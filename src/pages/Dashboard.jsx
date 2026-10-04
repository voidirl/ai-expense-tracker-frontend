import { useState } from "react";
import { Link } from "react-router-dom";
import Card, { CardLabel } from "../components/ui/Card";
import StatCard from "../components/ui/StatCard";
import Button from "../components/ui/Button";
import ErrorBanner from "../components/ui/ErrorBanner";
import EmptyState from "../components/ui/EmptyState";
import ExpenseTable from "../components/expenses/ExpenseTable";
import ExpenseModal from "../components/expenses/ExpenseModal";
import ConfirmDeleteDialog from "../components/expenses/ConfirmDeleteDialog";
import { SkeletonCards, SkeletonRows } from "../components/ui/Skeleton";
import { useExpenses } from "../context/useExpenses";
import { formatMoney, formatMoneyCompact } from "../lib/format";

const RECENT_LIMIT = 6;

export default function Dashboard() {
  const { expenses, status, error, stats, reload } = useExpenses();
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [pendingDelete, setPendingDelete] = useState(null);

  const loading = status === "loading";
  const recent = expenses.slice(0, RECENT_LIMIT);

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

        {loading ? (
          <SkeletonCards />
        ) : (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            {/* Labelled "this month" because it is computed from the current
                month's transactions. The old card showed the all-time
                /total figure under a "this month" caption. */}
            <StatCard
              label="Spent this month"
              value={formatMoneyCompact(stats.totalThisMonth)}
              sub="Current calendar month"
            />
            <StatCard
              label="All-time total"
              value={formatMoneyCompact(stats.total)}
              sub={`${stats.count} ${stats.count === 1 ? "transaction" : "transactions"}`}
            />
            <StatCard
              label="Top category"
              value={stats.topCategory?.name ?? "—"}
              sub={
                stats.topCategory
                  ? `${formatMoney(stats.topCategory.amount)} all-time`
                  : "No data yet"
              }
              mono={false}
            />
          </div>
        )}

        <Card className="p-5">
          <div className="mb-4 flex items-center justify-between gap-4">
            <CardLabel>Recent expenses</CardLabel>
            <Button size="sm" onClick={openCreate}>
              <i className="ti ti-plus" aria-hidden="true" />
              Add expense
            </Button>
          </div>

          {loading ? (
            <SkeletonRows count={4} />
          ) : recent.length === 0 ? (
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
          ) : (
            <ExpenseTable
              expenses={recent}
              onEdit={openEdit}
              onDelete={setPendingDelete}
            />
          )}

          {expenses.length > RECENT_LIMIT && (
            <p className="mt-3 border-t border-line-subtle pt-3 font-sans text-[11px] text-ink-faint">
              Showing {RECENT_LIMIT} of {expenses.length}.{" "}
              <Link
                to="/expenses"
                className="text-ink-subtle underline underline-offset-2 transition-colors hover:text-ink"
              >
                View all
              </Link>
            </p>
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