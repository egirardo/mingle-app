import { useNavigate, useOutletContext } from "react-router-dom";
import Timer from "../../components/Timer/Timer.jsx";
import styles from "./MingleGame.module.css";
import Button from "../../components/Buttons/Button";

export default function Question() {
  const mingle = useOutletContext();
  const navigate = useNavigate();

  const { currentQuestion, nextQuestion } = mingle;

  const handleExpire = () => {
    // When the question timer expires, advances to the loading page
    navigate("/loading");
  };

  return (
    <div className={styles.mingle}>
      <div className={styles.roundCountContainer}>
        <span>{currentQuestion?.round}/3</span>
      </div>
      <Timer minutes={0.1} onExpire={handleExpire} className={styles.hidden} />
      <div className={styles.instructionContainer}>
        <p className={styles.largeTextBold}>Ask</p>
        <p className={styles.largeText}>{currentQuestion?.question}</p>
      </div>
      {/* temporary button */}
      <Button
        buttonName="Explore participants"
        buttonColor="gray"
        iconSrc="arrowRight"
      />
    </div>
  );
}
