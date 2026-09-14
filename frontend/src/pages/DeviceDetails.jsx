// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { useInverter } from "../context/Context";
// import Footer from "../components/Footer";
// import PageHeader from "../components/PageHeader";
// import DeviceInfo from "../components/DeviceInfo";
// import P from "../theme/colors";
// import PageBackground from "../components/PageBackground";

// const API_BASE = "http://localhost:3000";

// //VPSCHANGE

// export default function DeviceDetails() {

//     const navigate = useNavigate();

//     const {
//         devices,
//         selectedDeviceId
//     } = useInverter();

//     const [details, setDetails] = useState(null);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState("");

//     // =====================================================
//     // FETCH DEVICE DETAILS
//     // =====================================================

//     useEffect(() => {

//         if (selectedDeviceId == null) {

//             setDetails(null);
//             setLoading(false);

//             return;
//         }

//         let cancelled = false;

//         const fetchDetails = async () => {

//             try {

//                 setLoading(true);
//                 setError("");

//                 const token =
//                     localStorage.getItem("token");

//                 if (!token) {

//                     navigate("/login");

//                     return;
//                 }

//                 const res = await fetch(
//                     //VPSCHANGE
//                     `${API_BASE}/api/user/device-details?device_id=${selectedDeviceId}`,
//                                         // `/api/user/device-details?device_id=${selectedDeviceId}`,

//                     {
//                         method: "GET",

//                         headers: {
//                             Authorization:
//                                 `Bearer ${token}`,

//                             Accept:
//                                 "application/json"
//                         }
//                     }
//                 );

//                 /*
//                  * Read as text first.
//                  *
//                  * This prevents:
//                  *
//                  * Unexpected token '<'
//                  *
//                  * when the backend accidentally
//                  * returns HTML.
//                  */

//                 const raw =
//                     await res.text();

//                 console.log(
//                     "DEVICE DETAILS:",
//                     res.status,
//                     raw
//                 );

//                 let result;

//                 try {

//                     result =
//                         JSON.parse(raw);

//                 } catch {

//                     throw new Error(
//                         "Server returned an invalid response."
//                     );
//                 }

//                 if (!res.ok) {

//                     throw new Error(
//                         result.error ||
//                         "Failed to load device details"
//                     );
//                 }

//                 if (!cancelled) {

//                     setDetails(result);
//                 }

//             } catch (err) {

//                 console.error(
//                     "Device details error:",
//                     err
//                 );

//                 if (!cancelled) {

//                     setError(
//                         err.message ||
//                         "Failed to load device details"
//                     );
//                 }

//             } finally {

//                 if (!cancelled) {

//                     setLoading(false);
//                 }
//             }
//         };

//         fetchDetails();

//         return () => {

//             cancelled = true;
//         };

//     }, [
//         selectedDeviceId,
//         navigate
//     ]);


//     // =====================================================
//     // LOADING
//     // =====================================================

//     if (loading) {

//         return (
//             <Page>
//                 <PageHeader
//                     title="DEVICE DETAILS"
//                     backPath="/"
//                 />

//                 <Message>
//                     Loading device details...
//                 </Message>
//             </Page>
//         );
//     }


//     // =====================================================
//     // ERROR
//     // =====================================================

//     if (error) {

//         return (
//             <Page>
//                 <PageHeader
//                     title="DEVICE DETAILS"
//                     backPath="/"
//                 />

//                 <Message error>
//                     {error}
//                 </Message>
//             </Page>
//         );
//     }


//     // =====================================================
//     // NO DEVICE
//     // =====================================================

//     if (!details?.device) {

//         return (
//             <Page>

//                 <PageHeader
//                     title="DEVICE DETAILS"
//                     backPath="/"
//                 />

//                 <Message>
//                     No device selected
//                 </Message>

//             </Page>
//         );
//     }


//     // =====================================================
//     // DATA
//     // =====================================================

//     const device =
//         details.device;

//     const latest =
//         details.latest;

//     const payload =
//         latest?.payload || {};


//     // =====================================================
//     // DEVICE STATUS
//     // =====================================================

//     const status3 =
//         Number(payload.ST3 ?? 0);

//     const stInterval =
//         Number(payload.STINTERVAL ?? 0);

//     const lastUpdated =
//         latest?.created_at
//             ? new Date(latest.created_at)
//             : null;


