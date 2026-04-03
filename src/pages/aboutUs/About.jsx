import React from "react";
import { useData } from "../../context/DataContext";

const About = () => {
  const { about, firestoreReady } = useData();

  if (!firestoreReady) {
    return (
      <main style={{ maxWidth: "960px", margin: "0 auto", padding: "32px 16px", minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center', opacity: 0.6 }}>
          <div style={{ 
            width: 40, 
            height: 40, 
            border: '3px solid rgba(255,255,255,0.2)', 
            borderTopColor: '#fff', 
            borderRadius: '50%', 
            animation: 'spin 1s linear infinite',
            margin: '0 auto 16px'
          }} />
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      </main>
    );
  }

  return (
    <main style={{ maxWidth: "960px", margin: "0 auto", padding: "32px 16px" }}>
      <header style={{ marginBottom: "24px" }}>
        <p style={{ textTransform: "uppercase", letterSpacing: "0.12em", fontSize: "0.75rem", opacity: 0.7 }}>
          About
        </p>
        <h1 style={{ fontSize: "2.4rem", margin: "8px 0 12px" }}>{about.title}</h1>
        <p style={{ lineHeight: 1.7, maxWidth: "52ch", opacity: 0.88 }}>{about.bio}</p>
      </header>

      {about.skills && about.skills.length > 0 && (
        <section style={{ marginTop: "32px" }}>
          <h2 style={{ fontSize: "1rem", textTransform: "uppercase", letterSpacing: "0.14em", opacity: 0.7, marginBottom: "10px" }}>
            Skills
          </h2>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
            {about.skills.map((skill) => (
              <span
                key={skill}
                style={{
                  fontSize: "0.8rem",
                  padding: "4px 10px",
                  borderRadius: "999px",
                  border: "1px solid rgba(255,255,255,0.16)",
                  opacity: 0.9,
                }}
              >
                {skill}
              </span>
            ))}
          </div>
        </section>
      )}

      {about.stats && about.stats.length > 0 && (
        <section style={{ marginTop: "40px" }}>
          <h2 style={{ fontSize: "1rem", textTransform: "uppercase", letterSpacing: "0.14em", opacity: 0.7, marginBottom: "14px" }}>
            Stats
          </h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))",
              gap: "16px",
            }}
          >
            {about.stats.map((stat, idx) => (
              <div
                key={idx}
                style={{
                  padding: "16px 14px",
                  borderRadius: "12px",
                  border: "1px solid rgba(255,255,255,0.15)",
                  background: "rgba(0,0,0,0.35)",
                }}
              >
                <div style={{ fontSize: "1.6rem", fontWeight: 700, marginBottom: "4px" }}>{stat.value}</div>
                <div style={{ fontSize: "0.8rem", opacity: 0.75 }}>{stat.label}</div>
              </div>
            ))}
          </div>
        </section>
      )}
    </main>
  );
};

export default About;
