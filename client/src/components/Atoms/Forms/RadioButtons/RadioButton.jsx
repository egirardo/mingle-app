import styles from "../Checkboxes/Checkbox.module.css";
import { useId, forwardRef } from "react";

const RadioButton = forwardRef(function RadioButton({ radioLabel, id, name, value, onChange }, ref) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const inputName = name ?? inputId;
  const inputValue = value ?? inputId;
  return (
    <div className={styles.checkbox} ref={ref}>
      <input type="radio" id={inputId} name={inputName} value={inputValue} onChange={onChange} />
      <label htmlFor={inputId}>{radioLabel}</label>
    </div>
  );
});

export default RadioButton;
