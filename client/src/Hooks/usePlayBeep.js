import { useCallback } from "react";
import beepSound from "../assets/audio/beep.mp3";

export function usePlayBeep() {
  const playBeep = useCallback(() => {
    const audio = new Audio(beepSound);
    audio.play().catch((err) => console.error("Failed to play beep:", err));
  }, []);

  return playBeep;
}
