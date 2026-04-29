import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import { useInverter } from "../context/Context";
import Header from "./Header";
import Footer from "../components/Footer";


// ─── Palette ──────────────────────────────────────────────────────────────────
const P = {
    bg: "#FFFDF5",   // cream page background
    surface: "#FFFFFF",   // card white
    surfaceAlt: "#FFF8E7",   // slightly warm white for header/bars
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

// ─── Mock data ────────────────────────────────────────────────────────────────
// const MOCK_DATA = {
//     VD: 5, TIMESTAMP: "2026-03-09 14:39:47", MAXINDEX: 96, INDEX: 26,
//     LOAD: 0, STINTERVAL: 15, MSGID: "", DATE: 90326,
//     IMEI: "869863080708267", ASN_31: 31123450, POTP: "316360", COTP: "610912",
//     "IS-1-0---IST": 0, "IS-1-0---DCV1": 432.1, "IS-1-0---DCI1": 6.4,
//     "IS-1-0---DCKW1": 2270, "IS-1-0---VN": 234.5, "IS-1-0---I": 0.78,
//     "IS-1-0---POW": 1234, "IS-1-0---TKWH": 0, "IS-1-0---TON": 0,
//     "IS-1-0---LKWH": 0, "IS-1-0---LON": 0, "IS-1-0---TEMP": 34.51,
//     "IS-1-0---FREQ": 49.8, "IS-1-0---PF": 0, "IS-1-0---APOW": 0,
//     "IS-1-0---RPOW": 0, "IS-1-0---FT1": 0, "IS-1-0---FT2": 0,
//     "IS-1-0---FT3": 0, "IS-1-0---FT4": 0, "IS-1-0---FT5": 0,
// };

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
            case 2: return { label: "FAULT", color: "#EF4444" };
            case 3: return { label: "OTHER", color: "#6B7280" };
            default: return { label: "--", color: P.textDim };
        }
    };

    const status = getStatus();

    return (
        // <span style={{
        //     display: "inline-flex", alignItems: "center", gap: 7,
        //     padding: "5px 13px", borderRadius: 20,
        //     background: on ? "#FFF3D0" : "#F5F0EA",
        //     border: `1.5px solid ${on ? P.deepAmber : P.border}`,
        //     color: on ? P.deepAmber : P.textMuted,
        //     fontSize: 11, fontWeight: 700, letterSpacing: 1.5,
        //     fontFamily: "'Space Mono', monospace",
        // }}>
        //     <span style={{
        //         width: 7, height: 7, borderRadius: "50%",
        //         background: on ? P.deepAmber : P.textDim,
        //         boxShadow: on ? `0 0 6px ${P.deepAmber}` : "none",
        //         animation: on ? "blink 1.8s infinite" : "none",
        //         flexShrink: 0,
        //     }} />
        //     {on ? "RUNNING" : "STANDBY"}
        // </span>

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

            {/* Key chip */}
            {/* <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <span style={{
                    fontSize: 9, fontFamily: "'Space Mono', monospace",
                    color: accent, letterSpacing: 0.8,
                    background: `${accent}18`,
                    padding: "2px 8px", borderRadius: 5,
                    border: `1px solid ${accent}40`,
                }}>
                    {field.key.replace("IS-1-0---", "").replace("ASN_31", "SN")}
                </span>
            </div> */}

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

// ─── Header ───────────────────────────────────────────────────────────────────
// function Header({ data, lastUpdated, isLive }) {
//     return (
//         <div style={{
//             background: P.surfaceAlt,
//             borderBottom: `1px solid ${P.border}`,
//             padding: "18px 32px",
//             display: "flex", alignItems: "center",
//             justifyContent: "space-between", flexWrap: "wrap", gap: 12,
//         }}>
//             <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
//                 <div style={{
//                     width: 42, height: 42,
//                     background: `linear-gradient(135deg, ${P.deepAmber}, ${P.orange})`,
//                     borderRadius: 10,
//                     boxShadow: `0 4px 16px ${P.orange}44`,
//                     display: "flex", alignItems: "center", justifyContent: "center",
//                     flexShrink: 0,
//                 }}>
//                     <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
//                         stroke="#fff" strokeWidth="2.2" strokeLinecap="round">
//                         <circle cx="12" cy="12" r="4" />
//                         <line x1="12" y1="2" x2="12" y2="5" />
//                         <line x1="12" y1="19" x2="12" y2="22" />
//                         <line x1="2" y1="12" x2="5" y2="12" />
//                         <line x1="19" y1="12" x2="22" y2="12" />
//                         <line x1="4.22" y1="4.22" x2="6.34" y2="6.34" />
//                         <line x1="17.66" y1="17.66" x2="19.78" y2="19.78" />
//                         <line x1="19.78" y1="4.22" x2="17.66" y2="6.34" />
//                         <line x1="6.34" y1="17.66" x2="4.22" y2="19.78" />
//                     </svg>
//                 </div>
//                 <div>
//                     <div style={{
//                         fontSize: 18, fontWeight: 700,
//                         fontFamily: "'Space Mono', monospace",
//                         color: P.textPrimary, letterSpacing: -0.5,
//                     }}>
//                         Solar Inverter Monitor
//                     </div>
//                     {/* <div style={{
//                         fontSize: 10, color: P.textMuted,
//                         fontFamily: "'Space Mono', monospace", letterSpacing: 1,
//                     }}>
//                         IMEI: {data?.IMEI || "-"} · MQTT LIVE FEED
//                     </div> */}

//                     <div style={{
//                         fontSize: 10,
//                         color: P.textMuted,
//                         fontFamily: "'Space Mono', monospace",
//                         letterSpacing: 1,
//                     }}>
//                         Serial No: {data?.ASN_31 ?? "--"}
//                     </div>

//                 </div>
//             </div>

//             <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
//                 <div style={{ textAlign: "right" }}>
//                     <div style={{ fontSize: 10, color: P.textDim, fontFamily: "'Space Mono', monospace" }}>Last Update</div>
//                     <div style={{ fontSize: 12, color: P.textSecond, fontFamily: "'Space Mono', monospace" }}>
//                         {lastUpdated || "-"}
//                     </div>
//                 </div>

//                 <div style={{
//                     display: "flex", alignItems: "center", gap: 7,
//                     padding: "6px 14px", borderRadius: 20,
//                     background: isLive ? "#FFF3D0" : "#FEE2E2",
//                     border: `1.5px solid ${isLive ? P.deepAmber : "#FCA5A5"}`,
//                 }}>
//                     <div style={{
//                         width: 8, height: 8, borderRadius: "50%",
//                         background: isLive ? P.deepAmber : "#EF4444",
//                         boxShadow: isLive ? `0 0 7px ${P.deepAmber}` : "0 0 7px #EF4444",
//                         animation: "blink 1.5s infinite",
//                     }} />
//                     <span style={{
//                         fontSize: 10, fontWeight: 700,
//                         fontFamily: "'Space Mono', monospace",
//                         color: isLive ? P.deepAmber : "#DC2626",
//                         letterSpacing: 1.5,
//                     }}>
//                         {isLive ? "LIVE" : "OFFLINE"}
//                     </span>
//                 </div>
//             </div>
//         </div>
//     );
// }

// ─── Summary Bar ──────────────────────────────────────────────────────────────
function SummaryBar({ data }) {
    //const pills = [
    // { label: "DC Power", value: `${(data?.["IS-1-0---DCKW1"] ?? 0).toLocaleString()} W`, accent: P.deepAmber },
    //{ label: "DC Power", value: data?.["IS-1-0---DCKW1"] != null ? `${data["IS-1-0---DCKW1"]} W` : "--", accent: P.deepAmber },
    // { label: "AC Voltage", value: `${data?.["IS-1-0---VN"] ?? 0} V`, accent: P.orange },
    //{ label: "AC Voltage", value: data?.["IS-1-0---VN"] != null ? `${data["IS-1-0---VN"]} V` : "--", accent: P.orange },
    // { label: "Temperature", value: `${data?.["IS-1-0---TEMP"] ?? 0} °C`, accent: P.amber },
    //{ label: "Temperature", value: data?.["IS-1-0---TEMP"] != null ? `${data["IS-1-0---TEMP"]} °C` : "--", accent: P.amber },
    // { label: "Grid Freq", value: `${data?.["IS-1-0---FREQ"] ?? 0} Hz`, accent: "#C9860A" },
    //{ label: "Grid Freq", value: data?.["IS-1-0---FREQ"] != null ? `${data["IS-1-0---FREQ"]} Hz` : "--", accent: "#C9860A" },
    //];

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
                    background: "#FFFFFF",
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
    // const [data, setData] = useState(MOCK_DATA);
    const navigate = useNavigate();
    // const [data, setData] = useState(null);
    const { data, setData, lastUpdated } = useInverter();
    // const [lastUpdated, setLastUpdated] = useState(null);
    
    // const [lastUpdated, setLastUpdated] = useState(MOCK_DATA.TIMESTAMP);
    const [isLive, setIsLive] = useState(true);
    const [apiUrl, setApiUrl] = useState("http://localhost:3000/api/latest");
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
    // code for the api polling method, currently disabled in favor of socket.io real-time updates
    // useEffect(() => {
    //     fetchData();

    //     intervalRef.current = setInterval(() => {
    //         fetchData();
    //     }, refreshInterval * 1000);

    //     return () => clearInterval(intervalRef.current);
    // }, [apiUrl, refreshInterval]);


    // ─── Socket.IO Real-Time Updates ─────────────────────────────────────────────

    // useEffect(() => {
    //     const socket = io("http://localhost:3000");

    //     socket.on("connect", () => {
    //         console.log("Connected to server");
    //     });

    //     socket.on("inverterData", (newData) => {
    //         console.log("Live Data:", newData);

    //         setData(newData);
    //         setLastUpdated(new Date().toLocaleTimeString());
    //         setIsLive(true);
    //     });

    //     socket.on("disconnect", () => {
    //         setIsLive(false);
    //     });

    //     return () => socket.disconnect();
    // }, []);




    //   useEffect(() => {
    // Uncomment to enable real polling:
    // fetchData();
    // intervalRef.current = setInterval(fetchData, refreshInterval * 1000);
    // return () => clearInterval(intervalRef.current);

    //     const timer = setInterval(() => {
    //       setData(prev => ({
    //         ...prev,
    //         "IS-1-0---TEMP": parseFloat((prev["IS-1-0---TEMP"] + (Math.random() - 0.5) * 0.2).toFixed(2)),
    //         "IS-1-0---FREQ": parseFloat((49.8 + (Math.random() - 0.5) * 0.1).toFixed(2)),
    //         "IS-1-0---VN":   parseFloat((234.5 + (Math.random() - 0.5) * 1).toFixed(1)),
    //         "IS-1-0---I":    parseFloat((0.78 + (Math.random() - 0.5) * 0.05).toFixed(3)),
    //       }));
    //       setLastUpdated(new Date().toLocaleTimeString());
    //     }, 3000);
    //     return () => clearInterval(timer);
    //   }, []);



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
                

                {/* Config bar */}
                {/* <div style={{
                    padding: "10px 32px",
                    background: "#FFFBF0",
                    borderBottom: `1px solid ${P.border}`,
                    display: "flex", alignItems: "center",
                    justifyContent: "space-between", gap: 12, flexWrap: "wrap",
                }}>
                    <div style={{ fontSize: 10, color: P.textDim, letterSpacing: 1 }}>
                        POLLING EVERY {refreshInterval}s · INDEX {data?.INDEX ?? "-"} / {data?.MAXINDEX ?? "-"}
                    </div>
                    <button
                        onClick={() => setShowConfig(v => !v)}
                        style={{
                            background: "transparent",
                            border: `1px solid ${P.border}`,
                            borderRadius: 8,
                            color: P.textMuted,
                            padding: "4px 14px",
                            fontSize: 10, cursor: "pointer",
                            letterSpacing: 1,
                            fontFamily: "'Space Mono', monospace",
                        }}
                    >
                        {showConfig ? "HIDE CONFIG" : "API CONFIG"}
                    </button>
                </div> */}

                {/* {showConfig && (
                    <div style={{
                        padding: "16px 32px",
                        background: "#FFFDF5",
                        borderBottom: `1px solid ${P.border}`,
                        display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center",
                    }}>
                        <div style={{ flex: 1, minWidth: 260 }}>
                            <div style={{ fontSize: 9, color: P.textMuted, letterSpacing: 1, marginBottom: 5 }}>BACKEND API URL</div>
                            <input value={apiUrl} onChange={e => setApiUrl(e.target.value)}
                                placeholder="http://your-backend/api/latest" style={inputStyle} />
                        </div>
                        <div style={{ minWidth: 120 }}>
                            <div style={{ fontSize: 9, color: P.textMuted, letterSpacing: 1, marginBottom: 5 }}>REFRESH (SEC)</div>
                            <input type="number" value={refreshInterval} min={5} max={300}
                                onChange={e => setRefreshInterval(Number(e.target.value))} style={inputStyle} />
                        </div>
                        <button onClick={fetchData} style={{
                            background: `${P.deepAmber}18`,
                            border: `1px solid ${P.deepAmber}66`,
                            borderRadius: 8, color: P.deepAmber,
                            padding: "8px 18px", fontSize: 11,
                            cursor: "pointer", letterSpacing: 1,
                            fontFamily: "'Space Mono', monospace",
                            alignSelf: "flex-end",
                        }}>
                            FETCH NOW
                        </button>
                    </div>
                )} */}

                {/* Card Grid */}
                {/* <div style={{
                    flex: 1, padding: "28px 32px",
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
                    gap: 16, alignContent: "start",
                }}> */}
                <div style={{
                    flex: 1,
                    padding: "28px 32px",
                    display: "grid",
                    //   gridTemplateColumns: "repeat(auto-fit, minmax(360px, 1fr))",
                    gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 360px), 1fr))",
                    gap: 20,
                    width: "100%",
                }}>
                    {FIELD_MAP.map((field, i) => (
                        <MetricCard key={field.key} field={field} value={data?.[field.key]} index={i} />
                    ))}
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

                {/* Footer */}
                {/* <div style={{
                    padding: "14px 32px",
                    borderTop: `1px solid ${P.border}`,
                    display: "flex", justifyContent: "space-between",
                    alignItems: "center", flexWrap: "wrap", gap: 8,
                    background: P.surfaceAlt,
                }}>
                    <span style={{ fontSize: 9, color: P.textDim, letterSpacing: 1 }}>
                        SOLAR INVERTER DASHBOARD · MQTT → MYSQL → REST
                    </span>
                    <span style={{ fontSize: 9, color: P.textDim, letterSpacing: 1 }}>
                        POTP: {data?.POTP} · STINTERVAL: {data?.STINTERVAL}s
                    </span>
                </div> */}
                <Footer data={data} />

            </div>
        </>
    );
}