import P from "../theme/colors";
import DeviceMenu from "./DeviceMenu";
import RefreshButton from "./RefreshButton";


export default function PageHeader({
    title,
}) {

    return (

        <div
            style={{
                height: 64,
                width: "100%",
                boxSizing: "border-box",

                background: P.surface,

                display: "flex",
                alignItems: "center",

                padding: "0 12px",

                borderBottom:
                    "1px solid #ECECEC",

                boxShadow:
                    "0 2px 6px rgba(0,0,0,0.04)",

                position: "sticky",
                top: 0,
                zIndex: 100,
            }}
        >

            {/* =========================
                LOGO
            ========================= */}

            <img
                src="/src/assets/logo.png"
                alt="Company Logo"
                style={{
                    width: 95,
                    height: 85,

                    objectFit: "contain",

                    flexShrink: 0,

                    marginRight: 2
                }}
            />


            {/* =========================
                PAGE TITLE
            ========================= */}

            <div
                style={{
                    fontSize: 18,
                    fontWeight: 700,

                    color: P.textAmber,

                    letterSpacing: 2,

                    fontFamily:
                        "'DM Sans', sans-serif",

                    whiteSpace: "nowrap"
                }}
            >
                {title}
            </div>


            {/* =========================
                SPACER
            ========================= */}

            <div
                style={{
                    flex: 1
                }}
            />


            {/* =========================
                REFRESH
            ========================= */}

            <RefreshButton />


            {/* =========================
                DEVICE MENU
            ========================= */}

            <DeviceMenu />

        </div>
    );
}