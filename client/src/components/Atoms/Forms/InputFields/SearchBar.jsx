import IconOnlyButton from "../../Buttons/IconOnlyButton.jsx";
import styles from "./SearchBar.module.css";

export default function SearchBar({ value, onChange, onSearch }) {
  const handleKeyDown = (e) => {
    if (e.key === "Enter") onSearch?.();
  };

  return (
    <div className={styles.searchContainer}>
      <input
        type="text"
        placeholder="Search by name"
        name="search"
        value={value}
        onChange={onChange}
        onKeyDown={handleKeyDown}
      />
      <IconOnlyButton
        iconSrc="search"
        buttonColor="transparent"
        variant="iconOnlyLarge"
        ariaLabel="Search by name"
        onClick={onSearch}
      />
    </div>
  );
}
