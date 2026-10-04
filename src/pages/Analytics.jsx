import Card, { CardLabel } from "../components/ui/Card";
import StatCard from "../components/ui/StatCard";
import ErrorBanner from "../components/ui/ErrorBanner";
import EmptyState from "../components/ui/EmptyState";
import CategoryDonut from "../components/charts/CategoryDonut";
import MonthlyBar from "../components/charts/MonthlyBar";
import { SkeletonCards } from "../components/ui/Skeleton";
import { useExpenses } from "../context/useExpenses";
import { formatMoney, formatMoneyCompact, formatDate } from "../lib/format";

const RECENT_LIMIT = 5;

export default function Analytics() {
  const { expenses, status, error, stats, reload } = useExpenses();

  const loading = status === "loading";
  const recent = [...expenses]
    .sort((a, b) => String(b.expenseDate).localeCompare(String(a.expenseDate)))
    .slice(0, RECENT_LIMIT);

  return (
    <div className="flex flex-col gap-6 px-5 py-6 md:px-7">
      <ErrorBanner error={error} onRetry={reload} />

      {loading ? (
        <SkeletonCards />
      ) : expenses.length === 0 ? (
        <Card className="p-5">
          <EmptyState
            icon="ti-chart-bar"
            title={error ? "Nothing to analyse yet" : "No data to analyse"}
            description={
              error
                ? "Reconnect to the backend to load your transactions."
                : "Once you have recorded a few expenses, spending trends will appear here."
            }
          />
        </Card>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <StatCard
              label="Total spent"
              value={formatMoneyCompact(stats.total)}
              sub="All time"
            />
            <StatCard
              label="Top category"
              value={stats.topCategory?.name ?? "—"}
              sub={
                stats.topCategory
                  ? `${formatMoney(stats.topCategory.amount)} · ${
                      stats.total
                        ? Math.round((stats.topCategory.amount / stats.total) * 100)
                        : 0
                    }% of spend`
                  : "—"
              }
              mono={false}
            />
            <StatCard
              label="Average expense"
              value={formatMoneyCompact(stats.average)}
              sub={`${stats.count} ${stats.count === 1 ? "transaction" : "transactions"}`}
            />
          </div>

          <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
            <Card className="p-5">
              <CardLabel>By category</CardLabel>
              <div className="mt-4">
                <CategoryDonut categories={stats.categories} />
              </div>
            </Card>

            <Card className="p-5">
              <CardLabel>Monthly spending</CardLabel>
              <div className="mt-4">
                <MonthlyBar months={stats.months} />
              </div>
            </Card>
          </div>

          <Card className="p-5">
            <CardLabel>Category breakdown</CardLabel>
            <ul className="mt-4 flex flex-col">
              {stats.categories.map(({ name, amount, color }) => {
                const share = stats.total ? Math.round((amount / stats.total) * 100) : 0;
                return (
                  <li
                    key={name}
                    className="flex items-center gap-3 border-b border-line-subtle py-2.5 last:border-b-0"
                  >
                    <span
                      aria-hidden="true"
                      className="h-1.5 w-1.5 shrink-0 rounded-full"
                      style={{ backgroundColor: color }}
                    />
                    <span className="min-w-0 flex-1 truncate font-sans text-[13px] text-ink-muted">
                      {name}
                    </span>
                    <span className="w-16 shrink-0 text-right font-sans text-[11px] text-ink-faint">
                      {share}%
                    </span>
                    <span className="w-24 shrink-0 text-right font-mono text-[13px] text-ink">
                      {formatMoney(amount)}
                    </span>
                  </li>
                );
              })}
            </ul>
          </Card>

          <Card className="p-5">
            <CardLabel>Recent transactions</CardLabel>
            <ul className="mt-4 flex flex-col">
              {recent.map((expense) => (
                <li
                  key={expense.id}
                  className="flex items-center justify-between gap-3 border-b border-line-subtle py-2.5 last:border-b-0"
                >
                  <div className="min-w-0">
                    <p className="truncate font-sans text-[13px] text-ink-muted">
                      {expense.title}
                    </p>
                    <p className="mt-0.5 font-sans text-[11px] text-ink-faint">
                      {expense.category} · {formatDate(expense.expenseDate)}
                    </p>
                  </div>
                  <span className="shrink-0 font-mono text-[13px] text-ink">
                    {formatMoney(expense.amount)}
                  </span>
                </li>
              ))}
            </ul>
          </Card>
        </>
      )}
    </div>
  );
}