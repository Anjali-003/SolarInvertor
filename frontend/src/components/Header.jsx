// const P = {
//   bg: "#FFFDF5",
//   surface: "#FFFFFF",
//   surfaceAlt: "#FFF8E7",
//   border: "#F0E0C0",
//   textPrimary: "#2C1A06",
//   textSecond: "#7A5230",
//   textMuted: "#B08050",
//   textDim: "#D4AA80",
//   deepAmber: "#F59E0B",
//   orange: "#F97316",
// };

// export default function Header({ data, lastUpdated, isLive }) {
//     return (
//         <div style={{
//             background: P.surfaceAlt,
//             borderBottom: `1px solid ${P.border}`,
//             padding: "18px 32px",
//             display: "flex", alignItems: "center",
//             justifyContent: "space-between", flexWrap: "wrap", gap: 12,
//         }}>
//             <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
//                 <div style={{
//                     width: 42, height: 42,
//                     background: `linear-gradient(135deg, ${P.deepAmber}, ${P.orange})`,
//                     borderRadius: 10,
//                     boxShadow: `0 4px 16px ${P.orange}44`,
//                     display: "flex", alignItems: "center", justifyContent: "center",
//                     flexShrink: 0,
//                 }}>
//                     <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
//                         stroke="#fff" strokeWidth="2.2" strokeLinecap="round">
//                         <circle cx="12" cy="12" r="4" />
//                         <line x1="12" y1="2" x2="12" y2="5" />
//                         <line x1="12" y1="19" x2="12" y2="22" />
//                         <line x1="2" y1="12" x2="5" y2="12" />
//                         <line x1="19" y1="12" x2="22" y2="12" />
//                         <line x1="4.22" y1="4.22" x2="6.34" y2="6.34" />
//                         <line x1="17.66" y1="17.66" x2="19.78" y2="19.78" />
//                         <line x1="19.78" y1="4.22" x2="17.66" y2="6.34" />
//                         <line x1="6.34" y1="17.66" x2="4.22" y2="19.78" />
//                     </svg>
//                 </div>
//                 <div>
//                     <div style={{
//                         fontSize: 18, fontWeight: 700,
//                         fontFamily: "'Space Mono', monospace",
//                         color: P.textPrimary, letterSpacing: -0.5,
//                     }}>
//                         Solar Inverter Monitor
//                     </div>
//                     {/* <div style={{
//                         fontSize: 10, color: P.textMuted,
//                         fontFamily: "'Space Mono', monospace", letterSpacing: 1,
//                     }}>
//                         IMEI: {data?.IMEI || "-"} · MQTT LIVE FEED
//                     </div> */}

//                     <div style={{
//                         fontSize: 10,
//                         color: P.textMuted,
//                         fontFamily: "'Space Mono', monospace",
//                         letterSpacing: 1,
//                     }}>
//                         Serial No: {data?.ASN_31 ?? "--"}
//                     </div>

//                 </div>
//             </div>

//             <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
//                 <div style={{ textAlign: "right" }}>
//                     <div style={{ fontSize: 10, color: P.textDim, fontFamily: "'Space Mono', monospace" }}>Last Update</div>
//                     <div style={{ fontSize: 12, color: P.textSecond, fontFamily: "'Space Mono', monospace" }}>
//                         {lastUpdated || "-"}
//                     </div>
//                 </div>

//                 <div style={{
//                     display: "flex", alignItems: "center", gap: 7,
//                     padding: "6px 14px", borderRadius: 20,
//                     background: isLive ? "#FFF3D0" : "#FEE2E2",
//                     border: `1.5px solid ${isLive ? P.deepAmber : "#FCA5A5"}`,
//                 }}>
//                     <div style={{
//                         width: 8, height: 8, borderRadius: "50%",
//                         background: isLive ? P.deepAmber : "#EF4444",
//                         boxShadow: isLive ? `0 0 7px ${P.deepAmber}` : "0 0 7px #EF4444",
//                         animation: "blink 1.5s infinite",
//                     }} />
//                     <span style={{
//                         fontSize: 10, fontWeight: 700,
//                         fontFamily: "'Space Mono', monospace",
//                         color: isLive ? P.deepAmber : "#DC2626",
//                         letterSpacing: 1.5,
//                     }}>
//                         {isLive ? "LIVE" : "OFFLINE"}
//                     </span>
//                 </div>
//             </div>
//         </div>
//     );
// }



// import { useNavigate, useLocation } from "react-router-dom";
// const P = {
//   bg: "#FFFDF5",
//   surface: "#FFFFFF",
//   surfaceAlt: "#FFF8E7",
//   border: "#F0E0C0",
//   textPrimary: "#2C1A06",
//   textSecond: "#7A5230",
//   textMuted: "#B08050",
//   textDim: "#D4AA80",
//   deepAmber: "#F59E0B",
//   orange: "#F97316",
// };


