import P from "../theme/colors";

import {
    sanitizeReading
} from "../utils/sanitizeReading";

import ParameterCard from "./ParameterCard";
import ParameterRow from "./ParameterRow";
import FaultCard from "./FaultCard";


// =====================================================
// COMBINE TWO 16-BIT REGISTERS
// =====================================================

function combineUint16(
    high,
    low
) {

    const highValue =
        Number(high);

    const lowValue =
        Number(low);


    if (
        !Number.isInteger(highValue) ||
        !Number.isInteger(lowValue) ||
        highValue < 0 ||
        highValue > 0xFFFF ||
        lowValue < 0 ||
        lowValue > 0xFFFF
    ) {
        return null;
    }


    return (
        (
            (highValue << 16) |
            lowValue
        ) >>> 0
    );
}


// =====================================================
// VD7 FAULT DEFINITIONS
// =====================================================

const VD7_FAULT_DEFS = [

    // =================================================
    // ST1
    // =================================================

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
        title: "High Residual Current"
    },

    {
        key: "ST1_BIT6",
        statusKey: "ST1",
        bit: 6,
        title: "Over Temperature"
    },


    // =================================================
    // ST2
    //
    // bit 0 unused
    // bit 4 unused
    // =================================================

    {
        key: "ST2_BIT1",
        statusKey: "ST2",
        bit: 1,
        title: "PV1 Over Voltage"
    },

    {
        key: "ST2_BIT2",
        statusKey: "ST2",
        bit: 2,
        title: "PV1 Under Voltage"
    },

    {
        key: "ST2_BIT3",
        statusKey: "ST2",
        bit: 3,
        title: "PV1 Over Current"
    },

    {
        key: "ST2_BIT5",
        statusKey: "ST2",
        bit: 5,
        title: "PV2 Over Voltage"
    },

    {
        key: "ST2_BIT6",
        statusKey: "ST2",
        bit: 6,
        title: "PV2 Under Voltage"
    },

    {
        key: "ST2_BIT7",
        statusKey: "ST2",
        bit: 7,
        title: "PV2 Over Current"
    },


    // =================================================
    // ST3
    // =================================================

    {
        key: "ST3_BIT0",
        statusKey: "ST3",
        bit: 0,
        title: "DC_0 Bus Over Voltage"
    },

    {
        key: "ST3_BIT1",
        statusKey: "ST3",
        bit: 1,
        title: "DC_0 Bus Under Voltage"
    },

    {
        key: "ST3_BIT2",
        statusKey: "ST3",
        bit: 2,
        title: "DC_1 Bus Over Voltage"
    },

    {
        key: "ST3_BIT3",
        statusKey: "ST3",
        bit: 3,
        title: "DC_1 Bus Under Voltage"
    },

    {
        key: "ST3_BIT4",
        statusKey: "ST3",
        bit: 4,
        title: "PV +VE Low Insulation"
    },

    {
        key: "ST3_BIT5",
        statusKey: "ST3",
        bit: 5,
        title: "PV -VE Low Insulation"
    },

    {
        key: "ST3_BIT6",
        statusKey: "ST3",
        bit: 6,
        title: "DC Voltage Unbalanced"
    },


    // =================================================
    // ST4
    // =================================================

    {
        key: "ST4_BIT0",
        statusKey: "ST4",
        bit: 0,
        title: "Grid Over Voltage Ana"
    },

    {
        key: "ST4_BIT1",
        statusKey: "ST4",
        bit: 1,
        title: "Inverter Over Current Ana"
    },

    {
        key: "ST4_BIT2",
        statusKey: "ST4",
        bit: 2,
        title: "PV1 Over Voltage Ana"
    },

    {
        key: "ST4_BIT3",
        statusKey: "ST4",
        bit: 3,
        title: "PV1 Over Current Ana"
    },

    {
        key: "ST4_BIT4",
        statusKey: "ST4",
        bit: 4,
        title: "PV2 Over Voltage Ana"
    },

    {
        key: "ST4_BIT5",
        statusKey: "ST4",
        bit: 5,
        title: "PV2 Over Current Ana"
    },

    {
        key: "ST4_BIT6",
        statusKey: "ST4",
        bit: 6,
        title: "DC Bus Over Voltage Ana"
    }
];


