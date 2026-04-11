
import LandingPageBackgroundVideo from "../../../components/LandingPage/BackgroundVideo.jsx";
import NavBar from "../../../components/NavBar/NavBar.jsx";


function LandingPageLayout({ children }) {
  return (
    <>
      <NavBar />
      <div className="hero-container">
        <LandingPageBackgroundVideo />
      </div>
      {children}
    </>
  );
}

export default LandingPageLayout;