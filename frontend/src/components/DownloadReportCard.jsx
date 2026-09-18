// import {
//     useState
// } from "react";

// import P from "../theme/colors";


// const API_BASE =
//     "http://localhost:3000";


// export default function DownloadReportCard({
//     selectedDeviceId,
//     imei
// }) {

//     const [startDate, setStartDate] =
//         useState("");

//     const [endDate, setEndDate] =
//         useState("");

//     const [loading, setLoading] =
//         useState(false);

//     const [error, setError] =
//         useState("");


//     // =====================================================
//     // DOWNLOAD
//     // =====================================================

//     const handleDownload =
//     async () => {

//         setError("");


//         if (!selectedDeviceId) {

//             setError(
//                 "No device selected."
//             );

//             return;
//         }


//         if (
//             !startDate ||
//             !endDate
//         ) {

//             setError(
//                 "Please select a start and end date."
//             );

//             return;
//         }


//         const start =
//             new Date(startDate);

//         const end =
//             new Date(endDate);


//         if (
//             Number.isNaN(
//                 start.getTime()
//             ) ||
//             Number.isNaN(
//                 end.getTime()
//             )
//         ) {

//             setError(
//                 "Invalid date or time."
//             );

//             return;
//         }


//         if (
//             start >= end
//         ) {

//             setError(
//                 "End date must be after start date."
//             );

//             return;
//         }


//         const token =
//             localStorage.getItem(
//                 "token"
//             );


//         if (!token) {

//             setError(
//                 "Please login again."
//             );

//             return;
//         }


//         try {

//             setLoading(true);


//             const query =
//                 new URLSearchParams({

//                     device_id:
//                         String(
//                             selectedDeviceId
//                         ),

//                     start:
//                         start.toISOString(),

//                     end:
//                         end.toISOString()
//                 });


//             const response =
//                 await fetch(
//                     `${API_BASE}/api/reports/inverter-data?${query.toString()}`,
//                     {
//                         method:
//                             "GET",

//                         headers: {
//                             Authorization:
//                                 `Bearer ${token}`
//                         }
//                     }
//                 );


//             if (!response.ok) {

//                 let message =
//                     "Failed to generate report";


//                 try {

//                     const result =
//                         await response.json();

//                     message =
//                         result.error ||
//                         result.message ||
//                         message;

//                 } catch {
//                     // fallback
//                 }


//                 throw new Error(
//                     message
//                 );
//             }

//             const contentType =
//     response.headers.get("content-type") || "";

// if (
//     !contentType.includes("text/csv") &&
//     !contentType.includes("application/csv")
// ) {

//     const text =
//         await response.text();

//     console.error(
//         "Expected CSV but server returned:",
//         contentType,
//         text
//     );

//     throw new Error(
//         "Server did not return a CSV file."
//     );
// }


//             // =================================================
//             // DOWNLOAD CSV
//             // =================================================

//             const blob =
//                 await response.blob();


//             const url =
//                 window.URL
//                     .createObjectURL(
//                         blob
//                     );


//             const link =
//                 document.createElement(
//                     "a"
//                 );


//             link.href =
//                 url;


//             link.download =
//                 `inverter-data-${imei || selectedDeviceId}.csv`;


//             document.body
//                 .appendChild(
//                     link
//                 );


//             link.click();


//             link.remove();


//             window.URL
//                 .revokeObjectURL(
//                     url
//                 );


//         } catch (err) {

//             console.error(
//                 "REPORT DOWNLOAD ERROR:",
//                 err
//             );


//             setError(
//                 err.message ||
//                 "Unable to download report"
//             );

//         } finally {

//             setLoading(false);
//         }
//     };


//     const fieldStyle = {

//         width: "100%",

//         padding:
//             "13px 14px",

//         boxSizing:
//             "border-box",

//         border:
//             `1px solid ${P.border}`,

//         borderRadius: 10,

//         background:
//             P.surfaceForm,

//         color:
//             P.textPrimary,

//         fontSize: 14,

//         fontFamily:
//             "'Inter', sans-serif",

//         outline:
//             "none"
//     };


//     const labelStyle = {

//         display:
//             "block",

//         fontSize:
//             10,

//         fontWeight:
//             700,

//         letterSpacing:
//             0.6,

//         color:
//             P.textMuted,

//         marginBottom:
//             6,

//         fontFamily:
//             "'Inter', sans-serif"
//     };


//     return (

//         <div
//             style={{
//                 background:
//                     P.surface,

//                 border:
//                     `1px solid ${P.border}`,

//                 borderRadius:
//                     14,

//                 padding:
//                     "18px 16px",

//                 boxShadow:
//                     P.shadowCardRaised
//             }}
//         >

//             <div
//                 style={{
//                     fontSize:
//                         18,

//                     fontWeight:
//                         800,

//                     color:
//                         P.textPrimary,

//                     fontFamily:
//                         "'DM Sans', sans-serif",

//                     marginBottom:
//                         4
//                 }}
//             >
//                 Download Reports
//             </div>


//             <div
//                 style={{
//                     fontSize:
//                         11,

//                     color:
//                         P.textMuted,

//                     marginBottom:
//                         18
//                 }}
//             >
//                 One report row will be generated
//                 from the latest reading available
//                 for each day.
//             </div>


//             {/* REPORT TYPE */}

//             <div
//                 style={{
//                     marginBottom:
//                         14
//                 }}
//             >

//                 <label
//                     style={
//                         labelStyle
//                     }
//                 >
//                     REPORT TYPE
//                 </label>


//                 <select
//                     style={
//                         fieldStyle
//                     }

//                     value="inverter-data"

//                     disabled
//                 >
//                     <option>
//                         Inverter Data
//                     </option>
//                 </select>

//             </div>


//             {/* START */}

//             <div
//                 style={{
//                     marginBottom:
//                         14
//                 }}
//             >

//                 <label
//                     style={
//                         labelStyle
//                     }
//                 >
//                     START DATE & TIME
//                 </label>


//                 <input
//                     type=
//                         "datetime-local"

//                     value={
//                         startDate
//                     }

//                     onChange={
//                         e =>
//                             setStartDate(
//                                 e.target.value
//                             )
//                     }

//                     style={
//                         fieldStyle
//                     }
//                 />

//             </div>


//             {/* END */}

