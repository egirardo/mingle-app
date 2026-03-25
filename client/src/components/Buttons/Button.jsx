import styles from "./Button.module.css";
import arrowRight from "../../assets/icons/arrow-right.svg";

export default function Button({ buttonName, buttonColor, variant, type = "button" }) {
  const colorClass = buttonColor ? (styles[buttonColor] ?? "") : "";
  const variantClass = variant ? (styles[variant] ?? "") : "";
  return (
    <button
      className={`${styles.button} ${colorClass} ${variantClass}` .trim()}
      type={type}
    >
      <span className={styles.label}>{buttonName}</span>
      <img
        src={arrowRight}
        className={styles.arrow}
        alt="arrow poining to the right"
      />
    </button>
  );
}
