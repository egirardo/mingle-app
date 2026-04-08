import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./MingleGame.module.css";
import DateTimer from "../../components/Timer/DateTimer.jsx";
import yrgoLogo from "../../assets/yrgo-logo.svg";
import Button from "../../components/Buttons/Button";
import socket from "../../socket.js";

export default function Introduction() {
  const navigate = useNavigate();
  const [expired ] = useState(false);

  useEffect(() => {
    const handleGameStarted = () => {
      navigate("/task");
    };

    socket.on("game-started", handleGameStarted);

    return () => {
      socket.off("game-started", handleGameStarted);
    };
  }, [navigate]);

  const handleStartClick = () => {
    const emitStartGame = () => socket.emit("start-game");

    if (socket.connected) {
      emitStartGame();
      navigate("/task");
      return;
    }

    socket.once("connect", emitStartGame);
    socket.connect();
    navigate("/task");
  };

  return (
    <div className={`${styles.main} ${styles.backgroundBlur}`}>
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
          targetDate="2026-04-08T14:15+02:00"
          onExpire={handleExpire}
          className={styles.timer}
        />
        {/* <DateTimer targetDate="2026-04-22T15:00:00+02:00" /> */}
        {!expired ? (
          <div>
            <p className={styles.textMediumRegular}>
              For the next 10 minutes, you’ll have short and fast interactions.
              We’ll guide you step by step.
            </p>
            <Button
              buttonName="Start"
              buttonColor="redWhiteBorder"
              iconSrc="arrowRightWhite"
              onClick={handleStartClick}
            />
          </div>
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
