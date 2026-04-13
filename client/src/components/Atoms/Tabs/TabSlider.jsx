import { useState } from "react";
import styles from "./TabSlider.module.css";

export default function TabSlider({ tabs, defaultIndex = 0, onChange }) {
  const [activeIndex, setActiveIndex] = useState(defaultIndex);

  const handleClick = (index) => {
    setActiveIndex(index);
    if (onChange) onChange(index, tabs[index]);
  };

  return (
    <div
      role="tablist"
      className={styles.sliderContainer}
      style={{ "--tab-count": tabs.length, "--active-index": activeIndex }}
    >
      {/* Sliding background pill */}
      <div className={styles.activePill} />

      {tabs.map((tab, index) => (
        <button
          key={index}
          id={`tab-${index}`}
          role="tab"
          aria-selected={activeIndex === index}
          aria-controls={`tabpanel-${index}`}
          data-label={tab}
          className={`${styles.tab} ${activeIndex === index ? styles.activeTab : ""}`}
          onClick={() => handleClick(index)}
          type="button"
        >
          {tab}
        </button>
      ))}
    </div>
  );
}