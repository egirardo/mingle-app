import { useNavigate, useOutletContext } from "react-router-dom";
import Timer from "../../components/Timer/Timer.jsx";
import styles from "./MingleGame.module.css";

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
      <div className={styles.round}>
        <span>{currentQuestion?.round}/3</span>
      </div>
      <Timer minutes={0.1} onExpire={handleExpire} />
      <div>
        <h4>Ask</h4>
        <p className={styles.instruction}>{currentQuestion?.question}</p>
      </div>
      {/* red button here */}
    </div>
  );
}
