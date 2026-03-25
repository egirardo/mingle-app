import styles from "./Tag.module.css";

export default function Tag({ tagName }) {
  return <li className={styles.tag}>{tagName}</li>;
}