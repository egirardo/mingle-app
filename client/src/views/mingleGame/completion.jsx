import styles from "./MingleGame.module.css";
import Button from "../../components/Buttons/Button";
import { useOutletContext } from "react-router-dom";
import yrgoLogo from "../../assets/yrgo-logo.svg";

export default function Completion() {
  const mingle = useOutletContext();

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
      />
    </div>
  );
}
