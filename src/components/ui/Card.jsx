export default function Card({ children, className = "", ...rest }) {
  return (
    <div className={`rounded-panel border border-line bg-surface ${className}`} {...rest}>
      {children}
    </div>
  );
}

export function CardLabel({ children, className = "" }) {
  return (
    <h2
      className={`font-sans text-[11px] uppercase tracking-[0.08em] text-ink-subtle ${className}`}
    >
      {children}
    </h2>
  );
}