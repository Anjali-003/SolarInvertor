// // const mqtt = require("mqtt");
// const client = require("./mqttClient");
// const pool = require("../config/database");
// const parseTopic = require("../utils/parseTopic");
// const { encrypt } = require("../utils/encryption");


// // module.exports = () => {

//   // const client = mqtt.connect(
//   //   process.env.MQTT_URL,
//   //   {
//   //     username: process.env.MQTT_USER,
//   //     password: process.env.MQTT_PASS,
//   //   }
//   // );

//   // client.on("connect", () => {

//   //   console.log("MQTT connected");

//   //   client.subscribe(
//   //     process.env.MQTT_TOPIC
//   //   );
//   // });


// // const APP = process.env.MQTT_APP_VERSION;
// // const SOLUTION = process.env.MQTT_SOLUTION;
// // const DIRECTION = process.env.MQTT_DIRECTION;

// // const SUBTOPICS =
// //     process.env.MQTT_SUBTOPICS.split(",");

// client.on("connect", async () => {

//     console.log("Loading devices...");

//     const [devices] = await pool.execute(
//         "SELECT imei, device_version, solution FROM devices"
//     );

// //     devices.forEach(device => {

// //         SUBTOPICS.forEach(subTopic => {

// //             const topic =
// // `${APP}/${SOLUTION}/${device.imei}/${subTopic}/${DIRECTION}`;

// //             client.subscribe(topic);

// //             console.log("Subscribed:", topic);

// //         });

// //     });

// devices.forEach(device => {

// const topic =
// `${device.device_version}/${device.solution}/${device.imei}/#`;

//     client.subscribe(topic);

//     console.log("Subscribed:", topic);

// });

// });


//   client.on("message", async (topic, message) => {

//     const payload = message.toString();
//     const topicInfo = parseTopic(topic);

//     // console.log("Received:", payload);

//     try {

//       // parse payload
//       let parsed;

//       try {

//         parsed = JSON.parse(payload);

//       } catch {

//         const fixed =
//           payload.replace(
//             /([A-Z0-9\-]+):/g,
//             '"$1":'
//           );

//         parsed = JSON.parse(fixed);
//       }

//       // dynamically find ASN field
//       // const asnKey =
//       //   Object.keys(parsed).find(
//       //     key => key.startsWith("ASN_")
//       //   );

//       // if (!asnKey) {

//       //   console.log("No ASN key found");

//       //   return;
//       // }


//         const asnKey =
//         Object.keys(parsed).find(
//           key => key.startsWith("ASN_")
//         );

//       if (!asnKey) {

//         console.log("No ASN key found");

//         return;
//       }

      
//       const [deviceRows] =
//         await pool.execute(
//           `SELECT * FROM devices
//      WHERE imei = ?`,
//           [topicInfo.imei]
//         );

//       if (deviceRows.length === 0) {

//         console.log("Data received for unregistered device:");

//         return;
//       }

//       // serial number
//       const serial =
//         parsed[asnKey];




//   // await pool.execute(
//   //       `INSERT INTO messages
//   // (
//   //   imei,
//   //   app_version,
//   //   solution,
//   //   message_type,
//   //   direction,
//   //   topic,
//   //   payload
//   // )
//   // VALUES (?, ?, ?, ?, ?, ?, ?)`,
//   //       [
//   //         topicInfo.imei,
//   //         topicInfo.appVersion,
//   //         topicInfo.solution,
//   //         topicInfo.messageType,
//   //         topicInfo.direction,
//   //         topic,
//   //         JSON.stringify(parsed),
//   //       ]
//   //     );


//   const encrypted = encrypt(JSON.stringify(parsed));

// await pool.execute(
//   `INSERT INTO messages
//   (
//     imei,
//     app_version,
//     solution,
//     message_type,
//     direction,
//     payload,
//     iv,
//     auth_tag,
//     serial_number
//   )
//   VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
//   [
//     topicInfo.imei,
//     topicInfo.appVersion,
//     topicInfo.solution,
//     topicInfo.messageType,
//     topicInfo.direction,
//     encrypted.encryptedData,
//     encrypted.iv,
//     encrypted.authTag,
//     serial
//   ]
// );

