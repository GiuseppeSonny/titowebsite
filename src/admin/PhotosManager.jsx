import React, { useState, useRef } from "react";
import { useData } from "../context/DataContext";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../firebase/firebase";
import styles from "./admin.module.scss";

const PHOTO_CATEGORIES = ["murals", "uv", "installations", "external", "internal", "other"];

const emptyPhoto = { url: "", caption: "", category: "murals", link: "", workId: "" };

const PhotosManager = () => {
  const { photos, addPhoto, updatePhoto, deletePhoto, works } = useData();
  const [form, setForm] = useState(emptyPhoto);
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
            const storageRef = ref(storage, `photos/${Date.now()}-${file.name}`);
            try {
              await uploadBytes(storageRef, blob);
              const publicUrl = await getDownloadURL(storageRef);
              setForm((f) => ({ ...f, url: publicUrl }));
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
    try {
      if (editingId) {
        await updatePhoto(editingId, form);
      } else {
        await addPhoto(form);
      }
      setForm(emptyPhoto);
      setEditingId(null);
      setShowForm(false);
      setFilePreview(null);
      setError("");
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (err) {
      console.error(err);
      setError(err?.message || "Save failed");
    } finally {
      setLoading(false);
    }
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
    setFilePreview(null);
    setError("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const filtered = filterCat === "all" ? photos : photos.filter((p) => p.category === filterCat);

  return (
    <div className={styles.managerSection}>
      <div className={styles.managerHeader}>
        <h2>Photo Gallery</h2>
        <button className={styles.addBtn} onClick={() => { setShowForm(true); setEditingId(null); setForm(emptyPhoto); setFilePreview(null); setError(""); if (fileInputRef.current) fileInputRef.current.value = ""; }}>
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
          {error && <div className={styles.errorMsg}>{error}</div>}
          <div className={styles.formGrid}>
            <label className={styles.fullWidth}>
              Image URL
              <input name="url" value={form.url} onChange={handleChange} placeholder="https://..." />
            </label>
            <label className={styles.fullWidth}>
              Or upload from your computer
              <input type="file" accept="image/*" ref={fileInputRef} onChange={handleFileSelect} style={{ display: "none" }} />
              <button type="button" className={styles.saveBtn} onClick={triggerFileSelect} disabled={uploadingFile}>
                {uploadingFile ? "Uploading…" : "Choose file"}
              </button>
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
            <label>
              Custom Link (optional)
              <input name="link" value={form.link} onChange={handleChange} placeholder="https://example.com" />
            </label>
            <label>
              Link to Work (optional)
              <select name="workId" value={form.workId} onChange={handleChange}>
                <option value="">None</option>
                {works.map((work) => (
                  <option key={work.id} value={work.id}>
                    {work.title} ({work.category})
                  </option>
                ))}
              </select>
            </label>
          </div>
          {(form.url || filePreview) && (
            <div className={styles.imagePreview}>
              <img src={filePreview || form.url} alt="preview" />
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
