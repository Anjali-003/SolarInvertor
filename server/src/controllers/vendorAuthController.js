// const pool = require("../config/database");
// const bcrypt = require("bcryptjs");
// const jwt = require("jsonwebtoken");

// exports.login = async (req,res) => {

//   const { login,password } = req.body;

//   const [rows] = await pool.execute(
//     `SELECT * FROM vendors WHERE email=? OR phone = ?`,
//     [login, login]
//   );

//   if(rows.length === 0){
//     return res.status(401).json({
//       error:"Invalid credentials"
//     });
//   }

//   const vendor = rows[0];

//   if (vendor.status === "pending") {
//     return res.status(403).json({
//       error:
//         "Your account is awaiting admin approval."
//     });
//   }

//   if (vendor.status === "rejected") {
//     return res.status(403).json({
//       error:
//         "Your registration request has been rejected."
//     });
//   }

//   const valid = await bcrypt.compare(
//     password,
//     vendor.password
//   );

//   if(!valid){
//     return res.status(401).json({
//       error:"Invalid credentials"
//     });
//   }

//   const token = jwt.sign(
//     {
//       id: vendor.id,
//       type: "vendor"
//     },
//     process.env.JWT_SECRET,
//     {
//       expiresIn:"7d"
//     }
//   );

//   res.json({
//     token,
//     vendor
//   });

// };

// exports.register = async (req, res) => {

//   const {
//     name,
//     email,
//     phone,
//     password
//   } = req.body;
//   const nameRegex = /^[A-Za-z\s.'-]{2,100}$/;

//     if (!nameRegex.test(name)) {
//         return res.status(400).json({
//             error: "Invalid name"
//         });
//     }

//     // Email
//     const emailRegex =
//         /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

//     if (!emailRegex.test(email)) {
//         return res.status(400).json({
//             error: "Invalid email"
//         });
//     }

//     // Phone
//     const phoneRegex = /^[6-9]\d{9}$/;

//     if (!phoneRegex.test(phone)) {
//         return res.status(400).json({
//             error: "Invalid phone number"
//         });
//     }

//     // Password
//     const passwordRegex =
//         /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#]).{8,20}$/;

//     if (!passwordRegex.test(password)) {
//         return res.status(400).json({
//             error: "Weak password"
//         });
//     }

//   const hash =
//     await bcrypt.hash(
//       password,
//       10
//     );

//   await pool.execute(
//     `
//     INSERT INTO vendors
//     (
//       name,
//       email,
//       phone,
//       password,
//       status
//     )
//     VALUES
//     (?, ?, ?, ?, ?)
//     `,
//     [
//       name,
//       email,
//       phone,
//       hash,
//       "pending"
//     ]
//   );

//   res.json({
//     success: true,
//     message:
//       "Registration submitted successfully. Your account is awaiting admin approval."
//   });
// };







const pool = require("../config/database");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const {
  generateOTP,
  hashOTP,
} = require("../utils/otp");

const {
  sendVerificationEmail,
  sendPasswordResetEmail,
} = require("../services/emailService");


// =====================================================
// LOGIN
// =====================================================

exports.login = async (req, res) => {
  try {
    const { login, password } = req.body;

    if (!login || !password) {
      return res.status(400).json({
        error: "Email/phone and password are required",
      });
    }

    const [rows] = await pool.execute(
      `
      SELECT *
      FROM vendors
      WHERE email = ?
         OR phone = ?
      LIMIT 1
      `,
      [login, login]
    );

    if (rows.length === 0) {
      return res.status(401).json({
        error: "Invalid credentials",
      });
    }

    const vendor = rows[0];

    // -------------------------------------------------
    // EMAIL VERIFICATION
    // -------------------------------------------------

    if (!vendor.email_verified) {
      return res.status(403).json({
        error: "Please verify your email before logging in",
        requiresEmailVerification: true,
      });
    }

    // -------------------------------------------------
    // ACCOUNT STATUS
    // -------------------------------------------------

    if (vendor.status === "pending") {
      return res.status(403).json({
        error:
          "Your account is awaiting admin approval.",
      });
    }

    if (vendor.status === "rejected") {
      return res.status(403).json({
        error:
          "Your registration request has been rejected.",
      });
    }

    if (vendor.status === "suspended") {
      return res.status(403).json({
        error:
          "Your account has been suspended.",
      });
    }

    // -------------------------------------------------
    // PASSWORD
    // -------------------------------------------------

    const valid = await bcrypt.compare(
      password,
      vendor.password
    );

    if (!valid) {
      return res.status(401).json({
        error: "Invalid credentials",
      });
    }

    // -------------------------------------------------
    // JWT
    // -------------------------------------------------

    // const token = jwt.sign(
    //   {
    //     id: vendor.id,
    //     type: "vendor",
    //   },
    //   process.env.JWT_SECRET,
    //   {
    //     expiresIn: "7d",
    //   }
    // );

    const token = jwt.sign(
  {
    id: vendor.id,
    type: "vendor",
    tokenVersion: vendor.token_version,
  },
  process.env.JWT_SECRET,
  {
    expiresIn: "7d",
  }
);
    return res.json({
      success: true,
      token,
      vendor: {
        id: vendor.id,
        name: vendor.name,
        email: vendor.email,
        phone: vendor.phone,
        status: vendor.status,
      },
    });

  } catch (error) {
    console.error("VENDOR LOGIN ERROR:", error);

    return res.status(500).json({
      error: "Login failed",
    });
  }
};


