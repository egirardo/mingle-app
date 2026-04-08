import styles from "./Button.module.css";
import arrowRight from "../../assets/icons/arrow-right.svg";
import checkmark from "../../assets/icons/check.svg";
import arrow45 from "../../assets/icons/arrow-45.svg";

// Props:
// `buttonName` (string): visible label
// `buttonColor` (string): maps to CSS color classes
// `variant` (string): maps to variant/modifier classes (e.g. `blackBorder`, `textUnderline`)
// `iconSrc` (string|import): optional icon to show on the right
// `type` (string): button type, defaults to "button"
// `...buttonProps`: any other native button props (onClick, disabled, title, data-*) are forwarded

export default function Button({
  buttonName,
  buttonColor,
  variant,
  iconSrc,
  ariaLabel,
  type = "button",
  ...buttonProps
}) {
  // Variants
  const colorClass = buttonColor ? (styles[buttonColor] ?? "") : "";
  const variantClass = variant ? (styles[variant] ?? "") : "";
  const textClass = variant ? (styles[`${variant}Text`] ?? "") : "";
  const icons = { arrowRight, checkmark, arrow45 };

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
      aria-label={ariaLabel}
    >
      <span className={`${styles.label} ${textClass}`.trim()}>
        {buttonName}
      </span>
      {icon && (
        <img src={icon} className={styles.icon} alt="" aria-hidden="true" />
      )}
    </button>
  );
}
