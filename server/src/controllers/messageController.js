const pool = require("../config/database");
const { decrypt } = require("../utils/encryption");

// exports.getLatestMessage = async (req, res) => {
//   try {

//     // from JWT
//     const imei = req.user.imei;
//     //console.log(req.user);

//     const [rows] = await pool.execute(
//       `SELECT payload, created_at
//        FROM messages
//        WHERE imei = ?
//        ORDER BY created_at DESC
//        LIMIT 1`,
//       [imei]
//     );

//     if (rows.length === 0) {
//       return res.status(404).json({
//         error: "No data found",
//       });
//     }

//     // const parsed = JSON.parse(rows[0].payload);

//     // parsed.TIMESTAMP = rows[0].created_at;

//     // res.json(parsed);

//     const parsed =
// JSON.parse(rows[0].payload);

// parsed.created_at =
// rows[0].created_at;

// res.json(parsed);

//   } catch (err) {

//     res.status(500).json({
//       error: err.message,
//     });
//   }
// };



exports.getVendorLatestMessage =
  async (req, res) => {

    console.log("Vendor latest API hit");
console.log("Params:", req.params);
console.log("Vendor:", req.vendor);

    try {

      const vendorId =
        req.vendor.id;

      const deviceId =
        req.params.id;

    //   console.log("vendor from token:", req.vendor);  
    // console.log("deviceId:", deviceId);               
    // console.log("vendorId:", vendorId); 

      const [devices] =
        await pool.execute(
          `
          SELECT *
          FROM devices
          WHERE id = ?
          AND vendor_id = ?
          `,
          [
            deviceId,
            vendorId
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

      const imei =
        devices[0].imei;

      // const [rows] =
      //   await pool.execute(
      //     `
      //     SELECT payload
      //     FROM messages
      //     WHERE imei = ?
      //     ORDER BY created_at DESC
      //     LIMIT 1
      //     `,
      //     [imei]
      //   );



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

      // res.json(
      //   JSON.parse(
      //     rows[0].payload
      //   )
      // );

      const decrypted = decrypt(
    rows[0].payload,
    rows[0].iv,
    rows[0].auth_tag
);

const parsed = JSON.parse(decrypted);

parsed.created_at = rows[0].created_at;

return res.json(parsed);

    } 
    // catch (err) {

    //   res.status(500)
    //     .json({
    //       error:
    //         err.message
    //     });

    // }
    catch (err) {

    console.error("==========================");
    console.error(err);
    console.error(err.stack);
    console.error("==========================");

    return res.status(500).json({
        error: err.message,
        stack: err.stack
    });

}
  };


//   exports.getLatestMessage = async (req, res) => {
//   try {
//     const imei = req.user?.imei;

//     if (!imei) {
//       return res.status(401).json({ error: "Unauthorized" });
//     }

//     const [rows] = await pool.execute(
//       `SELECT payload, iv, auth_tag, created_at
//        FROM messages
//        WHERE imei = ?
//        ORDER BY created_at DESC
//        LIMIT 1`,
//       [imei]
//     );

//     if (rows.length === 0) {
//       return res.status(404).json({ error: "No data found" });
//     }

//     let parsed;
//     if (rows[0].iv && rows[0].auth_tag) {
//       const decrypted = decrypt(rows[0].payload, rows[0].iv, rows[0].auth_tag);
//       parsed = JSON.parse(decrypted);
//     } else {
//       parsed = JSON.parse(rows[0].payload);
//     }

//     return res.json({
//       payload: parsed,
//       created_at: rows[0].created_at,
//     });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };


// exports.getLatestMessage = async (req, res) => {
//   try {

//     const userId = req.user?.id;

//     if (!userId) {
//       return res.status(401).json({
//         error: "Unauthorized",
//       });
//     }

//     // =====================================================
//     // GET USER'S DEVICE
//     // =====================================================

//     const [devices] = await pool.execute(
//       `
//       SELECT
//         d.id,
//         d.imei
//       FROM user_devices ud
//       JOIN devices d
//         ON d.id = ud.device_id
//       WHERE ud.user_id = ?
//       LIMIT 1
//       `,
//       [userId]
//     );

//     if (devices.length === 0) {
//       return res.status(404).json({
//         error: "No device assigned to this user",
//       });
//     }

//     const imei = devices[0].imei;

//     // =====================================================
//     // GET LATEST MESSAGE
//     // =====================================================

//     const [rows] = await pool.execute(
//       `
//       SELECT
//         payload,
//         iv,
//         auth_tag,
//         created_at
//       FROM messages
//       WHERE imei = ?
//       ORDER BY created_at DESC
//       LIMIT 1
//       `,
//       [imei]
//     );

//     if (rows.length === 0) {
//       return res.status(404).json({
//         error: "No data found",
//       });
//     }

//     let parsed;

//     if (rows[0].iv && rows[0].auth_tag) {

//       const decrypted = decrypt(
//         rows[0].payload,
//         rows[0].iv,
//         rows[0].auth_tag
//       );

//       parsed = JSON.parse(decrypted);

//     } else {

//       parsed = JSON.parse(
//         rows[0].payload
//       );

//     }

//     return res.json({
//       payload: parsed,
//       created_at: rows[0].created_at,
//     });

//   } catch (err) {

//     console.error(
//       "GET LATEST MESSAGE ERROR:",
//       err
//     );

//     return res.status(500).json({
//       error: err.message,
//     });
//   }
// };



exports.getLatestMessage = async (req, res) => {

    try {

        // ============================================
        // AUTHENTICATED USER
        // ============================================

        const userId = req.user?.id;

        if (!userId) {
            return res.status(401).json({
                error: "Unauthorized"
            });
        }


        // ============================================
        // DEVICE ID FROM REQUEST
        // ============================================

        const deviceId =
            Number(req.query.device_id);

        if (
            !Number.isInteger(deviceId) ||
            deviceId <= 0
        ) {
            return res.status(400).json({
                error: "Invalid device_id"
            });
        }


        // ============================================
        // VERIFY USER OWNS DEVICE
        // ============================================

        const [devices] =
            await pool.execute(
                `
                SELECT
                    d.id,
                    d.imei
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
                error:
                    "You do not have access to this device"
            });
        }


        // ============================================
        // GET DEVICE IMEI
        // ============================================

        const imei =
            devices[0].imei;


        // ============================================
        // GET LATEST MESSAGE
        // ============================================

        const [rows] =
            await pool.execute(
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
                    imei
                ]
            );


        if (rows.length === 0) {

            return res.status(404).json({
                error: "No data found"
            });
        }


        // ============================================
        // DECRYPT
        // ============================================

        let parsed;

        if (
            rows[0].iv &&
            rows[0].auth_tag
        ) {

            const decrypted =
                decrypt(
                    rows[0].payload,
                    rows[0].iv,
                    rows[0].auth_tag
                );

            parsed =
                JSON.parse(decrypted);

        } else {

            parsed =
                JSON.parse(
                    rows[0].payload
                );
        }


        // ============================================
        // RESPONSE
        // ============================================

        return res.json({

            payload: parsed,

            created_at:
                rows[0].created_at
        });

    } catch (err) {

        console.error(
            "GET LATEST MESSAGE ERROR:",
            err
        );

        return res.status(500).json({
            error:
                "Failed to fetch latest device data"
        });
    }
};

// exports.getLatestMessage = async (req, res) => {
//     try {

//         const userId = req.user?.id;
//         const deviceId = req.query.device_id;

//         if (!userId) {
//             return res.status(401).json({
//                 error: "Unauthorized"
//             });
//         }

//         if (!deviceId) {
//             return res.status(400).json({
//                 error: "device_id is required"
//             });
//         }


//         // ==========================================
//         // 1. VERIFY USER OWNS DEVICE
//         // ==========================================

//         const [ownership] = await pool.execute(
//             `
//             SELECT device_id
//             FROM user_devices
//             WHERE device_id = ?
//               AND user_id = ?
//             LIMIT 1
//             `,
//             [deviceId, userId]
//         );

//         if (ownership.length === 0) {
//             return res.status(403).json({
//                 error: "You do not have access to this device"
//             });
//         }


//         // ==========================================
//         // 2. GET DEVICE IMEI
//         // ==========================================

//         const [devices] = await pool.execute(
//             `
//             SELECT id, imei
//             FROM devices
//             WHERE id = ?
//             LIMIT 1
//             `,
//             [deviceId]
//         );

//         if (devices.length === 0) {
//             return res.status(404).json({
//                 error: "Device not found"
//             });
//         }

//         const imei = devices[0].imei;


//         // ==========================================
//         // 3. GET LATEST MESSAGE
//         // ==========================================

//         const [rows] = await pool.execute(
//             `
//             SELECT payload, iv, auth_tag, created_at
//             FROM messages
//             WHERE imei = ?
//             ORDER BY created_at DESC
//             LIMIT 1
//             `,
//             [imei]
//         );

//         if (rows.length === 0) {
//             return res.status(404).json({
//                 error: "No data found"
//             });
//         }


//         // ==========================================
//         // 4. DECRYPT
//         // ==========================================

//         let parsed;

//         if (rows[0].iv && rows[0].auth_tag) {

//             const decrypted = decrypt(
//                 rows[0].payload,
//                 rows[0].iv,
//                 rows[0].auth_tag
//             );

//             parsed = JSON.parse(decrypted);

//         } else {

//             parsed = JSON.parse(rows[0].payload);

//         }


//         // ==========================================
//         // 5. RESPONSE
//         // ==========================================

//         return res.json({
//             payload: parsed,
//             created_at: rows[0].created_at
//         });

//     } catch (err) {

//         console.error("Latest message error:", err);

//         return res.status(500).json({
//             error: err.message
//         });
//     }
// };