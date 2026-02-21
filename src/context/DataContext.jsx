import React, { createContext, useContext, useEffect, useState } from "react";
import {
  collection,
  getDocs,
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

  useEffect(() => {
    const unsubWorks = onSnapshot(collection(db, "works"), (snap) => {
      if (!snap.empty) {
        setWorks(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
      }
      setFirestoreReady(true);
    }, () => setFirestoreReady(false));

    const unsubEvents = onSnapshot(collection(db, "events"), (snap) => {
      if (!snap.empty) setEvents(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    }, () => {});

    const unsubPhotos = onSnapshot(collection(db, "photos"), (snap) => {
      if (!snap.empty) setPhotos(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    }, () => {});

    const unsubAbout = onSnapshot(collection(db, "about"), (snap) => {
      if (!snap.empty) setAbout({ id: snap.docs[0].id, ...snap.docs[0].data() });
    }, () => {});

    const unsubContacts = onSnapshot(collection(db, "contacts"), (snap) => {
      if (!snap.empty) setContacts({ id: snap.docs[0].id, ...snap.docs[0].data() });
    }, () => {});

    return () => {
      unsubWorks();
      unsubEvents();
      unsubPhotos();
      unsubAbout();
      unsubContacts();
    };
  }, []);

  // Works CRUD
  const addWork = async (work) => {
    const docRef = await addDoc(collection(db, "works"), { ...work, createdAt: serverTimestamp() });
    return docRef.id;
  };
  const updateWork = async (id, data) => {
    await updateDoc(doc(db, "works", id), data);
  };
  const deleteWork = async (id) => {
    await deleteDoc(doc(db, "works", id));
  };

  // Events CRUD
  const addEvent = async (event) => {
    const docRef = await addDoc(collection(db, "events"), { ...event, createdAt: serverTimestamp() });
    return docRef.id;
  };
  const updateEvent = async (id, data) => {
    await updateDoc(doc(db, "events", id), data);
  };
  const deleteEvent = async (id) => {
    await deleteDoc(doc(db, "events", id));
  };

  // Photos CRUD
  const addPhoto = async (photo) => {
    const docRef = await addDoc(collection(db, "photos"), { ...photo, createdAt: serverTimestamp() });
    return docRef.id;
  };
  const updatePhoto = async (id, data) => {
    await updateDoc(doc(db, "photos", id), data);
  };
  const deletePhoto = async (id) => {
    await deleteDoc(doc(db, "photos", id));
  };

  // About update
  const updateAbout = async (data) => {
    if (about.id) {
      await updateDoc(doc(db, "about", about.id), data);
    } else {
      await addDoc(collection(db, "about"), data);
    }
    setAbout((prev) => ({ ...prev, ...data }));
  };

  // Contacts update
  const updateContacts = async (data) => {
    if (contacts.id) {
      await updateDoc(doc(db, "contacts", contacts.id), data);
    } else {
      await addDoc(collection(db, "contacts"), data);
    }
    setContacts((prev) => ({ ...prev, ...data }));
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
