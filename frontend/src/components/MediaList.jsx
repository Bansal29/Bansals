// import React, { useState, useEffect, useContext } from "react";
// import { AuthContext } from "../context/AuthContext";
// import { fetchMediaAPI, toggleStarredAPI } from "../api/api";
// import "../styles/MediaList.css";

// const MediaList = () => {
//   const [media, setMedia] = useState([]);
//   const { user } = useContext(AuthContext);

//   useEffect(() => {
//     const fetchMedia = async () => {
//       try {
//         const { data } = await fetchMediaAPI();
//         setMedia(data);
//       } catch (err) {
//         console.error("Error fetching media:", err);
//       }
//     };
//     fetchMedia();
//   }, []);

//   const handleToggleStarred = async (mediaId) => {
//     try {
//       await toggleStarredAPI(mediaId);
//       setMedia((prev) =>
//         prev.map((item) =>
//           item.id === mediaId ? { ...item, starred: !item.starred } : item
//         )
//       );
//     } catch (err) {
//       alert("Failed to toggle star!");
//     }
//   };

//   const renderMediaContent = (item) => {
//     const mediaTypes = {
//       youtube: {
//         alt: "YouTube Thumbnail",
//         thumbnail:
//           item.thumbnail ||
//           "https://upload.wikimedia.org/wikipedia/commons/3/34/YouTube_logo_%282017%29.png",
//         link: item.url,
//         label: "Watch on YouTube",
//       },
//       drive: {
//         alt: "Google Drive Thumbnail",
//         thumbnail:
//           item.thumbnail ||
//           "https://upload.wikimedia.org/wikipedia/commons/d/da/Google_Drive_logo.png",
//         link: item.url,
//         label: "View on Google Drive",
//       },
//       image: {
//         alt: "Image Thumbnail",
//         thumbnail: item.url,
//         link: item.url,
//         label: "View Image",
//       },
//       default: {
//         alt: "Video Thumbnail",
//         thumbnail:
//           item.thumbnail || "frontendpublicminimalist_play_video_logo.png",
//         link: item.url,
//         label: "View video",
//       },
//     };

//     const mediaType = mediaTypes[item.type] || mediaTypes.default;

//     return (
//       <div className="media-content">
//         <img
//           src={mediaType.thumbnail}
//           alt={mediaType.alt}
//           className="media-thumbnail"
//         />
//         <a
//           href={mediaType.link}
//           target="_blank"
//           rel="noopener noreferrer"
//           className="media-link"
//         >
//           {mediaType.label}
//         </a>
//         {user && (
//           <div className="star-toggle">
//             <p>{item.starred ? "⭐ Starred" : "☆ Not Starred"}</p>
//             <button onClick={() => handleToggleStarred(item.id)}>
//               {item.starred ? "Unstar" : "Star"}
//             </button>
//           </div>
//         )}
//       </div>
//     );
//   };

//   return (
//     <div className="media-list">
//       <h2>All media files</h2>
//       <div className="media-container">
//         {media.map((item) => (
//           <div key={item.id} className="media-card">
//             <h3 className="media-title">{item.title}</h3>
//             <div className="items">
//               <span className="media-type">{item.type}</span>
//               <span className="media-label">{item.label}</span>
//             </div>
//             {renderMediaContent(item)}
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default MediaList;
import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { fetchMediaAPI, toggleStarredAPI } from "../api/api";
import "../styles/MediaList.css";

const MediaList = () => {
  const [media, setMedia] = useState([]);
  const [filteredMedia, setFilteredMedia] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLabel, setSelectedLabel] = useState("");
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchMedia = async () => {
      try {
        const { data } = await fetchMediaAPI();
        setMedia(data);
        setFilteredMedia(data); // Initialize filteredMedia with all media
      } catch (err) {
        console.error("Error fetching media:", err);
      }
    };
    fetchMedia();
  }, []);

  // Handle search query change
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // Handle label filter change
  const handleLabelChange = (e) => {
    setSelectedLabel(e.target.value);
  };

  // Filter media based on search query and selected label
  useEffect(() => {
    let filtered = media;

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter((item) =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by selected label
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
          <div className="star-toggle">
            <p>{item.starred ? "⭐ Starred" : "☆ Not Starred"}</p>
            <button onClick={() => handleToggleStarred(item.id)}>
              {item.starred ? "Unstar" : "Star"}
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

  return (
    <div className="media-list">
      <h2>All media files</h2>

      {/* Search bar */}
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search media..."
          value={searchQuery}
          onChange={handleSearchChange}
        />
      </div>

      {/* Dropdown for label selection */}
      <div className="label-filter">
        <select onChange={handleLabelChange} value={selectedLabel}>
          <option value="">All Labels</option>
          {media
            .map((item) => item.label)
            .filter((value, index, self) => self.indexOf(value) === index) // Remove duplicates
            .map((label) => (
              <option key={label} value={label}>
                {label}
              </option>
            ))}
        </select>
      </div>

      <div className="media-container">
        {filteredMedia.map((item) => (
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
