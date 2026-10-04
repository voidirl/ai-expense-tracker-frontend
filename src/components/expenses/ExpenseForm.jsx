import { useState } from "react";
import Input from "../ui/Input";
import Select from "../ui/Select";
import Button from "../ui/Button";
import { CATEGORY_NAMES } from "../../lib/categories";
import { todayISODate } from "../../lib/format";

const EMPTY_EXPENSE = {
  title: "",
  amount: "",
  category: "",
  expenseDate: todayISODate(),
};

/** Client-side mirror of the server's Bean Validation constraints. */
function validate(values) {
  const errors = {};

  if (!values.title.trim()) {
    errors.title = "Title cannot be empty";
  }

  const amount = Number(values.amount);
  if (values.amount === "" || Number.isNaN(amount)) {
    errors.amount = "Amount cannot be null";
  } else if (amount <= 0) {
    errors.amount = "Amount must be positive";
  }

  if (!values.category) {
    errors.category = "Category cannot be blank";
  }

  if (!values.expenseDate) {
    errors.expenseDate = "Expense date cannot be null";
  }

  return errors;
}

export default function ExpenseForm({
  initialValues = EMPTY_EXPENSE,
  onSubmit,
  onCancel,
  submitting = false,
  submitLabel = "Add expense",
}) {
  const [values, setValues] = useState(initialValues);
  const [fieldErrors, setFieldErrors] = useState({});
  const [formError, setFormError] = useState(null);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setValues((previous) => ({ ...previous, [name]: value }));
    setFieldErrors((previous) => {
      if (!previous[name]) return previous;
      const next = { ...previous };
      delete next[name];
      return next;
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setFormError(null);

    const errors = validate(values);
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    try {
      await onSubmit({
        title: values.title.trim(),
        amount: Number(values.amount),
        category: values.category,
        expenseDate: values.expenseDate,
      });
    } catch (error) {
      // The backend returns a { field: message } map for validation failures.
      if (error?.fieldErrors) {
        setFieldErrors(error.fieldErrors);
      } else {
        setFormError(error?.message ?? "Something went wrong.");
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
      {formError && (
        <p
          role="alert"
          className="flex items-center gap-2 rounded-control border border-danger-muted px-3 py-2 font-sans text-[11px] text-danger"
        >
          <i className="ti ti-alert-circle" aria-hidden="true" />
          {formError}
        </p>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Input
          id="expense-title"
          label="Title"
          name="title"
          value={values.title}
          onChange={handleChange}
          placeholder="e.g. Groceries"
          maxLength={120}
          error={fieldErrors.title}
          autoComplete="off"
        />
        <Input
          id="expense-amount"
          label="Amount"
          name="amount"
          type="number"
          inputMode="decimal"
          step="0.01"
          min="0"
          value={values.amount}
          onChange={handleChange}
          placeholder="0.00"
          error={fieldErrors.amount}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Select
          id="expense-category"
          label="Category"
          name="category"
          value={values.category}
          onChange={handleChange}
          error={fieldErrors.category}
        >
          <option value="">Select…</option>
          {CATEGORY_NAMES.map((name) => (
            <option key={name} value={name}>
              {name}
            </option>
          ))}
        </Select>
        <Input
          id="expense-date"
          label="Date"
          name="expenseDate"
          type="date"
          max={todayISODate()}
          value={values.expenseDate}
          onChange={handleChange}
          error={fieldErrors.expenseDate}
        />
      </div>

      <div className="flex justify-end gap-2 pt-1">
        {onCancel && (
          <Button variant="ghost" onClick={onCancel} disabled={submitting}>
            Cancel
          </Button>
        )}
        <Button type="submit" loading={submitting}>
          {submitting ? "Saving…" : submitLabel}
        </Button>
      </div>
    </form>
  );
}