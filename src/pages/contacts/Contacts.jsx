import React from "react";
import styles from "./contacts.module.scss";
import { useData } from "../../context/DataContext";

const Contacts = () => {
  const { contacts, home, firestoreReady } = useData();

  const info = [
    { label: "Email", value: contacts.email },
    { label: "Phone", value: contacts.phone },
    { label: "Location", value: contacts.location },
  ].filter((item) => item.value);

  const socials = [
    contacts.instagram && { label: "Instagram", value: contacts.instagram },
    contacts.twitter && { label: "Twitter / X", value: contacts.twitter },
  ].filter(Boolean);

  if (!firestoreReady) {
    return (
      <div className={styles.main} style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
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
    <div className={styles.main}>
      <div className={styles.panel}>
        <p className={styles.kicker}>{home.pageHeaders?.contacts?.kicker || "Let's talk"}</p>
        <h1>{home.pageHeaders?.contacts?.title || "Contact"}</h1>
        <p className={styles.subhead}>
          {home.pageHeaders?.contacts?.subhead || "Tell us about your product idea, timeframe, and goals. We typically respond within one business day."}
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
