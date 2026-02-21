import React, { createContext, useContext, useEffect, useState } from "react";
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  onSnapshot,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../firebase/firebase";

const DataContext = createContext(null);

const defaultWorks = [
  { id: "default-1", title: "Neon Pulse", desc: "6-meter mural under the ring road — chrome letters pulsing with UV ink and hidden blacklight poetry.", tags: ["UV Ink", "Chrome", "Lettering"], image: "https://picsum.photos/seed/neonpulse/400/300.jpg", category: "recent", link: "#" },
  { id: "default-2", title: "Ghost Lines", desc: "Projection-mapped trains painted in motion; layers of aerosol, light, and glitchy typographic loops.", tags: ["Projection", "Motion", "Graffiti"], image: "https://picsum.photos/seed/ghostlines/400/300.jpg", category: "recent", link: "#" },
  { id: "default-3", title: "Concrete Bloom", desc: "Abandoned warehouse takeover with fluorescent flora, cut vinyl stickers, and a breathing soundbed.", tags: ["Fluoro", "Stickers", "Sound"], image: "https://picsum.photos/seed/concretebloom/400/300.jpg", category: "recent", link: "#" },
];

const defaultEvents = [
  { id: "default-e1", title: "Subway Bloom Opening", location: "Brooklyn Station", type: "exhibition", date: "2026-03-15" },
  { id: "default-e2", title: "Neon Workshop", location: "Manhattan Arts Center", type: "workshop", date: "2026-03-22" },
  { id: "default-e3", title: "Graffiti Battle", location: "Queens Warehouse", type: "battle", date: "2026-04-05" },
];

const defaultPhotos = [
  { id: "default-p1", url: "https://picsum.photos/seed/photo1/600/400.jpg", caption: "Street mural downtown", category: "murals" },
  { id: "default-p2", url: "https://picsum.photos/seed/photo2/600/400.jpg", caption: "UV night piece", category: "uv" },
  { id: "default-p3", url: "https://picsum.photos/seed/photo3/600/400.jpg", caption: "Rooftop installation", category: "installations" },
  { id: "default-p4", url: "https://picsum.photos/seed/photo4/600/400.jpg", caption: "Warehouse session", category: "murals" },
  { id: "default-p5", url: "https://picsum.photos/seed/photo5/600/400.jpg", caption: "Canal wall piece", category: "external" },
  { id: "default-p6", url: "https://picsum.photos/seed/photo6/600/400.jpg", caption: "Studio experiments", category: "internal" },
];

const defaultAbout = {
  title: "TIEFFE artworks",
  bio: "Street artist based in Europe, working with spray, UV ink, and projection mapping to transform urban surfaces into living stories.",
  stats: [
    { label: "Murals painted", value: "73" },
    { label: "Cities tagged", value: "18" },
    { label: "Years active", value: "12" },
  ],
  skills: ["Spray paint", "UV Ink", "Stencil", "Wheatpaste", "Projection Mapping", "Lettering"],
};

const defaultContacts = {
  email: "hello@studio.com",
  phone: "+1 (555) 123-4567",
  location: "Remote / EU",
  instagram: "",
  twitter: "",
};

