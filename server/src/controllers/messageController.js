const pool = require("../config/database");

exports.getLatestMessage = async (req, res) => {
  try {

    // from JWT
    const imei = req.user.imei;
    console.log(req.user);

    const [rows] = await pool.execute(
      `SELECT payload, created_at
       FROM messages
       WHERE imei = ?
       ORDER BY created_at DESC
       LIMIT 1`,
      [imei]
    );

    if (rows.length === 0) {
      return res.status(404).json({
        error: "No data found",
      });
    }

    const parsed = JSON.parse(rows[0].payload);

    // parsed.TIMESTAMP = rows[0].created_at;

    res.json(parsed);

  } catch (err) {

    res.status(500).json({
      error: err.message,
    });
  }
};



exports.getVendorLatestMessage =
  async (req, res) => {

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

      const [rows] =
        await pool.execute(
          `
          SELECT payload
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

      res.json(
        JSON.parse(
          rows[0].payload
        )
      );

    } catch (err) {

      res.status(500)
        .json({
          error:
            err.message
        });

    }
  };