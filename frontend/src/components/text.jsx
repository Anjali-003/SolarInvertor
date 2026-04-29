// import { useState, useEffect } from “react”;

// // Simulated DB fetch — replace this with your real API call
// const fetchFromDatabase = async () => {
//     await new Promise((r) => setTimeout(r, 800));
//     return {
//         voltage: (218 + Math.random() * 8).toFixed(1),
//         current: (4.2 + Math.random() * 1.5).toFixed(2),
//         watt: (900 + Math.random() * 300).toFixed(1),
//         todayEnergy: (3.4 + Math.random() * 0.8).toFixed(3),
//         totalEnergy: (1284.6 + Math.random() * 2).toFixed(2),
//     };
// };

// const metrics = [
//     {
//         key: “voltage”,
//     label: “Voltage”,
//     unit: “V”,
//     icon: “⚡”,
//     color: “#f59e0b”,
//     glow: “rgba(245, 158, 11, 0.4)”,
//     min: 200,
//     max: 240,
// },
// {
//     key: “current”,
//     label: “Current”,
//     unit: “A”,
//     icon: “〰”,
//     color: “#38bdf8”,
//     glow: “rgba(56, 189, 248, 0.4)”,
//     min: 0,
//         max: 10,
// },
// {
//     key: “watt”,
//     label: “Power”,
//     unit: “W”,
//     icon: “◈”,
//     color: “#a78bfa”,
//     glow: “rgba(167, 139, 250, 0.4)”,
//     min: 0,
//         max: 2000,
// },
// {
//     key: “todayEnergy”,
//     label: “Today’s Energy”,
//     unit: “kWh”,
//     icon: “◎”,
//     color: “#34d399”,
//     glow: “rgba(52, 211, 153, 0.4)”,
//     min: 0,
//         max: 10,
// },
// {
//     key: “totalEnergy”,
//     label: “Total Energy”,
//     unit: “kWh”,
//     icon: “▣”,
//     color: “#fb7185”,
//     glow: “rgba(251, 113, 133, 0.4)”,
//     min: 0,
//         max: 2000,
// },
// ];

// function AnimatedNumber({ value }) {
//     const [displayed, setDisplayed] = useState(value);
//     useEffect(() => {
//         setDisplayed(value);
//     }, [value]);
//     return <span style={{ fontVariantNumeric: “tabular- nums” }}> { displayed ?? “—”}</span >;
// }

// function RadialBar({ value, min, max, color, glow }) {
//     const pct = Math.min(1, Math.max(0, (value - min) / (max - min)));
//     const r = 28;
//     const circ = 2 * Math.PI * r;
//     const dash = pct * circ * 0.75;
//     const offset = circ * 0.125;

//     return (
//         <svg width=“72” height =“72” style = {{ transform: “rotate(-135deg)” }
// }>
// <circle cx="36" cy="36" r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="6" />
// <circle
// cx=“36”
// cy =“36”
// r = { r }
// fill =“none”
// stroke = { color }
// strokeWidth =“6”
// strokeLinecap =“round”
// strokeDasharray = {`${dash} ${circ - dash}`}
// strokeDashoffset = {- offset}
// style = {{
//     filter: `drop-shadow(0 0 6px ${glow})`,
//         transition: “stroke - dasharray 0.6s cubic - bezier(0.4, 0, 0.2, 1)”,
// }}
// />
// </svg >
// );
// }

// function Card({ metric, value, loading, index }) {
//     const num = parseFloat(value);

//     return (
//         <div
//             style={{
//                 background: “linear- gradient(135deg, rgba(255, 255, 255, 0.04) 0 %, rgba(255, 255, 255, 0.01) 100 %)”,
//             border: `1px solid rgba(255,255,255,0.08)`,
//         borderRadius: “20px”,
//     padding: “28px 24px 24px”,
//     display: “flex”,
//     flexDirection: “column”,
//     gap: “16px”,
//     position: “relative”,
//     overflow: “hidden”,
//     backdropFilter: “blur(10px)”,
//     animation: `fadeUp 0.5s ease both`,
//         animationDelay: `${index * 0.08}s`,
//             transition: “border - color 0.3s, transform 0.3s”,
//     cursor: “default”,
// }}
// onMouseEnter = {(e) => {
//     e.currentTarget.style.borderColor = metric.color + “55”;
//     e.currentTarget.style.transform = “translateY(-4px)”;
// }}
// onMouseLeave = {(e) => {
//     e.currentTarget.style.borderColor = “rgba(255, 255, 255, 0.08)”;
//     e.currentTarget.style.transform = “translateY(0)”;
// }}
// >
//     {/* Subtle corner glow */ }
//     < div
// style = {{
//     position: “absolute”,
//     top: -40,
//         right: -40,
//             width: 120,
//                 height: 120,
//                     borderRadius: “50 %”,
//     background: metric.color,
//         opacity: 0.06,
//             pointerEvents: “none”,
// }}
// />

