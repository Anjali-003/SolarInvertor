import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import P from "../theme/colors";

export default function Footer() {

    const navigate = useNavigate();
    const location = useLocation();

    // =====================================================
    // NAVIGATION ITEMS
    //
    // Matches the 3-icon bottom bar from the app screenshots:
    //   1. Plant / Home  -> live status + generation summary
    //                       + CUF + chart + CO2/trees   (left1/left2.jpg)
    //   2. Parameters    -> PV/AC parameters + status
    //                       + faults                     (middle1/middle2.jpg)
    //   3. Reports       -> device details + download
    //                       report                       (Right.jpeg)
    // =====================================================

    const navItems = [

        // =================================================
        // 1. PLANT / HOME
        // =================================================

        {
            label: "Plant",
            path: "/home",

            icon: (
                <svg
                    width="22"
                    height="22"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
                    {/* small monitor / plant-overview screen */}
                    <rect x="3" y="4" width="18" height="12" rx="2" />
                    <path d="M8 20h8" />
                    <path d="M12 16v4" />
                    {/* sun above the screen */}
                    <circle cx="12" cy="9" r="2.1" />
                    <path d="M12 4.3v1.1M7.8 6.2l.8.8M16.2 6.2l-.8.8" />
                </svg>
            ),
        },


        // =================================================
        // 2. PARAMETERS (gauge / speedometer)
        // =================================================

        {
            label: "Parameters",
            path: "/fault",

            icon: (
                <svg
                    width="22"
                    height="22"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
                    <path d="M4.5 16a7.5 7.5 0 1 1 15 0" />
                    <path d="M4.5 16h15" />
                    <path d="M12 16l4.2-5.2" />
                    <circle cx="12" cy="16" r="1.1" fill="currentColor" stroke="none" />
                </svg>
            ),
        },


        // =================================================
        // 3. REPORTS / DETAILS
        // =================================================

        {
            label: "Reports",
            path: "/device-details",

            icon: (
                <svg
                    width="22"
                    height="22"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
                    <path d="M6 2.5h9l3 3V21a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1z" />
                    <path d="M14.5 2.5V6h3.5" />
                    <path d="M8.5 14v3M12 12v5M15.5 15.5V17" />
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

                borderTop: `1px solid ${P.border}`,

                display: "flex",
                justifyContent: "space-around",
                alignItems: "center",

                fontFamily: "'Inter', sans-serif",

                zIndex: 1000,

                paddingBottom: "env(safe-area-inset-bottom)",

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

                            transition: "0.2s",

                            height: "100%",

                            WebkitTapHighlightColor: "transparent",
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

                                fontFamily: "'Inter', sans-serif",
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