// export default function Header({ data, lastUpdated, isLive }) {
//   const navigate = useNavigate();
//   const location = useLocation();

//   const isActive = (path) => location.pathname === path;

//   return (
//     <div style={{
//       background: P.surfaceAlt,
//       borderBottom: `1px solid ${P.border}`,
//       padding: "18px 32px",
//       display: "flex",
//       alignItems: "center",
//       justifyContent: "space-between",
//       flexWrap: "wrap",
//       gap: 12,
//     }}>

//       {/* LEFT: Logo + Title (CLICKABLE) */}
//       <div
//         onClick={() => navigate("/")}
//         style={{
//           display: "flex",
//           alignItems: "center",
//           gap: 14,
//           cursor: "pointer",
//         }}
//       >
//         <div style={{
//           width: 42, height: 42,
//           background: `linear-gradient(135deg, ${P.deepAmber}, ${P.orange})`,
//           borderRadius: 10,
//           boxShadow: `0 4px 16px ${P.orange}44`,
//           display: "flex", alignItems: "center", justifyContent: "center",
//           flexShrink: 0,
//         }}>
//   <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
//     stroke="#fff" strokeWidth="2.2" strokeLinecap="round">
//     <circle cx="12" cy="12" r="4" />
//     <line x1="12" y1="2" x2="12" y2="5" />
//     <line x1="12" y1="19" x2="12" y2="22" />
//     <line x1="2" y1="12" x2="5" y2="12" />
//     <line x1="19" y1="12" x2="22" y2="12" />
//     <line x1="4.22" y1="4.22" x2="6.34" y2="6.34" />
//     <line x1="17.66" y1="17.66" x2="19.78" y2="19.78" />
//     <line x1="19.78" y1="4.22" x2="17.66" y2="6.34" />
//     <line x1="6.34" y1="17.66" x2="4.22" y2="19.78" />
//   </svg>
//         </div>

//         <div>
//           <div style={{
//             fontSize: 18,
//             fontWeight: 700,
//             fontFamily: "'Space Mono', monospace",
//             color: P.textPrimary,
//           }}>
//             Solar Inverter Monitor
//           </div>

//           <div style={{
//             fontSize: 10,
//             color: P.textMuted,
//             fontFamily: "'Space Mono', monospace",
//             letterSpacing: 1,
//           }}>
//             Serial No: {data?.ASN_31 ?? "--"}
//           </div>
//         </div>
//       </div>

//       {/* CENTER: NAVIGATION TABS */}
//       {/* <div style={{
//         display: "flex",
//         gap: 20,
//         alignItems: "center",
//       }}>
//         {[
//           { label: "Dashboard", path: "/" },
//           { label: "Power", path: "/power" },
//           { label: "Faults", path: "/faults" },
//         ].map((tab) => (
//           <span
//             key={tab.path}
//             onClick={() => navigate(tab.path)}
//             style={{
//               cursor: "pointer",
//               fontSize: 12,
//               fontFamily: "'Space Mono', monospace",
//               padding: "6px 10px",
//               borderRadius: 6,
//               transition: "all 0.2s",
//               color: isActive(tab.path) ? "#fff" : P.textMuted,
//               background: isActive(tab.path) ? P.deepAmber : "transparent",
//               border: isActive(tab.path)
//                 ? `1px solid ${P.deepAmber}`
//                 : "1px solid transparent",
//             }}
//           >
//             {tab.label}
//           </span>
//         ))}
//       </div> */}

//       {/* RIGHT: STATUS */}
//       <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
//         <div style={{ textAlign: "right" }}>
//           <div style={{
//             fontSize: 10,
//             color: P.textDim,
//             fontFamily: "'Space Mono', monospace"
//           }}>
//             Last Update
//           </div>
//           <div style={{
//             fontSize: 12,
//             color: P.textSecond,
//             fontFamily: "'Space Mono', monospace"
//           }}>
//             {lastUpdated || "-"}
//           </div>
//         </div>

//         <div style={{
//           display: "flex",
//           alignItems: "center",
//           gap: 7,
//           padding: "6px 14px",
//           borderRadius: 20,
//           background: isLive ? "#FFF3D0" : "#FEE2E2",
//           border: `1.5px solid ${isLive ? P.deepAmber : "#FCA5A5"}`,
//         }}>
//           <div style={{
//             width: 8,
//             height: 8,
//             borderRadius: "50%",
//             background: isLive ? P.deepAmber : "#EF4444",
//             boxShadow: isLive ? `0 0 7px ${P.deepAmber}` : "0 0 7px #EF4444",
//             animation: "blink 1.5s infinite",
//           }} />
//           <span style={{
//             fontSize: 10,
//             fontWeight: 700,
//             fontFamily: "'Space Mono', monospace",
//             color: isLive ? P.deepAmber : "#DC2626",
//             letterSpacing: 1.5,
//           }}>
//             {isLive ? "LIVE" : "OFFLINE"}
//           </span>
//         </div>
//       </div>
//     </div>
//   );
// }



