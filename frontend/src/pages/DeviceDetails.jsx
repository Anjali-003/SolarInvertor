// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { useInverter } from "../context/Context";
// import P from "../theme/colors";

// const API_BASE =
//     "http://localhost:3000";

// export default function DeviceDetails() {

//     const navigate = useNavigate();

//     const {
//         selectedDeviceId
//     } = useInverter();

//     const [details, setDetails] =
//         useState(null);

//     const [loading, setLoading] =
//         useState(true);

//     const [error, setError] =
//         useState("");



   


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

//                 // const res = await fetch(
//                 //     `${API_BASE}/api/user/devices/${selectedDeviceId}/details`,
//                 //     {
//                 //         method: "GET",

//                 //         headers: {
//                 //             Authorization:
//                 //                 `Bearer ${token}`
//                 //         }
//                 //     }
//                 // );

//                 const res = await fetch(
//                     `${API_BASE}/api/user/device-details?device_id=${selectedDeviceId}`,
//                     {
//                         method: "GET",
//                         headers: {
//                             Authorization: `Bearer ${token}`
//                         }
//                     }
//                 );

//                 const result =
//                     await res.json();

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
//                 <Message>
//                     No device selected
//                 </Message>
//             </Page>
//         );
//     }


//     const device =
//         details.device;

//     const latest =
//         details.latest;


//     // =====================================================
//     // DEVICE STATUS
//     // =====================================================

//     // const status3 =
//     //     Number(latest?.st3 ?? 0);

//     // const stInterval =
//     //     Number(latest?.stinterval ?? 0);

//     // const lastUpdated =
//     //     latest?.recorded_at
//     //         ? new Date(latest.recorded_at)
//     //         : null;

//     const payload = latest?.payload || {};

// const status3 =
//     Number(payload.ST3 ?? 0);

// const stInterval =
//     Number(payload.STINTERVAL ?? 0);

// const lastUpdated =
//     latest?.created_at
//         ? new Date(latest.created_at)
//         : null;


//     // -----------------------------------------------------
//     // CONDITION 1
//     // Latest data is 3+ minutes old
//     // -----------------------------------------------------

//     const dataTooOld =
//         !lastUpdated ||
//         (
//             Date.now() -
//             lastUpdated.getTime()
//         ) >=
//         3 * 60 * 1000;


//     // -----------------------------------------------------
//     // CONDITION 2
//     // STINTERVAL / 4 >= 1
//     // -----------------------------------------------------

//     const intervalTooLarge =
//         stInterval / 4 >= 1;


//     // -----------------------------------------------------
//     // CONDITION 3
//     // ST3 bit 2
//     // -----------------------------------------------------

//     const statusFromST3 =
//         Boolean(
//             status3 &
//             (1 << 2)
//         );


//     // -----------------------------------------------------
//     // FINAL STATUS
//     //
//     // ANY OFF CONDITION => OFF
//     // -----------------------------------------------------

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
//         <Page>

//             {/* =========================================
//                 HEADER
//             ========================================= */}

//             <div
//                 style={{
//                     width: "100%",
//                     maxWidth: 420,
//                     boxSizing: "border-box",

//                     background: P.surface,
//                     borderRadius: 24,

//                     padding:
//                         "18px 22px",

//                     marginBottom: 18,

//                     boxShadow:
//                         `${P.shadowCardLg}, ${P.shadowCard}`,

//                     border:
//                         `1px solid ${P.border}`,

//                     display: "flex",
//                     alignItems: "center",

//                     gap: 18
//                 }}
//             >

//                 <div
//                     style={{
//                         width: 76,
//                         height: 76,

//                         flexShrink: 0,

//                         display: "flex",
//                         alignItems: "center",
//                         justifyContent: "center",

//                         borderRadius: 14
//                     }}
//                 >

