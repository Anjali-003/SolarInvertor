const express = require("express");

const router = express.Router();

const adminAuth =
    require("../middleware/adminAuth");

const deviceController =
    require("../controllers/adminDeviceController");

const adminEnergyController =
    require("../controllers/adminEnergyController");

const messageController =
    require("../controllers/messageController");


// =====================================================
// ADMIN DEVICE ROUTES
// =====================================================

router.get(
    "/devices",
    adminAuth,
    deviceController.getAdminDevices
);


// Register a new device directly (no vendor involved).
router.post(
    "/devices/register",
    adminAuth,
    deviceController.registerDevice
);


router.get(
    "/devices/:id",
    adminAuth,
    deviceController.getDeviceDetails
);


router.get(
    "/devices/:id/details",
    adminAuth,
    deviceController.getAdminDeviceDetails
);


router.get(
    "/devices/:id/latest",
    adminAuth,
    messageController.getAdminLatestMessage
);


router.get(
    "/devices/:id/energy/summary",
    adminAuth,
    adminEnergyController.getAdminEnergySummary
);


router.get(
    "/devices/:id/energy/chart",
    adminAuth,
    adminEnergyController.getAdminEnergyChart
);


module.exports = router;
