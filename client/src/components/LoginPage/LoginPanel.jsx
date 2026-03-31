import Button from "../Buttons/Button";
import IconOnlyButton from "../Buttons/IconOnlyButton";
import styles from "./LoginPanel.module.css";
import TextInput from "../Forms/InputFields/TextInput";


export default function LoginPanel() {
    return (
        <div className={styles.loginPanel}>
            <div className={styles.arrowButtonContainer}>
                <IconOnlyButton className={styles.arrowButton} iconSrc="arrowBack" buttonColor="transparent"aria-label="Go back to previous page" />
            </div>
            <div className={styles.formContainer}>
                <h1 className={styles.heading}>Log in</h1>
                <form className={styles.form}>
                    <TextInput formLabel="E-mail" placeholder="edvinjansson@gmail.com" type="email" required />
                    <TextInput formLabel="Password" placeholder="********" type="password" required />
                    <Button buttonName="Log in" buttonColor="gray" type="submit" iconSrc="arrowRight"/>
                </form>
            </div>
        </div>
    );
}
            