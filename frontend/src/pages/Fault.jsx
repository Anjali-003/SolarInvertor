// import { useInverter } from "../context/Context";
// import Footer from "../components/Footer";
// import P from "../theme/colors";
// import PageHeader from "../components/PageHeader";
// import DeviceInfo from "../components/DeviceInfo";
// import PageBackground from "../components/PageBackground";

// export default function Fault() {
//     // const { data, lastUpdated } = useInverter();

//       const {
//     data,
//     lastUpdated,
//     devices,
//     selectedDeviceId
// } = useInverter();

//     // ─── GET PARAMETER VALUE ───────────────────────────────────────
//     const getParameterValue = (parameter) => {
//         return data?.[parameter] ?? 0;
//     };

//     // ─── ICONS ─────────────────────────────────────────────────────

//     const voltageIcon = (
//         <svg
//             width="24"
//             height="24"
//             viewBox="0 0 24 24"
//             fill="none"
//             stroke="currentColor"
//             strokeWidth="2"
//             strokeLinecap="round"
//             strokeLinejoin="round"
//         >
//             <path d="M18 3H6a3 3 0 0 0-3 3v12a3 3 0 0 0 3 3h12a3 3 0 0 0 3-3V6a3 3 0 0 0-3-3z" />
//             <line x1="7" y1="10" x2="17" y2="10" />
//             <line x1="7" y1="14" x2="17" y2="14" />
//         </svg>
//     );

//     const frequencyIcon = (
//         <svg
//             width="24"
//             height="24"
//             viewBox="0 0 24 24"
//             fill="none"
//             stroke="currentColor"
//             strokeWidth="2"
//             strokeLinecap="round"
//             strokeLinejoin="round"
//         >
//             <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
//             <path d="M21 3v5h-5" />
//             <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74 2.74L3 16" />
//             <path d="M3 21v-5h5" />
//         </svg>
//     );

//     const powerIcon = (
//         <svg
//             width="24"
//             height="24"
//             viewBox="0 0 24 24"
//             fill="none"
//             stroke="currentColor"
//             strokeWidth="2"
//             strokeLinecap="round"
//             strokeLinejoin="round"
//         >
//             <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
//         </svg>
//     );

//     const temperatureIcon = (
//         <svg
//             width="24"
//             height="24"
//             viewBox="0 0 24 24"
//             fill="none"
//             stroke="currentColor"
//             strokeWidth="2"
//             strokeLinecap="round"
//             strokeLinejoin="round"
//         >
//             <path d="M12 2v20" />
//             <path d="M12 20a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" />
//             <path d="M9 9a3 3 0 0 1 6 0" />
//             <line x1="9" y1="9" x2="9" y2="5" />
//             <line x1="15" y1="9" x2="15" y2="5" />
//         </svg>
//     );

//     const warningIcon = (
//         <svg
//             width="24"
//             height="24"
//             viewBox="0 0 24 24"
//             fill="none"
//             stroke="currentColor"
//             strokeWidth="2"
//             strokeLinecap="round"
//             strokeLinejoin="round"
//         >
//             <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3.05h16.94a2 2 0 0 0 3.42 0z" />
//             <line x1="12" y1="9" x2="12" y2="13" />
//             <line x1="12" y1="17" x2="12.01" y2="17" />
//         </svg>
//     );

//     // ─── FAULT DEFINITIONS ─────────────────────────────────────────
//     //
//     // ST1
//     // bit 0 = Grid OV
//     // bit 1 = Grid UV
//     // bit 2 = Grid OF
//     // bit 3 = Grid UF
//     // bit 4 = Inverter OC
//     // bit 5 = Differential Current
//     // bit 6 = Temperature
//     //
//     // ST2
//     // bit 0 = PV OV
//     // bit 1 = PV UV
//     // bit 2 = PV OC
//     // bit 3 = DC Bus OV
//     // bit 4 = DC Bus UV
//     // bit 5 = Earth Fault

