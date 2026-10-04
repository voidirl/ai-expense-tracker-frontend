const CONTROL =
  "w-full rounded-control border border-line-strong bg-canvas px-3 py-2 font-sans text-[13px] text-ink placeholder:text-ink-faint transition-colors focus:border-ink-subtle disabled:cursor-not-allowed disabled:opacity-50";

/** Shared by Input and Select so both controls stay visually identical. */
export function inputClassName({ invalid = false } = {}) {
  return `${CONTROL} ${invalid ? "border-danger" : ""}`;
}