import { useInverter } from "../context/Context";
import Footer from "../components/Footer";
import { parseKeyword } from "../utils/parseKeyword";
import PageHeader from "../components/PageHeader";
import P from "../theme/colors";

export default function Home() {
    const { data, lastUpdated } = useInverter();
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

    const getParameterValue = (parameter) => {
        const entry = Object.entries(data || {}).find(([key]) => {
            if (!key.includes("-")) return false;
            return parseKeyword(key).parameter === parameter;
        });
        return entry ? entry[1] : "--";
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
        <div style={{ minHeight: "100vh", paddingBottom: "90px", background: P.bg, fontFamily: "'Inter', sans-serif" }}>

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

    {/* Online Badge (EXACTLY SAME AS POWER PAGE) */}
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

    {/* Device Details */}
    <div
        style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            gap: 24,
        }}
    >

        {/* Serial Number */}
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

        {/* Last Updated */}
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

</div>

            {/* PAGE CONTENT */}
            <div style={{ padding: "0 20px 20px" }}>

                <h2 style={{ fontSize: 15, fontWeight: 800, color: P.textAmber, marginBottom: 12, marginTop: 4, letterSpacing: 0.5, fontFamily: "'DM Sans', sans-serif" }}>
                    SOLAR PANEL DETAILS
                </h2>

                <div style={{ background: P.textAmberBright, border: `1.5px solid ${P.borderDark}`, borderRadius: 16, padding: "16px", marginBottom: 20, boxShadow: P.shadowCardRaised, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>

                    <div style={metricCard}>
                        <div style={metricIconRow}>
                            <span style={metricIcon}>⚡</span>
                            <span style={metricValue}>{getParameterValue("DCV1")} <span style={metricUnit}>V</span></span>
                        </div>
                        <div style={metricLabel}>DC Voltage</div>
                        <div style={metricDesc}>Input Voltage</div>
                    </div>

                    <div style={metricCard}>
                        <div style={metricIconRow}>
                            <span style={metricIcon}>⚡</span>
                            <span style={metricValue}>{getParameterValue("DCI1")} <span style={metricUnit}>A</span></span>
                        </div>
                        <div style={metricLabel}>DC Current</div>
                        <div style={metricDesc}>Input current</div>
                    </div>

                    <div style={{ ...metricCard, gridColumn: "1 / -1", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        <div>
                            <div style={metricIconRow}><span style={metricIcon}>🔲</span></div>
                            <div style={metricLabel}>DC Power</div>
                            <div style={metricDesc}>Total output</div>
                        </div>
                        <div style={{ fontSize: 22, fontWeight: 800, color: P.textPrimary, fontFamily: "'DM Sans', sans-serif" }}>
                            {getParameterValue("DCKW1")} <span style={{ fontSize: 14, fontWeight: 600, color: P.textMuted }}>kW</span>
                        </div>
                    </div>
                </div>

                <h2 style={{ fontSize: 15, fontWeight: 800, color: P.textAmber, marginBottom: 12, marginTop: 4, letterSpacing: 0.5, fontFamily: "'DM Sans', sans-serif" }}>
                    INVERTER DETAILS
                </h2>

                <div style={{ background: P.textAmberBright, border: `1.5px solid ${P.borderDark}`, borderRadius: 16, padding: "16px", marginBottom: 12, boxShadow: P.shadowCardRaised, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                    <div style={metricCard}>
                        <div style={{ fontSize: 12, color: P.textAmberBright, fontWeight: 600, marginBottom: 4, fontFamily: "'Inter', sans-serif" }}>🌡 Temp</div>
                        <div style={{ fontSize: 22, fontWeight: 800, color: P.textPrimary, fontFamily: "'DM Sans', sans-serif" }}>
                            {getParameterValue("TEMP")} <span style={{ fontSize: 14, color: P.textMuted, fontWeight: 500 }}>°C</span>
                        </div>
                    </div>
                    <div style={metricCard}>
                        <div style={{ fontSize: 12, color: P.textAmberBright, fontWeight: 600, marginBottom: 4, fontFamily: "'Inter', sans-serif" }}>≋ Freq</div>
                        <div style={{ fontSize: 22, fontWeight: 800, color: P.textPrimary, fontFamily: "'DM Sans', sans-serif" }}>
                            {getParameterValue("FREQ")} <span style={{ fontSize: 14, color: P.textMuted, fontWeight: 500 }}>Hz</span>
                        </div>
                    </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 20 }}>
                    {[
                        { key: "VN",   label: "AC Voltage",     desc: "VN",   unit: "V"    },
                        { key: "I",    label: "AC Current",     desc: "I",    unit: "A"    },
                        { key: "POW",  label: "Active Power",   desc: "POW",  unit: "kW"   },
                        { key: "PF",   label: "Power Factor",   desc: "PF",   unit: ""     },
                        { key: "APOW", label: "Apparent Power", desc: "POW",  unit: "kVA"  },
                        { key: "RPOW", label: "Reactive Power", desc: "RPOW", unit: "kVAr" },
                    ].map((item) => (
                        <div key={item.key} style={{ ...metricCard, background: P.surface, border: "1px solid ${P.border}", boxShadow: P.shadowCard}}>
                            <div style={{ fontSize: 12, color: P.textAmberBright, fontWeight: 600, marginBottom: 6, fontFamily: "'Inter', sans-serif" }}>
                                ⚡ {item.label}
                                <span style={{ fontSize: 10, color: P.textLight, marginLeft: 4 }}>({item.desc})</span>
                            </div>
                            <div style={{ fontSize: 20, fontWeight: 800, color: P.textPrimary, fontFamily: "'DM Sans', sans-serif" }}>
                                {getParameterValue(item.key)}{" "}
                                <span style={{ fontSize: 12, fontWeight: 500, color: P.textMuted }}>{item.unit}</span>
                            </div>
                        </div>
                    ))}
                </div>

            </div>

            <Footer />

        </div>
    );
}
