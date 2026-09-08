import P from "../theme/colors";

function formatCUF(value) {

    const number =
        Number(value);

    if (
        !Number.isFinite(
            number
        )
    ) {
        return "-";
    }

    return number.toFixed(2);
}


export default function CUFSummary({
    cuf
}) {

    const items = [
        {
            label: "TODAY",
            value:
                cuf?.today,
        },
        {
            label: "MONTH",
            value:
                cuf?.monthly,
        },
        {
            label: "YEAR",
            value:
                cuf?.yearly,
        },
    ];


    return (
        <div
            style={{
                background:
                    "rgba(22, 38, 45, 0.82)",

                borderRadius:
                    14,

                padding:
                    "14px 18px 18px",

                marginBottom:
                    16,

                boxShadow:
                    P.shadowCard,
            }}
        >

            <div
                style={{
                    color:
                        "#fff",

                    fontSize:
                        16,

                    marginBottom:
                        18,

                    fontFamily:
                        "'DM Sans', sans-serif",
                }}
            >
                CUF SUMMARY
            </div>


            <div
                style={{
                    display:
                        "grid",

                    gridTemplateColumns:
                        "repeat(3, 1fr)",

                    textAlign:
                        "center",

                    gap:
                        10,
                }}
            >

                {items.map(
                    item => (

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
                                }}
                            >
                                {formatCUF(
                                    item.value
                                )}
                            </div>


                            <div
                                style={{
                                    color:
                                        "#fff",

                                    fontSize:
                                        14,

                                    marginTop:
                                        2,
                                }}
                            >
                                %
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