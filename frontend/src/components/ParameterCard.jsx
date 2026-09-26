export default function ParameterCard({
    title,
    children
}) {
    return (
        <div
            style={{
                background:
                    "rgba(22, 38, 45, 0.88)",

                border:
                    "1px solid rgba(255,255,255,0.08)",

                borderRadius:
                    14,

                padding:
                    "14px 12px 6px",

                boxShadow:
                    "0 8px 24px rgba(0,0,0,0.18)",

                marginBottom:
                    20
            }}
        >
            <div
                style={{
                    fontSize:
                        18,

                    fontWeight:
                        700,

                    color:
                        "#ffffff",

                    padding:
                        "0 0 8px 0",

                    fontFamily:
                        "'DM Sans', sans-serif"
                }}
            >
                {title}
            </div>

            {children}
        </div>
    );
}