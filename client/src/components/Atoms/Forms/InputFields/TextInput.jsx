import { useId } from "react";
import styles from "./TextInput.module.css";
import warningIcon from "../../../../assets/icons/warning-icon.svg";

export default function TextInput({
  formLabel,
  placeholder,
  id,
  name,
  type,
  subText,
  required = false,
  optional = false,
  className,
  value,
  onChange,
  error,
}) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const inputName = name ?? inputId;
  const errorId = `${inputId}-error`;

  const label = formLabel ? (
    <label htmlFor={inputId} className={styles.inputLabel}>
      {formLabel}
      {required && (
        <span aria-hidden="true">
          {" "}
          *
        </span>
      )}
      {optional && (
        <span aria-hidden="true">
          {" "}
          (optional)
        </span>
      )}
    </label>
  ) : null;

  return (
    <div className={`${styles.textForm} ${className ?? ""}`}>
      {subText ? (
        <div className={styles.labelSubtext}>
          {label}
          <small className={styles.subText}>{subText}</small>
        </div>
      ) : (
        label
      )}
      <div className={styles.inputContainer}>
        <input
          type={type}
          id={inputId}
          name={inputName}
          placeholder={placeholder}
          className={`${styles.textInput} ${error ? styles.error : ""}`}
          required={required}
          aria-required={required}
          aria-describedby={error ? errorId : undefined}
          aria-invalid={error ? "true" : undefined}
          value={value}
          onChange={onChange}
        />
        {error && (
          <img
            src={warningIcon}
            alt=""
            aria-hidden="true"
            className={styles.errorIcon}
          />
        )}
      </div>
      {error && (
        <span id={errorId} role="alert" className={styles.errorMessage}>
          {error}
        </span>
      )}
    </div>
  );
}
