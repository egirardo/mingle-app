import { useNavigate, useOutletContext } from "react-router-dom";
import Timer from "../../components/Timer/Timer.jsx";

export default function Task() {
  const mingle = useOutletContext();
  const navigate = useNavigate();

  const { currentQuestion } = mingle;

  // When the task timer expires, navigate to the Question page
  const handleExpire = () => {
    navigate("/question");
  };

  return (
    <div className="mingle">
      <p>Round: {currentQuestion?.round}</p>
      <Timer minutes={0.1} onExpire={handleExpire} />
      <p>{currentQuestion?.task}</p>
    </div>
  );
}
