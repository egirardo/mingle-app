import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../Buttons/Button";
import IconOnlyButton from "../Buttons/IconOnlyButton";
import styles from "./LoginPanel.module.css";
import TextInput from "../Forms/InputFields/TextInput";

export default function LoginPanel() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (field) => (e) =>
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/students/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      // Store the JWT so all subsequent requests can send it in
      // the Authorization header as "Bearer <token>"
      localStorage.setItem("token", data.token);

      navigate("/"); // Once created, redirect to explore page instead, this is a placeholder
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
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

        {error && <p role="alert" className={styles.errorMessage}>{error}</p>}

        <form className={styles.form} onSubmit={handleSubmit}>
          <TextInput
            formLabel="E-mail"
            placeholder="name@example.com"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange("email")}
            required
          />
          <TextInput
            formLabel="Password"
            placeholder="********"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange("password")}
            required
          />
          <Button
            buttonName={loading ? "Logging in..." : "Log in"}
            buttonColor="gray"
            type="submit"
            iconSrc="arrowRight"
            disabled={loading}
          />
        </form>
      </div>
    </div>
  );
}