import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./views/landingPage/Home.jsx";
import Login from "./views/landingPage/Login.jsx";
import StudentSignUp from "./views/landingPage/StudentSignUp.jsx";
import BusinessSignUp from "./views/landingPage/BusinessSignUp.jsx";
import StudentProfile from "./views/landingPage/StudentProfile.jsx";

// mingle
import Question from "./views/mingleGame/Question.jsx";
import Task from "./views/mingleGame/Task.jsx";
import Completion from "./views/mingleGame/completion.jsx";
import Loading from "./views/mingleGame/loading.jsx";
import Introduction from "./views/mingleGame/Introduction.jsx";
import MingleGameLayout from "./views/mingleGame/MingleGameLayout.jsx";
import Start from "./views/mingleGame/Start.jsx";
import Lobby from "./views/mingleGame/Lobby.jsx";
import CompanyProfilePage from "./views/landingPage/CompanyProfilePage.jsx";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup/student" element={<StudentSignUp />} />
        <Route path="/signup/business" element={<BusinessSignUp />} />
        <Route path="/students/:id" element={<StudentProfile />} />
        <Route path="/companies/:id" element={<CompanyProfilePage />} />
        <Route element={<MingleGameLayout />}>
          <Route path="/lobby" element={<Lobby />} />
          <Route path="/start" element={<Start />} />
          <Route path="/introduction" element={<Introduction />} />
          <Route path="/task" element={<Task />} />
          <Route path="/question" element={<Question />} />
          <Route path="/loading" element={<Loading />} />
          <Route path="/completion" element={<Completion />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;