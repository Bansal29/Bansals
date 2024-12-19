const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Configure Multer Storage for Cloudinary
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "BANSAL_media", // Folder where media will be stored in Cloudinary
    resource_type: "auto", // Allows image and video uploads
    allowed_formats: ["jpeg", "jpg", "png"],
  },
});

module.exports = { cloudinary, storage };
