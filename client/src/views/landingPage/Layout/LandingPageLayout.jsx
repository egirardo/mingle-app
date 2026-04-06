import NavBar from "../../../components/NavBar/NavBar.jsx";
import heroImage from "../../../assets/hero.png";

function LandingPageLayout({ children }) {
  return (
    <>
      <NavBar />
      <div className="hero-container">
        <img src={heroImage} alt="" aria-hidden="true" className="hero-image" />
      </div>
      {children}
    </>
  );
}

export default LandingPageLayout;