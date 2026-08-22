const pool = require("../config/database");

const {
    aggregateHour
} = require("../utils/hourlyEnergy");


// =====================================================
// HELPER
// =====================================================

function startOfDay(date) {

    const result = new Date(date);

    result.setHours(
        0,
        0,
        0,
        0
    );

    return result;
}


function startOfMonth(date) {

    const result = new Date(date);

    result.setDate(1);

    result.setHours(
        0,
        0,
        0,
        0
    );

    return result;
}


function startOfYear(date) {

    const result = new Date(date);

    result.setMonth(0);

    result.setDate(1);

    result.setHours(
        0,
        0,
        0,
        0
    );

    return result;
}


// =====================================================
// GET PREVIOUS COMPLETED HOUR
// =====================================================

function getLastCompletedHour(now) {

    const result = new Date(now);

    result.setMinutes(
        0,
        0,
        0
    );

    return result;
}


// =====================================================
// FORMAT DATE FOR MYSQL
// =====================================================

function toMysqlDateTime(date) {

    const year =
        date.getFullYear();

    const month =
        String(
            date.getMonth() + 1
        ).padStart(2, "0");

    const day =
        String(
            date.getDate()
        ).padStart(2, "0");

    const hours =
        String(
            date.getHours()
        ).padStart(2, "0");

    const minutes =
        String(
            date.getMinutes()
        ).padStart(2, "0");

    const seconds =
        String(
            date.getSeconds()
        ).padStart(2, "0");


    return (
        `${year}-${month}-${day} ` +
        `${hours}:${minutes}:${seconds}`
    );
}


// =====================================================
// GENERATE COMPLETED HOUR END TIMES
// =====================================================

function generateHours(
    start,
    end
) {

    const hours = [];

    const current =
        new Date(start);


    while (
        current <= end
    ) {

        hours.push(
            new Date(current)
        );

        current.setHours(
            current.getHours() + 1
        );
    }


    return hours;
}


// =====================================================
// CALCULATE / STORE COMPLETED HOURS
// =====================================================

async function calculateCompletedHours(
    imei,
    from,
    to
) {

    const hours =
        generateHours(
            from,
            to
        );


    const results = [];


    for (
        const hourEnd
        of hours
    ) {

        const result =
            await aggregateHour(
                imei,
                hourEnd
            );


        if (result) {

            results.push(
                result
            );
        }
    }


    return results;
}


// =====================================================
// GET HOURLY DATA FROM DATABASE
// =====================================================

async function getHourlyData(
    imei,
    start,
    end
) {

    const [rows] =
        await pool.execute(
            `
            SELECT
                hour_end,
                start_lkwh,
                end_lkwh,
                energy_kwh
            FROM hourly_energy
            WHERE imei = ?
              AND hour_end >= ?
              AND hour_end <= ?
            ORDER BY hour_end ASC
            `,
            [
                imei,

                toMysqlDateTime(
                    start
                ),

                toMysqlDateTime(
                    end
                )
            ]
        );


    return rows.map(
        row => ({

            hour:
                row.hour_end,

            energy:
                Number(
                    row.energy_kwh
                )
        })
    );
}


// =====================================================
// TODAY CHART
// =====================================================

function createTodayChart(
    rows,
    now
) {

    const chart =
        Array.from(
            {
                length: 24
            },
            (_, hour) => ({

                label:
                    `${String(hour).padStart(2, "0")}:00`,

                value: 0
            })
        );


    for (
        const row of rows
    ) {

        const date =
            new Date(
                row.hour
            );


        const hour =
            date.getHours();


        /*
         * Remember:
         *
         * DB 12:00
         *
         * means
         *
         * 11:00 -> 12:00
         *
         * Therefore graph label should
         * be 11:00.
         */

        const graphHour =
            hour;


        if (
            graphHour >= 0 &&
            graphHour < 24
        ) {

            chart[
                graphHour
            ].value +=
                row.energy;
        }
    }


    return chart.map(
        item => ({

            label:
                item.label,

            value:
                Number(
                    item.value.toFixed(3)
                )
        })
    );
}


// =====================================================
// MONTHLY CHART
// =====================================================

function createMonthlyChart(
    rows,
    year,
    month
) {

    const daysInMonth =
        new Date(
            year,
            month + 1,
            0
        ).getDate();


    const chart =
        Array.from(
            {
                length:
                    daysInMonth
            },
            (_, index) => ({

                label:
                    String(index + 1),

                value: 0
            })
        );


    for (
        const row of rows
    ) {

        const date =
            new Date(
                row.hour
            );


        const day =
            date.getDate();


        /*
         * The hour_end belongs to the
         * same calendar day for completed
         * hours.
         */

        if (
            date.getFullYear() !== year ||
            date.getMonth() !== month
        ) {

            continue;
        }


        chart[
            day - 1
        ].value +=
            row.energy;
    }


    return chart.map(
        item => ({

            label:
                item.label,

            value:
                Number(
                    item.value.toFixed(3)
                )
        })
    );
}


// =====================================================
// YEARLY CHART
// =====================================================

