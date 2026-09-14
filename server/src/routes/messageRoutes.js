const express = require("express");
const router = express.Router();
const controller = require("../controllers/messageController");

// PUBLIC — no login. Device is identified by ?imei= directly.

router.get("/latest-message", controller.getLatestMessage);

module.exports = router;
