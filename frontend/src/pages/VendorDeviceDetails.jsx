import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import VendorFooter from "../components/VendorFooter";
import VendorPageHeader from "../components/VendorPageHeader";
import DeviceInfo from "../components/DeviceInfo";
import PageBackground from "../components/PageBackground";
import P from "../theme/colors";

const API_BASE = "http://localhost:3000";
// const API_BASE = "http://213.210.21.49:3001";

//VPSCHANGE

export default function VendorDeviceDetails() {
    const navigate = useNavigate();
    const { id } = useParams();

    const [details, setDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // =====================================================
    // FETCH VENDOR DEVICE DETAILS
    // =====================================================

    useEffect(() => {
        if (!id) {
            setError("No device selected.");
            setLoading(false);
            return;
        }

        let cancelled = false;

        // const fetchDetails = async () => {
        //     try {
        //         setLoading(true);
        //         setError("");

        //         const token = localStorage.getItem("vendorToken");

        //         if (!token) {
        //             navigate("/login");
        //             return;
        //         }

        //         const url =
        //             `${API_BASE}/api/vendor/devices/${id}`;

        //         console.log("Fetching vendor device details:", url);

        //         const res = await fetch(url, {
        //             method: "GET",
        //             headers: {
        //                 Authorization: `Bearer ${token}`,
        //                 Accept: "application/json",
        //             },
        //         });

        //         const raw = await res.text();

        //         console.log(
        //             "VENDOR DEVICE DETAILS:",
        //             res.status,
        //             res.headers.get("content-type"),
        //             raw
        //         );

        //         let result;

        //         try {
        //             result = JSON.parse(raw);
        //         } catch {
        //             throw new Error(
        //                 `Server returned an invalid response (${res.status}).`
        //             );
        //         }

        //         if (!res.ok) {
        //             throw new Error(
        //                 result.error ||
        //                 result.message ||
        //                 `Failed to load vendor device details (${res.status})`
        //             );
        //         }

        //         if (!cancelled) {
        //             setDetails(result);
        //         }
        //     } catch (err) {
        //         console.error(
        //             "Vendor device details error:",
        //             err
        //         );

        //         if (!cancelled) {
        //             setError(
        //                 err.message ||
        //                 "Failed to load vendor device details"
        //             );
        //         }
        //     } finally {
        //         if (!cancelled) {
        //             setLoading(false);
        //         }
        //     }
        // };

        const fetchDetails = async () => {
    try {
        setLoading(true);
        setError("");

        const token = localStorage.getItem("vendorToken");
        if (!token) {
            navigate("/login");
            return;
        }

        const res = await fetch(
            //VPSCHANGE
            `${API_BASE}/api/vendor/devices/${id}/details`,
                        // `/api/vendor/devices/${id}/details`,

            {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: "application/json",
                },
            }
        );

        const raw = await res.text();

        console.log("VENDOR DEVICE DETAILS:", res.status, raw);

        let result;
        try {
            result = JSON.parse(raw);
        } catch {
            throw new Error(`Server returned an invalid response (${res.status}).`);
        }

        if (!res.ok) {
            throw new Error(
                result.error || result.message ||
                `Failed to load vendor device details (${res.status})`
            );
        }

        if (!cancelled) {
            setDetails(result);
        }
    } catch (err) {
        console.error("Vendor device details error:", err);
        if (!cancelled) {
            setError(err.message || "Failed to load vendor device details");
        }
    } finally {
        if (!cancelled) {
            setLoading(false);
        }
    }
};

        fetchDetails();

        return () => {
            cancelled = true;
        };
    }, [id, navigate]);


    // =====================================================
    // LOADING
    // =====================================================

    if (loading) {
        return (
            <Page>
                <VendorPageHeader
                    title="DEVICE DETAILS"
                    backPath="/vendor/devices"
                />

                <Message>
                    Loading device details...
                </Message>
            </Page>
        );
    }


    // =====================================================
    // ERROR
    // =====================================================

    if (error) {
        return (
            <Page>
                <VendorPageHeader
                    title="DEVICE DETAILS"
                    backPath="/vendor/devices"
                />

                <Message error>
                    {error}
                </Message>
            </Page>
        );
    }


    // =====================================================
    // NO DEVICE
    // =====================================================

    if (!details?.device) {
        return (
            <Page>
                <VendorPageHeader
                    title="DEVICE DETAILS"
                    backPath="/vendor/devices"
                />

                <Message>
                    No device found
                </Message>
            </Page>
        );
    }


    // =====================================================
    // DATA
    // =====================================================

    const device = details.device;

    const latest = details.latest;

    const payload =
        latest?.payload || {};


    // =====================================================
    // DEVICE STATUS
    // =====================================================

    const status3 =
        Number(payload.ST3 ?? 0);

    const stInterval =
        Number(payload.STINTERVAL ?? 0);

    const lastUpdated =
        latest?.created_at
            ? new Date(latest.created_at)
            : null;


    const dataTooOld =
        !lastUpdated ||
        (
            Date.now() -
            lastUpdated.getTime()
        ) >=
        3 * 60 * 1000;


    const intervalTooLarge =
        stInterval / 4 >= 1;


    const statusFromST3 =
        Boolean(
            status3 &
            (1 << 2)
        );


    const inverterOn =
        statusFromST3 &&
        !dataTooOld &&
        !intervalTooLarge;


    const statusText =
        inverterOn
            ? "ON"
            : "OFF";


    const statusColor =
        inverterOn
            ? P.green
            : P.red;


    // =====================================================
    // FORMATTED LAST UPDATED
    // =====================================================

    const formattedDate =
        lastUpdated
            ? lastUpdated.toLocaleDateString(
                "en-GB",
                {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                }
            )
            : "--";


    const formattedTime =
        lastUpdated
            ? lastUpdated.toLocaleTimeString(
                "en-US",
                {
                    hour: "numeric",
                    minute: "2-digit",
                    hour12: true,
                }
            )
            : "--";


    // =====================================================
    // RENDER
    // =====================================================

    return (
        <PageBackground>

            <div
                style={{
                    minHeight: "100vh",
                    paddingBottom: "90px",
                    fontFamily: "'Inter', sans-serif",
                }}
            >

                {/* =================================================
                    HEADER
                ================================================= */}

                <VendorPageHeader
                    title="DEVICE DETAILS"
                    backPath="/vendor/devices"
                />


                {/* =================================================
                    DEVICE INFO
                ================================================= */}

                <DeviceInfo
                    data={payload}
                    lastUpdated={lastUpdated}
                    devices={[device]}
                    selectedDeviceId={device.id}
                />


                {/* =================================================
                    PAGE CONTENT
                ================================================= */}

                <div
                    style={{
                        padding: "0 20px 20px",
                    }}
                >

                    <h2
                        style={{
                            fontSize: 15,
                            fontWeight: 800,
                            color: P.textWhite,
                            marginBottom: 12,
                            marginTop: 4,
                            letterSpacing: 0.5,
                            fontFamily: "'DM Sans', sans-serif",
                        }}
                    >
                        DEVICE INFORMATION
                    </h2>


                    {/* =================================================
                        INFORMATION CARD
                    ================================================= */}

                    <div
                        style={{
                            background: P.surface,
                            border: `1px solid ${P.border}`,
                            borderRadius: 14,
                            padding: "8px 16px",
                            boxShadow: P.shadowCardRaised,
                        }}
                    >

                        <DetailRow
                            label="DEVICE NO."
                            value={
                                device.imei ||
                                device.device_id ||
                                device.id ||
                                "--"
                            }
                        />


                        <DetailRow
                            label="DEVICE TYPE"
                            value={
                                device.solution ||
                                device.device_type ||
                                "--"
                            }
                        />


                        <DetailRow
                            label="RATING"
                            value={
                                payload.RAT != null
                                    ? `${payload.RAT} VA`
                                    : device.rating != null
                                        ? `${device.rating} VA`
                                        : "--"
                            }
                        />


                        <DetailRow
                            label="LOCATION"
                            value={
                                device.location ||
                                "--"
                            }
                        />


                        {/* =================================================
                            STATUS
                        ================================================= */}

                        <div
                            style={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                gap: 20,
                                padding: "14px 0",
                                borderBottom:
                                    `1px solid ${P.border}`,
                            }}
                        >

                            <span
                                style={{
                                    fontSize: 10,
                                    color: P.textMuted,
                                    fontWeight: 600,
                                    letterSpacing: 0.8,
                                    fontFamily:
                                        "'Inter', sans-serif",
                                    flexShrink: 0,
                                }}
                            >
                                DEVICE STATUS
                            </span>


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
                                }}
                            >

                                <div
                                    style={{
                                        width: 8,
                                        height: 8,
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
                                        color:
                                            statusColor,
                                        fontFamily:
                                            "'DM Sans', sans-serif",
                                    }}
                                >
                                    {statusText}
                                </span>

                            </div>

                        </div>


                        {/* =================================================
                            LAST UPDATED
                        ================================================= */}

                        <div
                            style={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                gap: 20,
                                paddingTop: 14,
                            }}
                        >

                            <div
                                style={{
                                    fontSize: 10,
                                    color: P.textLight,
                                    fontWeight: 600,
                                    letterSpacing: 0.8,
                                    fontFamily:
                                        "'Inter', sans-serif",
                                    flexShrink: 0,
                                }}
                            >
                                LAST UPDATED
                            </div>


                            <div
                                style={{
                                    textAlign: "right",
                                    minWidth: 0,
                                    marginLeft: "auto",
                                }}
                            >

                                <div
                                    style={{
                                        fontSize: 14,
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
                                        marginTop: 3,
                                        fontSize: 12,
                                        fontWeight: 600,
                                        color: P.textMuted,
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


                {/* =================================================
                    FOOTER
                ================================================= */}

                {/* <Footer
                    data={payload}
                /> */}
                            <VendorFooter />
                

            </div>

        </PageBackground>
    );
}


