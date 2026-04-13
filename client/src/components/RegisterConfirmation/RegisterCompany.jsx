import Button from "../Atoms/Buttons/Button.jsx";
import styles from "./RegisterConfirmation.module.css";
import { useNavigate } from "react-router-dom";

export default function RegisterConfirmationCompany() {
  const navigate = useNavigate();

  return (
    <section className={styles.confirmation}>
      <h1>
        Your registration is confirmed. We look forward to seeing you at the
        event!
      </h1>
      <div className={styles.companyRegisterExplore}>
        <p>Check out attending students beforehand</p>
        <Button
          buttonName="Explore"
          variant="primaryRed"
          iconSrc="arrowRight"
          onClick={() => navigate("/explore")}
        />
      </div>
    </section>
  );
}
