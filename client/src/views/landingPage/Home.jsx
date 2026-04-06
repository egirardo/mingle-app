import SignUpInfo from "../../components/LandingPage/SignUpInfo.jsx";
import NavBar from "../../components/NavBar/NavBar.jsx";
import heroImage from "../../assets/hero.png";

function Home() {
  return (
    <>
    <NavBar />
      <div className="hero-container">
        <img src={heroImage} alt="" aria-hidden="true" className="hero-image" />
      </div>
    <SignUpInfo />
    </>
  );
}

export default Home;

