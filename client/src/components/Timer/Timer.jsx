import { useEffect, useState } from "react";

// Props:
// - minutes (number): how many minutes to count down from (default 20)
// - onExpire (function): optional callback fired when timer reaches 0

export default function Timer({
  minutes = 20,
  onExpire,
  autoRestart = false, } = {}) {
  const initialSeconds = Math.max(0, Number(minutes) || 0) * 60;
  const [secondsLeft, setSecondsLeft] = useState(initialSeconds);

  useEffect(() => {
    setSecondsLeft(Math.max(0, Number(minutes) || 0) * 60);

    const id = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          if (onExpire) onExpire();
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
  }, [minutes, onExpire, autoRestart]);

  const mins = Math.floor(secondsLeft / 60);
  const secs = String(secondsLeft % 60).padStart(2, "0");

  return (
    <p id="countdownTimer">
      {mins}:{secs}
    </p>
  );
}
