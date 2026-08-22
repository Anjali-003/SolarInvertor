import React, { useEffect, useState } from "react";
import P from "../theme/colors";

export default function DeviceInfo({
    data,
    lastUpdated,
    devices,
    selectedDeviceId,
}) {

    // =====================================================
    // FORCE RE-RENDER EVERY SECOND
    // =====================================================
    // This allows the 3-minute timeout to happen automatically
    // without requiring a page refresh or new server response.

    const [, setCurrentTime] =
        useState(Date.now());

    useEffect(() => {

        const timer =
            setInterval(() => {

                setCurrentTime(Date.now());

            }, 1000);

        return () =>
            clearInterval(timer);

    }, []);


    // =====================================================
    // SELECTED DEVICE
    // =====================================================

    const selectedDevice =
        devices?.find(
            device =>
                Number(device.id) ===
                Number(selectedDeviceId)
        );


    // =====================================================
    // IMEI
    // =====================================================

    const imei =
        selectedDevice?.imei ?? "--";


    // =====================================================
    // RATING
    // =====================================================

    const rating =
        data?.RAT ?? "--";


    // =====================================================
    // ST3 STATUS
    // =====================================================
    //
    // ST3 bit 2:
    //
    // 1 = inverter ON
    // 0 = inverter OFF
    //

    const status3 =
        Number(data?.ST3 ?? 0);

    const inverterOnFromST3 =
        Boolean(status3 & (1 << 2));


    // =====================================================
    // LAST UPDATED / DATA AGE
    // =====================================================

    const updatedAt =
        lastUpdated
            ? new Date(lastUpdated).getTime()
            : null;


    const dataAgeMs =
        updatedAt
            ? Date.now() - updatedAt
            : Infinity;


    // =====================================================
    // CONDITION 1
    // DATA OLDER THAN OR EQUAL TO 3 MINUTES
    // =====================================================

    const dataTimedOut =
        dataAgeMs >=
        3 * 60 * 1000;


    // =====================================================
    // CONDITION 2
    // STINTERVAL / 4 >= 1
    //
    // Equivalent to:
    //
    // STINTERVAL >= 4
    // =====================================================

    const stInterval =
        Number(data?.STINTERVAL ?? 0);


    const intervalTooHigh =
        stInterval / 4 >= 1;


    // =====================================================
    // FINAL STATUS
    // =====================================================
    //
    // OFF if:
    //
    // 1. Data is >= 3 minutes old
    // OR
    // 2. STINTERVAL / 4 >= 1
    // OR
    // 3. ST3 says OFF
    //
    // Therefore ALL conditions must be healthy
    // for the inverter to show ON.
    // =====================================================

    const inverterOn =
        !dataTimedOut &&
        !intervalTooHigh &&
        inverterOnFromST3;


    const statusText =
        inverterOn
            ? "ON"
            : "OFF";


    const statusColor =
        inverterOn
            ? P.green
            : P.red;


    // =====================================================
    // LAST UPDATED FORMATTING
    // =====================================================

    const formattedDate =
        lastUpdated
            ? new Date(lastUpdated)
                .toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                })
            : "--";


    const formattedTime =
        lastUpdated
            ? new Date(lastUpdated)
                .toLocaleTimeString("en-US", {
                    hour: "numeric",
                    minute: "2-digit",
                    hour12: true,
                })
            : "--";


    // =====================================================
    // UI
    // =====================================================

    return (
        <div
            style={{
                width: "100%",
                maxWidth: 700,
                margin: "20px auto 16px",
                padding: "0 20px",
                boxSizing: "border-box",
            }}
        >

            <div
                style={{
                    width: "100%",
                    boxSizing: "border-box",

                    background: P.surface,
                    borderRadius: 16,
                    padding: "16px 18px",

                    border:
                        `1px solid ${P.border}`,

                    boxShadow:
                        P.shadowCard,

                    display: "grid",

                    gridTemplateColumns:
                        "minmax(0, 1fr) minmax(0, auto)",

                    alignItems: "start",
                    columnGap: 24,

                    overflow: "hidden",
                }}
            >

                {/* =================================================
                    LEFT
                ================================================= */}

                <div
                    style={{
                        minWidth: 0,
                        display: "flex",
                        flexDirection: "column",
                        gap: 14,
                    }}
                >

                    {/* =================================================
                        IMEI
                    ================================================= */}

                    <div
                        style={{
                            minWidth: 0,
                        }}
                    >

                        <div
                            style={{
                                fontSize: 10,
                                color: P.textMuted,
                                fontWeight: 500,
                                letterSpacing: 0.8,
                                marginBottom: 3,
                                fontFamily:
                                    "'Inter', sans-serif",
                            }}
                        >
                            IMEI
                        </div>


                        <div
                            style={{
                                fontSize: 16,
                                fontWeight: 700,
                                color: P.textPrimary,
                                fontFamily:
                                    "'DM Sans', sans-serif",

                                minWidth: 0,
                                maxWidth: "100%",

                                overflowWrap:
                                    "anywhere",

                                wordBreak:
                                    "break-word",
                            }}
                        >
                            {imei}
                        </div>

                    </div>


                    {/* =================================================
                        RATING
                    ================================================= */}

                    <div
                        style={{
                            minWidth: 0,
                        }}
                    >

                        <div
                            style={{
                                fontSize: 10,
                                color: P.textMuted,
                                fontWeight: 500,
                                letterSpacing: 0.8,
                                marginBottom: 3,
                                fontFamily:
                                    "'Inter', sans-serif",
                            }}
                        >
                            RATING
                        </div>


                        <div
                            style={{
                                fontSize: 16,
                                fontWeight: 700,
                                color: P.textPrimary,
                                fontFamily:
                                    "'DM Sans', sans-serif",
                            }}
                        >

                            {rating}{" "}

                            <span
                                style={{
                                    fontSize: 12,
                                    fontWeight: 500,
                                    color: P.textMuted,
                                }}
                            >
                                VA
                            </span>

                        </div>

                    </div>

                </div>


                {/* =================================================
                    RIGHT
                ================================================= */}

                <div
                    style={{
                        minWidth: 0,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "flex-end",
                        textAlign: "right",
                    }}
                >

                    {/* =================================================
                        STATUS
                    ================================================= */}

                    <div
                        style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 7,

                            padding: "5px 10px",
                            borderRadius: 20,

                            background:
                                `${statusColor}18`,

                            border:
                                `1px solid ${statusColor}`,

                            marginBottom: 14,

                            flexShrink: 0,
                        }}
                    >

                        <div
                            style={{
                                width: 8,
                                height: 8,
                                minWidth: 8,
                                borderRadius: "50%",

                                background:
                                    statusColor,

                                boxShadow:
                                    `0 0 7px ${statusColor}`,
                            }}
                        />


                        <span
                            style={{
                                fontSize: 12,
                                fontWeight: 700,
                                color: statusColor,
                                fontFamily:
                                    "'DM Sans', sans-serif",
                            }}
                        >
                            {statusText}
                        </span>

                    </div>


                    {/* =================================================
                        LAST UPDATED
                    ================================================= */}

                    <div
                        style={{
                            minWidth: 0,
                            maxWidth: "100%",
                        }}
                    >

                        <div
                            style={{
                                fontSize: 10,
                                color: P.textMuted,
                                fontWeight: 500,
                                letterSpacing: 0.8,
                                marginBottom: 4,
                                fontFamily:
                                    "'Inter', sans-serif",
                                whiteSpace: "nowrap",
                            }}
                        >
                            LAST UPDATED
                        </div>


                        <div
                            style={{
                                fontSize: 13,
                                fontWeight: 700,
                                color: P.textPrimary,
                                fontFamily:
                                    "'DM Sans', sans-serif",
                                lineHeight: 1.2,
                                whiteSpace: "nowrap",
                            }}
                        >
                            {formattedDate}
                        </div>


                        <div
                            style={{
                                fontSize: 13,
                                fontWeight: 600,
                                color: P.textPrimary,
                                marginTop: 3,
                                fontFamily:
                                    "'Inter', sans-serif",
                                lineHeight: 1.2,
                                whiteSpace: "nowrap",
                            }}
                        >
                            {formattedTime}
                        </div>

                    </div>

                </div>

            </div>

        </div>
    );
}