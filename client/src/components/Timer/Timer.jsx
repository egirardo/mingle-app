import styles from "./Timer.module.css";
import { useEffect, useState, useRef } from "react";

// Props:
// - minutes (number): how many minutes to count down from (default 20)
// - onExpire (function): optional callback fired when timer reaches 0
// - autoRestart (boolean): restart timer when it reaches 0

export default function Timer({
  minutes = 20,
  onExpire,
  autoRestart = false,
  className,
} = {}) {
  const durationMs = Math.max(0, Number(minutes) || 0) * 60 * 1000;
  const [secondsLeft, setSecondsLeft] = useState(Math.ceil(durationMs / 1000));
  const endAtRef = useRef(Date.now() + durationMs);
  const expiredRef = useRef(false);
  const onExpireRef = useRef(onExpire);

  useEffect(() => {
    onExpireRef.current = onExpire;
  }, [onExpire]);

  useEffect(() => {
    endAtRef.current = Date.now() + durationMs;
    setSecondsLeft(Math.ceil(durationMs / 1000));
    expiredRef.current = false;

    const tick = () => {
      const remainingMs = endAtRef.current - Date.now();

      if (remainingMs <= 0) {
        if (!expiredRef.current) {
          expiredRef.current = true;

          if (autoRestart && durationMs > 0) {
            endAtRef.current = Date.now() + durationMs;
            setSecondsLeft(Math.ceil(durationMs / 1000));
            setTimeout(() => onExpireRef.current?.(), 0);
            return;
          }

          setSecondsLeft(0);
          setTimeout(() => onExpireRef.current?.(), 0);
        }
        return;
      }

      setSecondsLeft(Math.ceil(remainingMs / 1000));
    };

    tick();

    const id = setInterval(tick, 250);

    const handleVisibilityChange = () => tick();
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      clearInterval(id);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [durationMs, autoRestart]);

  const mins = String(Math.floor(secondsLeft / 60)).padStart(2, "0");
  const secs = String(secondsLeft % 60).padStart(2, "0");

  const combined = `${styles.countdownTimer} ${className || ""}`.trim();

  return (
    <p className={combined}>
      {mins}:{secs}
    </p>
  );
}
