const fs = require("fs");
const { Client } = require("ssh2");
const pool = require("../config/database");            
const {
    subscribeDevice
} = require("../services/mqttSubscription");

const crypto = require("crypto");
const { exec } = require("child_process");


exports.generateCertificate = async (req, res) => {

    console.log("BODY:", req.body);

    const {
        imei,
        solution,
        deviceVersion
    } = req.body;

    if (!imei || !solution || !deviceVersion) {
        return res.status(400).json({
            error: "Missing fields"
        });
    }

    try {

        // Check IMEI exists
        const [imeiRows] = await pool.execute(
            `SELECT * FROM imei_list WHERE imei = ?`,
            [imei]
        );

        if (imeiRows.length === 0) {
            return res.status(400).json({
                error: "IMEI not registered by admin"
            });
        }

        // Check device already registered
        const [existingDevice] = await pool.execute(
            `SELECT * FROM devices WHERE imei = ?`,
            [imei]
        );

        if (existingDevice.length > 0) {
            return res.status(400).json({
                error: "Device already registered"
            });
        }

        // Vendor comes from authentication middleware
        const vendorId = req.vendor.id;

        const mqttPassword = crypto
            .randomBytes(24)
            .toString("base64")
            .replace(/[+/=]/g, "")
            .substring(0, 24);

        const conn = new Client();

        conn.on("ready", () => {

            console.log("SSH Connected");

            const command =
                `/home/certAdmin/scripts/gen_cert.sh ${imei} ${vendorId} ${solution}`;

            console.log("Running:", command);

            conn.exec(command, (err, stream) => {

                if (err) {
                    conn.end();

                    return res.status(500).json({
                        error: "SSH execution failed",
                        details: err.message
                    });
                }

                let stdout = "";
                let stderr = "";

                stream.on("data", (data) => {
                    stdout += data.toString();
                });

                stream.stderr.on("data", (data) => {
                    stderr += data.toString();
                });

                stream.on("close", async (code) => {

                    conn.end();

                    if (code !== 0) {
                        return res.status(500).json({
                            error: "Certificate generation failed",
                            details: stderr
                        });
                    }

                    try {

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
                                vendorId,
                                solution,
                                deviceVersion,
                                mqttPassword
                            ]
                        );

                        subscribeDevice(
                            imei,
                            solution,
                            deviceVersion
                        );

                        return res.json({
                            success: true,
                            message: "Device registered successfully"
                        });

                    } catch (dbErr) {

                        console.error(dbErr);

                        return res.status(500).json({
                            error: "Database insert failed",
                            details: dbErr.message
                        });
                    }
                });
            });
        });

        conn.on("error", (err) => {
            return res.status(500).json({
                error: "SSH connection failed",
                details: err.message
            });
        });

        conn.connect({
            host: process.env.VPS_HOST,
            port: 22,
            username: process.env.VPS_USER,
            privateKey: fs.readFileSync(process.env.SSH_KEY_PATH)
        });

    } catch (err) {

        console.error(err);

        return res.status(500).json({
            error: "Server error",
            details: err.message
        });
    }
};









//  THIS IS FOR SERVER USE ONLY 





// exports.generateCertificate = async (req, res) => {

//     console.log("BODY:", req.body);

//     const {
//         imei,
//         solution,
//         deviceVersion
//     } = req.body;

//     if (!imei || !solution || !deviceVersion) {
//         return res.status(400).json({
//             error: "Missing fields"
//         });
//     }

//     try {

//         // Check IMEI exists
//         const [imeiRows] = await pool.execute(
//             `SELECT * FROM imei_list WHERE imei = ?`,
//             [imei]
//         );

//         if (imeiRows.length === 0) {
//             return res.status(400).json({
//                 error: "IMEI not registered by admin"
//             });
//         }

//         // Check device already registered
//         const [existingDevice] = await pool.execute(
//             `SELECT * FROM devices WHERE imei = ?`,
//             [imei]
//         );

//         if (existingDevice.length > 0) {
//             return res.status(400).json({
//                 error: "Device already registered"
//             });
//         }

        // Vendor comes from authentication middleware
     //   const vendorId = req.vendor.id;
//         const vendorId = req.vendor.id;

//         const mqttPassword = crypto
//             .randomBytes(24)
//             .toString("base64")
//             .replace(/[+/=]/g, "")
//             .substring(0, 24);

//         // Execute certificate script as certAdmin
//         const command =
//             `sudo -u certAdmin /home/certAdmin/scripts/gen_cert.sh ${imei} ${vendorId} ${solution}`;

//         console.log("Running:", command);

//         exec(command, async (err, stdout, stderr) => {

//             if (err) {

//                 console.error(stderr || err);

//                 return res.status(500).json({
//                     error: "Certificate generation failed",
//                     details: stderr || err.message
//                 });
//             }

//             console.log(stdout);

//             try {

//                 await pool.execute(
//                     `
//                     INSERT INTO devices
//                     (
//                         imei,
//                         vendor_id,
//                         solution,
//                         device_version,
//                         mqtt_password
//                     )
//                     VALUES (?, ?, ?, ?, ?)
//                     `,
//                     [
//                         imei,
//                         vendorId,
//                         solution,
//                         deviceVersion,
//                         mqttPassword
//                     ]
//                 );

//                 subscribeDevice(
//                     imei,
//                     solution,
//                     deviceVersion
//                 );

//                 return res.json({
//                     success: true,
//                     message: "Device registered successfully"
//                 });

//             }
//             catch (dbErr) {

//                 console.error(dbErr);

//                 return res.status(500).json({
//                     error: "Database insert failed",
//                     details: dbErr.message
//                 });
//             }

//         });

//     }
//     catch (err) {

//         console.error(err);

//         return res.status(500).json({
//             error: "Server error",
//             details: err.message
//         });

//     }
// };



// THIS IS FOR SERVER USE ONLY



// const command = `sudo -u certAdmin /home/certAdmin/scripts/gen_cert.sh ${imei} ${vendorId} ${solution}`;

// exec(command, async (err, stdout, stderr) => {
//     if (err) {
//         return res.status(500).json({
//             error: "Certificate generation failed",
//             details: stderr || err.message
//         });
//     }

//     try {
//         await pool.execute(
//             `INSERT INTO devices
//             (
//                 imei,
//                 vendor_id,
//                 solution,
//                 device_version,
//                 mqtt_password
//             )
//             VALUES (?, ?, ?, ?, ?)`,
//             [
//                 imei,
//                 vendorId,
//                 solution,
//                 deviceVersion,
//                 mqttPassword
//             ]
//         );

//         subscribeDevice(
//             imei,
//             solution,
//             deviceVersion
//         );

//         return res.json({
//             success: true,
//             message: "Device registered successfully"
//         });

//     } catch (dbErr) {
//         return res.status(500).json({
//             error: "Database insert failed",
//             details: dbErr.message
//         });
//     }
// });










exports.getDeviceConfig = async (req, res) => {

    try {

        const { imei } = req.body;

        if (!imei) {
            return res.status(400).json({
                error: "IMEI required"
            });
        }

        const [rows] = await pool.execute(
            `
            SELECT *
            FROM devices
            WHERE imei = ?
            `,
            [imei]
        );

        if (rows.length === 0) {
            return res.status(404).json({
                error: "Device not found"
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

            SOLUTION: device.solution

        });

    }
    catch (err) {

        console.error(err);

        return res.status(500).json({
            error: err.message
        });

    }

};