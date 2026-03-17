import React, { createContext, useContext, useEffect, useState } from "react";
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  onSnapshot,
  setDoc,
  getDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../firebase/firebase";

const DataContext = createContext(null);

const defaultWorks = [
  { id: "default-1", title: "Neon Pulse", desc: "6-meter mural under the ring road — chrome letters pulsing with UV ink and hidden blacklight poetry.", tags: ["UV Ink", "Chrome", "Lettering"], image: "", category: "recent", link: "#" },
  { id: "default-2", title: "Ghost Lines", desc: "Projection-mapped trains painted in motion; layers of aerosol, light, and glitchy typographic loops.", tags: ["Projection", "Motion", "Graffiti"], image: "", category: "recent", link: "#" },
  { id: "default-3", title: "Concrete Bloom", desc: "Abandoned warehouse takeover with fluorescent flora, cut vinyl stickers, and a breathing soundbed.", tags: ["Fluoro", "Stickers", "Sound"], image: "", category: "recent", link: "#" },
];

const defaultEvents = [
  { id: "default-e1", title: "Subway Bloom Opening", location: "Brooklyn Station", type: "exhibition", date: "2026-03-15", endDate: "" },
  { id: "default-e2", title: "Neon Workshop", location: "Manhattan Arts Center", type: "workshop", date: "2026-03-22", endDate: "" },
  { id: "default-e3", title: "Graffiti Battle", location: "Queens Warehouse", type: "battle", date: "2026-04-05", endDate: "" },
];

