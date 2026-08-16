// const pool = require("../config/database");

// exports.getEnergySummary = async (req, res) => {
//     try {

//         // ─────────────────────────────────────────────
//         // GET IMEI FROM LOGGED-IN USER
//         // ─────────────────────────────────────────────

//         const imei = req.user?.imei;

//         if (!imei) {
//             return res.status(401).json({
//                 error: "Unauthorized"
//             });
//         }


//         // ─────────────────────────────────────────────
//         // CURRENT DATE
//         // ─────────────────────────────────────────────

//         const now = new Date();

//         const year = now.getFullYear();
//         const month = now.getMonth();
//         const day = now.getDate();


//         // ─────────────────────────────────────────────
//         // TIME BOUNDARIES
//         // ─────────────────────────────────────────────

//         const startOfToday = new Date(
//             year,
//             month,
//             day,
//             0,
//             0,
//             0
//         );

//         const startOfTomorrow = new Date(
//             year,
//             month,
//             day + 1,
//             0,
//             0,
//             0
//         );

//         const startOfMonth = new Date(
//             year,
//             month,
//             1,
//             0,
//             0,
//             0
//         );

//         const startOfNextMonth = new Date(
//             year,
//             month + 1,
//             1,
//             0,
//             0,
//             0
//         );

//         const startOfYear = new Date(
//             year,
//             0,
//             1,
//             0,
//             0,
//             0
//         );

//         const startOfNextYear = new Date(
//             year + 1,
//             0,
//             1,
//             0,
//             0,
//             0
//         );


//         // ─────────────────────────────────────────────
//         // CALCULATE ENERGY WITH RESET HANDLING
//         // ─────────────────────────────────────────────

//         const calculateEnergy = async (
//             start,
//             end
//         ) => {

//             /*
//              * We need the reading immediately before
//              * the period as our starting cumulative value.
//              */

//             const [startRows] =
//                 await pool.execute(
//                     `
//                     SELECT
//                         lkwh,
//                         recorded_at
//                     FROM energy_history
//                     WHERE imei = ?
//                       AND recorded_at <= ?
//                     ORDER BY recorded_at DESC
//                     LIMIT 1
//                     `,
//                     [
//                         imei,
//                         start
//                     ]
//                 );


//             /*
//              * Get ALL readings during the period.
//              *
//              * We need every reading because we need
//              * to detect LKWH resets.
//              */

//             const [rows] =
//                 await pool.execute(
//                     `
//                     SELECT
//                         lkwh,
//                         recorded_at
//                     FROM energy_history
//                     WHERE imei = ?
//                       AND recorded_at > ?
//                       AND recorded_at < ?
//                     ORDER BY recorded_at ASC
//                     `,
//                     [
//                         imei,
//                         start,
//                         end
//                     ]
//                 );


//             /*
//              * If there are no readings during the period,
//              * there is nothing to calculate.
//              */

//             if (rows.length === 0) {
//                 return 0;
//             }


//             let totalEnergy = 0;


//             /*
//              * Start with the cumulative reading immediately
//              * before the requested period.
//              *
//              * If there is no previous reading, use the first
//              * reading in the period as the starting point.
//              */

//             let previousLKWH;

//             if (startRows.length > 0) {

//                 previousLKWH =
//                     Number(startRows[0].lkwh);

//             } else {

//                 previousLKWH =
//                     Number(rows[0].lkwh);

//                 /*
//                  * The first reading has no previous value,
//                  * so we cannot know how much was generated
//                  * before it.
//                  *
//                  * We start calculating from the next reading.
//                  */

//                 rows.shift();
//             }


//             // ─────────────────────────────────────────
//             // WALK THROUGH READINGS
//             // ─────────────────────────────────────────

//             for (const row of rows) {

//                 const currentLKWH =
//                     Number(row.lkwh);


//                 /*
//                  * Ignore invalid LKWH values.
//                  */

//                 if (!Number.isFinite(currentLKWH)) {
//                     continue;
//                 }


//                 /*
//                  * NORMAL CASE
//                  *
//                  * LKWH increased normally.
//                  */

//                 if (currentLKWH >= previousLKWH) {

//                     totalEnergy +=
//                         currentLKWH - previousLKWH;

//                 }


//                 /*
//                  * RESET CASE
//                  *
//                  * Current LKWH is smaller than
//                  * previous LKWH.
//                  *
//                  * Example:
//                  *
//                  * previous = 1000
//                  * current  = 3
//                  *
//                  * This means the cumulative counter
//                  * has reset.
//                  *
//                  * We count the new value as energy
//                  * generated since the reset.
//                  */

//                 else {

