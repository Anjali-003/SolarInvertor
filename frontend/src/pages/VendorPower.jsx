import { useParams } from "react-router-dom";
import VendorFooter from "../components/VendorFooter";
import DeviceInfo from "../components/DeviceInfo";
import useVendorDeviceData from "../hooks/useVendorDeviceData";
import { PARAMETER_MAP } from "../constants/parameterMap";
import { parseKeyword } from "../utils/parseKeyword";
import P from "../theme/colors";
import { useNavigate } from "react-router-dom";
import PageHeader from "../components/PageHeader";

export default function VendorPower() {

    const { id } = useParams();
    const { data, lastUpdated } = useVendorDeviceData(id);

    const getParameterValue = (parameter) => {
        const entry = Object.entries(data || {}).find(([key]) => {
            if (!key.includes("-")) return false;
            return parseKeyword(key).parameter === parameter;
        });
        return entry ? entry[1] : "--";
    };

    const powerDetails = [
        {
            key: "POW",
            label: PARAMETER_MAP.POW.label,
            description: PARAMETER_MAP.POW.desc,
            value: getParameterValue("POW"),
            unit: PARAMETER_MAP.POW.unit,
            icon: (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                </svg>
            ),
        },
        {
            key: "TKWH",
            label: PARAMETER_MAP.TKWH.label,
            description: PARAMETER_MAP.TKWH.desc,
            value: getParameterValue("TKWH"),
            unit: PARAMETER_MAP.TKWH.unit,
            icon: (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="5" />
                    <line x1="12" y1="1" x2="12" y2="3" />
                    <line x1="12" y1="21" x2="12" y2="23" />
                    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                    <line x1="1" y1="12" x2="3" y2="12" />
                    <line x1="21" y1="12" x2="23" y2="12" />
                    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
                </svg>
            ),
        },
        {
            key: "TON",
            label: PARAMETER_MAP.TON.label,
            description: PARAMETER_MAP.TON.desc,
            value: getParameterValue("TON"),
            unit: PARAMETER_MAP.TON.unit,
            icon: (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="9" />
                    <polyline points="12 6 12 12 16 14" />
                </svg>
            ),
        },
        {
            key: "LKWH",
            label: PARAMETER_MAP.LKWH.label,
            description: PARAMETER_MAP.LKWH.desc,
            value: getParameterValue("LKWH"),
            unit: PARAMETER_MAP.LKWH.unit,
            icon: (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M19 12h1m-18 0h1m4.217-8.883a5.9 5.9 0 0 1 5.566 0m-11.132 5.566a5.9 5.9 0 0 1 0 5.566m11.132 0a5.9 5.9 0 0 1-5.566 5.566m-5.566-11.132a5.9 5.9 0 0 1 0-5.566m5.566-5.566a5.9 5.9 0 0 1 5.566 0" />
                </svg>
            ),
        },
        {
            key: "LON",
            label: PARAMETER_MAP.LON.label,
            description: PARAMETER_MAP.LON.desc,
            value: getParameterValue("LON"),
            unit: PARAMETER_MAP.LON.unit,
            icon: (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="12 6 12 12 16 14" />
                </svg>
            ),
        },
    ];

    const navigate = useNavigate();

// ── Style objects ─────────────────────────────────────
    const statCard = {
        background: P.surface,
        borderRadius: 14,
        padding: "14px 10px",
        textAlign: "center",
        boxShadow: P.shadowCard,
        border: "1px solid ${P.border}",
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
        border: "1px solid ${P.border}",
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

    const BarChart = ({ value, maxValue, color }) => {
        const numBars = 10;
        const filledBars = Math.round((Math.min(value || 0, maxValue) / maxValue) * numBars);
        const heights = [40, 55, 35, 70, 85, 60, 90, 75, 65, 80];
        return (
            <div style={{ display: "flex", alignItems: "flex-end", gap: 6, height: 80, padding: "0 4px" }}>
                {heights.map((h, i) => (
                    <div key={i} style={{
                        flex: 1,
                        height: `${h}%`,
                        borderRadius: "4px 4px 0 0",
                        background: i < filledBars ? color : `${color}33`,
                        transition: "height 0.4s ease",
                    }} />
                ))}
            </div>
        );
    };

    const LineChart = ({ value, maxValue, color }) => {
        const points = [10, 15, 12, 18, 20, 16, 22, 25, 21, 28, 24, 30];
        const w = 280;
        const h = 70;
        const max = Math.max(...points);
        const coords = points.map((p, i) => ({
            x: (i / (points.length - 1)) * w,
            y: h - (p / max) * (h - 10),
        }));
        const pathD = coords.map((c, i) => `${i === 0 ? "M" : "L"} ${c.x} ${c.y}`).join(" ");
        const areaD = `${pathD} L ${w} ${h} L 0 ${h} Z`;
        return (
            <svg width="100%" viewBox={`0 0 ${w} ${h}`} style={{ overflow: "visible" }}>
                <defs>
                    <linearGradient id="lineGradV" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={color} stopOpacity="0.25" />
                        <stop offset="100%" stopColor={color} stopOpacity="0.02" />
                    </linearGradient>
                </defs>
                <path d={areaD} fill="url(#lineGradV)" />
                <path d={pathD} fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                <circle cx={coords[coords.length - 1].x} cy={coords[coords.length - 1].y} r="5" fill={color} />
            </svg>
        );
    };

    return (
        <div style={{ minHeight: "100vh", paddingBottom: "90px", background: P.bg, fontFamily: "'Inter', sans-serif" }}>

        <PageHeader
            title="POWER"
            backPath="/vendor"
        />

            {/* DEVICE STRIP */}
            <div style={{ margin: "20px 20px 16px", background: P.surface, borderRadius: 14, padding: "12px 16px", display: "flex", alignItems: "center", gap: 16, boxShadow: P.shadowCard }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6, background: P.surfaceGreen, border: `1px solid ${P.borderGreen}`, borderRadius: 20, padding: "4px 10px", flexShrink: 0 }}>
                    <div style={{ width: 8, height: 8, borderRadius: "50%", background: P.green, boxShadow: `0 0 6px ${P.green}` }} />
                    <span style={{ fontSize: 12, fontWeight: 700, color: P.textGreen, fontFamily: "'DM Sans', sans-serif" }}>ON</span>
                </div>
                <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 10, color: P.textLight, fontWeight: 500, letterSpacing: 0.8, marginBottom: 2 }}>SERIAL NUMBER</div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: P.textPrimary, fontFamily: "'DM Sans', sans-serif" }}>
                        {Object.keys(data || {}).find(k => k.startsWith("ASN_"))
                            ? data[Object.keys(data).find(k => k.startsWith("ASN_"))]
                            : "--"}
                    </div>
                </div>
                <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: 10, color: P.textLight, fontWeight: 500, letterSpacing: 0.8, marginBottom: 2 }}>LAST UPDATED</div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: P.textPrimary, fontFamily: "'DM Sans', sans-serif" }}>{lastUpdated || "--"}</div>
                </div>
            </div>

            <div style={{ padding: "0 20px 20px" }}>
                <h2 style={{
                    fontSize: 15,
                    fontWeight: 800,
                    color: P.textAmber,
                    marginBottom: 14,
                    marginTop: 4,
                    letterSpacing: 0.5,
                    fontFamily: "'DM Sans', sans-serif",
                }}>
                    POWER GENERATED DETAILS
                </h2>