import { useNavigate } from "react-router-dom";

const P = {
    bg: "#FFFDF5",
    surface: "#FFFFFF",
    surfaceAlt: "#FFF8E7",
    border: "#F0E0C0",
    textPrimary: "#2C1A06",
    textSecond: "#7A5230",
    textMuted: "#B08050",
    textDim: "#D4AA80",
    deepAmber: "#F59E0B",
    orange: "#F97316",
};

export default function Header({ data, lastUpdated, isLive, showBack }) {
    const navigate = useNavigate();

    return (
        <div style={{
            background: P.surfaceAlt,
            borderBottom: `1px solid ${P.border}`,
            padding: "18px 32px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 12,
        }}>

            {/* LEFT SIDE */}
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>

                {/* 🔙 Back Icon */}
                {/* {showBack && (
                    <div
                        onClick={() => navigate("/")}
                        style={{
                            width: 36,
                            height: 36,
                            borderRadius: 8,
                            border: `1px solid ${P.border}`,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            cursor: "pointer",
                            background: "#fff",
                        }}
                    >
                        <svg
                            width="18"
                            height="18"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke={P.textPrimary}
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <line x1="19" y1="12" x2="5" y2="12" />
                            <polyline points="12 19 5 12 12 5" />
                        </svg>
                    </div>
                )} */}

                {showBack && (
    <div
        onClick={() => navigate("/")}
        style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            cursor: "pointer",
            color: P.deepAmber,
            fontFamily: "'Space Mono', monospace",
            fontSize: 15,
            fontWeight: 700,
        }}
    >
        <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke={P.deepAmber}
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <polyline points="15 18 9 12 15 6" />
        </svg>
    </div>
)}

                {/* ICON */}
                <div style={{
                    width: 42,
                    height: 42,
                    background: `linear-gradient(135deg, ${P.deepAmber}, ${P.orange})`,
                    borderRadius: 10,
                    boxShadow: `0 4px 16px ${P.orange}44`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                }}>
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
                        stroke="#fff" strokeWidth="2.2" strokeLinecap="round">
                        <circle cx="12" cy="12" r="4" />
                        <line x1="12" y1="2" x2="12" y2="5" />
                        <line x1="12" y1="19" x2="12" y2="22" />
                        <line x1="2" y1="12" x2="5" y2="12" />
                        <line x1="19" y1="12" x2="22" y2="12" />
                        <line x1="4.22" y1="4.22" x2="6.34" y2="6.34" />
                        <line x1="17.66" y1="17.66" x2="19.78" y2="19.78" />
                        <line x1="19.78" y1="4.22" x2="17.66" y2="6.34" />
                        <line x1="6.34" y1="17.66" x2="4.22" y2="19.78" />
                    </svg>
                </div>

                {/* TITLE */}
                <div>
                    <div style={{
                        fontSize: 18,
                        fontWeight: 700,
                        fontFamily: "'Space Mono', monospace",
                        color: P.textPrimary,
                    }}>
                        Solar Inverter Monitor
                    </div>

                    <div style={{
                        fontSize: 10,
                        color: P.textMuted,
                        fontFamily: "'Space Mono', monospace",
                    }}>
                        Serial No: {data?.ASN_31 ?? "--"}
                    </div>
                </div>
            </div>

            {/* RIGHT SIDE */}
            <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
                <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: 10, color: P.textDim }}>
                        Last Update
                    </div>
                    <div style={{ fontSize: 12, color: P.textSecond }}>
                        {lastUpdated || "--"}
                    </div>
                </div>

                <div style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 7,
                    padding: "6px 14px",
                    borderRadius: 20,
                    background: isLive ? "#FFF3D0" : "#FEE2E2",
                    border: `1.5px solid ${isLive ? P.deepAmber : "#FCA5A5"}`,
                }}>
                    <div style={{
                        width: 8,
                        height: 8,
                        borderRadius: "50%",
                        background: isLive ? P.deepAmber : "#EF4444",
                    }} />
                    <span style={{
                        fontSize: 10,
                        fontWeight: 700,
                        color: isLive ? P.deepAmber : "#DC2626",
                    }}>
                        {isLive ? "LIVE" : "OFFLINE"}
                    </span>
                </div>
            </div>
        </div>
    );
}