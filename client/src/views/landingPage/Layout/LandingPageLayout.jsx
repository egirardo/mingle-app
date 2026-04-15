import Background from "../../../assets/background.jpg";
import Hero from "../../../assets/hero.svg";
import NavBar from "../../../components/Atoms/NavBar/NavBar.jsx";
import AttendingCounter from "../../../components/LandingPage/AttendingCounter.jsx";

function LandingPageLayout({ children }) {
  return (
    <>
      <NavBar />
      <div className="hero-container">
        <img className="hero-image" src={Background} aria-hidden="true" fetchpriority="high" />
      </div>
      <div className="hero-overlay-container">
        <img className="hero-overlay" src={Hero} aria-hidden="true" />
        <AttendingCounter />
      </div>
      {children}
    </>
  );
}

export default LandingPageLayout;