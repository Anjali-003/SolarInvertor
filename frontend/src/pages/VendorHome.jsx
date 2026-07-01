import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import DeviceInfo from "../components/DeviceInfo";
import VendorFooter from "../components/VendorFooter";
import P from "../theme/colors";
import { PARAMETER_MAP } from "../constants/parameterMap";
import { parseKeyword } from "../utils/parseKeyword";
import useVendorDeviceData from "../hooks/useVendorDeviceData";

export default function VendorHome() {

    const navigate = useNavigate();
    const device = JSON.parse(
        localStorage.getItem("selectedVendorDevice") || "null"
    );

    const { data, lastUpdated } =
        useVendorDeviceData(device?.id);

    const getParameterValue = (parameter) => {
        const entry = Object.entries(data || {}).find(([key]) => {
            if (!key.includes("-")) return false;
            return parseKeyword(key).parameter === parameter;
        });
        return entry ? entry[1] : "--";
    };

    const voltageIcon = (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 3H6a3 3 0 0 0-3 3v12a3 3 0 0 0 3 3h12a3 3 0 0 0 3-3V6a3 3 0 0 0-3-3z" />
            <line x1="7" y1="10" x2="17" y2="10" />
            <line x1="7" y1="14" x2="17" y2="14" />
        </svg>
    );

    const currentIcon = (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 3v18M18 3v18M3 9h18M3 15h18" />
        </svg>
    );

    const powerIcon = (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
        </svg>
    );

    const iconMap = {
        DCV1: voltageIcon, VN: voltageIcon,
        DCI1: currentIcon, I: currentIcon,
        DCKW1: powerIcon, POW: powerIcon,
        PF: powerIcon, APOW: powerIcon, RPOW: powerIcon,
    };

    const renderMetric = (key, label, unit, description) => (
        <div style={{
            display: "flex", justifyContent: "space-between",
            alignItems: "flex-start", gap: "12px",
            paddingTop: "4px",
            paddingLeft: "12px",
            paddingRight: "12px",
            paddingBottom: "12px",
            maxWidth: "100%",
            margin: "0px 24px 28px",
            boxSizing: "border-box",
        }}>
            <div style={{ flex: 1, display: "flex", alignItems: "flex-start", gap: "10px" }}>
                <div style={{ color: P.deepAmber, marginTop: "2px", flexShrink: 0 }}>
                    {iconMap[key]}
                </div>
                <div>
                    <div style={{
                        fontSize: 16, fontWeight: 600, color: P.textPrimary,
                        fontFamily: "'Source Sans Pro', sans-serif", marginBottom: "4px",
                    }}>
                        {label}
                    </div>
                    <div style={{
                        fontSize: 12, fontWeight: 400, color: P.textMuted,
                        fontFamily: "'Source Sans Pro', sans-serif",
                    }}>
                        {description}
                    </div>
                </div>
            </div>

            <div style={{
                minWidth: 80, padding: "8px 12px", textAlign: "center",
                background: P.box, borderRadius: 10, fontSize: 16,
                fontWeight: 700, color: P.bg,
                fontFamily: "'Source Sans Pro', sans-serif", flexShrink: 0,
            }}>
                {getParameterValue(key)} {unit}
            </div>
        </div>
    );

    if (!device) {
        return (
            <div style={{ minHeight: "100vh", background: P.bg, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <p style={{ color: P.textMuted }}>No device selected. Go back and pick a device.</p>
            </div>
        );
    }

    return (
        <div style={{ minHeight: "100vh", paddingBottom: "90px", background: P.bg }}>

            <Header />

            <div style={{ paddingLeft: "24px", paddingRight: "24px", paddingTop: "4px" }}>
                <button
                    onClick={() => navigate("/my-devices")}
                    style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 8,
                        width: "15%",
                        minWidth: 140,
                        background: P.surface,
                        border: `1px solid ${P.borderStrong}`,
                        borderRadius: 12,
                        padding: "12px 16px",
                        marginBottom: 16,
                        fontSize: 15,
                        fontWeight: 700,
                        color: P.textPrimary,
                        cursor: "pointer",
                        boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
                        fontFamily: "'Source Sans Pro', sans-serif",
                    }}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="19" y1="12" x2="5" y2="12"/>
                        <polyline points="12 19 5 12 12 5"/>
                    </svg>
                    Back to My Devices
                </button>
            </div>

            <DeviceInfo data={data} lastUpdated={lastUpdated} />

            <div style={{ paddingTop: "4px", paddingLeft: "24px", paddingRight: "24px", paddingBottom: "12px" }}>

                <h2 style={{
                    fontSize: 18, fontWeight: 700, color: P.textPrimary,
                    marginBottom: "16px", marginTop: "10px", letterSpacing: "-0.3px",
                    fontFamily: "'Space Mono', monospace",
                }}>
                    SOLAR PANEL DETAILS
                </h2>

                <div style={{
                    background: P.surface, border: `1px solid ${P.border}`,
                    borderRadius: 12, padding: "20px", marginBottom: "28px",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                }}>
                    {renderMetric("DCV1",  PARAMETER_MAP.DCV1.label,  "V",  PARAMETER_MAP.DCV1.desc)}
                    {renderMetric("DCI1",  PARAMETER_MAP.DCI1.label,  "A",  PARAMETER_MAP.DCI1.desc)}
                    {renderMetric("DCKW1", PARAMETER_MAP.DCKW1.label, "kW", PARAMETER_MAP.DCKW1.desc)}
                </div>

                <h2 style={{
                    fontSize: 18, fontWeight: 700, color: P.textPrimary,
                    marginBottom: "10px", marginTop: "10px", letterSpacing: "-0.3px",
                    fontFamily: "'Space Mono', monospace",
                }}>
                    INVERTER DETAILS
                </h2>

                {/* TEMP + FREQUENCY ROW */}
                <div style={{
                    display: "flex", justifyContent: "space-between",
                    gap: 10, marginBottom: "15px", marginTop: "10px",
                }}>
                    <div style={{ flex: 1, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <div style={{
                            fontSize: 16, fontWeight: 600, color: P.textPrimary,
                            fontFamily: "'Source Sans Pro', sans-serif", whiteSpace: "nowrap",
                        }}>
                            {PARAMETER_MAP.TEMP.label} :-
                        </div>
                        <div style={{
                            fontSize: 16, fontWeight: 700,
                            fontFamily: "'Source Sans Pro', sans-serif", whiteSpace: "nowrap",
                        }}>
                            {getParameterValue("TEMP")} °C
                        </div>
                    </div>

                    <div style={{ flex: 1, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <div style={{
                            fontSize: 16, fontWeight: 600, color: P.textPrimary,
                            fontFamily: "'Source Sans Pro', sans-serif", whiteSpace: "nowrap",
                        }}>
                            {PARAMETER_MAP.FREQ.label} :-
                        </div>
                        <div style={{
                            fontSize: 16, fontWeight: 700,
                            fontFamily: "'Source Sans Pro', sans-serif", whiteSpace: "nowrap",
                        }}>
                            {getParameterValue("FREQ")} Hz
                        </div>
                    </div>
                </div>

                <div style={{
                    background: P.surface, border: `1px solid ${P.border}`,
                    borderRadius: 12, padding: "20px", marginBottom: "28px",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                }}>
                    {renderMetric("VN",   PARAMETER_MAP.VN.label,   "V",  PARAMETER_MAP.VN.desc)}
                    {renderMetric("I",    PARAMETER_MAP.I.label,    "A",  PARAMETER_MAP.I.desc)}
                    {renderMetric("POW",  PARAMETER_MAP.POW.label,  "W",  PARAMETER_MAP.POW.desc)}
                    {renderMetric("PF",   PARAMETER_MAP.PF.label,   "",   PARAMETER_MAP.PF.desc)}
                    {renderMetric("APOW", PARAMETER_MAP.APOW.label, "kW", PARAMETER_MAP.APOW.desc)}
                    {renderMetric("RPOW", PARAMETER_MAP.RPOW.label, "kW", PARAMETER_MAP.RPOW.desc)}
                </div>

            </div>

            <VendorFooter data={data} />
        </div>
    );
}