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

      // Also create and play a silent audio to unlock playback
      const emptyBuffer = context.createBuffer(1, 1, 22050);
      const source = context.createBufferSource();
      source.buffer = emptyBuffer;
      source.connect(context.destination);
      source.start(0);

      // Remove listener after first interaction
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
    if (!audioRef.current) {
      const audio = new Audio(audioFile);
      audio.preload = "auto";
      audioRef.current = audio;
    }
  }, [audioFile]);

  const play = useCallback(() => {
    if (!audioRef.current || isPlayingRef.current) return;

    const audio = audioRef.current;
    audio.currentTime = 0; // Reset to start
    isPlayingRef.current = true;

    const playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          // Audio playing successfully
        })
        .catch((err) => {
          if (err.name === "NotAllowedError") {
            console.warn(
              "Audio playback blocked by autoplay policy. User interaction required.",
            );
            // Notify parent component of blocked playback
            onPlaybackBlocked?.();
          } else if (err.name !== "AbortError") {
            // AbortError is expected when audio is interrupted
            console.error("Failed to play sound:", err);
          }
        })
        .finally(() => {
          isPlayingRef.current = false;
        });
    } else {
      // For older browsers that don't return a promise
      isPlayingRef.current = false;
    }
  }, [audioFile, onPlaybackBlocked]);

  return play;
}

/** Playing beep sounds. **/
export function usePlayBeep() {
  return usePlaySound(beepSound);
}
