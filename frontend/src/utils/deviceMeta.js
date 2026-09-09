// =====================================================
// DEVICE META (nickname + device type)
//
// The nickname and device type picked in the Add Device
// wizard are shown-only fields — they are NOT sent to /
// stored on the backend. Instead they're kept in this
// browser's localStorage, keyed by IMEI, so the "My
// Devices" list can still display them whenever the user
// wants, without touching the database.
//
// Storage shape (single localStorage key):
//
// {
//   "356789012345678": {
//     nickname: "Main Roof Inverter",
//     deviceType: "Grid-Tie Inverter",
//     model: "Energiaa X3 - 3KW",
//     addedAt: "2026-09-05T05:05:00.000Z"
//   },
//   ...
// }
// =====================================================

const STORAGE_KEY = "deviceMeta";

function readAll() {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        return raw ? JSON.parse(raw) : {};
    } catch (err) {
        console.error("deviceMeta read error:", err);
        return {};
    }
}

function writeAll(all) {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
    } catch (err) {
        console.error("deviceMeta write error:", err);
    }
}

// Save/merge metadata for one IMEI (called right after a
// device is successfully added).
export function saveDeviceMeta(imei, meta) {
    if (!imei) return;

    const all = readAll();

    all[imei] = {
        ...all[imei],
        ...meta,
    };

    writeAll(all);
}

// Look up metadata for one IMEI. Always returns an object
// (never null) so callers can destructure safely.
export function getDeviceMeta(imei) {
    if (!imei) return {};
    const all = readAll();
    return all[imei] || {};
}

// Remove metadata for one IMEI (e.g. if a device is ever
// removed from the account).
export function clearDeviceMeta(imei) {
    if (!imei) return;
    const all = readAll();
    delete all[imei];
    writeAll(all);
}
