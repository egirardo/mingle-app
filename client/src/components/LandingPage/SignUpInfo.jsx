import styles from "./SignUpInfo.module.css";
import Button from "../Buttons/Button";
import SignUpLine from "../../assets/sign-up-line.svg";

export default function SignUpInfo() {
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
                    <Button buttonName="Student" buttonColor="gray" iconSrc="arrowRight" />
                    <Button buttonName="Company" buttonColor="gray" iconSrc="arrowRight" /> {/* These buttons should lead to the respective sign up pages, where users can sign up and then be redirected to the dashboard */}
                </div>
                <div className={styles.loginContainer}>
                    <div className={styles.loginGroup}>
                        <img src={SignUpLine} alt="" aria-hidden="true" className={styles.loginLine} />
                        <p className={styles.loginText}>Already signed up?</p>
                        <img src={SignUpLine} alt="" aria-hidden="true" className={styles.loginLine} />
                    </div>
                    <Button buttonName="Log in and explore" variant="whiteGrayBorder" iconSrc="arrowRight" /> {/* This button should lead to the login page, where users can log in and then be redirected to the dashboard */}
                </div>
            </div>
        </div>
    );
}