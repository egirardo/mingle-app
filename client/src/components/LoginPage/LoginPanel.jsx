import Button from "../Buttons/Button";
import IconOnlyButton from "../Buttons/IconOnlyButton";
import styles from "./LoginPanel.module.css";
import TextInput from "../Forms/InputFields/TextInput";
import { useNavigate } from "react-router-dom";


export default function LoginPanel() {
    const navigate = useNavigate();
    return (
        <div className={styles.loginPanel}>
            <div className={styles.arrowButtonContainer}>
                <IconOnlyButton iconSrc="arrowBack" buttonColor="transparent" ariaLabel="Go back to home page" onClick={() => navigate("/")}/>
            </div>
            <div className={styles.formContainer}>
                <h1 className={styles.heading}>Log in</h1>
                <form className={styles.form}>
                    <TextInput formLabel="E-mail" placeholder="name@example.com" type="email" required />
                    <TextInput formLabel="Password" placeholder="********" type="password" required />
                    <Button buttonName="Log in" buttonColor="gray" type="submit" iconSrc="arrowRight"/>
                </form>
            </div>
        </div>
    );
}
            