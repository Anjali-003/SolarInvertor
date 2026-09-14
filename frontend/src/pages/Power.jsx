// import { useInverter } from "../context/Context";
// import Footer from "../components/Footer";
// import DeviceInfo from "../components/DeviceInfo";
// import P from "../theme/colors";
// import { PARAMETER_MAP } from "../constants/parameterMap";
// import { parseKeyword } from "../utils/parseKeyword";
// import PageHeader from "../components/PageHeader";
// // import { useState } from "react";
// import {
//     useEffect,
//     useState
// } from "react";
// import PageBackground from "../components/PageBackground";

// export default function Power() {

//     const {
//         data,
//         lastUpdated,
//         energy,
//         devices,
//         energyCharts,
//         refreshEnergy,
//         selectedDeviceId,
//          chartData,
//     chartMeta,
//     fetchEnergyChart
//     } = useInverter();

//     const [chartMode, setChartMode] = useState("today");
//     const [refreshing, setRefreshing] = useState(false);

//     const [weekOffset, setWeekOffset] =
//     useState(0);

// const [monthOffset, setMonthOffset] =
//     useState(0);

//     // const handleRefreshEnergy = async () => {
//     //     if (refreshing) return;

//     //     try {
//     //         setRefreshing(true);
//     //         await refreshEnergy();
//     //     } catch (err) {
//     //         console.error("Energy refresh failed:", err);
//     //     } finally {
//     //         setRefreshing(false);
//     //     }
//     // };


//     const handleRefreshEnergy =
//     async () => {

//         if (refreshing) {
//             return;
//         }


//         try {

//             setRefreshing(true);


//             let offset = 0;


//             if (
//                 chartMode === "week"
//             ) {

//                 offset =
//                     weekOffset;
//             }


//             if (
//                 chartMode === "month"
//             ) {

//                 offset =
//                     monthOffset;
//             }


//             await Promise.all([
//                 refreshEnergy(),

//                 fetchEnergyChart(
//                     chartMode,
//                     offset
//                 )
//             ]);

//         } catch (err) {

//             console.error(
//                 "Energy refresh failed:",
//                 err
//             );

//         } finally {

//             setRefreshing(false);
//         }
//     };

//     const shouldShowLabel =
//     index => {

//         if (isWeekly) {
//             return true;
//         }

//         if (isMonthly) {

//             return (
//                 index === 0 ||
//                 index % 5 === 0 ||
//                 index ===
//                     safeData.length - 1
//             );
//         }

//         if (isYearly) {
//             return true;
//         }

//         return true;
//     };



//     // const chartData = Array.isArray(energyCharts?.[chartMode])
//     //     ? energyCharts[chartMode]
//     //     : [];

//     const formattedDateTime = (() => {
//         if (!lastUpdated) return { date: "--", time: "--" };

//         const d = new Date(lastUpdated);

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

//     // ── Style objects ─────────────────────────────────────

//     const chartTitles = {

//     today:
//         "Daily Solar Power",

//     week:
//         "Weekly Energy",

//     month:
//         "Monthly Energy",

//     year:
//         "Yearly Energy",
// };

// const currentSolarPower =
//     Number.isFinite(
//         Number(data?.PPOW)
//     )
//         ? Number(data.PPOW) /
//             1000
//         : null;

//     const metricCard = {
//         background: P.surfaceWarm,
//         border: `1px solid ${P.borderAmber}`,
//         borderRadius: 12,
//         padding: "12px 14px",
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
//         border: `1px solid ${P.border}`,
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


//     const SolarPowerLineChart = ({
//     data
// }) => {

//     const safeData =
//         Array.isArray(data)
//             ? data
//             : [];


//     if (
//         safeData.length === 0
//     ) {

//         return (
//             <div
//                 style={{
//                     height: 220,
//                     display: "flex",
//                     alignItems: "center",
//                     justifyContent:
//                         "center",
//                     color: P.textMuted,
//                     fontSize: 13,
//                 }}
//             >
//                 No solar power data available
//             </div>
//         );
//     }


//     const width =
//         500;

//     const height =
//         200;

//     const padding =
//         30;


//     const values =
//         safeData.map(
//             item =>
//                 Number(
//                     item.value
//                 ) || 0
//         );


//     const maxValue =
//         Math.max(
//             ...values,
//             0.1
//         );


//     const points =
//         safeData.map(
//             (
//                 item,
//                 index
//             ) => {

//                 const x =
//                     padding +
//                     (
//                         index /
//                         Math.max(
//                             safeData.length - 1,
//                             1
//                         )
//                     ) *
//                     (
//                         width -
//                         padding * 2
//                     );


//                 const y =
//                     height -
//                     padding -
//                     (
//                         Number(
//                             item.value
//                         ) /
//                         maxValue
//                     ) *
//                     (
//                         height -
//                         padding * 2
//                     );


//                 return {
//                     x,
//                     y,
//                     item
//                 };
//             }
//         );


//     const path =
//         points
//             .map(
//                 (
//                     point,
//                     index
//                 ) =>
//                     `${
//                         index === 0
//                             ? "M"
//                             : "L"
//                     } ${point.x} ${point.y}`
//             )
//             .join(" ");


//     return (
//         <div
//             style={{
//                 width: "100%",
//                 overflowX: "hidden",
//             }}
//         >

//             <svg
//                 viewBox={
//                     `0 0 ${width} ${height}`
//                 }
//                 style={{
//                     width: "100%",
//                     height: 220,
//                 }}
//             >

//                 <line
//                     x1={padding}
//                     y1={
//                         height -
//                         padding
//                     }
//                     x2={
//                         width -
//                         padding
//                     }
//                     y2={
//                         height -
//                         padding
//                     }
//                     stroke={P.border}
//                 />


//                 <line
//                     x1={padding}
//                     y1={padding}
//                     x2={padding}
//                     y2={
//                         height -
//                         padding
//                     }
//                     stroke={P.border}
//                 />


//                 <path
//                     d={path}
//                     fill="none"
//                     stroke={
//                         P.textAmberBright
//                     }
//                     strokeWidth="3"
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                 />


//                 {points.map(
//                     (
//                         point,
//                         index
//                     ) => (

//                         <circle
//                             key={index}
//                             cx={
//                                 point.x
//                             }
//                             cy={
//                                 point.y
//                             }
//                             r="2.5"
//                             fill={
//                                 P.textAmberBright
//                             }
//                         />

//                     )
//                 )}

//             </svg>


//             <div
//                 style={{
//                     display: "flex",
//                     justifyContent:
//                         "space-between",
//                     fontSize: 9,
//                     color: P.textMuted,
//                     padding:
//                         "0 20px",
//                 }}
//             >

//                 <span>
//                     {
//                         safeData[0]
//                             ?.label
//                     }
//                 </span>

//                 <span>
//                     {
//                         safeData[
//                             Math.floor(
//                                 safeData.length /
//                                 2
//                             )
//                         ]?.label
//                     }
//                 </span>

//                 <span>
//                     {
//                         safeData[
//                             safeData.length -
//                             1
//                         ]?.label
//                     }
//                 </span>

//             </div>

//         </div>
//     );
// };

//     useEffect(() => {

//     let offset = 0;


//     if (
//         chartMode === "week"
//     ) {

//         offset =
//             weekOffset;
//     }


//     if (
//         chartMode === "month"
//     ) {

//         offset =
//             monthOffset;
//     }


//     fetchEnergyChart(
//         chartMode,
//         offset
//     );

// }, [
//     chartMode,
//     weekOffset,
//     monthOffset,
//     selectedDeviceId,
//     fetchEnergyChart
// ]);

//     // ── Bar Chart Component ───────────────────────────────

//     const EnergyBarChart = ({ data, color }) => {
//         const safeData = Array.isArray(data) ? data : [];

//         if (safeData.length === 0) {
//             return (
//                 <div
//                     style={{
//                         height: 220,
//                         display: "flex",
//                         alignItems: "center",
//                         justifyContent: "center",
//                         color: P.textMuted,
//                         fontSize: 13,
//                     }}
//                 >
//                     No energy data available
//                 </div>
//             );
//         }

//         const values = safeData.map(
//             item => Number(item.value) || 0
//         );

//         const maxValue = Math.max(...values, 0);

//         // =====================================================
//         // CREATE CLEAN Y-AXIS MAX
//         // Example:
//         //
//         // max = 37  -> 40
//         // max = 82  -> 90
//         // max = 143 -> 150
//         // max = 7   -> 10
//         // =====================================================

//         const getNiceMax = (value) => {
//             if (value <= 0) {
//                 return 10;
//             }

//             const magnitude = Math.pow(
//                 10,
//                 Math.floor(Math.log10(value))
//             );

//             const normalized = value / magnitude;

//             let nice;

//             if (normalized <= 1) {
//                 nice = 1;
//             } else if (normalized <= 2) {
//                 nice = 2;
//             } else if (normalized <= 5) {
//                 nice = 5;
//             } else {
//                 nice = 10;
//             }

//             return nice * magnitude;
//         };

//         const yAxisMax = getNiceMax(maxValue);

//         // =====================================================
//         // Y AXIS TICKS
//         //
//         // Example:
//         // 0
//         // 10
//         // 20
//         // 30
//         // 40
//         // =====================================================

//         const tickCount = 5;
//         const tickStep = yAxisMax / tickCount;

//         const yAxisTicks = Array.from(
//             { length: tickCount + 1 },
//             (_, index) => Math.round(tickStep * index)
//         );

//         // =====================================================
//         // CHART HEIGHT
//         // =====================================================

//         const chartHeight = 240;
//         const plotHeight = 180;

//         // =====================================================
//         // MONTHLY / YEARLY / WEEKLY
//         // =====================================================
//         const isWeekly =
//     mode === "week";

//         const isMonthly =
//             // safeData.length >= 28 && safeData.length <= 31;
//                 mode === "month";


//         const isYearly = 
//         // safeData.length === 12;
//             mode === "year";

//         // =====================================================
//         // LABEL VISIBILITY
//         //
//         // Don't show every hour label on mobile.
//         // =====================================================

//         const shouldShowLabel = (index) => {
//             if (isMonthly) {
//                 // Show every 5th day + last day
//                 return (
//                     index === 0 ||
//                     index % 5 === 0 ||
//                     index === safeData.length - 1
//                 );
//             }

//             if (isYearly) {
//                 return true;
//             }

//             // Today
//             // Show every 3 hours
//             return index % 3 === 0;
//         };


//         const chartDescriptions = {

//     today:
//         "Solar power throughout the day",

//     week:
//         "Energy generated per day",

//     month:
//         "Energy generated per day",

//     year:
//         "Energy generated per month",
// };

//         return (
//             <div
//                 style={{
//                     width: "100%",
//                     overflow: "hidden",
//                     paddingBottom: 8,
//                 }}
//             >
//                 <div
//                     style={{
//                         display: "flex",
//                         width: "100%",
//                         height: chartHeight,
//                     }}
//                 >
//                     {/* Y AXIS */}
//                     <div
//                         style={{
//                             width: 38,
//                             flexShrink: 0,
//                             height: plotHeight,
//                             display: "flex",
//                             flexDirection: "column",
//                             justifyContent: "space-between",
//                             alignItems: "flex-end",
//                             paddingRight: 6,
//                         }}
//                     >
//                         {[...yAxisTicks].reverse().map((tick, index) => (
//                             <span
//                                 key={index}
//                                 style={{
//                                     fontSize: 9,
//                                     color: P.textMuted,
//                                     lineHeight: 1,
//                                 }}
//                             >
//                                 {tick}
//                             </span>
//                         ))}
//                     </div>

//                     {/* GRAPH AREA */}
//                     <div
//                         style={{
//                             flex: 1,
//                             minWidth: 0,
//                             position: "relative",
//                             height: chartHeight,
//                         }}
//                     >
//                         {/* HORIZONTAL GRID LINES */}
//                         <div
//                             style={{
//                                 position: "absolute",
//                                 top: 0,
//                                 left: 0,
//                                 right: 0,
//                                 height: plotHeight,
//                                 pointerEvents: "none",
//                             }}
//                         >
//                             {yAxisTicks.map((tick, index) => {
//                                 const position =
//                                     (1 - tick / yAxisMax) * 100;

//                                 return (
//                                     <div
//                                         key={index}
//                                         style={{
//                                             position: "absolute",
//                                             left: 0,
//                                             right: 0,
//                                             top: `${position}%`,
//                                             borderTop: `1px dashed ${P.border}`,
//                                         }}
//                                     />
//                                 );
//                             })}
//                         </div>

//                         {/* BARS */}
//                         <div
//                             style={{
//                                 position: "absolute",
//                                 left: 0,
//                                 right: 0,
//                                 top: 0,
//                                 height: plotHeight,
//                                 display: "flex",
//                                 alignItems: "flex-end",
//                                 gap: isMonthly ? 2 : 5,
//                                 padding: "0 2px",
//                             }}
//                         >
//                             {safeData.map((item, index) => {
//                                 const value = Number(item.value) || 0;

//                                 const barHeight =
//                                     maxValue > 0
//                                         ? (value / yAxisMax) * plotHeight
//                                         : 2;

//                                 return (
//                                     <div
//                                         key={index}
//                                         style={{
//                                             flex: 1,
//                                             minWidth: 0,
//                                             height: plotHeight,
//                                             display: "flex",
//                                             flexDirection: "column",
//                                             alignItems: "center",
//                                             justifyContent: "flex-end",
//                                             position: "relative",
//                                         }}
//                                     >
//                                         {/* VALUE — always show it, including largest bar */}
//                                         {value > 0 && (
//                                             <div
//                                                 style={{
//                                                     position: "absolute",
//                                                     bottom: Math.min(
//                                                         barHeight + 4,
//                                                         plotHeight - 12
//                                                     ),
//                                                     fontSize: 8,
//                                                     fontWeight: 600,
//                                                     color: P.textMuted,
//                                                     whiteSpace: "nowrap",
//                                                     zIndex: 2,
//                                                 }}
//                                             >
//                                                 {value.toFixed(1)}
//                                             </div>
//                                         )}

//                                         {/* BAR */}
//                                         <div
//                                             style={{
//                                                 width: "100%",
//                                                 maxWidth: isMonthly ? 14 : 28,
//                                                 height: Math.max(
//                                                     barHeight,
//                                                     value > 0 ? 3 : 1
//                                                 ),
//                                                 background:
//                                                     value > 0
//                                                         ? color
//                                                         : `${color}33`,
//                                                 borderRadius: "4px 4px 0 0",
//                                                 transition: "height 0.4s ease",
//                                                 position: "absolute",
//                                                 bottom: 0,
//                                             }}
//                                         />
//                                     </div>
//                                 );
//                             })}
//                         </div>

//                         {/* X AXIS LABELS */}
//                         <div
//                             style={{
//                                 position: "absolute",
//                                 top: plotHeight + 8,
//                                 left: 0,
//                                 right: 0,
//                                 display: "flex",
//                                 alignItems: "center",
//                             }}
//                         >
//                             {safeData.map((item, index) => (
//                                 <div
//                                     key={index}
//                                     style={{
//                                         flex: 1,
//                                         minWidth: 0,
//                                         textAlign: "center",
//                                         fontSize: isMonthly ? 8 : 9,
//                                         color: P.textMuted,
//                                         whiteSpace: "nowrap",
//                                         overflow: "hidden",
//                                         visibility: shouldShowLabel(index)
//                                             ? "visible"
//                                             : "hidden",
//                                     }}
//                                 >
//                                     {item.label}
//                                 </div>
//                             ))}
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         );
//     };

//     const getParameterValue = (parameter) => {
//         return data?.[parameter] ?? "--";
//     };

//     return (
//         <PageBackground>
//             <div style={{ minHeight: "100vh", paddingBottom: "90px", fontFamily: "'Inter', sans-serif" }}>

//                 <PageHeader
//                     title="POWER"
//                     backPath="/"
//                 />

//                 <div
//                     style={{
//                         width: "100%",
//                         maxWidth: 520,
//                         margin: "0 auto",
//                         boxSizing: "border-box",
//                     }}
//                 >

//                     <DeviceInfo
//                         data={data}
//                         lastUpdated={lastUpdated}
//                         devices={devices}
//                         selectedDeviceId={selectedDeviceId}
//                     />

//                     {/* PAGE CONTENT */}
//                     <div style={{ padding: "0 20px 20px" }}>

//                         <h2 style={{ fontSize: 15, fontWeight: 800, color: P.textWhite, marginBottom: 12, marginTop: 4, letterSpacing: 0.5, fontFamily: "'DM Sans', sans-serif" }}>
//                             SOLAR PANEL DETAILS
//                         </h2>

//                         <div style={{ background: P.borderDark, border: `1.5px solid ${P.borderDark}`, borderRadius: 16, padding: "5px", marginBottom: 20, boxShadow: P.shadowCardRaised, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 5 }}>

//                             <div style={metricCard}>
//                                 <div style={metricIconRow}>
//                                     <svg
//                                         width="18"
//                                         height="18"
//                                         viewBox="0 0 24 24"
//                                         fill="none"
//                                         stroke="currentColor"
//                                         strokeWidth="2"
//                                         strokeLinecap="round"
//                                         strokeLinejoin="round"
//                                     >
//                                         <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
//                                     </svg>
//                                     <span style={metricValue}>{getParameterValue("PV")} <span style={metricUnit}>V</span></span>
//                                 </div>
//                                 <div style={metricLabel}>PV Voltage</div>
//                                 <div style={metricDesc}>Input Voltage</div>
//                             </div>

//                             <div style={metricCard}>
//                                 <div style={metricIconRow}>
//                                     <svg
//                                         width="18"
//                                         height="18"
//                                         viewBox="0 0 24 24"
//                                         fill="none"
//                                         stroke="currentColor"
//                                         strokeWidth="2"
//                                         strokeLinecap="round"
//                                         strokeLinejoin="round"
//                                     >
//                                         <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
//                                     </svg>
//                                     <span style={metricValue}>{getParameterValue("PI")} <span style={metricUnit}>A</span></span>
//                                 </div>
//                                 <div style={metricLabel}>PV Current</div>
//                                 <div style={metricDesc}>Input current</div>
//                             </div>

//                             <div style={{ ...metricCard, gridColumn: "1 / -1", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
//                                 <div>
//                                     <div style={metricIconRow}>
//                                         <svg
//                                             width="18"
//                                             height="18"
//                                             viewBox="0 0 24 24"
//                                             fill="none"
//                                             stroke="currentColor"
//                                             strokeWidth="2"
//                                             strokeLinecap="round"
//                                             strokeLinejoin="round"
//                                         >
//                                             <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
//                                         </svg>
//                                     </div>
//                                     <div style={metricLabel}>Solar Power</div>
//                                     <div style={metricDesc}>Total output</div>
//                                 </div>
//                                 <div style={{ fontSize: 22, fontWeight: 800, color: P.textPrimary, fontFamily: "'DM Sans', sans-serif" }}>
//                                     {/* {getParameterValue("PPOW")}  */}
//                                        {Number.isFinite(Number(data?.PPOW))
//             ? (Number(data.PPOW) / 1000).toFixed(3)
//             : "--"}
//                                     <span style={{ fontSize: 14, fontWeight: 600, color: P.textMuted }}>kW</span>
//                                 </div>
//                             </div>

