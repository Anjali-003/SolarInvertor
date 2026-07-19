//THIS FILE IS OF NO UE 
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import { useInverter } from "../context/Context";
import Header from "./Header";
import Footer from "../components/Footer";
import { parseKeyword } from "../utils/parseKeyword";
import { PARAMETER_MAP } from "../constants/parameterMap";
import { DEVICE_TYPES } from "../constants/deviceTypes";


// ─── Palette ──────────────────────────────────────────────────────────────────
const P = {
    bg: "#FFFDF5",   // cream page background
    surface: P.surface,   // card white
    surfaceAlt: P.surfaceAmber,   // slightly warm white for header/bars
    border: "#F0E0C0",   // soft amber border
    borderStrong: "#E8C87A",   // stronger divider
    textPrimary: "#2C1A06",   // deep brown
    textSecond: "#7A5230",   // medium brown
    textMuted: "#B08050",   // muted amber-brown
    textDim: "#D4AA80",   // very light

    // accent shades from palette image
    cream: "#FFFDE7",
    lightAmber: "#FFE0A3",
    amber: "#FFB74D",
    deepAmber: "#F59E0B",
    orange: "#F97316",
};

// ─── Field map ────────────────────────────────────────────────────────────────
const FIELD_MAP = [
    // { label: "Sr. No", key: "ASN_31", unit: "", group: "meta", desc: "Device Serial Number" },
    // { label: "Inverter Status", key: "IS-1-0---IST", unit: "", group: "status", desc: "0 = Standby / 1 = Running" },
    { label: "DC Voltage", key: "IS-1-0---DCV1", unit: "Volt", desc: "DC Input Voltage (Ch 1)" },
    { label: "DC Current", key: "IS-1-0---DCI1", unit: "Amp", desc: "DC Input Current (Ch 1)" },
    { label: "DC Power", key: "IS-1-0---DCKW1", unit: "kW", desc: "DC Input Power (Ch 1)" },
    { label: "VAC", key: "IS-1-0---VN", unit: "Volt", desc: "AC Output Voltage" },
    { label: "IAC", key: "IS-1-0---I", unit: "Amp", desc: "AC Output Current" },
    // { label: "Inv. Temperature", key: "IS-1-0---TEMP", unit: "°C", group: "env", desc: "Inverter Temperature" },
    { label: "Frequency", key: "IS-1-0---FREQ", unit: "Hz", desc: "Grid Frequency" },
    { label: "Power Factor", key: "IS-1-0---PF", unit: "", desc: "Power Factor (0-1)" },
    { label: "Apparent Power", key: "IS-1-0---APOW", unit: "kW", desc: "Apparent Power" },
    { label: "Reactive Power", key: "IS-1-0---RPOW", unit: "kW", desc: "Reactive Power" },
];

const GROUP_ACCENT = {
    meta: P.amber,
    status: P.amber,
    dc: P.deepAmber,
    ac: P.orange,
    env: P.deepAmber,
};

// ─── Status Badge ─────────────────────────────────────────────────────────────
function StatusBadge({ value }) {
    // const on = value === 1;
    const getStatus = () => {
        switch (value) {
            case 1: return { label: "ON", color: P.deepAmber };
            case 0: return { label: "OFF", color: P.textMuted };
            case 2: return { label: "FAULT", color: P.red };
            case 3: return { label: "OTHER", color: P.textAdminGray };
            default: return { label: "--", color: P.textDim };
        }
    };

    const status = getStatus();

    return (

        <span style={{
            display: "inline-flex", alignItems: "center", gap: 7,
            padding: "5px 13px", borderRadius: 20,
            background: `${status.color}15`,
            border: `1.5px solid ${status.color}`,
            color: status.color,
            fontSize: 11, fontWeight: 700, letterSpacing: 1.5,
            fontFamily: "'Space Mono', monospace",
        }}>
            <span style={{
                width: 7, height: 7, borderRadius: "50%",
                background: status.color,
                boxShadow: `0 0 6px ${status.color}`,
            }} />
            {status.label}
        </span>
    );
}