//     ```
//   {/* Header */}
//   <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
//     <div>
//       <p
//         style={{
//           margin: 0,
//           fontSize: "11px",
//           fontFamily: "'Space Mono', monospace",
//           letterSpacing: "0.12em",
//           textTransform: "uppercase",
//           color: "rgba(255,255,255,0.4)",
//         }}
//       >
//         {metric.label}
//       </p>
//     </div>
//     <div
//       style={{
//         width: 36,
//         height: 36,
//         borderRadius: "10px",
//         background: metric.color + "18",
//         border: `1px solid ${ metric.color } 30`,
//         display: "flex",
//         alignItems: "center",
//         justifyContent: "center",
//         fontSize: "18px",
//       }}
//     >
//       {metric.icon}
//     </div>
//   </div>

//   {/* Value + Radial */}
//   <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
//     <div>
//       {loading ? (
//         <div
//           style={{
//             width: 80,
//             height: 36,
//             borderRadius: 8,
//             background: "rgba(255,255,255,0.06)",
//             animation: "pulse 1.2s ease infinite",
//           }}
//         />
//       ) : (
//         <>
//           <p
//             style={{
//               margin: 0,
//               fontSize: "36px",
//               fontFamily: "'Space Mono', monospace",
//               fontWeight: 700,
//               color: "#fff",
//               lineHeight: 1,
//               letterSpacing: "-0.02em",
//             }}
//           >
//             <AnimatedNumber value={value} />
//           </p>
//           <p
//             style={{
//               margin: "4px 0 0",
//               fontSize: "13px",
//               color: metric.color,
//               fontFamily: "'Space Mono', monospace",
//             }}
//           >
//             {metric.unit}
//           </p>
//         </>
//       )}
//     </div>
//     {!loading && (
//       <RadialBar
//         value={num}
//         min={metric.min}
//         max={metric.max}
//         color={metric.color}
//         glow={metric.glow}
//       />
//     )}
//   </div>

//   {/* Mini progress bar */}
//   <div style={{ height: 3, background: "rgba(255,255,255,0.06)", borderRadius: 2, overflow: "hidden" }}>
//     <div
//       style={{
//         height: "100%",
//         width: loading ? "0%" : `${ Math.min(100, ((parseFloat(value) - metric.min) / (metric.max - metric.min)) * 100) }% `,
//         background: `linear - gradient(90deg, ${ metric.color }88, ${ metric.color })`,
//         borderRadius: 2,
//         transition: "width 0.8s cubic-bezier(0.4,0,0.2,1)",
//         boxShadow: `0 0 8px ${ metric.glow } `,
//       }}
//     />
//   </div>
// </div>
// ```

// );
// }

// export default function EnergyDashboard() {
//     const [data, setData] = useState(null);
//     const [loading, setLoading] = useState(true);
//     const [lastUpdated, setLastUpdated] = useState(null);
//     const [refreshing, setRefreshing] = useState(false);

//     const load = async (isRefresh = false) => {
//         if (isRefresh) setRefreshing(true);
//         else setLoading(true);
//         const result = await fetchFromDatabase();
//         setData(result);
//         setLastUpdated(new Date());
//         setLoading(false);
//         setRefreshing(false);
//     };

//     useEffect(() => {
//         load();
//         const interval = setInterval(() => load(true), 5000);
//         return () => clearInterval(interval);
//     }, []);

