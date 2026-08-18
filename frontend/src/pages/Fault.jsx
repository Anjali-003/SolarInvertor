// import { useInverter } from "../context/Context";
// import Footer from "../components/Footer";
// import DeviceInfo from "../components/DeviceInfo";
// import P from "../theme/colors";
// import { parseKeyword } from "../utils/parseKeyword";
// import PageHeader from "../components/PageHeader";

// export default function Fault() {

//     const { data, lastUpdated } = useInverter();

//     const formattedDateTime = (() => {
//     if (!lastUpdated) return { date: "--", time: "--" };

//     const d = new Date(lastUpdated);

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

//     // GET PARAMETER VALUE DYNAMICALLY

//     // OLD PARSER
//     // const getParameterValue = (parameter) => {

//     //     const entry = Object.entries(data || {}).find(([key]) => {

//     //         if (!key.includes("-")) return false;

//     //         const parsed = parseKeyword(key);

//     //         return parsed.parameter === parameter;
//     //     });

//     //     return entry ? entry[1] : null;
//     // };

//     const getParameterValue = (parameter) => {
//     return data?.[parameter] ?? "--";
// };

//     // Icon definitions for fault types
//     const voltageIcon = (
//         <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//             <path d="M18 3H6a3 3 0 0 0-3 3v12a3 3 0 0 0 3 3h12a3 3 0 0 0 3-3V6a3 3 0 0 0-3-3z" />
//             <line x1="7" y1="10" x2="17" y2="10" />
//             <line x1="7" y1="14" x2="17" y2="14" />
//         </svg>
//     );

//     const frequencyIcon = (
//         <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//             <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
//             <path d="M21 3v5h-5" />
//             <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
//             <path d="M3 21v-5h5" />
//         </svg>
//     );

//     const powerIcon = (
//         <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//             <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
//         </svg>
//     );

//     const temperatureIcon = (
//         <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//             <path d="M12 2v20" />
//             <path d="M12 20a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" />
//             <path d="M9 9a3 3 0 0 1 6 0" />
//             <line x1="9" y1="9" x2="9" y2="5" />
//             <line x1="15" y1="9" x2="15" y2="5" />
//         </svg>
//     );

//     const warningIcon = (
//         <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//             <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3.05h16.94a2 2 0 0 0 1.71-3.05L13.71 3.86a2 2 0 0 0-3.42 0z" />
//             <line x1="12" y1="9" x2="12" y2="13" />
//             <line x1="12" y1="17" x2="12.01" y2="17" />
//         </svg>
//     );

//     // ─── FAULT DEFINITIONS ─────────────────────────────
//     const faultDefs = [
//         {
//             // key: "IS-1-0---FT1",
//             key: "FT1",
//             title: "Fault 1",
//             desc: "Voltage Fault",
//             icon: voltageIcon,
//             meanings: [
//                 "Normal",
//                 "VAC High",
//                 "VAC Low",
//                 "Grid Voltage Fail",
//             ],
//         },
//         {
//             // key: "IS-1-0---FT2",
//             key: "FT2",
//             title: "Fault 2",
//             desc: "Frequency Fault",
//             icon: frequencyIcon,
//             meanings: [
//                 "Normal",
//                 "Frequency High",
//                 "Frequency Low",
//             ],
//         },
//         {
//             // key: "IS-1-0---FT3",
//             key: "FT3",
//             title: "Fault 3",
//             desc: "Output / Circuit Fault",
//             icon: powerIcon,
//             meanings: [
//                 "Normal",
//                 "AC Output Overload",
//                 "PV Short Circuit",
//                 "AC Short Circuit",
//                 "Leakage Current High",
//             ],
//         },
//         {
//             // key: "IS-1-0---FT4",
//             key: "FT4",
//             title: "Fault 4",
//             desc: "Temperature Fault",
//             icon: temperatureIcon,
//             meanings: [
//                 "Normal",
//                 "High Temperature",
//             ],
//         },
//         {
//             // key: "IS-1-0---FT5",
//             key: "FT5",
//             title: "Fault 5",
//             desc: "Other Fault",
//             icon: warningIcon,
//             meanings: [
//                 "Normal",
//                 "Other Fault",
//             ],
//         },
//     ];

//     // GET FAULT TEXT
//     const getFaultText = (fault) => {

//         // const value = data?.[fault.key];
//         const value = getParameterValue(fault.key);

//         if (value == null) return "--";

//         return fault.meanings[value] || "--";
//     };

//     // ACTIVE FAULT?
//     const isFaultActive = (fault) => {

//         // const value = data?.[fault.key];
//         const value = getParameterValue(fault.key);

