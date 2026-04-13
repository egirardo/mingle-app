import IconOnlyButton from "../../Buttons/IconOnlyButton.jsx";
import styles from "./SearchBar.module.css";

export default function SearchBar() {
  return (
    <>
      <div className={styles.searchContainer}>
        <input type="text" placeholder="Search.." name="search" />
        <IconOnlyButton
          iconSrc="search"
          buttonColor="transparent"
          variant="iconOnlyLarge"
          ariaLabel="Search"
        />
      </div>
    </>
  );
}
