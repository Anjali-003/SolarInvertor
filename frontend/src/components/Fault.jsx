// import { useLocation, useNavigate } from "react-router-dom";

// const faultMeaning = {
//   FT1: ["Normal", "VAC High", "VAC Low", "Grid Voltage Fail"],
//   FT2: ["Normal", "Frequency High", "Frequency Low"],
//   FT3: [
//     "Normal",
//     "AC Output Overload",
//     "PV Short Circuit",
//     "AC Short Circuit",
//     "Leakage Current High"
//   ],
//   FT4: ["Normal", "High Temperature"],
//   FT5: ["Normal", "Other Fault"]
// };

// export default function FaultPage() {
//   const navigate = useNavigate();
//   const { state } = useLocation();
//   const data = state?.data || {};

//   const getFault = (key, val) => {
//     if (val == null) return "--";
//     return faultMeaning[key]?.[val] || "Unknown";
//   };

//   return (
//     <div style={{ padding: 30 }}>
//       <button onClick={() => navigate("/")}>⬅ Back</button>

//       <h2>Fault Details</h2>

//       <ul>
//         <li>Fault 1: {getFault("FT1", data["IS-1-0---FT1"])}</li>
//         <li>Fault 2: {getFault("FT2", data["IS-1-0---FT2"])}</li>
//         <li>Fault 3: {getFault("FT3", data["IS-1-0---FT3"])}</li>
//         <li>Fault 4: {getFault("FT4", data["IS-1-0---FT4"])}</li>
//         <li>Fault 5: {getFault("FT5", data["IS-1-0---FT5"])}</li>
//       </ul>
//     </div>
//   );
// }

// Simple List Data

// import { useNavigate } from "react-router-dom";
// import { useInverter } from "../context/Context";

// const faultMeaning = {
//   FT1: ["Normal", "VAC High", "VAC Low", "Grid Voltage Fail"],
//   FT2: ["Normal", "Frequency High", "Frequency Low"],
//   FT3: [
//     "Normal",
//     "AC Output Overload",
//     "PV Short Circuit",
//     "AC Short Circuit",
//     "Leakage Current High"
//   ],
//   FT4: ["Normal", "High Temperature"],
//   FT5: ["Normal", "Other Fault"]
// };

// export default function FaultPage() {
//   const navigate = useNavigate();
//   const { data } = useInverter();

//   const getFault = (key, val) => {
//     if (val == null) return "--";
//     return faultMeaning[key]?.[val] || "Unknown";
//   };

//   return (
//     <div style={{ padding: 30 }}>
//       <button onClick={() => navigate("/")}>⬅ Back</button>

//       <h2>Fault Details</h2>

//       <ul>
//         <li>Fault 1: {getFault("FT1", data?.["IS-1-0---FT1"])}</li>
//         <li>Fault 2: {getFault("FT2", data?.["IS-1-0---FT2"])}</li>
//         <li>Fault 3: {getFault("FT3", data?.["IS-1-0---FT3"])}</li>
//         <li>Fault 4: {getFault("FT4", data?.["IS-1-0---FT4"])}</li>
//         <li>Fault 5: {getFault("FT5", data?.["IS-1-0---FT5"])}</li>
//       </ul>
//     </div>
//   );
// }


// Adding the UI

// import { useNavigate } from "react-router-dom";
// import { useInverter } from "../context/Context";
// import Header from "../components/Header";
// import Footer from "../components/Footer";
// import MetricCard from "../components/MetricCard";

// const faultMeaning = {
//   FT1: ["Normal", "VAC High", "VAC Low", "Grid Voltage Fail"],
//   FT2: ["Normal", "Frequency High", "Frequency Low"],
//   FT3: [
//     "Normal",
//     "AC Output Overload",
//     "PV Short Circuit",
//     "AC Short Circuit",
//     "Leakage Current High",
//   ],
//   FT4: ["Normal", "High Temperature"],
//   FT5: ["Normal", "Other Fault"],
// };

// export default function FaultPage() {
//   const { data, lastUpdated } = useInverter();
//   const navigate = useNavigate();

//   const getFault = (key, val) => {
//     if (val == null) return "--";
//     return faultMeaning[key]?.[val] || "Unknown";
//   };

//   return (
//     <div style={{ padding: "30px" }}>
//       {/* <button onClick={() => navigate("/")}>⬅ Back</button>