//         return value !== 0 && value != null;
//     };

//     return (
//         <div
//             style={{
//                 minHeight: "100vh",
//                 paddingBottom: "90px",
//                 background: P.bg,
//                 fontFamily: "'Inter', sans-serif",
//             }}
//         >

//         <PageHeader
//             title="FAULT"
//             backPath="/"
//         />

//             {/* ================= DEVICE INFO CARD ================= */}

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

//     {/* Online Badge (EXACTLY SAME AS POWER PAGE) */}
//     <div
//         style={{
//             display: "inline-flex",
//             alignItems: "center",
//             gap: 6,
//             background: P.surfaceGreen,
//             border: `1px solid ${P.borderGreen}`,
//             borderRadius: 20,
//             padding: "4px 10px",
//             flexShrink: 0,
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
//             Online
//         </span>
//     </div>

//     {/* Device Details */}
//     <div
//         style={{
//             display: "flex",
//             justifyContent: "space-between",
//             alignItems: "flex-start",
//             gap: 24,
//         }}
//     >

//         {/* Serial Number */}
//         <div style={{ flex: 1 }}>
//             <div
//                 style={{
//                     fontSize: 10,
//                     color: P.textLight,
//                     fontWeight: 500,
//                     letterSpacing: 0.8,
//                     marginBottom: 2,
//                     fontFamily: "'Inter', sans-serif",
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

//         {/* Last Updated */}
//         <div
//             style={{
//                 textAlign: "right",
//             }}
//         >
//             <div
//                 style={{
//                     fontSize: 10,
//                     color: P.textLight,
//                     fontWeight: 500,
//                     letterSpacing: 0.8,
//                     marginBottom: 2,
//                     fontFamily: "'Inter', sans-serif",
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

//             {/* PAGE CONTENT */}
//             <div
//                 style={{
//                     padding: "0 20px 20px",
//                 }}
//             >

//                 {/* HEADING */}
//                 <h2
//                     style={{
//                         fontSize: 18,
//                         fontWeight: 800,
//                         color: P.textPrimary,
//                         marginBottom: 14,
//                         marginTop: 4,
//                         letterSpacing: 0,
//                         fontFamily: "'DM Sans', sans-serif",
//                     }}
//                 >
//                     FAULT DETAILS
//                 </h2>

//                 {/* FAULT CONTAINER */}
//                 <div
//                     style={{
//                         display: "flex",
//                         flexDirection: "column",
//                         gap: "16px",
//                     }}
//                 >

//                     {faultDefs.map((fault) => {

//                         const active = isFaultActive(fault);

//                         return (

//                             <div
//                                 key={fault.key}
//                                 style={{
//                                     background: P.surface,
//                                     borderRadius: 14,
//                                     overflow: "hidden",
//                                     boxShadow: P.shadowCardRaised,
//                                 }}
//                             >
//                                 {/* ICON + TITLE ROW */}
//                                 <div
//                                     style={{
//                                         display: "flex",
//                                         alignItems: "center",
//                                         gap: 12,
//                                         padding: "14px 16px 10px",
//                                     }}
//                                 >
//                                     {/* ICON in colored circle */}
//                                     <div
//                                         style={{
//                                             width: 40,
//                                             height: 40,
//                                             borderRadius: 10,
//                                             background: active ? P.surfaceRed : P.surfaceGreen,
//                                             display: "flex",
//                                             alignItems: "center",
//                                             justifyContent: "center",
//                                             flexShrink: 0,
//                                             color: active ? P.red : P.green,
//                                         }}
//                                     >
//                                         {fault.icon}
//                                     </div>

//                                     {/* TITLE + DESC */}
//                                     <div>
//                                         <div
//                                             style={{
//                                                 fontSize: 15,
//                                                 fontWeight: 700,
//                                                 color: P.textPrimary,
//                                                 fontFamily: "'DM Sans', sans-serif",
//                                             }}
//                                         >
//                                             {fault.title}
//                                         </div>
//                                         <div
//                                             style={{
//                                                 fontSize: 12,
//                                                 color: P.textMuted,
//                                                 marginTop: 2,
//                                                 fontFamily: "'Inter', sans-serif",
//                                             }}
//                                         >
//                                             {fault.desc}
//                                         </div>
//                                     </div>
//                                 </div>

//                                 {/* STATUS BANNER — full width at bottom of card */}
//                                 <div
//                                     style={{
//                                         background: active ? P.red : P.green,
//                                         padding: "8px 16px",
//                                         textAlign: "left",
//                                     }}
//                                 >
//                                     <span
//                                         style={{
//                                             fontSize: 13,
//                                             fontWeight: 700,
//                                             color: P.textWhite,
//                                             fontFamily: "'DM Sans', sans-serif",
//                                             letterSpacing: 0.3,
//                                         }}
//                                     >
//                                         {getFaultText(fault)}
//                                     </span>
//                                 </div>
//                             </div>
//                         );
//                     })}
//                 </div>
//             </div>

