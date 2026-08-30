const pool = require("../config/database");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");


const {
    generateOTP,
    hashOTP
} = require("../utils/otp");

const {
    sendVerificationEmail,
    sendPasswordResetEmail
} = require("../services/emailService");



exports.setupDevice = async (req, res) => {
  const connection = await pool.getConnection();

  try {
    const {
      name,
      phone,
      email,
      password,
      location,
      confirm_password,
      imei,
    } = req.body;

    // =====================================================
    // VALIDATION
    // =====================================================

    const nameRegex = /^[A-Za-z\s.'-]{2,100}$/;

    if (!nameRegex.test(name || "")) {
      return res.status(400).json({
        error: "Invalid name",
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

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

    const imeiRegex = /^\d{15}$/;

    if (!imeiRegex.test(imei || "")) {
      return res.status(400).json({
        error: "Invalid IMEI",
      });
    }

    if (password !== confirm_password) {
      return res.status(400).json({
        error: "Passwords do not match",
      });
    }

    // =====================================================
    // START TRANSACTION
    // =====================================================

    await connection.beginTransaction();

    // =====================================================
    // 1. CHECK DEVICE
    // =====================================================

    const [devices] = await connection.execute(
      `
      SELECT *
      FROM devices
      WHERE imei = ?
      LIMIT 1
      `,
      [imei]
    );

    if (devices.length === 0) {
      await connection.rollback();

      return res.status(404).json({
        error: "Device not registered by vendor",
      });
    }

    const device = devices[0];

    // =====================================================
    // 2. CHECK WHETHER DEVICE IS ALREADY REGISTERED
    // =====================================================

    const [existingDevice] = await connection.execute(
      `
      SELECT id
      FROM user_devices
      WHERE device_id = ?
      LIMIT 1
      `,
      [device.id]
    );

    if (existingDevice.length > 0) {
      await connection.rollback();

      return res.status(400).json({
        error: "Device already registered",
      });
    }

    // =====================================================
    // 3. CHECK EMAIL
    // =====================================================

    const [emailExists] = await connection.execute(
      `
      SELECT id
      FROM users
      WHERE email = ?
      LIMIT 1
      `,
      [email]
    );

    if (emailExists.length > 0) {
      await connection.rollback();

      return res.status(400).json({
        error: "Email already exists",
      });
    }

    // =====================================================
    // 4. CHECK PHONE
    // =====================================================

    const [phoneExists] = await connection.execute(
      `
      SELECT id
      FROM users
      WHERE phone = ?
      LIMIT 1
      `,
      [phone]
    );

    if (phoneExists.length > 0) {
      await connection.rollback();

      return res.status(400).json({
        error: "Phone number already exists",
      });
    }

    // =====================================================
    // 5. HASH PASSWORD
    // =====================================================

    const hashedPassword = await bcrypt.hash(
      password,
      12
    );

    // =====================================================
    // 6. GENERATE EMAIL OTP
    // =====================================================

    const otp = generateOTP();

    const hashedOTP = hashOTP(otp);

    const expiresAt = new Date(
      Date.now() + 10 * 60 * 1000
    );

    // =====================================================
    // 7. CREATE USER
    // =====================================================

    const [userResult] = await connection.execute(
      `
     INSERT INTO users
(
  name,
  email,
  phone,
  password,
  email_verified,
  email_verification_code,
  email_verification_expires_at
)
VALUES (?, ?, ?, ?, ?, ?, ?)
      `
      ,
     [
  name,
  email,
  phone,
  hashedPassword,
  false,
  hashedOTP,
  expiresAt,
]
    );

    const userId = userResult.insertId;

    // =====================================================
    // 8. CREATE USER ↔ DEVICE RELATIONSHIP
    // =====================================================

    await connection.execute(
      `
      INSERT INTO user_devices
      (
        user_id,
        device_id,
        location
      )
      VALUES (?, ?, ?)
      `,
      [
        userId,
        device.id,
        location,
      ]
    );

    // =====================================================
    // 9. COMMIT DATABASE TRANSACTION
    // =====================================================

    await connection.commit();

    // =====================================================
    // 10. SEND VERIFICATION EMAIL
    // =====================================================

    try {
      await sendVerificationEmail(
        email,
        name,
        otp
      );
    } catch (emailError) {

      console.error(
        "VERIFICATION EMAIL ERROR:",
        emailError
      );

      /*
       * IMPORTANT:
       *
       * The database transaction has already been
       * committed. Therefore we cannot rollback here.
       *
       * The user can use the resend verification
       * endpoint to get another OTP.
       */

      return res.status(201).json({
        success: true,
        message:
          "Account created, but verification email could not be sent. Please request a new verification code.",
        requiresEmailVerification: true,
        email,
      });
    }

    // =====================================================
    // 11. DO NOT CREATE JWT YET
    // =====================================================

    return res.status(201).json({
      success: true,

      message:
        "Device setup successful. Please check your email for the verification code.",

      requiresEmailVerification: true,

      user: {
        id: userId,
        name,
        email,
        phone,
      },

      device: {
        id: device.id,
        imei: device.imei,
      },
    });

  } catch (err) {

    // =====================================================
    // ROLLBACK IF ANYTHING FAILS
    // =====================================================

    try {
      await connection.rollback();
    } catch (rollbackError) {
      console.error(
        "Rollback error:",
        rollbackError
      );
    }

    console.error(
      "SETUP DEVICE ERROR:",
      err
    );

    return res.status(500).json({
      error: "Failed to setup device",
    });

  } finally {

    connection.release();
  }
};

// exports.setupDevice = async (req, res) => {
//   const connection = await pool.getConnection();

//   try {
//     const {
//       name,
//       phone,
//       email,
//       password,
//       location,
//       confirm_password,
//       imei,
//     } = req.body;

//     // =====================================================
//     // VALIDATION
//     // =====================================================

//     const nameRegex = /^[A-Za-z\s.'-]{2,100}$/;

//     if (!nameRegex.test(name || "")) {
//       return res.status(400).json({
//         error: "Invalid name",
//       });
//     }

//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

//     if (!emailRegex.test(email || "")) {
//       return res.status(400).json({
//         error: "Invalid email",
//       });
//     }

//     const phoneRegex = /^[6-9]\d{9}$/;

//     if (!phoneRegex.test(phone || "")) {
//       return res.status(400).json({
//         error: "Invalid phone number",
//       });
//     }

//     const passwordRegex =
//       /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#]).{8,20}$/;

//     if (!passwordRegex.test(password || "")) {
//       return res.status(400).json({
//         error: "Weak password",
//       });
//     }

//     const imeiRegex = /^\d{15}$/;

//     if (!imeiRegex.test(imei || "")) {
//       return res.status(400).json({
//         error: "Invalid IMEI",
//       });
//     }

//     if (password !== confirm_password) {
//       return res.status(400).json({
//         error: "Passwords do not match",
//       });
//     }

//     // =====================================================
//     // START TRANSACTION
//     // =====================================================

//     await connection.beginTransaction();

//     // =====================================================
//     // 1. CHECK DEVICE
//     // =====================================================

//     const [devices] = await connection.execute(
//       `
//       SELECT *
//       FROM devices
//       WHERE imei = ?
//       LIMIT 1
//       `,
//       [imei]
//     );

//     if (devices.length === 0) {
//       await connection.rollback();

//       return res.status(404).json({
//         error: "Device not registered by vendor",
//       });
//     }

//     const device = devices[0];

//     // =====================================================
//     // 2. CHECK WHETHER DEVICE IS ALREADY REGISTERED
//     // =====================================================

//     const [existingDevice] = await connection.execute(
//       `
//       SELECT id
//       FROM user_devices
//       WHERE device_id = ?
//       LIMIT 1
//       `,
//       [device.id]
//     );

//     if (existingDevice.length > 0) {
//       await connection.rollback();

//       return res.status(400).json({
//         error: "Device already registered",
//       });
//     }

//     // =====================================================
//     // 3. CHECK EMAIL
//     // =====================================================

//     const [emailExists] = await connection.execute(
//       `
//       SELECT id
//       FROM users
//       WHERE email = ?
//       LIMIT 1
//       `,
//       [email]
//     );

//     if (emailExists.length > 0) {
//       await connection.rollback();

//       return res.status(400).json({
//         error: "Email already exists",
//       });
//     }

//     // =====================================================
//     // 4. CHECK PHONE
//     // =====================================================

//     const [phoneExists] = await connection.execute(
//       `
//       SELECT id
//       FROM users
//       WHERE phone = ?
//       LIMIT 1
//       `,
//       [phone]
//     );

//     if (phoneExists.length > 0) {
//       await connection.rollback();

//       return res.status(400).json({
//         error: "Phone number already exists",
//       });
//     }

//     // =====================================================
//     // 5. HASH PASSWORD
//     // =====================================================

//     const hashedPassword = await bcrypt.hash(
//       password,
//       10
//     );

//     // =====================================================
//     // 6. CREATE USER
//     // =====================================================

//     const [userResult] = await connection.execute(
//       `
//       INSERT INTO users
//       (
//         name,
//         email,
//         phone,
//         password
//       )
//       VALUES (?, ?, ?, ?)
//       `,
//       [
//         name,
//         email,
//         phone,
//         hashedPassword,
//       ]
//     );

//     const userId = userResult.insertId;

//     // =====================================================
//     // 7. CREATE USER ↔ DEVICE RELATIONSHIP
//     // =====================================================

//     await connection.execute(
//       `
//       INSERT INTO user_devices
//       (
//         user_id,
//         device_id,
//         location
//       )
//       VALUES (?, ?, ?)
//       `,
//       [
//         userId,
//         device.id,
//         location
//       ]
//     );

//     // =====================================================
//     // 8. EVERYTHING SUCCESSFUL
//     // =====================================================

//     await connection.commit();

//     // =====================================================
//     // 9. CREATE JWT
//     // =====================================================

//     const token = jwt.sign(
//       {
//         id: userId,
//         type: "user",
//       },
//       process.env.JWT_SECRET,
//       {
//         expiresIn: "7d",
//       }
//     );

//     // =====================================================
//     // RESPONSE
//     // =====================================================

//     return res.status(201).json({
//       success: true,
//       message: "Device setup successful",

//       token,

//       user: {
//         id: userId,
//         name,
//         email,
//         phone,
//       },

//       device: {
//         id: device.id,
//         imei: device.imei,
//       },
//     });

//   } catch (err) {

//     // =====================================================
//     // ROLLBACK IF ANYTHING FAILS
//     // =====================================================

//     try {
//       await connection.rollback();
//     } catch (rollbackError) {
//       console.error(
//         "Rollback error:",
//         rollbackError
//       );
//     }

//     console.error(
//       "SETUP DEVICE ERROR:",
//       err
//     );

//     return res.status(500).json({
//       error: "Failed to setup device",
//     });

//   } finally {

//     connection.release();
//   }
// };


exports.login = async (req, res) => {

  try {

    const {
      identifier,
      password,
    } = req.body;

    // const [rows] = await pool.execute(
    //   `SELECT *
    //    FROM users
    //    WHERE
    //      email = ?
    //      OR phone = ?
    //      OR imei = ?`,
    //   [
    //     identifier,
    //     identifier,
    //     identifier,
    //   ]
    // );

//     const [rows] = await pool.execute(
//     `
//     SELECT *
//     FROM users
//     WHERE email = ?
//        OR phone = ?
//     LIMIT 1
//     `,
//     [
//         identifier,
//         identifier
//     ]
// );


const [rows] = await pool.execute(
    `
    SELECT DISTINCT u.*
    FROM users u

    LEFT JOIN user_devices ud
        ON ud.user_id = u.id

    LEFT JOIN devices d
        ON d.id = ud.device_id

    WHERE
        u.email = ?
        OR u.phone = ?
        OR d.imei = ?
    `,
    [
        identifier,
        identifier,
        identifier
    ]
);

    if (rows.length === 0) {

      return res.status(401).json({
        error: "Invalid credentials",
      });
    }

    const user = rows[0];


// =====================================================
// CHECK EMAIL VERIFICATION
// =====================================================

if (!user.email_verified) {
  return res.status(403).json({
    error: "Please verify your email before logging in",
    requiresEmailVerification: true,
  });
}

// =====================================================
// CHECK PASSWORD
// =====================================================


    // compare password
    const valid = await bcrypt.compare(
      password,
      user.password
    );

    if (!valid) {

      return res.status(401).json({
        error: "Invalid credentials",
      });
    }

    console.log("🔍 User from DB:", user);
    console.log("📦 User role:", user.role);

    // JWT token
    // const token = jwt.sign(
    //   {
    //     id: user.id,
    //     //serial_number: user.serial_number,
    //     //role: user.role,
    //     imei: user.imei,
    //   },
    //   process.env.JWT_SECRET,
    //   {
    //     expiresIn: "7d",
    //   }
    // );



    // const token = jwt.sign(
    //   {
    //     id: user.id,
    //     // imei: user.imei,
    //     type: "user"
    //   },
    //   process.env.JWT_SECRET,
    //   {
    //     expiresIn: "7d"
    //   }
    // );


    const token = jwt.sign(
  {
    id: user.id,
    type: "user",
    tokenVersion: user.token_version,
  },
  process.env.JWT_SECRET,
  {
    expiresIn: "7d",
  }
);


    // const token = jwt.sign(
    //   {
    //     id: vendor.id,
    //     type: "vendor"
    //   },
    //   process.env.JWT_SECRET,
    //   {
    //     expiresIn: "7d"
    //   }
    // );


    const responseData = {
      success: true,
      token,
      user: {
        //id: user.id,
        //client_name: user.client_name,
        //email: user.email,
        //phone: user.phone,
        //serial_number: user.serial_number,
        //role: user.role,
        //imei: user.imei,

        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        // imei: user.imei,
        created_at: user.created_at,
      },
    };

    console.log("✅ Sending response:", responseData);

    res.json(responseData);

  } catch (err) {

    res.status(500).json({
      error: err.message,
    });
  }
};




// async function register(req, res) {
//     try {
//         const {
//             name,
//             email,
//             password,
//             phone,
//             imei
//         } = req.body;

//         if (!name || !email || !password) {
//             return res.status(400).json({
//                 message: "Name, email and password are required"
//             });
//         }

//         // Check existing user
//         const [existingUsers] = await pool.execute(
//             `SELECT id, email_verified
//              FROM users
//              WHERE email = ?`,
//             [email]
//         );

//         if (existingUsers.length > 0) {

//             const existingUser = existingUsers[0];

//             if (existingUser.email_verified) {
//                 return res.status(409).json({
//                     message: "Email already registered"
//                 });
//             }

//             // Existing but unverified user
//             const otp = generateOTP();
//             const hashedOTP = hashOTP(otp);

//             const expiresAt = new Date(
//                 Date.now() + 10 * 60 * 1000
//             );

//             await pool.execute(
//                 `UPDATE users
//                  SET email_verification_code = ?,
//                      email_verification_expires_at = ?
//                  WHERE id = ?`,
//                 [
//                     hashedOTP,
//                     expiresAt,
//                     existingUser.id
//                 ]
//             );

//             await sendVerificationEmail(
//                 email,
//                 name,
//                 otp
//             );

//             return res.status(200).json({
//                 message:
//                     "Account exists but email is not verified. A new verification code has been sent."
//             });
//         }

//         // Hash password
//         const hashedPassword = await bcrypt.hash(
//             password,
//             12
//         );

//         // Generate OTP
//         const otp = generateOTP();
//         const hashedOTP = hashOTP(otp);

//         const expiresAt = new Date(
//             Date.now() + 10 * 60 * 1000
//         );

//         // Insert user
//         await pool.execute(
//             `INSERT INTO users
//             (
//                 name,
//                 email,
//                 phone,
//                 password,
//                 imei,
//                 email_verified,
//                 email_verification_code,
//                 email_verification_expires_at
//             )
//             VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
//             [
//                 name,
//                 email,
//                 phone || null,
//                 hashedPassword,
//                 imei || null,
//                 false,
//                 hashedOTP,
//                 expiresAt
//             ]
//         );

//         // Send OTP
//         await sendVerificationEmail(
//             email,
//             name,
//             otp
//         );

//         return res.status(201).json({
//             message:
//                 "Registration successful. Please check your email for the verification code."
//         });

//     } catch (error) {

//         console.error(
//             "REGISTER ERROR:",
//             error
//         );

//         return res.status(500).json({
//             message: "Registration failed"
//         });
//     }
// }





exports.verifyEmail = async (req, res) => {
    try {

        const {
            email,
            otp
        } = req.body;

        if (!email || !otp) {
            return res.status(400).json({
                message: "Email and OTP are required"
            });
        }

        const [users] = await pool.execute(
            `SELECT id,
                    email_verified,
                    email_verification_code,
                    email_verification_expires_at
             FROM users
             WHERE email = ?`,
            [email]
        );

        if (users.length === 0) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        const user = users[0];

        if (user.email_verified) {
            return res.status(400).json({
                message: "Email is already verified"
            });
        }

        if (!user.email_verification_code) {
            return res.status(400).json({
                message: "No verification code found"
            });
        }

        // Check expiry
        if (
            new Date() >
            new Date(user.email_verification_expires_at)
        ) {
            return res.status(400).json({
                message: "Verification code has expired"
            });
        }

        const hashedOTP = hashOTP(
            otp.toString()
        );

        if (
            hashedOTP !==
            user.email_verification_code
        ) {
            return res.status(400).json({
                message: "Invalid verification code"
            });
        }

        // Verify email
        await pool.execute(
            `UPDATE users
             SET email_verified = TRUE,
                 email_verification_code = NULL,
                 email_verification_expires_at = NULL
             WHERE id = ?`,
            [user.id]
        );

        return res.status(200).json({
            message: "Email verified successfully"
        });

    } catch (error) {

        console.error(
            "VERIFY EMAIL ERROR:",
            error
        );

        return res.status(500).json({
            message: "Email verification failed"
        });
    }
}




exports.resendVerificationCode = async (req, res) => {
      try {

        const { email } = req.body;

        if (!email) {
            return res.status(400).json({
                message: "Email is required"
            });
        }

        const [users] = await pool.execute(
            `SELECT id,
                    name,
                    email_verified
             FROM users
             WHERE email = ?`,
            [email]
        );

        if (users.length === 0) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        const user = users[0];

        if (user.email_verified) {
            return res.status(400).json({
                message: "Email is already verified"
            });
        }

        const otp = generateOTP();
        const hashedOTP = hashOTP(otp);

        const expiresAt = new Date(
            Date.now() + 10 * 60 * 1000
        );

        await pool.execute(
            `UPDATE users
             SET email_verification_code = ?,
                 email_verification_expires_at = ?
             WHERE id = ?`,
            [
                hashedOTP,
                expiresAt,
                user.id
            ]
        );

        await sendVerificationEmail(
            email,
            user.name,
            otp
        );

        return res.status(200).json({
            message:
                "A new verification code has been sent"
        });

    } catch (error) {

        console.error(
            "RESEND VERIFICATION ERROR:",
            error
        );

        return res.status(500).json({
            message: "Failed to resend verification code"
        });
    }
}



// exports.forgotPassword = async (req, res) => {
//       try {

//         const { email } = req.body;

//         if (!email) {
//             return res.status(400).json({
//                 message: "Email is required"
//             });
//         }

//         const [users] = await pool.execute(
//             `SELECT id,
//                     name,
//                     email,
//                     email_verified
//              FROM users
//              WHERE email = ?`,
//             [email]
//         );

//         /*
//          * Don't reveal whether an email exists.
//          */
//         if (users.length === 0) {
//             return res.status(200).json({
//                 message:
//                     "If the email exists, a password reset code has been sent."
//             });
//         }

//         const user = users[0];

//         if (!user.email_verified) {
//             return res.status(400).json({
//                 message:
//                     "Please verify your email before resetting your password"
//             });
//         }

//         const otp = generateOTP();
//         const hashedOTP = hashOTP(otp);

//         const expiresAt = new Date(
//             Date.now() + 10 * 60 * 1000
//         );

//         await pool.execute(
//             `UPDATE users
//              SET password_reset_code = ?,
//                  password_reset_expires_at = ?
//              WHERE id = ?`,
//             [
//                 hashedOTP,
//                 expiresAt,
//                 user.id
//             ]
//         );

//         await sendPasswordResetEmail(
//             user.email,
//             user.name,
//             otp
//         );

//         return res.status(200).json({
//             message:
//                 "If the email exists, a password reset code has been sent."
//         });

//     } catch (error) {

//         console.error(
//             "FORGOT PASSWORD ERROR:",
//             error
//         );

//         return res.status(500).json({
//             message: "Failed to process password reset"
//         });
//     }
// }


exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        message: "Email is required",
      });
    }

    const normalizedEmail =
      email.trim().toLowerCase();

    const [users] = await pool.execute(
      `
      SELECT
        id,
        name,
        email,
        email_verified
      FROM users
      WHERE email = ?
      LIMIT 1
      `,
      [normalizedEmail]
    );

    /*
     * Always return the same response whether
     * the email exists or not.
     *
     * This prevents account enumeration.
     */
    if (users.length === 0) {
      return res.status(200).json({
        message:
          "If the email exists, a password reset code has been sent.",
      });
    }

    const user = users[0];

    /*
     * Don't allow password reset until
     * email ownership has been verified.
     */
    if (!user.email_verified) {
      return res.status(200).json({
        message:
          "If the email exists, a password reset code has been sent.",
      });
    }

    const otp = generateOTP();

    const hashedOTP = hashOTP(
      otp.toString()
    );

    const expiresAt = new Date(
      Date.now() + 10 * 60 * 1000
    );

    await pool.execute(
      `
      UPDATE users
      SET
        password_reset_code = ?,
        password_reset_expires_at = ?
      WHERE id = ?
      `,
      [
        hashedOTP,
        expiresAt,
        user.id,
      ]
    );

    try {
      await sendPasswordResetEmail(
        user.email,
        user.name,
        otp
      );
    } catch (emailError) {
      console.error(
        "PASSWORD RESET EMAIL ERROR:",
        emailError
      );

      /*
       * Remove the reset code if the email
       * could not be sent.
       */
      await pool.execute(
        `
        UPDATE users
        SET
          password_reset_code = NULL,
          password_reset_expires_at = NULL
        WHERE id = ?
        `,
        [user.id]
      );

      /*
       * Don't expose internal email-service errors.
       */
      return res.status(500).json({
        message:
          "Unable to process password reset request",
      });
    }

    return res.status(200).json({
      message:
        "If the email exists, a password reset code has been sent.",
    });

  } catch (error) {
    console.error(
      "FORGOT PASSWORD ERROR:",
      error
    );

    return res.status(500).json({
      message:
        "Unable to process password reset request",
    });
  }
};


