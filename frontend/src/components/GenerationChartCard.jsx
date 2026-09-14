// import P from "../theme/colors";
// import Chart from "react-apexcharts";

// export default function GenerationChartCard({
//     data,
//     chartMode,
//     setChartMode,
//     chartData,
//     chartMeta,
//     todayOffset,
//     setTodayOffset,
//     weekOffset,
//     setWeekOffset,
//     monthOffset,
//     setMonthOffset,
//     yearOffset,
//     setYearOffset,
//     refreshing,
//     handleRefreshEnergy
// }) {

//     // CURRENT SOLAR POWER
//     // PPOW is Watts
//     const currentSolarPower = Number.isFinite(Number(data?.PPOW)) ? Number(data.PPOW) : null;

//     const chartDescriptions = {
//         week: "Energy generated per day",
//         month: "Energy generated per day",
//         year: "Energy generated per month"
//     };

//     // HARDCODED FALLBACK DATA — ensures the chart always shows a plotted
//     // graph even when no real data has come back from the backend yet.
//     const FALLBACK_CHART_DATA = {
//         today: [
//             { label: "06:00", value: 0.2 }, { label: "07:00", value: 0.8 },
//             { label: "08:00", value: 1.6 }, { label: "09:00", value: 2.4 },
//             { label: "10:00", value: 3.1 }, { label: "11:00", value: 3.6 },
//             { label: "12:00", value: 3.9 }, { label: "13:00", value: 3.7 },
//             { label: "14:00", value: 3.3 }, { label: "15:00", value: 2.6 },
//             { label: "16:00", value: 1.8 }, { label: "17:00", value: 0.9 },
//             { label: "18:00", value: 0.3 },
//         ],
//         week: [
//             { label: "Mon", value: 14.2 }, { label: "Tue", value: 16.8 },
//             { label: "Wed", value: 12.5 }, { label: "Thu", value: 18.1 },
//             { label: "Fri", value: 15.6 }, { label: "Sat", value: 19.4 },
//             { label: "Sun", value: 17.3 },
//         ],
//         month: Array.from({ length: 31 }, (_, index) => ({
//             label: String(index + 1),
//             value: Number((12 + Math.sin(index / 2.5) * 6 + (index % 5)).toFixed(1)),
//         })),
//         year: [
//             { label: "Jan", value: 320 }, { label: "Feb", value: 340 },
//             { label: "Mar", value: 410 }, { label: "Apr", value: 460 },
//             { label: "May", value: 505 }, { label: "Jun", value: 470 },
//             { label: "Jul", value: 430 }, { label: "Aug", value: 445 },
//             { label: "Sep", value: 400 }, { label: "Oct", value: 360 },
//             { label: "Nov", value: 300 }, { label: "Dec", value: 280 },
//         ],
//     };

//     const effectiveChartData =
//         Array.isArray(chartData) && chartData.length > 0
//             ? chartData
//             : FALLBACK_CHART_DATA[chartMode] || FALLBACK_CHART_DATA.today;

//     // STYLES
//     const chartCard = { background: "rgba(22, 38, 45, 0.88)", borderRadius: 16, padding: "16px", marginBottom: 14, boxShadow: P.shadowCard, border: "1px solid rgba(255,255,255,0.08)" };
//     const chartHeader = { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16, gap: 12 };
//     const chartTitle = { fontSize: 14, fontWeight: 700, color: "#ffffff", fontFamily: "'DM Sans', sans-serif" };
//     const chartBadge = { background: P.amber, color: "#ffffff", fontSize: 12, fontWeight: 700, padding: "4px 10px", borderRadius: 20, fontFamily: "'Inter', sans-serif", whiteSpace: "nowrap" };
//     const navigationButtonStyle = { width: 34, height: 34, border: "1px solid rgba(255,255,255,0.12)", borderRadius: 8, background: "rgba(255,255,255,0.06)", color: "#ffffff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, padding: 0 };

//     // =====================================================
//     // APEXCHARTS SETUP
//     // =====================================================

//     const isToday = chartMode === "today";
//     const isMonthly = chartMode === "month";

//     const categories = effectiveChartData.map((item) => item.label);
//     const values = effectiveChartData.map((item) => Number(item.value) || 0);

//     const series = [
//         {
//             name: isToday ? "Power" : "Energy",
//             data: values,
//         },
//     ];

//     const chartOptions = {
//         chart: {
//             type: isToday ? "area" : "bar",
//             toolbar: { show: false },
//             zoom: { enabled: false },
//             background: "transparent",
//             foreColor: "rgba(255,255,255,0.6)",
//             animations: { enabled: true, easing: "easeinout", speed: 450 },
//         },
//         theme: { mode: "dark" },
//         colors: ["#ffffff"],
//         dataLabels: { enabled: false },
//         stroke: isToday
//             ? { curve: "straight", width: 1.5, colors: ["#ffffff"] }
//             : { show: false },
//         fill: isToday
//             ? { type: "solid", opacity: 0.9 }
//             : { type: "solid", opacity: 1 },
//         plotOptions: !isToday
//             ? {
//                   bar: {
//                       borderRadius: 1,
//                       columnWidth: isMonthly ? "45%" : "50%",
//                   },
//               }
//             : {},
//         grid: {
//             borderColor: "rgba(255,255,255,0.15)",
//             strokeDashArray: 3,
//             xaxis: { lines: { show: false } },
//             padding: { left: 4, right: 4 },
//         },
//         xaxis: {
//             categories,
//             labels: {
//                 style: { colors: "rgba(255,255,255,0.6)", fontSize: "9px" },
//                 rotate: -45,
//                 trim: true,
//             },
//             axisBorder: { show: false },
//             axisTicks: { show: false },
//         },
//         yaxis: {
//             labels: {
//                 style: { colors: "rgba(255,255,255,0.6)", fontSize: "9px" },
//             },
//         },
//         tooltip: {
//             theme: "dark",
//             y: {
//                 formatter: (val) => `${val} ${isToday ? "kW" : "kWh"}`,
//             },
//         },
//         legend: { show: false },
//     };

//     // NAVIGATION
//     const renderNavigation = () => {

//         // TODAY
//         if (chartMode === "today") {
//             return (
//                 <PeriodNavigation
//                     leftAction={() => setTodayOffset((value) => value - 1)}
//                     rightAction={() => setTodayOffset((value) => Math.min(0, value + 1))}
//                     rightDisabled={todayOffset === 0}
//                     label={chartMeta?.label || "Today"}
//                     buttonStyle={navigationButtonStyle}
//                 />
//             );
//         }

//         // WEEK
//         if (chartMode === "week") {
//             return (
//                 <PeriodNavigation
//                     leftAction={() => setWeekOffset((value) => value - 1)}
//                     rightAction={() => setWeekOffset((value) => Math.min(0, value + 1))}
//                     rightDisabled={weekOffset === 0}
//                     label={chartMeta?.range ? `${chartMeta.range.start} — ${chartMeta.range.end}` : "Current week"}
//                     buttonStyle={navigationButtonStyle}
//                 />
//             );
//         }

//         // MONTH
//         if (chartMode === "month") {
//             return (
//                 <PeriodNavigation
//                     leftAction={() => setMonthOffset((value) => value - 1)}
//                     rightAction={() => setMonthOffset((value) => Math.min(0, value + 1))}
//                     rightDisabled={monthOffset === 0}
//                     label={chartMeta?.label || "Current month"}
//                     buttonStyle={navigationButtonStyle}
//                 />
//             );
//         }

