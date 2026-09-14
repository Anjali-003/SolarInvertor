const pool = require("../config/database");
const crypto = require("crypto");
const { decrypt } = require("../utils/encryption");

const {
    subscribeDevice
} = require("../services/mqttSubscription");

// =====================================================
// ADMIN DEVICE CONTROLLER
//
// Handles device management for the admin role. Admins
// are not scoped to a single vendor, so these endpoints
// return/operate on ALL devices.
// =====================================================

// Get all devices list (every device, across the system)
exports.getAdminDevices = async (req, res) => {
    try {

        const [devices] = await pool.execute(
            `
SELECT
  id,
  imei,
  solution
FROM devices
ORDER BY id DESC
`
        );

        res.json(devices);

    } catch (err) {

        console.error(err);

        res.status(500).json({
            error: err.message
        });

    }
};

// Get details of a specific device
exports.getDeviceDetails = async (req, res) => {

    try {

        const { id } = req.params;

        const [rows] = await pool.execute(
            `
      SELECT *
      FROM devices
      WHERE id = ?
      `,
            [id]
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


// Get device info + latest telemetry combined, for the admin device details page
exports.getAdminDeviceDetails = async (req, res) => {
    try {
        const { id } = req.params;

        // 1. Get the device
        const [devices] = await pool.execute(
            `SELECT * FROM devices WHERE id = ?`,
            [id]
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
        console.error("GET ADMIN DEVICE DETAILS ERROR:", err);
        return res.status(500).json({
            error: err.message,
        });
    }
};

// =====================================================
// ADMIN DEVICE REGISTRATION
//
// Lets an admin register a new device directly, with no
// vendor involved in the flow at all.
// =====================================================

exports.registerDevice = async (req, res) => {

    console.log("ADMIN DEVICE REGISTRATION BODY:", req.body);

    const {
        imei,
        solution,
        deviceVersion
    } = req.body;

    // --------------------------------------------------
    // 1. Validate request
    // --------------------------------------------------

    if (!imei || !solution || !deviceVersion) {
        return res.status(400).json({
            error: "IMEI, solution and device version are required"
        });
    }

    // Optional: validate IMEI format
    if (!/^\d{15}$/.test(imei)) {
        return res.status(400).json({
            error: "IMEI must be exactly 15 digits"
        });
    }

    try {

        // --------------------------------------------------
        // 2. Check whether IMEI was registered by admin
        // --------------------------------------------------

        const [imeiRows] = await pool.execute(
            `
            SELECT *
            FROM imei_list
            WHERE imei = ?
            `,
            [imei]
        );

        if (imeiRows.length === 0) {
            return res.status(400).json({
                error: "IMEI not registered by admin"
            });
        }

        // --------------------------------------------------
        // 3. Check whether device already exists
        // --------------------------------------------------

        const [existingDevice] = await pool.execute(
            `
            SELECT *
            FROM devices
            WHERE imei = ?
            `,
            [imei]
        );

        if (existingDevice.length > 0) {
            return res.status(400).json({
                error: "Device already registered"
            });
        }

        // --------------------------------------------------
        // 4. Generate MQTT password
        // --------------------------------------------------

        const mqttPassword = crypto
            .randomBytes(24)
            .toString("base64")
            .replace(/[+/=]/g, "")
            .substring(0, 24);

        // --------------------------------------------------
        // 5. Save device in database
        // (vendor_id has no admin-side concept anymore, so
        // it's always saved as NULL here)
        // --------------------------------------------------

        await pool.execute(
            `
            INSERT INTO devices
            (
                imei,
                vendor_id,
                solution,
                device_version,
                mqtt_password
            )
            VALUES (?, ?, ?, ?, ?)
            `,
            [
                imei,
                null,
                solution,
                deviceVersion,
                mqttPassword
            ]
        );

        console.log(
            `Device ${imei} registered successfully by admin`
        );

        // --------------------------------------------------
        // 6. Subscribe MQTT device
        // --------------------------------------------------

        try {

            subscribeDevice(
                imei,
                solution,
                deviceVersion
            );

        } catch (mqttErr) {

            console.error(
                "MQTT subscription failed:",
                mqttErr
            );

            // Important:
            // Device is already saved in DB.
            // We don't fail the registration because
            // MQTT subscription failed.
        }

        // --------------------------------------------------
        // 7. Send response
        // --------------------------------------------------

        return res.status(201).json({
            success: true,
            message: "Device registered successfully",
            device: {
                imei,
                solution,
                deviceVersion
            }
        });

    } catch (err) {

        console.error(
            "Admin device registration error:",
            err
        );

        return res.status(500).json({
            error: "Device registration failed",
            details: err.message
        });
    }
};
