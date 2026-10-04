import { useEffect, useRef } from "react";

/**
 * Uses the native <dialog> element so the top layer, backdrop, focus trap,
 * Esc-to-close and background inerting come from the platform rather than
 * hand-rolled keydown listeners.
 */
export default function Modal({
  open,
  onClose,
  title,
  description,
  children,
  footer,
}) {
  const dialogRef = useRef(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (open && !dialog.open) {
      dialog.showModal();
    } else if (!open && dialog.open) {
      dialog.close();
    }
  }, [open]);

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby="modal-title"
      aria-describedby={description ? "modal-description" : undefined}
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
      onClick={(event) => {
        // Clicks land on the <dialog> itself when they hit the backdrop.
        if (event.target === dialogRef.current) onClose();
      }}
      className="m-auto w-[calc(100vw-2rem)] max-w-md rounded-panel border border-line bg-surface p-0 text-ink backdrop:bg-black/70"
    >
      <div className="flex flex-col">
        <header className="flex items-start justify-between gap-4 border-b border-line px-5 py-4">
          <div>
            <h2 id="modal-title" className="font-sans text-sm font-medium">
              {title}
            </h2>
            {description && (
              <p id="modal-description" className="mt-1 font-sans text-[11px] text-ink-subtle">
                {description}
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
            className="-mr-1 -mt-1 rounded-control p-1.5 text-lg leading-none text-ink-faint transition-colors hover:bg-surface-raised hover:text-ink"
          >
            <i className="ti ti-x" aria-hidden="true" />
          </button>
        </header>

        <div className="max-h-[65dvh] overflow-y-auto px-5 py-5">{children}</div>

        {footer && (
          <footer className="flex justify-end gap-2 border-t border-line px-5 py-4">
            {footer}
          </footer>
        )}
      </div>
    </dialog>
  );
}