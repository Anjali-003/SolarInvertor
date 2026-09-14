// import React, { useEffect, useState } from "react";
// import { RadioTower } from "lucide-react";
// import P from "../theme/colors";
// import logo from "../assets/logo.png";
// import { formatUpdatedAgo } from "../utils/timeFormat";

// // =====================================================================
// // TOP DEVICE HEADER CARD
// //
// // This is the very first thing the user sees after logging in.
// // It is rendered by Home.jsx, Power.jsx and Fault.jsx with the exact
// // same props, so it looks identical and stays "static" (same content,
// // same position, same styling) across all three bottom-nav tabs, and
// // does not change while the user is inside any one of those tabs
// // (it only re-renders when the underlying device data actually
// // changes — switching tabs never alters it).
// //
// // `stickyTop` pins the card while the page scrolls underneath it.
// // Pass it only on pages where this card IS the top header (Home, Fault).
// // Pages that already render their own sticky PageHeader must either
// // leave it out or pass that header's height (64), otherwise the card
// // would scroll up behind it.
// // =====================================================================

// /**
//  * RAT comes from the live device payload in VA (e.g. 3000 for a
//  * 3 kW inverter). The header shows it as whole/rounded kW, e.g. "3KW".
//  */
// function formatRatingKW(rat) {
//     const va = Number(rat);

//     if (!Number.isFinite(va) || va <= 0) {
//         return "--";
//     }

//     const kw = va / 1000;

//     // Trim trailing zeros: 3.00 -> "3", 3.50 -> "3.5"
//     return String(parseFloat(kw.toFixed(2)));
// }

// export default function DeviceInfo({
//     data,
//     lastUpdated,
//     devices,
//     selectedDeviceId,
//     stickyTop,
// }) {

//     // =====================================================
//     // TICK EVERY SECOND
//     // =====================================================
//     //
//     // "Updated <n> minutes ago" is derived from the device
//     // timestamp, so it has to be recomputed as time passes —
//     // not only when new data arrives from the API.

//     const [, setNow] = useState(Date.now());

//     useEffect(() => {

//         const timer =
//             setInterval(() => {

//                 setNow(Date.now());

//             }, 1000);

//         return () =>
//             clearInterval(timer);

//     }, []);


//     // =====================================================
//     // SELECTED DEVICE / SERIAL NUMBER (IMEI)
//     // =====================================================
//     //
//     // `devices` comes from GET /api/user/devices, which selects
//     // devices.imei straight out of the database. Nothing here is
//     // hardcoded — "--" only shows while no device is resolved yet.

//     const selectedDevice =
//         devices?.find(
//             device =>
//                 Number(device.id) ===
//                 Number(selectedDeviceId)
//         );

//     const serialNumber =
//         selectedDevice?.imei ?? "--";


//     // =====================================================
//     // RATING (VA -> KW)
//     // =====================================================

//     const ratingKW =
//         formatRatingKW(data?.RAT);


//     // =====================================================
//     // LAST UPDATED, RELATIVE ("Updated 3 hours ago")
//     // =====================================================
//     //
//     // `lastUpdated` is messages.created_at as returned by
//     // GET /api/latest-message — the real device message time,
//     // never the frontend's own clock.

//     const updatedAgo =
//         formatUpdatedAgo(lastUpdated);


//     // =====================================================
//     // STICKY POSITIONING
//     // =====================================================

//     const isSticky =
//         typeof stickyTop === "number";


//     // =====================================================
//     // UI
//     // =====================================================

//     return (
//         <div
//             style={{
//                 width: "100%",
//                 maxWidth: 700,
//                 margin: "0 auto 16px",
//                 padding: "0 20px",
//                 boxSizing: "border-box",

//                 // Keep the header pinned while the page scrolls.
//                 ...(isSticky
//                     ? {
//                         position: "sticky",
//                         top: stickyTop,
//                         zIndex: 50,
//                     }
//                     : null),
//             }}
//         >

