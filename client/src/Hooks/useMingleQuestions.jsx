import { useState, useEffect } from "react";
import questionsJson from "../data/questions.json";

export function useMingleQuestions() {
  const initial = questionsJson.questions || [];
  const [questions] = useState(initial);
  const [index, setIndex] = useState(0);
  const [loading] = useState(false);
  const [error] = useState(null);

  useEffect(() => { }, []);

  const nextQuestion = () => {
    if (!questions.length) return;
    setIndex((i) => (i + 1) % questions.length);
  };

  const currentQuestion = questions[index] || null;
  const questionText = currentQuestion
    ? currentQuestion.question
    : "No questions available.";

  return {
    currentQuestion,
    questionText,
    nextQuestion,
    index,
    questions,
    loading,
    error,
  };
}
