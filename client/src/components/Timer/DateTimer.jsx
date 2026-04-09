import styles from "./Timer.module.css";
import { useEffect, useState, useRef } from "react";

// Props:
// - targetDate (string) — ISO 8601 string with Swedish timezone offset
//                         Winter (CET):  "2026-01-22T15:00:00+01:00"
//                         Summer (CEST): "2026-04-22T15:00:00+02:00"
// - onExpire (function) — optional callback fired when timer reaches 0

export default function DateTimer({ targetDate, onExpire, className } = {}) {
  const initialDistance = (() => {
    if (!targetDate) return 0;
    const countDownDate = new Date(targetDate).getTime();
    if (Number.isNaN(countDownDate)) return 0;
    return Math.max(0, countDownDate - new Date().getTime());
  })();

  const [distance, setDistance] = useState(initialDistance);
  const onExpireRef = useRef(onExpire);
  const expiredRef = useRef(false);

  useEffect(() => {
    onExpireRef.current = onExpire;
  }, [onExpire]);

  useEffect(() => {
    if (!targetDate) return;
    const countDownDate = new Date(targetDate).getTime();
    if (Number.isNaN(countDownDate)) return;
    if (countDownDate <= Date.now() && !expiredRef.current) {
      expiredRef.current = true;
      onExpireRef.current?.();
    }
  }, [targetDate]);

  useEffect(() => {
    const countDownDate = new Date(targetDate).getTime();

    if (!targetDate || Number.isNaN(countDownDate)) {
      setDistance(0);
      return;
    }

    const remaining = Math.max(0, countDownDate - Date.now());
    setDistance(remaining);

    if (remaining === 0) {
      if (!expiredRef.current) {
        expiredRef.current = true;
        onExpireRef.current?.();
      }
      return;
    }

    // Reset the expiry flag for a new countdown
    expiredRef.current = false;

    const id = setInterval(() => {
      const now = Date.now();
      const rem = Math.max(0, countDownDate - now);
      setDistance(rem);

      if (rem <= 0 && !expiredRef.current) {
        expiredRef.current = true;
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

  let display = minuteSecondDisplay;

  if (days > 0) {
    display = `${days}:${timeDisplay}`;
  } else if (hours > 0) {
    display = timeDisplay;
  }

  const combined = `${styles.countdownTimer} ${className || ""}`.trim();

  return <p className={combined}>{display}</p>;
}
