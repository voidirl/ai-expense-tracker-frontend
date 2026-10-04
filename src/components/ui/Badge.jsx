export default function Badge({ children, color, className = "" }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border border-line px-2 py-0.5 font-sans text-[10px] uppercase tracking-[0.06em] ${className}`}
    >
      {color && (
        <span
          aria-hidden="true"
          className="h-1.5 w-1.5 rounded-full"
          style={{ backgroundColor: color }}
        />
      )}
      {children}
    </span>
  );
}