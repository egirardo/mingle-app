import styles from "./RoundsDisplay.module.css";
import ellipseRed from "../../assets/icons/ellipse-red.svg";
import ellipseWhite from "../../assets/icons/ellipse-white.svg";
import questionsJson from "../../data/questions.json";

export default function RoundsDisplay(props) {
  const currentRound = Number(props.currentRound) || 0;
  const className = props.className || "";

  const questions = questionsJson.questions || [];
  const totalRounds = questions.length;

  const roundDots = questions.map((_, index) => {
    const roundNumber = index + 1;
    const roundPlayed = roundNumber <= currentRound;

    return (
      <img
        key={roundNumber}
        className={styles.roundDot}
        src={roundPlayed ? ellipseRed : ellipseWhite}
        alt={`Round ${roundNumber} of ${totalRounds}: ${roundPlayed ? "played" : "not played"}`}
      />
    );
  });

  const containerClassName = `${styles.roundCountContainer} ${className}`;

  return (
    <div className={containerClassName}>
      <span>Round {currentRound}</span>
      <div className={styles.roundDisplay}>{roundDots}</div>
    </div>
  );
}
