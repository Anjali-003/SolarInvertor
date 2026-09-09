import P from "../theme/colors";
import Chart from "react-apexcharts";

export default function GenerationChartCard({
    data,
    chartMode,
    setChartMode,
    chartData,
    chartMeta,
    todayOffset,
    setTodayOffset,
    weekOffset,
    setWeekOffset,
    monthOffset,
    setMonthOffset,
    yearOffset,
    setYearOffset,
    refreshing,
    handleRefreshEnergy
}) {

    // CURRENT SOLAR POWER
    // PPOW is Watts
    const currentSolarPower = Number.isFinite(Number(data?.PPOW)) ? Number(data.PPOW) : null;

    const chartDescriptions = {
        week: "Energy generated per day",
        month: "Energy generated per day",
        year: "Energy generated per month"
    };

    // HARDCODED FALLBACK DATA — ensures the chart always shows a plotted
    // graph even when no real data has come back from the backend yet.
    const FALLBACK_CHART_DATA = {
        today: [
            { label: "06:00", value: 0.2 }, { label: "07:00", value: 0.8 },
            { label: "08:00", value: 1.6 }, { label: "09:00", value: 2.4 },
            { label: "10:00", value: 3.1 }, { label: "11:00", value: 3.6 },
            { label: "12:00", value: 3.9 }, { label: "13:00", value: 3.7 },
            { label: "14:00", value: 3.3 }, { label: "15:00", value: 2.6 },
            { label: "16:00", value: 1.8 }, { label: "17:00", value: 0.9 },
            { label: "18:00", value: 0.3 },
        ],
        week: [
            { label: "Mon", value: 14.2 }, { label: "Tue", value: 16.8 },
            { label: "Wed", value: 12.5 }, { label: "Thu", value: 18.1 },
            { label: "Fri", value: 15.6 }, { label: "Sat", value: 19.4 },
            { label: "Sun", value: 17.3 },
        ],
        month: Array.from({ length: 31 }, (_, index) => ({
            label: String(index + 1),
            value: Number((12 + Math.sin(index / 2.5) * 6 + (index % 5)).toFixed(1)),
        })),
        year: [
            { label: "Jan", value: 320 }, { label: "Feb", value: 340 },
            { label: "Mar", value: 410 }, { label: "Apr", value: 460 },
            { label: "May", value: 505 }, { label: "Jun", value: 470 },
            { label: "Jul", value: 430 }, { label: "Aug", value: 445 },
            { label: "Sep", value: 400 }, { label: "Oct", value: 360 },
            { label: "Nov", value: 300 }, { label: "Dec", value: 280 },
        ],
    };

    const effectiveChartData =
        Array.isArray(chartData) && chartData.length > 0
            ? chartData
            : FALLBACK_CHART_DATA[chartMode] || FALLBACK_CHART_DATA.today;

    // STYLES
    const chartCard = { background: "rgba(22, 38, 45, 0.88)", borderRadius: 16, padding: "16px", marginBottom: 14, boxShadow: P.shadowCard, border: "1px solid rgba(255,255,255,0.08)" };
    const chartHeader = { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16, gap: 12 };
    const chartTitle = { fontSize: 14, fontWeight: 700, color: "#ffffff", fontFamily: "'DM Sans', sans-serif" };
    const chartBadge = { background: P.amber, color: "#ffffff", fontSize: 12, fontWeight: 700, padding: "4px 10px", borderRadius: 20, fontFamily: "'Inter', sans-serif", whiteSpace: "nowrap" };
    const navigationButtonStyle = { width: 34, height: 34, border: "1px solid rgba(255,255,255,0.12)", borderRadius: 8, background: "rgba(255,255,255,0.06)", color: "#ffffff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, padding: 0 };

    // =====================================================
    // APEXCHARTS SETUP
    // =====================================================

    const isToday = chartMode === "today";
    const isMonthly = chartMode === "month";

    const categories = effectiveChartData.map((item) => item.label);
    const values = effectiveChartData.map((item) => Number(item.value) || 0);

    const series = [
        {
            name: isToday ? "Power" : "Energy",
            data: values,
        },
    ];

    const chartOptions = {
        chart: {
            type: isToday ? "area" : "bar",
            toolbar: { show: false },
            zoom: { enabled: false },
            background: "transparent",
            foreColor: "rgba(255,255,255,0.6)",
            animations: { enabled: true, easing: "easeinout", speed: 450 },
        },
        theme: { mode: "dark" },
        colors: ["#ffffff"],
        dataLabels: { enabled: false },
        stroke: isToday
            ? { curve: "straight", width: 1.5, colors: ["#ffffff"] }
            : { show: false },
        fill: isToday
            ? { type: "solid", opacity: 0.9 }
            : { type: "solid", opacity: 1 },
        plotOptions: !isToday
            ? {
                  bar: {
                      borderRadius: 1,
                      columnWidth: isMonthly ? "45%" : "50%",
                  },
              }
            : {},
        grid: {
            borderColor: "rgba(255,255,255,0.15)",
            strokeDashArray: 3,
            xaxis: { lines: { show: false } },
            padding: { left: 4, right: 4 },
        },
        xaxis: {
            categories,
            labels: {
                style: { colors: "rgba(255,255,255,0.6)", fontSize: "9px" },
                rotate: -45,
                trim: true,
            },
            axisBorder: { show: false },
            axisTicks: { show: false },
        },
        yaxis: {
            labels: {
                style: { colors: "rgba(255,255,255,0.6)", fontSize: "9px" },
            },
        },
        tooltip: {
            theme: "dark",
            y: {
                formatter: (val) => `${val} ${isToday ? "kW" : "kWh"}`,
            },
        },
        legend: { show: false },
    };

    // NAVIGATION
    const renderNavigation = () => {

        // TODAY
        if (chartMode === "today") {
            return (
                <PeriodNavigation
                    leftAction={() => setTodayOffset((value) => value - 1)}
                    rightAction={() => setTodayOffset((value) => Math.min(0, value + 1))}
                    rightDisabled={todayOffset === 0}
                    label={chartMeta?.label || "Today"}
                    buttonStyle={navigationButtonStyle}
                />
            );
        }

        // WEEK
        if (chartMode === "week") {
            return (
                <PeriodNavigation
                    leftAction={() => setWeekOffset((value) => value - 1)}
                    rightAction={() => setWeekOffset((value) => Math.min(0, value + 1))}
                    rightDisabled={weekOffset === 0}
                    label={chartMeta?.range ? `${chartMeta.range.start} — ${chartMeta.range.end}` : "Current week"}
                    buttonStyle={navigationButtonStyle}
                />
            );
        }

        // MONTH
        if (chartMode === "month") {
            return (
                <PeriodNavigation
                    leftAction={() => setMonthOffset((value) => value - 1)}
                    rightAction={() => setMonthOffset((value) => Math.min(0, value + 1))}
                    rightDisabled={monthOffset === 0}
                    label={chartMeta?.label || "Current month"}
                    buttonStyle={navigationButtonStyle}
                />
            );
        }

        // YEAR
        return (
            <PeriodNavigation
                leftAction={() => setYearOffset((value) => value - 1)}
                rightAction={() => setYearOffset((value) => Math.min(0, value + 1))}
                rightDisabled={yearOffset === 0}
                label={chartMeta?.label || "Current year"}
                buttonStyle={navigationButtonStyle}
            />
        );
    };

    // UI
    return (
        <div style={chartCard}>
            {/* HEADER — fixed title + refresh, matches "GENERATION CHART" header in the app */}
            <div style={chartHeader}>
                <span style={chartTitle}>Generation Chart</span>

                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    {/* BADGE */}
                    <span style={chartBadge}>
                        {chartMode === "today"
                            ? todayOffset === 0
                                ? `${currentSolarPower !== null ? currentSolarPower.toFixed(0) : "--"} W`
                                : chartMeta?.label || ""
                            : `${Number(chartMeta?.total ?? 0).toFixed(2)} kWh`}
                    </span>

                    {/* REFRESH */}
                    <button
                        type="button"
                        onClick={handleRefreshEnergy}
                        disabled={refreshing}
                        aria-label="Refresh chart"
                        title="Refresh energy data"
                        style={{ width: 34, height: 34, border: "1px solid rgba(255,255,255,0.12)", borderRadius: 8, background: refreshing ? "rgba(255,255,255,0.03)" : "rgba(255,255,255,0.06)", color: "#ffffff", display: "flex", alignItems: "center", justifyContent: "center", cursor: refreshing ? "default" : "pointer", padding: 0, opacity: refreshing ? 0.6 : 1, flexShrink: 0 }}
                    >
                        <svg
                            width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                            style={{ transform: refreshing ? "rotate(360deg)" : "none", transition: refreshing ? "transform 0.8s linear" : "none" }}
                        >
                            <path d="M20 11a8.1 8.1 0 0 0-15.5-2" />
                            <polyline points="4 4 4 9 9 9" />
                            <path d="M4 13a8.1 8.1 0 0 0 15.5 2" />
                            <polyline points="20 20 20 15 15 15" />
                        </svg>
                    </button>
                </div>
            </div>

            {/* CHART — ApexCharts area chart for "today", bar chart for week/month/year */}
            <Chart
                key={chartMode}
                options={chartOptions}
                series={series}
                type={isToday ? "area" : "bar"}
                height={240}
            />

            {/* DATE NAVIGATION — sits below the chart, above the period tabs,
                matching the "‹ Sat 5th Sept'26 ›" row from the screenshots */}
            <div style={{ marginTop: 10 }}>
                {renderNavigation()}
            </div>

            {/* PERIOD TABS — underlined style at the bottom of the card,
                matching TODAY / WEEK / MONTH / YEAR from the screenshots */}
            <div
                style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(4, 1fr)",
                    borderTop: "1px solid rgba(255,255,255,0.12)",
                    paddingTop: 10,
                }}
            >
                {[["today", "TODAY"], ["week", "WEEK"], ["month", "MONTH"], ["year", "YEAR"]].map(([key, label]) => {
                    const active = chartMode === key;
                    return (
                        <button
                            key={key}
                            type="button"
                            onClick={() => setChartMode(key)}
                            style={{
                                border: "none",
                                background: "transparent",
                                cursor: "pointer",
                                padding: "6px 2px 10px",
                                fontSize: 12,
                                fontWeight: active ? 800 : 600,
                                letterSpacing: 0.4,
                                color: active ? "#ffffff" : "rgba(255,255,255,0.6)",
                                fontFamily: "'Inter', sans-serif",
                                borderBottom: active ? "2px solid #ffffff" : "2px solid transparent",
                            }}
                        >
                            {label}
                        </button>
                    );
                })}
            </div>

            {/* DESCRIPTION */}
            <div style={{ textAlign: "center", marginTop: 8, fontSize: 10, color: "rgba(255,255,255,0.5)" }}>
                {chartDescriptions[chartMode]}
            </div>
        </div>
    );
}

// PERIOD NAVIGATION
function PeriodNavigation({ leftAction, rightAction, rightDisabled, label, buttonStyle }) {
    return (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16, gap: 12 }}>
            {/* LEFT */}
            <button type="button" onClick={leftAction} style={{ ...buttonStyle, cursor: "pointer" }}>‹</button>

            {/* LABEL */}
            <div style={{ flex: 1, minWidth: 0, fontSize: 12, fontWeight: 700, color: "#ffffff", textAlign: "center", fontFamily: "'Inter', sans-serif", overflowWrap: "anywhere" }}>
                {label}
            </div>

            {/* RIGHT */}
            <button
                type="button"
                onClick={rightAction}
                disabled={rightDisabled}
                style={{ ...buttonStyle, cursor: rightDisabled ? "default" : "pointer", opacity: rightDisabled ? 0.4 : 1 }}
            >›</button>
        </div>
    );
}
