const pool = require("../config/database");

const {
    aggregateHour
} = require("../utils/hourlyEnergy");


// =====================================================
// HELPERS
// =====================================================

function startOfDay(date) {
    const result = new Date(date);

    result.setHours(0, 0, 0, 0);

    return result;
}


function startOfMonth(date) {
    const result = new Date(date);

    result.setDate(1);

    result.setHours(0, 0, 0, 0);

    return result;
}


function startOfYear(date) {
    const result = new Date(date);

    result.setMonth(0);
    result.setDate(1);

    result.setHours(0, 0, 0, 0);

    return result;
}


function getLastCompletedHour(now) {
    const result = new Date(now);

    result.setMinutes(0, 0, 0);

    return result;
}


function toMysqlDateTime(date) {
    const year = date.getFullYear();

    const month = String(
        date.getMonth() + 1
    ).padStart(2, "0");

    const day = String(
        date.getDate()
    ).padStart(2, "0");

    const hours = String(
        date.getHours()
    ).padStart(2, "0");

    const minutes = String(
        date.getMinutes()
    ).padStart(2, "0");

    const seconds = String(
        date.getSeconds()
    ).padStart(2, "0");

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}


function generateHours(start, end) {
    const hours = [];

    const current = new Date(start);

    while (current <= end) {
        hours.push(new Date(current));

        current.setHours(
            current.getHours() + 1
        );
    }

    return hours;
}


async function calculateCompletedHours(
    imei,
    from,
    to
) {
    const hours = generateHours(
        from,
        to
    );

    const results = [];

    for (const hourEnd of hours) {
        const result = await aggregateHour(
            imei,
            hourEnd
        );

        if (result) {
            results.push(result);
        }
    }

    return results;
}


async function getHourlyData(
    imei,
    start,
    end
) {
    const [rows] = await pool.execute(
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
            toMysqlDateTime(start),
            toMysqlDateTime(end)
        ]
    );

    return rows.map(row => ({
        hour: row.hour_end,
        energy: Number(row.energy_kwh)
    }));
}


// =====================================================
// CHARTS
// =====================================================

function createTodayChart(rows) {
    const chart = Array.from(
        { length: 24 },
        (_, hour) => ({
            label: `${String(hour).padStart(2, "0")}:00`,
            value: 0
        })
    );

    for (const row of rows) {
        const date = new Date(row.hour);

        const hour = date.getHours();

        if (hour >= 0 && hour < 24) {
            chart[hour].value += row.energy;
        }
    }

    return chart.map(item => ({
        label: item.label,
        value: Number(
            item.value.toFixed(3)
        )
    }));
}


function createMonthlyChart(
    rows,
    year,
    month
) {
    const daysInMonth = new Date(
        year,
        month + 1,
        0
    ).getDate();

    const chart = Array.from(
        { length: daysInMonth },
        (_, index) => ({
            label: String(index + 1),
            value: 0
        })
    );

    for (const row of rows) {
        const date = new Date(row.hour);

        if (
            date.getFullYear() !== year ||
            date.getMonth() !== month
        ) {
            continue;
        }

        const day = date.getDate();

        chart[day - 1].value += row.energy;
    }

    return chart.map(item => ({
        label: item.label,
        value: Number(
            item.value.toFixed(3)
        )
    }));
}


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

    const chart = labels.map(label => ({
        label,
        value: 0
    }));

    for (const row of rows) {
        const date = new Date(row.hour);

        if (
            date.getFullYear() !== year
        ) {
            continue;
        }

        const month = date.getMonth();

        chart[month].value += row.energy;
    }

    return chart.map(item => ({
        label: item.label,
        value: Number(
            item.value.toFixed(3)
        )
    }));
}


// =====================================================
// VENDOR ENERGY SUMMARY
// =====================================================

exports.getVendorEnergySummary = async (
    req,
    res
) => {
    try {

        // =================================================
        // LOGGED-IN VENDOR
        // =================================================

        const vendorId = req.vendor?.id;

        if (!vendorId) {
            return res.status(401).json({
                error: "Vendor authentication required"
            });
        }


        // =================================================
        // DEVICE ID
        // =================================================

        const deviceId = Number(
            req.params.id
        );

        if (
            !Number.isInteger(deviceId) ||
            deviceId <= 0
        ) {
            return res.status(400).json({
                error: "Invalid device id"
            });
        }


        // =================================================
        // VERIFY DEVICE BELONGS TO VENDOR
        // =================================================

        const [devices] = await pool.execute(
            `
            SELECT
                id,
                imei
            FROM devices
            WHERE id = ?
              AND vendor_id = ?
            LIMIT 1
            `,
            [
                deviceId,
                vendorId
            ]
        );


        if (devices.length === 0) {
            return res.status(403).json({
                error:
                    "You do not have access to this device"
            });
        }


        const imei = devices[0].imei;


        // =================================================
        // CURRENT TIME
        // =================================================

        const now = new Date();


        // =================================================
        // LAST COMPLETED HOUR
        // =================================================

        const lastCompletedHour =
            getLastCompletedHour(now);


        // =================================================
        // TODAY
        // =================================================

        const todayStart =
            startOfDay(now);


        await calculateCompletedHours(
            imei,
            new Date(todayStart),
            lastCompletedHour
        );


        const todayRows =
            await getHourlyData(
                imei,
                todayStart,
                lastCompletedHour
            );


        const todayChart =
            createTodayChart(
                todayRows
            );


        // =================================================
        // MONTH
        // =================================================

        const monthStart =
            startOfMonth(now);


        await calculateCompletedHours(
            imei,
            new Date(monthStart),
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
            startOfYear(now);


        await calculateCompletedHours(
            imei,
            new Date(yearStart),
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

            device_id: deviceId,

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

    } catch (err) {

        console.error(
            "================================="
        );

        console.error(
            "VENDOR ENERGY SUMMARY ERROR"
        );

        console.error(
            "Message:",
            err.message
        );

        console.error(
            "Code:",
            err.code
        );

        console.error(
            "SQL Message:",
            err.sqlMessage
        );

        console.error(
            "Stack:",
            err.stack
        );

        console.error(
            "================================="
        );

        return res.status(500).json({
            error:
                "Failed to calculate vendor energy",
            message:
                err.message
        });
    }
};