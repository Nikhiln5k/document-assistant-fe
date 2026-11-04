import type { InputHTMLAttributes } from "react";

interface FormFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  name: string;
  label: string;
  hint?: string;
}

function FormField({ name, label, hint, ...inputProps }: FormFieldProps) {
  const hintId = hint ? `${name}-hint` : undefined;

  return (
    <div className="form-field">
      <label htmlFor={name} className="form-label">
        {label}
      </label>
      <input id={name} name={name} className="form-control" aria-describedby={hintId} {...inputProps} />
      {hint && (
        <div id={hintId} className="form-text">
          {hint}
        </div>
      )}
    </div>
  );
}

export default FormField;