//             {/* FOOTER */}
//             <Footer data={data} />

//         </div>
//     );
// }













// import { useInverter } from "../context/Context";
// import Footer from "../components/Footer";
// import P from "../theme/colors";
// import PageHeader from "../components/PageHeader";
// import DeviceInfo from "../components/DeviceInfo";

// export default function Fault() {
//     const { data, lastUpdated } = useInverter();

//     // ─── DATE / TIME ────────────────────────────────────────────────
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

//     // ─── GET PARAMETER VALUE ───────────────────────────────────────
//     const getParameterValue = (parameter) => {
//         return data?.[parameter] ?? 0;
//     };

//     // ─── ICONS ─────────────────────────────────────────────────────

//     const voltageIcon = (
//         <svg
//             width="24"
//             height="24"
//             viewBox="0 0 24 24"
//             fill="none"
//             stroke="currentColor"
//             strokeWidth="2"
//             strokeLinecap="round"
//             strokeLinejoin="round"
//         >
//             <path d="M18 3H6a3 3 0 0 0-3 3v12a3 3 0 0 0 3 3h12a3 3 0 0 0 3-3V6a3 3 0 0 0-3-3z" />
//             <line x1="7" y1="10" x2="17" y2="10" />
//             <line x1="7" y1="14" x2="17" y2="14" />
//         </svg>
//     );

//     const frequencyIcon = (
//         <svg
//             width="24"
//             height="24"
//             viewBox="0 0 24 24"
//             fill="none"
//             stroke="currentColor"
//             strokeWidth="2"
//             strokeLinecap="round"
//             strokeLinejoin="round"
//         >
//             <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
//             <path d="M21 3v5h-5" />
//             <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
//             <path d="M3 21v-5h5" />
//         </svg>
//     );

//     const powerIcon = (
//         <svg
//             width="24"
//             height="24"
//             viewBox="0 0 24 24"
//             fill="none"
//             stroke="currentColor"
//             strokeWidth="2"
//             strokeLinecap="round"
//             strokeLinejoin="round"
//         >
//             <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
//         </svg>
//     );

//     const temperatureIcon = (
//         <svg
//             width="24"
//             height="24"
//             viewBox="0 0 24 24"
//             fill="none"
//             stroke="currentColor"
//             strokeWidth="2"
//             strokeLinecap="round"
//             strokeLinejoin="round"
//         >
//             <path d="M12 2v20" />
//             <path d="M12 20a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" />
//             <path d="M9 9a3 3 0 0 1 6 0" />
//             <line x1="9" y1="9" x2="9" y2="5" />
//             <line x1="15" y1="9" x2="15" y2="5" />
//         </svg>
//     );

//     const warningIcon = (
//         <svg
//             width="24"
//             height="24"
//             viewBox="0 0 24 24"
//             fill="none"
//             stroke="currentColor"
//             strokeWidth="2"
//             strokeLinecap="round"
//             strokeLinejoin="round"
//         >
//             <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3.05h16.94a2 2 0 0 0 1.71-3.05L13.71 3.86a2 2 0 0 0-3.42 0z" />
//             <line x1="12" y1="9" x2="12" y2="13" />
//             <line x1="12" y1="17" x2="12.01" y2="17" />
//         </svg>
//     );

//     // ─── FAULT DEFINITIONS ─────────────────────────────────────────
//     //
//     // ST1
//     // bit 0 = Grid OV
//     // bit 1 = Grid UV
//     // bit 2 = Grid OF
//     // bit 3 = Grid UF
//     // bit 4 = Inverter OC
//     // bit 5 = Differential Current
//     // bit 6 = Temperature
//     //
//     // ST2
//     // bit 0 = PV OV
//     // bit 1 = PV UV
//     // bit 2 = PV OC
//     // bit 3 = DC Bus OV
//     // bit 4 = DC Bus UV
//     // bit 5 = Earth Fault

