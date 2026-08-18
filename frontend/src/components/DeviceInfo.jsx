// import React from "react";
// import P from "../theme/colors";
// import { parseKeyword } from "../utils/parseKeyword";

// export default function DeviceInfo({
//   data,
//   lastUpdated,
// }) {
//   const serialNumber =
//     Object.keys(data || {}).find((key) =>
//       key.startsWith("ASN_")
//     )
//       ? data[
//           Object.keys(data).find((key) =>
//             key.startsWith("ASN_")
//           )
//         ]
//       : "--";

//   const statusKey =
//     Object.keys(data || {}).find((key) => {
//       if (!key.includes("-")) return false;

//       const parsed =
//         parseKeyword(key);

//       return parsed.parameter === "IST";
//     });

//   const inverterStatus =
//     statusKey != null
//       ? data[statusKey]
//       : null;

//   const statusText =
//     inverterStatus === 1
//       ? "ON"
//       : inverterStatus === 0
//       ? "OFF"
//       : inverterStatus === 2
//       ? "FAULT"
//       : inverterStatus === 3
//       ? "OTHER"
//       : "--";

//   const statusColor =
//     inverterStatus === 1
//       ? P.green
//       : inverterStatus === 0
//       ? P.red
//       : inverterStatus === 2
//       ? P.red
//       : P.textMuted;

//   return (
//     <div
//       style={{
//         background: P.surface,
//         borderRadius: 18,
//         padding: "18px 22px",
//         boxShadow:
//           "0 4px 14px rgba(0,0,0,0.08)",
//         display: "flex",
//         justifyContent: "space-between",
//         alignItems: "center",
//         flexWrap: "wrap",
//         gap: 20,
//         margin: "10px 24px 0",
//       }}
//     >
//       {/* LEFT SECTION */}
//       <div>
//         <div
//           style={{
//             fontSize: 16,
//             color: P.textMuted,
//             marginBottom: 4,
//             fontFamily:
//               "'Source Sans Pro', sans-serif",
//           }}
//         >
//           Serial Number
//         </div>

//         <div
//           style={{
//             fontSize: 17,
//             fontWeight: 700,
//             color: P.textPrimary,
//             fontFamily:
//               "'Source Sans Pro', sans-serif",
//           }}
//         >
//           {serialNumber}
//         </div>

//         <div
//           style={{
//             display: "flex",
//             alignItems: "center",
//             gap: 8,
//             padding: "4px 8px",
//             borderRadius: 10,
//             background: `${statusColor}22`,
//             border: `1px solid ${statusColor}`,
//             marginTop: 8,
//             width: "fit-content",
//           }}
//         >
//           <div
//             style={{
//               width: 14,
//               height: 14,
//               borderRadius: 3,
//               background: statusColor,
//               boxShadow: `0 0 8px ${statusColor}88`,
//             }}
//           />

//           <span
//             style={{
//               fontSize: 14,
//               fontWeight: 700,
//               color: statusColor,
//               fontFamily:
//                 "'Source Sans Pro', sans-serif",
//             }}
//           >
//             {statusText}
//           </span>
//         </div>
//       </div>

//       {/* RIGHT SECTION */}
//       <div
//         style={{
//           display: "flex",
//           flexDirection: "column",
//           alignItems: "flex-end",
//         }}
//       >
//         <div
//           style={{
//             fontSize: 15,
//             color: P.textMuted,
//             marginBottom: 6,
//             fontFamily:
//               "'Source Sans Pro', sans-serif",
//           }}
//         >
//           Last Updated
//         </div>

//         <div
//           style={{
//             fontSize: 17,
//             fontWeight: 700,
//             color: P.textPrimary,
//             marginBottom: 4,
//             fontFamily:
//               "'Source Sans Pro', sans-serif",
//           }}
//         >
//           {lastUpdated
//             ? new Date(
//                 lastUpdated
//               ).toLocaleDateString()
//             : "--"}
//         </div>

//         <div
//           style={{
//             fontSize: 17,
//             fontWeight: 700,
//             color: P.textPrimary,
//             fontFamily:
//               "'Source Sans Pro', sans-serif",
//           }}
//         >
//           {lastUpdated
//             ? new Date(
//                 lastUpdated
//               ).toLocaleTimeString()
//             : "--"}
//         </div>
//       </div>
//     </div>
//   );
// }




// import React from "react";
// import P from "../theme/colors";
// import logo from "../assets/logo.png";

// export default function DeviceInfo({
//   data,
//   lastUpdated,
// }) {
//   // ─────────────────────────────────────────────
//   // IMEI
//   // Assumes IMEI is available as a direct key.
//   // Change "IMEI" below if your API uses another key.
//   // ─────────────────────────────────────────────
//   const imei = data?.IMEI ?? "--";

//   // ─────────────────────────────────────────────
//   // Rating
//   // ─────────────────────────────────────────────
//   const rating = data?.RAT ?? "--";

//   // ─────────────────────────────────────────────
//   // STATUS 3
//   //
//   // bit 0 = Inverter Relay
//   // bit 1 = Grid Relay
//   // bit 2 = Inverter Status
//   // bit 3 = Power Factor Status
//   // ─────────────────────────────────────────────
//   const status3 = Number(data?.ST3 ?? 0);

//   const inverterOn = Boolean(status3 & (1 << 2));

//   const statusText = inverterOn ? "ON" : "OFF";

//   const statusColor = inverterOn
//     ? P.green
//     : P.red;

