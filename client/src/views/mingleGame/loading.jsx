import { useNavigate, useOutletContext } from "react-router-dom";
import styles from "./MingleGame.module.css";
import Timer from "../../components/Timer/Timer.jsx";

export default function Loading() {
  const mingle = useOutletContext();
  const navigate = useNavigate();

  const { currentQuestion, nextQuestion } = mingle;

  const handleExpire = () => {
    // When the question timer expires, advance to the next round and navigate to the task page
    nextQuestion?.();
    navigate("/task");
  };

  return (
    <div className={styles.mingleLoading}>
      <h2>Well done!</h2>
      <div className={styles.roundCountContainer}>
        <span>{currentQuestion?.round}/3</span>
      </div>
      <p>Next round coming right up...</p>
      <Timer minutes={0.1} onExpire={handleExpire} className={styles.hidden} />
    </div>
  );
}
