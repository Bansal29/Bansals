import React, { useState } from "react";
import { uploadMediaAPI } from "../api/api";
import { useNavigate } from "react-router-dom";

const UploadMediaForm = () => {
  const [title, setTitle] = useState("");
  const [type, setType] = useState("image");
  const [file, setFile] = useState(null);
  const [driveLink, setDriveLink] = useState("");
  const [youtubeLink, setYoutubeLink] = useState("");
  const [thumbnail, setThumbnail] = useState(null);
  const [label, setLabel] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("title", title);
    formData.append("type", type);
    formData.append("label", label);

    if (type === "drive") {
      formData.append("driveLink", driveLink);
      if (thumbnail) {
        formData.append("thumbnail", thumbnail); // Add thumbnail to FormData for drive
      }
    } else if (type === "youtube") {
      formData.append("youtubeLink", youtubeLink);
      if (thumbnail) {
        formData.append("thumbnail", thumbnail); // Add thumbnail to FormData for youtube
      }
    } else {
      formData.append("file", file);
    }

    try {
      console.log("FormData: ", formData);
      await uploadMediaAPI(formData);
      alert("Media uploaded successfully!");
      navigate("/");
    } catch (err) {
      alert("Upload failed!");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="form">
      <h2>Upload Media</h2>

      {/* Title */}
      <div className="input-group">
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>

      {/* Type Selection */}
      <div className="input-group">
        <select value={type} onChange={(e) => setType(e.target.value)}>
          <option value="image">Image</option>
          <option value="video">Video</option>
          <option value="drive">Google Drive</option>
          <option value="youtube">YouTube Link</option>
        </select>
      </div>

      {/* Drive Link and Thumbnail */}
      {type === "drive" && (
        <div className="input-group">
          <input
            type="url"
            placeholder="Google Drive Link"
            value={driveLink}
            onChange={(e) => setDriveLink(e.target.value)}
          />
          <label htmlFor="thumbnail-upload">
            {thumbnail ? "Thumbnail Uploaded" : "Upload Thumbnail (Optional)"}
          </label>
          <input
            type="file"
            id="thumbnail-upload"
            onChange={(e) => setThumbnail(e.target.files[0])}
            accept="image/*"
          />
        </div>
      )}

      {/* YouTube Link and Thumbnail */}
      {type === "youtube" && (
        <div className="input-group">
          <input
            type="url"
            placeholder="YouTube Link"
            value={youtubeLink}
            onChange={(e) => setYoutubeLink(e.target.value)}
          />
          <label htmlFor="youtube-thumbnail-upload">
            {thumbnail ? "Thumbnail Uploaded" : "Upload Thumbnail (Optional)"}
          </label>
          <input
            type="file"
            id="youtube-thumbnail-upload"
            onChange={(e) => setThumbnail(e.target.files[0])}
            accept="image/*"
          />
        </div>
      )}

      {/* Image/Video File Upload */}
      {(type === "image" || type === "video") && (
        <div className="input-group">
          <label htmlFor="file-upload">
            {file
              ? "File Selected"
              : type === "image"
              ? "Upload Image"
              : "Upload Video"}
          </label>
          <input
            type="file"
            id="file-upload"
            onChange={(e) => setFile(e.target.files[0])}
            accept={type === "image" ? "image/*" : "video/*"}
          />
        </div>
      )}

      {/* Label */}
      <div className="input-group">
        <input
          type="text"
          placeholder="Label"
          value={label}
          onChange={(e) => setLabel(e.target.value)}
        />
      </div>

      <button type="submit">Upload</button>
    </form>
  );
};

export default UploadMediaForm;
