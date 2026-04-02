import { useNavigate } from "react-router-dom";
import { useMingleQuestions } from "../../Hooks/useMingleQuestions";
import Timer from "../../components/Timer/Timer.jsx";

export default function Mingle() {
  const { questionText, nextQuestion } = useMingleQuestions();
  const navigate = useNavigate();

  const handleExpire = () => {
    nextQuestion();
    navigate("/task"); 
  };

  return (
    <div className="mingle">
      <Timer minutes={0.3} onExpire={handleExpire} autoRestart />
      <p>{questionText}</p>
    </div>
  );
}
