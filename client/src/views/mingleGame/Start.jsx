import { useEffect, useState, useRef } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import styles from "./MingleGame.module.css";
import DateTimer from "../../components/Timer/DateTimer.jsx";
import Button from "../../components/Buttons/Button";
import socket, { connectSocket } from "../../socket.js";
import {
  usePlayBeep,
  usePlaySound,
  useUnlockAudio,
} from "../../Hooks/useAudio.js";
import instructionsAudio from "../../assets/audio/instructions.mp3";

export default function Start() {
  const mingle = useOutletContext();
  const navigate = useNavigate();

  const playBeep = usePlayBeep();
  const [, setAudioFailed] = useState(false);
  const playInstructions = usePlaySound(instructionsAudio, () =>
    setAudioFailed(true),
  );
  const resetQuestionsRef = useRef(mingle?.resetQuestions);

  useUnlockAudio();

  const [expired, setExpired] = useState(() => {
    const saved = localStorage.getItem("gameExpired");
    return saved ? JSON.parse(saved) : false;
  });

  useEffect(() => {
    resetQuestionsRef.current = mingle?.resetQuestions;
  }, [mingle]);

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

    socket.on("game-started", handleGameStarted);
    socket.on("game-reset", handleGameReset);

    return () => {
      socket.off("game-started", handleGameStarted);
      socket.off("game-reset", handleGameReset);
    };
  }, [navigate]);

  // Play instructions audio only on this page when timer expires
  useEffect(() => {
    if (expired) {
      playInstructions();
    }
  }, [expired, playInstructions]);

  const handleExpire = () => {
    setExpired(true);
  };

  const handleStartClick = () => {
    resetQuestionsRef.current?.();
    playBeep();
    socket.emit("start-game");
  };

  return (
    <div className={`${styles.main} ${styles.backgroundBlur}`}>
      <h3
        className={`${styles.introductionHeader} ${styles.textMediumRegular}`}
      >
        Welcome to
      </h3>
      <div className={styles.IntroductionTitleContainer}>
        <h1 className={`${styles.introductionHeader} ${styles.textExtraLarge}`}>
          LIA FUSION
        </h1>
        <h2 className={`${styles.introductionHeader} ${styles.textLarge}`}>
          Speed Mingle
        </h2>
      </div>
      {/* NOTE: move timer "lobby" page soon, and make audio play when it switches screens instead */}
      <DateTimer
        targetDate="2026-04-09T19:56:00+02:00"
        onExpire={handleExpire}
        className={`${styles.timer} ${styles.hidden}`}
      />
      {/* <DateTimer
          targetDate="2026-04-22T15:00:00+02:00"
          onExpire={handleExpire}
          className={styles.timer}
        /> */}
      <p className={`${styles.textMediumRegular} ${styles.startText}`}>
        Get ready to meet new people. Follow the instructions on your phone.
      </p>
      <Button
        buttonName="Start"
        variant="primaryRed"
        iconSrc="arrowRightWhite"
        onClick={handleStartClick}
      />
    </div>
  );
}
