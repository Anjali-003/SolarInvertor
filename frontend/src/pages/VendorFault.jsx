import VendorFooter from "../components/VendorFooter";
import DeviceInfo from "../components/DeviceInfo";
import { useVendorDevice } from "../context/VendorDeviceContext";
import P from "../theme/colors";
import PageBackground from "../components/PageBackground";
import VendorPageHeader from "../components/VendorPageHeader";

export default function VendorFault() {
    // ============================================================
    // DEVICE CONTEXT
    // ============================================================
const {
    data,
    loading,
    lastUpdated,
    selectedDevice,
} = useVendorDevice();

    // ============================================================
    // GET PARAMETER VALUE
    // ============================================================

    const getParameterValue = (parameter) => {
        return data?.[parameter] ?? 0;
    };

    // ============================================================
    // ICONS
    // ============================================================

    const voltageIcon = (
        <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M18 3H6a3 3 0 0 0-3 3v12a3 3 0 0 0 3 3h12a3 3 0 0 0 3-3V6a3 3 0 0 0-3-3z" />
            <line x1="7" y1="10" x2="17" y2="10" />
            <line x1="7" y1="14" x2="17" y2="14" />
        </svg>
    );

    const frequencyIcon = (
        <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
            <path d="M21 3v5h-5" />
            <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
            <path d="M3 21v-5h5" />
        </svg>
    );

    const powerIcon = (
        <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
        </svg>
    );

    const temperatureIcon = (
        <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M12 2v20" />
            <path d="M12 20a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" />
            <path d="M9 9a3 3 0 0 1 6 0" />
            <line x1="9" y1="9" x2="9" y2="5" />
            <line x1="15" y1="9" x2="15" y2="5" />
        </svg>
    );

    const warningIcon = (
        <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3.05h16.94a2 2 0 0 0 3.42 0z" />
            <line x1="12" y1="9" x2="12" y2="13" />
            <line x1="12" y1="17" x2="12.01" y2="17" />
        </svg>
    );

    // ============================================================
    // FAULT DEFINITIONS
    // ============================================================

    const faultDefs = [
        {
            key: "ST1_BIT0",
            statusKey: "ST1",
            bit: 0,
            title: "Grid Over Voltage",
            desc: "Grid Voltage Fault",
            icon: voltageIcon,
        },
        {
            key: "ST1_BIT1",
            statusKey: "ST1",
            bit: 1,
            title: "Grid Under Voltage",
            desc: "Grid Voltage Fault",
            icon: voltageIcon,
        },
        {
            key: "ST1_BIT2",
            statusKey: "ST1",
            bit: 2,
            title: "Grid Over Frequency",
            desc: "Grid Frequency Fault",
            icon: frequencyIcon,
        },
        {
            key: "ST1_BIT3",
            statusKey: "ST1",
            bit: 3,
            title: "Grid Under Frequency",
            desc: "Grid Frequency Fault",
            icon: frequencyIcon,
        },
        {
            key: "ST1_BIT4",
            statusKey: "ST1",
            bit: 4,
            title: "Inverter Over Current",
            desc: "Inverter Current Fault",
            icon: powerIcon,
        },
        {
            key: "ST1_BIT5",
            statusKey: "ST1",
            bit: 5,
            title: "Differential Current",
            desc: "Inverter Current Unbalance",
            icon: powerIcon,
        },
        {
            key: "ST1_BIT6",
            statusKey: "ST1",
            bit: 6,
            title: "Over Temperature",
            desc: "Temperature Fault",
            icon: temperatureIcon,
        },
        {
            key: "ST2_BIT0",
            statusKey: "ST2",
            bit: 0,
            title: "PV Over Voltage",
            desc: "PV Voltage Fault",
            icon: voltageIcon,
        },
        {
            key: "ST2_BIT1",
            statusKey: "ST2",
            bit: 1,
            title: "PV Under Voltage",
            desc: "PV Voltage Fault",
            icon: voltageIcon,
        },
        {
            key: "ST2_BIT2",
            statusKey: "ST2",
            bit: 2,
            title: "PV Over Current",
            desc: "PV Current Fault",
            icon: powerIcon,
        },
        {
            key: "ST2_BIT3",
            statusKey: "ST2",
            bit: 3,
            title: "DC Bus Over Voltage",
            desc: "DC Bus Voltage Fault",
            icon: voltageIcon,
        },
        {
            key: "ST2_BIT4",
            statusKey: "ST2",
            bit: 4,
            title: "DC Bus Under Voltage",
            desc: "DC Bus Voltage Fault",
            icon: voltageIcon,
        },
        {
            key: "ST2_BIT5",
            statusKey: "ST2",
            bit: 5,
            title: "Earth Fault",
            desc: "Earth Fault Detected",
            icon: warningIcon,
        },
    ];

    // ============================================================
    // CHECK WHETHER FAULT IS ACTIVE
    // ============================================================

    const isFaultActive = (fault) => {
        const statusValue =
            Number(getParameterValue(fault.statusKey)) || 0;

        return Boolean(
            statusValue & (1 << fault.bit)
        );
    };

    // ============================================================
    // ACTIVE FAULTS
    // ============================================================

    const activeFaults =
        faultDefs.filter(isFaultActive);

    // ============================================================
    // PAGE
    // ============================================================

    return (
        <PageBackground>
            <div
                style={{
                    minHeight: "100vh",
                    paddingBottom: "90px",
                    fontFamily: "'Inter', sans-serif",
                }}
            >
                {/* HEADER */}

                <VendorPageHeader
                    title="FAULT"
                    backPath="/vendor"
                />

                {/* MAIN CONTAINER */}

                <div
                    style={{
                        width: "100%",
                        maxWidth: 520,
                        margin: "0 auto",
                        boxSizing: "border-box",
                    }}
                >
                    {/* DEVICE INFO */}

                    {/* <DeviceInfo
                        data={data}
                        lastUpdated={lastUpdated}
                        devices={devices}
                        selectedDeviceId={selectedDeviceId}
                    /> */}

                    <DeviceInfo
    data={data}
    lastUpdated={lastUpdated}
    devices={selectedDevice ? [selectedDevice] : []}
    selectedDeviceId={selectedDevice?.id}
/>

                    {/* PAGE CONTENT */}

                    <div
                        style={{
                            padding: "0 20px 20px",
                            boxSizing: "border-box",
                        }}
                    >
                        {/* HEADING */}

                        <h2
                            style={{
                                fontSize: 15,
                                fontWeight: 800,
                                color: P.textWhite,
                                marginBottom: 14,
                                marginTop: 4,
                                fontFamily: "'DM Sans', sans-serif",
                            }}
                        >
                            FAULT DETAILS
                        </h2>

                        {/* OVERALL STATUS */}

                        <div
                            style={{
                                background:
                                    activeFaults.length > 0
                                        ? P.surfaceRed
                                        : P.surfaceGreen,

                                border: `1px solid ${
                                    activeFaults.length > 0
                                        ? P.red
                                        : P.borderGreen
                                }`,

                                borderRadius: 14,
                                padding: "12px 16px",
                                marginBottom: 16,

                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",

                                boxSizing: "border-box",
                                width: "100%",
                            }}
                        >
                            <div
                                style={{
                                    fontSize: 13,
                                    fontWeight: 700,

                                    color:
                                        activeFaults.length > 0
                                            ? P.red
                                            : P.textGreen,

                                    fontFamily:
                                        "'DM Sans', sans-serif",
                                }}
                            >
                                {activeFaults.length > 0
                                    ? `${activeFaults.length} Active Fault${
                                          activeFaults.length > 1
                                              ? "s"
                                              : ""
                                      }`
                                    : "No Active Faults"}
                            </div>

                            <div
                                style={{
                                    width: 9,
                                    height: 9,
                                    borderRadius: "50%",

                                    background:
                                        activeFaults.length > 0
                                            ? P.red
                                            : P.green,

                                    boxShadow: `0 0 6px ${
                                        activeFaults.length > 0
                                            ? P.red
                                            : P.green
                                    }`,

                                    flexShrink: 0,
                                }}
                            />
                        </div>

                        {/* ACTIVE FAULTS */}

                        {activeFaults.length > 0 ? (
                            <div
                                style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: 16,
                                    width: "100%",
                                }}
                            >
                                {activeFaults.map((fault) => (
                                    <div
                                        key={fault.key}
                                        style={{
                                            background: P.surface,
                                            borderRadius: 14,
                                            overflow: "hidden",
                                            boxShadow:
                                                P.shadowCardRaised,
                                            width: "100%",
                                            boxSizing: "border-box",
                                        }}
                                    >
                                        {/* ICON + TITLE */}

                                        <div
                                            style={{
                                                display: "flex",
                                                alignItems: "center",
                                                gap: 12,
                                                padding:
                                                    "14px 16px 10px",
                                                minWidth: 0,
                                            }}
                                        >
                                            {/* ICON */}

                                            <div
                                                style={{
                                                    width: 40,
                                                    height: 40,
                                                    borderRadius: 10,

                                                    background:
                                                        P.surfaceRed,

                                                    display: "flex",
                                                    alignItems:
                                                        "center",
                                                    justifyContent:
                                                        "center",

                                                    flexShrink: 0,
                                                    color: P.red,
                                                }}
                                            >
                                                {fault.icon}
                                            </div>

                                            {/* TITLE + DESCRIPTION */}

                                            <div
                                                style={{
                                                    minWidth: 0,
                                                }}
                                            >
                                                <div
                                                    style={{
                                                        fontSize: 15,
                                                        fontWeight: 700,
                                                        color:
                                                            P.textPrimary,
                                                        fontFamily:
                                                            "'DM Sans', sans-serif",
                                                        lineHeight: 1.2,
                                                    }}
                                                >
                                                    {fault.title}
                                                </div>

                                                <div
                                                    style={{
                                                        fontSize: 12,
                                                        color:
                                                            P.textMuted,
                                                        marginTop: 3,
                                                        fontFamily:
                                                            "'Inter', sans-serif",
                                                        lineHeight: 1.2,
                                                    }}
                                                >
                                                    {fault.desc}
                                                </div>
                                            </div>
                                        </div>

                                        {/* STATUS BANNER */}

                                        <div
                                            style={{
                                                background: P.red,
                                                padding: "8px 16px",
                                                textAlign: "left",
                                            }}
                                        >
                                            <span
                                                style={{
                                                    fontSize: 13,
                                                    fontWeight: 700,
                                                    color:
                                                        P.textWhite,
                                                    fontFamily:
                                                        "'DM Sans', sans-serif",
                                                    letterSpacing: 0.3,
                                                }}
                                            >
                                                FAULT ACTIVE
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            /* NO FAULTS */

                            <div
                                style={{
                                    background:
                                        P.surfaceGreen,

                                    border:
                                        `1px solid ${P.borderGreen}`,

                                    borderRadius: 14,
                                    padding: "28px 20px",
                                    textAlign: "center",
                                    width: "100%",
                                    boxSizing: "border-box",
                                }}
                            >
                                <div
                                    style={{
                                        width: 48,
                                        height: 48,
                                        borderRadius: "50%",

                                        background: P.green,
                                        color: P.textWhite,

                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",

                                        margin:
                                            "0 auto 12px",

                                        fontSize: 24,
                                        fontWeight: 800,
                                    }}
                                >
                                    ✓
                                </div>

                                <div
                                    style={{
                                        fontSize: 16,
                                        fontWeight: 800,
                                        color: P.textGreen,
                                        fontFamily:
                                            "'DM Sans', sans-serif",
                                    }}
                                >
                                    No Active Faults
                                </div>

                                <div
                                    style={{
                                        fontSize: 12,
                                        color: P.textMuted,
                                        marginTop: 5,
                                        fontFamily:
                                            "'Inter', sans-serif",
                                    }}
                                >
                                    The inverter is operating normally.
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* FOOTER */}

                <VendorFooter />
            </div>
        </PageBackground>
    );
}