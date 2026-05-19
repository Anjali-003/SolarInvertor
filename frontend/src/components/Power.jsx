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