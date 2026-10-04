import Field from "./Field";
import { inputClassName } from "../../lib/classes";

export default function Input({
  label,
  id,
  error,
  hint,
  className = "",
  ...rest
}) {
  return (
    <Field label={label} htmlFor={id} error={error} hint={hint}>
      <input
        id={id}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${id}-error` : hint ? `${id}-hint` : undefined}
        className={`${inputClassName({ invalid: Boolean(error) })} ${className}`}
        {...rest}
      />
    </Field>
  );
}