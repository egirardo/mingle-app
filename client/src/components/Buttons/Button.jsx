import styles from "./Button.module.css";

export default function Button({ buttonName, buttonColor }) {
  const colorClass = buttonColor ? styles[buttonColor] : "";
  return (
    <button className={`${styles.button} ${colorClass}`} type="submit">
      {buttonName}
    </button>
  );
}