//             <div
//                 style={{
//                     marginBottom:
//                         18
//                 }}
//             >

//                 <label
//                     style={
//                         labelStyle
//                     }
//                 >
//                     END DATE & TIME
//                 </label>


//                 <input
//                     type=
//                         "datetime-local"

//                     value={
//                         endDate
//                     }

//                     onChange={
//                         e =>
//                             setEndDate(
//                                 e.target.value
//                             )
//                     }

//                     style={
//                         fieldStyle
//                     }
//                 />

//             </div>


//             {/* SAMPLING INFO */}

//             <div
//                 style={{
//                     padding:
//                         "10px 12px",

//                     borderRadius:
//                         10,

//                     background:
//                         P.surfaceForm,

//                     marginBottom:
//                         18,

//                     fontSize:
//                         11,

//                     color:
//                         P.textMuted,

//                     lineHeight:
//                         1.5
//                 }}
//             >
//                 Sampling:{" "}

//                 <strong
//                     style={{
//                         color:
//                             P.textPrimary
//                     }}
//                 >
//                     latest reading per day
//                 </strong>
//             </div>


//             {/* ERROR */}

//             {error && (

//                 <div
//                     style={{
//                         padding:
//                             "10px 12px",

//                         marginBottom:
//                             14,

//                         borderRadius:
//                             10,

//                         background:
//                             P.surfaceRed,

//                         border:
//                             `1px solid ${P.red}`,

//                         color:
//                             P.red,

//                         fontSize:
//                             12
//                     }}
//                 >
//                     {error}
//                 </div>

//             )}


//             {/* DOWNLOAD */}

//             <button
//                 type="button"

//                 onClick={
//                     handleDownload
//                 }

//                 disabled={
//                     loading
//                 }

//                 style={{
//                     width:
//                         "100%",

//                     padding:
//                         "13px 16px",

//                     border:
//                         "none",

//                     borderRadius:
//                         10,

//                     background:
//                         P.btnPrimary,

//                     color:
//                         P.textWhite,

//                     fontSize:
//                         14,

//                     fontWeight:
//                         700,

//                     fontFamily:
//                         "'DM Sans', sans-serif",

//                     cursor:
//                         loading
//                             ? "not-allowed"
//                             : "pointer",

//                     opacity:
//                         loading
//                             ? 0.65
//                             : 1,

//                     display:
//                         "flex",

//                     alignItems:
//                         "center",

//                     justifyContent:
//                         "center",

//                     gap:
//                         8
//                 }}
//             >

//                 <svg
//                     width="18"
//                     height="18"
//                     viewBox="0 0 24 24"
//                     fill="none"
//                     stroke=
//                         "currentColor"
//                     strokeWidth="2"
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                 >
//                     <path
//                         d="M12 3v12"
//                     />

//                     <polyline
//                         points=
//                             "7 10 12 15 17 10"
//                     />

//                     <path
//                         d="M5 21h14"
//                     />
//                 </svg>


//                 {loading
//                     ? "Preparing Report..."
//                     : "Download Report"}

//             </button>

//         </div>
//     );
// }























// final uploaded on vps



// import { useState } from "react";
// import P from "../theme/colors";

// const API_BASE = "http://localhost:3000";
// // VPSCHANGE

// export default function DownloadReportCard({
//     selectedDeviceId,
//     imei
// }) {

//     // =====================================================
//     // STATE
//     // =====================================================

//     // Empty by default.
//     // User MUST choose report type.
//     const [reportType, setReportType] =
//         useState("");

//     const [startDate, setStartDate] =
//         useState("");

//     const [endDate, setEndDate] =
//         useState("");

//     const [loading, setLoading] =
//         useState(false);

//     const [error, setError] =
//         useState("");


//     // =====================================================
//     // VALIDATION
//     // =====================================================
//     const needsCustomDateRange =
//         reportType === "inverter-data" ||
//         reportType === "event-fault-log";

//     const isGenerationReport =
//         reportType === "generation-7-days" ||
//         reportType === "generation-1-month" ||
//         reportType === "generation-3-months";


//     // const canDownload =
//     //     Boolean(
//     //         selectedDeviceId &&
//     //         reportType &&
//     //         startDate &&
//     //         endDate &&
//     //         !loading
//     //     );


//  const canDownload =
//     Boolean(
//         selectedDeviceId &&
//         reportType &&
//         !loading &&
//         (
//             isGenerationReport ||
//             (
//                 needsCustomDateRange &&
//                 startDate &&
//                 endDate
//             )
//         )
//     );




//     const formatFilenameDate = (dateValue) => {

//         const date =
//             new Date(dateValue);

//         const year =
//             date.getFullYear();

//         const month =
//             String(
//                 date.getMonth() + 1
//             ).padStart(2, "0");

//         const day =
//             String(
//                 date.getDate()
//             ).padStart(2, "0");

//         return `${year}-${month}-${day}`;
//     };


//     const getAutomaticReportDates = (
//     type
// ) => {

//     const end =
//         new Date();

//     const start =
//         new Date(end);


//     if (
//         type ===
//         "generation-7-days"
//     ) {

//         start.setDate(
//             start.getDate() - 7
//         );

//     } else if (
//         type ===
//         "generation-1-month"
//     ) {

//         start.setMonth(
//             start.getMonth() - 1
//         );

//     } else if (
//         type ===
//         "generation-3-months"
//     ) {

//         start.setMonth(
//             start.getMonth() - 3
//         );
//     }


//     return {

//         fromDate:
//             formatFilenameDate(
//                 start
//             ),

//         toDate:
//             formatFilenameDate(
//                 end
//             )
//     };
// };

//     // =====================================================
//     // DOWNLOAD REPORT
//     // =====================================================
// const handleDownload = async () => {

//     if (!canDownload) {
//         return;
//     }

//     setError("");


//     // =====================================================
//     // DEVICE
//     // =====================================================

//     if (!selectedDeviceId) {

//         setError(
//             "No device selected."
//         );

//         return;
//     }


//     // =====================================================
//     // REPORT TYPE
//     // =====================================================

//     if (!reportType) {

//         setError(
//             "Please select a report type."
//         );

//         return;
//     }


//     // =====================================================
//     // DATE RANGE
//     //
//     // Only inverter-data and event-fault-log
//     // need user-selected dates.
//     // =====================================================

//     let start = null;
//     let end = null;


