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

        // const encrypted = encrypt(JSON.stringify(parsed));

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
        // await pool.execute(
        //     `INSERT INTO messages
        //     (
        //         imei,
        //         app_version,
        //         solution,
        //         message_type,
        //         direction,
        //         payload,
        //         iv,
        //         auth_tag
        //     )
        //     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        //     [
        //         topicInfo.imei,
        //         topicInfo.appVersion,
        //         topicInfo.solution,
        //         topicInfo.messageType,
        //         topicInfo.direction,
        //         encrypted.encryptedData,
        //         encrypted.iv,
        //         encrypted.authTag
        //     ]
        // );


        await pool.execute(
    `
    INSERT INTO messages
    (
        imei,
        app_version,
        solution,
        message_type,
        direction,
        payload
    )
    VALUES (?, ?, ?, ?, ?, ?)
    `,
    [
        topicInfo.imei,
        topicInfo.appVersion,
        topicInfo.solution,
        topicInfo.messageType,
        topicInfo.direction,
        JSON.stringify(parsed)
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

// const lkwh = Number(parsed.LKWH);


const LKWH = Number(parsed.LKWH) || 0;
const LKWL = Number(parsed.LKWL) || 0;

// const LKWH = Number(payload.LKWH) || 0;
// const LKWL = Number(payload.LKWL) || 0;

const lkwh =
    (((LKWH & 0xFFFF) << 16) | (LKWL & 0xFFFF)) >>> 0;


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

//         // SUBSRIBING TEST

//         client.subscribe("testt/#", (err) => {
//             if (err) {
//                 console.error(
//                     "Failed to subscribe to test:",
//                     err.message
//                 );
//             } else {
//                 console.log("Subscribed: test");
//             }
//         });

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

//     if (topic === "testt") {
//         topic =
//             "testt/inverter/863438080130923/data/pub";

//         console.log(
//             "Test topic detected. Converted topic:",
//             topic
//         );
//     }
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


//         // =====================================================
// // UPDATE DEVICE RATED CAPACITY
// // RAT comes from inverter in Watts.
// // Store capacity in kW.
// // =====================================================

// const ratWatts = Number(parsed.RAT);

// if (
//     Number.isFinite(ratWatts) &&
//     ratWatts > 0
// ) {

//     const ratedCapacityKw =
//         ratWatts / 1000;

//     await pool.execute(
//         `
//         UPDATE devices
//         SET rated_capacity_kw = ?
//         WHERE imei = ?
//         `,
//         [
//             ratedCapacityKw,
//             topicInfo.imei
//         ]
//     );
// }

//         // ─────────────────────────────────────────────
//         // ENCRYPT PAYLOAD
//         // ─────────────────────────────────────────────

//         // const encrypted = encrypt(JSON.stringify(parsed));

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
//         // await pool.execute(
//         //     `INSERT INTO messages
//         //     (
//         //         imei,
//         //         app_version,
//         //         solution,
//         //         message_type,
//         //         direction,
//         //         payload,
//         //         iv,
//         //         auth_tag
//         //     )
//         //     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
//         //     [
//         //         topicInfo.imei,
//         //         topicInfo.appVersion,
//         //         topicInfo.solution,
//         //         topicInfo.messageType,
//         //         topicInfo.direction,
//         //         encrypted.encryptedData,
//         //         encrypted.iv,
//         //         encrypted.authTag
//         //     ]
//         // );


//         await pool.execute(
//     `
//     INSERT INTO messages
//     (
//         imei,
//         app_version,
//         solution,
//         message_type,
//         direction,
//         payload
//     )
//     VALUES (?, ?, ?, ?, ?, ?)
//     `,
//     [
//         topicInfo.imei,
//         topicInfo.appVersion,
//         topicInfo.solution,
//         topicInfo.messageType,
//         topicInfo.direction,
//         JSON.stringify(parsed)
//     ]
// );
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

// // const lkwh = Number(parsed.LKWH);


// const LKWH = Number(parsed.LKWH) || 0;
// const LKWL = Number(parsed.LKWL) || 0;

// // const LKWH = Number(payload.LKWH) || 0;
// // const LKWL = Number(payload.LKWL) || 0;

// const lkwh =
//     (((LKWH & 0xFFFF) << 16) | (LKWL & 0xFFFF)) >>> 0;


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