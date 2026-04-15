import "./App.css";
import { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SavedProvider } from "./context/SavedContext";
import { apiFetch } from "./api";
import Home from "./views/landingPage/Home.jsx";
import Login from "./views/landingPage/Login.jsx";
import About from "./views/landingPage/About.jsx";
import StudentSignUp from "./views/landingPage/StudentSignUp.jsx";
import BusinessSignUp from "./views/landingPage/BusinessSignUp.jsx";
import StudentProfile from "./views/landingPage/StudentProfile.jsx";
import EditProfilePage from "./views/landingPage/EditProfilePage.jsx";
import CompanyProfilePage from "./views/landingPage/CompanyProfilePage.jsx";
import RegisterConfirmation from "./views/landingPage/RegistrationConfirmation.jsx";
import Explore from "./views/landingPage/Explore.jsx";

// mingle
import MingleGameLayout from "./views/mingleGame/MingleGameLayout.jsx";
import Start from "./views/mingleGame/desktop/Start.jsx";
import Lobby from "./views/mingleGame/desktop/Lobby.jsx";
import Introduction from "./views/mingleGame/mobile/Introduction.jsx";

// Mobile
import Task from "./views/mingleGame/mobile/Task.jsx";
import Question from "./views/mingleGame/mobile/Question.jsx";
import Loading from "./views/mingleGame/mobile/Loading.jsx";
import Completion from "./views/mingleGame/mobile/Completion.jsx";

// Desktop
import TaskDesktop from "./views/mingleGame/desktop/Task.jsx";
import QuestionDesktop from "./views/mingleGame/desktop/Question.jsx";
import LoadingDesktop from "./views/mingleGame/desktop/Loading.jsx";
import CompletionDesktop from "./views/mingleGame/desktop/Completion.jsx";

function App() {
  useEffect(() => {
    // Fire-and-forget ping to wake the Render backend on first load.
    // Render free tier spins down after inactivity; this gives the server
    // a head-start before the user makes their first real API call.
    apiFetch("/healthz").catch(() => {});
  }, []);

  return (
    <SavedProvider>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup/student" element={<StudentSignUp />} />
        <Route path="/signup/business" element={<BusinessSignUp />} />
        <Route path="/students/:id" element={<StudentProfile />} />
        <Route path="/students/:id/edit" element={<EditProfilePage />} />
        <Route path="/companies/:id" element={<CompanyProfilePage />} />
        <Route
          path="/confirmation"
          element={<RegisterConfirmation />}
        />
        <Route path="/explore" element={<Explore />} />
        <Route element={<MingleGameLayout />}>
          <Route path="/lobby" element={<Lobby />} />
          <Route path="/start" element={<Start />} />
          <Route path="/introduction" element={<Introduction />} />
          <Route path="/task" element={<Task />} />
          <Route path="/start/task" element={<TaskDesktop />} />
          <Route path="/question" element={<Question />} />
          <Route path="/start/question" element={<QuestionDesktop />} />
          <Route path="/loading" element={<Loading />} />
          <Route path="/start/loading" element={<LoadingDesktop />} />
          <Route path="/completion" element={<Completion />} />
          <Route path="/start/completion" element={<CompletionDesktop />} />
        </Route>
      </Routes>
    </BrowserRouter>
    </SavedProvider>
  );
}

export default App;
