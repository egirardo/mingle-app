import "./App.css";
import Button from "./components/Buttons/Button.jsx";
import Form from "./components/Forms/Form.jsx";
import Checkbox from "./components/Checkboxes/Checkbox.jsx";

function App() {
  return (
    <>
      <h1>Mingle App</h1>
      <form>
        <Button buttonName="Get started" />
        <Button buttonName="Red" buttonColor="green" />

        <Form
          formLabel="Email"
          placeholder="skriv.."
          type="text"
          id="email"
        />
        <Form formLabel="Password" placeholder="skriv.." type="text" />

        <Checkbox checkboxLabel="HTML" />
        <Checkbox checkboxLabel="CSS" />
      </form>
    </>
  );
}

export default App;
