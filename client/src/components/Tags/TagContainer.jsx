import styles from "./TagContainer.module.css";
import Tag from "./Tag";

export default function TagContainer({ tags = [], tagType="large" }) {
  return (
    <ul className={styles[tagType]}>
      {tags.map((tag) => (
        <Tag key={tag} tagName={tag} tagType={tagType} />
      ))}
    </ul>
  );
}