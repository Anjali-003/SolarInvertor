import { useNavigate } from "react-router-dom";
import P from "../theme/colors";
import backgroundImage from "../assets/selectOptionBg.jpg";

// =====================================================
// SELECT OPTION
//
// Landing / entry screen shown after login.
//
// NOTE:
// This is wired up as its own standalone route
// (/select-option) for now, for preview purposes.
//
// Once approved, this should replace the user
// login destination (i.e. become the page the
// user lands on after authenticating), instead
// of a separate route.
// =====================================================

export default function SelectOption() {
    const navigate = useNavigate();

    return (
        <div
            style={{
                minHeight: "100vh",
                width: "100%",
                background: P.pageSide,
            }}
        >
            {/* PHONE-SIZED VISUAL AREA — same pattern as PageBackground */}
            <div
                style={{
                    width: "100%",
                    maxWidth: 520,
                    minHeight: "100vh",
                    margin: "0 auto",
                    position: "relative",
                    overflow: "clip",
                }}
            >
                {/* FIXED BACKGROUND IMAGE */}
                <div
                    style={{
                        position: "fixed",
                        top: 0,
                        bottom: 0,
                        left: "50%",
                        transform: "translateX(-50%)",
                        width: "100%",
                        maxWidth: 520,

                        backgroundImage: `url("${backgroundImage}")`,
                        backgroundSize: "cover",
                        backgroundPosition: "center top",
                        backgroundRepeat: "no-repeat",

                        zIndex: 0,
                        pointerEvents: "none",
                    }}
                />

                {/* PAGE CONTENT */}
                <div
                    style={{
                        position: "relative",
                        zIndex: 1,
                        minHeight: "100vh",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        padding: "0 32px",
                        boxSizing: "border-box",
                        fontFamily: "'Inter', sans-serif",
                    }}
                >
                    <h1
                        style={{
                            fontSize: 26,
                            fontWeight: 800,
                            color: P.textPrimary,
                            fontFamily: "'DM Sans', sans-serif",
                            letterSpacing: 0.2,
                            margin: "0 0 28px 0",
                            textAlign: "center",
                        }}
                    >
                        Select Option
                    </h1>

                    <div
                        style={{
                            width: "100%",
                            display: "flex",
                            flexDirection: "column",
                            gap: 16,
                        }}
                    >
                        <OptionButton
                            label="Setup Device"
                        />

                        <OptionButton
                            label="Add Device"
                            onClick={() => navigate("/add-device")}
                        />

                        <OptionButton
                            label="My Devices"
                            onClick={() => navigate("/saved-devices")}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

// ── Shared option button ───────────────────────────────
function OptionButton({ label, onClick }) {
    return (
        <button
            onClick={onClick}
            style={{
                width: "100%",
                padding: "18px 20px",
                border: "none",
                borderRadius: 12,
                background:
                    "linear-gradient(180deg, #2F8FD1 0%, #1F6FB5 100%)",
                color: P.textWhite,
                fontSize: 15,
                fontWeight: 700,
                letterSpacing: 1.2,
                textTransform: "uppercase",
                fontFamily: "'DM Sans', sans-serif",
                cursor: "pointer",
                boxShadow:
                    "0 4px 10px rgba(20,60,100,0.35), inset 0 1px 0 rgba(255,255,255,0.25)",
            }}
        >
            {label}
        </button>
    );
}
