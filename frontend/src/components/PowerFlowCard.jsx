import P from "../theme/colors";
import inverterImage from "../assets/inverter.png";

function parseGridStatus(st3) {
  const val = Number(st3);
  if (!Number.isFinite(val)) {
    return { inverterConnected: false, gridConnected: false, label: "NO DATA" };
  }
  const inverterConnected = (val & 0b01) === 0b01;
  const gridConnected = (val & 0b10) === 0b10;

  let label = "DISCONNECTED";
  if (gridConnected && inverterConnected) label = "GRID CONNECTED";
  else if (inverterConnected) label = "OFF-GRID";
  else if (gridConnected) label = "GRID ONLY";

  return { inverterConnected, gridConnected, label };
}

function TowerIcon({ size = 44, color }) {
  return (
    <svg width={size} height={size * (502 / 502)} viewBox="0 0 502.002 502.002" style={{ color }}>
      <g>
        <path
          fill="currentColor"
          d="M286.136,410.955c-3.892-3.919-10.224-3.942-14.143-0.053c-3.92,3.891-3.943,10.223-0.053,14.143l4.963,5
          c1.955,1.969,4.526,2.955,7.098,2.955c2.547,0,5.095-0.967,7.045-2.902c3.92-3.891,3.943-10.223,0.053-14.143L286.136,410.955z"
        />
        <path
          fill="currentColor"
          d="M347.783,500.499c1.551,0.959,3.358,1.503,5.246,1.503c0.739,0,1.49-0.082,2.241-0.254
          c5.384-1.233,8.748-6.597,7.516-11.98l-55.578-242.69h79.561v2.669h-3.605c-5.522,0-10,4.478-10,10s4.478,10,10,10h3.605v3.322
          h-3.605c-5.522,0-10,4.478-10,10s4.478,10,10,10h3.605v3.605c0,5.522,4.478,10,10,10s10-4.478,10-10v-3.605h3.604
          c5.522,0,10-4.478,10-10s-4.478-10-10-10h-3.604v-3.322h3.604c5.522,0,10-4.478,10-10s-4.478-10-10-10h-3.604v-12.351
          c0-0.054-0.007-0.106-0.008-0.16c0.059-3.694-1.933-7.205-5.307-8.993l-96.722-51.283v-38.402h82.037v3.322h-3.605
          c-5.522,0-10,4.478-10,10s4.478,10,10,10h3.605v3.322h-3.605c-5.522,0-10,4.478-10,10s4.478,10,10,10h3.605v3.605
          c0,5.522,4.478,10,10,10s10-4.478,10-10v-3.605h3.604c5.522,0,10-4.478,10-10s-4.478-10-10-10h-3.604v-3.322h3.604
          c5.522,0,10-4.478,10-10s-4.478-10-10-10h-3.604v-12.351c0-0.14-0.015-0.277-0.021-0.415c0.215-3.839-1.8-7.538-5.294-9.391
          l-62.76-33.276c-4.878-2.587-10.932-0.728-13.52,4.15c-2.587,4.88-0.729,10.933,4.15,13.52l27.237,14.441h-51.83V74.455
          c0-0.058-0.015-0.116-0.02-0.174c-0.033-1.908-0.594-3.803-1.705-5.44L259.276,4.386C257.415,1.643,254.315,0,251.001,0
          s-6.414,1.643-8.275,4.386l-42.334,62.398l-99.841,52.937c-3.495,1.853-5.509,5.552-5.294,9.391
          c-0.006,0.139-0.021,0.275-0.021,0.415v12.351H91.63c-5.522,0-10,4.478-10,10s4.478,10,10,10h3.605v3.322H91.63
          c-5.522,0-10,4.478-10,10s4.478,10,10,10h3.605v3.605c0,5.522,4.478,10,10,10s10-4.478,10-10v-3.605h3.604
          c5.522,0,10-4.478,10-10s-4.478-10-10-10h-3.604v-3.322h3.604c5.522,0,10-4.478,10-10s-4.478-10-10-10h-3.604v-3.322h82.036
          v38.402l-96.721,51.283c-3.374,1.789-5.366,5.299-5.307,8.994c-0.001,0.054-0.008,0.106-0.008,0.16v12.351H91.63
          c-5.522,0-10,4.478-10,10s4.478,10,10,10h3.605v3.322H91.63c-5.522,0-10,4.478-10,10s4.478,10,10,10h3.605v3.605
          c0,5.522,4.478,10,10,10s10-4.478,10-10v-3.605h3.604c5.522,0,10-4.478,10-10s-4.478-10-10-10h-3.604v-3.322h3.604
          c5.522,0,10-4.478,10-10s-4.478-10-10-10h-3.604v-2.669h79.56l-55.578,242.69c-1.232,5.384,2.132,10.747,7.516,11.98
          c0.832,0.191,1.66,0.259,2.475,0.24c0.081,0.002,0.162,0.012,0.243,0.012c2.56,0,5.118-0.977,7.071-2.929l99.107-99.107h66.072
          l14.125,61.679l-22.753-22.753c-3.906-3.904-10.236-3.904-14.143,0c-3.905,3.905-3.905,10.237,0,14.143l46.427,45.361
          L347.783,500.499z M192.703,345.808l21.265,21.265c1.953,1.952,4.512,2.929,7.071,2.929s5.118-0.977,7.071-2.929
          c3.905-3.905,3.905-10.237,0-14.143l-25.456-25.456l30.98-25.789c4.245-3.533,4.821-9.839,1.288-14.083
          c-3.531-4.243-9.838-4.822-14.083-1.288l-17.93,14.926l10.395-45.39l86.309,71.844l-52.269,52.269h-62.463L192.703,345.808z
           M284.73,172.976h-67.459v-34.101h67.459V172.976z M234.407,247.396h52.354l12.331,53.844L234.407,247.396z M217.271,227.077
          v-34.102h67.459v34.102H217.271z M217.271,118.557V84.455h67.459v34.102H217.271z M251.001,27.812l24.86,36.644h-49.721
          L251.001,27.812z M197.271,91.076v27.481h-51.829L197.271,91.076z M197.271,199.597v27.481h-51.829L197.271,199.597z
           M166.328,460.98l13.973-61.016h47.043L166.328,460.98z M275.629,379.964l33.76-33.76l7.731,33.76H275.629z M304.73,227.077
          v-27.481l51.829,27.481H304.73z"
        />
      </g>
    </svg>
  );
}

