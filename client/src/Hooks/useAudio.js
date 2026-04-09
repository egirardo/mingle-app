import { useCallback, useRef, useEffect } from "react";
import beepSound from "../assets/audio/beep.mp3";

/** Unlocks Web Audio autoplay by playing a silent audio on first user interaction. **/
export function useUnlockAudio() {
  useEffect(() => {
    const unlockAudio = () => {
      const context = new (window.AudioContext || window.webkitAudioContext)();
      if (context.state === "suspended") {
        context.resume();
      }

      const emptyBuffer = context.createBuffer(1, 1, 22050);
      const source = context.createBufferSource();
      source.buffer = emptyBuffer;
      source.connect(context.destination);
      source.onended = () => context.close(); // Close context after playback
      source.start(0);

      document.removeEventListener("click", unlockAudio);
    };

    document.addEventListener("click", unlockAudio, { once: true });

    return () => {
      document.removeEventListener("click", unlockAudio);
    };
  }, []);
}

/** Hook for playing audio files with preloading and autoplay handling.
    Pass the audio file as an import and optional onPlaybackBlocked callback. **/
export function usePlaySound(audioFile, onPlaybackBlocked) {
  const audioRef = useRef(null);
  const isPlayingRef = useRef(false);

  // Preload audio element once
  useEffect(() => {
    const audio = new Audio(audioFile);
    audio.preload = "auto";
    audioRef.current = audio;
  }, [audioFile]);

  const play = useCallback(() => {
    if (!audioRef.current || isPlayingRef.current) return;

    const audio = audioRef.current;
    audio.currentTime = 0;
    isPlayingRef.current = true;
    audio.onended = () => (isPlayingRef.current = false);

    audio.play().catch((err) => {
      if (err.name !== "AbortError") {
        if (err.name === "NotAllowedError") {
          console.warn(
            "Audio playback blocked by autoplay policy. User interaction required.",
          );
          onPlaybackBlocked?.();
        } else {
          console.error("Failed to play sound:", err);
        }
        isPlayingRef.current = false;
      }
    });
  }, [audioFile, onPlaybackBlocked]);

  return play;
}

/** Playing beep sounds. **/
export function usePlayBeep() {
  return usePlaySound(beepSound);
}