//                     totalEnergy += currentLKWH;
//                 }


//                 /*
//                  * Always make current reading the
//                  * previous reading for the next iteration.
//                  */

//                 previousLKWH = currentLKWH;
//             }


//             /*
//              * Never return negative energy.
//              */

//             if (
//                 !Number.isFinite(totalEnergy) ||
//                 totalEnergy < 0
//             ) {
//                 return 0;
//             }


//             return Number(
//                 totalEnergy.toFixed(3)
//             );
//         };


//         // ─────────────────────────────────────────────
//         // TODAY
//         // ─────────────────────────────────────────────

//         const today =
//             await calculateEnergy(
//                 startOfToday,
//                 startOfTomorrow
//             );


//         // ─────────────────────────────────────────────
//         // CURRENT MONTH
//         // ─────────────────────────────────────────────

//         const monthly =
//             await calculateEnergy(
//                 startOfMonth,
//                 startOfNextMonth
//             );


//         // ─────────────────────────────────────────────
//         // CURRENT YEAR
//         // ─────────────────────────────────────────────

//         const yearly =
//             await calculateEnergy(
//                 startOfYear,
//                 startOfNextYear
//             );


//         // ─────────────────────────────────────────────
//         // RESPONSE
//         // ─────────────────────────────────────────────

//         return res.json({

//             success: true,

//             imei,

//             energy: {
//                 today,
//                 monthly,
//                 yearly
//             }

//         });

//     } catch (err) {

//         console.error(
//             "ENERGY SUMMARY ERROR:",
//             err
//         );

//         return res.status(500).json({
//             error: "Failed to calculate energy"
//         });
//     }
// };











// const pool = require("../config/database");

// exports.getEnergySummary = async (req, res) => {
//     try {
//         const imei = req.user?.imei;

//         if (!imei) {
//             return res.status(401).json({
//                 error: "Unauthorized: IMEI not found in token"
//             });
//         }

//         // =====================================================
//         // CURRENT DATE
//         // =====================================================

//         const now = new Date();

//         const year = now.getFullYear();
//         const month = now.getMonth();
//         const day = now.getDate();

//         // =====================================================
//         // YEAR BOUNDARIES
//         // =====================================================

//         const startOfYear = new Date(
//             year,
//             0,
//             1,
//             0,
//             0,
//             0
//         );

//         const startOfNextYear = new Date(
//             year + 1,
//             0,
//             1,
//             0,
//             0,
//             0
//         );

//         // =====================================================
//         // TODAY BOUNDARIES
//         // =====================================================

//         const startOfToday = new Date(
//             year,
//             month,
//             day,
//             0,
//             0,
//             0
//         );

//         const startOfTomorrow = new Date(
//             year,
//             month,
//             day + 1,
//             0,
//             0,
//             0
//         );

//         // =====================================================
//         // GET PREVIOUS READING BEFORE THIS YEAR
//         // =====================================================

//         const [previousRows] = await pool.execute(
//             `
//             SELECT
//                 lkwh,
//                 recorded_at
//             FROM energy_history
//             WHERE imei = ?
//               AND recorded_at < ?
//             ORDER BY recorded_at DESC
//             LIMIT 1
//             `,
//             [
//                 imei,
//                 startOfYear
//             ]
//         );

//         // =====================================================
//         // GET ALL READINGS FOR CURRENT YEAR
//         //
//         // ONE MAIN QUERY
//         // =====================================================

//         const [rows] = await pool.execute(
//             `
//             SELECT
//                 lkwh,
//                 recorded_at
//             FROM energy_history
//             WHERE imei = ?
//               AND recorded_at >= ?
//               AND recorded_at < ?
//             ORDER BY recorded_at ASC
//             `,
//             [
//                 imei,
//                 startOfYear,
//                 startOfNextYear
//             ]
//         );

//         // =====================================================
//         // INITIAL PREVIOUS LKWH
//         // =====================================================

//         let previousLKWH =
//             previousRows.length > 0
//                 ? Number(previousRows[0].lkwh)
//                 : null;

//         // =====================================================
//         // CHART STRUCTURES
//         // =====================================================

//         const todayChart = Array.from(
//             { length: 24 },
//             (_, hour) => ({
//                 label: `${String(hour).padStart(2, "0")}:00`,
//                 value: 0
//             })
//         );

//         const daysInCurrentMonth =
//             new Date(
//                 year,
//                 month + 1,
//                 0
//             ).getDate();

//         const monthlyChart = Array.from(
//             { length: daysInCurrentMonth },
//             (_, index) => ({
//                 label: String(index + 1),
//                 value: 0
//             })
//         );

