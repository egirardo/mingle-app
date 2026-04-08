import { useId } from "react";
import styles from "./TextInput.module.css";

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
}) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  // Use explicit name prop; fall back to inputId only as last resort.
  // Previously this always fell back to the auto-generated id, which made
  // it impossible to reference fields by a stable name.
  const inputName = name ?? inputId;

  const label = formLabel ? (
    <label htmlFor={inputId} className={styles.inputLabel}>
      {formLabel}
      {required && <span aria-hidden="true" style={{ color: "#D5D5D5", fontStyle: "italic" }}> *</span>}
      {optional && <span aria-hidden="true" className={styles.optional}> (optional)</span>}
    </label>
  ) : null;

  return (
    <div className={`${styles.textForm} ${className ?? ""}`}>
      {subText ? (
        <div className={styles.labelSubtext}>
          {label}
          <small className={styles.subText}>{subText}</small>
        </div>
      ) : label}
      <input
        type={type}
        id={inputId}
        name={inputName}
        placeholder={placeholder}
        className={styles.textInput}
        required={required}
        aria-required={required}
        value={value}
        onChange={onChange}
      />
    </div>
  );
}