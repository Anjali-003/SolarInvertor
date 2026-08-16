const express = require("express");

const router = express.Router();

const auth = require("../middleware/authMiddleware");

const energyController =
    require("../controllers/energyController");


router.get(
    "/summary",
    auth,
    energyController.getEnergySummary
);


module.exports = router;