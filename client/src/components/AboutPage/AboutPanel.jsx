import Button from "../Atoms/Buttons/Button";
import styles from "./AboutPanel.module.css";

export default function AboutPanel() {
  return (
    <section className={styles.aboutPanel}>
      <header className={styles.aboutHeader}>
        <h1>LIA FUSION</h1>
        <h2>Meaningful connections start here</h2>
      </header>

      <div className={styles.aboutContent}>
        <article className={styles.aboutSection}>
          <h3>ABOUT</h3>
          <p>
            LIA FUSION helps students and companies connect before, during and
            after the LIA event. Explore profiles, start conversations, and find
            the right match.
          </p>
          <div className={styles.slogan}>
            <p>Less randomness.</p>
            <p>More meaningful connections.</p>
          </div>
        </article>

        <article className={styles.aboutSection}>
          <h3>CONTACT AND SUPPORT</h3>
          <p>We're here to support you before, during and after the event.</p>
          <p>
            If you need to change information in your profile, please send us an
            email and we will update your profile for you.
          </p>
          <div className={styles.contactButton}>
            <Button
              buttonName="Contact us"
              variant="primaryGray"
              iconSrc="arrow45"
              onClick={() =>
                (window.location.href = "mailto:ac75456@skola.goteborg.se")
              }
              ariaLabel="Contact us via email"
            />
          </div>
        </article>
      </div>
    </section>
  );
}
