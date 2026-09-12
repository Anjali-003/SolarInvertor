const express = require("express");

const router = express.Router();

const controller =
    require("../controllers/userDeviceController");

const auth =
    require("../middleware/authMiddleware");


router.get(
    "/devices",
    auth,
    controller.getUserDevices
);


router.post(
    "/devices",
    auth,
    controller.addUserDevice
);

router.get(
    "/device-details",
    auth,
    controller.getDeviceDetails
);

router.delete(
    "/devices/:id",
    auth,
    controller.deleteUserDevice
);

module.exports = router;