//       // LIVE SOCKET UPDATE
//       // io.to(topicInfo.imei.toString())
//       //   .emit("inverterData", parsed);

//       // console.log(
//       //   `Live emitted to ${topicInfo.imei}`
//       // );


// //       io.on(
// //   "connection",
// //   (socket) => {

// //     socket.on(
// //       "joinDevice",
// //       (imei) => {

// //         socket.join(
// //           imei.toString()
// //         );

// //         console.log(
// //           "Joined room:",
// //           imei
// //         );

// //       }
// //     );

// //   }
// // );

//     } catch (err) {

//       console.error(
//         "Error:",
//         err.message
//       );
//     }
//   });
// // };


//  THIS IS GOOD MQTT HANDLER 

// const client = require("./mqttClient");
// const pool = require("../config/database");
// const parseTopic = require("../utils/parseTopic");
// const { encrypt } = require("../utils/encryption");

// const {
//     aggregateHourlyLKWH,
//     // completePreviousHours
// } = require("../services/hourlyEnergyService");

// client.on("connect", async () => {
//     try {
//         console.log("Loading devices...");

//         const [devices] = await pool.execute(
//             "SELECT imei, device_version, solution FROM devices"
//         );

//         devices.forEach((device) => {
//             const topic =
//                 `${device.device_version}/${device.solution}/${device.imei}/#`;

//             client.subscribe(topic);

//             console.log("Subscribed:", topic);
//         });
//     } catch (err) {
//         console.error("MQTT subscription error:", err.message);
//     }
// });

// client.on("message", async (topic, message) => {
//     const payload = message.toString();
//     const topicInfo = parseTopic(topic);

// console.log("========== MQTT MESSAGE ==========");
// console.log("Topic:", topic);
// console.log("Topic Info:", topicInfo);
// console.log("Payload:", payload);
// console.log("==================================");
//     try {
//         // ─────────────────────────────────────────────
//         // PARSE PAYLOAD
//         // ─────────────────────────────────────────────

//         let parsed;

//         try {
//             parsed = JSON.parse(payload);
//         } catch {
//             const fixed = payload.replace(
//                 /([A-Z0-9\-]+):/g,
//                 '"$1":'
//             );

//             parsed = JSON.parse(fixed);
//         }

//         // ─────────────────────────────────────────────
//         // VERIFY DEVICE USING IMEI ONLY
//         // ─────────────────────────────────────────────

//         if (!topicInfo?.imei) {
//             console.log("No IMEI found in MQTT topic:", topic);
//             return;
//         }

//         const [deviceRows] = await pool.execute(
//             `SELECT imei
//              FROM devices
//              WHERE imei = ?`,
//             [topicInfo.imei]
//         );

//         if (deviceRows.length === 0) {
//             console.log(
//                 "Data received for unregistered device:",
//                 topicInfo.imei
//             );
//             return;
//         }

//         // ─────────────────────────────────────────────
//         // ENCRYPT PAYLOAD
//         // ─────────────────────────────────────────────

//         const encrypted = encrypt(JSON.stringify(parsed));

//         // ─────────────────────────────────────────────
//         // SAVE MESSAGE
//         // ─────────────────────────────────────────────
// console.log("INSERT DATA:", {
//     imei: topicInfo.imei,
//     app_version: topicInfo.appVersion,
//     solution: topicInfo.solution,
//     message_type: topicInfo.messageType,
//     direction: topicInfo.direction,
// });
//         await pool.execute(
//             `INSERT INTO messages
//             (
//                 imei,
//                 app_version,
//                 solution,
//                 message_type,
//                 direction,
//                 payload,
//                 iv,
//                 auth_tag
//             )
//             VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
//             [
//                 topicInfo.imei,
//                 topicInfo.appVersion,
//                 topicInfo.solution,
//                 topicInfo.messageType,
//                 topicInfo.direction,
//                 encrypted.encryptedData,
//                 encrypted.iv,
//                 encrypted.authTag
//             ]
//         );

