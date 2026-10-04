const VARIANTS = {
  primary:
    "bg-accent text-canvas hover:bg-ink disabled:bg-ink disabled:opacity-50",
  secondary:
    "bg-surface-raised text-ink border border-line hover:bg-surface-hover disabled:opacity-50",
  ghost: "text-ink-subtle hover:text-ink hover:bg-surface-raised disabled:opacity-50",
  danger:
    "bg-transparent text-danger border border-danger-muted hover:bg-danger hover:text-canvas disabled:opacity-50",
};

const SIZES = {
  sm: "h-8 px-3 text-[11px]",
  md: "h-9 px-4 text-xs",
};

export default function Button({
  children,
  variant = "primary",
  size = "md",
  type = "button",
  className = "",
  loading = false,
  disabled,
  ...rest
}) {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      className={`inline-flex shrink-0 items-center justify-center gap-2 rounded-control font-sans font-medium tracking-[0.03em] transition-colors disabled:cursor-not-allowed ${VARIANTS[variant] ?? VARIANTS.primary} ${SIZES[size] ?? SIZES.md} ${className}`}
      {...rest}
    >
      {loading && (
        <i className="ti ti-loader-2 animate-spin" aria-hidden="true" />
      )}
      {children}
    </button>
  );
}