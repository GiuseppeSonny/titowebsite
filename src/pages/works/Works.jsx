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
  const categories = [
    { label: "Internal works", path: "/works/internal" },
    { label: "External works", path: "/works/external" },
    { label: "Future works", path: "/works/future" },
  ];

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
        {projects.map((project) => (
          <article key={project.title} className={styles.card}>
            <div className={styles.cardHead}>
              <div className={styles.pill}>Fresh paint</div>
              <a href={project.link} className={styles.link}>
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
    </div>
  );
};

export default Works;
