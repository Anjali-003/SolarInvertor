// FILE FOR USER SETUP AND LOGIN


// const pool = require("../config/database");
// const bcrypt = require("bcryptjs");
// const jwt = require("jsonwebtoken");

// exports.setupDevice = async (req, res) => {

//   try {

//     const {
//       //serial_number,
//       name,
//       phone,
//       email,
//       password,
//       confirm_password,
//       imei,
//       // solution
//     } = req.body;

//     const nameRegex = /^[A-Za-z\s.'-]{2,100}$/;

//     if (!nameRegex.test(name)) {
//       return res.status(400).json({
//         error: "Invalid name"
//       });
//     }

//     // Email
//     const emailRegex =
//       /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

//     if (!emailRegex.test(email)) {
//       return res.status(400).json({
//         error: "Invalid email"
//       });
//     }

//     // Phone
//     const phoneRegex = /^[6-9]\d{9}$/;

//     if (!phoneRegex.test(phone)) {
//       return res.status(400).json({
//         error: "Invalid phone number"
//       });
//     }

//     // Password
//     const passwordRegex =
//       /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#]).{8,20}$/;

//     if (!passwordRegex.test(password)) {
//       return res.status(400).json({
//         error: "Weak password"
//       });
//     }

//     const imeiRegex = /^\d{15}$/;

//     if (!imeiRegex.test(imei)) {
//       return res.status(400).json({
//         error: "Invalid IMEI."
//       });
//     }

//     // passwords match
//     if (password !== confirm_password) {

//       return res.status(400).json({
//         error: "Passwords do not match",
//       });
//     }

//     // device exists?
//     const [devices] = await pool.execute(
//       `SELECT *
//        FROM devices
//        WHERE imei = ?`,
//       [imei]
//     );

//     if (devices.length === 0) {

//       return res.status(404).json({
//         error:
//           //"Device does not exist",
//           "Device not registered by vendor",
//       });
//     }

//     // already registered?
//     const [existingUser] = await pool.execute(
//       `SELECT *
//        FROM users
//        WHERE imei = ?`,
//       [imei]
//     );

//     if (existingUser.length > 0) {

//       return res.status(400).json({
//         error: "Device already registered",
//       });
//     }

//     // email exists?
//     const [emailExists] = await pool.execute(
//       `SELECT *
//        FROM users
//        WHERE email = ?`,
//       [email]
//     );

//     if (emailExists.length > 0) {

//       return res.status(400).json({
//         error: "Email already exists",
//       });
//     }

//     // hash password
//     const hashedPassword =
//       await bcrypt.hash(password, 10);

//     // insert user
//     // await pool.execute(
//     //   `INSERT INTO users
//     //   (
//     //     serial_number,
//     //     client_name,
//     //     email,
//     //     phone,
//     //     password,
//     //     role,
//     //     imei
//     //   )
//     //   VALUES (?, ?, ?, ?, ?, ?, ?)`,
//     //   [
//     //     serial_number,
//     //     client_name,
//     //     email,
//     //     phone,
//     //     hashedPassword,
//     //     role,
//     //     imei
//     //   ]
//     // );

//     // await pool.execute(
//     //   `INSERT INTO users
//     //   (
//     //     client_name,
//     //     email,
//     //     phone,
//     //     password,
//     //     imei
//     //   )
//     //   VALUES (?, ?, ?, ?, ?)`,
//     //   [
//     //     client_name,
//     //     email,
//     //     phone,
//     //     hashedPassword,
//     //     imei
//     //   ]
//     // );


//     // await pool.execute(
//     //   `INSERT INTO users
//     //   (
//     //     name,
//     // email,
//     // phone,
//     // password,
//     // imei
//     //   )
//     //   VALUES (?, ?, ?, ?, ?)`,
//     //   [
//     //     name,
//     //     email,
//     //     phone,
//     //     hashedPassword,
//     //     imei,
//     //     // solution
//     //   ]
//     // );

