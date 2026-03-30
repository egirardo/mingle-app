import "./App.css";
import Button from "./components/Buttons/Button.jsx";
import IconOnlyButton from "./components/Buttons/IconOnlyButton.jsx";
import TextInput from "./components/Forms/InputFields/TextInput.jsx";
import Checkbox from "./components/Forms/Checkboxes/Checkbox.jsx";
import NavBar from "./components/NavBar/NavBar.jsx";
import heroImage from "./assets/hero.png";
import TagContainer from "./components/Tags/TagContainer.jsx";
import TabSlider from "./components/Tabs/TabSlider.jsx";
import Dropdown from "./components/Dropdown/Dropdown.jsx";
import SignUpInfo from "./components/LandingPage/SignUpInfo.jsx";

function App() {
  return (
    <>
      <NavBar />
      <div className="hero-container">
        <img src={heroImage} alt="" aria-hidden="true" className="hero-image" />
      </div>
      <SignUpInfo />
      {/* <form> */}
        {/* --- Buttons --- */}

        {/* <Button buttonName="Log in" iconSrc="arrowRight" />
        <Button
          buttonName="Submit"
          iconSrc="arrowRight"
          buttonColor="transparent"
          variant="blackBorder"
          type="submit"
        />
        */}

        {/* --- Icon Only Buttons --- */}
{/* 
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
 */}
        {/* --- Inputs --- */}

        {/* <TextInput
          formLabel="Email"
          placeholder="skriv.."
          type="text"
          id="email"
        />
        <TextInput formLabel="Password" placeholder="skriv.." type="password" subText="Lösenordet måste vara minst 8 tecken långt" required={true} optional={true} />
      </form>
      <TabSlider
        tabs={["Företag", "Studenter"]}
        defaultIndex={0}
        onChange={(index, label) => console.log(index, label)} // DEV ONLY CONSOLE LOG IS TEMPORARY, REMOVE ONCE FUNCTIONALITY IS IMPLEMENTED
      />
      <TagContainer
        tags={["JavaScript", "React", "CSS", "Node.js", "Express", "MongoDB"]}
      /> 
      
      <Dropdown
        options={[
          { value: "utvecklare", label: "Utvecklare" },
          { value: "designers", label: "Designers" },
        ]}
        defaultValue={{ value: "utvecklare", label: "Utvecklare" }}
        onSelect={(value) => setActiveFilter(value)}
      />
      */}
    </>
  );
}

export default App;
