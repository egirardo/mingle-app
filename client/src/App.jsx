import "./App.css";
import Button from "./components/Buttons/Button.jsx";
import TextInput from "./components/Forms/InputFields/TextInput.jsx";
import Checkbox from "./components/Forms/Checkboxes/Checkbox.jsx";
import NavBar from "./components/NavBar/NavBar.jsx";

function App() {
  return (
    <>
      <NavBar />
      <h1>Mingle App</h1>
      <form>
        <Button buttonName="Log in" />
        <Button
          buttonName="Red"
          buttonColor="invisible"
          type="submit"
          variant="blackBorder"
        />

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
