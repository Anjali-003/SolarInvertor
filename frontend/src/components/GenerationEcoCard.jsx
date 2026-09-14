import P from "../theme/colors";

import {
    calculateEcoImpact,
    formatCO2Tonnes,
    formatTreeCount
} from "../utils/ecoImpact";


function FactoryIcon({
    size = 80,
    color = "#ffffff"
}) {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 800 800"
            xmlns="http://www.w3.org/2000/svg"
            style={{
                display: "block"
            }}
        >
            <g fill={color}>

                {/* =========================================
                    LEFT CHIMNEY
                ========================================= */}
                <path
                    d="
                        M90 220
                        H180
                        L195 650
                        H75
                        Z
                    "
                />

                {/* CHIMNEY TOP */}
                <rect
                    x="82"
                    y="185"
                    width="106"
                    height="45"
                    rx="8"
                />


                {/* =========================================
                    FACTORY BUILDING
                ========================================= */}
                <path
                    d="
                        M150 650
                        V410

                        L300 315
                        V410

                        L445 315
                        V410

                        L590 315
                        V650

                        Z
                    "
                />


                {/* =========================================
                    RIGHT BUILDING SECTION
                ========================================= */}
                <rect
                    x="585"
                    y="400"
                    width="140"
                    height="250"
                />


                {/* =========================================
                    WINDOWS
                    Cut-out effect using background-colored
                    rectangles. Change fill if your card
                    background is different.
                ========================================= */}

                <rect
                    x="220"
                    y="505"
                    width="55"
                    height="70"
                    rx="4"
                    fill="#16262d"
                />

                <rect
                    x="325"
                    y="505"
                    width="55"
                    height="70"
                    rx="4"
                    fill="#16262d"
                />

                <rect
                    x="430"
                    y="505"
                    width="55"
                    height="70"
                    rx="4"
                    fill="#16262d"
                />

                <rect
                    x="610"
                    y="485"
                    width="40"
                    height="55"
                    rx="3"
                    fill="#16262d"
                />

                <rect
                    x="665"
                    y="485"
                    width="40"
                    height="55"
                    rx="3"
                    fill="#16262d"
                />


                {/* =========================================
                    BASE / GROUND
                ========================================= */}
                <rect
                    x="20"
                    y="645"
                    width="760"
                    height="70"
                    rx="20"
                />

            </g>
        </svg>
    );
}



function TreeIcon({
    size = 80,
    color = "#ffffff"
}) {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 800 800"
            xmlns="http://www.w3.org/2000/svg"
            style={{
                display: "block",
                color
            }}
        >
            <g fill="currentColor">

                {/* =================================================
                    TREE CROWN
                ================================================= */}

                {/* TOP */}
                <circle
                    cx="400"
                    cy="155"
                    r="155"
                />

                {/* LEFT */}
                <circle
                    cx="242"
                    cy="260"
                    r="155"
                />

                {/* RIGHT */}
                <circle
                    cx="558"
                    cy="260"
                    r="155"
                />

                {/* LOWER LEFT */}
                <circle
                    cx="270"
                    cy="415"
                    r="158"
                />

                {/* LOWER RIGHT */}
                <circle
                    cx="530"
                    cy="415"
                    r="158"
                />


                {/* =================================================
                    CENTER FILL
                    Removes any gaps between crown circles
                ================================================= */}

                <rect
                    x="220"
                    y="130"
                    width="360"
                    height="310"
                />


                {/* =================================================
                    TREE TRUNK
                ================================================= */}

                <path
                    d="
                        M 322 620

                        C 350 612,
                          378 597,
                          400 581

                        C 422 597,
                          450 612,
                          478 620

                        L 478 655

                        C 478 692,
                          489 721,
                          516 750

                        L 284 750

                        C 311 721,
                          322 692,
                          322 655

                        Z
                    "
                />


                {/* =================================================
                    BASE / GROUND
                ================================================= */}

                <rect
                    x="0"
                    y="748"
                    width="800"
                    height="52"
                    rx="26"
                />

            </g>
        </svg>
    );
}

