import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import DeviceInfo from "../components/DeviceInfo";
import VendorFooter from "../components/VendorFooter";
import P from "../theme/colors";
import { PARAMETER_MAP } from "../constants/parameterMap";
import { parseKeyword } from "../utils/parseKeyword";
import useVendorDeviceData from "../hooks/useVendorDeviceData";
import PageHeader from "../components/PageHeader";

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

    const metricCard = {
        background: P.surfaceWarm,
        border: "1px solid ${P.borderAmber}",
        borderRadius: 12,
        padding: "12px 14px",
    };

    const metricIconRow = {
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 6,
    };

    const metricValue = {
        fontSize: 20,
        fontWeight: 800,
        color: P.textPrimary,
        fontFamily: "'DM Sans', sans-serif",
    };

    const metricUnit = {
        fontSize: 14,
        fontWeight: 600,
        color: P.textMuted,
        fontFamily: "'Inter', sans-serif",
    };

    const metricLabel = {
        fontSize: 13,
        fontWeight: 600,
        color: P.textSecond,
        fontFamily: "'Inter', sans-serif",
        marginBottom: 2,
    };

    const metricDesc = {
        fontSize: 11,
        color: P.textLight,
        fontFamily: "'Inter', sans-serif",
    };

    if (!device) {
        return (
            <div style={{ minHeight: "100vh", paddingBottom: "90px", background: P.bg, fontFamily: "'Inter', sans-serif" }}>
                <p style={{ color: P.textMuted }}>No device selected. Go back and pick a device.</p>
            </div>
        );
    }

    return (
        <div style={{ minHeight: "100vh", paddingBottom: "90px", background: P.bg }}>
            <div
    style={{
        height: 64,
        background: P.surface,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 18px",
        borderBottom: "1px solid #ECECEC",
        boxShadow: "0 2px 6px rgba(0,0,0,0.04)",
        position: "sticky",
        top: 0,
        zIndex: 100,
    }}
>
    {/* Back Pill */}
    <button
        onClick={() => navigate("/my-devices")}
        style={{
            border: `1px solid ${P.borderStrong}`,
            background: P.amberWarm,
            color: P.textAmber,
            borderRadius: 20,
            padding: "8px 14px",
            fontSize: 14,
            fontWeight: 600,
            fontFamily: "'Inter', sans-serif",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: 6,
            boxShadow: "0 2px 6px rgba(245,158,11,0.15)",
        }}
    >
        ← Devices
    </button>

    {/* Title */}
    <div
        style={{
            position: "absolute",
            left: "50%",
            transform: "translateX(-50%)",
            fontSize: 18,
            fontWeight: 700,
            color: P.textAmber,
            letterSpacing: 2,
            fontFamily: "'DM Sans', sans-serif",
        }}
    >
        HOME
    </div>
</div>

            {/* DEVICE INFO CARD */}
            <div style={{
                margin: "20px 20px 16px",
                background: P.surface,
                borderRadius: 16,
                padding: "16px 18px",
                boxShadow: P.shadowCard,
            }}>

                {/* STATUS BADGE */}
                <div style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 6,
                    background: P.surfaceGreen,
                    border: `1px solid ${P.borderGreen}`,
                    borderRadius: 20,
                    padding: "4px 10px",
                }}>
                    <div style={{ width: 8, height: 8, borderRadius: "50%", background: P.green, boxShadow: `0 0 6px ${P.green}` }} />
                    <span style={{ fontSize: 12, fontWeight: 700, color: P.textGreen, fontFamily: "'DM Sans', sans-serif" }}>ON</span>
                </div>
            </div>

            <div style={{ padding: "0 20px 20px" }}>

                <h2 style={{
                    fontSize: 15,
                    fontWeight: 800,
                    color: P.textAmber,
                    marginBottom: 12,
                    marginTop: 4,
                    letterSpacing: 0.5,
                    fontFamily: "'DM Sans', sans-serif",
                }}>
                    SOLAR PANEL DETAILS
                </h2>

                <div style={{
                    background: P.amber,
                    border: `1.5px solid ${P.borderDark}`,
                    borderRadius: 16,
                    padding: "16px",
                    marginBottom: 20,
                    boxShadow: P.shadowCardAmber,
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: 12,
                }}>
                    {/* DC Voltage */}
                    <div style={metricCard}>
                        <div style={metricIconRow}>
                            <span style={{ fontSize: 16, color: P.textAmberBright }}>⚡</span>
                            <span style={metricValue}>{getParameterValue("DCV1")} <span style={metricUnit}>V</span></span>
                        </div>
                        <div style={metricLabel}>DC Voltage</div>
                        <div style={metricDesc}>Input voltage</div>
                    </div>

                    {/* DC Current */}
                    <div style={metricCard}>
                        <div style={metricIconRow}>
                            <span style={{ fontSize: 16, color: P.textAmberBright }}>⚡</span>
                            <span style={metricValue}>{getParameterValue("DCI1")} <span style={metricUnit}>A</span></span>
                        </div>
                        <div style={metricLabel}>DC Current</div>
                        <div style={metricDesc}>Input current</div>
                    </div>

                    {/* DC Power — full width */}
                    <div style={{ ...metricCard, gridColumn: "1 / -1", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        <div>
                            <div style={{ fontSize: 16, color: P.textAmberBright, marginBottom: 6 }}>🔲</div>
                            <div style={metricLabel}>DC Power</div>
                            <div style={metricDesc}>Total output</div>
                        </div>
                        <div style={{ fontSize: 22, fontWeight: 800, color: P.textPrimary, fontFamily: "'DM Sans', sans-serif" }}>
                            {getParameterValue("DCKW1")} <span style={{ fontSize: 14, fontWeight: 600, color: P.textMuted }}>kW</span>
                        </div>
                    </div>
                </div>

                <h2 style={{
                    fontSize: 15,
                    fontWeight: 800,
                    color: P.textAmber,
                    marginBottom: 12,
                    marginTop: 4,
                    letterSpacing: 0.5,
                    fontFamily: "'DM Sans', sans-serif",
                }}>
                    INVERTER DETAILS
                </h2>

                {/* TEMP + FREQ */}
                <div style={{
                    background: P.amber,
                    border: `1.5px solid ${P.borderDark}`,
                    borderRadius: 16,
                    padding: "16px",
                    marginBottom: 12,
                    boxShadow: P.shadowCardAmber,
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: 12,
                }}>
                    <div style={metricCard}>
                        <div style={{ fontSize: 12, color: P.textAmberBright, fontWeight: 600, marginBottom: 4, fontFamily: "'Inter', sans-serif" }}>🌡 Temp</div>
                        <div style={{ fontSize: 22, fontWeight: 800, color: P.textPrimary, fontFamily: "'DM Sans', sans-serif" }}>
                            {getParameterValue("TEMP")} <span style={{ fontSize: 14, color: P.textMuted, fontWeight: 500 }}>°C</span>
                        </div>
                    </div>
                    <div style={metricCard}>
                        <div style={{ fontSize: 12, color: P.textAmberBright, fontWeight: 600, marginBottom: 4, fontFamily: "'Inter', sans-serif" }}>≋ Freq</div>
                        <div style={{ fontSize: 22, fontWeight: 800, color: P.textPrimary, fontFamily: "'DM Sans', sans-serif" }}>
                            {getParameterValue("FREQ")} <span style={{ fontSize: 14, color: P.textMuted, fontWeight: 500 }}>Hz</span>
                        </div>
                </div>
            </div>

                <div style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: 12,
                    marginBottom: 20,
                }}>
                    {[
                        { key: "VN",   label: "AC Voltage",     desc: "VN",   unit: "V"    },
                        { key: "I",    label: "AC Current",     desc: "I",    unit: "A"    },
                        { key: "POW",  label: "Active Power",   desc: "POW",  unit: "kW"   },
                        { key: "PF",   label: "Power Factor",   desc: "PF",   unit: ""     },
                        { key: "APOW", label: "Apparent Power", desc: "POW",  unit: "kVA"  },
                        { key: "RPOW", label: "Reactive Power", desc: "RPOW", unit: "kVAr" },
                    ].map((item) => (
                        <div key={item.key} style={{ ...metricCard, background: P.surface, border: "1px solid ${P.border}" }}>
                            <div style={{ fontSize: 12, color: P.textAmberBright, fontWeight: 600, marginBottom: 6, fontFamily: "'Inter', sans-serif" }}>
                                ⚡ {item.label}
                                <span style={{ fontSize: 10, color: P.textLight, marginLeft: 4 }}>({item.desc})</span>
                            </div>
                            <div style={{ fontSize: 20, fontWeight: 800, color: P.textPrimary, fontFamily: "'DM Sans', sans-serif" }}>
                                {getParameterValue(item.key)}{" "}
                                <span style={{ fontSize: 12, fontWeight: 500, color: P.textMuted }}>{item.unit}</span>
                            </div>
                        </div>
                    ))}
                </div>

            </div>

            <VendorFooter />
        </div>
    );
}