// =====================================================
// DETAIL ROW
// =====================================================

function DetailRow({
    label,
    value,
}) {
    return (
        <div
            style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: 20,
                padding: "14px 0",
                borderBottom:
                    `1px solid ${P.border}`,
            }}
        >

            <span
                style={{
                    fontSize: 10,
                    color: P.textMuted,
                    fontWeight: 600,
                    letterSpacing: 0.8,
                    fontFamily:
                        "'Inter', sans-serif",
                    flexShrink: 0,
                }}
            >
                {label}
            </span>


            <span
                style={{
                    fontSize: 14,
                    fontWeight: 700,
                    color: P.textPrimary,
                    fontFamily:
                        "'DM Sans', sans-serif",
                    textAlign: "right",
                    overflowWrap: "anywhere",
                }}
            >
                {value}
            </span>

        </div>
    );
}


// =====================================================
// PAGE
// =====================================================

function Page({
    children,
}) {
    return (
        <div
            style={{
                minHeight: "100vh",
                paddingBottom: "90px",
                background: P.bg,
                fontFamily:
                    "'Inter', sans-serif",
            }}
        >
            {children}
        </div>
    );
}


// =====================================================
// MESSAGE
// =====================================================

function Message({
    children,
    error = false,
}) {
    return (
        <div
            style={{
                margin: "20px",
                background: P.surface,
                borderRadius: 14,
                padding: 24,
                border:
                    `1px solid ${P.border}`,
                boxShadow: P.shadowCard,
                color:
                    error
                        ? P.red
                        : P.textMuted,
                textAlign: "center",
                boxSizing: "border-box",
            }}
        >
            {children}
        </div>
    );
}