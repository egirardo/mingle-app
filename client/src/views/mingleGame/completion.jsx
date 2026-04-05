import styles from "./MingleGame.module.css";
import Button from "../../components/Buttons/Button";
import { useOutletContext } from "react-router-dom";

export default function Completion() {
  const mingle = useOutletContext();

  return (
    <div className={styles.mingle}>
      <div>
        <h2 className={styles.largeTextBold}>You’re done!</h2>
        <p>You’ve met {mingle.questions.length} people</p>
      </div>
      <Button
        buttonName="Explore participants"
        buttonColor="gray"
        iconSrc="arrowRight"
      />
    </div>
  );
}