//     const faultDefs = [
//         {
//             key: "ST1_BIT0",
//             statusKey: "ST1",
//             bit: 0,
//             title: "Grid Over Voltage",
//             desc: "Grid Voltage Fault",
//             icon: voltageIcon,
//         },
//         {
//             key: "ST1_BIT1",
//             statusKey: "ST1",
//             bit: 1,
//             title: "Grid Under Voltage",
//             desc: "Grid Voltage Fault",
//             icon: voltageIcon,
//         },
//         {
//             key: "ST1_BIT2",
//             statusKey: "ST1",
//             bit: 2,
//             title: "Grid Over Frequency",
//             desc: "Grid Frequency Fault",
//             icon: frequencyIcon,
//         },
//         {
//             key: "ST1_BIT3",
//             statusKey: "ST1",
//             bit: 3,
//             title: "Grid Under Frequency",
//             desc: "Grid Frequency Fault",
//             icon: frequencyIcon,
//         },
//         {
//             key: "ST1_BIT4",
//             statusKey: "ST1",
//             bit: 4,
//             title: "Inverter Over Current",
//             desc: "Inverter Current Fault",
//             icon: powerIcon,
//         },
//         {
//             key: "ST1_BIT5",
//             statusKey: "ST1",
//             bit: 5,
//             title: "Differential Current",
//             desc: "Inverter Current Unbalance",
//             icon: powerIcon,
//         },
//         {
//             key: "ST1_BIT6",
//             statusKey: "ST1",
//             bit: 6,
//             title: "Over Temperature",
//             desc: "Temperature Fault",
//             icon: temperatureIcon,
//         },

//         {
//             key: "ST2_BIT0",
//             statusKey: "ST2",
//             bit: 0,
//             title: "PV Over Voltage",
//             desc: "PV Voltage Fault",
//             icon: voltageIcon,
//         },
//         {
//             key: "ST2_BIT1",
//             statusKey: "ST2",
//             bit: 1,
//             title: "PV Under Voltage",
//             desc: "PV Voltage Fault",
//             icon: voltageIcon,
//         },
//         {
//             key: "ST2_BIT2",
//             statusKey: "ST2",
//             bit: 2,
//             title: "PV Over Current",
//             desc: "PV Current Fault",
//             icon: powerIcon,
//         },
//         {
//             key: "ST2_BIT3",
//             statusKey: "ST2",
//             bit: 3,
//             title: "DC Bus Over Voltage",
//             desc: "DC Bus Voltage Fault",
//             icon: voltageIcon,
//         },
//         {
//             key: "ST2_BIT4",
//             statusKey: "ST2",
//             bit: 4,
//             title: "DC Bus Under Voltage",
//             desc: "DC Bus Voltage Fault",
//             icon: voltageIcon,
//         },
//         {
//             key: "ST2_BIT5",
//             statusKey: "ST2",
//             bit: 5,
//             title: "Earth Fault",
//             desc: "Earth Fault Detected",
//             icon: warningIcon,
//         },
//     ];

//     // ─── CHECK WHETHER A PARTICULAR BIT IS ACTIVE ────────────────
//     const isFaultActive = (fault) => {
//         const statusValue = Number(getParameterValue(fault.statusKey)) || 0;

//         return Boolean(statusValue & (1 << fault.bit));
//     };

//     // ─── ACTIVE FAULT COUNT ────────────────────────────────────────
//     const activeFaults = faultDefs.filter(isFaultActive);

//     return (
//         <div
//             style={{
//                 minHeight: "100vh",
//                 paddingBottom: "90px",
//                 background: P.bg,
//                 fontFamily: "'Inter', sans-serif",
//             }}
//         >
//             <PageHeader
//                 title="FAULT"
//                 backPath="/"
//             />

//             {/* ================= DEVICE INFO CARD ================= */}
// {/* 
//             <div
//                 style={{
//                     margin: "20px 20px 16px",
//                     background: P.surface,
//                     borderRadius: 16,
//                     padding: "16px 18px",
//                     border: `1px solid ${P.border}`,
//                     boxShadow: P.shadowCard,
//                 }}
//             >
//                 <div
//                     style={{
//                         display: "inline-flex",
//                         alignItems: "center",
//                         gap: 6,
//                         background: P.surfaceGreen,
//                         border: `1px solid ${P.borderGreen}`,
//                         borderRadius: 20,
//                         padding: "4px 10px",
//                         flexShrink: 0,
//                         marginBottom: 16,
//                     }}
//                 >
//                     <div
//                         style={{
//                             width: 8,
//                             height: 8,
//                             borderRadius: "50%",
//                             background: P.green,
//                             boxShadow: `0 0 6px ${P.green}`,
//                         }}
//                     />

//                     <span
//                         style={{
//                             fontSize: 12,
//                             fontWeight: 700,
//                             color: P.textGreen,
//                             fontFamily: "'DM Sans', sans-serif",
//                         }}
//                     >
//                         Online
//                     </span>
//                 </div>

