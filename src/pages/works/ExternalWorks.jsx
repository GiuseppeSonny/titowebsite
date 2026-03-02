import React, { useState } from "react";
import styles from "./works.module.scss";
import { useData } from "../../context/DataContext";

const ExternalWorks = () => {
  const { works } = useData();
  const externalProjects = works.filter((w) => w.category === "external");
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const openModal = (project) => {
    setSelectedProject(project);
    setCurrentImageIndex(0);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedProject(null);
    setCurrentImageIndex(0);
  };

  const nextImage = () => {
    if (!selectedProject) return;
    const allImages = selectedProject.images || [];
    if (allImages.length > 0) {
      setCurrentImageIndex((prev) => (prev + 1) % allImages.length);
    }
  };

  const prevImage = () => {
    if (!selectedProject) return;
    const allImages = selectedProject.images || [];
    if (allImages.length > 0) {
      setCurrentImageIndex((prev) => (prev - 1 + allImages.length) % allImages.length);
    }
  };

  const getAllImages = (project) => {
    const images = project.images || [];
    if (project.image && !images.includes(project.image)) {
      return [project.image, ...images];
    }
    return images;
  };
  return (
    <div className={styles.main}>
      <div className={styles.headerRow}>
        <div>
          <p className={styles.kicker}>External works</p>
          <h2>Commissioned walls & public pieces</h2>
          <p className={styles.subhead}>Client and city collaborations across facades, shutters, and tunnels.</p>
        </div>
      </div>

      <div className={styles.grid}>
        {externalProjects.map((project) => (
          <article key={project.title} className={styles.card} onClick={() => openModal(project)}>
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
              <div className={styles.pill}>Commission</div>
              {project.link && (
                <a href={project.link} className={styles.link} onClick={(e) => e.stopPropagation()}>
                  View →
                </a>
              )}
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

      {modalOpen && selectedProject && (
        <div className={styles.modalOverlay} onClick={closeModal}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <button className={styles.closeButton} onClick={closeModal}>×</button>
            <div className={styles.modalContent}>
              <div className={styles.modalImage}>
                {getAllImages(selectedProject).length > 0 ? (
                  <>
                    <img 
                      src={getAllImages(selectedProject)[currentImageIndex]} 
                      alt={selectedProject.title} 
                    />
                    {getAllImages(selectedProject).length > 1 && (
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
                  <div className={styles.pill}>Commission</div>
                  {selectedProject.link && (
                    <a href={selectedProject.link} className={styles.link}>
                      View →
                    </a>
                  )}
                </div>
                <h3>{selectedProject.title}</h3>
                <p>{selectedProject.desc}</p>
                <div className={styles.tags}>
                  {selectedProject.tags.map((tag) => (
                    <span key={tag}>{tag}</span>
                  ))}
                </div>
              </div>
            </div>
            {getAllImages(selectedProject).length > 1 && (
              <div className={styles.modalNavigation}>
                <button className={styles.navButton} onClick={prevImage}>
                  ← Previous
                </button>
                <span className={styles.imageCounter}>
                  {currentImageIndex + 1} / {getAllImages(selectedProject).length}
                </span>
                <button className={styles.navButton} onClick={nextImage}>
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

export default ExternalWorks;
