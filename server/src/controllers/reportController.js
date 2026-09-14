// const pool = require("../config/database");
// const { decrypt } = require("../utils/encryption");


// // =====================================================
// // CSV VALUE ESCAPE
// // =====================================================

// function csvValue(value) {
//     if (value === null || value === undefined) {
//         return "";
//     }

//     const text = String(value);
//     const escaped = text.replace(/"/g, '""');

//     if (
//         escaped.includes(",") ||
//         escaped.includes('"') ||
//         escaped.includes("\n")
//     ) {
//         return `"${escaped}"`;
//     }

//     return escaped;
// }


// // =====================================================
// // MYSQL DATETIME FORMAT
// // =====================================================

// function toMysqlDateTime(date) {
//     const year = date.getFullYear();

//     const month =
//         String(date.getMonth() + 1)
//             .padStart(2, "0");

//     const day =
//         String(date.getDate())
//             .padStart(2, "0");

//     const hours =
//         String(date.getHours())
//             .padStart(2, "0");

//     const minutes =
//         String(date.getMinutes())
//             .padStart(2, "0");

//     const seconds =
//         String(date.getSeconds())
//             .padStart(2, "0");

//     return (
//         `${year}-${month}-${day} ` +
//         `${hours}:${minutes}:${seconds}`
//     );
// }


// // =====================================================
// // CSV DATE FORMAT
// //
// // 31-08-2026.23:56:10
// // =====================================================

// function formatReportDate(dateValue) {

//     if (!dateValue) {
//         return "";
//     }

//     const date = new Date(dateValue);

//     if (Number.isNaN(date.getTime())) {
//         return "";
//     }

//     const day =
//         String(date.getDate())
//             .padStart(2, "0");

//     const month =
//         String(date.getMonth() + 1)
//             .padStart(2, "0");

//     const year =
//         date.getFullYear();

//     const hour =
//         String(date.getHours())
//             .padStart(2, "0");

//     const minute =
//         String(date.getMinutes())
//             .padStart(2, "0");

//     const second =
//         String(date.getSeconds())
//             .padStart(2, "0");

//     return (
//         `${day}-${month}-${year}.` +
//         `${hour}:${minute}:${second}`
//     );
// }


// // =====================================================
// // DECRYPT MESSAGE
// // =====================================================

// function parseMessage(row) {

//     if (
//         row.iv &&
//         row.auth_tag
//     ) {

//         const decrypted =
//             decrypt(
//                 row.payload,
//                 row.iv,
//                 row.auth_tag
//             );

//         return JSON.parse(
//             decrypted
//         );
//     }

//     return JSON.parse(
//         row.payload
//     );
// }


// // =====================================================
// // DOWNLOAD DAILY INVERTER REPORT
// // =====================================================

// exports.downloadInverterReport =
// async (req, res) => {

//     try {

//         // =============================================
//         // USER
//         // =============================================

//         const userId =
//             req.user?.id;

//         if (!userId) {
//             return res.status(401).json({
//                 error: "Unauthorized"
//             });
//         }


//         // =============================================
//         // INPUT
//         // =============================================

//         const deviceId =
//             Number(
//                 req.query.device_id
//             );

//         const startRaw =
//             req.query.start;

//         const endRaw =
//             req.query.end;


//         if (
//             !Number.isInteger(deviceId) ||
//             deviceId <= 0
//         ) {
//             return res.status(400).json({
//                 error: "Invalid device_id"
//             });
//         }


//         if (!startRaw || !endRaw) {
//             return res.status(400).json({
//                 error:
//                     "Start and end date are required"
//             });
//         }


//         const requestedStart =
//             new Date(startRaw);

//         const requestedEnd =
//             new Date(endRaw);


//         if (
//             Number.isNaN(
//                 requestedStart.getTime()
//             ) ||
//             Number.isNaN(
//                 requestedEnd.getTime()
//             )
//         ) {
//             return res.status(400).json({
//                 error:
//                     "Invalid start or end date"
//             });
//         }


//         if (
//             requestedStart >=
//             requestedEnd
//         ) {
//             return res.status(400).json({
//                 error:
//                     "End date must be after start date"
//             });
//         }


//         // =============================================
//         // VERIFY USER OWNS DEVICE
//         // =============================================

//         const [deviceRows] =
//             await pool.execute(
//                 `
//                 SELECT
//                     d.id,
//                     d.imei,
//                     d.solution,
//                     d.device_version,
//                     ud.location

