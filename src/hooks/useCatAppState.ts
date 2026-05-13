import { useEffect, useMemo, useState } from 'react';
import { cats, getCatById, type Cat } from '../data/cats';
import {
  loadCatAppState,
  makeFriendReady,
  meetNextCat,
  type CatAppState,
} from '../storage/catStorage';

const formatRemainingTime = (milliseconds: number) => {
  if (milliseconds <= 0) {
    return '친구 올 시간';
  }

  const totalSeconds = Math.floor(milliseconds / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return [hours, minutes, seconds].map((part) => String(part).padStart(2, '0')).join(':');
};

export const useCatAppState = () => {
  const [appState, setAppState] = useState<CatAppState>(() => loadCatAppState());
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setNow(Date.now());
    }, 1000);

    return () => window.clearInterval(intervalId);
  }, []);

  const currentCat = useMemo(
    () => getCatById(appState.currentCatId) ?? cats[0],
    [appState.currentCatId],
  );
  const remainingMs = appState.nextFriendAt - now;
  const canMeetFriend = remainingMs <= 0;

  const meetFriend = (): Cat => {
    const nextState = meetNextCat(appState);
    setAppState(nextState);
    setNow(Date.now());

    return getCatById(nextState.currentCatId) ?? cats[0];
  };

  const readyFriend = () => {
    setAppState((state) => makeFriendReady(state));
    setNow(Date.now());
  };

  return {
    appState,
    currentCat,
    canMeetFriend,
    meetFriend,
    readyFriend,
    remainingText: formatRemainingTime(remainingMs),
  };
};
