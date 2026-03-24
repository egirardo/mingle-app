import { useId } from "react";
import styles from "./TextInput.module.css";

export default function TextInput({ formLabel, placeholder, id, type }) {
  const inputId = id ?? useId();
  return (
    <>
      <label htmlFor={inputId} className={styles.textForm}>
        {formLabel}
      </label>
      <input
        type={type}
        id={inputId}
        name={inputId}
        placeholder={placeholder}
        className={styles.textInput}
      />
    </>
  );
}
