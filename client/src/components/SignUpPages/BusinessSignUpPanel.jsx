import { useState } from "react";
import styles from "./SignUp.module.css";
import IconOnlyButton from "../Buttons/IconOnlyButton";
import TextInput from "../Forms/InputFields/TextInput";
import Button from "../Buttons/Button";
import { useNavigate } from "react-router-dom";
import CheckboxGroup from "../Forms/Checkboxes/CheckboxGroup";
import RadioGroup from "../Forms/RadioButtons/RadioGroup";
import { apiFetch } from "../../api";

// ─── HELPERS ─────────────────────────────────────────────────────────────────
/**
 * Normalizes a URL by prepending https:// if no protocol is included
 * @param {string} url - The URL to normalize
 * @returns {string|null} Normalized URL or null if empty
 */
function normalizeURL(url) {
  if (!url || typeof url !== 'string') {
    return null;
  }
  const trimmed = url.trim();
  if (!trimmed) {
    return null;
  }
  if (!trimmed.startsWith('http://') && !trimmed.startsWith('https://')) {
    return `https://${trimmed}`;
  }
  return trimmed;
}

const BusinessSignUpPanel = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    company: "",
    contactPerson: "",
    email: "",
    liaSpaces: "",
    skills: [],
    about: "",
    website: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // ── Generic field updater ──────────────────────────────────────────────────
  const handleChange = (field) => (e) =>
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));

  // ── Submit ─────────────────────────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await apiFetch("/api/companies/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          company: formData.company,
          contactPerson: formData.contactPerson,
          email: formData.email,
          liaSpaces: formData.liaSpaces,
          skills: formData.skills,
          about: formData.about || null,
          website: normalizeURL(formData.website),
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      // Registration successful — redirect to home or a confirmation page
      navigate("/");
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.signUpPanel}>
      <div className={styles.arrowButtonContainer}>
        <IconOnlyButton
          iconSrc="arrowBack"
          buttonColor="transparent"
          ariaLabel="Go back to home page"
          onClick={() => navigate("/")}
        />
      </div>
      <div className={styles.formContainer}>
        <h1 className={styles.heading}>Register</h1>

        {error && <p role="alert" className={styles.errorMessage}>{error}</p>}

        <form className={styles.form} onSubmit={handleSubmit}>
          <TextInput
            formLabel="Company"
            placeholder="Apple"
            type="text"
            name="company"
            value={formData.company}
            onChange={handleChange("company")}
            required
          />
          <TextInput
            formLabel="Contact Person"
            placeholder="John Doe"
            type="text"
            name="contactPerson"
            value={formData.contactPerson}
            onChange={handleChange("contactPerson")}
            required
          />
          <TextInput
            formLabel="E-mail"
            placeholder="name@example.com"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange("email")}
            optional
            subText="Be reminded before the event"
          />

          <RadioGroup
            required
            subText="November 2026 to May 2027"
            legend="How many LIA-students are you interested in?"
            name="liaSpaces"
            onChange={(value) => setFormData((prev) => ({ ...prev, liaSpaces: value }))}
            radios={[
              // Values MUST exactly match the Company model enum:
              // ['1', '2 or more', "Don't know yet"]
              { radioLabel: "1", id: "lia1", name: "liaSpaces", value: "1" },
              { radioLabel: "2 or more", id: "lia2plus", name: "liaSpaces", value: "2 or more" },
              { radioLabel: "Don't know yet", id: "liaUnknown", name: "liaSpaces", value: "Don't know yet" },
            ]}
          />

          <CheckboxGroup
            required
            legend="Skills/interests you are looking for in LIA-students"
            onChange={(values) => setFormData((prev) => ({ ...prev, skills: values }))}
            checkboxes={[
              { checkboxLabel: "UI", id: "1", name: "UI" },
              { checkboxLabel: "UX", id: "2", name: "UX" },
              { checkboxLabel: "Frontend", id: "3", name: "Frontend" },
              { checkboxLabel: "Backend", id: "4", name: "Backend" },
              { checkboxLabel: "Motion", id: "5", name: "Motion" },
              { checkboxLabel: "3D", id: "6", name: "3D" },
              { checkboxLabel: "Fullstack", id: "7", name: "Fullstack" },
              { checkboxLabel: "Branding", id: "8", name: "Branding" },
            ]}
          />

          <TextInput
            formLabel="About the company"
            placeholder="Short description"
            type="text"
            name="about"
            value={formData.about}
            onChange={handleChange("about")}
            required
          />
          <TextInput
            formLabel="Website"
            placeholder="www.example.com or https://www.example.com"
            type="text"
            name="website"
            value={formData.website}
            onChange={handleChange("website")}
            optional
          />

          <Button
            buttonName={loading ? "Registering..." : "Register"}
            variant="primaryRed"
            type="submit"
            iconSrc="arrowRight"
            disabled={loading}
          />
        </form>
      </div>
    </div>
  );
};

export default BusinessSignUpPanel;