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