// =====================================================
// REGISTER
// =====================================================

exports.register = async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      password,
    } = req.body;

    // -------------------------------------------------
    // VALIDATION
    // -------------------------------------------------

    const nameRegex = /^[A-Za-z\s.'-]{2,100}$/;

    if (!nameRegex.test(name || "")) {
      return res.status(400).json({
        error: "Invalid name",
      });
    }

    const emailRegex =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email || "")) {
      return res.status(400).json({
        error: "Invalid email",
      });
    }

    const phoneRegex = /^[6-9]\d{9}$/;

    if (!phoneRegex.test(phone || "")) {
      return res.status(400).json({
        error: "Invalid phone number",
      });
    }

    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#]).{8,20}$/;

    if (!passwordRegex.test(password || "")) {
      return res.status(400).json({
        error:
          "Password must be 8-20 characters and contain uppercase, lowercase, number and special character",
      });
    }

    const normalizedEmail =
      email.trim().toLowerCase();

    // -------------------------------------------------
    // CHECK EXISTING EMAIL
    // -------------------------------------------------

    const [existing] = await pool.execute(
      `
      SELECT
        id,
        name,
        email_verified
      FROM vendors
      WHERE email = ?
      LIMIT 1
      `,
      [normalizedEmail]
    );

    if (existing.length > 0) {
      const vendor = existing[0];

      if (vendor.email_verified) {
        return res.status(409).json({
          error: "Email already registered",
        });
      }

      // Existing but unverified vendor.
      // Generate a fresh OTP.

      const otp = generateOTP();
      const hashedOTP = hashOTP(otp);

      const expiresAt = new Date(
        Date.now() + 10 * 60 * 1000
      );

      await pool.execute(
        `
        UPDATE vendors
        SET
          verification_code = ?,
          verification_expires_at = ?
        WHERE id = ?
        `,
        [
          hashedOTP,
          expiresAt,
          vendor.id,
        ]
      );

      try {
        await sendVerificationEmail(
          normalizedEmail,
          vendor.name,
          otp
        );
      } catch (emailError) {
        console.error(
          "VENDOR VERIFICATION EMAIL ERROR:",
          emailError
        );

        return res.status(500).json({
          error:
            "Account exists but verification email could not be sent.",
        });
      }

      return res.status(200).json({
        success: true,
        message:
          "This vendor account exists but is not verified. A new verification code has been sent.",
        requiresEmailVerification: true,
        email: normalizedEmail,
      });
    }

    // -------------------------------------------------
    // HASH PASSWORD
    // -------------------------------------------------

    const hash = await bcrypt.hash(
      password,
      12
    );

    // -------------------------------------------------
    // GENERATE VERIFICATION OTP
    // -------------------------------------------------

    const otp = generateOTP();
    const hashedOTP = hashOTP(otp);

    const expiresAt = new Date(
      Date.now() + 10 * 60 * 1000
    );

    // -------------------------------------------------
    // CREATE VENDOR
    // -------------------------------------------------

    const [result] = await pool.execute(
      `
      INSERT INTO vendors
      (
        name,
        email,
        phone,
        password,
        status,
        email_verified,
        verification_code,
        verification_expires_at
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `,
      [
        name,
        normalizedEmail,
        phone,
        hash,
        "pending",
        false,
        hashedOTP,
        expiresAt,
      ]
    );

    // -------------------------------------------------
    // SEND VERIFICATION EMAIL
    // -------------------------------------------------

    try {
      await sendVerificationEmail(
        normalizedEmail,
        name,
        otp
      );
    } catch (emailError) {
      console.error(
        "VENDOR VERIFICATION EMAIL ERROR:",
        emailError
      );

      return res.status(201).json({
        success: true,
        message:
          "Vendor account created, but verification email could not be sent. Please request a new verification code.",
        requiresEmailVerification: true,
        email: normalizedEmail,
      });
    }

    return res.status(201).json({
      success: true,
      message:
        "Registration successful. Please check your email for the verification code.",
      requiresEmailVerification: true,
      vendor: {
        id: result.insertId,
        name,
        email: normalizedEmail,
        phone,
      },
    });

  } catch (error) {
    console.error(
      "VENDOR REGISTER ERROR:",
      error
    );

    return res.status(500).json({
      error: "Registration failed",
    });
  }
};


