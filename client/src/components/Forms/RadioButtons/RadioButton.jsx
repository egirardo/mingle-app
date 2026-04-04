import styles from "../Checkboxes/Checkbox.module.css";
import { useId } from "react";

export default function RadioButton({ radioLabel, id, name, required = false, value }) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const inputName = name ?? inputId;
  const inputValue = value ?? inputId;
  return (
    <div className={styles.checkbox}>
      <input type="radio" id={inputId} name={inputName} value={inputValue} required={required} />
      <label htmlFor={inputId}>{radioLabel}</label>
    </div>
  );
}
