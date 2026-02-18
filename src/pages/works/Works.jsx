import React, { useState } from "react";
import { Link } from "react-router-dom";
import styles from "./works.module.scss";

const projects = [
  {
    title: "Neon Pulse",
    desc: "6-meter mural under the ring road — chrome letters pulsing with UV ink and hidden blacklight poetry.",
    tags: ["UV Ink", "Chrome", "Lettering"],
    link: "#",
    image: "https://picsum.photos/seed/neonpulse/400/300.jpg",
  },
  {
    title: "Ghost Lines",
    desc: "Projection-mapped trains painted in motion; layers of aerosol, light, and glitchy typographic loops.",
    tags: ["Projection", "Motion", "Graffiti"],
    link: "#",
    image: "https://picsum.photos/seed/ghostlines/400/300.jpg",
  },
  {
    title: "Concrete Bloom",
    desc: "Abandoned warehouse takeover with fluorescent flora, cut vinyl stickers, and a breathing soundbed.",
    tags: ["Fluoro", "Stickers", "Sound"],
    link: "#",
    image: "https://picsum.photos/seed/concretebloom/400/300.jpg",
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
