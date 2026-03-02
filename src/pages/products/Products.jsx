import React, { useState } from "react";
import styles from "./Products.module.scss";
import { useData } from "../../context/DataContext";

const Products = () => {
  const { products } = useData();
  const [selectedIndex, setSelectedIndex] = useState(null);

  // Safety check - ensure products is an array
  const productsArray = Array.isArray(products) ? products : [];

  const openCarousel = (index) => setSelectedIndex(index);
  const closeCarousel = () => setSelectedIndex(null);

  const next = () => {
    setSelectedIndex((prev) => (prev + 1) % productsArray.length);
  };

  const prev = () => {
    setSelectedIndex((prev) => (prev - 1 + productsArray.length) % productsArray.length);
  };

  const handleKeyDown = (e) => {
    if (selectedIndex === null) return;
    if (e.key === "Escape") closeCarousel();
    if (e.key === "ArrowRight") next();
    if (e.key === "ArrowLeft") prev();
  };

  return (
    <div className={styles.products} onKeyDown={handleKeyDown} tabIndex={0}>
      <header className={styles.header}>
        <p className={styles.kicker}>Gallery</p>
        <h1>Products</h1>
        <p className={styles.subhead}>Pure visuals—no text, just the work.</p>
      </header>

      <div className={styles.grid}>
        {productsArray.map((product, index) => (
          <div
            key={product.id}
            className={styles.thumb}
            onClick={() => openCarousel(index)}
          >
            {product.url ? (
              <img src={product.url} alt="" loading="lazy" />
            ) : (
              <div className={styles.placeholderImage}>
                <div className={styles.placeholderIcon}>📷</div>
                <span>No Image</span>
              </div>
            )}
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
              {productsArray[selectedIndex].url ? (
                <img src={productsArray[selectedIndex].url} alt="" />
              ) : (
                <div className={styles.placeholderImage}>
                  <div className={styles.placeholderIcon}>📷</div>
                  <span>No Image</span>
                </div>
              )}
            </div>
            {productsArray[selectedIndex].caption && (
              <div className={styles.carouselCaption}>
                <p>{productsArray[selectedIndex].caption}</p>
                {productsArray[selectedIndex].category && (
                  <span className={styles.carouselCategory}>
                    {productsArray[selectedIndex].category}
                  </span>
                )}
              </div>
            )}
            <button className={styles.navPrev} onClick={prev} aria-label="Previous">
              ‹
            </button>
            <button className={styles.navNext} onClick={next} aria-label="Next">
              ›
            </button>
            <div className={styles.counter}>
              {selectedIndex + 1} / {productsArray.length}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Products;