//                 FROM user_devices ud

//                 INNER JOIN devices d
//                     ON d.id = ud.device_id

//                 WHERE
//                     ud.user_id = ?
//                     AND d.id = ?

//                 LIMIT 1
//                 `,
//                 [
//                     userId,
//                     deviceId
//                 ]
//             );


//         if (
//             deviceRows.length === 0
//         ) {
//             return res.status(403).json({
//                 error:
//                     "You do not have access to this device"
//             });
//         }


//         const device =
//             deviceRows[0];

//         const imei =
//             device.imei;


//         // =============================================
//         // FIRST AVAILABLE MESSAGE
//         // =============================================

//         const [firstRows] =
//             await pool.execute(
//                 `
//                 SELECT
//                     created_at

//                 FROM messages

//                 WHERE imei = ?

//                 ORDER BY
//                     created_at ASC,
//                     id ASC

//                 LIMIT 1
//                 `,
//                 [imei]
//             );


//         if (
//             firstRows.length === 0
//         ) {
//             return res.status(404).json({
//                 error:
//                     "No data available for this device"
//             });
//         }


//         const firstAvailable =
//             new Date(
//                 firstRows[0].created_at
//             );


//         // =============================================
//         // EFFECTIVE START
//         //
//         // Requested start too old?
//         // Use first available message.
//         // =============================================

//         const effectiveStart =
//             requestedStart <
//             firstAvailable

//                 ? firstAvailable

//                 : requestedStart;


//         // =============================================
//         // GET ONE MESSAGE PER DAY
//         //
//         // Rule:
//         // latest available message of each day
//         //
//         // ROW_NUMBER handles duplicate timestamps too.
//         // =============================================

//         const [rows] =
//             await pool.execute(
//                 `
//                 SELECT
//                     id,
//                     payload,
//                     iv,
//                     auth_tag,
//                     created_at

//                 FROM
//                 (
//                     SELECT
//                         m.id,
//                         m.payload,
//                         m.iv,
//                         m.auth_tag,
//                         m.created_at,

//                         ROW_NUMBER() OVER (
//                             PARTITION BY
//                                 DATE(m.created_at)

//                             ORDER BY
//                                 m.created_at DESC,
//                                 m.id DESC
//                         ) AS rn

//                     FROM messages m

//                     WHERE
//                         m.imei = ?
//                         AND m.created_at >= ?
//                         AND m.created_at <= ?
//                 ) ranked

//                 WHERE rn = 1

//                 ORDER BY
//                     created_at ASC
//                 `,
//                 [
//                     imei,

//                     toMysqlDateTime(
//                         effectiveStart
//                     ),

//                     toMysqlDateTime(
//                         requestedEnd
//                     )
//                 ]
//             );


//         if (
//             rows.length === 0
//         ) {
//             return res.status(404).json({
//                 error:
//                     "No data available in the selected date range"
//             });
//         }


//         // =============================================
//         // RESPONSE HEADERS
//         // =============================================

//         const filename =
//             `inverter-data-${imei}.csv`;


//         res.setHeader(
//             "Content-Type",
//             "text/csv; charset=utf-8"
//         );

//         res.setHeader(
//             "Content-Disposition",
//             `attachment; filename="${filename}"`
//         );


//         // Excel UTF-8 support
//         res.write("\uFEFF");


//         // =============================================
//         // REPORT METADATA
//         // =============================================

//         res.write(
//             `Report Type:,inverter-data\n`
//         );

//         res.write(
//             `IMEI:,${csvValue(imei)}\n`
//         );

//         res.write(
//             `Device Type:,${csvValue(device.solution)}\n`
//         );

//         res.write(
//             `Location:,${csvValue(device.location)}\n`
//         );

//         res.write(
//             `Requested Start:,${csvValue(
//                 formatReportDate(
//                     requestedStart
//                 )
//             )}\n`
//         );

//         res.write(
//             `Actual Start:,${csvValue(
//                 formatReportDate(
//                     effectiveStart
//                 )
//             )}\n`
//         );

//         res.write(
//             `Requested End:,${csvValue(
//                 formatReportDate(
//                     requestedEnd
//                 )
//             )}\n`
//         );

//         res.write(
//             `Sampling:,Latest reading of each day\n`
//         );

//         res.write("\n");


//         // =============================================
//         // HEADERS
//         // =============================================

