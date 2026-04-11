import styles from "../MingleGame.module.css";
import Button from "../../../components/Buttons/Button.jsx";
import yrgoLogo from "../../../assets/yrgo-logo.svg";
import { useNavigate } from "react-router-dom";;

export default function Completion() {
  const navigate = useNavigate();

  return (
    <section className={styles.main}>
      <div className={`${styles.overlay} ${styles.backgroundDarkFilter}`} />
      <div className={`${styles.content} ${styles.mobileContainer}`}>
        <img className={styles.yrgoLogo} src={yrgoLogo} alt="Yrgo logo" />
        <div className={`${styles.completionTextContainer}`}>
          <h2 className={styles.textXXL}>Great job!</h2>
          <p className={styles.textMedium}>
            Continue mingling or explore more in the app
          </p>
        </div>
        <Button
          buttonName="Explore participants"
          variant="primaryRed"
          iconSrc="arrowRightWhite"
          onClick={() => {
            playBeep();
            navigate("/explore");
          }}
        />
      </div>
    </section>
  );
}
