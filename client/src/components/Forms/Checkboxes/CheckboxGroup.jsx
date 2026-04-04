import styles from "./Checkbox.module.css";
import Checkbox from "./Checkbox";
import { useRef } from "react";

export default function CheckboxGroup({ legend, checkboxes, optional = false, required = false, subText }) {
  const hiddenInputRef = useRef(null);
  const checkboxRefs = useRef([]);

  const handleCheckboxChange = () => {
    if (!required || !hiddenInputRef.current) return;

    const isAtLeastOneChecked = checkboxRefs.current.some((ref) => ref?.checked);
    hiddenInputRef.current.setCustomValidity(
      isAtLeastOneChecked ? "" : "Please select at least one option"
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
            type="checkbox"
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
        {checkboxes.map((checkbox, index) => (
            <Checkbox
              key={checkbox.id}
              id={checkbox.id}
              name={checkbox.name}
              checkboxLabel={checkbox.checkboxLabel}
              onChange={handleCheckboxChange}
              ref={(el) => {
                if (el) checkboxRefs.current[index] = el.querySelector('input');
              }}
            />
            ))}
        </div>
    </fieldset>
  );
}
