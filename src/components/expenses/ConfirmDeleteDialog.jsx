import { useState } from "react";
import Modal from "../ui/Modal";
import Button from "../ui/Button";
import { useExpenses } from "../../context/useExpenses";
import { formatMoney } from "../../lib/format";

/**
 * Deleting used to fire immediately on click with no confirmation and no
 * feedback if it failed.
 */
export default function ConfirmDeleteDialog({ expense, onClose }) {
  const { deleteExpense, deletingId } = useExpenses();
  const [error, setError] = useState(null);

  if (!expense) return null;

  const deleting = deletingId === expense.id;

  const handleConfirm = async () => {
    setError(null);
    try {
      await deleteExpense(expense.id);
      onClose();
    } catch (err) {
      setError(err?.message ?? "Could not delete this expense.");
    }
  };

  return (
    <Modal
      open
      onClose={deleting ? () => {} : onClose}
      title="Delete expense"
      description="This cannot be undone."
      footer={
        <>
          <Button variant="ghost" onClick={onClose} disabled={deleting}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleConfirm} loading={deleting}>
            <i className="ti ti-trash" aria-hidden="true" />
            Delete
          </Button>
        </>
      }
    >
      <p className="font-sans text-[13px] text-ink-muted">
        Remove <span className="text-ink">{expense.title}</span> worth{" "}
        <span className="font-mono text-ink">{formatMoney(expense.amount)}</span>?
      </p>

      {error && (
        <p
          role="alert"
          className="mt-3 flex items-center gap-2 font-sans text-[11px] text-danger"
        >
          <i className="ti ti-alert-circle" aria-hidden="true" />
          {error}
        </p>
      )}
    </Modal>
  );
}