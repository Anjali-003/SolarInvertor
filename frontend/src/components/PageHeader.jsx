import { useNavigate } from "react-router-dom";
import P from "../theme/colors";

export default function PageHeader({
    title,
    backPath,
}) {

    const navigate = useNavigate();

    return (
        <div
            style={{
                height: 64,
                background: P.surface,
                display: "flex",
                alignItems: "center",
                padding: "0 18px",
                borderBottom: "1px solid #ECECEC",
                boxShadow: "0 2px 6px rgba(0,0,0,0.04)",
                position: "sticky",
                top: 0,
                zIndex: 100,
            }}
        >
            <button
                onClick={() => navigate(backPath)}
                style={{
                    border: "none",
                    background: "transparent",
                    fontSize: 24,
                    color: P.textAmber,
                    cursor: "pointer",
                    padding: 0,
                    width: 32,
                }}
            >
                ←
            </button>

            <div
                style={{
                    flex: 1,
                    textAlign: "center",
                    fontSize: 18,
                    fontWeight: 700,
                    color: P.textAmber,
                    letterSpacing: 2,
                    fontFamily: "'DM Sans', sans-serif",
                    marginRight: 32,
                }}
            >
                {title}
            </div>
        </div>
    );
}