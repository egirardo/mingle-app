import NavBar from "../../../components/NavBar/NavBar.jsx";
import backgroundImage from "../../../assets/background.png"

function LandingPageLayout({ children }) {
  return (
    <>
      <NavBar />
      <div className="hero-container">
        <img src={backgroundImage} alt="" aria-hidden="true" className="hero-image" />
      </div>
      {children}
    </>
  );
}

export default LandingPageLayout;