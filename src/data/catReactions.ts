import { catReactionProfiles } from './catReactionProfiles';

export const catPatReactions: Record<string, string[]> = {
  cat_01: ['...', '좋은듯', '방금 뭐였지'],
  cat_02: ['잘래...', '손 따뜻함', '5분만...'],
  cat_03: ['흥', '아직 화났어', '조금만 더'],
  cat_04: ['안 풀렸어', '그래도 됨', '흥...'],
  cat_05: ['더 해줘', '심심했어', '오'],
  cat_06: ['밥 줘', '손 말고 밥', '꼬르륵'],
  cat_07: ['헤헤', '좋다냥', '또 해줘'],
  cat_08: ['헉', '깜짝이야', '뭐야?!'],
  cat_09: ['보고 있다', '계속 해봐', '기록 중'],
  cat_10: ['귀찮은데 좋음', '그만... 아니 더', '누워서 받을게'],
  cat_11: ['에헤이', '화분도 만져줘', '나 안그랬어'],
  cat_12: ['배도 해줘', '간식?', '흐물'],
  cat_13: ['하지마', '조금만', '봐줬다'],
  cat_14: ['냥냥~', '나 예뻐?', '더더'],
  cat_15: ['털 눌렸어', '뽀송 유지중', '살살'],
  cat_16: ['삐약 아님', '작게 해줘', '따뜻해'],
  cat_17: ['차갑지?', '녹는 중', '손 시려워?'],
  cat_18: ['안보이지', '들켰다', '이불 덮어줘'],
  cat_19: ['하아암', '졸려짐', '입 닫는 중'],
  cat_20: ['무중력 쓰담', '별 만지는 느낌', '우주 좋음'],
  cat_21: ['통과했어', '나 만져져?', '스르륵'],
  cat_22: ['비늘 조심', '헤엄칠래', '물고기 아님'],
  cat_23: ['삐약', '날개도 해줘', '고양이 맞음'],
  cat_24: ['?', '아직 비밀', '못 본 척해'],
};

export type TimeMood = 'dawn' | 'morning' | 'lunch' | 'afternoon' | 'evening' | 'night';
export type PatKind = 'head' | 'side' | 'belly';

const timeMoodReactions: Record<TimeMood, string[]> = {
  dawn: ['지금 이 시간에?', '잠이나 자...', '너도 못 자?', '새벽 쓰담은 좀 귀함'],
  morning: ['일어났어?', '눈도 못 떴는데...', '아침부터 쓰다듬기냐'],
  lunch: ['점심 뭐 먹어?', '내 밥은?', '너만 먹지 마'],
  afternoon: ['졸린 시간이다', '집중 안 되지?', '나도 아무것도 하기 싫음'],
  evening: ['오늘 고생했음', '저녁 먹었어?', '이제 좀 누워도 됨'],
  night: ['잘 준비해', '오늘도 왔네', '불 끄고 쓰다듬어'],
};

const catTimeMoodReactions: Partial<Record<string, Partial<Record<TimeMood, string[]>>>> = {
  cat_02: {
    dawn: ['이 시간엔 자야지...', '나도 자고 있었는데', '새벽엔 5분만 더'],
    morning: ['아침 싫어...', '눈 못 떴어', '깨우지 마...'],
  },
  cat_03: {
    morning: ['아침부터 건드리지 마', '나 아직 기분 안 좋음'],
    night: ['밤이라고 안 화난 거 아님', '졸린데 화남'],
  },
  cat_06: {
    lunch: ['점심 뭐 먹어?', '내 밥은?', '너만 먹냐'],
    evening: ['저녁 먹었어? 나는?', '밥 시간 아님?'],
  },
  cat_10: {
    afternoon: ['오후는 원래 누워있는 시간임', '지금 아무것도 하기 싫음'],
    night: ['잘 거면 같이 누워', '밤엔 더 귀찮음'],
  },
  cat_19: {
    dawn: ['하아암... 지금?', '새벽엔 하품도 작게 함'],
    afternoon: ['딱 졸린 시간', '낮잠 각'],
  },
  cat_21: {
    dawn: ['새벽엔 내가 좀 선명함', '이 시간엔 나도 돌아다님'],
    night: ['밤에는 내가 주인공', '불 끄면 더 잘 보임'],
  },
  cat_23: {
    morning: ['아침 삐약 아님', '해 뜨면 좀 병아리 같음'],
    lunch: ['점심에 모이 먹는 거 아님', '고양이 밥 줘'],
  },
};

const getTimeMood = (date: Date): TimeMood => {
  const hour = date.getHours();

  if (hour < 6) {
    return 'dawn';
  }

  if (hour < 11) {
    return 'morning';
  }

  if (hour < 14) {
    return 'lunch';
  }

  if (hour < 18) {
    return 'afternoon';
  }

  if (hour < 22) {
    return 'evening';
  }

  return 'night';
};

const recentReactionByCatId = new Map<string, string[]>();

const rememberReaction = (catId: string, reaction: string) => {
  const recentReactions = recentReactionByCatId.get(catId) ?? [];

  recentReactionByCatId.set(catId, [reaction, ...recentReactions].slice(0, 8));
};

const pickRandom = (reactions: string[], catId?: string) => {
  const recentReactions = catId ? recentReactionByCatId.get(catId) ?? [] : [];
  const availableReactions = reactions.filter((reaction) => !recentReactions.includes(reaction));
  const candidates = availableReactions.length > 0 ? availableReactions : reactions;
  const index = Math.floor(Math.random() * candidates.length);

  return candidates[index];
};

const withPossibleSuffix = (reaction: string, suffixes: string[]) => {
  if (suffixes.length === 0 || Math.random() > 0.38) {
    return reaction;
  }

  const suffix = pickRandom(suffixes);

  if (!suffix || reaction.endsWith(suffix)) {
    return reaction;
  }

  return `${reaction}${suffix}`;
};

const getProfileReaction = (catId: string, timeMood: TimeMood, patKind?: PatKind) => {
  const profile = catReactionProfiles[catId];

  if (!profile) {
    return null;
  }

  const roll = Math.random();
  let reactions = profile.base;

  if (roll < 0.06) {
    reactions = profile.rare;
  } else if (roll < 0.36 && patKind) {
    reactions = profile.bySpot[patKind];
  } else if (roll < 0.68) {
    reactions = profile.byTime[timeMood] ?? timeMoodReactions[timeMood];
  }

  const reaction = pickRandom(reactions, catId);

  return withPossibleSuffix(reaction, profile.suffixes);
};

export const getRandomPatReaction = (catId: string, date = new Date(), patKind?: PatKind) => {
  const timeMood = getTimeMood(date);
  const profileReaction = getProfileReaction(catId, timeMood, patKind);

  if (profileReaction) {
    rememberReaction(catId, profileReaction);

    return profileReaction;
  }

  const shouldUseTimeMood = Math.random() < 0.4;
  const reaction = shouldUseTimeMood
    ? pickRandom(catTimeMoodReactions[catId]?.[timeMood] ?? timeMoodReactions[timeMood], catId)
    : pickRandom(catPatReactions[catId] ?? ['좋은듯'], catId);

  rememberReaction(catId, reaction);

  return reaction;
};