function createYearlyChart(
    rows,
    year
) {

    const labels = [

        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec"

    ];


    const chart =
        labels.map(
            label => ({

                label,

                value: 0
            })
        );


    for (
        const row of rows
    ) {

        const date =
            new Date(
                row.hour
            );


        if (
            date.getFullYear()
            !== year
        ) {

            continue;
        }


        const month =
            date.getMonth();


        chart[
            month
        ].value +=
            row.energy;
    }


    return chart.map(
        item => ({

            label:
                item.label,

            value:
                Number(
                    item.value.toFixed(3)
                )
        })
    );
}


// =====================================================
// ENERGY SUMMARY API
// =====================================================

exports.getEnergySummary =
    async (req, res) => {

        try {

            // const imei =
            //     req.user?.imei;

            const userId = req.user?.id;

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

//             const [devices] = await pool.execute(
//   `
//   SELECT d.imei
//   FROM user_devices ud
//   JOIN devices d
//     ON d.id = ud.device_id
//   WHERE ud.user_id = ?
//   LIMIT 1
//   `,
//   [userId]
// );

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

// if (devices.length === 0) {
//   return res.status(404).json({
//     error: "No device assigned to this user"
//   });
// }

if (devices.length === 0) {

    return res.status(403).json({
        error:
            "You do not have access to this device"
    });
}

const imei = devices[0].imei;

// no longer in use 


            // if (!imei) {

            //     return res.status(401).json({

            //         error:
            //             "Unauthorized: IMEI not found in token"
            //     });
            // }


            const now =
                new Date();


            // =================================================
            // CURRENT HOUR
            //
            // Example:
            //
            // 12:37
            //
            // currentHour =
            // 12:00
            //
            // We do NOT calculate 12 -> 13.
            // =================================================

            const currentHour =
                getLastCompletedHour(
                    now
                );


            // =================================================
            // LAST COMPLETED HOUR
            //
            // If now = 12:37
            //
            // latest completed interval =
            //
            // 11 -> 12
            //
            // represented by 12:00
            // =================================================

            const lastCompletedHour =
                new Date(
                    currentHour
                );


            // =================================================
            // TODAY
            // =================================================

            const todayStart =
                startOfDay(
                    now
                );


            const todayHourRows =
                await calculateCompletedHours(

                    imei,

                    new Date(
                        todayStart.getTime()
                    ),

                    lastCompletedHour
                );


            // =================================================
            // GET TODAY DATA
            // =================================================

            const todayRows =
                await getHourlyData(

                    imei,

                    todayStart,

                    lastCompletedHour
                );


            const todayChart =
                createTodayChart(

                    todayRows,

                    now
                );


            // =================================================
            // MONTH
            // =================================================

            const monthStart =
                startOfMonth(
                    now
                );


            const monthRowsToCalculate =
                await calculateCompletedHours(

                    imei,

                    new Date(
                        monthStart.getTime()
                    ),

                    lastCompletedHour
                );


            const monthRows =
                await getHourlyData(

                    imei,

                    monthStart,

                    lastCompletedHour
                );


            const monthlyChart =
                createMonthlyChart(

                    monthRows,

                    now.getFullYear(),

                    now.getMonth()
                );


            // =================================================
            // YEAR
            // =================================================

            const yearStart =
                startOfYear(
                    now
                );


            const yearRowsToCalculate =
                await calculateCompletedHours(

                    imei,

                    new Date(
                        yearStart.getTime()
                    ),

                    lastCompletedHour
                );


            const yearRows =
                await getHourlyData(

                    imei,

                    yearStart,

                    lastCompletedHour
                );


            const yearlyChart =
                createYearlyChart(

                    yearRows,

                    now.getFullYear()
                );


            // =================================================
            // TOTALS
            // =================================================

            const today =
                todayChart.reduce(

                    (sum, item) =>
                        sum + item.value,

                    0
                );


            const monthly =
                monthlyChart.reduce(

                    (sum, item) =>
                        sum + item.value,

                    0
                );


            const yearly =
                yearlyChart.reduce(

                    (sum, item) =>
                        sum + item.value,

                    0
                );


            // =================================================
            // RESPONSE
            // =================================================

            return res.json({

                success: true,

                imei,

                energy: {

                    today:
                        Number(
                            today.toFixed(3)
                        ),

                    monthly:
                        Number(
                            monthly.toFixed(3)
                        ),

                    yearly:
                        Number(
                            yearly.toFixed(3)
                        )
                },

                charts: {

                    today:
                        todayChart,

                    monthly:
                        monthlyChart,

                    yearly:
                        yearlyChart
                }

            });

        // } 
        // catch (err) {

        //     console.error(
        //         "ENERGY SUMMARY ERROR:",
        //         err
        //     );


        //     return res.status(500).json({

        //         error:
        //             "Failed to calculate energy"
        //     });
        // }
        } catch (err) {

    console.error("=================================");
    console.error("ENERGY SUMMARY ERROR");
    console.error("Message:", err.message);
    console.error("Code:", err.code);
    console.error("SQL Message:", err.sqlMessage);
    console.error("Stack:", err.stack);
    console.error("=================================");

    return res.status(500).json({
        error: "Failed to calculate energy",
        message: err.message
    });
}
    };