import styles from "./SignUpInfo.module.css";
import Button from "../Buttons/Button";
import SignUpLine from "../../assets/sign-up-line.svg";
import { useNavigate } from "react-router-dom";

export default function SignUpInfo() {
    const navigate = useNavigate();

    return (
        <div className={styles.signUpInfo}>
            <div className={styles.infoContainer}>
                <div className={styles.headingInfoContainer}>
                    <h1 className={styles.heading}>Sign up today!</h1>
                    <p className={styles.description}>
                        And start exploring those attending beforehand!
                    </p>
                    <div className={styles.attendeesContainer}>
                        <div className={styles.attendeesStudents}>
                            <p className={styles.attendeesCount}>55 students registered</p> {/* This is a placeholder, we will need to fetch this data from the backend */}
                        </div>
                        <div className={styles.attendeesCompanies}>
                            <p className={styles.attendeesCount}>20 companies registered</p> {/* This is a placeholder, we will need to fetch this data from the backend */}
                        </div>
                    </div>
                </div>
                <div className={styles.buttonsContainer}>
                    <Button buttonName="Student" buttonColor="gray" iconSrc="arrowRight" onClick={() => navigate('/signup/student')} />
                    <Button buttonName="Company" buttonColor="gray" iconSrc="arrowRight" onClick={() => navigate('/signup/business')} />
                </div>
                <div className={styles.loginContainer}>
                    <div className={styles.loginGroup}>
                        <img src={SignUpLine} alt="" aria-hidden="true" className={styles.loginLine} />
                        <p className={styles.loginText}>Already signed up?</p>
                        <img src={SignUpLine} alt="" aria-hidden="true" className={styles.loginLine} />
                    </div>
                    <Button buttonName="Log in and explore" variant="whiteGrayBorder" iconSrc="arrowRight" onClick={() => navigate('/login')} />
                </div>
            </div>
        </div>
    );
}