//         // YEAR
//         return (
//             <PeriodNavigation
//                 leftAction={() => setYearOffset((value) => value - 1)}
//                 rightAction={() => setYearOffset((value) => Math.min(0, value + 1))}
//                 rightDisabled={yearOffset === 0}
//                 label={chartMeta?.label || "Current year"}
//                 buttonStyle={navigationButtonStyle}
//             />
//         );
//     };

//     // UI
//     return (
//         <div style={chartCard}>
//             {/* HEADER — fixed title + refresh, matches "GENERATION CHART" header in the app */}
//             <div style={chartHeader}>
//                 <span style={chartTitle}>Generation Chart</span>

//                 <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
//                     {/* BADGE */}
//                     <span style={chartBadge}>
//                         {chartMode === "today"
//                             ? todayOffset === 0
//                                 ? `${currentSolarPower !== null ? currentSolarPower.toFixed(0) : "--"} W`
//                                 : chartMeta?.label || ""
//                             : `${Number(chartMeta?.total ?? 0).toFixed(2)} kWh`}
//                     </span>

//                     {/* REFRESH */}
//                     <button
//                         type="button"
//                         onClick={handleRefreshEnergy}
//                         disabled={refreshing}
//                         aria-label="Refresh chart"
//                         title="Refresh energy data"
//                         style={{ width: 34, height: 34, border: "1px solid rgba(255,255,255,0.12)", borderRadius: 8, background: refreshing ? "rgba(255,255,255,0.03)" : "rgba(255,255,255,0.06)", color: "#ffffff", display: "flex", alignItems: "center", justifyContent: "center", cursor: refreshing ? "default" : "pointer", padding: 0, opacity: refreshing ? 0.6 : 1, flexShrink: 0 }}
//                     >
//                         <svg
//                             width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
//                             style={{ transform: refreshing ? "rotate(360deg)" : "none", transition: refreshing ? "transform 0.8s linear" : "none" }}
//                         >
//                             <path d="M20 11a8.1 8.1 0 0 0-15.5-2" />
//                             <polyline points="4 4 4 9 9 9" />
//                             <path d="M4 13a8.1 8.1 0 0 0 15.5 2" />
//                             <polyline points="20 20 20 15 15 15" />
//                         </svg>
//                     </button>
//                 </div>
//             </div>

//             {/* CHART — ApexCharts area chart for "today", bar chart for week/month/year */}
//             <Chart
//                 key={chartMode}
//                 options={chartOptions}
//                 series={series}
//                 type={isToday ? "area" : "bar"}
//                 height={240}
//             />

//             {/* DATE NAVIGATION — sits below the chart, above the period tabs,
//                 matching the "‹ Sat 5th Sept'26 ›" row from the screenshots */}
//             <div style={{ marginTop: 10 }}>
//                 {renderNavigation()}
//             </div>

//             {/* PERIOD TABS — underlined style at the bottom of the card,
//                 matching TODAY / WEEK / MONTH / YEAR from the screenshots */}
//             <div
//                 style={{
//                     display: "grid",
//                     gridTemplateColumns: "repeat(4, 1fr)",
//                     borderTop: "1px solid rgba(255,255,255,0.12)",
//                     paddingTop: 10,
//                 }}
//             >
//                 {[["today", "TODAY"], ["week", "WEEK"], ["month", "MONTH"], ["year", "YEAR"]].map(([key, label]) => {
//                     const active = chartMode === key;
//                     return (
//                         <button
//                             key={key}
//                             type="button"
//                             onClick={() => setChartMode(key)}
//                             style={{
//                                 border: "none",
//                                 background: "transparent",
//                                 cursor: "pointer",
//                                 padding: "6px 2px 10px",
//                                 fontSize: 12,
//                                 fontWeight: active ? 800 : 600,
//                                 letterSpacing: 0.4,
//                                 color: active ? "#ffffff" : "rgba(255,255,255,0.6)",
//                                 fontFamily: "'Inter', sans-serif",
//                                 borderBottom: active ? "2px solid #ffffff" : "2px solid transparent",
//                             }}
//                         >
//                             {label}
//                         </button>
//                     );
//                 })}
//             </div>

//             {/* DESCRIPTION */}
//             <div style={{ textAlign: "center", marginTop: 8, fontSize: 10, color: "rgba(255,255,255,0.5)" }}>
//                 {chartDescriptions[chartMode]}
//             </div>
//         </div>
//     );
// }

// // PERIOD NAVIGATION
// function PeriodNavigation({ leftAction, rightAction, rightDisabled, label, buttonStyle }) {
//     return (
//         <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16, gap: 12 }}>
//             {/* LEFT */}
//             <button type="button" onClick={leftAction} style={{ ...buttonStyle, cursor: "pointer" }}>‹</button>

//             {/* LABEL */}
//             <div style={{ flex: 1, minWidth: 0, fontSize: 12, fontWeight: 700, color: "#ffffff", textAlign: "center", fontFamily: "'Inter', sans-serif", overflowWrap: "anywhere" }}>
//                 {label}
//             </div>

//             {/* RIGHT */}
//             <button
//                 type="button"
//                 onClick={rightAction}
//                 disabled={rightDisabled}
//                 style={{ ...buttonStyle, cursor: rightDisabled ? "default" : "pointer", opacity: rightDisabled ? 0.4 : 1 }}
//             >›</button>
//         </div>
//     );
// }








// import P from "../theme/colors";

// export default function GenerationChartCard({
//     data,
//     chartMode,
//     setChartMode,
//     chartData,
//     chartMeta,
//     todayOffset,
//     setTodayOffset,
//     weekOffset,
//     setWeekOffset,
//     monthOffset,
//     setMonthOffset,
//     yearOffset,
//     setYearOffset,
//     refreshing,
//     handleRefreshEnergy,
// }) {

//     // CURRENT SOLAR POWER
//     // PPOW from inverter payload is Watts
//     const currentSolarPower = Number.isFinite(Number(data?.PPOW)) ? Number(data.PPOW) : null;

//     // DESCRIPTION
//     const chartDescriptions = {
//         today: "Solar power throughout the day",
//         week: "Energy generated per day",
//         month: "Energy generated per day",
//         year: "Energy generated per month",
//     };

//     // COMMON STYLES
//     const cardStyle = {
//         width: "100%",
//         boxSizing: "border-box",
//         background: "rgba(22, 38, 45, 0.88)",
//         borderRadius: 16,
//         padding: "16px",
//         marginBottom: 16,
//         border: "1px solid rgba(255,255,255,0.08)",
//         boxShadow: P.shadowCard,
//         overflow: "hidden",
//         fontFamily: "'Inter', sans-serif",
//     };

//     const navigationButtonStyle = {
//         width: 34,
//         height: 34,
//         border: "1px solid rgba(255,255,255,0.12)",
//         borderRadius: 8,
//         background: "rgba(255,255,255,0.06)",
//         color: "#ffffff",
//         display: "flex",
//         alignItems: "center",
//         justifyContent: "center",
//         fontSize: 20,
//         padding: 0,
//         flexShrink: 0,
//         WebkitTapHighlightColor: "transparent",
//     };

