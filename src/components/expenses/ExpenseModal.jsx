import Modal from "../ui/Modal";
import ExpenseForm from "./ExpenseForm";
import { useExpenses } from "../../context/useExpenses";
import { formatMoney } from "../../lib/format";

/**
 * Handles both create and edit. The old app imported `updateExpense` but never
 * rendered a single edit control, so the endpoint was unreachable.
 *
 * Remounted via `key` when the target expense changes so the form picks up new
 * initial values.
 */
export default function ExpenseModal({ open, onClose, expense }) {
  const { addExpense, updateExpense, saving } = useExpenses();
  const isEdit = Boolean(expense);

  const handleSubmit = async (payload) => {
    if (isEdit) {
      await updateExpense(expense.id, payload);
    } else {
      await addExpense(payload);
    }
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={isEdit ? "Edit expense" : "Add expense"}
      description={
        isEdit
          ? `Currently ${formatMoney(expense.amount)} · ${expense.category}`
          : "Record a new transaction."
      }
    >
      <ExpenseForm
        key={isEdit ? expense.id : "new"}
        initialValues={
          isEdit
            ? {
                title: expense.title ?? "",
                amount: String(expense.amount ?? ""),
                category: expense.category ?? "",
                expenseDate: expense.expenseDate ?? "",
              }
            : undefined
        }
        onSubmit={handleSubmit}
        submitting={saving}
        submitLabel={isEdit ? "Save changes" : "Add expense"}
      />
    </Modal>
  );
}