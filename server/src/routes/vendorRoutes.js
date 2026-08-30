// const express = require("express");
// const router = express.Router();

// const vendorAuthController =
// require("../controllers/vendorAuthController");

// router.post(
//   "/login",
//   vendorAuthController.login
// );

// router.post(
//   "/register",
//   vendorAuthController.register
// );

// module.exports = router;








const express = require("express");

const router = express.Router();

const vendorAuthController =
  require("../controllers/vendorAuthController");


const vendorAuth =
  require("../middleware/vendorAuth");


// =====================================================
// VENDOR LOGIN
// =====================================================

router.post(
  "/login",
  vendorAuthController.login
);


// =====================================================
// VENDOR REGISTER
// =====================================================

router.post(
  "/register",
  vendorAuthController.register
);


// =====================================================
// EMAIL VERIFICATION
// =====================================================

router.post(
  "/verify-email",
  vendorAuthController.verifyEmail
);


// =====================================================
// RESEND VERIFICATION
// =====================================================

router.post(
  "/resend-verification",
  vendorAuthController.resendVerificationCode
);


// =====================================================
// FORGOT PASSWORD
// =====================================================

router.post(
  "/forgot-password",
  vendorAuthController.forgotPassword
);


// =====================================================
// RESET PASSWORD
// =====================================================

router.post(
  "/reset-password",
  vendorAuthController.resetPassword
);


router.post(
  "/change-password",
  vendorAuth,
  vendorAuthController.changePassword
);



module.exports = router;