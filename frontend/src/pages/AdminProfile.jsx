import { useNavigate } from "react-router-dom";
import P from "../theme/colors";
import AdminPageHeader from "../components/AdminPageHeader";
import AdminPageLayout from "../components/AdminPageLayout";

export default function AdminProfile() {

    const navigate = useNavigate();

    const adminName  = localStorage.getItem("adminName");
    const adminEmail = localStorage.getItem("adminEmail");

    const handleLogout = () => {
        localStorage.removeItem("adminToken");
        localStorage.removeItem("adminName");
        localStorage.removeItem("adminEmail");
        navigate("/admin-login");
    };

    return (
        <>
        <AdminPageHeader title="PROFILE" />

        <AdminPageLayout>

<p className="page-subtitle">
    Your account details
</p>

            {/* AMBER BANNER + AVATAR */}
            <div style={{ position: "relative", marginBottom: 60 }}>
                <div
                    style={{
                        background: P.btnPrimary,
                        height: 120,
                        borderRadius: 16,
                    }}
                />
                <div
                    style={{
                        position: "absolute",
                        bottom: -50,
                        left: "50%",
                        transform: "translateX(-50%)",
                        width: 90,
                        height: 90,
                        borderRadius: "50%",
                        background: P.surfaceFaded,
                        border: `4px solid ${P.surface}`,
                        overflow: "hidden",
                        boxShadow: P.shadowCardRaised,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke={P.textAdminFaint} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="8" r="4" />
                        <path d="M4 21c1.5-4 5-6 8-6s6.5 2 8 6" />
                    </svg>
                </div>
            </div>

            {/* NAME */}
            <div
                style={{
                    textAlign: "center",
                    fontSize: 20,
                    fontWeight: 700,
                    color: P.textPrimary,
                    fontFamily: "'DM Sans', sans-serif",
                    marginBottom: 8,
                    paddingTop: 8,
                }}
            >
                {adminName || "Administrator"}
            </div>
            <div
                style={{
                    textAlign: "center",
                    fontSize: 13,
                    color: P.textSecond,
                    fontFamily: "'Inter', sans-serif",
                    marginBottom: 28,
                }}
            >
                System Administrator
            </div>

            {/* INFO CARD */}
            <div className="card" style={{ marginBottom: 20, padding: 0, overflow: "hidden" }}>

                {/* Email Row */}
                <div
                    style={{
                        padding: "16px 20px",
                        borderBottom: `1px solid ${P.borderAdmin}`,
                    }}
                >
                    <div
                        style={{
                            fontSize: 11,
                            color: P.textAmber,
                            fontWeight: 600,
                            fontFamily: "'Inter', sans-serif",
                            marginBottom: 4,
                            textTransform: "uppercase",
                            letterSpacing: 0.5,
                        }}
                    >
                        Email
                    </div>
                    <div
                        style={{
                            fontSize: 15,
                            fontWeight: 500,
                            color: P.textPrimary,
                            fontFamily: "'Inter', sans-serif",
                        }}
                    >
                        {adminEmail || "--"}
                    </div>
                </div>

                {/* Role Row */}
                <div style={{ padding: "16px 20px", borderBottom: `1px solid ${P.borderAdmin}`, }}>
                    <div
                        style={{
                            fontSize: 11,
                            color: P.textAmber,
                            fontWeight: 600,
                            fontFamily: "'Inter', sans-serif",
                            marginBottom: 4,
                            textTransform: "uppercase",
                            letterSpacing: 0.5,
                        }}
                    >
                        Role
                    </div>
                    <div
    style={{
        fontSize: 15,
        fontWeight: 500,
        color: P.textPrimary,
        fontFamily: "'Inter', sans-serif",
    }}
>
    Administrator
</div>
                </div>

            </div>

            {/* LOGOUT BUTTON */}
            <button
                onClick={handleLogout}
                style={{
                    width: "100%",
                    padding: "14px",
                    background: P.btnRed,
                    border: "none",
                    borderRadius: 50,
                    color: P.textWhite,
                    fontSize: 15,
                    fontWeight: 700,
                    fontFamily: "'DM Sans', sans-serif",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 8,
                    boxShadow: P.shadowBtnRed,
                }}
            >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                    <polyline points="16 17 21 12 16 7" />
                    <line x1="21" y1="12" x2="9" y2="12" />
                </svg>
                Logout
            </button>
        </AdminPageLayout>
        </>
    );
}