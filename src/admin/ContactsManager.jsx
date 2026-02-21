import React, { useState, useEffect } from "react";
import { useData } from "../context/DataContext";
import styles from "./admin.module.scss";

const ContactsManager = () => {
  const { contacts, updateContacts } = useData();
  const [form, setForm] = useState({ email: "", phone: "", location: "", instagram: "", twitter: "" });
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setForm({
      email: contacts.email || "",
      phone: contacts.phone || "",
      location: contacts.location || "",
      instagram: contacts.instagram || "",
      twitter: contacts.twitter || "",
    });
  }, [contacts]);

  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await updateContacts(form);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (err) {
      console.error(err);
      setError(err?.message || "Save failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.managerSection}>
      <div className={styles.managerHeader}>
        <h2>Contact Info</h2>
      </div>

      <form className={styles.form} onSubmit={handleSubmit}>
        {error && <div className={styles.errorMsg}>{error}</div>}
        <div className={styles.formGrid}>
          <label>
            Email
            <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="hello@studio.com" />
          </label>
          <label>
            Phone
            <input name="phone" value={form.phone} onChange={handleChange} placeholder="+1 (555) 123-4567" />
          </label>
          <label>
            Location
            <input name="location" value={form.location} onChange={handleChange} placeholder="Remote / EU" />
          </label>
          <label>
            Instagram
            <input name="instagram" value={form.instagram} onChange={handleChange} placeholder="@handle" />
          </label>
          <label>
            Twitter / X
            <input name="twitter" value={form.twitter} onChange={handleChange} placeholder="@handle" />
          </label>
        </div>
        <div className={styles.formActions}>
          <button type="submit" className={styles.saveBtn} disabled={loading}>
            {loading ? "Saving…" : saved ? "Saved ✓" : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ContactsManager;
