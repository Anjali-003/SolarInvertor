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
function getElapsedHours(start, end) {

    return (
        (end.getTime() - start.getTime()) /
        (1000 * 60 * 60)
    );
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
// CALCULATE CUF
// =====================================================

function calculateCUF(
    generatedEnergy,
    capacityKw,
    totalHours
) {

    const energy =
        Number(generatedEnergy);

    const capacity =
        Number(capacityKw);


    if (
        !Number.isFinite(energy) ||
        energy < 0 ||
        !Number.isFinite(capacity) ||
        capacity <= 0 ||
        !Number.isFinite(totalHours) ||
        totalHours <= 0
    ) {

        return null;
    }


    const cuf =
        (
            energy /
            (
                capacity *
                totalHours
            )
        ) *
        100;


    return Number(
        cuf.toFixed(3)
    );
}



function getHoursInMonth(date) {

    const year =
        date.getFullYear();

    const month =
        date.getMonth();


    const daysInMonth =
        new Date(
            year,
            month + 1,
            0
        ).getDate();


    return (
        daysInMonth *
        24
    );
}


function getHoursInYear(date) {

    const year =
        date.getFullYear();


    const isLeapYear =
        (
            year % 4 === 0 &&
            year % 100 !== 0
        ) ||
        year % 400 === 0;


    return (
        isLeapYear
            ? 366
            : 365
    ) * 24;
}


function toMysqlDate(date) {

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


    return `${year}-${month}-${day}`;
}

function getWeekRange(
    now,
    offset = 0
) {

    const start =
        startOfDay(now);

    const day =
        start.getDay();

    // Move to Sunday
    start.setDate(
        start.getDate() - day
    );

    // Move backward/forward by whole weeks
    start.setDate(
        start.getDate() +
        offset * 7
    );


    const end =
        new Date(start);

    end.setDate(
        end.getDate() + 7
    );


    return {
        start,
        end
    };
}


function getMonthRange(
    now,
    offset = 0
) {

    const start =
        new Date(
            now.getFullYear(),
            now.getMonth() + offset,
            1,
            0,
            0,
            0,
            0
        );


    const end =
        new Date(
            start.getFullYear(),
            start.getMonth() + 1,
            1,
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
// LOOK UP A DEVICE BY IMEI (public — no account/login)
//
// Ownership is gone: there's no more user_devices table
// tying a device to a logged-in user. Anyone with a valid
// device's IMEI can read its data — the frontend decides
// what to remember locally (see deviceMeta.js).
// =====================================================

async function getDeviceByImei(imei) {

    const [devices] =
        await pool.execute(
            `
            SELECT
                id,
                imei,
                rated_capacity_kw
            FROM devices
            WHERE imei = ?
            LIMIT 1
            `,
            [imei]
        );


    if (devices.length === 0) {
        return null;
    }


    return devices[0];
}


async function getTodayPowerChart(
    imei,
    now,
    offset = 0
) {

    const selectedDate =
        new Date(now);

    selectedDate.setDate(
        selectedDate.getDate() + offset
    );


    const start =
        startOfDay(
            selectedDate
        );


    const end =
        new Date(start);

    end.setDate(
        end.getDate() + 1
    );


    const [rows] =
        await pool.execute(
            `
            SELECT
                FROM_UNIXTIME(
                    FLOOR(
                        UNIX_TIMESTAMP(recorded_at) / 300
                    ) * 300
                ) AS bucket_time,

                AVG(power_kw) AS power_kw

            FROM solar_power_history

            WHERE imei = ?
              AND recorded_at >= ?
              AND recorded_at < ?

            GROUP BY
                bucket_time

            ORDER BY
                bucket_time ASC
            `,
            [
                imei,
                toMysqlDateTime(start),
                toMysqlDateTime(end)
            ]
        );


    const chart =
        rows.map(
            row => {

                const date =
                    new Date(
                        row.bucket_time
                    );


                return {

                    label:
                        date.toLocaleTimeString(
                            "en-GB",
                            {
                                hour:
                                    "2-digit",

                                minute:
                                    "2-digit",

                                hour12:
                                    false
                            }
                        ),

                    // value:
                    //     Number(
                    //         Number(
                    //             row.power_kw
                    //         ).toFixed(3)
                    //     )

                    value:
    Number(
        (
            Number(row.power_kw) * 1000
        ).toFixed(1)
    )
                };
            }
        );


    return {

        chart,

        label:
            selectedDate.toLocaleDateString(
                "en-GB",
                {
                    day:
                        "numeric",

                    month:
                        "short",

                    year:
                        "numeric"
                }
            )
    };
}


// async function getTodayPowerChart(
//     imei,
//     now
// ) {

//     const start =
//         startOfDay(now);


//     const [rows] =
//         await pool.execute(
//             `
//             SELECT
//                 FROM_UNIXTIME(
//                     FLOOR(
//                         UNIX_TIMESTAMP(recorded_at) / 600
//                     ) * 600
//                 ) AS bucket_time,

//                 AVG(power_kw) AS power_kw

//             FROM solar_power_history

//             WHERE imei = ?
//               AND recorded_at >= ?
//               AND recorded_at <= ?

//             GROUP BY
//                 bucket_time

//             ORDER BY
//                 bucket_time ASC
//             `,
//             [
//                 imei,
//                 toMysqlDateTime(start),
//                 toMysqlDateTime(now)
//             ]
//         );


//     return rows.map(
//         row => {

//             const date =
//                 new Date(
//                     row.bucket_time
//                 );


//             return {

//                 label:
//                     date.toLocaleTimeString(
//                         "en-GB",
//                         {
//                             hour: "2-digit",
//                             minute: "2-digit",
//                             hour12: false
//                         }
//                     ),

//                 value:
//                     Number(
//                         Number(
//                             row.power_kw
//                         ).toFixed(3)
//                     )
//             };
//         }
//     );
// }



async function getWeekEnergyChart(
    imei,
    now,
    offset
) {

    const {
        start,
        end
    } =
        getWeekRange(
            now,
            offset
        );


    const chart = [];

    for (
        let index = 0;
        index < 7;
        index++
    ) {

        const date =
            new Date(start);

        date.setDate(
            date.getDate() + index
        );


        chart.push({

            label:
                date.toLocaleDateString(
                    "en-US",
                    {
                        weekday: "short"
                    }
                ),

            value: 0
        });
    }


    const [rows] =
        await pool.execute(
            `
           SELECT
    DATE(
        DATE_SUB(
            hour_end,
            INTERVAL 1 HOUR
        )
    ) AS day,
    SUM(energy_kwh) AS energy_kwh

            FROM hourly_energy

            WHERE imei = ?
              AND hour_end > ?
              AND hour_end <= ?

            GROUP BY
    DATE(
        DATE_SUB(
            hour_end,
            INTERVAL 1 HOUR
        )
    )

            ORDER BY
                day ASC
            `,
            [
                imei,
                toMysqlDateTime(start),
                toMysqlDateTime(end)
            ]
        );


    for (
        const row of rows
    ) {

        // const rowDate =
        //     new Date(
        //         `${row.day}T00:00:00`
        //     );

        const rowDate =
    new Date(row.day);

rowDate.setHours(
    0,
    0,
    0,
    0
);


        const diffDays =
            Math.floor(
                (
                    rowDate.getTime() -
                    start.getTime()
                ) /
                86400000
            );


        if (
            diffDays >= 0 &&
            diffDays < 7
        ) {

            chart[
                diffDays
            ].value =
                Number(
                    Number(
                        row.energy_kwh
                    ).toFixed(3)
                );
        }
    }


    const total =
        chart.reduce(
            (sum, item) =>
                sum + item.value,
            0
        );


    return {

        chart,

        total:
            Number(
                total.toFixed(3)
            ),

        range: {

            start:
                toMysqlDate(start),

            end:
                toMysqlDate(
                    new Date(
                        end.getTime() -
                        86400000
                    )
                )
        }
    };
}
async function getMonthEnergyChart(
    imei,
    now,
    offset
) {

    const {
        start,
        end
    } =
        getMonthRange(
            now,
            offset
        );


    const daysInMonth =
        new Date(
            start.getFullYear(),
            start.getMonth() + 1,
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
                    String(
                        index + 1
                    ),

                value:
                    0
            })
        );


    const [rows] =
        await pool.execute(
            `
            SELECT
                DAY(
                    DATE_SUB(
                        hour_end,
                        INTERVAL 1 HOUR
                    )
                ) AS day_number,

                SUM(
                    energy_kwh
                ) AS energy_kwh

            FROM hourly_energy

            WHERE imei = ?
              AND hour_end > ?
              AND hour_end <= ?

            GROUP BY
                DAY(
                    DATE_SUB(
                        hour_end,
                        INTERVAL 1 HOUR
                    )
                )

            ORDER BY
                day_number ASC
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


    for (
        const row of rows
    ) {

        const dayNumber =
            Number(
                row.day_number
            );


        if (
            !Number.isInteger(
                dayNumber
            )
        ) {
            continue;
        }


        const index =
            dayNumber - 1;


        if (
            index >= 0 &&
            index < chart.length
        ) {

            chart[
                index
            ].value =
                Number(
                    Number(
                        row.energy_kwh
                    ).toFixed(3)
                );
        }
    }


    const total =
        chart.reduce(
            (sum, item) =>
                sum +
                Number(
                    item.value
                ),
            0
        );


    return {

        chart,

        total:
            Number(
                total.toFixed(3)
            ),

        label:
            start.toLocaleDateString(
                "en-US",
                {
                    month:
                        "long",

                    year:
                        "numeric"
                }
            )
    };
}

// async function getMonthEnergyChart(
//     imei,
//     now,
//     offset
// ) {

//     const {
//         start,
//         end
//     } =
//         getMonthRange(
//             now,
//             offset
//         );


//     const daysInMonth =
//         new Date(
//             start.getFullYear(),
//             start.getMonth() + 1,
//             0
//         ).getDate();


//     const chart =
//         Array.from(
//             {
//                 length:
//                     daysInMonth
//             },
//             (_, index) => ({

//                 label:
//                     String(
//                         index + 1
//                     ),

//                 value: 0
//             })
//         );


//     const [rows] =
//         await pool.execute(
//             `
//             SELECT
//                 DAY(
//     DATE_SUB(
//         hour_end,
//         INTERVAL 1 HOUR
//     )
// ) AS day_number,
//                 SUM(energy_kwh) AS energy_kwh

//             FROM hourly_energy

//             WHERE imei = ?
//               AND hour_end > ?
//               AND hour_end <= ?

//            DAY(
//     DATE_SUB(
//         hour_end,
//         INTERVAL 1 HOUR
//     )
// )

//             ORDER BY
//                 day_number ASC
//             `,
//             [
//                 imei,
//                 toMysqlDateTime(start),
//                 toMysqlDateTime(end)
//             ]
//         );


//     for (
//         const row of rows
//     ) {

//         const index =
//             Number(
//                 row.day_number
//             ) - 1;


//         if (
//             index >= 0 &&
//             index < chart.length
//         ) {

//             chart[
//                 index
//             ].value =
//                 Number(
//                     Number(
//                         row.energy_kwh
//                     ).toFixed(3)
//                 );
//         }
//     }


//     const total =
//         chart.reduce(
//             (sum, item) =>
//                 sum + item.value,
//             0
//         );


//     return {

//         chart,

//         total:
//             Number(
//                 total.toFixed(3)
//             ),

//         label:
//             start.toLocaleDateString(
//                 "en-US",
//                 {
//                     month: "long",
//                     year: "numeric"
//                 }
//             )
//     };
// }


async function getYearEnergyChart(
    imei,
    now,
        offset

) {

const year =
    now.getFullYear() +
    offset;


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


//     const [rows] =
//         await pool.execute(
//             `
//             SELECT
//                 MONTH(
//     DATE_SUB(
//         hour_end,
//         INTERVAL 1 HOUR
//     )
// ) AS month_number,
//                 SUM(energy_kwh) AS energy_kwh

//             FROM hourly_energy

//             WHERE imei = ?
//               AND YEAR(hour_end) = ?

//             GROUP BY
//                 MONTH(
//     DATE_SUB(
//         hour_end,
//         INTERVAL 1 HOUR
//     )
// )

//             ORDER BY
//                 month_number ASC
//             `,
//             [
//                 imei,
//                 year
//             ]
//         );


const yearStart =
    new Date(
        year,
        0,
        1,
        0,
        0,
        0,
        0
    );

const nextYearStart =
    new Date(
        year + 1,
        0,
        1,
        0,
        0,
        0,
        0
    );

    const [rows] =
    await pool.execute(
        `
        SELECT
            MONTH(
                DATE_SUB(
                    hour_end,
                    INTERVAL 1 HOUR
                )
            ) AS month_number,

            SUM(energy_kwh) AS energy_kwh

        FROM hourly_energy

        WHERE imei = ?
          AND hour_end > ?
          AND hour_end <= ?

        GROUP BY
            MONTH(
                DATE_SUB(
                    hour_end,
                    INTERVAL 1 HOUR
                )
            )

        ORDER BY month_number ASC
        `,
        [
            imei,
            toMysqlDateTime(yearStart),
            toMysqlDateTime(nextYearStart)
        ]
    );


    for (
        const row of rows
    ) {

        const index =
            Number(
                row.month_number
            ) - 1;


        if (
            index >= 0 &&
            index < 12
        ) {

            chart[
                index
            ].value =
                Number(
                    Number(
                        row.energy_kwh
                    ).toFixed(3)
                );
        }
    }


    const total =
        chart.reduce(
            (sum, item) =>
                sum + item.value,
            0
        );


    return {

        chart,

        total:
            Number(
                total.toFixed(3)
            ),

        label:
            String(year)
    };
}


exports.getEnergyChart =
    async (req, res) => {

        try {

            const imeiParam =
                String(
                    req.query.imei || ""
                ).trim();

            const period =
                String(
                    req.query.period || ""
                ).toLowerCase();

            const offset =
                Number(
                    req.query.offset || 0
                );


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


            if (
                ![
                    "today",
                    "week",
                    "month",
                    "year"
                ].includes(period)
            ) {

                return res
                    .status(400)
                    .json({
                        error:
                            "Invalid period"
                    });
            }


            if (
                !Number.isInteger(offset) ||
                offset > 0
            ) {

                return res
                    .status(400)
                    .json({
                        error:
                            "Invalid offset"
                    });
            }


            const device =
                await getDeviceByImei(
                    imeiParam
                );


            if (!device) {

                return res
                    .status(404)
                    .json({
                        error:
                            "Device not found"
                    });
            }


            const imei =
                device.imei;

            const now =
                new Date();


            // TODAY = SOLAR POWER
            if (
                period === "today"
            ) {

                // const chart =
                //     await getTodayPowerChart(
                //         imei,
                //         now
                //     );


                // return res.json({

                //     success: true,

                //     period:
                //         "today",

                //     unit:
                //         "kW",

                //     chart
                // });

                const result =
    await getTodayPowerChart(
        imei,
        now,
        offset
    );


return res.json({

    success: true,

    period:
        "today",

    unit:
        "kW",

    offset,

    ...result
});
            }


            // WEEK
            if (
                period === "week"
            ) {

                const result =
                    await getWeekEnergyChart(
                        imei,
                        now,
                        offset
                    );


                return res.json({

                    success: true,

                    period:
                        "week",

                    unit:
                        "kWh",

                    offset,

                    ...result
                });
            }


            // MONTH
            if (
                period === "month"
            ) {

                const result =
                    await getMonthEnergyChart(
                        imei,
                        now,
                        offset
                    );


                return res.json({

                    success: true,

                    period:
                        "month",

                    unit:
                        "kWh",

                    offset,

                    ...result
                });
            }


            // YEAR
            const result =
                await getYearEnergyChart(
                    imei,
                    now,
                    offset
                );


            return res.json({

                success: true,

                period:
                    "year",

                unit:
                    "kWh",
                    offset,

                ...result
            });

        } catch (err) {

            console.error(
                "ENERGY CHART ERROR:",
                err
            );


            return res
                .status(500)
                .json({
                    error:
                        "Failed to load chart data"
                });
        }
    };


// =====================================================
// ENERGY SUMMARY API
// =====================================================

exports.getEnergySummary =
    async (req, res) => {

        try {

            const imeiParam =
                String(req.query.imei || "").trim();

            if (
                !/^\d{15}$/.test(imeiParam)
            ) {
                return res.status(400).json({
                    error: "Invalid imei"
                });
            }

            const devices =
                await getDeviceByImei(imeiParam);

            if (!devices) {

                return res.status(404).json({
                    error:
                        "Device not found"
                });
            }

            const imei = devices.imei;

            const capacityKw =
                Number(
                    devices.rated_capacity_kw
                );

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




                // =====================================================
// LATEST CUMULATIVE GENERATION
// =====================================================

const [latestEnergyRows] =
    await pool.execute(
        `
        SELECT
            lkwh
        FROM energy_history

        WHERE imei = ?

        ORDER BY
            recorded_at DESC,
            id DESC

        LIMIT 1
        `,
        [
            imei
        ]
    );


const cumulativeGeneration =
    latestEnergyRows.length > 0
        ? Number(
            latestEnergyRows[0].lkwh
        )
        : 0;



        // =====================================================
// CUF
// =====================================================

// const dailyCUF =
//     calculateCUF(
//         today,
//         capacityKw,
//         24
//     );


// const monthlyCUF =
//     calculateCUF(
//         monthly,
//         capacityKw,
//         getHoursInMonth(now)
//     );


// const yearlyCUF =
//     calculateCUF(
//         yearly,
//         capacityKw,
//         getHoursInYear(now)
//     );

const dailyCUF =
    calculateCUF(
        today,
        capacityKw,
        getElapsedHours(todayStart, lastCompletedHour)
    );

const monthlyCUF =
    calculateCUF(
        monthly,
        capacityKw,
        getElapsedHours(monthStart, lastCompletedHour)
    );

const yearlyCUF =
    calculateCUF(
        yearly,
        capacityKw,
        getElapsedHours(yearStart, lastCompletedHour)
    );

    // =====================================================
// SAVE CURRENT CUF
// =====================================================

await pool.execute(
    `
    INSERT INTO cuf_history
    (
        imei,
        record_date,
        daily_generated_kwh,
        cumulative_generation_kwh,
        daily_cuf,
        monthly_cuf,
        yearly_cuf
    )

    VALUES (?, ?, ?, ?, ?, ?, ?)

    ON DUPLICATE KEY UPDATE

        daily_generated_kwh =
            VALUES(daily_generated_kwh),

        cumulative_generation_kwh =
            VALUES(cumulative_generation_kwh),

        daily_cuf =
            VALUES(daily_cuf),

        monthly_cuf =
            VALUES(monthly_cuf),

        yearly_cuf =
            VALUES(yearly_cuf)
    `,
    [
        imei,

        toMysqlDate(now),

        Number(
            today.toFixed(3)
        ),

        Number(
            cumulativeGeneration.toFixed(3)
        ),

        dailyCUF ?? 0,

        monthlyCUF ?? 0,

        yearlyCUF ?? 0
    ]
);

            // =================================================
            // RESPONSE
            // =================================================

            // return res.json({

            //     success: true,

            //     imei,

            //     energy: {

            //         today:
            //             Number(
            //                 today.toFixed(3)
            //             ),

            //         monthly:
            //             Number(
            //                 monthly.toFixed(3)
            //             ),

            //         yearly:
            //             Number(
            //                 yearly.toFixed(3)
            //             )
            //     },

            //     charts: {

            //         today:
            //             todayChart,

            //         monthly:
            //             monthlyChart,

            //         yearly:
            //             yearlyChart
            //     }

            // });




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

    cuf: {

        today:
            dailyCUF,

        monthly:
            monthlyCUF,

        yearly:
            yearlyCUF
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