//         // const headers = [
//         //     "Created At (dd-MM-yyyy.HH:mm:ss)",
//         //     "Inverter Voltage (V)",
//         //     "Inverter Current (A)",
//         //     "Inverter Frequency (Hz)",
//         //     "Grid Voltage (V)",
//         //     "Grid Frequency (Hz)",
//         //     "DC Voltage (V)",
//         //     "PV Voltage (V)",
//         //     "PV Current (A)",
//         //     "PV Power (W)",
//         //     "Inv Temperature (°C)",
//         //     "Export Power (W)",
//         //     "Cumulative Gen (kWh)",
//         //     "CUF"
//         // ];


//         const headers = [
//     "Created At (dd-MM-yyyy.HH:mm:ss)",
//     "Inverter Voltage (V)",
//     "Inverter Current (A)",
//     "Grid Voltage (V)",
//     "Grid Frequency (Hz)",
//     "DC Voltage (V)",
//     "PV Voltage (V)",
//     "PV Current (A)",
//     "PV Power (W)",
//     "Inv Temperature (°C)",
//     "Export Power (W)",
//     "Cumulative Gen (kWh)"
// ];


//         res.write(
//             headers
//                 .map(csvValue)
//                 .join(",") +
//             "\n"
//         );


//         // =============================================
//         // PROCESS DAILY ROWS
//         // =============================================

//         for (
//             const row of rows
//         ) {

//             let payload;

//             try {

//                 payload =
//                     parseMessage(row);

//             } catch (err) {

//                 console.error(
//                     "REPORT MESSAGE PARSE ERROR",
//                     {
//                         messageId:
//                             row.id,

//                         error:
//                             err.message
//                     }
//                 );

//                 // Skip corrupted message
//                 continue;
//             }


       

//             let inverterVoltage = "";
//             let inverterCurrent = "";
//             // let inverterFrequency = "";

//             let gridVoltage = "";
//             let gridFrequency = "";

//             let dcVoltage = "";
//             let pvVoltage = "";
//             let pvCurrent = "";
//             let pvPower = "";

//             let temperature = "";
//             let exportPower = "";
//             let cumulativeGeneration = "";

//             let rating = null;


//                 // Adjust these mappings if your
//                 // protocol definition differs.

//                 inverterVoltage =
//                     payload?.VN ?? "";

//                 inverterCurrent =
//                     payload?.DCI1 ?? "";

//                 inverterFrequency =
//                     payload?.GFREQ ?? "";

//                 gridVoltage =
//                     payload?.VN ?? "";

//                 gridFrequency =
//                     payload?.GFREQ ?? "";

//                 dcVoltage =
//                     payload?.DCV1 ?? "";

//                 pvVoltage =
//                     payload?.PV ?? "";

//                 pvCurrent =
//                     payload?.PI ?? "";

//                 pvPower =
//                     payload?.PPOW ?? "";

//                 temperature =
//                     payload?.TEMP ?? "";

//                 exportPower =
//                     payload?.POW ?? "";

//                 cumulativeGeneration =
//                     payload?.LKWH ?? "";

//                 rating =
//                     Number(
//                         payload?.RAT
//                     );


          


//             // =========================================
//             // CUF
//             //
//             // Daily CUF cannot be calculated from a
//             // single cumulative reading alone unless
//             // we derive that day's generated energy.
//             //
//             // Leave blank for now.
//             // =========================================

//             // const cuf =
//             //     "";


//             // =========================================
//             // CSV ROW
//             // =========================================

//             // const csvRow = [

//             //     formatReportDate(
//             //         row.created_at
//             //     ),

//             //     inverterVoltage,

//             //     inverterCurrent,

//             //     inverterFrequency,

//             //     gridVoltage,

//             //     gridFrequency,

//             //     dcVoltage,

//             //     pvVoltage,

//             //     pvCurrent,

//             //     pvPower,

//             //     temperature,

//             //     exportPower,

//             //     cumulativeGeneration,

//             //     cuf
//             // ];


//             const csvRow = [

//                 formatReportDate(
//                     row.created_at
//                 ),

//                 inverterVoltage,

//                 inverterCurrent,


//                 gridVoltage,

//                 gridFrequency,

//                 dcVoltage,

//                 pvVoltage,

//                 pvCurrent,

//                 pvPower,

//                 temperature,

//                 exportPower,

//                 cumulativeGeneration,

//             ];



//             res.write(
//                 csvRow
//                     .map(csvValue)
//                     .join(",") +
//                 "\n"
//             );
//         }


//         return res.end();


//     } catch (err) {

