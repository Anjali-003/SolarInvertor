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

//         //parsed is the JS object of the payload from MQTT
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
//         // UPDATE DEVICE RATED CAPACITY
//         // RAT comes from inverter in Watts.
//         // Store capacity in kW.
//         // =====================================================

//         const ratWatts = Number(parsed.RAT);

//         if (
//             Number.isFinite(ratWatts) &&
//             ratWatts > 0
//         ) {

//             const ratedCapacityKw =
//                 ratWatts / 1000;

//             await pool.execute(
//                 `
//                 UPDATE devices
//                 SET rated_capacity_kw = ?
//                 WHERE imei = ?
//                 `,
//                 [
//                     ratedCapacityKw,
//                     topicInfo.imei
//                 ]
//             );
//         }

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



// // =====================================================
// // READ ENERGY REGISTERS
// // =====================================================

// const LKWH = Number(parsed.LKWH);
// const LKWL = Number(parsed.LKWL);

// // -1 means the inverter does not currently have
// // a valid cumulative energy reading.
// const hasNoLkwhReading =
//     LKWH === -1 ||
//     LKWL === -1 ||
//     !Number.isFinite(LKWH) ||
//     !Number.isFinite(LKWL);


// // =====================================================
// // COMBINE HIGH + LOW ENERGY REGISTERS
// // =====================================================

// const lkwh =
//     hasNoLkwhReading
//         ? null
//         : (
//             ((LKWH & 0xFFFF) << 16) |
//             (LKWL & 0xFFFF)
//         ) >>> 0;


// // =====================================================
// // SAVE LKWH ENERGY HISTORY
// // =====================================================

// if (
//     !hasNoLkwhReading &&
//     Number.isFinite(lkwh)
// ) {

//     const recordedAt = new Date();

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


//     // =================================================
//     // UPDATE HOURLY ENERGY
//     // =================================================

//     try {

//         await aggregateHourlyLKWH(
//             topicInfo.imei,
//             recordedAt
//         );

//     } catch (aggregationError) {

//         console.error(
//             "Hourly aggregation failed:",
//             aggregationError
//         );
//     }
// }


// // =====================================================
// // SAVE SOLAR POWER HISTORY
// //
// // IMPORTANT:
// // This is OUTSIDE the LKWH block.
// //
// // PPOW is independent from LKWH/LKWL.
// // Even if LKWH = -1, valid PPOW data will still
// // be saved.
// // =====================================================

// const ppowWatts = Number(parsed.PPOW);

// if (
//     Number.isFinite(ppowWatts) &&
//     ppowWatts >= 0
// ) {

//     const powerKw =
//         ppowWatts / 1000;

//     const powerRecordedAt =
//         new Date();

//     await pool.execute(
//         `
//         INSERT INTO solar_power_history
//         (
//             imei,
//             power_kw,
//             recorded_at
//         )
//         VALUES (?, ?, ?)
//         `,
//         [
//             topicInfo.imei,
//             powerKw,
//             powerRecordedAt
//         ]
//     );

//     console.log(
//         `Solar power saved: ${topicInfo.imei} -> ${powerKw} kW`
//     );
// }




// // const LKWH = Number(parsed.LKWH) || 0;
// // const LKWL = Number(parsed.LKWL) || 0;

// // // const LKWH = Number(payload.LKWH) || 0;
// // // const LKWL = Number(payload.LKWL) || 0;

// // // -1 on either register means "no reading yet" from the
// // // device. Combining -1 registers with `>>> 0` (unsigned)
// // // wraps them into ~4294967295 instead of a real reading, so
// // // skip the combine (and the DB insert below) entirely when
// // // either half is the -1 sentinel.
// // const hasNoLkwhReading =
// //     LKWH === -1 || LKWL === -1;

// // const lkwh =
// //     hasNoLkwhReading
// //         ? null
// //         : (((LKWH & 0xFFFF) << 16) | (LKWL & 0xFFFF)) >>> 0;


// // if (!hasNoLkwhReading && Number.isFinite(lkwh)) {

// //     const recordedAt = new Date();

// //     // =====================================================
// //     // SAVE RAW LKWH READING
// //     // =====================================================

// //     await pool.execute(
// //         `
// //         INSERT INTO energy_history
// //         (
// //             imei,
// //             lkwh,
// //             recorded_at
// //         )
// //         VALUES (?, ?, ?)
// //         `,
// //         [
// //             topicInfo.imei,
// //             lkwh,
// //             recordedAt
// //         ]
// //     );

// //     console.log(
// //         `Energy history saved: ${topicInfo.imei} -> LKWH ${lkwh}`
// //     );


// //     // =====================================================
// // // SAVE SOLAR POWER HISTORY
// // // PPOW is received in Watts.
// // // Store it in kW.
// // // =====================================================

