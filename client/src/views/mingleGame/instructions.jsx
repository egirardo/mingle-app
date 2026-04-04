import { useNavigate, useOutletContext } from "react-router-dom";
import styles from "./MingleGame.module.css";
import Timer from "../../components/Timer/Timer.jsx";

export default function Instructions() {
  const mingle = useOutletContext();
  const navigate = useNavigate();

  const { currentQuestion, nextQuestion } = mingle;

  const handleExpire = () => {
    // When the question timer expires, advance to the next round and navigate to the task page
    nextQuestion?.();
    navigate("/task");
  };

  return (
    <div className={styles.mingle}>
      <h1>Welcome to Ignite Speed Mingle</h1>
      {/* date timer instead, temporary countdown timer for now*/}
      <Timer minutes={0.1} onExpire={handleExpire} />
      <p>
        For the next 10 minutes, you’ll have short and fast interactions. We’ll
        guide you step by step.
      </p>
    </div>
  );
}
