import styles from "./Checkbox.module.css";
import { useId, forwardRef } from "react";

const Checkbox = forwardRef(function Checkbox({ checkboxLabel, id, name, defaultChecked, onChange }, ref) {
  const inputId = id ?? useId();
  const inputName = name ?? inputId;
  return (
    <div className={styles.checkbox} ref={ref}>
      <input type="checkbox" id={inputId} name={inputName} defaultChecked={defaultChecked} onChange={onChange} />
      <label htmlFor={inputId}>{checkboxLabel}</label>
    </div>
  );
});

export default Checkbox;