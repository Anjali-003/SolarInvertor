import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import VendorFooter from "../components/VendorFooter";
import P from "../theme/colors";

export default function VendorProfile() {

    const navigate = useNavigate();

    const vendorName  = localStorage.getItem("vendorName");
    const vendorEmail = localStorage.getItem("vendorEmail");
    const vendorPhone = localStorage.getItem("vendorPhone");

    const handleLogout = () => {
        localStorage.clear();
        navigate("/vendor-login");
    };

    const ProfileRow = ({ label, value }) => (
        <div style={{ marginBottom: 20 }}>
            <div
                style={{
                    fontSize: 14,
                    color: P.textMuted,
                    marginBottom: 6,
                    fontFamily: "'Source Sans Pro', sans-serif",
                }}
            >
                {label}
            </div>
            <div
                style={{
                    fontSize: 18,
                    fontWeight: 600,
                    color: P.textPrimary,
                    fontFamily: "'Source Sans Pro', sans-serif",
                    wordBreak: "break-all",
                }}
            >
                {value || "--"}
            </div>
        </div>
    );

    return (
        <div
            style={{
                minHeight: "100vh",
                paddingBottom: "90px",
                background: P.bg,
            }}
        >
            <Header />

            <div
                style={{
                    paddingTop: 12,
                    paddingLeft: 24,
                    paddingRight: 24,
                }}
            >
                <div
                    style={{
                        background: P.surface,
                        border: `1px solid ${P.border}`,
                        borderRadius: 18,
                        padding: "24px",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                    }}
                >
                    {/* TITLE */}
                    <div
                        style={{
                            fontSize: 24,
                            fontWeight: 700,
                            color: P.textPrimary,
                            marginBottom: 24,
                            fontFamily: "'Source Sans Pro', sans-serif",
                        }}
                    >
                        Vendor Profile
                    </div>

                    <ProfileRow label="Vendor Name"  value={vendorName}  />
                    <ProfileRow label="Email"        value={vendorEmail} />
                    <ProfileRow label="Phone Number" value={vendorPhone} />

                    {/* DIVIDER */}
                    <div
                        style={{
                            borderTop: `1px solid ${P.border}`,
                            marginBottom: 24,
                        }}
                    />

                    {/* DEVICE HUB BUTTON */}
                    <button
                        onClick={() => navigate("/devices")}
                        style={{
                            width: "100%",
                            padding: "14px",
                            background: `linear-gradient(135deg, ${P.amber}, ${P.orange})`,
                            border: "none",
                            borderRadius: 12,
                            color: P.surface,
                            fontSize: 16,
                            fontWeight: 700,
                            cursor: "pointer",
                            marginBottom: 12,
                            fontFamily: "'Source Sans Pro', sans-serif",
                        }}
                    >
                        Go to Device Hub
                    </button>

                    {/* LOGOUT BUTTON */}
                    <button
                        onClick={handleLogout}
                        style={{
                            width: "100%",
                            padding: "14px",
                            background: P.errorRed,
                            border: "none",
                            borderRadius: 12,
                            color: P.surface,
                            fontSize: 16,
                            fontWeight: 700,
                            cursor: "pointer",
                            fontFamily: "'Source Sans Pro', sans-serif",
                        }}
                    >
                        Logout
                    </button>
                </div>
            </div>

            <VendorFooter />
        </div>
    );
}