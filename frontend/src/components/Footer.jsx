// import React from "react";
// import { useNavigate, useLocation } from "react-router-dom";
// import P from "../theme/colors";

// export default function Footer() {

//     const navigate = useNavigate();
//     const location = useLocation();

//     // =====================================================
//     // NAVIGATION ITEMS
//     //
//     // Matches the 3-icon bottom bar from the app screenshots:
//     //   1. Plant / Home  -> live status + generation summary
//     //                       + CUF + chart + CO2/trees   (left1/left2.jpg)
//     //   2. Parameters    -> PV/AC parameters + status
//     //                       + faults                     (middle1/middle2.jpg)
//     //   3. Reports       -> device details + download
//     //                       report                       (Right.jpeg)
//     // =====================================================

//     const navItems = [

//         // =================================================
//         // 1. PLANT / HOME
//         // =================================================

//         {
//             label: "Plant",
//             path: "/",

//             icon: (
//                 <svg
//                     width="22"
//                     height="22"
//                     viewBox="0 0 24 24"
//                     fill="none"
//                     stroke="currentColor"
//                     strokeWidth="1.8"
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                 >
//                     {/* small monitor / plant-overview screen */}
//                     <rect x="3" y="4" width="18" height="12" rx="2" />
//                     <path d="M8 20h8" />
//                     <path d="M12 16v4" />
//                     {/* sun above the screen */}
//                     <circle cx="12" cy="9" r="2.1" />
//                     <path d="M12 4.3v1.1M7.8 6.2l.8.8M16.2 6.2l-.8.8" />
//                 </svg>
//             ),
//         },

//         // =================================================
//         // 2. PARAMETERS (gauge / speedometer)
//         // =================================================

//         {
//             label: "Parameters",
//             path: "/fault",

//             icon: (
//                 <svg
//                     width="22"
//                     height="22"
//                     viewBox="0 0 24 24"
//                     fill="none"
//                     stroke="currentColor"
//                     strokeWidth="1.8"
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                 >
//                     <path d="M4.5 16a7.5 7.5 0 1 1 15 0" />
//                     <path d="M4.5 16h15" />
//                     <path d="M12 16l4.2-5.2" />
//                     <circle cx="12" cy="16" r="1.1" fill="currentColor" stroke="none" />
//                 </svg>
//             ),
//         },

//         // =================================================
//         // 3. REPORTS / DETAILS
//         // =================================================

//         {
//             label: "Reports",
//             path: "/device-details",

//             icon: (
//                 <svg
//                     width="22"
//                     height="22"
//                     viewBox="0 0 24 24"
//                     fill="none"
//                     stroke="currentColor"
//                     strokeWidth="1.8"
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                 >
//                     <path d="M6 2.5h9l3 3V21a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1z" />
//                     <path d="M14.5 2.5V6h3.5" />
//                     <path d="M8.5 14v3M12 12v5M15.5 15.5V17" />
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
//                 left: "50%",
//                 transform: "translateX(-50%)",
//                 width: "100%",
//                 maxWidth: 520,
//                 height: 68,

//                 boxShadow: P.shadowNav,

//                 borderTop: `1px solid ${P.border}`,

//                 display: "flex",
//                 justifyContent: "space-around",
//                 alignItems: "center",

//                 fontFamily: "'Inter', sans-serif",

//                 zIndex: 1000,

//                 paddingBottom: "env(safe-area-inset-bottom)",

//                 boxSizing: "border-box",
//             }}
//         >

//             {navItems.map((item) => {

//                 const isActive =
//                     location.pathname === item.path;

//                 return (
//                     <div
//                         key={item.label}

//                         onClick={() =>
//                             navigate(item.path)
//                         }

//                         style={{
//                             flex: 1,

//                             display: "flex",
//                             flexDirection: "column",

//                             alignItems: "center",
//                             justifyContent: "center",

//                             gap: 3,

//                             cursor: "pointer",

//                             color:
//                                 isActive
//                                     ? P.amberDark
//                                     : P.textLight,

//                             transition: "0.2s",

//                             height: "100%",

//                             WebkitTapHighlightColor: "transparent",
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

//                                 fontWeight:
//                                     isActive
//                                         ? 700
//                                         : 500,

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

import { useNavigate } from "react-router-dom";

import P from "../theme/colors";

