const express = require("express");
const {
  register,
  login,
  getAllUsers,
} = require("../controllers/authController");
const verifyToken = require("../middlewares/verifyToken.js");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/getallusers", verifyToken, getAllUsers);

module.exports = router;
