import styles from "./MingleGame.module.css";
import Button from "../../components/Buttons/Button";

export default function Completion() {
  return (
    <div className={styles.mingle}>
      <div>
        <h2>You’re done!</h2>
        <p>You’ve met 3 people</p>
      </div>
      <Button
        buttonName="Explore participants"
        buttonColor="gray"
        iconSrc="arrowRight"
      />
    </div>
  );
}