//     // TODAY SOLAR POWER LINE CHART
//     const SolarPowerLineChart = ({ data }) => {
//         const safeData = Array.isArray(data) ? data : [];

//         // EMPTY
//         if (safeData.length === 0) {
//             return <EmptyChartMessage>No solar power data available</EmptyChartMessage>;
//         }

//         // DIMENSIONS
//         const width = 500;
//         const height = 220;
//         const leftPadding = 45;
//         const rightPadding = 15;
//         const topPadding = 20;
//         const bottomPadding = 35;

//         // HH:mm -> MINUTES
//         const getMinutes = (label) => {
//             if (typeof label !== "string" || !label.includes(":")) return null;
//             const [hourString, minuteString] = label.split(":");
//             const hour = Number(hourString);
//             const minute = Number(minuteString);
//             if (!Number.isFinite(hour) || !Number.isFinite(minute)) return null;
//             return hour * 60 + minute;
//         };

//         // VALID DATA
//         const validData = safeData.filter((item) => {
//             const minutes = getMinutes(item?.label);
//             const value = Number(item?.value);
//             return minutes !== null && Number.isFinite(value);
//         });

//         if (validData.length === 0) {
//             return <EmptyChartMessage>No valid solar power data available</EmptyChartMessage>;
//         }

//         // TIME RANGE
//         const firstMinute = getMinutes(validData[0].label);
//         const lastMinute = getMinutes(validData[validData.length - 1].label);
//         const timeRange = Math.max(lastMinute - firstMinute, 1);

//         // MAX VALUE
//         const rawMax = Math.max(...validData.map((item) => Number(item.value) || 0), 0);

//         // CLEAN Y-AXIS MAX
//         const getNiceMax = (value) => {
//             if (value <= 0) return 1;
//             const magnitude = Math.pow(10, Math.floor(Math.log10(value)));
//             const normalized = value / magnitude;
//             let nice;
//             if (normalized <= 1) nice = 1;
//             else if (normalized <= 2) nice = 2;
//             else if (normalized <= 5) nice = 5;
//             else nice = 10;
//             return nice * magnitude;
//         };

//         const yAxisMax = Math.max(getNiceMax(rawMax), 1);

//         // Y AXIS
//         const tickCount = 5;
//         const yTicks = Array.from({ length: tickCount + 1 }, (_, index) =>
//             Number(((yAxisMax / tickCount) * index).toFixed(2))
//         );

//         // PLOT
//         const plotWidth = width - leftPadding - rightPadding;
//         const plotHeight = height - topPadding - bottomPadding;

//         const points = validData.map((item) => {
//             const currentMinute = getMinutes(item.label);
//             const value = Number(item.value);
//             const x = leftPadding + ((currentMinute - firstMinute) / timeRange) * plotWidth;
//             const y = topPadding + (1 - value / yAxisMax) * plotHeight;
//             return { x, y, item };
//         });

//         // LINE
//         const linePath = points.map((point, index) => `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`).join(" ");

//         // FILLED AREA
//         const baselineY = topPadding + plotHeight;
//         const areaPath =
//             points.length > 0
//                 ? `M ${points[0].x} ${baselineY} ` +
//                   points.map((point) => `L ${point.x} ${point.y}`).join(" ") +
//                   ` L ${points[points.length - 1].x} ${baselineY} Z`
//                 : "";

//         // X LABELS
//         const xLabelCount = Math.min(7, validData.length);
//         const xLabelIndexes = Array.from({ length: xLabelCount }, (_, index) =>
//             Math.round((index / Math.max(xLabelCount - 1, 1)) * (validData.length - 1))
//         );

//         // DRAW
//         return (
//             <div style={{ width: "100%", overflow: "hidden" }}>
//                 <svg viewBox={`0 0 ${width} ${height}`} style={{ width: "100%", height: 230, display: "block" }}>
//                     {/* GRID + Y AXIS */}
//                     {[...yTicks].reverse().map((tick, index) => {
//                         const y = topPadding + (index / tickCount) * plotHeight;
//                         return (
//                             <g key={index}>
//                                 <line x1={leftPadding} y1={y} x2={width - rightPadding} y2={y} stroke="rgba(255,255,255,0.15)" strokeDasharray="4 4" />
//                                 <text x={leftPadding - 7} y={y + 3} textAnchor="end" fontSize="9" fill="rgba(255,255,255,0.65)">{tick}</text>
//                             </g>
//                         );
//                     })}

//                     {/* AREA */}
//                     <path d={areaPath} fill="rgba(255,255,255,0.13)" />

//                     {/* LINE */}
//                     <path d={linePath} fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />

//                     {/* DOTS
//                         Backend samples are frequent.
//                         Do not draw every dot or the chart
//                         becomes visually crowded. */}
//                     {points.map((point, index) => {
//                         if (index % 12 !== 0 && index !== points.length - 1) return null;
//                         return <circle key={index} cx={point.x} cy={point.y} r="2.5" fill="#ffffff" />;
//                     })}
//                 </svg>

//                 {/* X AXIS LABELS */}
//                 <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", color: "rgba(255,255,255,0.6)", padding: "0 8px 0 42px", minHeight: 26 }}>
//                     {xLabelIndexes.map((dataIndex, index) => (
//                         <span key={index} style={{ whiteSpace: "nowrap", fontSize: 8 }}>
//                             {validData[dataIndex]?.label ?? ""}
//                         </span>
//                     ))}
//                 </div>
//             </div>
//         );
//     };

//     // WEEK / MONTH / YEAR BAR CHART
//     const EnergyBarChart = ({ data, mode }) => {
//         const safeData = Array.isArray(data) ? data : [];

//         if (safeData.length === 0) {
//             return <EmptyChartMessage>No energy data available</EmptyChartMessage>;
//         }

//         const values = safeData.map((item) => Number(item.value) || 0);
//         const maxValue = Math.max(...values, 0);

//         // NICE Y MAX
//         const getNiceMax = (value) => {
//             if (value <= 0) return 10;
//             const magnitude = Math.pow(10, Math.floor(Math.log10(value)));
//             const normalized = value / magnitude;
//             if (normalized <= 1) return magnitude;
//             if (normalized <= 2) return 2 * magnitude;
//             if (normalized <= 5) return 5 * magnitude;
//             return 10 * magnitude;
//         };

//         const yAxisMax = getNiceMax(maxValue);
//         const tickCount = 5;
//         const yAxisTicks = Array.from({ length: tickCount + 1 }, (_, index) =>
//             Number(((yAxisMax / tickCount) * index).toFixed(1))
//         );

//         const chartHeight = 240;
//         const plotHeight = 180;
//         const isWeekly = mode === "week";
//         const isMonthly = mode === "month";
//         const isYearly = mode === "year";

//         // X LABEL VISIBILITY
//         const shouldShowLabel = (index) => {
//             if (isWeekly) return true;
//             if (isMonthly) return index === 0 || index % 5 === 0 || index === safeData.length - 1;
//             if (isYearly) return true;
//             return true;
//         };

//         return (
//             <div style={{ width: "100%", overflow: "hidden", paddingBottom: 8 }}>
//                 <div style={{ display: "flex", width: "100%", height: chartHeight }}>
//                     {/* Y AXIS */}
//                     <div style={{ width: 38, flexShrink: 0, height: plotHeight, display: "flex", flexDirection: "column", justifyContent: "space-between", alignItems: "flex-end", paddingRight: 6 }}>
//                         {[...yAxisTicks].reverse().map((tick, index) => (
//                             <span key={index} style={{ fontSize: 9, color: "rgba(255,255,255,0.65)", lineHeight: 1 }}>{tick}</span>
//                         ))}
//                     </div>

