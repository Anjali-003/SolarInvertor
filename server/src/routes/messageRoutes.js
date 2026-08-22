
const express = require("express");
const router = express.Router();
const controller = require("../controllers/messageController");
const auth = require("../middleware/authMiddleware");
const pool = require("../config/database");

const vendorAuth =
  require("../middleware/vendorAuth");
const { decrypt } = require("../utils/encryption");


router.get("/latest-message", auth, controller.getLatestMessage);


module.exports = router;