import Badge from "../ui/Badge";
import { categoryColor } from "../../lib/categories";
import { formatDate, formatMoney } from "../../lib/format";

function Row({ expense, onEdit, onDelete }) {
  const color = categoryColor(expense.category);

  return (
    <li className="flex items-center gap-3 border-b border-line-subtle py-3 last:border-b-0">
      <span
        aria-hidden="true"
        className="h-1.5 w-1.5 shrink-0 rounded-full"
        style={{ backgroundColor: color }}
      />

      <div className="min-w-0 flex-1">
        <p className="truncate font-sans text-[13px] text-ink-muted">{expense.title}</p>
        <p className="mt-0.5 truncate font-sans text-[11px] text-ink-faint md:hidden">
          {expense.category} · {formatDate(expense.expenseDate)}
        </p>
      </div>

      <div className="hidden w-28 shrink-0 md:block">
        <Badge color={color}>{expense.category}</Badge>
      </div>

      <span className="hidden w-24 shrink-0 font-mono text-[11px] text-ink-faint md:block">
        {formatDate(expense.expenseDate)}
      </span>

      <span className="w-24 shrink-0 text-right font-mono text-[13px] font-medium text-ink">
        {formatMoney(expense.amount)}
      </span>

      <div className="flex shrink-0 items-center gap-0.5">
        <button
          type="button"
          onClick={() => onEdit(expense)}
          aria-label={`Edit ${expense.title}`}
          className="rounded-control p-1.5 text-ink-faint transition-colors hover:bg-surface-raised hover:text-ink"
        >
          <i className="ti ti-pencil" aria-hidden="true" />
        </button>
        <button
          type="button"
          onClick={() => onDelete(expense)}
          aria-label={`Delete ${expense.title}`}
          className="rounded-control p-1.5 text-ink-faint transition-colors hover:bg-danger-muted/20 hover:text-danger"
        >
          <i className="ti ti-trash" aria-hidden="true" />
        </button>
      </div>
    </li>
  );
}

export default function ExpenseTable({ expenses, onEdit, onDelete }) {
  return (
    <div>
      <div
        aria-hidden="true"
        className="flex items-center gap-3 border-b border-line pb-2 font-sans text-[11px] uppercase tracking-[0.08em] text-ink-subtle"
      >
        <span className="w-1.5 shrink-0" />
        <span className="min-w-0 flex-1">Expense</span>
        <span className="hidden w-28 shrink-0 md:block">Category</span>
        <span className="hidden w-24 shrink-0 md:block">Date</span>
        <span className="w-24 shrink-0 text-right">Amount</span>
        <span className="w-[3.25rem] shrink-0" />
      </div>

      <ul>
        {expenses.map((expense) => (
          <Row
            key={expense.id}
            expense={expense}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
      </ul>
    </div>
  );
}