const pool = require("../config/database");

/**
 * Aggregate LKWH readings into the correct clock-hour bucket.
 *
 * Example:
 *
 * 10:41 -> 100.000
 * 10:46 -> 100.200
 * 10:51 -> 100.500
 *
 * Deltas:
 *
 * 0.200
 * 0.300
 *
 * Both belong to:
 *
 * 10:00 - 10:59
 *
 * Therefore:
 *
 * hour_start = 10:00
 * energy_kwh = 0.500
 */
async function aggregateHourlyLKWH(
    imei,
    currentRecordedAt
) {
    try {

        if (!imei || !currentRecordedAt) {
            return;
        }

        const currentTime =
            new Date(currentRecordedAt);

        if (Number.isNaN(currentTime.getTime())) {
            console.error(
                "Invalid recorded time:",
                currentRecordedAt
            );

            return;
        }

        // =====================================================
        // CURRENT HOUR
        // =====================================================

        const currentHourStart =
            new Date(currentTime);

        currentHourStart.setMinutes(
            0,
            0,
            0
        );

        // =====================================================
        // GET CURRENT READING
        // =====================================================

        const [currentRows] =
            await pool.execute(
                `
                SELECT
                    lkwh,
                    recorded_at
                FROM energy_history
                WHERE imei = ?
                  AND recorded_at = ?
                ORDER BY id DESC
                LIMIT 1
                `,
                [
                    imei,
                    currentRecordedAt
                ]
            );

        if (currentRows.length === 0) {
            return;
        }

        const currentLKWH =
            Number(currentRows[0].lkwh);

        if (!Number.isFinite(currentLKWH)) {
            return;
        }

        // =====================================================
        // GET PREVIOUS READING
        // =====================================================

        const [previousRows] =
            await pool.execute(
                `
                SELECT
                    lkwh,
                    recorded_at
                FROM energy_history
                WHERE imei = ?
                  AND recorded_at < ?
                ORDER BY recorded_at DESC, id DESC
                LIMIT 1
                `,
                [
                    imei,
                    currentRecordedAt
                ]
            );

        // We cannot calculate energy from
        // the first ever reading.
        if (previousRows.length === 0) {

            console.log(
                `First LKWH reading for ${imei}: ${currentLKWH}`
            );

            return;
        }

        const previousLKWH =
            Number(previousRows[0].lkwh);

        if (!Number.isFinite(previousLKWH)) {
            return;
        }

        // =====================================================
        // CALCULATE ENERGY DELTA
        // =====================================================

        let delta =
            currentLKWH -
            previousLKWH;

        // =====================================================
        // HANDLE LKWH RESET
        // =====================================================

        if (delta < 0) {

            console.log(
                `LKWH reset detected for ${imei}`,
                {
                    previousLKWH,
                    currentLKWH,
                    recordedAt: currentRecordedAt
                }
            );

            delta = 0;
        }

        if (delta <= 0) {
            return;
        }

        // =====================================================
        // FIND HOUR BUCKET
        // =====================================================

        const hourStart =
            new Date(currentTime);

        hourStart.setMinutes(
            0,
            0,
            0
        );

        // MySQL DATETIME does not need
        // timezone ISO formatting.
        const hourStartSQL =
            formatMySQLDateTime(
                hourStart
            );

        // =====================================================
        // CHECK IF HOURLY RECORD EXISTS
        // =====================================================

        const [hourRows] =
            await pool.execute(
                `
                SELECT
                    id,
                    start_lkwh,
                    end_lkwh,
                    energy_kwh
                FROM hourly_energy
                WHERE imei = ?
                  AND hour_start = ?
                LIMIT 1
                `,
                [
                    imei,
                    hourStartSQL
                ]
            );

        // =====================================================
        // CREATE FIRST RECORD FOR THIS HOUR
        // =====================================================

        if (hourRows.length === 0) {

            await pool.execute(
                `
                INSERT INTO hourly_energy
                (
                    imei,
                    hour_start,
                    start_lkwh,
                    end_lkwh,
                    energy_kwh,
                    is_complete
                )
                VALUES (?, ?, ?, ?, ?, 0)
                `,
                [
                    imei,
                    hourStartSQL,
                    previousLKWH,
                    currentLKWH,
                    delta
                ]
            );

            console.log(
                `Hourly energy created: ${imei} | ${hourStartSQL} | ${delta} kWh`
            );

            return;
        }

        // =====================================================
        // UPDATE EXISTING HOUR
        // =====================================================

        const hour =
            hourRows[0];

        const newEnergy =
            Number(hour.energy_kwh) +
            delta;

        await pool.execute(
            `
            UPDATE hourly_energy
            SET
                end_lkwh = ?,
                energy_kwh = ?,
                is_complete = 0
            WHERE id = ?
            `,
            [
                currentLKWH,
                newEnergy,
                hour.id
            ]
        );

        console.log(
            `Hourly energy updated: ${imei} | ${hourStartSQL} | ${newEnergy} kWh`
        );

    } catch (err) {

        console.error(
            "HOURLY ENERGY AGGREGATION ERROR:",
            err
        );

        throw err;
    }
}


/**
 * Mark previous hours as complete.
 *
 * If current time is 15:27:
 *
 * 14:00 -> complete
 * 13:00 -> complete
 * 15:00 -> incomplete
 */
async function completePreviousHours(
    imei,
    currentRecordedAt
) {
    try {

        const currentTime =
            new Date(currentRecordedAt);

        const currentHourStart =
            new Date(currentTime);

        currentHourStart.setMinutes(
            0,
            0,
            0
        );

        const currentHourSQL =
            formatMySQLDateTime(
                currentHourStart
            );

        await pool.execute(
            `
            UPDATE hourly_energy
            SET is_complete = 1
            WHERE imei = ?
              AND hour_start < ?
              AND is_complete = 0
            `,
            [
                imei,
                currentHourSQL
            ]
        );

    } catch (err) {

        console.error(
            "COMPLETE HOURLY ENERGY ERROR:",
            err
        );

        throw err;
    }
}


/**
 * Convert JavaScript Date into MySQL DATETIME.
 *
 * YYYY-MM-DD HH:mm:ss
 */
function formatMySQLDateTime(date) {

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

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}


module.exports = {
    aggregateHourlyLKWH,
    completePreviousHours
};