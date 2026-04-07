// import { useNavigate, useOutletContext } from "react-router-dom";
import { useState } from "react";
import styles from "./MingleGame.module.css";
import DateTimer from "../../components/Timer/DateTimer.jsx";

export default function Introduction() {
  const [expired, setExpired] = useState(false);
  

  const handleExpire = () => {
    // When the timer expires, show follow-up text (and eventually start the game)
    setExpired(true);
    // to do: if server starts game, make it navigate to task
    // navigate("/task");
  };

  return (
    <div className={styles.mingleIntroduction}>
      {/* add app logo here */}
      <span className={styles.introductionHeader}>Welcome to</span>
      <h1 className={styles.introductionHeader}>
        Welcome to Ignite Speed Mingle
      </h1>
      <DateTimer targetDate="04/06/2026 22:11" onExpire={handleExpire} />
      {/* <DateTimer targetDate="04/22/2026 15:00" /> */}
      {!expired ? (
        <p className="introductionText">
          For the next 10 minutes, you’ll have short and fast interactions.
          We’ll guide you step by step.
        </p>
      ) : (
        <p className="introductionText">
          Get ready to meet new people. Follow the instructions on your phone
          when the countdown drops.
        </p>
      )}
    </div>
  );
}
