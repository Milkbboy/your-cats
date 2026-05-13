import { useEffect, useRef, useState } from 'react';
import type { CSSProperties } from 'react';
import { getRandomPatReaction } from '../data/catReactions';
import { getRandomPatSpot, type PatKind } from '../data/catPatSpots';
import type { Cat } from '../data/cats';

type HomePageProps = {
  cat: Cat;
  canMeetFriend: boolean;
  onMeetFriend: () => Cat;
  onOpenCollection: () => void;
  remainingText: string;
};

type ArrivalCats = {
  oldCat: Cat;
  newCat: Cat;
};

type PatHandStyle = CSSProperties & {
  '--pat-rotate': string;
  '--pat-x': string;
  '--pat-y': string;
};

const handImageByKind: Record<PatKind, string> = {
  belly: `${import.meta.env.BASE_URL}assets/hands/hand_belly.png`,
  head: `${import.meta.env.BASE_URL}assets/hands/hand_head.png`,
  side: `${import.meta.env.BASE_URL}assets/hands/hand_side.png`,
};

function HomePage({
  cat,
  canMeetFriend,
  onMeetFriend,
  onOpenCollection,
  remainingText,
}: HomePageProps) {
  const [isPatting, setIsPatting] = useState(false);
  const [arrivalCats, setArrivalCats] = useState<ArrivalCats | null>(null);
  const [patReaction, setPatReaction] = useState(cat.quote);
  const [patSpot, setPatSpot] = useState(() => getRandomPatSpot(cat.id));
  const patTimerRef = useRef<number>();
  const shouldMeetFriendRef = useRef(false);

  useEffect(() => {
    return () => {
      if (patTimerRef.current) {
        window.clearTimeout(patTimerRef.current);
      }
    };
  }, []);

  const handlePat = () => {
    if (isPatting || arrivalCats) {
      return;
    }

    setIsPatting(true);
    setPatReaction(canMeetFriend ? '왔어.' : getRandomPatReaction(cat.id));
    setPatSpot(getRandomPatSpot(cat.id));
    shouldMeetFriendRef.current = canMeetFriend;
    patTimerRef.current = window.setTimeout(() => {
      if (shouldMeetFriendRef.current) {
        const newCat = onMeetFriend();
        setArrivalCats({ oldCat: cat, newCat });
        shouldMeetFriendRef.current = false;
      }
      setIsPatting(false);
    }, 900);
  };

  if (arrivalCats) {
    return (
      <div className="arrival-page">
        <div className="speech-bubble">새 친구가 나타났어요!</div>

        <div className="arrival-cats">
          <img
            className="arrival-cat-image"
            src={arrivalCats.oldCat.image}
            alt={`${arrivalCats.oldCat.name} 그림`}
          />
          <img
            className="arrival-cat-image"
            src={arrivalCats.newCat.image}
            alt={`${arrivalCats.newCat.name} 그림`}
          />
        </div>

        <div className="arrival-copy">
          <h2>{arrivalCats.newCat.name}</h2>
          <p>"{arrivalCats.newCat.quote}"</p>
        </div>

        <button className="primary-button" type="button" onClick={() => setArrivalCats(null)}>
          확인하기
        </button>
      </div>
    );
  }

  return (
    <div
      className={['home-page', isPatting ? 'is-patting' : ''].filter(Boolean).join(' ')}
    >
      <div className="timer-pill">다음 친구까지 {remainingText}</div>

      <article className="cat-card">
        <div className="cat-image-wrap">
          <img className="cat-image" src={cat.image} alt={`${cat.name} 그림`} />
          {isPatting && (
            <img
              className={`pat-hand ${patSpot.kind}`}
              src={handImageByKind[patSpot.kind]}
              alt=""
              aria-hidden="true"
              style={{
                '--pat-rotate': `${patSpot.rotate}deg`,
                '--pat-x': `${patSpot.x}%`,
                '--pat-y': `${patSpot.y}%`,
              } as PatHandStyle}
            />
          )}
        </div>

        <div className="cat-copy">
          <h2>{cat.name}</h2>
          <p>"{isPatting ? patReaction : cat.quote}"</p>
        </div>
      </article>

      <div className="home-actions">
        <button className="primary-button" type="button" onClick={handlePat}>
          쓰다듬기
        </button>
        <button className="secondary-button" type="button" onClick={onOpenCollection}>
          내 고양이들
        </button>
      </div>
    </div>
  );
}

export default HomePage;
