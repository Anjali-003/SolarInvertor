// import { useParams } from "react-router-dom";
// import VendorFooter from "../components/VendorFooter";
// import DeviceInfo from "../components/DeviceInfo";
// import useVendorDeviceData from "../hooks/useVendorDeviceData";
// import { PARAMETER_MAP } from "../constants/parameterMap";
// import { parseKeyword } from "../utils/parseKeyword";
// import P from "../theme/colors";
// import { useNavigate } from "react-router-dom";
// import PageHeader from "../components/PageHeader";

// export default function VendorPower() {

//     const { id } = useParams();
//     const { data, lastUpdated } = useVendorDeviceData(id);

//     const formattedDateTime = (() => {
//     if (!lastUpdated) return { date: "--", time: "--" };

//     const d = new Date(lastUpdated.replace(" ", "T"));

//     return {
//         date: d.toLocaleDateString("en-GB", {
//             day: "numeric",
//             month: "short",
//             year: "numeric",
//         }),
//         time: d.toLocaleTimeString("en-US", {
//             hour: "numeric",
//             minute: "2-digit",
//             hour12: true,
//         }),
//     };
// })();

//     const getParameterValue = (parameter) => {
//         const entry = Object.entries(data || {}).find(([key]) => {
//             if (!key.includes("-")) return false;
//             return parseKeyword(key).parameter === parameter;
//         });
//         return entry ? entry[1] : "--";
//     };

//     const powerDetails = [
//         {
//             key: "POW",
//             label: PARAMETER_MAP.POW.label,
//             description: PARAMETER_MAP.POW.desc,
//             value: getParameterValue("POW"),
//             unit: PARAMETER_MAP.POW.unit,
//             icon: (
//                 <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//                     <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
//                 </svg>
//             ),
//         },
//         {
//             key: "TKWH",
//             label: PARAMETER_MAP.TKWH.label,
//             description: PARAMETER_MAP.TKWH.desc,
//             value: getParameterValue("TKWH"),
//             unit: PARAMETER_MAP.TKWH.unit,
//             icon: (
//                 <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//                     <circle cx="12" cy="12" r="5" />
//                     <line x1="12" y1="1" x2="12" y2="3" />
//                     <line x1="12" y1="21" x2="12" y2="23" />
//                     <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
//                     <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
//                     <line x1="1" y1="12" x2="3" y2="12" />
//                     <line x1="21" y1="12" x2="23" y2="12" />
//                     <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
//                     <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
//                 </svg>
//             ),
//         },
//         {
//             key: "TON",
//             label: PARAMETER_MAP.TON.label,
//             description: PARAMETER_MAP.TON.desc,
//             value: getParameterValue("TON"),
//             unit: PARAMETER_MAP.TON.unit,
//             icon: (
//                 <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//                     <circle cx="12" cy="12" r="9" />
//                     <polyline points="12 6 12 12 16 14" />
//                 </svg>
//             ),
//         },
//         {
//             key: "LKWH",
//             label: PARAMETER_MAP.LKWH.label,
//             description: PARAMETER_MAP.LKWH.desc,
//             value: getParameterValue("LKWH"),
//             unit: PARAMETER_MAP.LKWH.unit,
//             icon: (
//                 <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//                     <path d="M19 12h1m-18 0h1m4.217-8.883a5.9 5.9 0 0 1 5.566 0m-11.132 5.566a5.9 5.9 0 0 1 0 5.566m11.132 0a5.9 5.9 0 0 1-5.566 5.566m-5.566-11.132a5.9 5.9 0 0 1 0-5.566m5.566-5.566a5.9 5.9 0 0 1 5.566 0" />
//                 </svg>
//             ),
//         },
//         {
//             key: "LON",
//             label: PARAMETER_MAP.LON.label,
//             description: PARAMETER_MAP.LON.desc,
//             value: getParameterValue("LON"),
//             unit: PARAMETER_MAP.LON.unit,
//             icon: (
//                 <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//                     <circle cx="12" cy="12" r="10" />
//                     <polyline points="12 6 12 12 16 14" />
//                 </svg>
//             ),
//         },
//     ];

//     const navigate = useNavigate();

// // ── Style objects ─────────────────────────────────────
//     const statCard = {
//         background: P.surface,
//         borderRadius: 14,
//         padding: "14px 10px",
//         textAlign: "center",
//         boxShadow: P.shadowCard,
//         border: "1px solid ${P.border}",
//     };

//     const statIconWrap = {
//         width: 36,
//         height: 36,
//         borderRadius: "50%",
//         background: P.surfaceAmber,
//         display: "flex",
//         alignItems: "center",
//         justifyContent: "center",
//         margin: "0 auto 8px",
//     };

//     const statSubLabel = {
//         fontSize: 9,
//         fontWeight: 700,
//         color: P.textLight,
//         letterSpacing: 0.5,
//         fontFamily: "'Inter', sans-serif",
//         marginBottom: 4,
//         textTransform: "uppercase",
//     };

//     const statValue = {
//         fontSize: 20,
//         fontWeight: 800,
//         color: P.textPrimary,
//         fontFamily: "'DM Sans', sans-serif",
//         lineHeight: 1.1,
//     };

//     const statUnit = {
//         fontSize: 11,
//         fontWeight: 500,
//         color: P.textMuted,
//         fontFamily: "'Inter', sans-serif",
//         marginTop: 2,
//     };

//     const chartCard = {
//         background: P.surface,
//         borderRadius: 16,
//         padding: "16px",
//         marginBottom: 14,
//         boxShadow: P.shadowCard,
//         border: "1px solid ${P.border}",
//     };

//     const chartHeader = {
//         display: "flex",
//         justifyContent: "space-between",
//         alignItems: "center",
//         marginBottom: 16,
//     };

//     const chartTitle = {
//         fontSize: 14,
//         fontWeight: 600,
//         color: P.textPrimary,
//         fontFamily: "'DM Sans', sans-serif",
//     };

//     const chartBadge = {
//         background: P.amber,
//         color: P.surface,
//         fontSize: 12,
//         fontWeight: 700,
//         padding: "4px 12px",
//         borderRadius: 20,
//         fontFamily: "'Inter', sans-serif",
//     };

//     const BarChart = ({ value, maxValue, color }) => {
//         const numBars = 10;
//         const filledBars = Math.round((Math.min(value || 0, maxValue) / maxValue) * numBars);
//         const heights = [40, 55, 35, 70, 85, 60, 90, 75, 65, 80];
//         return (
//             <div style={{ display: "flex", alignItems: "flex-end", gap: 6, height: 80, padding: "0 4px" }}>
//                 {heights.map((h, i) => (
//                     <div key={i} style={{
//                         flex: 1,
//                         height: `${h}%`,
//                         borderRadius: "4px 4px 0 0",
//                         background: i < filledBars ? color : `${color}33`,
//                         transition: "height 0.4s ease",
//                     }} />
//                 ))}
//             </div>
//         );
//     };

//     const LineChart = ({ value, maxValue, color }) => {
//         const points = [10, 15, 12, 18, 20, 16, 22, 25, 21, 28, 24, 30];
//         const w = 280;
//         const h = 70;
//         const max = Math.max(...points);
//         const coords = points.map((p, i) => ({
//             x: (i / (points.length - 1)) * w,
//             y: h - (p / max) * (h - 10),
//         }));
//         const pathD = coords.map((c, i) => `${i === 0 ? "M" : "L"} ${c.x} ${c.y}`).join(" ");
//         const areaD = `${pathD} L ${w} ${h} L 0 ${h} Z`;
//         return (
//             <svg width="100%" viewBox={`0 0 ${w} ${h}`} style={{ overflow: "visible" }}>
//                 <defs>
//                     <linearGradient id="lineGradV" x1="0" y1="0" x2="0" y2="1">
//                         <stop offset="0%" stopColor={color} stopOpacity="0.25" />
//                         <stop offset="100%" stopColor={color} stopOpacity="0.02" />
//                     </linearGradient>
//                 </defs>
//                 <path d={areaD} fill="url(#lineGradV)" />
//                 <path d={pathD} fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
//                 <circle cx={coords[coords.length - 1].x} cy={coords[coords.length - 1].y} r="5" fill={color} />
//             </svg>
//         );
//     };

//     return (
//         <div style={{ minHeight: "100vh", paddingBottom: "90px", background: P.bg, fontFamily: "'Inter', sans-serif" }}>

//         <PageHeader
//             title="POWER"
//             backPath="/vendor"
//         />

//             {/* DEVICE INFO CARD */}
// <div
//     style={{
//         margin: "20px 20px 16px",
//         background: P.surface,
//         borderRadius: 16,
//         padding: "16px 18px",
//         border: `1px solid ${P.border}`,
//         boxShadow: P.shadowCard,
//     }}
// >

