export default function EmptyState({ icon = "ti-inbox", title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 px-6 py-12 text-center">
      <i className={`ti ${icon} text-2xl text-ink-faint`} aria-hidden="true" />
      <p className="font-sans text-[13px] text-ink-muted">{title}</p>
      {description && (
        <p className="max-w-xs font-sans text-[11px] leading-relaxed text-ink-faint">
          {description}
        </p>
      )}
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
}