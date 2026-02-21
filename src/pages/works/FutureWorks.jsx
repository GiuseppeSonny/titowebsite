import React from "react";
import styles from "./works.module.scss";
import { useData } from "../../context/DataContext";

const FutureWorks = () => {
  const { works } = useData();
  const futureProjects = works.filter((w) => w.category === "future");
  return (
    <div className={styles.main}>
      <div className={styles.headerRow}>
        <div>
          <p className={styles.kicker}>Future works</p>
          <h2>Pieces in the pipeline</h2>
          <p className={styles.subhead}>Works planned for the next drops and seasonal releases.</p>
        </div>
      </div>

      <div className={styles.grid}>
        {futureProjects.map((project) => (
          <article key={project.title} className={styles.card}>
            <div className={styles.cardHead}>
              <div className={styles.pill}>Soon</div>
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

export default FutureWorks;