//     // res.json({
//     //   success: true,
//     //   message: "Device setup successful",
//     // });


//     const [result] = await pool.execute(
//       `INSERT INTO users
//   (
//     name,
//     email,
//     phone,
//     password,
//     imei
//   )
//   VALUES (?, ?, ?, ?, ?)`,
//       [
//         name,
//         email,
//         phone,
//         hashedPassword,
//         imei
//       ]
//     );

//     const token = jwt.sign(
//       {
//         id: result.insertId,
//         imei,
//         type: "user"
//       },
//       process.env.JWT_SECRET,
//       {
//         expiresIn: "7d"
//       }
//     );

//     res.json({
//       success: true,
//       token,
//       user: {
//         id: result.insertId,
//         name,
//         email,
//         phone,
//         imei
//       }
//     });

//   } catch (err) {

//     res.status(500).json({
//       error: err.message,
//     });
//   }
// };



const pool = require("../config/database");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// exports.setupDevice = async (req, res) => {
//     let connection;

//     try {
//         const {
//             name,
//             phone,
//             email,
//             password,
//             confirm_password,
//             imei
//         } = req.body;


//         // =====================================================
//         // VALIDATION
//         // =====================================================

//         const nameRegex = /^[A-Za-z\s.'-]{2,100}$/;

//         if (!nameRegex.test(name || "")) {
//             return res.status(400).json({
//                 error: "Invalid name"
//             });
//         }


//         const emailRegex =
//             /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

//         if (!emailRegex.test(email || "")) {
//             return res.status(400).json({
//                 error: "Invalid email"
//             });
//         }


//         const phoneRegex = /^[6-9]\d{9}$/;

//         if (!phoneRegex.test(phone || "")) {
//             return res.status(400).json({
//                 error: "Invalid phone number"
//             });
//         }


//         const passwordRegex =
//             /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#]).{8,20}$/;

//         if (!passwordRegex.test(password || "")) {
//             return res.status(400).json({
//                 error: "Weak password"
//             });
//         }


//         const imeiRegex = /^\d{15}$/;

//         if (!imeiRegex.test(imei || "")) {
//             return res.status(400).json({
//                 error: "Invalid IMEI"
//             });
//         }


//         if (password !== confirm_password) {
//             return res.status(400).json({
//                 error: "Passwords do not match"
//             });
//         }


//         // =====================================================
//         // CHECK DEVICE
//         // =====================================================

//         /*
//          * We intentionally check ONLY devices here.
//          *
//          * If the vendor has not registered this device,
//          * setup must fail.
//          */

//         const [devices] = await pool.execute(
//             `
//             SELECT *
//             FROM devices
//             WHERE imei = ?
//             LIMIT 1
//             `,
//             [imei]
//         );


//         if (devices.length === 0) {
//             return res.status(404).json({
//                 error: "Device not registered by vendor"
//             });
//         }


//         const device = devices[0];


//         // =====================================================
//         // CHECK IF DEVICE IS ALREADY ASSIGNED
//         // =====================================================

//         const [assignedDevices] = await pool.execute(
//             `
//             SELECT user_id
//             FROM user_devices
//             WHERE device_id = ?
//             LIMIT 1
//             `,
//             [device.id]
//         );


//         if (assignedDevices.length > 0) {
//             return res.status(400).json({
//                 error: "Device already registered"
//             });
//         }


//         // =====================================================
//         // CHECK EMAIL
//         // =====================================================

//         const [emailExists] = await pool.execute(
//             `
//             SELECT id
//             FROM users
//             WHERE email = ?
//             LIMIT 1
//             `,
//             [email]
//         );


//         if (emailExists.length > 0) {
//             return res.status(400).json({
//                 error: "Email already exists"
//             });
//         }


//         // =====================================================
//         // CHECK PHONE
//         // =====================================================

//         const [phoneExists] = await pool.execute(
//             `
//             SELECT id
//             FROM users
//             WHERE phone = ?
//             LIMIT 1
//             `,
//             [phone]
//         );


