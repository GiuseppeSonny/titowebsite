import React, { useState } from "react";
import { Link } from "react-router-dom";
import styles from "./works.module.scss";
import { useData } from "../../context/DataContext";

const Works = () => {
  const { works } = useData();
  const projects = works.filter((w) => w.category === "recent" || !w.category);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState(0);

  const openModal = (index) => {
    setSelectedCard(index);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  const nextCard = () => {
    setSelectedCard((prev) => (prev + 1) % projects.length);
  };

  const prevCard = () => {
    setSelectedCard((prev) => (prev - 1 + projects.length) % projects.length);
  };

  return (
    <div className={styles.main}>
      <div className={styles.headerRow}>
        <div>
          <p className={styles.kicker}>Selected Walls</p>
          <h2>Recent drops and takeovers</h2>
          <p className={styles.subhead}>
            Murals, projection pieces, and pop-up installs dripping with neon gradients and raw texture.
          </p>
        </div>
      </div>

      <div className={styles.grid}>
        {projects.map((project, index) => (
          <article key={project.title} className={styles.card} onClick={() => openModal(index)}>
            <div className={styles.cardImage}>
              <img src={project.image} alt={project.title} />
            </div>
            <div className={styles.cardHead}>
              <div className={styles.pill}>Fresh paint</div>
              <a href={project.link} className={styles.link} onClick={(e) => e.stopPropagation()}>
                View →
              </a>
            </div>
            <h3>{project.title}</h3>
            <p>{project.desc}</p>
            <div className={styles.tags}>
              {project.tags.map((tag) => (
                <span key={tag}>{tag}</span>
              ))}
            </div>
          </article>
        ))}
      </div>

      {modalOpen && (
        <div className={styles.modalOverlay} onClick={closeModal}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <button className={styles.closeButton} onClick={closeModal}>×</button>
            <div className={styles.modalContent}>
              <div className={styles.cardImage}>
                <img src={projects[selectedCard].image} alt={projects[selectedCard].title} />
              </div>
              <div className={styles.cardHead}>
                <div className={styles.pill}>Fresh paint</div>
                <a href={projects[selectedCard].link} className={styles.link}>
                  View →
                </a>
              </div>
              <h3>{projects[selectedCard].title}</h3>
              <p>{projects[selectedCard].desc}</p>
              <div className={styles.tags}>
                {projects[selectedCard].tags.map((tag) => (
                  <span key={tag}>{tag}</span>
                ))}
              </div>
            </div>
            <div className={styles.modalNavigation}>
              <button className={styles.navButton} onClick={prevCard} disabled={projects.length <= 1}>
                ← Previous
              </button>
              <span className={styles.cardCounter}>
                {selectedCard + 1} / {projects.length}
              </span>
              <button className={styles.navButton} onClick={nextCard} disabled={projects.length <= 1}>
                Next →
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Works;
