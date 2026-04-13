import Button from "../Buttons/Button.jsx";
import styles from "./About.module.css";

export default function About() {
  return (
    <section className={`${styles.aboutPanel}`}>
      <div className={styles.aboutHeader}>
        <h1>LIA FUSION</h1>
        <h3>Meaningful connections start here</h3>
      </div>
      <div className={styles.aboutTextContainer}>
        <div className={styles.aboutTextContainer2}>
          <div className={styles.aboutText}>
            <h4>ABOUT</h4>
            <p>
              LIA FUSION helps students and companies connect before, during and
              after the LIA event. Explore profiles, start conversations, and
              find the right match.
            </p>
            <div className={styles.aboutSlogan}>
              <p>Less randomness.</p>
              <p>More meaningful connections.</p>
            </div>
          </div>
          <div className={styles.aboutText}>
            <h4>CONTACT AND SUPPORT</h4>
            <p>We’re here to support you before, during and after the event.</p>
            <p>
              If you need to change information in your profile, please send us
              an email and we will update your profile for you.
            </p>
            <div className={styles.emailButton}>
              <a href="mailto:ac75456@skola.goteborg.se">
                <Button
                  buttonName="Contact us"
                  variant="primaryGray"
                  iconSrc="arrow45"
                />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
