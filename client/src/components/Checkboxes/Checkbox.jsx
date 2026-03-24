import styles from "./Checkbox.module.css";

export default function Checkbox({ checkboxLabel }) {
  return (
    <form className={styles.checkbox}>
      <input
        type="checkbox"
        id="checkboxLabel"
        name="checkboxLabel"
      />
      <label htmlFor="checkboxLabel">{checkboxLabel}</label>
    </form>
  );
}