const pool = require("../config/database");
const { decrypt } = require("../utils/encryption");

// =====================================================
// ADMIN LATEST MESSAGE
//
// Devices are looked up by id only, with no account owner
// scoping, since admin can see every device.
// =====================================================
exports.getAdminLatestMessage = async (req, res) => {
  try {
    const deviceId = req.params.id;

    const [devices] = await pool.execute(
      `
          SELECT *
          FROM devices
          WHERE id = ?
          `,
      [deviceId],
    );

    if (devices.length === 0) {
      return res.status(404).json({
        error: "Device not found",
      });
    }

    const imei = devices[0].imei;

    const [rows] = await pool.execute(
      `
SELECT
    payload,
    iv,
    auth_tag,
    created_at
FROM messages
WHERE imei = ?
ORDER BY created_at DESC
LIMIT 1
`,
      [imei],
    );

    if (rows.length === 0) {
      return res.status(404).json({
        error: "No data found",
      });
    }

    const decrypted = decrypt(rows[0].payload, rows[0].iv, rows[0].auth_tag);

    const parsed = JSON.parse(decrypted);

    parsed.created_at = rows[0].created_at;

    return res.json(parsed);
  } catch (err) {
    console.error("==========================");
    console.error(err);
    console.error(err.stack);
    console.error("==========================");

    return res.status(500).json({
      error: err.message,
      stack: err.stack,
    });
  }
};

exports.getLatestMessage = async (req, res) => {
  try {
    // ============================================
    // PUBLIC — no login. Device is identified by IMEI
    // directly (no more user_devices ownership check).
    // ============================================

    const imei = String(req.query.imei || "").trim();

    if (!/^\d{15}$/.test(imei)) {
      return res.status(400).json({
        error: "Invalid imei",
      });
    }

    // ============================================
    // GET LATEST MESSAGE
    // ============================================

    const [rows] = await pool.execute(
      `
                SELECT
                    payload,
                    iv,
                    auth_tag,
                    created_at

                FROM messages

                WHERE imei = ?

                ORDER BY created_at DESC

                LIMIT 1
                `,
      [imei],
    );

    if (rows.length === 0) {
      return res.status(404).json({
        error: "No data found",
      });
    }

    // ============================================
    // DECRYPT
    // ============================================

    let parsed;

    if (rows[0].iv && rows[0].auth_tag) {
      const decrypted = decrypt(rows[0].payload, rows[0].iv, rows[0].auth_tag);

      parsed = JSON.parse(decrypted);
    } else {
      parsed = JSON.parse(rows[0].payload);
    }

    // ============================================
    // RESPONSE
    // ============================================

    return res.json({
      payload: parsed,

      created_at: rows[0].created_at,
    });
  } catch (err) {
    console.error("GET LATEST MESSAGE ERROR:", err);

    return res.status(500).json({
      error: "Failed to fetch latest device data",
    });
  }
};
