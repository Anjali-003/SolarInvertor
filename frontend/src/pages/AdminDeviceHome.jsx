// =====================================================
// ADMIN DEVICE HOME / DASHBOARD
//
// This is a copy of VendorHome.jsx, adapted for the
// admin role. It shows the same generation / CUF / AC
// parameter dashboard for whichever device the admin
// has selected from AdminDevices.jsx.
// =====================================================

import { useNavigate } from "react-router-dom";
import AdminDeviceFooter from "../components/AdminDeviceFooter";
import P from "../theme/colors";
import DeviceInfo from "../components/DeviceInfo";
import AdminDevicePageHeader from "../components/AdminDevicePageHeader";
import { useAdminDevice } from "../context/AdminDeviceContext";
import PageBackground from "../components/PageBackground";
import PowerFlowCard from "../components/PowerFlowCard";


export default function AdminDeviceHome() {
    const navigate = useNavigate();

    // ============================================================
    // DEVICE CONTEXT
    // ============================================================

    const {
        selectedDevice,
        data,
        loading,
        lastUpdated,
        energy,
    } = useAdminDevice();


    const getPlantCapacity = () => {
        const rat = Number(data?.RAT);

        if (!Number.isFinite(rat) || rat <= 0) {
            return null;
        }

        return rat;
    };

    const getHoursInCurrentMonth = () => {
        const now = new Date();

        const year = now.getFullYear();
        const month = now.getMonth();

        const daysInMonth =
            new Date(
                year,
                month + 1,
                0
            ).getDate();

        return daysInMonth * 24;
    };

    const getHoursInCurrentYear = () => {
        const now = new Date();
        const year = now.getFullYear();

        const isLeapYear =
            (year % 4 === 0 && year % 100 !== 0) ||
            year % 400 === 0;

        return (
            (isLeapYear ? 366 : 365) * 24
        );
    };

    const calculateCUF = (
        generatedEnergy,
        totalHours
    ) => {
        const capacity = getPlantCapacity();

        const energyValue =
            Number(generatedEnergy);

        if (
            capacity === null ||
            !Number.isFinite(energyValue) ||
            energyValue < 0 ||
            totalHours <= 0
        ) {
            return null;
        }

        return (
            (energyValue /
                (capacity * totalHours)) *
            100
        );
    };

    const getTodayCUF = () => {
        return calculateCUF(
            energy?.today,
            24
        );
    };

    const getMonthlyCUF = () => {
        return calculateCUF(
            energy?.monthly,
            getHoursInCurrentMonth()
        );
    };

    const getYearlyCUF = () => {
        return calculateCUF(
            energy?.yearly,
            getHoursInCurrentYear()
        );
    };

    const formatCUF = (value) => {
        if (
            value === null ||
            !Number.isFinite(value)
        ) {
            return "--";
        }

        return `${value.toFixed(2)}%`;
    };

    // ============================================================
    // GET PARAMETER VALUE
    // ============================================================

    const getParameterValue = (parameter) => {
        return data?.[parameter] ?? "--";
    };

    // ============================================================
    // DC POWER
    // ============================================================

    const getDCPower = () => {
        const voltage = Number(data?.DCV1);
        const current = Number(data?.DCI1);

        if (
            !Number.isFinite(voltage) ||
            !Number.isFinite(current)
        ) {
            return "--";
        }

        return ((voltage * current) / 1000).toFixed(3);
    };

    // ============================================================
    // STYLES
    // ============================================================

    const metricCard = {
        background: P.surfaceWarm,
        border: `1px solid ${P.borderAmber}`,
        borderRadius: 12,
        padding: "12px 14px",
        minWidth: 0,
        boxSizing: "border-box",
    };

    const metricIconRow = {
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 6,
    };

    const metricIcon = {
        fontSize: 16,
        color: P.textAmberBright,
    };

    const metricValue = {
        fontSize: 20,
        fontWeight: 800,
        color: P.textPrimary,
        fontFamily: "'DM Sans', sans-serif",
    };

    const metricUnit = {
        fontSize: 14,
        fontWeight: 600,
        color: P.textMuted,
        fontFamily: "'Inter', sans-serif",
    };

    const metricLabel = {
        fontSize: 13,
        fontWeight: 600,
        color: P.textSecond,
        fontFamily: "'Inter', sans-serif",
        marginBottom: 2,
    };

    const metricDesc = {
        fontSize: 11,
        color: P.textLight,
        fontFamily: "'Inter', sans-serif",
    };

    // ============================================================
    // NO DEVICE SELECTED
    // ============================================================

    if (!selectedDevice) {
        return (
            <div
                style={{
                    minHeight: "100vh",
                    paddingBottom: 90,
                    background: P.bg,
                    fontFamily: "'Inter', sans-serif",
                    boxSizing: "border-box",
                }}
            >
                <AdminDevicePageHeader title="HOME" />

                <div
                    style={{
                        padding: 20,
                        textAlign: "center",
                    }}
                >
                    <p style={{ color: P.textMuted }}>
                        No device selected. Go back and pick a device.
                    </p>

                    <button
                        onClick={() => navigate("/admin/devices")}
                        style={{
                            marginTop: 12,
                            padding: "12px 20px",
                            border: "none",
                            borderRadius: 50,
                            background: P.btnPrimary,
                            color: P.textWhite,
                            fontWeight: 700,
                            cursor: "pointer",
                        }}
                    >
                        Go to All Devices
                    </button>
                </div>

                <AdminDeviceFooter />
            </div>
        );
    }

    // ============================================================
    // PAGE
    // ============================================================

    return (
        <PageBackground>
        <div
            style={{
                minHeight: "100vh",
                paddingBottom: 90,
                fontFamily: "'Inter', sans-serif",
                boxSizing: "border-box",
                width: "100%",
                overflowX: "hidden",
            }}
        >
            {/* ================= HEADER ================= */}

            <div
                style={{
                    height: 64,
                    background: P.surface,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    borderBottom: "1px solid #ECECEC",
                    boxShadow: "0 2px 6px rgba(0,0,0,0.04)",
                    position: "sticky",
                    top: 0,
                    zIndex: 100,
                }}
            >
                {/* BACK BUTTON */}

                <button
                    onClick={() => navigate("/admin/devices")}
                    aria-label="Back to devices"
                    style={{
                        position: "absolute",
                        left: 18,
                        border: "none",
                        background: "transparent",
                        color: P.textAmber,
                        fontSize: 30,
                        fontWeight: 300,
                        lineHeight: 1,
                        cursor: "pointer",
                        padding: 0,
                        width: 32,
                        height: 32,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontFamily: "'Inter', sans-serif",
                        WebkitTapHighlightColor: "transparent",
                    }}
                >
                    {"<"}
                </button>

                {/* TITLE */}

                <div
                    style={{
                        fontSize: 18,
                        fontWeight: 700,
                        color: P.textAmber,
                        letterSpacing: 2,
                        fontFamily: "'DM Sans', sans-serif",
                    }}
                >
                    HOME
                </div>
            </div>

            {/* ================= DEVICE INFO ================= */}

            <DeviceInfo
    data={data}
    lastUpdated={lastUpdated}
    devices={selectedDevice ? [selectedDevice] : []}
    selectedDeviceId={selectedDevice?.id}
/>

            {/* ================= PAGE CONTENT ================= */}

            <div
                style={{
                    width: "100%",
                    maxWidth: 700,
                    margin: "0 auto",
                    padding: "0 20px 20px",
                    boxSizing: "border-box",
                }}
            >
                {/* ================= INVERTER DETAILS ================= */}

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
                    INVERTER DETAILS
                </h2>

               <PowerFlowCard
                 dcPower={getDCPower()}
               solarPower={
                       Number.isFinite(Number(data?.PPOW))
                           ? (Number(data.PPOW) / 1000).toFixed(3)
                           : "--"
                   }
                 st3={getParameterValue("ST3")}
               />

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
    CAPACITY UTILIZATION FACTOR
</h2>

<div
    style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr 1fr",
        gap: 10,
        marginBottom: 20,
    }}