//   // ─────────────────────────────────────────────
//   // LAST UPDATED
//   // ─────────────────────────────────────────────
//   const formattedDate = lastUpdated
//     ? new Date(lastUpdated).toLocaleDateString("en-GB", {
//         day: "numeric",
//         month: "short",
//         year: "numeric",
//       })
//     : "--";

//   const formattedTime = lastUpdated
//     ? new Date(lastUpdated).toLocaleTimeString("en-US", {
//         hour: "numeric",
//         minute: "2-digit",
//         hour12: true,
//       })
//     : "--";

//   return (
//     <div
//       style={{
//         background: P.surface,
//         borderRadius: 18,
//         padding: "18px 22px",
//         boxShadow: "0 4px 14px rgba(0,0,0,0.08)",
//         display: "flex",
//         justifyContent: "space-between",
//         alignItems: "center",
//         gap: 20,
//         margin: "10px 24px 0",
//       }}
//     >
//       {/* ─────────────────────────────────────────
//           LEFT SECTION — COMPANY LOGO
//       ───────────────────────────────────────── */}
//       <div
//         style={{
//           flex: "0 0 auto",
//           display: "flex",
//           alignItems: "center",
//           justifyContent: "center",
//         }}
//       >
//         {/* Replace this with your actual company logo */}
//         <img
//           src={logo}
//           alt="Company Logo"
//           style={{
//             width: 120,
//             maxWidth: "100%",
//             height: "auto",
//             objectFit: "contain",
//           }}
//         />
//       </div>

//       {/* ─────────────────────────────────────────
//           RIGHT SECTION — DEVICE DETAILS
//       ───────────────────────────────────────── */}
//       <div
//         style={{
//           flex: 1,
//           display: "flex",
//           flexDirection: "column",
//           alignItems: "flex-end",
//           gap: 8,
//         }}
//       >
//         {/* IMEI */}
//         <div
//           style={{
//             textAlign: "right",
//           }}
//         >
//           <div
//             style={{
//               fontSize: 11,
//               color: P.textMuted,
//               marginBottom: 2,
//               fontFamily: "'Source Sans Pro', sans-serif",
//             }}
//           >
//             IMEI
//           </div>

//           <div
//             style={{
//               fontSize: 16,
//               fontWeight: 700,
//               color: P.textPrimary,
//               fontFamily: "'Source Sans Pro', sans-serif",
//             }}
//           >
//             {imei}
//           </div>
//         </div>

//         {/* RATING */}
//         <div
//           style={{
//             textAlign: "right",
//           }}
//         >
//           <div
//             style={{
//               fontSize: 11,
//               color: P.textMuted,
//               marginBottom: 2,
//               fontFamily: "'Source Sans Pro', sans-serif",
//             }}
//           >
//             RATING
//           </div>

//           <div
//             style={{
//               fontSize: 16,
//               fontWeight: 700,
//               color: P.textPrimary,
//               fontFamily: "'Source Sans Pro', sans-serif",
//             }}
//           >
//             {rating} VA
//           </div>
//         </div>

//         {/* STATUS */}
//         <div
//           style={{
//             display: "flex",
//             alignItems: "center",
//             gap: 8,
//             padding: "4px 8px",
//             borderRadius: 10,
//             background: `${statusColor}22`,
//             border: `1px solid ${statusColor}`,
//           }}
//         >
//           <div
//             style={{
//               width: 10,
//               height: 10,
//               borderRadius: "50%",
//               background: statusColor,
//               boxShadow: `0 0 8px ${statusColor}88`,
//             }}
//           />

//           <span
//             style={{
//               fontSize: 13,
//               fontWeight: 700,
//               color: statusColor,
//               fontFamily: "'Source Sans Pro', sans-serif",
//             }}
//           >
//             {statusText}
//           </span>
//         </div>

//         {/* LAST UPDATED */}
//         <div
//           style={{
//             textAlign: "right",
//             marginTop: 2,
//           }}
//         >
//           <div
//             style={{
//               fontSize: 11,
//               color: P.textMuted,
//               marginBottom: 2,
//               fontFamily: "'Source Sans Pro', sans-serif",
//             }}
//           >
//             LAST UPDATED
//           </div>

//           <div
//             style={{
//               fontSize: 14,
//               fontWeight: 700,
//               color: P.textPrimary,
//               fontFamily: "'Source Sans Pro', sans-serif",
//             }}
//           >
//             {formattedDate}
//           </div>

//           <div
//             style={{
//               fontSize: 13,
//               fontWeight: 600,
//               color: P.textPrimary,
//               fontFamily: "'Source Sans Pro', sans-serif",
//             }}
//           >
//             {formattedTime}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
























/// varing card length


// import React from "react";
// import P from "../theme/colors";

// export default function DeviceInfo({
//   data,
//   lastUpdated,
// }) {
//   // ─────────────────────────────────────────────
//   // IMEI
//   // ─────────────────────────────────────────────
//   const imei = data?.IMEI ?? "--";

//   // ─────────────────────────────────────────────
//   // RATING
//   // ─────────────────────────────────────────────
//   const rating = data?.RAT ?? "--";

//   // ─────────────────────────────────────────────
//   // STATUS 3
//   // bit 2 = Inverter Status
//   // 1 = ON
//   // 0 = OFF
//   // ─────────────────────────────────────────────
//   const status3 = Number(data?.ST3 ?? 0);

//   const inverterOn = Boolean(status3 & (1 << 2));

//   const statusText = inverterOn ? "ON" : "OFF";

