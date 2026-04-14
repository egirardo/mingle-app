import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../Atoms/Buttons/Button";
import IconOnlyButton from "../Atoms/Buttons/IconOnlyButton";
import styles from "./LoginPanel.module.css";
import TextInput from "../Atoms/Forms/InputFields/TextInput";
import { apiFetch } from "../../api";

export default function LoginPanel() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (field) => (e) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));
    // clear field error as soon as user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = "E-mail is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid e-mail address.";
    }

    if (!formData.password.trim()) {
      newErrors.password = "Password is required.";
    }

    return newErrors;
  };

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
      const res = await apiFetch("/api/students/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      // Store the JWT so all subsequent requests can send it in
      // the Authorization header as "Bearer <token>"
      localStorage.setItem("token", data.token);
      window.dispatchEvent(new Event("authchange"));

      navigate("/explore");
    } catch (err) {
      setSubmitError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.loginPanel}>
      <div className={styles.arrowButtonContainer}>
        <IconOnlyButton
          iconSrc="arrowBack"
          buttonColor="transparent"
          ariaLabel="Go back to previous page"
          onClick={() => navigate(-1)}
        />
      </div>
      <div className={styles.formContainer}>
        <h1 className={styles.heading}>Log in</h1>

        {submitError && (
          <p role="alert" className={styles.errorMessage}>
            {submitError}
          </p>
        )}

        <form className={styles.form} onSubmit={handleSubmit} noValidate>
          <TextInput
            formLabel="E-mail"
            placeholder="name@example.com"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange("email")}
            required
            error={errors.email}
          />
          <TextInput
            formLabel="Password"
            placeholder="********"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange("password")}
            required
            error={errors.password}
          />
          <Button
            buttonName={loading ? "Logging in..." : "Log in"}
            variant="primaryRed"
            type="submit"
            iconSrc="arrowRight"
            disabled={loading}
          />
        </form>
      </div>
    </div>
  );
}