//     const faultDefs = [
//         {
//             key: "ST1_BIT0",
//             statusKey: "ST1",
//             bit: 0,
//             title: "Grid Over Voltage",
//             desc: "Grid Voltage Fault",
//             icon: voltageIcon,
//         },
//         {
//             key: "ST1_BIT1",
//             statusKey: "ST1",
//             bit: 1,
//             title: "Grid Under Voltage",
//             desc: "Grid Voltage Fault",
//             icon: voltageIcon,
//         },
//         {
//             key: "ST1_BIT2",
//             statusKey: "ST1",
//             bit: 2,
//             title: "Grid Over Frequency",
//             desc: "Grid Frequency Fault",
//             icon: frequencyIcon,
//         },
//         {
//             key: "ST1_BIT3",
//             statusKey: "ST1",
//             bit: 3,
//             title: "Grid Under Frequency",
//             desc: "Grid Frequency Fault",
//             icon: frequencyIcon,
//         },
//         {
//             key: "ST1_BIT4",
//             statusKey: "ST1",
//             bit: 4,
//             title: "Inverter Over Current",
//             desc: "Inverter Current Fault",
//             icon: powerIcon,
//         },
//         {
//             key: "ST1_BIT5",
//             statusKey: "ST1",
//             bit: 5,
//             title: "Differential Current",
//             desc: "Inverter Current Unbalance",
//             icon: powerIcon,
//         },
//         {
//             key: "ST1_BIT6",
//             statusKey: "ST1",
//             bit: 6,
//             title: "Over Temperature",
//             desc: "Temperature Fault",
//             icon: temperatureIcon,
//         },
//         {
//             key: "ST2_BIT0",
//             statusKey: "ST2",
//             bit: 0,
//             title: "PV Over Voltage",
//             desc: "PV Voltage Fault",
//             icon: voltageIcon,
//         },
//         {
//             key: "ST2_BIT1",
//             statusKey: "ST2",
//             bit: 1,
//             title: "PV Under Voltage",
//             desc: "PV Voltage Fault",
//             icon: voltageIcon,
//         },
//         {
//             key: "ST2_BIT2",
//             statusKey: "ST2",
//             bit: 2,
//             title: "PV Over Current",
//             desc: "PV Current Fault",
//             icon: powerIcon,
//         },
//         {
//             key: "ST2_BIT3",
//             statusKey: "ST2",
//             bit: 3,
//             title: "DC Bus Over Voltage",
//             desc: "DC Bus Voltage Fault",
//             icon: voltageIcon,
//         },
//         {
//             key: "ST2_BIT4",
//             statusKey: "ST2",
//             bit: 4,
//             title: "DC Bus Under Voltage",
//             desc: "DC Bus Voltage Fault",
//             icon: voltageIcon,
//         },
//         {
//             key: "ST2_BIT5",
//             statusKey: "ST2",
//             bit: 5,
//             title: "Earth Fault",
//             desc: "Earth Fault Detected",
//             icon: warningIcon,
//         },
//     ];

//     // ─── CHECK WHETHER FAULT IS ACTIVE ─────────────────────────────

//     const isFaultActive = (fault) => {
//         const statusValue = Number(getParameterValue(fault.statusKey)) || 0;

//         return Boolean(statusValue & (1 << fault.bit));
//     };

//     // ─── ONLY KEEP ACTIVE FAULTS ───────────────────────────────────

//     const activeFaults = faultDefs.filter(isFaultActive);

//     return (
//         <PageBackground>
//         <div
//             style={{
//                 minHeight: "100vh",
//                 paddingBottom: "90px",
//                 fontFamily: "'Inter', sans-serif",
//             }}
//         >
//             <PageHeader
//                 title="FAULT"
//                 backPath="/"
//             />

//             <div
//                 style={{
//                     width: "100%",
//                     maxWidth: 520,
//                     margin: "0 auto",
//                     boxSizing: "border-box",
//                 }}
//             >
// {/*
//             <DeviceInfo
//                 data={data}
//                 lastUpdated={lastUpdated}
//             /> */}

//             <DeviceInfo
//     data={data}
//     lastUpdated={lastUpdated}
//     devices={devices}
//     selectedDeviceId={selectedDeviceId}
// />

//             {/* ================= PAGE CONTENT ================= */}

