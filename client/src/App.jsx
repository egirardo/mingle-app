import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import NavBar from "./components/NavBar/NavBar.jsx";
import Home from "./views/Home.jsx";
import Login from "./views/Login.jsx";
import StudentSignUp from "./views/StudentSignUp.jsx";
import BusinessSignUp from "./views/BusinessSignUp.jsx";

function App() {
  return (
    <BrowserRouter>
      <NavBar />  {/* NavBar stays outside Routes so it renders on every page */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup/student" element={<StudentSignUp />} />
        <Route path="/signup/business" element={<BusinessSignUp />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;