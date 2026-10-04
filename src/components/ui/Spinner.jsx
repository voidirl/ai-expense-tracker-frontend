export default function Spinner({ className = "" }) {
  return (
    <i
      role="status"
      aria-label="Loading"
      className={`ti ti-loader-2 animate-spin text-ink-subtle ${className}`}
    />
  );
}