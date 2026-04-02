import { useNavigate } from "react-router-dom";
import { useMingleQuestions } from "../Hooks/useMingleQuestions";
import Timer from "../components/Timer/Timer.jsx";

export default function Mingle() {
  const { currentQuestion, nextQuestion } = useMingleQuestions();
  const navigate = useNavigate();

  const handleExpire = () => {
    nextQuestion();
    navigate("/question");
  };

  return (
    <div className="mingle">
      <Timer minutes={0.2} onExpire={handleExpire} autoRestart />
      <p>{currentQuestion?.task}</p>
    </div>
  );
}