export const DataProvider = ({ children }) => {
  const [works, setWorks] = useState(defaultWorks);
  const [events, setEvents] = useState(defaultEvents);
  const [photos, setPhotos] = useState(defaultPhotos);
  const [about, setAbout] = useState(defaultAbout);
  const [contacts, setContacts] = useState(defaultContacts);
  const [firestoreReady, setFirestoreReady] = useState(false);
  const [ready, setReady] = useState({ works: false, events: false, photos: false, about: false, contacts: false });

  useEffect(() => {
    const unsubWorks = onSnapshot(
      collection(db, "works"),
      (snap) => {
        setWorks(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
        setReady((r) => ({ ...r, works: true }));
      },
      () => setReady((r) => ({ ...r, works: false }))
    );

    const unsubEvents = onSnapshot(
      collection(db, "events"),
      (snap) => {
        setEvents(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
        setReady((r) => ({ ...r, events: true }));
      },
      () => setReady((r) => ({ ...r, events: false }))
    );

    const unsubPhotos = onSnapshot(
      collection(db, "photos"),
      (snap) => {
        setPhotos(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
        setReady((r) => ({ ...r, photos: true }));
      },
      () => setReady((r) => ({ ...r, photos: false }))
    );

    const unsubAbout = onSnapshot(
      collection(db, "about"),
      (snap) => {
        if (snap.empty) {
          setAbout(defaultAbout);
        } else {
          setAbout({ id: snap.docs[0].id, ...snap.docs[0].data() });
        }
        setReady((r) => ({ ...r, about: true }));
      },
      () => setReady((r) => ({ ...r, about: false }))
    );

    const unsubContacts = onSnapshot(
      collection(db, "contacts"),
      (snap) => {
        if (snap.empty) {
          setContacts(defaultContacts);
        } else {
          setContacts({ id: snap.docs[0].id, ...snap.docs[0].data() });
        }
        setReady((r) => ({ ...r, contacts: true }));
      },
      () => setReady((r) => ({ ...r, contacts: false }))
    );

    setFirestoreReady(true);

    return () => {
      unsubWorks();
      unsubEvents();
      unsubPhotos();
      unsubAbout();
      unsubContacts();
    };
  }, []);

  useEffect(() => {
    const allReady = Object.values(ready).every(Boolean);
    setFirestoreReady(allReady);
  }, [ready]);

  // Works CRUD
  const addWork = async (work) => {
    try {
      const docRef = await addDoc(collection(db, "works"), { ...work, createdAt: serverTimestamp() });
      return docRef.id;
    } catch (err) {
      console.error("addWork failed", err);
      throw err;
    }
  };
  const updateWork = async (id, data) => {
    try {
      await updateDoc(doc(db, "works", id), data);
    } catch (err) {
      console.error("updateWork failed", err);
      throw err;
    }
  };
  const deleteWork = async (id) => {
    try {
      await deleteDoc(doc(db, "works", id));
    } catch (err) {
      console.error("deleteWork failed", err);
      throw err;
    }
  };

  // Events CRUD
  const addEvent = async (event) => {
    try {
      const docRef = await addDoc(collection(db, "events"), { ...event, createdAt: serverTimestamp() });
      return docRef.id;
    } catch (err) {
      console.error("addEvent failed", err);
      throw err;
    }
  };
  const updateEvent = async (id, data) => {
    try {
      await updateDoc(doc(db, "events", id), data);
    } catch (err) {
      console.error("updateEvent failed", err);
      throw err;
    }
  };
  const deleteEvent = async (id) => {
    try {
      await deleteDoc(doc(db, "events", id));
    } catch (err) {
      console.error("deleteEvent failed", err);
      throw err;
    }
  };

  // Photos CRUD
  const addPhoto = async (photo) => {
    try {
      const docRef = await addDoc(collection(db, "photos"), { ...photo, createdAt: serverTimestamp() });
      return docRef.id;
    } catch (err) {
      console.error("addPhoto failed", err);
      throw err;
    }
  };
  const updatePhoto = async (id, data) => {
    try {
      await updateDoc(doc(db, "photos", id), data);
    } catch (err) {
      console.error("updatePhoto failed", err);
      throw err;
    }
  };
  const deletePhoto = async (id) => {
    try {
      await deleteDoc(doc(db, "photos", id));
    } catch (err) {
      console.error("deletePhoto failed", err);
      throw err;
    }
  };

  // About update
  const updateAbout = async (data) => {
    try {
      if (about.id) {
        await updateDoc(doc(db, "about", about.id), data);
      } else {
        await addDoc(collection(db, "about"), data);
      }
      setAbout((prev) => ({ ...prev, ...data }));
    } catch (err) {
      console.error("updateAbout failed", err);
      throw err;
    }
  };

  // Contacts update
  const updateContacts = async (data) => {
    try {
      if (contacts.id) {
        await updateDoc(doc(db, "contacts", contacts.id), data);
      } else {
        await addDoc(collection(db, "contacts"), data);
      }
      setContacts((prev) => ({ ...prev, ...data }));
    } catch (err) {
      console.error("updateContacts failed", err);
      throw err;
    }
  };

  return (
    <DataContext.Provider value={{
      works, events, photos, about, contacts, firestoreReady,
      addWork, updateWork, deleteWork,
      addEvent, updateEvent, deleteEvent,
      addPhoto, updatePhoto, deletePhoto,
      updateAbout, updateContacts,
    }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => useContext(DataContext);
