import React, { useState } from "react";
import styles from "./Photos.module.scss";
import { useData } from "../../context/DataContext";

const Photos = () => {
  const { photos } = useData();
  const [selectedIndex, setSelectedIndex] = useState(null);

  const openCarousel = (index) => setSelectedIndex(index);
  const closeCarousel = () => setSelectedIndex(null);

  const next = () => {
    setSelectedIndex((prev) => (prev + 1) % photos.length);
  };

  const prev = () => {
    setSelectedIndex((prev) => (prev - 1 + photos.length) % photos.length);
  };

  const handleKeyDown = (e) => {
    if (selectedIndex === null) return;
    if (e.key === "Escape") closeCarousel();
    if (e.key === "ArrowRight") next();
    if (e.key === "ArrowLeft") prev();
  };

  return (
    <div className={styles.photos} onKeyDown={handleKeyDown} tabIndex={0}>
      <header className={styles.header}>
        <p className={styles.kicker}>Gallery</p>
        <h1>Photos</h1>
        <p className={styles.subhead}>Pure visuals—no text, just the work.</p>
      </header>

      <div className={styles.grid}>
        {photos.map((photo, index) => (
          <div
            key={photo.id}
            className={styles.thumb}
            onClick={() => openCarousel(index)}
          >
            <img src={photo.url} alt="" loading="lazy" />
          </div>
        ))}
      </div>

      {selectedIndex !== null && (
        <div className={styles.carouselOverlay} onClick={closeCarousel}>
          <div className={styles.carousel} onClick={(e) => e.stopPropagation()}>
            <button className={styles.close} onClick={closeCarousel} aria-label="Close">
              ×
            </button>
            <div className={styles.carouselImage}>
              <img src={photos[selectedIndex].url} alt="" />
            </div>
            <button className={styles.navPrev} onClick={prev} aria-label="Previous">
              ‹
            </button>
            <button className={styles.navNext} onClick={next} aria-label="Next">
              ›
            </button>
            <div className={styles.counter}>
              {selectedIndex + 1} / {photos.length}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Photos;
