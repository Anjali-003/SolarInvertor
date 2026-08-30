// const express = require("express");
// const router = express.Router();

// const controller = require("../controllers/authController");

// // router.post("/register", controller.register);
// router.post(
//   "/setup-device",
//   controller.setupDevice
// );

// router.post("/login", controller.login);

// module.exports = router;



const express = require("express");

const router = express.Router();

const controller = require("../controllers/authController");


// =====================================================
// REGISTRATION / DEVICE SETUP
// =====================================================

router.post(
  "/setup-device",
  controller.setupDevice
);


// =====================================================
// EMAIL VERIFICATION
// =====================================================

router.post(
  "/verify-email",
  controller.verifyEmail
);

router.post(
  "/resend-verification",
  controller.resendVerificationCode
);


// =====================================================
// LOGIN
// =====================================================

router.post(
  "/login",
  controller.login
);


// =====================================================
// PASSWORD RESET
// =====================================================

router.post(
  "/forgot-password",
  controller.forgotPassword
);

// router.post(
//   "/verify-reset-code",
//   controller.verifyResetCode
// );

router.post(
  "/reset-password",
  controller.resetPassword
);


module.exports = router;