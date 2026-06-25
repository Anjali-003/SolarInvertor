import { useParams } from "react-router-dom";
import Header from "../components/Header";
import VendorFooter from "../components/VendorFooter";
import DeviceInfo from "../components/DeviceInfo";
import useVendorDeviceData from "../hooks/useVendorDeviceData";
import { PARAMETER_MAP } from "../constants/parameterMap";
import { parseKeyword } from "../utils/parseKeyword";
import P from "../theme/colors";

export default function VendorPower() {

    const { id } = useParams();
    const { data, lastUpdated } = useVendorDeviceData(id);

    const getParameterValue = (parameter) => {
        const entry = Object.entries(data || {}).find(([key]) => {
            if (!key.includes("-")) return false;
            return parseKeyword(key).parameter === parameter;
        });
        return entry ? entry[1] : "--";
    };

    const powerDetails = [
        {
            key: "POW",
            label: PARAMETER_MAP.POW.label,
            description: PARAMETER_MAP.POW.desc,
            value: getParameterValue("POW"),
            unit: PARAMETER_MAP.POW.unit,
            icon: (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                </svg>
            ),
        },
        {
            key: "TKWH",
            label: PARAMETER_MAP.TKWH.label,
            description: PARAMETER_MAP.TKWH.desc,
            value: getParameterValue("TKWH"),
            unit: PARAMETER_MAP.TKWH.unit,
            icon: (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="5" />
                    <line x1="12" y1="1" x2="12" y2="3" />
                    <line x1="12" y1="21" x2="12" y2="23" />
                    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                    <line x1="1" y1="12" x2="3" y2="12" />
                    <line x1="21" y1="12" x2="23" y2="12" />
                    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
                </svg>
            ),
        },
        {
            key: "TON",
            label: PARAMETER_MAP.TON.label,
            description: PARAMETER_MAP.TON.desc,
            value: getParameterValue("TON"),
            unit: PARAMETER_MAP.TON.unit,
            icon: (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="9" />
                    <polyline points="12 6 12 12 16 14" />
                </svg>
            ),
        },
        {
            key: "LKWH",
            label: PARAMETER_MAP.LKWH.label,
            description: PARAMETER_MAP.LKWH.desc,
            value: getParameterValue("LKWH"),
            unit: PARAMETER_MAP.LKWH.unit,
            icon: (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M19 12h1m-18 0h1m4.217-8.883a5.9 5.9 0 0 1 5.566 0m-11.132 5.566a5.9 5.9 0 0 1 0 5.566m11.132 0a5.9 5.9 0 0 1-5.566 5.566m-5.566-11.132a5.9 5.9 0 0 1 0-5.566m5.566-5.566a5.9 5.9 0 0 1 5.566 0" />
                </svg>
            ),
        },
        {
            key: "LON",
            label: PARAMETER_MAP.LON.label,
            description: PARAMETER_MAP.LON.desc,
            value: getParameterValue("LON"),
            unit: PARAMETER_MAP.LON.unit,
            icon: (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="12 6 12 12 16 14" />
                </svg>
            ),
        },
    ];

    return (
        <div style={{ minHeight: "100vh", paddingBottom: "90px", background: P.bg }}>

            <Header />

            <DeviceInfo data={data} lastUpdated={lastUpdated} />

            <div style={{ paddingTop: "4px", paddingLeft: "24px", paddingRight: "24px", paddingBottom: "12px" }}>

                <h2 style={{
                    fontSize: 18, fontWeight: 700, color: P.textPrimary,
                    marginBottom: "10px", marginTop: "10px", letterSpacing: "-0.3px",
                    fontFamily: "'Space Mono', monospace",
                }}>
                    POWER GENERATED DETAILS
                </h2>

                <div style={{
                    background: P.surface, border: `1px solid ${P.border}`,
                    borderRadius: 12, padding: "24px", paddingLeft: "16px",
                    marginBottom: "28px", boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                }}>
                    <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                        {powerDetails.map((item) => (
                            <div key={item.key} style={{
                                display: "flex", justifyContent: "space-between",
                                alignItems: "flex-start", paddingBottom: "16px", gap: "12px",
                            }}>
                                {/* LABEL + DESCRIPTION */}
                                <div style={{ flex: 1, display: "flex", alignItems: "flex-start", gap: "10px" }}>
                                    <div style={{ color: P.deepAmber, marginTop: "2px", flexShrink: 0 }}>
                                        {item.icon}
                                    </div>
                                    <div>
                                        <div style={{
                                            fontSize: 16, fontWeight: 600, color: P.textPrimary,
                                            marginBottom: "4px", fontFamily: "'Source Sans Pro', sans-serif",
                                        }}>
                                            {item.label}
                                        </div>
                                        <div style={{
                                            fontSize: 12, fontWeight: 400, color: P.textMuted,
                                            fontFamily: "'Source Sans Pro', sans-serif",
                                        }}>
                                            {item.description}
                                        </div>
                                    </div>
                                </div>

                                {/* VALUE BOX */}
                                <div style={{
                                    minWidth: 80, padding: "8px 12px", textAlign: "center",
                                    background: P.box, borderRadius: 10, fontSize: 16,
                                    fontWeight: 700, color: P.bg, flexShrink: 0,
                                    fontFamily: "'Source Sans Pro', sans-serif",
                                }}>
                                    {item.value ?? "--"} {item.unit}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <VendorFooter />
        </div>
    );
}