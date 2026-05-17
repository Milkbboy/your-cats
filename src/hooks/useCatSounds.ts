import { useCallback, useEffect, useRef, useState } from 'react';

const SOUND_ENABLED_KEY = 'yourcat:sound-enabled';
const SOUND_VOLUME_KEY = 'yourcat:sound-volume';
const DEFAULT_SOUND_VOLUME = 1;

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

const loadSoundVolume = () => {
  try {
    const saved = window.localStorage.getItem(SOUND_VOLUME_KEY);
    const parsedVolume = saved === null ? DEFAULT_SOUND_VOLUME : Number(saved);

    if (Number.isFinite(parsedVolume)) {
      return Math.min(1, Math.max(0, parsedVolume));
    }
  } catch {
    // Fall back to default below.
  }

  return DEFAULT_SOUND_VOLUME;
};

const playTone = (
  audioContext: AudioContext,
  startAt: number,
  startFrequency: number,
  endFrequency: number,
  duration: number,
  volume: number,
  type: OscillatorType = 'triangle',
) => {
  const oscillator = audioContext.createOscillator();
  const gain = audioContext.createGain();

  oscillator.type = type;
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
  const [soundVolume, setSoundVolumeState] = useState(loadSoundVolume);
  const audioContextRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    try {
      window.localStorage.setItem(SOUND_ENABLED_KEY, String(soundEnabled));
    } catch {
      // Sound preference is optional.
    }
  }, [soundEnabled]);

  useEffect(() => {
    try {
      window.localStorage.setItem(SOUND_VOLUME_KEY, String(soundVolume));
    } catch {
      // Sound preference is optional.
    }
  }, [soundVolume]);

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

  const resumeAudioContext = useCallback(async () => {
    const audioContext = getAudioContext();

    if (!audioContext) {
      return null;
    }

    if (audioContext.state === 'suspended') {
      await audioContext.resume();
    }

    return audioContext;
  }, [getAudioContext]);

  const playPatSound = useCallback(async () => {
    if (!soundEnabled || soundVolume <= 0) {
      return;
    }

    const audioContext = await resumeAudioContext();

    if (!audioContext) {
      return;
    }

    const now = audioContext.currentTime + 0.01;

    playTone(audioContext, now, 620, 300, 0.11, 0.16 * soundVolume);
    playTone(audioContext, now + 0.045, 420, 240, 0.09, 0.1 * soundVolume);
  }, [resumeAudioContext, soundEnabled, soundVolume]);

  const playNewFriendSound = useCallback(async () => {
    if (!soundEnabled || soundVolume <= 0) {
      return;
    }

    const audioContext = await resumeAudioContext();

    if (!audioContext) {
      return;
    }

    const now = audioContext.currentTime + 0.01;

    playTone(audioContext, now, 440, 660, 0.1, 0.14 * soundVolume);
    playTone(audioContext, now + 0.08, 700, 980, 0.12, 0.13 * soundVolume);
    playTone(audioContext, now + 0.18, 820, 560, 0.14, 0.095 * soundVolume, 'sine');
  }, [resumeAudioContext, soundEnabled, soundVolume]);

  const toggleSoundEnabled = useCallback(() => {
    setSoundEnabled((enabled) => !enabled);
  }, []);

  const setSoundVolume = useCallback((volume: number) => {
    setSoundVolumeState(Math.min(1, Math.max(0, volume)));
  }, []);

  return {
    soundEnabled,
    soundVolume,
    playPatSound,
    playNewFriendSound,
    setSoundVolume,
    toggleSoundEnabled,
  };
};
