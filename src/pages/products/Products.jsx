import React, { useState } from "react";
import styles from "./Products.module.scss";
import { useData } from "../../context/DataContext";

const Products = () => {
  const { products, home, firestoreReady } = useData();
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

  if (!firestoreReady) {
    return (
      <div className={styles.products} style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center', opacity: 0.6 }}>
          <div style={{ 
            width: 40, 
            height: 40, 
            border: '3px solid rgba(255,255,255,0.2)', 
            borderTopColor: '#fff', 
            borderRadius: '50%', 
            animation: 'spin 1s linear infinite',
            margin: '0 auto 16px'
          }} />
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.products} onKeyDown={handleKeyDown} tabIndex={0}>
      <header className={styles.header}>
        <p className={styles.kicker}>{home.pageHeaders?.products?.kicker || "Gallery"}</p>
        <h1>{home.pageHeaders?.products?.title || "Products"}</h1>
        <p className={styles.subhead}>{home.pageHeaders?.products?.subhead || "Pure visuals—no text, just the work."}</p>
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
