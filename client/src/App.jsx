import "./App.css";
import Button from "./components/Buttons/Button.jsx";
import TextInput from "./components/Forms/Inputfileds/TextInput.jsx";
import Checkbox from "./components/Forms/Checkboxes/Checkbox.jsx";

function App() {
  return (
    <>
      <h1>Mingle App</h1>
      <form>
        <Button buttonName="Get started" />
        <Button buttonName="Red" buttonColor="green" />

        <TextInput
          formLabel="Email"
          placeholder="skriv.."
          type="text"
          id="email"
        />
        <TextInput formLabel="Password" placeholder="skriv.." type="text" />

        <Checkbox checkboxLabel="HTML" />
        <Checkbox checkboxLabel="CSS" />
      </form>
    </>
  );
}

export default App;