//   const statusColor = inverterOn
//     ? P.green
//     : P.red;

//   // ─────────────────────────────────────────────
//   // LAST UPDATED
//   // ─────────────────────────────────────────────
//   const formattedDate = lastUpdated
//     ? new Date(lastUpdated).toLocaleDateString("en-GB", {
//         day: "numeric",
//         month: "short",
//         year: "numeric",
//       })
//     : "--";

//   const formattedTime = lastUpdated
//     ? new Date(lastUpdated).toLocaleTimeString("en-US", {
//         hour: "numeric",
//         minute: "2-digit",
//         hour12: true,
//       })
//     : "--";

//   return (
//     <div
//       style={{
//         margin: "20px 20px 16px",
//         background: P.surface,
//         borderRadius: 16,
//         padding: "16px 18px",
//         border: `1px solid ${P.border}`,
//         boxShadow: P.shadowCard,

//         display: "flex",
//         justifyContent: "space-between",
//         alignItems: "flex-start",
//         gap: 24,
//       }}
//     >
//       {/* =====================================================
//           LEFT SECTION
//           IMEI + RATING
//       ===================================================== */}
//       <div
//         style={{
//           display: "flex",
//           flexDirection: "column",
//           gap: 14,
//           flex: 1,
//           minWidth: 0,
//         }}
//       >
//         {/* IMEI */}
//         <div>
//           <div
//             style={{
//               fontSize: 10,
//               color: P.textMuted,
//               fontWeight: 500,
//               letterSpacing: 0.8,
//               marginBottom: 3,
//               fontFamily: "'Inter', sans-serif",
//             }}
//           >
//             IMEI
//           </div>

//           <div
//             style={{
//               fontSize: 16,
//               fontWeight: 700,
//               color: P.textPrimary,
//               fontFamily: "'DM Sans', sans-serif",
//               wordBreak: "break-all",
//             }}
//           >
//             {imei}
//           </div>
//         </div>

//         {/* RATING */}
//         <div>
//           <div
//             style={{
//               fontSize: 10,
//               color: P.textMuted,
//               fontWeight: 500,
//               letterSpacing: 0.8,
//               marginBottom: 3,
//               fontFamily: "'Inter', sans-serif",
//             }}
//           >
//             RATING
//           </div>

//           <div
//             style={{
//               fontSize: 16,
//               fontWeight: 700,
//               color: P.textPrimary,
//               fontFamily: "'DM Sans', sans-serif",
//             }}
//           >
//             {rating}{" "}
//             <span
//               style={{
//                 fontSize: 12,
//                 fontWeight: 500,
//                 color: P.textMuted,
//               }}
//             >
//               VA
//             </span>
//           </div>
//         </div>
//       </div>

//       {/* =====================================================
//           RIGHT SECTION
//           LIVE STATUS + LAST UPDATED
//       ===================================================== */}
//       <div
//         style={{
//           display: "flex",
//           flexDirection: "column",
//           alignItems: "flex-end",
//           textAlign: "right",
//           flex: "0 0 auto",
//         }}
//       >
//         {/* LIVE STATUS */}
//         <div
//           style={{
//             display: "inline-flex",
//             alignItems: "center",
//             gap: 7,
//             padding: "5px 10px",
//             borderRadius: 20,
//             background: `${statusColor}18`,
//             border: `1px solid ${statusColor}`,
//             marginBottom: 14,
//           }}
//         >
//           <div
//             style={{
//               width: 8,
//               height: 8,
//               borderRadius: "50%",
//               background: statusColor,
//               boxShadow: `0 0 7px ${statusColor}`,
//             }}
//           />

//           <span
//             style={{
//               fontSize: 12,
//               fontWeight: 700,
//               color: statusColor,
//               fontFamily: "'DM Sans', sans-serif",
//             }}
//           >
//             {statusText}
//           </span>
//         </div>

//         {/* LAST UPDATED */}
//         <div>
//           <div
//             style={{
//               fontSize: 10,
//               color: P.textMuted,
//               fontWeight: 500,
//               letterSpacing: 0.8,
//               marginBottom: 4,
//               fontFamily: "'Inter', sans-serif",
//             }}
//           >
//             LAST UPDATED
//           </div>

//           <div
//             style={{
//               fontSize: 13,
//               fontWeight: 700,
//               color: P.textPrimary,
//               fontFamily: "'DM Sans', sans-serif",
//               lineHeight: 1.2,
//             }}
//           >
//             {formattedDate}
//           </div>

//           <div
//             style={{
//               fontSize: 12,
//               fontWeight: 600,
//               color: P.textPrimary,
//               marginTop: 3,
//               fontFamily: "'Inter', sans-serif",
//               lineHeight: 1.2,
//             }}
//           >
//             {formattedTime}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }






// import React from "react";
// import P from "../theme/colors";

// export default function DeviceInfo({
//     data,
//     lastUpdated,
// }) {
//     // ================= IMEI =================
//     const imei = data?.IMEI ?? "--";

//     // ================= RATING =================
//     const rating = data?.RAT ?? "--";

//     // ================= STATUS =================
//     // ST3 bit 2 = inverter status
//     // 1 = ON
//     // 0 = OFF
//     const status3 = Number(data?.ST3 ?? 0);
//     const inverterOn = Boolean(status3 & (1 << 2));

//     const statusText = inverterOn ? "ON" : "OFF";
//     const statusColor = inverterOn ? P.green : P.red;

