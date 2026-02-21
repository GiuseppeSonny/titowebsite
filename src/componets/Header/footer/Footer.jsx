import React from "react";
import styles from "./footer.module.scss";

const Footer = () => {
  return (
    <div className={styles.footer}>
      <p>© 2026 Tieffe Art. All rights reserved.</p>
      <div className={styles.graffitiSplash}></div>
    </div>
  );
};

export default Footer;
