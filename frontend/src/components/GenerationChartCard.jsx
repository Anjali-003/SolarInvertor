import P from "../theme/colors";

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

    // TITLES
    const chartTitles = {
        today: "Daily Solar Power",
        week: "Weekly Energy",
        month: "Monthly Energy",
        year: "Yearly Energy"
    };

    const chartDescriptions = {
        today: "Solar power throughout the day",
        week: "Energy generated per day",
        month: "Energy generated per day",
        year: "Energy generated per month"
    };

    // STYLES
    const chartCard = { background: P.surface, borderRadius: 16, padding: "16px", marginBottom: 14, boxShadow: P.shadowCard, border: `1px solid ${P.border}` };
    const chartHeader = { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16, gap: 12 };
    const chartTitle = { fontSize: 14, fontWeight: 700, color: P.textPrimary, fontFamily: "'DM Sans', sans-serif" };
    const chartBadge = { background: P.amber, color: P.surface, fontSize: 12, fontWeight: 700, padding: "4px 10px", borderRadius: 20, fontFamily: "'Inter', sans-serif", whiteSpace: "nowrap" };
    const navigationButtonStyle = { width: 34, height: 34, border: `1px solid ${P.border}`, borderRadius: 8, background: P.surface, color: P.textPrimary, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, padding: 0 };

    // TODAY LINE CHART
    const SolarPowerLineChart = ({ data }) => {
        const safeData = Array.isArray(data) ? data : [];

        // EMPTY
        if (safeData.length === 0) {
            return (
                <div style={{ height: 220, display: "flex", alignItems: "center", justifyContent: "center", color: P.textMuted, fontSize: 13 }}>
                    No solar power data available
                </div>
            );
        }

        const width = 500;
        const height = 220;
        const leftPadding = 45;
        const rightPadding = 15;
        const topPadding = 20;
        const bottomPadding = 35;

        // CONVERT HH:mm TO MINUTES
        const getMinutes = (label) => {
            if (typeof label !== "string" || !label.includes(":")) return null;
            const [hourString, minuteString] = label.split(":");
            const hour = Number(hourString);
            const minute = Number(minuteString);
            if (!Number.isFinite(hour) || !Number.isFinite(minute)) return null;
            return hour * 60 + minute;
        };

        // VALID DATA
        const validData = safeData.filter((item) => {
            const minutes = getMinutes(item?.label);
            const value = Number(item?.value);
            return minutes !== null && Number.isFinite(value);
        });

        if (validData.length === 0) {
            return (
                <div style={{ height: 220, display: "flex", alignItems: "center", justifyContent: "center", color: P.textMuted, fontSize: 13 }}>
                    No valid solar power data available
                </div>
            );
        }

        // TIME RANGE
        const firstMinute = getMinutes(validData[0].label);
        const lastMinute = getMinutes(validData[validData.length - 1].label);
        const timeRange = Math.max(lastMinute - firstMinute, 1);

        // MAX VALUE
        const rawMax = Math.max(...validData.map((item) => Number(item.value) || 0), 0);

        // NICE Y MAX
        const getNiceMax = (value) => {
            if (value <= 0) return 1;
            const magnitude = Math.pow(10, Math.floor(Math.log10(value)));
            const normalized = value / magnitude;
            let nice;
            if (normalized <= 1) nice = 1;
            else if (normalized <= 2) nice = 2;
            else if (normalized <= 5) nice = 5;
            else nice = 10;
            return nice * magnitude;
        };

        const yAxisMax = Math.max(getNiceMax(rawMax), 1);

        // Y TICKS
        const tickCount = 5;
        const yTicks = Array.from({ length: tickCount + 1 }, (_, index) =>
            Number(((yAxisMax / tickCount) * index).toFixed(2))
        );

        // PLOT DIMENSIONS
        const plotWidth = width - leftPadding - rightPadding;
        const plotHeight = height - topPadding - bottomPadding;

        // POINTS
        const points = validData.map((item) => {
            const currentMinute = getMinutes(item.label);
            const value = Number(item.value);
            const x = leftPadding + ((currentMinute - firstMinute) / timeRange) * plotWidth;
            const y = topPadding + (1 - value / yAxisMax) * plotHeight;
            return { x, y, item };
        });

        // LINE PATH
        const path = points.map((point, index) => `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`).join(" ");

        // AREA PATH
        const baselineY = topPadding + plotHeight;
        const areaPath =
            points.length > 0
                ? `M ${points[0].x} ${baselineY} ` +
                  points.map((point) => `L ${point.x} ${point.y}`).join(" ") +
                  ` L ${points[points.length - 1].x} ${baselineY} Z`
                : "";

        // X LABELS
        const xLabelCount = Math.min(7, validData.length);
        const xLabelIndexes = Array.from({ length: xLabelCount }, (_, index) =>
            Math.round((index / Math.max(xLabelCount - 1, 1)) * (validData.length - 1))
        );

        // UI
        return (
            <div style={{ width: "100%", overflow: "hidden" }}>
                <svg viewBox={`0 0 ${width} ${height}`} style={{ width: "100%", height: 230, display: "block" }}>
                    {/* GRID + Y LABELS */}
                    {[...yTicks].reverse().map((tick, index) => {
                        const y = topPadding + (index / tickCount) * plotHeight;
                        return (
                            <g key={index}>
                                <line x1={leftPadding} y1={y} x2={width - rightPadding} y2={y} stroke={P.border} strokeDasharray="4 4" />
                                <text x={leftPadding - 7} y={y + 3} textAnchor="end" fontSize="9" fill={P.textMuted}>{tick}</text>
                            </g>
                        );
                    })}

                    {/* AREA */}
                    <path d={areaPath} fill={P.textAmberBright} opacity="0.12" />

                    {/* LINE */}
                    <path d={path} fill="none" stroke={P.textAmberBright} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />

                    {/* DOTS */}
                    {points.map((point, index) => {
                        // roughly every hour
                        // if backend is around
                        // 5 minute samples,
                        // 12 samples ≈ 1 hour.
                        if (index % 12 !== 0 && index !== points.length - 1) return null;
                        return <circle key={index} cx={point.x} cy={point.y} r="2.7" fill={P.textAmberBright} />;
                    })}
                </svg>

                {/* X LABELS */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", fontSize: 9, color: P.textMuted, padding: "0 8px 0 42px", minHeight: 28 }}>
                    {xLabelIndexes.map((dataIndex, index) => (
                        <span key={index} style={{ whiteSpace: "nowrap", fontSize: 8 }}>
                            {validData[dataIndex]?.label ?? ""}
                        </span>
                    ))}
                </div>
            </div>
        );
    };

    // ENERGY BAR CHART — WEEK / MONTH / YEAR
    const EnergyBarChart = ({ data, color, mode }) => {
        const safeData = Array.isArray(data) ? data : [];

        if (safeData.length === 0) {
            return (
                <div style={{ height: 220, display: "flex", alignItems: "center", justifyContent: "center", color: P.textMuted, fontSize: 13 }}>
                    No energy data available
                </div>
            );
        }

        const values = safeData.map((item) => Number(item.value) || 0);
        const maxValue = Math.max(...values, 0);

        // NICE MAX
        const getNiceMax = (value) => {
            if (value <= 0) return 10;
            const magnitude = Math.pow(10, Math.floor(Math.log10(value)));
            const normalized = value / magnitude;
            let nice;
            if (normalized <= 1) nice = 1;
            else if (normalized <= 2) nice = 2;
            else if (normalized <= 5) nice = 5;
            else nice = 10;
            return nice * magnitude;
        };

        const yAxisMax = getNiceMax(maxValue);
        const tickCount = 5;
        const tickStep = yAxisMax / tickCount;
        const yAxisTicks = Array.from({ length: tickCount + 1 }, (_, index) => Number((tickStep * index).toFixed(1)));

        const chartHeight = 240;
        const plotHeight = 180;
        const isWeekly = mode === "week";
        const isMonthly = mode === "month";
        const isYearly = mode === "year";

        // LABEL VISIBILITY
        const shouldShowLabel = (index) => {
            if (isWeekly) return true;
            if (isMonthly) return index === 0 || index % 5 === 0 || index === safeData.length - 1;
            if (isYearly) return true;
            return true;
        };

        return (
            <div style={{ width: "100%", overflow: "hidden", paddingBottom: 8 }}>
                <div style={{ display: "flex", width: "100%", height: chartHeight }}>
                    {/* Y AXIS */}
                    <div style={{ width: 38, flexShrink: 0, height: plotHeight, display: "flex", flexDirection: "column", justifyContent: "space-between", alignItems: "flex-end", paddingRight: 6 }}>
                        {[...yAxisTicks].reverse().map((tick, index) => (
                            <span key={index} style={{ fontSize: 9, color: P.textMuted, lineHeight: 1 }}>{tick}</span>
                        ))}
                    </div>

                    {/* GRAPH AREA */}
                    <div style={{ flex: 1, minWidth: 0, position: "relative", height: chartHeight }}>
                        {/* GRID */}
                        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: plotHeight, pointerEvents: "none" }}>
                            {yAxisTicks.map((tick, index) => {
                                const position = (1 - tick / yAxisMax) * 100;
                                return <div key={index} style={{ position: "absolute", left: 0, right: 0, top: `${position}%`, borderTop: `1px dashed ${P.border}` }} />;
                            })}
                        </div>

                        {/* BARS */}
                        <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: plotHeight, display: "flex", alignItems: "flex-end", gap: isMonthly ? 2 : 5, padding: "0 2px" }}>
                            {safeData.map((item, index) => {
                                const value = Number(item.value) || 0;
                                const barHeight = maxValue > 0 ? (value / yAxisMax) * plotHeight : 2;
                                return (
                                    <div key={index} style={{ flex: 1, minWidth: 0, height: plotHeight, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "flex-end", position: "relative" }}>
                                        {/* VALUE */}
                                        {value > 0 && (
                                            <div style={{ position: "absolute", bottom: Math.min(barHeight + 4, plotHeight - 12), fontSize: 8, fontWeight: 600, color: P.textMuted, whiteSpace: "nowrap", zIndex: 2 }}>
                                                {value.toFixed(1)}
                                            </div>
                                        )}
                                        {/* BAR */}
                                        <div style={{ width: "100%", maxWidth: isMonthly ? 14 : 28, height: Math.max(barHeight, value > 0 ? 3 : 1), background: value > 0 ? color : `${color}33`, borderRadius: "4px 4px 0 0", transition: "height 0.4s ease", position: "absolute", bottom: 0 }} />
                                    </div>
                                );
                            })}
                        </div>

                        {/* X AXIS */}
                        <div style={{ position: "absolute", top: plotHeight + 8, left: 0, right: 0, display: "flex", alignItems: "center" }}>
                            {safeData.map((item, index) => (
                                <div key={index} style={{ flex: 1, minWidth: 0, textAlign: "center", fontSize: isMonthly ? 8 : 9, color: P.textMuted, whiteSpace: "nowrap", overflow: "hidden", visibility: shouldShowLabel(index) ? "visible" : "hidden" }}>
                                    {item.label}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        );
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
            {/* HEADER */}
            <div style={chartHeader}>
                <span style={chartTitle}>{chartTitles[chartMode]}</span>

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
                        style={{ width: 34, height: 34, border: `1px solid ${P.border}`, borderRadius: 8, background: refreshing ? P.bg : P.surface, color: P.textPrimary, display: "flex", alignItems: "center", justifyContent: "center", cursor: refreshing ? "default" : "pointer", padding: 0, opacity: refreshing ? 0.6 : 1, flexShrink: 0 }}
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

            {/* MODE SELECTOR */}
            <div style={{ display: "flex", background: P.bg, borderRadius: 10, padding: 4, marginBottom: 18 }}>
                {[["today", "Today"], ["week", "Week"], ["month", "Month"], ["year", "Year"]].map(([key, label]) => (
                    <button
                        key={key}
                        type="button"
                        onClick={() => setChartMode(key)}
                        style={{ flex: 1, border: "none", borderRadius: 8, padding: "8px 4px", cursor: "pointer", background: chartMode === key ? P.amber : "transparent", color: chartMode === key ? P.surface : P.textMuted, fontSize: 11, fontWeight: 700, fontFamily: "'Inter', sans-serif" }}
                    >
                        {label}
                    </button>
                ))}
            </div>

            {/* DATE NAVIGATION */}
            {renderNavigation()}

            {/* CHART */}
            {chartMode === "today" ? (
                <SolarPowerLineChart data={chartData} />
            ) : (
                <EnergyBarChart data={chartData} color={P.textAmberBright} mode={chartMode} />
            )}

            {/* DESCRIPTION */}
            <div style={{ textAlign: "center", marginTop: 8, fontSize: 10, color: P.textLight }}>
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
            <div style={{ flex: 1, minWidth: 0, fontSize: 12, fontWeight: 700, color: P.textPrimary, textAlign: "center", fontFamily: "'Inter', sans-serif", overflowWrap: "anywhere" }}>
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