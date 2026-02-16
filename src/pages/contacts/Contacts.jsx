import React from "react";
import styles from "./contacts.module.scss";

const Contacts = () => {
  const info = [
    { label: "Email", value: "hello@studio.com" },
    { label: "Phone", value: "+1 (555) 123-4567" },
    { label: "Location", value: "Remote / EU" },
  ];

  return (
    <div className={styles.main}>
      <div className={styles.panel}>
        <p className={styles.kicker}>Let&apos;s talk</p>
        <h1>Contact</h1>
        <p className={styles.subhead}>
          Tell us about your product idea, timeframe, and goals. We typically respond within one business day.
        </p>
        <div className={styles.infoGrid}>
          {info.map((item) => (
            <div key={item.label} className={styles.infoCard}>
              <span>{item.label}</span>
              <strong>{item.value}</strong>
            </div>
          ))}
        </div>
        <button className={styles.cta}>Schedule a call</button>
      </div>
    </div>
  );
};
export default Contacts;
