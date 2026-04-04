import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import NavBar from "./components/NavBar/NavBar.jsx";
import heroImage from "./assets/hero.png";
import Home from "./views/landingPage/Home.jsx";
import Login from "./views/landingPage/Login.jsx";
import StudentSignUp from "./views/landingPage/StudentSignUp.jsx";
import BusinessSignUp from "./views/landingPage/BusinessSignUp.jsx";

// mingle
import Question from "./views/mingleGame/Question.jsx";
import Task from "./views/mingleGame/Task.jsx";
import Completion from "./views/mingleGame/completion.jsx";
import Loading from "./views/mingleGame/loading.jsx";
import Instructions from "./views/mingleGame/instructions.jsx";
import MingleGameLayout from "./views/mingleGame/MingleGameLayout.jsx";


function App() {
  return (
    <BrowserRouter>
      <NavBar />
      {/* <div className="hero-container">
        <img src={heroImage} alt="" aria-hidden="true" className="hero-image" />
      </div> */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup/student" element={<StudentSignUp />} />
        <Route path="/signup/business" element={<BusinessSignUp />} />
        <Route element={<MingleGameLayout />}>
          <Route path="/instructions" element={<Instructions />} />
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