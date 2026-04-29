// import { useLocation, useNavigate } from "react-router-dom";

// export default function PowerPage() {
//   const navigate = useNavigate();
//   const { state } = useLocation();
//   const data = state?.data || {};

//   return (
//     <div style={{ padding: 30 }}>
//       <button onClick={() => navigate("/")}>⬅ Back</button>

//       <h2>Power Details</h2>

//       <ul>
//         <li>Active Power: {data["IS-1-0---POW"] ?? "--"} W</li>
//         <li>Today Energy: {data["IS-1-0---TKWH"] ?? "--"} kWh</li>
//         <li>Today On Time: {data["IS-1-0---TON"] ?? "--"} hrs</li>
//         <li>Lifetime Energy: {data["IS-1-0---LKWH"] ?? "--"} kWh</li>
//         <li>Lifetime Running: {data["IS-1-0---LON"] ?? "--"} hrs</li>
//       </ul>
//     </div>
//   );
// }


// Simple List Data

// import { useNavigate } from "react-router-dom";
// import { useInverter } from "../context/Context";

// export default function PowerPage() {
//   const navigate = useNavigate();
//   const { data } = useInverter();

//   return (
//     <div style={{ padding: 30 }}>
//       <button onClick={() => navigate("/")}>⬅ Back</button>

//       <h2>Power Details</h2>

//       <ul>
//         <li>Active Power: {data?.["IS-1-0---POW"] ?? "--"} W</li>
//         <li>Today Energy: {data?.["IS-1-0---TKWH"] ?? "--"} kWh</li>
//         <li>Today On Time: {data?.["IS-1-0---TON"] ?? "--"} hrs</li>
//         <li>Lifetime Energy: {data?.["IS-1-0---LKWH"] ?? "--"} kWh</li>
//         <li>Lifetime Running: {data?.["IS-1-0---LON"] ?? "--"} hrs</li>
//       </ul>
//     </div>
//   );
// }




// // Adding the UI
// import { useNavigate } from "react-router-dom";
// import Header from "../components/Header";
// import Footer from "../components/Footer";
// import { useInverter } from "../context/Context";
// import { MetricCard } from "../components/Dashboard"; 

// const POWER_FIELDS = [
//   { label: "Active Power", key: "IS-1-0---POW", unit: "W", desc: "Current Output Power" },
//   { label: "Today Energy", key: "IS-1-0---TKWH", unit: "kWh", desc: "Energy Generated Today" },
//   { label: "Today On Time", key: "IS-1-0---TON", unit: "hrs", desc: "Today's Runtime" },
//   { label: "Lifetime Energy", key: "IS-1-0---LKWH", unit: "kWh", desc: "Total Energy Generated" },
//   { label: "Lifetime Running", key: "IS-1-0---LON", unit: "hrs", desc: "Total Runtime" },
// ];

// export default function PowerPage() {
//   const navigate = useNavigate();
//   const { data } = useInverter();

//   return (
//     <div style={{ padding: "28px 32px" }}>
//       <button onClick={() => navigate("/")}>⬅ Back</button>

//       <h2 style={{ margin: "20px 0" }}>Power Details</h2>

//       <div
//         style={{
//           display: "grid",
//           gridTemplateColumns: "repeat(3, 1fr)", // same as dashboard
//           gap: 16,
//         }}
//       >
//         {POWER_FIELDS.map((field, i) => (
//           <MetricCard
//             key={field.key}
//             field={field}
//             value={data?.[field.key]}
//             index={i}
//           />
//         ))}
//       </div>
//     </div>
//   );
// }





// export default function PowerPage() {
//   const navigate = useNavigate();
//   const { data, lastUpdated } = useInverter();

//   return (
//     <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>

//       {/* ✅ Header */}
//       <Header data={data} lastUpdated={lastUpdated} isLive={true} showBack />

//       <div style={{ padding: "24px 32px", flex: 1 }}>
//         {/* <button onClick={() => navigate("/")}>⬅ Back</button> */}

//         <h2 style={{ margin: "20px 0" }}>Power Details</h2>

//         {/* your cards grid here */}
//         <div
//         style={{
//           display: "grid",
//           gridTemplateColumns: "repeat(3, 1fr)", // same as dashboard
//           gap: 16,
//         }}
//       >
//         {POWER_FIELDS.map((field, i) => (
//           <MetricCard
//             key={field.key}
//             field={field}
//             value={data?.[field.key]}
//             index={i}
//           />
//         ))}
//       </div>
        
//       </div>

//       {/* ✅ Footer */}
//       <Footer data={data} />
//     </div>
//   );
// }


import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useInverter } from "../context/Context";
import { MetricCard } from "../components/Dashboard";

// ─── Palette (same as Dashboard) ─────────────────────────────────────────────
const P = {
  bg:          "#FFFDF5",
  surface:     "#FFFFFF",
  surfaceAlt:  "#FFF8E7",
  border:      "#F0E0C0",
  borderStrong:"#E8C87A",
  textPrimary: "#2C1A06",
  textSecond:  "#7A5230",
  textMuted:   "#B08050",
  textDim:     "#D4AA80",
  cream:       "#FFFDE7",
  lightAmber:  "#FFE0A3",
  amber:       "#FFB74D",
  deepAmber:   "#F59E0B",
  orange:      "#F97316",
};

// ─── Power fields ─────────────────────────────────────────────────────────────
const POWER_FIELDS = [
  { label: "Active Power",      key: "IS-1-0---POW",  unit: "W",  desc: "Current Output Power" },
  { label: "Today Energy",      key: "IS-1-0---TKWH", unit: "kWh",  desc: "Energy Generated Today" },
  { label: "Today On Time",     key: "IS-1-0---TON",  unit: "hrs",  desc: "Today's Runtime" },
  { label: "Lifetime Energy",   key: "IS-1-0---LKWH", unit: "kWh",  desc: "Total Energy Generated" },
  { label: "Lifetime Running",  key: "IS-1-0---LON",  unit: "hrs",  desc: "Total Runtime" },
];

// ─── Summary Bar (mirrors Dashboard SummaryBar) ───────────────────────────────
// function PowerSummaryBar({ data }) {
//   const pills = [
//     {
//       label: "Active Power",
//       value: data?.["IS-1-0---POW"] != null ? `${data["IS-1-0---POW"]} W` : "--",
//       accent: P.deepAmber,
//     },
//     {
//       label: "Today Energy",
//       value: data?.["IS-1-0---TKWH"] != null ? `${data["IS-1-0---TKWH"]} kWh` : "--",
//       accent: P.orange,
//     },
//     {
//       label: "Lifetime Energy",
//       value: data?.["IS-1-0---LKWH"] != null ? `${data["IS-1-0---LKWH"]} kWh` : "--",
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
export default function PowerPage() {
  const navigate = useNavigate();
  const { data, lastUpdated } = useInverter();

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
        {/* Header — same as Dashboard */}
        <Header data={data} lastUpdated={lastUpdated} isLive={true} showBack />


        {/* Card Grid — identical to Dashboard */}
        <div style={{
          flex: 1,
          padding: "28px 32px",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 360px), 1fr))",
          gap: 20,
          width: "100%",
          alignContent: "start",
        }}>
          {POWER_FIELDS.map((field, i) => (
            <MetricCard
              key={field.key}
              field={field}
              value={data?.[field.key]}
              index={i}
            />
          ))}
        </div>

        {/* Footer — same as Dashboard */}
        <Footer data={data} />
      </div>
    </>
  );
}