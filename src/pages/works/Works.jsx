import React from "react";
import styles from "./works.module.scss";

const projects = [
  {
    title: "Aurora Dashboard",
    desc: "Data-rich admin with live charts, playful gradients, and buttery micro-interactions.",
    tags: ["React", "D3", "GSAP"],
    link: "#",
  },
  {
    title: "Field Mobile",
    desc: "Offline-first field app with GPS workflows and snappy transitions for techs on the go.",
    tags: ["React Native", "Maps", "Offline"],
    link: "#",
  },
  {
    title: "Storysite",
    desc: "Immersive marketing page featuring scroll-driven storytelling and cinematic visuals.",
    tags: ["Vite", "Animations", "CMS"],
    link: "#",
  },
];

const Works = () => {
  return (
    <div className={styles.main}>
      <div className={styles.headerRow}>
        <div>
          <p className={styles.kicker}>Selected Work</p>
          <h2>Recent builds that ship</h2>
          <p className={styles.subhead}>
            A quick peek at the products we crafted across SaaS, mobile, and interactive web.
          </p>
        </div>
        <button className={styles.cta}>Request full portfolio</button>
      </div>

      <div className={styles.grid}>
        {projects.map((project) => (
          <article key={project.title} className={styles.card}>
            <div className={styles.cardHead}>
              <div className={styles.pill}>Launch ready</div>
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
