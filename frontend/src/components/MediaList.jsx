import React, { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { fetchMediaAPI } from "../api/api";
import "../styles/MediaList.css";

const MediaList = () => {
  const [media, setMedia] = useState([]);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMedia = async () => {
      try {
        const { data } = await fetchMediaAPI();
        setMedia(data);
      } catch (err) {
        console.error("Error fetching media:", err);
      }
    };

    if (!user) {
      // If the user is not logged in, redirect to login page
      navigate("/login");
    } else {
      fetchMedia();
    }
  }, [user, navigate]);

  return (
    <div className="media-list">
      <h2>Uploaded Media</h2>
      {!user ? (
        <p>Please log in to view the media content.</p>
      ) : (
        <div className="media-container">
          {media.map((item) => (
            <div key={item.id} className="media-card">
              <h3 className="media-title">{item.title}</h3>
              <p className="media-type">Type: {item.type}</p>
              {item.type === "youtube" && item.thumbnail ? (
                <div className="media-content">
                  <img
                    src={item.thumbnail}
                    alt={`${item.title} Thumbnail`}
                    className="media-thumbnail"
                  />
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="media-link"
                  >
                    Watch on YouTube
                  </a>
                </div>
              ) : item.type === "drive" ? (
                <div className="media-content">
                  <img
                    src={
                      item.thumbnail ||
                      "https://upload.wikimedia.org/wikipedia/commons/d/da/Google_Drive_logo.png"
                    }
                    alt={`${item.title} Drive Thumbnail`}
                    className="media-thumbnail"
                  />
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="media-link"
                  >
                    View on Google Drive
                  </a>
                </div>
              ) : item.type === "image" ? (
                <div className="media-content">
                  <img
                    src={item.url} // Display image URL
                    alt={item.title}
                    className="media-thumbnail"
                  />
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="media-link"
                  >
                    View Media
                  </a>
                </div>
              ) : (
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="media-link"
                >
                  View Media
                </a>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MediaList;