//                         </div>

//                         <h2
//                             style={{
//                                 fontSize: 15,
//                                 fontWeight: 800,
//                                 color: P.textWhite,
//                                 marginBottom: 14,
//                                 marginTop: 4,
//                                 letterSpacing: 0.5,
//                                 fontFamily: "'DM Sans', sans-serif",
//                             }}
//                         >
//                             GENERATION SUMMARY
//                         </h2>

//                         <div
//                             style={{
//                                 display: "grid",
//                                 gridTemplateColumns: "1fr 1fr 1fr",
//                                 gap: 10,
//                                 marginBottom: 16,
//                             }}
//                         >
//                             <div style={statCard}>
//                                 <div style={statIconWrap}>
//                                     <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={P.borderStrong} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
//                                         <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
//                                     </svg>
//                                 </div>
//                                 <div style={statSubLabel}>TODAY</div>
//                                 <div style={{ ...statValue, color: P.textAmberBright }}>{energy?.today ?? "--"}</div>
//                                 <div style={statUnit}>kWh</div>
//                             </div>

//                             <div style={statCard}>
//                                 <div style={statIconWrap}>
//                                     <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={P.borderStrong} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
//                                         <circle cx="12" cy="12" r="5" /><line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" /><line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" /><line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" /><line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
//                                     </svg>
//                                 </div>
//                                 <div style={statSubLabel}>MONTH</div>
//                                 <div style={{ ...statValue, color: P.textAmberBright }}>{energy?.monthly ?? "--"}</div>
//                                 <div style={statUnit}>kWh</div>
//                             </div>

//                             <div style={statCard}>
//                                 <div style={statIconWrap}>
//                                     <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={P.borderStrong} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
//                                         <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
//                                     </svg>
//                                 </div>
//                                 <div style={statSubLabel}>TOTAL</div>
//                                 <div style={{ ...statValue, color: P.textAmberBright }}>{getParameterValue("LKWH")}</div>
//                                 <div style={statUnit}>kWh</div>
//                             </div>
//                         </div>

//                         <div style={chartCard}>

//                             <div
//                                 style={{
//                                     ...chartHeader,
//                                     alignItems: "center"
//                                 }}
//                             >

//                                 <span style={chartTitle}>
//                                     {/* {chartMode === "today"
//                                         ? "Today Energy"
//                                         : chartMode === "monthly"
//                                             ? "Monthly Energy"
//                                             : "Yearly Energy"} */}
//                                             <span style={chartTitle}>
//     {chartTitles[chartMode]}
// </span>
//                                 </span>

//                                 <div
//                                     style={{
//                                         display: "flex",
//                                         alignItems: "center",
//                                         gap: 8
//                                     }}
//                                 >
// {/* 
//                                     <span style={chartBadge}>
//                                         {Number(energy?.[chartMode] ?? 0).toFixed(2)} kWh
//                                     </span> */}

//                                     <span style={chartBadge}>

//     {chartMode === "today"

//         ? `${
//             currentSolarPower !== null
//                 ? currentSolarPower.toFixed(2)
//                 : "--"
//         } kW`

//         : `${
//             Number(
//                 chartMeta?.total ?? 0
//             ).toFixed(2)
//         } kWh`
//     }

// </span>

//                                     <button
//                                         onClick={handleRefreshEnergy}
//                                         disabled={refreshing}
//                                         title="Refresh energy data"
//                                         style={{
//                                             width: 34,
//                                             height: 34,
//                                             border: `1px solid ${P.border}`,
//                                             borderRadius: 8,
//                                             background: refreshing ? P.bg : P.surface,
//                                             color: P.textPrimary,
//                                             display: "flex",
//                                             alignItems: "center",
//                                             justifyContent: "center",
//                                             cursor: refreshing ? "default" : "pointer",
//                                             padding: 0,
//                                             opacity: refreshing ? 0.6 : 1,
//                                             transition: "all 0.2s ease"
//                                         }}
//                                     >
//                                         <svg
//                                             width="16"
//                                             height="16"
//                                             viewBox="0 0 24 24"
//                                             fill="none"
//                                             stroke="currentColor"
//                                             strokeWidth="2"
//                                             strokeLinecap="round"
//                                             strokeLinejoin="round"
//                                             style={{
//                                                 transform: refreshing ? "rotate(360deg)" : "none",
//                                                 transition: refreshing ? "transform 0.8s linear" : "none"
//                                             }}
//                                         >
//                                             <path d="M20 11a8.1 8.1 0 0 0-15.5-2" />
//                                             <polyline points="4 4 4 9 9 9" />
//                                             <path d="M4 13a8.1 8.1 0 0 0 15.5 2" />
//                                             <polyline points="20 20 20 15 15 15" />
//                                         </svg>
//                                     </button>

//                                 </div>

//                             </div>

//                             <div
//                                 style={{
//                                     display: "flex",
//                                     background: P.bg,
//                                     borderRadius: 10,
//                                     padding: 4,
//                                     marginBottom: 20
//                                 }}
//                             >
//                                 {[
//                                     // ["today", "Today"],
//                                     // ["monthly", "Monthly"],
//                                     // ["yearly", "Yearly"]

//                                      ["today", "Today"],
//     ["week", "Week"],
//     ["month", "Month"],
//     ["year", "Year"]
//                                 ].map(([key, label]) => (
//                                     <button
//                                         key={key}
//                                         onClick={() => setChartMode(key)}
//                                         style={{
//                                             flex: 1,
//                                             border: "none",
//                                             borderRadius: 8,
//                                             padding: "8px 6px",
//                                             cursor: "pointer",
//                                             background: chartMode === key ? P.amber : "transparent",
//                                             color: chartMode === key ? P.surface : P.textMuted,
//                                             fontSize: 12,
//                                             fontWeight: 700,
//                                             fontFamily: "'Inter', sans-serif"
//                                         }}
//                                     >
//                                         {label}
//                                     </button>
//                                 ))}
//                             </div>
// {/* 
//                             <EnergyChart
//                                 data={chartData}
//                                 color={P.textAmberBright}
//                             /> */}

//                             {chartMode === "today" ? (

//     <SolarPowerLineChart
//         data={chartData}
//     />

// ) : (

//     <EnergyBarChart
//         data={chartData}
//         color={
//             P.textAmberBright
//         }
//         mode={
//             chartMode
//         }
//     />

// )}

//                             <div
//                                 style={{
//                                     textAlign: "center",
//                                     marginTop: 8,
//                                     fontSize: 10,
//                                     color: P.textLight
//                                 }}
//                             >
//                                 {/* {chartMode === "today"
//                                     ? "Energy generated per hour"
//                                     : chartMode === "monthly"
//                                         ? "Energy generated per day"
//                                         : "Energy generated per month"} */}

//                                         {chartMode === "week" && (

//     <div
//         style={{
//             display: "flex",
//             alignItems: "center",
//             justifyContent:
//                 "space-between",
//             marginBottom: 16,
//         }}
//     >

//         <button
//             onClick={() =>
//                 setWeekOffset(
//                     value =>
//                         value - 1
//                 )
//             }
//             style={{
//                 width: 34,
//                 height: 34,
//                 border:
//                     `1px solid ${P.border}`,
//                 borderRadius: 8,
//                 background:
//                     P.surface,
//                 cursor:
//                     "pointer",
//                 fontSize: 20,
//             }}
//         >
//             ‹
//         </button>


//         <div
//             style={{
//                 fontSize: 12,
//                 fontWeight: 700,
//                 color: P.textPrimary,
//             }}
//         >

//             {chartMeta?.range
//                 ? `${chartMeta.range.start} — ${chartMeta.range.end}`
//                 : "Current week"}

//         </div>


//         <button
//             onClick={() =>
//                 setWeekOffset(
//                     value =>
//                         Math.min(
//                             0,
//                             value + 1
//                         )
//                 )
//             }

//             disabled={
//                 weekOffset === 0
//             }

//             style={{
//                 width: 34,
//                 height: 34,
//                 border:
//                     `1px solid ${P.border}`,
//                 borderRadius: 8,
//                 background:
//                     P.surface,

//                 cursor:
//                     weekOffset === 0
//                         ? "default"
//                         : "pointer",

//                 opacity:
//                     weekOffset === 0
//                         ? 0.4
//                         : 1,

//                 fontSize: 20,
//             }}
//         >
//             ›
//         </button>

//     </div>

// )}{chartMode === "month" && (

//     <div
//         style={{
//             display: "flex",
//             alignItems: "center",
//             justifyContent:
//                 "space-between",
//             marginBottom: 16,
//         }}
//     >

//         <button
//             onClick={() =>
//                 setMonthOffset(
//                     value =>
//                         value - 1
//                 )
//             }
//         >
//             ‹
//         </button>


//         <div
//             style={{
//                 fontSize: 12,
//                 fontWeight: 700,
//                 color: P.textPrimary,
//             }}
//         >
//             {chartMeta?.label ||
//                 "Current month"}
//         </div>


//         <button
//             onClick={() =>
//                 setMonthOffset(
//                     value =>
//                         Math.min(
//                             0,
//                             value + 1
//                         )
//                 )
//             }

//             disabled={
//                 monthOffset === 0
//             }
//         >
//             ›
//         </button>

//     </div>

// )}
//                             </div>

//                         </div>

//                     </div>
//                 </div>

//                 <Footer data={data} />
//             </div>
//         </PageBackground>
//     );
// }




// import { useInverter } from "../context/Context";
// import Footer from "../components/Footer";
// import DeviceInfo from "../components/DeviceInfo";
// import P from "../theme/colors";
// import PageHeader from "../components/PageHeader";
// import {
//     useEffect,
//     useState
// } from "react";
// import PageBackground from "../components/PageBackground";


// export default function Power() {

//     const {
//         data,
//         lastUpdated,
//         energy,
//         devices,
//         refreshEnergy,
//         selectedDeviceId,

//         chartData,
//         chartMeta,
//         fetchEnergyChart
//     } = useInverter();


//     // =====================================================
//     // CHART STATE
//     // =====================================================

//     const [chartMode, setChartMode] =
//         useState("today");

//     const [refreshing, setRefreshing] =
//         useState(false);

//     const [weekOffset, setWeekOffset] =
//         useState(0);

//     const [monthOffset, setMonthOffset] =
//         useState(0);
//     const [yearOffset, setYearOffset] =
//         useState(0);

//     const [todayOffset, setTodayOffset] =
//         useState(0);


//     // =====================================================
//     // RESET NAVIGATION WHEN DEVICE CHANGES
//     // =====================================================

//     useEffect(() => {
//         setTodayOffset(0);
//         setWeekOffset(0);
//         setMonthOffset(0);
//         setYearOffset(0);
//     }, [
//         selectedDeviceId
//     ]);


//     // =====================================================
//     // CURRENT ACTIVE OFFSET
//     // =====================================================
//     const activeOffset =
//         chartMode === "today"
//             ? todayOffset
//             : chartMode === "week"
//                 ? weekOffset
//                 : chartMode === "month"
//                     ? monthOffset
//                     : chartMode === "year"
//                         ? yearOffset
//                         : 0;


//     // =====================================================
//     // FETCH CHART WHEN MODE / OFFSET / DEVICE CHANGES
//     // =====================================================

//     useEffect(() => {

//         if (
//             !selectedDeviceId ||
//             !fetchEnergyChart
//         ) {
//             return;
//         }


//         fetchEnergyChart(
//             chartMode,
//             activeOffset
//         );

//     }, [
//         chartMode,
//         activeOffset,
//         selectedDeviceId,
//         fetchEnergyChart
//     ]);


//     // =====================================================
//     // REFRESH
//     // =====================================================

//     const handleRefreshEnergy =
//         async () => {

//             if (refreshing) {
//                 return;
//             }


//             try {

//                 setRefreshing(true);


//                 await Promise.all([

//                     refreshEnergy(),

//                     fetchEnergyChart(
//                         chartMode,
//                         activeOffset
//                     )

//                 ]);

//             } catch (err) {

//                 console.error(
//                     "Energy refresh failed:",
//                     err
//                 );

//             } finally {

//                 setRefreshing(false);
//             }
//         };


//     // =====================================================
//     // DATE / TIME
//     // =====================================================

//     const formattedDateTime = (() => {

//         if (!lastUpdated) {

//             return {
//                 date: "--",
//                 time: "--"
//             };
//         }


//         const d =
//             new Date(
//                 lastUpdated
//             );


//         return {

//             date:
//                 d.toLocaleDateString(
//                     "en-GB",
//                     {
//                         day: "numeric",
//                         month: "short",
//                         year: "numeric",
//                     }
//                 ),

//             time:
//                 d.toLocaleTimeString(
//                     "en-US",
//                     {
//                         hour: "numeric",
//                         minute: "2-digit",
//                         hour12: true,
//                     }
//                 ),
//         };

//     })();


//     // =====================================================
//     // CHART TEXT
//     // =====================================================

//     const chartTitles = {

//         today:
//             "Daily Solar Power",

//         week:
//             "Weekly Energy",

//         month:
//             "Monthly Energy",

//         year:
//             "Yearly Energy"
//     };


//     const chartDescriptions = {

//         today:
//             "Solar power throughout the day",

//         week:
//             "Energy generated per day",

//         month:
//             "Energy generated per day",

//         year:
//             "Energy generated per month"
//     };


//     // =====================================================
//     // CURRENT SOLAR POWER
//     // PPOW = Watts
//     // Convert to kW
//     // =====================================================

//     const currentSolarPower =
//         Number.isFinite(
//             Number(
//                 data?.PPOW
//             )
//         )
//             ? Number(
//                 data.PPOW
//             ) / 1000
//             : null;


//     // =====================================================
//     // PARAMETER HELPER
//     // =====================================================

//     const getParameterValue =
//         (parameter) => {

//             return (
//                 data?.[parameter] ??
//                 "--"
//             );
//         };


//     // =====================================================
//     // STYLES
//     // =====================================================

//     const metricCard = {

//         background:
//             P.surfaceWarm,

//         border:
//             `1px solid ${P.borderAmber}`,

//         borderRadius:
//             12,

//         padding:
//             "12px 14px"
//     };


//     const metricIconRow = {

//         display:
//             "flex",

//         alignItems:
//             "center",

//         justifyContent:
//             "space-between",

//         marginBottom:
//             6
//     };


//     const metricValue = {

//         fontSize:
//             20,

//         fontWeight:
//             800,

//         color:
//             P.textPrimary,

//         fontFamily:
//             "'DM Sans', sans-serif"
//     };


//     const metricUnit = {

//         fontSize:
//             14,

//         fontWeight:
//             600,

//         color:
//             P.textMuted,

//         fontFamily:
//             "'Inter', sans-serif"
//     };


//     const metricLabel = {

//         fontSize:
//             13,

//         fontWeight:
//             600,

//         color:
//             P.textSecond,

//         fontFamily:
//             "'Inter', sans-serif",

//         marginBottom:
//             2
//     };


//     const metricDesc = {

//         fontSize:
//             11,

//         color:
//             P.textLight,

//         fontFamily:
//             "'Inter', sans-serif"
//     };


//     const statCard = {

//         background:
//             P.surface,

//         borderRadius:
//             14,

//         padding:
//             "14px 10px",

//         textAlign:
//             "center",

//         boxShadow:
//             P.shadowCard,

//         border:
//             `1px solid ${P.border}`
//     };


//     const statIconWrap = {

//         width:
//             36,

//         height:
//             36,

//         borderRadius:
//             "50%",

//         background:
//             P.surfaceAmber,

//         display:
//             "flex",

//         alignItems:
//             "center",

//         justifyContent:
//             "center",

//         margin:
//             "0 auto 8px"
//     };


//     const statSubLabel = {

//         fontSize:
//             9,

//         fontWeight:
//             700,

//         color:
//             P.textLight,

//         letterSpacing:
//             0.5,

//         fontFamily:
//             "'Inter', sans-serif",

//         marginBottom:
//             4,

//         textTransform:
//             "uppercase"
//     };


//     const statValue = {

//         fontSize:
//             20,

//         fontWeight:
//             800,

//         color:
//             P.textPrimary,

//         fontFamily:
//             "'DM Sans', sans-serif",

//         lineHeight:
//             1.1
//     };


//     const statUnit = {

//         fontSize:
//             11,

//         fontWeight:
//             500,

//         color:
//             P.textMuted,

//         fontFamily:
//             "'Inter', sans-serif",

//         marginTop:
//             2
//     };


//     const chartCard = {

//         background:
//             P.surface,

//         borderRadius:
//             16,

//         padding:
//             "16px",

//         marginBottom:
//             14,

//         boxShadow:
//             P.shadowCard,

//         border:
//             `1px solid ${P.border}`
//     };


//     const chartHeader = {

//         display:
//             "flex",

//         justifyContent:
//             "space-between",

//         alignItems:
//             "center",

//         marginBottom:
//             16
//     };


//     const chartTitle = {

//         fontSize:
//             14,

//         fontWeight:
//             600,

//         color:
//             P.textPrimary,

//         fontFamily:
//             "'DM Sans', sans-serif"
//     };


//     const chartBadge = {

//         background:
//             P.amber,

//         color:
//             P.surface,

//         fontSize:
//             12,

//         fontWeight:
//             700,

//         padding:
//             "4px 12px",

//         borderRadius:
//             20,

//         fontFamily:
//             "'Inter', sans-serif",

//         whiteSpace:
//             "nowrap"
//     };


//     const navigationButtonStyle = {

//         width:
//             34,

//         height:
//             34,

//         border:
//             `1px solid ${P.border}`,

//         borderRadius:
//             8,

//         background:
//             P.surface,

//         color:
//             P.textPrimary,

//         display:
//             "flex",

//         alignItems:
//             "center",

//         justifyContent:
//             "center",

//         fontSize:
//             20,

//         padding:
//             0
//     };



//     // =====================================================
//     // TODAY SOLAR POWER LINE CHART
//     // =====================================================

//     const SolarPowerLineChart = ({
//         data
//     }) => {

//         const safeData =
//             Array.isArray(data)
//                 ? data
//                 : [];


//         // if (
//         //     safeData.length === 0
//         // ) {

//         //     return (

//         //         <div
//         //             style={{
//         //                 height:
//         //                     220,

//         //                 display:
//         //                     "flex",

//         //                 alignItems:
//         //                     "center",

//         //                 justifyContent:
//         //                     "center",

//         //                 color:
//         //                     P.textMuted,

//         //                 fontSize:
//         //                     13
//         //             }}
//         //         >
//         //             No solar power data available
//         //         </div>
//         //     );
//         // }


//         const width =
//             500;

//         const height =
//             220;

//         const leftPadding =
//             45;

//         const rightPadding =
//             15;

//         const topPadding =
//             20;

//         const bottomPadding =
//             35;


//         const values =
//             safeData.map(
//                 item =>
//                     Number(
//                         item.value
//                     ) || 0
//             );


//         // const rawMax =
//         //     Math.max(
//         //         ...values,
//         //         0.1
//         //     );

