import styles from "./Button.module.css";
import search from "../../../assets/icons/search.svg";
import arrowBack from "../../../assets/icons/arrow-back.svg";
import arrow45 from "../../../assets/icons/arrow-45.svg";
import help from "../../../assets/icons/help.svg";
import bigHeart from "../../../assets/icons/big-heart.svg";
import bigFilledHeart from "../../../assets/icons/big-filled-heart.svg";
import sound from "../../../assets/icons/sound.svg";
import filter from "../../../assets/icons/filter.svg";
import x from "../../../assets/icons/x.svg";
import arrowUp from "../../../assets/icons/arrow-up.svg";

// Props:
// `buttonColor`: CSS color modifier class
// `variant`: CSS variant class for the button (e.g., `iconOnly`, `iconOnlyLarge`)
// `iconSrc`: optional icon to render (if omitted the button has no image)
// `ariaLabel`: accessible name for screen readers (applied to the <button>)
// `...buttonProps`: forwarded to the underlying <button> (onClick, disabled, etc.)

export default function IconOnlyButton({
  buttonColor,
  variant = "iconOnly",
  iconSrc,
  ariaLabel,
  type = "button",
  ...buttonProps
}) {
  // Variants
  const colorClass = buttonColor ? (styles[buttonColor] ?? "") : "";
  const icons = {
    search,
    arrow45,
    arrowBack,
    help,
    bigHeart,
    bigFilledHeart,
    sound,
    filter,
    x,
    arrowUp,
  };

  // Icon is optional
  let icon;
  if (iconSrc) {
    icon =
      typeof iconSrc === "string" && icons[iconSrc] ? icons[iconSrc] : iconSrc;
  }

  return (
    <button
      {...buttonProps}
      className={`${styles.iconButton} ${colorClass}`.trim()}
      type={type}
      aria-label={ariaLabel}
    >
      {icon && (
        <img
          src={icon}
          className={styles[variant] ?? ""}
          alt=""
          aria-hidden="true"
        />
      )}
    </button>
  );
}