//             <div
//                 style={{
//                     padding: "0 20px 20px", boxSizing: "border-box",
//                 }}
//             >
//                 {/* HEADING */}
//                 <h2
//                     style={{
//                         fontSize: 15,
//                         fontWeight: 800,
//                         color: P.textWhite,
//                         marginBottom: 14,
//                         marginTop: 4,
//                         fontFamily: "'DM Sans', sans-serif",
//                     }}
//                 >
//                     FAULT DETAILS
//                 </h2>

//                 {/* ================= OVERALL STATUS ================= */}

//                 <div
//                     style={{
//                         background:
//                             activeFaults.length > 0
//                                 ? P.surfaceRed
//                                 : P.surfaceGreen,
//                         border: `1px solid ${
//                             activeFaults.length > 0
//                                 ? P.red
//                                 : P.borderGreen
//                         }`,
//                         borderRadius: 14,
//                         padding: "12px 16px",
//                         marginBottom: 16,
//                         display: "flex",
//                         alignItems: "center",
//                         justifyContent: "space-between",
//                     }}
//                 >
//                     <div
//                         style={{
//                             fontSize: 13,
//                             fontWeight: 700,
//                             color:
//                                 activeFaults.length > 0
//                                     ? P.red
//                                     : P.textGreen,
//                             fontFamily: "'DM Sans', sans-serif",
//                         }}
//                     >
//                         {activeFaults.length > 0
//                             ? `${activeFaults.length} Active Fault${
//                                   activeFaults.length > 1 ? "s" : ""
//                               }`
//                             : "No Active Faults"}
//                     </div>

//                     <div
//                         style={{
//                             width: 9,
//                             height: 9,
//                             borderRadius: "50%",
//                             background:
//                                 activeFaults.length > 0
//                                     ? P.red
//                                     : P.green,
//                             boxShadow: `0 0 6px ${
//                                 activeFaults.length > 0
//                                     ? P.red
//                                     : P.green
//                             }`,
//                         }}
//                     />
//                 </div>

//                 {/* ================= ACTIVE FAULTS ONLY ================= */}

//                 {activeFaults.length > 0 ? (
//                     <div
//                         style={{
//                             display: "flex",
//                             flexDirection: "column",
//                             gap: "16px",
//                         }}
//                     >
//                         {activeFaults.map((fault) => (
//                             <div
//                                 key={fault.key}
//                                 style={{
//                                     background: P.surface,
//                                     borderRadius: 14,
//                                     overflow: "hidden",
//                                     boxShadow: P.shadowCardRaised,
//                                 }}
//                             >
//                                 {/* ICON + TITLE ROW */}
//                                 <div
//                                     style={{
//                                         display: "flex",
//                                         alignItems: "center",
//                                         gap: 12,
//                                         padding: "14px 16px 10px",
//                                     }}
//                                 >
//                                     {/* ICON */}
//                                     <div
//                                         style={{
//                                             width: 40,
//                                             height: 40,
//                                             borderRadius: 10,
//                                             background: P.surfaceRed,
//                                             display: "flex",
//                                             alignItems: "center",
//                                             justifyContent: "center",
//                                             flexShrink: 0,
//                                             color: P.red,
//                                         }}
//                                     >
//                                         {fault.icon}
//                                     </div>

//                                     {/* TITLE + DESCRIPTION */}
//                                     <div>
//                                         <div
//                                             style={{
//                                                 fontSize: 15,
//                                                 fontWeight: 700,
//                                                 color: P.textPrimary,
//                                                 fontFamily:
//                                                     "'DM Sans', sans-serif",
//                                             }}
//                                         >
//                                             {fault.title}
//                                         </div>

//                                         <div
//                                             style={{
//                                                 fontSize: 12,
//                                                 color: P.textMuted,
//                                                 marginTop: 2,
//                                                 fontFamily:
//                                                     "'Inter', sans-serif",
//                                             }}
//                                         >
//                                             {fault.desc}
//                                         </div>
//                                     </div>
//                                 </div>

//                                 {/* STATUS BANNER */}
//                                 <div
//                                     style={{
//                                         background: P.red,
//                                         padding: "8px 16px",
//                                         textAlign: "left",
//                                     }}
//                                 >
//                                     <span
//                                         style={{
//                                             fontSize: 13,
//                                             fontWeight: 700,
//                                             color: P.textWhite,
//                                             fontFamily:
//                                                 "'DM Sans', sans-serif",
//                                             letterSpacing: 0.3,
//                                         }}
//                                     >
//                                         FAULT ACTIVE
//                                     </span>
//                                 </div>
//                             </div>
//                         ))}
//                     </div>
//                 ) : (
//                     /* ================= NO FAULTS ================= */

