const express = require("express");
const router = express.Router();

const vendorAuth =
  require("../middleware/vendorAuth");

const deviceController =
  require("../controllers/vendorDeviceController");

router.get(
  "/my-devices",
  vendorAuth,
  deviceController.getVendorDevices
);

router.get(
  "/my-devices/:id",
  vendorAuth,
  deviceController.getDeviceDetails
);

module.exports = router;