const pool = require("../config/database");
const { decrypt } = require("../utils/encryption");


// Get all devices list for the logged-in vendor
exports.getVendorDevices = async (req, res) => {
    try {

        const vendorId = req.vendor.id;


        const [devices] = await pool.execute(
            `
SELECT
  id,
  imei,
  solution
FROM devices
WHERE vendor_id = ?
ORDER BY id DESC
`,
            [vendorId]
        );

        res.json(devices);

    } catch (err) {

        console.error(err);

        res.status(500).json({
            error: err.message
        });

    }
};

// To get details of a specific device for the logged-in vendor 
exports.getDeviceDetails = async (req, res) => {

    try {

        const vendorId = req.vendor.id;

        const { id } = req.params;

        const [rows] = await pool.execute(
            `
      SELECT *
      FROM devices
      WHERE id = ?
      AND vendor_id = ?
      `,
            [id, vendorId]
        );

        if (rows.length === 0) {

            return res.status(404).json({
                error: "Device not found"
            });

        }

        res.json(rows[0]);

    } catch (err) {

        res.status(500).json({
            error: err.message
        });

    }

};



// ... your existing getVendorDevices and getDeviceDetails stay as-is ...

// Get device info + latest telemetry combined, for the vendor device details page
exports.getVendorDeviceDetails = async (req, res) => {
    try {
        const vendorId = req.vendor.id;
        const { id } = req.params;

        // 1. Get the device, scoped to this vendor
        const [devices] = await pool.execute(
            `SELECT * FROM devices WHERE id = ? AND vendor_id = ?`,
            [id, vendorId]
        );

        if (devices.length === 0) {
            return res.status(404).json({ error: "Device not found" });
        }

        const device = devices[0];

        // 2. Get the latest message for that device's IMEI
        const [rows] = await pool.execute(
            `
            SELECT payload, iv, auth_tag, created_at
            FROM messages
            WHERE imei = ?
            ORDER BY created_at DESC
            LIMIT 1
            `,
            [device.imei]
        );

        // 3. No telemetry yet is not a hard error — device still exists
        let latest = null;

        if (rows.length > 0) {
            let payload;

            if (rows[0].iv && rows[0].auth_tag) {
                const decrypted = decrypt(
                    rows[0].payload,
                    rows[0].iv,
                    rows[0].auth_tag
                );
                payload = JSON.parse(decrypted);
            } else {
                payload = JSON.parse(rows[0].payload);
            }

            latest = {
                payload,
                created_at: rows[0].created_at,
            };
        }

        // 4. Same response shape as the user-side device-details endpoint
        return res.json({
            device,
            latest,
        });

    } catch (err) {
        console.error("GET VENDOR DEVICE DETAILS ERROR:", err);
        return res.status(500).json({
            error: err.message,
        });
    }
};