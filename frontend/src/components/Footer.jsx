// import React from "react";
// import { useNavigate, useLocation } from "react-router-dom";
// import P from "../theme/colors";

// export default function Footer() {

//     const navigate = useNavigate();
//     const location = useLocation();

//     // NAVIGATION ITEMS
//     const navItems = [
//         {
//             label: "Fault",
//             path: "/fault",

//             icon: (
//                 <svg
//                     width="22"
//                     height="22"
//                     viewBox="0 0 24 24"
//                     fill="none"
//                     stroke="currentColor"
//                     strokeWidth="2"
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                 >
//                     <polygon points="12 2 22 20 2 20 12 2" />
//                     <line x1="12" y1="8" x2="12" y2="13" />
//                     <circle cx="12" cy="17" r="1" />
//                 </svg>
//             ),
//         },

//          {
//             label: "Home",
//             path: "/",

//             icon: (
//                 <svg
//                     width="22"
//                     height="22"
//                     viewBox="0 0 24 24"
//                     fill="none"
//                     stroke="currentColor"
//                     strokeWidth="2"
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                 >
//                     <path d="M3 10.5L12 3l9 7.5" />
//                     <path d="M5 9.5V21h14V9.5" />
//                 </svg>
//             ),
//         },


//         {
//             label: "Power",
//             path: "/power",

//             icon: (
//                 <svg
//                     width="22"
//                     height="22"
//                     viewBox="0 0 24 24"
//                     fill="none"
//                     stroke="currentColor"
//                     strokeWidth="2"
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                 >
//                     <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
//                 </svg>
//             ),
//         },

       
//         {
//             label: "User",
//             path: "/user",

//             icon: (
//                 <svg
//                     width="22"
//                     height="22"
//                     viewBox="0 0 24 24"
//                     fill="none"
//                     stroke="currentColor"
//                     strokeWidth="2"
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                 >
//                     <circle cx="12" cy="8" r="4" />
//                     <path d="M4 21c1.5-4 5-6 8-6s6.5 2 8 6" />
//                 </svg>
//             ),
//         },
//     ];

//     return (
//         <div
//             style={{
//                 background: P.surface,
//                 position: "fixed",
//                 bottom: 0,
//                 left: 0,
//                 right: 0,
//                 height: 68,
//                 boxShadow: P.shadowNav,
//                 borderTop: "1px solid ${P.border}",
//                 display: "flex",
//                 justifyContent: "space-around",
//                 alignItems: "center",
//                 fontFamily: "'Inter', sans-serif",
//             }}
//         >

//             {navItems.map((item) => {

//                 const isActive =
//                     location.pathname === item.path;

//                 return (
//                     <div
//                         key={item.label}
//                         onClick={() => navigate(item.path)}
//                         style={{
//                             flex: 1,
//                             display: "flex",
//                             flexDirection: "column",
//                             alignItems: "center",
//                             justifyContent: "center",
//                             gap: 3,
//                             cursor: "pointer",
//                             color: isActive ? P.amberDark : P.textLight,
//                             transition: "0.2s",
//                         }}
//                     >

//                         {/* ICON */}
//                         <div
//                             style={{
//                                 display: "flex",
//                                 alignItems: "center",
//                                 justifyContent: "center",
//                             }}
//                         >
//                             {item.icon}
//                         </div>

//                         {/* LABEL */}
//                         <div
//                             style={{
//                                 fontSize: 11,
//                                 fontWeight: isActive ? 700 : 500,
//                                 fontFamily: "'Inter', sans-serif",
//                             }}
//                         >
//                             {item.label}
//                         </div>
//                     </div>
//                 );
//             })}
//         </div>
//     );
// }





import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import P from "../theme/colors";

