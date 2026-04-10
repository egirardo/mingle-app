import styles from "./MingleGame.module.css";
import Button from "../../components/Buttons/Button";
import yrgoLogo from "../../assets/yrgo-logo.svg";
import { useNavigate } from "react-router-dom";
import { usePlayBeep } from "../../Hooks/useAudio.js";
import { useState } from "react";

export default function Completion() {
  const [selectedButtons, setSelectedButtons] = useState({});
  const navigate = useNavigate();

  const handleButtonClick = (buttonId, destination) => {
    setSelectedButtons({ ...selectedButtons, [buttonId]: true });
    navigate(destination);
  };
  const playBeep = usePlayBeep();

  return (
    <div className={`${styles.main} ${styles.backgroundBlur}`}>
      <img className={styles.yrgoLogo} src={yrgoLogo} alt="Yrgo logo" />
      <div>
        <h2 className={styles.textLargeBold}>Great job!</h2>
        <p>Continue mingling or explore more in the app</p>
      </div>
      <Button
        buttonName="Explore participants"
        variant={selectedButtons.back ? 'secondaryRed' : 'primaryRed'}
        iconSrc="arrowRightWhite"
        onClick={() => {
          playBeep();
          handleButtonClick('back', "/");
        }}
      />
    </div>
  );
}
