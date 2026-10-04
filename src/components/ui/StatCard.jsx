export default function StatCard({ label, value, sub, mono = true }) {
  return (
    <div className="rounded-panel border border-line bg-surface px-5 py-4">
      <p className="font-sans text-[11px] uppercase tracking-[0.08em] text-ink-subtle">
        {label}
      </p>
      <p
        className={`mt-2.5 text-2xl font-light text-ink ${
          mono ? "font-mono" : "font-sans"
        }`}
      >
        {value}
      </p>
      {sub && <p className="mt-1.5 font-sans text-[11px] text-ink-faint">{sub}</p>}
    </div>
  );
}