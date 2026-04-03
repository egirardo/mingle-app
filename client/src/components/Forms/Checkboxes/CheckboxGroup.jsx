import styles from "./Checkbox.module.css";
import Checkbox from "./Checkbox";

export default function CheckboxGroup({ legend, checkboxes, optional = false, required = false, subText }) {
  
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
        {checkboxes.map((checkbox) => (
            <Checkbox
                key={checkbox.id}
                id={checkbox.id}
                name={checkbox.name}
                checkboxLabel={checkbox.checkboxLabel}
            />
            ))}
        </div>
    </fieldset>
  );
}
