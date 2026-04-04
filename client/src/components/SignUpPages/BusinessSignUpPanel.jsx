import styles from "./SignUp.module.css";
import IconOnlyButton from "../Buttons/IconOnlyButton";
import TextInput from "../Forms/InputFields/TextInput";
import Button from "../Buttons/Button";
import { useNavigate } from "react-router-dom";
import CheckboxGroup from "../Forms/Checkboxes/CheckboxGroup";
import RadioGroup from "../Forms/RadioButtons/RadioGroup";

const BusinessSignUpPanel = () => {
    const navigate = useNavigate();
    return (
        <div className={styles.signUpPanel}>
            <div className={styles.arrowButtonContainer}>
                    <IconOnlyButton iconSrc="arrowBack" buttonColor="transparent" ariaLabel="Go back to home page"
                    onClick={() => navigate("/")}/>
            </div>
            <div className={styles.formContainer}>
                <h1 className={styles.heading}>Register</h1>
                <form className={styles.form}>
                    <TextInput formLabel="Company" placeholder="Apple" type="text" required />
                    <TextInput formLabel="Contact Person" placeholder="John Doe" type="text" required />
                    <TextInput formLabel="E-mail" placeholder="name@example.com" type="email" optional subText="Be reminded before the event" />
                    <RadioGroup 
                        required
                        subText="November 2026 to May 2027"
                        legend="How many LIA-students are you interested in?"
                        name="liaPlaces"
                        radios={[
                            { radioLabel: "1", id: "lia1", name: "liaPlaces", value: "1" },
                            { radioLabel: "2 or more", id: "lia2plus", name: "liaPlaces", value: "2_or_more" },
                            { radioLabel: "Don't know yet", id: "liaUnknown", name: "liaPlaces", value: "unknown" }
                        ]} 
                    />
                    <CheckboxGroup
                        required
                        legend="Skills/interests you are looking for in LIA-students"
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
                    <TextInput formLabel="About the company" placeholder="Short description" type="text" required />
                    <TextInput formLabel="Website" placeholder="https://www.example.com" type="url" optional />
                    <Button buttonName="Register" buttonColor="gray" type="submit" iconSrc="arrowRight"/>
                </form>
            </div>
        </div>
    );
}

export default BusinessSignUpPanel;