//             <div
//                 style={{
//                     width: "100%",
//                     boxSizing: "border-box",

//                     background: "rgba(22, 38, 45, 0.88)",
//                     borderRadius: 16,
//                     padding: "16px 18px",

//                     border: "1px solid rgba(255,255,255,0.08)",
//                     boxShadow: P.shadowCard,

//                     // Content scrolls underneath the (translucent)
//                     // card, so blur what shows through.
//                     backdropFilter: "blur(10px)",
//                     WebkitBackdropFilter: "blur(10px)",

//                     display: "flex",
//                     alignItems: "center",
//                     justifyContent: "space-between",
//                     gap: 16,

//                     overflow: "hidden",
//                 }}
//             >

//                 {/* =========================================
//                     NETWORK ICON + LOGO (left)
//                 ========================================= */}

//                 <div
//                     style={{
//                         display: "flex",
//                         alignItems: "center",
//                         gap: 10,
//                         minWidth: 0,
//                         maxWidth: "52%",
//                         flexShrink: 0,
//                     }}
//                 >

//                     <RadioTower
//                         size={22}
//                         strokeWidth={2}
//                         color="#ffffff"
//                         style={{
//                             flexShrink: 0,
//                             opacity: 0.9,
//                         }}
//                     />

//                     <img
//                         src={logo}
//                         alt="Statcon Energiaa"
//                         style={{
//                             height: 46,
//                             width: "auto",
//                             maxWidth: "100%",
//                             objectFit: "contain",
//                             flexShrink: 0,

//                             // Recolor the (multi-color) logo to a clean
//                             // white silhouette so it reads well on the
//                             // dark header background.
//                             filter: "brightness(0) invert(1)",
//                             opacity: 0.95,
//                         }}
//                     />

//                 </div>


//                 {/* =========================================
//                     DEVICE SUMMARY (right, stacked)
//                 ========================================= */}

//                 <div
//                     style={{
//                         minWidth: 0,
//                         display: "flex",
//                         flexDirection: "column",
//                         alignItems: "flex-end",
//                         textAlign: "right",
//                         gap: 3,
//                     }}
//                 >

//                     {/* TITLE PLACEHOLDER
//                         The account holder's name is deliberately not
//                         shown here. */}
//                     <div
//                         style={{
//                             fontSize: 16,
//                             fontWeight: 800,
//                             color: "#ffffff",
//                             fontFamily: "'DM Sans', sans-serif",
//                             maxWidth: "100%",
//                             overflowWrap: "anywhere",
//                         }}
//                     >
//                         --
//                     </div>

//                     {/* SERIAL NUMBER (IMEI) */}
//                     <div
//                         style={{
//                             fontSize: 12,
//                             fontWeight: 600,
//                             color: "rgba(255,255,255,0.65)",
//                             fontFamily: "'Inter', sans-serif",
//                             maxWidth: "100%",
//                             overflowWrap: "anywhere",
//                         }}
//                     >
//                         {serialNumber}
//                     </div>

//                     {/* RATING */}
//                     <div
//                         style={{
//                             fontSize: 13,
//                             fontWeight: 600,
//                             color: "rgba(255,255,255,0.85)",
//                             fontFamily: "'Inter', sans-serif",
//                             whiteSpace: "nowrap",
//                         }}
//                     >
//                         Rating: {ratingKW}KW
//                     </div>

//                     {/* UPDATED */}
//                     <div
//                         style={{
//                             fontSize: 12,
//                             fontWeight: 500,
//                             color: "rgba(255,255,255,0.55)",
//                             fontFamily: "'Inter', sans-serif",
//                             whiteSpace: "nowrap",
//                         }}
//                     >
//                         Updated {updatedAgo}
//                     </div>

//                 </div>

//             </div>

//         </div>
//     );
// }





import React, { useEffect, useState } from "react";
import P from "../theme/colors";
import logo from "../assets/logo.png";
import { formatUpdatedAgo } from "../utils/timeFormat";
import { useNavigate } from "react-router-dom";


