import { useState } from "react";
import questionsJson from "../data/questions.json";

export function useMingleQuestions(initialIndex = 0) {
  const questions = questionsJson.questions || [];
  const [index, setIndex] = useState(initialIndex);

  const nextQuestion = () => {
    if (!questions.length) return;
    setIndex((i) => (i + 1) % questions.length);
  };

  const prevQuestion = () => {
    if (!questions.length) return;
    setIndex((i) => (i - 1 + questions.length) % questions.length);
  };

  const reset = () => setIndex(initialIndex);

  const currentQuestion = questions[index] || null;
  const questionText = currentQuestion
    ? currentQuestion.question
    : "No questions available.";
  const taskText = currentQuestion ? currentQuestion.task : null;
  const round = currentQuestion?.round ?? null;

  return {
    questions,
    index,
    currentQuestion,
    questionText,
    taskText,
    round,
    nextQuestion,
    prevQuestion,
    reset,
  };
}
