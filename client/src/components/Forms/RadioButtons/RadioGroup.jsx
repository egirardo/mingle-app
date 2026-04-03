import styles from "../Checkboxes/Checkbox.module.css";
import RadioButtons from "./RadioButtons";

export default function RadioGroup({ legend, radios, optional = false, required = false, subText, name }) {
  
  const legendEl = (
    <legend className={styles.legend}>
      {legend}
      {required && <span aria-hidden="true" style={{ color: "grey", fontStyle: "italic" }}> *</span>}
      {optional && <span aria-hidden="true" className={styles.optional}> (optional)</span>}
    </legend>
  );

  return (
    <fieldset className={styles.checkboxGroup}>
      {subText ? (
        <div className={styles.legendSubtext}>
          {legendEl}
          <small className={styles.subText}>{subText}</small>
        </div>
      ) : legendEl}
      <div className={styles.checkboxContainer}>
        {radios.map((radio) => (
          <RadioButtons
            key={radio.id}
            id={radio.id}
            name={name}
            radioLabel={radio.radioLabel}
          />
        ))}
      </div>
    </fieldset>
  );
}