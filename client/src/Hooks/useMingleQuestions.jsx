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
  };
}