//                     <div
//                         style={{
//                             background: P.surfaceGreen,
//                             border: `1px solid ${P.borderGreen}`,
//                             borderRadius: 14,
//                             padding: "28px 20px",
//                             textAlign: "center",
//                         }}
//                     >
//                         <div
//                             style={{
//                                 width: 48,
//                                 height: 48,
//                                 borderRadius: "50%",
//                                 background: P.green,
//                                 color: P.textWhite,
//                                 display: "flex",
//                                 alignItems: "center",
//                                 justifyContent: "center",
//                                 margin: "0 auto 12px",
//                                 fontSize: 24,
//                                 fontWeight: 800,
//                             }}
//                         >
//                             ✓
//                         </div>

//                         <div
//                             style={{
//                                 fontSize: 16,
//                                 fontWeight: 800,
//                                 color: P.textGreen,
//                                 fontFamily: "'DM Sans', sans-serif",
//                             }}
//                         >
//                             No Active Faults
//                         </div>

//                         <div
//                             style={{
//                                 fontSize: 12,
//                                 color: P.textMuted,
//                                 marginTop: 5,
//                                 fontFamily: "'Inter', sans-serif",
//                             }}
//                         >
//                             The inverter is operating normally.
//                         </div>
//                     </div>
//                 )}
//             </div>
//             </div>
//             <Footer data={data} />
//         </div>
//         </PageBackground>
//     );
// }































import { useInverter } from "../context/Context";
import Footer from "../components/Footer";
import P from "../theme/colors";
import DeviceInfo from "../components/DeviceInfo";
import PageBackground from "../components/PageBackground";


