import { useEffect, useState } from "react";

// Props:
// - minutes (number): how many minutes to count down from (default 20)
// - onExpire (function): optional callback fired when timer reaches 0

export default function Timer({ minutes = 20, onExpire } = {}) {
  const initialSeconds = Math.max(0, Number(minutes) || 0) * 60;
  const [secondsLeft, setSecondsLeft] = useState(initialSeconds);

  useEffect(() => {
    // If the `minutes` prop changes, reset the timer
    setSecondsLeft(Math.max(0, Number(minutes) || 0) * 60);

    const id = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          // When reaching zero, stop the interval and call onExpire once
          clearInterval(id);
          if (onExpire) onExpire();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(id);
  }, [minutes, onExpire]);

  const mins = Math.floor(secondsLeft / 60);
  const secs = secondsLeft % 60;

  return (
    <p id="countdownTimer">
      {mins}:{secs}
    </p>
  );
}