>
    {/* TODAY */}
    <div style={statCard}>
        <div style={statIconWrap}>
            <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke={P.borderStrong}
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            >
                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
            </svg>
        </div>

        <div style={statSubLabel}>
            TODAY
        </div>

        <div
            style={{
                ...statValue,
                color: P.textAmberBright,
            }}
        >
            {formatCUF(getTodayCUF())}
        </div>

        <div style={statUnit}>
            CUF
        </div>
    </div>

    {/* MONTH */}
    <div style={statCard}>
        <div style={statIconWrap}>
            <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke={P.borderStrong}
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            >
                <circle cx="12" cy="12" r="5" />
                <line x1="12" y1="1" x2="12" y2="3" />
                <line x1="12" y1="21" x2="12" y2="23" />
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                <line x1="1" y1="12" x2="3" y2="12" />
                <line x1="21" y1="12" x2="23" y2="12" />
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
            </svg>
        </div>

        <div style={statSubLabel}>
            MONTH
        </div>

        <div
            style={{
                ...statValue,
                color: P.textAmberBright,
            }}
        >
            {formatCUF(getMonthlyCUF())}
        </div>

        <div style={statUnit}>
            CUF
        </div>
    </div>

    {/* YEAR */}
    <div style={statCard}>
        <div style={statIconWrap}>
            <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke={P.borderStrong}
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            >
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
            </svg>
        </div>

        <div style={statSubLabel}>
            YEAR
        </div>

        <div
            style={{
                ...statValue,
                color: P.textAmberBright,
            }}
        >
            {formatCUF(getYearlyCUF())}
        </div>

        <div style={statUnit}>
            CUF
        </div>
    </div>
