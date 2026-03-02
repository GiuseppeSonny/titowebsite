import React, { useState } from "react";
import { Link } from "react-router-dom";
import styles from "./works.module.scss";
import { useData } from "../../context/DataContext";

const Works = () => {
  const { works } = useData();
  const projects = works.filter((w) => !w.category || w.category === "internal" || w.category === "external");
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState(0);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const getAllImages = (project) => {
    const images = project.images || [];
    if (project.image && !images.includes(project.image)) {
      return [project.image, ...images];
    }
    return images;
  };

  const openModal = (index) => {
    setSelectedCard(index);
    setCurrentImageIndex(0);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setCurrentImageIndex(0);
  };

  const nextImage = () => {
    if (!projects[selectedCard]) return;
    const allImages = getAllImages(projects[selectedCard]);
    if (allImages.length > 0) {
      setCurrentImageIndex((prev) => (prev + 1) % allImages.length);
    }
  };

  const prevImage = () => {
    if (!projects[selectedCard]) return;
    const allImages = getAllImages(projects[selectedCard]);
    if (allImages.length > 0) {
      setCurrentImageIndex((prev) => (prev - 1 + allImages.length) % allImages.length);
    }
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
              {project.image || (project.images && project.images.length > 0) ? (
                <img src={project.image || project.images[0]} alt={project.title} />
              ) : (
                <div className={styles.placeholderImage}>
                  <div className={styles.placeholderIcon}>🖼</div>
                  <span>No Image</span>
                </div>
              )}
              {project.images && project.images.length > 1 && (
                <div className={styles.imageCount}>
                  +{project.images.length}
                </div>
              )}
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
              <div className={styles.modalImage}>
                {getAllImages(projects[selectedCard]).length > 0 ? (
                  <>
                    <img 
                      src={getAllImages(projects[selectedCard])[currentImageIndex]} 
                      alt={projects[selectedCard].title} 
                    />
                    {getAllImages(projects[selectedCard]).length > 1 && (
                      <>
                        <button className={styles.prevButton} onClick={prevImage}>‹</button>
                        <button className={styles.nextButton} onClick={nextImage}>›</button>
                      </>
                    )}
                  </>
                ) : (
                  <div className={styles.placeholderImage}>
                    <div className={styles.placeholderIcon}>🖼</div>
                    <span>No Image</span>
                  </div>
                )}
              </div>
              <div className={styles.modalInfo}>
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
            </div>
            {getAllImages(projects[selectedCard]).length > 1 ? (
              <div className={styles.modalNavigation}>
                <button className={styles.navButton} onClick={prevImage} disabled={getAllImages(projects[selectedCard]).length <= 1}>
                  ← Previous
                </button>
                <span className={styles.imageCounter}>
                  {currentImageIndex + 1} / {getAllImages(projects[selectedCard]).length}
                </span>
                <button className={styles.navButton} onClick={nextImage} disabled={getAllImages(projects[selectedCard]).length <= 1}>
                  Next →
                </button>
              </div>
            ) : (
              <div className={styles.modalNavigation}>
                <span className={styles.imageCounter}>
                  {selectedCard + 1} / {projects.length}
                </span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Works;
