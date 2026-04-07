import styles from "./Timer.module.css";
import { useEffect, useState, useRef } from "react";

// Props:
// - targetDate - ISO 8601 date string, takes Year-Month-DayTHour:Min:Second. Example "2026-04-22T15:00:00"
// - onExpire (function) — optional callback fired when timer reaches 0

export default function DateTimer({ targetDate, onExpire, className } = {}) {
  const initialDistance = (() => {
    if (!targetDate) return 0;
    const countDownDate = new Date(targetDate).getTime();
    if (Number.isNaN(countDownDate)) return 0;
    return Math.max(0, countDownDate - new Date().getTime());
  })();
  const [distance, setDistance] = useState(initialDistance);
  const expiredRef = useRef(false);
  const onExpireRef = useRef(onExpire);

  useEffect(() => {
    onExpireRef.current = onExpire;
  }, [onExpire]);

  useEffect(() => {
    const countDownDate = new Date(targetDate).getTime();

    if (!targetDate || Number.isNaN(countDownDate)) {
      setDistance(0);
      expiredRef.current = false;
      return;
    }

    setDistance(Math.max(0, countDownDate - new Date().getTime()));
    expiredRef.current = false;

    const id = setInterval(() => {
      setDistance(() => {
        const now = new Date().getTime();
        const remaining = Math.max(0, countDownDate - now);

        if (remaining <= 0) {
          expiredRef.current = true;
          clearInterval(id);
          return 0;
        }

        return remaining;
      });
    }, 1000);

    return () => clearInterval(id);
  }, [targetDate]);

  useEffect(() => {
    if (expiredRef.current) {
      expiredRef.current = false;
      if (onExpireRef.current) onExpireRef.current();
    }
  }, [distance]);

  const days = Math.floor(distance / (1000 * 60 * 60 * 24));
  const hours = Math.floor(
    (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
  );
  const mins = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  const secs = Math.floor((distance % (1000 * 60)) / 1000);

  const pad = (n) => String(n).padStart(2, "0");
  const timeDisplay = `${pad(hours)}:${pad(mins)}:${pad(secs)}`;

  const display = days > 0 ? `${days} Days, ${timeDisplay}` : timeDisplay;

  const combined = `${styles.countdownTimer} ${className || ""}`.trim();

  return <p className={combined}>{display}</p>;
}
