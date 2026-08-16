const pool = require("../config/database");


/**
 * Get the latest LKWH reading before a specific time.
 *
 * Example:
 *
 * boundary = 12:00
 *
 * returns the latest reading where:
 *
 * recorded_at < 12:00
 */
async function getReadingBefore(imei, boundary) {

    const [rows] = await pool.execute(
        `
        SELECT
            lkwh,
            recorded_at
        FROM energy_history
        WHERE imei = ?
          AND recorded_at < ?
        ORDER BY recorded_at DESC
        LIMIT 1
        `,
        [
            imei,
            boundary
        ]
    );

    if (rows.length === 0) {
        return null;
    }

    return {
        lkwh: Number(rows[0].lkwh),
        recorded_at: rows[0].recorded_at
    };
}


/**
 * Calculate ONE completed hour.
 *
 * IMPORTANT:
 *
 * hourEnd represents the database hour_start.
 *
 * Example:
 *
 * hourEnd = 12:00
 *
 * means:
 *
 * 11:00 -> 12:00
 */
async function calculateHour(
    imei,
    hourEnd
) {

    const end = new Date(hourEnd);

    const start = new Date(end);

    start.setHours(
        start.getHours() - 1
    );


    // =====================================================
    // GET LAST READING BEFORE START
    // =====================================================

    const startReading =
        await getReadingBefore(
            imei,
            start
        );


    // =====================================================
    // GET LAST READING BEFORE END
    // =====================================================

    const endReading =
        await getReadingBefore(
            imei,
            end
        );


    // =====================================================
    // WE CANNOT CALCULATE THE HOUR
    // =====================================================

    if (
        !startReading ||
        !endReading
    ) {

        return null;
    }


    // =====================================================
    // CALCULATE ENERGY
    // =====================================================

    let energy =
        endReading.lkwh -
        startReading.lkwh;


    // =====================================================
    // HANDLE METER RESET
    // =====================================================

    if (energy < 0) {

        console.log(
            `LKWH reset detected for ${imei}`,
            {
                startLKWH:
                    startReading.lkwh,

                endLKWH:
                    endReading.lkwh,

                hourEnd: end
            }
        );

        energy = 0;
    }


    return {

        imei,

        // This is the END of the interval.
        //
        // 12:00 means 11:00 -> 12:00
        // hour_start: end,
        hour_end: end,

        start_lkwh:
            startReading.lkwh,

        end_lkwh:
            endReading.lkwh,

        energy_kwh:
            Number(
                energy.toFixed(3)
            )
    };
}


/**
 * Save calculated hourly energy.
 *
 * If the hour already exists,
 * update it.
 */
async function saveHourlyEnergy(
    result
) {

    if (!result) {
        return;
    }


    await pool.execute(
        `
        INSERT INTO hourly_energy
        (
            imei,
             hour_end,
            start_lkwh,
            end_lkwh,
            energy_kwh
        )
        VALUES (?, ?, ?, ?, ?)

        ON DUPLICATE KEY UPDATE

            start_lkwh = VALUES(start_lkwh),
            end_lkwh = VALUES(end_lkwh),
            energy_kwh = VALUES(energy_kwh)
        `,
        [
            result.imei,

            // result.hour_start,
                        result.hour_end,

            result.start_lkwh,

            result.end_lkwh,

            result.energy_kwh
        ]
    );
}


/**
 * Calculate and save one completed hour.
 */
async function aggregateHour(
    imei,
    hourEnd
) {

    const result =
        await calculateHour(
            imei,
            hourEnd
        );


    if (!result) {
        return null;
    }


    await saveHourlyEnergy(
        result
    );


    return result;
}


module.exports = {
    getReadingBefore,
    calculateHour,
    saveHourlyEnergy,
    aggregateHour
};