export default function VD7FaultContent({
    data,
    energy
}) {

    // =====================================================
    // SAFE PARAMETER
    // =====================================================

    const getValue = (
        parameter,
        kind = null
    ) => {

        const value =
            data?.[parameter];


        if (
            value === undefined ||
            value === null
        ) {
            return "--";
        }


        if (
            kind &&
            sanitizeReading(
                value,
                kind
            ) === "--"
        ) {
            return "--";
        }


        return value;
    };


    // =====================================================
    // TOTAL GENERATION
    //
    // Already normalized by Context.jsx.
    // =====================================================

    const totalGeneration =
        sanitizeReading(
            data?.cumulativeEnergy,
            "energyKWh"
        );


    // =====================================================
    // TOTAL RUN TIME
    //
    // Same HIGH/LOW combination as cumulative generation.
    // =====================================================

    const totalRunTime =
        combineUint16(
            data?.TRUN_H,
            data?.TRUN_L
        );


    // =====================================================
    // SERIAL NUMBER
    // =====================================================

    const serialNumber =
        (
            data?.SRN_H != null ||
            data?.SRN_L != null
        )
            ? `${data?.SRN_H ?? ""}${data?.SRN_L ?? ""}`
            : "--";


    // =====================================================
    // INVERTER STATUS
    //
    // VD7:
    //
    // IST = 0 -> OFF
    // IST = 1 -> ON
    // =====================================================

    const ist =
        Number(
            data?.IST
        );


    const inverterOn =
        ist === 1;


    const inverterStatus =
        inverterOn
            ? "INVERTER ON"
            : "INVERTER OFF";


    const inverterStatusColor =
        inverterOn
            ? P.green
            : P.red;


    // =====================================================
    // ACTIVE FAULTS
    // =====================================================

    const activeFaults =
        VD7_FAULT_DEFS.filter(
            fault => {

                const statusValue =
                    Number(
                        data?.[
                            fault.statusKey
                        ] ?? 0
                    );


                if (
                    !Number.isFinite(
                        statusValue
                    )
                ) {
                    return false;
                }


                return Boolean(
                    statusValue &
                    (
                        1 <<
                        fault.bit
                    )
                );
            }
        );


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
                    label="PV1 Voltage"
                    value={
                        getValue(
                            "DCV1",
                            "voltage"
                        )
                    }
                    unit="V"
                />


                <ParameterRow
                    label="PV1 Current"
                    value={
                        getValue(
                            "DCI1",
                            "current"
                        )
                    }
                    unit="A"
                />


                <ParameterRow
                    label="PV1 Power"
                    value={
                        getValue(
                            "DCP1",
                            "powerW"
                        )
                    }
                    unit="W"
                />


                <ParameterRow
                    label="PV2 Voltage"
                    value={
                        getValue(
                            "DCV2",
                            "voltage"
                        )
                    }
                    unit="V"
                />


                <ParameterRow
                    label="PV2 Current"
                    value={
                        getValue(
                            "DCI2",
                            "current"
                        )
                    }
                    unit="A"
                />


                <ParameterRow
                    label="PV2 Power"
                    value={
                        getValue(
                            "DCP2",
                            "powerW"
                        )
                    }
                    unit="W"
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
                    label="Grid Voltage RY"
                    value={
                        getValue(
                            "VIRY",
                            "voltage"
                        )
                    }
                    unit="V"
                />


                <ParameterRow
                    label="Grid Voltage YB"
                    value={
                        getValue(
                            "VIYB",
                            "voltage"
                        )
                    }
                    unit="V"
                />


                <ParameterRow
                    label="Grid Voltage BR"
                    value={
                        getValue(
                            "VIBR",
                            "voltage"
                        )
                    }
                    unit="V"
                />


                <ParameterRow
                    label="Inverter Current R"
                    value={
                        getValue(
                            "IIRN",
                            "current"
                        )
                    }
                    unit="A"
                />


                <ParameterRow
                    label="Inverter Current Y"
                    value={
                        getValue(
                            "IIYN",
                            "current"
                        )
                    }
                    unit="A"
                />


                <ParameterRow
                    label="Inverter Current B"
                    value={
                        getValue(
                            "IIBN",
                            "current"
                        )
                    }
                    unit="A"
                />


                <ParameterRow
                    label="Grid Frequency"
                    value={
                        getValue(
                            "GFREQ",
                            "frequency"
                        )
                    }
                    unit="Hz"
                />


                <ParameterRow
                    label="Export Power"
                    value={
                        getValue(
                            "EXPW",
                            "powerW"
                        )
                    }
                    unit="W"
                    last
                />

            </ParameterCard>


            {/* =================================================
                ENERGY & POWER
            ================================================= */}

            <ParameterCard
                title="Energy & Power"
            >

                <ParameterRow
                    label="Today Generation"
                    value={
                        sanitizeReading(
                            energy?.today,
                            "energyKWh"
                        )
                    }
                    unit="kWh"
                />


                <ParameterRow
                    label="Total Generation"
                    value={
                        totalGeneration
                    }
                    unit="kWh"
                />


                <ParameterRow
                    label="Apparent Power"
                    value={
                        getValue(
                            "APOW"
                        )
                    }
                    unit="VA"
                />


                <ParameterRow
                    label="Reactive Power"
                    value={
                        getValue(
                            "RPOW"
                        )
                    }
                    unit="VAR"
                />


                <ParameterRow
                    label="Power Factor"
                    value={
                        getValue(
                            "PF",
                            "powerFactor"
                        )
                    }
                    last
                />

            </ParameterCard>


            {/* =================================================
                SYSTEM HEALTH
            ================================================= */}

            <ParameterCard
                title="System Health"
            >

                <ParameterRow
                    label="Heat Sink Temp"
                    value={
                        getValue(
                            "TEMP",
                            "temperature"
                        )
                    }
                    unit="°C"
                />


                <ParameterRow
                    label="PV +ve Insulation"
                    value={
                        getValue(
                            "PIR"
                        )
                    }
                    unit="KΩ"
                />


                <ParameterRow
                    label="PV -ve Insulation"
                    value={
                        getValue(
                            "NIR"
                        )
                    }
                    unit="KΩ"
                    last
                />

            </ParameterCard>


            {/* =================================================
                SYSTEM STATUS
            ================================================= */}

            <ParameterCard
                title="System Status"
            >

                <ParameterRow
                    label="Serial Number"
                    value={
                        serialNumber
                    }
                />


                <ParameterRow
                    label="Status"
                    value={
                        inverterStatus
                    }
                    valueColor={
                        inverterStatusColor
                    }
                />


                <ParameterRow
                    label="Total Run Time"
                    value={
                        totalRunTime ??
                        "--"
                    }
                    unit="min"
                    last
                />

            </ParameterCard>


            {/* =================================================
                FAULTS
            ================================================= */}

            <FaultCard
                faults={
                    activeFaults
                }
            />

        </div>
    );
}