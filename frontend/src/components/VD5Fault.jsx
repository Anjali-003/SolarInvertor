import P from "../theme/colors";

import {
    sanitizeReading
} from "../utils/sanitizeReading";

import ParameterCard from "./ParameterCard";
import ParameterRow from "./ParameterRow";
import FaultCard from "./FaultCard";


export default function VD5FaultContent({
    data,
    lastUpdated,
    energy,
    cuf
}) {

    // =====================================================
    // PARAMETER HELPER
    // =====================================================

    // const getParameterValue = (
    //     parameter,
    //     fallback = "--",
    //     kind = null
    // ) => {

    //     const value =
    //         data?.[parameter];


    //     if (
    //         value === undefined ||
    //         value === null
    //     ) {
    //         return fallback;
    //     }


    //     return sanitizeReading(
    //         value,
    //         kind,
    //         null
    //     ) === "--"
    //         ? fallback
    //         : value;
    // };



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

    const sanitized =
        sanitizeReading(
            value,
            kind,
            null
        );

    return sanitized === "--"
        ? fallback
        : sanitized;
};

    // =====================================================
    // CUF
    // =====================================================

    // const formatCUF = (
    //     value
    // ) => {

    //     const number =
    //         Number(value);


    //     if (
    //         !Number.isFinite(
    //             number
    //         )
    //     ) {
    //         return "--";
    //     }


    //     return number.toFixed(2);
    // };

    const formatCUF = (value) => {

    if (
        value === null ||
        value === undefined ||
        value === ""
    ) {
        return "--";
    }


    const number =
        Number(value);


    if (
        !Number.isFinite(number)
    ) {
        return "--";
    }


    return number.toFixed(2);
};


    // // =====================================================
    // // ST3
    // // =====================================================

    // const st3 =
    //     Number(
    //         data?.ST3 ?? 0
    //     );


    // const inverterRelayConnected =
    //     Boolean(
    //         st3 &
    //         (1 << 0)
    //     );


    // const gridRelayConnected =
    //     Boolean(
    //         st3 &
    //         (1 << 1)
    //     );


    // const statusFromST3 =
    //     Boolean(
    //         st3 &
    //         (1 << 2)
    //     );


    // // =====================================================
    // // STINTERVAL
    // // =====================================================

    // const stInterval =
    //     Number(
    //         data?.STINTERVAL ?? 0
    //     );


    // const intervalTooLarge =
    //     stInterval / 4 >= 1;


    // // =====================================================
    // // DATA AGE
    // // =====================================================

    // const updatedAt =
    //     lastUpdated
    //         ? new Date(
    //             lastUpdated
    //         ).getTime()
    //         : null;


    // const dataTooOld =
    //     !updatedAt ||
    //     (
    //         Date.now() -
    //         updatedAt
    //     ) >=
    //     3 * 60 * 1000;


    // // =====================================================
    // // FINAL INVERTER STATUS
    // // =====================================================

    // const inverterRunning =
    //     statusFromST3 &&
    //     !dataTooOld &&
    //     !intervalTooLarge;


    // const inverterRelayText =
    //     inverterRelayConnected
    //         ? "Connected"
    //         : "Disconnected";


    // const gridRelayText =
    //     gridRelayConnected
    //         ? "Connected"
    //         : "Disconnected";


    // const systemStatusText =
    //     inverterRunning
    //         ? "ON"
    //         : "OFF";


    // const systemStatusColor =
    //     inverterRunning
    //         ? P.green
    //         : P.red;


    // =====================================================
// STATUS DATA AVAILABILITY
// =====================================================

const hasST3 =
    data?.ST3 !== undefined &&
    data?.ST3 !== null &&
    Number.isFinite(
        Number(data.ST3)
    );

const hasSTInterval =
    data?.STINTERVAL !== undefined &&
    data?.STINTERVAL !== null &&
    Number.isFinite(
        Number(data.STINTERVAL)
    );


// =====================================================
// ST3
// =====================================================

const st3 =
    hasST3
        ? Number(data.ST3)
        : null;


const inverterRelayConnected =
    hasST3
        ? Boolean(
            st3 &
            (1 << 0)
        )
        : null;


const gridRelayConnected =
    hasST3
        ? Boolean(
            st3 &
            (1 << 1)
        )
        : null;


const statusFromST3 =
    hasST3
        ? Boolean(
            st3 &
            (1 << 2)
        )
        : null;


// =====================================================
// STINTERVAL
// =====================================================

const stInterval =
    hasSTInterval
        ? Number(data.STINTERVAL)
        : null;


const intervalTooLarge =
    hasSTInterval
        ? stInterval / 4 >= 1
        : null;


// =====================================================
// DATA AGE
// =====================================================

const updatedAt =
    lastUpdated
        ? new Date(
            lastUpdated
        ).getTime()
        : null;


const hasValidTimestamp =
    Number.isFinite(updatedAt);


const dataTooOld =
    hasValidTimestamp
        ? (
            Date.now() -
            updatedAt
        ) >=
        3 * 60 * 1000
        : null;


// =====================================================
// FINAL INVERTER STATUS
// =====================================================

const hasStatusData =
    hasST3 &&
    hasSTInterval &&
    hasValidTimestamp;


const inverterRunning =
    hasStatusData
        ? (
            statusFromST3 &&
            !dataTooOld &&
            !intervalTooLarge
        )
        : null;


const inverterRelayText =
    inverterRelayConnected === null
        ? "--"
        : inverterRelayConnected
            ? "Connected"
            : "Disconnected";


const gridRelayText =
    gridRelayConnected === null
        ? "--"
        : gridRelayConnected
            ? "Connected"
            : "Disconnected";


const systemStatusText =
    inverterRunning === null
        ? "--"
        : inverterRunning
            ? "ON"
            : "OFF";


const systemStatusColor =
    inverterRunning === null
        ? undefined
        : inverterRunning
            ? P.green
            : P.red;

    // =====================================================
    // VD5 FAULT DEFINITIONS
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
                        sanitizeReading(
                            data?.cumulativeEnergy,
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
                        systemStatusColor
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


            <FaultCard
                faults={
                    activeFaults
                }
            />

        </div>
    );
}