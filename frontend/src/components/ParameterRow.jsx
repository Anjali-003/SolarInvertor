export default function ParameterRow({
    label,
    value,
    unit = "",
    valueColor = null,
    last = false
}) {
    const displayValue =
        value === null ||
        value === undefined ||
        value === ""
            ? "--"
            : value;

    return (
        <div
            style={{
                minHeight:
                    42,

                display:
                    "grid",

                gridTemplateColumns:
                    "minmax(0, 1fr) minmax(90px, auto)",

                alignItems:
                    "center",

                gap:
                    16,

                padding:
                    "4px 10px",

                borderBottom:
                    last
                        ? "none"
                        : "2px solid rgba(255,255,255,0.75)",

                boxSizing:
                    "border-box"
            }}
        >
            <div
                style={{
                    fontSize:
                        14,

                    fontWeight:
                        500,

                    color:
                        "rgba(255,255,255,0.85)",

                    fontFamily:
                        "'Inter', sans-serif",

                    minWidth:
                        0
                }}
            >
                {label}
            </div>

            <div
                style={{
                    fontSize:
                        14,

                    fontWeight:
                        500,

                    color:
                        valueColor ||
                        "#ffffff",

                    textAlign:
                        "left",

                    fontFamily:
                        "'Inter', sans-serif",

                    whiteSpace:
                        "nowrap"
                }}
            >
                {displayValue}

                {unit &&
                    displayValue !== "--" && (
                        <>
                            {" "}

                            <span
                                style={{
                                    color:
                                        "rgba(255,255,255,0.6)"
                                }}
                            >
                                {unit}
                            </span>
                        </>
                    )}
            </div>
        </div>
    );
}