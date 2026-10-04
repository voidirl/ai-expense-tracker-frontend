const LABEL = "mb-1.5 block font-sans text-[11px] tracking-[0.05em] text-ink-subtle";

export default function Field({ label, htmlFor, error, hint, children }) {
  return (
    <div>
      <label className={LABEL} htmlFor={htmlFor}>
        {label}
      </label>
      {children}
      {error ? (
        <p
          id={`${htmlFor}-error`}
          role="alert"
          className="mt-1.5 flex items-center gap-1 font-sans text-[11px] text-danger"
        >
          <i className="ti ti-alert-circle" aria-hidden="true" />
          {error}
        </p>
      ) : hint ? (
        <p id={`${htmlFor}-hint`} className="mt-1.5 font-sans text-[11px] text-ink-faint">
          {hint}
        </p>
      ) : null}
    </div>
  );
}