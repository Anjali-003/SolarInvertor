const pool = require("../config/database");

const { aggregateHour } = require("../utils/hourlyEnergy");

// =====================================================
// HELPERS
//
// Energy helpers used by the admin device views.
// =====================================================

function getElapsedHours(start, end) {
  return (end.getTime() - start.getTime()) / (1000 * 60 * 60);
}

function calculateCUF(generatedEnergy, capacityKw, totalHours) {
  const energy = Number(generatedEnergy);
  const capacity = Number(capacityKw);

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

  const cuf = (energy / (capacity * totalHours)) * 100;

  return Number(cuf.toFixed(3));
}

function getHoursInMonth(date) {
  const year = date.getFullYear();
  const month = date.getMonth();

  const daysInMonth = new Date(year, month + 1, 0).getDate();

  return daysInMonth * 24;
}

function getHoursInYear(date) {
  const year = date.getFullYear();

  const isLeapYear = (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;

  return (isLeapYear ? 366 : 365) * 24;
}

function toMysqlDate(date) {
  const year = date.getFullYear();

  const month = String(date.getMonth() + 1).padStart(2, "0");

  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function getWeekRange(now, offset = 0) {
  const start = startOfDay(now);

  const day = start.getDay();

  // Move to Sunday
  start.setDate(start.getDate() - day);

  // Move backward/forward by whole weeks
  start.setDate(start.getDate() + offset * 7);

  const end = new Date(start);

  end.setDate(end.getDate() + 7);

  return { start, end };
}

function getMonthRange(now, offset = 0) {
  const start = new Date(
    now.getFullYear(),
    now.getMonth() + offset,
    1,
    0,
    0,
    0,
    0,
  );

  const end = new Date(
    start.getFullYear(),
    start.getMonth() + 1,
    1,
    0,
    0,
    0,
    0,
  );

  return { start, end };
}

// =====================================================
// LOOK UP DEVICE FOR CHARTS
// Admin can access any device.
// =====================================================

async function getAdminDeviceForChart(deviceId) {
  const [devices] = await pool.execute(
    `
        SELECT
            id,
            imei,
            rated_capacity_kw
        FROM devices
        WHERE id = ?
        LIMIT 1
        `,
    [deviceId],
  );

  if (devices.length === 0) {
    return null;
  }

  return devices[0];
}

// =====================================================
// TODAY SOLAR POWER CHART
// =====================================================

async function getTodayPowerChart(imei, now, offset = 0) {
  const selectedDate = new Date(now);

  selectedDate.setDate(selectedDate.getDate() + offset);

  const start = startOfDay(selectedDate);

  const end = new Date(start);

  end.setDate(end.getDate() + 1);

  const [rows] = await pool.execute(
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
    [imei, toMysqlDateTime(start), toMysqlDateTime(end)],
  );

  const chart = rows.map((row) => {
    const date = new Date(row.bucket_time);

    return {
      label: date.toLocaleTimeString("en-GB", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      }),

      value: Number((Number(row.power_kw) * 1000).toFixed(1)),
    };
  });

  return {
    chart,

    label: selectedDate.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }),
  };
}

// =====================================================
// WEEK ENERGY CHART
// =====================================================

async function getWeekEnergyChart(imei, now, offset) {
  const { start, end } = getWeekRange(now, offset);

  const chart = [];

  for (let index = 0; index < 7; index++) {
    const date = new Date(start);

    date.setDate(date.getDate() + index);

    chart.push({
      label: date.toLocaleDateString("en-US", {
        weekday: "short",
      }),

      value: 0,
    });
  }

  const [rows] = await pool.execute(
    `
        SELECT
            DATE(
                DATE_SUB(hour_end, INTERVAL 1 HOUR)
            ) AS day,
            SUM(energy_kwh) AS energy_kwh

        FROM hourly_energy

        WHERE imei = ?
          AND hour_end > ?
          AND hour_end <= ?

        GROUP BY
            DATE(
                DATE_SUB(hour_end, INTERVAL 1 HOUR)
            )

        ORDER BY
            day ASC
        `,
    [imei, toMysqlDateTime(start), toMysqlDateTime(end)],
  );

  for (const row of rows) {
    const rowDate = new Date(row.day);

    rowDate.setHours(0, 0, 0, 0);

    const diffDays = Math.floor(
      (rowDate.getTime() - start.getTime()) / 86400000,
    );

    if (diffDays >= 0 && diffDays < 7) {
      chart[diffDays].value = Number(Number(row.energy_kwh).toFixed(3));
    }
  }

  const total = chart.reduce((sum, item) => sum + item.value, 0);

  return {
    chart,

    total: Number(total.toFixed(3)),

    range: {
      start: toMysqlDate(start),

      end: toMysqlDate(new Date(end.getTime() - 86400000)),
    },
  };
}

