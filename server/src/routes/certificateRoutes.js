const express = require("express");
const router = express.Router();

const controller = require("../controllers/certificateController");

// Device-facing config endpoint (used over FTP by the
// device itself, not tied to any account).
router.post("/device/config", controller.getDeviceConfig);

module.exports = router;
