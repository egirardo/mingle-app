import { useState, useEffect, useRef } from "react";
import styles from "./SignUpInfo.module.css";
import Button from "../Buttons/Button";
import SignUpLine from "../../assets/sign-up-line.svg";
import DragExpand from "../../assets/icons/drag-expand.svg";
import { useNavigate } from "react-router-dom";

export default function SignUpInfo() {
    const navigate = useNavigate();
    const [isExpanded, setIsExpanded] = useState(false);
    const touchStartY = useRef(null);

    useEffect(() => {
        const handleWheel = (e) => {
            if (e.deltaY > 0) setIsExpanded(true);
            if (e.deltaY < 0) setIsExpanded(false);
        };

        const handleTouchStart = (e) => {
            touchStartY.current = e.touches[0].clientY;
        };

        const handleTouchEnd = (e) => {
            if (touchStartY.current === null) return;
            const deltaY = touchStartY.current - e.changedTouches[0].clientY;
            if (deltaY > 30) setIsExpanded(true);
            if (deltaY < -30) setIsExpanded(false);
            touchStartY.current = null;
        };

        window.addEventListener("wheel", handleWheel);
        window.addEventListener("touchstart", handleTouchStart);
        window.addEventListener("touchend", handleTouchEnd);

        return () => {
            window.removeEventListener("wheel", handleWheel);
            window.removeEventListener("touchstart", handleTouchStart);
            window.removeEventListener("touchend", handleTouchEnd);
        };
    }, []);

    return (
        <div className={`${styles.signUpInfo} ${isExpanded ? styles.expanded : ""}`}>
            <div
                className={styles.dragHandle}
                onClick={() => setIsExpanded(prev => !prev)}
                role="button"
                aria-label={isExpanded ? "Collapse panel" : "Expand panel"}
                aria-expanded={isExpanded}
            >
                <img src={DragExpand} alt="" aria-hidden="true" />
            </div>

            <div className={styles.infoContainer}>
                <div className={styles.topHalfContainer}>
                    <div className={styles.headingInfoContainer}>
                        <h1 className={styles.heading}>Register today!</h1>
                        <p className={styles.description}>
                            And start exploring the students and companies attending beforehand.
                        </p>
                        <div className={styles.buttonsContainer}>
                            <Button buttonName="Student" variant="primaryRed" iconSrc="arrowRight" onClick={() => navigate('/signup/student')} />
                            <Button buttonName="Company" variant="primaryRed" iconSrc="arrowRight" onClick={() => navigate('/signup/business')} />
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