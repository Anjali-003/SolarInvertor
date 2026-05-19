const pool = require("../config/database");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");


// // REGISTER
// exports.register = async (req, res) => {
//   try {
//     const {
//       device_serial,
//       client_name,
//       email,
//       phone,
//       password,
//     } = req.body;

//     // check existing user
//     const [existing] = await pool.execute(
//       "SELECT * FROM users WHERE email = ?",
//       [email]
//     );

//     if (existing.length > 0) {
//       return res.status(400).json({
//         error: "User already exists",
//       });
//     }

//     // hash password
//     const hashedPassword = await bcrypt.hash(password, 10);

//     // insert user
//     await pool.execute(
//       `INSERT INTO users
//       (device_serial, client_name, email, phone, password)
//       VALUES (?, ?, ?, ?, ?)`,
//       [
//         device_serial,
//         client_name,
//         email,
//         phone,
//         hashedPassword,
//       ]
//     );

//     res.json({
//       success: true,
//       message: "User registered successfully",
//     });

//   } catch (err) {
//     res.status(500).json({
//       error: err.message,
//     });
//   }
// };

exports.setupDevice = async (req, res) => {

  try {

    const {
      serial_number,
      client_name,
      phone,
      email,
      password,
      confirm_password,
    } = req.body;

    // passwords match
    if (password !== confirm_password) {

      return res.status(400).json({
        error: "Passwords do not match",
      });
    }

    // device exists?
    const [devices] = await pool.execute(
      `SELECT *
       FROM devices
       WHERE serial_number = ?`,
      [serial_number]
    );

    if (devices.length === 0) {

      return res.status(404).json({
        error: "Device does not exist",
      });
    }

    // already registered?
    const [existingUser] = await pool.execute(
      `SELECT *
       FROM users
       WHERE serial_number = ?`,
      [serial_number]
    );

    if (existingUser.length > 0) {

      return res.status(400).json({
        error: "Device already registered",
      });
    }

    // email exists?
    const [emailExists] = await pool.execute(
      `SELECT *
       FROM users
       WHERE email = ?`,
      [email]
    );

    if (emailExists.length > 0) {

      return res.status(400).json({
        error: "Email already exists",
      });
    }

    // hash password
    const hashedPassword =
      await bcrypt.hash(password, 10);

    // insert user
    await pool.execute(
      `INSERT INTO users
      (
        serial_number,
        client_name,
        email,
        phone,
        password
      )
      VALUES (?, ?, ?, ?, ?)`,
      [
        serial_number,
        client_name,
        email,
        phone,
        hashedPassword,
      ]
    );

    res.json({
      success: true,
      message: "Device setup successful",
    });

  } catch (err) {

    res.status(500).json({
      error: err.message,
    });
  }
};




// LOGIN
// exports.login = async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     const [rows] = await pool.execute(
//       "SELECT * FROM users WHERE email = ?",
//       [email]
//     );

//     if (rows.length === 0) {
//       return res.status(401).json({
//         error: "Invalid credentials",
//       });
//     }

//     const user = rows[0];

//     // compare password
//     const valid = await bcrypt.compare(
//       password,
//       user.password
//     );

//     if (!valid) {
//       return res.status(401).json({
//         error: "Invalid credentials",
//       });
//     }

//     // create token
//     const token = jwt.sign(
//       {
//         id: user.id,
//         email: user.email,
//         serial_number: user.serial_number,

//       },
//       process.env.JWT_SECRET,
//       {
//         expiresIn: "7d",
//       }
//     );

//     res.json({
//       success: true,
//       token,
//       user: {
//         id: user.id,
//         client_name: user.client_name,
//         email: user.email,
//         device_serial: user.device_serial,
//       },
//     });

//   } catch (err) {
//     res.status(500).json({
//       error: err.message,
//     });
//   }
// };


exports.login = async (req, res) => {

  try {

    const {
      identifier,
      password,
    } = req.body;

    const [rows] = await pool.execute(
      `SELECT *
       FROM users
       WHERE
         email = ?
         OR phone = ?
         OR serial_number = ?`,
      [
        identifier,
        identifier,
        identifier,
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

    // JWT token
    const token = jwt.sign(
      {
        id: user.id,
        serial_number: user.serial_number,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    res.json({
      success: true,
      token,

      user: {
        id: user.id,
        client_name:
          user.client_name,
        email: user.email,
        phone: user.phone,
        serial_number:
          user.serial_number
,
      },
    });

  } catch (err) {

    res.status(500).json({
      error: err.message,
    });
  }
};