import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "./assets/vite.svg";
import heroImg from "./assets/hero.png";
import "./App.css";
import Button from "./components/Buttons/Button.jsx";
import Form from "./components/Forms/Form.jsx";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <h1>Mingle App</h1>
      <Button buttonName={"Get started"} />
      <Button buttonName={"Red"} buttonColor={"green"} />

      <Form formLabel={"Email"} placeholder={"skriv.."} />
      <Form formLabel={"Password"} placeholder={"skriv.."} />
    </>
  );
}

export default App;
