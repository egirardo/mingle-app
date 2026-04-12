import { useNavigate, useOutletContext } from "react-router-dom";
import Timer from "../../../components/Timer/Timer.jsx";
import styles from "../MingleGame.module.css";
import yrgoLogo from "../../../assets/yrgo-logo.svg";
import RoundsDisplay from "../../../components/RoundsDisplay/RoundsDisplay.jsx";
import { usePlayBeep } from "../../../Hooks/useAudio.js";

export default function Question() {
  const mingle = useOutletContext();
  const navigate = useNavigate();
  const playBeep = usePlayBeep();

  const { currentQuestion } = mingle;

  // Checks if it's the final round of the game
  const isFinalRound =
    mingle.index === mingle.questions.length - 1 ||
    currentQuestion?.round === mingle.questions.length;

  // When the question timer expires, finish the game on the last round;
  // otherwise navigate to the loading page.
  const handleExpire = () => {
    playBeep();
    if (isFinalRound) {
      navigate("/start/completion");
      return;
    }
    // navigate("/start/loading");
  };

  return (
    <section className={`${styles.main} ${styles.mainGrid}`}>
      <img className={styles.yrgoLogo} src={yrgoLogo} alt="Yrgo logo" />
      <div className={`${styles.timerContainerDesktop}`}>
        <RoundsDisplay
          currentRound={currentQuestion?.round || 0}
          className={styles.textLargeBold}
        />
        <Timer minutes={0.1} onExpire={handleExpire} className={styles.timer} />
      </div>
      <div
        className={`${styles.textContainerDesktop} ${styles.backgroundDarkFilter}`}
      >
        <h3 className={styles.textMediumBold}>Question:</h3>
        <p className={`${styles.textMediumBold} ${styles.textBubble}`}>
          {currentQuestion?.question}
        </p>
      </div>
    </section>
  );
}