//       <h2 style={{ margin: "20px 0" }}>Fault Details</h2> */}
//        <Header data={data} lastUpdated={lastUpdated} isLive={true} />

//       <div
//         style={{
//           display: "grid",
//           gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
//           gap: 20,
//         }}
//       >
//         <MetricCard label="Fault 1" value={getFault("FT1", data?.["IS-1-0---FT1"])} accent="#EF4444" />
//         <MetricCard label="Fault 2" value={getFault("FT2", data?.["IS-1-0---FT2"])} accent="#EF4444" />
//         <MetricCard label="Fault 3" value={getFault("FT3", data?.["IS-1-0---FT3"])} accent="#EF4444" />
//         <MetricCard label="Fault 4" value={getFault("FT4", data?.["IS-1-0---FT4"])} accent="#EF4444" />
//         <MetricCard label="Fault 5" value={getFault("FT5", data?.["IS-1-0---FT5"])} accent="#EF4444" />

//         <Footer data={data} />
//       </div>
//     </div>
//   );
// }


// import { useNavigate } from "react-router-dom";
// import { useInverter } from "../context/Context";
// import Header from "../components/Header";
// import Footer from "../components/Footer";
// import MetricCard from "../components/MetricCard";

// const faultMeaning = {
//   FT1: ["Normal", "VAC High", "VAC Low", "Grid Voltage Fail"],
//   FT2: ["Normal", "Frequency High", "Frequency Low"],
//   FT3: [
//     "Normal",
//     "AC Output Overload",
//     "PV Short Circuit",
//     "AC Short Circuit",
//     "Leakage Current High",
//   ],
//   FT4: ["Normal", "High Temperature"],
//   FT5: ["Normal", "Other Fault"],
// };

// export default function FaultPage() {
//   const { data, lastUpdated } = useInverter();
//   const navigate = useNavigate();

//   const getFault = (key, val) => {
//     if (val == null) return "--";
//     return faultMeaning[key]?.[val] || "Unknown";
//   };

//   return (
//     <div
//       style={{
//         minHeight: "100vh",
//         display: "flex",
//         flexDirection: "column",
//       }}
//     >
//       {/* ✅ Header */}
//       <Header data={data} lastUpdated={lastUpdated} isLive={true} showBack />

//       {/* ✅ Content */}
//       <div style={{ flex: 1, padding: "24px 32px" }}>
//         {/* Back Button */}
//         {/* <button
//           onClick={() => navigate("/")}
//           style={{
//             marginBottom: 20,
//             padding: "6px 12px",
//             cursor: "pointer",
//           }}
//         >
//           ⬅ Back
//         </button> */}

//         <h2 style={{ marginBottom: 20 }}>Fault Details</h2>

//         {/* Grid */}
//         <div
//           style={{
//             display: "grid",
//             gridTemplateColumns: "repeat(3, 1fr)", // 3 per row
//             gap: 20,
//           }}
//         >
//           <MetricCard
//             label="Fault 1"
//             value={getFault("FT1", data?.["IS-1-0---FT1"])}
//             accent="#EF4444"
//           />
//           <MetricCard
//             label="Fault 2"
//             value={getFault("FT2", data?.["IS-1-0---FT2"])}
//             accent="#EF4444"
//           />
//           <MetricCard
//             label="Fault 3"
//             value={getFault("FT3", data?.["IS-1-0---FT3"])}
//             accent="#EF4444"
//           />
//           <MetricCard
//             label="Fault 4"
//             value={getFault("FT4", data?.["IS-1-0---FT4"])}
//             accent="#EF4444"
//           />
//           <MetricCard
//             label="Fault 5"
//             value={getFault("FT5", data?.["IS-1-0---FT5"])}
//             accent="#EF4444"
//           />
//         </div>
//       </div>

//       {/* ✅ Footer (OUTSIDE grid) */}
//       <Footer data={data} />
//     </div>
//   );
// }








import { useNavigate } from "react-router-dom";
import { useInverter } from "../context/Context";
import Header from "../components/Header";
import Footer from "../components/Footer";
import MetricCard from "../components/MetricCard";

