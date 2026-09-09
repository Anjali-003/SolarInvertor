// =====================================================
// SANITIZE READING
//
// PROBLEM:
// When a sensor/register has no real reading yet, the
// device / DB sometimes stores a "-1" sentinel. When that
// -1 gets treated as an unsigned integer somewhere in the
// pipeline (e.g. LKWH/LKWL register combining with `>>> 0`,
// or a 16/32-bit unsigned cast), it turns into a huge
// positive number instead:
//
//   -1 (16-bit unsigned)         -> 65535
//   -1 (32-bit unsigned)         -> 4294967295
//   4294967295 / 10 (truncated)  -> 429496729.x
//   4294967295 / 100 (truncated) -> 42949672.95
//
// That's why PV Voltage / Current / Frequency / PF /
// Temperature / LKWH suddenly show up as ~4.29 billion,
// ~429,496,7xx or ~42,949,67x instead of "--".
//
// FIX:
// Treat any raw value that matches one of these known
// "-1 wrapped as unsigned" patterns, OR any value outside
// a sane physical range for that parameter type, as
// "no data" and show "--" instead of the garbage number.
// =====================================================

const UNSIGNED_NEGATIVE_ONE_PATTERNS = [
    -1,
    0xFFFF,          // 65535        - 16-bit unsigned wrap of -1
    0xFFFFFFFF,      // 4294967295   - 32-bit unsigned wrap of -1
];

// Some fields get divided by 10 / 100 / 1000 downstream
// before display, so also recognise the wrapped value
// after those common divisions (allowing for integer
// truncation, hence the small tolerance).
function isNearUnsignedWrap(value) {

    if (!Number.isFinite(value)) {
        return false;
    }

    const candidates = [
        0xFFFFFFFF,
        0xFFFFFFFF / 10,
        0xFFFFFFFF / 100,
        0xFFFFFFFF / 1000,
        0xFFFF,
        0xFFFF / 10,
        0xFFFF / 100,
    ];

    return candidates.some(
        (candidate) => Math.abs(value - candidate) < 10
    );
}

// Reasonable physical bounds per parameter "kind".
// Anything outside these is treated as garbage, regardless
// of whether it matches an exact wrap pattern above.
const RANGE_BY_KIND = {
    voltage: [0, 1000],      // Volts
    current: [-500, 500],    // Amps
    frequency: [30, 80],     // Hz
    powerFactor: [-1, 1],
    temperature: [-40, 150], // Celsius
    powerW: [-100000, 100000],   // Watts
    powerKW: [-1000, 1000],      // kW
    energyKWh: [0, 1000000],     // kWh (lifetime/total)
};

/**
 * Returns true if the raw value looks like real, usable data.
 * @param {*} rawValue
 * @param {keyof typeof RANGE_BY_KIND} [kind] optional bounds check
 */
export function isValidReading(rawValue, kind) {

    const value = Number(rawValue);

    if (!Number.isFinite(value)) {
        return false;
    }

    if (UNSIGNED_NEGATIVE_ONE_PATTERNS.includes(value)) {
        return false;
    }

    if (isNearUnsignedWrap(value)) {
        return false;
    }

    if (kind && RANGE_BY_KIND[kind]) {
        const [min, max] = RANGE_BY_KIND[kind];
        if (value < min || value > max) {
            return false;
        }
    }

    return true;
}

/**
 * Returns the numeric value if valid, otherwise "--".
 * Optional decimals argument formats with toFixed.
 */
export function sanitizeReading(rawValue, kind, decimals = null) {

    if (!isValidReading(rawValue, kind)) {
        return "--";
    }

    const value = Number(rawValue);

    return decimals === null ? value : value.toFixed(decimals);
}
