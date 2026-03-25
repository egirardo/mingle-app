import styles from "./TagContainer.module.css";
import Tag from "./Tag";

export default function TagContainer({ tags = [] }) {
  return (
    <ul className={styles.tagContainer}>
      {tags.map((tag) => (
        <Tag key={tag} tagName={tag} />
      ))}
    </ul>
  );
}