//     if (needsCustomDateRange) {

//         if (!startDate || !endDate) {

//             setError(
//                 "Please select both start and end date/time."
//             );

//             return;
//         }


//         start =
//             new Date(startDate);

//         end =
//             new Date(endDate);


//         if (
//             Number.isNaN(start.getTime()) ||
//             Number.isNaN(end.getTime())
//         ) {

//             setError(
//                 "Please enter a valid date and time."
//             );

//             return;
//         }


//         if (start >= end) {

//             setError(
//                 "End date/time must be after start date/time."
//             );

//             return;
//         }
//     }


//     // =====================================================
//     // No login anymore — the report is fetched by IMEI.
//     // =====================================================


//     try {

//         setLoading(true);


//         // =================================================
//         // BUILD QUERY
//         // =================================================

//         const query =
//             new URLSearchParams({
//                 imei:
//                     String(
//                         selectedDeviceId
//                     ),

//                 report_type:
//                     reportType
//             });


//         // Only add start/end for reports
//         // that actually use custom dates.

//         if (needsCustomDateRange) {

//             query.set(
//                 "start",
//                 start.toISOString()
//             );

//             query.set(
//                 "end",
//                 end.toISOString()
//             );
//         }


//         // =================================================
//         // REQUEST
//         // =================================================

//         const response =
//             await fetch(
//                 `/api/reports/download?${query.toString()}`,

//                 {
//                     method: "GET",
//                 }
//             );


//         // =================================================
//         // ERROR RESPONSE
//         // =================================================

//         if (!response.ok) {

//             let message =
//                 "Failed to generate report.";


//             const contentType =
//                 response.headers.get(
//                     "content-type"
//                 ) || "";


//             try {

//                 if (
//                     contentType.includes(
//                         "application/json"
//                     )
//                 ) {

//                     const result =
//                         await response.json();

//                     message =
//                         result?.error ||
//                         result?.message ||
//                         message;

//                 } else {

//                     const text =
//                         await response.text();

//                     if (
//                         text &&
//                         !text
//                             .trim()
//                             .toLowerCase()
//                             .startsWith(
//                                 "<!doctype"
//                             )
//                     ) {
//                         message = text;
//                     }
//                 }

//             } catch {
//                 // Keep fallback
//             }


//             throw new Error(
//                 message
//             );
//         }


//         // =================================================
//         // VERIFY CSV
//         // =================================================

//         const contentType =
//             response.headers.get(
//                 "content-type"
//             ) || "";


//         if (
//             !contentType.includes(
//                 "text/csv"
//             )
//         ) {

//             const responseText =
//                 await response.text();

//             console.error(
//                 "Expected CSV but received:",
//                 {
//                     contentType,
//                     responseText
//                 }
//             );

//             throw new Error(
//                 "The server did not return a valid CSV report."
//             );
//         }


//         // =================================================
//         // FILE NAME
//         // =================================================

//         let filename;
//         const safeImei =
//     imei || String(selectedDeviceId);


//         if (needsCustomDateRange) {

//             const fromDate =
//                 formatFilenameDate(
//                     start
//                 );

//             const toDate =
//                 formatFilenameDate(
//                     end
//                 );



//             filename =
//                 `${safeImei}_${reportType}_${fromDate}_to_${toDate}.csv`;

//         } else {

//             // Generation report dates are automatically
//             // determined by report type.

//             const {
//                 fromDate,
//                 toDate
//             } =
//                 getAutomaticReportDates(
//                     reportType
//                 );


//             filename =
//                 `${safeImei}_${reportType}_${fromDate}_to_${toDate}.csv`;
//         }


//         // =================================================
//         // DOWNLOAD
//         // =================================================

//         // const blob =
//         //     await response.blob();


//         // const fileUrl =
//         //     window.URL.createObjectURL(
//         //         blob
//         //     );


//         // const link =
//         //     document.createElement(
//         //         "a"
//         //     );


//         // link.href =
//         //     fileUrl;

//         // link.download =
//         //     filename;


//         // document.body.appendChild(
//         //     link
//         // );

//         // link.click();

//         // link.remove();


//         // window.URL.revokeObjectURL(
//         //     fileUrl
//         // );

//         // =================================================
// // DOWNLOAD
// // =================================================

// const blob = await response.blob();

// const reader = new FileReader();

// reader.onloadend = () => {

//     const base64Data =
//         reader.result.split(",")[1];

//     // If running inside Android WebView
//     if (window.Android?.downloadFile) {

//         window.Android.downloadFile(
//             base64Data,
//             filename,
//             "text/csv"
//         );

//         return;
//     }

//     // Normal browser fallback
//     const fileUrl =
//         window.URL.createObjectURL(blob);

//     const link =
//         document.createElement("a");

//     link.href = fileUrl;
//     link.download = filename;

//     document.body.appendChild(link);

//     link.click();

//     link.remove();

//     window.URL.revokeObjectURL(fileUrl);
// };

// reader.readAsDataURL(blob);

//     } catch (err) {

//         console.error(
//             "REPORT DOWNLOAD ERROR:",
//             err
//         );


//         setError(
//             err?.message ||
//             "Unable to download report."
//         );

//     } finally {

//         setLoading(false);
//     }
// };


//     // const handleDownload =
//     //     async () => {

//     //         if (!canDownload) {
//     //             return;
//     //         }

//     //         setError("");


//     //         // -------------------------------------------------
//     //         // VALIDATE DEVICE
//     //         // -------------------------------------------------

//     //         if (!selectedDeviceId) {

//     //             setError(
//     //                 "No device selected."
//     //             );

//     //             return;
//     //         }


//     //         // -------------------------------------------------
//     //         // VALIDATE REPORT TYPE
//     //         // -------------------------------------------------

//     //         if (!reportType) {

//     //             setError(
//     //                 "Please select a report type."
//     //             );

//     //             return;
//     //         }


//     //         // -------------------------------------------------
//     //         // VALIDATE DATE/TIME
//     //         // -------------------------------------------------

//     //         if (!startDate || !endDate) {

//     //             setError(
//     //                 "Please select both start and end date/time."
//     //             );

//     //             return;
//     //         }


//     //         const start =
//     //             new Date(startDate);

//     //         const end =
//     //             new Date(endDate);