// =====================================================
// VERIFY EMAIL
// =====================================================

exports.verifyEmail = async (req, res) => {
  try {
    const {
      email,
      otp,
    } = req.body;

    if (!email || !otp) {
      return res.status(400).json({
        message:
          "Email and OTP are required",
      });
    }

    const normalizedEmail =
      email.trim().toLowerCase();

    const [vendors] = await pool.execute(
      `
      SELECT
        id,
        email_verified,
        verification_code,
        verification_expires_at
      FROM vendors
      WHERE email = ?
      LIMIT 1
      `,
      [normalizedEmail]
    );

    if (vendors.length === 0) {
      return res.status(404).json({
        message: "Vendor not found",
      });
    }

    const vendor = vendors[0];

    if (vendor.email_verified) {
      return res.status(400).json({
        message:
          "Email is already verified",
      });
    }

    if (!vendor.verification_code) {
      return res.status(400).json({
        message:
          "No verification code found",
      });
    }

    // -------------------------------------------------
    // CHECK EXPIRY
    // -------------------------------------------------

    if (
      !vendor.verification_expires_at ||
      new Date() >
        new Date(
          vendor.verification_expires_at
        )
    ) {
      return res.status(400).json({
        message:
          "Verification code has expired",
      });
    }

    // -------------------------------------------------
    // CHECK OTP
    // -------------------------------------------------

    const hashedOTP = hashOTP(
      otp.toString()
    );

    if (
      hashedOTP !==
      vendor.verification_code
    ) {
      return res.status(400).json({
        message:
          "Invalid verification code",
      });
    }

    // -------------------------------------------------
    // VERIFY
    // -------------------------------------------------

    await pool.execute(
      `
      UPDATE vendors
      SET
        email_verified = TRUE,
        verification_code = NULL,
        verification_expires_at = NULL
      WHERE id = ?
      `,
      [vendor.id]
    );

    return res.status(200).json({
      success: true,
      message:
        "Email verified successfully",
    });

  } catch (error) {
    console.error(
      "VENDOR VERIFY EMAIL ERROR:",
      error
    );

    return res.status(500).json({
      message:
        "Email verification failed",
    });
  }
};


// =====================================================
// RESEND VERIFICATION CODE
// =====================================================

exports.resendVerificationCode = async (
  req,
  res
) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        message: "Email is required",
      });
    }

    const normalizedEmail =
      email.trim().toLowerCase();

    const [vendors] = await pool.execute(
      `
      SELECT
        id,
        name,
        email_verified
      FROM vendors
      WHERE email = ?
      LIMIT 1
      `,
      [normalizedEmail]
    );

    if (vendors.length === 0) {
      return res.status(404).json({
        message: "Vendor not found",
      });
    }

    const vendor = vendors[0];

    if (vendor.email_verified) {
      return res.status(400).json({
        message:
          "Email is already verified",
      });
    }

    const otp = generateOTP();
    const hashedOTP = hashOTP(otp);

    const expiresAt = new Date(
      Date.now() + 10 * 60 * 1000
    );

    await pool.execute(
      `
      UPDATE vendors
      SET
        verification_code = ?,
        verification_expires_at = ?
      WHERE id = ?
      `,
      [
        hashedOTP,
        expiresAt,
        vendor.id,
      ]
    );

    await sendVerificationEmail(
      normalizedEmail,
      vendor.name,
      otp
    );

    return res.status(200).json({
      success: true,
      message:
        "A new verification code has been sent",
    });

  } catch (error) {
    console.error(
      "VENDOR RESEND VERIFICATION ERROR:",
      error
    );

    return res.status(500).json({
      message:
        "Failed to resend verification code",
    });
  }
};