//                 <div
//                     style={{
//                         display: "flex",
//                         justifyContent: "space-between",
//                         alignItems: "flex-start",
//                         gap: 24,
//                     }}
//                 >
//                     <div style={{ flex: 1 }}>
//                         <div
//                             style={{
//                                 fontSize: 10,
//                                 color: P.textLight,
//                                 fontWeight: 500,
//                                 letterSpacing: 0.8,
//                                 marginBottom: 2,
//                                 fontFamily: "'Inter', sans-serif",
//                             }}
//                         >
//                             SERIAL NUMBER
//                         </div>

//                         <div
//                             style={{
//                                 fontSize: 14,
//                                 fontWeight: 700,
//                                 color: P.textPrimary,
//                                 fontFamily: "'DM Sans', sans-serif",
//                             }}
//                         >
//                             {Object.keys(data || {}).find((k) =>
//                                 k.startsWith("ASN_")
//                             )
//                                 ? data[
//                                       Object.keys(data).find((k) =>
//                                           k.startsWith("ASN_")
//                                       )
//                                   ]
//                                 : "--"}
//                         </div>
//                     </div>

//                     <div
//                         style={{
//                             textAlign: "right",
//                         }}
//                     >
//                         <div
//                             style={{
//                                 fontSize: 10,
//                                 color: P.textLight,
//                                 fontWeight: 500,
//                                 letterSpacing: 0.8,
//                                 marginBottom: 2,
//                                 fontFamily: "'Inter', sans-serif",
//                             }}
//                         >
//                             LAST UPDATED
//                         </div>

//                         <div
//                             style={{
//                                 display: "flex",
//                                 alignItems: "center",
//                                 justifyContent: "flex-end",
//                                 gap: 8,
//                                 marginTop: 2,
//                                 whiteSpace: "nowrap",
//                                 fontFamily: "'DM Sans', sans-serif",
//                             }}
//                         >
//                             <span
//                                 style={{
//                                     fontSize: 14,
//                                     fontWeight: 700,
//                                     color: P.textPrimary,
//                                 }}
//                             >
//                                 {formattedDateTime.date}
//                             </span>

//                             <span
//                                 style={{
//                                     width: 6,
//                                     height: 6,
//                                     borderRadius: "50%",
//                                     background: P.textAmberBright,
//                                     display: "inline-block",
//                                     flexShrink: 0,
//                                 }}
//                             />

//                             <span
//                                 style={{
//                                     fontSize: 14,
//                                     fontWeight: 600,
//                                     color: P.textPrimary,
//                                 }}
//                             >
//                                 {formattedDateTime.time}
//                             </span>
//                         </div>
//                     </div>
//                 </div>
//             </div> */}

            
//             <DeviceInfo
//                 data={data}
//                 lastUpdated={lastUpdated}
//             />

//             {/* ================= PAGE CONTENT ================= */}

//             <div
//                 style={{
//                     padding: "0 20px 20px",
//                 }}
//             >
//                 {/* HEADING */}
//                 <h2
//                     style={{
//                         fontSize: 18,
//                         fontWeight: 800,
//                         color: P.textPrimary,
//                         marginBottom: 14,
//                         marginTop: 4,
//                         letterSpacing: 0,
//                         fontFamily: "'DM Sans', sans-serif",
//                     }}
//                 >
//                     FAULT DETAILS
//                 </h2>

//                 {/* ================= OVERALL STATUS ================= */}

//                 <div
//                     style={{
//                         background:
//                             activeFaults.length > 0
//                                 ? P.surfaceRed
//                                 : P.surfaceGreen,
//                         border: `1px solid ${
//                             activeFaults.length > 0
//                                 ? P.red
//                                 : P.borderGreen
//                         }`,
//                         borderRadius: 14,
//                         padding: "12px 16px",
//                         marginBottom: 16,
//                         display: "flex",
//                         alignItems: "center",
//                         justifyContent: "space-between",
//                     }}
//                 >
//                     <div
//                         style={{
//                             fontSize: 13,
//                             fontWeight: 700,
//                             color:
//                                 activeFaults.length > 0
//                                     ? P.red
//                                     : P.textGreen,
//                             fontFamily: "'DM Sans', sans-serif",
//                         }}
//                     >
//                         {activeFaults.length > 0
//                             ? `${activeFaults.length} Active Fault${
//                                   activeFaults.length > 1 ? "s" : ""
//                               }`
//                             : "No Active Faults"}
//                     </div>

//                     <div
//                         style={{
//                             width: 9,
//                             height: 9,
//                             borderRadius: "50%",
//                             background:
//                                 activeFaults.length > 0
//                                     ? P.red
//                                     : P.green,
//                             boxShadow: `0 0 6px ${
//                                 activeFaults.length > 0
//                                     ? P.red
//                                     : P.green
//                             }`,
//                         }}
//                     />
//                 </div>