//     //         if (
//     //             Number.isNaN(start.getTime()) ||
//     //             Number.isNaN(end.getTime())
//     //         ) {

//     //             setError(
//     //                 "Please enter a valid date and time."
//     //             );

//     //             return;
//     //         }


//     //         if (start >= end) {

//     //             setError(
//     //                 "End date/time must be after start date/time."
//     //             );

//     //             return;
//     //         }



//     //         // -------------------------------------------------
//     //         // AUTH
//     //         // -------------------------------------------------

//     //         const token =
//     //             localStorage.getItem(
//     //                 "token"
//     //             );


//     //         if (!token) {

//     //             setError(
//     //                 "Your login session has expired. Please login again."
//     //             );

//     //             return;
//     //         }


//     //         try {

//     //             setLoading(true);


//     //             // =================================================
//     //             // QUERY
//     //             // =================================================

//     //             const query =
//     //                 new URLSearchParams({

//     //                     device_id:
//     //                         String(
//     //                             selectedDeviceId
//     //                         ),

//     //                     report_type:
//     //                         reportType,

//     //                     start:
//     //                         start.toISOString(),

//     //                     end:
//     //                         end.toISOString()
//     //                 });


//     //             // =================================================
//     //             // REQUEST
//     //             // =================================================

//     //             const response =
//     //                 await fetch(
//     //                     `${API_BASE}/api/reports/download?${query.toString()}`,
//     //                     {
//     //                         method: "GET",

//     //                         headers: {
//     //                             Authorization:
//     //                                 `Bearer ${token}`
//     //                         }
//     //                     }
//     //                 );


//     //             // =================================================
//     //             // ERROR RESPONSE
//     //             // =================================================

//     //             if (!response.ok) {

//     //                 let message =
//     //                     "Failed to generate report.";


//     //                 const contentType =
//     //                     response.headers.get(
//     //                         "content-type"
//     //                     ) || "";


//     //                 try {

//     //                     if (
//     //                         contentType.includes(
//     //                             "application/json"
//     //                         )
//     //                     ) {

//     //                         const result =
//     //                             await response.json();

//     //                         message =
//     //                             result?.error ||
//     //                             result?.message ||
//     //                             message;

//     //                     } else {

//     //                         const text =
//     //                             await response.text();

//     //                         if (
//     //                             text &&
//     //                             !text
//     //                                 .trim()
//     //                                 .startsWith(
//     //                                     "<!DOCTYPE"
//     //                                 ) &&
//     //                             !text
//     //                                 .trim()
//     //                                 .startsWith(
//     //                                     "<!doctype"
//     //                                 )
//     //                         ) {

//     //                             message =
//     //                                 text;
//     //                         }
//     //                     }

//     //                 } catch {
//     //                     // Keep fallback message
//     //                 }


//     //                 throw new Error(
//     //                     message
//     //                 );
//     //             }


//     //             // =================================================
//     //             // VERIFY CSV
//     //             // =================================================

//     //             const contentType =
//     //                 response.headers.get(
//     //                     "content-type"
//     //                 ) || "";


//     //             if (
//     //                 !contentType.includes(
//     //                     "text/csv"
//     //                 )
//     //             ) {

//     //                 const responseText =
//     //                     await response.text();


//     //                 console.error(
//     //                     "Expected CSV but received:",
//     //                     {
//     //                         contentType,
//     //                         responseText
//     //                     }
//     //                 );


//     //                 throw new Error(
//     //                     "The server did not return a valid CSV report."
//     //                 );
//     //             }


//     //             // =================================================
//     //             // GET FILE NAME FROM BACKEND
//     //             // =================================================

//     //             // const disposition =
//     //             //     response.headers.get(
//     //             //         "content-disposition"
//     //             //     );


//     //             // let filename =
//     //             //     `${reportType}_${imei || selectedDeviceId}.csv`;


//     //             // if (disposition) {

//     //             //     const match =
//     //             //         disposition.match(
//     //             //             /filename="?([^"]+)"?/i
//     //             //         );


//     //             //     if (
//     //             //         match &&
//     //             //         match[1]
//     //             //     ) {

//     //             //         filename =
//     //             //             match[1];
//     //             //     }
//     //             // }


//     //             const fromDate =
//     //                 formatFilenameDate(start);

//     //             const toDate =
//     //                 formatFilenameDate(end);

//     //             const filename =
//     //                 `${imei}_${reportType}_${fromDate}T${toDate}.csv`;



//     //             // =================================================
//     //             // DOWNLOAD
//     //             // =================================================

//     //             const blob =
//     //                 await response.blob();


//     //             const fileUrl =
//     //                 window.URL.createObjectURL(
//     //                     blob
//     //                 );


//     //             const link =
//     //                 document.createElement(
//     //                     "a"
//     //                 );


//     //             link.href =
//     //                 fileUrl;

//     //             link.download =
//     //                 filename;


//     //             document.body.appendChild(
//     //                 link
//     //             );


//     //             link.click();


//     //             link.remove();


//     //             window.URL.revokeObjectURL(
//     //                 fileUrl
//     //             );


//     //         } catch (err) {

//     //             console.error(
//     //                 "REPORT DOWNLOAD ERROR:",
//     //                 err
//     //             );


//     //             setError(
//     //                 err?.message ||
//     //                 "Unable to download report."
//     //             );

//     //         } finally {

//     //             setLoading(false);
//     //         }
//     //     };


//     // =====================================================
//     // STYLES
//     // =====================================================
// const fieldStyle = {
//     display: "block",

//     width: "100%",
//     maxWidth: "100%",
//     minWidth: 0,

//     height: 52,

//     padding: "0 14px",

//     boxSizing: "border-box",

//     border:
//         "1px solid rgba(255,255,255,0.75)",

//     borderRadius: 6,

//     background:
//         "rgba(0,0,0,0.16)",

//     color: "#ffffff",

//     fontSize: 14,

//     fontWeight: 500,

//     fontFamily:
//         "'Inter', sans-serif",

//     outline: "none",

//     WebkitAppearance: "none",
//     appearance: "none"
// };
//     // const fieldStyle = {

//     //     display: "block",

//     //     width: "100%",

//     //     maxWidth: "100%",

//     //     minWidth: 0,

//     //     height: 48,

//     //     padding:
//     //         "0 13px",

//     //     boxSizing:
//     //         "border-box",