//     {/* ON Badge */}
//     <div
//         style={{
//             display: "inline-flex",
//             alignItems: "center",
//             gap: 6,
//             background: P.surfaceGreen,
//             border: `1px solid ${P.borderGreen}`,
//             borderRadius: 20,
//             padding: "4px 10px",
//             marginBottom: 16,
//         }}
//     >
//         <div
//             style={{
//                 width: 8,
//                 height: 8,
//                 borderRadius: "50%",
//                 background: P.green,
//                 boxShadow: `0 0 6px ${P.green}`,
//             }}
//         />
//         <span
//             style={{
//                 fontSize: 12,
//                 fontWeight: 700,
//                 color: P.textGreen,
//                 fontFamily: "'DM Sans', sans-serif",
//             }}
//         >
//             ON
//         </span>
//     </div>

//     {/* Device Details */}
//     <div
//         style={{
//             display: "flex",
//             justifyContent: "space-between",
//             alignItems: "flex-start",
//         }}
//     >

//         <div style={{ flex: 1 }}>
//             <div
//                 style={{
//                     fontSize: 10,
//                     color: P.textLight,
//                     fontWeight: 500,
//                     letterSpacing: 0.8,
//                     marginBottom: 2,
//                 }}
//             >
//                 SERIAL NUMBER
//             </div>

//             <div
//                 style={{
//                     fontSize: 14,
//                     fontWeight: 700,
//                     color: P.textPrimary,
//                     fontFamily: "'DM Sans', sans-serif",
//                 }}
//             >
//                 {Object.keys(data || {}).find(k => k.startsWith("ASN_"))
//                     ? data[Object.keys(data).find(k => k.startsWith("ASN_"))]
//                     : "--"}
//             </div>
//         </div>

//         <div style={{ textAlign: "right" }}>
//             <div
//                 style={{
//                     fontSize: 10,
//                     color: P.textLight,
//                     fontWeight: 500,
//                     letterSpacing: 0.8,
//                     marginBottom: 2,
//                 }}
//             >
//                 LAST UPDATED
//             </div>

//             <div
//     style={{
//         display: "flex",
//         alignItems: "center",
//         justifyContent: "flex-end",
//         gap: 8,
//         marginTop: 2,
//         whiteSpace: "nowrap",
//         fontFamily: "'DM Sans', sans-serif",
//     }}
// >
//     <span
//         style={{
//             fontSize: 14,
//             fontWeight: 700,
//             color: P.textPrimary,
//         }}
//     >
//         {formattedDateTime.date}
//     </span>

//     <span
//         style={{
//             width: 6,
//             height: 6,
//             borderRadius: "50%",
//             background: P.textAmberBright,
//             display: "inline-block",
//             flexShrink: 0,
//         }}
//     />

//     <span
//         style={{
//             fontSize: 14,
//             fontWeight: 600,
//             color: P.textPrimary,
//         }}
//     >
//         {formattedDateTime.time}
//     </span>
// </div>
//         </div>

//     </div>

// </div>

//             <div style={{ padding: "0 20px 20px" }}>
//                 <h2 style={{
//                     fontSize: 15,
//                     fontWeight: 800,
//                     color: P.textAmber,
//                     marginBottom: 14,
//                     marginTop: 4,
//                     letterSpacing: 0.5,
//                     fontFamily: "'DM Sans', sans-serif",
//                 }}>
//                     POWER GENERATED DETAILS
//                 </h2>

// {/* TOP 3 STAT CARDS */}
//                 <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: 10, marginBottom: 16 }}>

//                     {/* Active Power */}
//                     <div style={statCard}>
//                         <div style={statIconWrap}>
//                             <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={P.borderStrong} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
//                                 <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
//                             </svg>
//                         </div>
//                         <div style={statSubLabel}>ACTIVE POWER</div>
//                         <div style={statValue}>{getParameterValue("POW")}</div>
//                         <div style={statUnit}>W</div>
//                     </div>

//                     {/* Lifetime Energy */}
//                     <div style={statCard}>
//                         <div style={statIconWrap}>
//                             <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={P.borderStrong} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
//                                 <circle cx="12" cy="12" r="5" /><line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" /><line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" /><line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" /><line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
//                             </svg>
//                         </div>
//                         <div style={statSubLabel}>LIFETIME ENERGY</div>
//                         <div style={{ ...statValue, color: P.textAmberBright }}>{getParameterValue("LKWH")}</div>
//                         <div style={statUnit}>kWh</div>
//                     </div>

//                     {/* Lifetime Running */}
//                     <div style={statCard}>
//                         <div style={statIconWrap}>
//                             <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={P.borderStrong} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
//                                 <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
//                             </svg>
//                         </div>
//                         <div style={statSubLabel}>LIFETIME RUNNING</div>
//                         <div style={{ ...statValue, color: P.textAmberBright }}>{getParameterValue("LON")}</div>
//                         <div style={statUnit}>hrs</div>
//                     </div>
//                 </div>

//                 {/* TODAY ENERGY — BAR CHART */}
//                 <div style={chartCard}>
//                     <div style={chartHeader}>
//                         <span style={chartTitle}>Today Energy</span>
//                         <span style={chartBadge}>{getParameterValue("TKWH")} kWh</span>
//                     </div>
//                     <BarChart value={getParameterValue("TKWH")} maxValue={50} color={P.textAmberBright} />
//                 </div>

//                 {/* TODAY ON TIME — LINE CHART */}
//                 <div style={chartCard}>
//                     <div style={chartHeader}>
//                         <span style={chartTitle}>Today On Time</span>
//                         <span style={chartBadge}>{getParameterValue("TON")} hrs</span>
//                     </div>
//                     <LineChart value={getParameterValue("TON")} maxValue={24} color= {P.textAmber} />
//                 </div>

//             </div>

//             <VendorFooter />
//         </div>
//     );
// }












// import { useParams } from "react-router-dom";
// import VendorFooter from "../components/VendorFooter";
// import DeviceInfo from "../components/DeviceInfo";
// import useVendorDeviceData from "../hooks/useVendorDeviceData";
// import { PARAMETER_MAP } from "../constants/parameterMap";
// import P from "../theme/colors";
// import PageHeader from "../components/PageHeader";

// export default function VendorPower() {
//     const { id } = useParams();

//     const { data, lastUpdated } = useVendorDeviceData(id);

//     // ─────────────────────────────────────────────
//     // FORMAT DATE / TIME
//     // ─────────────────────────────────────────────
//     const formattedDateTime = (() => {
//         if (!lastUpdated) {
//             return {
//                 date: "--",
//                 time: "--",
//             };
//         }

//         const d = new Date(
//             typeof lastUpdated === "string"
//                 ? lastUpdated.replace(" ", "T")
//                 : lastUpdated
//         );

//         return {
//             date: d.toLocaleDateString("en-GB", {
//                 day: "numeric",
//                 month: "short",
//                 year: "numeric",
//             }),

//             time: d.toLocaleTimeString("en-US", {
//                 hour: "numeric",
//                 minute: "2-digit",
//                 hour12: true,
//             }),
//         };
//     })();

//     // ─────────────────────────────────────────────
//     // GET PARAMETER VALUE
//     // ─────────────────────────────────────────────
//     const getParameterValue = (parameter) => {
//         return data?.[parameter] ?? "--";
//     };

//     // ─────────────────────────────────────────────
//     // STYLES
//     // ─────────────────────────────────────────────

//     const metricCard = {
//         background: P.surfaceWarm,
//         border: `1px solid ${P.borderAmber}`,
//         borderRadius: 12,
//         padding: "12px 14px",
//         minWidth: 0,
//         boxSizing: "border-box",
//     };

//     const metricIconRow = {
//         display: "flex",
//         alignItems: "center",
//         justifyContent: "space-between",
//         marginBottom: 6,
//     };

//     const metricIcon = {
//         fontSize: 16,
//         color: P.textAmberBright,
//     };

//     const metricValue = {
//         fontSize: 20,
//         fontWeight: 800,
//         color: P.textPrimary,
//         fontFamily: "'DM Sans', sans-serif",
//     };

//     const metricUnit = {
//         fontSize: 14,
//         fontWeight: 600,
//         color: P.textMuted,
//         fontFamily: "'Inter', sans-serif",
//     };

//     const metricLabel = {
//         fontSize: 13,
//         fontWeight: 600,
//         color: P.textSecond,
//         fontFamily: "'Inter', sans-serif",
//         marginBottom: 2,
//     };

//     const metricDesc = {
//         fontSize: 11,
//         color: P.textLight,
//         fontFamily: "'Inter', sans-serif",
//     };

//     const statCard = {
//         background: P.surface,
//         borderRadius: 14,
//         padding: "14px 10px",
//         textAlign: "center",
//         boxShadow: P.shadowCard,
//         border: `1px solid ${P.border}`,
//         minWidth: 0,
//         boxSizing: "border-box",
//     };

//     const statIconWrap = {
//         width: 36,
//         height: 36,
//         borderRadius: "50%",
//         background: P.surfaceAmber,
//         display: "flex",
//         alignItems: "center",
//         justifyContent: "center",
//         margin: "0 auto 8px",
//     };