//         const rawMax =
//             safeData.length > 0
//                 ? Math.max(
//                     ...values,
//                     0.1
//                 )
//                 : 1;



//         // -----------------------------------------
//         // NICE Y AXIS MAX
//         // -----------------------------------------

//         const getNiceMax =
//             (value) => {

//                 if (
//                     value <= 0
//                 ) {
//                     return 1;
//                 }


//                 const magnitude =
//                     Math.pow(
//                         10,
//                         Math.floor(
//                             Math.log10(
//                                 value
//                             )
//                         )
//                     );


//                 const normalized =
//                     value /
//                     magnitude;


//                 let nice;


//                 if (
//                     normalized <= 1
//                 ) {

//                     nice = 1;

//                 } else if (
//                     normalized <= 2
//                 ) {

//                     nice = 2;

//                 } else if (
//                     normalized <= 5
//                 ) {

//                     nice = 5;

//                 } else {

//                     nice = 10;
//                 }


//                 return (
//                     nice *
//                     magnitude
//                 );
//             };


//         const yAxisMax =
//             getNiceMax(
//                 rawMax
//             );


//         const tickCount =
//             5;


//         const yTicks =
//             Array.from(
//                 {
//                     length:
//                         tickCount + 1
//                 },
//                 (_, index) =>
//                     Number(
//                         (
//                             yAxisMax /
//                             tickCount *
//                             index
//                         ).toFixed(2)
//                     )
//             );


//         const plotWidth =
//             width -
//             leftPadding -
//             rightPadding;


//         const plotHeight =
//             height -
//             topPadding -
//             bottomPadding;


//         points =
//             safeData.map(
//                 (
//                     item,
//                     index
//                 ) => {

//                     const x =
//                         leftPadding +
//                         (
//                             index /
//                             Math.max(
//                                 safeData.length - 1,
//                                 1
//                             )
//                         ) *
//                         plotWidth;


//                     const value =
//                         Number(
//                             item.value
//                         ) || 0;


//                     const y =
//                         topPadding +
//                         (
//                             1 -
//                             value /
//                             yAxisMax
//                         ) *
//                         plotHeight;
//                     const [
//                         hour,
//                         minute
//                     ] =
//                         item.label
//                             .split(":")
//                             .map(Number);


//                     // Convert time into minutes since midnight
//                     // Example:
//                     // 14:30 -> (14 * 60) + 30 = 870
//                     const minutesFromMidnight =
//                         hour * 60 +
//                         minute;

//                     return {

//                         x,
//                         y,
//                         item
//                     };
//                 }
//             );


//         const path =
//             points
//                 .map(
//                     (
//                         point,
//                         index
//                     ) =>
//                         `${index === 0
//                             ? "M"
//                             : "L"
//                         } ${point.x} ${point.y}`
//                 )
//                 .join(" ");


                

//     {
//         chartMode === "today" && (

//             <div
//                 style={{
//                     display: "flex",
//                     alignItems: "center",
//                     justifyContent: "space-between",
//                     marginBottom: 16
//                 }}
//             >

//                 <button
//                     onClick={() =>
//                         setTodayOffset(
//                             value =>
//                                 value - 1
//                         )
//                     }
//                     style={{
//                         ...navigationButtonStyle,
//                         cursor: "pointer"
//                     }}
//                 >
//                     ‹
//                 </button>


//                 <div
//                     style={{
//                         fontSize: 12,
//                         fontWeight: 700,
//                         color: P.textPrimary,
//                         textAlign: "center"
//                     }}
//                 >
//                     {chartMeta?.label ||
//                         "Today"}
//                 </div>


//                 <button
//                     onClick={() =>
//                         setTodayOffset(
//                             value =>
//                                 Math.min(
//                                     0,
//                                     value + 1
//                                 )
//                         )
//                     }
//                     disabled={
//                         todayOffset === 0
//                     }
//                     style={{
//                         ...navigationButtonStyle,

//                         cursor:
//                             todayOffset === 0
//                                 ? "default"
//                                 : "pointer",

//                         opacity:
//                             todayOffset === 0
//                                 ? 0.4
//                                 : 1
//                     }}
//                 >
//                     ›
//                 </button>

//             </div>
//         )
//     }


//         {
//             chartMode === "today"

//             ? todayOffset === 0

//                 ? `${currentSolarPower !== null
//                     ? currentSolarPower.toFixed(2)
//                     : "--"
//                 } kW`

//                 : `${chartMeta?.label ?? ""}`

//             : `${Number(
//                 chartMeta?.total ?? 0
//             ).toFixed(2)
//             } kWh`
//         }


//         return (

//             <div
//                 style={{
//                     width:
//                         "100%",

//                     overflow:
//                         "hidden"
//                 }}
//             >

//                 <svg
//                     viewBox={
//                         `0 0 ${width} ${height}`
//                     }
//                     style={{
//                         width:
//                             "100%",

//                         height:
//                             230,

//                         display:
//                             "block"
//                     }}
//                 >

//                     {/* GRID + Y AXIS LABELS */}

//                     {[
//                         ...yTicks
//                     ]
//                         .reverse()
//                         .map(
//                             (
//                                 tick,
//                                 index
//                             ) => {

//                                 const y =
//                                     topPadding +
//                                     (
//                                         index /
//                                         tickCount
//                                     ) *
//                                     plotHeight;


//                                 return (

//                                     <g
//                                         key={
//                                             index
//                                         }
//                                     >

//                                         <line
//                                             x1={
//                                                 leftPadding
//                                             }
//                                             y1={
//                                                 y
//                                             }
//                                             x2={
//                                                 width -
//                                                 rightPadding
//                                             }
//                                             y2={
//                                                 y
//                                             }
//                                             stroke={
//                                                 P.border
//                                             }
//                                             strokeDasharray="4 4"
//                                         />


//                                         <text
//                                             x={
//                                                 leftPadding -
//                                                 7
//                                             }
//                                             y={
//                                                 y + 3
//                                             }
//                                             textAnchor="end"
//                                             fontSize="9"
//                                             fill={
//                                                 P.textMuted
//                                             }
//                                         >
//                                             {
//                                                 tick
//                                             }
//                                         </text>

//                                     </g>
//                                 );
//                             }
//                         )}


//                     {/* LINE */}
//                     <path
//                         d={areaPath}
//                         fill={P.textAmberBright}
//                         opacity="0.12"
//                     />

//                     <path
//                         d={path}
//                         fill="none"
//                         stroke={P.textAmberBright}
//                         strokeWidth="3"
//                         strokeLinecap="round"
//                         strokeLinejoin="round"
//                     />


//                     {/* HOURLY DOTS
//                         Backend = 10 minute points.
//                         Every 6th point ≈ 1 hour.
//                     */}

//                     {points.map(
//                         (
//                             point,
//                             index
//                         ) => {

//                             if (
//                                 index % 6 !== 0 &&
//                                 index !==
//                                 points.length - 1
//                             ) {

//                                 return null;
//                             }


//                             return (

//                                 <circle
//                                     key={
//                                         index
//                                     }
//                                     cx={
//                                         point.x
//                                     }
//                                     cy={
//                                         point.y
//                                     }
//                                     r="2.7"
//                                     fill={
//                                         P.textAmberBright
//                                     }
//                                 />
//                             );
//                         }
//                     )}

//                 </svg>


//                 {/* X AXIS TIMES */}

//                 <div
//                     style={{
//                         display:
//                             "flex",

//                         justifyContent:
//                             "space-between",

//                         fontSize:
//                             9,

//                         color:
//                             P.textMuted,

//                         padding:
//                             "0 12px 0 42px"
//                     }}
//                 >

//                     <span>
//                         {
//                             safeData[0]
//                                 ?.label
//                         }
//                     </span>


//                     <span>
//                         {
//                             safeData[
//                                 Math.floor(
//                                     safeData.length /
//                                     2
//                                 )
//                             ]?.label
//                         }
//                     </span>


//                     <span>
//                         {
//                             safeData[
//                                 safeData.length -
//                                 1
//                             ]?.label
//                         }
//                     </span>

//                 </div>

//             </div>
//         );
//     };


//     // =====================================================
//     // ENERGY BAR CHART
//     // WEEK / MONTH / YEAR
//     // =====================================================

//     const EnergyBarChart = ({
//         data,
//         color,
//         mode
//     }) => {

//         const safeData =
//             Array.isArray(data)
//                 ? data
//                 : [];


//         if (
//             safeData.length === 0
//         ) {

//             return (

//                 <div
//                     style={{
//                         height:
//                             220,

//                         display:
//                             "flex",

//                         alignItems:
//                             "center",

//                         justifyContent:
//                             "center",

//                         color:
//                             P.textMuted,

//                         fontSize:
//                             13
//                     }}
//                 >
//                     No energy data available
//                 </div>
//             );
//         }


//         const values =
//             safeData.map(
//                 item =>
//                     Number(
//                         item.value
//                     ) || 0
//             );


//         const maxValue =
//             Math.max(
//                 ...values,
//                 0
//             );


//         // -----------------------------------------
//         // NICE Y AXIS
//         // -----------------------------------------

//         const getNiceMax =
//             (value) => {

//                 if (
//                     value <= 0
//                 ) {
//                     return 10;
//                 }


//                 const magnitude =
//                     Math.pow(
//                         10,
//                         Math.floor(
//                             Math.log10(
//                                 value
//                             )
//                         )
//                     );


//                 const normalized =
//                     value /
//                     magnitude;


//                 let nice;


//                 if (
//                     normalized <= 1
//                 ) {

//                     nice = 1;

//                 } else if (
//                     normalized <= 2
//                 ) {

//                     nice = 2;

//                 } else if (
//                     normalized <= 5
//                 ) {

//                     nice = 5;

//                 } else {

//                     nice = 10;
//                 }


//                 return (
//                     nice *
//                     magnitude
//                 );
//             };


//         const yAxisMax =
//             getNiceMax(
//                 maxValue
//             );


//         const tickCount =
//             5;


//         const tickStep =
//             yAxisMax /
//             tickCount;


//         const yAxisTicks =
//             Array.from(
//                 {
//                     length:
//                         tickCount + 1
//                 },
//                 (_, index) =>
//                     Number(
//                         (
//                             tickStep *
//                             index
//                         ).toFixed(1)
//                     )
//             );


//         const chartHeight =
//             240;

//         const plotHeight =
//             180;


//         const isWeekly =
//             mode === "week";

//         const isMonthly =
//             mode === "month";

//         const isYearly =
//             mode === "year";


//         // -----------------------------------------
//         // X AXIS LABELS
//         // -----------------------------------------

//         const shouldShowLabel =
//             (index) => {

//                 if (
//                     isWeekly
//                 ) {
//                     return true;
//                 }


//                 if (
//                     isMonthly
//                 ) {

//                     return (
//                         index === 0 ||
//                         index % 5 === 0 ||
//                         index ===
//                         safeData.length - 1
//                     );
//                 }


//                 if (
//                     isYearly
//                 ) {
//                     return true;
//                 }


//                 return true;
//             };


//         return (

//             <div
//                 style={{
//                     width:
//                         "100%",

//                     overflow:
//                         "hidden",

//                     paddingBottom:
//                         8
//                 }}
//             >

//                 <div
//                     style={{
//                         display:
//                             "flex",

//                         width:
//                             "100%",

//                         height:
//                             chartHeight
//                     }}
//                 >

//                     {/* Y AXIS */}

//                     <div
//                         style={{
//                             width:
//                                 38,

//                             flexShrink:
//                                 0,

//                             height:
//                                 plotHeight,

//                             display:
//                                 "flex",

//                             flexDirection:
//                                 "column",

//                             justifyContent:
//                                 "space-between",

//                             alignItems:
//                                 "flex-end",

//                             paddingRight:
//                                 6
//                         }}
//                     >

//                         {[
//                             ...yAxisTicks
//                         ]
//                             .reverse()
//                             .map(
//                                 (
//                                     tick,
//                                     index
//                                 ) => (

//                                     <span
//                                         key={
//                                             index
//                                         }
//                                         style={{
//                                             fontSize:
//                                                 9,

//                                             color:
//                                                 P.textMuted,

//                                             lineHeight:
//                                                 1
//                                         }}
//                                     >
//                                         {
//                                             tick
//                                         }
//                                     </span>
//                                 )
//                             )}

//                     </div>


//                     {/* GRAPH AREA */}

//                     <div
//                         style={{
//                             flex:
//                                 1,

//                             minWidth:
//                                 0,

//                             position:
//                                 "relative",

//                             height:
//                                 chartHeight
//                         }}
//                     >

//                         {/* GRID */}

//                         <div
//                             style={{
//                                 position:
//                                     "absolute",

//                                 top:
//                                     0,

//                                 left:
//                                     0,

//                                 right:
//                                     0,

//                                 height:
//                                     plotHeight,

//                                 pointerEvents:
//                                     "none"
//                             }}
//                         >

//                             {yAxisTicks.map(
//                                 (
//                                     tick,
//                                     index
//                                 ) => {

//                                     const position =
//                                         (
//                                             1 -
//                                             tick /
//                                             yAxisMax
//                                         ) *
//                                         100;


//                                     return (

//                                         <div
//                                             key={
//                                                 index
//                                             }
//                                             style={{
//                                                 position:
//                                                     "absolute",

//                                                 left:
//                                                     0,

//                                                 right:
//                                                     0,

//                                                 top:
//                                                     `${position}%`,

//                                                 borderTop:
//                                                     `1px dashed ${P.border}`
//                                             }}
//                                         />
//                                     );
//                                 }
//                             )}

//                         </div>


//                         {/* BARS */}

//                         <div
//                             style={{
//                                 position:
//                                     "absolute",

//                                 left:
//                                     0,

//                                 right:
//                                     0,

//                                 top:
//                                     0,

//                                 height:
//                                     plotHeight,

//                                 display:
//                                     "flex",

//                                 alignItems:
//                                     "flex-end",

//                                 gap:
//                                     isMonthly
//                                         ? 2
//                                         : 5,

//                                 padding:
//                                     "0 2px"
//                             }}
//                         >

//                             {safeData.map(
//                                 (
//                                     item,
//                                     index
//                                 ) => {

//                                     const value =
//                                         Number(
//                                             item.value
//                                         ) || 0;


//                                     const barHeight =
//                                         maxValue > 0
//                                             ? (
//                                                 value /
//                                                 yAxisMax
//                                             ) *
//                                             plotHeight
//                                             : 2;


//                                     return (

//                                         <div
//                                             key={
//                                                 index
//                                             }
//                                             style={{
//                                                 flex:
//                                                     1,

//                                                 minWidth:
//                                                     0,

//                                                 height:
//                                                     plotHeight,

//                                                 display:
//                                                     "flex",

//                                                 flexDirection:
//                                                     "column",

//                                                 alignItems:
//                                                     "center",

//                                                 justifyContent:
//                                                     "flex-end",

//                                                 position:
//                                                     "relative"
//                                             }}
//                                         >

//                                             {/* VALUE */}

//                                             {value > 0 && (

//                                                 <div
//                                                     style={{
//                                                         position:
//                                                             "absolute",

//                                                         bottom:
//                                                             Math.min(
//                                                                 barHeight + 4,
//                                                                 plotHeight - 12
//                                                             ),

//                                                         fontSize:
//                                                             8,

//                                                         fontWeight:
//                                                             600,

//                                                         color:
//                                                             P.textMuted,

//                                                         whiteSpace:
//                                                             "nowrap",

//                                                         zIndex:
//                                                             2
//                                                     }}
//                                                 >
//                                                     {
//                                                         value.toFixed(
//                                                             1
//                                                         )
//                                                     }
//                                                 </div>
//                                             )}


//                                             {/* BAR */}

//                                             <div
//                                                 style={{
//                                                     width:
//                                                         "100%",

//                                                     maxWidth:
//                                                         isMonthly
//                                                             ? 14
//                                                             : 28,

//                                                     height:
//                                                         Math.max(
//                                                             barHeight,
//                                                             value > 0
//                                                                 ? 3
//                                                                 : 1
//                                                         ),

//                                                     background:
//                                                         value > 0
//                                                             ? color
//                                                             : `${color}33`,

//                                                     borderRadius:
//                                                         "4px 4px 0 0",

//                                                     transition:
//                                                         "height 0.4s ease",

//                                                     position:
//                                                         "absolute",

//                                                     bottom:
//                                                         0
//                                                 }}
//                                             />

//                                         </div>
//                                     );
//                                 }
//                             )}

//                         </div>


//                         {/* X AXIS */}

//                         <div
//                             style={{
//                                 position:
//                                     "absolute",

//                                 top:
//                                     plotHeight + 8,

//                                 left:
//                                     0,

//                                 right:
//                                     0,

//                                 display:
//                                     "flex",

//                                 alignItems:
//                                     "center"
//                             }}
//                         >

//                             {safeData.map(
//                                 (
//                                     item,
//                                     index
//                                 ) => (

//                                     <div
//                                         key={
//                                             index
//                                         }
//                                         style={{
//                                             flex:
//                                                 1,

//                                             minWidth:
//                                                 0,

//                                             textAlign:
//                                                 "center",

//                                             fontSize:
//                                                 isMonthly
//                                                     ? 8
//                                                     : 9,

//                                             color:
//                                                 P.textMuted,

//                                             whiteSpace:
//                                                 "nowrap",

//                                             overflow:
//                                                 "hidden",

//                                             visibility:
//                                                 shouldShowLabel(
//                                                     index
//                                                 )
//                                                     ? "visible"
//                                                     : "hidden"
//                                         }}
//                                     >
//                                         {
//                                             item.label
//                                         }
//                                     </div>
//                                 )
//                             )}

//                         </div>

//                     </div>

//                 </div>

//             </div>
//         );
//     };


//     // =====================================================
//     // UI
//     // =====================================================

//     return (

//         <PageBackground>

//             <div
//                 style={{
//                     minHeight:
//                         "100vh",

//                     paddingBottom:
//                         "90px",

//                     fontFamily:
//                         "'Inter', sans-serif"
//                 }}
//             >

//                 <PageHeader
//                     title="POWER"
//                     backPath="/"
//                 />


//                 <div
//                     style={{
//                         width:
//                             "100%",

//                         maxWidth:
//                             520,

//                         margin:
//                             "0 auto",

//                         boxSizing:
//                             "border-box"
//                     }}
//                 >

//                     <DeviceInfo
//                         data={
//                             data
//                         }
//                         lastUpdated={
//                             lastUpdated
//                         }
//                         devices={
//                             devices
//                         }
//                         selectedDeviceId={
//                             selectedDeviceId
//                         }
//                     />


//                     <div
//                         style={{
//                             padding:
//                                 "0 20px 20px"
//                         }}
//                     >

//                         {/* =================================================
//                             SOLAR PANEL DETAILS
//                         ================================================= */}

//                         <h2
//                             style={{
//                                 fontSize:
//                                     15,

//                                 fontWeight:
//                                     800,

//                                 color:
//                                     P.textWhite,

//                                 marginBottom:
//                                     12,

//                                 marginTop:
//                                     4,

//                                 letterSpacing:
//                                     0.5,

