const pool = require("../config/database");
const { decrypt } = require("../utils/encryption");

// =====================================================
// PUBLIC IMEI LOOKUP (no login / no account)
//
// Anyone with a valid IMEI can look up that device's
// basic info + latest reading. There is no more
// "user_devices" ownership table — "my devices" now
// lives entirely on the phone (frontend localStorage,
// see frontend/src/utils/deviceMeta.js). This endpoint
// is just a read of whatever the vendor/admin already
// registered in `devices`, keyed by imei.
//
// NOTE (security): since there's no account check
// anymore, knowing the IMEI is enough to view that
// device's data. That's an intentional product
// decision for this flow — flagging it here for anyone
// touching this file later.
// =====================================================

exports.lookupDeviceByImei = async (req, res) => {

    try {

        const imei = String(req.params.imei || req.query.imei || "").trim();

        const imeiRegex = /^\d{15}$/;

        if (!imeiRegex.test(imei)) {
            return res.status(400).json({
                error: "Invalid IMEI"
            });
        }

        // =====================================================
        // FETCH DEVICE
        // =====================================================

        const [devices] = await pool.execute(
            `
            SELECT
                id,
                imei,
                device_version,
                solution,
                rated_capacity_kw

            FROM devices

            WHERE imei = ?
            `,
            [imei]
        );

        if (devices.length === 0) {
            return res.status(404).json({
                error: "Device not found"
            });
        }

        const device = devices[0];

        // =====================================================
        // LATEST TOTAL GENERATION (energy_history)
        // =====================================================

        const [energyRows] = await pool.execute(
            `
            SELECT lkwh
            FROM energy_history
            WHERE imei = ?
            ORDER BY recorded_at DESC, id DESC
            LIMIT 1
            `,
            [imei]
        );

        const totalGenerationKwh =
            energyRows.length > 0 ? energyRows[0].lkwh : null;

        // =====================================================
        // LATEST LIVE MESSAGE
        // =====================================================

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
            [imei]
        );

        let payload = null;
        let lastUpdated = null;

        if (rows.length > 0) {

            lastUpdated = rows[0].created_at;

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
        }

        res.set("Cache-Control", "no-store");

        return res.json({

            device: {
                id: device.id,
                imei: device.imei,
                device_version: device.device_version,
                solution: device.solution,
                rated_capacity_kw: device.rated_capacity_kw,
                total_generation_kwh: totalGenerationKwh
            },

            latest: {
                payload,
                created_at: lastUpdated
            }

        });

    } catch (err) {

        console.error("LOOKUP DEVICE ERROR:", err);

        return res.status(500).json({
            error: "Failed to fetch device details"
        });
    }
};
