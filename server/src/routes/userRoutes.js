const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const pool = require("../config/database");

// GET USER PROFILE
router.get(
  // "/profile/:serialNumber",
  //"/profile/:imei",
  
  "/profile",
  auth,
  async (req, res) => {
    try {

      

      //const { imei } = req.params;

        const imei = req.user.imei;

      console.log("🔍 Fetching profile for imei:", imei);

      const [rows] =


        await pool.execute(
          `
          SELECT 
            u.name,
            u.email,
            u.phone,
            u.created_at,
            d.imei
          FROM users u
          LEFT JOIN devices d
            ON u.imei =
               d.imei
          WHERE u.imei = ?
          `,
          [imei]
        );

      console.log("📊 Query result:", rows);

      if (rows.length === 0) {
        console.log("⚠️ No user found for imei:", imei);
        return res.status(404).json({
          message: "User not found",
        });
      }

      console.log("✅ Returning user data:", rows[0]);
      res.json(rows[0]);

    } catch (err) {

      console.error("❌ Profile error:", err);

      res.status(500).json({
        message: "Server error",
      });
    }
  }
);

module.exports = router;