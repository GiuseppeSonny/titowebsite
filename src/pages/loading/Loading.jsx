import React, { useState, useEffect } from 'react';
import styles from './loading.module.scss';

const Loading = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 2;
      });
    }, 40); // 2000ms / 100 = 20ms per increment, but we increment by 2 so 40ms

    return () => clearInterval(interval);
  }, []);

  return (
    <div className={styles.loadingContainer}>
      <div className={styles.loadingContent}>
        <div className={styles.logoContainer}>
          <h1 className={styles.logoText}>TIEFFE artworks</h1>
        </div>
        
        <div className={styles.loadingBarContainer}>
          <div className={styles.loadingBar}>
            <div 
              className={styles.loadingProgress} 
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
        
        <p className={styles.loadingText}>Loading...</p>
      </div>
    </div>
  );
};

export default Loading;
