import React, { useState, useEffect, useRef } from "react";
import styles from "./footer.module.scss";

const Footer = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const footerRef = useRef(null);
  const sprayPointsRef = useRef([]);
  const animationFrameRef = useRef(null);

  const handleMouseMove = (e) => {
    if (!footerRef.current) return;
    
    const rect = footerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    setMousePosition({ x, y });
    
    // Add multiple spray points for realistic effect
    for (let i = 0; i < 3; i++) {
      setTimeout(() => {
        sprayPointsRef.current.push({
          x: x + (Math.random() - 0.5) * 20,
          y: y + (Math.random() - 0.5) * 20,
          id: Date.now() + Math.random(),
          opacity: 0.6 + Math.random() * 0.4,
          size: 4 + Math.random() * 8
        });
      }, i * 50);
    }
    
    // Keep only recent spray points
    if (sprayPointsRef.current.length > 50) {
      sprayPointsRef.current = sprayPointsRef.current.slice(-50);
    }
  };

  const handleMouseEnter = () => {
    setIsHovering(true);
    sprayPointsRef.current = [];
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
    setTimeout(() => {
      sprayPointsRef.current = [];
    }, 2000);
  };

  // Clean up old spray points
  useEffect(() => {
    const cleanup = () => {
      const now = Date.now();
      sprayPointsRef.current = sprayPointsRef.current.filter(
        point => now - point.id < 2000
      );
    };

    if (isHovering) {
      const interval = setInterval(cleanup, 100);
      return () => clearInterval(interval);
    }
  }, [isHovering]);

  return (
    <div 
      ref={footerRef}
      className={`${styles.footer} ${isHovering ? styles.spraying : ''}`}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <p>© 2026 Tieffe Art. All rights reserved.</p>
      <div className={styles.graffitiSplash}></div>
      
      {/* Enhanced spray can cursor */}
      {isHovering && (
        <div 
          className={styles.sprayCursor}
          style={{
            left: `${mousePosition.x}px`,
            top: `${mousePosition.y}px`
          }}
        >
          <div className={styles.sprayCan}></div>
          <div className={styles.sprayMist}></div>
        </div>
      )}
      
      {/* Enhanced spray paint drops */}
      {sprayPointsRef.current.map((point) => (
        <div
          key={point.id}
          className={styles.sprayDrop}
          style={{
            left: `${point.x}px`,
            top: `${point.y}px`,
            opacity: point.opacity,
            width: `${point.size}px`,
            height: `${point.size}px`
          }}
        />
      ))}
    </div>
  );
};

export default Footer;