//     // ================= LAST UPDATED =================
//     const formattedDate = lastUpdated
//         ? new Date(lastUpdated).toLocaleDateString("en-GB", {
//               day: "numeric",
//               month: "short",
//               year: "numeric",
//           })
//         : "--";

//     const formattedTime = lastUpdated
//         ? new Date(lastUpdated).toLocaleTimeString("en-US", {
//               hour: "numeric",
//               minute: "2-digit",
//               hour12: true,
//           })
//         : "--";

//     return (
//         <div
//             style={{
//                 width: "100%",
//                 maxWidth: 700,
//                 margin: "20px auto 16px",
//                 padding: "0 20px",
//                 boxSizing: "border-box",
//             }}
//         >
//             {/* ================= CARD ================= */}
//             <div
//                 style={{
//                     width: "100%",
//                     boxSizing: "border-box",

//                     background: P.surface,
//                     borderRadius: 16,
//                     padding: "16px 18px",

//                     border: `1px solid ${P.border}`,
//                     boxShadow: P.shadowCard,

//                     display: "grid",
//                     gridTemplateColumns:
//                         "minmax(0, 1fr) minmax(0, auto)",
//                     alignItems: "start",
//                     columnGap: 24,

//                     overflow: "hidden",
//                 }}
//             >
//                 {/* ================= LEFT ================= */}
//                 <div
//                     style={{
//                         minWidth: 0,
//                         display: "flex",
//                         flexDirection: "column",
//                         gap: 14,
//                     }}
//                 >
//                     {/* IMEI */}
//                     <div
//                         style={{
//                             minWidth: 0,
//                         }}
//                     >
//                         <div
//                             style={{
//                                 fontSize: 10,
//                                 color: P.textMuted,
//                                 fontWeight: 500,
//                                 letterSpacing: 0.8,
//                                 marginBottom: 3,
//                                 fontFamily:
//                                     "'Inter', sans-serif",
//                             }}
//                         >
//                             IMEI
//                         </div>

//                         <div
//                             style={{
//                                 fontSize: 16,
//                                 fontWeight: 700,
//                                 color: P.textPrimary,
//                                 fontFamily:
//                                     "'DM Sans', sans-serif",

//                                 minWidth: 0,
//                                 maxWidth: "100%",

//                                 overflowWrap: "anywhere",
//                                 wordBreak: "break-word",
//                             }}
//                         >
//                             {imei}
//                         </div>
//                     </div>

//                     {/* RATING */}
//                     <div
//                         style={{
//                             minWidth: 0,
//                         }}
//                     >
//                         <div
//                             style={{
//                                 fontSize: 10,
//                                 color: P.textMuted,
//                                 fontWeight: 500,
//                                 letterSpacing: 0.8,
//                                 marginBottom: 3,
//                                 fontFamily:
//                                     "'Inter', sans-serif",
//                             }}
//                         >
//                             RATING
//                         </div>

//                         <div
//                             style={{
//                                 fontSize: 16,
//                                 fontWeight: 700,
//                                 color: P.textPrimary,
//                                 fontFamily:
//                                     "'DM Sans', sans-serif",
//                             }}
//                         >
//                             {rating}{" "}
//                             <span
//                                 style={{
//                                     fontSize: 12,
//                                     fontWeight: 500,
//                                     color: P.textMuted,
//                                 }}
//                             >
//                                 VA
//                             </span>
//                         </div>
//                     </div>
//                 </div>

//                 {/* ================= RIGHT ================= */}
//                 <div
//                     style={{
//                         minWidth: 0,
//                         display: "flex",
//                         flexDirection: "column",
//                         alignItems: "flex-end",
//                         textAlign: "right",
//                     }}
//                 >
//                     {/* STATUS */}
//                     <div
//                         style={{
//                             display: "inline-flex",
//                             alignItems: "center",
//                             gap: 7,

//                             padding: "5px 10px",
//                             borderRadius: 20,

//                             background: `${statusColor}18`,
//                             border: `1px solid ${statusColor}`,

//                             marginBottom: 14,

//                             flexShrink: 0,
//                         }}
//                     >
//                         <div
//                             style={{
//                                 width: 8,
//                                 height: 8,
//                                 minWidth: 8,
//                                 borderRadius: "50%",
//                                 background: statusColor,
//                                 boxShadow: `0 0 7px ${statusColor}`,
//                             }}
//                         />

//                         <span
//                             style={{
//                                 fontSize: 12,
//                                 fontWeight: 700,
//                                 color: statusColor,
//                                 fontFamily:
//                                     "'DM Sans', sans-serif",
//                             }}
//                         >
//                             {statusText}
//                         </span>
//                     </div>

//                     {/* LAST UPDATED */}
//                     <div
//                         style={{
//                             minWidth: 0,
//                             maxWidth: "100%",
//                         }}
//                     >
//                         <div
//                             style={{
//                                 fontSize: 10,
//                                 color: P.textMuted,
//                                 fontWeight: 500,
//                                 letterSpacing: 0.8,
//                                 marginBottom: 4,
//                                 fontFamily:
//                                     "'Inter', sans-serif",
//                                 whiteSpace: "nowrap",
//                             }}
//                         >
//                             LAST UPDATED
//                         </div>

//                         <div
//                             style={{
//                                 fontSize: 13,
//                                 fontWeight: 700,
//                                 color: P.textPrimary,
//                                 fontFamily:
//                                     "'DM Sans', sans-serif",
//                                 lineHeight: 1.2,
//                                 whiteSpace: "nowrap",
//                             }}
//                         >
//                             {formattedDate}
//                         </div>

