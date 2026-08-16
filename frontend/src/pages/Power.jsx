import { useInverter } from "../context/Context";
import Footer from "../components/Footer";
import DeviceInfo from "../components/DeviceInfo";
import P from "../theme/colors";
import { PARAMETER_MAP } from "../constants/parameterMap";
import { parseKeyword } from "../utils/parseKeyword";
import PageHeader from "../components/PageHeader";
import { useState } from "react";

export default function Power() {

    // const { data, lastUpdated, energy, energyCharts } = useInverter();
    const {
    data,
    lastUpdated,
    energy,
    energyCharts,
    refreshEnergy
} = useInverter();

    const [chartMode, setChartMode] =
    useState("today");

    const [refreshing, setRefreshing] =
    useState(false);


    const handleRefreshEnergy = async () => {

    if (refreshing) return;

    try {

        setRefreshing(true);

        await refreshEnergy();

    } catch (err) {

        console.error(
            "Energy refresh failed:",
            err
        );

    } finally {

        setRefreshing(false);
    }
};

    // const chartData =
    // energyCharts?.[chartMode] || [];

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
    // GET PARAMETER VALUE DYNAMICALLY

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
        // border: "1px solid ${P.border}",
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
        // border: "1px solid ${P.border}",
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
    // const BarChart = ({ value, maxValue, color }) => {
    //     const numBars = 10;
    //     const filledBars = Math.round((Math.min(value || 0, maxValue) / maxValue) * numBars);
    //     const heights = [40, 55, 35, 70, 85, 60, 90, 75, 65, 80];

    //     return (
    //         <div style={{ display: "flex", alignItems: "flex-end", gap: 6, height: 80, padding: "0 4px" }}>
    //             {heights.map((h, i) => (
    //                 <div
    //                     key={i}
    //                     style={{
    //                         flex: 1,
    //                         height: `${h}%`,
    //                         borderRadius: "4px 4px 0 0",
    //                         background: i < filledBars
    //                             ? color
    //                             : `${color}33`,
    //                         transition: "height 0.4s ease",
    //                     }}
    //                 />
    //             ))}
    //         </div>
    //     );
    // };


//     const EnergyChart = ({
//     data = [],
//     color
// }) => {

//     if (!data.length) {
//         return (
//             <div
//                 style={{
//                     height: 180,
//                     display: "flex",
//                     alignItems: "center",
//                     justifyContent: "center",
//                     color: P.textMuted,
//                     fontSize: 13
//                 }}
//             >
//                 No energy data available
//             </div>
//         );
//     }

//     const maxValue = Math.max(
//         ...data.map(
//             item => Number(item.value) || 0
//         ),
//         1
//     );

//     return (
//         <div
//             style={{
//                 width: "100%",
//                 overflowX: "auto",
//                 paddingBottom: 8
//             }}
//         >
//             <div
//                 style={{
//                     display: "flex",
//                     alignItems: "flex-end",
//                     gap:
//                         data.length > 24
//                             ? 4
//                             : 6,
//                     height: 190,
//                     minWidth:
//                        isMonthly
//         ? 700
//         : "100%",
//                         // data.length > 24
//                         //     ? 650
//                         //     : "100%",
//                     padding: "0 4px"
//                 }}
//             >
//                 {data.map(
//                     (item, index) => {

//                         const value =
//                             Number(
//                                 item.value
//                             ) || 0;

//                         const barHeight =
//                             (value /
//                                 maxValue) *
//                             140;

//                         return (
//                             <div
//                                 key={index}
//                                 style={{
//                                     flex: 1,
//                                     minWidth:
//                                         data.length > 24
//                                             ? 14
//                                             : 20,
//                                     height: 190,
//                                     display: "flex",
//                                     flexDirection:
//                                         "column",
//                                     alignItems:
//                                         "center",
//                                     justifyContent:
//                                         "flex-end"
//                                 }}
//                             >

//                                 {value > 0 && (
//                                     <div
//                                         style={{
//                                             fontSize: 8,
//                                             color:
//                                                 P.textMuted,
//                                             marginBottom: 4,
//                                             whiteSpace:
//                                                 "nowrap"
//                                         }}
//                                     >
//                                         {value.toFixed(1)}
//                                     </div>
//                                 )}

//                                 <div
//                                     style={{
//                                         width: "100%",
//                                         maxWidth: 28,
//                                         height:
//                                             Math.max(
//                                                 barHeight,
//                                                 value > 0
//                                                     ? 4
//                                                     : 2
//                                             ),
//                                         background:
//                                             value > 0
//                                                 ? color
//                                                 : `${color}33`,
//                                         borderRadius:
//                                             "4px 4px 0 0",
//                                         transition:
//                                             "height 0.4s ease"
//                                     }}
//                                 />

//                                 <div
//                                     style={{
//                                         fontSize:
//                                             data.length > 24
//                                                 ? 8
//                                                 : 10,
//                                         color:
//                                             P.textMuted,
//                                         marginTop: 6,
//                                         whiteSpace:
//                                             "nowrap"
//                                     }}
//                                 >
//                                     {item.label}
//                                 </div>

//                             </div>
//                         );
//                     }
//                 )}
//             </div>
//         </div>
//     );
// };


// changes
// const EnergyChart = ({
//     data = [],
//     color
// }) => {

//     if (!data.length) {
//         return (
//             <div
//                 style={{
//                     height: 180,
//                     display: "flex",
//                     alignItems: "center",
//                     justifyContent: "center",
//                     color: P.textMuted,
//                     fontSize: 13
//                 }}
//             >
//                 No energy data available
//             </div>
//         );
//     }

//     const maxValue = Math.max(
//         ...data.map(
//             item =>
//                 Number(item.value) || 0
//         ),
//         1
//     );

//     const isMonthly =
//         data.length >= 28 &&
//         data.length <= 31;

//     return (
//         <div
//             style={{
//                 width: "100%",
//                 overflowX:
//                     isMonthly
//                         ? "auto"
//                         : "hidden",
//                 paddingBottom: 8
//             }}
//         >

//             <div
//                 style={{
//                     display: "flex",
//                     alignItems: "flex-end",
//                     gap: isMonthly ? 4 : 8,
//                     height: 190,

//                     minWidth:
//                         isMonthly
//                             ? 700
//                             : "100%",

//                     padding: "0 4px"
//                 }}
//             >

//                 {data.map(
//                     (item, index) => {

//                         const value =
//                             Number(
//                                 item.value
//                             ) || 0;

//                         const barHeight =
//                             value > 0
//                                 ? (
//                                     value /
//                                     maxValue
//                                 ) * 140
//                                 : 2;

//                         return (
//                             <div
//                                 key={index}
//                                 style={{
//                                     flex: 1,
//                                     minWidth:
//                                         isMonthly
//                                             ? 18
//                                             : 20,

//                                     height: 190,

//                                     display: "flex",

//                                     flexDirection:
//                                         "column",

//                                     alignItems:
//                                         "center",

//                                     justifyContent:
//                                         "flex-end"
//                                 }}
//                             >

//                                 {value > 0 && (
//                                     <div
//                                         style={{
//                                             fontSize: 8,
//                                             color:
//                                                 P.textMuted,
//                                             marginBottom: 4,
//                                             whiteSpace:
//                                                 "nowrap"
//                                         }}
//                                     >
//                                         {value.toFixed(1)}
//                                     </div>
//                                 )}

//                                 <div
//                                     style={{
//                                         width: "100%",
//                                         maxWidth: 28,

//                                         height:
//                                             Math.max(
//                                                 barHeight,
//                                                 2
//                                             ),

//                                         background:
//                                             value > 0
//                                                 ? color
//                                                 : `${color}33`,

//                                         borderRadius:
//                                             "4px 4px 0 0",

//                                         transition:
//                                             "height 0.4s ease"
//                                     }}
//                                 />

//                                 <div
//                                     style={{
//                                         fontSize:
//                                             isMonthly
//                                                 ? 8
//                                                 : 10,

//                                         color:
//                                             P.textMuted,

//                                         marginTop: 6,

//                                         whiteSpace:
//                                             "nowrap"
//                                     }}
//                                 >
//                                     {item.label}
//                                 </div>

//                             </div>
//                         );
//                     }
//                 )}

//             </div>

//         </div>
//     );
// };
    
// below good chart

// const EnergyChart = ({ data, color }) => {

//     const safeData =
//         Array.isArray(data)
//             ? data
//             : [];

//     if (safeData.length === 0) {

//         return (
//             <div
//                 style={{
//                     height: 220,
//                     display: "flex",
//                     alignItems: "center",
//                     justifyContent: "center",
//                     color: P.textMuted,
//                     fontSize: 13,
//                 }}
//             >
//                 No energy data available
//             </div>
//         );
//     }


//     // =====================================================
//     // DETECT CHART TYPE
//     // =====================================================

//     const isToday =
//         safeData.length === 24;

//     const isMonthly =
//         safeData.length >= 28 &&
//         safeData.length <= 31;

//     const isYearly =
//         safeData.length === 12;


//     // =====================================================
//     // MAX VALUE
//     // =====================================================

//     const maxValue =
//         Math.max(
//             ...safeData.map(
//                 item =>
//                     Number(item.value) || 0
//             ),
//             1
//         );


//     // =====================================================
//     // CREATE Y-AXIS SCALE
//     // =====================================================

//     const yStep =
//         Math.ceil(
//             maxValue / 4
//         );


//     const yMax =
//         yStep * 4;


//     const yAxisValues = [
//         yMax,
//         yStep * 3,
//         yStep * 2,
//         yStep,
//         0
//     ];


//     // =====================================================
//     // WHICH X LABELS SHOULD BE SHOWN?
//     // =====================================================

//     const shouldShowLabel = (index) => {

//         // ---------------------------------------------
//         // TODAY
//         // Show every 3 hours
//         // ---------------------------------------------

//         if (isToday) {

//             return (
//                 index % 3 === 0
//             );
//         }


//         // ---------------------------------------------
//         // MONTHLY
//         // Show roughly every 5 days
//         // ---------------------------------------------

//         if (isMonthly) {

//             return (
//                 index === 0 ||
//                 index === safeData.length - 1 ||
//                 index % 5 === 0
//             );
//         }


//         // ---------------------------------------------
//         // YEARLY
//         // Show every month
//         // ---------------------------------------------

//         if (isYearly) {

//             return true;
//         }


//         return true;
//     };


//     return (

//         <div
//             style={{
//                 width: "100%",
//                 overflowX:
//                     isMonthly
//                         ? "auto"
//                         : "hidden",

//                 paddingBottom: 4,
//             }}
//         >

//             <div
//                 style={{
//                     display: "flex",

//                     /*
//                      * Y-axis + chart
//                      */
//                     width: "100%",

//                     minWidth:
//                         isMonthly
//                             ? 650
//                             : "100%",
//                 }}
//             >


//                 {/* =================================================
//                     Y AXIS
//                 ================================================= */}

//                 <div
//                     style={{
//                         width: 42,
//                         flexShrink: 0,

//                         height: 280,

//                         display: "flex",
//                         flexDirection: "column",
//                         justifyContent: "space-between",

//                         paddingTop: 4,
//                         paddingBottom: 26,

//                         boxSizing: "border-box",
//                     }}
//                 >

//                     {yAxisValues.map(
//                         (value, index) => (

//                             <div
//                                 key={index}
//                                 style={{
//                                     fontSize: 9,
//                                     color:
//                                         P.textMuted,

//                                     textAlign:
//                                         "right",

//                                     paddingRight: 6,

//                                     whiteSpace:
//                                         "nowrap",
//                                 }}
//                             >
//                                 {Number(
//                                     value
//                                 ).toFixed(
//                                     value % 1 === 0
//                                         ? 0
//                                         : 1
//                                 )}
//                             </div>

//                         )
//                     )}

//                 </div>


//                 {/* =================================================
//                     CHART AREA
//                 ================================================= */}

//                 <div
//                     style={{
//                         flex: 1,
//                         position: "relative",
//                         height: 220,
//                     }}
//                 >

//                     {/* =============================================
//                         HORIZONTAL GRID LINES
//                     ============================================= */}

//                     <div
//                         style={{
//                             position:
//                                 "absolute",

//                             left: 0,
//                             right: 0,

//                             top: 4,
//                             bottom: 26,

//                             display:
//                                 "flex",

//                             flexDirection:
//                                 "column",

//                             justifyContent:
//                                 "space-between",

//                             pointerEvents:
//                                 "none",
//                         }}
//                     >

//                         {yAxisValues.map(
//                             (_, index) => (

//                                 <div
//                                     key={index}
//                                     style={{
//                                         width:
//                                             "100%",

//                                         borderTop:
//                                             `1px solid ${P.border}`,

//                                         opacity:
//                                             index ===
//                                             yAxisValues.length - 1
//                                                 ? 1
//                                                 : 0.5,
//                                     }}
//                                 />

//                             )
//                         )}

//                     </div>


//                     {/* =============================================
//                         BARS
//                     ============================================= */}

//                     <div
//                         style={{
//                             position:
//                                 "absolute",

//                             left: 0,
//                             right: 0,

//                             top: 4,
//                             bottom: 0,

//                             display:
//                                 "flex",

//                             alignItems:
//                                 "flex-end",

//                             gap:
//                                 isMonthly
//                                     ? 5
//                                     : 4,

//                             padding:
//                                 "0 4px",

//                             boxSizing:
//                                 "border-box",
//                         }}
//                     >

//                         {safeData.map(
//                             (item, index) => {

//                                 const value =
//                                     Number(
//                                         item.value
//                                     ) || 0;


//                                 /*
//                                  * Convert value into
//                                  * percentage of Y axis.
//                                  */

//                                 const barHeight =
//                                     yMax > 0
//                                         ? (
//                                             value /
//                                             yMax
//                                         ) * 100
//                                         : 0;


//                                 return (

//                                     <div
//                                         key={index}
//                                         style={{
//                                             flex: 1,

//                                             minWidth:
//                                                 isMonthly
//                                                     ? 14
//                                                     : 0,

//                                             height:
//                                                 "100%",

//                                             display:
//                                                 "flex",

//                                             flexDirection:
//                                                 "column",

//                                             alignItems:
//                                                 "center",

//                                             justifyContent:
//                                                 "flex-end",

//                                             position:
//                                                 "relative",
//                                         }}
//                                     >


//                                         {/* =================================
//                                             VALUE ABOVE BAR
//                                         ================================= */}

//                                         {value > 0 && (

//                                             <div
//                                                 style={{
//                                                     position:
//                                                         "absolute",

//                                                     bottom:
//                                                         `calc(${Math.min(
//                                                             barHeight,
//                                                             100
//                                                         )}% + 4px)`,

//                                                     fontSize:
//                                                         8,

//                                                     color:
//                                                         P.textMuted,

//                                                     whiteSpace:
//                                                         "nowrap",

//                                                     pointerEvents:
//                                                         "none",
//                                                 }}
//                                             >
//                                                 {value.toFixed(1)}
//                                             </div>

//                                         )}


//                                         {/* =================================
//                                             BAR
//                                         ================================= */}

//                                         <div
//                                             style={{
//                                                 width:
//                                                     "100%",

//                                                 maxWidth:
//                                                     26,

//                                                 height:
//                                                     value > 0
//                                                         ? `${Math.max(
//                                                             barHeight,
//                                                             2
//                                                         )}%`
//                                                         : "2px",

//                                                 background:
//                                                     value > 0
//                                                         ? color
//                                                         : `${color}33`,

//                                                 borderRadius:
//                                                     "4px 4px 0 0",

//                                                 transition:
//                                                     "height 0.4s ease",
//                                             }}
//                                         />


//                                         {/* =================================
//                                             X AXIS LABEL
//                                         ================================= */}

//                                         <div
//                                             style={{
//                                                 position:
//                                                     "absolute",

//                                                 bottom:
//                                                     -22,

//                                                 left:
//                                                     "50%",

//                                                 transform:
//                                                     "translateX(-50%)",

//                                                 fontSize:
//                                                     isMonthly
//                                                         ? 8
//                                                         : 9,

//                                                 color:
//                                                     P.textMuted,

//                                                 whiteSpace:
//                                                     "nowrap",

//                                                 visibility:
//                                                     shouldShowLabel(
//                                                         index
//                                                     )
//                                                         ? "visible"
//                                                         : "hidden",
//                                             }}
//                                         >
//                                             {item.label}
//                                         </div>

//                                     </div>

//                                 );
//                             }
//                         )}

//                     </div>

//                 </div>

//             </div>

//         </div>
//     );
// };





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

        const magnitude =
            Math.pow(
                10,
                Math.floor(
                    Math.log10(value)
                )
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

    // =====================================================
    // CHART HEIGHT
    // =====================================================

    const chartHeight = 240;

    const plotHeight = 180;

    // =====================================================
    // MONTHLY / YEARLY / TODAY
    // =====================================================

    const isMonthly =
        safeData.length >= 28 &&
        safeData.length <= 31;

    const isYearly =
        safeData.length === 12;

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

                {/* =================================================
                    Y AXIS
                ================================================= */}

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

                        ))
                    }

                </div>


                {/* =================================================
                    GRAPH AREA
                ================================================= */}

                <div
                    style={{
                        flex: 1,
                        minWidth: 0,
                        position: "relative",
                        height: chartHeight,
                    }}
                >

                    {/* =================================================
                        HORIZONTAL GRID LINES
                    ================================================= */}

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
                                    (
                                        1 -
                                        tick /
                                            yAxisMax
                                    ) *
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


                    {/* =================================================
                        BARS
                    ================================================= */}

                    <div
                        style={{
                            position: "absolute",
                            left: 0,
                            right: 0,
                            top: 0,
                            height: plotHeight,

                            display: "flex",
                            alignItems: "flex-end",

                            gap: isMonthly
                                ? 2
                                : 5,

                            padding:
                                "0 2px",
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

                                        {/* =================================================
                                            VALUE
                                            Always show it, including largest bar.
                                        ================================================= */}

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

                                                    fontSize:
                                                        8,

                                                    fontWeight:
                                                        600,

                                                    color:
                                                        P.textMuted,

                                                    whiteSpace:
                                                        "nowrap",

                                                    zIndex: 2,
                                                }}
                                            >
                                                {value.toFixed(1)}
                                            </div>
                                        )}


                                        {/* =================================================
                                            BAR
                                        ================================================= */}

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
                                                    value > 0
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


                    {/* =================================================
                        X AXIS LABELS
                    ================================================= */}

                    <div
                        style={{
                            position:
                                "absolute",

                            top:
                                plotHeight + 8,

                            left: 0,
                            right: 0,

                            display:
                                "flex",

                            alignItems:
                                "center",
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














// const EnergyChart = ({ data, color }) => {
//     const safeData = Array.isArray(data) ? data : [];

//     if (safeData.length === 0) {
//         return (
//             <div
//                 style={{
//                     height: 180,
//                     display: "flex",
//                     alignItems: "center",
//                     justifyContent: "center",
//                     color: P.textMuted,
//                     fontSize: 13,
//                 }}
//             >
//                 No energy data available
//             </div>
//         );
//     }

//     const maxValue = Math.max(
//         ...safeData.map(item => Number(item.value) || 0),
//         1
//     );

//     return (
//         <div
//             style={{
//                 width: "100%",
//                 overflowX: "auto",
//                 paddingBottom: 8,
//             }}
//         >
//             <div
//                 style={{
//                     display: "flex",
//                     alignItems: "flex-end",
//                     gap: safeData.length > 24 ? 4 : 6,
//                     height: 190,

//                     minWidth:
//                         safeData.length > 24
//                             ? 650
//                             : "100%",

//                     padding: "0 4px",
//                 }}
//             >
//                 {safeData.map((item, index) => {
//                     const value =
//                         Number(item.value) || 0;

//                     const barHeight =
//                         (value / maxValue) * 140;

//                     return (
//                         <div
//                             key={index}
//                             style={{
//                                 flex: 1,
//                                 minWidth:
//                                     safeData.length > 24
//                                         ? 14
//                                         : 20,

//                                 height: 190,

//                                 display: "flex",
//                                 flexDirection: "column",
//                                 alignItems: "center",
//                                 justifyContent: "flex-end",
//                             }}
//                         >
//                             {value > 0 && (
//                                 <div
//                                     style={{
//                                         fontSize: 8,
//                                         color: P.textMuted,
//                                         marginBottom: 4,
//                                         whiteSpace: "nowrap",
//                                     }}
//                                 >
//                                     {value.toFixed(1)}
//                                 </div>
//                             )}

//                             <div
//                                 style={{
//                                     width: "100%",
//                                     maxWidth: 28,

//                                     height: Math.max(
//                                         barHeight,
//                                         value > 0 ? 4 : 2
//                                     ),

//                                     background:
//                                         value > 0
//                                             ? color
//                                             : `${color}33`,

//                                     borderRadius:
//                                         "4px 4px 0 0",

//                                     transition:
//                                         "height 0.4s ease",
//                                 }}
//                             />

//                             <div
//                                 style={{
//                                     fontSize:
//                                         safeData.length > 24
//                                             ? 8
//                                             : 10,

//                                     color: P.textMuted,
//                                     marginTop: 6,
//                                     whiteSpace: "nowrap",
//                                 }}
//                             >
//                                 {item.label}
//                             </div>
//                         </div>
//                     );
//                 })}
//             </div>
//         </div>
//     );
// };

    // OLD PARSER

    // const getParameterValue = (parameter) => {
    //     const entry = Object.entries(data || {}).find(([key]) => {

    //         if (!key.includes("-")) return false;

    //         const parsed = parseKeyword(key);

    //         return parsed.parameter === parameter;
    //     });

    //     return entry ? entry[1] : "--";
    // };


    const getParameterValue = (parameter) => {
        return data?.[parameter] ?? "--";
    };

    // POWER DETAILS
    // const powerDetails = [
    //     {
    //         key: "POW",
    //         label: PARAMETER_MAP.POW.label,
    //         description: PARAMETER_MAP.POW.desc,
    //         // value: data?.["IS-1-0---POW"],
    //         value: getParameterValue("POW"),
    //         unit: PARAMETER_MAP.POW.unit,
    //         icon: (
    //             <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    //                 <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    //             </svg>
    //         ),
    //     },
    //     {
    //         key: "TKWH",
    //         label: PARAMETER_MAP.TKWH.label,
    //         description: PARAMETER_MAP.TKWH.desc,
    //         // value: data?.["IS-1-0---TKWH"],
    //         value: getParameterValue("TKWH"),
    //         unit: PARAMETER_MAP.TKWH.unit,
    //         icon: (
    //             <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    //                 <circle cx="12" cy="12" r="5" />
    //                 <line x1="12" y1="1" x2="12" y2="3" />
    //                 <line x1="12" y1="21" x2="12" y2="23" />
    //                 <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
    //                 <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
    //                 <line x1="1" y1="12" x2="3" y2="12" />
    //                 <line x1="21" y1="12" x2="23" y2="12" />
    //                 <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
    //                 <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
    //             </svg>
    //         ),
    //     },
    //     {
    //         key: "TON",
    //         label: PARAMETER_MAP.TON.label,
    //         description: PARAMETER_MAP.TON.desc,
    //         // value: data?.["IS-1-0---TON"],
    //         value: getParameterValue("TON"),
    //         unit: PARAMETER_MAP.TON.unit,
    //         icon: (
    //             <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    //                 <circle cx="12" cy="12" r="9" />
    //                 <polyline points="12 6 12 12 16 14" />
    //             </svg>
    //         ),
    //     },
    //     {
    //         key: "LKWH",
    //         label: PARAMETER_MAP.LKWH.label,
    //         description: PARAMETER_MAP.LKWH.desc,
    //         // value: data?.["IS-1-0---LKWH"],
    //         value: getParameterValue("LKWH"),
    //         unit: PARAMETER_MAP.LKWH.unit,
    //         icon: (
    //             <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    //                 <path d="M19 12h1m-18 0h1m4.217-8.883a5.9 5.9 0 0 1 5.566 0m-11.132 5.566a5.9 5.9 0 0 1 0 5.566m11.132 0a5.9 5.9 0 0 1-5.566 5.566m-5.566-11.132a5.9 5.9 0 0 1 0-5.566m5.566-5.566a5.9 5.9 0 0 1 5.566 0" />
    //                 <path d="M12 2v2m0 16v2M4.22 4.22l1.414 1.414m11.728 0l1.414-1.414M2.245 12H4m16 0h1.755" />
    //             </svg>
    //         ),
    //     },
    //     {
    //         key: "LON",
    //         label: PARAMETER_MAP.LON.label,
    //         description: PARAMETER_MAP.LON.desc,
    //         // value: data?.["IS-1-0---LON"],
    //         value: getParameterValue("LON"),
    //         unit: PARAMETER_MAP.LON.unit,
    //         icon: (
    //             <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    //                 <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" />
    //                 <path d="M12.5 7H11v6l5.2 3.2" />
    //             </svg>
    //         ),
    //     },
    // ];

    return (
        <div style={{ minHeight: "100vh", paddingBottom: "90px", background: P.bg, fontFamily: "'Inter', sans-serif" }}>

            <PageHeader
                title="POWER"
                backPath="/"
            />

            {/* HEADER */}
            {/* <Header
                data={data}
                lastUpdated={lastUpdated}
            /> */}

            {/* ================= DEVICE INFO CARD ================= */}

            {/* <div
                style={{
                    margin: "20px 20px 16px",
                    background: P.surface,
                    borderRadius: 16,
                    padding: "16px 18px",
                    border: `1px solid ${P.border}`,
                    boxShadow: P.shadowCard,
                }}
            >

                <div
                    style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 6,
                        background: P.surfaceGreen,
                        border: `1px solid ${P.borderGreen}`,
                        borderRadius: 20,
                        padding: "4px 10px",
                        flexShrink: 0,
                        marginBottom: 16,
                    }}
                >
                    <div
                        style={{
                            width: 8,
                            height: 8,
                            borderRadius: "50%",
                            background: P.green,
                            boxShadow: `0 0 6px ${P.green}`,
                        }}
                    />

                    <span
                        style={{
                            fontSize: 12,
                            fontWeight: 700,
                            color: P.textGreen,
                            fontFamily: "'DM Sans', sans-serif",
                        }}
                    >
                        Online
                    </span>
                </div>

                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                        gap: 24,
                    }}
                >

                    <div style={{ flex: 1 }}>
                        <div
                            style={{
                                fontSize: 10,
                                color: P.textLight,
                                fontWeight: 500,
                                letterSpacing: 0.8,
                                marginBottom: 2,
                                fontFamily: "'Inter', sans-serif",
                            }}
                        >
                            SERIAL NUMBER
                        </div>

                        <div
                            style={{
                                fontSize: 14,
                                fontWeight: 700,
                                color: P.textPrimary,
                                fontFamily: "'DM Sans', sans-serif",
                            }}
                        >
                            {Object.keys(data || {}).find(k => k.startsWith("ASN_"))
                                ? data[Object.keys(data).find(k => k.startsWith("ASN_"))]
                                : "--"}
                        </div>
                    </div>

                    <div
                        style={{
                            textAlign: "right",
                        }}
                    >
                        <div
                            style={{
                                fontSize: 10,
                                color: P.textLight,
                                fontWeight: 500,
                                letterSpacing: 0.8,
                                marginBottom: 2,
                                fontFamily: "'Inter', sans-serif",
                            }}
                        >
                            LAST UPDATED
                        </div>

                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "flex-end",
                                gap: 8,
                                marginTop: 2,
                                whiteSpace: "nowrap",
                                fontFamily: "'DM Sans', sans-serif",
                            }}
                        >
                            <span
                                style={{
                                    fontSize: 14,
                                    fontWeight: 700,
                                    color: P.textPrimary,
                                }}
                            >
                                {formattedDateTime.date}
                            </span>

                            <span
                                style={{
                                    width: 6,
                                    height: 6,
                                    borderRadius: "50%",
                                    background: P.textAmberBright,
                                    display: "inline-block",
                                    flexShrink: 0,
                                }}
                            />

                            <span
                                style={{
                                    fontSize: 14,
                                    fontWeight: 600,
                                    color: P.textPrimary,
                                }}
                            >
                                {formattedDateTime.time}
                            </span>
                        </div>
                    </div>

                </div>

            </div> */}

            
            <DeviceInfo
                data={data}
                lastUpdated={lastUpdated}
            />

            {/* PAGE CONTENT */}
            <div style={{ padding: "0 20px 20px" }}>

                <h2 style={{ fontSize: 15, fontWeight: 800, color: P.textAmber, marginBottom: 12, marginTop: 4, letterSpacing: 0.5, fontFamily: "'DM Sans', sans-serif" }}>
                    SOLAR PANEL DETAILS
                </h2>

                <div style={{ background: P.textAmberBright, border: `1.5px solid ${P.borderDark}`, borderRadius: 16, padding: "16px", marginBottom: 20, boxShadow: P.shadowCardRaised, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>

                    <div style={metricCard}>
                        <div style={metricIconRow}>
                            <span style={metricIcon}>⚡</span>
                            <span style={metricValue}>{getParameterValue("PV")} <span style={metricUnit}>V</span></span>
                        </div>
                        <div style={metricLabel}>PV Voltage</div>
                        <div style={metricDesc}>Input Voltage</div>
                    </div>

                    <div style={metricCard}>
                        <div style={metricIconRow}>
                            <span style={metricIcon}>⚡</span>
                            <span style={metricValue}>{getParameterValue("PI")} <span style={metricUnit}>A</span></span>
                        </div>
                        <div style={metricLabel}>PV Current</div>
                        <div style={metricDesc}>Input current</div>
                    </div>

                    <div style={{ ...metricCard, gridColumn: "1 / -1", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        <div>
                            <div style={metricIconRow}><span style={metricIcon}>🔲</span></div>
                            <div style={metricLabel}>Solar Power</div>
                            <div style={metricDesc}>Total output</div>
                        </div>
                        <div style={{ fontSize: 22, fontWeight: 800, color: P.textPrimary, fontFamily: "'DM Sans', sans-serif" }}>
                            {getParameterValue("PPOW")} <span style={{ fontSize: 14, fontWeight: 600, color: P.textMuted }}>kW</span>
                        </div>
                    </div>




                </div>



                {/* HEADING */}
                <h2
                    style={{
                        fontSize: 15,
                        fontWeight: 800,
                        color: P.textAmber,
                        marginBottom: 14,
                        marginTop: 4,
                        letterSpacing: 0.5,
                        fontFamily: "'DM Sans', sans-serif",
                    }}
                >
                    {/* POWER GENERATED DETAILS */}
                    GENERATION SUMMARY
                </h2>

                {/* TOP 3 STAT CARDS */}


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
                        {/* <div style={statValue}>{getParameterValue("POW")}</div> */}
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
                        {/* <div style={{ ...statValue, color: P.textAmberBright }}>{getParameterValue("LON")}</div> */}
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

                {/* TODAY ENERGY — BAR CHART */}
                {/* <div style={chartCard}>
                    <div style={chartHeader}>
                        <span style={chartTitle}>Today Energy</span>
                        <span style={chartBadge}>{getParameterValue("TKWH")} kWh</span>
                    </div>
                    <BarChart value={getParameterValue("TKWH")} maxValue={50} color={P.textAmberBright} />
                </div> */}

                <div style={chartCard}>

    {/* <div style={chartHeader}>

        <span style={chartTitle}>
            {chartMode === "today"
                ? "Today Energy"
                : chartMode === "monthly"
                    ? "Monthly Energy"
                    : "Yearly Energy"}
        </span>

<span style={chartBadge}>
    {Number(
        energy?.[chartMode] ?? 0
    ).toFixed(2)} kWh
</span>
    </div> */}

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

        {/* ENERGY TOTAL */}

        <span style={chartBadge}>
            {Number(
                energy?.[chartMode] ?? 0
            ).toFixed(2)} kWh
        </span>


        {/* REFRESH BUTTON */}

        <button
            onClick={handleRefreshEnergy}
            disabled={refreshing}
            title="Refresh energy data"
            style={{
                width: 34,
                height: 34,

                border: `1px solid ${P.border}`,

                borderRadius: 8,

                background:
                    refreshing
                        ? P.bg
                        : P.surface,

                color:
                    P.textPrimary,

                display: "flex",
                alignItems: "center",
                justifyContent: "center",

                cursor:
                    refreshing
                        ? "default"
                        : "pointer",

                padding: 0,

                opacity:
                    refreshing
                        ? 0.6
                        : 1,

                transition:
                    "all 0.2s ease"
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
                    transform:
                        refreshing
                            ? "rotate(360deg)"
                            : "none",

                    transition:
                        refreshing
                            ? "transform 0.8s linear"
                            : "none"
                }}
            >
                <path
                    d="M20 11a8.1 8.1 0 0 0-15.5-2"
                />

                <polyline
                    points="4 4 4 9 9 9"
                />

                <path
                    d="M4 13a8.1 8.1 0 0 0 15.5 2"
                />

                <polyline
                    points="20 20 20 15 15 15"
                />
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
                onClick={() =>
                    setChartMode(key)
                }
                style={{
                    flex: 1,
                    border: "none",
                    borderRadius: 8,
                    padding: "8px 6px",
                    cursor: "pointer",

                    background:
                        chartMode === key
                            ? P.amber
                            : "transparent",

                    color:
                        chartMode === key
                            ? P.surface
                            : P.textMuted,

                    fontSize: 12,
                    fontWeight: 700,
                    fontFamily:
                        "'Inter', sans-serif"
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

                {/* TODAY ON TIME — LINE CHART */}
                {/* <div style={chartCard}>
                    <div style={chartHeader}>
                        <span style={chartTitle}>Today On Time</span>
                        <span style={chartBadge}>{getParameterValue("TON")} hrs</span>
                    </div>
                    <LineChart value={getParameterValue("TON")} maxValue={24} color={P.textAmber} />
                </div> */}
            </div>

            {/* FOOTER */}
            <Footer data={data} />
        </div>
    );
}