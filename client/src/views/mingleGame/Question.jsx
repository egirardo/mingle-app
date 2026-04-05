import { useNavigate, useOutletContext } from "react-router-dom";
import Timer from "../../components/Timer/Timer.jsx";
import styles from "./MingleGame.module.css";
import Button from "../../components/Buttons/Button";

export default function Question() {
  const mingle = useOutletContext();
  const navigate = useNavigate();

  const { currentQuestion } = mingle;
  const { nextQuestion } = mingle;

  // Checks if its the final round of the game
  const isFinalRound =
    mingle.index === mingle.questions.length - 1 ||
    currentQuestion?.round === mingle.questions.length;

  // When the question timer expires, finish the game on the last round;
  // otherwise advance to the next round and navigate to the loading page.
  const handleExpire = () => {
    if (isFinalRound) {
      navigate("/completion");
      return;
    }
    nextQuestion?.();
    navigate("/loading");
  };

  return (
    <div className={styles.mingle}>
      <div className={styles.roundCountContainer}>
        <span>
          {currentQuestion?.round}/{mingle.questions.length}
        </span>
      </div>
      <Timer minutes={0.1} onExpire={handleExpire} className={styles.hidden} />
      <div className={styles.instructionContainer}>
        <p className={styles.largeTextBold}>Ask</p>
        <p className={styles.largeText}>{currentQuestion?.question}</p>
      </div>
      {/* temporary button */}
      <Button
        buttonName="⭕ I talked to someone"
        buttonColor="gray"
        iconSrc="arrowRight"
      />
    </div>
  );
}
