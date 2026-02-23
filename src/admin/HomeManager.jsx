import React, { useState } from "react";
import { useData } from "../context/DataContext";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../firebase/firebase";
import styles from "./admin.module.scss";

const HomeManager = () => {
  const { home, updateHome } = useData();
  const [isLoading, setIsLoading] = useState(false);
  const [videoFile, setVideoFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  const [formData, setFormData] = useState({
    hero: {
      kicker: home.hero?.kicker || "",
      title: home.hero?.title || "",
      subtitle: home.hero?.subtitle || "",
      subhead: home.hero?.subhead || "",
      primaryCta: home.hero?.primaryCta || "",
      secondaryCta: home.hero?.secondaryCta || "",
      metrics: home.hero?.metrics || [
        { value: "73", label: "Murals painted" },
        { value: "18", label: "Cities tagged" },
        { value: "∞", label: "Ideas in ink" },
      ],
      currentFocus: {
        title: home.hero?.currentFocus?.title || "",
        description: home.hero?.currentFocus?.description || "",
      },
      techStack: home.hero?.techStack || ["Spray", "Ink", "Light"],
      upcomingDrop: {
        title: home.hero?.upcomingDrop?.title || "",
        date: home.hero?.upcomingDrop?.date || "",
      },
    },
    video: {
      url: home.video?.url || "",
      title: home.video?.title || "",
      enabled: home.video?.enabled || false,
    },
  });

  const handleInputChange = (section, field, value) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const handleNestedInputChange = (section, subsection, field, value) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [subsection]: {
          ...prev[section][subsection],
          [field]: value
        }
      }
    }));
  };

  const handleMetricChange = (index, field, value) => {
    const newMetrics = [...formData.hero.metrics];
    newMetrics[index] = { ...newMetrics[index], [field]: value };
    setFormData(prev => ({
      ...prev,
      hero: {
        ...prev.hero,
        metrics: newMetrics
      }
    }));
  };

  const handleTechStackChange = (index, value) => {
    const newTechStack = [...formData.hero.techStack];
    newTechStack[index] = value;
    setFormData(prev => ({
      ...prev,
      hero: {
        ...prev.hero,
        techStack: newTechStack
      }
    }));
  };

  const addTechStackItem = () => {
    setFormData(prev => ({
      ...prev,
      hero: {
        ...prev.hero,
        techStack: [...prev.hero.techStack, ""]
      }
    }));
  };

  const removeTechStackItem = (index) => {
    const newTechStack = formData.hero.techStack.filter((_, i) => i !== index);
    setFormData(prev => ({
      ...prev,
      hero: {
        ...prev.hero,
        techStack: newTechStack
      }
    }));
  };

  const handleVideoFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file size (max 100MB for videos)
      const maxSize = 100 * 1024 * 1024; // 100MB in bytes
      if (file.size > maxSize) {
        alert("Video file is too large. Please upload a video smaller than 100MB.");
        return;
      }
      
      // Validate file type
      const validTypes = ['video/mp4', 'video/webm', 'video/ogg', 'video/quicktime'];
      if (!validTypes.includes(file.type)) {
        alert("Invalid video format. Please upload MP4, WebM, OGG, or MOV files.");
        return;
      }
      
      setVideoFile(file);
      setUploadProgress(0);
    }
  };

  const uploadVideo = async () => {
    if (!videoFile) return;

    setIsLoading(true);
    setUploadProgress(0);

    try {
      // Create a unique filename with timestamp
      const timestamp = Date.now();
      const filename = `home-video-${timestamp}.${videoFile.name.split('.').pop()}`;
      
      // Create reference to Firebase Storage
      const storageRef = ref(storage, `videos/${filename}`);
      
      // Upload the file
      const uploadTask = uploadBytes(storageRef, videoFile);
      
      // Get the download URL after upload
      const snapshot = await uploadTask;
      const downloadURL = await getDownloadURL(snapshot.ref);
      
      // Update form data with the Firebase URL
      setFormData(prev => ({
        ...prev,
        video: {
          ...prev.video,
          url: downloadURL,
          title: videoFile.name
        }
      }));

      setUploadProgress(100);
      alert("Video uploaded successfully!");
    } catch (error) {
      console.error("Video upload failed:", error);
      alert("Failed to upload video. Please try again.");
    } finally {
      setIsLoading(false);
      setVideoFile(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await updateHome(formData);
      alert("Home page updated successfully!");
    } catch (error) {
      console.error("Failed to update home page:", error);
      alert("Failed to update home page. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.managerContainer}>
      <h2>Home Page Management</h2>
      
      <form onSubmit={handleSubmit} className={styles.managerForm}>
        <div className={styles.formSection}>
          <h3>Hero Section</h3>
          
          <div className={styles.formGroup}>
            <label>Kicker</label>
            <input
              type="text"
              value={formData.hero.kicker}
              onChange={(e) => handleInputChange("hero", "kicker", e.target.value)}
              className={styles.formInput}
            />
          </div>

          <div className={styles.formGroup}>
            <label>Title</label>
            <input
              type="text"
              value={formData.hero.title}
              onChange={(e) => handleInputChange("hero", "title", e.target.value)}
              className={styles.formInput}
            />
          </div>

          <div className={styles.formGroup}>
            <label>Subtitle</label>
            <input
              type="text"
              value={formData.hero.subtitle}
              onChange={(e) => handleInputChange("hero", "subtitle", e.target.value)}
              className={styles.formInput}
            />
          </div>

          <div className={styles.formGroup}>
            <label>Subhead</label>
            <textarea
              value={formData.hero.subhead}
              onChange={(e) => handleInputChange("hero", "subhead", e.target.value)}
              className={styles.formTextarea}
              rows={3}
            />
          </div>

          <div className={styles.formGroup}>
            <label>Primary CTA</label>
            <input
              type="text"
              value={formData.hero.primaryCta}
              onChange={(e) => handleInputChange("hero", "primaryCta", e.target.value)}
              className={styles.formInput}
            />
          </div>

          <div className={styles.formGroup}>
            <label>Secondary CTA</label>
            <input
              type="text"
              value={formData.hero.secondaryCta}
              onChange={(e) => handleInputChange("hero", "secondaryCta", e.target.value)}
              className={styles.formInput}
            />
          </div>

          <div className={styles.formGroup}>
            <label>Metrics</label>
            {formData.hero.metrics.map((metric, index) => (
              <div key={index} className={styles.metricRow}>
                <input
                  type="text"
                  value={metric.value}
                  onChange={(e) => handleMetricChange(index, "value", e.target.value)}
                  placeholder="Value"
                  className={styles.formInput}
                />
                <input
                  type="text"
                  value={metric.label}
                  onChange={(e) => handleMetricChange(index, "label", e.target.value)}
                  placeholder="Label"
                  className={styles.formInput}
                />
              </div>
            ))}
          </div>

          <div className={styles.formGroup}>
            <label>Current Focus</label>
            <input
              type="text"
              value={formData.hero.currentFocus.title}
              onChange={(e) => handleNestedInputChange("hero", "currentFocus", "title", e.target.value)}
              placeholder="Title"
              className={styles.formInput}
            />
            <input
              type="text"
              value={formData.hero.currentFocus.description}
              onChange={(e) => handleNestedInputChange("hero", "currentFocus", "description", e.target.value)}
              placeholder="Description"
              className={styles.formInput}
            />
          </div>

          <div className={styles.formGroup}>
            <label>Tech Stack</label>
            {formData.hero.techStack.map((tech, index) => (
              <div key={index} className={styles.techStackRow}>
                <input
                  type="text"
                  value={tech}
                  onChange={(e) => handleTechStackChange(index, e.target.value)}
                  className={styles.formInput}
                />
                <button
                  type="button"
                  onClick={() => removeTechStackItem(index)}
                  className={styles.removeButton}
                >
                  Remove
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={addTechStackItem}
              className={styles.addButton}
            >
              Add Tech Stack Item
            </button>
          </div>

          <div className={styles.formGroup}>
            <label>Upcoming Drop</label>
            <input
              type="text"
              value={formData.hero.upcomingDrop.title}
              onChange={(e) => handleNestedInputChange("hero", "upcomingDrop", "title", e.target.value)}
              placeholder="Title"
              className={styles.formInput}
            />
            <input
              type="text"
              value={formData.hero.upcomingDrop.date}
              onChange={(e) => handleNestedInputChange("hero", "upcomingDrop", "date", e.target.value)}
              placeholder="Date"
              className={styles.formInput}
            />
          </div>
        </div>

        <div className={styles.formSection}>
          <h3>Video Section</h3>
          
          <div className={styles.formGroup}>
            <label>
              <input
                type="checkbox"
                checked={formData.video.enabled}
                onChange={(e) => handleInputChange("video", "enabled", e.target.checked)}
              />
              Enable Video
            </label>
          </div>

          <div className={styles.formGroup}>
            <label>Video Title</label>
            <input
              type="text"
              value={formData.video.title}
              onChange={(e) => handleInputChange("video", "title", e.target.value)}
              className={styles.formInput}
            />
          </div>

          <div className={styles.formGroup}>
            <label>Upload Video</label>
            <input
              type="file"
              accept="video/*"
              onChange={handleVideoFileChange}
              className={styles.formInput}
            />
            {videoFile && (
              <div className={styles.fileInfo}>
                <p><strong>Selected file:</strong> {videoFile.name}</p>
                <p><strong>Size:</strong> {(videoFile.size / (1024 * 1024)).toFixed(2)} MB</p>
                <p><strong>Type:</strong> {videoFile.type}</p>
                <div className={styles.uploadActions}>
                  <button
                    type="button"
                    onClick={uploadVideo}
                    disabled={isLoading}
                    className={styles.uploadButton}
                  >
                    {isLoading ? "Uploading..." : "Upload Video"}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setVideoFile(null);
                      setUploadProgress(0);
                    }}
                    className={styles.cancelButton}
                    disabled={isLoading}
                  >
                    Cancel
                  </button>
                </div>
                {uploadProgress > 0 && (
                  <div className={styles.progressBar}>
                    <div 
                      className={styles.progressFill}
                      style={{ width: `${uploadProgress}%` }}
                    />
                    <span className={styles.progressText}>{uploadProgress}%</span>
                  </div>
                )}
              </div>
            )}
          </div>

          {formData.video.url && (
            <div className={styles.videoPreview}>
              <label>Video Preview</label>
              <video controls className={styles.videoPlayer}>
                <source src={formData.video.url} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
          )}
        </div>

        <div className={styles.formActions}>
          <button
            type="submit"
            disabled={isLoading}
            className={styles.saveButton}
          >
            {isLoading ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default HomeManager;
