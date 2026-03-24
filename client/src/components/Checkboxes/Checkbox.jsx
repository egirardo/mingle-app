import styles from "./Checkbox.module.css";
import { useId } from "react";

export default function Checkbox({ checkboxLabel, id, name }) {
  const inputId = id ?? useId();
  const inputName = name ?? id;
  return (
    <div className={styles.checkbox}>
      <input type="checkbox" id={inputId} name={inputName} />
      <label htmlFor={inputId}>{checkboxLabel}</label>
    </div>
  );
}