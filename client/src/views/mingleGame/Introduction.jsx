import { useNavigate } from "react-router-dom";
import styles from "./MingleGame.module.css";
import Timer from "../../components/Timer/Timer.jsx";

export default function Introduction() {
  const navigate = useNavigate();

  const handleExpire = () => {
    // When the timer expires, start the game on the task page
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
