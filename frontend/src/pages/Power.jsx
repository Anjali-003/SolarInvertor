import { useInverter } from "../context/Context";
import Footer from "../components/Footer";
import DeviceInfo from "../components/DeviceInfo";
import P from "../theme/colors";
import { PARAMETER_MAP } from "../constants/parameterMap";
import { parseKeyword } from "../utils/parseKeyword";
import PageHeader from "../components/PageHeader";
import { useState } from "react";
import PageBackground from "../components/PageBackground";

export default function Power() {

    const {
        data,
        lastUpdated,
        energy,
        devices,
        energyCharts,
        refreshEnergy,
        selectedDeviceId
    } = useInverter();

    const [chartMode, setChartMode] = useState("today");
    const [refreshing, setRefreshing] = useState(false);

    const handleRefreshEnergy = async () => {
        if (refreshing) return;

        try {
            setRefreshing(true);
            await refreshEnergy();
        } catch (err) {
            console.error("Energy refresh failed:", err);
        } finally {
            setRefreshing(false);
        }
    };

    const chartData = Array.isArray(energyCharts?.[chartMode])
        ? energyCharts[chartMode]
        : [];

    const formattedDateTime = (() => {
        if (!lastUpdated) return { date: "--", time: "--" };

        const d = new Date(lastUpdated);

        return {
            date: d.toLocaleDateString("en-GB", {
                day: "numeric",
                month: "short",
                year: "numeric",
            }),
            time: d.toLocaleTimeString("en-US", {
                hour: "numeric",
                minute: "2-digit",
                hour12: true,
            }),
        };
    })();

    // ── Style objects ─────────────────────────────────────

    const metricCard = {
        background: P.surfaceWarm,
        border: `1px solid ${P.borderAmber}`,
        borderRadius: 12,
        padding: "12px 14px",
    };

    const metricIconRow = {
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 6,
    };

    const metricIcon = {
        fontSize: 16,
        color: P.textAmberBright,
    };

    const metricValue = {
        fontSize: 20,
        fontWeight: 800,
        color: P.textPrimary,
        fontFamily: "'DM Sans', sans-serif",
    };

    const metricUnit = {
        fontSize: 14,
        fontWeight: 600,
        color: P.textMuted,
        fontFamily: "'Inter', sans-serif",
    };

    const metricLabel = {
        fontSize: 13,
        fontWeight: 600,
        color: P.textSecond,
        fontFamily: "'Inter', sans-serif",
        marginBottom: 2,
    };

    const metricDesc = {
        fontSize: 11,
        color: P.textLight,
        fontFamily: "'Inter', sans-serif",
    };

    const statCard = {
        background: P.surface,
        borderRadius: 14,
        padding: "14px 10px",
        textAlign: "center",
        boxShadow: P.shadowCard,
        border: `1px solid ${P.border}`,
    };

    const statIconWrap = {
        width: 36,
        height: 36,
        borderRadius: "50%",
        background: P.surfaceAmber,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        margin: "0 auto 8px",
    };

    const statSubLabel = {
        fontSize: 9,
        fontWeight: 700,
        color: P.textLight,
        letterSpacing: 0.5,
        fontFamily: "'Inter', sans-serif",
        marginBottom: 4,
        textTransform: "uppercase",
    };

    const statValue = {
        fontSize: 20,
        fontWeight: 800,
        color: P.textPrimary,
        fontFamily: "'DM Sans', sans-serif",
        lineHeight: 1.1,
    };

    const statUnit = {
        fontSize: 11,
        fontWeight: 500,
        color: P.textMuted,
        fontFamily: "'Inter', sans-serif",
        marginTop: 2,
    };

    const chartCard = {
        background: P.surface,
        borderRadius: 16,
        padding: "16px",
        marginBottom: 14,
        boxShadow: P.shadowCard,
        border: `1px solid ${P.border}`,
    };

    const chartHeader = {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 16,
    };

    const chartTitle = {
        fontSize: 14,
        fontWeight: 600,
        color: P.textPrimary,
        fontFamily: "'DM Sans', sans-serif",
    };

    const chartBadge = {
        background: P.amber,
        color: P.surface,
        fontSize: 12,
        fontWeight: 700,
        padding: "4px 12px",
        borderRadius: 20,
        fontFamily: "'Inter', sans-serif",
    };

    // ── Bar Chart Component ───────────────────────────────

    const EnergyChart = ({ data, color }) => {
        const safeData = Array.isArray(data) ? data : [];

        if (safeData.length === 0) {
            return (
                <div
                    style={{
                        height: 220,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: P.textMuted,
                        fontSize: 13,
                    }}
                >
                    No energy data available
                </div>
            );
        }

        const values = safeData.map(
            item => Number(item.value) || 0
        );

        const maxValue = Math.max(...values, 0);

        // =====================================================
        // CREATE CLEAN Y-AXIS MAX
        // Example:
        //
        // max = 37  -> 40
        // max = 82  -> 90
        // max = 143 -> 150
        // max = 7   -> 10
        // =====================================================

        const getNiceMax = (value) => {
            if (value <= 0) {
                return 10;
            }

            const magnitude = Math.pow(
                10,
                Math.floor(Math.log10(value))
            );

            const normalized = value / magnitude;

            let nice;

            if (normalized <= 1) {
                nice = 1;
            } else if (normalized <= 2) {
                nice = 2;
            } else if (normalized <= 5) {
                nice = 5;
            } else {
                nice = 10;
            }

            return nice * magnitude;
        };

        const yAxisMax = getNiceMax(maxValue);

        // =====================================================
        // Y AXIS TICKS
        //
        // Example:
        // 0
        // 10
        // 20
        // 30
        // 40
        // =====================================================

        const tickCount = 5;
        const tickStep = yAxisMax / tickCount;

        const yAxisTicks = Array.from(
            { length: tickCount + 1 },
            (_, index) => Math.round(tickStep * index)
        );

        // =====================================================
        // CHART HEIGHT
        // =====================================================

        const chartHeight = 240;
        const plotHeight = 180;

        // =====================================================
        // MONTHLY / YEARLY / TODAY
        // =====================================================

        const isMonthly =
            safeData.length >= 28 && safeData.length <= 31;

        const isYearly = safeData.length === 12;

        // =====================================================
        // LABEL VISIBILITY
        //
        // Don't show every hour label on mobile.
        // =====================================================

        const shouldShowLabel = (index) => {
            if (isMonthly) {
                // Show every 5th day + last day
                return (
                    index === 0 ||
                    index % 5 === 0 ||
                    index === safeData.length - 1
                );
            }

            if (isYearly) {
                return true;
            }

            // Today
            // Show every 3 hours
            return index % 3 === 0;
        };

        return (
            <div
                style={{
                    width: "100%",
                    overflow: "hidden",
                    paddingBottom: 8,
                }}
            >
                <div
                    style={{
                        display: "flex",
                        width: "100%",
                        height: chartHeight,
                    }}
                >
                    {/* Y AXIS */}
                    <div
                        style={{
                            width: 38,
                            flexShrink: 0,
                            height: plotHeight,
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "space-between",
                            alignItems: "flex-end",
                            paddingRight: 6,
                        }}
                    >
                        {[...yAxisTicks].reverse().map((tick, index) => (
                            <span
                                key={index}
                                style={{
                                    fontSize: 9,
                                    color: P.textMuted,
                                    lineHeight: 1,
                                }}
                            >
                                {tick}
                            </span>
                        ))}
                    </div>

                    {/* GRAPH AREA */}
                    <div
                        style={{
                            flex: 1,
                            minWidth: 0,
                            position: "relative",
                            height: chartHeight,
                        }}
                    >
                        {/* HORIZONTAL GRID LINES */}
                        <div
                            style={{
                                position: "absolute",
                                top: 0,
                                left: 0,
                                right: 0,
                                height: plotHeight,
                                pointerEvents: "none",
                            }}
                        >
                            {yAxisTicks.map((tick, index) => {
                                const position =
                                    (1 - tick / yAxisMax) * 100;

                                return (
                                    <div
                                        key={index}
                                        style={{
                                            position: "absolute",
                                            left: 0,
                                            right: 0,
                                            top: `${position}%`,
                                            borderTop: `1px dashed ${P.border}`,
                                        }}
                                    />
                                );
                            })}
                        </div>

                        {/* BARS */}
                        <div
                            style={{
                                position: "absolute",
                                left: 0,
                                right: 0,
                                top: 0,
                                height: plotHeight,
                                display: "flex",
                                alignItems: "flex-end",
                                gap: isMonthly ? 2 : 5,
                                padding: "0 2px",
                            }}
                        >
                            {safeData.map((item, index) => {
                                const value = Number(item.value) || 0;

                                const barHeight =
                                    maxValue > 0
                                        ? (value / yAxisMax) * plotHeight
                                        : 2;

                                return (
                                    <div
                                        key={index}
                                        style={{
                                            flex: 1,
                                            minWidth: 0,
                                            height: plotHeight,
                                            display: "flex",
                                            flexDirection: "column",
                                            alignItems: "center",
                                            justifyContent: "flex-end",
                                            position: "relative",
                                        }}
                                    >
                                        {/* VALUE — always show it, including largest bar */}
                                        {value > 0 && (
                                            <div
                                                style={{
                                                    position: "absolute",
                                                    bottom: Math.min(
                                                        barHeight + 4,
                                                        plotHeight - 12
                                                    ),
                                                    fontSize: 8,
                                                    fontWeight: 600,
                                                    color: P.textMuted,
                                                    whiteSpace: "nowrap",
                                                    zIndex: 2,
                                                }}
                                            >
                                                {value.toFixed(1)}
                                            </div>
                                        )}

                                        {/* BAR */}
                                        <div
                                            style={{
                                                width: "100%",
                                                maxWidth: isMonthly ? 14 : 28,
                                                height: Math.max(
                                                    barHeight,
                                                    value > 0 ? 3 : 1
                                                ),
                                                background:
                                                    value > 0
                                                        ? color
                                                        : `${color}33`,
                                                borderRadius: "4px 4px 0 0",
                                                transition: "height 0.4s ease",
                                                position: "absolute",
                                                bottom: 0,
                                            }}
                                        />
                                    </div>
                                );
                            })}
                        </div>

                        {/* X AXIS LABELS */}
                        <div
                            style={{
                                position: "absolute",
                                top: plotHeight + 8,
                                left: 0,
                                right: 0,
                                display: "flex",
                                alignItems: "center",
                            }}
                        >
                            {safeData.map((item, index) => (
                                <div
                                    key={index}
                                    style={{
                                        flex: 1,
                                        minWidth: 0,
                                        textAlign: "center",
                                        fontSize: isMonthly ? 8 : 9,
                                        color: P.textMuted,
                                        whiteSpace: "nowrap",
                                        overflow: "hidden",
                                        visibility: shouldShowLabel(index)
                                            ? "visible"
                                            : "hidden",
                                    }}
                                >
                                    {item.label}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    const getParameterValue = (parameter) => {
        return data?.[parameter] ?? "--";
    };

    return (
        <PageBackground>
            <div style={{ minHeight: "100vh", paddingBottom: "90px", fontFamily: "'Inter', sans-serif" }}>

                <PageHeader
                    title="POWER"
                    backPath="/"
                />

                <div
                    style={{
                        width: "100%",
                        maxWidth: 520,
                        margin: "0 auto",
                        boxSizing: "border-box",
                    }}
                >

                    <DeviceInfo
                        data={data}
                        lastUpdated={lastUpdated}
                        devices={devices}
                        selectedDeviceId={selectedDeviceId}
                    />

                    {/* PAGE CONTENT */}
                    <div style={{ padding: "0 20px 20px" }}>

                        <h2 style={{ fontSize: 15, fontWeight: 800, color: P.textWhite, marginBottom: 12, marginTop: 4, letterSpacing: 0.5, fontFamily: "'DM Sans', sans-serif" }}>
                            SOLAR PANEL DETAILS
                        </h2>

                        <div style={{ background: P.borderDark, border: `1.5px solid ${P.borderDark}`, borderRadius: 16, padding: "5px", marginBottom: 20, boxShadow: P.shadowCardRaised, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 5 }}>

                            <div style={metricCard}>
                                <div style={metricIconRow}>
                                    <svg
                                        width="18"
                                        height="18"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    >
                                        <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
                                    </svg>
                                    <span style={metricValue}>{getParameterValue("PV")} <span style={metricUnit}>V</span></span>
                                </div>
                                <div style={metricLabel}>PV Voltage</div>
                                <div style={metricDesc}>Input Voltage</div>
                            </div>

                            <div style={metricCard}>
                                <div style={metricIconRow}>
                                    <svg
                                        width="18"
                                        height="18"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    >
                                        <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
                                    </svg>
                                    <span style={metricValue}>{getParameterValue("PI")} <span style={metricUnit}>A</span></span>
                                </div>
                                <div style={metricLabel}>PV Current</div>
                                <div style={metricDesc}>Input current</div>
                            </div>

                            <div style={{ ...metricCard, gridColumn: "1 / -1", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                                <div>
                                    <div style={metricIconRow}>
                                        <svg
                                            width="18"
                                            height="18"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        >
                                            <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
                                        </svg>
                                    </div>
                                    <div style={metricLabel}>Solar Power</div>
                                    <div style={metricDesc}>Total output</div>
                                </div>
                                <div style={{ fontSize: 22, fontWeight: 800, color: P.textPrimary, fontFamily: "'DM Sans', sans-serif" }}>
                                    {getParameterValue("PPOW")} <span style={{ fontSize: 14, fontWeight: 600, color: P.textMuted }}>kW</span>
                                </div>
                            </div>

                        </div>

                        <h2
                            style={{
                                fontSize: 15,
                                fontWeight: 800,
                                color: P.textWhite,
                                marginBottom: 14,
                                marginTop: 4,
                                letterSpacing: 0.5,
                                fontFamily: "'DM Sans', sans-serif",
                            }}
                        >
                            GENERATION SUMMARY
                        </h2>

                        <div
                            style={{
                                display: "grid",
                                gridTemplateColumns: "1fr 1fr 1fr",
                                gap: 10,
                                marginBottom: 16,
                            }}
                        >
                            <div style={statCard}>
                                <div style={statIconWrap}>
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={P.borderStrong} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                                    </svg>
                                </div>
                                <div style={statSubLabel}>TODAY</div>
                                <div style={{ ...statValue, color: P.textAmberBright }}>{energy?.today ?? "--"}</div>
                                <div style={statUnit}>kWh</div>
                            </div>

                            <div style={statCard}>
                                <div style={statIconWrap}>
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={P.borderStrong} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                        <circle cx="12" cy="12" r="5" /><line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" /><line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" /><line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" /><line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
                                    </svg>
                                </div>
                                <div style={statSubLabel}>MONTH</div>
                                <div style={{ ...statValue, color: P.textAmberBright }}>{energy?.monthly ?? "--"}</div>
                                <div style={statUnit}>kWh</div>
                            </div>

                            <div style={statCard}>
                                <div style={statIconWrap}>
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={P.borderStrong} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                        <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
                                    </svg>
                                </div>
                                <div style={statSubLabel}>TOTAL</div>
                                <div style={{ ...statValue, color: P.textAmberBright }}>{getParameterValue("LKWH")}</div>
                                <div style={statUnit}>kWh</div>
                            </div>
                        </div>

                        <div style={chartCard}>

                            <div
                                style={{
                                    ...chartHeader,
                                    alignItems: "center"
                                }}
                            >

                                <span style={chartTitle}>
                                    {chartMode === "today"
                                        ? "Today Energy"
                                        : chartMode === "monthly"
                                            ? "Monthly Energy"
                                            : "Yearly Energy"}
                                </span>

                                <div
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 8
                                    }}
                                >

                                    <span style={chartBadge}>
                                        {Number(energy?.[chartMode] ?? 0).toFixed(2)} kWh
                                    </span>

                                    <button
                                        onClick={handleRefreshEnergy}
                                        disabled={refreshing}
                                        title="Refresh energy data"
                                        style={{
                                            width: 34,
                                            height: 34,
                                            border: `1px solid ${P.border}`,
                                            borderRadius: 8,
                                            background: refreshing ? P.bg : P.surface,
                                            color: P.textPrimary,
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            cursor: refreshing ? "default" : "pointer",
                                            padding: 0,
                                            opacity: refreshing ? 0.6 : 1,
                                            transition: "all 0.2s ease"
                                        }}
                                    >
                                        <svg
                                            width="16"
                                            height="16"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            style={{
                                                transform: refreshing ? "rotate(360deg)" : "none",
                                                transition: refreshing ? "transform 0.8s linear" : "none"
                                            }}
                                        >
                                            <path d="M20 11a8.1 8.1 0 0 0-15.5-2" />
                                            <polyline points="4 4 4 9 9 9" />
                                            <path d="M4 13a8.1 8.1 0 0 0 15.5 2" />
                                            <polyline points="20 20 20 15 15 15" />
                                        </svg>
                                    </button>

                                </div>

                            </div>

                            <div
                                style={{
                                    display: "flex",
                                    background: P.bg,
                                    borderRadius: 10,
                                    padding: 4,
                                    marginBottom: 20
                                }}
                            >
                                {[
                                    ["today", "Today"],
                                    ["monthly", "Monthly"],
                                    ["yearly", "Yearly"]
                                ].map(([key, label]) => (
                                    <button
                                        key={key}
                                        onClick={() => setChartMode(key)}
                                        style={{
                                            flex: 1,
                                            border: "none",
                                            borderRadius: 8,
                                            padding: "8px 6px",
                                            cursor: "pointer",
                                            background: chartMode === key ? P.amber : "transparent",
                                            color: chartMode === key ? P.surface : P.textMuted,
                                            fontSize: 12,
                                            fontWeight: 700,
                                            fontFamily: "'Inter', sans-serif"
                                        }}
                                    >
                                        {label}
                                    </button>
                                ))}
                            </div>

                            <EnergyChart
                                data={chartData}
                                color={P.textAmberBright}
                            />

                            <div
                                style={{
                                    textAlign: "center",
                                    marginTop: 8,
                                    fontSize: 10,
                                    color: P.textLight
                                }}
                            >
                                {chartMode === "today"
                                    ? "Energy generated per hour"
                                    : chartMode === "monthly"
                                        ? "Energy generated per day"
                                        : "Energy generated per month"}
                            </div>

                        </div>

                    </div>
                </div>

                <Footer data={data} />
            </div>
        </PageBackground>
    );
}