//     const statSubLabel = {
//         fontSize: 9,
//         fontWeight: 700,
//         color: P.textLight,
//         letterSpacing: 0.5,
//         fontFamily: "'Inter', sans-serif",
//         marginBottom: 4,
//         textTransform: "uppercase",
//     };

//     const statValue = {
//         fontSize: 20,
//         fontWeight: 800,
//         color: P.textPrimary,
//         fontFamily: "'DM Sans', sans-serif",
//         lineHeight: 1.1,
//         overflow: "hidden",
//         textOverflow: "ellipsis",
//         whiteSpace: "nowrap",
//     };

//     const statUnit = {
//         fontSize: 11,
//         fontWeight: 500,
//         color: P.textMuted,
//         fontFamily: "'Inter', sans-serif",
//         marginTop: 2,
//     };

//     const chartCard = {
//         background: P.surface,
//         borderRadius: 16,
//         padding: 16,
//         marginBottom: 14,
//         boxShadow: P.shadowCard,
//         border: `1px solid ${P.border}`,
//         boxSizing: "border-box",
//         width: "100%",
//     };

//     const chartHeader = {
//         display: "flex",
//         justifyContent: "space-between",
//         alignItems: "center",
//         gap: 12,
//         marginBottom: 16,
//     };

//     const chartTitle = {
//         fontSize: 14,
//         fontWeight: 600,
//         color: P.textPrimary,
//         fontFamily: "'DM Sans', sans-serif",
//     };

//     const chartBadge = {
//         background: P.amber,
//         color: P.surface,
//         fontSize: 12,
//         fontWeight: 700,
//         padding: "4px 12px",
//         borderRadius: 20,
//         fontFamily: "'Inter', sans-serif",
//         whiteSpace: "nowrap",
//         flexShrink: 0,
//     };

//     // ─────────────────────────────────────────────
//     // BAR CHART
//     // ─────────────────────────────────────────────
//     const BarChart = ({ value, maxValue, color }) => {
//         const numBars = 10;

//         const numericValue = Number(value);

//         const filledBars = Number.isFinite(numericValue)
//             ? Math.round(
//                   (Math.min(numericValue, maxValue) / maxValue) *
//                       numBars
//               )
//             : 0;

//         const heights = [
//             40,
//             55,
//             35,
//             70,
//             85,
//             60,
//             90,
//             75,
//             65,
//             80,
//         ];

//         return (
//             <div
//                 style={{
//                     display: "flex",
//                     alignItems: "flex-end",
//                     gap: 6,
//                     height: 80,
//                     padding: "0 4px",
//                     width: "100%",
//                     boxSizing: "border-box",
//                 }}
//             >
//                 {heights.map((height, index) => (
//                     <div
//                         key={index}
//                         style={{
//                             flex: 1,
//                             minWidth: 0,
//                             height: `${height}%`,
//                             borderRadius: "4px 4px 0 0",
//                             background:
//                                 index < filledBars
//                                     ? color
//                                     : `${color}33`,
//                             transition:
//                                 "height 0.4s ease",
//                         }}
//                     />
//                 ))}
//             </div>
//         );
//     };

//     // ─────────────────────────────────────────────
//     // LINE CHART
//     // ─────────────────────────────────────────────
//     const LineChart = ({ color }) => {
//         const points = [
//             10,
//             15,
//             12,
//             18,
//             20,
//             16,
//             22,
//             25,
//             21,
//             28,
//             24,
//             30,
//         ];

//         const width = 280;
//         const height = 70;
//         const max = Math.max(...points);

//         const coords = points.map((point, index) => ({
//             x:
//                 (index / (points.length - 1)) *
//                 width,
//             y:
//                 height -
//                 (point / max) *
//                     (height - 10),
//         }));

//         const pathD = coords
//             .map(
//                 (coordinate, index) =>
//                     `${
//                         index === 0 ? "M" : "L"
//                     } ${coordinate.x} ${coordinate.y}`
//             )
//             .join(" ");

//         const areaD = `${pathD} L ${width} ${height} L 0 ${height} Z`;

//         return (
//             <svg
//                 width="100%"
//                 viewBox={`0 0 ${width} ${height}`}
//                 style={{
//                     overflow: "visible",
//                     display: "block",
//                 }}
//             >
//                 <defs>
//                     <linearGradient
//                         id="vendorPowerLineGrad"
//                         x1="0"
//                         y1="0"
//                         x2="0"
//                         y2="1"
//                     >
//                         <stop
//                             offset="0%"
//                             stopColor={color}
//                             stopOpacity="0.25"
//                         />

//                         <stop
//                             offset="100%"
//                             stopColor={color}
//                             stopOpacity="0.02"
//                         />
//                     </linearGradient>
//                 </defs>

//                 <path
//                     d={areaD}
//                     fill="url(#vendorPowerLineGrad)"
//                 />

//                 <path
//                     d={pathD}
//                     fill="none"
//                     stroke={color}
//                     strokeWidth="2.5"
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                 />

//                 <circle
//                     cx={
//                         coords[coords.length - 1].x
//                     }
//                     cy={
//                         coords[coords.length - 1].y
//                     }
//                     r="5"
//                     fill={color}
//                 />
//             </svg>
//         );
//     };

//     return (
//         <div
//             style={{
//                 minHeight: "100vh",
//                 paddingBottom: 90,
//                 background: P.bg,
//                 fontFamily: "'Inter', sans-serif",
//                 boxSizing: "border-box",
//                 width: "100%",
//                 overflowX: "hidden",
//             }}
//         >
//             {/* ================= HEADER ================= */}

//             <PageHeader
//                 title="POWER"
//                 backPath="/vendor"
//             />

//             {/* ================= DEVICE INFO ================= */}

//             <DeviceInfo
//                 data={data}
//                 lastUpdated={lastUpdated}
//             />

//             {/* ================= PAGE CONTENT ================= */}

//             <div
//                 style={{
//                     width: "100%",
//                     maxWidth: 700,
//                     margin: "0 auto",
//                     padding: "0 20px 20px",
//                     boxSizing: "border-box",
//                 }}
//             >
//                 {/* ================= SOLAR PANEL DETAILS ================= */}

//                 <h2
//                     style={{
//                         fontSize: 15,
//                         fontWeight: 800,
//                         color: P.textAmber,
//                         marginBottom: 12,
//                         marginTop: 4,
//                         letterSpacing: 0.5,
//                         fontFamily:
//                             "'DM Sans', sans-serif",
//                     }}
//                 >
//                     SOLAR PANEL DETAILS
//                 </h2>

//                 <div
//                     style={{
//                         background:
//                             P.textAmberBright,
//                         border: `1.5px solid ${P.borderDark}`,
//                         borderRadius: 16,
//                         padding: 16,
//                         marginBottom: 20,
//                         boxShadow:
//                             P.shadowCardRaised,
//                         display: "grid",
//                         gridTemplateColumns:
//                             "repeat(2, minmax(0, 1fr))",
//                         gap: 12,
//                         boxSizing: "border-box",
//                         width: "100%",
//                     }}
//                 >
//                     {/* PV VOLTAGE */}

//                     <div style={metricCard}>
//                         <div
//                             style={metricIconRow}
//                         >
//                             <span
//                                 style={metricIcon}
//                             >
//                                 ⚡
//                             </span>

//                             <span
//                                 style={
//                                     metricValue
//                                 }
//                             >
//                                 {getParameterValue(
//                                     "PV"
//                                 )}{" "}
//                                 <span
//                                     style={
//                                         metricUnit
//                                     }
//                                 >
//                                     V
//                                 </span>
//                             </span>
//                         </div>

//                         <div
//                             style={
//                                 metricLabel
//                             }
//                         >
//                             PV Voltage
//                         </div>

//                         <div
//                             style={metricDesc}
//                         >
//                             Input Voltage
//                         </div>
//                     </div>

//                     {/* PV CURRENT */}

//                     <div style={metricCard}>
//                         <div
//                             style={metricIconRow}
//                         >
//                             <span
//                                 style={metricIcon}
//                             >
//                                 ⚡
//                             </span>

//                             <span
//                                 style={
//                                     metricValue
//                                 }
//                             >
//                                 {getParameterValue(
//                                     "PI"
//                                 )}{" "}
//                                 <span
//                                     style={
//                                         metricUnit
//                                     }
//                                 >
//                                     A
//                                 </span>
//                             </span>
//                         </div>

//                         <div
//                             style={
//                                 metricLabel
//                             }
//                         >
//                             PV Current
//                         </div>

//                         <div
//                             style={metricDesc}
//                         >
//                             Input Current
//                         </div>
//                     </div>

//                     {/* SOLAR POWER */}

//                     <div
//                         style={{
//                             ...metricCard,
//                             gridColumn:
//                                 "1 / -1",
//                             display: "flex",
//                             alignItems:
//                                 "center",
//                             justifyContent:
//                                 "space-between",
//                             gap: 16,
//                         }}
//                     >
//                         <div
//                             style={{
//                                 minWidth: 0,
//                             }}
//                         >
//                             <div
//                                 style={
//                                     metricIconRow
//                                 }
//                             >
//                                 <span
//                                     style={
//                                         metricIcon
//                                     }
//                                 >
//                                     🔲
//                                 </span>
//                             </div>

