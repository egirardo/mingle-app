import styles from "../Checkboxes/Checkbox.module.css";
import RadioButton from "./RadioButton";
import { useRef } from "react";

export default function RadioGroup({ legend, radios, optional = false, required = false, subText, name }) {
  const hiddenInputRef = useRef(null);
  const radioRefs = useRef([]);

  const handleRadioChange = () => {
    if (!required || !hiddenInputRef.current) return;

    const isAtLeastOneChecked = radioRefs.current.some((ref) => ref?.checked);
    hiddenInputRef.current.setCustomValidity(
      isAtLeastOneChecked ? "" : "Please select an option"
    );
  };
  
  const legendEl = (
    <legend className={styles.legend}>
      {legend}
      {required && <span aria-hidden="true" style={{ color: "grey", fontStyle: "italic" }}> *</span>}
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
            onChange={handleRadioChange}
            ref={(el) => {
              if (el) radioRefs.current[index] = el.querySelector('input');
            }}
          />
        ))}
      </div>
    </fieldset>
  );
}