//                                 fontFamily:
//                                     "'DM Sans', sans-serif"
//                             }}
//                         >
//                             SOLAR PANEL DETAILS
//                         </h2>


//                         <div
//                             style={{
//                                 background:
//                                     P.borderDark,

//                                 border:
//                                     `1.5px solid ${P.borderDark}`,

//                                 borderRadius:
//                                     16,

//                                 padding:
//                                     "5px",

//                                 marginBottom:
//                                     20,

//                                 boxShadow:
//                                     P.shadowCardRaised,

//                                 display:
//                                     "grid",

//                                 gridTemplateColumns:
//                                     "1fr 1fr",

//                                 gap:
//                                     5
//                             }}
//                         >

//                             {/* PV VOLTAGE */}

//                             <div
//                                 style={
//                                     metricCard
//                                 }
//                             >

//                                 <div
//                                     style={
//                                         metricIconRow
//                                     }
//                                 >

//                                     <svg
//                                         width="18"
//                                         height="18"
//                                         viewBox="0 0 24 24"
//                                         fill="none"
//                                         stroke="currentColor"
//                                         strokeWidth="2"
//                                         strokeLinecap="round"
//                                         strokeLinejoin="round"
//                                     >
//                                         <path
//                                             d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"
//                                         />
//                                     </svg>


//                                     <span
//                                         style={
//                                             metricValue
//                                         }
//                                     >
//                                         {
//                                             getParameterValue(
//                                                 "PV"
//                                             )
//                                         }{" "}

//                                         <span
//                                             style={
//                                                 metricUnit
//                                             }
//                                         >
//                                             V
//                                         </span>
//                                     </span>

//                                 </div>


//                                 <div
//                                     style={
//                                         metricLabel
//                                     }
//                                 >
//                                     PV Voltage
//                                 </div>


//                                 <div
//                                     style={
//                                         metricDesc
//                                     }
//                                 >
//                                     Input Voltage
//                                 </div>

//                             </div>


//                             {/* PV CURRENT */}

//                             <div
//                                 style={
//                                     metricCard
//                                 }
//                             >

//                                 <div
//                                     style={
//                                         metricIconRow
//                                     }
//                                 >

//                                     <svg
//                                         width="18"
//                                         height="18"
//                                         viewBox="0 0 24 24"
//                                         fill="none"
//                                         stroke="currentColor"
//                                         strokeWidth="2"
//                                         strokeLinecap="round"
//                                         strokeLinejoin="round"
//                                     >
//                                         <path
//                                             d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"
//                                         />
//                                     </svg>


//                                     <span
//                                         style={
//                                             metricValue
//                                         }
//                                     >
//                                         {
//                                             getParameterValue(
//                                                 "PI"
//                                             )
//                                         }{" "}

//                                         <span
//                                             style={
//                                                 metricUnit
//                                             }
//                                         >
//                                             A
//                                         </span>
//                                     </span>

//                                 </div>


//                                 <div
//                                     style={
//                                         metricLabel
//                                     }
//                                 >
//                                     PV Current
//                                 </div>


//                                 <div
//                                     style={
//                                         metricDesc
//                                     }
//                                 >
//                                     Input current
//                                 </div>

//                             </div>


//                             {/* SOLAR POWER */}

//                             <div
//                                 style={{
//                                     ...metricCard,

//                                     gridColumn:
//                                         "1 / -1",

//                                     display:
//                                         "flex",

//                                     alignItems:
//                                         "center",

//                                     justifyContent:
//                                         "space-between"
//                                 }}
//                             >

//                                 <div>

//                                     <div
//                                         style={
//                                             metricIconRow
//                                         }
//                                     >

//                                         <svg
//                                             width="18"
//                                             height="18"
//                                             viewBox="0 0 24 24"
//                                             fill="none"
//                                             stroke="currentColor"
//                                             strokeWidth="2"
//                                             strokeLinecap="round"
//                                             strokeLinejoin="round"
//                                         >
//                                             <path
//                                                 d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"
//                                             />
//                                         </svg>

//                                     </div>


//                                     <div
//                                         style={
//                                             metricLabel
//                                         }
//                                     >
//                                         Solar Power
//                                     </div>


//                                     <div
//                                         style={
//                                             metricDesc
//                                         }
//                                     >
//                                         Total output
//                                     </div>

//                                 </div>


//                                 <div
//                                     style={{
//                                         fontSize:
//                                             22,

//                                         fontWeight:
//                                             800,

//                                         color:
//                                             P.textPrimary,

//                                         fontFamily:
//                                             "'DM Sans', sans-serif"
//                                     }}
//                                 >

//                                     {
//                                         currentSolarPower !==
//                                             null
//                                             ? currentSolarPower.toFixed(
//                                                 3
//                                             )
//                                             : "--"
//                                     }


//                                     <span
//                                         style={{
//                                             fontSize:
//                                                 14,

//                                             fontWeight:
//                                                 600,

//                                             color:
//                                                 P.textMuted
//                                         }}
//                                     >
//                                         {" "}kW
//                                     </span>

//                                 </div>

//                             </div>

//                         </div>


//                         {/* =================================================
//                             GENERATION SUMMARY
//                         ================================================= */}

//                         <h2
//                             style={{
//                                 fontSize:
//                                     15,

//                                 fontWeight:
//                                     800,

//                                 color:
//                                     P.textWhite,

//                                 marginBottom:
//                                     14,

//                                 marginTop:
//                                     4,

//                                 letterSpacing:
//                                     0.5,

//                                 fontFamily:
//                                     "'DM Sans', sans-serif"
//                             }}
//                         >
//                             GENERATION SUMMARY
//                         </h2>


//                         <div
//                             style={{
//                                 display:
//                                     "grid",

//                                 gridTemplateColumns:
//                                     "1fr 1fr 1fr",

//                                 gap:
//                                     10,

//                                 marginBottom:
//                                     16
//                             }}
//                         >

//                             {/* TODAY */}

//                             <div
//                                 style={
//                                     statCard
//                                 }
//                             >

//                                 <div
//                                     style={
//                                         statIconWrap
//                                     }
//                                 >

//                                     <svg
//                                         width="18"
//                                         height="18"
//                                         viewBox="0 0 24 24"
//                                         fill="none"
//                                         stroke={
//                                             P.borderStrong
//                                         }
//                                         strokeWidth="2.5"
//                                         strokeLinecap="round"
//                                         strokeLinejoin="round"
//                                     >
//                                         <polygon
//                                             points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"
//                                         />
//                                     </svg>

//                                 </div>


//                                 <div
//                                     style={
//                                         statSubLabel
//                                     }
//                                 >
//                                     TODAY
//                                 </div>


//                                 <div
//                                     style={{
//                                         ...statValue,

//                                         color:
//                                             P.textAmberBright
//                                     }}
//                                 >
//                                     {
//                                         energy?.today ??
//                                         "--"
//                                     }
//                                 </div>


//                                 <div
//                                     style={
//                                         statUnit
//                                     }
//                                 >
//                                     kWh
//                                 </div>

//                             </div>


//                             {/* MONTH */}

//                             <div
//                                 style={
//                                     statCard
//                                 }
//                             >

//                                 <div
//                                     style={
//                                         statIconWrap
//                                     }
//                                 >

//                                     <svg
//                                         width="18"
//                                         height="18"
//                                         viewBox="0 0 24 24"
//                                         fill="none"
//                                         stroke={
//                                             P.borderStrong
//                                         }
//                                         strokeWidth="2.5"
//                                         strokeLinecap="round"
//                                         strokeLinejoin="round"
//                                     >

//                                         <circle
//                                             cx="12"
//                                             cy="12"
//                                             r="5"
//                                         />

//                                         <line
//                                             x1="12"
//                                             y1="1"
//                                             x2="12"
//                                             y2="3"
//                                         />

//                                         <line
//                                             x1="12"
//                                             y1="21"
//                                             x2="12"
//                                             y2="23"
//                                         />

//                                         <line
//                                             x1="4.22"
//                                             y1="4.22"
//                                             x2="5.64"
//                                             y2="5.64"
//                                         />

//                                         <line
//                                             x1="18.36"
//                                             y1="18.36"
//                                             x2="19.78"
//                                             y2="19.78"
//                                         />

//                                         <line
//                                             x1="1"
//                                             y1="12"
//                                             x2="3"
//                                             y2="12"
//                                         />

//                                         <line
//                                             x1="21"
//                                             y1="12"
//                                             x2="23"
//                                             y2="12"
//                                         />

//                                     </svg>

//                                 </div>


//                                 <div
//                                     style={
//                                         statSubLabel
//                                     }
//                                 >
//                                     MONTH
//                                 </div>


//                                 <div
//                                     style={{
//                                         ...statValue,

//                                         color:
//                                             P.textAmberBright
//                                     }}
//                                 >
//                                     {
//                                         energy?.monthly ??
//                                         "--"
//                                     }
//                                 </div>


//                                 <div
//                                     style={
//                                         statUnit
//                                     }
//                                 >
//                                     kWh
//                                 </div>

//                             </div>


//                             {/* TOTAL */}

//                             <div
//                                 style={
//                                     statCard
//                                 }
//                             >

//                                 <div
//                                     style={
//                                         statIconWrap
//                                     }
//                                 >

//                                     <svg
//                                         width="18"
//                                         height="18"
//                                         viewBox="0 0 24 24"
//                                         fill="none"
//                                         stroke={
//                                             P.borderStrong
//                                         }
//                                         strokeWidth="2.5"
//                                         strokeLinecap="round"
//                                         strokeLinejoin="round"
//                                     >

//                                         <circle
//                                             cx="12"
//                                             cy="12"
//                                             r="10"
//                                         />

//                                         <polyline
//                                             points="12 6 12 12 16 14"
//                                         />

//                                     </svg>

//                                 </div>


//                                 <div
//                                     style={
//                                         statSubLabel
//                                     }
//                                 >
//                                     TOTAL
//                                 </div>


//                                 <div
//                                     style={{
//                                         ...statValue,

//                                         color:
//                                             P.textAmberBright
//                                     }}
//                                 >
//                                     {
//                                         getParameterValue(
//                                             "LKWH"
//                                         )
//                                     }
//                                 </div>


//                                 <div
//                                     style={
//                                         statUnit
//                                     }
//                                 >
//                                     kWh
//                                 </div>

//                             </div>

//                         </div>


//                         {/* =================================================
//                             CHART CARD
//                         ================================================= */}

//                         <div
//                             style={
//                                 chartCard
//                             }
//                         >

//                             {/* HEADER */}

//                             <div
//                                 style={
//                                     chartHeader
//                                 }
//                             >

//                                 <span
//                                     style={
//                                         chartTitle
//                                     }
//                                 >
//                                     {
//                                         chartTitles[
//                                         chartMode
//                                         ]
//                                     }
//                                 </span>


//                                 <div
//                                     style={{
//                                         display:
//                                             "flex",

//                                         alignItems:
//                                             "center",

//                                         gap:
//                                             8
//                                     }}
//                                 >

//                                     {/* BADGE */}

//                                     <span
//                                         style={
//                                             chartBadge
//                                         }
//                                     >

//                                         {chartMode === "today"

//                                             ? todayOffset === 0

//                                                 ? `${currentSolarPower !== null
//                                                     ? currentSolarPower.toFixed(2)
//                                                     : "--"
//                                                 } kW`

//                                                 : `${chartMeta?.label ?? ""}`

//                                             : `${Number(
//                                                 chartMeta?.total ?? 0
//                                             ).toFixed(2)
//                                             } kWh`
//                                         }

//                                     </span>


//                                     {/* REFRESH */}

//                                     <button
//                                         onClick={
//                                             handleRefreshEnergy
//                                         }
//                                         disabled={
//                                             refreshing
//                                         }
//                                         title="Refresh energy data"
//                                         style={{
//                                             width:
//                                                 34,

//                                             height:
//                                                 34,

//                                             border:
//                                                 `1px solid ${P.border}`,

//                                             borderRadius:
//                                                 8,

//                                             background:
//                                                 refreshing
//                                                     ? P.bg
//                                                     : P.surface,

//                                             color:
//                                                 P.textPrimary,

//                                             display:
//                                                 "flex",

//                                             alignItems:
//                                                 "center",

//                                             justifyContent:
//                                                 "center",

//                                             cursor:
//                                                 refreshing
//                                                     ? "default"
//                                                     : "pointer",

//                                             padding:
//                                                 0,

//                                             opacity:
//                                                 refreshing
//                                                     ? 0.6
//                                                     : 1
//                                         }}
//                                     >

//                                         <svg
//                                             width="16"
//                                             height="16"
//                                             viewBox="0 0 24 24"
//                                             fill="none"
//                                             stroke="currentColor"
//                                             strokeWidth="2"
//                                             strokeLinecap="round"
//                                             strokeLinejoin="round"
//                                         >

//                                             <path
//                                                 d="M20 11a8.1 8.1 0 0 0-15.5-2"
//                                             />

//                                             <polyline
//                                                 points="4 4 4 9 9 9"
//                                             />

//                                             <path
//                                                 d="M4 13a8.1 8.1 0 0 0 15.5 2"
//                                             />

//                                             <polyline
//                                                 points="20 20 20 15 15 15"
//                                             />

//                                         </svg>

//                                         <div
//                                             style={{
//                                                 display: "flex",
//                                                 justifyContent: "space-between",
//                                                 fontSize: 9,
//                                                 color: P.textMuted,
//                                                 padding: "0 12px 0 42px"
//                                             }}
//                                         >
//                                             <span>00:00</span>
//                                             <span>06:00</span>
//                                             <span>12:00</span>
//                                             <span>18:00</span>
//                                             <span>24:00</span>
//                                         </div>

//                                     </button>

//                                 </div>

//                             </div>


//                             {/* MODE TABS */}

//                             <div
//                                 style={{
//                                     display:
//                                         "flex",

//                                     background:
//                                         P.bg,

//                                     borderRadius:
//                                         10,

//                                     padding:
//                                         4,

//                                     marginBottom:
//                                         18
//                                 }}
//                             >

//                                 {[
//                                     [
//                                         "today",
//                                         "Today"
//                                     ],

//                                     [
//                                         "week",
//                                         "Week"
//                                     ],

//                                     [
//                                         "month",
//                                         "Month"
//                                     ],

//                                     [
//                                         "year",
//                                         "Year"
//                                     ]
//                                 ].map(
//                                     ([
//                                         key,
//                                         label
//                                     ]) => (

//                                         <button
//                                             key={
//                                                 key
//                                             }
//                                             onClick={() =>
//                                                 setChartMode(
//                                                     key
//                                                 )
//                                             }
//                                             style={{
//                                                 flex:
//                                                     1,

//                                                 border:
//                                                     "none",

//                                                 borderRadius:
//                                                     8,

//                                                 padding:
//                                                     "8px 4px",

//                                                 cursor:
//                                                     "pointer",

//                                                 background:
//                                                     chartMode ===
//                                                         key
//                                                         ? P.amber
//                                                         : "transparent",

//                                                 color:
//                                                     chartMode ===
//                                                         key
//                                                         ? P.surface
//                                                         : P.textMuted,

//                                                 fontSize:
//                                                     11,

//                                                 fontWeight:
//                                                     700,

//                                                 fontFamily:
//                                                     "'Inter', sans-serif"
//                                             }}
//                                         >
//                                             {
//                                                 label
//                                             }
//                                         </button>
//                                     )
//                                 )}

//                             </div>


//                             {/* =================================================
//                                 WEEK NAVIGATION
//                             ================================================= */}

//                             {chartMode ===
//                                 "week" && (

//                                     <div
//                                         style={{
//                                             display:
//                                                 "flex",

//                                             alignItems:
//                                                 "center",

//                                             justifyContent:
//                                                 "space-between",

//                                             marginBottom:
//                                                 16
//                                         }}
//                                     >

//                                         <button
//                                             onClick={() =>
//                                                 setWeekOffset(
//                                                     value =>
//                                                         value -
//                                                         1
//                                                 )
//                                             }
//                                             style={{
//                                                 ...navigationButtonStyle,

//                                                 cursor:
//                                                     "pointer"
//                                             }}
//                                         >
//                                             ‹
//                                         </button>


//                                         <div
//                                             style={{
//                                                 fontSize:
//                                                     12,

//                                                 fontWeight:
//                                                     700,

//                                                 color:
//                                                     P.textPrimary,

//                                                 textAlign:
//                                                     "center"
//                                             }}
//                                         >

//                                             {chartMeta?.range

//                                                 ? `${chartMeta.range.start} — ${chartMeta.range.end}`

//                                                 : "Current week"
//                                             }

//                                         </div>


//                                         <button
//                                             onClick={() =>
//                                                 setWeekOffset(
//                                                     value =>
//                                                         Math.min(
//                                                             0,
//                                                             value +
//                                                             1
//                                                         )
//                                                 )
//                                             }
//                                             disabled={
//                                                 weekOffset ===
//                                                 0
//                                             }
//                                             style={{
//                                                 ...navigationButtonStyle,

//                                                 cursor:
//                                                     weekOffset ===
//                                                         0
//                                                         ? "default"
//                                                         : "pointer",

//                                                 opacity:
//                                                     weekOffset ===
//                                                         0
//                                                         ? 0.4
//                                                         : 1
//                                             }}
//                                         >
//                                             ›
//                                         </button>

//                                     </div>
//                                 )}


//                             {/* =================================================
//                                 MONTH NAVIGATION
//                             ================================================= */}

//                             {chartMode ===
//                                 "month" && (

//                                     <div
//                                         style={{
//                                             display:
//                                                 "flex",

//                                             alignItems:
//                                                 "center",

//                                             justifyContent:
//                                                 "space-between",

//                                             marginBottom:
//                                                 16
//                                         }}
//                                     >

//                                         <button
//                                             onClick={() =>
//                                                 setMonthOffset(
//                                                     value =>
//                                                         value -
//                                                         1
//                                                 )
//                                             }
//                                             style={{
//                                                 ...navigationButtonStyle,

//                                                 cursor:
//                                                     "pointer"
//                                             }}
//                                         >
//                                             ‹
//                                         </button>


//                                         <div
//                                             style={{
//                                                 fontSize:
//                                                     12,

//                                                 fontWeight:
//                                                     700,

//                                                 color:
//                                                     P.textPrimary,

//                                                 textAlign:
//                                                     "center"
//                                             }}
//                                         >
//                                             {
//                                                 chartMeta?.label ||
//                                                 "Current month"
//                                             }
//                                         </div>


//                                         <button
//                                             onClick={() =>
//                                                 setMonthOffset(
//                                                     value =>
//                                                         Math.min(
//                                                             0,
//                                                             value +
//                                                             1
//                                                         )
//                                                 )
//                                             }
//                                             disabled={
//                                                 monthOffset ===
//                                                 0
//                                             }
//                                             style={{
//                                                 ...navigationButtonStyle,

//                                                 cursor:
//                                                     monthOffset ===
//                                                         0
//                                                         ? "default"
//                                                         : "pointer",

//                                                 opacity:
//                                                     monthOffset ===
//                                                         0
//                                                         ? 0.4
//                                                         : 1
//                                             }}
//                                         >
//                                             ›
//                                         </button>

//                                     </div>
//                                 )}

