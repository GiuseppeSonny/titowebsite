import React from "react";
import styles from "./home.module.scss";

const Home = () => {
  const highlights = [
    {
      title: "Design that feels alive",
      body: "We craft digital experiences with bold typography, layered gradients, and purposeful motion.",
      badge: "Creative",
    },
    {
      title: "Engineering with intent",
      body: "From prototypes to production, we build performant, accessible, and maintainable products.",
      badge: "Technical",
    },
    {
      title: "Partnership mindset",
      body: "We collaborate closely, iterating fast and measuring impact to ship work that matters.",
      badge: "Trusted",
    },
  ];

  return (
    <div className={styles.home}>
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <p className={styles.kicker}>Studio / 2025</p>
          <h1>
            Crafted interfaces
            <span> that spark emotion</span>
          </h1>
          <p className={styles.subhead}>
            We blend expressive visuals with thoughtful engineering to build products people love to use every day.
          </p>
          <div className={styles.ctaRow}>
            <button className={styles.primaryCta}>View Works</button>
            <button className={styles.secondaryCta}>Book a Call</button>
          </div>
          <div className={styles.metrics}>
            <div>
              <span>48</span>
              <p>Projects shipped</p>
            </div>
            <div>
              <span>12</span>
              <p>Industries served</p>
            </div>
            <div>
              <span>5⭐</span>
              <p>Client rating</p>
            </div>
          </div>
        </div>
        <div className={styles.heroPanel}>
          <div className={styles.glow} />
          <div className={styles.cardStack}>
            <div className={styles.cardPrimary}>
              <p>Current focus</p>
              <h3>Immersive web stories</h3>
              <span>Next-gen interactions</span>
            </div>
            <div className={styles.cardSecondary}>
              <p>Tech stack</p>
              <div className={styles.chips}>
                {"React · Vite · SCSS · GSAP".split(" · ").map((tech) => (
                  <span key={tech}>{tech}</span>
                ))}
              </div>
            </div>
            <div className={styles.cardTertiary}>
              <p>Upcoming drop</p>
              <h4>Aurora dashboard</h4>
              <small>Releasing Q2</small>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.highlights}>
        {highlights.map((item) => (
          <article key={item.title} className={styles.highlightCard}>
            <span className={styles.badge}>{item.badge}</span>
            <h3>{item.title}</h3>
            <p>{item.body}</p>
          </article>
        ))}
      </section>
    </div>
  );
};

export default Home;
