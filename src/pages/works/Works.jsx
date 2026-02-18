import React, { useState } from "react";
import { Link } from "react-router-dom";
import styles from "./works.module.scss";

const projects = [
  {
    title: "Neon Pulse",
    desc: "6-meter mural under the ring road — chrome letters pulsing with UV ink and hidden blacklight poetry.",
    tags: ["UV Ink", "Chrome", "Lettering"],
    link: "#",
  },
  {
    title: "Ghost Lines",
    desc: "Projection-mapped trains painted in motion; layers of aerosol, light, and glitchy typographic loops.",
    tags: ["Projection", "Motion", "Graffiti"],
    link: "#",
  },
  {
    title: "Concrete Bloom",
    desc: "Abandoned warehouse takeover with fluorescent flora, cut vinyl stickers, and a breathing soundbed.",
    tags: ["Fluoro", "Stickers", "Sound"],
    link: "#",
  },
];

const Works = () => {
  const [open, setOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState(0);
  const categories = [
    { label: "Internal works", path: "/works/internal" },
    { label: "External works", path: "/works/external" },
    { label: "Future works", path: "/works/future" },
  ];

  const openModal = (index) => {
    console.log('Card clicked:', index);
    alert('Card clicked: ' + index);
    setSelectedCard(index);
    setModalOpen(true);
  };

  const closeModal = () => {
    console.log('Modal closing');
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
        <div className={styles.actions}>
          <button className={styles.cta}>Request the full drop list</button>
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
        {projects.map((project, index) => (
          <article key={project.title} className={styles.card} onClick={() => openModal(index)}>
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

      {/* Debug indicator */}
      <div style={{position: 'fixed', top: '10px', right: '10px', background: 'red', color: 'white', padding: '5px', zIndex: 9999}}>
        Modal State: {modalOpen ? 'OPEN' : 'CLOSED'} | Card: {selectedCard + 1}
      </div>

      {modalOpen && (
        <div className={styles.modalOverlay} onClick={closeModal} style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.8)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
            <div className={styles.modal} onClick={(e) => e.stopPropagation()} style={{
              background: 'linear-gradient(160deg, rgba(255, 255, 255, 0.04), rgba(0, 0, 0, 0.32))',
              border: '1px solid rgba(255, 255, 255, 0.16)',
              borderRadius: '18px',
              padding: '24px',
              maxWidth: '500px',
              width: '90%',
              position: 'relative'
            }}>
              <button className={styles.closeButton} onClick={closeModal}>×</button>
              <div className={styles.modalContent}>
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