//     //     border:
//     //         "1px solid rgba(255,255,255,0.12)",

//     //     borderRadius:
//     //         10,

//     //     background:
//     //         "#ffffff",

//     //     color:
//     //         "#rgba(255,255,255,0.06)",

//     //     fontSize:
//     //         13,

//     //     fontFamily:
//     //         "'Inter', sans-serif",

//     //     outline:
//     //         "none",

//     //     WebkitAppearance:
//     //         "none",

//     //     appearance:
//     //         "none"
//     // };


//     const dateFieldStyle = {

//         ...fieldStyle,

//         // Native date/time input needs
//         // slightly less horizontal padding
//         // on small Android browsers.

//         padding:
//             "0 10px",

//         WebkitAppearance:
//             "auto",

//         appearance:
//             "auto"
//     };
// const labelStyle = {
//     display: "block",

//     marginBottom: 7,

//     fontSize: 11,

//     fontWeight: 600,

//     letterSpacing: 0.3,

//     color:
//         "rgba(255,255,255,0.82)",

//     fontFamily:
//         "'Inter', sans-serif"
// };

//     // const labelStyle = {

//     //     display:
//     //         "block",

//     //     marginBottom:
//     //         6,

//     //     fontSize:
//     //         10,

//     //     fontWeight:
//     //         700,

//     //     letterSpacing:
//     //         0.6,

//     //     color:
//     //         "rgba(255,255,255,0.6)",

//     //     fontFamily:
//     //         "'Inter', sans-serif"
//     // };


//     // =====================================================
//     // UI
//     // =====================================================

//     return (

//         <div
//             style={{
//                 width:
//                     "100%",

//                 maxWidth:
//                     "100%",

//                 minWidth:
//                     0,

//                 boxSizing:
//                     "border-box",

//                 background:
//                     "rgba(22, 38, 45, 0.88)",

//                 border:
//                     "1px solid rgba(255,255,255,0.08)",

//                 borderRadius:
//                     14,

//                          padding: "18px 16px 20px",
//                 // padding: "16px",

//                 boxShadow:
//                     P.shadowCardRaised,

//                 overflow:
//                     "hidden"
//             }}
//         >

//             {/* =================================================
//                 TITLE
//             ================================================= */}
// <div
//     style={{
//         fontSize: 20,

//         fontWeight: 500,

//         color: "#ffffff",

//         fontFamily:
//             "'DM Sans', sans-serif",

//         marginBottom: 18
//     }}
// >
//     Download Reports
// </div>

            


//             {/* =================================================
//                 REPORT TYPE
//             ================================================= */}

//             <div
//                 style={{
//                     width:
//                         "100%",

//                     minWidth:
//                         0,

//                     marginBottom:
//                         14
//                 }}
//             >

                


//                 <div
//                     style={{
//                         position:
//                             "relative",

//                         width:
//                             "100%",

//                         minWidth:
//                             0
//                     }}
//                 >

//                     {/* <select
//                         value={
//                             reportType
//                         }

//                         onChange={(e) => {

//                             setReportType(
//                                 e.target.value
//                             );

//                             setError("");

//                         }}

//                         style={{
//                             ...fieldStyle,

//                             paddingRight:
//                                 38
//                         }}
//                     >

//                         <option
//                             value=""
//                             disabled
//                         >
//                             Select Report Type
//                         </option>


//                         <option
//                             value="inverter-data"
//                         >
//                             Inverter Data
//                         </option>


//                         <option
//                             value="event-fault-log"
//                         >
//                             Event / Fault Log
//                         </option>

//                     </select> */}


//                     <select
//                         value={reportType}
//                         // onChange={(e) => {
//                         //     setReportType(e.target.value);
//                         //     setError("");

//                         //     // Clear old manual dates when switching
//                         //     // to an automatic generation report.
//                         //     if (
//                         //         e.target.value === "generation-7-days" ||
//                         //         e.target.value === "generation-1-month" ||
//                         //         e.target.value === "generation-3-months"
//                         //     ) 
//                         //     {
//                         //         setStartDate("");
//                         //         setEndDate("");
//                         //     }
//                         // }}


//                         onChange={(e) => {

//     const newType =
//         e.target.value;

//     setReportType(
//         newType
//     );

//     setError("");


//     const automatic =
//         newType.startsWith(
//             "generation-"
//         );


//     if (automatic) {

//         setStartDate("");
//         setEndDate("");
//     }
// }}
//                     style={{
//         ...fieldStyle,
//         paddingRight: 42,
//         color: "#ffffff"
//     }}
//                     >
//                         <option
//                             value=""
//                             disabled
//                         >
//                             Select Report Type
//                         </option>

//                         <option value="inverter-data">
//                             Inverter Data
//                         </option>

//                         <option value="event-fault-log">
//                             Event Fault Log
//                         </option>

//                         <option value="generation-7-days">
//                             Daily Generation  (Last 7 Days)
//                         </option>

//                         <option value="generation-1-month">
//                             Daily Generation  (Last 1 Month)
//                         </option>

//                         <option value="generation-3-months">
//                             Daily Generation (Last 3 Months)
//                         </option>
//                     </select>

//                     {/* Dropdown arrow */}
// <div
//     style={{
//         position: "absolute",

//         right: 14,
//         top: "50%",

//         transform:
//             "translateY(-50%)",

//         pointerEvents:
//             "none",

//         color:
//             "rgba(255,255,255,0.9)",

//         fontSize: 12
//     }}
// >
//     ▼
// </div>

//                 </div>

//             </div>


//             {/* =================================================
//                 START DATE/TIME
//             ================================================= */}



//             {needsCustomDateRange && (
//                 <>
//                     <div
//                         style={{
//                             width: "100%",
//                             minWidth: 0,
//                             marginBottom: 14
//                         }}
//                     >
//                         <label style={labelStyle}>
//                             START DATE & TIME
//                         </label>

//                         <input
//                             type="datetime-local"
//                             value={startDate}
//                             onChange={(e) => {
//                                 setStartDate(
//                                     e.target.value
//                                 );
//                                 setError("");
//                             }}
//                             style={dateFieldStyle}
//                         />
//                     </div>

//                     <div
//                         style={{
//                             width: "100%",
//                             minWidth: 0,
//                             marginBottom: 16
//                         }}
//                     >
//                         <label style={labelStyle}>
//                             END DATE & TIME
//                         </label>

