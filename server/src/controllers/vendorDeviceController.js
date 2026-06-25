const pool = require("../config/database");

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