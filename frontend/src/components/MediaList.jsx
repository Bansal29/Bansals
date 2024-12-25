import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { fetchMediaAPI, toggleStarredAPI, deleteMediaAPI } from "../api/api";
import ContentLoader from "react-content-loader"; // Importing React Content Loader
import "../styles/MediaList.css";

const MediaList = () => {
  const [media, setMedia] = useState([]);
  const [filteredMedia, setFilteredMedia] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLabel, setSelectedLabel] = useState("");
  const { user } = useContext(AuthContext);
  const [isListening, setIsListening] = useState(false);
  const [loading, setLoading] = useState(true); // New loading state

  useEffect(() => {
    const fetchMedia = async () => {
      try {
        setLoading(true); // Start loading
        const { data } = await fetchMediaAPI(); // Replace with your actual API call
        setMedia(data);
        setFilteredMedia(data);
        setLoading(false); // Stop loading after data is fetched
      } catch (err) {
        console.error("Error fetching media:", err);
      } finally {
        setLoading(false); // Stop loading
      }
    };
    fetchMedia();
  }, []);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleLabelChange = (e) => {
    setSelectedLabel(e.target.value);
  };

  useEffect(() => {
    let filtered = media;

    if (searchQuery) {
      filtered = filtered.filter((item) =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedLabel) {
      filtered = filtered.filter((item) =>
        item.label.toLowerCase().includes(selectedLabel.toLowerCase())
      );
    }

    setFilteredMedia(filtered);
  }, [searchQuery, selectedLabel, media]);

  const handleToggleStarred = async (mediaId) => {
    try {
      await toggleStarredAPI(mediaId);
      setMedia((prev) =>
        prev.map((item) =>
          item.id === mediaId ? { ...item, starred: !item.starred } : item
        )
      );
    } catch (err) {
      alert("Failed to toggle star!");
    }
  };

  const handleDeleteMedia = async (mediaId) => {
    try {
      await deleteMediaAPI(mediaId);
      setMedia((prev) => prev.filter((item) => item.id !== mediaId));
    } catch (err) {
      alert("Failed to delete media!");
    }
  };

  const renderMediaContent = (item) => {
    const mediaTypes = {
      youtube: {
        alt: "YouTube Thumbnail",
        thumbnail:
          item.thumbnail ||
          "https://cdn3.iconfinder.com/data/icons/social-network-30/512/social-06-512.png",
        link: item.url,
        label: "Watch on YouTube",
      },
      drive: {
        alt: "Google Drive Thumbnail",
        thumbnail:
          item.thumbnail ||
          "https://upload.wikimedia.org/wikipedia/commons/d/da/Google_Drive_logo.png",
        link: item.url,
        label: "View on Google Drive",
      },
      image: {
        alt: "Image Thumbnail",
        thumbnail: item.url,
        link: item.url,
        label: "View Image",
      },
      default: {
        alt: "Video Thumbnail",
        thumbnail:
          item.thumbnail || "frontendpublicminimalist_play_video_logo.png",
        link: item.url,
        label: "View video",
      },
    };

    const mediaType = mediaTypes[item.type] || mediaTypes.default;

    return (
      <div className="media-content">
        <img
          src={mediaType.thumbnail}
          alt={mediaType.alt}
          className="media-thumbnail"
        />
        <a
          href={mediaType.link}
          target="_blank"
          rel="noopener noreferrer"
          className="media-link"
        >
          {mediaType.label}
        </a>
        {user ? (
          <div className="actions">
            <div className="star-toggle">
              <p>{item.starred ? "⭐ Starred" : "☆ Not Starred"}</p>
              <button onClick={() => handleToggleStarred(item.id)}>
                {item.starred ? "Unstar" : "Star"}
              </button>
            </div>
            <button
              className="delete-button"
              onClick={() => handleDeleteMedia(item.id)}
            >
              🗑️ Delete
            </button>
          </div>
        ) : (
          <div className="star-toggle">
            <p>{item.starred ? "⭐ Starred" : "☆ Not Starred"}</p>
          </div>
        )}
      </div>
    );
  };

  const startListening = () => {
    if (!("webkitSpeechRecognition" in window)) {
      alert("Speech Recognition is not supported in this browser.");
      return;
    }

    const recognition = new window.webkitSpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = "en-US";

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
      setIsListening(false);
    };

    recognition.onresult = (event) => {
      const spokenQuery = event.results[0][0].transcript;
      setSearchQuery(spokenQuery);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  };

  return (
    <div className="media-list">
      <h2>All memories...</h2>

      {/* Search bar with voice search */}
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search media..."
          value={searchQuery}
          onChange={handleSearchChange}
        />
        <button
          className="voice-search-button"
          onClick={startListening}
          disabled={isListening}
        >
          🎤 {isListening ? "Listening..." : "Voice Search"}
        </button>
      </div>

      {/* Dropdown for label selection */}
      <div className="label-filter">
        <select onChange={handleLabelChange} value={selectedLabel}>
          <option value="">All Labels</option>
          {media
            .map((item) => item.label)
            .filter((value, index, self) => self.indexOf(value) === index)
            .map((label) => (
              <option key={label} value={label}>
                {label}
              </option>
            ))}
        </select>
      </div>

      <div className="media-container">
        {loading
          ? // Skeleton Loader
            Array.from({ length: 5 }).map((_, index) => (
              <ContentLoader
                key={index}
                speed={2}
                width={300}
                height={180}
                viewBox="0 0 300 180"
                backgroundColor="#f3f3f3"
                foregroundColor="#b8b8b8"
                className="media-skeleton"
              >
                {/* Title */}
                <rect x="10" y="10" rx="4" ry="4" width="80%" height="20" />

                {/* Media type and label */}
                <rect x="10" y="40" rx="4" ry="4" width="40%" height="15" />
                <rect x="60%" y="40" rx="4" ry="4" width="30%" height="15" />

                {/* Thumbnail */}
                <rect x="10" y="70" rx="5" ry="5" width="100" height="100" />

                {/* Buttons */}
                <rect x="120" y="80" rx="5" ry="5" width="50%" height="15" />
                <rect x="120" y="110" rx="5" ry="5" width="40%" height="15" />
              </ContentLoader>
            ))
          : filteredMedia.map((item) => (
              <div key={item.id} className="media-card">
                <h3 className="media-title">{item.title}</h3>
                <div className="items">
                  <span className="media-type">{item.type}</span>
                  <span className="media-label">{item.label}</span>
                </div>
                {renderMediaContent(item)}
              </div>
            ))}
      </div>
    </div>
  );
};

export default MediaList;
