import styles from "./Tag.module.css";

export default function Tag({ tagName, tagType }) {
  return <li className={styles[tagType]}>{tagName}</li>;
}