import React, { useState } from "react";
import { useData } from "../context/DataContext";
import styles from "./admin.module.scss";

const PHOTO_CATEGORIES = ["murals", "uv", "installations", "external", "internal", "other"];

const emptyPhoto = { url: "", caption: "", category: "murals" };

const PhotosManager = () => {
  const { photos, addPhoto, updatePhoto, deletePhoto } = useData();
  const [form, setForm] = useState(emptyPhoto);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [filterCat, setFilterCat] = useState("all");

  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editingId) {
        await updatePhoto(editingId, form);
      } else {
        await addPhoto(form);
      }
      setForm(emptyPhoto);
      setEditingId(null);
      setShowForm(false);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const handleEdit = (photo) => {
    setForm({ ...photo });
    setEditingId(photo.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this photo?")) return;
    await deletePhoto(id);
  };

  const handleCancel = () => {
    setForm(emptyPhoto);
    setEditingId(null);
    setShowForm(false);
  };

  const filtered = filterCat === "all" ? photos : photos.filter((p) => p.category === filterCat);

  return (
    <div className={styles.managerSection}>
      <div className={styles.managerHeader}>
        <h2>Photo Gallery</h2>
        <button className={styles.addBtn} onClick={() => { setShowForm(true); setEditingId(null); setForm(emptyPhoto); }}>
          + Add Photo
        </button>
      </div>

      <div className={styles.filterRow}>
        {["all", ...PHOTO_CATEGORIES].map((cat) => (
          <button
            key={cat}
            className={`${styles.filterBtn} ${filterCat === cat ? styles.active : ""}`}
            onClick={() => setFilterCat(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      {showForm && (
        <form className={styles.form} onSubmit={handleSubmit}>
          <h3>{editingId ? "Edit Photo" : "Add Photo"}</h3>
          <div className={styles.formGrid}>
            <label className={styles.fullWidth}>
              Image URL
              <input name="url" value={form.url} onChange={handleChange} required placeholder="https://..." />
            </label>
            <label>
              Caption
              <input name="caption" value={form.caption} onChange={handleChange} placeholder="Photo caption" />
            </label>
            <label>
              Category
              <select name="category" value={form.category} onChange={handleChange}>
                {PHOTO_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </label>
          </div>
          {form.url && (
            <div className={styles.imagePreview}>
              <img src={form.url} alt="preview" />
            </div>
          )}
          <div className={styles.formActions}>
            <button type="submit" className={styles.saveBtn} disabled={loading}>
              {loading ? "Saving…" : editingId ? "Update" : "Add Photo"}
            </button>
            <button type="button" className={styles.cancelBtn} onClick={handleCancel}>Cancel</button>
          </div>
        </form>
      )}

      <div className={styles.photoGrid}>
        {filtered.length === 0 && <p className={styles.empty}>No photos in this category.</p>}
        {filtered.map((photo) => (
          <div key={photo.id} className={styles.photoCard}>
            <img src={photo.url} alt={photo.caption} />
            <div className={styles.photoOverlay}>
              <p>{photo.caption}</p>
              <span className={styles.catBadge}>{photo.category}</span>
              <div className={styles.photoActions}>
                <button className={styles.editBtn} onClick={() => handleEdit(photo)}>Edit</button>
                <button className={styles.deleteBtn} onClick={() => handleDelete(photo.id)}>Delete</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PhotosManager;
