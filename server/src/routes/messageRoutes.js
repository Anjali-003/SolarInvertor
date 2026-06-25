// const express = require("express");
// const router = express.Router();
// const controller = require("../controllers/messageController");

// router.get("/messages", controller.getMessages);

// module.exports = router;


const express = require("express");
const router = express.Router();
const controller = require("../controllers/messageController");
const auth = require("../middleware/authMiddleware");

const vendorAuth =
  require("../middleware/vendorAuth");

  
// router.get(
//   "/vendor/devices/:id/latest",
//   (req, res, next) => {
//     console.log("🔥 Route hit, headers:", req.headers.authorization);
//     next();
//   },
//   vendorAuth,
//   controller.getVendorLatestMessage
// );

router.get("/latest-message", auth, controller.getLatestMessage);

// router.get(
//   "/vendor/device/:deviceId/latest-message",
//   vendorAuth,
//   controller.getLatestMessageByDevice
// );


router.get(
  "/vendor/devices/:id/latest",
  vendorAuth,
  controller.getVendorLatestMessage
);

module.exports = router;