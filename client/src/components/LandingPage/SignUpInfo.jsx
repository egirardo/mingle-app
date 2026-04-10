import styles from "./SignUpInfo.module.css";
import Button from "../Buttons/Button";
import SignUpLine from "../../assets/sign-up-line.svg";
import DragExpand from "../../assets/icons/drag-expand.svg";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function SignUpInfo() {
    const [selectedButtons, setSelectedButtons] = useState({});
    const navigate = useNavigate();

    const handleButtonClick = (buttonId, destination) => {
        setSelectedButtons({ ...selectedButtons, [buttonId]: true });
        navigate(destination);
    };

    return (
        <div className={styles.signUpInfo}>
            <div className={styles.infoContainer}>
                <img src={DragExpand} alt="" aria-hidden="true" />
                <div className={styles.topHalfContainer}>
                <div className={styles.headingInfoContainer}>
                    <h1 className={styles.heading}>Register today!</h1>
                    <p className={styles.description}>
                        And start exploring the students and companies attending beforehand.
                    </p>
                <div className={styles.buttonsContainer}>
                    <Button buttonName="Student" variant={selectedButtons.student ? 'secondaryRed' : 'primaryRed'} iconSrc="arrowRight" onClick={() => handleButtonClick('student', '/signup/student')} />
                    <Button buttonName="Company" variant={selectedButtons.company ? 'secondaryRed' : 'primaryRed'} iconSrc="arrowRight" onClick={() => handleButtonClick('company', '/signup/business')} />
                </div>
                </div>
            </div>
                <div className={styles.loginContainer}>
                    <div className={styles.loginGroup}>
                        <img src={SignUpLine} alt="" aria-hidden="true" className={styles.loginLine} />
                        <p className={styles.loginText}>Already signed up?</p>
                        <img src={SignUpLine} alt="" aria-hidden="true" className={styles.loginLine} />
                    </div>
                    <Button buttonName="Log in and explore" variant="primaryGray" iconSrc="arrowRight" onClick={() => navigate('/login')} />
                </div>
            </div>
        </div>
    );
}