//         if (phoneExists.length > 0) {
//             return res.status(400).json({
//                 error: "Phone number already exists"
//             });
//         }


//         // =====================================================
//         // HASH PASSWORD
//         // =====================================================

//         const hashedPassword =
//             await bcrypt.hash(password, 10);


//         // =====================================================
//         // START TRANSACTION
//         // =====================================================

//         connection = await pool.getConnection();

//         await connection.beginTransaction();


//         // =====================================================
//         // CREATE USER
//         // =====================================================

//         const [userResult] = await connection.execute(
//             `
//             INSERT INTO users
//             (
//                 name,
//                 email,
//                 phone,
//                 password
//             )
//             VALUES (?, ?, ?, ?)
//             `,
//             [
//                 name,
//                 email,
//                 phone,
//                 hashedPassword
//             ]
//         );


//         const userId = userResult.insertId;


//         // =====================================================
//         // ASSIGN DEVICE TO USER
//         // =====================================================

//         await connection.execute(
//             `
//             INSERT INTO user_devices
//             (
//                 user_id,
//                 device_id
//             )
//             VALUES (?, ?)
//             `,
//             [
//                 userId,
//                 device.id
//             ]
//         );


//         // =====================================================
//         // COMMIT
//         // =====================================================

//         await connection.commit();


//         // =====================================================
//         // CREATE JWT
//         // =====================================================

//         const token = jwt.sign(
//             {
//                 id: userId,
//                 type: "user"
//             },
//             process.env.JWT_SECRET,
//             {
//                 expiresIn: "7d"
//             }
//         );


//         // =====================================================
//         // RESPONSE
//         // =====================================================

//         return res.json({
//             success: true,
//             message: "Device setup successful",

//             token,

//             user: {
//                 id: userId,
//                 name,
//                 email,
//                 phone
//             },

//             device: {
//                 id: device.id,
//                 imei: device.imei
//             }
//         });


//     } catch (err) {

//         // =====================================================
//         // ROLLBACK
//         // =====================================================

//         if (connection) {
//             try {
//                 await connection.rollback();
//             } catch (rollbackError) {
//                 console.error(
//                     "Rollback error:",
//                     rollbackError
//                 );
//             }
//         }


//         console.error(
//             "SETUP DEVICE ERROR:",
//             err
//         );


//         return res.status(500).json({
//             error: "Failed to setup device"
//         });


//     } finally {

//         // =====================================================
//         // RELEASE CONNECTION
//         // =====================================================

//         if (connection) {
//             connection.release();
//         }
//     }
// };




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
        error: "Weak password",
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
      10
    );

    // =====================================================
    // 6. CREATE USER
    // =====================================================

    const [userResult] = await connection.execute(
      `
      INSERT INTO users
      (
        name,
        email,
        phone,
        password
      )
      VALUES (?, ?, ?, ?)
      `,
      [
        name,
        email,
        phone,
        hashedPassword,
      ]
    );

    const userId = userResult.insertId;

    // =====================================================
    // 7. CREATE USER ↔ DEVICE RELATIONSHIP
    // =====================================================

    await connection.execute(
      `
      INSERT INTO user_devices
      (
        user_id,
        device_id,
        location
      )
      VALUES (?, ?)
      `,
      [
        userId,
        device.id,
        location
      ]
    );

    // =====================================================
    // 8. EVERYTHING SUCCESSFUL
    // =====================================================

    await connection.commit();

    // =====================================================
    // 9. CREATE JWT
    // =====================================================

    const token = jwt.sign(
      {
        id: userId,
        type: "user",
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    // =====================================================
    // RESPONSE
    // =====================================================

    return res.status(201).json({
      success: true,
      message: "Device setup successful",

      token,

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



    const token = jwt.sign(
      {
        id: user.id,
        // imei: user.imei,
        type: "user"
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d"
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