//                             <div
//                                 style={
//                                     metricLabel
//                                 }
//                             >
//                                 Solar Power
//                             </div>

//                             <div
//                                 style={
//                                     metricDesc
//                                 }
//                             >
//                                 Total Output
//                             </div>
//                         </div>

//                         <div
//                             style={{
//                                 fontSize: 22,
//                                 fontWeight: 800,
//                                 color:
//                                     P.textPrimary,
//                                 fontFamily:
//                                     "'DM Sans', sans-serif",
//                                 whiteSpace:
//                                     "nowrap",
//                                 flexShrink: 0,
//                             }}
//                         >
//                             {getParameterValue(
//                                 "PPOW"
//                             )}{" "}
//                             <span
//                                 style={{
//                                     fontSize: 14,
//                                     fontWeight: 600,
//                                     color:
//                                         P.textMuted,
//                                 }}
//                             >
//                                 kW
//                             </span>
//                         </div>
//                     </div>
//                 </div>

//                 {/* ================= GENERATION SUMMARY ================= */}

//                 <h2
//                     style={{
//                         fontSize: 15,
//                         fontWeight: 800,
//                         color: P.textAmber,
//                         marginBottom: 14,
//                         marginTop: 4,
//                         letterSpacing: 0.5,
//                         fontFamily:
//                             "'DM Sans', sans-serif",
//                     }}
//                 >
//                     GENERATION SUMMARY
//                 </h2>

//                 {/* ================= TOP 3 STAT CARDS ================= */}

//                 <div
//                     style={{
//                         display: "grid",
//                         gridTemplateColumns:
//                             "repeat(3, minmax(0, 1fr))",
//                         gap: 10,
//                         marginBottom: 16,
//                         width: "100%",
//                     }}
//                 >
//                     {/* TODAY */}

//                     <div style={statCard}>
//                         <div
//                             style={
//                                 statIconWrap
//                             }
//                         >
//                             <svg
//                                 width="18"
//                                 height="18"
//                                 viewBox="0 0 24 24"
//                                 fill="none"
//                                 stroke={
//                                     P.borderStrong
//                                 }
//                                 strokeWidth="2.5"
//                                 strokeLinecap="round"
//                                 strokeLinejoin="round"
//                             >
//                                 <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
//                             </svg>
//                         </div>

//                         <div
//                             style={
//                                 statSubLabel
//                             }
//                         >
//                             TODAY
//                         </div>

//                         <div
//                             style={
//                                 statValue
//                             }
//                         >
//                             {getParameterValue(
//                                 "POW"
//                             )}
//                         </div>

//                         <div
//                             style={statUnit}
//                         >
//                             W
//                         </div>
//                     </div>

//                     {/* MONTH */}

//                     <div style={statCard}>
//                         <div
//                             style={
//                                 statIconWrap
//                             }
//                         >
//                             <svg
//                                 width="18"
//                                 height="18"
//                                 viewBox="0 0 24 24"
//                                 fill="none"
//                                 stroke={
//                                     P.borderStrong
//                                 }
//                                 strokeWidth="2.5"
//                                 strokeLinecap="round"
//                                 strokeLinejoin="round"
//                             >
//                                 <circle
//                                     cx="12"
//                                     cy="12"
//                                     r="5"
//                                 />

//                                 <line
//                                     x1="12"
//                                     y1="1"
//                                     x2="12"
//                                     y2="3"
//                                 />

//                                 <line
//                                     x1="12"
//                                     y1="21"
//                                     x2="12"
//                                     y2="23"
//                                 />

//                                 <line
//                                     x1="4.22"
//                                     y1="4.22"
//                                     x2="5.64"
//                                     y2="5.64"
//                                 />

//                                 <line
//                                     x1="18.36"
//                                     y1="18.36"
//                                     x2="19.78"
//                                     y2="19.78"
//                                 />

//                                 <line
//                                     x1="1"
//                                     y1="12"
//                                     x2="3"
//                                     y2="12"
//                                 />

//                                 <line
//                                     x1="21"
//                                     y1="12"
//                                     x2="23"
//                                     y2="12"
//                                 />

//                                 <line
//                                     x1="4.22"
//                                     y1="19.78"
//                                     x2="5.64"
//                                     y2="18.36"
//                                 />

//                                 <line
//                                     x1="18.36"
//                                     y1="5.64"
//                                     x2="19.78"
//                                     y2="4.22"
//                                 />
//                             </svg>
//                         </div>

//                         <div
//                             style={
//                                 statSubLabel
//                             }
//                         >
//                             MONTH
//                         </div>

//                         <div
//                             style={{
//                                 ...statValue,
//                                 color:
//                                     P.textAmberBright,
//                             }}
//                         >
//                             {getParameterValue(
//                                 "LON"
//                             )}
//                         </div>

//                         <div
//                             style={statUnit}
//                         >
//                             kWh
//                         </div>
//                     </div>

//                     {/* TOTAL */}

//                     <div style={statCard}>
//                         <div
//                             style={
//                                 statIconWrap
//                             }
//                         >
//                             <svg
//                                 width="18"
//                                 height="18"
//                                 viewBox="0 0 24 24"
//                                 fill="none"
//                                 stroke={
//                                     P.borderStrong
//                                 }
//                                 strokeWidth="2.5"
//                                 strokeLinecap="round"
//                                 strokeLinejoin="round"
//                             >
//                                 <circle
//                                     cx="12"
//                                     cy="12"
//                                     r="10"
//                                 />

//                                 <polyline points="12 6 12 12 16 14" />
//                             </svg>
//                         </div>

//                         <div
//                             style={
//                                 statSubLabel
//                             }
//                         >
//                             TOTAL
//                         </div>

//                         <div
//                             style={{
//                                 ...statValue,
//                                 color:
//                                     P.textAmberBright,
//                             }}
//                         >
//                             {getParameterValue(
//                                 "LKWH"
//                             )}
//                         </div>

//                         <div
//                             style={statUnit}
//                         >
//                             hrs
//                         </div>
//                     </div>
//                 </div>

//                 {/* ================= TODAY ENERGY ================= */}

//                 <div style={chartCard}>
//                     <div
//                         style={chartHeader}
//                     >
//                         <span
//                             style={chartTitle}
//                         >
//                             Today Energy
//                         </span>

//                         <span
//                             style={
//                                 chartBadge
//                             }
//                         >
//                             {getParameterValue(
//                                 "TKWH"
//                             )}{" "}
//                             kWh
//                         </span>
//                     </div>

//                     <BarChart
//                         value={getParameterValue(
//                             "TKWH"
//                         )}
//                         maxValue={50}
//                         color={
//                             P.textAmberBright
//                         }
//                     />
//                 </div>

//                 {/* ================= TODAY ON TIME ================= */}

//                 {/* <div style={chartCard}>
//                     <div
//                         style={chartHeader}
//                     >
//                         <span
//                             style={chartTitle}
//                         >
//                             Today On Time
//                         </span>

//                         <span
//                             style={
//                                 chartBadge
//                             }
//                         >
//                             {getParameterValue(
//                                 "TON"
//                             )}{" "}
//                             hrs
//                         </span>
//                     </div>

//                     <LineChart
//                         color={P.textAmber}
//                     />
//                 </div> */}
//             </div>

//             {/* ================= FOOTER ================= */}

//             <VendorFooter />
//         </div>
//     );
// }







// import VendorFooter from "../components/VendorFooter";
// import DeviceInfo from "../components/DeviceInfo";
// import { useVendorDevice } from "../context/VendorDeviceContext";
// import P from "../theme/colors";
// import PageHeader from "../components/PageHeader";

// export default function VendorPower() {
//     // ============================================================
//     // DEVICE CONTEXT
//     // ============================================================

//     const {
//         data,
//         loading,
//         lastUpdated,
//     } = useVendorDevice();

//     // ============================================================
//     // FORMAT DATE / TIME
//     // ============================================================

//     const formattedDateTime = (() => {
//         if (!lastUpdated) {
//             return {
//                 date: "--",
//                 time: "--",
//             };
//         }

//         const d = new Date(
//             typeof lastUpdated === "string"
//                 ? lastUpdated.replace(" ", "T")
//                 : lastUpdated
//         );

//         return {
//             date: d.toLocaleDateString("en-GB", {
//                 day: "numeric",
//                 month: "short",
//                 year: "numeric",
//             }),

//             time: d.toLocaleTimeString("en-US", {
//                 hour: "numeric",
//                 minute: "2-digit",
//                 hour12: true,
//             }),
//         };
//     })();

//     // ============================================================
//     // GET PARAMETER VALUE
//     // ============================================================

//     const getParameterValue = (parameter) => {
//         return data?.[parameter] ?? "--";
//     };

//     // ============================================================
//     // STYLES
//     // ============================================================

//     const metricCard = {
//         background: P.surfaceWarm,
//         border: `1px solid ${P.borderAmber}`,
//         borderRadius: 12,
//         padding: "12px 14px",
//         minWidth: 0,
//         boxSizing: "border-box",
//     };