//                         <div
//                             style={{
//                                 fontSize: 13,
//                                 fontWeight: 600,
//                                 color: P.textPrimary,
//                                 marginTop: 3,
//                                 fontFamily:
//                                     "'Inter', sans-serif",
//                                 lineHeight: 1.2,
//                                 whiteSpace: "nowrap",
//                             }}
//                         >
//                             {formattedTime}
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// }


// changed imei to get it from background

// import React from "react";
// import P from "../theme/colors";

// export default function DeviceInfo({
//     data,
//     lastUpdated,
//     devices,
//     selectedDeviceId,
// }) {

//     // ================= SELECTED DEVICE =================

//     const selectedDevice =
//         devices?.find(
//             device =>
//                 device.id === selectedDeviceId
//         );

//     // ================= IMEI =================

//     const imei =
//         selectedDevice?.imei ?? "--";


//     // ================= RATING =================

//     const rating =
//         data?.RAT ?? "--";


//     // ================= STATUS =================

//     // ST3 bit 2 = inverter status
//     // 1 = ON
//     // 0 = OFF

//     const status3 =
//         Number(data?.ST3 ?? 0);

//     const inverterOn =
//         Boolean(status3 & (1 << 2));

//     const statusText =
//         inverterOn ? "ON" : "OFF";

//     const statusColor =
//         inverterOn ? P.green : P.red;


//     // ================= LAST UPDATED =================

//     const formattedDate =
//         lastUpdated
//             ? new Date(lastUpdated)
//                 .toLocaleDateString("en-GB", {
//                     day: "numeric",
//                     month: "short",
//                     year: "numeric",
//                 })
//             : "--";


//     const formattedTime =
//         lastUpdated
//             ? new Date(lastUpdated)
//                 .toLocaleTimeString("en-US", {
//                     hour: "numeric",
//                     minute: "2-digit",
//                     hour12: true,
//                 })
//             : "--";


//     return (
//         <div
//             style={{
//                 width: "100%",
//                 maxWidth: 700,
//                 margin: "20px auto 16px",
//                 padding: "0 20px",
//                 boxSizing: "border-box",
//             }}
//         >

//             <div
//                 style={{
//                     width: "100%",
//                     boxSizing: "border-box",

//                     background: P.surface,
//                     borderRadius: 16,
//                     padding: "16px 18px",

//                     border:
//                         `1px solid ${P.border}`,

//                     boxShadow:
//                         P.shadowCard,

//                     display: "grid",

//                     gridTemplateColumns:
//                         "minmax(0, 1fr) minmax(0, auto)",

//                     alignItems: "start",
//                     columnGap: 24,

//                     overflow: "hidden",
//                 }}
//             >

//                 {/* ================= LEFT ================= */}

//                 <div
//                     style={{
//                         minWidth: 0,
//                         display: "flex",
//                         flexDirection: "column",
//                         gap: 14,
//                     }}
//                 >

//                     {/* IMEI */}

//                     <div
//                         style={{
//                             minWidth: 0,
//                         }}
//                     >

//                         <div
//                             style={{
//                                 fontSize: 10,
//                                 color: P.textMuted,
//                                 fontWeight: 500,
//                                 letterSpacing: 0.8,
//                                 marginBottom: 3,
//                                 fontFamily:
//                                     "'Inter', sans-serif",
//                             }}
//                         >
//                             IMEI
//                         </div>

//                         <div
//                             style={{
//                                 fontSize: 16,
//                                 fontWeight: 700,
//                                 color: P.textPrimary,
//                                 fontFamily:
//                                     "'DM Sans', sans-serif",

//                                 minWidth: 0,
//                                 maxWidth: "100%",

//                                 overflowWrap:
//                                     "anywhere",

//                                 wordBreak:
//                                     "break-word",
//                             }}
//                         >
//                             {imei}
//                         </div>

//                     </div>


//                     {/* RATING */}

//                     <div
//                         style={{
//                             minWidth: 0,
//                         }}
//                     >

//                         <div
//                             style={{
//                                 fontSize: 10,
//                                 color: P.textMuted,
//                                 fontWeight: 500,
//                                 letterSpacing: 0.8,
//                                 marginBottom: 3,
//                                 fontFamily:
//                                     "'Inter', sans-serif",
//                             }}
//                         >
//                             RATING
//                         </div>

//                         <div
//                             style={{
//                                 fontSize: 16,
//                                 fontWeight: 700,
//                                 color: P.textPrimary,
//                                 fontFamily:
//                                     "'DM Sans', sans-serif",
//                             }}
//                         >
//                             {rating}{" "}

//                             <span
//                                 style={{
//                                     fontSize: 12,
//                                     fontWeight: 500,
//                                     color: P.textMuted,
//                                 }}
//                             >
//                                 VA
//                             </span>
//                         </div>

//                     </div>

//                 </div>


//                 {/* ================= RIGHT ================= */}

//                 <div
//                     style={{
//                         minWidth: 0,
//                         display: "flex",
//                         flexDirection: "column",
//                         alignItems: "flex-end",
//                         textAlign: "right",
//                     }}
//                 >

//                     {/* STATUS */}

//                     <div
//                         style={{
//                             display: "inline-flex",
//                             alignItems: "center",
//                             gap: 7,

//                             padding: "5px 10px",
//                             borderRadius: 20,

//                             background:
//                                 `${statusColor}18`,

