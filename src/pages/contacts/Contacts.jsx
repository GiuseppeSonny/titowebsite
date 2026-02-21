import React from "react";
import styles from "./contacts.module.scss";
import { useData } from "../../context/DataContext";

const Contacts = () => {
  const { contacts } = useData();

  const info = [
    { label: "Email", value: contacts.email },
    { label: "Phone", value: contacts.phone },
    { label: "Location", value: contacts.location },
  ].filter((item) => item.value);

  const socials = [
    contacts.instagram && { label: "Instagram", value: contacts.instagram },
    contacts.twitter && { label: "Twitter / X", value: contacts.twitter },
  ].filter(Boolean);

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
          {socials.map((item) => (
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
