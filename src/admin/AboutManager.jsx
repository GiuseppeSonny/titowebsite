import React, { useState, useEffect } from "react";
import { useData } from "../context/DataContext";
import styles from "./admin.module.scss";

const AboutManager = () => {
  const { about, updateAbout } = useData();
  const [form, setForm] = useState({ title: "", bio: "", skills: "", stats: [] });
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setForm({
      title: about.title || "",
      bio: about.bio || "",
      skills: Array.isArray(about.skills) ? about.skills.join(", ") : about.skills || "",
      stats: about.stats || [],
    });
  }, [about]);

  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleStatChange = (index, field, value) => {
    setForm((f) => {
      const stats = [...f.stats];
      stats[index] = { ...stats[index], [field]: value };
      return { ...f, stats };
    });
  };

  const addStat = () => setForm((f) => ({ ...f, stats: [...f.stats, { label: "", value: "" }] }));
  const removeStat = (index) => setForm((f) => ({ ...f, stats: f.stats.filter((_, i) => i !== index) }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await updateAbout({
        ...form,
        skills: typeof form.skills === "string" ? form.skills.split(",").map((s) => s.trim()).filter(Boolean) : form.skills,
      });
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
        <h2>About Page</h2>
      </div>

      <form className={styles.form} onSubmit={handleSubmit}>
        {error && <div className={styles.errorMsg}>{error}</div>}
        <div className={styles.formGrid}>
          <label className={styles.fullWidth}>
            Artist / Studio Name
            <input name="title" value={form.title} onChange={handleChange} placeholder="Name" />
          </label>
          <label className={styles.fullWidth}>
            Bio
            <textarea name="bio" value={form.bio} onChange={handleChange} rows={5} placeholder="Artist biography..." />
          </label>
          <label className={styles.fullWidth}>
            Skills (comma separated)
            <input name="skills" value={form.skills} onChange={handleChange} placeholder="Spray paint, UV Ink, Stencil..." />
          </label>
        </div>

        <div className={styles.statsSection}>
          <div className={styles.statsSectionHeader}>
            <h4>Stats</h4>
            <button type="button" className={styles.addBtn} onClick={addStat}>+ Add Stat</button>
          </div>
          {form.stats.map((stat, i) => (
            <div key={i} className={styles.statRow}>
              <input
                placeholder="Value (e.g. 73)"
                value={stat.value}
                onChange={(e) => handleStatChange(i, "value", e.target.value)}
              />
              <input
                placeholder="Label (e.g. Murals painted)"
                value={stat.label}
                onChange={(e) => handleStatChange(i, "label", e.target.value)}
              />
              <button type="button" className={styles.deleteBtn} onClick={() => removeStat(i)}>✕</button>
            </div>
          ))}
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

export default AboutManager;