//                         <input
//                             type="datetime-local"
//                             value={endDate}
//                             onChange={(e) => {
//                                 setEndDate(
//                                     e.target.value
//                                 );
//                                 setError("");
//                             }}
//                             style={dateFieldStyle}
//                         />
//                     </div>
//                 </>
//             )}
//             {/* 
//             <div
//                 style={{
//                     width:
//                         "100%",

//                     minWidth:
//                         0,

//                     marginBottom:
//                         14
//                 }}
//             >

//                 <label
//                     style={
//                         labelStyle
//                     }
//                 >
//                     START DATE & TIME
//                 </label>


//                 <input
//                     type="datetime-local"

//                     value={
//                         startDate
//                     }

//                     onChange={(e) => {

//                         setStartDate(
//                             e.target.value
//                         );

//                         setError("");

//                     }}

//                     style={
//                         dateFieldStyle
//                     }
//                 />

//             </div> */}


//             {/* =================================================
//                 END DATE/TIME
//             ================================================= */}
//             {/* 
//             <div
//                 style={{
//                     width:
//                         "100%",

//                     minWidth:
//                         0,

//                     marginBottom:
//                         16
//                 }}
//             >

//                 <label
//                     style={
//                         labelStyle
//                     }
//                 >
//                     END DATE & TIME
//                 </label>


//                 <input
//                     type="datetime-local"

//                     value={
//                         endDate
//                     }

//                     onChange={(e) => {

//                         setEndDate(
//                             e.target.value
//                         );

//                         setError("");

//                     }}

//                     style={
//                         dateFieldStyle
//                     }
//                 />

//             </div> */}


//             {/* {!needsCustomDateRange && reportType && (
//                 <div
//                     style={{
//                         width: "100%",
//                         boxSizing: "border-box",
//                         padding: "10px 12px",
//                         marginBottom: 16,
//                         borderRadius: 10,
//                         background: P.surfaceForm,
//                         color: P.textMuted,
//                         fontSize: 11,
//                         lineHeight: 1.45,
//                         fontFamily: "'Inter', sans-serif"
//                     }}
//                 >
//                     This report automatically uses the most recent
//                     available generation history for the selected period.
//                 </div>
//             )} */}


//             {/* =================================================
//                 INFO
//             ================================================= */}

//             {/* <div
//                 style={{
//                     width:
//                         "100%",

//                     boxSizing:
//                         "border-box",

//                     padding:
//                         "10px 12px",

//                     marginBottom:
//                         16,

//                     borderRadius:
//                         10,

//                     background:
//                         P.surfaceForm,

//                     color:
//                         P.textMuted,

//                     fontSize:
//                         11,

//                     lineHeight:
//                         1.45,

//                     fontFamily:
//                         "'Inter', sans-serif"
//                 }}
//             >

//                 If the selected start date is
//                 older than the available device
//                 history, the report will begin
//                 from the first available reading.

//             </div> */}


//             {/* {needsCustomDateRange && (

//     <div
//         style={{
//             width: "100%",
//             boxSizing: "border-box",
//             padding: "10px 12px",
//             marginBottom: 16,
//             borderRadius: 10,
//             background: P.surfaceForm,
//             color: P.textMuted,
//             fontSize: 11,
//             lineHeight: 1.45,
//             fontFamily:
//                 "'Inter', sans-serif"
//         }}
//     >
//         If the selected start date is older
//         than the available device history,
//         the report will begin from the first
//         available reading.
//     </div>

// )}

// {isGenerationReport && (

//     <div
//         style={{
//             width: "100%",
//             boxSizing: "border-box",
//             padding: "10px 12px",
//             marginBottom: 16,
//             borderRadius: 10,
//             background: P.surfaceForm,
//             color: P.textMuted,
//             fontSize: 11,
//             lineHeight: 1.45,
//             fontFamily:
//                 "'Inter', sans-serif"
//         }}
//     >

//         {reportType ===
//             "generation-7-days" &&
//             "This report contains generation history from the last 7 days through today."}


//         {reportType ===
//             "generation-1-month" &&
//             "This report contains generation history from one month ago through today."}


//         {reportType ===
//             "generation-3-months" &&
//             "This report contains generation history from three months ago through today."}

//     </div>

// )} */}

//             {/* =================================================
//                 ERROR
//             ================================================= */}

//             {error && (

//                 <div
//                     style={{
//                         width:
//                             "100%",

//                         boxSizing:
//                             "border-box",

//                         marginBottom:
//                             14,

//                         padding:
//                             "10px 12px",

//                         borderRadius:
//                             10,

//                         background:
//                             P.surfaceRed,

//                         border:
//                             `1px solid ${P.red}`,

//                         color:
//                             P.red,

//                         fontSize:
//                             12,

//                         fontFamily:
//                             "'Inter', sans-serif"
//                     }}
//                 >
//                     {error}
//                 </div>

//             )}


//             {/* =================================================
//                 DOWNLOAD BUTTON
//             ================================================= */}

//             <button
//                 type="button"

//                 onClick={
//                     handleDownload
//                 }

//                 disabled={
//                     !canDownload
//                 }

//                 style={{
//     width: "auto",

//     minWidth: 180,

//     height: 46,

//     padding: "0 18px",

//     border: "none",

//     borderRadius: 4,

//     boxSizing: "border-box",

//     background:
//         canDownload
//             ? "#1976d2"
//             : "rgba(25,118,210,0.42)",

//     color:
//         canDownload
//             ? "#ffffff"
//             : "rgba(255,255,255,0.55)",

//     fontSize: 14,

//     fontWeight: 600,

//     fontFamily:
//         "'DM Sans', sans-serif",

//     cursor:
//         canDownload
//             ? "pointer"
//             : "not-allowed",

//     opacity:
//         loading
//             ? 0.7
//             : 1,

//     display: "flex",

//     alignItems: "center",

//     justifyContent: "center",

//     gap: 8,

//     WebkitTapHighlightColor:
//         "transparent"
// }}

//                 // style={{
//                 //     width:
//                 //         "100%",

//                 //     height:
//                 //         46,

//                 //     border:
//                 //         "none",

//                 //     borderRadius:
//                 //         10,

//                 //     boxSizing:
//                 //         "border-box",