//     const dataTooOld =
//         !lastUpdated ||
//         (
//             Date.now() -
//             lastUpdated.getTime()
//         ) >=
//         3 * 60 * 1000;


//     const intervalTooLarge =
//         stInterval / 4 >= 1;


//     const statusFromST3 =
//         Boolean(
//             status3 &
//             (1 << 2)
//         );


//     const inverterOn =
//         statusFromST3 &&
//         !dataTooOld &&
//         !intervalTooLarge;


//     const statusText =
//         inverterOn
//             ? "ON"
//             : "OFF";


//     const statusColor =
//         inverterOn
//             ? P.green
//             : P.red;


//     // =====================================================
//     // FORMATTED LAST UPDATED
//     // =====================================================

//     const formattedDate =
//         lastUpdated
//             ? lastUpdated.toLocaleDateString(
//                 "en-GB",
//                 {
//                     day: "numeric",
//                     month: "short",
//                     year: "numeric"
//                 }
//             )
//             : "--";


//     const formattedTime =
//         lastUpdated
//             ? lastUpdated.toLocaleTimeString(
//                 "en-US",
//                 {
//                     hour: "numeric",
//                     minute: "2-digit",
//                     hour12: true
//                 }
//             )
//             : "--";


//     // =====================================================
//     // RENDER
//     // =====================================================

//     return (
// <PageBackground>
//         <div
//             style={{
//                 minHeight: "100vh",
//                 paddingBottom: "90px",
//                 // background: P.bg,
//                 fontFamily: "'Inter', sans-serif"
//             }}
//         >

//             {/* =================================================
//                 HEADER
//             ================================================= */}

//             <PageHeader
//                 title="DEVICE DETAILS"
//                 backPath="/"
//             />


//             {/* =================================================
//                 DEVICE INFO
//             ================================================= */}

//             <DeviceInfo
//                 data={payload}
//                 lastUpdated={lastUpdated}
//                 devices={devices}
//                 selectedDeviceId={selectedDeviceId}
//             />


//             {/* =================================================
//                 PAGE CONTENT
//             ================================================= */}

//             <div
//                 style={{
//                     padding:
//                         "0 20px 20px"
//                 }}
//             >

//                 {/* =================================================
//                     HEADING
//                 ================================================= */}

//                 {/* <h2
//                     style={{
//                         fontSize: 18,
//                         fontWeight: 800,
//                         color: "#ffffff",
//                         marginBottom: 14,
//                         marginTop: 4,
//                         fontFamily:
//                             "'DM Sans', sans-serif"
//                     }}
//                 >
//                     DEVICE INFORMATION
//                 </h2> */}
//                 <h2 style={{ fontSize: 15, fontWeight: 800, color: "#ffffff", marginBottom: 12, marginTop: 4, letterSpacing: 0.5, fontFamily: "'DM Sans', sans-serif" }}>
//                     DEVICE INFORMATION
//                 </h2>


//                 {/* =================================================
//                     INFORMATION CARD
//                 ================================================= */}

//                 <div
//                     style={{
//                         background:
//                             P.surface,

//                         border:
//                             `1px solid ${P.border}`,

//                         borderRadius: 14,

//                         padding:
//                             "8px 16px",

//                         boxShadow:
//                             P.shadowCardRaised
//                     }}
//                 >

//                     <DetailRow
//                         label="DEVICE NO."
//                         value={
//                             device.imei ||
//                             "--"
//                         }
//                     />


//                     <DetailRow
//                         label="DEVICE TYPE"
//                         value={
//                             device.solution ||
//                             "--"
//                         }
//                     />


//                     <DetailRow
//                         label="RATING"
//                         value={
//                             payload.RAT != null
//                                 ? `${payload.RAT} VA`
//                                 : "--"
//                         }
//                     />


//                     <DetailRow
//                         label="LOCATION"
//                         value={
//                             device.location ||
//                             "--"
//                         }
//                     />


//                     {/* =================================================
//                         STATUS
//                     ================================================= */}

//                     <div
//                         style={{
//                             display: "flex",
//                             justifyContent:
//                                 "space-between",
//                             alignItems: "center",
//                             gap: 20,
//                             padding:
//                                 "14px 0",
//                             borderBottom:
//                                 `1px solid ${P.border}`
//                         }}
//                     >

