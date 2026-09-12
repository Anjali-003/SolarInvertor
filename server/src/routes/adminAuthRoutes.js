const express = require("express");
const router = express.Router();
const controller = require("../controllers/adminAuthController");
const adminAuth =
  require("../middleware/adminAuth");

const upload = require("../middleware/uploadExcel");

const {
    uploadIMEIs
} = require("../controllers/adminUploadController");

router.get("/test", (req, res) => {
  res.json({
    message: "Admin routes working"
  });
});

router.post("/login", controller.login);

router.get(
  "/profile",
  adminAuth,
  (req, res) => {

    res.json({
      message:
        "Protected route reached",

      admin:
        req.admin
    });

  }
);

router.post(

    "/upload-imei",

    adminAuth,

    upload.single("file"),

    uploadIMEIs

);

module.exports = router;