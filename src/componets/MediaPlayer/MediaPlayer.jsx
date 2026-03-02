import React, { useRef, useState, useEffect } from "react";
import styles from "./MediaPlayer.module.scss";

const MediaPlayer = ({ videos, enabled, className, alwaysShow = false }) => {
  const videoRef = useRef(null);
  const [selectedVideoIndex, setSelectedVideoIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const currentVideo = videos && videos.length > 0 ? videos[selectedVideoIndex] : null;
  const url = currentVideo?.url;
  const title = currentVideo?.title;

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !enabled) return;

    const handleTimeUpdate = () => setCurrentTime(video.currentTime);
    const handleLoadedMetadata = () => {
      setDuration(video.duration);
      setIsLoading(false);
      setHasError(false);
    };
    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleVolumeChange = () => {
      setVolume(video.volume);
      setIsMuted(video.muted);
    };
    const handleError = () => {
      console.error('Video loading error');
      setHasError(true);
      setIsLoading(false);
    };

    video.addEventListener("timeupdate", handleTimeUpdate);
    video.addEventListener("loadedmetadata", handleLoadedMetadata);
    video.addEventListener("play", handlePlay);
    video.addEventListener("pause", handlePause);
    video.addEventListener("volumechange", handleVolumeChange);
    video.addEventListener("error", handleError);

    return () => {
      video.removeEventListener("timeupdate", handleTimeUpdate);
      video.removeEventListener("loadedmetadata", handleLoadedMetadata);
      video.removeEventListener("play", handlePlay);
      video.removeEventListener("pause", handlePause);
      video.removeEventListener("volumechange", handleVolumeChange);
      video.removeEventListener("error", handleError);
    };
  }, [enabled]);

  // Reset loading state when URL or selected video changes
  useEffect(() => {
    if (url) {
      setIsLoading(true);
      setHasError(false);
      setCurrentTime(0);
      setIsPlaying(false);
    }
  }, [url, selectedVideoIndex]);

  const selectVideo = (index) => {
    if (index >= 0 && index < videos.length) {
      setSelectedVideoIndex(index);
    }
  };

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;

    if (isPlaying) {
      video.pause();
    } else {
      video.play();
    }
  };

  const handleSeek = (e) => {
    const video = videoRef.current;
    if (!video) return;

    const newTime = (e.target.value / 100) * duration;
    video.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const handleVolumeChange = (e) => {
    const video = videoRef.current;
    if (!video) return;

    const newVolume = e.target.value / 100;
    video.volume = newVolume;
    setVolume(newVolume);
    setIsMuted(false);
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const toggleFullscreen = () => {
    const video = videoRef.current;
    if (!video) return;

    if (!isFullscreen) {
      if (video.requestFullscreen) {
        video.requestFullscreen();
      } else if (video.webkitRequestFullscreen) {
        video.webkitRequestFullscreen();
      } else if (video.mozRequestFullScreen) {
        video.mozRequestFullScreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
      }
    }
    setIsFullscreen(!isFullscreen);
  };

  const formatTime = (time) => {
    if (!time || isNaN(time)) return "0:00";
    
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const progressPercentage = duration > 0 ? (currentTime / duration) * 100 : 0;

  // Show error state when video fails to load
  if (hasError) {
    return (
      <div className={`${styles.mediaPlayer} ${styles.error} ${className || ""}`}>
        <div className={styles.videoContainer}>
          <div className={styles.errorContent}>
            <div className={styles.errorIcon}>
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
              </svg>
            </div>
            <h3>Video Loading Error</h3>
            <p>Unable to load video. The file may be corrupted or there's a network issue.</p>
            <button onClick={() => window.location.reload()} className={styles.retryBtn}>
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!alwaysShow && (!enabled || !url)) {
    return null;
  }

  // Show placeholder when alwaysShow is true but no video is available
  if (alwaysShow && (!enabled || !url)) {
    return (
      <div className={`${styles.mediaPlayer} ${styles.placeholder} ${className || ""}`}>
        <div className={styles.videoContainer}>
          <div className={styles.placeholderContent}>
            <div className={styles.placeholderIcon}>
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
            <h3>No Video Uploaded Yet</h3>
            <p>Upload a video from the admin panel to display it here</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`${styles.mediaPlayer} ${className || ""}`}>
      {videos && videos.length > 1 && (
        <div className={styles.videoSelector}>
          <h4>Select Video ({selectedVideoIndex + 1}/{videos.length})</h4>
          <div className={styles.videoThumbnails}>
            {videos.map((video, index) => (
              <button
                key={video.id}
                onClick={() => selectVideo(index)}
                className={`${styles.thumbnailButton} ${index === selectedVideoIndex ? styles.active : ''}`}
              >
                <div className={styles.thumbnail}>
                  <video>
                    <source src={video.url} type="video/mp4" />
                  </video>
                  <div className={styles.thumbnailOverlay}>
                    <span>{video.title}</span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
      
      <div className={styles.videoContainer}>
        <video
          ref={videoRef}
          src={url}
          className={styles.video}
          onClick={togglePlay}
          onMouseEnter={() => setShowControls(true)}
          onMouseLeave={() => setShowControls(false)}
          onError={() => setHasError(true)}
        />
        
        {title && (
          <div className={styles.videoTitle}>
            <h3>{title}</h3>
          </div>
        )}

        <div className={`${styles.controls} ${showControls ? styles.visible : ""}`}>
          <button
            className={styles.playButton}
            onClick={togglePlay}
            aria-label={isPlaying ? "Pause" : "Play"}
          >
            {isPlaying ? (
              <svg viewBox="0 0 24 24" fill="currentColor">
                <rect x="6" y="4" width="4" height="16" />
                <rect x="14" y="4" width="4" height="16" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M8 5v14l11-7z" />
              </svg>
            )}
          </button>

          <div className={styles.progressContainer}>
            <span className={styles.time}>{formatTime(currentTime)}</span>
            <input
              type="range"
              min="0"
              max="100"
              value={progressPercentage}
              onChange={handleSeek}
              className={styles.progress}
            />
            <span className={styles.time}>{formatTime(duration)}</span>
          </div>

          <div className={styles.volumeContainer}>
            <button
              className={styles.volumeButton}
              onClick={toggleMute}
              aria-label={isMuted ? "Unmute" : "Mute"}
            >
              {isMuted || volume === 0 ? (
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z" />
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
                </svg>
              )}
            </button>
            <input
              type="range"
              min="0"
              max="100"
              value={isMuted ? 0 : volume * 100}
              onChange={handleVolumeChange}
              className={styles.volume}
            />
          </div>

          <button
            className={styles.fullscreenButton}
            onClick={toggleFullscreen}
            aria-label="Fullscreen"
          >
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default MediaPlayer;
