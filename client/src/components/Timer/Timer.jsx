import styles from "./Timer.module.css";
import { useEffect, useState, useRef } from "react";

// Props:
// - minutes (number): how many minutes to count down from (default 20)
// - onExpire (function): optional callback fired when timer reaches 0

export default function Timer({
  minutes = 20,
  onExpire,
  autoRestart = false,
  className,
} = {}) {
  const initialSeconds = Math.max(0, Number(minutes) || 0) * 60;
  const [secondsLeft, setSecondsLeft] = useState(initialSeconds);
  const expiredRef = useRef(false);
  const onExpireRef = useRef(onExpire);

  useEffect(() => {
    onExpireRef.current = onExpire;
  }, [onExpire]);

  useEffect(() => {
    setSecondsLeft(Math.max(0, Number(minutes) || 0) * 60);
    expiredRef.current = false;

    const id = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          expiredRef.current = true;
          if (autoRestart) {
            return Math.max(0, Number(minutes) || 0) * 60;
          }
          clearInterval(id);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(id);
  }, [minutes, autoRestart]);

  useEffect(() => {
    if (expiredRef.current) {
      expiredRef.current = false;
      if (onExpireRef.current) onExpireRef.current();
    }
  }, [secondsLeft]);

  const mins = String(Math.floor(secondsLeft / 60)).padStart(2, "0");
  const secs = String(secondsLeft % 60).padStart(2, "0");

  const combined = `${styles.countdownTimer} ${className || ""}`.trim();

  return (
    <p className={combined}>
      {mins}:{secs}
    </p>
  );
}
