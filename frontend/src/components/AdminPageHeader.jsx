import P from "../theme/colors";

export default function AdminPageHeader({ title }) {
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
        <div
            style={{
                flex: 1,
                textAlign: "center",
                fontSize: 18,
                fontWeight: 700,
                color: P.textAmber,
                letterSpacing: 2,
                fontFamily: "'DM Sans', sans-serif",
            }}
        >
            {title}
        </div>
    </div>
);
}