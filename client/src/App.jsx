import "./App.css";
import Button from "./components/Buttons/Button.jsx";
import Form from "./components/Forms/Form.jsx";
import Checkbox from "./components/Checkboxes/Checkbox.jsx";

function App() {
  return (
    <>
      <h1>Mingle App</h1>
      <Button buttonName={"Get started"} />
      <Button buttonName={"Red"} buttonColor={"green"} type={"button"}/>

      <Form formLabel={"Email"} placeholder={"skriv.."} type={"text"} id={"email"}/>
      <Form formLabel={"Password"} placeholder={"skriv.."} type={"text"} />
    </>
  );
}

export default App;
