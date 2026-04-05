import styles from "./SignUp.module.css";
import IconOnlyButton from "../Buttons/IconOnlyButton";
import TextInput from "../Forms/InputFields/TextInput";
import Button from "../Buttons/Button";
import { useNavigate } from "react-router-dom";
import Checkbox from "../Forms/Checkboxes/Checkbox";
import RadioGroup from "../Forms/RadioButtons/RadioGroup";
import CheckboxGroup from "../Forms/Checkboxes/CheckboxGroup";
import PhotoUpload from "../Forms/InputFields/PhotoUpload";

const StudentSignUpPanel = () => {
    const navigate = useNavigate();
    return (
        <div className={styles.signUpPanel}>
            <div className={styles.arrowButtonContainer}>
                <IconOnlyButton iconSrc="arrowBack" buttonColor="transparent" ariaLabel="Go back to home page" onClick={() => navigate("/")}/>
            </div>
            <div className={styles.formContainer}>
                <h1 className={styles.heading}>Register</h1>
                <form className={styles.form}>
                    <div className={styles.nameContainer}>
                        <TextInput formLabel="First name" placeholder="John" type="text" required />
                        <TextInput formLabel="Last name" placeholder="Doe" type="text" required />
                    </div>
                    <TextInput formLabel="E-mail" placeholder="name@example.com" type="email" required />
                    <div className={styles.passwordGroup}>
                        <TextInput formLabel="Password" placeholder="********" type="password" required />
                        <TextInput placeholder="Confirm Password" type="password" required />
                    </div>
                    <RadioGroup
                        required
                        legend="Program"
                        name="program"
                        radios={[
                            { radioLabel: "DD", id: "dd", name: "program", value: "dd" },
                            { radioLabel: "WU", id: "wu", name: "program", value: "wu" },
                        ]}
                    />
                    <CheckboxGroup
                        required
                        legend="Skills/Interests"
                        checkboxes={[
                            { checkboxLabel: "UI", id: "1", name: "UI" },
                            { checkboxLabel: "UX", id: "2", name: "UX" },
                            { checkboxLabel: "Frontend", id: "3", name: "Frontend" },
                            { checkboxLabel: "Backend", id: "4", name: "Backend" },
                            { checkboxLabel: "Motion", id: "5", name: "Motion" },
                            { checkboxLabel: "3D", id: "6", name: "3D" },
                            { checkboxLabel: "Fullstack", id: "7", name: "Fullstack" },
                            { checkboxLabel: "Branding", id: "8", name: "Branding" }
                        ]}
                    />

                    <TextInput formLabel="Fun Fact" placeholder="Write something short about yourself" type="text" optional />

                    <div className="aboutGroup">
                        <TextInput formLabel="Let me tell you about..." placeholder="How I use AI in my design process" type="text" optional/>
                        <TextInput placeholder="Why I switched careers" type="text" optional/>
                        <TextInput placeholder="What I'm looking for in a project" type="text" optional/>
                    </div>
                    <PhotoUpload />
                    <Button buttonName="Register" buttonColor="gray" type="submit" iconSrc="arrowRight"/>
                </form>
            </div>
        </div>
    );
}

export default StudentSignUpPanel;
