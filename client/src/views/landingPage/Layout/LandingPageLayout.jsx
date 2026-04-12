
import Background from "../../../assets/background.jpg";
import NavBar from "../../../components/NavBar/NavBar.jsx";


function LandingPageLayout({ children }) {
  return (
    <>
      <NavBar />
      <div className="hero-container">
        <img src={Background} alt="Background" />
      </div>
      {children}
    </>
  );
}

export default LandingPageLayout;