import heroImage from "../assets/hero.png";
import SignUpInfo from "../components/LandingPage/SignUpInfo.jsx";

function Home() {
  return (
    <>
      <div className="hero-container">
        <img src={heroImage} alt="" aria-hidden="true" className="hero-image" />
      </div>
      <SignUpInfo />
    </>
  );
}

export default Home;

