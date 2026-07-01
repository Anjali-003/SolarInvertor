import { useInverter } from "../context/Context";
import Header from "../components/Header";
import DeviceInfo from "../components/DeviceInfo";
import Footer from "../components/Footer";
import P from "../theme/colors";
import { PARAMETER_MAP } from "../constants/parameterMap";
import { parseKeyword } from "../utils/parseKeyword";

export default function Home() {
    const { data, lastUpdated } = useInverter();

    // Find value dynamically using parameter name
    const getParameterValue = (parameter) => {
        const entry = Object.entries(data || {}).find(([key]) => {
            if (!key.includes("-")) return false;

            const parsed = parseKeyword(key);

            return parsed.parameter === parameter;
        });

        return entry ? entry[1] : "--";
    };

    // Find full key dynamically
    const getParameterKey = (parameter) => {
        const entry = Object.keys(data || {}).find((key) => {
            if (!key.includes("-")) return false;

            const parsed = parseKeyword(key);

            return parsed.parameter === parameter;
        });

        return entry || null;
    };

    // Icon definitions - reusable icons for parameter types
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

    const powerFactorIcon = (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 2.2" />
        </svg>
    );

    // Icon map for parameters
    const iconMap = {
        DCV1: voltageIcon,
        VN: voltageIcon,
        DCI1: currentIcon,
        I: currentIcon,
        DCKW1: powerIcon,
        POW: powerIcon,
        PF: powerIcon,
        APOW: powerIcon,
        RPOW: powerIcon,
    };

    // Helper function to render metric section with icon
    const renderMetric = (key, label, unit, description) => (
        <div
            style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                paddingBottom: "16px",
                gap: "12px",
            }}
        >
            {/* LABEL + DESCRIPTION */}
            <div style={{ flex: 1, display: "flex", alignItems: "flex-start", gap: "10px" }}>
                {/* ICON */}
                <div
                    style={{
                        color: P.deepAmber,
                        marginTop: "2px",
                        flexShrink: 0,
                    }}
                >
                    {iconMap[key]}
                </div>

                {/* TEXT */}
                <div>
                    <div
                        style={{
                            fontSize: 16,
                            fontWeight: 600,
                            color: P.textPrimary,
                            fontFamily: "'Source Sans Pro', sans-serif",
                            marginBottom: "4px",
                        }}
                    >
                        {label}
                    </div>
                    <div
                        style={{
                            fontSize: 12,
                            fontWeight: 400,
                            color: P.textMuted,
                            fontFamily: "'Source Sans Pro', sans-serif",
                        }}
                    >
                        {description}
                    </div>
                </div>
            </div>

            {/* VALUE BOX */}
            <div
                style={{
                    minWidth: 80,
                    padding: "8px 12px",
                    textAlign: "center",
                    background: P.box,
                    borderRadius: 10,
                    fontSize: 16,
                    fontWeight: 700,
                    color: P.bg,
                    fontFamily: "'Source Sans Pro', sans-serif",
                    flexShrink: 0,
                }}
            >
                {/* {data?.[`IS-1-0---${key}`] ?? "--"} {unit} */}
                {getParameterValue(key)} {unit}
            </div>
        </div>
    );

    return (
        <div
            style={{
                minHeight: "100vh",
                paddingBottom: "90px",
                background: P.bg,
            }}
        >
            {/* HEADER */}
            {/* <Header
                data={data}
                lastUpdated={lastUpdated}
            /> */}

            <Header />

            <DeviceInfo
                data={data}
                lastUpdated={lastUpdated}
            />

            {/* PAGE CONTENT */}
            <div
                style={{
                    paddingTop: "4px",
                    paddingLeft: "12px",
                    paddingRight: "12px",
                    paddingBottom: "12px",
                    maxWidth: "100%",
                    margin: "0px 24px 28px",
                    boxSizing: "border-box",
                }}
            >
                {/* HEADING */}
                <h2
                    style={{
                        fontSize: 18,
                        fontWeight: 700,
                        color: P.textPrimary,
                        marginBottom: "16px",
                        marginTop: "10px",
                        letterSpacing: "-0.3px",
                        fontFamily: "'Space Mono', monospace",
                    }}
                >
                    SOLAR PANEL DETAILS
                </h2>

                {/* SOLAR PANEL DETAILS CONTAINER */}
                <div
                    style={{
                        background: P.surface,
                        border: `1px solid ${P.border}`,
                        borderRadius: 12,
                        padding: "20px",
                        marginBottom: "28px",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                    }}
                >
                    {/* DC VOLTAGE */}
                    {renderMetric("DCV1", PARAMETER_MAP.DCV1.label, "V", PARAMETER_MAP.DCV1.desc)}

                    {/* DC CURRENT */}
                    {renderMetric("DCI1", PARAMETER_MAP.DCI1.label, "A", PARAMETER_MAP.DCI1.desc)}

                    {/* DC POWER */}
                    {renderMetric("DCKW1", PARAMETER_MAP.DCKW1.label, "kW", PARAMETER_MAP.DCKW1.desc)}
                </div>

                {/* HEADING */}
                <h2
                    style={{
                        fontSize: 18,
                        fontWeight: 700,
                        color: P.textPrimary,
                        marginBottom: "10px",
                        marginTop: "10px",
                        letterSpacing: "-0.3px",
                        fontFamily: "'Space Mono', monospace",
                    }}
                >
                    INVERTER DETAILS
                </h2>

                {/* TEMP + FREQUENCY ROW */}
                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        gap: 10,
                        marginBottom: "15px",
                        marginTop: "10px",
                    }}
                >

                    {/* TEMP CARD */}
                    <div
                        style={{
                            flex: 1,

                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",

                        }}
                    >
                        {/* LEFT */}
                        <div>
                            <div
                                style={{
                                    fontSize: 16,
                                    fontWeight: 600,
                                    color: P.textPrimary,
                                    marginBottom: "4px",
                                    fontFamily: "'Source Sans Pro', sans-serif",
                                    whiteSpace: "nowrap",
                                }}
                            >
                                {PARAMETER_MAP.TEMP.label} :-
                            </div>

                        </div>

                        {/* VALUE */}
                        <div
                            style={{
                                fontSize: 16,
                                fontWeight: 700,
                                fontFamily: "'Source Sans Pro', sans-serif",
                                whiteSpace: "nowrap",

                            }}
                        >
                            {/* {data?.["IS-1-0---TEMP"] ?? "--"} °C */}
                            {getParameterValue("TEMP")} °C
                        </div>
                    </div>

                    {/* FREQUENCY CARD */}
                    <div
                        style={{
                            flex: 1,


                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",

                        }}
                    >
                        {/* LEFT */}
                        <div>
                            <div
                                style={{
                                    fontSize: 16,
                                    fontWeight: 600,
                                    color: P.textPrimary,
                                    marginBottom: "4px",
                                    fontFamily: "'Source Sans Pro', sans-serif",
                                    whiteSpace: "nowrap",
                                }}
                            >
                                {PARAMETER_MAP.FREQ.label} :-
                            </div>

                        </div>

                        {/* VALUE */}
                        <div
                            style={{
                                fontSize: 16,
                                fontWeight: 700,
                                fontFamily: "'Source Sans Pro', sans-serif",
                                whiteSpace: "nowrap",

                            }}
                        >
                            {/* {data?.["IS-1-0---FREQ"] ?? "--"} Hz */}
                            {getParameterValue("FREQ")} Hz
                        </div>
                    </div>
                </div>

                {/* INVERTER DETAILS CONTAINER */}
                <div
                    style={{
                        background: P.surface,
                        border: `1px solid ${P.border}`,
                        borderRadius: 12,
                        padding: "20px",
                        marginBottom: "28px",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                    }}
                >
                    {/* AC VOLTAGE */}
                    {renderMetric("VN", PARAMETER_MAP.VN.label, "V", PARAMETER_MAP.VN.desc)}

                    {/* AC CURRENT */}
                    {renderMetric("I", PARAMETER_MAP.I.label, "A", PARAMETER_MAP.I.desc)}

                    {/* ACTIVE POWER */}
                    {renderMetric("POW", PARAMETER_MAP.POW.label, "W", PARAMETER_MAP.POW.desc)}

                    {/* POWER FACTOR */}
                    {renderMetric("PF", PARAMETER_MAP.PF.label, "", PARAMETER_MAP.PF.desc)}

                    {/* APPARENT POWER */}
                    {renderMetric("APOW", PARAMETER_MAP.APOW.label, "kW", PARAMETER_MAP.APOW.desc)}

                    {/* REACTIVE POWER */}
                    {renderMetric("RPOW", PARAMETER_MAP.RPOW.label, "kW", PARAMETER_MAP.RPOW.desc)}
                </div>
            </div>

            {/* FOOTER */}
            <Footer data={data} />
        </div>
    );
}