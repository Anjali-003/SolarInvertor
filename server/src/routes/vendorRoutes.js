const express = require("express");
const router = express.Router();

const vendorAuthController =
require("../controllers/vendorAuthController");

router.post(
  "/login",
  vendorAuthController.login
);

router.post(
  "/register",
  vendorAuthController.register
);

module.exports = router;