export default function Fault() {

    // =====================================================
    // CONTEXT
    // =====================================================

    const {
        data,
        lastUpdated,
        devices,
        selectedDeviceId,
        energy,
        cuf
    } = useInverter();


    // =====================================================
    // PARAMETER HELPER
    // =====================================================

    const getParameterValue = (
        parameter,
        fallback = "--"
    ) => {

        const value =
            data?.[parameter];

        return (
            value !== undefined &&
            value !== null
        )
            ? value
            : fallback;
    };


    // =====================================================
    // NUMBER FORMAT
    // =====================================================

    const formatNumber = (
        value,
        decimals = null
    ) => {

        const number =
            Number(value);

        if (
            !Number.isFinite(number)
        ) {
            return "--";
        }


        if (
            decimals === null
        ) {
            return number;
        }


        return number.toFixed(
            decimals
        );
    };


    // =====================================================
    // CUF
    // =====================================================

    const formatCUF = (
        value
    ) => {

        const number =
            Number(value);

        if (
            !Number.isFinite(number)
        ) {
            return "--";
        }

        return number.toFixed(2);
    };


    // =====================================================
    // ST3 STATUS
    // =====================================================
    //
    // ST3
    //
    // bit 0 = inverter relay
    // bit 1 = grid relay
    // bit 2 = inverter/system status
    // bit 3 = PF status
    //
    // =====================================================

    const st3 =
        Number(
            data?.ST3 ?? 0
        );


    const inverterRelayConnected =
        Boolean(
            st3 & (1 << 0)
        );


    const gridRelayConnected =
        Boolean(
            st3 & (1 << 1)
        );


    const inverterRunning =
        Boolean(
            st3 & (1 << 2)
        );


    // =====================================================
    // STATUS TEXT
    // =====================================================

    const inverterRelayText =
        inverterRelayConnected
            ? "Connected"
            : "Disconnected";


    const gridRelayText =
        gridRelayConnected
            ? "Connected"
            : "Disconnected";


    const systemStatusText =
        inverterRunning
            ? "ON"
            : "OFF";


    // =====================================================
    // FAULT DEFINITIONS
    // =====================================================

    const faultDefs = [

        // ================= ST1 =================

        {
            key: "ST1_BIT0",
            statusKey: "ST1",
            bit: 0,
            title: "Grid Over Voltage"
        },

        {
            key: "ST1_BIT1",
            statusKey: "ST1",
            bit: 1,
            title: "Grid Under Voltage"
        },

        {
            key: "ST1_BIT2",
            statusKey: "ST1",
            bit: 2,
            title: "Grid Over Frequency"
        },

        {
            key: "ST1_BIT3",
            statusKey: "ST1",
            bit: 3,
            title: "Grid Under Frequency"
        },

        {
            key: "ST1_BIT4",
            statusKey: "ST1",
            bit: 4,
            title: "Inverter Over Current"
        },

        {
            key: "ST1_BIT5",
            statusKey: "ST1",
            bit: 5,
            title: "Differential Current"
        },

        {
            key: "ST1_BIT6",
            statusKey: "ST1",
            bit: 6,
            title: "Over Temperature"
        },


        // ================= ST2 =================

        {
            key: "ST2_BIT0",
            statusKey: "ST2",
            bit: 0,
            title: "PV Over Voltage"
        },

        {
            key: "ST2_BIT1",
            statusKey: "ST2",
            bit: 1,
            title: "PV Under Voltage"
        },

        {
            key: "ST2_BIT2",
            statusKey: "ST2",
            bit: 2,
            title: "PV Over Current"
        },

        {
            key: "ST2_BIT3",
            statusKey: "ST2",
            bit: 3,
            title: "DC Bus Over Voltage"
        },

        {
            key: "ST2_BIT4",
            statusKey: "ST2",
            bit: 4,
            title: "DC Bus Under Voltage"
        },

        {
            key: "ST2_BIT5",
            statusKey: "ST2",
            bit: 5,
            title: "Earth Fault"
        }
    ];


    // =====================================================
    // ACTIVE FAULTS
    // =====================================================

    const activeFaults =
        faultDefs.filter(
            fault => {

                const statusValue =
                    Number(
                        data?.[
                            fault.statusKey
                        ] ?? 0
                    );


                return Boolean(

                    statusValue &
                    (
                        1 <<
                        fault.bit
                    )
                );
            }
        );


    // =====================================================
    // UI
    // =====================================================

    return (

        <PageBackground>

            <div
                style={{
                    minHeight:
                        "100vh",

                    paddingBottom:
                        "90px",

                    fontFamily:
                        "'Inter', sans-serif"
                }}
            >

                {/*
                    I intentionally removed PageHeader
                    to make this closer to the new
                    screenshots.

                    If you still want the top FAULT header,
                    simply put PageHeader back here.
                */}


                <div
                    style={{
                        width:
                            "100%",

                        maxWidth:
                            520,

                        margin:
                            "0 auto",

                        boxSizing:
                            "border-box",

                        paddingTop:
                            4
                    }}
                >

                    {/* =================================================
                        DEVICE INFO
                    ================================================= */}

                    <DeviceInfo

                        data={
                            data
                        }

                        lastUpdated={
                            lastUpdated
                        }

                        devices={
                            devices
                        }

                        selectedDeviceId={
                            selectedDeviceId
                        }

                    />


                    {/* =================================================
                        PAGE CONTENT
                    ================================================= */}

                    <div
                        style={{
                            padding:
                                "0 20px 20px",

                            boxSizing:
                                "border-box"
                        }}
                    >


                        {/* =================================================
                            PV PARAMETERS
                        ================================================= */}

                        <ParameterCard
                            title="PV Parameters"
                        >

                            <ParameterRow
                                label="PV Voltage"
                                value={
                                    getParameterValue(
                                        "PV"
                                    )
                                }
                                unit="V"
                            />


                            <ParameterRow
                                label="PV Current"
                                value={
                                    getParameterValue(
                                        "PI"
                                    )
                                }
                                unit="A"
                            />


                            <ParameterRow
                                label="Solar Power"
                                value={
                                    getParameterValue(
                                        "PPOW"
                                    )
                                }
                                unit="W"
                            />


                            <ParameterRow
                                label="Today Gen"
                                value={
                                    energy?.today ??
                                    "--"
                                }
                                unit="kWh"
                            />


                            <ParameterRow
                                label="Total Gen"
                                value={
                                    getParameterValue(
                                        "LKWH"
                                    )
                                }
                                unit="kWh"
                            />


                            <ParameterRow
                                label="CUF (Daily)"
                                value={
                                    formatCUF(
                                        cuf?.today
                                    )
                                }
                                unit="%"
                            />


                            <ParameterRow
                                label="CUF (Monthly)"
                                value={
                                    formatCUF(
                                        cuf?.monthly
                                    )
                                }
                                unit="%"
                            />


                            <ParameterRow
                                label="CUF (Yearly)"
                                value={
                                    formatCUF(
                                        cuf?.yearly
                                    )
                                }
                                unit="%"
                                last
                            />

                        </ParameterCard>


                        {/* =================================================
                            AC PARAMETERS
                        ================================================= */}

                        <ParameterCard
                            title="AC Parameters"
                        >

                            <ParameterRow
                                label="Grid Voltage"
                                value={
                                    getParameterValue(
                                        "VN"
                                    )
                                }
                                unit="V"
                            />


                            {/*
                                IMPORTANT:

                                Your current VD=5 payload
                                does NOT contain a dedicated
                                AC/Grid current parameter.

                                Your previous Home.jsx used
                                DCI1 as AC Current, therefore
                                I am keeping that mapping here.

                                Replace DCI1 once you confirm
                                the correct AC current key.
                            */}

                            <ParameterRow
                                label="Grid Current"
                                value={
                                    getParameterValue(
                                        "DCI1"
                                    )
                                }
                                unit="A"
                            />


                            <ParameterRow
                                label="Grid Frequency"
                                value={
                                    getParameterValue(
                                        "GFREQ"
                                    )
                                }
                                unit="Hz"
                            />


                            <ParameterRow
                                label="Power Factor"
                                value={
                                    getParameterValue(
                                        "PF"
                                    )
                                }
                            />


                            <ParameterRow
                                label="Export Power"
                                value={
                                    getParameterValue(
                                        "POW"
                                    )
                                }
                                unit="W"
                                last
                            />

                        </ParameterCard>


                        {/* =================================================
                            STATUS
                        ================================================= */}

                        <ParameterCard
                            title="Status"
                        >

                            <ParameterRow
                                label="Inverter Relay Status"
                                value={
                                    inverterRelayText
                                }
                            />


                            <ParameterRow
                                label="Grid Relay Status"
                                value={
                                    gridRelayText
                                }
                            />


                            <ParameterRow
                                label="System Status"
                                value={
                                    systemStatusText
                                }
                                valueColor={
                                    inverterRunning
                                        ? P.green
                                        : P.red
                                }
                            />


                            <ParameterRow
                                label="Temperature"
                                value={
                                    getParameterValue(
                                        "TEMP"
                                    )
                                }
                                unit="°C"
                                last
                            />

                        </ParameterCard>


                        {/* =================================================
                            FAULTS
                        ================================================= */}

                        <div
                            style={{
                                background:
                                    P.surface,

                                border:
                                    `1px solid ${P.border}`,

                                borderRadius:
                                    14,

                                padding:
                                    "16px 12px",

                                boxShadow:
                                    P.shadowCardRaised,

                                marginBottom:
                                    16
                            }}
                        >

                            <div
                                style={{
                                    fontSize:
                                        18,

                                    fontWeight:
                                        700,

                                    color:
                                        P.textPrimary,

                                    marginBottom:
                                        10,

                                    fontFamily:
                                        "'DM Sans', sans-serif"
                                }}
                            >
                                Faults
                            </div>


                            {activeFaults.length === 0 ? (

                                <div
                                    style={{
                                        display:
                                            "flex",

                                        alignItems:
                                            "center",

                                        justifyContent:
                                            "space-between",

                                        gap:
                                            16,

                                        padding:
                                            "12px 10px 5px",

                                        color:
                                            P.textPrimary,

                                        fontSize:
                                            15,

                                        fontFamily:
                                            "'Inter', sans-serif"
                                    }}
                                >

                                    <span>
                                        No Faults
                                    </span>


                                    <span
                                        style={{
                                            color:
                                                P.green,

                                            fontWeight:
                                                700
                                        }}
                                    >
                                        -
                                    </span>

                                </div>

                            ) : (

                                <div>

                                    {
                                        activeFaults.map(
                                            (
                                                fault,
                                                index
                                            ) => (

                                                <div

                                                    key={
                                                        fault.key
                                                    }

                                                    style={{
                                                        display:
                                                            "flex",

                                                        alignItems:
                                                            "center",

                                                        justifyContent:
                                                            "space-between",

                                                        gap:
                                                            14,

                                                        padding:
                                                            "11px 10px",

                                                        borderBottom:
                                                            index <
                                                            activeFaults.length - 1

                                                                ? `1px solid ${P.border}`

                                                                : "none"
                                                    }}
                                                >

                                                    <span
                                                        style={{
                                                            fontSize:
                                                                14,

                                                            color:
                                                                P.textPrimary,

                                                            fontFamily:
                                                                "'Inter', sans-serif",

                                                            lineHeight:
                                                                1.3
                                                        }}
                                                    >
                                                        {
                                                            fault.title
                                                        }
                                                    </span>


                                                    <span
                                                        style={{
                                                            fontSize:
                                                                11,

                                                            fontWeight:
                                                                800,

                                                            color:
                                                                P.red,

                                                            background:
                                                                P.surfaceRed,

                                                            border:
                                                                `1px solid ${P.red}`,

                                                            borderRadius:
                                                                20,

                                                            padding:
                                                                "4px 8px",

                                                            whiteSpace:
                                                                "nowrap"
                                                        }}
                                                    >
                                                        ACTIVE
                                                    </span>

                                                </div>
                                            )
                                        )
                                    }

                                </div>
                            )}

                        </div>

                    </div>

                </div>


                {/* =================================================
                    FOOTER
                ================================================= */}

                <Footer
                    data={
                        data
                    }
                />

            </div>

        </PageBackground>
    );
}


