// =====================================================
// LOCAL SAVED DEVICES (per-phone, no account/login)
//
// This is now the SOURCE OF TRUTH for "my devices" on
// this phone. There is no backend account tying a user
// to a device anymore — the user just looks up an IMEI
// (a read-only backend call to fetch its live data), and
// if they tap "Save", the record below is written to
// this browser/phone's localStorage, keyed by IMEI.
//
// Next time they enter the SAME IMEI, or open "My
// Devices", the phone remembers it — purely client-side.
// A different phone / a cleared browser will not see it,
// which is expected: saving is per-device, not per-account.
//
// Storage shape (single localStorage key):
//
// {
//   "356789012345678": {
//     nickname: "Main Roof Inverter",
//     deviceType: "Grid-Tie Inverter",
//     model: "Energiaa X3 - 3KW",
//     location: "Main Roof Inverter - 12 MG Road, Delhi",
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

// Save/merge the record for one IMEI (called when the user
// taps "Save" after looking an IMEI up).
export function saveDeviceMeta(imei, meta) {
    if (!imei) return;

    const all = readAll();

    all[imei] = {
        ...all[imei],
        ...meta,
    };

    writeAll(all);
}

// Look up the saved record for one IMEI. Always returns an
// object (never null) so callers can destructure safely.
export function getDeviceMeta(imei) {
    if (!imei) return {};
    const all = readAll();
    return all[imei] || {};
}

// Whether this IMEI has already been saved on this phone.
export function isDeviceSaved(imei) {
    if (!imei) return false;
    const all = readAll();
    return Boolean(all[imei]);
}

// All IMEIs saved on this phone, as an array of
// { imei, ...meta } — this is what "My Devices" renders.
export function getAllSavedDevices() {
    const all = readAll();
    return Object.entries(all).map(([imei, meta]) => ({
        imei,
        ...meta,
    }));
}

// Remove the saved record for one IMEI (e.g. user removes
// it from "My Devices" on this phone).
export function clearDeviceMeta(imei) {
    if (!imei) return;
    const all = readAll();
    delete all[imei];
    writeAll(all);
}