//         const yearlyChart = [
//             "Jan",
//             "Feb",
//             "Mar",
//             "Apr",
//             "May",
//             "Jun",
//             "Jul",
//             "Aug",
//             "Sep",
//             "Oct",
//             "Nov",
//             "Dec"
//         ].map(label => ({
//             label,
//             value: 0
//         }));

//         // =====================================================
//         // PROCESS READINGS
//         // =====================================================

//         for (const row of rows) {

//             const currentLKWH =
//                 Number(row.lkwh);

//             const recordedAt =
//                 new Date(row.recorded_at);

//             // ---------------------------------------------
//             // FIRST READING
//             // ---------------------------------------------

//             if (previousLKWH === null) {
//                 previousLKWH = currentLKWH;
//                 continue;
//             }

//             // ---------------------------------------------
//             // CALCULATE ENERGY DELTA
//             // ---------------------------------------------

//             let delta =
//                 currentLKWH - previousLKWH;

//             // ---------------------------------------------
//             // HANDLE METER RESET
//             // ---------------------------------------------

//             if (delta < 0) {

//                 console.log(
//                     `LKWH reset detected for ${imei}`,
//                     {
//                         previousLKWH,
//                         currentLKWH,
//                         recordedAt
//                     }
//                 );

//                 delta = 0;
//             }

//             // ---------------------------------------------
//             // UPDATE PREVIOUS VALUE
//             // ---------------------------------------------

//             previousLKWH = currentLKWH;

//             // Nothing generated
//             if (delta <= 0) {
//                 continue;
//             }

//             // =================================================
//             // HOUR
//             // =================================================

//             const readingYear =
//                 recordedAt.getFullYear();

//             const readingMonth =
//                 recordedAt.getMonth();

//             const readingDay =
//                 recordedAt.getDate();

//             const readingHour =
//                 recordedAt.getHours();

//             // =================================================
//             // TODAY
//             // =================================================

//             if (
//                 readingYear === year &&
//                 readingMonth === month &&
//                 readingDay === day
//             ) {

//                 todayChart[readingHour].value +=
//                     delta;
//             }

//             // =================================================
//             // MONTH
//             // =================================================

//             if (
//                 readingYear === year &&
//                 readingMonth === month
//             ) {

//                 monthlyChart[
//                     readingDay - 1
//                 ].value += delta;
//             }

//             // =================================================
//             // YEAR
//             // =================================================

//             if (
//                 readingYear === year
//             ) {

//                 yearlyChart[
//                     readingMonth
//                 ].value += delta;
//             }
//         }

//         // =====================================================
//         // ROUND CHART VALUES
//         // =====================================================

//         const roundChart = chart =>
//             chart.map(item => ({
//                 label: item.label,
//                 value: Number(
//                     item.value.toFixed(3)
//                 )
//             }));

//         const finalTodayChart =
//             roundChart(todayChart);

//         const finalMonthlyChart =
//             roundChart(monthlyChart);

//         const finalYearlyChart =
//             roundChart(yearlyChart);

//         // =====================================================
//         // TOTALS
//         // =====================================================

//         const today =
//             finalTodayChart.reduce(
//                 (sum, item) =>
//                     sum + item.value,
//                 0
//             );

//         const monthly =
//             finalMonthlyChart.reduce(
//                 (sum, item) =>
//                     sum + item.value,
//                 0
//             );

//         const yearly =
//             finalYearlyChart.reduce(
//                 (sum, item) =>
//                     sum + item.value,
//                 0
//             );

//             const hasMonthlyData = monthly > 0;
// const hasYearlyData = yearly > 0;

//         // =====================================================
//         // RESPONSE
//         // =====================================================

//         return res.json({

//             success: true,

//             imei,

//             energy: {
//                 today: Number(
//                     today.toFixed(3)
//                 ),

//                 monthly: Number(
//                     monthly.toFixed(3)
//                 ),

//                 yearly: Number(
//                     yearly.toFixed(3)
//                 )
//             },

//             // charts: {

//             //     today:
//             //         finalTodayChart,

//             //     monthly:
//             //         finalMonthlyChart,

//             //     yearly:
//             //         finalYearlyChart
//             // }

//             charts: {
//     today: finalTodayChart,
//     monthly: hasMonthlyData ? finalMonthlyChart : [],
//     yearly: hasYearlyData ? finalYearlyChart : []
// }

//         });

//     } catch (err) {

//         console.error(
//             "ENERGY SUMMARY ERROR:",
//             err
//         );

//         return res.status(500).json({
//             error: "Failed to calculate energy"
//         });
//     }
// };












































// changed to new approach with charts and reset handling

