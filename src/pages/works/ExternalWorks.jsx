import React from "react";
import styles from "./works.module.scss";
import { useData } from "../../context/DataContext";

const ExternalWorks = () => {
  const { works } = useData();
  const externalProjects = works.filter((w) => w.category === "external");
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
          <article key={project.title} className={styles.card}>
            <div className={styles.cardHead}>
              <div className={styles.pill}>Commission</div>
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

export default ExternalWorks;
