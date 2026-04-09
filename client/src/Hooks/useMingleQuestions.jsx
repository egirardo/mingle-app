import { useState } from "react";
import questionsJson from "../data/questions.json";

export function useMingleQuestions() {
  const initial = questionsJson.questions || [];
  const questions = initial;
  const [index, setIndex] = useState(0);

  const nextQuestion = () => {
    if (!questions.length) return;
    setIndex((i) => (i + 1) % questions.length);
  };

  const resetQuestions = () => {
    setIndex(0);
  };

  const currentQuestion = questions[index] || null;
  const questionText = currentQuestion
    ? currentQuestion.question
    : "No questions available.";

  return {
    currentQuestion,
    questionText,
    nextQuestion,
    resetQuestions,
    index,
    questions,
  };
}
