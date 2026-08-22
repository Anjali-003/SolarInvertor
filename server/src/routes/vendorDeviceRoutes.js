const express = require("express");

const router = express.Router();

const vendorAuth =
    require("../middleware/vendorAuth");

const deviceController =
    require("../controllers/vendorDeviceController");

const vendorEnergyController =
    require("../controllers/vendorEnergyController");

const messageController =
    require("../controllers/messageController");


router.get(
    "/devices",
    vendorAuth,
    deviceController.getVendorDevices
);


router.get(
    "/devices/:id",
    vendorAuth,
    deviceController.getDeviceDetails
);

router.get("/devices/:id/details", vendorAuth, deviceController.getVendorDeviceDetails);


router.get(
    "/devices/:id/latest",
    vendorAuth,
    messageController.getVendorLatestMessage
);


router.get(
    "/devices/:id/energy/summary",
    vendorAuth,
    vendorEnergyController.getVendorEnergySummary
);




module.exports = router;