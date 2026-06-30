const pool = require("../config/database");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.login = async (req,res) => {

  const { email,password } = req.body;

  const [rows] = await pool.execute(
    `SELECT * FROM vendors WHERE email=?`,
    [email]
  );

  if(rows.length === 0){
    return res.status(401).json({
      error:"Invalid credentials"
    });
  }

  const vendor = rows[0];

  const valid = await bcrypt.compare(
    password,
    vendor.password
  );

  if(!valid){
    return res.status(401).json({
      error:"Invalid credentials"
    });
  }

  const token = jwt.sign(
    {
      id: vendor.id,
      type: "vendor"
    },
    process.env.JWT_SECRET,
    {
      expiresIn:"7d"
    }
  );

  res.json({
    token,
    vendor
  });

};

exports.register = async (req, res) => {

  const {
    name,
    email,
    phone,
    password
  } = req.body;
  const nameRegex = /^[A-Za-z\s.'-]{2,100}$/;

    if (!nameRegex.test(name)) {
        return res.status(400).json({
            error: "Invalid name"
        });
    }

    // Email
    const emailRegex =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
        return res.status(400).json({
            error: "Invalid email"
        });
    }

    // Phone
    const phoneRegex = /^[6-9]\d{9}$/;

    if (!phoneRegex.test(phone)) {
        return res.status(400).json({
            error: "Invalid phone number"
        });
    }

    // Password
    const passwordRegex =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#]).{8,20}$/;

    if (!passwordRegex.test(password)) {
        return res.status(400).json({
            error: "Weak password"
        });
    }

  const hash =
    await bcrypt.hash(
      password,
      10
    );

  await pool.execute(
    `
    INSERT INTO vendors
    (
      name,
      email,
      phone,
      password
    )
    VALUES
    (?, ?, ?, ?)
    `,
    [
      name,
      email,
      phone,
      hash
    ]
  );

  res.json({
    success: true
  });
};