// const pool = require("../config/database");


// // ============================================================
// // FORMAT JS DATE AS MYSQL DATETIME
// // ============================================================

// function formatMySQLDate(date) {

//     const year = date.getFullYear();
//     const month = String(
//         date.getMonth() + 1
//     ).padStart(2, "0");

//     const day = String(
//         date.getDate()
//     ).padStart(2, "0");

//     const hours = String(
//         date.getHours()
//     ).padStart(2, "0");

//     const minutes = String(
//         date.getMinutes()
//     ).padStart(2, "0");

//     const seconds = String(
//         date.getSeconds()
//     ).padStart(2, "0");

//     return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
// }


// // ============================================================
// // EMPTY TODAY CHART
// // ============================================================

// function createTodayChart() {

//     return Array.from(
//         { length: 24 },
//         (_, hour) => ({
//             label:
//                 `${String(hour).padStart(2, "0")}:00`,
//             value: 0
//         })
//     );
// }


// // ============================================================
// // EMPTY MONTHLY CHART
// // ============================================================

// function createMonthlyChart(
//     year,
//     month
// ) {

//     const daysInMonth =
//         new Date(
//             year,
//             month + 1,
//             0
//         ).getDate();

//     return Array.from(
//         { length: daysInMonth },
//         (_, index) => ({
//             label: String(index + 1),
//             value: 0
//         })
//     );
// }


// // ============================================================
// // EMPTY YEARLY CHART
// // ============================================================

// function createYearlyChart() {

//     const labels = [
//         "Jan",
//         "Feb",
//         "Mar",
//         "Apr",
//         "May",
//         "Jun",
//         "Jul",
//         "Aug",
//         "Sep",
//         "Oct",
//         "Nov",
//         "Dec"
//     ];

//     return labels.map(label => ({
//         label,
//         value: 0
//     }));
// }


// // ============================================================
// // ROUND CHART VALUES
// // ============================================================

// function roundChart(chart) {

//     chart.forEach(item => {

//         item.value =
//             Number(
//                 item.value.toFixed(3)
//             );

//     });
// }


// // ============================================================
// // MAIN CONTROLLER
// // ============================================================

// exports.getEnergySummary = async (
//     req,
//     res
// ) => {

//     try {

//         const imei =
//             req.user?.imei;

//         if (!imei) {

//             return res.status(401).json({
//                 error:
//                     "Unauthorized: IMEI not found in token"
//             });
//         }


//         // ====================================================
//         // CURRENT DATE
//         //
//         // IMPORTANT:
//         // This assumes the Node server timezone is IST.
//         // We will verify this before production.
//         // ====================================================

//         const now = new Date();

//         const year =
//             now.getFullYear();

//         const month =
//             now.getMonth();

//         const day =
//             now.getDate();


//         // ====================================================
//         // DATE BOUNDARIES
//         // ====================================================

//         const startOfYear =
//             new Date(
//                 year,
//                 0,
//                 1,
//                 0,
//                 0,
//                 0
//             );

//         const startOfNextYear =
//             new Date(
//                 year + 1,
//                 0,
//                 1,
//                 0,
//                 0,
//                 0
//             );


//         const startOfToday =
//             new Date(
//                 year,
//                 month,
//                 day,
//                 0,
//                 0,
//                 0
//             );

//         const startOfTomorrow =
//             new Date(
//                 year,
//                 month,
//                 day + 1,
//                 0,
//                 0,
//                 0
//             );


//         const startOfMonth =
//             new Date(
//                 year,
//                 month,
//                 1,
//                 0,
//                 0,
//                 0
//             );

//         const startOfNextMonth =
//             new Date(
//                 year,
//                 month + 1,
//                 1,
//                 0,
//                 0,
//                 0
//             );


//         // ====================================================
//         // FORMAT FOR MYSQL
//         // ====================================================

//         const yearStart =
//             formatMySQLDate(
//                 startOfYear
//             );

//         const yearEnd =
//             formatMySQLDate(
//                 startOfNextYear
//             );

//         const todayStart =
//             formatMySQLDate(
//                 startOfToday
//             );

//         const todayEnd =
//             formatMySQLDate(
//                 startOfTomorrow
//             );

//         const monthStart =
//             formatMySQLDate(
//                 startOfMonth
//             );

//         const monthEnd =
//             formatMySQLDate(
//                 startOfNextMonth
//             );


//         // ====================================================
//         // QUERY 1
//         //
//         // LAST READING BEFORE THIS YEAR
//         // ====================================================