// exports.resetPassword = async (req, res) => {
//       try {

//         const {
//             email,
//             otp,
//             newPassword
//         } = req.body;

//         if (
//             !email ||
//             !otp ||
//             !newPassword
//         ) {
//             return res.status(400).json({
//                 message:
//                     "Email, OTP and new password are required"
//             });
//         }

//         // if (newPassword.length < 8) {
//         //     return res.status(400).json({
//         //         message:
//         //             "Password must be at least 8 characters"
//         //     });
//         // }

//         const passwordRegex =
//     /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#]).{8,20}$/;

// if (!passwordRegex.test(newPassword || "")) {
//     return res.status(400).json({
//         message:
//             "Password must be 8-20 characters and contain uppercase, lowercase, number and special character"
//     });
// }

//         const [users] = await pool.execute(
//             `SELECT id,
//                     password_reset_code,
//                     password_reset_expires_at
//              FROM users
//              WHERE email = ?`,
//             [email]
//         );

//         if (users.length === 0) {
//             return res.status(400).json({
//                 message: "Invalid reset request"
//             });
//         }

//         const user = users[0];

//         if (!user.password_reset_code) {
//             return res.status(400).json({
//                 message:
//                     "No password reset code found"
//             });
//         }

//         // Check expiry
//         if (
//             new Date() >
//             new Date(user.password_reset_expires_at)
//         ) {
//             return res.status(400).json({
//                 message:
//                     "Password reset code has expired"
//             });
//         }

