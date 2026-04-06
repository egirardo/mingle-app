import BusinessSignUpPanel from "../../components/SignUpPages/BusinessSignUpPanel.jsx";
import NavBar from "../../components/NavBar/NavBar.jsx";
import heroImage from "../../assets/hero.png";

function BusinessSignUp() {
  return (
    <>
    <NavBar />
      <div className="hero-container">
        <img src={heroImage} alt="" aria-hidden="true" className="hero-image" />
      </div>
      <BusinessSignUpPanel />
    </>
  );
}

export default BusinessSignUp;