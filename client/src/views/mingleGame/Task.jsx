import { useNavigate, useOutletContext } from "react-router-dom";
import Timer from "../../components/Timer/Timer.jsx";
import styles from "./MingleGame.module.css";

export default function Task() {
  const mingle = useOutletContext();
  const navigate = useNavigate();

  const { currentQuestion } = mingle;

  // When the task timer expires, navigate to the Question page
  const handleExpire = () => {
    navigate("/question");
  };

  return (
    <div className={`${styles.main} ${styles.mingle}`}>
      <div className={styles.roundCountContainer}>
        <span>
          {currentQuestion?.round}/{mingle.questions.length}
        </span>
      </div>
      <Timer minutes={0.1} onExpire={handleExpire} />
      <p className={styles.largeText}>{currentQuestion?.task}</p>
    </div>
  );
}
