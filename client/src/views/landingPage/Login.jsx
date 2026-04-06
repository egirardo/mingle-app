import LoginPanel from "../../components/LoginPage/LoginPanel.jsx";
import NavBar from "../../components/NavBar/NavBar.jsx";
import heroImage from "../../assets/hero.png";

function Login() {
  
  return (
  <>
  <NavBar />
    <div className="hero-container">
      <img src={heroImage} alt="" aria-hidden="true" className="hero-image" />
    </div> 
  <LoginPanel />;
  </>
  );
}

export default Login;
