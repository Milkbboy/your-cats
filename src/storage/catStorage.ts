import { cats } from '../data/cats';

const STORAGE_KEY = 'yourcat:mvp-state';
export const FOUR_HOURS_MS = 4 * 60 * 60 * 1000;

export type CatAppState = {
  currentCatId: string;
  collectedCatIds: string[];
  metDatesByCatId: Record<string, number>;
  nextFriendAt: number;
};

const createInitialState = (): CatAppState => {
  const firstCatId = cats[0].id;

  return {
    currentCatId: firstCatId,
    collectedCatIds: [firstCatId],
    metDatesByCatId: {
      [firstCatId]: Date.now(),
    },
    nextFriendAt: Date.now() + FOUR_HOURS_MS,
  };
};

const isValidState = (value: unknown): value is CatAppState => {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const state = value as Partial<CatAppState>;

  return (
    typeof state.currentCatId === 'string' &&
    Array.isArray(state.collectedCatIds) &&
    state.collectedCatIds.every((id) => typeof id === 'string') &&
    typeof state.nextFriendAt === 'number'
  );
};

const migrateState = (state: CatAppState): CatAppState => {
  const now = Date.now();
  const metDatesByCatId = state.collectedCatIds.reduce<Record<string, number>>((dates, catId) => {
    dates[catId] = state.metDatesByCatId?.[catId] ?? now;
    return dates;
  }, {});

  return {
    ...state,
    metDatesByCatId,
  };
};

export const loadCatAppState = (): CatAppState => {
  try {
    const saved = window.localStorage.getItem(STORAGE_KEY);

    if (!saved) {
      const initialState = createInitialState();
      saveCatAppState(initialState);
      return initialState;
    }

    const parsed = JSON.parse(saved);

    if (isValidState(parsed)) {
      const migratedState = migrateState(parsed);
      saveCatAppState(migratedState);
      return migratedState;
    }
  } catch {
    // Broken localStorage should not break the miniapp.
  }

  const initialState = createInitialState();
  saveCatAppState(initialState);
  return initialState;
};

export const saveCatAppState = (state: CatAppState) => {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
};

export const resetNextFriendTimer = (state: CatAppState): CatAppState => {
  const nextState = {
    ...state,
    nextFriendAt: Date.now() + FOUR_HOURS_MS,
  };

  saveCatAppState(nextState);
  return nextState;
};

const pickRandomCatId = (catIds: string[]) => {
  const index = Math.floor(Math.random() * catIds.length);

  return catIds[index];
};

export const meetNextCat = (state: CatAppState): CatAppState => {
  const uncollectedCatIds = cats
    .map((cat) => cat.id)
    .filter((catId) => !state.collectedCatIds.includes(catId));
  const nextCatId = pickRandomCatId(
    uncollectedCatIds.length > 0 ? uncollectedCatIds : cats.map((cat) => cat.id),
  );
  const collectedCatIds = state.collectedCatIds.includes(nextCatId)
    ? state.collectedCatIds
    : [...state.collectedCatIds, nextCatId];
  const nextState = {
    currentCatId: nextCatId,
    collectedCatIds,
    metDatesByCatId: {
      ...state.metDatesByCatId,
      [nextCatId]: state.metDatesByCatId[nextCatId] ?? Date.now(),
    },
    nextFriendAt: Date.now() + FOUR_HOURS_MS,
  };

  saveCatAppState(nextState);
  return nextState;
};

export const makeFriendReady = (state: CatAppState): CatAppState => {
  const nextState = {
    ...state,
    nextFriendAt: Date.now(),
  };

  saveCatAppState(nextState);
  return nextState;
};