//         console.error(
//             "INVERTER REPORT ERROR:",
//             err
//         );


//         if (
//             res.headersSent
//         ) {
//             return res.end();
//         }


//         return res.status(500).json({
//             error:
//                 "Failed to generate inverter report"
//         });
//     }
// };












const pool = require("../config/database");
const { decrypt } = require("../utils/encryption");


// =====================================================
// CSV HELPERS
// =====================================================

function csvValue(value) {

    if (
        value === null ||
        value === undefined
    ) {
        return "";
    }

    const text =
        String(value);

    const escaped =
        text.replace(/"/g, '""');

    if (
        escaped.includes(",") ||
        escaped.includes('"') ||
        escaped.includes("\n")
    ) {
        return `"${escaped}"`;
    }

    return escaped;
}


function formatReportDate(dateValue) {

    if (!dateValue) {
        return "";
    }

    const date =
        new Date(dateValue);

    if (
        Number.isNaN(
            date.getTime()
        )
    ) {
        return "";
    }

    const day =
        String(date.getDate())
            .padStart(2, "0");

    const month =
        String(date.getMonth() + 1)
            .padStart(2, "0");

    const year =
        date.getFullYear();

    const hour =
        String(date.getHours())
            .padStart(2, "0");

    const minute =
        String(date.getMinutes())
            .padStart(2, "0");

    const second =
        String(date.getSeconds())
            .padStart(2, "0");

    return (
        `${day}-${month}-${year}.` +
        `${hour}:${minute}:${second}`
    );
}


// Used for filename:
//
// 2026-08-31
function formatFilenameDate(dateValue) {

    const date =
        new Date(dateValue);

    const year =
        date.getFullYear();

    const month =
        String(date.getMonth() + 1)
            .padStart(2, "0");

    const day =
        String(date.getDate())
            .padStart(2, "0");

    return `${year}-${month}-${day}`;
}


function toMysqlDateTime(date) {

    const year =
        date.getFullYear();

    const month =
        String(date.getMonth() + 1)
            .padStart(2, "0");

    const day =
        String(date.getDate())
            .padStart(2, "0");

    const hour =
        String(date.getHours())
            .padStart(2, "0");

    const minute =
        String(date.getMinutes())
            .padStart(2, "0");

    const second =
        String(date.getSeconds())
            .padStart(2, "0");

    return (
        `${year}-${month}-${day} ` +
        `${hour}:${minute}:${second}`
    );
}


// =====================================================
// PAYLOAD
// =====================================================

function parsePayload(row) {

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



function getGenerationDateRange(
    reportType
) {

    const end =
        new Date();

    // End of today
    end.setHours(
        23,
        59,
        59,
        999
    );


    const start =
        new Date(end);


    if (
        reportType ===
        "generation-7-days"
    ) {

        // Your sample:
        // Sep 4 -> Aug 28
        start.setDate(
            start.getDate() - 7
        );

    } else if (
        reportType ===
        "generation-1-month"
    ) {

        start.setMonth(
            start.getMonth() - 1
        );

    } else if (
        reportType ===
        "generation-3-months"
    ) {

        start.setMonth(
            start.getMonth() - 3
        );
    }


    start.setHours(
        0,
        0,
        0,
        0
    );


    return {
        start,
        end
    };
}

// =====================================================
// BIT HELPER
// =====================================================

function bitIsSet(value, bit) {

    const number =
        Number(value);

    if (
        !Number.isFinite(number)
    ) {
        return false;
    }

    return Boolean(
        number &
        (1 << bit)
    );
}


function csvBoolean(value) {

    return value
        ? "TRUE"
        : "FALSE";
}


// =====================================================
// INVERTER DATA CSV
// =====================================================

function writeInverterReport(
    res,
    rows
) {

    const headers = [

        "Created At (dd-MM-yyyy.HH:mm:ss)",

        "Inverter Voltage (V)",
        "Inverter Current (A)",

        "Grid Voltage (V)",
        "Grid Frequency (Hz)",

        "DC Voltage (V)",

        "PV Voltage (V)",
        "PV Current (A)",
        "PV Power (W)",

        "Inv Temperature (°C)",

        "Export Power (W)",

        "Cumulative Gen (kWh)"
    ];


    res.write(
        headers
            .map(csvValue)
            .join(",") +
        "\n"
    );


    for (
        const row
        of rows
    ) {

        let payload;

        try {

            payload =
                parsePayload(row);

        } catch (err) {

            console.error(
                "REPORT PAYLOAD ERROR:",
                row.id,
                err.message
            );

            continue;
        }


        // -------------------------------------------------
        // Current mapping only.
        //
        // No VD=5 / VD=7 branching yet.
        // -------------------------------------------------

        const csvRow = [

            formatReportDate(
                row.created_at
            ),

            payload?.VN ?? "",
            payload?.DCI1 ?? "",

            payload?.VN ?? "",
            payload?.GFREQ ?? "",

            payload?.DCV1 ?? "",

            payload?.PV ?? "",
            payload?.PI ?? "",
            payload?.PPOW ?? "",

            payload?.TEMP ?? "",

            payload?.POW ?? "",

            payload?.LKWH ?? ""
        ];


        res.write(
            csvRow
                .map(csvValue)
                .join(",") +
            "\n"
        );
    }
}


// =====================================================
// FAULT CSV
// =====================================================

function writeFaultReport(
    res,
    rows
) {

    const headers = [

        "Created At (dd-MM-yyyy.HH:mm:ss)",

        // ST1
        "Grid Over-Voltage",
        "Grid Under-Voltage",
        "Grid Over-Frequency",
        "Grid Under-Frequency",
        "Inverter Over-Current",
        "Inverter Current-Unbalance",
        "Over Temperature",

        // ST2
        "PV Over-Voltage",
        "PV Under-Voltage",
        "PV Over-Current",
        "DC Over-Voltage",
        "DC Under-Voltage",
        "Earth Fault",

        // ST3
        "IRS",
        "GRS",
        "PFS",

        // Telemetry
        "Inverter Voltage (V)",
        "Inverter Current (A)",

        "Grid Voltage (V)",
        "Grid Frequency (Hz)",

        "DC Voltage (V)",

        "PV Voltage (V)",
        "PV Current (A)",
        "PV Power (W)",

        "Inv Temperature (°C)",
        "Export Power (W)"
    ];


    res.write(
        headers
            .map(csvValue)
            .join(",") +
        "\n"
    );


    for (
        const row
        of rows
    ) {

        let payload;

        try {

            payload =
                parsePayload(row);

        } catch (err) {

            console.error(
                "FAULT REPORT PAYLOAD ERROR:",
                row.id,
                err.message
            );

            continue;
        }


        const st1 =
            payload?.ST1 ?? 0;

        const st2 =
            payload?.ST2 ?? 0;

        const st3 =
            payload?.ST3 ?? 0;


        const csvRow = [

            // =========================================
            // CREATED AT
            // =========================================

            formatReportDate(
                row.created_at
            ),


            // =========================================
            // ST1 FAULTS
            // =========================================

            csvBoolean(
                bitIsSet(st1, 0)
            ),

            csvBoolean(
                bitIsSet(st1, 1)
            ),

            csvBoolean(
                bitIsSet(st1, 2)
            ),

            csvBoolean(
                bitIsSet(st1, 3)
            ),

            csvBoolean(
                bitIsSet(st1, 4)
            ),

            csvBoolean(
                bitIsSet(st1, 5)
            ),

            csvBoolean(
                bitIsSet(st1, 6)
            ),


            // =========================================
            // ST2 FAULTS
            // =========================================

            csvBoolean(
                bitIsSet(st2, 0)
            ),

            csvBoolean(
                bitIsSet(st2, 1)
            ),

            csvBoolean(
                bitIsSet(st2, 2)
            ),

            csvBoolean(
                bitIsSet(st2, 3)
            ),

            csvBoolean(
                bitIsSet(st2, 4)
            ),

            csvBoolean(
                bitIsSet(st2, 5)
            ),


            // =========================================
            // ST3 STATUS
            //
            // bit 0 = IRS
            // bit 1 = GRS
            // bit 2 = intentionally NOT exported
            // bit 3 = PFS
            // =========================================

            csvBoolean(
                bitIsSet(st3, 0)
            ),

            csvBoolean(
                bitIsSet(st3, 1)
            ),

            csvBoolean(
                bitIsSet(st3, 3)
            ),


            // =========================================
            // TELEMETRY
            // =========================================

            payload?.VN ?? "",

            payload?.DCI1 ?? "",

            payload?.VN ?? "",

            payload?.GFREQ ?? "",

            payload?.DCV1 ?? "",

            payload?.PV ?? "",

            payload?.PI ?? "",

            payload?.PPOW ?? "",

            payload?.TEMP ?? "",

            payload?.POW ?? ""
        ];


        res.write(
            csvRow
                .map(csvValue)
                .join(",") +
            "\n"
        );
    }
}

function mysqlDateToLocalDate(value) {

    const [
        year,
        month,
        day
    ] =
        String(value)
            .slice(0, 10)
            .split("-")
            .map(Number);

    return new Date(
        year,
        month - 1,
        day,
        0,
        0,
        0,
        0
    );
}

function formatMysqlDate(
    date
) {

    const year =
        date.getFullYear();

    const month =
        String(
            date.getMonth() + 1
        ).padStart(
            2,
            "0"
        );

    const day =
        String(
            date.getDate()
        ).padStart(
            2,
            "0"
        );

    return (
        `${year}-${month}-${day}`
    );
}


async function generateGenerationHistoryReport({
    res,
    imei,
    reportType,
    start,
    end
}) {

    // =====================================================
    // FIRST AVAILABLE CUF RECORD
    // =====================================================

    const [firstRows] =
        await pool.execute(
            `
            SELECT
                record_date

            FROM cuf_history

            WHERE imei = ?

            ORDER BY
                record_date ASC,
                id ASC

            LIMIT 1
            `,
            [
                imei
            ]
        );


    if (
        firstRows.length === 0
    ) {

        return res
            .status(404)
            .json({
                error:
                    "No generation history available for this device"
            });
    }


    // const firstAvailableDate =
    //     new Date(
    //         firstRows[0].record_date
    //     );

    const firstAvailableDate =
    mysqlDateToLocalDate(
        firstRows[0].record_date
    );

    // Same behavior as your other report:
    // If requested period starts before
    // available history, begin from first record.

    const effectiveStart =
        start <
        firstAvailableDate
            ? firstAvailableDate
            : start;


    // =====================================================
    // GET CUF HISTORY
    // =====================================================

    const [rows] =
        await pool.execute(
            `
            SELECT
                record_date,
                daily_generated_kwh,
                cumulative_generation_kwh,
                daily_cuf,
                monthly_cuf,
                yearly_cuf,
                updated_at

            FROM cuf_history

            WHERE
                imei = ?
                AND record_date >= ?
                AND record_date <= ?

            ORDER BY
                record_date ASC
            `,
            [
                imei,
                formatMysqlDate(
                    effectiveStart
                ),
                formatMysqlDate(
                    end
                )
            ]
        );


    if (
        rows.length === 0
    ) {

        return res
            .status(404)
            .json({
                error:
                    "No generation history available for selected period"
            });
    }


    // =====================================================
    // FILE NAME
    // =====================================================

    const fromDate =
        formatFilenameDate(
            effectiveStart
        );

    const toDate =
        formatFilenameDate(
            end
        );


    const filename =
        `${imei}_${reportType}_${fromDate}T${toDate}.csv`;


    res.setHeader(
        "Content-Type",
        "text/csv; charset=utf-8"
    );

    res.setHeader(
        "Content-Disposition",
        `attachment; filename="${filename}"`
    );


    res.write(
        "\uFEFF"
    );


    // =====================================================
    // METADATA
    // =====================================================

    // res.write(
    //     `Report Type:,${csvValue(reportType)}\n`
    // );

    // res.write(
    //     `IMEI:,${csvValue(imei)}\n`
    // );

    // res.write(
    //     `From:,${csvValue(
    //         formatReportDate(
    //             effectiveStart
    //         )
    //     )}\n`
    // );

    // res.write(
    //     `To:,${csvValue(
    //         formatReportDate(
    //             end
    //         )
    //     )}\n`
    // );


//     res.write(
//     `From:,${csvValue(
//         formatFilenameDate(
//             effectiveStart
//         )
//     )}\n`
// );

// res.write(
//     `To:,${csvValue(
//         formatFilenameDate(
//             end
//         )
//     )}\n`
// );

//     res.write("\n");

res.write(
    `Report Type:,${csvValue(reportType)}\n`
);


res.write(
    `IMEI:,${csvValue(imei)}\n`
);

res.write(
    `From:,${csvValue(
        formatReportDate(
            effectiveStart
        )
    )}\n`
);

res.write(
    `To:,${csvValue(
        formatReportDate(
            end
        )
    )}\n`
);

res.write("\n");


    // =====================================================
    // HEADERS
    // =====================================================

    const headers = [

        "Created At (dd-MM-yyyy.HH:mm:ss)",

        "tkWh",

        "Cumulative Gen (kWh)",

        "cuf",

        "monthly_cuf",

        "yearly_cuf"
    ];


    res.write(
        headers
            .map(csvValue)
            .join(",") +
        "\n"
    );


    // =====================================================
    // ROWS
    // =====================================================

    for (
        const row
        of rows
    ) {

        const csvRow = [

            formatReportDate(
                row.updated_at
            ),

            row.daily_generated_kwh,

            row.cumulative_generation_kwh,

            row.daily_cuf,

            row.monthly_cuf,

            row.yearly_cuf
        ];


        res.write(
            csvRow
                .map(csvValue)
                .join(",") +
            "\n"
        );
    }


    return res.end();
}


// =====================================================
// DOWNLOAD REPORT
// =====================================================

exports.downloadReport =
async (req, res) => {

    try {

        // =================================================
        // PUBLIC — no login. Device identified by IMEI.
        // =================================================

        const imeiParam =
            String(
                req.query.imei || ""
            ).trim();


        // =================================================
        // REQUEST VALUES
        // =================================================

        const reportType =
            req.query.report_type;

        const startRaw =
            req.query.start;

        const endRaw =
            req.query.end;


        // =================================================
        // REPORT TYPE
        // =================================================

        // const allowedTypes = [

        //     "inverter-data",

        //     "event-fault-log"
        // ];

        const allowedTypes = [
    "inverter-data",
    "event-fault-log",
    "generation-7-days",
    "generation-1-month",
    "generation-3-months"
];

const isGenerationReport =
    reportType === "generation-7-days" ||
    reportType === "generation-1-month" ||
    reportType === "generation-3-months";

        if (
            !allowedTypes.includes(
                reportType
            )
        ) {

            return res
                .status(400)
                .json({
                    error:
                        "Invalid report type"
                });
        }


        // =================================================
        // DEVICE
        // =================================================

        if (
            !/^\d{15}$/.test(imeiParam)
        ) {

            return res
                .status(400)
                .json({
                    error:
                        "Invalid imei"
                });
        }


        // =================================================
        // DATES
        // =================================================

        // if (
        //     !startRaw ||
        //     !endRaw
        // ) {

        //     return res
        //         .status(400)
        //         .json({
        //             error:
        //                 "Start and end date are required"
        //         });
        // }


        // const requestedStart =
        //     new Date(startRaw);

        // const requestedEnd =
        //     new Date(endRaw);


        // if (
        //     Number.isNaN(
        //         requestedStart.getTime()
        //     ) ||
        //     Number.isNaN(
        //         requestedEnd.getTime()
        //     )
        // ) {

        //     return res
        //         .status(400)
        //         .json({
        //             error:
        //                 "Invalid date range"
        //         });
        // }


        // if (
        //     requestedStart >=
        //     requestedEnd
        // ) {

        //     return res
        //         .status(400)
        //         .json({
        //             error:
        //                 "End date must be after start date"
        //         });
        // }


        let requestedStart = null;
let requestedEnd = null;

if (!isGenerationReport) {

    if (
        !startRaw ||
        !endRaw
    ) {
        return res
            .status(400)
            .json({
                error:
                    "Start and end date are required"
            });
    }

    requestedStart =
        new Date(startRaw);

    requestedEnd =
        new Date(endRaw);

    if (
        Number.isNaN(
            requestedStart.getTime()
        ) ||
        Number.isNaN(
            requestedEnd.getTime()
        )
    ) {
        return res
            .status(400)
            .json({
                error:
                    "Invalid date range"
            });
    }

    if (
        requestedStart >=
        requestedEnd
    ) {
        return res
            .status(400)
            .json({
                error:
                    "End date must be after start date"
            });
    }
}

        // =================================================
        // FETCH DEVICE
        // =================================================

        const [deviceRows] =
            await pool.execute(
                `
                SELECT
                    id,
                    imei,
                    solution,
                    device_version

                FROM devices

                WHERE imei = ?

                LIMIT 1
                `,
                [
                    imeiParam
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

        const imei =
            device.imei;



            if (isGenerationReport) {

    const {
        start,
        end
    } =
        getGenerationDateRange(
            reportType
        );


    return await generateGenerationHistoryReport({
        res,
        imei,
        reportType,
        start,
        end
    });
}


        // =================================================
        // FIRST AVAILABLE MESSAGE
        // =================================================

        const [firstRows] =
            await pool.execute(
                `
                SELECT
                    created_at

                FROM messages

                WHERE imei = ?

                ORDER BY
                    created_at ASC,
                    id ASC

                LIMIT 1
                `,
                [
                    imei
                ]
            );


        if (
            firstRows.length === 0
        ) {

            return res
                .status(404)
                .json({
                    error:
                        "No data available for this device"
                });
        }


        const firstAvailable =
            new Date(
                firstRows[0].created_at
            );


        // =================================================
        // EFFECTIVE START
        // =================================================

        const effectiveStart =
            requestedStart <
            firstAvailable

                ? firstAvailable

                : requestedStart;


        // =================================================
        // LATEST MESSAGE OF EACH DAY
        // =================================================

        const [rows] =
            await pool.execute(
                `
                SELECT
                    id,
                    payload,
                    iv,
                    auth_tag,
                    created_at

                FROM
                (
                    SELECT
                        m.id,
                        m.payload,
                        m.iv,
                        m.auth_tag,
                        m.created_at,

                        ROW_NUMBER() OVER (
                            PARTITION BY
                                DATE(m.created_at)

                            ORDER BY
                                m.created_at DESC,
                                m.id DESC
                        ) AS rn

                    FROM messages m

                    WHERE
                        m.imei = ?
                        AND m.created_at >= ?
                        AND m.created_at <= ?
                ) ranked

                WHERE rn = 1

                ORDER BY
                    created_at ASC
                `,
                [
                    imei,

                    toMysqlDateTime(
                        effectiveStart
                    ),

                    toMysqlDateTime(
                        requestedEnd
                    )
                ]
            );


        if (
            rows.length === 0
        ) {

            return res
                .status(404)
                .json({
                    error:
                        "No data available in selected date range"
                });
        }


        // =================================================
        // GET SERIAL NUMBER
        // =================================================

        let serialNumber =
            imei;


        try {

            const firstPayload =
                parsePayload(
                    rows[0]
                );


            // Use whatever protocol provides.
            // Fallback to IMEI.
            serialNumber =
                firstPayload?.SRN_H ||
                firstPayload?.SRN_L ||
                imei;

        } catch {

            serialNumber =
                imei;
        }


        // =================================================
        // FILE NAME
        //
        // Example:
        //
        // event-fault-log_863..._
        // 2026-08-31_to_2026-09-02.csv
        // =================================================

        const fromDate =
            formatFilenameDate(
                effectiveStart
            );

        const toDate =
            formatFilenameDate(
                requestedEnd
            );


        const filename =
            `${imei}_${reportType}_${fromDate}T${toDate}.csv`;


        res.setHeader(
            "Content-Type",
            "text/csv; charset=utf-8"
        );


        res.setHeader(
            "Content-Disposition",
            `attachment; filename="${filename}"`
        );


        // Excel UTF-8 BOM
        res.write("\uFEFF");


        // =================================================
        // FILE METADATA
        // =================================================

        // res.write(
        //     `Report Type:,${csvValue(reportType)}\n`
        // );


        // res.write(
        //     `Serial Number:,${csvValue(serialNumber)}\n`
        // );


        // res.write(
        //     `IMEI:,${csvValue(imei)}\n`
        // );


        // res.write(
        //     `From:,${csvValue(
        //         formatReportDate(
        //             effectiveStart
        //         )
        //     )}\n`
        // );


        // res.write(
        //     `To:,${csvValue(
        //         formatReportDate(
        //             requestedEnd
        //         )
        //     )}\n`
        // );


        // res.write("\n");


        res.write(
    `Report Type:,${csvValue(reportType)}\n`
);

res.write(
    `IMEI:,${csvValue(imei)}\n`
);

res.write(
    `From:,${csvValue(
        formatFilenameDate(
            effectiveStart
        )
    )}\n`
);

// res.write(
//     `To:,${csvValue(
//         formatFilenameDate(
//             end
//         )
//     )}\n`
// );
res.write(
    `To:,${csvValue(
        formatFilenameDate(
            requestedEnd
        )
    )}\n`
);

res.write("\n");


        // =================================================
        // GENERATE SELECTED REPORT
        // =================================================

        if (
            reportType ===
            "inverter-data"
        ) {

            writeInverterReport(
                res,
                rows
            );

        } else {

            writeFaultReport(
                res,
                rows
            );
        }


        return res.end();


    } catch (err) {

        console.error(
            "REPORT DOWNLOAD ERROR:",
            err
        );


        if (
            res.headersSent
        ) {

            return res.end();
        }


        return res
            .status(500)
            .json({
                error:
                    "Failed to generate report"
            });
    }
};