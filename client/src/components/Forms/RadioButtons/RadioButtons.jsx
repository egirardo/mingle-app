import styles from "../Checkboxes/Checkbox.module.css";
import { useId } from "react";

export default function RadioButtons({ radioLabel, id, name }) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const inputName = name ?? inputId;
  return (
    <div className={styles.checkbox}>
      <input type="radio" id={inputId} name={inputName} />
      <label htmlFor={inputId}>{radioLabel}</label>
    </div>
  );
}