// ─── Palette (same as Dashboard) ─────────────────────────────────────────────
const P = {
  bg:          "#FFFDF5",
  surface:     "#FFFFFF",
  surfaceAlt:  "#FFF8E7",
  border:      "#F0E0C0",
  textPrimary: "#2C1A06",
  textSecond:  "#7A5230",
  textMuted:   "#B08050",
  textDim:     "#D4AA80",
  amber:       "#FFB74D",
  deepAmber:   "#F59E0B",
  orange:      "#F97316",
  red:         "#EF4444",
  redLight:    "#FEE2E2",
  redBorder:   "#FCA5A5",
};

// ─── Fault definitions ────────────────────────────────────────────────────────
const FAULT_DEFS = [
  {
    key: "FT1",
    mqttKey: "IS-1-0---FT1",
    label: "Fault 1",
    desc: "Voltage Fault",
    meanings: ["Normal", "VAC High", "VAC Low", "Grid Voltage Fail"],
  },
  {
    key: "FT2",
    mqttKey: "IS-1-0---FT2",
    label: "Fault 2",
    desc: "Frequency Fault",
    meanings: ["Normal", "Frequency High", "Frequency Low"],
  },
  {
    key: "FT3",
    mqttKey: "IS-1-0---FT3",
    label: "Fault 3",
    desc: "Output / Circuit Fault",
    meanings: [
      "Normal",
      "AC Output Overload",
      "PV Short Circuit",
      "AC Short Circuit",
      "Leakage Current High",
    ],
  },
  {
    key: "FT4",
    mqttKey: "IS-1-0---FT4",
    label: "Fault 4",
    desc: "Temperature Fault",
    meanings: ["Normal", "High Temperature"],
  },
  {
    key: "FT5",
    mqttKey: "IS-1-0---FT5",
    label: "Fault 5",
    desc: "Other Fault",
    meanings: ["Normal", "Other Fault"],
  },
];

// ─── Summary Bar ──────────────────────────────────────────────────────────────
// function FaultSummaryBar({ data }) {
//   const activeFaults = FAULT_DEFS.filter(f => {
//     const val = data?.[f.mqttKey];
//     return val != null && val !== 0;
//   });

//   const pills = [
//     {
//       label: "Active Faults",
//       value: data == null ? "--" : String(activeFaults.length),
//       accent: activeFaults.length > 0 ? P.red : P.deepAmber,
//     },
//     {
//       label: "Fault Status",
//       value: data == null ? "--" : activeFaults.length > 0 ? "FAULT DETECTED" : "ALL NORMAL",
//       accent: activeFaults.length > 0 ? P.red : P.deepAmber,
//     },
//     {
//       label: "Last Update",
//       value: data?.TIMESTAMP ?? "--",
//       accent: P.amber,
//     },
//   ];