// =====================================================
// MONTH ENERGY CHART
// =====================================================

async function getMonthEnergyChart(imei, now, offset) {
  const { start, end } = getMonthRange(now, offset);

  const daysInMonth = new Date(
    start.getFullYear(),
    start.getMonth() + 1,
    0,
  ).getDate();

  const chart = Array.from({ length: daysInMonth }, (_, index) => ({
    label: String(index + 1),
    value: 0,
  }));

  const [rows] = await pool.execute(
    `
        SELECT
            DAY(
                DATE_SUB(hour_end, INTERVAL 1 HOUR)
            ) AS day_number,

            SUM(energy_kwh) AS energy_kwh

        FROM hourly_energy

        WHERE imei = ?
          AND hour_end > ?
          AND hour_end <= ?

        GROUP BY
            DAY(
                DATE_SUB(hour_end, INTERVAL 1 HOUR)
            )

        ORDER BY
            day_number ASC
        `,
    [imei, toMysqlDateTime(start), toMysqlDateTime(end)],
  );

  for (const row of rows) {
    const dayNumber = Number(row.day_number);

    if (!Number.isInteger(dayNumber)) {
      continue;
    }

    const index = dayNumber - 1;

    if (index >= 0 && index < chart.length) {
      chart[index].value = Number(Number(row.energy_kwh).toFixed(3));
    }
  }

  const total = chart.reduce((sum, item) => sum + Number(item.value), 0);

  return {
    chart,

    total: Number(total.toFixed(3)),

    label: start.toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
    }),
  };
}

// =====================================================
// YEAR ENERGY CHART
// =====================================================

async function getYearEnergyChart(imei, now, offset) {
  const year = now.getFullYear() + offset;

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
    "Dec",
  ];

  const chart = labels.map((label) => ({
    label,
    value: 0,
  }));

  const yearStart = new Date(year, 0, 1, 0, 0, 0, 0);

  const nextYearStart = new Date(year + 1, 0, 1, 0, 0, 0, 0);

  const [rows] = await pool.execute(
    `
        SELECT
            MONTH(
                DATE_SUB(hour_end, INTERVAL 1 HOUR)
            ) AS month_number,

            SUM(energy_kwh) AS energy_kwh

        FROM hourly_energy

        WHERE imei = ?
          AND hour_end > ?
          AND hour_end <= ?

        GROUP BY
            MONTH(
                DATE_SUB(hour_end, INTERVAL 1 HOUR)
            )

        ORDER BY month_number ASC
        `,
    [imei, toMysqlDateTime(yearStart), toMysqlDateTime(nextYearStart)],
  );

  for (const row of rows) {
    const index = Number(row.month_number) - 1;

    if (index >= 0 && index < 12) {
      chart[index].value = Number(Number(row.energy_kwh).toFixed(3));
    }
  }

  const total = chart.reduce((sum, item) => sum + item.value, 0);

  return {
    chart,

    total: Number(total.toFixed(3)),

    label: String(year),
  };
}

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

  const month = String(date.getMonth() + 1).padStart(2, "0");

  const day = String(date.getDate()).padStart(2, "0");

  const hours = String(date.getHours()).padStart(2, "0");

  const minutes = String(date.getMinutes()).padStart(2, "0");

  const seconds = String(date.getSeconds()).padStart(2, "0");

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

function generateHours(start, end) {
  const hours = [];

  const current = new Date(start);

  while (current <= end) {
    hours.push(new Date(current));

    current.setHours(current.getHours() + 1);
  }

  return hours;
}