//                         <span
//                             style={{
//                                 fontSize: 10,
//                                 color:
//                                     P.textMuted,
//                                 fontWeight: 600,
//                                 letterSpacing: 0.8,
//                                 fontFamily:
//                                     "'Inter', sans-serif",
//                                 flexShrink: 0
//                             }}
//                         >
//                             DEVICE STATUS
//                         </span>


//                         <div
//                             style={{
//                                 display:
//                                     "inline-flex",
//                                 alignItems:
//                                     "center",
//                                 gap: 7,
//                                 padding:
//                                     "5px 10px",
//                                 borderRadius: 20,
//                                 background:
//                                     `${statusColor}18`,
//                                 border:
//                                     `1px solid ${statusColor}`
//                             }}
//                         >

//                             <div
//                                 style={{
//                                     width: 8,
//                                     height: 8,
//                                     borderRadius:
//                                         "50%",
//                                     background:
//                                         statusColor,
//                                     boxShadow:
//                                         `0 0 7px ${statusColor}`
//                                 }}
//                             />

//                             <span
//                                 style={{
//                                     fontSize: 12,
//                                     fontWeight: 700,
//                                     color:
//                                         statusColor,
//                                     fontFamily:
//                                         "'DM Sans', sans-serif"
//                                 }}
//                             >
//                                 {statusText}
//                             </span>

//                         </div>

//                     </div>


//                     {/* =================================================
//                         LAST UPDATED
//                     ================================================= */}

//                     {/* <div
//                         style={{
//                             padding:
//                                 "14px 0"
//                         }}
//                     >

//                         <div
//                             style={{
//                                 fontSize: 10,
//                                 color:
//                                     P.textMuted,
//                                 fontWeight: 600,
//                                 letterSpacing: 0.8,
//                                 marginBottom: 6,
//                                 fontFamily:
//                                     "'Inter', sans-serif"
//                             }}
//                         >
//                             LAST UPDATED
//                         </div>


//                         <div
//                             style={{
//                                 fontSize: 14,
//                                 fontWeight: 700,
//                                 color:
//                                     P.textPrimary,
//                                 fontFamily:
//                                     "'DM Sans', sans-serif"
//                             }}
//                         >
//                             {formattedDate}
//                         </div>


//                         <div
//                             style={{
//                                 fontSize: 13,
//                                 fontWeight: 600,
//                                 color:
//                                     P.textMuted,
//                                 marginTop: 3,
//                                 fontFamily:
//                                     "'Inter', sans-serif"
//                             }}
//                         >
//                             {formattedTime}
//                         </div>

//                     </div> */}


//                     {/* =================================
//     LAST UPDATED
// ================================= */}

// <div
//     style={{
//         display: "flex",
//         justifyContent: "space-between",
//         alignItems: "center",
//         gap: 20,
//         paddingTop: 14
//     }}
// >

//     {/* LEFT — TITLE */}
//     <div
//         style={{
//             fontSize: 10,
//             color: "rgba(255,255,255,0.6)",
//             fontWeight: 600,
//             letterSpacing: 0.8,
//             fontFamily: "'Inter', sans-serif",
//             flexShrink: 0
//         }}
//     >
//         LAST UPDATED
//     </div>


//     {/* RIGHT — DATE + TIME */}
//     <div
//         style={{
//             textAlign: "right",
//             minWidth: 0,
//             marginLeft: "auto"
//         }}
//     >

//         <div
//             style={{
//                 fontSize: 14,
//                 fontWeight: 700,
//                 color: "#ffffff",
//                 fontFamily: "'DM Sans', sans-serif",
//                 lineHeight: 1.2,
//                 whiteSpace: "nowrap"
//             }}
//         >
//             {formattedDate}
//         </div>


//         <div
//             style={{
//                 marginTop: 3,
//                 fontSize: 12,
//                 fontWeight: 600,
//                 color: "rgba(255,255,255,0.6)",
//                 fontFamily: "'Inter', sans-serif",
//                 lineHeight: 1.2,
//                 whiteSpace: "nowrap"
//             }}
//         >
//             {formattedTime}
//         </div>

//     </div>

// </div>

//                 </div>

//             </div>


//             {/* =================================================
//                 FOOTER
//             ================================================= */}