//     return (
//         <>
//             <style>{`@import url('https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&family=Syne:wght@400;600;800&display=swap'); * { box-sizing: border-box; margin: 0; padding: 0; } body { background: #080c14; } @keyframes fadeUp { from { opacity: 0; transform: translateY(20px); } to   { opacity: 1; transform: translateY(0); } } @keyframes pulse { 0%, 100% { opacity: 0.4; } 50% { opacity: 0.8; } } @keyframes spin { from { transform: rotate(0deg); } to   { transform: rotate(360deg); } } @keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0.3; } }`}</style>

//             ```
//             <div
//                 style={{
//                     minHeight: "100vh",
//                     background: "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(56,189,248,0.07) 0%, #080c14 60%)",
//                     fontFamily: "'Syne', sans-serif",
//                     padding: "48px 24px",
//                     display: "flex",
//                     flexDirection: "column",
//                     alignItems: "center",
//                 }}
//             >
//                 {/* Header */}
//                 <div style={{ width: "100%", maxWidth: 900, marginBottom: 48 }}>
//                     <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 16 }}>
//                         <div>
//                             <p
//                                 style={{
//                                     fontFamily: "'Space Mono', monospace",
//                                     fontSize: "11px",
//                                     letterSpacing: "0.2em",
//                                     textTransform: "uppercase",
//                                     color: "#38bdf8",
//                                     marginBottom: 6,
//                                 }}
//                             >
//                                 ◉ Live Monitoring
//                             </p>
//                             <h1
//                                 style={{
//                                     fontSize: "clamp(28px, 5vw, 44px)",
//                                     fontWeight: 800,
//                                     color: "#fff",
//                                     letterSpacing: "-0.03em",
//                                     lineHeight: 1.1,
//                                 }}
//                             >
//                                 Energy Dashboard
//                             </h1>
//                             <p style={{ color: "rgba(255,255,255,0.35)", marginTop: 6, fontSize: 14 }}>
//                                 Real-time electrical parameters from your system
//                             </p>
//                         </div>

//                         <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
//                             {lastUpdated && (
//                                 <p
//                                     style={{
//                                         fontFamily: "'Space Mono', monospace",
//                                         fontSize: "11px",
//                                         color: "rgba(255,255,255,0.3)",
//                                         letterSpacing: "0.05em",
//                                     }}
//                                 >
//                                     Updated {lastUpdated.toLocaleTimeString()}
//                                 </p>
//                             )}
//                             <div
//                                 style={{
//                                     width: 8,
//                                     height: 8,
//                                     borderRadius: "50%",
//                                     background: "#34d399",
//                                     boxShadow: "0 0 8px #34d399",
//                                     animation: "blink 2s ease infinite",
//                                 }}
//                             />
//                             {refreshing && (
//                                 <div
//                                     style={{
//                                         width: 16,
//                                         height: 16,
//                                         border: "2px solid rgba(255,255,255,0.1)",
//                                         borderTopColor: "#38bdf8",
//                                         borderRadius: "50%",
//                                         animation: "spin 0.7s linear infinite",
//                                     }}
//                                 />
//                             )}
//                         </div>
//                     </div>

//                     {/* Divider */}
//                     <div
//                         style={{
//                             marginTop: 28,
//                             height: 1,
//                             background: "linear-gradient(90deg, rgba(56,189,248,0.4), rgba(255,255,255,0.05) 60%, transparent)",
//                         }}
//                     />
//                 </div>

//                 {/* Cards Grid */}
//                 <div
//                     style={{
//                         width: "100%",
//                         maxWidth: 900,
//                         display: "grid",
//                         gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
//                         gap: "16px",
//                     }}
//                 >
//                     {metrics.map((m, i) => (
//                         <Card
//                             key={m.key}
//                             metric={m}
//                             value={data?.[m.key]}
//                             loading={loading}
//                             index={i}
//                         />
//                     ))}
//                 </div>

//                 {/* Footer */}
//                 <p
//                     style={{
//                         marginTop: 48,
//                         fontFamily: "'Space Mono', monospace",
//                         fontSize: "11px",
//                         color: "rgba(255,255,255,0.15)",
//                         letterSpacing: "0.1em",
//                     }}
//                 >
//                     AUTO-REFRESH EVERY 5 SECONDS · REPLACE fetchFromDatabase() WITH YOUR API
//                 </p>
//             </div>
//         </>
// ```

// );
// }