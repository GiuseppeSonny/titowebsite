import React from "react";
import styles from "./works.module.scss";
import { useData } from "../../context/DataContext";

const InternalWorks = () => {
  const { works } = useData();
  const internalProjects = works.filter((w) => w.category === "internal");
  return (
    <div className={styles.main}>
      <div className={styles.headerRow}>
        <div>
          <p className={styles.kicker}>Internal works</p>
          <h2>Lab pieces & experiments</h2>
          <p className={styles.subhead}>Studio-only explorations before they hit the streets.</p>
        </div>
      </div>

      <div className={styles.grid}>
        {internalProjects.map((project) => (
          <article key={project.title} className={styles.card}>
            <div className={styles.cardHead}>
              <div className={styles.pill}>In house</div>
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

export default InternalWorks;
