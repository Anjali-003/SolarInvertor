const fs = require("fs");
const { Client } = require("ssh2");
const pool = require("../config/database");            
const {
    subscribeDevice
} = require("../services/mqttSubscription");


exports.generateCertificate =
  async (req, res) => {

    console.log("BODY:", req.body);
    console.log("IMEI:", req.body.imei);
    console.log("SOLUTION:", req.body.solution);

    const { imei, solution } = req.body;

if (!imei || !solution) {
  return res.status(400).json({
    error: "Missing fields"
  });
}

    try {

      // const {
      //   imei,
      //   solution,
      // } = req.body;

      // if (!imei || !solution) {
      //   return res.status(400).json({
      //     error: "Missing fields",
      //   });
      // }


      const [imeiRows] =
        await pool.execute(
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


      const [existingDevice] =
        await pool.execute(
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

const vendorId = req.user.id;

      const conn =
        new Client();

      conn.on(
        "ready",
        () => {

          console.log(
            "✅ SSH Connected"
          );

          const command =
            `/home/certAdmin/scripts/gen_cert.sh ${imei} ${vendorId} ${solution}`;

          console.log(
            "Running:",
            command
          );

          conn.exec(
            command,
            (
              err,
              stream
            ) => {

              if (err) {
                conn.end();

                return res
                  .status(500)
                  .json({
                    error:
                      "SSH execution failed",
                    details:
                      err.message,
                  });
              }

              let output =
                "";

              let errorOutput =
                "";

              stream.on(
                "data",
                (
                  data
                ) => {
                  output +=
                    data.toString();
                }
              );

              stream.stderr.on(
                "data",
                (
                  data
                ) => {
                  errorOutput +=
                    data.toString();
                }
              );

              stream.on(
                "close",
                async () => {

                  conn.end();

                  try {

                    const json =
                      JSON.parse(
                        output.trim()
                      );

                    await pool.execute(
                      `
  INSERT INTO devices
  (
      imei,
      vendor_id,
      solution
  )
  VALUES
  (
      ?,
      ?,
      ?
  )
  `,
                      [
                        imei,
                        vendorId,
                        solution
                      ]
                    );

subscribeDevice(imei);
                    return res.json(
                      json
                    );

                  } catch (
                  parseErr
                  ) {

                    return res
                      .status(
                        500
                      )
                      .json({
                        error:
                          "Invalid JSON response from VPS",
                        stdout:
                          output,
                        stderr:
                          errorOutput,
                      });
                  }
                }
              );
            }
          );
        }
      );

      conn.on(
        "error",
        (
          err
        ) => {

          return res
            .status(500)
            .json({
              error:
                "SSH connection failed",
              details:
                err.message,
            });
        }
      );

      conn.connect({
        host:
          process.env
            .VPS_HOST,

        port: 22,

        username:
          process.env
            .VPS_USER,

        privateKey:
          fs.readFileSync(
            process.env
              .SSH_KEY_PATH
          ),
      });

    } catch (err) {

      console.error(
        "FULL ERROR:",
        err
      );

      return res.status(500).json({
        error:
          "Server error",

        details:
          err.message,

        stack:
          err.stack,
      });
    }
  };

const path = require("path");









exports.downloadCertificate = async (req, res) => {
  try {
    const { certificateId, type } = req.params;

    console.log("📥 Download request:", { certificateId, type });

    const baseDir = `/home/certAdmin/certs/devices/${certificateId}`;
    const imei = certificateId.split("_")[0];

    let filePath;
    let filename;

    switch (type) {
      case "crt":
        filePath = `${baseDir}/${imei}.crt`;
        filename = `${imei}.crt`;
        break;
      case "key":
        filePath = `${baseDir}/${imei}.key`;
        filename = `${imei}.key`;
        break;
      case "ca":
        filePath = `${baseDir}/ca.crt`;
        filename = "ca.crt";
        break;
      case "credentials":
        filePath = `${baseDir}/credentials.json`;
        // filename = "credentials.txt";
        filename = "credentials.json";

        break;
      default:
        return res.status(404).json({ error: "Invalid file type" });
    }

    console.log("🔍 Looking for file at:", filePath);

     // NEET TO BE CHECKED

    // Use SSH SFTP to read file from VPS
    const conn = new Client();

    return new Promise((resolve, reject) => {
      conn.on("ready", () => {
        console.log("✅ SSH connected for SFTP");

        conn.sftp((err, sftp) => {
          if (err) {
            console.error("❌ SFTP error:", err);
            conn.end();
            return resolve(res.status(500).json({ error: "SFTP connection failed" }));
          }
          


          // Read file from VPS
          sftp.readFile(filePath, (err, buffer) => {
            conn.end();

            if (err) {
              console.error("❌ File read error:", err.message);
              return resolve(res.status(404).json({
                error: "File not found",
                details: err.message,
                path: filePath
              }));
            }

            console.log("✅ File read successfully, size:", buffer.length);

            // Send as download
            res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
            res.setHeader("Content-Type", "application/octet-stream");
            res.setHeader("Content-Length", buffer.length);

            return resolve(res.send(buffer));
          });
        });
      });

      conn.on("error", (err) => {
        console.error("❌ SSH connection error:", err.message);
        return resolve(res.status(500).json({
          error: "SSH connection failed",
          details: err.message
        }));
      });

      conn.connect({
        host: process.env.VPS_HOST,
        port: 22,
        username: process.env.VPS_USER,
        privateKey: fs.readFileSync(process.env.SSH_KEY_PATH),
        readyTimeout: 10000,
      });

      // Timeout after 15 seconds
      setTimeout(() => {
        conn.end();
        if (!res.headersSent) {
          return resolve(res.status(500).json({ error: "Download timeout" }));
        }
      }, 15000);
    });

  } catch (err) {
    console.error("❌ Download error:", err);
    return res.status(500).json({
      error: err.message
    });
  }
};







exports.getCredentials = async (req, res) => {

  console.log(
    "GET CREDENTIALS HIT"
  );
  try {

    const { certificateId } = req.params;

    const filePath =
      `/home/certAdmin/certs/devices/${certificateId}/credentials.json`;

    if (!fs.existsSync(filePath)) {

      return res.status(404).json({
        error: "Credentials file not found"
      });
    }

    const content =
      fs.readFileSync(filePath, "utf8");

    const imei =
      content.match(/IMEI:\s*(.+)/)?.[1]?.trim();

    const clientId =
      content.match(/Client ID:\s*(.+)/)?.[1]?.trim();

    const username =
      content.match(/Username:\s*(.+)/)?.[1]?.trim();

    const password =
      content.match(/Password:\s*(.+)/)?.[1]?.trim();

    return res.json({
      imei,
      clientId,
      username,
      password
    });

  } catch (err) {

    console.error(err);

    return res.status(500).json({
      error: err.message
    });
  }
};