//                 //     background:
//                 //         canDownload
//                 //             ? P.btnPrimary
//                 //             : "rgba(255,255,255,0.08)",

//                 //     color:
//                 //         canDownload
//                 //             ? P.textWhite
//                 //             : "rgba(255,255,255,0.4)",

//                 //     fontSize:
//                 //         14,

//                 //     fontWeight:
//                 //         700,

//                 //     fontFamily:
//                 //         "'DM Sans', sans-serif",

//                 //     cursor:
//                 //         canDownload
//                 //             ? "pointer"
//                 //             : "not-allowed",

//                 //     opacity:
//                 //         loading
//                 //             ? 0.7
//                 //             : 1,

//                 //     display:
//                 //         "flex",

//                 //     alignItems:
//                 //         "center",

//                 //     justifyContent:
//                 //         "center",

//                 //     gap:
//                 //         8,

//                 //     WebkitTapHighlightColor:
//                 //         "transparent"
//                 // }}
//             >

//                 {/* DOWNLOAD ICON */}

//                 <svg
//                     width="17"
//                     height="17"
//                     viewBox="0 0 24 24"
//                     fill="none"
//                     stroke="currentColor"
//                     strokeWidth="2"
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                 >
//                     <path
//                         d="M12 3v12"
//                     />

//                     <polyline
//                         points="7 10 12 15 17 10"
//                     />

//                     <path
//                         d="M5 21h14"
//                     />
//                 </svg>


//                 {loading
//                     ? "Preparing Report..."
//                     : "Download Report"}

//             </button>

//         </div>
//     );
// }




import { useState } from "react";
import P from "../theme/colors";

const API_BASE = "http://localhost:3000";
// VPSCHANGE

