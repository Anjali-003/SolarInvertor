// =====================================================
// INVERTER PAYLOAD NORMALIZER
//
// Converts device-specific MQTT fields into a common
// format used by the rest of the backend.
//
// Supported device types:
// VD = 5  -> Existing inverter
// VD = 7  -> Three-phase string inverter
// =====================================================


// =====================================================
// COMBINE TWO 16-BIT REGISTERS
//
// HIGH = upper 16 bits
// LOW  = lower 16 bits
// =====================================================

// function combineUint16(high, low) {

//     const highValue = Number(high);
//     const lowValue = Number(low);


//     if (
//         !Number.isFinite(highValue) ||
//         !Number.isFinite(lowValue) ||
//         highValue < 0 ||
//         lowValue < 0
//     ) {
//         return null;
//     }


//     return (
//         (
//             ((highValue & 0xFFFF) << 16) |
//             (lowValue & 0xFFFF)
//         ) >>> 0
//     );
// }




function combineUint16(high, low) {

    const highValue = Number(high);
    const lowValue = Number(low);

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
// VD = 5
// =====================================================

function normalizeVD5(payload) {

    // -------------------------------------------------
    // CUMULATIVE ENERGY
    //
    // Existing protocol:
    //
    // LKWH = HIGH
    // LKWL = LOW
    // -------------------------------------------------

    const LKWH =
        Number(payload.LKWH);

    const LKWL =
        Number(payload.LKWL);


    let cumulativeEnergy = null;


    if (
        LKWH !== -1 &&
        LKWL !== -1
    ) {

        cumulativeEnergy =
            combineUint16(
                LKWH,
                LKWL
            );
    }


    // -------------------------------------------------
    // RATED CAPACITY
    //
    // RAT is received in Watts.
    // Store internally as kW.
    // -------------------------------------------------

    const ratWatts =
        Number(payload.RAT);


    const ratedCapacityKw =
        Number.isFinite(ratWatts) &&
        ratWatts > 0

            ? ratWatts / 1000

            : null;


    // -------------------------------------------------
    // SOLAR POWER
    //
    // PPOW is received in Watts.
    // Store internally as kW.
    // -------------------------------------------------

    const ppowWatts =
        Number(payload.PPOW);


    const solarPowerKw =
        Number.isFinite(ppowWatts) &&
        ppowWatts >= 0

            ? ppowWatts / 1000

            : null;


    return {

        deviceType: 5,

        cumulativeEnergy,

        ratedCapacityKw,

        solarPowerKw
    };
}


// =====================================================
// VD = 7
// THREE-PHASE STRING INVERTER
// =====================================================

// function normalizeVD7(payload) {

//     // -------------------------------------------------
//     // CUMULATIVE ENERGY
//     //
//     // LKWH_H = HIGH register
//     // LKWH_L = LOW register
//     // -------------------------------------------------

//     const cumulativeEnergy =
//         combineUint16(
//             payload.LKWH_H,
//             payload.LKWH_L
//         );


//     // -------------------------------------------------
//     // SYSTEM RATING
//     //
//     // SYSR_H = HIGH register
//     // SYSR_L = LOW register
//     //
//     // Combined according to inverter protocol.
//     // -------------------------------------------------

//     const systemRating =
//         combineUint16(
//             payload.SYSR_H,
//             payload.SYSR_L
//         );


//     /*
//      * IMPORTANT:
//      *
//      * We currently treat the combined SYSR value
//      * as Watts, just like RAT in VD=5.
//      *
//      * Therefore:
//      *
//      * 3000 -> 3 kW
//      */

//     const ratedCapacityKw =
//         Number.isFinite(systemRating) &&
//         systemRating > 0

//             ? systemRating / 1000

//             : null;


//     // -------------------------------------------------
//     // SOLAR POWER
//     //
//     // VD=7 solar power:
//     //
//     // DCP1 + DCP2
//     //
//     // DCP3 / DCP4 are intentionally NOT included.
//     // -------------------------------------------------

//     const dcp1 =
//         Number(payload.DCP1);

//     const dcp2 =
//         Number(payload.DCP2);


//     let solarPowerKw = null;


//     if (
//         Number.isFinite(dcp1) &&
//         Number.isFinite(dcp2) &&
//         dcp1 >= 0 &&
//         dcp2 >= 0
//     ) {

//         const solarPowerWatts =
//             dcp1 + dcp2;


//         solarPowerKw =
//             solarPowerWatts / 1000;
//     }


//     return {

//         deviceType: 7,

//         cumulativeEnergy,

//         ratedCapacityKw,

//         solarPowerKw
//     };
// }

// =====================================================
// VD = 7
// THREE-PHASE STRING INVERTER
// =====================================================

function normalizeVD7(payload) {

    // -------------------------------------------------
    // CUMULATIVE ENERGY
    //
    // LKWH_H = HIGH 16-bit register
    // LKWH_L = LOW 16-bit register
    //
    // LKWH =
    //     (LKWH_H << 16) | LKWH_L
    // -------------------------------------------------

    const cumulativeEnergy =
        combineUint16(
            payload.LKWH_H,
            payload.LKWH_L
        );


    // -------------------------------------------------
    // SYSTEM RATING
    //
    // First combine the two 16-bit registers:
    //
    // SYSR =
    //     (SYSR_H << 16) | SYSR_L
    //
    // The resulting 32-bit value contains:
    //
    // Upper 20 bits = inverter VA rating
    // Lower 12 bits = rated voltage
    // -------------------------------------------------

    const systemRating =
        combineUint16(
            payload.SYSR_H,
            payload.SYSR_L
        );


    let ratedVA = null;
    let ratedVoltage = null;
    let ratedCapacityKw = null;


    if (
        Number.isFinite(systemRating) &&
        systemRating > 0
    ) {

        // ---------------------------------------------
        // UPPER 20 BITS
        //
        // Remove the lower 12 voltage bits.
        // ---------------------------------------------

        ratedVA =
            systemRating >>> 12;


        // ---------------------------------------------
        // LOWER 12 BITS
        //
        // 0xFFF =
        // 1111 1111 1111
        // ---------------------------------------------

        ratedVoltage =
            systemRating & 0xFFF;


        // ---------------------------------------------
        // CAPACITY
        //
        // Protocol provides VA.
        //
        // For the existing application/database we are
        // using the numerical kVA rating as the rated
        // capacity value used by rated_capacity_kw.
        //
        // Example:
        //
        // 25000 VA -> 25
        // ---------------------------------------------

        if (
            ratedVA > 0
        ) {

            ratedCapacityKw =
                ratedVA / 1000;
        }
    }


    // -------------------------------------------------
    // SOLAR POWER
    //
    // VD = 7:
    //
    // Solar power =
    //     DCP1 + DCP2
    //
    // DCP values are received in Watts.
    //
    // DCP3 and DCP4 are intentionally not included
    // according to the required calculation.
    // -------------------------------------------------

    const dcp1 =
        Number(
            payload.DCP1
        );

    const dcp2 =
        Number(
            payload.DCP2
        );


    let solarPowerKw =
        null;


    if (
        Number.isFinite(dcp1) &&
        Number.isFinite(dcp2) &&
        dcp1 >= 0 &&
        dcp2 >= 0
    ) {

        const solarPowerWatts =
            dcp1 +
            dcp2;


        solarPowerKw =
            solarPowerWatts /
            1000;
    }


    // -------------------------------------------------
    // NORMALIZED RESULT
    // -------------------------------------------------

    return {

        deviceType: 7,

        cumulativeEnergy,

        ratedCapacityKw,

        solarPowerKw,

        // Extra VD7 information.
        // mqttHandler does not need these yet,
        // but keeping them here is useful.
        ratedVA,

        ratedVoltage,

        systemRating
    };
}


// =====================================================
// MAIN NORMALIZER
// =====================================================

function normalizeInverterPayload(payload) {

    if (
        !payload ||
        typeof payload !== "object"
    ) {

        throw new Error(
            "Invalid inverter payload"
        );
    }


    const deviceType =
        Number(payload.VD);


    switch (deviceType) {

        case 5:

            return normalizeVD5(
                payload
            );


        case 7:

            return normalizeVD7(
                payload
            );


        default:

            throw new Error(
                `Unsupported inverter device type: ${payload.VD}`
            );
    }
}


module.exports = {
    normalizeInverterPayload,
    combineUint16

};