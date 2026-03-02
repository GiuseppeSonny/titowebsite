import React, { useState } from "react";
import { Link } from "react-router-dom";
import styles from "./works.module.scss";
import { useData } from "../../context/DataContext";

const OldWorks = () => {
  const { works } = useData();
  const oldProjects = works.filter((w) => w.category === "old");
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
    if (!oldProjects[selectedCard]) return;
    const allImages = getAllImages(oldProjects[selectedCard]);
    if (allImages.length > 0) {
      setCurrentImageIndex((prev) => (prev + 1) % allImages.length);
    }
  };

  const prevImage = () => {
    if (!oldProjects[selectedCard]) return;
    const allImages = getAllImages(oldProjects[selectedCard]);
    if (allImages.length > 0) {
      setCurrentImageIndex((prev) => (prev - 1 + allImages.length) % allImages.length);
    }
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
      </div>

      <div className={styles.grid}>
        {oldProjects.map((project, index) => (
          <article 
            key={project.title} 
            className={styles.card} 
            onClick={() => openModal(index)}
          >
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
              <div className={styles.modalImage}>
                {getAllImages(oldProjects[selectedCard]).length > 0 ? (
                  <>
                    <img 
                      src={getAllImages(oldProjects[selectedCard])[currentImageIndex]} 
                      alt={oldProjects[selectedCard].title} 
                    />
                    {getAllImages(oldProjects[selectedCard]).length > 1 && (
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
            {getAllImages(oldProjects[selectedCard]).length > 1 ? (
              <div className={styles.modalNavigation}>
                <button className={styles.navButton} onClick={prevImage}>
                  ← Previous
                </button>
                <span className={styles.imageCounter}>
                  {currentImageIndex + 1} / {getAllImages(oldProjects[selectedCard]).length}
                </span>
                <button className={styles.navButton} onClick={nextImage}>
                  Next →
                </button>
              </div>
            ) : (
              <div className={styles.modalNavigation}>
                <button className={styles.navButton} onClick={prevCard}>
                  ← Previous
                </button>
                <span className={styles.imageCounter}>
                  {selectedCard + 1} / {oldProjects.length}
                </span>
                <button className={styles.navButton} onClick={nextCard}>
                  Next →
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default OldWorks;