// =====================================================
// FORGOT PASSWORD
// =====================================================

exports.forgotPassword = async (
  req,
  res
) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        message: "Email is required",
      });
    }

    const normalizedEmail =
      email.trim().toLowerCase();

    const [vendors] = await pool.execute(
      `
      SELECT
        id,
        name,
        email,
        email_verified
      FROM vendors
      WHERE email = ?
      LIMIT 1
      `,
      [normalizedEmail]
    );

    /*
     * Do not reveal whether an email
     * exists.
     */

    if (vendors.length === 0) {
      return res.status(200).json({
        message:
          "If the email exists, a password reset code has been sent.",
      });
    }

    const vendor = vendors[0];

    /*
     * Only verified vendors can reset
     * their password.
     */

    if (!vendor.email_verified) {
      return res.status(200).json({
        message:
          "If the email exists, a password reset code has been sent.",
      });
    }

    const otp = generateOTP();

    const hashedOTP =
      hashOTP(otp.toString());

    const expiresAt = new Date(
      Date.now() + 10 * 60 * 1000
    );

    await pool.execute(
      `
      UPDATE vendors
      SET
        reset_code = ?,
        reset_expires_at = ?
      WHERE id = ?
      `,
      [
        hashedOTP,
        expiresAt,
        vendor.id,
      ]
    );

    try {
      await sendPasswordResetEmail(
        vendor.email,
        vendor.name,
        otp
      );
    } catch (emailError) {
      console.error(
        "VENDOR PASSWORD RESET EMAIL ERROR:",
        emailError
      );

      await pool.execute(
        `
        UPDATE vendors
        SET
          reset_code = NULL,
          reset_expires_at = NULL
        WHERE id = ?
        `,
        [vendor.id]
      );

      return res.status(500).json({
        message:
          "Unable to process password reset request",
      });
    }

    return res.status(200).json({
      success: true,
      message:
        "If the email exists, a password reset code has been sent.",
    });

  } catch (error) {
    console.error(
      "VENDOR FORGOT PASSWORD ERROR:",
      error
    );

    return res.status(500).json({
      message:
        "Unable to process password reset request",
    });
  }
};


// =====================================================
// RESET PASSWORD
// =====================================================

