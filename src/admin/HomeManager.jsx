import React, { useState } from "react";
import { useData } from "../context/DataContext";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../firebase/firebase";
import styles from "./admin.module.scss";

const HomeManager = () => {
  const { home, updateHome, works, products } = useData();
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
      enabled: home.video?.enabled || false,
      videos: home.video?.videos || [],
    },
    highlights: home.highlights || [],
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

  const getAllAvailableItems = () => {
    const items = [];
    
    // Add works
    const worksArray = Array.isArray(works) ? works : [];
    worksArray.forEach(work => {
      const imageUrl = work.image || (work.images && work.images.length > 0 ? work.images[0] : null);
      if (imageUrl) {
        items.push({
          id: `work-${work.id || work.title}`,
          type: 'work',
          title: work.title || 'Untitled',
          category: work.category || 'recent',
          image: imageUrl,
          link: work.category && work.category !== 'recent' ? `/works/${work.category}` : '/works',
          desc: work.desc || ''
        });
      }
    });
    
    // Add products
    const productsArray = Array.isArray(products) ? products : [];
    productsArray.forEach(product => {
      if (product.url) {
        items.push({
          id: `product-${product.id || product.caption}`,
          type: 'product',
          title: product.caption || 'Untitled',
          category: product.category || 'photo',
          image: product.url,
          link: '/products',
          desc: product.category || ''
        });
      }
    });
    
    return items;
  };

  const addHighlight = (item) => {
    const newHighlight = {
      id: item.id,
      title: item.title,
      body: item.desc,
      badge: item.type === 'work' ? 
        (item.category === 'recent' || !item.category ? 'Recent' : item.category.charAt(0).toUpperCase() + item.category.slice(1)) :
        item.category.charAt(0).toUpperCase() + item.category.slice(1),
      image: item.image,
      link: item.link
    };
    
    setFormData(prev => ({
      ...prev,
      highlights: [...prev.highlights, newHighlight]
    }));
  };

  const removeHighlight = (index) => {
    setFormData(prev => ({
      ...prev,
      highlights: prev.highlights.filter((_, i) => i !== index)
    }));
  };

  const moveHighlight = (index, direction) => {
    const newHighlights = [...formData.highlights];
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    
    if (newIndex >= 0 && newIndex < newHighlights.length) {
      [newHighlights[index], newHighlights[newIndex]] = [newHighlights[newIndex], newHighlights[index]];
      setFormData(prev => ({
        ...prev,
        highlights: newHighlights
      }));
    }
  };

  const addVideo = (videoData) => {
    const newVideo = {
      id: Date.now().toString(),
      title: videoData.title || videoData.fileName,
      url: videoData.url,
      thumbnail: videoData.thumbnail || null,
      duration: videoData.duration || null,
      uploadedAt: new Date().toISOString()
    };
    
    setFormData(prev => ({
      ...prev,
      video: {
        ...prev.video,
        videos: [...prev.video.videos, newVideo]
      }
    }));
  };

  const removeVideo = (videoId) => {
    setFormData(prev => ({
      ...prev,
      video: {
        ...prev.video,
        videos: prev.video.videos.filter(v => v.id !== videoId)
      }
    }));
  };

  const moveVideo = (index, direction) => {
    const newVideos = [...formData.video.videos];
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    
    if (newIndex >= 0 && newIndex < newVideos.length) {
      [newVideos[index], newVideos[newIndex]] = [newVideos[newIndex], newVideos[index]];
      setFormData(prev => ({
        ...prev,
        video: {
          ...prev.video,
          videos: newVideos
        }
      }));
    }
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
      
      // Add video to the videos array
      addVideo({
        url: downloadURL,
        title: videoFile.name,
        fileName: videoFile.name
      });

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
          <p className={styles.sectionDescription}>
            Upload and manage multiple videos for the home page. Users can select which video to play.
          </p>
          
          <div className={styles.formGroup}>
            <label>
              <input
                type="checkbox"
                checked={formData.video.enabled}
                onChange={(e) => handleInputChange("video", "enabled", e.target.checked)}
              />
              Enable Video Section
            </label>
          </div>

          <div className={styles.videoManagement}>
            <h4>Uploaded Videos ({formData.video.videos.length})</h4>
            {formData.video.videos.map((video, index) => (
              <div key={video.id} className={styles.videoItem}>
                <div className={styles.videoPreview}>
                  <video controls className={styles.videoThumbnail}>
                    <source src={video.url} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                </div>
                <div className={styles.videoInfo}>
                  <input
                    type="text"
                    value={video.title}
                    onChange={(e) => {
                      const newVideos = [...formData.video.videos];
                      newVideos[index] = { ...newVideos[index], title: e.target.value };
                      setFormData(prev => ({
                        ...prev,
                        video: { ...prev.video, videos: newVideos }
                      }));
                    }}
                    className={styles.formInput}
                    placeholder="Video title"
                  />
                  <p className={styles.videoMeta}>
                    Uploaded: {new Date(video.uploadedAt).toLocaleDateString()}
                  </p>
                </div>
                <div className={styles.videoActions}>
                  <button
                    type="button"
                    onClick={() => moveVideo(index, 'up')}
                    disabled={index === 0}
                    className={styles.moveButton}
                  >
                    ↑
                  </button>
                  <button
                    type="button"
                    onClick={() => moveVideo(index, 'down')}
                    disabled={index === formData.video.videos.length - 1}
                    className={styles.moveButton}
                  >
                    ↓
                  </button>
                  <button
                    type="button"
                    onClick={() => removeVideo(video.id)}
                    className={styles.removeButton}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
            {formData.video.videos.length === 0 && (
              <p className={styles.emptyMessage}>No videos uploaded yet.</p>
            )}
          </div>

          <div className={styles.formGroup}>
            <label>Upload New Video</label>
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
        </div>

        <div className={styles.formSection}>
          <h3>Carousel Highlights</h3>
          <p className={styles.sectionDescription}>
            Select up to 4 items to display in the home page carousel. These can be works or products.
          </p>
          
          <div className={styles.highlightsPreview}>
            <h4>Current Highlights ({formData.highlights.length}/4)</h4>
            {formData.highlights.map((highlight, index) => (
              <div key={index} className={styles.highlightItem}>
                <div className={styles.highlightImage}>
                  <img src={highlight.image} alt={highlight.title} />
                </div>
                <div className={styles.highlightInfo}>
                  <h5>{highlight.title}</h5>
                  <p>{highlight.body}</p>
                  <span className={styles.badge}>{highlight.badge}</span>
                </div>
                <div className={styles.highlightActions}>
                  <button
                    type="button"
                    onClick={() => moveHighlight(index, 'up')}
                    disabled={index === 0}
                    className={styles.moveButton}
                  >
                    ↑
                  </button>
                  <button
                    type="button"
                    onClick={() => moveHighlight(index, 'down')}
                    disabled={index === formData.highlights.length - 1}
                    className={styles.moveButton}
                  >
                    ↓
                  </button>
                  <button
                    type="button"
                    onClick={() => removeHighlight(index)}
                    className={styles.removeButton}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
            {formData.highlights.length === 0 && (
              <p className={styles.emptyMessage}>No highlights selected. Add items below.</p>
            )}
          </div>

          {formData.highlights.length < 4 && (
            <div className={styles.availableItems}>
              <h4>Available Items</h4>
              <div className={styles.itemsGrid}>
                {getAllAvailableItems().map((item) => (
                  <div key={item.id} className={styles.availableItem}>
                    <div className={styles.itemImage}>
                      <img src={item.image} alt={item.title} />
                    </div>
                    <div className={styles.itemInfo}>
                      <h5>{item.title}</h5>
                      <p>{item.desc}</p>
                      <span className={styles.badge}>{item.badge}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => addHighlight(item)}
                      disabled={formData.highlights.some(h => h.id === item.id)}
                      className={styles.addButton}
                    >
                      {formData.highlights.some(h => h.id === item.id) ? 'Added' : 'Add'}
                    </button>
                  </div>
                ))}
              </div>
              {getAllAvailableItems().length === 0 && (
                <p className={styles.emptyMessage}>No items available. Add some works or products first.</p>
              )}
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