//         const [previousRows] =
//             await pool.execute(
//                 `
//                 SELECT
//                     lkwh,
//                     recorded_at
//                 FROM energy_history
//                 WHERE imei = ?
//                   AND recorded_at < ?
//                 ORDER BY recorded_at DESC
//                 LIMIT 1
//                 `,
//                 [
//                     imei,
//                     yearStart
//                 ]
//             );


//         let previousLKWH = null;

//         if (previousRows.length > 0) {

//             previousLKWH =
//                 Number(
//                     previousRows[0].lkwh
//                 );
//         }


//         // ====================================================
//         // QUERY 2
//         //
//         // GET ENTIRE YEAR
//         // ====================================================

//         const [rows] =
//             await pool.execute(
//                 `
//                 SELECT
//                     lkwh,
//                     recorded_at
//                 FROM energy_history
//                 WHERE imei = ?
//                   AND recorded_at >= ?
//                   AND recorded_at < ?
//                 ORDER BY recorded_at ASC
//                 `,
//                 [
//                     imei,
//                     yearStart,
//                     yearEnd
//                 ]
//             );


//         // ====================================================
//         // INITIALIZE CHARTS
//         // ====================================================

//         const todayChart =
//             createTodayChart();

//         const monthlyChart =
//             createMonthlyChart(
//                 year,
//                 month
//             );

//         const yearlyChart =
//             createYearlyChart();


//         // ====================================================
//         // NO DATA
//         // ====================================================

//         if (rows.length === 0) {

//             return res.json({

//                 success: true,

//                 imei,

//                 energy: {
//                     today: 0,
//                     monthly: 0,
//                     yearly: 0
//                 },

//                 charts: {
//                     today: todayChart,
//                     monthly: monthlyChart,
//                     yearly: yearlyChart
//                 }

//             });
//         }


//         // ====================================================
//         // PROCESS READINGS
//         // ====================================================

//         let previousReadingLKWH =
//             previousLKWH;


//         for (const row of rows) {

//             const currentLKWH =
//                 Number(row.lkwh);

//             const recordedAt =
//                 new Date(
//                     row.recorded_at
//                 );


//             // =================================================
//             // FIRST READING EVER
//             // =================================================

//             if (
//                 previousReadingLKWH === null
//             ) {

//                 previousReadingLKWH =
//                     currentLKWH;

//                 continue;
//             }


//             // =================================================
//             // CALCULATE DELTA
//             // =================================================

//             let energy =
//                 currentLKWH -
//                 previousReadingLKWH;


//             // =================================================
//             // HANDLE RESET
//             // =================================================

//             if (energy < 0) {

//                 console.warn(
//                     "LKWH reset detected:",
//                     {
//                         imei,
//                         previous:
//                             previousReadingLKWH,
//                         current:
//                             currentLKWH,
//                         recordedAt:
//                             row.recorded_at
//                     }
//                 );

//                 energy = 0;
//             }


//             // =================================================
//             // HOURLY
//             // =================================================

//             const rowYear =
//                 recordedAt.getFullYear();

//             const rowMonth =
//                 recordedAt.getMonth();

//             const rowDay =
//                 recordedAt.getDate();

//             const rowHour =
//                 recordedAt.getHours();


//             if (
//                 rowYear === year &&
//                 rowMonth === month &&
//                 rowDay === day
//             ) {

//                 todayChart[rowHour].value +=
//                     energy;
//             }


//             // =================================================
//             // DAILY
//             // =================================================

//             if (
//                 rowYear === year &&
//                 rowMonth === month
//             ) {

//                 monthlyChart[
//                     rowDay - 1
//                 ].value += energy;
//             }


//             // =================================================
//             // MONTHLY
//             // =================================================

//             if (
//                 rowYear === year
//             ) {

//                 yearlyChart[
//                     rowMonth
//                 ].value += energy;
//             }


//             // =================================================
//             // UPDATE PREVIOUS
//             // =================================================

//             previousReadingLKWH =
//                 currentLKWH;
//         }


//         // ====================================================
//         // ROUND VALUES
//         // ====================================================

//         roundChart(todayChart);
//         roundChart(monthlyChart);
//         roundChart(yearlyChart);


//         // ====================================================
//         // SUMMARY
//         // ====================================================

//         const today =
//             todayChart.reduce(
//                 (sum, item) =>
//                     sum + item.value,
//                 0
//             );

//         const monthly =
//             monthlyChart.reduce(
//                 (sum, item) =>
//                     sum + item.value,
//                 0
//             );

//         const yearly =
//             yearlyChart.reduce(
//                 (sum, item) =>
//                     sum + item.value,
//                 0
//             );


//         // ====================================================
//         // RESPONSE
//         // ====================================================