//                             border:
//                                 `1px solid ${statusColor}`,

//                             marginBottom: 14,

//                             flexShrink: 0,
//                         }}
//                     >

//                         <div
//                             style={{
//                                 width: 8,
//                                 height: 8,
//                                 minWidth: 8,
//                                 borderRadius: "50%",

//                                 background:
//                                     statusColor,

//                                 boxShadow:
//                                     `0 0 7px ${statusColor}`,
//                             }}
//                         />

//                         <span
//                             style={{
//                                 fontSize: 12,
//                                 fontWeight: 700,
//                                 color: statusColor,
//                                 fontFamily:
//                                     "'DM Sans', sans-serif",
//                             }}
//                         >
//                             {statusText}
//                         </span>

//                     </div>


//                     {/* LAST UPDATED */}

//                     <div
//                         style={{
//                             minWidth: 0,
//                             maxWidth: "100%",
//                         }}
//                     >

//                         <div
//                             style={{
//                                 fontSize: 10,
//                                 color: P.textMuted,
//                                 fontWeight: 500,
//                                 letterSpacing: 0.8,
//                                 marginBottom: 4,
//                                 fontFamily:
//                                     "'Inter', sans-serif",
//                                 whiteSpace: "nowrap",
//                             }}
//                         >
//                             LAST UPDATED
//                         </div>

//                         <div
//                             style={{
//                                 fontSize: 13,
//                                 fontWeight: 700,
//                                 color: P.textPrimary,
//                                 fontFamily:
//                                     "'DM Sans', sans-serif",
//                                 lineHeight: 1.2,
//                                 whiteSpace: "nowrap",
//                             }}
//                         >
//                             {formattedDate}
//                         </div>

//                         <div
//                             style={{
//                                 fontSize: 13,
//                                 fontWeight: 600,
//                                 color: P.textPrimary,
//                                 marginTop: 3,
//                                 fontFamily:
//                                     "'Inter', sans-serif",
//                                 lineHeight: 1.2,
//                                 whiteSpace: "nowrap",
//                             }}
//                         >
//                             {formattedTime}
//                         </div>

//                     </div>

//                 </div>

//             </div>

//         </div>
//     );
// }




// fixed the status logic



import React, { useEffect, useState } from "react";
import P from "../theme/colors";

