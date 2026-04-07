// import { useNavigate, useOutletContext } from "react-router-dom";
import { useState } from "react";
import styles from "./MingleGame.module.css";
import DateTimer from "../../components/Timer/DateTimer.jsx";
import yrgoLogo from "../../assets/yrgo-logo.svg";

export default function Introduction() {
  const [expired, setExpired] = useState(false);

  const handleExpire = () => {
    // When the timer expires, show follow-up text (and eventually start the game)
    setExpired(true);
    // to do: if server starts game, make it navigate to task
    navigate("/task");
  };

  return (
    <div className={`${styles.main} ${styles.mingle} ${styles.backgroundBlur}`}>
      <img className={styles.yrgoLogo} src={yrgoLogo} alt="Yrgo logo" />
      <div className={styles.IntroductionTitleContainer}>
        <h3
          className={`${styles.introductionHeader} ${styles.textMediumRegular}`}
        >
          Welcome to
        </h3>
        <h1 className={`${styles.introductionHeader} ${styles.textExtraLarge}`}>
          LIA FUSION
        </h1>
        <h2 className={`${styles.introductionHeader} ${styles.textLarge}`}>
          Speed Mingle
        </h2>
      </div>
      <div className={styles.introductionInfoContainer}>
        <DateTimer
          targetDate="2026-04-07T13:00+02:00"
          onExpire={handleExpire}
          className={styles.introductionTimer}
        />
        {/* <DateTimer targetDate="2026-04-22T15:00:00+02:00" /> */}
        {!expired ? (
          <p className={styles.textMediumRegular}>
            For the next 10 minutes, you’ll have short and fast interactions.
            We’ll guide you step by step.
          </p>
        ) : (
          <p className={styles.textMediumRegular}>
            Get ready to meet new people. Follow the instructions on your phone
            when the countdown reaches zero.
          </p>
        )}
      </div>
    </div>
  );
}