//         console.log(
//             `Message saved for IMEI: ${topicInfo.imei}`
//         );


// // ─────────────────────────────────────────────
// // SAVE LKWH ENERGY HISTORY
// // ─────────────────────────────────────────────

// // const lkwh = Number(parsed.LKWH);

// // if (Number.isFinite(lkwh)) {

// //     await pool.execute(
// //         `INSERT INTO energy_history
// //         (
// //             imei,
// //             lkwh,
// //             recorded_at
// //         )
// //         VALUES (?, ?, ?)`,
// //         [
// //             topicInfo.imei,
// //             lkwh,
// //             new Date()
// //         ]
// //     );

// //     console.log(
// //         `Energy history saved: ${topicInfo.imei} -> LKWH ${lkwh}`
// //     );
// // }



// // ─────────────────────────────────────────────
// // SAVE LKWH ENERGY HISTORY
// // ─────────────────────────────────────────────

// const lkwh = Number(parsed.LKWH);

// if (Number.isFinite(lkwh)) {

//     const recordedAt = new Date();

//     // =====================================================
//     // SAVE RAW LKWH READING
//     // =====================================================

//     await pool.execute(
//         `
//         INSERT INTO energy_history
//         (
//             imei,
//             lkwh,
//             recorded_at
//         )
//         VALUES (?, ?, ?)
//         `,
//         [
//             topicInfo.imei,
//             lkwh,
//             recordedAt
//         ]
//     );

//     console.log(
//         `Energy history saved: ${topicInfo.imei} -> LKWH ${lkwh}`
//     );

//     // =====================================================
//     // UPDATE HOURLY ENERGY
//     // =====================================================

//     try {

//         await aggregateHourlyLKWH(
//             topicInfo.imei,
//             recordedAt
//         );

//         // await completePreviousHours(
//         //     topicInfo.imei,
//         //     recordedAt
//         // );

//     } catch (aggregationError) {

//         // IMPORTANT:
//         // We do NOT fail the MQTT message
//         // just because hourly aggregation failed.

//         console.error(
//             "Hourly aggregation failed:",
//             aggregationError
//         );
//     }
// }

//     // } catch (err) {
//     //     console.error("Error:", err.message);
//     // }
//     } catch (err) {
//     console.error("MQTT HANDLER ERROR:", err);
//     console.error("SQL ERROR CODE:", err.code);
//     console.error("SQL ERROR MESSAGE:", err.sqlMessage);
// }
// });


























const client = require("./mqttClient");
const pool = require("../config/database");
const parseTopic = require("../utils/parseTopic");
const { encrypt } = require("../utils/encryption");

const {
    aggregateHourlyLKWH,
    // completePreviousHours
} = require("../services/hourlyEnergyService");

client.on("connect", async () => {
    try {
        console.log("Loading devices...");

        // SUBSRIBING TEST

        client.subscribe("testt/#", (err) => {
            if (err) {
                console.error(
                    "Failed to subscribe to test:",
                    err.message
                );
            } else {
                console.log("Subscribed: test");
            }
        });

        const [devices] = await pool.execute(
            "SELECT imei, device_version, solution FROM devices"
        );

        devices.forEach((device) => {
            const topic =
                `${device.device_version}/${device.solution}/${device.imei}/#`;

            client.subscribe(topic);

            console.log("Subscribed:", topic);
        });
    } catch (err) {
        console.error("MQTT subscription error:", err.message);
    }
});