//                     {/* GRAPH */}
//                     <div style={{ flex: 1, minWidth: 0, position: "relative", height: chartHeight }}>
//                         {/* GRID */}
//                         <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: plotHeight, pointerEvents: "none" }}>
//                             {yAxisTicks.map((tick, index) => {
//                                 const position = (1 - tick / yAxisMax) * 100;
//                                 return <div key={index} style={{ position: "absolute", left: 0, right: 0, top: `${position}%`, borderTop: "1px dashed rgba(255,255,255,0.15)" }} />;
//                             })}
//                         </div>

//                         {/* BARS */}
//                         <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: plotHeight, display: "flex", alignItems: "flex-end", gap: isMonthly ? 2 : 5, padding: "0 2px" }}>
//                             {safeData.map((item, index) => {
//                                 const value = Number(item.value) || 0;
//                                 const barHeight = maxValue > 0 ? (value / yAxisMax) * plotHeight : 2;
//                                 return (
//                                     <div key={index} style={{ flex: 1, minWidth: 0, height: plotHeight, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "flex-end", position: "relative" }}>
//                                         {/* VALUE */}
//                                         {value > 0 && (
//                                             <div style={{ position: "absolute", bottom: Math.min(barHeight + 4, plotHeight - 12), fontSize: 8, fontWeight: 600, color: "rgba(255,255,255,0.75)", whiteSpace: "nowrap", zIndex: 2 }}>
//                                                 {value.toFixed(1)}
//                                             </div>
//                                         )}
//                                         {/* BAR */}
//                                         <div style={{ width: "100%", maxWidth: isMonthly ? 14 : 28, height: Math.max(barHeight, value > 0 ? 3 : 1), background: value > 0 ? "#ffffff" : "rgba(255,255,255,0.15)", borderRadius: "3px 3px 0 0", position: "absolute", bottom: 0, transition: "height 0.35s ease" }} />
//                                     </div>
//                                 );
//                             })}
//                         </div>

//                         {/* X AXIS */}
//                         <div style={{ position: "absolute", top: plotHeight + 8, left: 0, right: 0, display: "flex", alignItems: "center" }}>
//                             {safeData.map((item, index) => (
//                                 <div key={index} style={{ flex: 1, minWidth: 0, textAlign: "center", fontSize: isMonthly ? 8 : 9, color: "rgba(255,255,255,0.6)", whiteSpace: "nowrap", overflow: "hidden", visibility: shouldShowLabel(index) ? "visible" : "hidden" }}>
//                                     {item.label}
//                                 </div>
//                             ))}
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         );
//     };

//     // PERIOD NAVIGATION
//     const renderNavigation = () => {

//         if (chartMode === "today") {
//             return (
//                 <PeriodNavigation
//                     leftAction={() => setTodayOffset((value) => value - 1)}
//                     rightAction={() => setTodayOffset((value) => Math.min(0, value + 1))}
//                     rightDisabled={todayOffset === 0}
//                     label={chartMeta?.label || "Today"}
//                     buttonStyle={navigationButtonStyle}
//                 />
//             );
//         }

//         if (chartMode === "week") {
//             return (
//                 <PeriodNavigation
//                     leftAction={() => setWeekOffset((value) => value - 1)}
//                     rightAction={() => setWeekOffset((value) => Math.min(0, value + 1))}
//                     rightDisabled={weekOffset === 0}
//                     label={chartMeta?.range ? `${chartMeta.range.start} — ${chartMeta.range.end}` : "Current week"}
//                     buttonStyle={navigationButtonStyle}
//                 />
//             );
//         }

//         if (chartMode === "month") {
//             return (
//                 <PeriodNavigation
//                     leftAction={() => setMonthOffset((value) => value - 1)}
//                     rightAction={() => setMonthOffset((value) => Math.min(0, value + 1))}
//                     rightDisabled={monthOffset === 0}
//                     label={chartMeta?.label || "Current month"}
//                     buttonStyle={navigationButtonStyle}
//                 />
//             );
//         }

//         return (
//             <PeriodNavigation
//                 leftAction={() => setYearOffset((value) => value - 1)}
//                 rightAction={() => setYearOffset((value) => Math.min(0, value + 1))}
//                 rightDisabled={yearOffset === 0}
//                 label={chartMeta?.label || "Current year"}
//                 buttonStyle={navigationButtonStyle}
//             />
//         );
//     };

//     // UI
//     return (
//         <div style={cardStyle}>
//             {/* HEADER */}
//             <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, marginBottom: 12 }}>
//                 <div style={{ fontSize: 18, fontWeight: 500, color: "#ffffff", fontFamily: "'DM Sans', sans-serif" }}>
//                     GENERATION CHART
//                 </div>

//                 {/* REFRESH */}
//                 <button
//                     type="button"
//                     onClick={handleRefreshEnergy}
//                     disabled={refreshing}
//                     aria-label="Refresh generation chart"
//                     style={{ width: 34, height: 34, border: "none", background: "transparent", color: "#ffffff", display: "flex", alignItems: "center", justifyContent: "center", cursor: refreshing ? "default" : "pointer", opacity: refreshing ? 0.5 : 0.85, padding: 0 }}
//                 >
//                     <svg
//                         width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
//                         style={{ transform: refreshing ? "rotate(360deg)" : "none", transition: "transform 0.8s linear" }}
//                     >
//                         <path d="M20 11a8.1 8.1 0 0 0-15.5-2" />
//                         <polyline points="4 4 4 9 9 9" />
//                         <path d="M4 13a8.1 8.1 0 0 0 15.5 2" />
//                         <polyline points="20 20 20 15 15 15" />
//                     </svg>
//                 </button>
//             </div>

//             {/* CURRENT VALUE */}
//             <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 4 }}>
//                 <div style={{ padding: "4px 10px", borderRadius: 20, background: "rgba(255,255,255,0.1)", color: "#ffffff", fontSize: 11, fontWeight: 700 }}>
//                     {chartMode === "today"
//                         ? todayOffset === 0
//                             ? `${currentSolarPower !== null ? currentSolarPower.toFixed(0) : "--"} W`
//                             : chartMeta?.label || ""
//                         : `${Number(chartMeta?.total ?? 0).toFixed(2)} kWh`}
//                 </div>
//             </div>

//             {/* GRAPH */}
//             {chartMode === "today" ? (
//                 <SolarPowerLineChart data={chartData} />
//             ) : (
//                 <EnergyBarChart data={chartData} mode={chartMode} />
//             )}

//             {/* DATE NAVIGATION */}
//             <div style={{ marginTop: 8 }}>
//                 {renderNavigation()}
//             </div>

