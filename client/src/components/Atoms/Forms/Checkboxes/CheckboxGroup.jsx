import styles from "./Checkbox.module.css";
import Checkbox from "./Checkbox";
import { useRef } from "react";

export default function CheckboxGroup({
  legend,
  checkboxes,
  optional = false,
  required = false,
  subText,
  onChange, // receives string[] of selected names e.g. ["UI", "Frontend"]
  error = "",
}) {
  const hiddenInputRef = useRef(null);
  const checkboxRefs = useRef([]);
  const errorId = `checkboxgroup-error`;

  const handleCheckboxChange = () => {
    // Collect the name attribute of every checked input
    const selectedValues = checkboxRefs.current
      .filter((ref) => ref?.checked)
      .map((ref) => ref?.name);

    // Bubble selected values up to the parent form
    if (onChange) onChange(selectedValues);

    if (!required || !hiddenInputRef.current) return;
    const isAtLeastOneChecked = selectedValues.length > 0;
    hiddenInputRef.current.checked = isAtLeastOneChecked;
    hiddenInputRef.current.setCustomValidity(
      isAtLeastOneChecked ? "" : "Please select at least one option",
    );
  };

  const legendEl = (
    <legend className={styles.legend}>
      {legend}
      {required && (
        <span aria-hidden="true" className={styles.optional}>
          {" "}
          *
        </span>
      )}
      {optional && (
        <span aria-hidden="true" className={styles.optional}>
          {" "}
          (optional)
        </span>
      )}
    </legend>
  );

  return (
    <fieldset
      className={styles.checkboxGroup}
      aria-required={required}
      aria-invalid={error ? "true" : undefined}
      aria-describedby={error ? errorId : undefined}
    >
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
      ) : (
        legendEl
      )}
      <div className={styles.checkboxContainer}>
        {checkboxes.map((checkbox, index) => (
          <Checkbox
            key={checkbox.id}
            id={checkbox.id}
            name={checkbox.name}
            checkboxLabel={checkbox.checkboxLabel}
            onChange={handleCheckboxChange}
            ref={(el) => {
              if (el) checkboxRefs.current[index] = el.querySelector("input");
            }}
          />
        ))}
      </div>
      {error && (
        <span id={errorId} role="alert" className={styles.errorMessage}>
          {error}
        </span>
      )}
    </fieldset>
  );
}
