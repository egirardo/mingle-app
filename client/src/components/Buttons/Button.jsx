import styles from "./Buttonn.module.css";

export default function Button({ buttonName, buttonColor }) {
  const colorClass = buttonColor ? styles[buttonColor] : "";
  return (
    <button className={`${styles.button} ${colorClass}`}>
      {buttonName}
    </button>
  );
}