//                 {/* ================= FAULT CONTAINER ================= */}

//                 <div
//                     style={{
//                         display: "flex",
//                         flexDirection: "column",
//                         gap: "16px",
//                     }}
//                 >
//                     {faultDefs.map((fault) => {
//                         const active = isFaultActive(fault);

//                         return (
//                             <div
//                                 key={fault.key}
//                                 style={{
//                                     background: P.surface,
//                                     borderRadius: 14,
//                                     overflow: "hidden",
//                                     boxShadow: P.shadowCardRaised,
//                                 }}
//                             >
//                                 {/* ICON + TITLE ROW */}
//                                 <div
//                                     style={{
//                                         display: "flex",
//                                         alignItems: "center",
//                                         gap: 12,
//                                         padding: "14px 16px 10px",
//                                     }}
//                                 >
//                                     {/* ICON */}
//                                     <div
//                                         style={{
//                                             width: 40,
//                                             height: 40,
//                                             borderRadius: 10,
//                                             background: active
//                                                 ? P.surfaceRed
//                                                 : P.surfaceGreen,
//                                             display: "flex",
//                                             alignItems: "center",
//                                             justifyContent: "center",
//                                             flexShrink: 0,
//                                             color: active
//                                                 ? P.red
//                                                 : P.green,
//                                         }}
//                                     >
//                                         {fault.icon}
//                                     </div>

//                                     {/* TITLE + DESC */}
//                                     <div>
//                                         <div
//                                             style={{
//                                                 fontSize: 15,
//                                                 fontWeight: 700,
//                                                 color: P.textPrimary,
//                                                 fontFamily:
//                                                     "'DM Sans', sans-serif",
//                                             }}
//                                         >
//                                             {fault.title}
//                                         </div>

//                                         <div
//                                             style={{
//                                                 fontSize: 12,
//                                                 color: P.textMuted,
//                                                 marginTop: 2,
//                                                 fontFamily:
//                                                     "'Inter', sans-serif",
//                                             }}
//                                         >
//                                             {fault.desc}
//                                         </div>
//                                     </div>
//                                 </div>

//                                 {/* STATUS BANNER */}
//                                 <div
//                                     style={{
//                                         background: active
//                                             ? P.red
//                                             : P.green,
//                                         padding: "8px 16px",
//                                         textAlign: "left",
//                                     }}
//                                 >
//                                     <span
//                                         style={{
//                                             fontSize: 13,
//                                             fontWeight: 700,
//                                             color: P.textWhite,
//                                             fontFamily:
//                                                 "'DM Sans', sans-serif",
//                                             letterSpacing: 0.3,
//                                         }}
//                                     >
//                                         {active ? "FAULT ACTIVE" : "Normal"}
//                                     </span>
//                                 </div>
//                             </div>
//                         );
//                     })}
//                 </div>
//             </div>

//             {/* FOOTER */}
//             <Footer data={data} />
//         </div>
//     );
// }



import { useInverter } from "../context/Context";
import Footer from "../components/Footer";
import P from "../theme/colors";
import PageHeader from "../components/PageHeader";
import DeviceInfo from "../components/DeviceInfo";

