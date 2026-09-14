import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useInverter } from "../context/Context";
import { getDeviceMeta } from "../utils/deviceMeta";
import PageBackground from "../components/PageBackground";
import P from "../theme/colors";

// =====================================================
// MY DEVICES (SAVED DEVICES)
//
// Card fields, per the reference screenshot:
//
//   - Nickname            -> from localStorage (deviceMeta),
//                            NOT stored in the DB
//   - "Serial No." line    -> this is actually the IMEI,
//                            fetched from the DB
//   - Device Type          -> from localStorage (deviceMeta),
//                            NOT stored in the DB
//   - Rating               -> DB (devices.rated_capacity_kw)
//   - Total Generation     -> DB (latest cumulative kWh
//                            reading from energy_history)
//   - Added on             -> from localStorage (deviceMeta),
//                            captured client-side when the
//                            device was added
// =====================================================

// const API_BASE = "http://localhost:3000";
// VPSCHANGE

export default function MyDevices() {
    const navigate = useNavigate();
    const { setSelectedDeviceId } = useInverter();

    const [rawDevices, setRawDevices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [selectMode, setSelectMode] = useState(false);

    // =====================================================
    // FETCH SAVED (DB-BACKED) DEVICE FIELDS
    // =====================================================

    useEffect(() => {
        const loadDevices = async () => {
            setLoading(true);
            setError("");

            const token = localStorage.getItem("token");

            if (!token) {
                setRawDevices([]);
                setLoading(false);
                return;
            }

            try {
                const res = await fetch(
                    
                    // `${API_BASE}/api/user/devices`
                    // VPSCHANGE
                    `/api/user/devices`
                    , {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                const result = await res.json();

                if (!res.ok) {
                    throw new Error(result?.error || "Failed to load devices");
                }

                setRawDevices(
                    Array.isArray(result.devices) ? result.devices : []
                );
            } catch (err) {
                console.error("Failed to load saved devices:", err);
                setError("Couldn't load your devices. Pull down to try again.");
                setRawDevices([]);
            } finally {
                setLoading(false);
            }
        };

        loadDevices();
    }, []);

    // =====================================================
    // MERGE DB FIELDS + LOCAL (NICKNAME / DEVICE TYPE) FIELDS
    // =====================================================

    const devices = useMemo(() => {
        return rawDevices.map((device, index) => {
            const meta = getDeviceMeta(device.imei);

            const ratingLabel = extractRating(meta.model, device.rated_capacity_kw);

            return {
                id: device.id,
                imei: device.imei,
                nickname: meta.nickname || `Device ${index + 1}`,
                deviceType: meta.deviceType || device.solution || "--",
                rating: ratingLabel,
                totalGeneration: formatGeneration(device.total_generation_kwh),
                addedAt: meta.addedAt || null,
            };
        });
    }, [rawDevices]);

    const handleOpenDevice = (device) => {
        if (selectMode) return;
        setSelectedDeviceId(device.id);
        navigate("/");
    };

    return (
        <PageBackground>
            <div
                style={{
                    minHeight: "100vh",
                    display: "flex",
                    flexDirection: "column",
                    fontFamily: "'Inter', sans-serif",
                }}
            >
                {/* =================================================
                    HEADER
                ================================================= */}

                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        padding: "20px 20px 6px",
                        boxSizing: "border-box",
                    }}
                >
                    <button
                        type="button"
                        onClick={() => navigate(-1)}
                        aria-label="Back"
                        style={headerPillBtn}
                    >
                        ‹
                    </button>

                    <div
                        style={{
                            fontSize: 19,
                            fontWeight: 700,
                            color: P.textPrimary,
                            fontFamily: "'DM Sans', sans-serif",
                        }}
                    >
                        My Devices
                    </div>

                    <button
                        type="button"
                        onClick={() => setSelectMode((v) => !v)}
                        style={{
                            ...headerPillBtn,
                            width: "auto",
                            padding: "0 18px",
                            fontSize: 14,
                            fontWeight: 600,
                            fontFamily: "'Inter', sans-serif",
                            color: P.textPrimary,
                        }}
                    >
                        {selectMode ? "Done" : "Select"}
                    </button>
                </div>

                {/* =================================================
                    CONTENT
                ================================================= */}

                <div
                    style={{
                        flex: 1,
                        padding: "14px 20px 40px",
                        boxSizing: "border-box",
                    }}
                >
                    {loading && (
                        <StateMessage text="Loading your devices…" />
                    )}

                    {!loading && error && <StateMessage text={error} isError />}

                    {!loading && !error && devices.length === 0 && (
                        <div style={{ marginTop: 40 }}>
                            <StateMessage text="No devices added yet." />
                            <button
                                type="button"
                                onClick={() => navigate("/add-device")}
                                style={{
                                    display: "block",
                                    margin: "18px auto 0",
                                    padding: "13px 28px",
                                    border: "none",
                                    borderRadius: 10,
                                    background:
                                        "linear-gradient(180deg, #2F8FD1 0%, #1F6FB5 100%)",
                                    color: P.textWhite,
                                    fontSize: 14,
                                    fontWeight: 700,
                                    letterSpacing: 0.5,
                                    fontFamily: "'DM Sans', sans-serif",
                                    cursor: "pointer",
                                }}
                            >
                                + Add Device
                            </button>
                        </div>
                    )}

                    {!loading &&
                        !error &&
                        devices.map((device) => (
                            <DeviceCard
                                key={device.id}
                                device={device}
                                selectMode={selectMode}
                                onOpen={() => handleOpenDevice(device)}
                            />
                        ))}
                </div>
            </div>
        </PageBackground>
    );
}

// =====================================================
// DEVICE CARD
// =====================================================

function DeviceCard({ device, selectMode, onOpen }) {
    const [selected, setSelected] = useState(false);

    const handleShare = async (e) => {
        e.stopPropagation();

        const shareText = `${device.nickname} — IMEI ${device.imei}`;

        if (navigator.share) {
            try {
                await navigator.share({ title: device.nickname, text: shareText });
            } catch (err) {
                // user cancelled share sheet — ignore
            }
        } else if (navigator.clipboard) {
            navigator.clipboard.writeText(shareText).catch(() => {});
        }
    };

    return (
        <div
            onClick={() => {
                if (selectMode) {
                    setSelected((v) => !v);
                    return;
                }
                onOpen();
            }}
            style={{
                width: "100%",
                background: P.surface,
                borderRadius: 18,
                padding: "18px 20px",
                marginBottom: 16,
                boxShadow: P.shadowCardLg,
                border: selected
                    ? `2px solid ${P.borderStrong}`
                    : `1px solid ${P.border}`,
                boxSizing: "border-box",
                cursor: "pointer",
            }}
        >
            {/* NICKNAME + SHARE / SELECT */}
            <div
                style={{
                    display: "flex",
                    alignItems: "flex-start",
                    justifyContent: "space-between",
                }}
            >
                <div>
                    <div
                        style={{
                            fontSize: 18,
                            fontWeight: 700,
                            color: "#2F6FD1",
                            fontFamily: "'DM Sans', sans-serif",
                            lineHeight: 1.3,
                        }}
                    >
                        {device.nickname}
                    </div>

                    <div
                        style={{
                            fontSize: 13,
                            color: P.textMuted,
                            marginTop: 2,
                            fontFamily: "'Inter', sans-serif",
                            overflowWrap: "anywhere",
                        }}
                    >
                        {device.imei}
                    </div>
                </div>

                {selectMode ? (
                    <div
                        style={{
                            width: 22,
                            height: 22,
                            borderRadius: "50%",
                            border: `2px solid ${
                                selected ? P.borderStrong : P.border
                            }`,
                            background: selected ? P.borderStrong : "transparent",
                            flexShrink: 0,
                            marginTop: 2,
                        }}
                    />
                ) : (
                    <button
                        type="button"
                        onClick={handleShare}
                        aria-label="Share device"
                        style={{
                            border: "none",
                            background: "transparent",
                            padding: 0,
                            cursor: "pointer",
                            color: "#2F6FD1",
                            flexShrink: 0,
                        }}
                    >
                        <svg
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <path d="M4 12v7a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-7" />
                            <polyline points="16 6 12 2 8 6" />
                            <line x1="12" y1="2" x2="12" y2="15" />
                        </svg>
                    </button>
                )}
            </div>

            {/* DIVIDER */}
            <div
                style={{
                    height: 1,
                    background: "#F0F0F0",
                    margin: "14px 0",
                }}
            />

            {/* DEVICE TYPE / RATING / TOTAL GENERATION */}
            <div
                style={{
                    display: "flex",
                    alignItems: "flex-start",
                    justifyContent: "space-between",
                    gap: 10,
                }}
            >
                <MetricColumn value={device.deviceType} label="DEVICE TYPE" />
                <MetricColumn value={device.rating} label="RATING" />
                <MetricColumn
                    value={device.totalGeneration}
                    label="TOTAL GENERATION"
                    color="#2F6FD1"
                />

                {!selectMode && (
                    <div
                        style={{
                            color: P.textLight,
                            fontSize: 18,
                            lineHeight: "20px",
                            marginTop: 2,
                        }}
                    >
                        ›
                    </div>
                )}
            </div>

            {/* ADDED ON */}
            <div
                style={{
                    marginTop: 14,
                    fontSize: 12,
                    color: P.textMuted,
                    fontFamily: "'Inter', sans-serif",
                }}
            >
                Added on: {formatAddedOn(device.addedAt)}
            </div>
        </div>
    );
}

function MetricColumn({ value, label, color }) {
    return (
        <div style={{ minWidth: 0 }}>
            <div
                style={{
                    fontSize: 14,
                    fontWeight: 700,
                    color: color || P.textPrimary,
                    fontFamily: "'DM Sans', sans-serif",
                    overflowWrap: "anywhere",
                }}
            >
                {value}
            </div>
            <div
                style={{
                    fontSize: 10,
                    letterSpacing: 0.4,
                    color: P.textLight,
                    marginTop: 3,
                    fontFamily: "'Inter', sans-serif",
                }}
            >
                {label}
            </div>
        </div>
    );
}

function StateMessage({ text, isError }) {
    return (
        <div
            style={{
                textAlign: "center",
                padding: "30px 10px",
                color: isError ? P.textErrorMsg : P.textSecond,
                fontSize: 14,
                fontFamily: "'Inter', sans-serif",
            }}
        >
            {text}
        </div>
    );
}

// =====================================================
// HELPERS
// =====================================================

const headerPillBtn = {
    width: 40,
    height: 40,
    borderRadius: 20,
    border: `1px solid ${P.border}`,
    background: P.surface,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 22,
    color: P.textPrimary,
    cursor: "pointer",
    boxShadow: "0 4px 14px rgba(0,0,0,0.12)",
    WebkitTapHighlightColor: "transparent",
};

// Pulls a "3KW" style rating out of a model string like
// "Energiaa X3 - 3KW". Falls back to the DB's rated
// capacity when no model is on file.
function extractRating(model, ratedCapacityKw) {
    if (model) {
        const match = model.match(/(\d+(\.\d+)?\s?KW)/i);
        if (match) {
            return match[1].replace(/\s+/g, "").toUpperCase();
        }
    }

    if (ratedCapacityKw !== undefined && ratedCapacityKw !== null) {
        const num = Number(ratedCapacityKw);
        if (!Number.isNaN(num)) {
            return `${num}KW`;
        }
    }

    return "--";
}

function formatGeneration(totalGenerationKwh) {
    const num = Number(totalGenerationKwh);
    if (totalGenerationKwh === undefined || totalGenerationKwh === null || Number.isNaN(num)) {
        return "--";
    }
    return `${num.toFixed(1)} kWh`;
}

function formatAddedOn(isoString) {
    if (!isoString) return "--";

    const date = new Date(isoString);
    if (Number.isNaN(date.getTime())) return "--";

    const datePart = date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    });

    const timePart = date.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
    });

    return `${datePart} • ${timePart}`;
}
