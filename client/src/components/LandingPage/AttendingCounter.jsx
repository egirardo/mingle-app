import { useState, useEffect } from "react";
import styles from "./AttendingCounter.module.css";

export default function AttendingCounter() {
  const [count, setCount] = useState(null);
  const [error, setError] = useState(null);

    useEffect(() => {
    Promise.all([
        fetch("/api/companies/count").then(r => r.json()),
        fetch("/api/students/count").then(r => r.json()),
    ])
        .then(([companies, students]) => setCount(companies.count + students.count))
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