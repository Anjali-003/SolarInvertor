const pool = require("../config/database");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");


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
      VALUES (?, ?, ?)
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