// const pool = require("../config/database");
// const { decrypt } = require("../utils/encryption");


// // =====================================================
// // ADMIN LATEST MESSAGE
// //
// // Devices are looked up by id only, with no vendor
// // scoping, since admin can see every device.
// // =====================================================
// exports.getAdminLatestMessage =
//   async (req, res) => {

//     try {

//       const deviceId =
//         req.params.id;

//       const [devices] =
//         await pool.execute(
//           `
//           SELECT *
//           FROM devices
//           WHERE id = ?
//           `,
//           [
//             deviceId
//           ]
//         );

//       if (
//         devices.length === 0
//       ) {
//         return res
//           .status(404)
//           .json({
//             error:
//               "Device not found"
//           });
//       }

//       const imei =
//         devices[0].imei;

//       const [rows] = await pool.execute(
// `
// SELECT
//     payload,
//     iv,
//     auth_tag,
//     created_at
// FROM messages
// WHERE imei = ?
// ORDER BY created_at DESC
// LIMIT 1
// `,
// [imei]
// );

//       if (
//         rows.length === 0
//       ) {
//         return res
//           .status(404)
//           .json({
//             error:
//               "No data found"
//           });
//       }

//       const decrypted = decrypt(
//     rows[0].payload,
//     rows[0].iv,
//     rows[0].auth_tag
// );

// const parsed = JSON.parse(decrypted);

// parsed.created_at = rows[0].created_at;

// return res.json(parsed);

//     }
//     catch (err) {

//     console.error("==========================");
//     console.error(err);
//     console.error(err.stack);
//     console.error("==========================");

//     return res.status(500).json({
//         error: err.message,
//         stack: err.stack
//     });

// }
//   };


// exports.getLatestMessage = async (req, res) => {

//     try {

//         // ============================================
//         // PUBLIC — no login. Device is identified by IMEI
//         // directly (no more user_devices ownership check).
//         // ============================================

//         const imei =
//             String(req.query.imei || "").trim();

//         if (!/^\d{15}$/.test(imei)) {
//             return res.status(400).json({
//                 error: "Invalid imei"
//             });
//         }


//         // ============================================
//         // GET LATEST MESSAGE
//         // ============================================

//         const [rows] =
//             await pool.execute(
//                 `
//                 SELECT
//                     payload,
//                     iv,
//                     auth_tag,
//                     created_at

//                 FROM messages

//                 WHERE imei = ?

//                 ORDER BY created_at DESC

//                 LIMIT 1
//                 `,
//                 [
//                     imei
//                 ]
//             );


//         if (rows.length === 0) {

//             return res.status(404).json({
//                 error: "No data found"
//             });
//         }


//         // ============================================
//         // DECRYPT
//         // ============================================

//         let parsed;

//         if (
//             rows[0].iv &&
//             rows[0].auth_tag
//         ) {

//             const decrypted =
//                 decrypt(
//                     rows[0].payload,
//                     rows[0].iv,
//                     rows[0].auth_tag
//                 );

//             parsed =
//                 JSON.parse(decrypted);

//         } else {

//             parsed =
//                 JSON.parse(
//                     rows[0].payload
//                 );
//         }


//         // ============================================
//         // RESPONSE
//         // ============================================

//         return res.json({

//             payload: parsed,

//             created_at:
//                 rows[0].created_at
//         });

//     } catch (err) {

//         console.error(
//             "GET LATEST MESSAGE ERROR:",
//             err
//         );

//         return res.status(500).json({
//             error:
//                 "Failed to fetch latest device data"
//         });
//     }
// };












const pool =
    require("../config/database");

const {
    decrypt
} =
    require("../utils/encryption");


// =====================================================
// PARSE MESSAGE PAYLOAD
//
// Supports:
//
// 1. Old encrypted messages
// 2. Current plain JSON messages
// =====================================================

function parseMessagePayload(
    row
) {

    if (
        row.iv &&
        row.auth_tag
    ) {

        const decrypted =
            decrypt(
                row.payload,
                row.iv,
                row.auth_tag
            );


        return JSON.parse(
            decrypted
        );
    }


    return JSON.parse(
        row.payload
    );
}


// =====================================================
// ADMIN LATEST MESSAGE
// =====================================================