//         return res.json({

//             success: true,

//             imei,

//             energy: {

//                 today:
//                     Number(
//                         today.toFixed(3)
//                     ),

//                 monthly:
//                     Number(
//                         monthly.toFixed(3)
//                     ),

//                 yearly:
//                     Number(
//                         yearly.toFixed(3)
//                     )
//             },

//             charts: {

//                 today:
//                     todayChart,

//                 monthly:
//                     monthlyChart,

//                 yearly:
//                     yearlyChart
//             }

//         });

//     } catch (err) {

//         console.error(
//             "ENERGY SUMMARY ERROR:",
//             err
//         );

//         return res.status(500).json({
//             error:
//                 "Failed to calculate energy"
//         });
//     }
// };


// working

// const pool = require("../config/database");

// exports.getEnergySummary = async (req, res) => {
//     try {

//         const imei = req.user?.imei;

//         if (!imei) {
//             return res.status(401).json({
//                 error: "Unauthorized: IMEI not found in token"
//             });
//         }


//         // =====================================================
//         // GET CURRENT TIME
//         // =====================================================

//         const now = new Date();

//         const year = now.getFullYear();
//         const month = now.getMonth();
//         const day = now.getDate();


//         // =====================================================
//         // TIME BOUNDARIES
//         // =====================================================

//         const startOfToday = new Date(
//             year,
//             month,
//             day,
//             0,
//             0,
//             0
//         );

//         const startOfTomorrow = new Date(
//             year,
//             month,
//             day + 1,
//             0,
//             0,
//             0
//         );

//         const startOfMonth = new Date(
//             year,
//             month,
//             1,
//             0,
//             0,
//             0
//         );

//         const startOfNextMonth = new Date(
//             year,
//             month + 1,
//             1,
//             0,
//             0,
//             0
//         );

//         const startOfYear = new Date(
//             year,
//             0,
//             1,
//             0,
//             0,
//             0
//         );

//         const startOfNextYear = new Date(
//             year + 1,
//             0,
//             1,
//             0,
//             0,
//             0
//         );


//         // =====================================================
//         // CALCULATE ENERGY FOR A PERIOD
//         // =====================================================

//         const calculateEnergy = async (start, end) => {

//             // -------------------------------------------------
//             // Get the FIRST reading inside this period
//             // -------------------------------------------------

//             const [firstRows] = await pool.execute(
//                 `
//                 SELECT
//                     lkwh,
//                     recorded_at
//                 FROM energy_history
//                 WHERE imei = ?
//                   AND recorded_at >= ?
//                   AND recorded_at < ?
//                 ORDER BY recorded_at ASC
//                 LIMIT 1
//                 `,
//                 [
//                     imei,
//                     start,
//                     end
//                 ]
//             );


//             // -------------------------------------------------
//             // No reading during this period
//             // -------------------------------------------------

//             if (firstRows.length === 0) {
//                 return 0;
//             }


//             // -------------------------------------------------
//             // Get the LAST reading inside this period
//             // -------------------------------------------------

//             const [lastRows] = await pool.execute(
//                 `
//                 SELECT
//                     lkwh,
//                     recorded_at
//                 FROM energy_history
//                 WHERE imei = ?
//                   AND recorded_at >= ?
//                   AND recorded_at < ?
//                 ORDER BY recorded_at DESC
//                 LIMIT 1
//                 `,
//                 [
//                     imei,
//                     start,
//                     end
//                 ]
//             );


//             if (lastRows.length === 0) {
//                 return 0;
//             }


//             const firstLKWH =
//                 Number(firstRows[0].lkwh);

//             const lastLKWH =
//                 Number(lastRows[0].lkwh);


//             // =================================================
//             // CHECK IF THIS IS THE FIRST EVER DEVICE READING
//             // =================================================

//             const [previousRows] = await pool.execute(
//                 `
//                 SELECT
//                     lkwh,
//                     recorded_at
//                 FROM energy_history
//                 WHERE imei = ?
//                   AND recorded_at < ?
//                 ORDER BY recorded_at DESC
//                 LIMIT 1
//                 `,
//                 [
//                     imei,
//                     start
//                 ]
//             );


//             let startingLKWH;


//             if (previousRows.length === 0) {

//                 // =============================================
//                 // FIRST EVER READING
//                 // =============================================

//                 startingLKWH = 0;

//             } else {

//                 // =============================================
//                 // DEVICE ALREADY HAD HISTORY
//                 // =============================================

//                 startingLKWH =
//                     Number(previousRows[0].lkwh);
//             }


//             // =================================================
//             // CALCULATE ENERGY
//             // =================================================

