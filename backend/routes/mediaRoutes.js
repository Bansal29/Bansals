const express = require("express");
const {
  uploadMedia,
  getMedia,
  upload,
  toggleStarred, // Import the toggleStarred function
  deleteMedia, // Import the deleteMedia function
} = require("../controllers/mediaController.js");
const verifyToken = require("../middlewares/verifyToken.js");

const router = express.Router();

// Route for uploading media
router.post(
  "/upload",
  verifyToken,
  upload.fields([{ name: "file" }, { name: "thumbnail" }]),
  uploadMedia
);

// Route for getting all media
router.get("/", getMedia);

// Route for toggling starred status
router.post("/toggleStarred", verifyToken, toggleStarred);

// Route for deleting media
router.delete("/delete/:mediaId", verifyToken, deleteMedia); // Add this line

module.exports = router;