export default function Footer() {

    const navigate = useNavigate();
    const location = useLocation();

    // =====================================================
    // NAVIGATION ITEMS
    // =====================================================

    const navItems = [

        // =================================================
        // FAULT
        // =================================================

        {
            label: "Fault",
            path: "/fault",

            icon: (
                <svg
                    width="22"
                    height="22"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
                    <polygon points="12 2 22 20 2 20 12 2" />
                    <line
                        x1="12"
                        y1="8"
                        x2="12"
                        y2="13"
                    />
                    <circle
                        cx="12"
                        cy="17"
                        r="1"
                    />
                </svg>
            ),
        },


        // =================================================
        // POWER
        // =================================================

        {
            label: "Power",
            path: "/power",

            icon: (
                <svg
                    width="22"
                    height="22"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
                    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                </svg>
            ),
        },


        
        // =================================================
        // HOME
        // =================================================

        {
            label: "Home",
            path: "/",

            icon: (
                <svg
                    width="22"
                    height="22"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
                    <path d="M3 10.5L12 3l9 7.5" />
                    <path d="M5 9.5V21h14V9.5" />
                </svg>
            ),
        },




        // =================================================
        // DEVICE
        // =================================================

        {
            label: "Device",
            path: "/device-details",

            icon: (
                <svg
                    width="22"
                    height="22"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
                    {/* Device body */}
                    <rect
                        x="5"
                        y="2"
                        width="14"
                        height="20"
                        rx="2"
                        ry="2"
                    />

                    {/* Screen */}
                    <rect
                        x="8"
                        y="5"
                        width="8"
                        height="7"
                        rx="1"
                    />

                    {/* Bottom indicators */}
                    <circle
                        cx="9"
                        cy="16"
                        r="1"
                    />

                    <circle
                        cx="12"
                        cy="16"
                        r="1"
                    />

                    <circle
                        cx="15"
                        cy="16"
                        r="1"
                    />
                </svg>
            ),
        },


        // =================================================
        // USER
        // =================================================

        {
            label: "User",
            path: "/user",

            icon: (
                <svg
                    width="22"
                    height="22"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
                    <circle
                        cx="12"
                        cy="8"
                        r="4"
                    />

                    <path
                        d="M4 21c1.5-4 5-6 8-6s6.5 2 8 6"
                    />
                </svg>
            ),
        },
    ];


    return (
        <div
            style={{
                background: P.surface,

                position: "fixed",
                bottom: 0,
                left: "50%",
                transform: "translateX(-50%)",
                width: "100%",
                maxWidth: 520,
                height: 68,

                boxShadow: P.shadowNav,

                // FIXED
                borderTop: `1px solid ${P.border}`,

                display: "flex",
                justifyContent: "space-around",
                alignItems: "center",

                fontFamily: "'Inter', sans-serif",

                // Make sure it stays above page content
                zIndex: 1000,

                // Helps on phones with a bottom safe area
                paddingBottom:
                    "env(safe-area-inset-bottom)",

                boxSizing: "border-box",
            }}
        >

            {navItems.map((item) => {

                const isActive =
                    location.pathname === item.path;

                return (
                    <div
                        key={item.label}

                        onClick={() =>
                            navigate(item.path)
                        }

                        style={{
                            flex: 1,

                            display: "flex",
                            flexDirection: "column",

                            alignItems: "center",
                            justifyContent: "center",

                            gap: 3,

                            cursor: "pointer",

                            color:
                                isActive
                                    ? P.amberDark
                                    : P.textLight,

                            transition:
                                "0.2s",

                            height: "100%",

                            WebkitTapHighlightColor:
                                "transparent",
                        }}
                    >

                        {/* ICON */}

                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                            }}
                        >
                            {item.icon}
                        </div>


                        {/* LABEL */}

                        <div
                            style={{
                                fontSize: 11,

                                fontWeight:
                                    isActive
                                        ? 700
                                        : 500,

                                fontFamily:
                                    "'Inter', sans-serif",
                            }}
                        >
                            {item.label}
                        </div>

                    </div>
                );
            })}

        </div>
    );
}