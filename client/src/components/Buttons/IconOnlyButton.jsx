import styles from "./Button.module.css";
import search from "../../assets/icons/search.svg";
import arrowBack from "../../assets/icons/arrow-back.svg";
import arrow45 from "../../assets/icons/arrow-45.svg";
import help from "../../assets/icons/help.svg";

export default function IconOnlyButton({
  buttonColor,
  variant,
  iconSrc,
  ariaLabel,
  type = "button",
}) {
  const colorClass = buttonColor ? (styles[buttonColor] ?? "") : "";
  const variantClass = variant ? (styles[variant] ?? "") : "";
  const icons = { search, arrow45, arrowBack, help };

  let icon;
  if (iconSrc) {
    icon = typeof iconSrc === "string" && icons[iconSrc] ? icons[iconSrc] : iconSrc;
  }

  return (
    <button
      className={`${styles.IconButton} ${colorClass} ${variantClass}`.trim()}
      type={type}
      aria-label={ariaLabel}
    >
      {icon && <img src={icon} className={styles.icon} alt="" aria-hidden="true" />}
    </button>
  );
}
