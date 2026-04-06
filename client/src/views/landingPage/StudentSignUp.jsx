import StudentSignUpPanel from "../../components/SignUpPages/StudentSignUpPanel.jsx";
import NavBar from "../../components/NavBar/NavBar.jsx";
import heroImage from "../../assets/hero.png";

function StudentSignUp() {
  return (
  <>
  <NavBar />
    <div className="hero-container">
      <img src={heroImage} alt="" aria-hidden="true" className="hero-image" />
    </div>
  <StudentSignUpPanel />
  </>
  );
}

export default StudentSignUp;