//             <Footer
//                 data={payload}
//             />

//         </div>
//         </PageBackground>
//     );
// }


// // =====================================================
// // DETAIL ROW
// // =====================================================

// function DetailRow({
//     label,
//     value
// }) {

//     return (

//         <div
//             style={{
//                 display: "flex",
//                 justifyContent:
//                     "space-between",
//                 alignItems: "center",
//                 gap: 20,
//                 padding:
//                     "14px 0",
//                 borderBottom:
//                     `1px solid ${P.border}`
//             }}
//         >

//             <span
//                 style={{
//                     fontSize: 10,
//                     color:
//                         P.textMuted,
//                     fontWeight: 600,
//                     letterSpacing: 0.8,
//                     fontFamily:
//                         "'Inter', sans-serif",
//                     flexShrink: 0
//                 }}
//             >
//                 {label}
//             </span>


//             <span
//                 style={{
//                     fontSize: 14,
//                     fontWeight: 700,
//                     color:
//                         P.textPrimary,
//                     fontFamily:
//                         "'DM Sans', sans-serif",
//                     textAlign: "right",
//                     overflowWrap:
//                         "anywhere"
//                 }}
//             >
//                 {value}
//             </span>

//         </div>
//     );
// }


// // =====================================================
// // PAGE
// // =====================================================

// function Page({
//     children
// }) {

//     return (

//         <div
//             style={{
//                 minHeight: "100vh",
//                 paddingBottom: "90px",
//                 background: P.bg,
//                 fontFamily:
//                     "'Inter', sans-serif"
//             }}
//         >
//             {children}
//         </div>
//     );
// }


// // =====================================================
// // MESSAGE
// // =====================================================

// function Message({
//     children,
//     error = false
// }) {

//     return (

//         <div
//             style={{
//                 margin:
//                     "20px",

//                 background:
//                     P.surface,

//                 borderRadius: 14,

//                 padding: 24,

//                 border:
//                     `1px solid ${P.border}`,

//                 boxShadow:
//                     P.shadowCard,

//                 color:
//                     error
//                         ? P.red
//                         : P.textMuted,

//                 textAlign:
//                     "center",

//                 boxSizing:
//                     "border-box"
//             }}
//         >
//             {children}
//         </div>
//     );
// }



























import { useInverter } from "../context/Context";
import Footer from "../components/Footer";
import PageHeader from "../components/PageHeader";
import DeviceInfo from "../components/DeviceInfo";
import P from "../theme/colors";
import PageBackground from "../components/PageBackground";
import DownloadReportCard
    from "../components/DownloadReportCard";