// =====================================================
// SIGNAL STRENGTH
// =====================================================

function SignalStrength({ csq }) {

    const value =
        Number(csq);

    let activeBars = 0;


    if (Number.isFinite(value)) {

        if (value >= 26) {

            activeBars = 5;

        } else if (value >= 21) {

            activeBars = 4;

        } else if (value >= 16) {

            activeBars = 3;

        } else if (value >= 11) {

            activeBars = 2;

        } else if (value >= 0) {

            activeBars = 1;
        }
    }


    const activeColor =
        P.green;

    const inactiveColor =
        "rgba(255,255,255,0.20)";


    return (

        <div
            title={
                Number.isFinite(value)
                    ? `Signal strength: ${value}`
                    : "Signal strength unavailable"
            }

            style={{
                display:
                    "flex",

                alignItems:
                    "flex-end",

                gap:
                    3,

                height:
                    22,

                flexShrink:
                    0
            }}
        >

            {[1, 2, 3, 4, 5].map(
                (bar) => (

                    <div
                        key={bar}

                        style={{
                            width:
                                4,

                            height:
                                4 + bar * 3,

                            borderRadius:
                                2,

                            background:
                                bar <= activeBars
                                    ? activeColor
                                    : inactiveColor,

                            transition:
                                "background 0.2s ease"
                        }}
                    />

                )
            )}

        </div>
    );
}


// =====================================================
// RATING
// =====================================================

function formatRatingKW(rat) {

    const va =
        Number(rat);


    if (
        !Number.isFinite(va) ||
        va <= 0
    ) {

        return "--";
    }


    const kw =
        va / 1000;


    return String(
        parseFloat(
            kw.toFixed(2)
        )
    );
}


// =====================================================
// DEVICE INFO
// =====================================================

