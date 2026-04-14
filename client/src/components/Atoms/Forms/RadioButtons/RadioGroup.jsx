import styles from "../Checkboxes/Checkbox.module.css";
import RadioButton from "./RadioButton";
import { useRef } from "react";

export default function RadioGroup({
  legend,
  radios,
  optional = false,
  required = false,
  subText,
  name,
  defaultValue,
  onChange, // receives the selected value string e.g. "dd" or "1"
}) {
  const hiddenInputRef = useRef(null);
  const radioRefs = useRef([]);

  const handleRadioChange = (e) => {
    // Bubble selected value up to the parent form
    if (onChange) onChange(e.target.value);

    if (!required || !hiddenInputRef.current) return;
    // Once any radio is selected the group is always valid
    hiddenInputRef.current.checked = true;
    hiddenInputRef.current.setCustomValidity("");
  };

  const legendEl = (
    <legend className={styles.legend}>
      {legend}
      {required && <span aria-hidden="true" className={styles.optional}> *</span>}
      {optional && <span aria-hidden="true" className={styles.optional}> (optional)</span>}
    </legend>
  );

  return (
    <fieldset className={styles.checkboxGroup} aria-required={required}>
      {required && (
        <input
          ref={hiddenInputRef}
          type="radio"
          style={{ display: "none" }}
          aria-hidden="true"
          tabIndex={-1}
          required
          defaultChecked={defaultValue !== undefined && defaultValue !== ""}
        />
      )}
      {subText ? (
        <div className={styles.legendSubtext}>
          {legendEl}
          <small className={styles.subText}>{subText}</small>
        </div>
      ) : legendEl}
      <div className={styles.checkboxContainer}>
        {radios.map((radio, index) => (
          <RadioButton
            key={radio.id}
            id={radio.id}
            name={name}
            radioLabel={radio.radioLabel}
            value={radio.value ?? radio.id}
            defaultChecked={defaultValue !== undefined && defaultValue === (radio.value ?? radio.id)}
            onChange={handleRadioChange}
            ref={(el) => {
              if (el) radioRefs.current[index] = el.querySelector("input");
            }}
          />
        ))}
      </div>
    </fieldset>
  );
}