import "./App.css";
import Button from "./components/Buttons/Button.jsx";
import IconOnlyButton from "./components/Buttons/IconOnlyButton.jsx";
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
        <img src={heroImage} alt="" aria-hidden="true" className="hero-image" />
      </div>
      <form>

        
        {/* --- Buttons --- */}

        <Button buttonName="Log in" iconSrc="arrowRight" />
        <Button
          buttonName="Submit"
          iconSrc="arrowRight"
          buttonColor="transparent"
          variant="blackBorder"
          type="submit"
        />
        <Button
          buttonName="Submit"
          buttonColor="transparent"
          variant="blackBorder"
          type="submit"
        />
        <Button
          buttonName="Save"
          buttonColor="transparent"
          iconSrc="checkmark"
          variant="blackBorder"
        />


        {/* --- Icon Only Buttons --- */}

        <IconOnlyButton
          iconSrc="search"
          ariaLabel="Search"
          buttonColor="transparent"
        />
        <IconOnlyButton
          iconSrc="search"
          ariaLabel="Search"
          buttonColor="gray"
          variant="blackBorder"
        />
        <IconOnlyButton
          iconSrc="arrowBack"
          ariaLabel="Go back"
          buttonColor="transparent"
        />
        <IconOnlyButton
          iconSrc="arrow45"
          ariaLabel="Open link"
          buttonColor="transparent"
        />


        {/* --- Inputs --- */}

        <TextInput
          formLabel="Email"
          placeholder="skriv.."
          type="text"
          id="email"
        />
        <TextInput formLabel="Password" placeholder="skriv.." type="password" />
      </form>

      {/* --- Tags --- */}

      <TagContainer
        tags={["JavaScript", "React", "CSS", "Node.js", "Express", "MongoDB"]}
      />
    </>
  );
}

export default App;
