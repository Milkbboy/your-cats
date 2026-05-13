import { useMemo, useRef, useState } from 'react';
import type { PointerEvent } from 'react';
import { getCatById, type Cat } from '../data/cats';

type CollectionPageProps = {
  collectedCatIds: string[];
  metDatesByCatId: Record<string, number>;
};

const TOTAL_CAT_COUNT = 24;
const SWIPE_THRESHOLD = 44;

const formatMetDate = (timestamp?: number) => {
  if (!timestamp) {
    return '언젠가 만남';
  }

  const date = new Date(timestamp);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}.${month}.${day} 만남`;
};

function CollectionPage({ collectedCatIds, metDatesByCatId }: CollectionPageProps) {
  const collectedCats = useMemo<Cat[]>(
    () =>
      collectedCatIds.flatMap((catId) => {
        const cat = getCatById(catId);

        return cat ? [cat] : [];
      }),
    [collectedCatIds],
  );
  const [activeIndex, setActiveIndex] = useState(0);
  const dragStartXRef = useRef<number | null>(null);
  const activeCat = collectedCats[activeIndex];

  const showPreviousCat = () => {
    if (collectedCats.length <= 1) {
      return;
    }

    setActiveIndex((index) => (index === 0 ? collectedCats.length - 1 : index - 1));
  };

  const showNextCat = () => {
    if (collectedCats.length <= 1) {
      return;
    }

    setActiveIndex((index) => (index + 1) % collectedCats.length);
  };

  const handlePointerDown = (event: PointerEvent<HTMLDivElement>) => {
    dragStartXRef.current = event.clientX;
  };

  const handlePointerUp = (event: PointerEvent<HTMLDivElement>) => {
    if (dragStartXRef.current === null) {
      return;
    }

    const distance = event.clientX - dragStartXRef.current;
    dragStartXRef.current = null;

    if (Math.abs(distance) < SWIPE_THRESHOLD) {
      return;
    }

    if (distance < 0) {
      showNextCat();
      return;
    }

    showPreviousCat();
  };

  if (!activeCat) {
    return (
      <div className="plain-panel">
        <h2>아직 없음</h2>
        <p>"텅"</p>
      </div>
    );
  }

  return (
    <div className="collection-page">
      <p className="collection-count">
        {collectedCats.length} / {TOTAL_CAT_COUNT}
      </p>

      <div
        className="collection-slider"
        aria-label="내 고양이들"
        onPointerDown={handlePointerDown}
        onPointerLeave={() => {
          dragStartXRef.current = null;
        }}
        onPointerUp={handlePointerUp}
      >
        <div
          className="collection-track"
          style={{
            transform: `translateX(calc(15% - ${activeIndex * 70}% - ${activeIndex * 12}px))`,
          }}
        >
          {collectedCats.map((cat, index) => (
            <article
              className={index === activeIndex ? 'collection-card active' : 'collection-card'}
              key={cat.id}
            >
              <div className="collection-image-wrap">
                <img className="collection-image" src={cat.image} alt={`${cat.name} 그림`} />
              </div>

              <h2>{cat.name}</h2>
              <p>{formatMetDate(metDatesByCatId[cat.id])}</p>
            </article>
          ))}
        </div>
      </div>

      <div className="collection-actions">
        <button className="secondary-button" type="button" onClick={showPreviousCat}>
          이전 고양이
        </button>
        <button className="secondary-button" type="button" onClick={showNextCat}>
          다음 고양이
        </button>
      </div>
    </div>
  );
}

export default CollectionPage;