//             let energy =
//                 lastLKWH - startingLKWH;


//             // =================================================
//             // HANDLE LKWH RESET
//             // =================================================

//             if (energy < 0) {

//                 console.log(
//                     `LKWH reset detected for ${imei}`
//                 );

//                 energy = 0;
//             }


//             return Number(
//                 energy.toFixed(3)
//             );
//         };


//         // =====================================================
//         // CALCULATE TODAY
//         // =====================================================

//         const today =
//             await calculateEnergy(
//                 startOfToday,
//                 startOfTomorrow
//             );


//         // =====================================================
//         // CALCULATE MONTH
//         // =====================================================

//         const monthly =
//             await calculateEnergy(
//                 startOfMonth,
//                 startOfNextMonth
//             );


//         // =====================================================
//         // CALCULATE YEAR
//         // =====================================================

//         const yearly =
//             await calculateEnergy(
//                 startOfYear,
//                 startOfNextYear
//             );


//         // =====================================================
//         // RESPONSE
//         // =====================================================

//         return res.json({

//             success: true,

//             imei,

//             energy: {
//                 today,
//                 monthly,
//                 yearly
//             }

//         });

//     } catch (err) {

//         console.error(
//             "ENERGY SUMMARY ERROR:",
//             err
//         );

//         return res.status(500).json({
//             error: "Failed to calculate energy"
//         });
//     }
// };
















































// const pool = require("../config/database");

// exports.getEnergySummary = async (req, res) => {
//     try {

//         // =====================================================
//         // GET IMEI FROM LOGGED-IN USER
//         // =====================================================

//         const imei = req.user?.imei;

//         if (!imei) {
//             return res.status(401).json({
//                 error: "Unauthorized: IMEI not found in token"
//             });
//         }


//         // =====================================================
//         // CURRENT TIME
//         // =====================================================

//         const now = new Date();

//         const year = now.getFullYear();
//         const month = now.getMonth();
//         const day = now.getDate();


//         // =====================================================
//         // TIME BOUNDARIES
//         // =====================================================

//         const startOfToday = new Date(
//             year,
//             month,
//             day,
//             0,
//             0,
//             0
//         );

//         const startOfTomorrow = new Date(
//             year,
//             month,
//             day + 1,
//             0,
//             0,
//             0
//         );

//         const startOfMonth = new Date(
//             year,
//             month,
//             1,
//             0,
//             0,
//             0
//         );

//         const startOfNextMonth = new Date(
//             year,
//             month + 1,
//             1,
//             0,
//             0,
//             0
//         );

//         const startOfYear = new Date(
//             year,
//             0,
//             1,
//             0,
//             0,
//             0
//         );

//         const startOfNextYear = new Date(
//             year + 1,
//             0,
//             1,
//             0,
//             0,
//             0
//         );


//         // =====================================================
//         // CALCULATE ENERGY
//         // =====================================================
//         //
//         // Rules:
//         //
//         // 1. First-ever LKWH reading starts from 0.
//         //
//         // 2. LKWH increasing:
//         //
//         //       10 → 15 → 20
//         //
//         //    Energy = 20 - 10
//         //
//         // 3. LKWH decreases:
//         //
//         //       100 → 105 → 5
//         //
//         //    RESET detected.
//         //
//         //    Everything before 5 is ignored.
//         //
//         // 4. After reset:
//         //
//         //       5 → 8 → 12
//         //
//         //    Energy = 12 - 5
//         //
//         // =====================================================

//         const calculateEnergy = async (start, end) => {

//             // -------------------------------------------------
//             // Get ALL readings for this period
//             // -------------------------------------------------

//             const [rows] = await pool.execute(
//                 `
//                 SELECT
//                     lkwh,
//                     recorded_at
//                 FROM energy_history
//                 WHERE imei = ?
//                   AND recorded_at >= ?
//                   AND recorded_at < ?
//                 ORDER BY recorded_at ASC
//                 `,
//                 [
//                     imei,
//                     start,
//                     end
//                 ]
//             );


//             // -------------------------------------------------
//             // No readings
//             // -------------------------------------------------

//             if (rows.length === 0) {
//                 return 0;
//             }


//             // -------------------------------------------------
//             // Convert LKWH values to numbers
//             // -------------------------------------------------

//             const readings = rows
//                 .map(row => ({
//                     lkwh: Number(row.lkwh),
//                     recorded_at: row.recorded_at
//                 }))
//                 .filter(row =>
//                     Number.isFinite(row.lkwh)
//                 );


//             if (readings.length === 0) {
//                 return 0;
//             }


