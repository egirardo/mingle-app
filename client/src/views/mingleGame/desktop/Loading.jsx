import { useNavigate, useOutletContext } from "react-router-dom";
import styles from "../MingleGame.module.css";
import Timer from "../../../components/Atoms/Timer/Timer.jsx";
import yrgoLogo from "../../../assets/yrgo-logo.svg";
import RoundsDisplay from "../../../components/RoundsDisplay/RoundsDisplay.jsx";
import { usePlayBeep } from "../../../Hooks/useAudio.js";

export default function Loading() {
  const mingle = useOutletContext();
  const navigate = useNavigate();
  const playBeep = usePlayBeep();

  const { currentQuestion, nextQuestion } = mingle;

  const handleExpire = () => {
    // When the question timer expires, advance to the next round and navigate to the task page
    nextQuestion?.();
    playBeep();
    navigate("/start/task");
  };

  return (
    <section className={styles.main}>
      <div className={`${styles.overlay} ${styles.backgroundBlurFilter}`} />
      <div className={styles.content}>
        <img className={styles.yrgoLogo} src={yrgoLogo} alt="Yrgo logo" />
        <RoundsDisplay
          currentRound={currentQuestion?.round || 0}
          className={styles.textLargeBold}
        />
        <Timer minutes={0.1} onExpire={handleExpire} className={styles.timer} />
        <div className={styles.loadingContainer}>
          <h2 className={styles.textMediumBold}>Time’s up!</h2>
          <p className={styles.textMediumRegular}>Next task loading...</p>
        </div>
      </div>
    </section>
  );
}
