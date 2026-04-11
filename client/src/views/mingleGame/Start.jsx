import { useEffect, useState, useRef } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import styles from "./MingleGame.module.css";
import Button from "../../components/Buttons/Button";
import IconOnlyButton from "../../components/Buttons/IconOnlyButton";
import yrgoLogo from "../../assets/yrgo-logo.svg";
import socket, { connectSocket } from "../../socket.js";
import {
  // commenting out in case the designers want a beep sound after the button is pressed
  // usePlayBeep,
  usePlaySound,
  useUnlockAudio,
} from "../../Hooks/useAudio.js";
import instructionsAudio from "../../assets/audio/instructions.mp3";

export default function Start() {
  const mingle = useOutletContext();
  const navigate = useNavigate();

  // commenting out in case the designers want a beep sound after the button is pressed
  // const playBeep = usePlayBeep();

  const [audioFailed, setAudioFailed] = useState(false);
  const playInstructions = usePlaySound(instructionsAudio, () =>
    setAudioFailed(true),
  );
  const resetQuestionsRef = useRef(mingle?.resetQuestions);

  useUnlockAudio();

  useEffect(() => {
    resetQuestionsRef.current = mingle?.resetQuestions;
  }, [mingle]);

  useEffect(() => {
    connectSocket();

    const handleGameStarted = () => {
      resetQuestionsRef.current?.();
      navigate("/task");
    };

    const handleGameReset = () => {
      resetQuestionsRef.current?.();
    };

    socket.on("game-started", handleGameStarted);
    socket.on("game-reset", handleGameReset);

    return () => {
      socket.off("game-started", handleGameStarted);
      socket.off("game-reset", handleGameReset);
    };
  }, [navigate]);

  // Attempt to play instructions when page loads
  useEffect(() => {
    playInstructions();
  }, [playInstructions]);

  // Play audio instructions audio only after user interaction
  const handlePlayInstructions = () => {
    playInstructions();
  };

  const handleStartClick = () => {
    resetQuestionsRef.current?.();
    socket.emit("start-game");
  };

  return (
    <section className={styles.main}>
      <div className={`${styles.overlay} ${styles.backgroundBlurFilter}`} />
      <div className={styles.content}>
        <img className={styles.yrgoLogo} src={yrgoLogo} alt="Yrgo logo" />
        <h3
          className={`${styles.introductionHeader} ${styles.textMediumRegular}`}
        >
          Welcome to
        </h3>
        <div className={styles.IntroductionTitleContainer}>
          <h1
            className={`${styles.introductionHeader} ${styles.textExtraLarge}`}
          >
            LIA FUSION
          </h1>
          <h2 className={`${styles.introductionHeader} ${styles.textLarge}`}>
            Speed Mingle
          </h2>
        </div>
        <p className={`${styles.textMediumRegular} ${styles.startText}`}>
          Get ready to meet new people. Follow the instructions on your phone.
        </p>
        {/* game start button */}
        <Button
          buttonName="Start"
          buttonColor="primaryRed"
          iconSrc="arrowRightWhite"
          onClick={handleStartClick}
        />
        <div className={styles.soundButton}>
          {audioFailed && (
            <IconOnlyButton
              iconSrc="sound"
              buttonColor="transparent"
              onClick={handlePlayInstructions}
              ariaLabel="Play instructions"
            />
          )}
        </div>
      </div>
    </section>
  );
}
