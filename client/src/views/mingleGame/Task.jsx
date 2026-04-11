import { useNavigate, useOutletContext } from "react-router-dom";
import Timer from "../../components/Timer/Timer.jsx";
import styles from "./MingleGame.module.css";
import yrgoLogo from "../../assets/yrgo-logo.svg";
import RoundsDisplay from "../../components/RoundsDisplay/RoundsDisplay.jsx";
import { usePlayBeep } from "../../Hooks/useAudio.js";
export default function Task() {
  const mingle = useOutletContext();
  const navigate = useNavigate();
  const playBeep = usePlayBeep();

  const { currentQuestion } = mingle;

  // When the task timer expires, navigate to the Question page
  const handleExpire = () => {
    playBeep();
    // navigate("/question");
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
        <div className={styles.taskContainer}>
          <Timer
            minutes={0.1}
            onExpire={handleExpire}
            className={styles.timer}
          />
          <p
            className={`${styles.textMediumBold} ${styles.textBubble} ${styles.task}`}
          >
            {currentQuestion?.task}
          </p>
        </div>
      </div>
    </section>
  );
}