//                     <img
//                         src="/src/assets/logo.png"
//                         alt="Company Logo"
//                         style={{
//                             width: 116,
//                             height: 116,
//                             objectFit: "contain"
//                         }}
//                     />

//                 </div>


//                 <div
//                     style={{
//                         flex: 1,
//                         minWidth: 0
//                     }}
//                 >

//                     <h1
//                         style={{
//                             margin: 0,

//                             fontSize: 26,
//                             fontWeight: 800,

//                             color:
//                                 P.textPrimary,

//                             fontFamily:
//                                 "'DM Sans', sans-serif",

//                             lineHeight: 1.15
//                         }}
//                     >
//                         Device Details
//                     </h1>

//                     <p
//                         style={{
//                             margin:
//                                 "5px 0 0",

//                             fontSize: 13,

//                             color:
//                                 P.amber,

//                             fontFamily:
//                                 "'Inter', sans-serif",

//                             lineHeight: 1.3
//                         }}
//                     >
//                         Information about your device
//                     </p>

//                 </div>

//             </div>


//             {/* =========================================
//                 DETAILS CARD
//             ========================================= */}

//             <div
//                 style={{
//                     width: "100%",
//                     maxWidth: 420,

//                     boxSizing: "border-box",

//                     background:
//                         P.surface,

//                     borderRadius: 24,

//                     padding:
//                         "24px 22px",

//                     boxShadow:
//                         `${P.shadowCardLg}, ${P.shadowCard}`,

//                     border:
//                         `1px solid ${P.border}`
//                 }}
//             >

//                 <h2
//                     style={{
//                         margin: 0,

//                         fontSize: 20,
//                         fontWeight: 800,

//                         color:
//                             P.textPrimary,

//                         fontFamily:
//                             "'DM Sans', sans-serif"
//                     }}
//                 >
//                     Device Information
//                 </h2>


//                 <p
//                     style={{
//                         margin:
//                             "5px 0 20px",

//                         fontSize: 12,

//                         color:
//                             P.textMuted,

//                         fontFamily:
//                             "'Inter', sans-serif"
//                     }}
//                 >
//                     Details for the currently selected device
//                 </p>


//                 <DetailRow
//                     label="DEVICE NO."
//                     value={device.imei}
//                 />

//                 <DetailRow
//                     label="DEVICE TYPE"
//                     value={device.solution}
//                 />

//                 {/* <DetailRow
//                     label="RATING"
//                     value={
//                         latest?.rat != null
//                             ? `${latest.rat} VA`
//                             : "--"
//                     }
//                 /> */}

//                 <DetailRow
//     label="RATING"
//     value={
//         payload.RAT != null
//             ? `${payload.RAT} VA`
//             : "--"
//     }
// />

//                 <DetailRow
//                     label="LOCATION"
//                     value={
//                         device.location ||
//                         "--"
//                     }
//                 />


//                 {/* =====================================
//                     STATUS
//                 ===================================== */}

//                 <div
//                     style={{
//                         display: "flex",
//                         justifyContent:
//                             "space-between",

//                         alignItems: "center",

//                         padding:
//                             "14px 0",

//                         borderBottom:
//                             `1px solid ${P.border}`
//                     }}
//                 >

//                     <span
//                         style={{
//                             fontSize: 10,

//                             color:
//                                 P.textMuted,

//                             fontWeight: 600,

//                             letterSpacing: 0.8,

//                             fontFamily:
//                                 "'Inter', sans-serif"
//                         }}
//                     >
//                         DEVICE STATUS
//                     </span>


//                     <div
//                         style={{
//                             display:
//                                 "inline-flex",

//                             alignItems:
//                                 "center",

//                             gap: 7,

//                             padding:
//                                 "5px 10px",

//                             borderRadius: 20,

//                             background:
//                                 `${statusColor}18`,

//                             border:
//                                 `1px solid ${statusColor}`
//                         }}
//                     >

//                         <div
//                             style={{
//                                 width: 8,
//                                 height: 8,

