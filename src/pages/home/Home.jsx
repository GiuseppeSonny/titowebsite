import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "./home.module.scss";

const Home = () => {
  const navigate = useNavigate();
  
  const highlights = [
    {
      title: "Walls into stories",
      body: "Murals that bend neon, grime, and poetry into one living surface.",
      badge: "Graffiti",
      image: "https://picsum.photos/seed/wallsstories/400/250.jpg",
      link: "/works"
    },
    {
      title: "Digital drips",
      body: "Motion-led web pieces that feel like wet paint sliding under light.",
      badge: "Motion",
      image: "https://picsum.photos/seed/digitaldrips/400/250.jpg",
      link: "/works"
    },
    {
      title: "Pop-up energy",
      body: "Installations and merch drops that pull crowds like fresh tags on dawn trains.",
      badge: "Live",
      image: "https://picsum.photos/seed/popupenergy/400/250.jpg",
      link: "/works"
    },
  ];

  return (
    <div className={styles.home}>
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <p className={styles.kicker}>Street Artist / 2025</p>
          <h1>
            Stencils on concrete
            <span> that glow after dark</span>
          </h1>
          <p className={styles.subhead}>
            Raw blacks, bright reds, and layered wheatpaste textures—urban stories sprayed loud across the city.
          </p>
          <div className={styles.ctaRow}>
            <button className={styles.primaryCta}>View the stencils</button>
            <button className={styles.secondaryCta}>Commission a wall</button>
          </div>
          <div className={styles.metrics}>
            <div>
              <span>73</span>
              <p>Murals painted</p>
            </div>
            <div>
              <span>18</span>
              <p>Cities tagged</p>
            </div>
            <div>
              <span>∞</span>
              <p>Ideas in ink</p>
            </div>
          </div>
        </div>
        <div className={styles.heroPanel}>
          <div className={styles.glow} />
          <div className={styles.cardStack}>
            <div className={styles.cardPrimary}>
              <p>Current focus</p>
              <h3>Night train murals</h3>
              <span>Neon, chrome, grit</span>
            </div>
            <div className={styles.cardSecondary}>
              <p>Tech stack</p>
              <div className={styles.chips}>
                {"Spray · Ink · Light · React".split(" · ").map((tech) => (
                  <span key={tech}>{tech}</span>
                ))}
              </div>
            </div>
            <div className={styles.cardTertiary}>
              <p>Upcoming drop</p>
              <h4>Subway Bloom</h4>
              <small>Spring equinox</small>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.highlights}>
        {highlights.map((item) => (
          <article key={item.title} className={styles.highlightCard} onClick={() => navigate(item.link)}>
            <div className={styles.highlightImage}>
              <img src={item.image} alt={item.title} />
            </div>
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