// ─── Metric Card ──────────────────────────────────────────────────────────────
export function MetricCard({ field, value, index }) {
    const accent = GROUP_ACCENT[field.group] || P.deepAmber;
    const isStatus = field.key === "IS-1-0---IST";
    const displayVal = value === undefined || value === null ? "--" : value;

    return (
        <div
            style={{
                background: P.surface,
                border: `1px solid ${P.border}`,
                borderTop: `3px solid ${accent}`,
                borderRadius: 12,
                padding: "18px 20px",
                display: "flex", flexDirection: "column", gap: 9,
                boxShadow: "0 2px 12px rgba(180,120,40,0.07)",
                animation: "fadeUp 0.4s ease both",
                animationDelay: `${index * 40}ms`,
                position: "relative", overflow: "hidden",
                transition: "transform 0.2s ease, box-shadow 0.2s ease",
                cursor: "default",
            }}
            onMouseEnter={e => {
                e.currentTarget.style.transform = "translateY(-3px)";
                e.currentTarget.style.boxShadow = `0 8px 28px rgba(180,120,40,0.15)`;
            }}
            onMouseLeave={e => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 2px 12px rgba(180,120,40,0.07)";
            }}
        >
            {/* Soft corner wash */}
            <div style={{
                position: "absolute", top: 0, right: 0, width: 70, height: 70,
                background: `radial-gradient(circle at top right, ${accent}14, transparent 70%)`,
                pointerEvents: "none",
            }} />

            {/* Label */}
            <div style={{
                fontSize: 14, color: P.textMuted,
                fontFamily: "'Space Mono', monospace",
                letterSpacing: 1, textTransform: "uppercase",
            }}>
                {field.label}
            </div>

            {/* Value */}
            <div style={{ marginTop: 2 }}>
                {isStatus ? (
                    <StatusBadge value={displayVal} />
                ) : (
                    <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
                        <span style={{
                            fontSize: 28, fontWeight: 700,
                            fontFamily: "'Space Mono', monospace",
                            color: P.textPrimary, lineHeight: 1,
                        }}>
                            {typeof displayVal === "number" ? displayVal.toLocaleString() : displayVal}
                        </span>
                        {field.unit && (
                            <span style={{
                                fontSize: 20, fontWeight: 600,
                                color: accent,
                                fontFamily: "'Space Mono', monospace",
                            }}>
                                {field.unit}
                            </span>
                        )}
                    </div>
                )}
            </div>

            {/* Description */}
            <div style={{
                fontSize: 12, color: P.textDim,
                fontFamily: "'Space Mono', monospace", letterSpacing: 0.5,
            }}>
                {field.desc}
            </div>
        </div>
    );
}


