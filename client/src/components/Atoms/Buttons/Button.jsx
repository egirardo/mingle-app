import styles from "./Button.module.css";
import arrowRight from "../../../assets/icons/arrow-right.svg";
import arrowRightWhite from "../../../assets/icons/arrow-right-white.svg";
import checkmark from "../../../assets/icons/check.svg";
import arrow45 from "../../../assets/icons/arrow-45.svg";
import profileIcon from "../../../assets/icons/profile.svg";


// Props:
// `buttonName` (string): visible label
// `buttonColor` (string): maps to CSS color classes
// `variant` (string): maps to variant/modifier classes (e.g. `blackBorder`, `textUnderline`)
// `iconSrc` (string|import): optional icon to show on the right (or left if `iconLeft` is true)
// `iconLeft` (bool): if true, renders the icon on the left instead of the right
// `type` (string): button type, defaults to "button"
// `...buttonProps`: any other native button props (onClick, disabled, title, data-*) are forwarded

export default function Button({
  buttonName,
  buttonColor,
  variant,
  iconSrc,
  iconLeft = false,
  ariaLabel,
  type = "button",
  ...buttonProps
}) {
  const colorClass = buttonColor ? (styles[buttonColor] ?? "") : "";
  const variantClass = variant ? (styles[variant] ?? "") : "";
  const textClass = variant ? (styles[`${variant}Text`] ?? "") : "";
  const icons = { arrowRight, arrowRightWhite, checkmark, arrow45, profileIcon };

  let icon;
  if (iconSrc) {
    icon =
      typeof iconSrc === "string" && icons[iconSrc] ? icons[iconSrc] : iconSrc;
  }

  const iconEl = icon && (
    <img
      src={icon}
      className={`${styles.icon} ${iconLeft ? styles.iconLeft : styles.iconRight}`}
      alt=""
      aria-hidden="true"
    />
  );

  return (
    <button
      {...buttonProps}
      className={`${styles.button} ${icon ? (iconLeft ? styles.hasIconLeft : styles.hasIconRight) : ""} ${colorClass} ${variantClass}`.trim()}
      type={type}
      aria-label={ariaLabel}
    >
      {iconLeft && iconEl}
      <span className={`${styles.label} ${textClass}`.trim()}>
        {buttonName}
      </span>
      {!iconLeft && iconEl}
    </button>
  );
}