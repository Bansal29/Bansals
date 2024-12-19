const { PrismaClient } = require("@prisma/client");
const multer = require("multer");
const { storage } = require("../config/cloudinaryConfig.js");
const crypto = require("crypto");
const prisma = new PrismaClient();
const upload = multer({ storage });

//fucntion to encrypt the urls
const encrypt = (text) => {
  const algorithm = "aes-256-cbc";
  const key = crypto.scryptSync(process.env.URL_SECRET, "salt", 32);
  const iv = crypto.randomBytes(16);

  const cipher = crypto.createCipheriv(algorithm, key, iv);
  let encrypted = cipher.update(text, "utf8", "hex");
  encrypted += cipher.final("hex");
  return { iv: iv.toString("hex"), encryptedData: encrypted };
};

//decrypt function for decrypting the urls
const decrypt = (encryptedData, iv) => {
  const algorithm = "aes-256-cbc";
  const key = crypto.scryptSync(process.env.URL_SECRET, "salt", 32);
  const ivBuffer = Buffer.from(iv, "hex");

  const decipher = crypto.createDecipheriv(algorithm, key, ivBuffer);
  let decrypted = decipher.update(encryptedData, "hex", "utf8");
  decrypted += decipher.final("utf8");

  return decrypted;
};

//upload media endpoint function
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

      media = await prisma.media.create({
        data: {
          title,
          type,
          label,
          url: driveLink,
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

      const thumbnailUrl = req.files?.thumbnail?.[0]?.path;
      if (!thumbnailUrl) {
        return res.status(400).json({ message: "Thumbnail image is required" });
      }

      media = await prisma.media.create({
        data: {
          title,
          type,
          label,
          url: youtubeLink,
          thumbnail: thumbnailUrl,
          userId: req.user.id,
        },
      });

      return res
        .status(201)
        .json({ message: "YouTube video added successfully", media });
    }

    // 3. Handle Photo or Video upload
    const fileUrl = req.files?.file?.[0]?.path;
    if (!fileUrl) {
      return res.status(400).json({ message: "File is required" });
    }

    media = await prisma.media.create({
      data: {
        title,
        type,
        label,
        url: fileUrl,
        userId: req.user.id,
      },
    });

    res.status(201).json({ message: "Media uploaded successfully", media });
  } catch (error) {
    console.error("Error uploading media:", JSON.stringify(error, null, 2));
    res.status(500).json({ message: "Error uploading media" });
  }
};

//get media endpoint function
const getMedia = async (req, res) => {
  try {
    const media = await prisma.media.findMany({
      orderBy: [{ starred: "desc" }, { createdAt: "desc" }],
    });
    res.json(media);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching media");
  }
};

//update starred status endpoint function
const toggleStarred = async (req, res) => {
  try {
    const { mediaId } = req.body;

    const media = await prisma.media.findUnique({
      where: { id: mediaId },
    });

    if (!media) {
      return res.status(404).json({ message: "Media not found" });
    }

    const updatedMedia = await prisma.media.update({
      where: { id: mediaId },
      data: { starred: !media.starred },
    });

    res
      .status(200)
      .json({ message: "Starred status updated", media: updatedMedia });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error toggling starred status" });
  }
};

// Delete Media endpoint function
const deleteMedia = async (req, res) => {
  try {
    const { mediaId } = req.params;

    const media = await prisma.media.findUnique({
      where: { id: mediaId },
    });

    if (!media) {
      return res.status(404).json({ message: "Media not found" });
    }

    await prisma.media.delete({
      where: { id: mediaId },
    });

    res.status(200).json({ message: "Media deleted successfully" });
  } catch (err) {
    console.error("Error deleting media:", JSON.stringify(err, null, 2));
    res.status(500).json({ message: "Error deleting media" });
  }
};

module.exports = { uploadMedia, getMedia, upload, toggleStarred, deleteMedia };