export default function GenerationEcoCard({
    totalGenerationKWh
}) {

    // =====================================================
    // ECO CALCULATION
    // =====================================================

    const {
        co2SavedKg,
        treesPlanted
    } =
        calculateEcoImpact(
            totalGenerationKWh
        );


    const co2Display =
        formatCO2Tonnes(
            co2SavedKg
        );


    const treeDisplay =
        formatTreeCount(
            treesPlanted
        );


    // =====================================================
    // CARD STYLE
    // =====================================================

    const cardStyle = {

        width:
            "100%",

        boxSizing:
            "border-box",

        background:
            "rgba(22, 38, 45, 0.88)",

        border:
            "1px solid rgba(255,255,255,0.08)",

        borderRadius:
            14,

        padding:
            "14px 18px 16px",

        marginBottom:
            16,

        boxShadow:
            P.shadowCard,

        display:
            "grid",

        gridTemplateColumns:
            "1fr 1fr",

        gap:
            20,

        fontFamily:
            "'Inter', sans-serif"
    };


    return (

        <div
            style={
                cardStyle
            }
        >

            {/* =================================================
                CO2 SAVED
            ================================================= */}

            <div
                style={{
                    display:
                        "flex",

                    flexDirection:
                        "column",

                    alignItems:
                        "center",

                    justifyContent:
                        "center",

                    textAlign:
                        "center",

                    minWidth:
                        0
                }}
            >

                <div
                    style={{
                        fontSize:
                            18,

                        fontWeight:
                            500,

                        color:
                            "#ffffff",

                        marginBottom:
                            8,

                        fontFamily:
                            "'DM Sans', sans-serif"
                    }}
                >
                    CO
                    <sub
                        style={{
                            fontSize:
                                11
                        }}
                    >
                        2
                    </sub>
                    {" "}
                    Saved
                </div>


                {/* FACTORY ICON */}
<FactoryIcon
    size={78}
    color="#ffffff"
/>
                {/* <svg
                    width="58"
                    height="58"
                    viewBox="0 0 64 64"
                    fill="none"
                    stroke="#ffffff"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >

                    <path
                        d="M8 54V31l15 8V28l15 9V18h7v36"
                    />

                    <path
                        d="M45 24h9l4 30H8"
                    />

                    <path
                        d="M15 45h5"
                    />

                    <path
                        d="M27 45h5"
                    />

                    <path
                        d="M39 45h5"
                    />

                </svg> */}


                <div
                    style={{
                        marginTop:
                            8,

                        fontSize:
                            18,

                        fontWeight:
                            700,

                        color:
                            "#ffffff",

                        fontFamily:
                            "'DM Sans', sans-serif"
                    }}
                >

                    {
                        co2Display
                    }

                    {
                        co2Display !== "--" && (

                            <span
                                style={{
                                    marginLeft:
                                        4,

                                    fontSize:
                                        12,

                                    fontWeight:
                                        500,

                                    color:
                                        "rgba(255,255,255,0.65)"
                                }}
                            >
                                t
                            </span>
                        )
                    }

                </div>

            </div>


            {/* =================================================
                TREES PLANTED
            ================================================= */}

            <div
                style={{
                    display:
                        "flex",

                    flexDirection:
                        "column",

                    alignItems:
                        "center",

                    justifyContent:
                        "center",

                    textAlign:
                        "center",

                    minWidth:
                        0
                }}
            >

                <div
                    style={{
                        fontSize:
                            18,

                        fontWeight:
                            500,

                        color:
                            "#ffffff",

                        marginBottom:
                            8,

                        fontFamily:
                            "'DM Sans', sans-serif"
                    }}
                >
                    Trees Planted
                </div>


                {/* TREE ICON */}
{/* 
                <svg
                    width="58"
                    height="58"
                    viewBox="0 0 64 64"
                    fill="none"
                    stroke="#ffffff"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
                

                    <path
                        d="M32 55V35"
                    />

                    <path
                        d="M24 43l8-8 8 8"
                    />

                    <path
                        d="
                            M18 35
                            c-6-1-8-9-3-13
                            c0-8 10-12 16-7
                            c5-7 17-4 18 5
                            c7 1 9 10 3 14
                            c-2 7-12 8-17 3
                            c-5 5-13 4-17-2z
                        "
                    />

                </svg> */}
                <TreeIcon
    size={75}
    color="#ffffff"
/>


                <div
                    style={{
                        marginTop:
                            8,

                        fontSize:
                            18,

                        fontWeight:
                            700,

                        color:
                            "#ffffff",

                        fontFamily:
                            "'DM Sans', sans-serif"
                    }}
                >
                    {
                        treeDisplay
                    }
                </div>

            </div>

        </div>
    );
}