// =====================================================
// PARAMETER CARD
// =====================================================

function ParameterCard({
    title,
    children
}) {

    return (

        <div
            style={{
                background:
                    P.surface,

                border:
                    `1px solid ${P.border}`,

                borderRadius:
                    14,

                padding:
                    "14px 12px 6px",

                boxShadow:
                    P.shadowCardRaised,

                marginBottom:
                    20
            }}
        >

            <div
                style={{
                    fontSize:
                        18,

                    fontWeight:
                        700,

                    color:
                        P.textPrimary,

                    padding:
                        "0 0 8px 0",

                    fontFamily:
                        "'DM Sans', sans-serif"
                }}
            >
                {title}
            </div>


            {children}

        </div>
    );
}


// =====================================================
// PARAMETER ROW
// =====================================================

function ParameterRow({

    label,
    value,
    unit = "",
    valueColor = null,
    last = false
}) {

    const displayValue =

        value === null ||
        value === undefined ||
        value === ""

            ? "--"

            : value;


    return (

        <div
            style={{
                minHeight:
                    42,

                display:
                    "grid",

                gridTemplateColumns:
                    "minmax(0, 1fr) minmax(90px, auto)",

                alignItems:
                    "center",

                gap:
                    16,

                padding:
                    "4px 10px",

                borderBottom:
                    last
                        ? "none"
                        : `1px solid ${P.border}`,

                boxSizing:
                    "border-box"
            }}
        >

            {/* LABEL */}

            <div
                style={{
                    fontSize:
                        14,

                    fontWeight:
                        500,

                    color:
                        P.textPrimary,

                    fontFamily:
                        "'Inter', sans-serif",

                    minWidth:
                        0
                }}
            >
                {label}
            </div>


            {/* VALUE */}

            <div
                style={{
                    fontSize:
                        14,

                    fontWeight:
                        500,

                    color:
                        valueColor ||
                        P.textPrimary,

                    textAlign:
                        "left",

                    fontFamily:
                        "'Inter', sans-serif",

                    whiteSpace:
                        "nowrap"
                }}
            >

                {displayValue}

                {
                    unit &&
                    displayValue !== "--" && (
                        <>
                            {" "}
                            <span
                                style={{
                                    color:
                                        P.textMuted
                                }}
                            >
                                {unit}
                            </span>
                        </>
                    )
                }

            </div>

        </div>
    );
}