</div>

                {/* ================= AC PARAMETER DETAILS ================= */}

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
                    AC PARAMETER DETAILS
                </h2>

                {/* TEMPERATURE + FREQUENCY */}

                <div
                    style={{
                        background: P.textAmberBright,
                        border: `1.5px solid ${P.borderDark}`,
                        borderRadius: 16,
                        padding: 16,
                        marginBottom: 12,
                        boxShadow: P.shadowCardRaised,
                        display: "grid",
                        gridTemplateColumns:
                            "repeat(2, minmax(0, 1fr))",
                        gap: 12,
                        boxSizing: "border-box",
                    }}
                >
                    {/* TEMPERATURE */}

                    <div style={metricCard}>
                        <div
                            style={{
                                fontSize: 12,
                                color: P.textAmberBright,
                                fontWeight: 600,
                                marginBottom: 4,
                                fontFamily:
                                    "'Inter', sans-serif",
                            }}
                        >
                            🌡 Temp
                        </div>

                        <div
                            style={{
                                fontSize: 22,
                                fontWeight: 800,
                                color: P.textPrimary,
                                fontFamily:
                                    "'DM Sans', sans-serif",
                            }}
                        >
                            {getParameterValue("TEMP")}{" "}
                            <span
                                style={{
                                    fontSize: 14,
                                    color: P.textMuted,
                                    fontWeight: 500,
                                }}
                            >
                                °C
                            </span>
                        </div>
                    </div>

                    {/* FREQUENCY */}

                    <div style={metricCard}>
                        <div
                            style={{
                                fontSize: 12,
                                color: P.textAmberBright,
                                fontWeight: 600,
                                marginBottom: 4,
                                fontFamily:
                                    "'Inter', sans-serif",
                            }}
                        >
                            ≋ Freq
                        </div>

                        <div
                            style={{
                                fontSize: 22,
                                fontWeight: 800,
                                color: P.textPrimary,
                                fontFamily:
                                    "'DM Sans', sans-serif",
                            }}
                        >
                            {getParameterValue("GFREQ")}{" "}
                            <span
                                style={{
                                    fontSize: 14,
                                    color: P.textMuted,
                                    fontWeight: 500,
                                }}
                            >
                                Hz
                            </span>
                        </div>
                    </div>
                </div>

                {/* AC VALUES */}

                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns:
                            "repeat(2, minmax(0, 1fr))",
                        gap: 12,
                        marginBottom: 20,
                    }}
                >
                    {[
                        {
                            key: "VN",
                            label: "AC Voltage",
                            desc: "VN",
                            unit: "V",
                        },
                        {
                            key: "DCI1",
                            label: "AC Current",
                            desc: "I",
                            unit: "A",
                        },
                        {
                            key: "POW",
                            label: "Export Power",
                            desc: "POW",
                            unit: "kW",
                        },
                        {
                            key: "PF",
                            label: "Power Factor",
                            desc: "PF",
                            unit: "",
                        },
                    ].map((item) => (
                        <div
                            key={item.key}
                            style={{
                                ...metricCard,
                                background: P.surface,
                                border: `1px solid ${P.border}`,
                                boxShadow: P.shadowCard,
                            }}
                        >
                            <div
                                style={{
                                    fontSize: 12,
                                    color: P.textAmberBright,
                                    fontWeight: 600,
                                    marginBottom: 6,
                                    fontFamily:
                                        "'Inter', sans-serif",
                                }}
                            >
                                ⚡ {item.label}

                                <span
                                    style={{
                                        fontSize: 10,
                                        color: P.textLight,
                                        marginLeft: 4,
                                    }}
                                >
                                    ({item.desc})
                                </span>
                            </div>

                            <div
                                style={{
                                    fontSize: 20,
                                    fontWeight: 800,
                                    color: P.textPrimary,
                                    fontFamily:
                                        "'DM Sans', sans-serif",
                                }}
                            >
                                {getParameterValue(item.key)}{" "}

                                <span
                                    style={{
                                        fontSize: 12,
                                        fontWeight: 500,
                                        color: P.textMuted,
                                    }}
                                >
                                    {item.unit}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* ================= FOOTER ================= */}

            <AdminDeviceFooter />
        </div>
        </PageBackground>
    );
}


const statCard = {
    background: P.surface,
    borderRadius: 14,
    padding: "14px 10px",
    textAlign: "center",
    boxShadow: P.shadowCard,
    border: `1px solid ${P.border}`,
};

const statIconWrap = {
    width: 36,
    height: 36,
    borderRadius: "50%",
    background: P.surfaceAmber,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "0 auto 8px",
};

const statSubLabel = {
    fontSize: 9,
    fontWeight: 700,
    color: P.textLight,
    letterSpacing: 0.5,
    fontFamily: "'Inter', sans-serif",
    marginBottom: 4,
    textTransform: "uppercase",
};

const statValue = {
    fontSize: 20,
    fontWeight: 800,
    color: P.textPrimary,
    fontFamily: "'DM Sans', sans-serif",
    lineHeight: 1.1,
};

const statUnit = {
    fontSize: 11,
    fontWeight: 500,
    color: P.textMuted,
    fontFamily: "'Inter', sans-serif",
    marginTop: 2,
};
