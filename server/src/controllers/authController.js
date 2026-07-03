// FILE FOR USER SETUP AND LOGIN


const pool = require("../config/database");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.setupDevice = async (req, res) => {

  try {

    const {
      //serial_number,
      name,
      phone,
      email,
      password,
      confirm_password,
      imei,
      solution 
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
       WHERE imei = ?`,
      [imei]
    );

    if (devices.length === 0) {

      return res.status(404).json({
        error:
          //"Device does not exist",
          "Device not registered by vendor",
      });
    }

    // already registered?
    const [existingUser] = await pool.execute(
      `SELECT *
       FROM users
       WHERE imei = ?`,
      [imei]
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
    // await pool.execute(
    //   `INSERT INTO users
    //   (
    //     serial_number,
    //     client_name,
    //     email,
    //     phone,
    //     password,
    //     role,
    //     imei
    //   )
    //   VALUES (?, ?, ?, ?, ?, ?, ?)`,
    //   [
    //     serial_number,
    //     client_name,
    //     email,
    //     phone,
    //     hashedPassword,
    //     role,
    //     imei
    //   ]
    // );

    // await pool.execute(
    //   `INSERT INTO users
    //   (
    //     client_name,
    //     email,
    //     phone,
    //     password,
    //     imei
    //   )
    //   VALUES (?, ?, ?, ?, ?)`,
    //   [
    //     client_name,
    //     email,
    //     phone,
    //     hashedPassword,
    //     imei
    //   ]
    // );


    await pool.execute(
      `INSERT INTO users
      (
        name,
    email,
    phone,
    password,
    imei,
    solution 
      )
      VALUES (?, ?, ?, ?, ?, ?)`,
      [
        name,
        email,
        phone,
        hashedPassword,
        imei,
        solution ?? null
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
         OR imei = ?`,
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
        imei: user.imei,
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
        imei: user.imei,
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