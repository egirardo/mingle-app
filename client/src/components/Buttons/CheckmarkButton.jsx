import styles from "./Button.module.css";
import checkmark from "../../assets/icons/check.svg";

export default function CheckmarkButton({ buttonName, buttonColor, variant, type = "button" }) {
  const colorClass = buttonColor ? (styles[buttonColor] ?? "") : "";
  const variantClass = variant ? (styles[variant] ?? "") : "";
  return (
    <button
      className={`${styles.button} ${colorClass} ${variantClass}`.trim()}
      type={type}
    >
      <span className={styles.label}>{buttonName}</span>
      <img src={checkmark} className={styles.icon} alt="" aria-hidden="true" />
    </button>
  );
}