//             {/* TABS */}
//             <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", borderTop: "1px solid rgba(255,255,255,0.15)", paddingTop: 6 }}>
//                 {[["today", "TODAY"], ["week", "WEEK"], ["month", "MONTH"], ["year", "YEAR"]].map(([key, label]) => {
//                     const active = chartMode === key;
//                     return (
//                         <button
//                             key={key}
//                             type="button"
//                             onClick={() => setChartMode(key)}
//                             style={{
//                                 border: "none",
//                                 background: "transparent",
//                                 cursor: "pointer",
//                                 padding: "10px 2px 8px",
//                                 fontSize: 12,
//                                 fontWeight: active ? 800 : 600,
//                                 color: active ? "#ffffff" : "rgba(255,255,255,0.55)",
//                                 fontFamily: "'Inter', sans-serif",
//                                 borderBottom: active ? "2px solid #ffffff" : "2px solid transparent",
//                                 WebkitTapHighlightColor: "transparent"
//                             }}
//                         >
//                             {label}
//                         </button>
//                     );
//                 })}
//             </div>

//             {/* DESCRIPTION */}
//             <div style={{ textAlign: "center", marginTop: 8, fontSize: 10, color: "rgba(255,255,255,0.5)" }}>
//                 {chartDescriptions[chartMode]}
//             </div>
//         </div>
//     );
// }

// // EMPTY CHART
// function EmptyChartMessage({ children }) {
//     return (
//         <div style={{ height: 220, display: "flex", alignItems: "center", justifyContent: "center", color: "rgba(255,255,255,0.6)", fontSize: 13, fontFamily: "'Inter', sans-serif", textAlign: "center" }}>
//             {children}
//         </div>
//     );
// }

// // PERIOD NAVIGATION
// function PeriodNavigation({ leftAction, rightAction, rightDisabled, label, buttonStyle }) {
//     return (
//         <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, marginBottom: 12 }}>
//             <button type="button" onClick={leftAction} style={{ ...buttonStyle, cursor: "pointer" }}>‹</button>

//             <div style={{ flex: 1, minWidth: 0, fontSize: 13, fontWeight: 600, color: "#ffffff", textAlign: "center", fontFamily: "'Inter', sans-serif", overflowWrap: "anywhere" }}>
//                 {label}
//             </div>

//             <button
//                 type="button"
//                 onClick={rightAction}
//                 disabled={rightDisabled}
//                 style={{ ...buttonStyle, cursor: rightDisabled ? "default" : "pointer", opacity: rightDisabled ? 0.3 : 1 }}
//             >›</button>
//         </div>
//     );
// }




