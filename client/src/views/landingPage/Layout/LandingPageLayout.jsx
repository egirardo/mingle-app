import Background from "../../../assets/background.jpg";
import Hero from "../../../assets/hero.svg";
import NavBar from "../../../components/Atoms/NavBar/NavBar.jsx";
import AttendingCounter from "../../../components/LandingPage/AttendingCounter.jsx";

function LandingPageLayout({ children }) {
  return (
    <>
      <div
        aria-hidden="true"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: `url(${Background})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          zIndex: -1,
        }}
      />
      <NavBar />
      <div className="hero-overlay-container">
        <img className="hero-overlay" src={Hero} aria-hidden="true" />
        <AttendingCounter />
      </div>
      {children}
    </>
  );
}

export default LandingPageLayout;