export default function Footer() {
  const navigate = useNavigate();

  // =====================================================
  // NAVIGATION
  // =====================================================

  const navItems = [
    // =================================================
    // PLANT / HOME
    // =================================================

    {
      name: "Plant",
      path: "/",
      label: "Plant",
      path: "/home",

      icon: (
        <svg
          width="34"
          height="34"
          viewBox="0 0 36 36"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {/* SUN */}

          <circle cx="18" cy="6" r="2.3" />

          <line x1="18" y1="1.5" x2="18" y2="3" />

          <line x1="13.8" y1="2.8" x2="14.9" y2="4" />

          <line x1="22.2" y1="2.8" x2="21.1" y2="4" />

          {/* SOLAR PANEL */}

          <path
            d="
                            M9 12
                            H27
                            L29 23
                            H7
                            Z
                        "
          />

          <line x1="13" y1="12" x2="12" y2="23" />

          <line x1="18" y1="12" x2="18" y2="23" />

          <line x1="23" y1="12" x2="24" y2="23" />

          <line x1="8" y1="17.5" x2="28" y2="17.5" />

          {/* STAND */}

          <line x1="18" y1="23" x2="18" y2="29" />

          <line x1="12" y1="29" x2="24" y2="29" />
        </svg>
      ),
    },

    // =================================================
    // PARAMETERS
    // =================================================

    {
      name: "Parameters",
      path: "/fault",

      icon: (
        <svg
          width="36"
          height="36"
          viewBox="0 0 36 36"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.9"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {/* OUTER GAUGE */}

          <path
            d="
                            M7 23
                            A11 11
                            0 0 1
                            29 23
                        "
          />

          {/* INNER GAUGE */}

          <path
            d="
                            M10 23
                            A8 8
                            0 0 1
                            26 23
                        "
          />

          {/* MARKERS */}

          <line x1="10" y1="17" x2="12" y2="18" />

          <line x1="14" y1="13.5" x2="15" y2="16" />

          <line x1="22" y1="13.5" x2="21" y2="16" />

          <line x1="26" y1="17" x2="24" y2="18" />

          {/* NEEDLE */}

          <line x1="18" y1="23" x2="24" y2="16" />

          <circle cx="18" cy="23" r="1.8" fill="currentColor" stroke="none" />
        </svg>
      ),
    },

    // =================================================
    // REPORTS
    // =================================================

    {
      name: "Reports",
      path: "/device-details",

      icon: (
        <svg
          width="34"
          height="34"
          viewBox="0 0 36 36"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {/* DOCUMENT */}

          <path
            d="
                            M10 4
                            H23
                            L28 9
                            V31
                            H10
                            Z
                        "
          />

          {/* CORNER */}

          <path
            d="
                            M23 4
                            V9
                            H28
                        "
          />

          {/* TEXT */}

          <line x1="14" y1="12" x2="23" y2="12" />

          <line x1="14" y1="15" x2="20" y2="15" />

          {/* CHART */}

          <line x1="14" y1="26" x2="24" y2="26" />

          <rect x="14" y="21" width="2.2" height="5" />

          <rect x="18" y="18" width="2.2" height="8" />

          <rect x="22" y="22" width="2.2" height="4" />
        </svg>
      ),
    },
  ];

  // =====================================================
  // UI
  // =====================================================

  return (
    <div
      style={{
        // =================================================
        // FIXED POSITION
        // =================================================

        position: "fixed",

        left: "50%",

        transform: "translateX(-50%)",

        bottom: "calc(16px + env(safe-area-inset-bottom))",

        // =================================================
        // SAME WIDTH / PADDING AS PAGE CARDS
        // =================================================

        width: "calc(100% - 40px)",

        maxWidth: 480,

        height: 72,

        boxSizing: "border-box",

        // =================================================
        // SAME DARK CARD DESIGN
        // =================================================

        background: "rgba(22, 38, 45, 0.88)",

        border: "1px solid rgba(255,255,255,0.08)",

        borderRadius: 14,

        boxShadow: P.shadowCardRaised,

        backdropFilter: "blur(6px)",

        WebkitBackdropFilter: "blur(6px)",

        // =================================================
        // LAYOUT
        // =================================================

        display: "grid",

        gridTemplateColumns: "repeat(3, 1fr)",

        alignItems: "center",

        padding: "8px 12px",

        zIndex: 1000,
      }}
    >
      {navItems.map((item) => (
        <button
          key={item.path}
          type="button"
          aria-label={item.name}
          onClick={() => navigate(item.path, { replace: true })}
          style={{
            // ---------------------------------
            // BUTTON RESET
            // ---------------------------------

            border: "none",

            outline: "none",

            background: "transparent",

            padding: 0,

            margin: 0,

            // ---------------------------------
            // FULL NAV ITEM AREA
            // ---------------------------------

            width: "100%",

            height: "100%",

            display: "flex",

            alignItems: "center",

            justifyContent: "center",

            // ---------------------------------
            // ALL ICONS ALWAYS WHITE
            // ---------------------------------

            color: "#ffffff",

            // ---------------------------------
            // INTERACTION
            // ---------------------------------

            cursor: "pointer",

            WebkitTapHighlightColor: "transparent",
          }}
        >
          {item.icon}
        </button>
      ))}
    </div>
  );
}
