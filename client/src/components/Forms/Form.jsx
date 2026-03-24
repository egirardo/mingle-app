import { useId } from "react";
import styles from "./Form.module.css";

export default function Form({ formLabel, placeholder, id, type }) {
  const inputId = id ?? useId();
  return (
    <>
      <label htmlFor={inputId} className={styles.form}>
        {formLabel}
      </label>
      <input
        type={type}
        id={inputId}
        name={inputId}
        placeholder={placeholder}
        className={styles.form}
      />
    </>
  );
}
