import Background from "../../../assets/background.jpg";
import Hero from "../../../assets/hero.svg";
import NavBar from "../../../components/NavBar/NavBar.jsx";

function OtherPageLayout({ children }) {
  return (
    <>
      <NavBar />
      <div className="hero-container">
        <img className="hero-image" src={Background} aria-hidden="true" />
      </div>
      <img className="hero-overlay" src={Hero} aria-hidden="true" />
      {children}
    </>
  );
}

export default OtherPageLayout;