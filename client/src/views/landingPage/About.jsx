import Button from "../../components/Buttons/Button.jsx";
import LandingPageLayout from "./Layout/LandingPageLayout.jsx";

export default function About() {
  return (
    <LandingPageLayout>
      <div>
        <h4>ABOUT</h4>
        <p>
          LIA FUSION helps students and companies connect before, during and
          after the LIA event. Explore profiles, start conversations, and find
          the right match.
        </p>
        <div>
          <p>Less randomness.</p>
          <p>More meaningful connections.</p>
        </div>
      </div>
      <div>
        <h4>CONTACT AND SUPPORT</h4>
        <p>We’re here to support you before, during and after the event.</p>
        <p>
          If you need to change information in your profile, please send us an
          email and we will update your profile for you.
        </p>
      </div>
      <Button
        buttonName="Contact us"
        variant="primaryGray"
        iconSrc="arrow45"
        onClick={() => {}}
      />
    </LandingPageLayout>
  );
}
