import styles from "../MingleGame.module.css";
import yrgoLogo from "../../../assets/yrgo-logo.svg";
import { useNavigate } from "react-router-dom";
export default function Completion() {
  const navigate = useNavigate();

  return (
    <section className={styles.main}>
      <div className={`${styles.overlay} ${styles.backgroundBlurFilter}`} />
      <div className={styles.content}>
        <img className={styles.yrgoLogo} src={yrgoLogo} alt="Yrgo logo" />
        <div className={`${styles.completionTextContainer}`}>
          <h2 className={styles.textXXL}>Great job!</h2>
          <p className={`${styles.textMedium}`}>
            Continue mingling or explore more in the app
          </p>
        </div>
      </div>
    </section>
  );
}
