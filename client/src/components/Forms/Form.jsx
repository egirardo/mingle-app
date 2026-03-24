import { useId } from "react";
import styles from "./Form.module.css";

export default function Form({ formLabel, placeholder, id, type }) {
  const inputId = id ?? useId();
  return (
    <form className={styles.form}>
      <label htmlFor={inputId}>{formLabel}</label>
      <input
        type={type}
        id={inputId}
        name={inputId}
        placeholder={placeholder}
      />
    </form>
  );
}
