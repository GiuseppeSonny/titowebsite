import React, { useState } from "react";
import { doc, setDoc, deleteDoc, getDoc, collection, getDocs } from "firebase/firestore";
import { db } from "../firebase/firebase";
import { useAuth } from "../context/AuthContext";
import styles from "./admin.module.scss";

const AdminsManager = () => {
  const { user: currentUser } = useAuth();
  const [admins, setAdmins] = useState([]);
  const [newEmail, setNewEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const fetchAdmins = async () => {
    const snap = await getDocs(collection(db, "admins"));
    const list = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    setAdmins(list);
  };

  React.useEffect(() => {
    fetchAdmins();
  }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!newEmail.trim()) return;
    setLoading(true);
    setMessage("");
    try {
      // For simplicity, we use email as doc ID; you could also look up UID via auth if needed
      const docId = newEmail.trim().toLowerCase();
      const ref = doc(db, "admins", docId);
      await setDoc(ref, { email: newEmail.trim(), addedBy: currentUser.email, addedAt: new Date().toISOString() });
      setNewEmail("");
      setMessage("Admin added.");
      fetchAdmins();
    } catch (err) {
      console.error(err);
      setMessage("Failed to add admin.");
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (docId) => {
    if (!window.confirm("Remove this admin?")) return;
    try {
      await deleteDoc(doc(db, "admins", docId));
      setMessage("Admin removed.");
      fetchAdmins();
    } catch (err) {
      console.error(err);
      setMessage("Failed to remove admin.");
    }
  };

  return (
    <div className={styles.managerSection}>
      <div className={styles.managerHeader}>
        <h2>Admins</h2>
      </div>

      <form className={styles.form} onSubmit={handleAdd}>
        <div className={styles.formGrid}>
          <label className={styles.fullWidth}>
            Email to add as admin
            <input
              type="email"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              placeholder="co-manager@example.com"
              required
            />
          </label>
        </div>
        <div className={styles.formActions}>
          <button type="submit" className={styles.saveBtn} disabled={loading}>
            {loading ? "Adding…" : "Add Admin"}
          </button>
        </div>
        {message && <div className={styles.errorMsg}>{message}</div>}
      </form>

      <div className={styles.itemsList}>
        {admins.map((admin) => (
          <div key={admin.id} className={styles.itemCard}>
            <div className={styles.itemInfo}>
              <strong>{admin.email}</strong>
              <p>Added by {admin.addedBy}</p>
            </div>
            <div className={styles.itemActions}>
              <button className={styles.deleteBtn} onClick={() => handleRemove(admin.id)}>
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminsManager;