// // const ppowWatts =
// //     Number(parsed.PPOW);

// // if (
// //     Number.isFinite(ppowWatts) &&
// //     ppowWatts >= 0
// // ) {

// //     const powerKw =
// //         ppowWatts / 1000;

// //     await pool.execute(
// //         `
// //         INSERT INTO solar_power_history
// //         (
// //             imei,
// //             power_kw,
// //             recorded_at
// //         )
// //         VALUES (?, ?, ?)
// //         `,
// //         [
// //             topicInfo.imei,
// //             powerKw,
// //             new Date()
// //         ]
// //     );

// //     console.log(
// //         `Solar power saved: ${topicInfo.imei} -> ${powerKw} kW`
// //     );
// // }
// //     // =====================================================
// //     // UPDATE HOURLY ENERGY
// //     // =====================================================

// //     try {

// //         await aggregateHourlyLKWH(
// //             topicInfo.imei,
// //             recordedAt
// //         );

// //         // await completePreviousHours(
// //         //     topicInfo.imei,
// //         //     recordedAt
// //         // );

// //     } catch (aggregationError) {

// //         // IMPORTANT:
// //         // We do NOT fail the MQTT message
// //         // just because hourly aggregation failed.

// //         console.error(
// //             "Hourly aggregation failed:",
// //             aggregationError
// //         );
// //     }
// // }

//     // } catch (err) {
//     //     console.error("Error:", err.message);
//     // }
//     } catch (err) {
//     console.error("MQTT HANDLER ERROR:", err);
//     console.error("SQL ERROR CODE:", err.code);
//     console.error("SQL ERROR MESSAGE:", err.sqlMessage);
// }
// });

















const client =
    require("./mqttClient");

const pool =
    require("../config/database");

const parseTopic =
    require("../utils/parseTopic");

const {
    normalizeInverterPayload
} =
    require(
        "../utils/normalizeInverterPayload"
    );

const {
    aggregateHourlyLKWH
} =
    require(
        "../services/hourlyEnergyService"
    );


// =====================================================
// MQTT CONNECT
// =====================================================

client.on(
    "connect",
    async () => {

        try {

            console.log(
                "Loading devices..."
            );


            // =================================================
            // TEST SUBSCRIPTION
            // =================================================

            client.subscribe(
                "testt/#",
                (err) => {

                    if (err) {

                        console.error(
                            "Failed to subscribe to test:",
                            err.message
                        );

                    } else {

                        console.log(
                            "Subscribed: test"
                        );
                    }
                }
            );


            // =================================================
            // LOAD REGISTERED DEVICES
            // =================================================

            const [devices] =
                await pool.execute(
                    `
                    SELECT
                        imei,
                        device_version,
                        solution
                    FROM devices
                    `
                );


            for (
                const device
                of devices
            ) {

                const topic =
                    `${device.device_version}/${device.solution}/${device.imei}/#`;


                client.subscribe(
                    topic
                );


                console.log(
                    "Subscribed:",
                    topic
                );
            }

        } catch (err) {

            console.error(
                "MQTT subscription error:",
                err.message
            );
        }
    }
);


// =====================================================
// MQTT MESSAGE
// =====================================================