{/* TOP 3 STAT CARDS */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: 10, marginBottom: 16 }}>

                    {/* Active Power */}
                    <div style={statCard}>
                        <div style={statIconWrap}>
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={P.borderStrong} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                            </svg>
                        </div>
                        <div style={statSubLabel}>ACTIVE POWER</div>
                        <div style={statValue}>{getParameterValue("POW")}</div>
                        <div style={statUnit}>W</div>
                    </div>

                    {/* Lifetime Energy */}
                    <div style={statCard}>
                        <div style={statIconWrap}>
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={P.borderStrong} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="12" cy="12" r="5" /><line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" /><line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" /><line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" /><line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
                            </svg>
                        </div>
                        <div style={statSubLabel}>LIFETIME ENERGY</div>
                        <div style={{ ...statValue, color: P.textAmberBright }}>{getParameterValue("LKWH")}</div>
                        <div style={statUnit}>kWh</div>
                    </div>

                    {/* Lifetime Running */}
                    <div style={statCard}>
                        <div style={statIconWrap}>
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={P.borderStrong} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
                            </svg>
                        </div>
                        <div style={statSubLabel}>LIFETIME RUNNING</div>
                        <div style={{ ...statValue, color: P.textAmberBright }}>{getParameterValue("LON")}</div>
                        <div style={statUnit}>hrs</div>
                    </div>
                </div>

                {/* TODAY ENERGY — BAR CHART */}
                <div style={chartCard}>
                    <div style={chartHeader}>
                        <span style={chartTitle}>Today Energy</span>
                        <span style={chartBadge}>{getParameterValue("TKWH")} kWh</span>
                    </div>
                    <BarChart value={getParameterValue("TKWH")} maxValue={50} color={P.textAmberBright} />
                </div>

                {/* TODAY ON TIME — LINE CHART */}
                <div style={chartCard}>
                    <div style={chartHeader}>
                        <span style={chartTitle}>Today On Time</span>
                        <span style={chartBadge}>{getParameterValue("TON")} hrs</span>
                    </div>
                    <LineChart value={getParameterValue("TON")} maxValue={24} color= {P.textAmber} />
                </div>

            </div>

            <VendorFooter />
        </div>
    );
}