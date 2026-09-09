import P from "../theme/colors";
import { sanitizeReading } from "../utils/sanitizeReading";

export default function GenerationSummary({
    energy,
    total
}) {

    const cards = [
        {
            label: "TODAY",
            value:
                sanitizeReading(energy?.today, "energyKWh"),
        },
        {
            label: "MONTH",
            value:
                sanitizeReading(energy?.monthly, "energyKWh"),
        },
        {
            label: "TOTAL",
            value:
                sanitizeReading(total, "energyKWh"),
        },
    ];


    return (
        <div
            style={{
                background:
                    "rgba(22, 38, 45, 0.88)",

                borderRadius: 14,

                padding:
                    "14px 18px 18px",

                marginBottom: 16,

                boxShadow:
                    P.shadowCard,
            }}
        >

            <div
                style={{
                    color: "#fff",

                    fontSize: 16,

                    marginBottom: 18,

                    fontFamily:
                        "'DM Sans', sans-serif",
                }}
            >
                GENERATION SUMMARY
            </div>


            <div
                style={{
                    display: "grid",

                    gridTemplateColumns:
                        "repeat(3, 1fr)",

                    gap: 10,

                    textAlign: "center",
                }}
            >

                {cards.map(
                    (item) => (

                        <div
                            key={
                                item.label
                            }
                        >

                            <div
                                style={{
                                    color:
                                        "#fff",

                                    fontSize:
                                        24,

                                    fontWeight:
                                        500,

                                    fontFamily:
                                        "'DM Sans', sans-serif",
                                }}
                            >
                                {item.value}
                            </div>


                            <div
                                style={{
                                    color:
                                        "#fff",

                                    fontSize:
                                        13,

                                    marginTop:
                                        2,
                                }}
                            >
                                kWh
                            </div>


                            <div
                                style={{
                                    color:
                                        "#fff",

                                    fontSize:
                                        15,

                                    marginTop:
                                        10,

                                    fontWeight:
                                        600,
                                }}
                            >
                                {item.label}
                            </div>

                        </div>

                    )
                )}

            </div>

        </div>
    );
}