export default function DeviceInfo({
    data,
    lastUpdated,
    devices,
    selectedDeviceId,
}) {

    // =====================================================
    // FORCE RE-RENDER EVERY SECOND
    // =====================================================
    // This allows the 3-minute timeout to happen automatically
    // without requiring a page refresh or new server response.

    const [, setCurrentTime] =
        useState(Date.now());

    useEffect(() => {

        const timer =
            setInterval(() => {

                setCurrentTime(Date.now());

            }, 1000);

        return () =>
            clearInterval(timer);

    }, []);


    // =====================================================
    // SELECTED DEVICE
    // =====================================================

    const selectedDevice =
        devices?.find(
            device =>
                Number(device.id) ===
                Number(selectedDeviceId)
        );


    // =====================================================
    // IMEI
    // =====================================================

    const imei =
        selectedDevice?.imei ?? "--";


    // =====================================================
    // RATING
    // =====================================================

    const rating =
        data?.RAT ?? "--";


    // =====================================================
    // ST3 STATUS
    // =====================================================
    //
    // ST3 bit 2:
    //
    // 1 = inverter ON
    // 0 = inverter OFF
    //

    const status3 =
        Number(data?.ST3 ?? 0);

    const inverterOnFromST3 =
        Boolean(status3 & (1 << 2));


    // =====================================================
    // LAST UPDATED / DATA AGE
    // =====================================================

    const updatedAt =
        lastUpdated
            ? new Date(lastUpdated).getTime()
            : null;


    const dataAgeMs =
        updatedAt
            ? Date.now() - updatedAt
            : Infinity;


    // =====================================================
    // CONDITION 1
    // DATA OLDER THAN OR EQUAL TO 3 MINUTES
    // =====================================================

    const dataTimedOut =
        dataAgeMs >=
        3 * 60 * 1000;


    // =====================================================
    // CONDITION 2
    // STINTERVAL / 4 >= 1
    //
    // Equivalent to:
    //
    // STINTERVAL >= 4
    // =====================================================

    const stInterval =
        Number(data?.STINTERVAL ?? 0);


    const intervalTooHigh =
        stInterval / 4 >= 1;


    // =====================================================
    // FINAL STATUS
    // =====================================================
    //
    // OFF if:
    //
    // 1. Data is >= 3 minutes old
    // OR
    // 2. STINTERVAL / 4 >= 1
    // OR
    // 3. ST3 says OFF
    //
    // Therefore ALL conditions must be healthy
    // for the inverter to show ON.
    // =====================================================

    const inverterOn =
        !dataTimedOut &&
        !intervalTooHigh &&
        inverterOnFromST3;


    const statusText =
        inverterOn
            ? "ON"
            : "OFF";


    const statusColor =
        inverterOn
            ? P.green
            : P.red;


    // =====================================================
    // LAST UPDATED FORMATTING
    // =====================================================

    const formattedDate =
        lastUpdated
            ? new Date(lastUpdated)
                .toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                })
            : "--";


    const formattedTime =
        lastUpdated
            ? new Date(lastUpdated)
                .toLocaleTimeString("en-US", {
                    hour: "numeric",
                    minute: "2-digit",
                    hour12: true,
                })
            : "--";


    // =====================================================
    // UI
    // =====================================================

    return (
        <div
            style={{
                width: "100%",
                maxWidth: 700,
                margin: "20px auto 16px",
                padding: "0 20px",
                boxSizing: "border-box",
            }}
        >

            <div
                style={{
                    width: "100%",
                    boxSizing: "border-box",

                    background: P.surface,
                    borderRadius: 16,
                    padding: "16px 18px",

                    border:
                        `1px solid ${P.border}`,

                    boxShadow:
                        P.shadowCard,

                    display: "grid",

                    gridTemplateColumns:
                        "minmax(0, 1fr) minmax(0, auto)",

                    alignItems: "start",
                    columnGap: 24,

                    overflow: "hidden",
                }}
            >

                {/* =================================================
                    LEFT
                ================================================= */}

                <div
                    style={{
                        minWidth: 0,
                        display: "flex",
                        flexDirection: "column",
                        gap: 14,
                    }}
                >

                    {/* =================================================
                        IMEI
                    ================================================= */}

                    <div
                        style={{
                            minWidth: 0,
                        }}
                    >

                        <div
                            style={{
                                fontSize: 10,
                                color: P.textMuted,
                                fontWeight: 500,
                                letterSpacing: 0.8,
                                marginBottom: 3,
                                fontFamily:
                                    "'Inter', sans-serif",
                            }}
                        >
                            IMEI
                        </div>


                        <div
                            style={{
                                fontSize: 16,
                                fontWeight: 700,
                                color: P.textPrimary,
                                fontFamily:
                                    "'DM Sans', sans-serif",

                                minWidth: 0,
                                maxWidth: "100%",

                                overflowWrap:
                                    "anywhere",

                                wordBreak:
                                    "break-word",
                            }}
                        >
                            {imei}
                        </div>

                    </div>


                    {/* =================================================
                        RATING
                    ================================================= */}

                    <div
                        style={{
                            minWidth: 0,
                        }}
                    >

                        <div
                            style={{
                                fontSize: 10,
                                color: P.textMuted,
                                fontWeight: 500,
                                letterSpacing: 0.8,
                                marginBottom: 3,
                                fontFamily:
                                    "'Inter', sans-serif",
                            }}
                        >
                            RATING
                        </div>


                        <div
                            style={{
                                fontSize: 16,
                                fontWeight: 700,
                                color: P.textPrimary,
                                fontFamily:
                                    "'DM Sans', sans-serif",
                            }}
                        >

                            {rating}{" "}

                            <span
                                style={{
                                    fontSize: 12,
                                    fontWeight: 500,
                                    color: P.textMuted,
                                }}
                            >
                                VA
                            </span>

                        </div>

                    </div>

                </div>


                {/* =================================================
                    RIGHT
                ================================================= */}

                <div
                    style={{
                        minWidth: 0,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "flex-end",
                        textAlign: "right",
                    }}
                >

                    {/* =================================================
                        STATUS
                    ================================================= */}

                    <div
                        style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 7,

                            padding: "5px 10px",
                            borderRadius: 20,

                            background:
                                `${statusColor}18`,

                            border:
                                `1px solid ${statusColor}`,

                            marginBottom: 14,

                            flexShrink: 0,
                        }}
                    >

                        <div
                            style={{
                                width: 8,
                                height: 8,
                                minWidth: 8,
                                borderRadius: "50%",

                                background:
                                    statusColor,

                                boxShadow:
                                    `0 0 7px ${statusColor}`,
                            }}
                        />


                        <span
                            style={{
                                fontSize: 12,
                                fontWeight: 700,
                                color: statusColor,
                                fontFamily:
                                    "'DM Sans', sans-serif",
                            }}
                        >
                            {statusText}
                        </span>

                    </div>


                    {/* =================================================
                        LAST UPDATED
                    ================================================= */}

                    <div
                        style={{
                            minWidth: 0,
                            maxWidth: "100%",
                        }}
                    >

                        <div
                            style={{
                                fontSize: 10,
                                color: P.textMuted,
                                fontWeight: 500,
                                letterSpacing: 0.8,
                                marginBottom: 4,
                                fontFamily:
                                    "'Inter', sans-serif",
                                whiteSpace: "nowrap",
                            }}
                        >
                            LAST UPDATED
                        </div>


                        <div
                            style={{
                                fontSize: 13,
                                fontWeight: 700,
                                color: P.textPrimary,
                                fontFamily:
                                    "'DM Sans', sans-serif",
                                lineHeight: 1.2,
                                whiteSpace: "nowrap",
                            }}
                        >
                            {formattedDate}
                        </div>


                        <div
                            style={{
                                fontSize: 13,
                                fontWeight: 600,
                                color: P.textPrimary,
                                marginTop: 3,
                                fontFamily:
                                    "'Inter', sans-serif",
                                lineHeight: 1.2,
                                whiteSpace: "nowrap",
                            }}
                        >
                            {formattedTime}
                        </div>

                    </div>

                </div>

            </div>

        </div>
    );
}









// import React from "react";
// import P from "../theme/colors";
// import logo from "../assets/logo.png";

// export default function DeviceInfo({
//   data,
//   lastUpdated,
// }) {
//   // IMEI
//   const imei = data?.IMEI ?? "--";

//   // Rating
//   const rating = data?.RAT ?? "--";

//   // ─────────────────────────────────────────────
//   // STATUS 3
//   // bit 2 = Inverter Status
//   // 1 = ON
//   // 0 = OFF
//   // ─────────────────────────────────────────────
//   const status3 = Number(data?.ST3 ?? 0);

