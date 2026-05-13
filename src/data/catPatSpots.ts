export type PatKind = 'head' | 'side' | 'belly';

export type PatSpot = {
  kind: PatKind;
  x: number;
  y: number;
  rotate: number;
};

const head = (x: number, y: number, rotate: number): PatSpot => ({
  kind: 'head',
  x,
  y,
  rotate,
});
const side = (x: number, y: number, rotate: number): PatSpot => ({
  kind: 'side',
  x,
  y,
  rotate,
});
const belly = (x: number, y: number, rotate: number): PatSpot => ({
  kind: 'belly',
  x,
  y,
  rotate,
});

const defaultPatSpots: PatSpot[] = [
  head(55, 24, -16),
  side(62, 38, -8),
  belly(48, 46, -18),
];

export const catPatSpots: Record<string, PatSpot[]> = {
  cat_01: [head(52, 20, -16), side(62, 37, -8), belly(47, 45, -17)],
  cat_02: [head(48, 30, -18), side(61, 40, -8), belly(52, 48, -14)],
  cat_03: [head(51, 19, -18), side(62, 35, -8), belly(46, 43, -20)],
  cat_04: [head(52, 19, -17), side(61, 34, -9), belly(47, 43, -20)],
  cat_05: [head(47, 34, -18), side(63, 42, -8), belly(55, 50, -14)],
  cat_06: [head(49, 19, -18), side(58, 35, -9), belly(44, 43, -20)],
  cat_07: [head(52, 21, -17), side(63, 35, -8), belly(48, 44, -18)],
  cat_08: [head(50, 18, -16), side(60, 35, -8), belly(46, 43, -20)],
  cat_09: [head(51, 22, -17), side(63, 38, -8), belly(43, 45, -20)],
  cat_10: [head(47, 34, -18), side(64, 41, -8), belly(55, 49, -14)],
  cat_11: [head(51, 20, -18), side(63, 34, -8), belly(45, 43, -20)],
  cat_12: [head(50, 24, -17), side(62, 41, -8), belly(45, 51, -17)],
  cat_13: [head(50, 21, -18), side(62, 35, -8), belly(45, 44, -20)],
  cat_14: [head(49, 24, -16), side(61, 36, -8), belly(46, 46, -20)],
  cat_15: [head(50, 28, -18), side(62, 38, -8), belly(43, 48, -20)],
  cat_16: [head(52, 20, -17), side(62, 35, -8), belly(45, 43, -20)],
  cat_17: [head(51, 20, -17), side(62, 36, -8), belly(45, 44, -20)],
  cat_18: [head(52, 36, -17), side(63, 48, -8), belly(45, 55, -19)],
  cat_19: [head(50, 23, -18), side(62, 36, -8), belly(44, 45, -20)],
  cat_20: [head(51, 25, -16), side(61, 39, -8), belly(45, 47, -20)],
  cat_21: [head(49, 27, -16), side(59, 41, -8), belly(43, 49, -20)],
  cat_22: [head(45, 26, -20), side(63, 39, -8), belly(52, 49, -14)],
  cat_23: [head(49, 25, -17), side(60, 39, -8), belly(45, 48, -20)],
  cat_24: [head(51, 22, -17), side(62, 39, -8), belly(45, 47, -20)],
};

export const getRandomPatSpot = (catId: string) => {
  const spots = catPatSpots[catId] ?? defaultPatSpots;
  const index = Math.floor(Math.random() * spots.length);

  return spots[index];
};