//     const metricIconRow = {
//         display: "flex",
//         alignItems: "center",
//         justifyContent: "space-between",
//         marginBottom: 6,
//     };

//     const metricIcon = {
//         fontSize: 16,
//         color: P.textAmberBright,
//     };

//     const metricValue = {
//         fontSize: 20,
//         fontWeight: 800,
//         color: P.textPrimary,
//         fontFamily: "'DM Sans', sans-serif",
//     };

//     const metricUnit = {
//         fontSize: 14,
//         fontWeight: 600,
//         color: P.textMuted,
//         fontFamily: "'Inter', sans-serif",
//     };

//     const metricLabel = {
//         fontSize: 13,
//         fontWeight: 600,
//         color: P.textSecond,
//         fontFamily: "'Inter', sans-serif",
//         marginBottom: 2,
//     };

//     const metricDesc = {
//         fontSize: 11,
//         color: P.textLight,
//         fontFamily: "'Inter', sans-serif",
//     };

//     const statCard = {
//         background: P.surface,
//         borderRadius: 14,
//         padding: "14px 10px",
//         textAlign: "center",
//         boxShadow: P.shadowCard,
//         border: `1px solid ${P.border}`,
//         minWidth: 0,
//         boxSizing: "border-box",
//     };

//     const statIconWrap = {
//         width: 36,
//         height: 36,
//         borderRadius: "50%",
//         background: P.surfaceAmber,
//         display: "flex",
//         alignItems: "center",
//         justifyContent: "center",
//         margin: "0 auto 8px",
//     };

//     const statSubLabel = {
//         fontSize: 9,
//         fontWeight: 700,
//         color: P.textLight,
//         letterSpacing: 0.5,
//         fontFamily: "'Inter', sans-serif",
//         marginBottom: 4,
//         textTransform: "uppercase",
//     };

//     const statValue = {
//         fontSize: 20,
//         fontWeight: 800,
//         color: P.textPrimary,
//         fontFamily: "'DM Sans', sans-serif",
//         lineHeight: 1.1,
//         overflow: "hidden",
//         textOverflow: "ellipsis",
//         whiteSpace: "nowrap",
//     };

//     const statUnit = {
//         fontSize: 11,
//         fontWeight: 500,
//         color: P.textMuted,
//         fontFamily: "'Inter', sans-serif",
//         marginTop: 2,
//     };

//     const chartCard = {
//         background: P.surface,
//         borderRadius: 16,
//         padding: 16,
//         marginBottom: 14,
//         boxShadow: P.shadowCard,
//         border: `1px solid ${P.border}`,
//         boxSizing: "border-box",
//         width: "100%",
//     };

//     const chartHeader = {
//         display: "flex",
//         justifyContent: "space-between",
//         alignItems: "center",
//         gap: 12,
//         marginBottom: 16,
//     };

//     const chartTitle = {
//         fontSize: 14,
//         fontWeight: 600,
//         color: P.textPrimary,
//         fontFamily: "'DM Sans', sans-serif",
//     };

//     const chartBadge = {
//         background: P.amber,
//         color: P.surface,
//         fontSize: 12,
//         fontWeight: 700,
//         padding: "4px 12px",
//         borderRadius: 20,
//         fontFamily: "'Inter', sans-serif",
//         whiteSpace: "nowrap",
//         flexShrink: 0,
//     };

//     // ============================================================
//     // BAR CHART
//     // ============================================================

//     const BarChart = ({ value, maxValue, color }) => {
//         const numBars = 10;

//         const numericValue = Number(value);

//         const filledBars = Number.isFinite(numericValue)
//             ? Math.round(
//                   (Math.min(numericValue, maxValue) /
//                       maxValue) *
//                       numBars
//               )
//             : 0;

//         const heights = [
//             40,
//             55,
//             35,
//             70,
//             85,
//             60,
//             90,
//             75,
//             65,
//             80,
//         ];

//         return (
//             <div
//                 style={{
//                     display: "flex",
//                     alignItems: "flex-end",
//                     gap: 6,
//                     height: 80,
//                     padding: "0 4px",
//                     width: "100%",
//                     boxSizing: "border-box",
//                 }}
//             >
//                 {heights.map((height, index) => (
//                     <div
//                         key={index}
//                         style={{
//                             flex: 1,
//                             minWidth: 0,
//                             height: `${height}%`,
//                             borderRadius: "4px 4px 0 0",
//                             background:
//                                 index < filledBars
//                                     ? color
//                                     : `${color}33`,
//                             transition:
//                                 "height 0.4s ease",
//                         }}
//                     />
//                 ))}
//             </div>
//         );
//     };

//     // ============================================================
//     // LINE CHART
//     // ============================================================

//     const LineChart = ({ color }) => {
//         const points = [
//             10,
//             15,
//             12,
//             18,
//             20,
//             16,
//             22,
//             25,
//             21,
//             28,
//             24,
//             30,
//         ];

//         const width = 280;
//         const height = 70;
//         const max = Math.max(...points);

//         const coords = points.map((point, index) => ({
//             x:
//                 (index / (points.length - 1)) *
//                 width,
//             y:
//                 height -
//                 (point / max) *
//                     (height - 10),
//         }));

//         const pathD = coords
//             .map(
//                 (coordinate, index) =>
//                     `${
//                         index === 0 ? "M" : "L"
//                     } ${coordinate.x} ${coordinate.y}`
//             )
//             .join(" ");

//         const areaD = `${pathD} L ${width} ${height} L 0 ${height} Z`;

//         return (
//             <svg
//                 width="100%"
//                 viewBox={`0 0 ${width} ${height}`}
//                 style={{
//                     overflow: "visible",
//                     display: "block",
//                 }}
//             >
//                 <defs>
//                     <linearGradient
//                         id="vendorPowerLineGrad"
//                         x1="0"
//                         y1="0"
//                         x2="0"
//                         y2="1"
//                     >
//                         <stop
//                             offset="0%"
//                             stopColor={color}
//                             stopOpacity="0.25"
//                         />

//                         <stop
//                             offset="100%"
//                             stopColor={color}
//                             stopOpacity="0.02"
//                         />
//                     </linearGradient>
//                 </defs>

//                 <path
//                     d={areaD}
//                     fill="url(#vendorPowerLineGrad)"
//                 />

//                 <path
//                     d={pathD}
//                     fill="none"
//                     stroke={color}
//                     strokeWidth="2.5"
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                 />

//                 <circle
//                     cx={coords[coords.length - 1].x}
//                     cy={coords[coords.length - 1].y}
//                     r="5"
//                     fill={color}
//                 />
//             </svg>
//         );
//     };

//     // ============================================================
//     // PAGE
//     // ============================================================

//     return (
//         <div
//             style={{
//                 minHeight: "100vh",
//                 paddingBottom: 90,
//                 background: P.bg,
//                 fontFamily: "'Inter', sans-serif",
//                 boxSizing: "border-box",
//                 width: "100%",
//                 overflowX: "hidden",
//             }}
//         >
//             {/* HEADER */}

//             <PageHeader
//                 title="POWER"
//                 backPath="/vendor"
//             />

//             {/* DEVICE INFO */}

//             <DeviceInfo
//                 data={data}
//                 lastUpdated={lastUpdated}
//             />

//             {/* PAGE CONTENT */}

//             <div
//                 style={{
//                     width: "100%",
//                     maxWidth: 700,
//                     margin: "0 auto",
//                     padding: "0 20px 20px",
//                     boxSizing: "border-box",
//                 }}
//             >
//                 {/* SOLAR PANEL DETAILS */}

//                 <h2
//                     style={{
//                         fontSize: 15,
//                         fontWeight: 800,
//                         color: P.textAmber,
//                         marginBottom: 12,
//                         marginTop: 4,
//                         letterSpacing: 0.5,
//                         fontFamily:
//                             "'DM Sans', sans-serif",
//                     }}
//                 >
//                     SOLAR PANEL DETAILS
//                 </h2>

//                 <div
//                     style={{
//                         background:
//                             P.textAmberBright,
//                         border: `1.5px solid ${P.borderDark}`,
//                         borderRadius: 16,
//                         padding: 16,
//                         marginBottom: 20,
//                         boxShadow:
//                             P.shadowCardRaised,
//                         display: "grid",
//                         gridTemplateColumns:
//                             "repeat(2, minmax(0, 1fr))",
//                         gap: 12,
//                         boxSizing: "border-box",
//                         width: "100%",
//                     }}
//                 >
//                     {/* PV VOLTAGE */}

//                     <div style={metricCard}>
//                         <div style={metricIconRow}>
//                             <span style={metricIcon}>
//                                 ⚡
//                             </span>

//                             <span style={metricValue}>
//                                 {getParameterValue("PV")}{" "}
//                                 <span style={metricUnit}>
//                                     V
//                                 </span>
//                             </span>
//                         </div>

//                         <div style={metricLabel}>
//                             PV Voltage
//                         </div>

