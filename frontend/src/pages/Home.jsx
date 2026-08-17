import { useInverter } from "../context/Context";
import Footer from "../components/Footer";
import { parseKeyword } from "../utils/parseKeyword";
import PageHeader from "../components/PageHeader";
import P from "../theme/colors";
import DeviceInfo from "../components/DeviceInfo";
import PageBackground from "../components/PageBackground";
export default function Home() {
    // const { data, lastUpdated } = useInverter();
    const { data, lastUpdated, energy } = useInverter();
    console.log(lastUpdated);

   const formattedDateTime = (() => {
    if (!lastUpdated) return { date: "--", time: "--" };

    const d = new Date(lastUpdated);

    return {
        date: d.toLocaleDateString("en-GB", {
            day: "numeric",
            month: "short",
            year: "numeric",
        }),
        time: d.toLocaleTimeString("en-US", {
            hour: "numeric",
            minute: "2-digit",
            hour12: true,
        }),
    };
})();

// OLD PARSER

    // const getParameterValue = (parameter) => {
    //     const entry = Object.entries(data || {}).find(([key]) => {
    //         if (!key.includes("-")) return false;
    //         return parseKeyword(key).parameter === parameter;
    //     });
    //     return entry ? entry[1] : "--";
    // };

    const getParameterValue = (parameter) => {
    return data?.[parameter] ?? "--";
};

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

    const daysInMonth = new Date(
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

    return (isLeapYear ? 366 : 365) * 24;
};


const calculateCUF = (generatedEnergy, totalHours) => {

    const capacity = getPlantCapacity();

    const energyValue = Number(generatedEnergy);

    if (
        capacity === null ||
        !Number.isFinite(energyValue) ||
        energyValue < 0 ||
        totalHours <= 0
    ) {
        return null;
    }

    const cuf =
        (energyValue /
            (capacity * totalHours)) *
        100;

    return cuf;
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

    if (value === null || !Number.isFinite(value)) {
        return "--";
    }

    return `${value.toFixed(2)}%`;
};

const getDCPower = () => { 
    const voltage = Number(data?.DCV1); 
    const current = Number(data?.DCI1); 
    if (!Number.isFinite(voltage) || !Number.isFinite(current)) { 
        return "--"; } // DCV1 (V) × DCI1 (A) = Watts // Convert Watts → kW 
        return (voltage * current / 1000).toFixed(3); 
        };

    const metricCard = {
        background: P.surfaceWarm,
        border: `1px solid ${P.borderAmber}`,
        borderRadius: 12,
        padding: "12px 14px",
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

    return (
        <PageBackground>
        <div
    style={{
        minHeight: "100vh",
        paddingBottom: "90px",
        fontFamily: "'Inter', sans-serif",
    }}
>

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

            {/* ================= DEVICE INFO CARD ================= */}
{/* 
<div
    style={{
        margin: "20px 20px 16px",
        background: P.surface,
        borderRadius: 16,
        padding: "16px 18px",
        border: `1px solid ${P.border}`,
        boxShadow: P.shadowCard,
    }}
>

    <div
        style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            background: P.surfaceGreen,
            border: `1px solid ${P.borderGreen}`,
            borderRadius: 20,
            padding: "4px 10px",
            flexShrink: 0,
            marginBottom: 16,
        }}
    >
        <div
            style={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                background: P.green,
                boxShadow: `0 0 6px ${P.green}`,
            }}
        />

        <span
            style={{
                fontSize: 12,
                fontWeight: 700,
                color: P.textGreen,
                fontFamily: "'DM Sans', sans-serif",
            }}
        >
            Online
        </span>
    </div>

    <div
        style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            gap: 24,
        }}
    >

        <div style={{ flex: 1 }}>
            <div
                style={{
                    fontSize: 10,
                    color: P.textLight,
                    fontWeight: 500,
                    letterSpacing: 0.8,
                    marginBottom: 2,
                    fontFamily: "'Inter', sans-serif",
                }}
            >
                SERIAL NUMBER
            </div>

            <div
                style={{
                    fontSize: 20,
                    fontWeight: 700,
                    color: P.textPrimary,
                    fontFamily: "'DM Sans', sans-serif",
                }}
            >
                {Object.keys(data || {}).find(k => k.startsWith("ASN_"))
                    ? data[Object.keys(data).find(k => k.startsWith("ASN_"))]
                    : "--"}
            </div>
        </div>

<div
    style={{
        textAlign: "right",
    }}
>
    <div
        style={{
            fontSize: 10,
            color: P.textLight,
            fontWeight: 500,
            letterSpacing: 0.8,
            marginBottom: 6,
            fontFamily: "'Inter', sans-serif",
        }}
    >
        LAST UPDATED
    </div>

    <div
        style={{
            fontSize: 15,
            fontWeight: 700,
            color: P.textPrimary,
            fontFamily: "'DM Sans', sans-serif",
            lineHeight: 1.2,
        }}
    >
        {formattedDateTime.date}
    </div>

    {formattedDateTime.time && (
        <div
            style={{
                marginTop: 3,
                fontSize: 12,
                fontWeight: 700,
                color: P.textPrimary,
                fontFamily: "'Inter', sans-serif",
                lineHeight: 1.2,
            }}
        >
        {formattedDateTime.time}
        </div>
    )}
</div>
    </div>

</div> */}

<div
    style={{
        width: "100%",
        maxWidth: 520,
        margin: "0 auto",
        boxSizing: "border-box",
    }}
>

<DeviceInfo
    data={data}
    lastUpdated={lastUpdated}
/>
            {/* PAGE CONTENT */}
            <div style={{ padding: "0 20px 20px", boxSizing: "border-box", }}>

                <h2 style={{ fontSize: 15, fontWeight: 800, color: P.textWhite, marginBottom: 12, marginTop: 4, letterSpacing: 0.5, fontFamily: "'DM Sans', sans-serif" }}>
                    INVERTER DETAILS
                </h2>

                <div style={{ background: P.borderCardDark, border: `1.5px solid ${P.borderCardDark}`, borderRadius: 16, padding: "5px", marginBottom: 20, boxShadow: P.shadowCardRaised, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 5 }}>

                    <div style={metricCard}>
                        <div style={metricIconRow}>
                            <svg
                                width="18"
                                height="18"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
                            </svg>
                            <span style={metricValue}>{getParameterValue("DCV1")} <span style={metricUnit}>V</span></span>
                        </div>
                        <div style={metricLabel}>DC Voltage</div>
                        <div style={metricDesc}>Input Voltage</div>
                    </div>

                    <div style={metricCard}>
                        <div style={metricIconRow}>
                            <svg
                                width="18"
                                height="18"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
                            </svg>
                            <span style={metricValue}>{getParameterValue("DCI1")} <span style={metricUnit}>A</span></span>
                        </div>
                        <div style={metricLabel}>DC Current</div>
                        <div style={metricDesc}>Input current</div>
                    </div>
{/* 
                    <div style={{ ...metricCard, gridColumn: "1 / -1", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        <div>
                            <div style={metricIconRow}><span style={metricIcon}>🔲</span></div>
                            <div style={metricLabel}>DC Power</div>
                            <div style={metricDesc}>Total output</div>
                        </div>
                        <div style={{ fontSize: 22, fontWeight: 800, color: P.textPrimary, fontFamily: "'DM Sans', sans-serif" }}>
                            {getParameterValue("DCKW1")} <span style={{ fontSize: 14, fontWeight: 600, color: P.textMuted }}>kW</span>
                        </div>
                    </div> */}

                                                {/* I*V = Power */}

<div style={{ ...metricCard, gridColumn: "1 / -1", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
    <div>
        <div style={metricIconRow}>
            <svg
                                width="18"
                                height="18"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
                            </svg>
        </div>
        <div style={metricLabel}>DC Power</div>
        <div style={metricDesc}>DC Voltage × DC Current</div>
    </div>

    <div
        style={{
            fontSize: 22,
            fontWeight: 800,
            color: P.textPrimary,
            fontFamily: "'DM Sans', sans-serif",
        }}
    >
        {getDCPower()}{" "}
        <span
            style={{
                fontSize: 14,
                fontWeight: 600,
                color: P.textMuted,
            }}
        >
            kW
        </span>
    </div>
</div>




                </div>
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
                color: P.textAmberBright
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
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={P.borderStrong} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="12" cy="12" r="5" /><line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" /><line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" /><line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" /><line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
                            </svg>
        </div>

        <div style={statSubLabel}>
            MONTH
        </div>

        <div
            style={{
                ...statValue,
                color: P.textAmberBright
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
                color: P.textAmberBright
            }}
        >
            {formatCUF(getYearlyCUF())}
        </div>

        <div style={statUnit}>
            CUF
        </div>

    </div>

</div>

                <h2 style={{ fontSize: 15, fontWeight: 800, color: P.textWhite, marginBottom: 12, marginTop: 4, letterSpacing: 0.5, fontFamily: "'DM Sans', sans-serif" }}>
                    AC PARAMETER DETAILS
                </h2>

                <div style={{ background: P.borderCardDark, border: `1.5px solid ${P.borderCardDark}`, borderRadius: 16, padding: "5px", marginBottom: 12, boxShadow: P.shadowCardRaised, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 5 }}>
                    <div style={metricCard}>
                        <div style={{ fontSize: 12, color: P.textAmberBright, fontWeight: 600, marginBottom: 4, fontFamily: "'Inter', sans-serif" }}>🌡 Temp</div>
                        <div style={{ fontSize: 22, fontWeight: 800, color: P.textPrimary, fontFamily: "'DM Sans', sans-serif" }}>
                            {getParameterValue("TEMP")} <span style={{ fontSize: 14, color: P.textMuted, fontWeight: 500 }}>°C</span>
                        </div>
                    </div>
                    <div style={metricCard}>
                        <div style={{ fontSize: 12, color: P.textAmberBright, fontWeight: 600, marginBottom: 4, fontFamily: "'Inter', sans-serif" }}>≋ Freq</div>
                        <div style={{ fontSize: 22, fontWeight: 800, color: P.textPrimary, fontFamily: "'DM Sans', sans-serif" }}>
                            {getParameterValue("GFREQ")} <span style={{ fontSize: 14, color: P.textMuted, fontWeight: 500 }}>Hz</span>
                        </div>
                    </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 20 }}>
                    {[
                        { key: "VN",   label: "AC Voltage",     desc: "VN",   unit: "V"    },
                        { key: "DCI1",    label: "AC Current",     desc: "I",    unit: "A"    },
                        { key: "POW",  label: "Export Power",   desc: "POW",  unit: "kW"   },
                        { key: "PF",   label: "Power Factor",   desc: "PF",   unit: ""     },
                        // { key: "GFREQ", label: "Grid Frequency", desc: "GFREQ", unit: "Hz" },

                        // { key: "APOW", label: "Apparent Power", desc: "POW",  unit: "kVA"  },
                        // { key: "RPOW", label: "Reactive Power", desc: "RPOW", unit: "kVAr" },
                    ].map((item) => (
                        <div key={item.key} style={{ ...metricCard, background: P.surface, border: `1px solid ${P.border}`, boxShadow: P.shadowCard}}>
                            <div style={{ fontSize: 12, color: P.textAmberBright, fontWeight: 600, marginBottom: 6, fontFamily: "'Inter', sans-serif" }}>
                                        <svg
                                            width="12"
                                            height="12"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        >
                                            <path d="M13 2L4 14h6l-1 8 9-12h-6l1-8z" />
                                        </svg>
                                    
{" "}
{item.label}
                                {/* <span style={{ fontSize: 10, color: P.textLight, marginLeft: 4 }}>({item.desc})</span> */}
                            </div>
                            <div style={{ fontSize: 20, fontWeight: 800, color: P.textPrimary, fontFamily: "'DM Sans', sans-serif" }}>
                                {getParameterValue(item.key)}{" "}
                                <span style={{ fontSize: 12, fontWeight: 500, color: P.textMuted }}>{item.unit}</span>
                            </div>
                        </div>
                    ))}
                </div>

            </div>
            </div>
            <Footer />

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