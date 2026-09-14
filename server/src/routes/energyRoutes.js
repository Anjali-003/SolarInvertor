const express = require("express");

const router = express.Router();

const energyController =
    require("../controllers/energyController");

// =====================================================
// PUBLIC — no login. Callers pass ?imei= instead of a
// device_id, since there's no more account/device linking.
// =====================================================

router.get(
    "/summary",
    energyController.getEnergySummary
);


router.get(
    "/chart",
    energyController.getEnergyChart
);



module.exports = router;