//                             {chartMode === "year" && (

//                                 <div
//                                     style={{
//                                         display: "flex",
//                                         alignItems: "center",
//                                         justifyContent: "space-between",
//                                         marginBottom: 16
//                                     }}
//                                 >

//                                     <button
//                                         onClick={() =>
//                                             setYearOffset(
//                                                 value => value - 1
//                                             )
//                                         }
//                                         style={{
//                                             ...navigationButtonStyle,
//                                             cursor: "pointer"
//                                         }}
//                                     >
//                                         ‹
//                                     </button>


//                                     <div
//                                         style={{
//                                             fontSize: 12,
//                                             fontWeight: 700,
//                                             color: P.textPrimary,
//                                             textAlign: "center"
//                                         }}
//                                     >
//                                         {chartMeta?.label ||
//                                             "Current year"}
//                                     </div>


//                                     <button
//                                         onClick={() =>
//                                             setYearOffset(
//                                                 value =>
//                                                     Math.min(
//                                                         0,
//                                                         value + 1
//                                                     )
//                                             )
//                                         }
//                                         disabled={
//                                             yearOffset === 0
//                                         }
//                                         style={{
//                                             ...navigationButtonStyle,

//                                             cursor:
//                                                 yearOffset === 0
//                                                     ? "default"
//                                                     : "pointer",

//                                             opacity:
//                                                 yearOffset === 0
//                                                     ? 0.4
//                                                     : 1
//                                         }}
//                                     >
//                                         ›
//                                     </button>

//                                 </div>
//                             )}


//                             {/* =================================================
//                                 CHART
//                             ================================================= */}

//                             {chartMode ===
//                                 "today"

//                                 ? (

//                                     <SolarPowerLineChart
//                                         data={
//                                             chartData
//                                         }
//                                     />

//                                 )

//                                 : (

//                                     <EnergyBarChart
//                                         data={
//                                             chartData
//                                         }
//                                         color={
//                                             P.textAmberBright
//                                         }
//                                         mode={
//                                             chartMode
//                                         }
//                                     />
//                                 )
//                             }


//                             {/* DESCRIPTION */}

//                             <div
//                                 style={{
//                                     textAlign:
//                                         "center",

//                                     marginTop:
//                                         8,

//                                     fontSize:
//                                         10,

//                                     color:
//                                         P.textLight
//                                 }}
//                             >
//                                 {
//                                     chartDescriptions[
//                                     chartMode
//                                     ]
//                                 }
//                             </div>

//                         </div>

//                     </div>

//                 </div>


//                 <Footer
//                     data={
//                         data
//                     }
//                 />

//             </div>

//         </PageBackground>
//     );
// }



import { useInverter } from "../context/Context";
import Footer from "../components/Footer";
import DeviceInfo from "../components/DeviceInfo";
import P from "../theme/colors";
import PageHeader from "../components/PageHeader";
import { useEffect, useState } from "react";
import PageBackground from "../components/PageBackground";

export default function Power() {
    const {
        data,
        lastUpdated,
        energy,
        devices,
        refreshEnergy,
        selectedDeviceId,
        chartData,
        chartMeta,
        fetchEnergyChart
    } = useInverter();

    // CHART STATE
    const [chartMode, setChartMode] = useState("today");
    const [refreshing, setRefreshing] = useState(false);
    const [weekOffset, setWeekOffset] = useState(0);
    const [monthOffset, setMonthOffset] = useState(0);
    const [yearOffset, setYearOffset] = useState(0);
    const [todayOffset, setTodayOffset] = useState(0);

    // RESET NAVIGATION WHEN DEVICE CHANGES
    useEffect(() => {
        setTodayOffset(0);
        setWeekOffset(0);
        setMonthOffset(0);
        setYearOffset(0);
    }, [selectedDeviceId]);

    // CURRENT ACTIVE OFFSET
    const activeOffset =
        chartMode === "today" ? todayOffset :
        chartMode === "week" ? weekOffset :
        chartMode === "month" ? monthOffset :
        chartMode === "year" ? yearOffset : 0;

    // FETCH CHART WHEN MODE / OFFSET / DEVICE CHANGES
    useEffect(() => {
        if (!selectedDeviceId || !fetchEnergyChart) return;
        fetchEnergyChart(chartMode, activeOffset);
    }, [chartMode, activeOffset, selectedDeviceId, fetchEnergyChart]);

    // REFRESH
    const handleRefreshEnergy = async () => {
        if (refreshing) return;
        try {
            setRefreshing(true);
            await Promise.all([
                refreshEnergy(),
                fetchEnergyChart(chartMode, activeOffset)
            ]);
        } catch (err) {
            console.error("Energy refresh failed:", err);
        } finally {
            setRefreshing(false);
        }
    };

    // DATE / TIME
    const formattedDateTime = (() => {
        if (!lastUpdated) return { date: "--", time: "--" };
        const d = new Date(lastUpdated);
        return {
            date: d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }),
            time: d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true })
        };
    })();

    // CHART TEXT
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

    // CURRENT SOLAR POWER
    // PPOW = Watts
    // const currentSolarPower = Number.isFinite(Number(data?.PPOW)) ? Number(data.PPOW) / 1000 : null;
    const currentSolarPower = Number.isFinite(Number(data?.PPOW)) ? Number(data.PPOW) : null;

    // PARAMETER HELPER
    const getParameterValue = (parameter) => data?.[parameter] ?? "--";

    // STYLES
    const metricCard = { background: P.surfaceWarm, border: `1px solid ${P.borderAmber}`, borderRadius: 12, padding: "12px 14px" };
    const metricIconRow = { display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 };
    const metricValue = { fontSize: 20, fontWeight: 800, color: P.textPrimary, fontFamily: "'DM Sans', sans-serif" };
    const metricUnit = { fontSize: 14, fontWeight: 600, color: P.textMuted, fontFamily: "'Inter', sans-serif" };
    const metricLabel = { fontSize: 13, fontWeight: 600, color: P.textSecond, fontFamily: "'Inter', sans-serif", marginBottom: 2 };
    const metricDesc = { fontSize: 11, color: P.textLight, fontFamily: "'Inter', sans-serif" };
    const statCard = { background: P.surface, borderRadius: 14, padding: "14px 10px", textAlign: "center", boxShadow: P.shadowCard, border: `1px solid ${P.border}` };
    const statIconWrap = { width: 36, height: 36, borderRadius: "50%", background: P.surfaceAmber, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 8px" };
    const statSubLabel = { fontSize: 9, fontWeight: 700, color: P.textLight, letterSpacing: 0.5, fontFamily: "'Inter', sans-serif", marginBottom: 4, textTransform: "uppercase" };
    const statValue = { fontSize: 20, fontWeight: 800, color: P.textPrimary, fontFamily: "'DM Sans', sans-serif", lineHeight: 1.1 };
    const statUnit = { fontSize: 11, fontWeight: 500, color: P.textMuted, fontFamily: "'Inter', sans-serif", marginTop: 2 };
    const chartCard = { background: P.surface, borderRadius: 16, padding: "16px", marginBottom: 14, boxShadow: P.shadowCard, border: `1px solid ${P.border}` };
    const chartHeader = { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 };
    const chartTitle = { fontSize: 14, fontWeight: 600, color: P.textPrimary, fontFamily: "'DM Sans', sans-serif" };
    const chartBadge = { background: P.amber, color: P.surface, fontSize: 12, fontWeight: 700, padding: "4px 12px", borderRadius: 20, fontFamily: "'Inter', sans-serif", whiteSpace: "nowrap" };
    const navigationButtonStyle = { width: 34, height: 34, border: `1px solid ${P.border}`, borderRadius: 8, background: P.surface, color: P.textPrimary, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, padding: 0 };

    // TODAY SOLAR POWER LINE CHART
    const SolarPowerLineChart = ({ data }) => {
        const safeData = Array.isArray(data) ? data : [];

        const width = 500;
        const height = 220;
        const leftPadding = 45;
        const rightPadding = 15;
        const topPadding = 20;
        const bottomPadding = 35;

        const getMinutes = (label) => {
            if (typeof label !== "string" || !label.includes(":")) return null;
            const parts = label.split(":");
            const hour = Number(parts[0]);
            const minute = Number(parts[1]);
            if (!Number.isFinite(hour) || !Number.isFinite(minute)) return null;
            return hour * 60 + minute;
        };

        const validData = safeData.filter((item) => {
            const minutes = getMinutes(item?.label);
            const value = Number(item?.value);
            return minutes !== null && Number.isFinite(value);
        });

        // const firstMinute = safeData.length > 0 ? getMinutes(safeData[0].label) : 0;
        // const lastMinute = safeData.length > 0 ? getMinutes(safeData[safeData.length - 1].label) : 1440;
        // const timeRange = Math.max(lastMinute - firstMinute, 1);

        const firstMinute = validData.length > 0 ? getMinutes(validData[0].label) : 0;
        const lastMinute = validData.length > 0 ? getMinutes(validData[validData.length - 1].label) : 1;
        const timeRange = Math.max(lastMinute - firstMinute, 1);

        const values = safeData.map((item) => Number(item.value) || 0);
        const rawMax = validData.length > 0 ? Math.max(...validData.map((item) => Number(item.value) || 0)) : 0;

        const xLabelCount = 8;
        const xLabelIndexes = Array.from({ length: xLabelCount }, (_, index) =>
            Math.round((index / (xLabelCount - 1)) * Math.max(safeData.length - 1, 0))
        );

        // NICE Y AXIS MAX
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

        // const yAxisMax = getNiceMax(rawMax);
        const yAxisMax = Math.max(getNiceMax(rawMax), 1);

        const tickCount = 5;
        const yTicks = Array.from({ length: tickCount + 1 }, (_, index) =>
            Number(((yAxisMax / tickCount) * index).toFixed(2))
        );

        const plotWidth = width - leftPadding - rightPadding;
        const plotHeight = height - topPadding - bottomPadding;

        // const points = safeData.map((item) => {
        //     const currentMinute = getMinutes(item.label);
        //     const x = leftPadding + ((currentMinute - firstMinute) / timeRange) * plotWidth;
        //     const value = Number(item.value) || 0;
        //     const y = topPadding + (1 - value / yAxisMax) * plotHeight;
        //     return { x, y, item };
        // });

        const points = validData.map((item) => {
            const currentMinute = getMinutes(item.label);
            const value = Number(item.value);
            const x = leftPadding + ((currentMinute - firstMinute) / timeRange) * plotWidth;
            const y = topPadding + (1 - value / yAxisMax) * plotHeight;
            return { x, y, item };
        });

        // const points = safeData.map((item, index) => {
        //     const x = leftPadding + (index / Math.max(safeData.length - 1, 1)) * plotWidth;
        //     const value = Number(item.value) || 0;
        //     const y = topPadding + (1 - value / yAxisMax) * plotHeight;
        //     return { x, y, item };
        // });

        const path = points.map((point, index) => `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`).join(" ");

        // FILLED AREA UNDER THE LINE
        const baselineY = topPadding + plotHeight;
        const areaPath =
            points.length > 0
                ? `M ${points[0].x} ${baselineY} ` +
                  points.map((point) => `L ${point.x} ${point.y}`).join(" ") +
                  ` L ${points[points.length - 1].x} ${baselineY} Z`
                : "";

        return (
            <div style={{ width: "100%", overflow: "hidden" }}>
                <svg viewBox={`0 0 ${width} ${height}`} style={{ width: "100%", height: 230, display: "block" }}>
                    {/* GRID + Y AXIS LABELS */}
                    {[...yTicks].reverse().map((tick, index) => {
                        const y = topPadding + (index / tickCount) * plotHeight;
                        return (
                            <g key={index}>
                                <line x1={leftPadding} y1={y} x2={width - rightPadding} y2={y} stroke={P.border} strokeDasharray="4 4" />
                                <text x={leftPadding - 7} y={y + 3} textAnchor="end" fontSize="9" fill={P.textMuted}>{tick}</text>
                            </g>
                        );
                    })}

                    {/* AREA + LINE */}
                    <path d={areaPath} fill={P.textAmberBright} opacity="0.12" />
                    <path d={path} fill="none" stroke={P.textAmberBright} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />

                    {/* HOURLY DOTS
                        Backend = 10 minute points.
                        Every 6th point ≈ 1 hour. */}
                    {points.map((point, index) => {
                        if (index % 12 !== 0 && index !== points.length - 1) return null;
                        return <circle key={index} cx={point.x} cy={point.y} r="2.7" fill={P.textAmberBright} />;
                    })}
                </svg>

                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 9, color: P.textMuted, padding: "0 10px 0 42px" }}>
                    {xLabelIndexes.map((dataIndex, index) => (
                        <span key={index} style={{ transform: "rotate(-50deg)", transformOrigin: "top left", whiteSpace: "nowrap" }}>
                            {safeData[dataIndex]?.label ?? ""}
                        </span>
                    ))}
                </div>

                {/* X AXIS TIMES
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 9, color: P.textMuted, padding: "0 12px 0 42px" }}>
                    <span>{safeData[0]?.label}</span>
                    <span>{safeData[Math.floor(safeData.length / 2)]?.label}</span>
                    <span>{safeData[safeData.length - 1]?.label}</span>
                </div> */}
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

        // NICE Y AXIS
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

        // X AXIS LABELS
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

    // UI
    return (
        <PageBackground>
            <div style={{ minHeight: "100vh", paddingBottom: "90px", fontFamily: "'Inter', sans-serif" }}>
                <PageHeader title="POWER" backPath="/home" />

                <div style={{ width: "100%", maxWidth: 520, margin: "0 auto", boxSizing: "border-box" }}>
                    <DeviceInfo data={data} lastUpdated={lastUpdated} devices={devices} selectedDeviceId={selectedDeviceId} />

                    <div style={{ padding: "0 20px 20px" }}>
                        {/* SOLAR PANEL DETAILS */}
                        <h2 style={{ fontSize: 15, fontWeight: 800, color: P.textWhite, marginBottom: 12, marginTop: 4, letterSpacing: 0.5, fontFamily: "'DM Sans', sans-serif" }}>
                            SOLAR PANEL DETAILS
                        </h2>

                        <div style={{ background: P.borderDark, border: `1.5px solid ${P.borderDark}`, borderRadius: 16, padding: "5px", marginBottom: 20, boxShadow: P.shadowCardRaised, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 5 }}>
                            {/* PV VOLTAGE */}
                            <div style={metricCard}>
                                <div style={metricIconRow}>
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
                                    </svg>
                                    <span style={metricValue}>{getParameterValue("PV")} <span style={metricUnit}>V</span></span>
                                </div>
                                <div style={metricLabel}>PV Voltage</div>
                                <div style={metricDesc}>Input Voltage</div>
                            </div>

                            {/* PV CURRENT */}
                            <div style={metricCard}>
                                <div style={metricIconRow}>
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
                                    </svg>
                                    <span style={metricValue}>{getParameterValue("PI")} <span style={metricUnit}>A</span></span>
                                </div>
                                <div style={metricLabel}>PV Current</div>
                                <div style={metricDesc}>Input current</div>
                            </div>

                            {/* SOLAR POWER */}
                            <div style={{ ...metricCard, gridColumn: "1 / -1", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                                <div>
                                    <div style={metricIconRow}>
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
                                        </svg>
                                    </div>
                                    <div style={metricLabel}>Solar Power</div>
                                    <div style={metricDesc}>Total output</div>
                                </div>
                                <div style={{ fontSize: 22, fontWeight: 800, color: P.textPrimary, fontFamily: "'DM Sans', sans-serif" }}>
                                    {/* {currentSolarPower !== null ? currentSolarPower.toFixed(3) : "--"} */}
                                    {currentSolarPower !== null ? (currentSolarPower / 1000).toFixed(3) : "--"}
                                    <span style={{ fontSize: 14, fontWeight: 600, color: P.textMuted }}> kW</span>
                                </div>
                            </div>
                        </div>

                        {/* GENERATION SUMMARY */}
                        <h2 style={{ fontSize: 15, fontWeight: 800, color: P.textWhite, marginBottom: 14, marginTop: 4, letterSpacing: 0.5, fontFamily: "'DM Sans', sans-serif" }}>
                            GENERATION SUMMARY
                        </h2>

                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: 16 }}>
                            {/* TODAY */}
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

                            {/* MONTH */}
                            <div style={statCard}>
                                <div style={statIconWrap}>
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={P.borderStrong} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                        <circle cx="12" cy="12" r="5" />
                                        <line x1="12" y1="1" x2="12" y2="3" />
                                        <line x1="12" y1="21" x2="12" y2="23" />
                                        <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                                        <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                                        <line x1="1" y1="12" x2="3" y2="12" />
                                        <line x1="21" y1="12" x2="23" y2="12" />
                                    </svg>
                                </div>
                                <div style={statSubLabel}>MONTH</div>
                                <div style={{ ...statValue, color: P.textAmberBright }}>{energy?.monthly ?? "--"}</div>
                                <div style={statUnit}>kWh</div>
                            </div>

                            {/* TOTAL */}
                            <div style={statCard}>
                                <div style={statIconWrap}>
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={P.borderStrong} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                        <circle cx="12" cy="12" r="10" />
                                        <polyline points="12 6 12 12 16 14" />
                                    </svg>
                                </div>
                                <div style={statSubLabel}>TOTAL</div>
                                <div style={{ ...statValue, color: P.textAmberBright }}>{getParameterValue("LKWH")}</div>
                                <div style={statUnit}>kWh</div>
                            </div>
                        </div>

                        {/* CHART CARD */}
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
                                                : `${chartMeta?.label ?? ""}`
                                            : `${Number(chartMeta?.total ?? 0).toFixed(2)} kWh`}
                                    </span>

                                    {/* REFRESH */}
                                    <button
                                        onClick={handleRefreshEnergy}
                                        disabled={refreshing}
                                        title="Refresh energy data"
                                        style={{ width: 34, height: 34, border: `1px solid ${P.border}`, borderRadius: 8, background: refreshing ? P.bg : P.surface, color: P.textPrimary, display: "flex", alignItems: "center", justifyContent: "center", cursor: refreshing ? "default" : "pointer", padding: 0, opacity: refreshing ? 0.6 : 1 }}
                                    >
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M20 11a8.1 8.1 0 0 0-15.5-2" />
                                            <polyline points="4 4 4 9 9 9" />
                                            <path d="M4 13a8.1 8.1 0 0 0 15.5 2" />
                                            <polyline points="20 20 20 15 15 15" />
                                        </svg>
                                    </button>
                                </div>
                            </div>

                            {/* MODE TABS */}
                            <div style={{ display: "flex", background: P.bg, borderRadius: 10, padding: 4, marginBottom: 18 }}>
                                {[["today", "Today"], ["week", "Week"], ["month", "Month"], ["year", "Year"]].map(([key, label]) => (
                                    <button
                                        key={key}
                                        onClick={() => setChartMode(key)}
                                        style={{ flex: 1, border: "none", borderRadius: 8, padding: "8px 4px", cursor: "pointer", background: chartMode === key ? P.amber : "transparent", color: chartMode === key ? P.surface : P.textMuted, fontSize: 11, fontWeight: 700, fontFamily: "'Inter', sans-serif" }}
                                    >
                                        {label}
                                    </button>
                                ))}
                            </div>

                            {/* TODAY NAVIGATION */}
                            {chartMode === "today" && (
                                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
                                    <button onClick={() => setTodayOffset((value) => value - 1)} style={{ ...navigationButtonStyle, cursor: "pointer" }}>‹</button>
                                    <div style={{ fontSize: 12, fontWeight: 700, color: P.textPrimary, textAlign: "center" }}>{chartMeta?.label || "Today"}</div>
                                    <button
                                        onClick={() => setTodayOffset((value) => Math.min(0, value + 1))}
                                        disabled={todayOffset === 0}
                                        style={{ ...navigationButtonStyle, cursor: todayOffset === 0 ? "default" : "pointer", opacity: todayOffset === 0 ? 0.4 : 1 }}
                                    >›</button>
                                </div>
                            )}

                            {/* WEEK NAVIGATION */}
                            {chartMode === "week" && (
                                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
                                    <button onClick={() => setWeekOffset((value) => value - 1)} style={{ ...navigationButtonStyle, cursor: "pointer" }}>‹</button>
                                    <div style={{ fontSize: 12, fontWeight: 700, color: P.textPrimary, textAlign: "center" }}>
                                        {chartMeta?.range ? `${chartMeta.range.start} — ${chartMeta.range.end}` : "Current week"}
                                    </div>
                                    <button
                                        onClick={() => setWeekOffset((value) => Math.min(0, value + 1))}
                                        disabled={weekOffset === 0}
                                        style={{ ...navigationButtonStyle, cursor: weekOffset === 0 ? "default" : "pointer", opacity: weekOffset === 0 ? 0.4 : 1 }}
                                    >›</button>
                                </div>
                            )}

                            {/* MONTH NAVIGATION */}
                            {chartMode === "month" && (
                                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
                                    <button onClick={() => setMonthOffset((value) => value - 1)} style={{ ...navigationButtonStyle, cursor: "pointer" }}>‹</button>
                                    <div style={{ fontSize: 12, fontWeight: 700, color: P.textPrimary, textAlign: "center" }}>{chartMeta?.label || "Current month"}</div>
                                    <button
                                        onClick={() => setMonthOffset((value) => Math.min(0, value + 1))}
                                        disabled={monthOffset === 0}
                                        style={{ ...navigationButtonStyle, cursor: monthOffset === 0 ? "default" : "pointer", opacity: monthOffset === 0 ? 0.4 : 1 }}
                                    >›</button>
                                </div>
                            )}

                            {/* YEAR NAVIGATION */}
                            {chartMode === "year" && (
                                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
                                    <button onClick={() => setYearOffset((value) => value - 1)} style={{ ...navigationButtonStyle, cursor: "pointer" }}>‹</button>
                                    <div style={{ fontSize: 12, fontWeight: 700, color: P.textPrimary, textAlign: "center" }}>{chartMeta?.label || "Current year"}</div>
                                    <button
                                        onClick={() => setYearOffset((value) => Math.min(0, value + 1))}
                                        disabled={yearOffset === 0}
                                        style={{ ...navigationButtonStyle, cursor: yearOffset === 0 ? "default" : "pointer", opacity: yearOffset === 0 ? 0.4 : 1 }}
                                    >›</button>
                                </div>
                            )}

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
                    </div>
                </div>

                <Footer data={data} />
            </div>
        </PageBackground>
    );
}




