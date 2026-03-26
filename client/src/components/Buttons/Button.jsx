import styles from "./Button.module.css";
import arrowRight from "../../assets/icons/arrow-right.svg";
import checkmark from "../../assets/icons/check.svg";

export default function Button({
  buttonName,
  buttonColor,
  variant,
  iconSrc,
  type = "button",
  ...buttonProps
}) {
  // Variants
  const colorClass = buttonColor ? (styles[buttonColor] ?? "") : "";
  const variantClass = variant ? (styles[variant] ?? "") : "";
  const icons = { arrowRight, checkmark };

  // Icons
  let icon;
  if (iconSrc) {
    icon =
      typeof iconSrc === "string" && icons[iconSrc] ? icons[iconSrc] : iconSrc;
  }

  return (
    <button
      {...buttonProps}
      className={`${styles.button} ${icon ? styles.hasIcon : ""} ${colorClass} ${variantClass}`.trim()}
      type={type}
    >
      <span className={styles.label}>{buttonName}</span>
      {icon && (
        <img src={icon} className={styles.icon} alt="" aria-hidden="true" />
      )}
    </button>
  );
}
