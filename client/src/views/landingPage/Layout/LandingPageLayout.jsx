import { useEffect } from "react";
import Background from "../../../assets/background.jpg";
import Hero from "../../../assets/hero.svg";
import NavBar from "../../../components/Atoms/NavBar/NavBar.jsx";
import AttendingCounter from "../../../components/LandingPage/AttendingCounter.jsx";

function LandingPageLayout({ children }) {
  useEffect(() => {
    const html = document.documentElement;
    html.style.backgroundImage = `url(${Background})`;
    html.style.backgroundSize = "cover";
    html.style.backgroundPosition = "center";
    html.style.backgroundRepeat = "no-repeat";
    html.style.backgroundAttachment = "fixed";
    return () => {
      html.style.backgroundImage = "";
      html.style.backgroundSize = "";
      html.style.backgroundPosition = "";
      html.style.backgroundRepeat = "";
      html.style.backgroundAttachment = "";
    };
  }, []);

  return (
    <>
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