//   return (
//     <div style={{
//       display: "flex", gap: 12, flexWrap: "wrap",
//       padding: "14px 32px",
//       background: "#FFF9EE",
//       borderBottom: `1px solid ${P.border}`,
//     }}>
//       {pills.map(p => (
//         <div key={p.label} style={{
//           display: "flex", alignItems: "center", gap: 10,
//           background: "#FFFFFF",
//           border: `1px solid ${P.border}`,
//           borderLeft: `3px solid ${p.accent}`,
//           borderRadius: 10, padding: "8px 16px",
//           flex: "1 1 140px", minWidth: 120,
//           boxShadow: "0 1px 6px rgba(180,120,40,0.06)",
//         }}>
//           <div>
//             <div style={{
//               fontSize: 9, color: P.textDim,
//               fontFamily: "'Space Mono', monospace", letterSpacing: 1,
//             }}>
//               {p.label}
//             </div>
//             <div style={{
//               fontSize: 17, fontWeight: 700,
//               fontFamily: "'Space Mono', monospace", color: p.accent,
//             }}>
//               {p.value}
//             </div>
//           </div>
//         </div>
//       ))}
//     </div>
//   );
// }

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function FaultPage() {
  const { data, lastUpdated } = useInverter();
  const navigate = useNavigate();

  const getFaultLabel = (def) => {
    const val = data?.[def.mqttKey];
    if (val == null) return "--";
    return def.meanings[val] ?? "Unknown";
  };

  const isActiveFault = (def) => {
    const val = data?.[def.mqttKey];
    return val != null && val !== 0;
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0.3; }
        }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: ${P.bg}; }
        ::-webkit-scrollbar-thumb { background: ${P.border}; border-radius: 3px; }
      `}</style>

      <div style={{
        minHeight: "100vh",
        background: P.bg,
        color: P.textPrimary,
        fontFamily: "'Space Mono', monospace",
        display: "flex", flexDirection: "column",
      }}>
        {/* Header */}
        <Header data={data} lastUpdated={lastUpdated} isLive={true} showBack />

        {/* Summary bar */}
        {/* <FaultSummaryBar data={data} /> */}

        {/* Title strip */}
        {/* <div style={{
          padding: "10px 32px",
          background: "#FFFBF0",
          borderBottom: `1px solid ${P.border}`,
          display: "flex", alignItems: "center",
          justifyContent: "space-between", gap: 12, flexWrap: "wrap",
        }}>
          <div style={{ fontSize: 10, color: P.textDim, letterSpacing: 1 }}>
            FAULT DIAGNOSTICS
          </div>
          <button
            onClick={() => navigate("/")}
            style={{
              background: "transparent",
              border: `1px solid ${P.border}`,
              borderRadius: 8,
              color: P.textMuted,
              padding: "4px 14px",
              fontSize: 10, cursor: "pointer",
              letterSpacing: 1,
              fontFamily: "'Space Mono', monospace",
            }}
          >
            BACK TO DASHBOARD
          </button>
        </div> */}

        {/* Card Grid */}
        <div style={{
          flex: 1,
          padding: "28px 32px",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 360px), 1fr))",
          gap: 20,
          width: "100%",
          alignContent: "start",
        }}>
          {FAULT_DEFS.map((def, i) => {
            const active = isActiveFault(def);
            return (
              <MetricCard
                key={def.key}
                label={def.label}
                value={getFaultLabel(def)}
                unit=""
                accent={active ? P.red : P.deepAmber}
                desc={def.desc}
                active={active}
                index={i}
              />
            );
          })}
        </div>

        {/* Footer */}
        <Footer data={data} />
      </div>
    </>
  );
}








// uses the metric card ui from dashboard

// import { useNavigate } from "react-router-dom";
// import { useInverter } from "../context/Context";
// import { MetricCard } from "../components/Dashboard";

// const FAULT_FIELDS = [
//   { label: "Fault 1", key: "IS-1-0---FT1", desc: "Grid Voltage Issues" },
//   { label: "Fault 2", key: "IS-1-0---FT2", desc: "Frequency Issues" },
//   { label: "Fault 3", key: "IS-1-0---FT3", desc: "Load / Short Circuit" },
//   { label: "Fault 4", key: "IS-1-0---FT4", desc: "Temperature Fault" },
//   { label: "Fault 5", key: "IS-1-0---FT5", desc: "Other Faults" },
// ];

// const faultMeaning = {
//   FT1: ["Normal", "VAC High", "VAC Low", "Grid Voltage Fail"],
//   FT2: ["Normal", "Frequency High", "Frequency Low"],
//   FT3: [
//     "Normal",
//     "AC Output Overload",
//     "PV Short Circuit",
//     "AC Short Circuit",
//     "Leakage Current High",
//   ],
//   FT4: ["Normal", "High Temperature"],
//   FT5: ["Normal", "Other Fault"],
// };

// function getFault(key, val) {
//   if (val == null) return "--";
//   return faultMeaning[key]?.[val] || "Unknown";
// }

// export default function FaultPage() {
//   const navigate = useNavigate();
//   const { data } = useInverter();

//   return (
//     <div style={{ padding: "28px 32px" }}>
//       <button onClick={() => navigate("/")}>⬅ Back</button>

//       <h2 style={{ margin: "20px 0" }}>Fault Details</h2>

//       <div
//         style={{
//           display: "grid",
//           gridTemplateColumns: "repeat(3, 1fr)",
//           gap: 16,
//         }}
//       >
//         {FAULT_FIELDS.map((field, i) => {
//           const rawVal = data?.[field.key];
//           const keyShort = field.key.replace("IS-1-0---", "");

//           return (
//             <MetricCard
//               key={field.key}
//               field={{
//                 ...field,
//                 label: field.label,
//                 desc: getFault(keyShort, rawVal), // 👈 dynamic fault text
//               }}
//               value={rawVal}
//               index={i}
//             />
//           );
//         })}
//       </div>
//     </div>
//   );
// }