//         const hashedOTP = hashOTP(
//             otp.toString()
//         );

//         if (
//             hashedOTP !==
//             user.password_reset_code
//         ) {
//             return res.status(400).json({
//                 message:
//                     "Invalid password reset code"
//             });
//         }

//         // Hash new password
//         const hashedPassword =
//             await bcrypt.hash(
//                 newPassword,
//                 12
//             );

//         await pool.execute(
//             `UPDATE users
//              SET password = ?,
//                  password_reset_code = NULL,
//                  password_reset_expires_at = NULL
//              WHERE id = ?`,
//             [
//                 hashedPassword,
//                 user.id
//             ]
//         );

//         return res.status(200).json({
//             message:
//                 "Password reset successfully"
//         });

//     } catch (error) {

//         console.error(
//             "RESET PASSWORD ERROR:",
//             error
//         );

//         return res.status(500).json({
//             message:
//                 "Failed to reset password"
//         });
//     }
// }


exports.resetPassword = async (req, res) => {
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

    /*
     * Password policy
     */
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

    /*
     * Lock the user row while resetting
     * the password.
     */
    const [users] =
      await connection.execute(
        `
        SELECT
          id,
          password,
          password_reset_code,
          password_reset_expires_at,
          token_version
        FROM users
        WHERE email = ?
        LIMIT 1
        FOR UPDATE
        `,
        [normalizedEmail]
      );

    if (users.length === 0) {
      await connection.rollback();

      return res.status(400).json({
        message:
          "Invalid reset request",
      });
    }

    const user = users[0];

    /*
     * Check whether reset OTP exists.
     */
    if (
      !user.password_reset_code
    ) {
      await connection.rollback();

      return res.status(400).json({
        message:
          "Invalid or expired reset code",
      });
    }

    /*
     * Check expiration.
     */
    if (
      !user.password_reset_expires_at ||
      new Date() >
        new Date(
          user.password_reset_expires_at
        )
    ) {
      await connection.rollback();

      return res.status(400).json({
        message:
          "Invalid or expired reset code",
      });
    }

    /*
     * Hash supplied OTP.
     */
    const hashedOTP =
      hashOTP(
        otp.toString()
      );

    /*
     * Compare hashed OTP.
     */
    if (
      hashedOTP !==
      user.password_reset_code
    ) {
      await connection.rollback();

      return res.status(400).json({
        message:
          "Invalid or expired reset code",
      });
    }

    /*
     * Prevent user from reusing
     * the current password.
     */
    const samePassword =
      await bcrypt.compare(
        newPassword,
        user.password
      );

    if (samePassword) {
      await connection.rollback();

      return res.status(400).json({
        message:
          "New password must be different from your current password",
      });
    }

    /*
     * Hash new password.
     */
    const hashedPassword =
      await bcrypt.hash(
        newPassword,
        12
      );

    /*
     * IMPORTANT:
     *
     * Increment token_version.
     *
     * Every JWT issued before this reset
     * contains the previous tokenVersion.
     *
     * Therefore all existing sessions
     * become invalid.
     */
    await connection.execute(
      `
      UPDATE users
      SET
        password = ?,
        password_reset_code = NULL,
        password_reset_expires_at = NULL,
        token_version = token_version + 1
      WHERE id = ?
      `,
      [
        hashedPassword,
        user.id,
      ]
    );

    await connection.commit();

    return res.status(200).json({
      success: true,
      message:
        "Password reset successfully. Please login again.",
      sessionInvalidated: true,
    });

  } catch (error) {

    try {
      await connection.rollback();
    } catch (rollbackError) {
      console.error(
        "Rollback error:",
        rollbackError
      );
    }

    console.error(
      "RESET PASSWORD ERROR:",
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