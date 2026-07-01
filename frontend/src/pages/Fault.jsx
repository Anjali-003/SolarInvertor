import { useInverter } from "../context/Context";

import Header from "../components/Header";
import Footer from "../components/Footer";
import DeviceInfo from "../components/DeviceInfo";
import P from "../theme/colors";
import { parseKeyword } from "../utils/parseKeyword";

export default function Fault() {

    const { data, lastUpdated } = useInverter();
    // GET PARAMETER VALUE DYNAMICALLY
    const getParameterValue = (parameter) => {

        const entry = Object.entries(data || {}).find(([key]) => {

            if (!key.includes("-")) return false;

            const parsed = parseKeyword(key);

            return parsed.parameter === parameter;
        });

        return entry ? entry[1] : null;
    };

    // Icon definitions for fault types
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

    // ─── FAULT DEFINITIONS ─────────────────────────────
    const faultDefs = [
        {
            // key: "IS-1-0---FT1",
            key: "FT1",
            title: "Fault 1",
            desc: "Voltage Fault",
            icon: voltageIcon,
            meanings: [
                "Normal",
                "VAC High",
                "VAC Low",
                "Grid Voltage Fail",
            ],
        },
        {
            // key: "IS-1-0---FT2",
            key: "FT2",
            title: "Fault 2",
            desc: "Frequency Fault",
            icon: frequencyIcon,
            meanings: [
                "Normal",
                "Frequency High",
                "Frequency Low",
            ],
        },
        {
            // key: "IS-1-0---FT3",
            key: "FT3",
            title: "Fault 3",
            desc: "Output / Circuit Fault",
            icon: powerIcon,
            meanings: [
                "Normal",
                "AC Output Overload",
                "PV Short Circuit",
                "AC Short Circuit",
                "Leakage Current High",
            ],
        },
        {
            // key: "IS-1-0---FT4",
            key: "FT4",
            title: "Fault 4",
            desc: "Temperature Fault",
            icon: temperatureIcon,
            meanings: [
                "Normal",
                "High Temperature",
            ],
        },
        {
            // key: "IS-1-0---FT5",
            key: "FT5",
            title: "Fault 5",
            desc: "Other Fault",
            icon: warningIcon,
            meanings: [
                "Normal",
                "Other Fault",
            ],
        },
    ];

    // GET FAULT TEXT
    const getFaultText = (fault) => {

        // const value = data?.[fault.key];
        const value = getParameterValue(fault.key);

        if (value == null) return "--";

        return fault.meanings[value] || "Unknown";
    };

    // ACTIVE FAULT?
    const isFaultActive = (fault) => {

        // const value = data?.[fault.key];
        const value = getParameterValue(fault.key);

        return value !== 0 && value != null;
    };

    return (
        <div
            style={{
                minHeight: "100vh",
                paddingBottom: "90px",
                background: P.bg,
            }}
        >

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
                        marginBottom: "10px",
                        marginTop: "10px",
                        letterSpacing: "-0.3px",
                        fontFamily:
                            "'Space Mono', monospace",
                    }}
                >
                    FAULT DETAILS
                </h2>

                {/* FAULT CONTAINER */}
                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "16px",
                    }}
                >

                    {faultDefs.map((fault) => {

                        const active = isFaultActive(fault);

                        return (

                            <div
                                key={fault.key}

                                style={{
                                    background: P.surface,

                                    // border:
                                    //     `1px solid ${
                                    //         active
                                    //             ? P.red
                                    //             : P.border
                                    //     }`,

                                    borderRadius: 14,

                                    padding: "18px",

                                    boxShadow:
                                        "0 2px 8px rgba(0,0,0,0.06)",
                                }}
                            >

                                {/* TOP ROW */}
                                <div
                                    style={{
                                        display: "flex",

                                        justifyContent:
                                            "space-between",

                                        alignItems: "flex-start",
                                    }}
                                >

                                    {/* ICON + TITLE SECTION */}
                                    <div
                                        style={{
                                            display: "flex",
                                            gap: "12px",
                                            flex: 1,
                                            alignItems: "flex-start",
                                        }}
                                    >
                                        {/* ICON */}
                                        <div
                                            style={{
                                                color: active ? P.red : P.green,
                                                flexShrink: 0,
                                                marginTop: "2px",
                                            }}
                                        >
                                            {fault.icon}
                                        </div>

                                        {/* TITLE */}
                                        <div>

                                            <div
                                                style={{
                                                    fontSize: 18,

                                                    fontWeight: 700,

                                                    color:
                                                        P.textPrimary,

                                                    fontFamily:
                                                        "'Source Sans Pro', sans-serif",
                                                }}
                                            >
                                                {fault.title}
                                            </div>

                                            <div
                                                style={{
                                                    fontSize: 13,

                                                    color:
                                                        P.textMuted,

                                                    marginTop: 2,

                                                    fontFamily:
                                                        "'Source Sans Pro', sans-serif",
                                                }}
                                            >
                                                {fault.desc}
                                            </div>
                                        </div>
                                    </div>

                                    {/* STATUS BOX */}
                                    <div
                                        style={{
                                            minWidth: 90,
                                            padding: "8px 12px",

                                            borderRadius: 10,

                                            background:
                                                active
                                                    ? P.red
                                                    : P.green,

                                            display: "flex",

                                            alignItems: "center",

                                            justifyContent: "center",

                                            boxShadow:
                                                `0 0 10px ${active
                                                    ? P.red
                                                    : P.green
                                                }55`,

                                            flexShrink: 0,
                                        }}
                                    >

                                        <span
                                            style={{
                                                fontSize: 13,

                                                fontWeight: 700,

                                                color: P.surface,

                                                fontFamily:
                                                    "'Source Sans Pro', sans-serif",

                                                letterSpacing: 0.5,

                                                wordWrap: "break-word",
                                                whiteSpace: "normal",
                                                textAlign: "center",
                                            }}
                                        >
                                            {getFaultText(fault)}
                                        </span>

                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* FOOTER */}
            <Footer data={data} />

        </div>
    );
}