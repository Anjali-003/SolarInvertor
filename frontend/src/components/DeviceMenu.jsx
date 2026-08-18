import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useInverter } from "../context/Context";
import P from "../theme/colors";

export default function DeviceMenu() {

    const navigate = useNavigate();

    const {
        devices,
        selectedDeviceId,
        setSelectedDeviceId
    } = useInverter();

    const [open, setOpen] = useState(false);


    const handleSelectDevice = (deviceId) => {

        setSelectedDeviceId(deviceId);

        // Close menu after selection
        setOpen(false);
    };


    return (
        <>
            {/* =========================
                BURGER BUTTON
            ========================== */}
{/* 
            <button
                type="button"
                onClick={() => setOpen(true)}
                style={{
                    position: "absolute",
                    left: 16,
                    top: "50%",
                    transform: "translateY(-50%)",

                    width: 42,
                    height: 42,

                    border: "none",
                    background: "transparent",

                    cursor: "pointer",

                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",

                    gap: 5,
                }}
            > */}


            <button
    type="button"
    onClick={() => setOpen(true)}
    style={{
        position: "absolute",
        // left: 16,
        right: 16,
        top: "50%",
        transform: "translateY(-50%)",

        width: 42,
        height: 42,

        border: "none",
        background: "transparent",

        cursor: "pointer",

        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",

        gap: 5,
    }}
>

                <span
                    style={{
                        width: 22,
                        height: 2,
                        background: P.textPrimary,
                        borderRadius: 2,
                    }}
                />

                <span
                    style={{
                        width: 22,
                        height: 2,
                        background: P.textPrimary,
                        borderRadius: 2,
                    }}
                />

                <span
                    style={{
                        width: 22,
                        height: 2,
                        background: P.textPrimary,
                        borderRadius: 2,
                    }}
                />

            </button>


            {/* =========================
                OVERLAY
            ========================== */}

            {open && (
                <div
                    onClick={() => setOpen(false)}
                    style={{
                        position: "fixed",
                        inset: 0,
                        background:
                            "rgba(0,0,0,0.25)",
                        zIndex: 999,
                    }}
                />
            )}


            {/* =========================
                SIDE MENU
            ========================== */}

            <div
                style={{
                    position: "fixed",
                    top: 0,
                    // left: 0,
right: 0,
left: "auto",
                    width: 320,
                    maxWidth: "85vw",
                    height: "100vh",

                    background: P.surface,

                    boxShadow:
                        "4px 0 20px rgba(0,0,0,0.15)",

                    zIndex: 1000,

                    transform:
                        open
                            ? "translateX(0)"
                            : "translateX(100%)",

                    transition:
                        "transform 0.25s ease",

                    display: "flex",
                    flexDirection: "column",
                }}
            >

                {/* =========================
                    MENU HEADER
                ========================== */}

                <div
                    style={{
                        height: 64,

                        display: "flex",
                        alignItems: "center",
                        justifyContent:
                            "space-between",

                        padding: "0 18px",

                        borderBottom:
                            `1px solid ${P.border}`,
                    }}
                >

                    <div
                        style={{
                            fontSize: 17,
                            fontWeight: 800,
                            color: P.textPrimary,
                            fontFamily:
                                "'DM Sans', sans-serif",
                        }}
                    >
                        Your Devices
                    </div>


                    <button
                        type="button"
                        onClick={() =>
                            setOpen(false)
                        }
                        style={{
                            border: "none",
                            background:
                                "transparent",
                            fontSize: 26,
                            cursor: "pointer",
                            color:
                                P.textPrimary,
                        }}
                    >
                        ×
                    </button>

                </div>


                {/* =========================
                    DEVICE LIST
                ========================== */}

                <div
                    style={{
                        flex: 1,
                        overflowY: "auto",
                        padding: 16,
                    }}
                >

                    {devices.length === 0 ? (

                        <div
                            style={{
                                padding: 20,
                                textAlign: "center",
                                color:
                                    P.textMuted,
                                fontSize: 14,
                            }}
                        >
                            No devices added.
                        </div>

                    ) : (

                        devices.map((device) => {

                            const selected =
                                device.id ===
                                selectedDeviceId;

                            return (

                                <button
                                    key={device.id}
                                    type="button"
                                    onClick={() =>
                                        handleSelectDevice(
                                            device.id
                                        )
                                    }
                                    style={{
                                        width: "100%",
                                        textAlign:
                                            "left",

                                        border:
                                            selected
                                                ? `2px solid ${P.borderAmber}`
                                                : `1px solid ${P.border}`,

                                        background:
                                            selected
                                                ? P.surfaceAmber
                                                : P.surface,

                                        borderRadius: 14,

                                        padding: 14,

                                        marginBottom: 12,

                                        cursor:
                                            "pointer",
                                    }}
                                >

                                    {/* IMEI */}

                                    <div
                                        style={{
                                            fontSize: 15,
                                            fontWeight: 800,
                                            color:
                                                P.textPrimary,
                                            marginBottom: 8,
                                        }}
                                    >
                                        {device.imei}
                                    </div>


                                    {/* VERSION */}

                                    <div
                                        style={{
                                            fontSize: 12,
                                            color:
                                                P.textMuted,
                                            marginBottom: 4,
                                        }}
                                    >
                                        Version:{" "}
                                        {device.device_version ||
                                            "--"}
                                    </div>


                                    {/* SOLUTION */}

                                    <div
                                        style={{
                                            fontSize: 12,
                                            color:
                                                P.textMuted,
                                        }}
                                    >
                                        Solution:{" "}
                                        {device.solution ||
                                            "--"}
                                    </div>


                                    {/* SELECTED */}

                                    {selected && (

                                        <div
                                            style={{
                                                marginTop: 10,
                                                fontSize: 11,
                                                fontWeight: 800,
                                                color:
                                                    P.textAmber,
                                            }}
                                        >
                                            ✓ ACTIVE DEVICE
                                        </div>

                                    )}

                                </button>

                            );

                        })

                    )}

                </div>


                {/* =========================
                    ADD DEVICE
                ========================== */}

                <div
                    style={{
                        padding: 16,
                        borderTop:
                            `1px solid ${P.border}`,
                    }}
                >

                    <button
                        type="button"
                        onClick={() => {

                            setOpen(false);

                            navigate(
                                "/add-device"
                            );

                        }}
                        style={{
                            width: "100%",
                            padding: 14,

                            border: "none",
                            borderRadius: 12,

                            background:
                                P.btnPrimary,

                            color:
                                P.textWhite,

                            fontWeight: 700,

                            cursor: "pointer",
                        }}
                    >
                        + Add Device
                    </button>

                </div>

            </div>
        </>
    );
}