client.on(
    "message",
    async (
        topic,
        message
    ) => {

        const payload =
            message.toString();


        // =================================================
        // TEST TOPIC
        // =================================================

        if (
            topic === "testt"
        ) {

            topic =
                "testt/inverter/863438080130923/data/pub";


            console.log(
                "Test topic detected. Converted topic:",
                topic
            );
        }


        const topicInfo =
            parseTopic(
                topic
            );


        console.log(
            "========== MQTT MESSAGE =========="
        );

        console.log(
            "Topic:",
            topic
        );

        console.log(
            "Topic Info:",
            topicInfo
        );

        console.log(
            "Payload:",
            payload
        );

        console.log(
            "=================================="
        );


        try {

            // =================================================
            // PARSE PAYLOAD
            // =================================================

            let parsed;


            try {

                parsed =
                    JSON.parse(
                        payload
                    );

            } catch {

                const fixed =
                    payload.replace(
                        /([A-Z0-9\-]+):/g,
                        '"$1":'
                    );


                parsed =
                    JSON.parse(
                        fixed
                    );
            }


            // =================================================
            // VERIFY IMEI FROM TOPIC
            // =================================================

            if (
                !topicInfo?.imei
            ) {

                console.log(
                    "No IMEI found in MQTT topic:",
                    topic
                );

                return;
            }


            // =================================================
            // GET REGISTERED DEVICE
            // =================================================

            const [deviceRows] =
                await pool.execute(
                    `
                    SELECT
                        imei,
                        device_type,
                        rated_capacity_kw
                    FROM devices
                    WHERE imei = ?
                    LIMIT 1
                    `,
                    [
                        topicInfo.imei
                    ]
                );


            if (
                deviceRows.length === 0
            ) {

                console.log(
                    "Data received for unregistered device:",
                    topicInfo.imei
                );

                return;
            }


            const device =
                deviceRows[0];


            // =================================================
            // VALIDATE PAYLOAD DEVICE TYPE
            // =================================================

            const payloadDeviceType =
                Number(
                    parsed.VD
                );

            const registeredDeviceType =
                Number(
                    device.device_type
                );


            if (
                !Number.isInteger(
                    payloadDeviceType
                )
            ) {

                console.log(
                    `Invalid VD received from ${topicInfo.imei}:`,
                    parsed.VD
                );

                return;
            }


            if (
                payloadDeviceType !==
                registeredDeviceType
            ) {

                console.log(
                    `Device type mismatch for ${topicInfo.imei}. ` +
                    `Registered VD=${registeredDeviceType}, ` +
                    `received VD=${payloadDeviceType}`
                );

                return;
            }


            // =================================================
            // NORMALIZE PAYLOAD
            // =================================================

            let normalized;


            try {

                normalized =
                    normalizeInverterPayload(
                        parsed
                    );

            } catch (
                normalizationError
            ) {

                console.error(
                    `Payload normalization failed for ${topicInfo.imei}:`,
                    normalizationError.message
                );

                return;
            }


            console.log(
                "Normalized inverter data:",
                normalized
            );


            // =================================================
            // UPDATE RATED CAPACITY
            // =================================================

            if (
                Number.isFinite(
                    normalized.ratedCapacityKw
                ) &&
                normalized.ratedCapacityKw > 0
            ) {

                await pool.execute(
                    `
                    UPDATE devices
                    SET rated_capacity_kw = ?
                    WHERE imei = ?
                    `,
                    [
                        normalized.ratedCapacityKw,
                        topicInfo.imei
                    ]
                );
            }


            // =================================================
            // SAVE RAW MESSAGE
            // =================================================

            await pool.execute(
                `
                INSERT INTO messages
                (
                    imei,
                    device_type,
                    app_version,
                    solution,
                    message_type,
                    direction,
                    payload
                )
                VALUES (?, ?, ?, ?, ?, ?, ?)
                `,
                [
                    topicInfo.imei,
                    normalized.deviceType,
                    topicInfo.appVersion,
                    topicInfo.solution,
                    topicInfo.messageType,
                    topicInfo.direction,
                    JSON.stringify(
                        parsed
                    )
                ]
            );


            console.log(
                `Message saved for IMEI: ${topicInfo.imei}, VD=${normalized.deviceType}`
            );


            // =================================================
            // SAVE CUMULATIVE ENERGY
            // =================================================

            const cumulativeEnergy =
                normalized.cumulativeEnergy;


            if (
                Number.isFinite(
                    cumulativeEnergy
                ) &&
                cumulativeEnergy >= 0
            ) {

                const recordedAt =
                    new Date();


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
                        cumulativeEnergy,
                        recordedAt
                    ]
                );


                console.log(
                    `Energy history saved: ${topicInfo.imei} -> LKWH ${cumulativeEnergy}`
                );


                // =============================================
                // UPDATE HOURLY ENERGY
                // =============================================

                try {

                    await aggregateHourlyLKWH(
                        topicInfo.imei,
                        recordedAt
                    );

                } catch (
                    aggregationError
                ) {

                    console.error(
                        "Hourly aggregation failed:",
                        aggregationError
                    );
                }
            }


            // =================================================
            // SAVE SOLAR POWER
            //
            // Independent of cumulative energy.
            // =================================================

            const solarPowerKw =
                normalized.solarPowerKw;


            if (
                Number.isFinite(
                    solarPowerKw
                ) &&
                solarPowerKw >= 0
            ) {

                const powerRecordedAt =
                    new Date();


                await pool.execute(
                    `
                    INSERT INTO solar_power_history
                    (
                        imei,
                        power_kw,
                        recorded_at
                    )
                    VALUES (?, ?, ?)
                    `,
                    [
                        topicInfo.imei,
                        solarPowerKw,
                        powerRecordedAt
                    ]
                );


                console.log(
                    `Solar power saved: ${topicInfo.imei} -> ${solarPowerKw} kW`
                );
            }

        } catch (err) {

            console.error(
                "MQTT HANDLER ERROR:",
                err
            );

            console.error(
                "SQL ERROR CODE:",
                err.code
            );

            console.error(
                "SQL ERROR MESSAGE:",
                err.sqlMessage
            );
        }
    }
);









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