async function calculateCompletedHours(imei, from, to) {
  const hours = generateHours(from, to);

  const results = [];

  for (const hourEnd of hours) {
    const result = await aggregateHour(imei, hourEnd);

    if (result) {
      results.push(result);
    }
  }

  return results;
}

async function getHourlyData(imei, start, end) {
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
    [imei, toMysqlDateTime(start), toMysqlDateTime(end)],
  );

  return rows.map((row) => ({
    hour: row.hour_end,
    energy: Number(row.energy_kwh),
  }));
}

// =====================================================
// CHARTS
// =====================================================

function createTodayChart(rows) {
  const chart = Array.from({ length: 24 }, (_, hour) => ({
    label: `${String(hour).padStart(2, "0")}:00`,
    value: 0,
  }));

  for (const row of rows) {
    const date = new Date(row.hour);

    const hour = date.getHours();

    if (hour >= 0 && hour < 24) {
      chart[hour].value += row.energy;
    }
  }

  return chart.map((item) => ({
    label: item.label,
    value: Number(item.value.toFixed(3)),
  }));
}

function createMonthlyChart(rows, year, month) {
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const chart = Array.from({ length: daysInMonth }, (_, index) => ({
    label: String(index + 1),
    value: 0,
  }));

  for (const row of rows) {
    const date = new Date(row.hour);

    if (date.getFullYear() !== year || date.getMonth() !== month) {
      continue;
    }

    const day = date.getDate();

    chart[day - 1].value += row.energy;
  }

  return chart.map((item) => ({
    label: item.label,
    value: Number(item.value.toFixed(3)),
  }));
}

function createYearlyChart(rows, year) {
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
    "Dec",
  ];

  const chart = labels.map((label) => ({
    label,
    value: 0,
  }));

  for (const row of rows) {
    const date = new Date(row.hour);

    if (date.getFullYear() !== year) {
      continue;
    }

    const month = date.getMonth();

    chart[month].value += row.energy;
  }

  return chart.map((item) => ({
    label: item.label,
    value: Number(item.value.toFixed(3)),
  }));
}

// =====================================================
// ADMIN ENERGY CHART
// (today / week / month / year, with offset navigation —
// mirrors energyController.getEnergyChart for the user
// dashboard, but admin can access any device)
// =====================================================

exports.getAdminEnergyChart = async (req, res) => {
  try {
    if (!req.admin) {
      return res.status(401).json({
        error: "Admin authentication required",
      });
    }

    const deviceId = Number(req.params.id);

    const period = String(req.query.period || "").toLowerCase();

    const offset = Number(req.query.offset || 0);

    if (!Number.isInteger(deviceId) || deviceId <= 0) {
      return res.status(400).json({
        error: "Invalid device id",
      });
    }

    if (!["today", "week", "month", "year"].includes(period)) {
      return res.status(400).json({
        error: "Invalid period",
      });
    }

    if (!Number.isInteger(offset) || offset > 0) {
      return res.status(400).json({
        error: "Invalid offset",
      });
    }

    const device = await getAdminDeviceForChart(deviceId);

    if (!device) {
      return res.status(404).json({
        error: "Device not found",
      });
    }

    const imei = device.imei;
    const now = new Date();

    // TODAY = SOLAR POWER
    if (period === "today") {
      const result = await getTodayPowerChart(imei, now, offset);

      return res.json({
        success: true,
        period: "today",
        unit: "kW",
        offset,
        ...result,
      });
    }

    // WEEK
    if (period === "week") {
      const result = await getWeekEnergyChart(imei, now, offset);

      return res.json({
        success: true,
        period: "week",
        unit: "kWh",
        offset,
        ...result,
      });
    }

    // MONTH
    if (period === "month") {
      const result = await getMonthEnergyChart(imei, now, offset);

      return res.json({
        success: true,
        period: "month",
        unit: "kWh",
        offset,
        ...result,
      });
    }

    // YEAR
    const result = await getYearEnergyChart(imei, now, offset);

    return res.json({
      success: true,
      period: "year",
      unit: "kWh",
      offset,
      ...result,
    });
  } catch (err) {
    console.error("=================================");
    console.error("ADMIN ENERGY CHART ERROR");
    console.error("Message:", err.message);
    console.error("Stack:", err.stack);
    console.error("=================================");

    return res.status(500).json({
      error: "Failed to load chart data",
      message: err.message,
    });
  }
};

