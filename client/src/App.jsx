import "./App.css";
import Button from "./components/Buttons/Button.jsx";
import TextInput from "./components/Forms/InputFields/TextInput.jsx";
import Checkbox from "./components/Forms/Checkboxes/Checkbox.jsx";
import NavBar from "./components/NavBar/NavBar.jsx";
import heroImage from "./assets/hero.png";

function App() {
  return (
    <>
      <NavBar />
      <div className="hero-container">
        <img
          src={heroImage}
          alt="Hero"
          className="hero-image"
        />
      </div>
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