// ─── Summary Bar ──────────────────────────────────────────────────────────────
function SummaryBar({ data }) {

    const pills = [
        {
            label: "Inverter Status",
            value: (() => {
                const v = data?.["IS-1-0---IST"];
                if (v === 1) return "ON";
                if (v === 0) return "OFF";
                if (v === 2) return "FAULT";
                if (v === 3) return "OTHER";
                return "--";
            })(),
            accent:
                data?.["IS-1-0---IST"] === 1 ? P.deepAmber :
                    data?.["IS-1-0---IST"] === 2 ? "#EF4444" :
                        P.textMuted
        },
        {
            label: "Temperature",
            value: data?.["IS-1-0---TEMP"] != null
                ? `${data["IS-1-0---TEMP"]} °C`
                : "--",
            accent: P.amber
        }
    ];

    return (
        <div style={{
            display: "flex", gap: 12, flexWrap: "wrap",
            padding: "14px 32px",
            background: "#FFF9EE",
            borderBottom: `1px solid ${P.border}`,
        }}>
            {pills.map(p => (
                <div key={p.label} style={{
                    display: "flex", alignItems: "center", gap: 10,
                    background: P.surface,
                    border: `1px solid ${P.border}`,
                    borderLeft: `3px solid ${p.accent}`,
                    borderRadius: 10, padding: "8px 16px",
                    flex: "1 1 140px", minWidth: 120,
                    boxShadow: "0 1px 6px rgba(180,120,40,0.06)",
                }}>
                    <div>
                        <div style={{ fontSize: 9, color: P.textDim, fontFamily: "'Space Mono', monospace", letterSpacing: 1 }}>
                            {p.label}
                        </div>
                        <div style={{ fontSize: 17, fontWeight: 700, fontFamily: "'Space Mono', monospace", color: p.accent }}>
                            {p.value}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function Dashboard() {
    const navigate = useNavigate();
    const { data, setData, lastUpdated } = useInverter();

    const [isLive, setIsLive] = useState(true);
    const [apiUrl, setApiUrl] = useState(
        // "http://localhost:3000/api/latest"
                "/api/latest"

    );
    const [showConfig, setShowConfig] = useState(false);
    const [refreshInterval, setRefreshInterval] = useState(15);
    const intervalRef = useRef(null);

    const fetchData = async () => {
        try {
            const res = await fetch(apiUrl);
            if (!res.ok) throw new Error();
            const json = await res.json();
            setData(json);
            setLastUpdated(json.TIMESTAMP || new Date().toLocaleString());
            setIsLive(true);
        } catch {
            setIsLive(false);
        }
    };
    const inputStyle = {
        width: "100%",
        background: P.bg,
        border: `1px solid ${P.border}`,
        borderRadius: 8,
        color: P.textPrimary,
        padding: "8px 12px",
        fontSize: 11,
        fontFamily: "'Space Mono', monospace",
        outline: "none",
    };

    const dynamicFields = Object.keys(data || {})
        .filter((key) => key.includes("---"))
        .map((key) => {

            const parsed = parseKeyword(key);

            const meta =
                PARAMETER_MAP[parsed.parameter];

            if (!meta) return null;

            return {

                key,

                value: data[key],

                ...meta,

                parsed,
            };
        })
        .filter(Boolean);

    return (
        <>
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0.3; }
        }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: ${P.bg}; }
        ::-webkit-scrollbar-thumb { background: ${P.border}; border-radius: 3px; }
      `}</style>

            <div style={{
                minHeight: "100vh",
                background: P.bg,
                color: P.textPrimary,
                fontFamily: "'Space Mono', monospace",
                display: "flex", flexDirection: "column",
            }}>
                <Header data={data} lastUpdated={lastUpdated} isLive={isLive} />
                <SummaryBar data={data} />

                <div style={{
                    flex: 1,
                    padding: "28px 32px",
                    display: "grid",
                    //   gridTemplateColumns: "repeat(auto-fit, minmax(360px, 1fr))",
                    gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 360px), 1fr))",
                    gap: 20,
                    width: "100%",
                }}>
                    {/* {FIELD_MAP.map((field, i) => (
                        <MetricCard key={field.key} field={field} value={data?.[field.key]} index={i} />
                    ))} */}
                    {Object.entries(data || {})
                        .filter(([key]) => key.includes("-"))
                        .map(([key, value], i) => {

                            const parsed = parseKeyword(key);

                            const paramInfo =
                                PARAMETER_MAP[parsed.parameter];

                            if (!paramInfo) return null;

                            return (
                                <MetricCard
                                    key={key}
                                    field={{
                                        label: paramInfo.label,
                                        unit: paramInfo.unit,
                                        desc: `
            ${DEVICE_TYPES[parsed.deviceType] || parsed.deviceType}
            | Device ${parsed.deviceId}
          `,
                                    }}
                                    value={value}
                                    index={i}
                                />
                            );
                        })}
                </div>


                <div style={{
                    display: "flex",
                    gap: 16,
                    padding: "18px 32px",
                    background: "#FFF9EE",
                    borderTop: `1px solid ${P.border}`,
                }}>
                    {/* POWER CARD */}
                    <div
                        onClick={() => navigate("/power")}
                        // onClick={() => navigate("/power", { state: { data } })}

                        style={{
                            flex: 1,
                            cursor: "pointer",
                            background: "#fff",
                            border: `1px solid ${P.border}`,
                            borderLeft: `4px solid ${P.deepAmber}`,
                            borderRadius: 12,
                            padding: "18px",
                            boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
                        }}
                    >
                        <div style={{ fontSize: 12, color: P.textMuted }}>POWER</div>
                        <div style={{ fontSize: 20, fontWeight: 700 }}>
                            View Power Generated Details →
                        </div>
                    </div>

                    {/* FAULT CARD */}
                    <div
                        onClick={() => navigate("/faults")}
                        // onClick={() => navigate("/faults", { state: { data } })}
                        style={{
                            flex: 1,
                            cursor: "pointer",
                            background: "#fff",
                            border: `1px solid ${P.border}`,
                            borderLeft: "4px solid #EF4444",
                            borderRadius: 12,
                            padding: "18px",
                            boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
                        }}
                    >
                        <div style={{ fontSize: 12, color: P.textMuted }}>FAULTS</div>
                        <div style={{ fontSize: 20, fontWeight: 700 }}>
                            View Fault Details →
                        </div>
                    </div>
                </div>
                <Footer data={data} />

            </div>
        </>
    );
}