const defaultProducts = [
  { id: "default-p1", url: "", caption: "Street mural downtown", category: "murals" },
  { id: "default-p2", url: "", caption: "UV night piece", category: "uv" },
  { id: "default-p3", url: "", caption: "Rooftop installation", category: "installations" },
  { id: "default-p4", url: "", caption: "Warehouse session", category: "murals" },
  { id: "default-p5", url: "", caption: "Canal wall piece", category: "external" },
  { id: "default-p6", url: "", caption: "Studio experiments", category: "internal" },
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

const defaultHome = {
  hero: {
    logos: [],
    kicker: "Street Artist / 2026",
    title: "Stencils on concrete",
    subtitle: "that glow after dark",
    subhead: "Raw blacks, bright reds, and layered wheatpaste textures—urban stories sprayed loud across the city.",
    primaryCta: "View the stencils",
    secondaryCta: "Commission a wall",
    metrics: [
      { value: "73", label: "Murals painted" },
      { value: "18", label: "Cities tagged" },
      { value: "∞", label: "Ideas in ink" },
    ],
    currentFocus: {
      title: "Night train murals",
      description: "Neon, chrome, grit"
    },
    techStack: ["Spray", "Ink", "Light"],
    upcomingDrop: {
      title: "Subway Bloom",
      date: "Spring equinox"
    }
  },
  video: {
    url: "",
    title: "",
    enabled: false
  },
  pageHeaders: {
    works: {
      kicker: "Selected Walls",
      title: "Recent drops and takeovers",
      subhead: "Murals, projection pieces, and pop-up installs dripping with neon gradients and raw texture."
    },
    internalWorks: {
      kicker: "Internal works",
      title: "Lab pieces & experiments",
      subhead: "Studio-only explorations before they hit the streets."
    },
    externalWorks: {
      kicker: "External works",
      title: "Commissioned walls & public pieces",
      subhead: "Client and city collaborations across facades, shutters, and tunnels."
    },
    products: {
      kicker: "Gallery",
      title: "Products",
      subhead: "Pure visuals—no text, just the work."
    },
    contacts: {
      kicker: "Let's talk",
      title: "Contact",
      subhead: "Tell us about your product idea, timeframe, and goals. We typically respond within one business day."
    }
  },
  fonts: {
    heading: "'Inter', sans-serif",
    body: "'Inter', sans-serif",
    mono: "'JetBrains Mono', monospace"
  }
};

export const DataProvider = ({ children }) => {
  const [works, setWorks] = useState(defaultWorks);
  const [events, setEvents] = useState(defaultEvents);
  const [products, setProducts] = useState(defaultProducts);
  const [about, setAbout] = useState(defaultAbout);
  const [contacts, setContacts] = useState(defaultContacts);
  const [home, setHome] = useState(defaultHome);
  const [firestoreReady, setFirestoreReady] = useState(false);
  const [ready, setReady] = useState({ works: false, events: false, products: false, about: false, contacts: false, home: false });

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

    const unsubProducts = onSnapshot(
      collection(db, "products"),
      (snap) => {
        setProducts(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
        setReady((r) => ({ ...r, products: true }));
      },
      () => setReady((r) => ({ ...r, products: false }))
    );

    const unsubAbout = onSnapshot(
      doc(db, "about", "main"),
      (snap) => {
        if (snap.exists()) {
          setAbout({ id: snap.id, ...snap.data() });
        } else {
          setAbout(defaultAbout);
        }
        setReady((r) => ({ ...r, about: true }));
      },
      () => setReady((r) => ({ ...r, about: false }))
    );

    const unsubContacts = onSnapshot(
      doc(db, "contacts", "main"),
      (snap) => {
        if (snap.exists()) {
          setContacts({ id: snap.id, ...snap.data() });
        } else {
          setContacts(defaultContacts);
        }
        setReady((r) => ({ ...r, contacts: true }));
      },
      () => setReady((r) => ({ ...r, contacts: false }))
    );

    const unsubHome = onSnapshot(
      doc(db, "home", "main"),
      (snap) => {
        if (snap.exists()) {
          const data = snap.data();
          setHome(prev => ({ ...prev, ...data })); // merge with defaults to preserve missing fields
        } else {
          setHome(defaultHome);
        }
        setReady((r) => ({ ...r, home: true }));
      },
      () => setReady((r) => ({ ...r, home: false }))
    );

    setFirestoreReady(true);

    return () => {
      unsubWorks();
      unsubEvents();
      unsubProducts();
      unsubAbout();
      unsubContacts();
      unsubHome();
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

  // Products CRUD
  const addProduct = async (product) => {
    try {
      const docRef = await addDoc(collection(db, "products"), { ...product, createdAt: serverTimestamp() });
      return docRef.id;
    } catch (err) {
      console.error("addProduct failed", err);
      throw err;
    }
  };
  const updateProduct = async (id, data) => {
    try {
      await updateDoc(doc(db, "products", id), data);
    } catch (err) {
      console.error("updateProduct failed", err);
      throw err;
    }
  };
  const deleteProduct = async (id) => {
    try {
      await deleteDoc(doc(db, "products", id));
    } catch (err) {
      console.error("deleteProduct failed", err);
      throw err;
    }
  };

  // About update
  const updateAbout = async (data) => {
    try {
      await setDoc(doc(db, "about", "main"), data, { merge: true });
    } catch (err) {
      console.error("updateAbout failed", err);
      throw err;
    }
  };

  // Contacts update
  const updateContacts = async (data) => {
    try {
      await setDoc(doc(db, "contacts", "main"), data, { merge: true });
    } catch (err) {
      console.error("updateContacts failed", err);
      throw err;
    }
  };

  // Home update
  const updateHome = async (data) => {
    try {
      const homeRef = doc(db, "home", "main");
      const homeSnap = await getDoc(homeRef);
      if (!homeSnap.exists()) {
        // First time: create the document with full structure
        await setDoc(homeRef, {
          hero: {
            logos: data.hero?.logos || [],
            kicker: data.hero?.kicker || "",
            title: data.hero?.title || "",
            subtitle: data.hero?.subtitle || "",
            subhead: data.hero?.subhead || "",
            primaryCta: data.hero?.primaryCta || "",
            secondaryCta: data.hero?.secondaryCta || "",
            metrics: data.hero?.metrics || [],
            currentFocus: data.hero?.currentFocus || { title: "", description: "" },
            techStack: data.hero?.techStack || [],
            upcomingDrop: data.hero?.upcomingDrop || { title: "", date: "" },
          },
          video: data.video || { enabled: false, videos: [] },
          highlights: data.highlights || [],
        });
      } else {
        // Document exists: merge
        await setDoc(homeRef, data, { merge: true });
      }
    } catch (err) {
      console.error("updateHome failed", err);
      throw err;
    }
  };

  return (
    <DataContext.Provider value={{
      works, events, products, about, contacts, home, firestoreReady,
      addWork, updateWork, deleteWork,
      addEvent, updateEvent, deleteEvent,
      addProduct, updateProduct, deleteProduct,
      updateAbout, updateContacts, updateHome,
    }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => useContext(DataContext);
