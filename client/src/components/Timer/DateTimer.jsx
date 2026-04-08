import styles from "./Timer.module.css";
import { useEffect, useState, useRef } from "react";

// Props:
// - targetDate - ISO 8601 date string, takes Year-Month-DayTHour:Min:Second+Timezone. Example "2026-04-22T15:00:00+02:00"
// - onExpire (function) — optional callback fired when timer reaches 0

// DateTimer.jsx — fire onExpire immediately if target date is already past on mount

export default function DateTimer({ targetDate, onExpire, className } = {}) {
  const initialDistance = (() => {
    if (!targetDate) return 0;
    const countDownDate = new Date(targetDate).getTime();
    if (Number.isNaN(countDownDate)) return 0;
    return Math.max(0, countDownDate - new Date().getTime());
  })();

  const [distance, setDistance] = useState(initialDistance);
  const onExpireRef = useRef(onExpire);

  useEffect(() => {
    onExpireRef.current = onExpire;
  }, [onExpire]);

  // If already expired on mount, fire immediately
  useEffect(() => {
    if (initialDistance === 0) {
      onExpireRef.current?.();
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const countDownDate = new Date(targetDate).getTime();

    if (!targetDate || Number.isNaN(countDownDate)) {
      setDistance(0);
      return;
    }

    const remaining = Math.max(0, countDownDate - Date.now());
    setDistance(remaining);

    if (remaining === 0) return; // Already handled by mount effect

    const id = setInterval(() => {
      const now = Date.now();
      const rem = Math.max(0, countDownDate - now);
      setDistance(rem);

      if (rem <= 0) {
        clearInterval(id);
        onExpireRef.current?.();
      }
    }, 1000);

    return () => clearInterval(id);
  }, [targetDate]);

  const days = Math.floor(distance / (1000 * 60 * 60 * 24));
  const hours = Math.floor(
    (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
  );
  const mins = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  const secs = Math.floor((distance % (1000 * 60)) / 1000);

  const pad = (n) => String(n).padStart(2, "0");
  const timeDisplay = `${pad(hours)}:${pad(mins)}:${pad(secs)}`;
  const minuteSecondDisplay = `${pad(mins)}:${pad(secs)}`;
  const dayLabel = days === 1 ? "Day" : "Days";

  let display = minuteSecondDisplay;

  if (days > 0) {
    display = `${days} ${dayLabel}, ${timeDisplay}`;
  } else if (hours > 0) {
    display = timeDisplay;
  }

  const combined = `${styles.countdownTimer} ${className || ""}`.trim();

  return <p className={combined}>{display}</p>;
}
