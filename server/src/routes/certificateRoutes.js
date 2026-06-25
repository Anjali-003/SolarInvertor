const express =
  require("express");

const router =
  express.Router();

const controller =
  require("../controllers/certificateController");

const auth =
  require("../middleware/authMiddleware");

// Generate cert
router.post(
  "/generate",
  auth,
  controller.generateCertificate
);

// Download files
// router.get(
//   "/:certificateId/:type",
//   auth,
//   controller.downloadCertificate
// );

router.get(
  "/credentials/:certificateId",
  auth,
  controller.getCredentials
);

// router.get(
//   "/:certificateId/credentials",
//   auth,
//   controller.getCredentials
// );

// Download files
router.get(
  "/:certificateId/:type",
  auth,
  controller.downloadCertificate
);


module.exports = router;