// import { useInverter } from "../context/Context";
// import Footer from "../components/Footer";
// import DeviceInfo from "../components/DeviceInfo";
// import P from "../theme/colors";
// import PageHeader from "../components/PageHeader";
// import {
//     useEffect,
//     useState
// } from "react";
// import PageBackground from "../components/PageBackground";


// export default function Power() {

//     const {
//         data,
//         lastUpdated,
//         energy,
//         devices,
//         refreshEnergy,
//         selectedDeviceId,

//         chartData,
//         chartMeta,
//         fetchEnergyChart
//     } = useInverter();


//     // =====================================================
//     // CHART STATE
//     // =====================================================

//     const [chartMode, setChartMode] =
//         useState("today");

//     const [refreshing, setRefreshing] =
//         useState(false);

//     const [weekOffset, setWeekOffset] =
//         useState(0);

//     const [monthOffset, setMonthOffset] =
//         useState(0);
//     const [yearOffset, setYearOffset] =
//     useState(0);

//     const [todayOffset, setTodayOffset] =
//     useState(0);


//     // =====================================================
//     // RESET NAVIGATION WHEN DEVICE CHANGES
//     // =====================================================

//     useEffect(() => {
//     setTodayOffset(0);
//         setWeekOffset(0);
//         setMonthOffset(0);
//         setYearOffset(0);
//     }, [
//         selectedDeviceId
//     ]);


//     // =====================================================
//     // CURRENT ACTIVE OFFSET
//     // =====================================================
// const activeOffset =
//     chartMode === "today"
//         ? todayOffset
//         : chartMode === "week"
//             ? weekOffset
//             : chartMode === "month"
//                 ? monthOffset
//                 : chartMode === "year"
//                     ? yearOffset
//                     : 0;


//     // =====================================================
//     // FETCH CHART WHEN MODE / OFFSET / DEVICE CHANGES
//     // =====================================================

//     useEffect(() => {

//         if (
//             !selectedDeviceId ||
//             !fetchEnergyChart
//         ) {
//             return;
//         }


//         fetchEnergyChart(
//             chartMode,
//             activeOffset
//         );

//     }, [
//         chartMode,
//         activeOffset,
//         selectedDeviceId,
//         fetchEnergyChart
//     ]);


//     // =====================================================
//     // REFRESH
//     // =====================================================

//     const handleRefreshEnergy =
//         async () => {

//             if (refreshing) {
//                 return;
//             }


//             try {

//                 setRefreshing(true);


//                 await Promise.all([

//                     refreshEnergy(),

//                     fetchEnergyChart(
//                         chartMode,
//                         activeOffset
//                     )

//                 ]);

//             } catch (err) {

//                 console.error(
//                     "Energy refresh failed:",
//                     err
//                 );

//             } finally {

//                 setRefreshing(false);
//             }
//         };


//     // =====================================================
//     // DATE / TIME
//     // =====================================================

//     const formattedDateTime = (() => {

//         if (!lastUpdated) {

//             return {
//                 date: "--",
//                 time: "--"
//             };
//         }


//         const d =
//             new Date(
//                 lastUpdated
//             );


//         return {

//             date:
//                 d.toLocaleDateString(
//                     "en-GB",
//                     {
//                         day: "numeric",
//                         month: "short",
//                         year: "numeric",
//                     }
//                 ),

//             time:
//                 d.toLocaleTimeString(
//                     "en-US",
//                     {
//                         hour: "numeric",
//                         minute: "2-digit",
//                         hour12: true,
//                     }
//                 ),
//         };

//     })();


//     // =====================================================
//     // CHART TEXT
//     // =====================================================

//     const chartTitles = {

//         today:
//             "Daily Solar Power",

//         week:
//             "Weekly Energy",

//         month:
//             "Monthly Energy",

//         year:
//             "Yearly Energy"
//     };


//     const chartDescriptions = {

//         today:
//             "Solar power throughout the day",

//         week:
//             "Energy generated per day",

//         month:
//             "Energy generated per day",

//         year:
//             "Energy generated per month"
//     };


//     // =====================================================
//     // CURRENT SOLAR POWER
//     // PPOW = Watts
//     // Convert to kW
//     // =====================================================

//     // const currentSolarPower =
//     //     Number.isFinite(
//     //         Number(
//     //             data?.PPOW
//     //         )
//     //     )
//     //         ? Number(
//     //             data.PPOW
//     //         ) / 1000
//     //         : null;


//     const currentSolarPower =
//     Number.isFinite(
//         Number(data?.PPOW)
//     )
//         ? Number(data.PPOW)
//         : null;


//     // =====================================================
//     // PARAMETER HELPER
//     // =====================================================

//     const getParameterValue =
//         (parameter) => {

//             return (
//                 data?.[parameter] ??
//                 "--"
//             );
//         };


//     // =====================================================
//     // STYLES
//     // =====================================================

//     const metricCard = {

//         background:
//             P.surfaceWarm,

//         border:
//             `1px solid ${P.borderAmber}`,

//         borderRadius:
//             12,

//         padding:
//             "12px 14px"
//     };


//     const metricIconRow = {

//         display:
//             "flex",

//         alignItems:
//             "center",

//         justifyContent:
//             "space-between",

//         marginBottom:
//             6
//     };


//     const metricValue = {

//         fontSize:
//             20,

//         fontWeight:
//             800,

//         color:
//             P.textPrimary,

//         fontFamily:
//             "'DM Sans', sans-serif"
//     };


//     const metricUnit = {

//         fontSize:
//             14,

//         fontWeight:
//             600,

//         color:
//             P.textMuted,

//         fontFamily:
//             "'Inter', sans-serif"
//     };


//     const metricLabel = {

//         fontSize:
//             13,

//         fontWeight:
//             600,

//         color:
//             P.textSecond,

//         fontFamily:
//             "'Inter', sans-serif",

//         marginBottom:
//             2
//     };


//     const metricDesc = {

//         fontSize:
//             11,

//         color:
//             P.textLight,

//         fontFamily:
//             "'Inter', sans-serif"
//     };


//     const statCard = {

//         background:
//             P.surface,

//         borderRadius:
//             14,

//         padding:
//             "14px 10px",

//         textAlign:
//             "center",

//         boxShadow:
//             P.shadowCard,

//         border:
//             `1px solid ${P.border}`
//     };


//     const statIconWrap = {

//         width:
//             36,

//         height:
//             36,

//         borderRadius:
//             "50%",

//         background:
//             P.surfaceAmber,

//         display:
//             "flex",

//         alignItems:
//             "center",

//         justifyContent:
//             "center",

//         margin:
//             "0 auto 8px"
//     };


//     const statSubLabel = {

//         fontSize:
//             9,

//         fontWeight:
//             700,

//         color:
//             P.textLight,

//         letterSpacing:
//             0.5,

//         fontFamily:
//             "'Inter', sans-serif",

//         marginBottom:
//             4,

//         textTransform:
//             "uppercase"
//     };


//     const statValue = {

//         fontSize:
//             20,

//         fontWeight:
//             800,

//         color:
//             P.textPrimary,

//         fontFamily:
//             "'DM Sans', sans-serif",

//         lineHeight:
//             1.1
//     };


//     const statUnit = {

//         fontSize:
//             11,

//         fontWeight:
//             500,

//         color:
//             P.textMuted,

//         fontFamily:
//             "'Inter', sans-serif",

//         marginTop:
//             2
//     };


//     const chartCard = {

//         background:
//             P.surface,

//         borderRadius:
//             16,

//         padding:
//             "16px",

//         marginBottom:
//             14,

//         boxShadow:
//             P.shadowCard,

//         border:
//             `1px solid ${P.border}`
//     };


//     const chartHeader = {

//         display:
//             "flex",

//         justifyContent:
//             "space-between",

//         alignItems:
//             "center",

//         marginBottom:
//             16
//     };


//     const chartTitle = {

//         fontSize:
//             14,

//         fontWeight:
//             600,

//         color:
//             P.textPrimary,

//         fontFamily:
//             "'DM Sans', sans-serif"
//     };


//     const chartBadge = {

//         background:
//             P.amber,

//         color:
//             P.surface,

//         fontSize:
//             12,

//         fontWeight:
//             700,

//         padding:
//             "4px 12px",

//         borderRadius:
//             20,

//         fontFamily:
//             "'Inter', sans-serif",

//         whiteSpace:
//             "nowrap"
//     };


//     const navigationButtonStyle = {

//         width:
//             34,

//         height:
//             34,

//         border:
//             `1px solid ${P.border}`,

//         borderRadius:
//             8,

//         background:
//             P.surface,

//         color:
//             P.textPrimary,

//         display:
//             "flex",

//         alignItems:
//             "center",

//         justifyContent:
//             "center",

//         fontSize:
//             20,

//         padding:
//             0
//     };


//     // =====================================================
//     // TODAY SOLAR POWER LINE CHART
//     // =====================================================

//     const SolarPowerLineChart = ({
//         data
//     }) => {

//         const safeData =
//             Array.isArray(data)
//                 ? data
//                 : [];


//         const width =
//             500;

//         const height =
//             220;

//         const leftPadding =
//             45;

//         const rightPadding =
//             15;

//         const topPadding =
//             20;

//         const bottomPadding =
//             35;

//         const getMinutes = (label) => {

//     if (
//         typeof label !== "string" ||
//         !label.includes(":")
//     ) {
//         return null;
//     }

//     const parts =
//         label.split(":");

//     const hour =
//         Number(parts[0]);

//     const minute =
//         Number(parts[1]);

//     if (
//         !Number.isFinite(hour) ||
//         !Number.isFinite(minute)
//     ) {
//         return null;
//     }

//     return (
//         hour * 60 +
//         minute
//     );
// };

// const validData =
//     safeData.filter(
//         item => {

//             const minutes =
//                 getMinutes(
//                     item?.label
//                 );

//             const value =
//                 Number(
//                     item?.value
//                 );

//             return (
//                 minutes !== null &&
//                 Number.isFinite(value)
//             );
//         }
//     );


// // const firstMinute =
// //     safeData.length > 0
// //         ? getMinutes(
// //             safeData[0].label
// //         )
// //         : 0;


// // const lastMinute =
// //     safeData.length > 0
// //         ? getMinutes(
// //             safeData[
// //                 safeData.length - 1
// //             ].label
// //         )
// //         : 1440;


// // const timeRange =
// //     Math.max(
// //         lastMinute - firstMinute,
// //         1
// //     );

// const firstMinute =
//     validData.length > 0
//         ? getMinutes(
//             validData[0].label
//         )
//         : 0;


// const lastMinute =
//     validData.length > 0
//         ? getMinutes(
//             validData[
//                 validData.length - 1
//             ].label
//         )
//         : 1;


// const timeRange =
//     Math.max(
//         lastMinute -
//         firstMinute,
//         1
//     );

//         const values =
//             safeData.map(
//                 item =>
//                     Number(
//                         item.value
//                     ) || 0
//             );
// const rawMax =
//     validData.length > 0
//         ? Math.max(
//             ...validData.map(
//                 item =>
//                     Number(
//                         item.value
//                     ) || 0
//             )
//         )
//         : 0;

//         const xLabelCount = 8;

// const xLabelIndexes =
//     Array.from(
//         { length: xLabelCount },
//         (_, index) =>
//             Math.round(
//                 (
//                     index /
//                     (xLabelCount - 1)
//                 ) *
//                 Math.max(
//                     safeData.length - 1,
//                     0
//                 )
//             )
//     );



//         // -----------------------------------------
//         // NICE Y AXIS MAX
//         // -----------------------------------------

//         const getNiceMax =
//             (value) => {

//                 if (
//                     value <= 0
//                 ) {
//                     return 1;
//                 }


//                 const magnitude =
//                     Math.pow(
//                         10,
//                         Math.floor(
//                             Math.log10(
//                                 value
//                             )
//                         )
//                     );


//                 const normalized =
//                     value /
//                     magnitude;


//                 let nice;


//                 if (
//                     normalized <= 1
//                 ) {

//                     nice = 1;

//                 } else if (
//                     normalized <= 2
//                 ) {

//                     nice = 2;

//                 } else if (
//                     normalized <= 5
//                 ) {

//                     nice = 5;

//                 } else {

//                     nice = 10;
//                 }


//                 return (
//                     nice *
//                     magnitude
//                 );
//             };


//         // const yAxisMax =
//         //     getNiceMax(
//         //         rawMax
//         //     );

//         const yAxisMax =
//     Math.max(
//         getNiceMax(
//             rawMax
//         ),
//         1
//     );


//         const tickCount =
//             5;


//         const yTicks =
//             Array.from(
//                 {
//                     length:
//                         tickCount + 1
//                 },
//                 (_, index) =>
//                     Number(
//                         (
//                             yAxisMax /
//                             tickCount *
//                             index
//                         ).toFixed(2)
//                     )
//             );


//         const plotWidth =
//             width -
//             leftPadding -
//             rightPadding;


//         const plotHeight =
//             height -
//             topPadding -
//             bottomPadding;

// // const points =
// //     safeData.map(
// //         item => {

// //             const currentMinute =
// //                 getMinutes(
// //                     item.label
// //                 );


// //             const x =
// //                 leftPadding +
// //                 (
// //                     (
// //                         currentMinute -
// //                         firstMinute
// //                     ) /
// //                     timeRange
// //                 ) *
// //                 plotWidth;


// //             const value =
// //                 Number(
// //                     item.value
// //                 ) || 0;


// //             const y =
// //                 topPadding +
// //                 (
// //                     1 -
// //                     value /
// //                     yAxisMax
// //                 ) *
// //                 plotHeight;


// //             return {
// //                 x,
// //                 y,
// //                 item
// //             };
// //         }
// //     );


// const points =
//     validData.map(
//         item => {

//             const currentMinute =
//                 getMinutes(
//                     item.label
//                 );


//             const value =
//                 Number(
//                     item.value
//                 );


//             const x =
//                 leftPadding +
//                 (
//                     (
//                         currentMinute -
//                         firstMinute
//                     ) /
//                     timeRange
//                 ) *
//                 plotWidth;


//             const y =
//                 topPadding +
//                 (
//                     1 -
//                     value /
//                     yAxisMax
//                 ) *
//                 plotHeight;


//             return {
//                 x,
//                 y,
//                 item
//             };
//         }
//     );



//         // const points =
//         // safeData.map(
//         //         (
//         //             item,
//         //             index
//         //         ) => {

//         //             const x =
//         //                 leftPadding +
//         //                 (
//         //                     index /
//         //                     Math.max(
//         //                         safeData.length - 1,
//         //                         1
//         //                     )
//         //                 ) *
//         //                 plotWidth;


//         //             const value =
//         //                 Number(
//         //                     item.value
//         //                 ) || 0;


//         //             const y =
//         //                 topPadding +
//         //                 (
//         //                     1 -
//         //                     value /
//         //                     yAxisMax
//         //                 ) *
//         //                 plotHeight;


//         //             return {

//         //                 x,
//         //                 y,
//         //                 item
//         //             };
//         //         }
//         //     );


//         const path =
//             points
//                 .map(
//                     (
//                         point,
//                         index
//                     ) =>
//                         `${
//                             index === 0
//                                 ? "M"
//                                 : "L"
//                         } ${point.x} ${point.y}`
//                 )
//                 .join(" ");


//         // -----------------------------------------
//         // FILLED AREA UNDER THE LINE
//         // -----------------------------------------

//         const baselineY =
//             topPadding +
//             plotHeight;


//         const areaPath =
//             points.length > 0
//                 ? `M ${points[0].x} ${baselineY} ` +
//                   points
//                       .map(
//                           (point) =>
//                               `L ${point.x} ${point.y}`
//                       )
//                       .join(" ") +
//                   ` L ${points[points.length - 1].x} ${baselineY} Z`
//                 : "";


//         return (

