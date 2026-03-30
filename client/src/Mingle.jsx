import "./App.css";
import { useState, useEffect } from "react";

export default function Mingle() {
  const [questions, setQuestions] = useState([]);
  const [index, setIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    fetch("/src/data/questions.json")
      .then((response) => {
        if (!response.ok)
          throw new Error(`Failed to fetch questions: ${response.status}`);
        return response.json();
      })
      .then((json) => {
        setQuestions(json.questions || []);
      })
      .catch((err) => {
        console.error("error: " + err);
        setError(err.message || "Error fetching questions");
      })
      .finally(() => setLoading(false));
  }, []);

  const nextQuestion = () => {
    if (!questions.length) return;
    setIndex((i) => (i + 1) % questions.length);
  };

  const currentQuestion = questions[index];
  let questionText;
  if (loading) {
    questionText = "Loading questions...";
  } else if (error) {
    questionText = `Error: ${error}`;
  } else if (currentQuestion) {
    questionText = currentQuestion.question;
  } else {
    questionText = "No questions available.";
  }

  return (
    <div className="mingle">
      <p>{questionText}</p>
      <button onClick={nextQuestion} disabled={loading || !questions.length}>
        Next question
      </button>
    </div>
  );
}