export default function DeviceInfo({

    data,
    lastUpdated,
    devices,
    selectedDeviceId,
    stickyTop

}) {

    // =====================================================
    // TICK EVERY SECOND
    // =====================================================

    const [, setNow] =
        useState(
            Date.now()
        );


    useEffect(() => {

        const timer =
            setInterval(
                () => {

                    setNow(
                        Date.now()
                    );

                },
                1000
            );


        return () =>
            clearInterval(
                timer
            );

    }, []);

const navigate = useNavigate();
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
    // SERIAL / IMEI
    // =====================================================

    const serialNumber =
        selectedDevice?.imei ??
        "--";


    // =====================================================
    // DEVICE TITLE
    // =====================================================
    //
    // Change this field later if your device object
    // has a proper device/site name.
    //

    const deviceTitle =
        selectedDevice?.name ||
        // selectedDevice?.site ||
        // selectedDevice?.location ||
        "--";


    // =====================================================
    // RATING
    // =====================================================

    const ratingKW =
        formatRatingKW(
            data?.RAT
        );


    // =====================================================
    // SIGNAL
    // =====================================================

    const csq =
        data?.csq;


    // =====================================================
    // LAST UPDATED
    // =====================================================

    const updatedAgo =
        formatUpdatedAgo(
            lastUpdated
        );


    // =====================================================
    // STICKY
    // =====================================================

    const isSticky =
        typeof stickyTop ===
        "number";


    // =====================================================
    // UI
    // =====================================================

    return (

        <div
            style={{
                width:
                    "100%",

                maxWidth:
                    700,

                 margin: "20px auto 16px",

            padding: "0 20px",

                boxSizing:
                    "border-box",

                ...(isSticky
                    ? {
                        position:
                            "sticky",

                        top:
                            stickyTop,

                        zIndex:
                            50
                    }
                    : {})
            }}
        >
            <button
    type="button"
    onClick={() => navigate("/saved-devices")}
    style={{
        border: "none",
        background: "transparent",
        paddingBottom: 10,
        margin: 0,
        color: "#ffffff",
        fontSize: 16,
        fontWeight: 800,
        fontFamily: "'DM Sans', sans-serif",
        cursor: "pointer",
        textAlign: "right",
        WebkitTapHighlightColor: "transparent",
    }}
>
    {selectedDevice?.nickname || "My Devices"}
</button>

            <div
                style={{
                    width:
                        "100%",

                    boxSizing:
                        "border-box",

                    background:
                        "rgba(22, 38, 45, 0.88)",

                    borderRadius:
                        16,

                    padding:
                        "16px 18px 16px 1px",

                    border:
                        "1px solid rgba(255,255,255,0.08)",

                    boxShadow:
                        P.shadowCard,

                    backdropFilter:
                        "blur(10px)",

                    WebkitBackdropFilter:
                        "blur(10px)",

                    display:
                        "flex",

                    alignItems:
                        "center",

                    justifyContent:
                        "space-between",

                    gap:
                        6,

                    overflow:
                        "hidden"
                }}
            >

                


                {/* =================================================
                    LEFT — LOGO
                ================================================= */}

                <div
                    style={{
                        display:
                            "flex",

                        alignItems:
                            "center",

                        minWidth:
                            0,

                        maxWidth:
                            "48%",

                        flexShrink:
                            0
                    }}
                >

                    <img
                        src={logo}

                        alt="Statcon Energiaa"

                        style={{
                            // increased from 46
                            height:
                                90,

                            width:
                                "auto",

                            maxWidth:
                                "100%",

                            objectFit:
                                "contain",

                            display:
                                "block",

                            flexShrink:
                                0,

                            filter:
                                "brightness(0) invert(1)",

                            opacity:
                                0.97
                        }}
                    />

                </div>


                {/* =================================================
                    RIGHT — DEVICE DETAILS
                ================================================= */}

                <div
                    style={{
                        minWidth:
                            0,

                        flex:
                            1,

                        display:
                            "flex",

                        flexDirection:
                            "column",

                        alignItems:
                            "flex-end",

                        textAlign:
                            "right",

                        gap:
                            4
                    }}
                >


                    {/* DEVICE TITLE */}

                    <div
                        style={{
                            fontSize:
                                17,

                            fontWeight:
                                800,

                            color:
                                "#ffffff",

                            fontFamily:
                                "'DM Sans', sans-serif",

                            maxWidth:
                                "100%",

                            overflowWrap:
                                "anywhere"
                        }}
                    >

                        {deviceTitle}

                    </div>


                    {/* IMEI */}

                    <div
                        style={{
                            fontSize:
                                13,

                            fontWeight:
                                600,

                            color:
                                "rgba(255,255,255,0.72)",

                            fontFamily:
                                "'Inter', sans-serif",

                            maxWidth:
                                "100%",

                            overflowWrap:
                                "anywhere"
                        }}
                    >

                        {serialNumber}

                    </div>


                    {/* RATING */}

                    <div
                        style={{
                            fontSize:
                                14,

                            fontWeight:
                                600,

                            color:
                                "rgba(255,255,255,0.9)",

                            fontFamily:
                                "'Inter', sans-serif",

                            whiteSpace:
                                "nowrap"
                        }}
                    >

                        Rating: {ratingKW}KW

                    </div>


                    {/* UPDATED + SIGNAL */}

                    <div
                        style={{
                            display:
                                "flex",

                            alignItems:
                                "center",

                            justifyContent:
                                "flex-end",

                            gap:
                                10,

                            maxWidth:
                                "100%"
                        }}
                    >

                        <div
                            style={{
                                fontSize:
                                    13,

                                fontWeight:
                                    500,

                                color:
                                    "rgba(255,255,255,0.65)",

                                fontFamily:
                                    "'Inter', sans-serif",

                                whiteSpace:
                                    "nowrap"
                            }}
                        >

                            Updated {updatedAgo}

                        </div>


                        <SignalStrength
                            csq={csq}
                        />

                    </div>

                </div>

            </div>

        </div>
    );
}