import { useState } from "react";
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
    handleRefreshEnergy,
}) {

    // CONFIGURATION
    /*
        TODAY_X_INTERVAL_MINUTES controls the X-axis interval.

        60 = one label/grid line every 1 hour
        30 = every 30 minutes
        15 = every 15 minutes

        This DOES NOT reduce the actual data points plotted.
        All readings from chartData are still used for the graph.
    */
    const TODAY_X_INTERVAL_MINUTES = 60;

    /*
        Set this to true if you want visible small circles
        on top of the Today line.
    */
    const SHOW_TODAY_POINTS = false;

    /*
        If SHOW_TODAY_POINTS = true:

        1 = show every reading
        2 = every second reading
        3 = every third reading
        etc.
    */
    const TODAY_POINT_EVERY = 1;

    // SELECTED BAR
    const [selectedBar, setSelectedBar] = useState(null);

    // CARD STYLE
    const cardStyle = {
        width: "100%",
        boxSizing: "border-box",
        background: "rgba(22, 38, 45, 0.88)",
        borderRadius: 16,
        padding: "18px 16px 14px",
        marginBottom: 16,
        border: "1px solid rgba(255,255,255,0.08)",
        boxShadow: P.shadowCard,
        overflow: "hidden",
        fontFamily: "'Inter', sans-serif",
    };

    const navigationButtonStyle = {
        width: 34,
        height: 34,
        border: "none",
        background: "transparent",
        color: "#ffffff",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 34,
        fontWeight: 300,
        padding: 0,
        flexShrink: 0,
        WebkitTapHighlightColor: "transparent",
    };

    // DATE HELPERS
    const ordinal = (day) => {
        if (day >= 11 && day <= 13) return `${day}th`;
        switch (day % 10) {
            case 1: return `${day}st`;
            case 2: return `${day}nd`;
            case 3: return `${day}rd`;
            default: return `${day}th`;
        }
    };

    const shortMonth = (date) => {
        const month = date.toLocaleDateString("en-GB", { month: "short" });
        // Reference design uses "Sept"
        // instead of browser default "Sep".
        return month === "Sep" ? "Sept" : month;
    };

    const longMonth = (date) => date.toLocaleDateString("en-GB", { month: "long" });

    const shortWeekday = (date) => date.toLocaleDateString("en-GB", { weekday: "short" }).toUpperCase();

    const formatDDMM = (date) => {
        const dd = String(date.getDate()).padStart(2, "0");
        const mm = String(date.getMonth() + 1).padStart(2, "0");
        return `${dd}/${mm}`;
    };

    const formatWeekDayDate = (date) => {
        const weekday = date.toLocaleDateString("en-GB", { weekday: "short" });
        return `${weekday}, ${formatDDMM(date)}`;
    };

    // PARSE DATE FROM BACKEND CHART ITEM
    const getItemDate = (item, index, mode) => {

        // Prefer a proper backend date field.
        if (item?.date) {
            const date = new Date(item.date);
            if (!Number.isNaN(date.getTime())) return date;
        }

        // Try YYYY-MM-DD label
        const raw = String(item?.label ?? "").trim();
        const yyyyMmDdMatch = raw.match(/^(\d{4})-(\d{2})-(\d{2})$/);

        if (yyyyMmDdMatch) {
            return new Date(Number(yyyyMmDdMatch[1]), Number(yyyyMmDdMatch[2]) - 1, Number(yyyyMmDdMatch[3]));
        }

        // Try DD/MM
        const ddMmMatch = raw.match(/^(\d{1,2})\/(\d{1,2})$/);

        if (ddMmMatch) {
            const now = new Date();
            let year = now.getFullYear();

            if (mode === "month") {
                const monthDate = new Date(now.getFullYear(), now.getMonth() + monthOffset, 1);
                year = monthDate.getFullYear();
            }

            return new Date(year, Number(ddMmMatch[2]) - 1, Number(ddMmMatch[1]));
        }

        // WEEK FALLBACK
        //
        // Current week is interpreted as a rolling
        // 7-day range ending today:
        //
        // Sep 4 -> Sep 10
        if (mode === "week") {
            const now = new Date();
            const end = new Date(now);
            end.setDate(end.getDate() + weekOffset * 7);

            const start = new Date(end);
            start.setDate(end.getDate() - 6);

            const itemDate = new Date(start);
            itemDate.setDate(start.getDate() + index);

            return itemDate;
        }

        // MONTH FALLBACK
        //
        // If backend label is only:
        // 1, 2, 3 ...
        if (mode === "month") {
            const now = new Date();
            const activeMonth = new Date(now.getFullYear(), now.getMonth() + monthOffset, 1);

            let day = Number(raw);
            if (!Number.isFinite(day) || day < 1 || day > 31) day = index + 1;

            return new Date(activeMonth.getFullYear(), activeMonth.getMonth(), day);
        }

        return null;
    };

    // NAVIGATION LABEL
    const getNavigationLabel = () => {
        const now = new Date();

        // TODAY
        if (chartMode === "today") {
            const date = new Date(now);
            date.setDate(date.getDate() + todayOffset);
            const year = String(date.getFullYear()).slice(-2);
            return `${shortWeekday(date)} ${ordinal(date.getDate())} ${shortMonth(date)}'${year}`;
        }

        // WEEK
        if (chartMode === "week") {
            const end = new Date(now);
            end.setDate(end.getDate() + weekOffset * 7);
            const start = new Date(end);
            start.setDate(end.getDate() - 6);
            return `${ordinal(start.getDate())} ${shortMonth(start)} - ${ordinal(end.getDate())} ${shortMonth(end)}, ${end.getFullYear()}`;
        }

        // MONTH
        if (chartMode === "month") {
            const date = new Date(now.getFullYear(), now.getMonth() + monthOffset, 1);
            return `${longMonth(date)} ${date.getFullYear()}`;
        }

        // YEAR
        return String(now.getFullYear() + yearOffset);
    };

    // NICE Y AXIS
    const getNiceMax = (value) => {
        if (!Number.isFinite(value) || value <= 0) return 1;
        const magnitude = Math.pow(10, Math.floor(Math.log10(value)));
        const normalized = value / magnitude;
        if (normalized <= 1) return magnitude;
        if (normalized <= 2) return 2 * magnitude;
        if (normalized <= 5) return 5 * magnitude;
        return 10 * magnitude;
    };

    // TODAY SOLAR POWER GRAPH
    const SolarPowerLineChart = ({ data }) => {
        const safeData = Array.isArray(data) ? data : [];

        if (safeData.length === 0) {
            return <EmptyChartMessage>No solar power data available</EmptyChartMessage>;
        }

        // DIMENSIONS
        const width = 500;
        const height = 330;
        const leftPadding = 56;
        const rightPadding = 14;
        const topPadding = 8;
        const bottomPadding = 42;

        const plotWidth = width - leftPadding - rightPadding;
        const plotHeight = height - topPadding - bottomPadding;

        // HH:mm -> MINUTES
        const getMinutes = (label) => {
            if (typeof label !== "string" || !label.includes(":")) return null;
            const [hourString, minuteString] = label.split(":");
            const hour = Number(hourString);
            const minute = Number(minuteString);
            if (!Number.isFinite(hour) || !Number.isFinite(minute)) return null;
            return hour * 60 + minute;
        };

        const formatMinutes = (totalMinutes) => {
            const hours = Math.floor(totalMinutes / 60);
            const minutes = totalMinutes % 60;
            return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
        };

        // VALID READINGS
        const validData = safeData
            .map((item) => {
                const minutes = getMinutes(item?.label);
                const value = Number(item?.value);
                return { ...item, minutes, value };
            })
            .filter((item) => item.minutes !== null && Number.isFinite(item.value))
            .sort((a, b) => a.minutes - b.minutes);

        if (validData.length === 0) {
            return <EmptyChartMessage>No valid solar power data available</EmptyChartMessage>;
        }

        // FIXED AXIS RANGE
        //
        // IMPORTANT:
        //
        // Data may begin at 06:03.
        //
        // Axis will begin at:
        // 06:00
        //
        // not 06:03.
        const actualFirstMinute = validData[0].minutes;
        const actualLastMinute = validData[validData.length - 1].minutes;
        const interval = TODAY_X_INTERVAL_MINUTES;

        const displayStartMinute = Math.floor(actualFirstMinute / interval) * interval;
        const displayEndMinute = Math.ceil(actualLastMinute / interval) * interval;
        const displayTimeRange = Math.max(displayEndMinute - displayStartMinute, interval);

        // FIXED X TICKS
        const xTicks = [];
        for (let minute = displayStartMinute; minute <= displayEndMinute; minute += interval) {
            xTicks.push(minute);
        }

        // Y AXIS
        // const rawMax = Math.max(...validData.map((item) => item.value), 0);
        // const yAxisMax = Math.max(getNiceMax(rawMax), 1);
        // const tickCount = 7;
        // const yTicks = Array.from({ length: tickCount }, (_, index) =>
        //     Number(((yAxisMax / (tickCount - 1)) * index).toFixed(1))
        // );

        // =====================================================
        // Y AXIS
        // =====================================================

        const getNiceYAxis = (
    maxValue,
    targetIntervals = 8
) => {

    if (
        !Number.isFinite(maxValue) ||
        maxValue <= 0
    ) {
        return {
            max: 1000,
            step: 125
        };
    }

    const roughStep =
        maxValue /
        targetIntervals;

    const magnitude =
        Math.pow(
            10,
            Math.floor(
                Math.log10(
                    roughStep
                )
            )
        );

    const normalized =
        roughStep /
        magnitude;

    let niceNormalized;

    if (normalized <= 1) {

        niceNormalized = 1;

    } else if (
        normalized <= 2
    ) {

        niceNormalized = 2;

    } else if (
        normalized <= 2.5
    ) {

        niceNormalized = 2.5;

    } else if (
        normalized <= 5
    ) {

        niceNormalized = 5;

    } else {

        niceNormalized = 10;
    }

    const step =
        niceNormalized *
        magnitude;

    const max =
        Math.ceil(
            maxValue /
            step
        ) *
        step;

    return {
        max,
        step
    };
};


const rawMax =
    Math.max(
        ...validData.map(
            item => item.value
        ),
        0
    );


const {
    max: yAxisMax,
    step: yAxisStep
} =
    getNiceYAxis(
        rawMax,
        8
    );


const yTicks = [];

for (
    let value = 0;
    value <= yAxisMax;
    value += yAxisStep
) {

    yTicks.push(
        Number(
            value.toFixed(2)
        )
    );
}
        // ACTUAL GRAPH POINTS
        //
        // NOTE:
        //
        // Every reading is plotted.
        //
        // X-axis labels do not control how many
        // readings are drawn.
        const points = validData.map((item) => {
            const x = leftPadding + ((item.minutes - displayStartMinute) / displayTimeRange) * plotWidth;
            const y = topPadding + (1 - item.value / yAxisMax) * plotHeight;
            return { x, y, item };
        });

        const baselineY = topPadding + plotHeight;

        const linePath = points.map((point, index) => `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`).join(" ");

        const areaPath =
            points.length > 0
                ? `M ${points[0].x} ${baselineY} ` +
                points.map((point) => `L ${point.x} ${point.y}`).join(" ") +
                ` L ${points[points.length - 1].x} ${baselineY} Z`
                : "";


        // DRAW
        return (
            <div style={{ width: "100%", overflow: "hidden" }}>
                <svg viewBox={`0 0 ${width} ${height}`} style={{ width: "100%", height: 280, display: "block" }}>
                    {/* HORIZONTAL GRID + Y AXIS */}
                    {/* {[...yTicks].reverse().map((tick, index) => {
                        const y = topPadding + (index / (tickCount - 1)) * plotHeight;
                        return (
                            <g key={`y-${index}`}>
                                <line x1={leftPadding} y1={y} x2={width - rightPadding} y2={y} stroke="rgba(255,255,255,0.17)" strokeWidth="1" />
                                <text x={leftPadding - 9} y={y + 5} textAnchor="end" fontSize="14" fill="rgba(255,255,255,0.90)">{tick}</text>
                            </g>
                        );
                    })} */}

                    {[...yTicks]
    .reverse()
    .map((tick, index) => {

        const y =
            topPadding +
            (
                1 -
                tick /
                yAxisMax
            ) *
            plotHeight;

        return (

            <g key={`y-${index}`}>

                <line
                    x1={leftPadding}
                    y1={y}
                    x2={width - rightPadding}
                    y2={y}
                    stroke="rgba(255,255,255,0.17)"
                    strokeWidth="1"
                />

                <text
                    x={leftPadding - 9}
                    y={y + 5}
                    textAnchor="end"
                    fontSize="14"
                    fill="rgba(255,255,255,0.90)"
                >
                    {tick}
                </text>

            </g>
        );
    })}

                    {/* FIXED TIME GRID */}
                    {xTicks.map((minute, index) => {
                        const x = leftPadding + ((minute - displayStartMinute) / displayTimeRange) * plotWidth;
                        const labelY = baselineY + 16;
                        return (
                            <g key={`x-${index}`}>
                                <line x1={x} y1={topPadding} x2={x} y2={baselineY} stroke="rgba(255,255,255,0.13)" strokeWidth="1" />
                                <text
                                    x={x}
                                    y={labelY}
                                    fontSize="13"
                                    fill="rgba(255,255,255,0.90)"
                                    textAnchor="end"
                                    transform={`rotate(-48 ${x} ${labelY})`}
                                >
                                    {formatMinutes(minute)}
                                </text>
                            </g>
                        );
                    })}

                    {/* AREA */}
                    <path d={areaPath} fill="#ffffff" opacity="0.92" />

                    {/* LINE */}
                    <path d={linePath} fill="none" stroke="#ffffff" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />

                    {/* OPTIONAL POINTS */}
                    {SHOW_TODAY_POINTS && points.map((point, index) => {
                        if (index % TODAY_POINT_EVERY !== 0) return null;
                        return <circle key={index} cx={point.x} cy={point.y} r="2.2" fill="#ffffff" />;
                    })}
                </svg>
            </div>
        );
    };

    // WEEK / MONTH / YEAR BAR CHART
    const EnergyBarChart = ({ data, mode }) => {
        const safeData = Array.isArray(data) ? data : [];

        if (safeData.length === 0) {
            return <EmptyChartMessage>No energy data available</EmptyChartMessage>;
        }

        const values = safeData.map((item) => Number(item?.value) || 0);
        const maxValue = Math.max(...values, 0);
        const yAxisMax = Math.max(getNiceMax(maxValue), 1);
        const tickCount = 6;
        const yTicks = Array.from({ length: tickCount }, (_, index) =>
            Number(((yAxisMax / (tickCount - 1)) * index).toFixed(1))
        );

        const chartHeight = 300;
        const plotHeight = 225;

        const isWeekly = mode === "week";
        const isMonthly = mode === "month";
        const isYearly = mode === "year";

        // X-AXIS LABEL
        const formatBarLabel = (item, index) => {

            // WEEK
            //
            // Wed, 02/09
            // Thu, 03/09
            if (isWeekly) {
                const date = getItemDate(item, index, "week");
                if (date) return formatWeekDayDate(date);
                return item?.label ?? "";
            }

            // MONTH
            //
            // 01/09
            // 04/09
            // 07/09
            if (isMonthly) {
                const date = getItemDate(item, index, "month");
                if (date) return formatDDMM(date);
                return item?.label ?? "";
            }

            // YEAR
            //
            // Jan, Feb, Mar...
            return item?.label ?? "";
        };

        // TOOLTIP LABEL
        const getTooltipTitle = (item, index) => {

            // WEEK:
            // Wed, 02/09
            if (isWeekly) {
                const date = getItemDate(item, index, "week");
                if (date) return formatWeekDayDate(date);
            }

            // MONTH:
            // 04/09
            if (isMonthly) {
                const date = getItemDate(item, index, "month");
                if (date) return formatDDMM(date);
            }

            // YEAR:
            // Jan
            if (isYearly) return item?.label ?? "";

            return formatBarLabel(item, index);
        };

        // LABEL VISIBILITY
        const shouldShowLabel = (index) => {
            // Week = show all 7
            if (isWeekly) return true;

            // Month = approximately every 3 days
            if (isMonthly) return index === 0 || index % 3 === 0 || index === safeData.length - 1;

            // Year = show all months
            if (isYearly) return true;

            return true;
        };

        return (
            <div style={{ width: "100%", position: "relative" }}>
                {/* SELECTED BAR TOOLTIP */}
                {selectedBar && selectedBar.mode === mode && (
                    <div
                        style={{
                            position: "absolute",
                            top: 4,
                            left: "50%",
                            transform: "translateX(-50%)",
                            zIndex: 20,
                            background: "rgba(5, 15, 20, 0.96)",
                            border: "1px solid rgba(255,255,255,0.25)",
                            borderRadius: 8,
                            padding: "8px 12px",
                            color: "#ffffff",
                            textAlign: "center",
                            pointerEvents: "none",
                            boxShadow: "0 4px 12px rgba(0,0,0,0.35)",
                            minWidth: 110
                        }}
                    >
                        {/* DATE */}
                        <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 4 }}>
                            {selectedBar.label}
                        </div>

                        {/* ENERGY */}
                        <div style={{ fontSize: 14, fontWeight: 800 }}>
                            {selectedBar.value} kWh
                        </div>
                    </div>
                )}

                <div style={{ display: "flex", width: "100%", height: chartHeight }}>
                    {/* Y AXIS */}
                    <div style={{ width: 44, flexShrink: 0, height: plotHeight, display: "flex", flexDirection: "column", justifyContent: "space-between", alignItems: "flex-end", paddingRight: 8 }}>
                        {[...yTicks].reverse().map((tick, index) => (
                            <span key={index} style={{ fontSize: 14, color: "rgba(255,255,255,0.90)", lineHeight: 1 }}>{tick}</span>
                        ))}
                    </div>

                    {/* GRAPH AREA */}
                    <div style={{ flex: 1, minWidth: 0, position: "relative", height: chartHeight }}>
                        {/* HORIZONTAL GRID */}
                        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: plotHeight, pointerEvents: "none" }}>
                            {yTicks.map((tick, index) => {
                                const position = (1 - tick / yAxisMax) * 100;
                                return <div key={`h-${index}`} style={{ position: "absolute", left: 0, right: 0, top: `${position}%`, borderTop: "1px solid rgba(255,255,255,0.14)" }} />;
                            })}
                        </div>

                        {/* VERTICAL GRID */}
                        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: plotHeight, display: "flex", pointerEvents: "none" }}>
                            {safeData.map((_, index) => (
                                <div key={index} style={{ flex: 1, borderLeft: index === 0 ? "none" : "1px solid rgba(255,255,255,0.10)" }} />
                            ))}
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
                                gap: isMonthly ? 3 : isWeekly ? 12 : 8,
                                padding: isWeekly ? "0 8px" : "0 2px"
                            }}
                        >
                            {safeData.map((item, index) => {
                                const value = Number(item?.value) || 0;
                                const barHeight = maxValue > 0 ? (value / yAxisMax) * plotHeight : 1;
                                const selected = selectedBar?.mode === mode && selectedBar?.index === index;

                                return (
                                    <div
                                        key={index}
                                        onClick={() => {
                                            setSelectedBar({
                                                mode,
                                                index,
                                                label: getTooltipTitle(item, index),
                                                value: value.toFixed(2)
                                            });
                                        }}
                                        style={{ flex: 1, minWidth: 0, height: plotHeight, position: "relative", cursor: "pointer", WebkitTapHighlightColor: "transparent" }}
                                    >
                                        <div
                                            style={{
                                                position: "absolute",
                                                bottom: 0,
                                                left: "50%",
                                                transform: "translateX(-50%)",
                                                width: isWeekly ? "72%" : isMonthly ? "68%" : "64%",
                                                maxWidth: isWeekly ? 44 : isMonthly ? 18 : 34,
                                                height: Math.max(barHeight, value > 0 ? 3 : 1),
                                                background: selected
                                                    ? "#ffffff"
                                                    : value > 0
                                                        ? "rgba(255,255,255,0.92)"
                                                        : "rgba(255,255,255,0.12)",
                                                border: selected ? "2px solid #ffffff" : "1px solid rgba(255,255,255,0.4)",
                                                boxSizing: "border-box",
                                                transition: "height 0.25s ease"
                                            }}
                                        />
                                    </div>
                                );
                            })}
                        </div>

                        {/* X AXIS */}
                        <div
                            style={{
                                position: "absolute",
                                top: plotHeight + 24,
                                left: 0,
                                right: 0,
                                height: 68,
                                display: "flex",
                                alignItems: "flex-start",
                                gap: isMonthly ? 3 : isWeekly ? 12 : 8,
                                padding: isWeekly ? "0 8px" : "0 2px",
                                boxSizing: "border-box"
                            }}
                        >
                            {safeData.map((item, index) => (
                                <div
                                    key={index}
                                    style={{ flex: 1, minWidth: 0, visibility: shouldShowLabel(index) ? "visible" : "hidden", display: "flex", justifyContent: "center" }}
                                >
                                    <span
                                        style={{
                                            display: "inline-block",
                                            fontSize: isWeekly ? 11 : 12,
                                            fontWeight: 500,
                                            color: "rgba(255,255,255,0.90)",
                                            whiteSpace: "nowrap",
                                            transform: isYearly ? "rotate(-42deg)" : "rotate(-45deg)",
                                            transformOrigin: "top center"
                                        }}
                                    >
                                        {formatBarLabel(item, index)}
                                    </span>
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
        const label = getNavigationLabel();

        if (chartMode === "today") {
            return (
                <PeriodNavigation
                    leftAction={() => {
                        setSelectedBar(null);
                        setTodayOffset((value) => value - 1);
                    }}
                    rightAction={() => {
                        setSelectedBar(null);
                        setTodayOffset((value) => Math.min(0, value + 1));
                    }}
                    rightDisabled={todayOffset === 0}
                    label={label}
                    buttonStyle={navigationButtonStyle}
                />
            );
        }

        if (chartMode === "week") {
            return (
                <PeriodNavigation
                    leftAction={() => {
                        setSelectedBar(null);
                        setWeekOffset((value) => value - 1);
                    }}
                    rightAction={() => {
                        setSelectedBar(null);
                        setWeekOffset((value) => Math.min(0, value + 1));
                    }}
                    rightDisabled={weekOffset === 0}
                    label={label}
                    buttonStyle={navigationButtonStyle}
                />
            );
        }

        if (chartMode === "month") {
            return (
                <PeriodNavigation
                    leftAction={() => {
                        setSelectedBar(null);
                        setMonthOffset((value) => value - 1);
                    }}
                    rightAction={() => {
                        setSelectedBar(null);
                        setMonthOffset((value) => Math.min(0, value + 1));
                    }}
                    rightDisabled={monthOffset === 0}
                    label={label}
                    buttonStyle={navigationButtonStyle}
                />
            );
        }

        return (
            <PeriodNavigation
                leftAction={() => {
                    setSelectedBar(null);
                    setYearOffset((value) => value - 1);
                }}
                rightAction={() => {
                    setSelectedBar(null);
                    setYearOffset((value) => Math.min(0, value + 1));
                }}
                rightDisabled={yearOffset === 0}
                label={label}
                buttonStyle={navigationButtonStyle}
            />
        );
    };

    // MAIN UI
    return (
        <div style={cardStyle}>
            {/* HEADER */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                <div style={{ fontSize: 19, fontWeight: 500, color: "#ffffff", fontFamily: "'DM Sans', sans-serif" }}>
                    GENERATION CHART
                </div>

                {/* REFRESH */}
                <button
                    type="button"
                    onClick={handleRefreshEnergy}
                    disabled={refreshing}
                    aria-label="Refresh generation chart"
                    style={{ width: 34, height: 34, border: "none", background: "transparent", color: "#ffffff", display: "flex", alignItems: "center", justifyContent: "center", padding: 0, cursor: refreshing ? "default" : "pointer", opacity: refreshing ? 0.4 : 0.8 }}
                >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M20 11a8.1 8.1 0 0 0-15.5-2" />
                        <polyline points="4 4 4 9 9 9" />
                        <path d="M4 13a8.1 8.1 0 0 0 15.5 2" />
                        <polyline points="20 20 20 15 15 15" />
                    </svg>
                </button>
            </div>

            {/* GRAPH */}
            {chartMode === "today" ? (
                <SolarPowerLineChart data={chartData} />
            ) : (
                <EnergyBarChart data={chartData} mode={chartMode} />
            )}

            {/* NAVIGATION */}
            <div style={{ marginTop: chartMode === "today" ? -2 : -8 }}>
                {renderNavigation()}
            </div>

            {/* TABS */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", alignItems: "center", gap: 2, marginTop: 0 }}>
                {[["today", "TODAY"], ["week", "WEEK"], ["month", "MONTH"], ["year", "YEAR"]].map(([key, label]) => {
                    const active = chartMode === key;
                    return (
                        <button
                            key={key}
                            type="button"
                            onClick={() => {
                                setSelectedBar(null);
                                setChartMode(key);
                            }}
                            style={{
                                border: "none",
                                background: "transparent",
                                cursor: "pointer",
                                padding: "8px 2px",
                                fontSize: 14,
                                fontWeight: active ? 800 : 600,
                                color: active ? "#ffffff" : "rgba(255,255,255,0.68)",
                                fontFamily: "'Inter', sans-serif",
                                WebkitTapHighlightColor: "transparent"
                            }}
                        >
                            {label}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}

// EMPTY CHART
function EmptyChartMessage({ children }) {
    return (
        <div style={{ height: 300, display: "flex", alignItems: "center", justifyContent: "center", color: "rgba(255,255,255,0.65)", fontSize: 14, fontFamily: "'Inter', sans-serif", textAlign: "center" }}>
            {children}
        </div>
    );
}

// PERIOD NAVIGATION
function PeriodNavigation({ leftAction, rightAction, rightDisabled, label, buttonStyle }) {
    return (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 18, marginBottom: 4, padding: "0 10px" }}>
            <button type="button" onClick={leftAction} style={{ ...buttonStyle, cursor: "pointer" }}>‹</button>

            <div style={{ minWidth: 0, fontSize: 17, fontWeight: 500, color: "#ffffff", textAlign: "center", fontFamily: "'Inter', sans-serif", whiteSpace: "nowrap" }}>
                {label}
            </div>

            <button
                type="button"
                onClick={rightAction}
                disabled={rightDisabled}
                style={{ ...buttonStyle, cursor: rightDisabled ? "default" : "pointer", opacity: rightDisabled ? 0.3 : 1 }}
            >›</button>
        </div>
    );
}