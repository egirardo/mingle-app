import { useId } from "react";
import styles from "./TextInput.module.css";

export default function TextInput({ formLabel, placeholder, id, type, subText, required = false, optional = false }) {
  const generatedId = useId();
  const inputId = id ?? generatedId;

  const label = (
    <label htmlFor={inputId} className={styles.inputLabel} >
      {formLabel}
      {required && <span aria-hidden="true" style={{ color: "grey", fontStyle: "italic" }}> *</span>}
      {optional && <span aria-hidden="true" className={styles.optional}> (optional)</span>}
    </label>
  );

  return (
    <div className={styles.textForm}>
      {subText ? (
        <div className={styles.labelSubtext}>
          {label}
          <small className={styles.subText}>{subText}</small>
        </div>
      ) : label}
      <input
        type={type}
        id={inputId}
        name={inputId}
        placeholder={placeholder}
        className={styles.textInput}
        required={required}
        aria-required={required}
      />
    </div>
  );
}
