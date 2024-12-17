const express = require("express");
const {
  uploadMedia,
  getMedia,
  upload,
} = require("../controllers/mediaController.js");
const verifyToken = require("../middlewares/verifyToken.js");

const router = express.Router();

router.post(
  "/upload",
  verifyToken,
  upload.fields([{ name: "file" }, { name: "thumbnail" }]),
  uploadMedia
);
router.get("/", verifyToken, getMedia);

module.exports = router;
