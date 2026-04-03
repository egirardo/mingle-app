import styles from "./Checkbox.module.css";
import { useId } from "react";

export default function Checkbox({ checkboxLabel, id, name }) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const inputName = name ?? inputId;
  return (
    <div className={styles.checkbox}>
      <input type="checkbox" id={inputId} name={inputName} />
      <label htmlFor={inputId}>{checkboxLabel}</label>
    </div>
  );
}