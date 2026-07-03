const express =
  require("express");

const router =
  express.Router();

const controller =
  require("../controllers/certificateController");

const auth =
  require("../middleware/authMiddleware");

const vendorAuth =
  require("../middleware/vendorAuth");

// Generate cert
router.post(
  "/generate",
  vendorAuth,
  controller.generateCertificate
);

// Download files
// router.get(
//   "/:certificateId/:type",
//   auth,
//   controller.downloadCertificate
// );


router.post("/device/config", controller.getDeviceConfig);




// Working 
// router.get(
//   "/credentials/:certificateId",
//   auth,
//   controller.getCredentials
// );






// router.get(
//   "/:certificateId/credentials",
//   auth,
//   controller.getCredentials
// );





// Working 
// Download files
// router.get(
//   "/:certificateId/:type",
//   auth,
//   controller.downloadCertificate
// );


module.exports = router;