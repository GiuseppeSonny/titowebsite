import React, { useState } from "react";
import { useData } from "../context/DataContext";
import styles from "./admin.module.scss";

const EVENT_TYPES = ["exhibition", "workshop", "battle", "projection", "festival", "other"];

const emptyEvent = { title: "", location: "", type: "exhibition", date: "", endDate: "" };

const EventsManager = () => {
  const { events, addEvent, updateEvent, deleteEvent } = useData();
  const [form, setForm] = useState(emptyEvent);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      if (editingId) {
        await updateEvent(editingId, form);
      } else {
        await addEvent(form);
      }
      setForm(emptyEvent);
      setEditingId(null);
      setShowForm(false);
    } catch (err) {
      console.error(err);
      setError(err?.message || "Save failed");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (event) => {
    setForm({ ...event });
    setEditingId(event.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this event?")) return;
    await deleteEvent(id);
  };

  const handleCancel = () => {
    setForm(emptyEvent);
    setEditingId(null);
    setShowForm(false);
  };

  const sorted = [...events].sort((a, b) => new Date(a.date) - new Date(b.date));

  return (
    <div className={styles.managerSection}>
      <div className={styles.managerHeader}>
        <h2>Calendar Events</h2>
        <button className={styles.addBtn} onClick={() => { setShowForm(true); setEditingId(null); setForm(emptyEvent); }}>
          + Add Event
        </button>
      </div>

      {showForm && (
        <form className={styles.form} onSubmit={handleSubmit}>
          <h3>{editingId ? "Edit Event" : "New Event"}</h3>
          {error && <div className={styles.errorMsg}>{error}</div>}
          <div className={styles.formGrid}>
            <label>
              Title
              <input name="title" value={form.title} onChange={handleChange} required placeholder="Event title" />
            </label>
            <label>
              Start Date
              <input name="date" type="date" value={form.date} onChange={handleChange} required />
            </label>
            <label>
              End Date (optional)
              <input name="endDate" type="date" value={form.endDate || ""} onChange={handleChange} min={form.date} />
            </label>
            <label>
              Location
              <input name="location" value={form.location} onChange={handleChange} placeholder="Venue / City" />
            </label>
            <label>
              Type
              <select name="type" value={form.type} onChange={handleChange}>
                {EVENT_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </label>
          </div>
          <div className={styles.formActions}>
            <button type="submit" className={styles.saveBtn} disabled={loading}>
              {loading ? "Saving…" : editingId ? "Update" : "Add Event"}
            </button>
            <button type="button" className={styles.cancelBtn} onClick={handleCancel}>Cancel</button>
          </div>
        </form>
      )}

      <div className={styles.itemsList}>
        {sorted.length === 0 && <p className={styles.empty}>No events yet.</p>}
        {sorted.map((event) => (
          <div key={event.id} className={styles.itemCard}>
            <div className={`${styles.eventDateBlock} ${styles[event.type]}`}>
              <span className={styles.eventDayNum}>{event.date ? new Date(event.date).getUTCDate() : "—"}</span>
              <span className={styles.eventMonthStr}>{event.date ? new Date(event.date).toLocaleString("default", { month: "short" }) : ""}</span>
            </div>
            <div className={styles.itemInfo}>
              <strong>{event.title}</strong>
              <p>{event.location}</p>
              <div className={styles.eventDates}>
                {event.date && (
                  <span>
                    {new Date(event.date).toLocaleDateString()}
                    {event.endDate && event.endDate !== event.date && (
                      <> - {new Date(event.endDate).toLocaleDateString()}</>
                    )}
                  </span>
                )}
              </div>
              <span className={`${styles.typeBadge} ${styles[event.type]}`}>{event.type}</span>
            </div>
            <div className={styles.itemActions}>
              <button className={styles.editBtn} onClick={() => handleEdit(event)}>Edit</button>
              <button className={styles.deleteBtn} onClick={() => handleDelete(event.id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EventsManager;
