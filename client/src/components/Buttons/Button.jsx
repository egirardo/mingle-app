import styles from "./Button.module.css";

export default function Button({ buttonName, buttonColor, type = "button" }) {
  const colorClass = buttonColor ? (styles[buttonColor] ?? "") : "";
  return (
    <button className={`${styles.button} ${colorClass}`} type={type}>
      {buttonName}
    </button>
  );
}