function SolarIcon({ size = 46, color }) {
  return (
    <svg width={size} height={size * (244 / 260)} viewBox="0 0 260 244" style={{ color }}>
      <path
        fill="currentColor"
        d="M258,54v-8h-25.176c-0.596-3.416-1.941-6.576-3.86-9.307l17.806-17.806l-5.656-5.657l-17.803,17.802
        c-2.731-1.926-5.892-3.275-9.311-3.876V2h-8v25.148c-3.433,0.596-6.609,1.947-9.35,3.879L178.87,13.248l-5.656,5.657l17.781,17.78
        c-1.922,2.733-3.269,5.896-3.866,9.315H162v8h25.129c0.598,3.428,1.95,6.597,3.88,9.335L173.23,81.112l5.656,5.657l17.783-17.782
        c2.737,1.924,5.906,3.271,9.331,3.865V98h8V72.844c3.41-0.599,6.565-1.944,9.292-3.862l17.804,17.805l5.656-5.656l-17.803-17.804
        c1.927-2.735,3.276-5.902,3.874-9.326H258z M209.976,34.8c8.382,0,15.2,6.819,15.2,15.2s-6.818,15.2-15.2,15.2
        c-8.381,0-15.199-6.819-15.199-15.2S201.595,34.8,209.976,34.8z M80,236v6H43v-6h15v-22h6v22H80z M63.537,82l9.723,38h24.545
        l-9.773-38H63.537z M84.518,164h24.603l-9.773-38H74.795L84.518,164z M78.325,164l-9.723-38h-24.52l9.723,38H78.325z
        M26.632,82H2l9.772,38h24.582L26.632,82z M67.067,120l-9.723-38H32.825l9.723,38H67.067z M95.776,208h24.661l-9.773-38H86.053
        L95.776,208z M55.34,170l9.723,38h24.52l-9.723-38H55.34z M37.89,126H13.315l9.772,38h24.525L37.89,126z M24.631,170l9.772,38
        H58.87l-9.723-38H24.631z M178.667,190h17.055l6.686,26h-17.089L178.667,190z M163,237v-16h-5v16h-11v5h27v-5H163z
        M155.259,185l-7.164-28h16.968l7.164,28H155.259z M146.815,152l-6.652-26h16.968l6.652,26H146.815z M173.506,190l6.652,26H163.19
        l-6.652-26H173.506z M151.377,190l6.652,26h-16.834l-6.686-26H151.377z M141.654,152h-16.917l-6.686-26h16.951L141.654,152z
        M150.098,185h-16.874l-7.201-28h16.911L150.098,185z M179.264,126l6.686,26h-17.006l-6.652-26H179.264z M170.223,157h17.013
        l7.201,28h-17.049L170.223,157z M240,238v4h-16v-4h6v-9h4v9H240z M230.721,210l3.838,15h9.591l-3.838-15H230.721z M248.279,225H258
        l-3.858-15h-9.702L248.279,225z M217.049,210l3.858,15h9.524l-3.838-15H217.049z M243.417,206h9.696l-4.115-16h-9.675L243.417,206z
        M216.358,170h-9.596l4.115,16h9.575L216.358,170z M234.206,170l4.094,16h9.67l-4.115-16H234.206z M221.475,190h-9.57l4.115,16
        h9.549L221.475,190z M239.288,206l-4.094-16h-9.591l4.094,16H239.288z M234.171,186l-4.094-16h-9.591l4.094,16H234.171z"
      />
    </svg>
  );
}