//                                 borderRadius:
//                                     "50%",

//                                 background:
//                                     statusColor,

//                                 boxShadow:
//                                     `0 0 7px ${statusColor}`
//                             }}
//                         />

//                         <span
//                             style={{
//                                 fontSize: 12,

//                                 fontWeight: 700,

//                                 color:
//                                     statusColor,

//                                 fontFamily:
//                                     "'DM Sans', sans-serif"
//                             }}
//                         >
//                             {statusText}
//                         </span>

//                     </div>

//                 </div>


//                 {/* =====================================
//                     LAST UPDATED
//                 ===================================== */}

//                 <div
//                     style={{
//                         paddingTop: 14
//                     }}
//                 >

//                     <div
//                         style={{
//                             fontSize: 10,

//                             color:
//                                 P.textMuted,

//                             fontWeight: 600,

//                             letterSpacing: 0.8,

//                             marginBottom: 6,

//                             fontFamily:
//                                 "'Inter', sans-serif"
//                         }}
//                     >
//                         LAST UPDATED
//                     </div>


//                     <div
//                         style={{
//                             fontSize: 14,

//                             fontWeight: 700,

//                             color:
//                                 P.textPrimary,

//                             fontFamily:
//                                 "'DM Sans', sans-serif"
//                         }}
//                     >
//                         {formattedDate}
//                     </div>


//                     <div
//                         style={{
//                             fontSize: 13,

//                             fontWeight: 600,

//                             color:
//                                 P.textMuted,

//                             marginTop: 3,

//                             fontFamily:
//                                 "'Inter', sans-serif"
//                         }}
//                     >
//                         {formattedTime}
//                     </div>

//                 </div>

//             </div>


//             {/* =========================================
//                 BACK BUTTON
//             ========================================= */}

//             <div
//                 style={{
//                     position: "fixed",

//                     left: 30,

//                     bottom:
//                         "calc(36px + env(safe-area-inset-bottom))",

//                     zIndex: 1000
//                 }}
//             >

//                 <button
//                     type="button"
//                     onClick={() =>
//                         navigate(-1)
//                     }
//                     aria-label="Go back"
//                     style={{
//                         width: 44,
//                         height: 44,

//                         borderRadius:
//                             "50%",

//                         border:
//                             `1px solid ${P.border}`,

//                         background:
//                             P.surface,

//                         display: "flex",

//                         alignItems:
//                             "center",

//                         justifyContent:
//                             "center",

//                         padding: 0,

//                         cursor:
//                             "pointer",

//                         color:
//                             P.textSecond,

//                         fontSize: 22,

//                         fontWeight: 500,

//                         lineHeight: 1,

//                         fontFamily:
//                             "'Inter', sans-serif",

//                         boxShadow:
//                             "0 4px 14px rgba(0, 0, 0, 0.16)",

//                         WebkitTapHighlightColor:
//                             "transparent"
//                     }}
//                 >
//                     ←
//                 </button>

//             </div>

//         </Page>
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

//                 alignItems:
//                     "center",

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

//                     textAlign:
//                         "right",

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
// // PAGE WRAPPER
// // =====================================================

// function Page({
//     children
// }) {

//     return (
//         <div
//             style={{
//                 minHeight: "100vh",

//                 background:
//                     P.bgGradient,

//                 fontFamily:
//                     "'Inter', sans-serif",

//                 display: "flex",

//                 flexDirection:
//                     "column",

//                 alignItems:
//                     "center",

//                 justifyContent:
//                     "flex-start",

//                 padding:
//                     "24px 20px 110px",

//                 boxSizing:
//                     "border-box"
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
//                 width: "100%",
//                 maxWidth: 420,

//                 background:
//                     P.surface,

//                 borderRadius: 24,

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




















import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useInverter } from "../context/Context";
import Footer from "../components/Footer";
import PageHeader from "../components/PageHeader";
import DeviceInfo from "../components/DeviceInfo";
import P from "../theme/colors";
import PageBackground from "../components/PageBackground";

