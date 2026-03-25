import "./App.css";
import ArrowRButton from "./components/Buttons/ArrowRButton.jsx";
import TextInput from "./components/Forms/InputFields/TextInput.jsx";
import Checkbox from "./components/Forms/Checkboxes/Checkbox.jsx";
import NavBar from "./components/NavBar/NavBar.jsx";
import CheckmarkButton from "./components/Buttons/CheckmarkButton.jsx";
import heroImage from "./assets/hero.png";
import TagContainer from "./components/Tags/TagContainer.jsx";

function App() {
  return (
    <>
      <NavBar />
      <div className="hero-container">
        <img
          src={heroImage}
          alt=""
          aria-hidden="true"
          className="hero-image"
        />
      </div>
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
      <TagContainer tags={["JavaScript", "React", "CSS", "Node.js", "Express", "MongoDB"]} />
    </>
  );
}

export default App;
