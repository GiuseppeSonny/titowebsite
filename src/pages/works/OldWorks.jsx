import React, { useState } from "react";
import { Link } from "react-router-dom";
import styles from "./works.module.scss";
import { useData } from "../../context/DataContext";

const OldWorks = () => {
  const { works } = useData();
  const oldProjects = works.filter((w) => w.category === "old");
  const [open, setOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState(0);
  
  const categories = [
    { label: "Internal works", path: "/works/internal" },
    { label: "External works", path: "/works/external" },
    { label: "Future works", path: "/works/future" },
    { label: "Old works", path: "/works/old" },
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
