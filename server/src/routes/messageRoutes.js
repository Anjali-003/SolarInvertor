// const express = require("express");
// const router = express.Router();
// const controller = require("../controllers/messageController");

// router.get("/messages", controller.getMessages);

// module.exports = router;


const express = require("express");
const router = express.Router();
const controller = require("../controllers/messageController");

router.get("/latest", controller.getLatestMessage);

module.exports = router;