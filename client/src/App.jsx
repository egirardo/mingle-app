import "./App.css";
import ArrowRButton from "./components/Buttons/ArrowRButton.jsx";
import TextInput from "./components/Forms/InputFields/TextInput.jsx";
import Checkbox from "./components/Forms/Checkboxes/Checkbox.jsx";
import NavBar from "./components/NavBar/NavBar.jsx";
import CheckmarkButton from "./components/Buttons/CheckmarkButton.jsx";

function App() {
  return (
    <>
      <NavBar />
      <h1>Mingle App</h1>
      <form>
        <ArrowRButton buttonName="Log in" />
        <ArrowRButton
          buttonName="Submit"
          buttonColor="transparent"
          type="submit"
          variant="blackBorder"
        />
        <CheckmarkButton
          buttonName="Save"
          buttonColor="transparent"
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