//                         <div style={metricDesc}>
//                             Input Voltage
//                         </div>
//                     </div>

//                     {/* PV CURRENT */}

//                     <div style={metricCard}>
//                         <div style={metricIconRow}>
//                             <span style={metricIcon}>
//                                 ⚡
//                             </span>

//                             <span style={metricValue}>
//                                 {getParameterValue("PI")}{" "}
//                                 <span style={metricUnit}>
//                                     A
//                                 </span>
//                             </span>
//                         </div>

//                         <div style={metricLabel}>
//                             PV Current
//                         </div>

//                         <div style={metricDesc}>
//                             Input Current
//                         </div>
//                     </div>

//                     {/* SOLAR POWER */}

//                     <div
//                         style={{
//                             ...metricCard,
//                             gridColumn: "1 / -1",
//                             display: "flex",
//                             alignItems: "center",
//                             justifyContent: "space-between",
//                             gap: 16,
//                         }}
//                     >
//                         <div
//                             style={{
//                                 minWidth: 0,
//                             }}
//                         >
//                             <div style={metricIconRow}>
//                                 <span style={metricIcon}>
//                                     🔲
//                                 </span>
//                             </div>

//                             <div style={metricLabel}>
//                                 Solar Power
//                             </div>

//                             <div style={metricDesc}>
//                                 Total Output
//                             </div>
//                         </div>

//                         <div
//                             style={{
//                                 fontSize: 22,
//                                 fontWeight: 800,
//                                 color: P.textPrimary,
//                                 fontFamily:
//                                     "'DM Sans', sans-serif",
//                                 whiteSpace: "nowrap",
//                                 flexShrink: 0,
//                             }}
//                         >
//                             {getParameterValue("PPOW")}{" "}
//                             <span
//                                 style={{
//                                     fontSize: 14,
//                                     fontWeight: 600,
//                                     color: P.textMuted,
//                                 }}
//                             >
//                                 kW
//                             </span>
//                         </div>
//                     </div>
//                 </div>

//                 {/* GENERATION SUMMARY */}

//                 <h2
//                     style={{
//                         fontSize: 15,
//                         fontWeight: 800,
//                         color: P.textAmber,
//                         marginBottom: 14,
//                         marginTop: 4,
//                         letterSpacing: 0.5,
//                         fontFamily:
//                             "'DM Sans', sans-serif",
//                     }}
//                 >
//                     GENERATION SUMMARY
//                 </h2>

//                 {/* TOP 3 STAT CARDS */}

//                 <div
//                     style={{
//                         display: "grid",
//                         gridTemplateColumns:
//                             "repeat(3, minmax(0, 1fr))",
//                         gap: 10,
//                         marginBottom: 16,
//                         width: "100%",
//                     }}
//                 >
//                     {/* TODAY */}

//                     <div style={statCard}>
//                         <div style={statIconWrap}>
//                             <svg
//                                 width="18"
//                                 height="18"
//                                 viewBox="0 0 24 24"
//                                 fill="none"
//                                 stroke={P.borderStrong}
//                                 strokeWidth="2.5"
//                                 strokeLinecap="round"
//                                 strokeLinejoin="round"
//                             >
//                                 <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
//                             </svg>
//                         </div>

//                         <div style={statSubLabel}>
//                             TODAY
//                         </div>

//                         <div style={statValue}>
//                             {getParameterValue("POW")}
//                         </div>

//                         <div style={statUnit}>
//                             W
//                         </div>
//                     </div>

//                     {/* MONTH */}

//                     <div style={statCard}>
//                         <div style={statIconWrap}>
//                             <svg
//                                 width="18"
//                                 height="18"
//                                 viewBox="0 0 24 24"
//                                 fill="none"
//                                 stroke={P.borderStrong}
//                                 strokeWidth="2.5"
//                                 strokeLinecap="round"
//                                 strokeLinejoin="round"
//                             >
//                                 <circle
//                                     cx="12"
//                                     cy="12"
//                                     r="5"
//                                 />

//                                 <line
//                                     x1="12"
//                                     y1="1"
//                                     x2="12"
//                                     y2="3"
//                                 />

//                                 <line
//                                     x1="12"
//                                     y1="21"
//                                     x2="12"
//                                     y2="23"
//                                 />

//                                 <line
//                                     x1="4.22"
//                                     y1="4.22"
//                                     x2="5.64"
//                                     y2="5.64"
//                                 />

//                                 <line
//                                     x1="18.36"
//                                     y1="18.36"
//                                     x2="19.78"
//                                     y2="19.78"
//                                 />

//                                 <line
//                                     x1="1"
//                                     y1="12"
//                                     x2="3"
//                                     y2="12"
//                                 />

//                                 <line
//                                     x1="21"
//                                     y1="12"
//                                     x2="23"
//                                     y2="12"
//                                 />

//                                 <line
//                                     x1="4.22"
//                                     y1="19.78"
//                                     x2="5.64"
//                                     y2="18.36"
//                                 />

//                                 <line
//                                     x1="18.36"
//                                     y1="5.64"
//                                     x2="19.78"
//                                     y2="4.22"
//                                 />

//                             </svg>
//                         </div>

//                         <div style={statSubLabel}>
//                             MONTH
//                         </div>

//                         <div
//                             style={{
//                                 ...statValue,
//                                 color: P.textAmberBright,
//                             }}
//                         >
//                             {getParameterValue("LON")}
//                         </div>

//                         <div style={statUnit}>
//                             kWh
//                         </div>
//                     </div>

//                     {/* TOTAL */}

//                     <div style={statCard}>
//                         <div style={statIconWrap}>
//                             <svg
//                                 width="18"
//                                 height="18"
//                                 viewBox="0 0 24 24"
//                                 fill="none"
//                                 stroke={P.borderStrong}
//                                 strokeWidth="2.5"
//                                 strokeLinecap="round"
//                                 strokeLinejoin="round"
//                             >
//                                 <circle
//                                     cx="12"
//                                     cy="12"
//                                     r="10"
//                                 />

//                                 <polyline points="12 6 12 12 16 14" />
//                             </svg>
//                         </div>

//                         <div style={statSubLabel}>
//                             TOTAL
//                         </div>

//                         <div
//                             style={{
//                                 ...statValue,
//                                 color: P.textAmberBright,
//                             }}
//                         >
//                             {getParameterValue("LKWH")}
//                         </div>

//                         <div style={statUnit}>
//                             hrs
//                         </div>
//                     </div>
//                 </div>

//                 {/* TODAY ENERGY */}

//                 <div style={chartCard}>
//                     <div style={chartHeader}>
//                         <span style={chartTitle}>
//                             Today Energy
//                         </span>

//                         <span style={chartBadge}>
//                             {getParameterValue("TKWH")}{" "}
//                             kWh
//                         </span>
//                     </div>

//                     <BarChart
//                         value={getParameterValue("TKWH")}
//                         maxValue={50}
//                         color={P.textAmberBright}
//                     />
//                 </div>

//                 {/* TODAY ON TIME */}

//                 {/* 
//                 <div style={chartCard}>
//                     ...
//                 </div>
//                 */}
//             </div>

//             {/* FOOTER */}

//             <VendorFooter />
//         </div>
//     );
// }






import { useState } from "react";

import VendorFooter from "../components/VendorFooter";
import DeviceInfo from "../components/DeviceInfo";
import { useVendorDevice } from "../context/VendorDeviceContext";
import P from "../theme/colors";
import VendorPageHeader from "../components/VendorPageHeader";
import PageBackground from "../components/PageBackground";

