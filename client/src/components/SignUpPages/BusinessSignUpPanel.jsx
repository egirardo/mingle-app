import { useState } from "react";
import styles from "./SignUp.module.css";
import IconOnlyButton from "../Atoms/Buttons/IconOnlyButton";
import TextInput from "../Atoms/Forms/InputFields/TextInput";
import Button from "../Atoms/Buttons/Button";
import { useNavigate } from "react-router-dom";
import CheckboxGroup from "../Atoms/Forms/Checkboxes/CheckboxGroup";
import RadioGroup from "../Atoms/Forms/RadioButtons/RadioGroup";
import { apiFetch } from "../../api";
import skillOptions from "../../data/filterOptions.json";

// ─── HELPERS ─────────────────────────────────────────────────────────────────
/**
 * Normalizes a URL by prepending https:// if no protocol is included
 * @param {string} url - The URL to normalize
 * @returns {string|null} Normalized URL or null if empty
 */
function normalizeURL(url) {
  if (!url || typeof url !== "string") {
    return null;
  }
  const trimmed = url.trim();
  if (!trimmed) {
    return null;
  }
  const hasScheme = /^[a-z][a-z\d+.-]*:/i.test(trimmed);
  const candidate = hasScheme ? trimmed : `https://${trimmed}`;
  let parsed;
  try {
    parsed = new URL(candidate);
  } catch {
    throw new Error("Please enter a valid website URL.");
  }
  if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
    throw new Error("Website URL must start with http:// or https://.");
  }
  return parsed.toString();
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

  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState("");
  const [loading, setLoading] = useState(false);

  // ── Generic field updater ──────────────────────────────────────────────────
  const handleChange = (field) => (e) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));
    // clear field error as soon as user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  // ── Validation ─────────────────────────────────────────────────────────────
  const validate = () => {
    const newErrors = {};

    if (!formData.company.trim()) {
      newErrors.company = "Company name is required.";
    }

    if (!formData.contactPerson.trim()) {
      newErrors.contactPerson = "Contact person name is required.";
    }

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid e-mail address.";
    }

    if (!formData.liaSpaces) {
      newErrors.liaSpaces =
        "Please select how many LIA-students you are interested in.";
    }

    if (formData.skills.length === 0) {
      newErrors.skills = "Please select at least one skill.";
    }

    if (!formData.about.trim()) {
      newErrors.about = "Company description is required.";
    }

    if (formData.website) {
      try {
        normalizeURL(formData.website);
      } catch (err) {
        newErrors.website = err.message;
      }
    }

    return newErrors;
  };

  // ── Submit ─────────────────────────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError("");

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

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
      navigate("/confirmation");
    } catch (err) {
      setSubmitError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.pageContainer}>
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

        {submitError && (
          <p role="alert" className={styles.errorMessage}>
            {submitError}
          </p>
        )}

        <form className={styles.form} onSubmit={handleSubmit} noValidate>
          <TextInput
            formLabel="Company"
            placeholder="Apple"
            type="text"
            name="company"
            value={formData.company}
            onChange={handleChange("company")}
            required
            error={errors.company}
          />
          <TextInput
            formLabel="Contact Person"
            placeholder="John Doe"
            type="text"
            name="contactPerson"
            value={formData.contactPerson}
            onChange={handleChange("contactPerson")}
            required
            error={errors.contactPerson}
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
            error={errors.email}
          />

          <RadioGroup
            required
            subText="November 2026 to May 2027"
            legend="How many LIA-students are you interested in?"
            name="liaSpaces"
            onChange={(value) => {
              setFormData((prev) => ({ ...prev, liaSpaces: value }));
              if (errors.liaSpaces) {
                setErrors((prev) => ({ ...prev, liaSpaces: "" }));
              }
            }}
            error={errors.liaSpaces}
            radios={[
              // Values MUST exactly match the Company model enum:
              // ['1', '2 or more', "Don't know yet"]
              { radioLabel: "1", id: "lia1", name: "liaSpaces", value: "1" },
              {
                radioLabel: "2 or more",
                id: "lia2plus",
                name: "liaSpaces",
                value: "2 or more",
              },
              {
                radioLabel: "Don't know yet",
                id: "liaUnknown",
                name: "liaSpaces",
                value: "Don't know yet",
              },
            ]}
          />

          <CheckboxGroup
            required
            legend="Skills/interests you are looking for in LIA-students"
            onChange={(values) => {
              setFormData((prev) => ({ ...prev, skills: values }));
              if (errors.skills) {
                setErrors((prev) => ({ ...prev, skills: "" }));
              }
            }}
            error={errors.skills}
            checkboxes={skillOptions}
          />

          <TextInput
            formLabel="About the company"
            placeholder="Short description"
            type="text"
            name="about"
            value={formData.about}
            onChange={handleChange("about")}
            required
            error={errors.about}
          />
          <TextInput
            formLabel="Website"
            placeholder="https://www.example.com"
            type="text"
            name="website"
            value={formData.website}
            onChange={handleChange("website")}
            optional
            error={errors.website}
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
    </div>
  );
};

export default BusinessSignUpPanel;
