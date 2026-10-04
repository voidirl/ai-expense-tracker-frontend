import Field from "./Field";
import { inputClassName } from "../../lib/classes";

export default function Select({
  label,
  id,
  error,
  hint,
  children,
  className = "",
  ...rest
}) {
  return (
    <Field label={label} htmlFor={id} error={error} hint={hint}>
      <select
        id={id}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${id}-error` : hint ? `${id}-hint` : undefined}
        className={`${inputClassName({ invalid: Boolean(error) })} cursor-pointer ${className}`}
        {...rest}
      >
        {children}
      </select>
    </Field>
  );
}