//             <div
//                 style={{
//                     width:
//                         "100%",

//                     overflow:
//                         "hidden"
//                 }}
//             >

//                 <svg
//                     viewBox={
//                         `0 0 ${width} ${height}`
//                     }
//                     style={{
//                         width:
//                             "100%",

//                         height:
//                             230,

//                         display:
//                             "block"
//                     }}
//                 >

//                     {/* GRID + Y AXIS LABELS */}

//                     {[
//                         ...yTicks
//                     ]
//                         .reverse()
//                         .map(
//                             (
//                                 tick,
//                                 index
//                             ) => {

//                                 const y =
//                                     topPadding +
//                                     (
//                                         index /
//                                         tickCount
//                                     ) *
//                                     plotHeight;


//                                 return (

//                                     <g
//                                         key={
//                                             index
//                                         }
//                                     >

//                                         <line
//                                             x1={
//                                                 leftPadding
//                                             }
//                                             y1={
//                                                 y
//                                             }
//                                             x2={
//                                                 width -
//                                                 rightPadding
//                                             }
//                                             y2={
//                                                 y
//                                             }
//                                             stroke={
//                                                 P.border
//                                             }
//                                             strokeDasharray="4 4"
//                                         />


//                                         <text
//                                             x={
//                                                 leftPadding -
//                                                 7
//                                             }
//                                             y={
//                                                 y + 3
//                                             }
//                                             textAnchor="end"
//                                             fontSize="9"
//                                             fill={
//                                                 P.textMuted
//                                             }
//                                         >
//                                             {
//                                                 tick
//                                             }
//                                         </text>

//                                     </g>
//                                 );
//                             }
//                         )}


//                     {/* AREA + LINE */}

//                     <path
//                         d={areaPath}
//                         fill={P.textAmberBright}
//                         opacity="0.12"
//                     />

//                     <path
//                         d={path}
//                         fill="none"
//                         stroke={P.textAmberBright}
//                         strokeWidth="3"
//                         strokeLinecap="round"
//                         strokeLinejoin="round"
//                     />


//                     {/* HOURLY DOTS
//                         Backend = 10 minute points.
//                         Every 6th point ≈ 1 hour.
//                     */}

//                     {points.map(
//                         (
//                             point,
//                             index
//                         ) => {

//                             if (
//                                 index % 12 !== 0 &&
//                                 index !==
//                                     points.length - 1
//                             ) {

//                                 return null;
//                             }


//                             return (

//                                 <circle
//                                     key={
//                                         index
//                                     }
//                                     cx={
//                                         point.x
//                                     }
//                                     cy={
//                                         point.y
//                                     }
//                                     r="2.7"
//                                     fill={
//                                         P.textAmberBright
//                                     }
//                                 />
//                             );
//                         }
//                     )}

//                 </svg>

//                 <div
//     style={{
//         display: "flex",
//         justifyContent: "space-between",
//         fontSize: 9,
//         color: P.textMuted,
//         padding: "0 10px 0 42px"
//     }}
// >
//     {xLabelIndexes.map(
//         (dataIndex, index) => (

//             <span
//                 key={index}
//                 style={{
//                     transform: "rotate(-50deg)",
//                     transformOrigin: "top left",
//                     whiteSpace: "nowrap"
//                 }}
//             >
//                 {safeData[dataIndex]?.label ?? ""}
//             </span>

//         )
//     )}
// </div>


//                 {/* X AXIS TIMES */}

//                 {/* <div
//                     style={{
//                         display:
//                             "flex",

//                         justifyContent:
//                             "space-between",

//                         fontSize:
//                             9,

//                         color:
//                             P.textMuted,

//                         padding:
//                             "0 12px 0 42px"
//                     }}
//                 >

//                     <span>
//                         {
//                             safeData[0]
//                                 ?.label
//                         }
//                     </span>


//                     <span>
//                         {
//                             safeData[
//                                 Math.floor(
//                                     safeData.length /
//                                     2
//                                 )
//                             ]?.label
//                         }
//                     </span>


//                     <span>
//                         {
//                             safeData[
//                                 safeData.length -
//                                 1
//                             ]?.label
//                         }
//                     </span>

//                 </div> */}

//             </div>
//         );
//     };


//     // =====================================================
//     // ENERGY BAR CHART
//     // WEEK / MONTH / YEAR
//     // =====================================================

//     const EnergyBarChart = ({
//         data,
//         color,
//         mode
//     }) => {

//         const safeData =
//             Array.isArray(data)
//                 ? data
//                 : [];


//         if (
//             safeData.length === 0
//         ) {

//             return (

//                 <div
//                     style={{
//                         height:
//                             220,

//                         display:
//                             "flex",

//                         alignItems:
//                             "center",

//                         justifyContent:
//                             "center",

//                         color:
//                             P.textMuted,

//                         fontSize:
//                             13
//                     }}
//                 >
//                     No energy data available
//                 </div>
//             );
//         }


//         const values =
//             safeData.map(
//                 item =>
//                     Number(
//                         item.value
//                     ) || 0
//             );


//         const maxValue =
//             Math.max(
//                 ...values,
//                 0
//             );


//         // -----------------------------------------
//         // NICE Y AXIS
//         // -----------------------------------------

//         const getNiceMax =
//             (value) => {

//                 if (
//                     value <= 0
//                 ) {
//                     return 10;
//                 }


//                 const magnitude =
//                     Math.pow(
//                         10,
//                         Math.floor(
//                             Math.log10(
//                                 value
//                             )
//                         )
//                     );


//                 const normalized =
//                     value /
//                     magnitude;


//                 let nice;


//                 if (
//                     normalized <= 1
//                 ) {

//                     nice = 1;

//                 } else if (
//                     normalized <= 2
//                 ) {

//                     nice = 2;

//                 } else if (
//                     normalized <= 5
//                 ) {

//                     nice = 5;

//                 } else {

//                     nice = 10;
//                 }


//                 return (
//                     nice *
//                     magnitude
//                 );
//             };


//         const yAxisMax =
//             getNiceMax(
//                 maxValue
//             );


//         const tickCount =
//             5;


//         const tickStep =
//             yAxisMax /
//             tickCount;


//         const yAxisTicks =
//             Array.from(
//                 {
//                     length:
//                         tickCount + 1
//                 },
//                 (_, index) =>
//                     Number(
//                         (
//                             tickStep *
//                             index
//                         ).toFixed(1)
//                     )
//             );


//         const chartHeight =
//             240;

//         const plotHeight =
//             180;


//         const isWeekly =
//             mode === "week";

//         const isMonthly =
//             mode === "month";

//         const isYearly =
//             mode === "year";


//         // -----------------------------------------
//         // X AXIS LABELS
//         // -----------------------------------------

//         const shouldShowLabel =
//             (index) => {

//                 if (
//                     isWeekly
//                 ) {
//                     return true;
//                 }


//                 if (
//                     isMonthly
//                 ) {

//                     return (
//                         index === 0 ||
//                         index % 5 === 0 ||
//                         index ===
//                             safeData.length - 1
//                     );
//                 }


//                 if (
//                     isYearly
//                 ) {
//                     return true;
//                 }


//                 return true;
//             };


//         return (

//             <div
//                 style={{
//                     width:
//                         "100%",

//                     overflow:
//                         "hidden",

//                     paddingBottom:
//                         8
//                 }}
//             >

//                 <div
//                     style={{
//                         display:
//                             "flex",

//                         width:
//                             "100%",

//                         height:
//                             chartHeight
//                     }}
//                 >

//                     {/* Y AXIS */}

//                     <div
//                         style={{
//                             width:
//                                 38,

//                             flexShrink:
//                                 0,

//                             height:
//                                 plotHeight,

//                             display:
//                                 "flex",

//                             flexDirection:
//                                 "column",

//                             justifyContent:
//                                 "space-between",

//                             alignItems:
//                                 "flex-end",

//                             paddingRight:
//                                 6
//                         }}
//                     >

//                         {[
//                             ...yAxisTicks
//                         ]
//                             .reverse()
//                             .map(
//                                 (
//                                     tick,
//                                     index
//                                 ) => (

//                                     <span
//                                         key={
//                                             index
//                                         }
//                                         style={{
//                                             fontSize:
//                                                 9,

//                                             color:
//                                                 P.textMuted,

//                                             lineHeight:
//                                                 1
//                                         }}
//                                     >
//                                         {
//                                             tick
//                                         }
//                                     </span>
//                                 )
//                             )}

//                     </div>


//                     {/* GRAPH AREA */}

//                     <div
//                         style={{
//                             flex:
//                                 1,

//                             minWidth:
//                                 0,

//                             position:
//                                 "relative",

//                             height:
//                                 chartHeight
//                         }}
//                     >

//                         {/* GRID */}

//                         <div
//                             style={{
//                                 position:
//                                     "absolute",

//                                 top:
//                                     0,

//                                 left:
//                                     0,

//                                 right:
//                                     0,

//                                 height:
//                                     plotHeight,

//                                 pointerEvents:
//                                     "none"
//                             }}
//                         >

//                             {yAxisTicks.map(
//                                 (
//                                     tick,
//                                     index
//                                 ) => {

//                                     const position =
//                                         (
//                                             1 -
//                                             tick /
//                                             yAxisMax
//                                         ) *
//                                         100;


//                                     return (

//                                         <div
//                                             key={
//                                                 index
//                                             }
//                                             style={{
//                                                 position:
//                                                     "absolute",

//                                                 left:
//                                                     0,

//                                                 right:
//                                                     0,

//                                                 top:
//                                                     `${position}%`,

//                                                 borderTop:
//                                                     `1px dashed ${P.border}`
//                                             }}
//                                         />
//                                     );
//                                 }
//                             )}

//                         </div>


//                         {/* BARS */}

//                         <div
//                             style={{
//                                 position:
//                                     "absolute",

//                                 left:
//                                     0,

//                                 right:
//                                     0,

//                                 top:
//                                     0,

//                                 height:
//                                     plotHeight,

//                                 display:
//                                     "flex",

//                                 alignItems:
//                                     "flex-end",

//                                 gap:
//                                     isMonthly
//                                         ? 2
//                                         : 5,

//                                 padding:
//                                     "0 2px"
//                             }}
//                         >

//                             {safeData.map(
//                                 (
//                                     item,
//                                     index
//                                 ) => {

//                                     const value =
//                                         Number(
//                                             item.value
//                                         ) || 0;


//                                     const barHeight =
//                                         maxValue > 0
//                                             ? (
//                                                 value /
//                                                 yAxisMax
//                                             ) *
//                                             plotHeight
//                                             : 2;


//                                     return (

//                                         <div
//                                             key={
//                                                 index
//                                             }
//                                             style={{
//                                                 flex:
//                                                     1,

//                                                 minWidth:
//                                                     0,

//                                                 height:
//                                                     plotHeight,

//                                                 display:
//                                                     "flex",

//                                                 flexDirection:
//                                                     "column",

//                                                 alignItems:
//                                                     "center",

//                                                 justifyContent:
//                                                     "flex-end",

//                                                 position:
//                                                     "relative"
//                                             }}
//                                         >

//                                             {/* VALUE */}

//                                             {value > 0 && (

//                                                 <div
//                                                     style={{
//                                                         position:
//                                                             "absolute",

//                                                         bottom:
//                                                             Math.min(
//                                                                 barHeight + 4,
//                                                                 plotHeight - 12
//                                                             ),

//                                                         fontSize:
//                                                             8,

//                                                         fontWeight:
//                                                             600,

//                                                         color:
//                                                             P.textMuted,

//                                                         whiteSpace:
//                                                             "nowrap",

//                                                         zIndex:
//                                                             2
//                                                     }}
//                                                 >
//                                                     {
//                                                         value.toFixed(
//                                                             1
//                                                         )
//                                                     }
//                                                 </div>
//                                             )}


//                                             {/* BAR */}

//                                             <div
//                                                 style={{
//                                                     width:
//                                                         "100%",

//                                                     maxWidth:
//                                                         isMonthly
//                                                             ? 14
//                                                             : 28,

//                                                     height:
//                                                         Math.max(
//                                                             barHeight,
//                                                             value > 0
//                                                                 ? 3
//                                                                 : 1
//                                                         ),

//                                                     background:
//                                                         value > 0
//                                                             ? color
//                                                             : `${color}33`,

//                                                     borderRadius:
//                                                         "4px 4px 0 0",

//                                                     transition:
//                                                         "height 0.4s ease",

//                                                     position:
//                                                         "absolute",

//                                                     bottom:
//                                                         0
//                                                 }}
//                                             />

//                                         </div>
//                                     );
//                                 }
//                             )}

//                         </div>


//                         {/* X AXIS */}

//                         <div
//                             style={{
//                                 position:
//                                     "absolute",

//                                 top:
//                                     plotHeight + 8,

//                                 left:
//                                     0,

//                                 right:
//                                     0,

//                                 display:
//                                     "flex",

//                                 alignItems:
//                                     "center"
//                             }}
//                         >

//                             {safeData.map(
//                                 (
//                                     item,
//                                     index
//                                 ) => (

//                                     <div
//                                         key={
//                                             index
//                                         }
//                                         style={{
//                                             flex:
//                                                 1,

//                                             minWidth:
//                                                 0,

//                                             textAlign:
//                                                 "center",

//                                             fontSize:
//                                                 isMonthly
//                                                     ? 8
//                                                     : 9,

//                                             color:
//                                                 P.textMuted,

//                                             whiteSpace:
//                                                 "nowrap",

//                                             overflow:
//                                                 "hidden",

//                                             visibility:
//                                                 shouldShowLabel(
//                                                     index
//                                                 )
//                                                     ? "visible"
//                                                     : "hidden"
//                                         }}
//                                     >
//                                         {
//                                             item.label
//                                         }
//                                     </div>
//                                 )
//                             )}

//                         </div>

//                     </div>

//                 </div>

//             </div>
//         );
//     };


//     // =====================================================
//     // UI
//     // =====================================================

//     return (

//         <PageBackground>

//             <div
//                 style={{
//                     minHeight:
//                         "100vh",

//                     paddingBottom:
//                         "90px",

//                     fontFamily:
//                         "'Inter', sans-serif"
//                 }}
//             >

//                 <PageHeader
//                     title="POWER"
//                     backPath="/"
//                 />


//                 <div
//                     style={{
//                         width:
//                             "100%",

//                         maxWidth:
//                             520,

//                         margin:
//                             "0 auto",

//                         boxSizing:
//                             "border-box"
//                     }}
//                 >

//                     <DeviceInfo
//                         data={
//                             data
//                         }
//                         lastUpdated={
//                             lastUpdated
//                         }
//                         devices={
//                             devices
//                         }
//                         selectedDeviceId={
//                             selectedDeviceId
//                         }
//                     />


//                     <div
//                         style={{
//                             padding:
//                                 "0 20px 20px"
//                         }}
//                     >

//                         {/* =================================================
//                             SOLAR PANEL DETAILS
//                         ================================================= */}

//                         <h2
//                             style={{
//                                 fontSize:
//                                     15,

//                                 fontWeight:
//                                     800,

//                                 color:
//                                     P.textWhite,

//                                 marginBottom:
//                                     12,

//                                 marginTop:
//                                     4,

//                                 letterSpacing:
//                                     0.5,

//                                 fontFamily:
//                                     "'DM Sans', sans-serif"
//                             }}
//                         >
//                             SOLAR PANEL DETAILS
//                         </h2>


//                         <div
//                             style={{
//                                 background:
//                                     P.borderDark,

//                                 border:
//                                     `1.5px solid ${P.borderDark}`,

//                                 borderRadius:
//                                     16,

//                                 padding:
//                                     "5px",

//                                 marginBottom:
//                                     20,

//                                 boxShadow:
//                                     P.shadowCardRaised,

//                                 display:
//                                     "grid",

//                                 gridTemplateColumns:
//                                     "1fr 1fr",

//                                 gap:
//                                     5
//                             }}
//                         >

//                             {/* PV VOLTAGE */}

//                             <div
//                                 style={
//                                     metricCard
//                                 }
//                             >

//                                 <div
//                                     style={
//                                         metricIconRow
//                                     }
//                                 >

//                                     <svg
//                                         width="18"
//                                         height="18"
//                                         viewBox="0 0 24 24"
//                                         fill="none"
//                                         stroke="currentColor"
//                                         strokeWidth="2"
//                                         strokeLinecap="round"
//                                         strokeLinejoin="round"
//                                     >
//                                         <path
//                                             d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"
//                                         />
//                                     </svg>


//                                     <span
//                                         style={
//                                             metricValue
//                                         }
//                                     >
//                                         {
//                                             getParameterValue(
//                                                 "PV"
//                                             )
//                                         }{" "}

//                                         <span
//                                             style={
//                                                 metricUnit
//                                             }
//                                         >
//                                             V
//                                         </span>
//                                     </span>

//                                 </div>


//                                 <div
//                                     style={
//                                         metricLabel
//                                     }
//                                 >
//                                     PV Voltage
//                                 </div>


//                                 <div
//                                     style={
//                                         metricDesc
//                                     }
//                                 >
//                                     Input Voltage
//                                 </div>

//                             </div>


//                             {/* PV CURRENT */}

//                             <div
//                                 style={
//                                     metricCard
//                                 }
//                             >

//                                 <div
//                                     style={
//                                         metricIconRow
//                                     }
//                                 >

//                                     <svg
//                                         width="18"
//                                         height="18"
//                                         viewBox="0 0 24 24"
//                                         fill="none"
//                                         stroke="currentColor"
//                                         strokeWidth="2"
//                                         strokeLinecap="round"
//                                         strokeLinejoin="round"
//                                     >
//                                         <path
//                                             d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"
//                                         />
//                                     </svg>


//                                     <span
//                                         style={
//                                             metricValue
//                                         }
//                                     >
//                                         {
//                                             getParameterValue(
//                                                 "PI"
//                                             )
//                                         }{" "}

//                                         <span
//                                             style={
//                                                 metricUnit
//                                             }
//                                         >
//                                             A
//                                         </span>
//                                     </span>

//                                 </div>


//                                 <div
//                                     style={
//                                         metricLabel
//                                     }
//                                 >
//                                     PV Current
//                                 </div>


//                                 <div
//                                     style={
//                                         metricDesc
//                                     }
//                                 >
//                                     Input current
//                                 </div>

//                             </div>


//                             {/* SOLAR POWER */}

//                             <div
//                                 style={{
//                                     ...metricCard,

//                                     gridColumn:
//                                         "1 / -1",

//                                     display:
//                                         "flex",

//                                     alignItems:
//                                         "center",

//                                     justifyContent:
//                                         "space-between"
//                                 }}
//                             >

//                                 <div>

//                                     <div
//                                         style={
//                                             metricIconRow
//                                         }
//                                     >

//                                         <svg
//                                             width="18"
//                                             height="18"
//                                             viewBox="0 0 24 24"
//                                             fill="none"
//                                             stroke="currentColor"
//                                             strokeWidth="2"
//                                             strokeLinecap="round"
//                                             strokeLinejoin="round"
//                                         >
//                                             <path
//                                                 d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"
//                                             />
//                                         </svg>

//                                     </div>


