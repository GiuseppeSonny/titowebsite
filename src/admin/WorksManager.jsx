import React, { useState, useRef } from "react";
import { useData } from "../context/DataContext";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../firebase/firebase";
import styles from "./admin.module.scss";

const CATEGORIES = ["recent", "internal", "external", "future", "old"];

const makeEmptyWork = (category = "recent") => ({ title: "", desc: "", tags: "", image: "", link: "#", category });

const WorksManager = () => {
  const { works, addWork, updateWork, deleteWork } = useData();
  const [form, setForm] = useState(makeEmptyWork());
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [filterCat, setFilterCat] = useState("all");
  const [uploadingFile, setUploadingFile] = useState(false);
  const [filePreview, setFilePreview] = useState(null);
  const fileInputRef = useRef(null);

  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleFileSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setError("Please select an image file.");
      return;
    }
    // Simple client-side resize to max 1200px width/height and moderate quality
    const reader = new FileReader();
    reader.onload = async (event) => {
      const img = new Image();
      img.onload = async () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        let { width, height } = img;
        const max = 1200;
        if (width > max || height > max) {
          if (width > height) {
            height = (height / width) * max;
            width = max;
          } else {
            width = (width / height) * max;
            height = max;
          }
        }
        canvas.width = width;
        canvas.height = height;
        ctx.drawImage(img, 0, 0, width, height);
        canvas.toBlob(
          async (blob) => {
            if (!blob) {
              setError("Failed to process image.");
              return;
            }
            setUploadingFile(true);
            setError("");
            const storageRef = ref(storage, `works/${Date.now()}-${file.name}`);
            try {
              await uploadBytes(storageRef, blob);
              const publicUrl = await getDownloadURL(storageRef);
              setForm((f) => ({ ...f, image: publicUrl }));
              setFilePreview(publicUrl);
            } catch (err) {
              console.error("Upload error:", err);
              setError("Upload failed. Try using the URL field instead.");
            } finally {
              setUploadingFile(false);
            }
          },
          "image/jpeg",
          0.85
        );
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  };

  const triggerFileSelect = () => fileInputRef.current?.click();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const payload = {
      ...form,
      tags: typeof form.tags === "string" ? form.tags.split(",").map((t) => t.trim()).filter(Boolean) : form.tags,
    };
    try {
      if (editingId) {
        await updateWork(editingId, payload);
      } else {
        await addWork(payload);
      }
      setForm(makeEmptyWork(filterCat === "all" ? "recent" : filterCat));
      setEditingId(null);
      setShowForm(false);
    } catch (err) {
      console.error(err);
      setError(err?.message || "Save failed");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (work) => {
    setForm({ ...work, tags: Array.isArray(work.tags) ? work.tags.join(", ") : work.tags });
    setEditingId(work.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this work?")) return;
    await deleteWork(id);
  };

  const handleCancel = () => {
    setForm(makeEmptyWork(filterCat === "all" ? "recent" : filterCat));
    setEditingId(null);
    setShowForm(false);
    setFilePreview(null);
    setError("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const filtered = filterCat === "all" ? works : works.filter((w) => w.category === filterCat);

  return (
    <div className={styles.managerSection}>
      <div className={styles.managerHeader}>
        <h2>Works</h2>
        <button className={styles.addBtn} onClick={() => { setShowForm(true); setEditingId(null); setForm(makeEmptyWork(filterCat === "all" ? "recent" : filterCat)); setFilePreview(null); setError(""); if (fileInputRef.current) fileInputRef.current.value = ""; }}>
          + Add Work
        </button>
      </div>

      <div className={styles.filterRow}>
        {["all", ...CATEGORIES].map((cat) => (
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
          <h3>{editingId ? "Edit Work" : "New Work"}</h3>
          {error && <div className={styles.errorMsg}>{error}</div>}
          <div className={styles.formGrid}>
            <label>
              Title
              <input name="title" value={form.title} onChange={handleChange} required placeholder="Work title" />
            </label>
            <label>
              Category
              <select name="category" value={form.category} onChange={handleChange}>
                {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </label>
            <label className={styles.fullWidth}>
              Description
              <textarea name="desc" value={form.desc} onChange={handleChange} rows={3} placeholder="Description" />
            </label>
            <label>
              Image URL
              <input name="image" value={form.image} onChange={handleChange} placeholder="https://..." />
            </label>
            <label className={styles.fullWidth}>
              Or upload from your computer
              <input type="file" accept="image/*" ref={fileInputRef} onChange={handleFileSelect} style={{ display: "none" }} />
              <button type="button" className={styles.saveBtn} onClick={triggerFileSelect} disabled={uploadingFile}>
                {uploadingFile ? "Uploading…" : "Choose file"}
              </button>
            </label>
            <label>
              Link
              <input name="link" value={form.link} onChange={handleChange} placeholder="https://..." />
            </label>
            <label className={styles.fullWidth}>
              Tags (comma separated)
              <input name="tags" value={form.tags} onChange={handleChange} placeholder="Tag1, Tag2, Tag3" />
            </label>
          </div>
          {(form.image || filePreview) && (
            <div className={styles.imagePreview}>
              <img src={filePreview || form.image} alt="preview" />
            </div>
          )}
          <div className={styles.formActions}>
            <button type="submit" className={styles.saveBtn} disabled={loading}>
              {loading ? "Saving…" : editingId ? "Update" : "Add Work"}
            </button>
            <button type="button" className={styles.cancelBtn} onClick={handleCancel}>Cancel</button>
          </div>
        </form>
      )}

      <div className={styles.itemsList}>
        {filtered.length === 0 && <p className={styles.empty}>No works in this category.</p>}
        {filtered.map((work) => (
          <div key={work.id} className={styles.itemCard}>
            {work.image && <img src={work.image} alt={work.title} className={styles.itemThumb} />}
            <div className={styles.itemInfo}>
              <strong>{work.title}</strong>
              <span className={styles.catBadge}>{work.category}</span>
              <p>{work.desc}</p>
              <div className={styles.tagList}>
                {(Array.isArray(work.tags) ? work.tags : []).map((t) => <span key={t}>{t}</span>)}
              </div>
            </div>
            <div className={styles.itemActions}>
              <button className={styles.editBtn} onClick={() => handleEdit(work)}>Edit</button>
              <button className={styles.deleteBtn} onClick={() => handleDelete(work.id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WorksManager;
