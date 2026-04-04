import { Outlet } from "react-router-dom";
import { useMingleQuestions } from "../../Hooks/useMingleQuestions.jsx";

// Layout wrapper for the mingle game routes.
export default function MingleGameLayout() {
  const mingle = useMingleQuestions();

  return <Outlet context={mingle} />;
}