// =====================================================
// ADMIN ENERGY SUMMARY
// =====================================================

exports.getAdminEnergySummary = async (req, res) => {
  try {
    // =================================================
    // LOGGED-IN ADMIN
    // =================================================

    if (!req.admin) {
      return res.status(401).json({
        error: "Admin authentication required",
      });
    }

    // =================================================
    // DEVICE ID
    // =================================================

    const deviceId = Number(req.params.id);

    if (!Number.isInteger(deviceId) || deviceId <= 0) {
      return res.status(400).json({
        error: "Invalid device id",
      });
    }

    // =================================================
    // VERIFY DEVICE EXISTS
    // Admin can access any device.
    // =================================================

    const [devices] = await pool.execute(
      `
            SELECT
                id,
                imei,
                rated_capacity_kw
            FROM devices
            WHERE id = ?
            LIMIT 1
            `,
      [deviceId],
    );

    if (devices.length === 0) {
      return res.status(404).json({
        error: "Device not found",
      });
    }

    const imei = devices[0].imei;

    const capacityKw = Number(devices[0].rated_capacity_kw);

    // =================================================
    // CURRENT TIME
    // =================================================

    const now = new Date();

    // =================================================
    // LAST COMPLETED HOUR
    // =================================================

    const lastCompletedHour = getLastCompletedHour(now);

    // =================================================
    // TODAY
    // =================================================

    const todayStart = startOfDay(now);

    await calculateCompletedHours(
      imei,
      new Date(todayStart),
      lastCompletedHour,
    );

    const todayRows = await getHourlyData(imei, todayStart, lastCompletedHour);

    const todayChart = createTodayChart(todayRows);

    // =================================================
    // MONTH
    // =================================================

    const monthStart = startOfMonth(now);

    await calculateCompletedHours(
      imei,
      new Date(monthStart),
      lastCompletedHour,
    );

    const monthRows = await getHourlyData(imei, monthStart, lastCompletedHour);

    const monthlyChart = createMonthlyChart(
      monthRows,
      now.getFullYear(),
      now.getMonth(),
    );

    // =================================================
    // YEAR
    // =================================================

    const yearStart = startOfYear(now);

    await calculateCompletedHours(imei, new Date(yearStart), lastCompletedHour);

    const yearRows = await getHourlyData(imei, yearStart, lastCompletedHour);

    const yearlyChart = createYearlyChart(yearRows, now.getFullYear());

    // =================================================
    // TOTALS
    // =================================================

    const today = todayChart.reduce((sum, item) => sum + item.value, 0);

    const monthly = monthlyChart.reduce((sum, item) => sum + item.value, 0);

    const yearly = yearlyChart.reduce((sum, item) => sum + item.value, 0);

    // =================================================
    // CUF
    // =================================================

    const dailyCUF = calculateCUF(
      today,
      capacityKw,
      getElapsedHours(todayStart, lastCompletedHour),
    );

    const monthlyCUF = calculateCUF(
      monthly,
      capacityKw,
      getElapsedHours(monthStart, lastCompletedHour),
    );

    const yearlyCUF = calculateCUF(
      yearly,
      capacityKw,
      getElapsedHours(yearStart, lastCompletedHour),
    );

    // =================================================
    // RESPONSE
    // =================================================

    return res.json({
      success: true,

      device_id: deviceId,

      imei,

      energy: {
        today: Number(today.toFixed(3)),

        monthly: Number(monthly.toFixed(3)),

        yearly: Number(yearly.toFixed(3)),
      },

      cuf: {
        today: dailyCUF,

        monthly: monthlyCUF,

        yearly: yearlyCUF,
      },

      charts: {
        today: todayChart,

        monthly: monthlyChart,

        yearly: yearlyChart,
      },
    });
  } catch (err) {
    console.error("=================================");

    console.error("ADMIN ENERGY SUMMARY ERROR");

    console.error("Message:", err.message);

    console.error("Code:", err.code);

    console.error("SQL Message:", err.sqlMessage);

    console.error("Stack:", err.stack);

    console.error("=================================");

    return res.status(500).json({
      error: "Failed to calculate admin energy",
      message: err.message,
    });
  }
};
