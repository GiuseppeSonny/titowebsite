import React, { useState } from "react";
import { Link } from "react-router-dom";
import styles from "./works.module.scss";

const OldWorks = () => {
  const [open, setOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState(0);
  
  const categories = [
    { label: "Internal works", path: "/works/internal" },
    { label: "External works", path: "/works/external" },
    { label: "Future works", path: "/works/future" },
    { label: "Old works", path: "/works/old" },
  ];

  const oldProjects = [
    {
      title: "Faded Tags",
      desc: "Early 2000s wheatpaste pieces that weathered into ghost stories on brick walls across Brooklyn.",
      tags: ["Wheatpaste", "Decay", "Archive"],
      link: "#",
      image: "https://picsum.photos/seed/fadedtags/400/300.jpg",
    },
    {
      title: "Rooftop Chronicles",
      desc: "Series of rooftop installations from 2018-2019, now documented only in polaroid and memory.",
      tags: ["Rooftop", "Installation", "Photography"],
      link: "#",
      image: "https://picsum.photos/seed/rooftopchronicles/400/300.jpg",
    },
    {
      title: "Underground Sketches",
      desc: "Subway tunnel drawings from the abandoned lines, rescued before demolition in 2017.",
      tags: ["Subway", "Drawings", "Rescue"],
      link: "#",
      image: "https://picsum.photos/seed/undergroundsketches/400/300.jpg",
    },
    {
      title: "Warehouse Sessions",
      desc: "Industrial warehouse takeover series from 2016, where concrete met canvas in raw collaboration.",
      tags: ["Warehouse", "Canvas", "Industrial"],
      link: "#",
      image: "https://picsum.photos/seed/warehousesessions/400/300.jpg",
    },
    {
      title: "Bridge Memorials",
      desc: "Temporary memorial pieces on bridge supports, documenting the city's lost voices between 2015-2017.",
      tags: ["Memorial", "Bridge", "Documentary"],
      link: "#",
      image: "https://picsum.photos/seed/bridgememorials/400/300.jpg",
    },
    {
      title: "Canal Dreams",
      desc: "Waterfront reflections painted along canal walls, washed away by tides but preserved in digital archives.",
      tags: ["Waterfront", "Temporary", "Digital"],
      link: "#",
      image: "https://picsum.photos/seed/canaldreams/400/300.jpg",
    },
  ];

  const openModal = (index) => {
    setSelectedCard(index);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  const nextCard = () => {
    setSelectedCard((prev) => (prev + 1) % oldProjects.length);
  };

  const prevCard = () => {
    setSelectedCard((prev) => (prev - 1 + oldProjects.length) % oldProjects.length);
  };

  return (
    <div className={styles.works}>
      <div className={styles.headerRow}>
        <div>
          <p className={styles.kicker}>Archive Collection</p>
          <h2>Old Works & Lost Pieces</h2>
          <p className={styles.subhead}>
            Early experiments, temporary installations, and pieces that exist now only in photographs and memory.
          </p>
        </div>
        <div className={styles.actions}>
          <button className={styles.cta}>Request archive access</button>
          <div className={`${styles.dropdown} ${open ? styles.open : ""}`}>
            <button className={styles.dropdownToggle} onClick={() => setOpen((v) => !v)}>
              Categories
              <span className={styles.chevron}>{open ? "▲" : "▼"}</span>
            </button>
            {open && (
              <div className={styles.dropdownMenu}>
                {categories.map((cat) => (
                  <Link key={cat.path} to={cat.path} onClick={() => setOpen(false)}>
                    {cat.label}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className={styles.grid}>
        {oldProjects.map((project, index) => (
          <article 
            key={project.title} 
            className={styles.card} 
            onClick={() => openModal(index)}
          >
            <div className={styles.cardImage}>
              <img src={project.image} alt={project.title} />
            </div>
            <h3>{project.title}</h3>
            <p>{project.desc}</p>
            <div className={styles.tags}>
              {project.tags.map((tag) => (
                <span key={tag} className={styles.tag}>
                  {tag}
                </span>
              ))}
            </div>
            <a href={project.link} onClick={(e) => e.stopPropagation()}>
              View Project →
            </a>
          </article>
        ))}
      </div>

      {modalOpen && (
        <div className={styles.modalOverlay} onClick={closeModal}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <button className={styles.closeButton} onClick={closeModal}>×</button>
            <div className={styles.modalContent}>
              <div className={styles.cardImage}>
                <img src={oldProjects[selectedCard].image} alt={oldProjects[selectedCard].title} />
              </div>
              <h3>{oldProjects[selectedCard].title}</h3>
              <p>{oldProjects[selectedCard].desc}</p>
              <div className={styles.tags}>
                {oldProjects[selectedCard].tags.map((tag) => (
                  <span key={tag} className={styles.tag}>
                    {tag}
                  </span>
                ))}
              </div>
              <a href={oldProjects[selectedCard].link}>
                View Project →
              </a>
            </div>
            <div className={styles.modalNavigation}>
              <button className={styles.navButton} onClick={prevCard}>
                ← Previous
              </button>
              <span className={styles.cardCounter}>
                {selectedCard + 1} / {oldProjects.length}
              </span>
              <button className={styles.navButton} onClick={nextCard}>
                Next →
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OldWorks;