export default function DownloadReportCard({
    selectedDeviceId,
    imei
}) {

    // =====================================================
    // STATE
    // =====================================================

    const [reportType, setReportType] =
        useState("");

    const [startDate, setStartDate] =
        useState("");

    const [endDate, setEndDate] =
        useState("");

    const [loading, setLoading] =
        useState(false);

    const [error, setError] =
        useState("");


    // =====================================================
    // REPORT TYPE HELPERS
    // =====================================================

    const needsCustomDateRange =
        reportType === "inverter-data" ||
        reportType === "event-fault-log";

    const isGenerationReport =
        reportType === "generation-7-days" ||
        reportType === "generation-1-month" ||
        reportType === "generation-3-months";


    // =====================================================
    // CAN DOWNLOAD
    // =====================================================

    const canDownload =
        Boolean(
            selectedDeviceId &&
            reportType &&
            !loading &&
            (
                isGenerationReport ||
                (
                    needsCustomDateRange &&
                    startDate &&
                    endDate
                )
            )
        );


    // =====================================================
    // DOWNLOAD REPORT
    // =====================================================

    const handleDownload = () => {

        if (!canDownload) {
            return;
        }

        setError("");


        // =================================================
        // DEVICE VALIDATION
        // =================================================

        if (!selectedDeviceId) {

            setError(
                "No device selected."
            );

            return;
        }


        // =================================================
        // REPORT TYPE VALIDATION
        // =================================================

        if (!reportType) {

            setError(
                "Please select a report type."
            );

            return;
        }


        // =================================================
        // DATE VALIDATION
        // =================================================

        let start = null;
        let end = null;


        if (needsCustomDateRange) {

            if (!startDate || !endDate) {

                setError(
                    "Please select both start and end date/time."
                );

                return;
            }


            start =
                new Date(startDate);

            end =
                new Date(endDate);


            if (
                Number.isNaN(start.getTime()) ||
                Number.isNaN(end.getTime())
            ) {

                setError(
                    "Please enter a valid date and time."
                );

                return;
            }


            if (start >= end) {

                setError(
                    "End date/time must be after start date/time."
                );

                return;
            }
        }


        // =================================================
        // BUILD DOWNLOAD QUERY
        // =================================================

        try {

            setLoading(true);


            const query =
                new URLSearchParams({
                    imei:
                        String(
                            selectedDeviceId
                        ),

                    report_type:
                        reportType
                });


            // Only inverter-data and event-fault-log
            // require manually selected dates.

            if (needsCustomDateRange) {

                query.set(
                    "start",
                    start.toISOString()
                );

                query.set(
                    "end",
                    end.toISOString()
                );
            }


            // =================================================
            // DIRECT DOWNLOAD
            //
            // IMPORTANT:
            //
            // Do NOT use fetch() + blob here.
            //
            // Direct navigation allows Android WebView's
            // setDownloadListener() to detect the CSV response
            // and pass it to Android DownloadManager.
            // =================================================

            const downloadUrl =
                // `/api/reports/download?${query.toString()}`;
                // VPSCHANGE
                                    `${API_BASE}/api/reports/download?${query.toString()}`;



            window.location.href =
                downloadUrl;


            // Loading only represents preparing the request.
            // Android DownloadManager handles the actual download.

            setTimeout(() => {

                setLoading(false);

            }, 1000);


        } catch (err) {

            console.error(
                "REPORT DOWNLOAD ERROR:",
                err
            );


            setError(
                err?.message ||
                "Unable to download report."
            );


            setLoading(false);
        }
    };


    // =====================================================
    // FIELD STYLE
    // =====================================================

    const fieldStyle = {

        display:
            "block",

        width:
            "100%",

        maxWidth:
            "100%",

        minWidth:
            0,

        height:
            52,

        padding:
            "0 14px",

        boxSizing:
            "border-box",

        border:
            "1px solid rgba(255,255,255,0.75)",

        borderRadius:
            6,

        background:
            "rgba(0,0,0,0.16)",

        color:
            "#ffffff",

        fontSize:
            14,

        fontWeight:
            500,

        fontFamily:
            "'Inter', sans-serif",

        outline:
            "none",

        WebkitAppearance:
            "none",

        appearance:
            "none"
    };


    // =====================================================
    // DATE FIELD STYLE
    // =====================================================

    const dateFieldStyle = {

        ...fieldStyle,

        padding:
            "0 10px",

        WebkitAppearance:
            "auto",

        appearance:
            "auto",

        colorScheme:
            "dark"
    };


    // =====================================================
    // LABEL STYLE
    // =====================================================

    const labelStyle = {

        display:
            "block",

        marginBottom:
            7,

        fontSize:
            11,

        fontWeight:
            600,

        letterSpacing:
            0.3,

        color:
            "rgba(255,255,255,0.82)",

        fontFamily:
            "'Inter', sans-serif"
    };


    // =====================================================
    // UI
    // =====================================================

    return (

        <div
            style={{
                width:
                    "100%",

                maxWidth:
                    "100%",

                minWidth:
                    0,

                boxSizing:
                    "border-box",

                background:
                    "rgba(22, 38, 45, 0.88)",

                border:
                    "1px solid rgba(255,255,255,0.08)",

                borderRadius:
                    14,

                padding:
                    "18px 16px 20px",

                boxShadow:
                    P.shadowCardRaised,

                overflow:
                    "hidden"
            }}
        >

            {/* =================================================
                TITLE
            ================================================= */}

            <div
                style={{
                    fontSize:
                        20,

                    fontWeight:
                        500,

                    color:
                        "#ffffff",

                    fontFamily:
                        "'DM Sans', sans-serif",

                    marginBottom:
                        18
                }}
            >
                Download Reports
            </div>


            {/* =================================================
                REPORT TYPE
            ================================================= */}

            <div
                style={{
                    width:
                        "100%",

                    minWidth:
                        0,

                    marginBottom:
                        14
                }}
            >

                <div
                    style={{
                        position:
                            "relative",

                        width:
                            "100%",

                        minWidth:
                            0
                    }}
                >

                    <select
                        value={
                            reportType
                        }

                        onChange={(e) => {

                            const newType =
                                e.target.value;


                            setReportType(
                                newType
                            );


                            setError("");


                            // Generation reports use
                            // automatic backend dates.

                            if (
                                newType.startsWith(
                                    "generation-"
                                )
                            ) {

                                setStartDate("");

                                setEndDate("");
                            }
                        }}

                        style={{
                            ...fieldStyle,

                            paddingRight:
                                42,

                            color:
                                "#ffffff"
                        }}
                    >

                        <option
                            value=""
                            disabled
                        >
                            Select Report Type
                        </option>


                        <option
                            value="inverter-data"
                        >
                            Inverter Data
                        </option>


                        <option
                            value="event-fault-log"
                        >
                            Event Fault Log
                        </option>


                        <option
                            value="generation-7-days"
                        >
                            Daily Generation (Last 7 Days)
                        </option>


                        <option
                            value="generation-1-month"
                        >
                            Daily Generation (Last 1 Month)
                        </option>


                        <option
                            value="generation-3-months"
                        >
                            Daily Generation (Last 3 Months)
                        </option>

                    </select>


                    {/* Custom dropdown arrow */}

                    <div
                        style={{
                            position:
                                "absolute",

                            right:
                                14,

                            top:
                                "50%",

                            transform:
                                "translateY(-50%)",

                            pointerEvents:
                                "none",

                            color:
                                "rgba(255,255,255,0.9)",

                            fontSize:
                                12
                        }}
                    >
                        ▼
                    </div>

                </div>

            </div>


            {/* =================================================
                CUSTOM DATE RANGE
            ================================================= */}

            {needsCustomDateRange && (

                <>

                    {/* START DATE */}

                    <div
                        style={{
                            width:
                                "100%",

                            minWidth:
                                0,

                            marginBottom:
                                14
                        }}
                    >

                        <label
                            style={
                                labelStyle
                            }
                        >
                            START DATE & TIME
                        </label>


                        <input
                            type="datetime-local"

                            value={
                                startDate
                            }

                            onChange={(e) => {

                                setStartDate(
                                    e.target.value
                                );

                                setError("");
                            }}

                            style={
                                dateFieldStyle
                            }
                        />

                    </div>


                    {/* END DATE */}

                    <div
                        style={{
                            width:
                                "100%",

                            minWidth:
                                0,

                            marginBottom:
                                16
                        }}
                    >

                        <label
                            style={
                                labelStyle
                            }
                        >
                            END DATE & TIME
                        </label>


                        <input
                            type="datetime-local"

                            value={
                                endDate
                            }

                            onChange={(e) => {

                                setEndDate(
                                    e.target.value
                                );

                                setError("");
                            }}

                            style={
                                dateFieldStyle
                            }
                        />

                    </div>

                </>
            )}


            {/* =================================================
                ERROR
            ================================================= */}

            {error && (

                <div
                    style={{
                        width:
                            "100%",

                        boxSizing:
                            "border-box",

                        marginBottom:
                            14,

                        padding:
                            "10px 12px",

                        borderRadius:
                            10,

                        background:
                            P.surfaceRed,

                        border:
                            `1px solid ${P.red}`,

                        color:
                            P.red,

                        fontSize:
                            12,

                        fontFamily:
                            "'Inter', sans-serif"
                    }}
                >
                    {error}
                </div>

            )}


            {/* =================================================
                DOWNLOAD BUTTON
            ================================================= */}

            <button
                type="button"

                onClick={
                    handleDownload
                }

                disabled={
                    !canDownload
                }

                style={{
                    width:
                        "auto",

                    minWidth:
                        180,

                    height:
                        46,

                    padding:
                        "0 18px",

                    border:
                        "none",

                    borderRadius:
                        4,

                    boxSizing:
                        "border-box",

                    background:
                        canDownload
                            ? "#1976d2"
                            : "rgba(25,118,210,0.42)",

                    color:
                        canDownload
                            ? "#ffffff"
                            : "rgba(255,255,255,0.55)",

                    fontSize:
                        14,

                    fontWeight:
                        600,

                    fontFamily:
                        "'DM Sans', sans-serif",

                    cursor:
                        canDownload
                            ? "pointer"
                            : "not-allowed",

                    opacity:
                        loading
                            ? 0.7
                            : 1,

                    display:
                        "flex",

                    alignItems:
                        "center",

                    justifyContent:
                        "center",

                    gap:
                        8,

                    WebkitTapHighlightColor:
                        "transparent"
                }}
            >

                {/* DOWNLOAD ICON */}

                <svg
                    width="17"
                    height="17"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >

                    <path
                        d="M12 3v12"
                    />

                    <polyline
                        points="7 10 12 15 17 10"
                    />

                    <path
                        d="M5 21h14"
                    />

                </svg>


                {
                    loading
                        ? "Starting Download..."
                        : "Download Report"
                }

            </button>

        </div>
    );
}