import styles from "./Checkbox.module.css";
import { useId } from "react";

export default function Checkbox({ checkboxLabel, id, name, required = false }) {
  const inputId = id ?? useId();
  const inputName = name ?? inputId;
  return (
    <div className={styles.checkbox}>
      <input type="checkbox" id={inputId} name={inputName} required={required} />
      <label htmlFor={inputId}>{checkboxLabel}</label>
    </div>
  );
}