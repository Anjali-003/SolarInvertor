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


  exports.getLatestMessage = async (req, res) => {
  try {
    const imei = req.user?.imei;

    if (!imei) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const [rows] = await pool.execute(
      `SELECT payload, iv, auth_tag, created_at
       FROM messages
       WHERE imei = ?
       ORDER BY created_at DESC
       LIMIT 1`,
      [imei]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: "No data found" });
    }

    let parsed;
    if (rows[0].iv && rows[0].auth_tag) {
      const decrypted = decrypt(rows[0].payload, rows[0].iv, rows[0].auth_tag);
      parsed = JSON.parse(decrypted);
    } else {
      parsed = JSON.parse(rows[0].payload);
    }

    return res.json({
      payload: parsed,
      created_at: rows[0].created_at,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};