export default function Fault() {
    // const { data, lastUpdated } = useInverter();

      const {
    data,
    lastUpdated,
    devices,
    selectedDeviceId
} = useInverter();

    // ─── GET PARAMETER VALUE ───────────────────────────────────────
    const getParameterValue = (parameter) => {
        return data?.[parameter] ?? 0;
    };

    // ─── ICONS ─────────────────────────────────────────────────────

    const voltageIcon = (
        <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M18 3H6a3 3 0 0 0-3 3v12a3 3 0 0 0 3 3h12a3 3 0 0 0 3-3V6a3 3 0 0 0-3-3z" />
            <line x1="7" y1="10" x2="17" y2="10" />
            <line x1="7" y1="14" x2="17" y2="14" />
        </svg>
    );

    const frequencyIcon = (
        <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
            <path d="M21 3v5h-5" />
            <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74 2.74L3 16" />
            <path d="M3 21v-5h5" />
        </svg>
    );

    const powerIcon = (
        <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
        </svg>
    );

    const temperatureIcon = (
        <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M12 2v20" />
            <path d="M12 20a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" />
            <path d="M9 9a3 3 0 0 1 6 0" />
            <line x1="9" y1="9" x2="9" y2="5" />
            <line x1="15" y1="9" x2="15" y2="5" />
        </svg>
    );

    const warningIcon = (
        <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3.05h16.94a2 2 0 0 0 3.42 0z" />
            <line x1="12" y1="9" x2="12" y2="13" />
            <line x1="12" y1="17" x2="12.01" y2="17" />
        </svg>
    );

    // ─── FAULT DEFINITIONS ─────────────────────────────────────────
    //
    // ST1
    // bit 0 = Grid OV
    // bit 1 = Grid UV
    // bit 2 = Grid OF
    // bit 3 = Grid UF
    // bit 4 = Inverter OC
    // bit 5 = Differential Current
    // bit 6 = Temperature
    //
    // ST2
    // bit 0 = PV OV
    // bit 1 = PV UV
    // bit 2 = PV OC
    // bit 3 = DC Bus OV
    // bit 4 = DC Bus UV
    // bit 5 = Earth Fault

    const faultDefs = [
        {
            key: "ST1_BIT0",
            statusKey: "ST1",
            bit: 0,
            title: "Grid Over Voltage",
            desc: "Grid Voltage Fault",
            icon: voltageIcon,
        },
        {
            key: "ST1_BIT1",
            statusKey: "ST1",
            bit: 1,
            title: "Grid Under Voltage",
            desc: "Grid Voltage Fault",
            icon: voltageIcon,
        },
        {
            key: "ST1_BIT2",
            statusKey: "ST1",
            bit: 2,
            title: "Grid Over Frequency",
            desc: "Grid Frequency Fault",
            icon: frequencyIcon,
        },
        {
            key: "ST1_BIT3",
            statusKey: "ST1",
            bit: 3,
            title: "Grid Under Frequency",
            desc: "Grid Frequency Fault",
            icon: frequencyIcon,
        },
        {
            key: "ST1_BIT4",
            statusKey: "ST1",
            bit: 4,
            title: "Inverter Over Current",
            desc: "Inverter Current Fault",
            icon: powerIcon,
        },
        {
            key: "ST1_BIT5",
            statusKey: "ST1",
            bit: 5,
            title: "Differential Current",
            desc: "Inverter Current Unbalance",
            icon: powerIcon,
        },
        {
            key: "ST1_BIT6",
            statusKey: "ST1",
            bit: 6,
            title: "Over Temperature",
            desc: "Temperature Fault",
            icon: temperatureIcon,
        },
        {
            key: "ST2_BIT0",
            statusKey: "ST2",
            bit: 0,
            title: "PV Over Voltage",
            desc: "PV Voltage Fault",
            icon: voltageIcon,
        },
        {
            key: "ST2_BIT1",
            statusKey: "ST2",
            bit: 1,
            title: "PV Under Voltage",
            desc: "PV Voltage Fault",
            icon: voltageIcon,
        },
        {
            key: "ST2_BIT2",
            statusKey: "ST2",
            bit: 2,
            title: "PV Over Current",
            desc: "PV Current Fault",
            icon: powerIcon,
        },
        {
            key: "ST2_BIT3",
            statusKey: "ST2",
            bit: 3,
            title: "DC Bus Over Voltage",
            desc: "DC Bus Voltage Fault",
            icon: voltageIcon,
        },
        {
            key: "ST2_BIT4",
            statusKey: "ST2",
            bit: 4,
            title: "DC Bus Under Voltage",
            desc: "DC Bus Voltage Fault",
            icon: voltageIcon,
        },
        {
            key: "ST2_BIT5",
            statusKey: "ST2",
            bit: 5,
            title: "Earth Fault",
            desc: "Earth Fault Detected",
            icon: warningIcon,
        },
    ];

    // ─── CHECK WHETHER FAULT IS ACTIVE ─────────────────────────────

    const isFaultActive = (fault) => {
        const statusValue = Number(getParameterValue(fault.statusKey)) || 0;

        return Boolean(statusValue & (1 << fault.bit));
    };

    // ─── ONLY KEEP ACTIVE FAULTS ───────────────────────────────────

    const activeFaults = faultDefs.filter(isFaultActive);

    return (
        <div
            style={{
                minHeight: "100vh",
                paddingBottom: "90px",
                background: P.bg,
                fontFamily: "'Inter', sans-serif",
            }}
        >
            <PageHeader
                title="FAULT"
                backPath="/"
            />

            {/* <DeviceInfo
                data={data}
                lastUpdated={lastUpdated}
            /> */}

            <DeviceInfo
    data={data}
    lastUpdated={lastUpdated}
    devices={devices}
    selectedDeviceId={selectedDeviceId}
/>

            {/* ================= PAGE CONTENT ================= */}

            <div
                style={{
                    padding: "0 20px 20px",
                }}
            >
                {/* HEADING */}
                <h2
                    style={{
                        fontSize: 18,
                        fontWeight: 800,
                        color: P.textPrimary,
                        marginBottom: 14,
                        marginTop: 4,
                        fontFamily: "'DM Sans', sans-serif",
                    }}
                >
                    FAULT DETAILS
                </h2>

                {/* ================= OVERALL STATUS ================= */}

                <div
                    style={{
                        background:
                            activeFaults.length > 0
                                ? P.surfaceRed
                                : P.surfaceGreen,
                        border: `1px solid ${
                            activeFaults.length > 0
                                ? P.red
                                : P.borderGreen
                        }`,
                        borderRadius: 14,
                        padding: "12px 16px",
                        marginBottom: 16,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                    }}
                >
                    <div
                        style={{
                            fontSize: 13,
                            fontWeight: 700,
                            color:
                                activeFaults.length > 0
                                    ? P.red
                                    : P.textGreen,
                            fontFamily: "'DM Sans', sans-serif",
                        }}
                    >
                        {activeFaults.length > 0
                            ? `${activeFaults.length} Active Fault${
                                  activeFaults.length > 1 ? "s" : ""
                              }`
                            : "No Active Faults"}
                    </div>

                    <div
                        style={{
                            width: 9,
                            height: 9,
                            borderRadius: "50%",
                            background:
                                activeFaults.length > 0
                                    ? P.red
                                    : P.green,
                            boxShadow: `0 0 6px ${
                                activeFaults.length > 0
                                    ? P.red
                                    : P.green
                            }`,
                        }}
                    />
                </div>

                {/* ================= ACTIVE FAULTS ONLY ================= */}

                {activeFaults.length > 0 ? (
                    <div
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: "16px",
                        }}
                    >
                        {activeFaults.map((fault) => (
                            <div
                                key={fault.key}
                                style={{
                                    background: P.surface,
                                    borderRadius: 14,
                                    overflow: "hidden",
                                    boxShadow: P.shadowCardRaised,
                                }}
                            >
                                {/* ICON + TITLE ROW */}
                                <div
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 12,
                                        padding: "14px 16px 10px",
                                    }}
                                >
                                    {/* ICON */}
                                    <div
                                        style={{
                                            width: 40,
                                            height: 40,
                                            borderRadius: 10,
                                            background: P.surfaceRed,
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            flexShrink: 0,
                                            color: P.red,
                                        }}
                                    >
                                        {fault.icon}
                                    </div>

                                    {/* TITLE + DESCRIPTION */}
                                    <div>
                                        <div
                                            style={{
                                                fontSize: 15,
                                                fontWeight: 700,
                                                color: P.textPrimary,
                                                fontFamily:
                                                    "'DM Sans', sans-serif",
                                            }}
                                        >
                                            {fault.title}
                                        </div>

                                        <div
                                            style={{
                                                fontSize: 12,
                                                color: P.textMuted,
                                                marginTop: 2,
                                                fontFamily:
                                                    "'Inter', sans-serif",
                                            }}
                                        >
                                            {fault.desc}
                                        </div>
                                    </div>
                                </div>

                                {/* STATUS BANNER */}
                                <div
                                    style={{
                                        background: P.red,
                                        padding: "8px 16px",
                                        textAlign: "left",
                                    }}
                                >
                                    <span
                                        style={{
                                            fontSize: 13,
                                            fontWeight: 700,
                                            color: P.textWhite,
                                            fontFamily:
                                                "'DM Sans', sans-serif",
                                            letterSpacing: 0.3,
                                        }}
                                    >
                                        FAULT ACTIVE
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    /* ================= NO FAULTS ================= */

                    <div
                        style={{
                            background: P.surfaceGreen,
                            border: `1px solid ${P.borderGreen}`,
                            borderRadius: 14,
                            padding: "28px 20px",
                            textAlign: "center",
                        }}
                    >
                        <div
                            style={{
                                width: 48,
                                height: 48,
                                borderRadius: "50%",
                                background: P.green,
                                color: P.textWhite,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                margin: "0 auto 12px",
                                fontSize: 24,
                                fontWeight: 800,
                            }}
                        >
                            ✓
                        </div>

                        <div
                            style={{
                                fontSize: 16,
                                fontWeight: 800,
                                color: P.textGreen,
                                fontFamily: "'DM Sans', sans-serif",
                            }}
                        >
                            No Active Faults
                        </div>

                        <div
                            style={{
                                fontSize: 12,
                                color: P.textMuted,
                                marginTop: 5,
                                fontFamily: "'Inter', sans-serif",
                            }}
                        >
                            The inverter is operating normally.
                        </div>
                    </div>
                )}
            </div>

            <Footer data={data} />
        </div>
    );
}