export default function DeviceDetails() {

    // Everything this page needs already lives in context:
    // - `devices` (id/imei/solution/location) is fetched once by
    //   InverterProvider, same as every other page that lists devices.
    // - `data`/`lastUpdated` (live telemetry) is fetched + polled
    //   automatically by InverterProvider, exactly like Fault/Power/
    //   Home/User already do.
    //
    // This page used to make its own separate fetch to
    // /api/user/device-details, which duplicated data the context
    // already had (imei/solution/payload/created_at are identical to
    // what /api/user/devices + /api/latest-message already provide).
    // That extra fetch is what caused the "Loading device details..."
    // flash every time this page was opened. Reading straight from
    // context removes the flash entirely - no page-specific fetch,
    // no page-specific loading state, nothing to flash.
    const {
        devices,
        selectedDeviceId,
        data,
        lastUpdated: rawLastUpdated
    } = useInverter();


    // =====================================================
    // NO DEVICE SELECTED
    // =====================================================

    if (selectedDeviceId == null) {

        return (
            <Page>

                <PageHeader
                    title="DEVICE DETAILS"
                    backPath="/"
                />

                <Message>
                    No device selected
                </Message>

            </Page>
        );
    }


    // =====================================================
    // DATA
    // =====================================================

    const device =
        devices?.find(
            d => Number(d.id) === Number(selectedDeviceId)
        ) || {};

    const payload =
        data || {};


    // =====================================================
    // DEVICE STATUS
    // =====================================================

    const status3 =
        Number(payload.ST3 ?? 0);

    const stInterval =
        Number(payload.STINTERVAL ?? 0);

    const lastUpdated =
        rawLastUpdated
            ? new Date(rawLastUpdated)
            : null;


    const dataTooOld =
        !lastUpdated ||
        (
            Date.now() -
            lastUpdated.getTime()
        ) >=
        3 * 60 * 1000;


    const intervalTooLarge =
        stInterval / 4 >= 1;


    const statusFromST3 =
        Boolean(
            status3 &
            (1 << 2)
        );


    const inverterOn =
        statusFromST3 &&
        !dataTooOld &&
        !intervalTooLarge;


    const statusText =
        inverterOn
            ? "ON"
            : "OFF";


    const statusColor =
        inverterOn
            ? P.green
            : P.red;


    // =====================================================
    // FORMATTED LAST UPDATED
    // =====================================================

    const formattedDate =
        lastUpdated
            ? lastUpdated.toLocaleDateString(
                "en-GB",
                {
                    day: "numeric",
                    month: "short",
                    year: "numeric"
                }
            )
            : "--";


    const formattedTime =
        lastUpdated
            ? lastUpdated.toLocaleTimeString(
                "en-US",
                {
                    hour: "numeric",
                    minute: "2-digit",
                    hour12: true
                }
            )
            : "--";


    // =====================================================
    // RENDER
    // =====================================================

    return (
        <PageBackground>
            <div
                style={{
                    minHeight: "100vh",
                    paddingBottom: "90px",
                    // background: P.bg,
                    fontFamily: "'Inter', sans-serif"
                }}
            >

                {/* =================================================
                HEADER
            ================================================= */}
{/* 
                <PageHeader
                    title="DEVICE DETAILS"
                    backPath="/"
                /> */}


                {/* =================================================
                DEVICE INFO
            ================================================= */}

                <DeviceInfo
                    data={payload}
                    lastUpdated={lastUpdated}
                    devices={devices}
                    selectedDeviceId={selectedDeviceId}
                />


                {/* =================================================
                PAGE CONTENT
            ================================================= */}

                <div
                    style={{
                        padding:
                            "0 20px 20px"
                    }}
                >

                    {/* =================================================
                    HEADING
                ================================================= */}

                    {/* <h2
                    style={{
                        fontSize: 18,
                        fontWeight: 800,
                        color: "#ffffff",
                        marginBottom: 14,
                        marginTop: 4,
                        fontFamily:
                            "'DM Sans', sans-serif"
                    }}
                >
                    DEVICE INFORMATION
                </h2> */}
                    {/* <h2 style={{ fontSize: 15, fontWeight: 800, color: "#ffffff", marginBottom: 12, marginTop: 4, letterSpacing: 0.5, fontFamily: "'DM Sans', sans-serif" }}>
                        DEVICE INFORMATION
                    </h2> */}


                    {/* =================================================
                    INFORMATION CARD
                ================================================= */}
<div
    style={{
        background: "rgba(22, 38, 45, 0.88)",
        border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: 14,
        padding: "14px 16px 8px",
        boxShadow: P.shadowCardRaised
    }}
>
    {/* CARD TITLE */}
    <div
        style={{
            fontSize: 20,
            fontWeight: 500,
            color: "#ffffff",
            marginBottom: 10,
            fontFamily: "'DM Sans', sans-serif"
        }}
    >
        Details
    </div>

    <DetailRow
        label="DEVICE NO."
        value={device.imei || "--"}
    />

    <DetailRow
        label="DEVICE TYPE"
        value={device.solution || "--"}
    />

    <DetailRow
        label="RATING"
        value={
            payload.RAT != null
                ? `${payload.RAT} VA`
                : "--"
        }
    />

    <DetailRow
        label="LOCATION"
        value={device.location || "--"}
    />

    {/* DEVICE STATUS */}
    <div
        style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 20,
            padding: "14px 0",
            borderBottom: "2px solid rgba(255,255,255,0.95)"
        }}
    >
        <span
            style={{
                fontSize: 10,
                color: "rgba(255,255,255,0.75)",
                fontWeight: 600,
                letterSpacing: 0.8,
                fontFamily: "'Inter', sans-serif",
                flexShrink: 0
            }}
        >
            DEVICE STATUS
        </span>

        <div
            style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 7,
                padding: "5px 10px",
                borderRadius: 20,
                background: `${statusColor}18`,
                border: `1px solid ${statusColor}`
            }}
        >
            <div
                style={{
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    background: statusColor,
                    boxShadow: `0 0 7px ${statusColor}`
                }}
            />

            <span
                style={{
                    fontSize: 12,
                    fontWeight: 700,
                    color: statusColor,
                    fontFamily: "'DM Sans', sans-serif"
                }}
            >
                {statusText}
            </span>
        </div>
    </div>

    {/* LAST UPDATED */}
    <div
        style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 20,
            padding: "14px 0 8px"
        }}
    >
        <div
            style={{
                fontSize: 10,
                color: "rgba(255,255,255,0.75)",
                fontWeight: 600,
                letterSpacing: 0.8,
                fontFamily: "'Inter', sans-serif",
                flexShrink: 0
            }}
        >
            LAST UPDATED
        </div>

        <div
            style={{
                textAlign: "right",
                minWidth: 0,
                marginLeft: "auto"
            }}
        >
            <div
                style={{
                    fontSize: 14,
                    fontWeight: 700,
                    color: "#ffffff",
                    fontFamily: "'DM Sans', sans-serif",
                    lineHeight: 1.2,
                    whiteSpace: "nowrap"
                }}
            >
                {formattedDate}
            </div>

            <div
                style={{
                    marginTop: 3,
                    fontSize: 12,
                    fontWeight: 600,
                    color: "rgba(255,255,255,0.65)",
                    fontFamily: "'Inter', sans-serif",
                    lineHeight: 1.2,
                    whiteSpace: "nowrap"
                }}
            >
                {formattedTime}
            </div>
        </div>
    </div>
