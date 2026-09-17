const pool = require("../config/database");

// =====================================================
// DEVICE CONFIG (used over FTP by the device itself to
// fetch its MQTT/FTP connection details). Not tied to any
// account owner — devices are registered by admin
// (see adminDeviceController.registerDevice) and this just
// reads that row back by IMEI.
// =====================================================

exports.getDeviceConfig = async (req, res) => {
  try {
    const { imei } = req.body;

    if (!imei) {
      return res.status(400).json({
        error: "IMEI required",
      });
    }

    const [rows] = await pool.execute(
      `
            SELECT *
            FROM devices
            WHERE imei = ?
            `,
      [imei],
    );

    if (rows.length === 0) {
      return res.status(404).json({
        error: "Device not found",
      });
    }

    const device = rows[0];

    return res.json({
      URL: "213.210.21.49",
      PORT: 8883,

      CID: imei,
      USERNAME: imei,
      PASSWORD: device.mqtt_password,

      FTPURL: "213.210.21.49",
      FTPPORT: 21,
      FTPUSER: "ftpdevice",
      FTPPASS: "12345",
      FTPDOWN: `/device_certs/${imei}/`,

      VERSION: device.device_version,
      SOLUTION: device.solution,
    });
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      error: err.message,
    });
  }
};
