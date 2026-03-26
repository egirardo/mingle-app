import "./App.css";
import Button from "./components/Buttons/Button.jsx";
import TextInput from "./components/Forms/InputFields/TextInput.jsx";
import Checkbox from "./components/Forms/Checkboxes/Checkbox.jsx";
import NavBar from "./components/NavBar/NavBar.jsx";
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
        <Button
          buttonName="Log in"
          iconSrc="arrowRight"
          buttonColor=""
          type=""
          variant=""
        />
        <Button
          buttonName="Submit"
          iconSrc="arrowRight"
          buttonColor="transparent"
          type="submit"
          variant="blackBorder"
        />
        <Button
          buttonName="Save"
          buttonColor="transparent"
          iconSrc="checkmark"
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
