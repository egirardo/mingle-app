import styles from "./Form.module.css";

export default function Form({ formLabel, placeholder }) {
  return (
    <form className={styles.form}>
      <label htmlFor="formLabel">{formLabel}</label>
      <input
        type="text"
        id="formLabel"
        name="formLabel"
        placeholder={placeholder}
      />
    </form>
  );
}