//                                     <div
//                                         style={
//                                             metricLabel
//                                         }
//                                     >
//                                         Solar Power
//                                     </div>


//                                     <div
//                                         style={
//                                             metricDesc
//                                         }
//                                     >
//                                         Total output
//                                     </div>

//                                 </div>


//                                 <div
//                                     style={{
//                                         fontSize:
//                                             22,

//                                         fontWeight:
//                                             800,

//                                         color:
//                                             P.textPrimary,

//                                         fontFamily:
//                                             "'DM Sans', sans-serif"
//                                     }}
//                                 >

//                                     {/* {
//                                         currentSolarPower !==
//                                         null
//                                             ? currentSolarPower.toFixed(
//                                                 3
//                                             )
//                                             : "--"
//                                     } */}

//                                     {
//     currentSolarPower !== null
//         ? (currentSolarPower / 1000).toFixed(3)
//         : "--"
// }


//                                     <span
//                                         style={{
//                                             fontSize:
//                                                 14,

//                                             fontWeight:
//                                                 600,

//                                             color:
//                                                 P.textMuted
//                                         }}
//                                     >
//                                         {" "}kW
//                                     </span>

//                                 </div>

//                             </div>

//                         </div>


//                         {/* =================================================
//                             GENERATION SUMMARY
//                         ================================================= */}

//                         <h2
//                             style={{
//                                 fontSize:
//                                     15,

//                                 fontWeight:
//                                     800,

//                                 color:
//                                     P.textWhite,

//                                 marginBottom:
//                                     14,

//                                 marginTop:
//                                     4,

//                                 letterSpacing:
//                                     0.5,

//                                 fontFamily:
//                                     "'DM Sans', sans-serif"
//                             }}
//                         >
//                             GENERATION SUMMARY
//                         </h2>


//                         <div
//                             style={{
//                                 display:
//                                     "grid",

//                                 gridTemplateColumns:
//                                     "1fr 1fr 1fr",

//                                 gap:
//                                     10,

//                                 marginBottom:
//                                     16
//                             }}
//                         >

//                             {/* TODAY */}

//                             <div
//                                 style={
//                                     statCard
//                                 }
//                             >

//                                 <div
//                                     style={
//                                         statIconWrap
//                                     }
//                                 >

//                                     <svg
//                                         width="18"
//                                         height="18"
//                                         viewBox="0 0 24 24"
//                                         fill="none"
//                                         stroke={
//                                             P.borderStrong
//                                         }
//                                         strokeWidth="2.5"
//                                         strokeLinecap="round"
//                                         strokeLinejoin="round"
//                                     >
//                                         <polygon
//                                             points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"
//                                         />
//                                     </svg>

//                                 </div>


//                                 <div
//                                     style={
//                                         statSubLabel
//                                     }
//                                 >
//                                     TODAY
//                                 </div>


//                                 <div
//                                     style={{
//                                         ...statValue,

//                                         color:
//                                             P.textAmberBright
//                                     }}
//                                 >
//                                     {
//                                         energy?.today ??
//                                         "--"
//                                     }
//                                 </div>


//                                 <div
//                                     style={
//                                         statUnit
//                                     }
//                                 >
//                                     kWh
//                                 </div>

//                             </div>


//                             {/* MONTH */}

//                             <div
//                                 style={
//                                     statCard
//                                 }
//                             >

//                                 <div
//                                     style={
//                                         statIconWrap
//                                     }
//                                 >

//                                     <svg
//                                         width="18"
//                                         height="18"
//                                         viewBox="0 0 24 24"
//                                         fill="none"
//                                         stroke={
//                                             P.borderStrong
//                                         }
//                                         strokeWidth="2.5"
//                                         strokeLinecap="round"
//                                         strokeLinejoin="round"
//                                     >

//                                         <circle
//                                             cx="12"
//                                             cy="12"
//                                             r="5"
//                                         />

//                                         <line
//                                             x1="12"
//                                             y1="1"
//                                             x2="12"
//                                             y2="3"
//                                         />

//                                         <line
//                                             x1="12"
//                                             y1="21"
//                                             x2="12"
//                                             y2="23"
//                                         />

//                                         <line
//                                             x1="4.22"
//                                             y1="4.22"
//                                             x2="5.64"
//                                             y2="5.64"
//                                         />

//                                         <line
//                                             x1="18.36"
//                                             y1="18.36"
//                                             x2="19.78"
//                                             y2="19.78"
//                                         />

//                                         <line
//                                             x1="1"
//                                             y1="12"
//                                             x2="3"
//                                             y2="12"
//                                         />

//                                         <line
//                                             x1="21"
//                                             y1="12"
//                                             x2="23"
//                                             y2="12"
//                                         />

//                                     </svg>

//                                 </div>


//                                 <div
//                                     style={
//                                         statSubLabel
//                                     }
//                                 >
//                                     MONTH
//                                 </div>


//                                 <div
//                                     style={{
//                                         ...statValue,

//                                         color:
//                                             P.textAmberBright
//                                     }}
//                                 >
//                                     {
//                                         energy?.monthly ??
//                                         "--"
//                                     }
//                                 </div>


//                                 <div
//                                     style={
//                                         statUnit
//                                     }
//                                 >
//                                     kWh
//                                 </div>

//                             </div>


//                             {/* TOTAL */}

//                             <div
//                                 style={
//                                     statCard
//                                 }
//                             >

//                                 <div
//                                     style={
//                                         statIconWrap
//                                     }
//                                 >

//                                     <svg
//                                         width="18"
//                                         height="18"
//                                         viewBox="0 0 24 24"
//                                         fill="none"
//                                         stroke={
//                                             P.borderStrong
//                                         }
//                                         strokeWidth="2.5"
//                                         strokeLinecap="round"
//                                         strokeLinejoin="round"
//                                     >

//                                         <circle
//                                             cx="12"
//                                             cy="12"
//                                             r="10"
//                                         />

//                                         <polyline
//                                             points="12 6 12 12 16 14"
//                                         />

//                                     </svg>

//                                 </div>


//                                 <div
//                                     style={
//                                         statSubLabel
//                                     }
//                                 >
//                                     TOTAL
//                                 </div>


//                                 <div
//                                     style={{
//                                         ...statValue,

//                                         color:
//                                             P.textAmberBright
//                                     }}
//                                 >
//                                     {
//                                         getParameterValue(
//                                             "LKWH"
//                                         )
//                                     }
//                                 </div>


//                                 <div
//                                     style={
//                                         statUnit
//                                     }
//                                 >
//                                     kWh
//                                 </div>

//                             </div>

//                         </div>


//                         {/* =================================================
//                             CHART CARD
//                         ================================================= */}

//                         <div
//                             style={
//                                 chartCard
//                             }
//                         >

//                             {/* HEADER */}

//                             <div
//                                 style={
//                                     chartHeader
//                                 }
//                             >

//                                 <span
//                                     style={
//                                         chartTitle
//                                     }
//                                 >
//                                     {
//                                         chartTitles[
//                                             chartMode
//                                         ]
//                                     }
//                                 </span>


//                                 <div
//                                     style={{
//                                         display:
//                                             "flex",

//                                         alignItems:
//                                             "center",

//                                         gap:
//                                             8
//                                     }}
//                                 >

//                                     {/* BADGE */}

//                                     <span
//                                         style={
//                                             chartBadge
//                                         }
//                                     >

//                                        {chartMode === "today"

//     ? todayOffset === 0

//         ? `${
//             currentSolarPower !== null
//                 ? currentSolarPower.toFixed(0)
//                 : "--"
//         } W`

//         : `${chartMeta?.label ?? ""}`

//     : `${
//         Number(
//             chartMeta?.total ?? 0
//         ).toFixed(2)
//     } kWh`
// }

//                                     </span>


//                                     {/* REFRESH */}

//                                     <button
//                                         onClick={
//                                             handleRefreshEnergy
//                                         }
//                                         disabled={
//                                             refreshing
//                                         }
//                                         title="Refresh energy data"
//                                         style={{
//                                             width:
//                                                 34,

//                                             height:
//                                                 34,

//                                             border:
//                                                 `1px solid ${P.border}`,

//                                             borderRadius:
//                                                 8,

//                                             background:
//                                                 refreshing
//                                                     ? P.bg
//                                                     : P.surface,

//                                             color:
//                                                 P.textPrimary,

//                                             display:
//                                                 "flex",

//                                             alignItems:
//                                                 "center",

//                                             justifyContent:
//                                                 "center",

//                                             cursor:
//                                                 refreshing
//                                                     ? "default"
//                                                     : "pointer",

//                                             padding:
//                                                 0,

//                                             opacity:
//                                                 refreshing
//                                                     ? 0.6
//                                                     : 1
//                                         }}
//                                     >

//                                         <svg
//                                             width="16"
//                                             height="16"
//                                             viewBox="0 0 24 24"
//                                             fill="none"
//                                             stroke="currentColor"
//                                             strokeWidth="2"
//                                             strokeLinecap="round"
//                                             strokeLinejoin="round"
//                                         >

//                                             <path
//                                                 d="M20 11a8.1 8.1 0 0 0-15.5-2"
//                                             />

//                                             <polyline
//                                                 points="4 4 4 9 9 9"
//                                             />

//                                             <path
//                                                 d="M4 13a8.1 8.1 0 0 0 15.5 2"
//                                             />

//                                             <polyline
//                                                 points="20 20 20 15 15 15"
//                                             />

//                                         </svg>

//                                     </button>

//                                 </div>

//                             </div>


//                             {/* MODE TABS */}

//                             <div
//                                 style={{
//                                     display:
//                                         "flex",

//                                     background:
//                                         P.bg,

//                                     borderRadius:
//                                         10,

//                                     padding:
//                                         4,

//                                     marginBottom:
//                                         18
//                                 }}
//                             >

//                                 {[
//                                     [
//                                         "today",
//                                         "Today"
//                                     ],

//                                     [
//                                         "week",
//                                         "Week"
//                                     ],

//                                     [
//                                         "month",
//                                         "Month"
//                                     ],

//                                     [
//                                         "year",
//                                         "Year"
//                                     ]
//                                 ].map(
//                                     ([
//                                         key,
//                                         label
//                                     ]) => (

//                                         <button
//                                             key={
//                                                 key
//                                             }
//                                             onClick={() =>
//                                                 setChartMode(
//                                                     key
//                                                 )
//                                             }
//                                             style={{
//                                                 flex:
//                                                     1,

//                                                 border:
//                                                     "none",

//                                                 borderRadius:
//                                                     8,

//                                                 padding:
//                                                     "8px 4px",

//                                                 cursor:
//                                                     "pointer",

//                                                 background:
//                                                     chartMode ===
//                                                     key
//                                                         ? P.amber
//                                                         : "transparent",

//                                                 color:
//                                                     chartMode ===
//                                                     key
//                                                         ? P.surface
//                                                         : P.textMuted,

//                                                 fontSize:
//                                                     11,

//                                                 fontWeight:
//                                                     700,

//                                                 fontFamily:
//                                                     "'Inter', sans-serif"
//                                             }}
//                                         >
//                                             {
//                                                 label
//                                             }
//                                         </button>
//                                     )
//                                 )}

//                             </div>


//                             {/* =================================================
//                                 TODAY NAVIGATION
//                             ================================================= */}

//                             {chartMode === "today" && (

//                                 <div
//                                     style={{
//                                         display:
//                                             "flex",

//                                         alignItems:
//                                             "center",

//                                         justifyContent:
//                                             "space-between",

//                                         marginBottom:
//                                             16
//                                     }}
//                                 >

//                                     <button
//                                         onClick={() =>
//                                             setTodayOffset(
//                                                 value =>
//                                                     value - 1
//                                             )
//                                         }
//                                         style={{
//                                             ...navigationButtonStyle,
//                                             cursor: "pointer"
//                                         }}
//                                     >
//                                         ‹
//                                     </button>


//                                     <div
//                                         style={{
//                                             fontSize: 12,
//                                             fontWeight: 700,
//                                             color: P.textPrimary,
//                                             textAlign: "center"
//                                         }}
//                                     >
//                                         {chartMeta?.label ||
//                                             "Today"}
//                                     </div>


//                                     <button
//                                         onClick={() =>
//                                             setTodayOffset(
//                                                 value =>
//                                                     Math.min(
//                                                         0,
//                                                         value + 1
//                                                     )
//                                             )
//                                         }
//                                         disabled={
//                                             todayOffset === 0
//                                         }
//                                         style={{
//                                             ...navigationButtonStyle,

//                                             cursor:
//                                                 todayOffset === 0
//                                                     ? "default"
//                                                     : "pointer",

//                                             opacity:
//                                                 todayOffset === 0
//                                                     ? 0.4
//                                                     : 1
//                                         }}
//                                     >
//                                         ›
//                                     </button>

//                                 </div>
//                             )}


//                             {/* =================================================
//                                 WEEK NAVIGATION
//                             ================================================= */}

//                             {chartMode ===
//                                 "week" && (

//                                 <div
//                                     style={{
//                                         display:
//                                             "flex",

//                                         alignItems:
//                                             "center",

//                                         justifyContent:
//                                             "space-between",

//                                         marginBottom:
//                                             16
//                                     }}
//                                 >

//                                     <button
//                                         onClick={() =>
//                                             setWeekOffset(
//                                                 value =>
//                                                     value -
//                                                     1
//                                             )
//                                         }
//                                         style={{
//                                             ...navigationButtonStyle,

//                                             cursor:
//                                                 "pointer"
//                                         }}
//                                     >
//                                         ‹
//                                     </button>


//                                     <div
//                                         style={{
//                                             fontSize:
//                                                 12,

//                                             fontWeight:
//                                                 700,

//                                             color:
//                                                 P.textPrimary,

//                                             textAlign:
//                                                 "center"
//                                         }}
//                                     >

//                                         {chartMeta?.range

//                                             ? `${chartMeta.range.start} — ${chartMeta.range.end}`

//                                             : "Current week"
//                                         }

//                                     </div>


//                                     <button
//                                         onClick={() =>
//                                             setWeekOffset(
//                                                 value =>
//                                                     Math.min(
//                                                         0,
//                                                         value +
//                                                         1
//                                                     )
//                                             )
//                                         }
//                                         disabled={
//                                             weekOffset ===
//                                             0
//                                         }
//                                         style={{
//                                             ...navigationButtonStyle,

//                                             cursor:
//                                                 weekOffset ===
//                                                 0
//                                                     ? "default"
//                                                     : "pointer",

//                                             opacity:
//                                                 weekOffset ===
//                                                 0
//                                                     ? 0.4
//                                                     : 1
//                                         }}
//                                     >
//                                         ›
//                                     </button>

//                                 </div>
//                             )}


//                             {/* =================================================
//                                 MONTH NAVIGATION
//                             ================================================= */}

//                             {chartMode ===
//                                 "month" && (

//                                 <div
//                                     style={{
//                                         display:
//                                             "flex",

//                                         alignItems:
//                                             "center",

//                                         justifyContent:
//                                             "space-between",

//                                         marginBottom:
//                                             16
//                                     }}
//                                 >

//                                     <button
//                                         onClick={() =>
//                                             setMonthOffset(
//                                                 value =>
//                                                     value -
//                                                     1
//                                             )
//                                         }
//                                         style={{
//                                             ...navigationButtonStyle,

//                                             cursor:
//                                                 "pointer"
//                                         }}
//                                     >
//                                         ‹
//                                     </button>


//                                     <div
//                                         style={{
//                                             fontSize:
//                                                 12,

//                                             fontWeight:
//                                                 700,

//                                             color:
//                                                 P.textPrimary,

//                                             textAlign:
//                                                 "center"
//                                         }}
//                                     >
//                                         {
//                                             chartMeta?.label ||
//                                             "Current month"
//                                         }
//                                     </div>


//                                     <button
//                                         onClick={() =>
//                                             setMonthOffset(
//                                                 value =>
//                                                     Math.min(
//                                                         0,
//                                                         value +
//                                                         1
//                                                     )
//                                             )
//                                         }
//                                         disabled={
//                                             monthOffset ===
//                                             0
//                                         }
//                                         style={{
//                                             ...navigationButtonStyle,

//                                             cursor:
//                                                 monthOffset ===
//                                                 0
//                                                     ? "default"
//                                                     : "pointer",

//                                             opacity:
//                                                 monthOffset ===
//                                                 0
//                                                     ? 0.4
//                                                     : 1
//                                         }}
//                                     >
//                                         ›
//                                     </button>

//                                 </div>
//                             )}


//                             {/* =================================================
//                                 YEAR NAVIGATION
//                             ================================================= */}

//                             {chartMode === "year" && (

//                                 <div
//                                     style={{
//                                         display: "flex",
//                                         alignItems: "center",
//                                         justifyContent: "space-between",
//                                         marginBottom: 16
//                                     }}
//                                 >

//                                     <button
//                                         onClick={() =>
//                                             setYearOffset(
//                                                 value => value - 1
//                                             )
//                                         }
//                                         style={{
//                                             ...navigationButtonStyle,
//                                             cursor: "pointer"
//                                         }}
//                                     >
//                                         ‹
//                                     </button>


//                                     <div
//                                         style={{
//                                             fontSize: 12,
//                                             fontWeight: 700,
//                                             color: P.textPrimary,
//                                             textAlign: "center"
//                                         }}
//                                     >
//                                         {chartMeta?.label ||
//                                             "Current year"}
//                                     </div>


//                                     <button
//                                         onClick={() =>
//                                             setYearOffset(
//                                                 value =>
//                                                     Math.min(
//                                                         0,
//                                                         value + 1
//                                                     )
//                                             )
//                                         }
//                                         disabled={
//                                             yearOffset === 0
//                                         }
//                                         style={{
//                                             ...navigationButtonStyle,

//                                             cursor:
//                                                 yearOffset === 0
//                                                     ? "default"
//                                                     : "pointer",

//                                             opacity:
//                                                 yearOffset === 0
//                                                     ? 0.4
//                                                     : 1
//                                         }}
//                                     >
//                                         ›
//                                     </button>

//                                 </div>
//                             )}


//                             {/* =================================================
//                                 CHART
//                             ================================================= */}

//                             {chartMode ===
//                             "today"

//                                 ? (

//                                     <SolarPowerLineChart
//                                         data={
//                                             chartData
//                                         }
//                                     />

//                                 )

//                                 : (

//                                     <EnergyBarChart
//                                         data={
//                                             chartData
//                                         }
//                                         color={
//                                             P.textAmberBright
//                                         }
//                                         mode={
//                                             chartMode
//                                         }
//                                     />
//                                 )
//                             }


//                             {/* DESCRIPTION */}

//                             <div
//                                 style={{
//                                     textAlign:
//                                         "center",

//                                     marginTop:
//                                         8,

//                                     fontSize:
//                                         10,

//                                     color:
//                                         P.textLight
//                                 }}
//                             >
//                                 {
//                                     chartDescriptions[
//                                         chartMode
//                                     ]
//                                 }
//                             </div>

//                         </div>

//                     </div>

//                 </div>


//                 <Footer
//                     data={
//                         data
//                     }
//                 />

//             </div>

//         </PageBackground>
//     );
// }