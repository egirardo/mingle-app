import { useEffect, useState, useRef } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import styles from "./MingleGame.module.css";
import DateTimer from "../../components/Timer/DateTimer.jsx";
import yrgoLogo from "../../assets/yrgo-logo.svg";
import Button from "../../components/Buttons/Button";
import socket, { connectSocket } from "../../socket.js";

export default function Introduction() {
  const mingle = useOutletContext();
  const navigate = useNavigate();
  const resetQuestionsRef = useRef(mingle?.resetQuestions);

  const [expired, setExpired] = useState(() => {
    const saved = localStorage.getItem("gameExpired");
    return saved ? JSON.parse(saved) : false;
  });

  useEffect(() => {
    resetQuestionsRef.current = mingle?.resetQuestions;
  }, [mingle]);

  useEffect(() => {
    // Reset expired state when component mounts
    setExpired(false);
    localStorage.removeItem("gameExpired");
  }, []);

  useEffect(() => {
    localStorage.setItem("gameExpired", JSON.stringify(expired));
  }, [expired]);

  useEffect(() => {
    connectSocket();

    const handleGameStarted = () => {
      resetQuestionsRef.current?.();
      navigate("/task");
    };

    const handleGameReset = () => {
      resetQuestionsRef.current?.();
      setExpired(false);
      localStorage.removeItem("gameExpired");
    };

    // Only listen for game-started when expired (ready to start)
    if (expired) {
      socket.on("game-started", handleGameStarted);
    }
    socket.on("game-reset", handleGameReset);

    return () => {
      socket.off("game-started", handleGameStarted);
      socket.off("game-reset", handleGameReset);
    };
  }, [navigate, expired]);

  const handleExpire = () => {
    setExpired(true);
  };

  const handleStartClick = () => {
    mingle?.resetQuestions?.();
    socket.emit("start-game");
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
          targetDate="2026-04-09T12:46:00+02:00"
          onExpire={handleExpire}
          className={styles.timer}
        />
        {/* <DateTimer
          targetDate="2026-04-22T15:00:00+02:00"
          onExpire={handleExpire}
          className={styles.timer}
        /> */}
        {!expired ? (
          <p className={styles.textMediumRegular}>
            Get ready to meet new people. Follow the instructions on your phone
            when the countdown reaches zero.
          </p>
        ) : (
          <p className={styles.textMediumRegular}>
            For the next 10 minutes, you'll have short and fast interactions.
            We'll guide you step by step.
          </p>
        )}
        <Button
          buttonName="Start"
          buttonColor="redWhiteBorder"
          iconSrc="arrowRightWhite"
          onClick={handleStartClick}
          style={{ display: expired ? "flex" : "none" }}
        />
      </div>
    </div>
  );
}
