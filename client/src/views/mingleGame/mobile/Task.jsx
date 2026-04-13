import { useNavigate, useOutletContext } from "react-router-dom";
import Timer from "../../../components/Atoms/Timer/Timer.jsx";
import styles from "../MingleGame.module.css";
import yrgoLogo from "../../../assets/yrgo-logo.svg";
import RoundsDisplay from "../../../components/RoundsDisplay/RoundsDisplay.jsx";
export default function Task() {
  const mingle = useOutletContext();
  const navigate = useNavigate();

  const { currentQuestion } = mingle;

  // When the task timer expires, navigate to the Question page
  const handleExpire = () => {
    navigate("/question");
  };

  return (
    <section className={styles.main}>
      <div className={`${styles.overlay} ${styles.backgroundDarkFilter}`} />
      <div className={styles.content}>
        <div className={styles.mobileContainer}>
          <img className={styles.yrgoLogo} src={yrgoLogo} alt="Yrgo logo" />
          <RoundsDisplay
            currentRound={currentQuestion?.round || 0}
            className={styles.textLargeBold}
          />
          <Timer
            minutes={0.5}
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