const API_BASE = "http://localhost:3000";

export default function DeviceDetails() {

    const navigate = useNavigate();

    const {
        devices,
        selectedDeviceId
    } = useInverter();

    const [details, setDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // =====================================================
    // FETCH DEVICE DETAILS
    // =====================================================

    useEffect(() => {

        if (selectedDeviceId == null) {

            setDetails(null);
            setLoading(false);

            return;
        }

        let cancelled = false;

        const fetchDetails = async () => {

            try {

                setLoading(true);
                setError("");

                const token =
                    localStorage.getItem("token");

                if (!token) {

                    navigate("/login");

                    return;
                }

                const res = await fetch(
                    `${API_BASE}/api/user/device-details?device_id=${selectedDeviceId}`,
                    {
                        method: "GET",

                        headers: {
                            Authorization:
                                `Bearer ${token}`,

                            Accept:
                                "application/json"
                        }
                    }
                );

                /*
                 * Read as text first.
                 *
                 * This prevents:
                 *
                 * Unexpected token '<'
                 *
                 * when the backend accidentally
                 * returns HTML.
                 */

                const raw =
                    await res.text();

                console.log(
                    "DEVICE DETAILS:",
                    res.status,
                    raw
                );

                let result;

                try {

                    result =
                        JSON.parse(raw);

                } catch {

                    throw new Error(
                        "Server returned an invalid response."
                    );
                }

                if (!res.ok) {

                    throw new Error(
                        result.error ||
                        "Failed to load device details"
                    );
                }

                if (!cancelled) {

                    setDetails(result);
                }

            } catch (err) {

                console.error(
                    "Device details error:",
                    err
                );

                if (!cancelled) {

                    setError(
                        err.message ||
                        "Failed to load device details"
                    );
                }

            } finally {

                if (!cancelled) {

                    setLoading(false);
                }
            }
        };

        fetchDetails();

        return () => {

            cancelled = true;
        };

    }, [
        selectedDeviceId,
        navigate
    ]);


    // =====================================================
    // LOADING
    // =====================================================

    if (loading) {

        return (
            <Page>
                <PageHeader
                    title="DEVICE DETAILS"
                    backPath="/"
                />

                <Message>
                    Loading device details...
                </Message>
            </Page>
        );
    }


    // =====================================================
    // ERROR
    // =====================================================

    if (error) {

        return (
            <Page>
                <PageHeader
                    title="DEVICE DETAILS"
                    backPath="/"
                />

                <Message error>
                    {error}
                </Message>
            </Page>
        );
    }


    // =====================================================
    // NO DEVICE
    // =====================================================

    if (!details?.device) {

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
        details.device;

    const latest =
        details.latest;

    const payload =
        latest?.payload || {};


    // =====================================================
    // DEVICE STATUS
    // =====================================================

    const status3 =
        Number(payload.ST3 ?? 0);

    const stInterval =
        Number(payload.STINTERVAL ?? 0);

    const lastUpdated =
        latest?.created_at
            ? new Date(latest.created_at)
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

            <PageHeader
                title="DEVICE DETAILS"
                backPath="/"
            />


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
                        color: P.textPrimary,
                        marginBottom: 14,
                        marginTop: 4,
                        fontFamily:
                            "'DM Sans', sans-serif"
                    }}
                >
                    DEVICE INFORMATION
                </h2> */}
                <h2 style={{ fontSize: 15, fontWeight: 800, color: P.textWhite, marginBottom: 12, marginTop: 4, letterSpacing: 0.5, fontFamily: "'DM Sans', sans-serif" }}>
                    DEVICE INFORMATION
                </h2>


                {/* =================================================
                    INFORMATION CARD
                ================================================= */}

                <div
                    style={{
                        background:
                            P.surface,

                        border:
                            `1px solid ${P.border}`,

                        borderRadius: 14,

                        padding:
                            "8px 16px",

                        boxShadow:
                            P.shadowCardRaised
                    }}
                >

                    <DetailRow
                        label="DEVICE NO."
                        value={
                            device.imei ||
                            "--"
                        }
                    />


                    <DetailRow
                        label="DEVICE TYPE"
                        value={
                            device.solution ||
                            "--"
                        }
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
                        value={
                            device.location ||
                            "--"
                        }
                    />


                    {/* =================================================
                        STATUS
                    ================================================= */}

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
                                `1px solid ${P.border}`
                        }}
                    >

                        <span
                            style={{
                                fontSize: 10,
                                color:
                                    P.textMuted,
                                fontWeight: 600,
                                letterSpacing: 0.8,
                                fontFamily:
                                    "'Inter', sans-serif",
                                flexShrink: 0
                            }}
                        >
                            DEVICE STATUS
                        </span>


                        <div
                            style={{
                                display:
                                    "inline-flex",
                                alignItems:
                                    "center",
                                gap: 7,
                                padding:
                                    "5px 10px",
                                borderRadius: 20,
                                background:
                                    `${statusColor}18`,
                                border:
                                    `1px solid ${statusColor}`
                            }}
                        >

                            <div
                                style={{
                                    width: 8,
                                    height: 8,
                                    borderRadius:
                                        "50%",
                                    background:
                                        statusColor,
                                    boxShadow:
                                        `0 0 7px ${statusColor}`
                                }}
                            />

                            <span
                                style={{
                                    fontSize: 12,
                                    fontWeight: 700,
                                    color:
                                        statusColor,
                                    fontFamily:
                                        "'DM Sans', sans-serif"
                                }}
                            >
                                {statusText}
                            </span>

                        </div>

                    </div>


                    {/* =================================================
                        LAST UPDATED
                    ================================================= */}

                    {/* <div
                        style={{
                            padding:
                                "14px 0"
                        }}
                    >

                        <div
                            style={{
                                fontSize: 10,
                                color:
                                    P.textMuted,
                                fontWeight: 600,
                                letterSpacing: 0.8,
                                marginBottom: 6,
                                fontFamily:
                                    "'Inter', sans-serif"
                            }}
                        >
                            LAST UPDATED
                        </div>


                        <div
                            style={{
                                fontSize: 14,
                                fontWeight: 700,
                                color:
                                    P.textPrimary,
                                fontFamily:
                                    "'DM Sans', sans-serif"
                            }}
                        >
                            {formattedDate}
                        </div>


                        <div
                            style={{
                                fontSize: 13,
                                fontWeight: 600,
                                color:
                                    P.textMuted,
                                marginTop: 3,
                                fontFamily:
                                    "'Inter', sans-serif"
                            }}
                        >
                            {formattedTime}
                        </div>

                    </div> */}


                    {/* =================================
    LAST UPDATED
================================= */}

<div
    style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        gap: 20,
        paddingTop: 14
    }}
>

    {/* LEFT — TITLE */}
    <div
        style={{
            fontSize: 10,
            color: P.textLight,
            fontWeight: 600,
            letterSpacing: 0.8,
            fontFamily: "'Inter', sans-serif",
            flexShrink: 0
        }}
    >
        LAST UPDATED
    </div>


    {/* RIGHT — DATE + TIME */}
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
                color: P.textPrimary,
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
                color: P.textMuted,
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
                    `1px solid ${P.border}`
            }}
        >

            <span
                style={{
                    fontSize: 10,
                    color:
                        P.textMuted,
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
                        P.textPrimary,
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
                background: P.bg,
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
                    P.surface,

                borderRadius: 14,

                padding: 24,

                border:
                    `1px solid ${P.border}`,

                boxShadow:
                    P.shadowCard,

                color:
                    error
                        ? P.red
                        : P.textMuted,

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