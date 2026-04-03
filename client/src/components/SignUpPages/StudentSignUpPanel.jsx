import styles from "./SignUp.module.css";
import IconOnlyButton from "../Buttons/IconOnlyButton";
import TextInput from "../Forms/InputFields/TextInput";
import Button from "../Buttons/Button";
import { Link } from "react-router-dom";

const StudentSignUpPanel = () => {
    return (
        <div className={styles.signUpPanel}>
            <div className={styles.arrowButtonContainer}>
                <IconOnlyButton iconSrc="arrowBack" buttonColor="transparent" ariaLabel="Go back to previous page" />
            </div>
            <div className={styles.formContainer}>
                <h1 className={styles.heading}>Register</h1>
                <form className={styles.form}>
                    <div className={styles.nameContainer}>
                        <TextInput formLabel="First name" placeholder="John" type="text" required />
                        <TextInput formLabel="Last name" placeholder="Doe" type="text" required />
                    </div>
                    <TextInput formLabel="E-mail" placeholder="name@example.com" type="email" required />
                    <TextInput formLabel="Password" placeholder="********" type="password" required />
                    <TextInput formLabel="Confirm password" placeholder="********" type="password" required />
                    <Button buttonName="Register" buttonColor="gray" type="submit" iconSrc="arrowRight"/>
                </form>
            </div>
        </div>
    );
}

export default StudentSignUpPanel;