//   const inverterOn = Boolean(status3 & (1 << 2));

//   const statusText = inverterOn ? "ON" : "OFF";

//   const statusColor = inverterOn
//     ? P.green
//     : P.red;

//   // ─────────────────────────────────────────────
//   // LAST UPDATED
//   // ─────────────────────────────────────────────
//   const formattedDate = lastUpdated
//     ? new Date(lastUpdated).toLocaleDateString("en-GB", {
//         day: "numeric",
//         month: "short",
//         year: "numeric",
//       })
//     : "--";

//   const formattedTime = lastUpdated
//     ? new Date(lastUpdated).toLocaleTimeString("en-US", {
//         hour: "numeric",
//         minute: "2-digit",
//         hour12: true,
//       })
//     : "--";

//   return (
//     <div
//       style={{
//         // background: P.surface,
//         // borderRadius: 18,
//         // padding: "18px 22px",
//         // boxShadow: "0 4px 14px rgba(0,0,0,0.08)",
//         // display: "flex",
//         // justifyContent: "space-between",
//         // alignItems: "flex-start",
//         // gap: 20,
//         // margin: "10px 24px 0",
//         margin: "20px 20px 16px",
//         background: P.surface,
//         borderRadius: 16,
//         padding: "16px 18px",
//         border: `1px solid ${P.border}`,
//         boxShadow: P.shadowCard,
//       }}
//     >


//       {/* =====================================================
//           RIGHT SECTION
//           IMEI
//           RATING
//       ===================================================== */}
//       <div
//         style={{
//           flex: 1,
//           display: "flex",
//           flexDirection: "column",
//           alignItems: "flex-start",
//           gap: 12,
//           paddingTop: 4,
//         }}
//       >
//         {/* IMEI */}
//         <div
//           style={{
//             textAlign: "right",
//           }}
//         >
//           <div
//             style={{
//               fontSize: 11,
//               color: P.textMuted,
//               marginBottom: 2,
//               fontFamily: "'Source Sans Pro', sans-serif",
//             }}
//           >
//             IMEI
//           </div>

//           <div
//             style={{
//               fontSize: 16,
//               fontWeight: 700,
//               color: P.textPrimary,
//               fontFamily: "'Source Sans Pro', sans-serif",
//             }}
//           >
//             {imei}
//           </div>
//         </div>

//         {/* RATING */}
//         <div
//           style={{
//             textAlign: "right",
//           }}
//         >
//           <div
//             style={{
//               fontSize: 11,
//               color: P.textMuted,
//               marginBottom: 2,
//               fontFamily: "'Source Sans Pro', sans-serif",
//             }}
//           >
//             RATING
//           </div>

//           <div
//             style={{
//               fontSize: 16,
//               fontWeight: 700,
//               color: P.textPrimary,
//               fontFamily: "'Source Sans Pro', sans-serif",
//             }}
//           >
//             {rating} VA
//           </div>
//         </div>
//       </div>
//       {/* =====================================================
//           LEFT SECTION
//           LOGO
//           LIVE STATUS
//           LAST UPDATED
//       ===================================================== */}
//       <div
//         style={{
//           display: "flex",
//           flexDirection: "column",
//           alignItems: "flex-end",
//           flex: "0 0 auto",
//         }}
//       >
//         {/* COMPANY LOGO */}
//         {/* <div
//           style={{
//             display: "flex",
//             alignItems: "center",
//             justifyContent: "center",
//             marginBottom: 14,
//           }}
//         >
//           <img
//             src={logo}
//             alt="Company Logo"
//             style={{
//               width: 120,
//               height: "auto",
//               objectFit: "contain",
//             }}
//           />
//         </div> */}

//         {/* LIVE STATUS */}
//         <div
//           style={{
//             display: "flex",
//             alignItems: "center",
//             gap: 8,
//             padding: "5px 10px",
//             borderRadius: 20,
//             background: `${statusColor}18`,
//             border: `1px solid ${statusColor}`,
//             marginBottom: 10,
//           }}
//         >
//           <div
//             style={{
//               width: 9,
//               height: 9,
//               borderRadius: "50%",
//               background: statusColor,
//               boxShadow: `0 0 7px ${statusColor}`,
//             }}
//           />

//           <span
//             style={{
//               fontSize: 12,
//               fontWeight: 700,
//               color: statusColor,
//               fontFamily: "'Source Sans Pro', sans-serif",
//             }}
//           >
//             {statusText}
//           </span>
//         </div>

//         {/* LAST UPDATED */}
//         <div>
//           <div
//             style={{
//               fontSize: 10,
//               color: P.textMuted,
//               marginBottom: 3,
//               fontFamily: "'Source Sans Pro', sans-serif",
//             }}
//           >
//             LAST UPDATED
//           </div>

//           <div
//             style={{
//               fontSize: 13,
//               fontWeight: 700,
//               color: P.textPrimary,
//               fontFamily: "'Source Sans Pro', sans-serif",
//             }}
//           >
//             {formattedDate}
//           </div>

//           <div
//             style={{
//               fontSize: 12,
//               fontWeight: 600,
//               color: P.textPrimary,
//               marginTop: 2,
//               fontFamily: "'Source Sans Pro', sans-serif",
//             }}
//           >
//             {formattedTime}
//           </div>
//         </div>
//       </div>

      
//     </div>
//   );
// }

