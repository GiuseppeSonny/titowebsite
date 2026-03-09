import React, { useState, useEffect } from "react";
import { useData } from "../context/DataContext";
import styles from "./admin.module.scss";

const PageHeadersManager = () => {
  const { home, updateHome } = useData();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    works: {
      kicker: home.pageHeaders?.works?.kicker || "",
      title: home.pageHeaders?.works?.title || "",
      subhead: home.pageHeaders?.works?.subhead || "",
    },
    internalWorks: {
      kicker: home.pageHeaders?.internalWorks?.kicker || "",
      title: home.pageHeaders?.internalWorks?.title || "",
      subhead: home.pageHeaders?.internalWorks?.subhead || "",
    },
    externalWorks: {
      kicker: home.pageHeaders?.externalWorks?.kicker || "",
      title: home.pageHeaders?.externalWorks?.title || "",
      subhead: home.pageHeaders?.externalWorks?.subhead || "",
    },
    products: {
      kicker: home.pageHeaders?.products?.kicker || "",
      title: home.pageHeaders?.products?.title || "",
      subhead: home.pageHeaders?.products?.subhead || "",
    },
    contacts: {
      kicker: home.pageHeaders?.contacts?.kicker || "",
      title: home.pageHeaders?.contacts?.title || "",
      subhead: home.pageHeaders?.contacts?.subhead || "",
    },
  });

  const [fontsData, setFontsData] = useState({
    heading: home.fonts?.heading || "'Inter', sans-serif",
    body: home.fonts?.body || "'Inter', sans-serif",
    mono: home.fonts?.mono || "'JetBrains Mono', monospace",
  });

  const fontOptions = [
    "'Inter', sans-serif",
    "'Roboto', sans-serif",
    "'Open Sans', sans-serif",
    "'Lato', sans-serif",
    "'Montserrat', sans-serif",
    "'Poppins', sans-serif",
    "'Raleway', sans-serif",
    "'Playfair Display', serif",
    "'Merriweather', serif",
    "'Georgia', serif",
    "'Courier New', monospace",
    "'JetBrains Mono', monospace",
    "'Fira Code', monospace",
    "'Source Code Pro', monospace",
  ];

  useEffect(() => {
    setFormData({
      works: {
        kicker: home.pageHeaders?.works?.kicker || "",
        title: home.pageHeaders?.works?.title || "",
        subhead: home.pageHeaders?.works?.subhead || "",
      },
      internalWorks: {
        kicker: home.pageHeaders?.internalWorks?.kicker || "",
        title: home.pageHeaders?.internalWorks?.title || "",
        subhead: home.pageHeaders?.internalWorks?.subhead || "",
      },
      externalWorks: {
        kicker: home.pageHeaders?.externalWorks?.kicker || "",
        title: home.pageHeaders?.externalWorks?.title || "",
        subhead: home.pageHeaders?.externalWorks?.subhead || "",
      },
      products: {
        kicker: home.pageHeaders?.products?.kicker || "",
        title: home.pageHeaders?.products?.title || "",
        subhead: home.pageHeaders?.products?.subhead || "",
      },
      contacts: {
        kicker: home.pageHeaders?.contacts?.kicker || "",
        title: home.pageHeaders?.contacts?.title || "",
        subhead: home.pageHeaders?.contacts?.subhead || "",
      },
    });
    setFontsData({
      heading: home.fonts?.heading || "'Inter', sans-serif",
      body: home.fonts?.body || "'Inter', sans-serif",
      mono: home.fonts?.mono || "'JetBrains Mono', monospace",
    });
  }, [home]);

  const handleChange = (page, field, value) => {
    setFormData(prev => ({
      ...prev,
      [page]: {
        ...prev[page],
        [field]: value
      }
    }));
  };

  const handleFontChange = (type, value) => {
    setFontsData(prev => ({
      ...prev,
      [type]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await updateHome({ pageHeaders: formData, fonts: fontsData });
      alert("Page headers and fonts updated successfully!");
    } catch (error) {
      console.error("Failed to update page headers and fonts:", error);
      alert("Failed to update page headers and fonts. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.managerSection}>
      <div className={styles.managerHeader}>
        <h2>Page Headers & Fonts</h2>
        <p>Edit titles, subtitles, and fonts for pages across the site.</p>
      </div>

      <form onSubmit={handleSubmit} className={styles.managerForm}>
        <div className={styles.formSection}>
          <h3>Fonts</h3>
          <div className={styles.formGroup}>
            <label>Heading Font</label>
            <select
              value={fontsData.heading}
              onChange={(e) => handleFontChange("heading", e.target.value)}
              className={styles.formSelect}
            >
              {fontOptions.map(font => (
                <option key={font} value={font}>{font.replace(/['"]/g, '')}</option>
              ))}
            </select>
          </div>
          <div className={styles.formGroup}>
            <label>Body Font</label>
            <select
              value={fontsData.body}
              onChange={(e) => handleFontChange("body", e.target.value)}
              className={styles.formSelect}
            >
              {fontOptions.map(font => (
                <option key={font} value={font}>{font.replace(/['"]/g, '')}</option>
              ))}
            </select>
          </div>
          <div className={styles.formGroup}>
            <label>Mono Font</label>
            <select
              value={fontsData.mono}
              onChange={(e) => handleFontChange("mono", e.target.value)}
              className={styles.formSelect}
            >
              {fontOptions.map(font => (
                <option key={font} value={font}>{font.replace(/['"]/g, '')}</option>
              ))}
            </select>
          </div>
        </div>

        {Object.entries(formData).map(([pageKey, pageData]) => (
          <div key={pageKey} className={styles.formSection}>
            <h3>{pageKey.charAt(0).toUpperCase() + pageKey.slice(1).replace(/([A-Z])/g, ' $1')}</h3>
            <div className={styles.formGroup}>
              <label>Kicker</label>
              <input
                type="text"
                value={pageData.kicker}
                onChange={(e) => handleChange(pageKey, "kicker", e.target.value)}
                className={styles.formInput}
              />
            </div>
            <div className={styles.formGroup}>
              <label>Title</label>
              <input
                type="text"
                value={pageData.title}
                onChange={(e) => handleChange(pageKey, "title", e.target.value)}
                className={styles.formInput}
              />
            </div>
            <div className={styles.formGroup}>
              <label>Subhead</label>
              <textarea
                value={pageData.subhead}
                onChange={(e) => handleChange(pageKey, "subhead", e.target.value)}
                className={styles.formTextarea}
                rows={3}
              />
            </div>
          </div>
        ))}

        <div className={styles.formActions}>
          <button type="submit" disabled={isLoading} className={styles.submitButton}>
            {isLoading ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PageHeadersManager;
