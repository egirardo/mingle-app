import { useState } from "react";
import styles from "./SignUp.module.css";
import IconOnlyButton from "../Atoms/Buttons/IconOnlyButton";
import TextInput from "../Atoms/Forms/InputFields/TextInput";
import Button from "../Atoms/Buttons/Button";
import { useNavigate } from "react-router-dom";
import RadioGroup from "../Atoms/Forms/RadioButtons/RadioGroup";
import CheckboxGroup from "../Atoms/Forms/Checkboxes/CheckboxGroup";
import PhotoUpload from "../Atoms/Forms/InputFields/PhotoUpload";
import { apiFetch } from "../../api";

// ─── HELPERS ─────────────────────────────────────────────────────────────────
/**
* @returns {string|null} Normalized URL or null if empty or invalid
 */
function normalizeURL(url) {
  if (!url || typeof url !== "string") {
    return null;
  }
  const trimmed = url.trim();
  if (!trimmed) {
    return null;
  }
  const hasScheme = /^[a-z][a-z\d+\-.]*:/i.test(trimmed);
  const candidate = hasScheme ? trimmed : `https://${trimmed}`;
  try {
    const parsed = new URL(candidate);
    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
      return null;
    }
    return parsed.toString();
  } catch {
    return null;
  }
}

const StudentSignUpPanel = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    program: "",
    skills: [],
    about: "",
    // Three separate "Let me tell you about..." answers
    questions: ["", "", ""],
    portfolio: "",
  });

  const [profileImage, setProfileImage] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // ── Generic field updater ──────────────────────────────────────────────────
  const handleChange = (field) => (e) =>
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));

  // ── Questions array updater ────────────────────────────────────────────────
  const handleQuestionChange = (index) => (e) => {
    const updated = [...formData.questions];
    updated[index] = e.target.value;
    setFormData((prev) => ({ ...prev, questions: updated }));
  };

  // ── Submit ─────────────────────────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      const res = await apiFetch("/api/students/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          password: formData.password,
          program: formData.program,
          skills: formData.skills,
          about: formData.about || null,
          // Backend joins non-empty answers with "||"; empty strings are filtered out
          questions: formData.questions.filter(Boolean),
          portfolio: normalizeURL(formData.portfolio),
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      // Registration successful — upload profile image if provided
      if (profileImage && data.token) {
        const imageFormData = new FormData();
        imageFormData.append('profileImage', profileImage);

        try {
          const imageRes = await apiFetch('/api/students/profile/image', {
            method: 'PUT',
            headers: { 'Authorization': `Bearer ${data.token}` },
            body: imageFormData,
          });

          if (!imageRes.ok) {
            console.warn('Image upload failed, but registration succeeded');
          }
        } catch (imgErr) {
          console.warn('Could not upload profile image:', imgErr);
        }
      }

      // Redirect to login
      navigate("/login");
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
          <div className={styles.nameContainer}>
            <TextInput
              formLabel="First name"
              placeholder="John"
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange("firstName")}
              required
            />
            <TextInput
              formLabel="Last name"
              placeholder="Doe"
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange("lastName")}
              required
            />
          </div>

          <TextInput
            formLabel="E-mail"
            placeholder="name@example.com"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange("email")}
            required
          />

          <div className={styles.passwordGroup}>
            <TextInput
              formLabel="Password"
              placeholder="********"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange("password")}
              required
            />
            <TextInput
              placeholder="Confirm Password"
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange("confirmPassword")}
              required
            />
          </div>

          <RadioGroup
            required
            legend="Program"
            name="program"
            onChange={(value) => setFormData((prev) => ({ ...prev, program: value }))}
            radios={[
              { radioLabel: "Digital Designer", id: "DigitalDesigner", name: "program", value: "Digital Designer" },
              { radioLabel: "Web Developer", id: "WebDeveloper", name: "program", value: "Web Developer" },
            ]}
          />

          <CheckboxGroup
            required
            legend="Skills/Interests"
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
            formLabel="Fun Fact"
            placeholder="Write something short about yourself"
            type="text"
            name="about"
            value={formData.about}
            onChange={handleChange("about")}
            optional
          />

          <div className={styles.aboutGroup}>
            <TextInput
              formLabel="Let me tell you about..."
              placeholder="How I use AI in my design process"
              type="text"
              name="question0"
              value={formData.questions[0]}
              onChange={handleQuestionChange(0)}
              optional
            />
            <TextInput
              placeholder="Why I switched careers"
              type="text"
              name="question1"
              value={formData.questions[1]}
              onChange={handleQuestionChange(1)}
              optional
            />
            <TextInput
              placeholder="What I'm looking for in a project"
              type="text"
              name="question2"
              value={formData.questions[2]}
              onChange={handleQuestionChange(2)}
              optional
            />
          </div>

          <PhotoUpload
            onFileChange={(file) => setProfileImage(file)}
            portfolio={formData.portfolio}
            onPortfolioChange={(value) =>
              setFormData((prev) => ({ ...prev, portfolio: value }))
            }
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

export default StudentSignUpPanel;