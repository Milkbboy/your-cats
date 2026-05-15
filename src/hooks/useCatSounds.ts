import { useCallback, useEffect, useRef, useState } from 'react';

const SOUND_ENABLED_KEY = 'yourcat:sound-enabled';

type AudioWindow = Window & {
  webkitAudioContext?: typeof AudioContext;
};

const loadSoundEnabled = () => {
  try {
    const saved = window.localStorage.getItem(SOUND_ENABLED_KEY);

    return saved === null ? true : saved === 'true';
  } catch {
    return true;
  }
};

const playTone = (
  audioContext: AudioContext,
  startAt: number,
  startFrequency: number,
  endFrequency: number,
  duration: number,
  volume: number,
) => {
  const oscillator = audioContext.createOscillator();
  const gain = audioContext.createGain();

  oscillator.type = 'sine';
  oscillator.frequency.setValueAtTime(startFrequency, startAt);
  oscillator.frequency.exponentialRampToValueAtTime(endFrequency, startAt + duration);

  gain.gain.setValueAtTime(volume, startAt);
  gain.gain.exponentialRampToValueAtTime(0.001, startAt + duration);

  oscillator.connect(gain);
  gain.connect(audioContext.destination);
  oscillator.start(startAt);
  oscillator.stop(startAt + duration);
};

export const useCatSounds = () => {
  const [soundEnabled, setSoundEnabled] = useState(loadSoundEnabled);
  const audioContextRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    try {
      window.localStorage.setItem(SOUND_ENABLED_KEY, String(soundEnabled));
    } catch {
      // Sound preference is optional.
    }
  }, [soundEnabled]);

  const getAudioContext = useCallback(() => {
    if (audioContextRef.current) {
      return audioContextRef.current;
    }

    const AudioContextConstructor =
      window.AudioContext ?? (window as AudioWindow).webkitAudioContext;

    if (!AudioContextConstructor) {
      return null;
    }

    audioContextRef.current = new AudioContextConstructor();

    return audioContextRef.current;
  }, []);

  const playPatSound = useCallback(() => {
    if (!soundEnabled) {
      return;
    }

    const audioContext = getAudioContext();

    if (!audioContext) {
      return;
    }

    void audioContext.resume();
    const now = audioContext.currentTime;

    playTone(audioContext, now, 520, 260, 0.08, 0.045);
    playTone(audioContext, now + 0.035, 340, 220, 0.07, 0.025);
  }, [getAudioContext, soundEnabled]);

  const playNewFriendSound = useCallback(() => {
    if (!soundEnabled) {
      return;
    }

    const audioContext = getAudioContext();

    if (!audioContext) {
      return;
    }

    void audioContext.resume();
    const now = audioContext.currentTime;

    playTone(audioContext, now, 440, 620, 0.09, 0.045);
    playTone(audioContext, now + 0.075, 660, 880, 0.11, 0.04);
    playTone(audioContext, now + 0.16, 760, 540, 0.12, 0.032);
  }, [getAudioContext, soundEnabled]);

  const toggleSoundEnabled = useCallback(() => {
    setSoundEnabled((enabled) => !enabled);
  }, []);

  return {
    soundEnabled,
    playPatSound,
    playNewFriendSound,
    toggleSoundEnabled,
  };
};
