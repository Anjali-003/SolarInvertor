const pool = require("../config/database");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.login = async (req,res) => {

  const { login,password } = req.body;

  const [rows] = await pool.execute(
    `SELECT * FROM vendors WHERE email=? OR phone = ?`,
    [login, login]
  );

  if(rows.length === 0){
    return res.status(401).json({
      error:"Invalid credentials"
    });
  }

  const vendor = rows[0];

  if (vendor.status === "pending") {
    return res.status(403).json({
      error:
        "Your account is awaiting admin approval."
    });
  }

  if (vendor.status === "rejected") {
    return res.status(403).json({
      error:
        "Your registration request has been rejected."
    });
  }

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
      password,
      status
    )
    VALUES
    (?, ?, ?, ?, ?)
    `,
    [
      name,
      email,
      phone,
      hash,
      "pending"
    ]
  );

  res.json({
    success: true,
    message:
      "Registration submitted successfully. Your account is awaiting admin approval."
  });
};