export default function PowerFlowCard({ dcPower = "--", solarPower = "--", st3 = null }) {
  const { inverterConnected, gridConnected, label } = parseGridStatus(st3);

  return (
    <div
      style={{
        width: "100%",
        maxWidth: 700,
        margin: "0 auto 16px",
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          width: "100%",
          boxSizing: "border-box",
          background: P.surface,
          borderRadius: 16,
          padding: "16px 18px",
          border: `1px solid ${P.border}`,
          boxShadow: P.shadowCard,
          fontFamily: "'DM Sans', sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
          {/* GRID */}
          <div style={{ textAlign: "center", width: 90, minWidth: 0 }}>
            <TowerIcon size={44} color={P.textAmberBright} />
            <div style={{ marginTop: 4, fontSize: 16, fontWeight: 700, color: P.textPrimary, lineHeight: 1 }}>
              {dcPower}
            </div>
            <div style={{ marginTop: 3, fontSize: 11, color: P.textMuted, fontWeight: 500 }}>kW</div>
          </div>

          {/* arrow: grid -> inverter (points right, into inverter) */}
          {/* <svg width="30" height="18" viewBox="0 0 34 20" fill="none" style={{ marginTop: 16, flexShrink: 0 }}>
            <line x1="4" y1="10" x2="26" y2="10" stroke={gridConnected ? P.green : P.textLight} strokeWidth="3" strokeLinecap="round" />
            <path d="M22 3L30 10L22 17" stroke={gridConnected ? P.green : P.textLight} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          </svg> */}

          <svg width="30" height="18" viewBox="0 0 34 20" fill="none" style={{ marginTop: 16, flexShrink: 0 }}>
            <line x1="30" y1="10" x2="8" y2="10" stroke={inverterConnected ? P.green : P.textLight} strokeWidth="3" strokeLinecap="round" />
            <path d="M12 3L4 10L12 17" stroke={inverterConnected ? P.green : P.textLight} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          </svg>

          {/* INVERTER */}
        {/* <div style={{ textAlign: "center", width: 96, minWidth: 0 }}>
            <div
              style={{
                width: 70,
                height: 64,
                margin: "0 auto",
                borderRadius: 6,
                background: "linear-gradient(145deg, #0074d9, #005ea3)",
                border: "1px solid rgba(255,255,255,0.15)",
                boxShadow: "0 6px 14px rgba(0,116,217,0.25)",
                position: "relative",
              }}
            >
              <div style={{ position: "absolute", top: 6, left: 6, fontSize: 6, color: "rgba(255,255,255,0.9)", fontWeight: 700 }}>
                INVERTER
              </div>
              <div
                style={{
                  position: "absolute",
                  left: "50%",
                  top: 31,
                  transform: "translate(-50%, -50%)",
                  width: 36,
                  height: 17,
                  borderRadius: 3,
                  background: "#0e1620",
                  border: "1px solid rgba(255,255,255,0.5)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 3,
                }}
              >
                <div style={{ width: 4, height: 6, background: "#f2c94c", borderRadius: 1 }} />
                <div style={{ width: 4, height: 6, background: "#27ae60", borderRadius: 1 }} />
                <div style={{ width: 4, height: 6, background: "#3498db", borderRadius: 1 }} />
              </div>
            </div>

            <div
              style={{
                marginTop: 10,
                fontSize: 11,
                fontWeight: 700,
                color: "#000000",
                letterSpacing: 0.3,
                whiteSpace: "nowrap",
              }}
            >
              {label}
            </div>
          </div> */}

          {/* INVERTER */}
<div
    style={{
        textAlign: "center",
        width: 110,
        minWidth: 0,
    }}
>
    <img
        src={inverterImage}
        alt="Inverter"
        style={{
            width: 90,
            height: 90,
            objectFit: "contain",
            display: "block",
            margin: "0 auto",
        }}
    />

    {/* status */}
    <div
        style={{
            marginTop: 8,
            fontSize: 11,
            fontWeight: 700,
            color: "#000000",
            letterSpacing: 0.3,
            whiteSpace: "nowrap",
        }}
    >
        {label}
    </div>
</div>

          {/* arrow: solar -> inverter (points LEFT, into inverter) */}
          <svg width="30" height="18" viewBox="0 0 34 20" fill="none" style={{ marginTop: 16, flexShrink: 0 }}>
            <line x1="30" y1="10" x2="8" y2="10" stroke={inverterConnected ? P.green : P.textLight} strokeWidth="3" strokeLinecap="round" />
            <path d="M12 3L4 10L12 17" stroke={inverterConnected ? P.green : P.textLight} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          </svg>

          {/* SOLAR */}
          <div style={{ textAlign: "center", width: 90, minWidth: 0 }}>
            <SolarIcon size={46} color={P.textAmberBright} />
            <div style={{ marginTop: 4, fontSize: 16, fontWeight: 700, color: P.textPrimary, lineHeight: 1 }}>
              {solarPower}
            </div>
            <div style={{ marginTop: 3, fontSize: 11, color: P.textMuted, fontWeight: 500 }}>W</div>
          </div>
        </div>
      </div>
    </div>
  );
}