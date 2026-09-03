// const pool = require("../config/database");
// const { decrypt } = require("../utils/encryption");


// exports.getUserDevices = async (req, res) => {

//     try {

//         const userId = req.user?.id;

//         if (!userId) {
//             return res.status(401).json({
//                 error: "Unauthorized"
//             });
//         }


//         const [devices] = await pool.execute(
//             `
//             SELECT
//                 d.id,
//                 d.imei,
//                 d.device_version,
//                 d.solution

//             FROM user_devices ud

//             JOIN devices d
//                 ON d.id = ud.device_id

//             WHERE ud.user_id = ?

//             ORDER BY d.id
//             `,
//             [userId]
//         );


//         return res.json({
//             success: true,
//             devices
//         });


//     } catch (err) {

//         console.error(
//             "GET USER DEVICES ERROR:",
//             err
//         );

//         return res.status(500).json({
//             error: err.message
//         });

//     }

// };


// exports.addUserDevice = async (req, res) => {

//     try {

//         const userId = req.user?.id;

//         if (!userId) {
//             return res.status(401).json({
//                 error: "Unauthorized"
//             });
//         }


//         // const { imei } = req.body;
//         const { imei, location } = req.body;


//         // =====================================================
//         // VALIDATE IMEI
//         // =====================================================

//         const imeiRegex = /^\d{15}$/;

//         if (!imeiRegex.test(imei)) {
//             return res.status(400).json({
//                 error: "Invalid IMEI"
//             });
//         }

//         if (!imei || !location) {
//     return res.status(400).json({
//         error: "IMEI and location are required"
//     });
// }


//         // =====================================================
//         // CHECK DEVICE EXISTS
//         // =====================================================

//         const [devices] = await pool.execute(
//             `
//             SELECT
//                 id,
//                 imei,
//                 device_version,
//                 solution

//             FROM devices

//             WHERE imei = ?
//             `,
//             [imei]
//         );


//         if (devices.length === 0) {

//             return res.status(404).json({
//                 error: "Device not registered by vendor"
//             });

//         }


//         const device = devices[0];


//         // =====================================================
//         // CHECK WHETHER DEVICE IS ALREADY REGISTERED
//         // =====================================================

//         const [existingDevice] =
//             await pool.execute(
//                 `
//                 SELECT
//                     id,
//                     user_id

//                 FROM user_devices

//                 WHERE device_id = ?
//                 `,
//                 [device.id]
//             );


//         if (existingDevice.length > 0) {

//             return res.status(400).json({
//                 error: "Device already registered"
//             });

//         }


//         // =====================================================
//         // ATTACH DEVICE TO CURRENT USER
//         // =====================================================

//         await pool.execute(
//             `
//             INSERT INTO user_devices
//             (
//                 user_id,
//                 device_id,
//                 location
//             )
//             VALUES (?, ?, ?)
//             `,
//             [
//                 userId,
//                 device.id,
//                 location
//             ]
//         );


//         // =====================================================
//         // RESPONSE
//         // =====================================================

//         return res.status(201).json({

//             success: true,

//             message: "Device added successfully",

//             device: {
//                 id: device.id,
//                 imei: device.imei,
//                 device_version:
//                     device.device_version,
//                 solution:
//                     device.solution
//             }

//         });


//     } catch (err) {

//         console.error(
//             "ADD USER DEVICE ERROR:",
//             err
//         );

//         if (err.code === "ER_DUP_ENTRY") {

//             return res.status(409).json({
//                 error:
//                     "Device is already assigned to a user"
//             });

//         }
//         return res.status(500).json({
//             error: err.message
//         });

//     }

// };


// exports.getDeviceDetails = async (req, res) => {
//     try {
//         const userId = req.user?.id;

//         if (!userId) {
//             return res.status(401).json({
//                 error: "Unauthorized"
//             });
//         }

//         const deviceId = Number(req.query.device_id);

//         if (!Number.isInteger(deviceId) || deviceId <= 0) {
//             return res.status(400).json({
//                 error: "Invalid device_id"
//             });
//         }

//         // =====================================================
//         // GET DEVICE + VERIFY USER ACCESS
//         // =====================================================

//         const [devices] = await pool.execute(
//             `
//             SELECT
//                 d.id,
//                 d.imei,
//                 d.solution,
//                 ud.location
//             FROM user_devices ud

//             INNER JOIN devices d
//                 ON d.id = ud.device_id

//             WHERE
//                 ud.user_id = ?
//                 AND d.id = ?

//             LIMIT 1
//             `,
//             [
//                 userId,
//                 deviceId
//             ]
//         );

//         if (devices.length === 0) {
//             return res.status(403).json({
//                 error: "You do not have access to this device"
//             });
//         }

//         const device = devices[0];

//         // =====================================================
//         // GET LATEST MESSAGE
//         // =====================================================

//         const [rows] = await pool.execute(
//             `
//             SELECT
//                 payload,
//                 iv,
//                 auth_tag,
//                 created_at
//             FROM messages
//             WHERE imei = ?
//             ORDER BY created_at DESC
//             LIMIT 1
//             `,
//             [
//                 device.imei
//             ]
//         );

//         let payload = null;
//         let lastUpdated = null;

//         if (rows.length > 0) {

//             lastUpdated = rows[0].created_at;

//             if (
//                 rows[0].iv &&
//                 rows[0].auth_tag
//             ) {

//                 const decrypted = decrypt(
//                     rows[0].payload,
//                     rows[0].iv,
//                     rows[0].auth_tag
//                 );

//                 payload = JSON.parse(decrypted);

//             } else {

//                 payload = JSON.parse(
//                     rows[0].payload
//                 );
//             }
//         }

