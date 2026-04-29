// import React from "react";

// const P = {
//   surface: "#FFFFFF",
//   border: "#F0E0C0",
//   textPrimary: "#2C1A06",
//   textMuted: "#B08050",
//   textDim: "#D4AA80",
//   amber: "#FFB74D",
//   deepAmber: "#F59E0B",
//   orange: "#F97316",
// };

// export default function MetricCard({ label, value, unit, accent }) {
//   const displayVal = value === undefined || value === null ? "--" : value;

//   return (
//     <div
//       style={{
//         background: P.surface,
//         border: `1px solid ${P.border}`,
//         borderTop: `3px solid ${accent || P.amber}`,
//         borderRadius: 12,
//         padding: "20px",
//         display: "flex",
//         flexDirection: "column",
//         gap: 10,
//         boxShadow: "0 2px 12px rgba(180,120,40,0.07)",
//       }}
//     >
//       <div
//         style={{
//           fontSize: 10,
//           color: P.textMuted,
//           letterSpacing: 1,
//           textTransform: "uppercase",
//         }}
//       >
//         {label}
//       </div>

//       <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
//         <span
//           style={{
//             fontSize: 28,
//             fontWeight: 700,
//             color: P.textPrimary,
//           }}
//         >
//           {displayVal}
//         </span>

//         {unit && (
//           <span
//             style={{
//               fontSize: 12,
//               fontWeight: 600,
//               color: accent || P.amber,
//             }}
//           >
//             {unit}
//           </span>
//         )}
//       </div>

//       <div
//         style={{
//           fontSize: 9,
//           color: P.textDim,
//         }}
//       >
//         LIVE DATA
//       </div>
//     </div>
//   );
// }




import React from "react";

const P = {
  surface:     "#FFFFFF",
  border:      "#F0E0C0",
  textPrimary: "#2C1A06",
  textMuted:   "#B08050",
  textDim:     "#D4AA80",
  amber:       "#FFB74D",
  deepAmber:   "#F59E0B",
  orange:      "#F97316",
  red:         "#EF4444",
};

export default function MetricCard({ label, value, unit, accent, desc, active, index = 0 }) {
  const displayVal = value === undefined || value === null ? "--" : value;
  const color = accent || P.amber;

  return (
    <div
      style={{
        background: P.surface,
        border: `1px solid ${active ? `${P.red}55` : P.border}`,
        borderTop: `3px solid ${color}`,
        borderRadius: 12,
        padding: "20px",
        display: "flex",
        flexDirection: "column",
        gap: 10,
        boxShadow: active
          ? "0 2px 16px rgba(239,68,68,0.12)"
          : "0 2px 12px rgba(180,120,40,0.07)",
        animation: "fadeUp 0.4s ease both",
        animationDelay: `${index * 40}ms`,
        position: "relative",
        overflow: "hidden",
        transition: "transform 0.2s ease, box-shadow 0.2s ease",
        cursor: "default",
      }}
      onMouseEnter={e => {
        e.currentTarget.style.transform = "translateY(-3px)";
        e.currentTarget.style.boxShadow = active
          ? "0 8px 28px rgba(239,68,68,0.18)"
          : "0 8px 28px rgba(180,120,40,0.15)";
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = active
          ? "0 2px 16px rgba(239,68,68,0.12)"
          : "0 2px 12px rgba(180,120,40,0.07)";
      }}
    >
      {/* Corner wash */}
      <div style={{
        position: "absolute", top: 0, right: 0, width: 70, height: 70,
        background: `radial-gradient(circle at top right, ${color}14, transparent 70%)`,
        pointerEvents: "none",
      }} />

      {/* Active fault badge */}
      {/* {active && (
        <div style={{
          position: "absolute", top: 12, right: 12,
          display: "flex", alignItems: "center", gap: 5,
          background: `${P.red}15`,
          border: `1px solid ${P.red}55`,
          borderRadius: 20, padding: "2px 9px",
        }}>
          <span style={{
            width: 6, height: 6, borderRadius: "50%",
            background: P.red,
            boxShadow: `0 0 6px ${P.red}`,
            animation: "blink 1.5s infinite",
            flexShrink: 0,
          }} />
          <span style={{
            fontSize: 9, fontWeight: 700,
            color: P.red, letterSpacing: 1,
            fontFamily: "'Space Mono', monospace",
          }}>
            FAULT
          </span>
        </div>
      )} */}

      {/* Label */}
      <div style={{
        fontSize: 10, color: P.textMuted,
        letterSpacing: 1, textTransform: "uppercase",
        fontFamily: "'Space Mono', monospace",
      }}>
        {label}
      </div>

      {/* Value */}
      <div style={{ display: "flex", alignItems: "baseline", gap: 6, marginTop: 2 }}>
        <span style={{
          fontSize: 28, fontWeight: 700,
          color: active ? P.red : P.textPrimary,
          fontFamily: "'Space Mono', monospace",
          lineHeight: 1,
        }}>
          {displayVal}
        </span>
        {unit && (
          <span style={{
            fontSize: 12, fontWeight: 600,
            color: color,
            fontFamily: "'Space Mono', monospace",
          }}>
            {unit}
          </span>
        )}
      </div>

      {/* Description */}
      <div style={{
        fontSize: 9, color: P.textDim,
        fontFamily: "'Space Mono', monospace", letterSpacing: 0.5,
      }}>
        {desc || "LIVE DATA"}
      </div>
    </div>
  );
}