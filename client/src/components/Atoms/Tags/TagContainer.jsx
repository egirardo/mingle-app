import styles from "./TagContainer.module.css";
import Tag from "./Tag";

const MAX_VISIBLE_PROFILE_CARD_TAGS = 2;

export default function TagContainer({ tags = [], tagType="large" }) {
  const isProfileCard = tagType === "profileCard";
  const visibleTags = isProfileCard ? tags.slice(0, MAX_VISIBLE_PROFILE_CARD_TAGS) : tags;
  const overflow = isProfileCard ? tags.length - MAX_VISIBLE_PROFILE_CARD_TAGS : 0;

  return (
    <ul className={styles[tagType]}>
      {visibleTags.map((tag) => (
        <Tag key={tag} tagName={tag} tagType={tagType} />
      ))}
      {overflow > 0 && (
        <Tag key="tag-overflow" tagName={`+${overflow}`} tagType={tagType} />
      )}
    </ul>
  );
}