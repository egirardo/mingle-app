import styles from "./EditProfile.module.css";
import Button from "../Atoms/Buttons/Button";
import IconOnlyButton from "../Atoms/Buttons/IconOnlyButton";
import { apiFetch } from "../../api";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import skillOptions from "../../data/filterOptions.json";
import EditPhoto from "../Atoms/Forms/InputFields/EditPhoto";
import TextInput from "../Atoms/Forms/InputFields/TextInput";
import RadioGroup from "../Atoms/Forms/RadioButtons/RadioGroup";
import CheckboxGroup from "../Atoms/Forms/Checkboxes/CheckboxGroup";

function normalizeURL(url) {
  if (!url || typeof url !== "string") return null;
  const trimmed = url.trim();
  if (!trimmed) return null;
  const hasScheme = /^[a-z][a-z\d+\-.]*:/i.test(trimmed);
  const candidate = hasScheme ? trimmed : `https://${trimmed}`;
  try {
    const parsed = new URL(candidate);
    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") return null;
    return parsed.toString();
  } catch {
    return null;
  }
}

export default function EditProfile() {
  const navigate = useNavigate();
  const [profileLoading, setProfileLoading] = useState(true);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [existingImageUrl, setExistingImageUrl] = useState(null);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    program: "",
    skills: [],
    about: "",
    questions: ["", "", ""],
    portfolio: "",
  });

  // ── Fetch current profile to prefill the form ──────────────────────────────
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    const fetchProfile = async () => {
      try {
        const headers = { Authorization: `Bearer ${token}` };
        const [profileRes, credRes] = await Promise.all([
          apiFetch("/api/students/profile", { headers }),
          apiFetch("/api/credentials", { headers }),
        ]);

        const profileData = await profileRes.json();
        if (!profileRes.ok) throw new Error(profileData.message);

        const credData = credRes.ok ? await credRes.json() : {};

        setExistingImageUrl(profileData.profileImage ?? null);
        setFormData({
          firstName: profileData.firstName ?? "",
          lastName: profileData.lastName ?? "",
          email: credData.email ?? "",
          password: "",
          confirmPassword: "",
          program: profileData.program ?? "",
          skills: profileData.skills ?? [],
          about: profileData.about ?? "",
          questions: [
            profileData.questions?.[0] ?? "",
            profileData.questions?.[1] ?? "",
            profileData.questions?.[2] ?? "",
          ],
          portfolio: profileData.portfolio ?? "",
        });
      } catch (err) {
        setError(err.message || "Could not load profile.");
      } finally {
        setProfileLoading(false);
      }
    };

    fetchProfile();
  }, [navigate]);

  // ── Generic field updater ──────────────────────────────────────────────────
  const handleChange = (field) => (e) =>
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));

  const handleQuestionChange = (index) => (e) => {
    const updated = [...formData.questions];
    updated[index] = e.target.value;
    setFormData((prev) => ({ ...prev, questions: updated }));
  };

  // ── Save ───────────────────────────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (formData.password && formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setSaving(true);

    const token = localStorage.getItem("token");
    if (!token) { navigate("/login"); return; }

    try {
      // 1. Update credentials if email or password was changed
      if (formData.email || formData.password) {
        const credBody = {};
        if (formData.email) credBody.email = formData.email;
        if (formData.password) credBody.password = formData.password;

        const credRes = await apiFetch("/api/credentials", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(credBody),
        });
        const credData = await credRes.json();
        if (!credRes.ok) throw new Error(credData.message);
      }

      // 2. Update profile fields
      const res = await apiFetch("/api/students/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          program: formData.program,
          skills: formData.skills,
          about: formData.about || null,
          questions: formData.questions.filter(Boolean),
          portfolio: normalizeURL(formData.portfolio),
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      // 3. Upload new profile image if one was selected
      if (profileImage) {
        const imageFormData = new FormData();
        imageFormData.append("profileImage", profileImage);
        try {
          const imageRes = await apiFetch("/api/students/profile/image", {
            method: "PUT",
            headers: { Authorization: `Bearer ${token}` },
            body: imageFormData,
          });
          if (!imageRes.ok) console.warn("Image upload failed, but profile was saved.");
        } catch (imgErr) {
          console.warn("Could not upload profile image:", imgErr);
        }
      }

      navigate(-1);
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  if (profileLoading) return null;

  return (
    <div className={styles.editContainer}>
      <div className={styles.signUpPanel}>
        <div className={styles.arrowButtonContainer}>
          <IconOnlyButton
            iconSrc="arrowBack"
            buttonColor="transparent"
            ariaLabel="Go back to profile page"
            onClick={() => navigate(-1)}
          />
        </div>

        <div className={styles.profileImageContainer}>
          <div className={styles.profileImage}>
            <EditPhoto
              initialPreview={existingImageUrl}
              onFileChange={(file) => setProfileImage(file)}
            />
          </div>
        </div>

        {error && <p role="alert" className={styles.errorMessage}>{error}</p>}

        <form onSubmit={handleSubmit}>
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
              formLabel="New password"
              placeholder="Leave blank to keep current"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange("password")}
              optional
            />
            <TextInput
              placeholder="Confirm new password"
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange("confirmPassword")}
              optional
            />
          </div>

          <RadioGroup
            required
            legend="Program"
            name="program"
            defaultValue={formData.program}
            onChange={(value) => setFormData((prev) => ({ ...prev, program: value }))}
            radios={[
              { radioLabel: "Digital Designer", id: "DigitalDesigner", name: "program", value: "Digital Designer" },
              { radioLabel: "Web Developer", id: "WebDeveloper", name: "program", value: "Web Developer" },
            ]}
          />

          <CheckboxGroup
            required
            legend="Skills/Interests"
            defaultValues={formData.skills}
            onChange={(values) => setFormData((prev) => ({ ...prev, skills: values }))}
            checkboxes={skillOptions}
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

          <TextInput
            formLabel="Portfolio"
            placeholder="https://yourportfolio.com"
            type="text"
            name="portfolio"
            value={formData.portfolio}
            onChange={handleChange("portfolio")}
            optional
          />

          <Button
            buttonName={saving ? "Saving..." : "Save"}
            variant="primaryRed"
            type="submit"
            iconSrc="checkmark"
            disabled={saving}
          />
        </form>
      </div>
    </div>
  );
}