//         // =====================================================
//         // RESPONSE
//         // =====================================================

//         return res.json({

//             device: {
//                 id: device.id,
//                 imei: device.imei,
//                 solution: device.solution,
//                 location: device.location
//             },

//             latest: {
//                 payload,
//                 created_at: lastUpdated
//             }

//         });

//     } catch (err) {

//         console.error(
//             "GET DEVICE DETAILS ERROR:",
//             err
//         );

//         return res.status(500).json({
//             error: "Failed to fetch device details"
//         });
//     }
// };
















const pool = require("../config/database");
const { decrypt } = require("../utils/encryption");


exports.getUserDevices = async (req, res) => {

    try {

        const userId = req.user?.id;

        if (!userId) {
            return res.status(401).json({
                error: "Unauthorized"
            });
        }


        const [devices] = await pool.execute(
            `
            SELECT
                d.id,
                d.imei,
                d.device_version,
                d.solution,
                ud.location

            FROM user_devices ud

            JOIN devices d
                ON d.id = ud.device_id

            WHERE ud.user_id = ?

            ORDER BY d.id
            `,
            [userId]
        );


        return res.json({
            success: true,
            devices
        });


    } catch (err) {

        console.error(
            "GET USER DEVICES ERROR:",
            err
        );

        return res.status(500).json({
            error: err.message
        });

    }

};


exports.addUserDevice = async (req, res) => {

    try {

        const userId = req.user?.id;

        if (!userId) {
            return res.status(401).json({
                error: "Unauthorized"
            });
        }


        // const { imei } = req.body;
        const { imei, location } = req.body;


        // =====================================================
        // VALIDATE IMEI
        // =====================================================

        const imeiRegex = /^\d{15}$/;

        if (!imeiRegex.test(imei)) {
            return res.status(400).json({
                error: "Invalid IMEI"
            });
        }

        if (!imei || !location) {
    return res.status(400).json({
        error: "IMEI and location are required"
    });
}


        // =====================================================
        // CHECK DEVICE EXISTS
        // =====================================================

        const [devices] = await pool.execute(
            `
            SELECT
                id,
                imei,
                device_version,
                solution

            FROM devices

            WHERE imei = ?
            `,
            [imei]
        );


        if (devices.length === 0) {

            return res.status(404).json({
                error: "Device not registered by vendor"
            });

        }


        const device = devices[0];


        // =====================================================
        // CHECK WHETHER DEVICE IS ALREADY REGISTERED
        // =====================================================

        const [existingDevice] =
            await pool.execute(
                `
                SELECT
                    id,
                    user_id

                FROM user_devices

                WHERE device_id = ?
                `,
                [device.id]
            );


        if (existingDevice.length > 0) {

            return res.status(400).json({
                error: "Device already registered"
            });

        }


        // =====================================================
        // ATTACH DEVICE TO CURRENT USER
        // =====================================================

        await pool.execute(
            `
            INSERT INTO user_devices
            (
                user_id,
                device_id,
                location
            )
            VALUES (?, ?, ?)
            `,
            [
                userId,
                device.id,
                location
            ]
        );


        // =====================================================
        // RESPONSE
        // =====================================================

        return res.status(201).json({

            success: true,

            message: "Device added successfully",

            device: {
                id: device.id,
                imei: device.imei,
                device_version:
                    device.device_version,
                solution:
                    device.solution
            }

        });


    } catch (err) {

        console.error(
            "ADD USER DEVICE ERROR:",
            err
        );

        if (err.code === "ER_DUP_ENTRY") {

            return res.status(409).json({
                error:
                    "Device is already assigned to a user"
            });

        }
        return res.status(500).json({
            error: err.message
        });

    }

};


exports.getDeviceDetails = async (req, res) => {
    try {
        const userId = req.user?.id;

        if (!userId) {
            return res.status(401).json({
                error: "Unauthorized"
            });
        }

        const deviceId = Number(req.query.device_id);

        if (!Number.isInteger(deviceId) || deviceId <= 0) {
            return res.status(400).json({
                error: "Invalid device_id"
            });
        }

        // =====================================================
        // GET DEVICE + VERIFY USER ACCESS
        // =====================================================

        const [devices] = await pool.execute(
            `
            SELECT
                d.id,
                d.imei,
                d.solution,
                ud.location
            FROM user_devices ud

            INNER JOIN devices d
                ON d.id = ud.device_id

            WHERE
                ud.user_id = ?
                AND d.id = ?

            LIMIT 1
            `,
            [
                userId,
                deviceId
            ]
        );

        if (devices.length === 0) {
            return res.status(403).json({
                error: "You do not have access to this device"
            });
        }

        const device = devices[0];

        // =====================================================
        // GET LATEST MESSAGE
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
            [
                device.imei
            ]
        );

        let payload = null;
        let lastUpdated = null;

        if (rows.length > 0) {

            lastUpdated = rows[0].created_at;

            if (
                rows[0].iv &&
                rows[0].auth_tag
            ) {

                const decrypted = decrypt(
                    rows[0].payload,
                    rows[0].iv,
                    rows[0].auth_tag
                );

                payload = JSON.parse(decrypted);

            } else {

                payload = JSON.parse(
                    rows[0].payload
                );
            }
        }

        // =====================================================
        // RESPONSE
        // =====================================================

        return res.json({

            device: {
                id: device.id,
                imei: device.imei,
                solution: device.solution,
                location: device.location
            },

            latest: {
                payload,
                created_at: lastUpdated
            }

        });

    } catch (err) {

        console.error(
            "GET DEVICE DETAILS ERROR:",
            err
        );

        return res.status(500).json({
            error: "Failed to fetch device details"
        });
    }
};