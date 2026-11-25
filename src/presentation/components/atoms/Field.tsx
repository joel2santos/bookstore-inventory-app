import React, { useId, useState } from "react";
import { Eye, EyeOff } from "lucide-react";

export type FieldType =
  | "text"
  | "number"
  | "password"
  | "date"
  | "select"
  | "textarea";

export interface SelectOption {
  label: string;
  value: string;
  disabled?: boolean;
}

export interface FieldProps {
  id?: string;
  name?: string;
  type?: FieldType;
  label?: string;
  placeholder?: string;
  value: string | number;
  onChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => void;
  onBlur?: (
    e: React.FocusEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => void;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  error?: string;
  hint?: string;
  disabled?: boolean;
  required?: boolean;
  readOnly?: boolean;
  options?: SelectOption[];
  rows?: number;
  min?: number | string;
  max?: number | string;
  step?: number | string;
  autoComplete?: string;
  className?: string;
  inputClassName?: string;
}

export const Field: React.FC<FieldProps> = ({
  id,
  name,
  type = "text",
  label,
  placeholder,
  value,
  onChange,
  onBlur,
  leftIcon,
  rightIcon,
  error,
  hint,
  disabled = false,
  required = false,
  readOnly = false,
  options = [],
  rows = 3,
  min,
  max,
  step,
  autoComplete,
  className = "",
  inputClassName = "",
}) => {
  const generatedId = useId();
  const fieldId = id ?? generatedId;
  const messageId = `${fieldId}-message`;
  const [showPassword, setShowPassword] = useState(false);

  const isPassword = type === "password";
  const resolvedRightIcon =
    rightIcon ??
    (isPassword ? (
      <button
        type="button"
        onClick={() => setShowPassword((prev) => !prev)}
        className="text-stone-400 hover:text-stone-700 focus:outline-none"
        aria-label={showPassword ? "Hide password" : "Show password"}
        tabIndex={-1}
      >
        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
      </button>
    ) : undefined);

  const hasLeftIcon = Boolean(leftIcon);
  const hasRightIcon = Boolean(resolvedRightIcon);

  const baseControlClasses = [
    "w-full rounded-lg border bg-white text-sm text-stone-900 placeholder:text-stone-400",
    "transition-colors duration-150",
    "focus:outline-none focus:ring-2 focus:ring-offset-0",
    "disabled:cursor-not-allowed disabled:bg-stone-100 disabled:text-stone-500",
    error
      ? "border-rose-400 focus:border-rose-500 focus:ring-rose-500/20"
      : "border-stone-300 hover:border-stone-400 focus:border-stone-800 focus:ring-stone-800/15",
    hasLeftIcon ? "pl-10" : "pl-3.5",
    hasRightIcon ? "pr-10" : "pr-3.5",
    type === "textarea" ? "py-2.5" : "h-10",
    inputClassName,
  ].join(" ");

  const resolvedInputType = isPassword && showPassword ? "text" : type;

  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {label && (
        <label
          htmlFor={fieldId}
          className="text-xs font-medium tracking-wide text-stone-700"
        >
          {label}
          {required && <span className="ml-0.5 text-rose-500">*</span>}
        </label>
      )}

      <div className="relative flex items-center">
        {hasLeftIcon && (
          <span
            className={`pointer-events-none absolute left-3 flex items-center text-stone-400 ${
              type === "textarea" ? "top-3" : ""
            }`}
          >
            {leftIcon}
          </span>
        )}

        {type === "select" ? (
          <select
            id={fieldId}
            name={name}
            value={value}
            onChange={onChange}
            onBlur={onBlur}
            disabled={disabled}
            required={required}
            aria-invalid={Boolean(error)}
            aria-describedby={error || hint ? messageId : undefined}
            className={baseControlClasses}
          >
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}
            {options.map((opt) => (
              <option
                key={opt.value}
                value={opt.value}
                disabled={opt.disabled}
              >
                {opt.label}
              </option>
            ))}
          </select>
        ) : type === "textarea" ? (
          <textarea
            id={fieldId}
            name={name}
            value={value}
            onChange={onChange}
            onBlur={onBlur}
            placeholder={placeholder}
            disabled={disabled}
            required={required}
            readOnly={readOnly}
            rows={rows}
            aria-invalid={Boolean(error)}
            aria-describedby={error || hint ? messageId : undefined}
            className={baseControlClasses}
          />
        ) : (
          <input
            id={fieldId}
            name={name}
            type={resolvedInputType}
            value={value}
            onChange={onChange}
            onBlur={onBlur}
            placeholder={placeholder}
            disabled={disabled}
            required={required}
            readOnly={readOnly}
            min={min}
            max={max}
            step={step}
            autoComplete={autoComplete}
            aria-invalid={Boolean(error)}
            aria-describedby={error || hint ? messageId : undefined}
            className={baseControlClasses}
          />
        )}

        {hasRightIcon && (
          <span
            className={`absolute right-3 flex items-center text-stone-400 ${
              type === "textarea" ? "top-3" : ""
            } ${isPassword && !rightIcon ? "" : "pointer-events-none"}`}
          >
            {resolvedRightIcon}
          </span>
        )}
      </div>

      {(error || hint) && (
        <p
          id={messageId}
          className={`text-xs ${error ? "text-rose-600" : "text-stone-500"}`}
        >
          {error ?? hint}
        </p>
      )}
    </div>
  );
};
