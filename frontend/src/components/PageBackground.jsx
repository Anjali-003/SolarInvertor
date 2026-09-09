import React from "react";
import backgroundImage from "../assets/bg-2.jpeg";
import P from "../theme/colors";

export default function PageBackground({ children }) {
    return (
        <div
            style={{
                minHeight: "100vh",
                width: "100%",
                background: P.pageSide,
            }}
        >
            {/* PHONE-SIZED VISUAL AREA */}
            <div
                style={{
                    width: "100%",
                    maxWidth: 520,
                    minHeight: "100vh",
                    margin: "0 auto",
                    position: "relative",

                    // "clip" instead of "hidden": both clip overflowing
                    // children the same way, but "hidden" turns this box
                    // into a scroll container, which would stop the
                    // sticky header in DeviceInfo from ever sticking.
                    overflow: "clip",
                }}
            >
                {/* FIXED BACKGROUND IMAGE */}
                <div
                    style={{
                        position: "fixed",
                        top: 0,
                        bottom: 0,
                        left: "50%",
                        transform: "translateX(-50%)",
                        width: "100%",
                        maxWidth: 520,

                        backgroundImage: `
                            linear-gradient(
                                rgba(254, 249, 240, 0.30),
                                rgba(254, 249, 240, 0.30)
                            ),
                            url("${backgroundImage}")
                        `,
                        backgroundSize: "cover",
                        backgroundPosition: "center center",
                        backgroundRepeat: "no-repeat",

                        zIndex: 0,
                        pointerEvents: "none",
                    }}
                />

                {/* PAGE CONTENT */}
                <div
                    style={{
                        position: "relative",
                        zIndex: 1,
                        minHeight: "100vh",
                    }}
                >
                    {children}
                </div>
            </div>
        </div>
    );
}