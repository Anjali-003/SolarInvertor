import { useParams } from "react-router-dom";
import VendorFooter from "../components/VendorFooter";
import DeviceInfo from "../components/DeviceInfo";
import useVendorDeviceData from "../hooks/useVendorDeviceData";
import { parseKeyword } from "../utils/parseKeyword";
import P from "../theme/colors";
import { useNavigate } from "react-router-dom";
import PageHeader from "../components/PageHeader";

export default function VendorFault() {

    const { id } = useParams();
    const { data, lastUpdated } = useVendorDeviceData(id);

    const getParameterValue = (parameter) => {
        const entry = Object.entries(data || {}).find(([key]) => {
            if (!key.includes("-")) return false;
            return parseKeyword(key).parameter === parameter;
        });
        return entry ? entry[1] : null;
    };

    const voltageIcon = (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 3H6a3 3 0 0 0-3 3v12a3 3 0 0 0 3 3h12a3 3 0 0 0 3-3V6a3 3 0 0 0-3-3z" />
            <line x1="7" y1="10" x2="17" y2="10" />
            <line x1="7" y1="14" x2="17" y2="14" />
        </svg>
    );

    const frequencyIcon = (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
            <path d="M21 3v5h-5" />
            <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
            <path d="M3 21v-5h5" />
        </svg>
    );

    const powerIcon = (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
        </svg>
    );

    const temperatureIcon = (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2v20" />
            <path d="M12 20a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" />
            <path d="M9 9a3 3 0 0 1 6 0" />
            <line x1="9" y1="9" x2="9" y2="5" />
            <line x1="15" y1="9" x2="15" y2="5" />
        </svg>
    );

    const warningIcon = (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3.05h16.94a2 2 0 0 0 1.71-3.05L13.71 3.86a2 2 0 0 0-3.42 0z" />
            <line x1="12" y1="9" x2="12" y2="13" />
            <line x1="12" y1="17" x2="12.01" y2="17" />
        </svg>
    );

    const faultDefs = [
        {
            key: "FT1",
            title: "Fault 1",
            desc: "Voltage Fault",
            icon: voltageIcon,
            meanings: ["Normal", "VAC High", "VAC Low", "Grid Voltage Fail"],
        },
        {
            key: "FT2",
            title: "Fault 2",
            desc: "Frequency Fault",
            icon: frequencyIcon,
            meanings: ["Normal", "Frequency High", "Frequency Low"],
        },
        {
            key: "FT3",
            title: "Fault 3",
            desc: "Output / Circuit Fault",
            icon: powerIcon,
            meanings: ["Normal", "AC Output Overload", "PV Short Circuit", "AC Short Circuit", "Leakage Current High"],
        },
        {
            key: "FT4",
            title: "Fault 4",
            desc: "Temperature Fault",
            icon: temperatureIcon,
            meanings: ["Normal", "High Temperature"],
        },
        {
            key: "FT5",
            title: "Fault 5",
            desc: "Other Fault",
            icon: warningIcon,
            meanings: ["Normal", "Other Fault"],
        },
    ];

    const getFaultText = (fault) => {
        const value = getParameterValue(fault.key);
        if (value == null) return "--";
        return fault.meanings[value] || "--";
    };

    const isFaultActive = (fault) => {
        const value = getParameterValue(fault.key);
        return value !== 0 && value != null;
    };

    const navigate = useNavigate();

    return (
        <div style={{ minHeight: "100vh", paddingBottom: "90px", background: P.bg, fontFamily: "'Inter', sans-serif" }}>

        <PageHeader
            title="FAULT"
            backPath="/vendor"
        />

            {/* DEVICE STRIP */}
            <div style={{ margin: "20px 20px 16px", background: P.surface, borderRadius: 14, padding: "12px 16px", display: "flex", alignItems: "center", gap: 16, boxShadow: P.shadowCard }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6, background: P.surfaceGreen, border: `1px solid ${P.borderGreen}`, borderRadius: 20, padding: "4px 10px", flexShrink: 0 }}>
                    <div style={{ width: 8, height: 8, borderRadius: "50%", background: P.green, boxShadow: `0 0 6px ${P.green}` }} />
                    <span style={{ fontSize: 12, fontWeight: 700, color: P.textGreen, fontFamily: "'DM Sans', sans-serif" }}>ON</span>
                </div>
                <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 10, color: P.textLight, fontWeight: 500, letterSpacing: 0.8, marginBottom: 2 }}>SERIAL NUMBER</div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: P.textPrimary, fontFamily: "'DM Sans', sans-serif" }}>
                        {Object.keys(data || {}).find(k => k.startsWith("ASN_"))
                            ? data[Object.keys(data).find(k => k.startsWith("ASN_"))]
                            : "--"}
                    </div>
                </div>
                <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: 10, color: P.textLight, fontWeight: 500, letterSpacing: 0.8, marginBottom: 2 }}>LAST UPDATED</div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: P.textPrimary, fontFamily: "'DM Sans', sans-serif" }}>{lastUpdated || "--"}</div>
                </div>
            </div>

            <div style={{ padding: "0 20px 20px" }}>

                <h2 style={{
                    fontSize: 18,
                    fontWeight: 800,
                    color: P.textPrimary,
                    marginBottom: 14,
                    marginTop: 4,
                    fontFamily: "'DM Sans', sans-serif",
                }}>
                    FAULT DETAILS
                </h2>

                <div style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "16px",
                }}>
                    
                    {faultDefs.map((fault) => {
                        const active = isFaultActive(fault);
                        return (
                            <div
                                key={fault.key}
                                style={{
                                    background: P.surface,
                                    borderRadius: 14,
                                    overflow: "hidden",
                                    boxShadow: P.shadowCard,
                                }}
                            >
                                {/* ICON + TITLE ROW */}
                                <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 16px 10px" }}>
                                    <div style={{
                                        width: 40, height: 40, borderRadius: 10,
                                        background: active ? P.surfaceRed : P.surfaceGreen,
                                        display: "flex", alignItems: "center", justifyContent: "center",
                                        flexShrink: 0,
                                        color: active ? P.textRed : P.textGreen,
                                    }}>
                                        {fault.icon}
                                    </div>
                                    <div>
                                        <div style={{ fontSize: 15, fontWeight: 700, color: P.textPrimary, fontFamily: "'DM Sans', sans-serif" }}>
                                            {fault.title}
                                        </div>
                                        <div style={{ fontSize: 12, color: P.textMuted, marginTop: 2, fontFamily: "'Inter', sans-serif" }}>
                                            {fault.desc}
                                        </div>
                                    </div>
                                </div>

                                {/* STATUS BANNER */}
                                <div style={{ background: active ? P.red : P.green, padding: "8px 16px", textAlign: "left" }}>
                                    <span style={{ fontSize: 13, fontWeight: 700, color: P.surface, fontFamily: "'DM Sans', sans-serif", letterSpacing: 0.3 }}>
                                        {getFaultText(fault)}
                                    </span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            <VendorFooter />
        </div>
    );
}