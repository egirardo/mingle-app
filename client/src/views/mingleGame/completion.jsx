import styles from "./MingleGame.module.css";
import Button from "../../components/Buttons/Button";
import yrgoLogo from "../../assets/yrgo-logo.svg";
import { useNavigate } from "react-router-dom";

export default function Completion() {
  const navigate = useNavigate();

  return (
    <div className={`${styles.main} ${styles.backgroundBlur}`}>
      <img className={styles.yrgoLogo} src={yrgoLogo} alt="Yrgo logo" />
      <div>
        <h2 className={styles.textLargeBold}>Great job!</h2>
        <p>Continue mingling or explore more in the app</p>
      </div>
      <Button
        buttonName="Explore participants"
        buttonColor="redWhiteBorder"
        iconSrc="arrowRightWhite"
        onClick={() => navigate("/")}
      />
    </div>
  );
}