exports.getAdminLatestMessage =
    async (req, res) => {

        try {

            const deviceId =
                req.params.id;


            // =============================================
            // GET DEVICE
            // =============================================

            const [devices] =
                await pool.execute(
                    `
                    SELECT
                        id,
                        imei,
                        device_type

                    FROM devices

                    WHERE id = ?

                    LIMIT 1
                    `,
                    [
                        deviceId
                    ]
                );


            if (
                devices.length === 0
            ) {

                return res
                    .status(404)
                    .json({
                        error:
                            "Device not found"
                    });
            }


            const device =
                devices[0];

            const imei =
                device.imei;


            // =============================================
            // GET LATEST MESSAGE
            // =============================================

            const [rows] =
                await pool.execute(
                    `
                    SELECT
                        id,
                        payload,
                        device_type,
                        iv,
                        auth_tag,
                        created_at

                    FROM messages

                    WHERE imei = ?

                    ORDER BY
                        created_at DESC,
                        id DESC

                    LIMIT 1
                    `,
                    [
                        imei
                    ]
                );


            if (
                rows.length === 0
            ) {

                return res
                    .status(404)
                    .json({
                        error:
                            "No data found"
                    });
            }


            // =============================================
            // PARSE PAYLOAD
            // =============================================

            const parsed =
                parseMessagePayload(
                    rows[0]
                );


            // =============================================
            // RESPONSE
            // =============================================

            return res.json({

                device_type:
                    Number(
                        rows[0].device_type ??
                        device.device_type
                    ),

                payload:
                    parsed,

                created_at:
                    rows[0].created_at
            });


        } catch (err) {

            console.error(
                "================================="
            );

            console.error(
                "ADMIN LATEST MESSAGE ERROR"
            );

            console.error(
                err
            );

            console.error(
                err.stack
            );

            console.error(
                "================================="
            );


            return res
                .status(500)
                .json({
                    error:
                        "Failed to fetch latest device data"
                });
        }
    };


// =====================================================
// PUBLIC LATEST MESSAGE
//
// No login.
// Device identified directly by IMEI.
// =====================================================

exports.getLatestMessage =
    async (req, res) => {

        try {

            // =============================================
            // VALIDATE IMEI
            // =============================================

            const imei =
                String(
                    req.query.imei || ""
                ).trim();


            if (
                !/^\d{15}$/.test(
                    imei
                )
            ) {

                return res
                    .status(400)
                    .json({
                        error:
                            "Invalid imei"
                    });
            }


            // =============================================
            // VERIFY DEVICE
            //
            // Also gives us the registered device type.
            // =============================================

            const [deviceRows] =
                await pool.execute(
                    `
                    SELECT
                        imei,
                        device_type

                    FROM devices

                    WHERE imei = ?

                    LIMIT 1
                    `,
                    [
                        imei
                    ]
                );


            if (
                deviceRows.length === 0
            ) {

                return res
                    .status(404)
                    .json({
                        error:
                            "Device not found"
                    });
            }


            const device =
                deviceRows[0];


            // =============================================
            // GET LATEST MESSAGE
            // =============================================

            const [rows] =
                await pool.execute(
                    `
                    SELECT
                        id,
                        payload,
                        device_type,
                        iv,
                        auth_tag,
                        created_at

                    FROM messages

                    WHERE imei = ?

                    ORDER BY
                        created_at DESC,
                        id DESC

                    LIMIT 1
                    `,
                    [
                        imei
                    ]
                );


            if (
                rows.length === 0
            ) {

                return res
                    .status(404)
                    .json({
                        error:
                            "No data found"
                    });
            }


            // =============================================
            // PARSE PAYLOAD
            // =============================================

            const parsed =
                parseMessagePayload(
                    rows[0]
                );


            // =============================================
            // DEVICE TYPE
            //
            // Prefer the type stored with the message.
            // Fall back to devices.device_type for older
            // records created before device_type existed
            // in messages.
            // =============================================

            const deviceType =
                Number(
                    rows[0].device_type ??
                    device.device_type
                );


            // =============================================
            // RESPONSE
            // =============================================

            return res.json({

                device_type:
                    deviceType,

                payload:
                    parsed,

                created_at:
                    rows[0].created_at
            });


        } catch (err) {

            console.error(
                "GET LATEST MESSAGE ERROR:",
                err
            );


            return res
                .status(500)
                .json({
                    error:
                        "Failed to fetch latest device data"
                });
        }
    };