exports.resetPassword = async (
  req,
  res
) => {
  const connection =
    await pool.getConnection();

  try {
    const {
      email,
      otp,
      newPassword,
    } = req.body;

    if (
      !email ||
      !otp ||
      !newPassword
    ) {
      return res.status(400).json({
        message:
          "Email, OTP and new password are required",
      });
    }

    const normalizedEmail =
      email.trim().toLowerCase();

    // -------------------------------------------------
    // PASSWORD POLICY
    // -------------------------------------------------

    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#]).{8,20}$/;

    if (
      !passwordRegex.test(
        newPassword
      )
    ) {
      return res.status(400).json({
        message:
          "Password must be 8-20 characters and contain uppercase, lowercase, number and special character",
      });
    }

    await connection.beginTransaction();

    // -------------------------------------------------
    // LOCK VENDOR ROW
    // -------------------------------------------------

    const [vendors] =
      await connection.execute(
        `
        SELECT
          id,
          password,
          reset_code,
          reset_expires_at
        FROM vendors
        WHERE email = ?
        LIMIT 1
        FOR UPDATE
        `,
        [normalizedEmail]
      );

    if (vendors.length === 0) {
      await connection.rollback();

      return res.status(400).json({
        message:
          "Invalid reset request",
      });
    }

    const vendor = vendors[0];

    // -------------------------------------------------
    // CHECK RESET CODE
    // -------------------------------------------------

    if (!vendor.reset_code) {
      await connection.rollback();

      return res.status(400).json({
        message:
          "Invalid or expired reset code",
      });
    }

    // -------------------------------------------------
    // CHECK EXPIRY
    // -------------------------------------------------

    if (
      !vendor.reset_expires_at ||
      new Date() >
        new Date(
          vendor.reset_expires_at
        )
    ) {
      await connection.rollback();

      return res.status(400).json({
        message:
          "Invalid or expired reset code",
      });
    }

    // -------------------------------------------------
    // CHECK OTP
    // -------------------------------------------------

    const hashedOTP =
      hashOTP(otp.toString());

    if (
      hashedOTP !==
      vendor.reset_code
    ) {
      await connection.rollback();

      return res.status(400).json({
        message:
          "Invalid or expired reset code",
      });
    }

    // -------------------------------------------------
    // PREVENT SAME PASSWORD
    // -------------------------------------------------

    const samePassword =
      await bcrypt.compare(
        newPassword,
        vendor.password
      );

    if (samePassword) {
      await connection.rollback();

      return res.status(400).json({
        message:
          "New password must be different from your current password",
      });
    }

    // -------------------------------------------------
    // HASH NEW PASSWORD
    // -------------------------------------------------

    const hashedPassword =
      await bcrypt.hash(
        newPassword,
        12
      );

    // -------------------------------------------------
    // UPDATE PASSWORD
    // -------------------------------------------------

    await connection.execute(
      `
      UPDATE vendors
      SET
        password = ?,
        reset_code = NULL,
        reset_expires_at = NULL
      WHERE id = ?
      `,
      [
        hashedPassword,
        vendor.id,
      ]
    );

    await connection.commit();

    return res.status(200).json({
      success: true,
      message:
        "Password reset successfully. Please login again.",
    });

  } catch (error) {
    try {
      await connection.rollback();
    } catch (rollbackError) {
      console.error(
        "Vendor rollback error:",
        rollbackError
      );
    }

    console.error(
      "VENDOR RESET PASSWORD ERROR:",
      error
    );

    return res.status(500).json({
      message:
        "Failed to reset password",
    });

  } finally {
    connection.release();
  }
};




exports.changePassword = async (
  req,
  res
) => {
  try {
    const {
      currentPassword,
      newPassword,
    } = req.body;

    if (
      !currentPassword ||
      !newPassword
    ) {
      return res.status(400).json({
        message:
          "Current password and new password are required",
      });
    }

    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#]).{8,20}$/;

    if (
      !passwordRegex.test(newPassword)
    ) {
      return res.status(400).json({
        message:
          "Password must be 8-20 characters and contain uppercase, lowercase, number and special character",
      });
    }

    const [vendors] = await pool.execute(
      `
      SELECT
        id,
        password,
        token_version
      FROM vendors
      WHERE id = ?
      LIMIT 1
      `,
      [req.vendor.id]
    );

    if (vendors.length === 0) {
      return res.status(404).json({
        message:
          "Vendor account not found",
      });
    }

    const vendor = vendors[0];

    // -------------------------------------------------
    // CHECK CURRENT PASSWORD
    // -------------------------------------------------

    const valid =
      await bcrypt.compare(
        currentPassword,
        vendor.password
      );

    if (!valid) {
      return res.status(400).json({
        message:
          "Current password is incorrect",
      });
    }

    // -------------------------------------------------
    // PREVENT SAME PASSWORD
    // -------------------------------------------------

    const samePassword =
      await bcrypt.compare(
        newPassword,
        vendor.password
      );

    if (samePassword) {
      return res.status(400).json({
        message:
          "New password must be different from your current password",
      });
    }

    // -------------------------------------------------
    // HASH NEW PASSWORD
    // -------------------------------------------------

    const hashedPassword =
      await bcrypt.hash(
        newPassword,
        12
      );

    // -------------------------------------------------
    // UPDATE + INVALIDATE SESSIONS
    // -------------------------------------------------

    await pool.execute(
      `
      UPDATE vendors
      SET
        password = ?,
        token_version = token_version + 1
      WHERE id = ?
      `,
      [
        hashedPassword,
        vendor.id,
      ]
    );

    return res.status(200).json({
      success: true,
      message:
        "Password changed successfully. Please login again.",
      sessionInvalidated: true,
    });

  } catch (error) {
    console.error(
      "VENDOR CHANGE PASSWORD ERROR:",
      error
    );

    return res.status(500).json({
      message:
        "Failed to change password",
    });
  }
};