//             // =================================================
//             // FIND THE MOST RECENT RESET
//             // =================================================
//             //
//             // Example:
//             //
//             // 100
//             // 105
//             // 110
//             // 5     <-- reset
//             // 8
//             // 12
//             //
//             // We only use:
//             //
//             // 5 → 8 → 12
//             //
//             // =================================================

//             let resetIndex = -1;

//             for (
//                 let i = 1;
//                 i < readings.length;
//                 i++
//             ) {

//                 const previous =
//                     readings[i - 1].lkwh;

//                 const current =
//                     readings[i].lkwh;


//                 if (current < previous) {

//                     resetIndex = i;

//                     console.log(
//                         `LKWH RESET detected for ${imei}: ` +
//                         `${previous} → ${current} at ` +
//                         `${readings[i].recorded_at}`
//                     );
//                 }
//             }


//             // =================================================
//             // KEEP ONLY READINGS AFTER THE MOST RECENT RESET
//             // =================================================

//             let activeReadings;

//             if (resetIndex !== -1) {

//                 activeReadings =
//                     readings.slice(resetIndex);

//             } else {

//                 activeReadings =
//                     readings;
//             }


//             // -------------------------------------------------
//             // Safety check
//             // -------------------------------------------------

//             if (activeReadings.length === 0) {
//                 return 0;
//             }


//             // =================================================
//             // STARTING LKWH
//             // =================================================
//             //
//             // If this is the first reading ever:
//             //
//             //     LKWH = 9
//             //
//             // Energy should be:
//             //
//             //     9 - 0 = 9
//             //
//             // Therefore, if there is no reading before
//             // this period, the starting value is ZERO.
//             //
//             // =================================================

//             let startingLKWH;


//             // -------------------------------------------------
//             // If a reset happened INSIDE this period
//             // -------------------------------------------------

//             if (resetIndex !== -1) {

//                 startingLKWH =
//                     activeReadings[0].lkwh;

//             } else {

//                 // -------------------------------------------------
//                 // Check for a reading before this period
//                 // -------------------------------------------------

//                 const [previousRows] =
//                     await pool.execute(
//                         `
//                         SELECT
//                             lkwh,
//                             recorded_at
//                         FROM energy_history
//                         WHERE imei = ?
//                           AND recorded_at < ?
//                         ORDER BY recorded_at DESC
//                         LIMIT 1
//                         `,
//                         [
//                             imei,
//                             start
//                         ]
//                     );


//                 if (previousRows.length === 0) {

//                     // =============================================
//                     // FIRST-EVER DEVICE READING
//                     // =============================================

//                     startingLKWH = 0;

//                 } else {

//                     // =============================================
//                     // DEVICE HAD HISTORY BEFORE THIS PERIOD
//                     // =============================================

//                     startingLKWH =
//                         Number(
//                             previousRows[0].lkwh
//                         );
//                 }
//             }


//             // =================================================
//             // LAST LKWH
//             // =================================================

//             const lastLKWH =
//                 activeReadings[
//                     activeReadings.length - 1
//                 ].lkwh;


//             // =================================================
//             // CALCULATE
//             // =================================================

//             let energy =
//                 lastLKWH - startingLKWH;


//             // =================================================
//             // NEVER ALLOW NEGATIVE ENERGY
//             // =================================================

//             if (energy < 0) {
//                 energy = 0;
//             }


//             // =================================================
//             // RETURN MAX 3 DECIMAL PLACES
//             // =================================================

//             return Number(
//                 energy.toFixed(3)
//             );
//         };


//         // =====================================================
//         // TODAY
//         // =====================================================

//         const today =
//             await calculateEnergy(
//                 startOfToday,
//                 startOfTomorrow
//             );


//         // =====================================================
//         // MONTH
//         // =====================================================

//         const monthly =
//             await calculateEnergy(
//                 startOfMonth,
//                 startOfNextMonth
//             );


//         // =====================================================
//         // YEAR
//         // =====================================================

//         const yearly =
//             await calculateEnergy(
//                 startOfYear,
//                 startOfNextYear
//             );


//         // =====================================================
//         // RESPONSE
//         // =====================================================

//         return res.json({

//             success: true,

//             imei,

//             energy: {

//                 today,

//                 monthly,

//                 yearly

//             }

//         });


//     } catch (err) {

//         console.error(
//             "ENERGY SUMMARY ERROR:",
//             err
//         );

//         return res.status(500).json({
//             error: "Failed to calculate energy summary"
//         });
//     }
// };















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

            const imei =
                req.user?.imei;


            if (!imei) {

                return res.status(401).json({

                    error:
                        "Unauthorized: IMEI not found in token"
                });
            }


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