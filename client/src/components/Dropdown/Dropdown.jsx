import { useState, useRef, useEffect } from "react";
import styles from "./Dropdown.module.css";


import ArrowSmallExpand from "../../assets/icons/arrow-small-expand.svg?react";
import ArrowSmallDefault from "../../assets/icons/arrow-small-default.svg?react";

export default function Dropdown({ options, onSelect, defaultValue }) {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState(defaultValue || options[0]);
  const ref = useRef(null);

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function handleSelect(option) {
    setSelected(option);
    onSelect(option.value);
    setIsOpen(false);
  }

  const otherOptions = options.filter((o) => o.value !== selected.value);

  return (
    <div className={styles.wrapper} ref={ref}>
      {/* Pill trigger */}
      <button
        className={`${styles.pill} ${isOpen ? styles.pillOpen : ""}`}
        onClick={() => setIsOpen((prev) => !prev)}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
      >
        <span className={styles.pillLabel}>{selected.label}</span>

        <span className={`${styles.chevron} ${isOpen ? styles.chevronOpen : ""}`}>
          {isOpen ? (
            <ArrowSmallDefault /> 
        ) : (
            <ArrowSmallExpand />
          )}
        </span>
      </button>

      {/* Expanded option list */}
      {isOpen && (
        <ul className={styles.optionList} role="listbox">
          {otherOptions.map((option) => (
            <li
              key={option.value}
              className={styles.option}
              role="option"
              aria-selected={false}
              onClick={() => handleSelect(option)}
            >
              {option.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}