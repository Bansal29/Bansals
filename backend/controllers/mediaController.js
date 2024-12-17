const { PrismaClient } = require("@prisma/client");
const multer = require("multer");
const { storage } = require("../config/cloudinaryConfig.js");

const prisma = new PrismaClient();

const upload = multer({ storage });

const uploadMedia = async (req, res) => {
  try {
    const { title, type, label, youtubeLink, driveLink } = req.body;

    let media;

    // 1. Handle Google Drive link
    if (type === "drive") {
      if (!driveLink) {
        return res
          .status(400)
          .json({ message: "Google Drive link is required" });
      }

      // Optional: Validate Google Drive link format
      const isValidDriveLink = (link) => {
        const driveRegex =
          "/^https://drive.google.com/drive/folders/[A-Za-z0-9_-]+/";
        return driveRegex.test(link);
      };

      if (!isValidDriveLink(driveLink)) {
        return res
          .status(400)
          .json({ message: "Invalid Google Drive link format" });
      }

      media = await prisma.media.create({
        data: {
          title,
          type, // 'drive'
          label,
          url: driveLink, // Google Drive folder link
          userId: req.user.id,
        },
      });

      return res
        .status(201)
        .json({ message: "Google Drive link added successfully", media });
    }

    // 2. Handle YouTube link with thumbnail upload
    if (type === "youtube") {
      if (!youtubeLink) {
        return res.status(400).json({ message: "YouTube link is required" });
      }

      const thumbnailUrl = req.files?.thumbnail?.[0]?.path; // Cloudinary URL for uploaded thumbnail
      if (!thumbnailUrl) {
        return res.status(400).json({ message: "Thumbnail image is required" });
      }

      media = await prisma.media.create({
        data: {
          title,
          type, // 'youtube'
          label,
          url: youtubeLink, // YouTube link
          thumbnail: thumbnailUrl, // Uploaded thumbnail URL
          userId: req.user.id,
        },
      });

      return res
        .status(201)
        .json({ message: "YouTube video added successfully", media });
    }

    // 3. Handle Photo or Video upload
    const fileUrl = req.files?.file?.[0]?.path; // Cloudinary URL for uploaded file
    if (!fileUrl) {
      return res.status(400).json({ message: "File is required" });
    }

    media = await prisma.media.create({
      data: {
        title,
        type, // 'image' or 'video'
        label,
        url: fileUrl, // Cloudinary file URL
        userId: req.user.id,
      },
    });

    res.status(201).json({ message: "Media uploaded successfully", media });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error uploading media" });
  }
};

const getMedia = async (req, res) => {
  try {
    const media = await prisma.media.findMany();
    res.json(media);
  } catch (err) {
    res.status(500).send("Error fetching media");
  }
};

module.exports = { uploadMedia, getMedia, upload };
