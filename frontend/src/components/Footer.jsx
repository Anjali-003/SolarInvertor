const P = {
  surfaceAlt: "#FFF8E7",
  border: "#F0E0C0",
  textDim: "#D4AA80",
};

export default function Footer({ data }) {
  return (
    <div style={{
      padding: "14px 32px",
      borderTop: `1px solid ${P.border}`,
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      flexWrap: "wrap",
      gap: 8,
      background: P.surfaceAlt,
    }}>
      <span style={{ fontSize: 9, color: P.textDim, letterSpacing: 1 }}>
        SOLAR INVERTER DASHBOARD · MQTT → MYSQL → SOCKET.IO
      </span>
      <span style={{ fontSize: 9, color: P.textDim, letterSpacing: 1 }}>
        POTP: {data?.POTP ?? "--"} · STINTERVAL: {data?.STINTERVAL ?? "--"}s
      </span>
    </div>
  );
}