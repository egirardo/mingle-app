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
    <div className={`${styles.main}`}>
      <DateTimer
        targetDate="2026-04-10T18:13:00+02:00"
        onExpire={handleExpire}
        className={`${styles.timer}`}
      />
      {/* <DateTimer
          targetDate="2026-04-22T15:00:00+02:00"
          onExpire={handleExpire}
          className={styles.timer}
        /> */}
      <div className={`${styles.backgroundBlur}`}>
        <div>
          <h3 className={`${styles.textMediumRegular}`}>Welcome to</h3>
          <div>
            <h1 className={`${styles.textExtraLarge}`}>LIA FUSION</h1>
            <h2 className={`${styles.textLarge}`}>Speed Mingle</h2>
          </div>
        </div>
        <div>
          <p className={styles.textMediumRegular}>
            Get ready to meet new people. Follow the instructions on your phone
            when the countdown reaches zero.
          </p>
          <div>
            <p>Scan me!</p>
            <img src={QrCode} className={`${styles.qrCode}`} alt="" />
          </div>
        </div>
      </div>
    </div>
  );
}
