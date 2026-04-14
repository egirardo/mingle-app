import { useState, useEffect } from "react";
import styles from "./AttendingCounter.module.css";

export default function AttendingCounter() {
  const [count, setCount] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const API_BASE = import.meta.env.VITE_API_URL ?? "";

    fetch(`${API_BASE}/api/count`)
      .then((res) => {
        if (!res.ok) throw new Error(`Count failed: ${res.status}`);
        return res.json();
      })
      .then((data) => setCount(data.total ?? 0))
      .catch((err) => {
        console.error("Failed to fetch attendee count:", err);
        setError("—");
      });
  }, []);

  const displayed = error ?? (count === null ? "…" : String(count).padStart(2, "0"));

  return (
    <div className={styles.card}>
      <span className={styles.label}>ATTENDING</span>
      <span className={styles.number}>{displayed}</span>
      <span className={styles.sub}>(so far)</span>
    </div>
  );
}