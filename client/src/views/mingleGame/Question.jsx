import { useNavigate, useOutletContext } from "react-router-dom";
import Timer from "../../components/Timer/Timer.jsx";

export default function Question() {
  const mingle = useOutletContext();
  const navigate = useNavigate();

  const { currentQuestion, nextQuestion } = mingle;

  const handleExpire = () => {
    // When the question timer expires, advance to the next round and navigate to the task page
    nextQuestion?.();
    navigate("/task");
  };

  return (
    <div className="mingle">
      <p>Round: {currentQuestion?.round}</p>
      <Timer minutes={0.1} onExpire={handleExpire} />
      <p>{currentQuestion?.question}</p>
    </div>
  );
}