client.on("message", async (topic, message) => {
    const payload = message.toString();

    if (topic === "testt") {
        topic =
            "testt/inverter/863438080130923/data/pub";

        console.log(
            "Test topic detected. Converted topic:",
            topic
        );
    }
    const topicInfo = parseTopic(topic);

console.log("========== MQTT MESSAGE ==========");
console.log("Topic:", topic);
console.log("Topic Info:", topicInfo);
console.log("Payload:", payload);
console.log("==================================");
    try {
        // ─────────────────────────────────────────────
        // PARSE PAYLOAD
        // ─────────────────────────────────────────────

        let parsed;

        try {
            parsed = JSON.parse(payload);
        } catch {
            const fixed = payload.replace(
                /([A-Z0-9\-]+):/g,
                '"$1":'
            );

            parsed = JSON.parse(fixed);
        }

        // ─────────────────────────────────────────────
        // VERIFY DEVICE USING IMEI ONLY
        // ─────────────────────────────────────────────

        if (!topicInfo?.imei) {
            console.log("No IMEI found in MQTT topic:", topic);
            return;
        }

        const [deviceRows] = await pool.execute(
            `SELECT imei
             FROM devices
             WHERE imei = ?`,
            [topicInfo.imei]
        );

        if (deviceRows.length === 0) {
            console.log(
                "Data received for unregistered device:",
                topicInfo.imei
            );
            return;
        }

        // ─────────────────────────────────────────────
        // ENCRYPT PAYLOAD
        // ─────────────────────────────────────────────

        const encrypted = encrypt(JSON.stringify(parsed));

        // ─────────────────────────────────────────────
        // SAVE MESSAGE
        // ─────────────────────────────────────────────
console.log("INSERT DATA:", {
    imei: topicInfo.imei,
    app_version: topicInfo.appVersion,
    solution: topicInfo.solution,
    message_type: topicInfo.messageType,
    direction: topicInfo.direction,
});
        await pool.execute(
            `INSERT INTO messages
            (
                imei,
                app_version,
                solution,
                message_type,
                direction,
                payload,
                iv,
                auth_tag
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                topicInfo.imei,
                topicInfo.appVersion,
                topicInfo.solution,
                topicInfo.messageType,
                topicInfo.direction,
                encrypted.encryptedData,
                encrypted.iv,
                encrypted.authTag
            ]
        );

        console.log(
            `Message saved for IMEI: ${topicInfo.imei}`
        );


// ─────────────────────────────────────────────
// SAVE LKWH ENERGY HISTORY
// ─────────────────────────────────────────────

// const lkwh = Number(parsed.LKWH);

// if (Number.isFinite(lkwh)) {

//     await pool.execute(
//         `INSERT INTO energy_history
//         (
//             imei,
//             lkwh,
//             recorded_at
//         )
//         VALUES (?, ?, ?)`,
//         [
//             topicInfo.imei,
//             lkwh,
//             new Date()
//         ]
//     );

//     console.log(
//         `Energy history saved: ${topicInfo.imei} -> LKWH ${lkwh}`
//     );
// }



// ─────────────────────────────────────────────
// SAVE LKWH ENERGY HISTORY
// ─────────────────────────────────────────────

const lkwh = Number(parsed.LKWH);

if (Number.isFinite(lkwh)) {

    const recordedAt = new Date();

    // =====================================================
    // SAVE RAW LKWH READING
    // =====================================================

    await pool.execute(
        `
        INSERT INTO energy_history
        (
            imei,
            lkwh,
            recorded_at
        )
        VALUES (?, ?, ?)
        `,
        [
            topicInfo.imei,
            lkwh,
            recordedAt
        ]
    );

    console.log(
        `Energy history saved: ${topicInfo.imei} -> LKWH ${lkwh}`
    );

    // =====================================================
    // UPDATE HOURLY ENERGY
    // =====================================================

    try {

        await aggregateHourlyLKWH(
            topicInfo.imei,
            recordedAt
        );

        // await completePreviousHours(
        //     topicInfo.imei,
        //     recordedAt
        // );

    } catch (aggregationError) {

        // IMPORTANT:
        // We do NOT fail the MQTT message
        // just because hourly aggregation failed.

        console.error(
            "Hourly aggregation failed:",
            aggregationError
        );
    }
}

    // } catch (err) {
    //     console.error("Error:", err.message);
    // }
    } catch (err) {
    console.error("MQTT HANDLER ERROR:", err);
    console.error("SQL ERROR CODE:", err.code);
    console.error("SQL ERROR MESSAGE:", err.sqlMessage);
}
});