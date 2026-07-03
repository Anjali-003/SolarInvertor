// const express = require("express");
// const router = express.Router();
// const controller = require("../controllers/messageController");

// router.get("/messages", controller.getMessages);

// module.exports = router;


const express = require("express");
const router = express.Router();
const controller = require("../controllers/messageController");
const auth = require("../middleware/authMiddleware");
const pool = require("../config/database");

const vendorAuth =
  require("../middleware/vendorAuth");
const { decrypt } = require("../utils/encryption");

  
// router.get(
//   "/vendor/devices/:id/latest",
//   (req, res, next) => {
//     console.log("🔥 Route hit, headers:", req.headers.authorization);
//     next();
//   },
//   vendorAuth,
//   controller.getVendorLatestMessage
// );

// router.get("/latest-message", auth, controller.getLatestMessage);



router.get("/latest-message", async (req, res) => {
  try {
    const [rows] = await pool.execute(
      `SELECT * FROM messages ORDER BY created_at DESC LIMIT 1`
    );

    if (rows.length === 0) {
      return res.json({ error: "No data" });
    }

    const row = rows[0];

    // decrypt payload
    const decrypted = decrypt(
      row.payload,
      row.iv,
      row.auth_tag
    );

    const parsed = JSON.parse(decrypted);

    return res.json({
      ...row,
      payload: parsed,
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

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