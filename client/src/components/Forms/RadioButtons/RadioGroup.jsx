import styles from "../Checkboxes/Checkbox.module.css";
import RadioButton from "./RadioButton";

export default function RadioGroup({ legend, radios, optional = false, required = false, subText, name }) {
  
  const legendEl = (
    <legend className={styles.legend}>
      {legend}
      {required && <span aria-hidden="true" style={{ color: "grey", fontStyle: "italic" }}> *</span>}
      {optional && <span aria-hidden="true" className={styles.optional}> (optional)</span>}
    </legend>
  );

  return (
    <fieldset className={styles.checkboxGroup} aria-required={required}>
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
            name={name} // Use the group name for all radio buttons to ensure they are part of the same group MUST INCLUDE. Without this, the radio buttons will not function as a group and multiple options can be selected at once.
            radioLabel={radio.radioLabel}
            value={radio.value ?? radio.id}
            required={required && index === 0}
          />
        ))}
      </div>
    </fieldset>
  );
}