export default function VendorPower() {

    const {
        data,
        loading,
        lastUpdated,

        // NEW
        energy,
        energyCharts,
        refreshEnergy,
    } = useVendorDevice();

    const [chartMode, setChartMode] = useState("today");
    const [refreshing, setRefreshing] = useState(false);

    // ============================================================
    // REFRESH ENERGY
    // ============================================================

    const handleRefreshEnergy = async () => {

        if (refreshing) return;

        try {

            setRefreshing(true);

            await refreshEnergy();

        } catch (err) {

            console.error(
                "Vendor energy refresh failed:",
                err
            );

        } finally {

            setRefreshing(false);

        }
    };

    // ============================================================
    // CHART DATA
    // ============================================================

    const chartData = Array.isArray(
        energyCharts?.[chartMode]
    )
        ? energyCharts[chartMode]
        : [];

    // ============================================================
    // PARAMETER
    // ============================================================

    const getParameterValue = (parameter) => {
        return data?.[parameter] ?? "--";
    };

    // ============================================================
    // STYLES
    // ============================================================

    const metricCard = {
        background: P.surfaceWarm,
        border: `1px solid ${P.borderAmber}`,
        borderRadius: 12,
        padding: "12px 14px",
        minWidth: 0,
        boxSizing: "border-box",
    };

    const metricIconRow = {
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 6,
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
        minWidth: 0,
        boxSizing: "border-box",
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
        overflow: "hidden",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap",
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
        padding: 16,
        marginBottom: 14,
        boxShadow: P.shadowCard,
        border: `1px solid ${P.border}`,
        boxSizing: "border-box",
        width: "100%",
    };

    const chartHeader = {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        gap: 12,
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
        whiteSpace: "nowrap",
    };

    // ============================================================
    // ENERGY CHART
    // ============================================================

    const EnergyChart = ({ data, color }) => {

        const safeData =
            Array.isArray(data)
                ? data
                : [];

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

        const maxValue =
            Math.max(...values, 0);

        // ========================================================
        // NICE Y AXIS MAX
        // ========================================================

        const getNiceMax = (value) => {

            if (value <= 0) {
                return 10;
            }

            const magnitude = Math.pow(
                10,
                Math.floor(Math.log10(value))
            );

            const normalized =
                value / magnitude;

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

        const yAxisMax =
            getNiceMax(maxValue);

        // ========================================================
        // Y AXIS
        // ========================================================

        const tickCount = 5;

        const tickStep =
            yAxisMax / tickCount;

        const yAxisTicks =
            Array.from(
                { length: tickCount + 1 },
                (_, index) =>
                    Math.round(
                        tickStep * index
                    )
            );

        // ========================================================
        // CHART SIZE
        // ========================================================

        const chartHeight = 240;
        const plotHeight = 180;

        // ========================================================
        // CHART TYPE
        // ========================================================

        const isMonthly =
            safeData.length >= 28 &&
            safeData.length <= 31;

        const isYearly =
            safeData.length === 12;

        // ========================================================
        // LABEL VISIBILITY
        // ========================================================

        const shouldShowLabel = (index) => {

            if (isMonthly) {

                return (
                    index === 0 ||
                    index % 5 === 0 ||
                    index === safeData.length - 1
                );
            }

            if (isYearly) {
                return true;
            }

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

                        {[...yAxisTicks]
                            .reverse()
                            .map((tick, index) => (

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

                    {/* GRAPH */}

                    <div
                        style={{
                            flex: 1,
                            minWidth: 0,
                            position: "relative",
                            height: chartHeight,
                        }}
                    >

                        {/* GRID */}

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

                            {yAxisTicks.map(
                                (tick, index) => {

                                    const position =
                                        (1 -
                                            tick /
                                                yAxisMax) *
                                        100;

                                    return (
                                        <div
                                            key={index}
                                            style={{
                                                position:
                                                    "absolute",
                                                left: 0,
                                                right: 0,
                                                top:
                                                    `${position}%`,
                                                borderTop:
                                                    `1px dashed ${P.border}`,
                                            }}
                                        />
                                    );
                                }
                            )}

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

                            {safeData.map(
                                (item, index) => {

                                    const value =
                                        Number(
                                            item.value
                                        ) || 0;

                                    const barHeight =
                                        maxValue > 0
                                            ? (
                                                value /
                                                yAxisMax
                                            ) *
                                              plotHeight
                                            : 2;

                                    return (
                                        <div
                                            key={index}
                                            style={{
                                                flex: 1,
                                                minWidth: 0,
                                                height:
                                                    plotHeight,
                                                display:
                                                    "flex",
                                                flexDirection:
                                                    "column",
                                                alignItems:
                                                    "center",
                                                justifyContent:
                                                    "flex-end",
                                                position:
                                                    "relative",
                                            }}
                                        >

                                            {/* VALUE */}

                                            {value > 0 && (
                                                <div
                                                    style={{
                                                        position:
                                                            "absolute",
                                                        bottom:
                                                            Math.min(
                                                                barHeight +
                                                                    4,
                                                                plotHeight -
                                                                    12
                                                            ),
                                                        fontSize: 8,
                                                        fontWeight: 600,
                                                        color:
                                                            P.textMuted,
                                                        whiteSpace:
                                                            "nowrap",
                                                        zIndex: 2,
                                                    }}
                                                >
                                                    {value.toFixed(
                                                        1
                                                    )}
                                                </div>
                                            )}

                                            {/* BAR */}

                                            <div
                                                style={{
                                                    width:
                                                        "100%",
                                                    maxWidth:
                                                        isMonthly
                                                            ? 14
                                                            : 28,
                                                    height:
                                                        Math.max(
                                                            barHeight,
                                                            value >
                                                                0
                                                                ? 3
                                                                : 1
                                                        ),
                                                    background:
                                                        value >
                                                        0
                                                            ? color
                                                            : `${color}33`,
                                                    borderRadius:
                                                        "4px 4px 0 0",
                                                    transition:
                                                        "height 0.4s ease",
                                                    position:
                                                        "absolute",
                                                    bottom: 0,
                                                }}
                                            />

                                        </div>
                                    );
                                }
                            )}

                        </div>

                        {/* X AXIS */}

                        <div
                            style={{
                                position: "absolute",
                                top:
                                    plotHeight + 8,
                                left: 0,
                                right: 0,
                                display: "flex",
                                alignItems: "center",
                            }}
                        >

                            {safeData.map(
                                (item, index) => (

                                    <div
                                        key={index}
                                        style={{
                                            flex: 1,
                                            minWidth: 0,
                                            textAlign:
                                                "center",
                                            fontSize:
                                                isMonthly
                                                    ? 8
                                                    : 9,
                                            color:
                                                P.textMuted,
                                            whiteSpace:
                                                "nowrap",
                                            overflow:
                                                "hidden",
                                            visibility:
                                                shouldShowLabel(
                                                    index
                                                )
                                                    ? "visible"
                                                    : "hidden",
                                        }}
                                    >
                                        {item.label}
                                    </div>

                                )
                            )}

                        </div>

                    </div>

                </div>

            </div>
        );
    };

    // ============================================================
    // PAGE
    // ============================================================

    return (

        <PageBackground>

            <div
                style={{
                    minHeight: "100vh",
                    paddingBottom: 90,
                    fontFamily:
                        "'Inter', sans-serif",
                }}
            >

                <VendorPageHeader
                    title="POWER"
                    backPath="/vendor"
                />

                <div
                    style={{
                        width: "100%",
                        maxWidth: 520,
                        margin: "0 auto",
                        boxSizing: "border-box",
                    }}
                >

                    {/* DEVICE INFO */}

                    <DeviceInfo
                        data={data}
                        lastUpdated={lastUpdated}
                    />

                    {/* CONTENT */}

                    <div
                        style={{
                            padding:
                                "0 20px 20px",
                        }}
                    >

                        {/* ==================================================
                            SOLAR PANEL DETAILS
                        ================================================== */}

                        <h2
                            style={{
                                fontSize: 15,
                                fontWeight: 800,
                                color: P.textWhite,
                                marginBottom: 12,
                                marginTop: 4,
                                letterSpacing: 0.5,
                                fontFamily:
                                    "'DM Sans', sans-serif",
                            }}
                        >
                            SOLAR PANEL DETAILS
                        </h2>

                        <div
                            style={{
                                background:
                                    P.borderDark,
                                border:
                                    `1.5px solid ${P.borderDark}`,
                                borderRadius: 16,
                                padding: 5,
                                marginBottom: 20,
                                boxShadow:
                                    P.shadowCardRaised,
                                display: "grid",
                                gridTemplateColumns:
                                    "1fr 1fr",
                                gap: 5,
                            }}
                        >

                            {/* PV VOLTAGE */}

                            <div
                                style={metricCard}
                            >

                                <div
                                    style={
                                        metricIconRow
                                    }
                                >

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

                                    <span
                                        style={
                                            metricValue
                                        }
                                    >
                                        {
                                            getParameterValue(
                                                "PV"
                                            )
                                        }{" "}
                                        <span
                                            style={
                                                metricUnit
                                            }
                                        >
                                            V
                                        </span>
                                    </span>

                                </div>

                                <div
                                    style={
                                        metricLabel
                                    }
                                >
                                    PV Voltage
                                </div>

                                <div
                                    style={
                                        metricDesc
                                    }
                                >
                                    Input Voltage
                                </div>

                            </div>

                            {/* PV CURRENT */}

                            <div
                                style={metricCard}
                            >

                                <div
                                    style={
                                        metricIconRow
                                    }
                                >

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

                                    <span
                                        style={
                                            metricValue
                                        }
                                    >
                                        {
                                            getParameterValue(
                                                "PI"
                                            )
                                        }{" "}
                                        <span
                                            style={
                                                metricUnit
                                            }
                                        >
                                            A
                                        </span>
                                    </span>

                                </div>

                                <div
                                    style={
                                        metricLabel
                                    }
                                >
                                    PV Current
                                </div>

                                <div
                                    style={
                                        metricDesc
                                    }
                                >
                                    Input current
                                </div>

                            </div>

                            {/* SOLAR POWER */}

                            <div
                                style={{
                                    ...metricCard,
                                    gridColumn:
                                        "1 / -1",
                                    display: "flex",
                                    alignItems:
                                        "center",
                                    justifyContent:
                                        "space-between",
                                }}
                            >

                                <div>

                                    <div
                                        style={
                                            metricIconRow
                                        }
                                    >

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

                                    <div
                                        style={
                                            metricLabel
                                        }
                                    >
                                        Solar Power
                                    </div>

                                    <div
                                        style={
                                            metricDesc
                                        }
                                    >
                                        Total output
                                    </div>

                                </div>

                                <div
                                    style={{
                                        fontSize: 22,
                                        fontWeight: 800,
                                        color:
                                            P.textPrimary,
                                        fontFamily:
                                            "'DM Sans', sans-serif",
                                    }}
                                >
                                    {
                                        getParameterValue(
                                            "PPOW"
                                        )
                                    }{" "}
                                    <span
                                        style={{
                                            fontSize: 14,
                                            fontWeight: 600,
                                            color:
                                                P.textMuted,
                                        }}
                                    >
                                        kW
                                    </span>
                                </div>

                            </div>

                        </div>

                        {/* ==================================================
                            GENERATION SUMMARY
                        ================================================== */}

                        <h2
                            style={{
                                fontSize: 15,
                                fontWeight: 800,
                                color: P.textWhite,
                                marginBottom: 14,
                                marginTop: 4,
                                letterSpacing: 0.5,
                                fontFamily:
                                    "'DM Sans', sans-serif",
                            }}
                        >
                            GENERATION SUMMARY
                        </h2>

                        <div
                            style={{
                                display: "grid",
                                gridTemplateColumns:
                                    "1fr 1fr 1fr",
                                gap: 10,
                                marginBottom: 16,
                            }}
                        >

                            {/* TODAY */}

                            <div
                                style={statCard}
                            >

                                <div
                                    style={
                                        statIconWrap
                                    }
                                >

                                    <svg
                                        width="18"
                                        height="18"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke={
                                            P.borderStrong
                                        }
                                        strokeWidth="2.5"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    >
                                        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                                    </svg>

                                </div>

                                <div
                                    style={
                                        statSubLabel
                                    }
                                >
                                    TODAY
                                </div>

                                <div
                                    style={{
                                        ...statValue,
                                        color:
                                            P.textAmberBright,
                                    }}
                                >
                                    {energy?.today ??
                                        "--"}
                                </div>

                                <div
                                    style={statUnit}
                                >
                                    kWh
                                </div>

                            </div>

                            {/* MONTH */}

                            <div
                                style={statCard}
                            >

                                <div
                                    style={
                                        statIconWrap
                                    }
                                >

                                    <svg
                                        width="18"
                                        height="18"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke={
                                            P.borderStrong
                                        }
                                        strokeWidth="2.5"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    >
                                        <circle
                                            cx="12"
                                            cy="12"
                                            r="5"
                                        />

                                        <line
                                            x1="12"
                                            y1="1"
                                            x2="12"
                                            y2="3"
                                        />

                                        <line
                                            x1="12"
                                            y1="21"
                                            x2="12"
                                            y2="23"
                                        />

                                        <line
                                            x1="4.22"
                                            y1="4.22"
                                            x2="5.64"
                                            y2="5.64"
                                        />

                                        <line
                                            x1="18.36"
                                            y1="18.36"
                                            x2="19.78"
                                            y2="19.78"
                                        />

                                        <line
                                            x1="1"
                                            y1="12"
                                            x2="3"
                                            y2="12"
                                        />

                                        <line
                                            x1="21"
                                            y1="12"
                                            x2="23"
                                            y2="12"
                                        />

                                        <line
                                            x1="4.22"
                                            y1="19.78"
                                            x2="5.64"
                                            y2="18.36"
                                        />

                                        <line
                                            x1="18.36"
                                            y1="5.64"
                                            x2="19.78"
                                            y2="4.22"
                                        />

                                    </svg>

                                </div>

                                <div
                                    style={
                                        statSubLabel
                                    }
                                >
                                    MONTH
                                </div>

                                <div
                                    style={{
                                        ...statValue,
                                        color:
                                            P.textAmberBright,
                                    }}
                                >
                                    {energy?.monthly ??
                                        "--"}
                                </div>

                                <div
                                    style={statUnit}
                                >
                                    kWh
                                </div>

                            </div>

                            {/* TOTAL */}

                            <div
                                style={statCard}
                            >

                                <div
                                    style={
                                        statIconWrap
                                    }
                                >

                                    <svg
                                        width="18"
                                        height="18"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke={
                                            P.borderStrong
                                        }
                                        strokeWidth="2.5"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    >
                                        <circle
                                            cx="12"
                                            cy="12"
                                            r="10"
                                        />

                                        <polyline points="12 6 12 12 16 14" />

                                    </svg>

                                </div>

                                <div
                                    style={
                                        statSubLabel
                                    }
                                >
                                    TOTAL
                                </div>

                                <div
                                    style={{
                                        ...statValue,
                                        color:
                                            P.textAmberBright,
                                    }}
                                >
                                    {
                                        getParameterValue(
                                            "LKWH"
                                        )
                                    }
                                </div>

                                <div
                                    style={statUnit}
                                >
                                    kWh
                                </div>

                            </div>

                        </div>

                        {/* ==================================================
                            ENERGY CHART
                        ================================================== */}

                        <div
                            style={chartCard}
                        >

                            <div
                                style={{
                                    ...chartHeader,
                                    alignItems:
                                        "center",
                                }}
                            >

                                <span
                                    style={
                                        chartTitle
                                    }
                                >
                                    {chartMode ===
                                    "today"
                                        ? "Today Energy"
                                        : chartMode ===
                                          "monthly"
                                            ? "Monthly Energy"
                                            : "Yearly Energy"}
                                </span>

                                <div
                                    style={{
                                        display:
                                            "flex",
                                        alignItems:
                                            "center",
                                        gap: 8,
                                    }}
                                >

                                    <span
                                        style={
                                            chartBadge
                                        }
                                    >
                                        {Number(
                                            energy?.[
                                                chartMode
                                            ] ?? 0
                                        ).toFixed(2)}{" "}
                                        kWh
                                    </span>

                                    {/* REFRESH */}

                                    <button
                                        onClick={
                                            handleRefreshEnergy
                                        }
                                        disabled={
                                            refreshing
                                        }
                                        title="Refresh energy data"
                                        style={{
                                            width: 34,
                                            height: 34,
                                            border:
                                                `1px solid ${P.border}`,
                                            borderRadius: 8,
                                            background:
                                                refreshing
                                                    ? P.bg
                                                    : P.surface,
                                            color:
                                                P.textPrimary,
                                            display:
                                                "flex",
                                            alignItems:
                                                "center",
                                            justifyContent:
                                                "center",
                                            cursor:
                                                refreshing
                                                    ? "default"
                                                    : "pointer",
                                            padding: 0,
                                            opacity:
                                                refreshing
                                                    ? 0.6
                                                    : 1,
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
                                        >

                                            <path d="M20 11a8.1 8.1 0 0 0-15.5-2" />

                                            <polyline points="4 4 4 9 9 9" />

                                            <path d="M4 13a8.1 8.1 0 0 0 15.5 2" />

                                            <polyline points="20 20 20 15 15 15" />

                                        </svg>

                                    </button>

                                </div>

                            </div>

                            {/* CHART TABS */}

                            <div
                                style={{
                                    display:
                                        "flex",
                                    background:
                                        P.bg,
                                    borderRadius: 10,
                                    padding: 4,
                                    marginBottom: 20,
                                }}
                            >

                                {[
                                    [
                                        "today",
                                        "Today",
                                    ],
                                    [
                                        "monthly",
                                        "Monthly",
                                    ],
                                    [
                                        "yearly",
                                        "Yearly",
                                    ],
                                ].map(
                                    ([
                                        key,
                                        label,
                                    ]) => (

                                        <button
                                            key={key}
                                            onClick={() =>
                                                setChartMode(
                                                    key
                                                )
                                            }
                                            style={{
                                                flex: 1,
                                                border:
                                                    "none",
                                                borderRadius:
                                                    8,
                                                padding:
                                                    "8px 6px",
                                                cursor:
                                                    "pointer",
                                                background:
                                                    chartMode ===
                                                    key
                                                        ? P.amber
                                                        : "transparent",
                                                color:
                                                    chartMode ===
                                                    key
                                                        ? P.surface
                                                        : P.textMuted,
                                                fontSize: 12,
                                                fontWeight: 700,
                                                fontFamily:
                                                    "'Inter', sans-serif",
                                            }}
                                        >
                                            {label}
                                        </button>

                                    )
                                )}

                            </div>

                            {/* CHART */}

                            <EnergyChart
                                data={chartData}
                                color={
                                    P.textAmberBright
                                }
                            />

                            <div
                                style={{
                                    textAlign:
                                        "center",
                                    marginTop: 8,
                                    fontSize: 10,
                                    color:
                                        P.textLight,
                                }}
                            >
                                {chartMode ===
                                "today"
                                    ? "Energy generated per hour"
                                    : chartMode ===
                                      "monthly"
                                        ? "Energy generated per day"
                                        : "Energy generated per month"}
                            </div>

                        </div>

                    </div>

                </div>

                <VendorFooter />

            </div>

        </PageBackground>
    );
}