</div>

{/* <h2
    style={{
        fontSize: 15,
        fontWeight: 800,
        color: "#ffffff",
        marginBottom: 12,
        marginTop: 24,
        letterSpacing: 0.5,
        fontFamily:
            "'DM Sans', sans-serif"
    }}
>

</h2> */}

{/* 
<DownloadReportCard

    selectedDeviceId={
        selectedDeviceId
    }

    imei={
        device.imei
    }

/> */}
<div style={{ marginTop: 28 }}>
    <DownloadReportCard
        selectedDeviceId={selectedDeviceId}
        imei={device.imei}
    />
    </div>


                </div>


                {/* =================================================
                FOOTER
            ================================================= */}

                <Footer
                    data={payload}
                />

            </div>
        </PageBackground>
    );
}


// =====================================================
// DETAIL ROW
// =====================================================

function DetailRow({
    label,
    value
}) {

    return (

        <div
            style={{
                display: "flex",
                justifyContent:
                    "space-between",
                alignItems: "center",
                gap: 20,
                padding:
                    "14px 0",
                borderBottom:
                    "2px solid rgba(255,255,255,0.95)"
            }}
        >

            <span
                style={{
                    fontSize: 10,
                    color:
                        "rgba(255,255,255,0.6)",
                    fontWeight: 600,
                    letterSpacing: 0.8,
                    fontFamily:
                        "'Inter', sans-serif",
                    flexShrink: 0
                }}
            >
                {label}
            </span>


            <span
                style={{
                    fontSize: 14,
                    fontWeight: 700,
                    color:
                        "#ffffff",
                    fontFamily:
                        "'DM Sans', sans-serif",
                    textAlign: "right",
                    overflowWrap:
                        "anywhere"
                }}
            >
                {value}
            </span>

        </div>
    );
}


// =====================================================
// PAGE
// =====================================================

function Page({
    children
}) {

    return (

        <div
            style={{
                minHeight: "100vh",
                paddingBottom: "90px",
                background: "transparent",
                fontFamily:
                    "'Inter', sans-serif"
            }}
        >
            {children}
        </div>
    );
}


// =====================================================
// MESSAGE
// =====================================================

function Message({
    children,
    error = false
}) {

    return (

        <div
            style={{
                margin:
                    "20px",

                background:
                    "rgba(22, 38, 45, 0.88)",

                borderRadius: 14,

                padding: 24,

                border:
                    "1px solid rgba(255,255,255,0.08)",

                boxShadow:
                    P.shadowCard,

                color:
                    error
                        ? P.red
                        : "rgba(255,255,255,0.6)",

                textAlign:
                    "center",

                boxSizing:
                    "border-box"
            }}
        >
            {children}
        </div>
    );
}