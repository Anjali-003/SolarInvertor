import { useAdminDevice } from "../context/AdminDeviceContext";
import AdminDeviceFooter from "../components/AdminDeviceFooter";
import P from "../theme/colors";
import DeviceInfo from "../components/DeviceInfo";
import PageBackground from "../components/PageBackground";
import { sanitizeReading } from "../utils/sanitizeReading";


export default function AdminDeviceFault() {

    // =====================================================
    // CONTEXT
    // =====================================================

    const {
        data,
        lastUpdated,
        selectedDevice,
        energy,
        cuf
    } = useAdminDevice();

    const devices = selectedDevice ? [selectedDevice] : [];
    const selectedDeviceId = selectedDevice?.id;


    // =====================================================
    // PARAMETER HELPER
    // =====================================================

    const getParameterValue = (
        parameter,
        fallback = "--",
        kind = null
    ) => {

        const value =
            data?.[parameter];

        if (
            value === undefined ||
            value === null
        ) {
            return fallback;
        }

        // Guard against -1 "no data" sentinels that got
        // unsigned-wrapped into huge numbers (e.g. 4294967295,
        // 42949672, 429496736) somewhere upstream.
        return sanitizeReading(value, kind, null) === "--"
            ? fallback
            : value;
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

                        stickyTop={
                            0
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
                                        "PV",
                                        "--",
                                        "voltage"
                                    )
                                }
                                unit="V"
                            />


                            <ParameterRow
                                label="PV Current"
                                value={
                                    getParameterValue(
                                        "PI",
                                        "--",
                                        "current"
                                    )
                                }
                                unit="A"
                            />


                            <ParameterRow
                                label="Solar Power"
                                value={
                                    getParameterValue(
                                        "PPOW",
                                        "--",
                                        "powerW"
                                    )
                                }
                                unit="W"
                            />


                            <ParameterRow
                                label="Today Gen"
                                value={
                                    sanitizeReading(
                                        energy?.today,
                                        "energyKWh"
                                    )
                                }
                                unit="kWh"
                            />


                            <ParameterRow
                                label="Total Gen"
                                value={
                                    getParameterValue(
                                        "LKWH",
                                        "--",
                                        "energyKWh"
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
                                        "VN",
                                        "--",
                                        "voltage"
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
                                        "DCI1",
                                        "--",
                                        "current"
                                    )
                                }
                                unit="A"
                            />


                            <ParameterRow
                                label="Grid Frequency"
                                value={
                                    getParameterValue(
                                        "GFREQ",
                                        "--",
                                        "frequency"
                                    )
                                }
                                unit="Hz"
                            />


                            <ParameterRow
                                label="Power Factor"
                                value={
                                    getParameterValue(
                                        "PF",
                                        "--",
                                        "powerFactor"
                                    )
                                }
                            />


                            <ParameterRow
                                label="Export Power"
                                value={
                                    getParameterValue(
                                        "POW",
                                        "--",
                                        "powerW"
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
                                        "TEMP",
                                        "--",
                                        "temperature"
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
                                    "rgba(22, 38, 45, 0.88)",

                                border:
                                    "1px solid rgba(255,255,255,0.08)",

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
                                        "#ffffff",

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
                                            "#ffffff",

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

                                                                ? "1px solid rgba(255,255,255,0.08)"

                                                                : "none"
                                                    }}
                                                >

                                                    <span
                                                        style={{
                                                            fontSize:
                                                                14,

                                                            color:
                                                                "#ffffff",

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

                <AdminDeviceFooter />

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
                    "rgba(22, 38, 45, 0.88)",

                border:
                    "1px solid rgba(255,255,255,0.08)",

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
                        "#ffffff",

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
                        : "1px solid rgba(255,255,255,0.08)",

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
                        "rgba(255,255,255,0.85)",

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
                        "#ffffff",

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
                                        "rgba(255,255,255,0.6)"
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