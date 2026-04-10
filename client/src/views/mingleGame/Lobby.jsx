import { useNavigate } from "react-router-dom";
import styles from "./MingleGame.module.css";
import DateTimer from "../../components/Timer/DateTimer.jsx";
import QrCode from "../../assets/icons/qr-code.svg";

export default function Lobby() {
  const navigate = useNavigate();

  const handleExpire = () => {
    // When the question timer expires, advance to the next round and navigate to the task page
    navigate("/start");
  };

  return (
    <section className={`${styles.main} ${styles.mainGrid}`}>
      <div className={`${styles.timerContainerDesktop}`}>
        <DateTimer
          targetDate="2026-04-10T22:13:00+02:00"
          onExpire={handleExpire}
          className={`${styles.timer}`}
        />
        {/* <DateTimer
            targetDate="2026-04-22T15:00:00+02:00"
            onExpire={handleExpire}
            className={styles.timer}
            /> */}
      </div>
      <div
        className={`${styles.textContainerDesktop} ${styles.backgroundBlurFilter}`}
      >
        <div>
          <h3 className={`${styles.textSmall}`}>Welcome to</h3>
          <div>
            <h1 className={`${styles.textMediumBold}`}>LIA FUSION</h1>
            <h2 className={`${styles.textMedium}`}>Speed Mingle</h2>
          </div>
        </div>
        <p className={`${styles.textSmall} ${styles.lobbyText}`}>
          Get ready to meet new people. Follow the instructions on your phone
          when the countdown reaches zero.
        </p>
        <div>
          {/* TEMPORARY IMG */}
          <p className={styles.textSmall}>Scan me!</p>
          <img src={QrCode} className={`${styles.qrCode}`} alt="" />
        </div>
      </div>
    </section>
  );
}
