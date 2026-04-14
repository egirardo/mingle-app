import { useState, useEffect, useRef } from "react";
import styles from "./SignUpInfo.module.css";
import Button from "../Atoms/Buttons/Button";
import DragExpand from "../../assets/icons/drag-expand.svg";
import { useNavigate } from "react-router-dom";
import TabSlider from "../Atoms/Tabs/TabSlider";
import { useSaved } from "../../context/SavedContext";

const TABS = ["Company", "Student"];

export default function SignUpInfo() {
    const navigate = useNavigate();
    const { isLoggedIn } = useSaved();
    const [isExpanded, setIsExpanded] = useState(false);
    const [activeTabIndex, setActiveTabIndex] = useState(0);
    const touchStartY = useRef(null);

    const isStudentTab = activeTabIndex === 1;

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
                    </div>
                </div>
                <div className={styles.loginContainer}>
                    <div className={styles.roleGroup}>
                        <h2 className={styles.subHeading}>Choose your role</h2>
                        <TabSlider
                            tabs={TABS}
                            defaultIndex={0}
                            onChange={(index) => setActiveTabIndex(index)}
                        />
                    </div>
                    {isStudentTab ? (
                        <div
                            id="tabpanel-1"
                            role="tabpanel"
                            aria-labelledby="tab-1"
                            className={styles.loginGroup}
                        >
                            <Button
                                buttonName="Register"
                                variant="primaryRed"
                                iconSrc="arrowRight"
                                onClick={() => navigate('/signup/student')}
                            />
                            <Button
                                buttonName={isLoggedIn ? "Explore" : "Log in and explore"}
                                variant="primaryGray"
                                iconSrc="arrowRight"
                                onClick={() => navigate(isLoggedIn ? '/explore' : '/login')}
                            />
                        </div>
                    ) : (
                        <div
                            id="tabpanel-0"
                            role="tabpanel"
                            aria-labelledby="tab-0"
                            className={styles.loginGroup}
                        >
                            <Button
                                buttonName="Register"
                                variant="primaryRed"
                                iconSrc="arrowRight"
                                onClick={() => navigate('/signup/business')}
                            />
                            <Button
                                buttonName="Explore first"
                                variant="primaryGray"
                                iconSrc="arrowRight"
                                onClick={() => navigate('/explore')}
                            />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
