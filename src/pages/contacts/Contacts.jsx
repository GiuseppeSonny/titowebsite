import React, { useState, useRef } from "react";
import emailjs from "@emailjs/browser";
import styles from "./contacts.module.scss";
import { useData } from "../../context/DataContext";

const EMAILJS_SERVICE_ID = "service_tieffe";
const EMAILJS_TEMPLATE_ID = "template_contact";
const EMAILJS_PUBLIC_KEY = "YOUR_PUBLIC_KEY";

const Contacts = () => {
  const { contacts, home, firestoreReady } = useData();
  const formRef = useRef();
  const [formData, setFormData] = useState({
    from_name: "",
    from_email: "",
    subject: "",
    message: "",
  });
  const [sending, setSending] = useState(false);
  const [status, setStatus] = useState({ type: "", message: "" });
  const [showForm, setShowForm] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSending(true);
    setStatus({ type: "", message: "" });

    try {
      await emailjs.sendForm(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        formRef.current,
        EMAILJS_PUBLIC_KEY
      );
      setStatus({ type: "success", message: "Message sent successfully!" });
      setFormData({ from_name: "", from_email: "", subject: "", message: "" });
      setTimeout(() => setShowForm(false), 2000);
    } catch (error) {
      console.error("EmailJS error:", error);
      setStatus({ type: "error", message: "Failed to send message. Please try again." });
    } finally {
      setSending(false);
    }
  };

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
        <button className={styles.cta} onClick={() => setShowForm(true)}>Contact Us</button>

        {showForm && (
          <div className={styles.formOverlay} onClick={() => setShowForm(false)}>
            <form ref={formRef} className={styles.contactForm} onSubmit={handleSubmit} onClick={(e) => e.stopPropagation()}>
              <button type="button" className={styles.closeForm} onClick={() => setShowForm(false)}>×</button>
              <h2>Send us a message</h2>
              
              <input type="hidden" name="to_email" value="tieffeartwork@gmail.com" />
              
              <div className={styles.formGroup}>
                <label htmlFor="from_name">Your Name</label>
                <input
                  type="text"
                  id="from_name"
                  name="from_name"
                  value={formData.from_name}
                  onChange={handleChange}
                  required
                  placeholder="John Doe"
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="from_email">Your Email</label>
                <input
                  type="email"
                  id="from_email"
                  name="from_email"
                  value={formData.from_email}
                  onChange={handleChange}
                  required
                  placeholder="john@example.com"
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="subject">Subject</label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  placeholder="Project inquiry"
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="message">Message</label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={5}
                  placeholder="Tell us about your project..."
                />
              </div>

              {status.message && (
                <div className={`${styles.statusMessage} ${styles[status.type]}`}>
                  {status.message}
                </div>
              )}

              <button type="submit" className={styles.submitBtn} disabled={sending}>
                {sending ? "Sending..." : "Send Message"}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
export default Contacts;
