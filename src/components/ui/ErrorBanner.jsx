import Button from "./Button";

/**
 * Every fetch failure used to be a bare console.error, so a dead backend
 * rendered as a plausible-looking "₹0" dashboard with no explanation.
 */
export default function ErrorBanner({ error, onRetry, className = "" }) {
  if (!error) return null;

  const isOffline = error.status === 0;

  return (
    <div
      role="alert"
      className={`flex flex-wrap items-center gap-3 rounded-panel border border-danger-muted bg-surface px-4 py-3 ${className}`}
    >
      <i
        className={`ti ${isOffline ? "ti-plug-off" : "ti-alert-triangle"} text-danger`}
        aria-hidden="true"
      />
      <div className="min-w-0 flex-1">
        <p className="font-sans text-[13px] text-ink">{error.message}</p>
        {isOffline && (
          <p className="mt-0.5 font-sans text-[11px] text-ink-faint">
            Check that the backend is running and that VITE_API_URL points at it.
          </p>
        )}
      </div>
      {onRetry && (
        <Button variant="secondary" size="sm" onClick={onRetry}>
          <i className="ti ti-refresh" aria-hidden="true" />
          Retry
        </Button>
      )}
    </div>
  );
}