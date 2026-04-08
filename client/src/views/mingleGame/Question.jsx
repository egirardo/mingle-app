import { useNavigate, useOutletContext } from "react-router-dom";
import Timer from "../../components/Timer/Timer.jsx";
import styles from "./MingleGame.module.css";
import yrgoLogo from "../../assets/yrgo-logo.svg";
import RoundsDisplay from "../../components/RoundsDisplay/RoundsDisplay.jsx";

export default function Question() {
  const mingle = useOutletContext();
  const navigate = useNavigate();

  const { currentQuestion } = mingle;

  // Checks if it's the final round of the game
  const isFinalRound =
    mingle.index === mingle.questions.length - 1 ||
    currentQuestion?.round === mingle.questions.length;

  // When the question timer expires, finish the game on the last round;
  // otherwise navigate to the loading page.
  const handleExpire = () => {
    if (isFinalRound) {
      navigate("/completion");
      return;
    }
    navigate("/loading");
  };

  return (
    <div className={`${styles.main} ${styles.backgroundBlur}`}>
      <img className={styles.yrgoLogo} src={yrgoLogo} alt="Yrgo logo" />
      <div className={styles.questionContainer}>
        <RoundsDisplay
          currentRound={currentQuestion?.round || 0}
          className={styles.textLargeBold}
        />
        <Timer minutes={0.1} onExpire={handleExpire} className={styles.timer} />
        <div className={styles.questionDisplay}>
          <h3 className={styles.textLargeBold}>Question:</h3>
          <p className={`${styles.textMediumRegular} ${styles.question}`}>
            {currentQuestion?.question}
          </p>
        </div>
      </div>
    </div>
  );
}
