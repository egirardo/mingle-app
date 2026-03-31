import { useMingleQuestions } from "./Hooks/useMingleQuestions";
import Timer from "./components/Timer/Timer.jsx";

export default function Mingle() {
  const { questionText, nextQuestion, loading, questions } =
    useMingleQuestions();

  return (
    <>
      <div className="mingle">
        <Timer minutes="0.1" onExpire={nextQuestion} autoRestart />
        <p>{questionText}</p>
      </div>
    </>
  );
}