const express = require("express");

const router = express.Router();

const controller =
    require("../controllers/userDeviceController");

// =====================================================
// PUBLIC — no login required.
// The "user" is just the phone owner now; there's no
// account, so there's nothing to authenticate here.
// The frontend decides what to remember (localStorage).
// =====================================================

router.get(
    "/devices/:imei",
    controller.lookupDeviceByImei
);

// Kept for any existing callers using a query param.
router.get(
    "/device-details",
    controller.lookupDeviceByImei
);

module.exports = router;
