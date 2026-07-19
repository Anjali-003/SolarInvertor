// import { useNavigate } from "react-router-dom";
// import VendorFooter from "../components/VendorFooter";
// import P from "../theme/colors";

// export default function VendorProfile() {

//     const navigate = useNavigate();

//     const vendorName  = localStorage.getItem("vendorName");
//     const vendorEmail = localStorage.getItem("vendorEmail");
//     const vendorPhone = localStorage.getItem("vendorPhone");

//     const handleLogout = () => {
//         localStorage.clear();
//         navigate("/vendor-login");
//     };

//     const ProfileRow = ({ label, value }) => (
//         <div style={{ marginBottom: 20 }}>
//             <div
//                 style={{
//                     fontSize: 14,
//                     color: P.textMuted,
//                     marginBottom: 6,
//                     fontFamily: "'Source Sans Pro', sans-serif",
//                 }}
//             >
//                 {label}
//             </div>
//             <div
//                 style={{
//                     fontSize: 18,
//                     fontWeight: 600,
//                     color: P.textPrimary,
//                     fontFamily: "'Source Sans Pro', sans-serif",
//                     wordBreak: "break-all",
//                 }}
//             >
//                 {value || "--"}
//             </div>
//         </div>
//     );

//     return (
//         <div
//             style={{
//                 minHeight: "100vh",
//                 paddingBottom: "90px",
//                 background: P.bg,
//             }}
//         >
//             <Header />

//             <div
//                 style={{
//                     paddingTop: 12,
//                     paddingLeft: 24,
//                     paddingRight: 24,
//                 }}
//             >
//                 <div
//                     style={{
//                         background: P.surface,
//                         border: `1px solid ${P.border}`,
//                         borderRadius: 18,
//                         padding: "24px",
//                         boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
//                     }}
//                 >
//                     {/* TITLE */}
//                     <div
//                         style={{
//                             fontSize: 24,
//                             fontWeight: 700,
//                             color: P.textPrimary,
//                             marginBottom: 24,
//                             fontFamily: "'Source Sans Pro', sans-serif",
//                         }}
//                     >
//                         Vendor Profile
//                     </div>

//                     <ProfileRow label="Vendor Name"  value={vendorName}  />
//                     <ProfileRow label="Email"        value={vendorEmail} />
//                     <ProfileRow label="Phone Number" value={vendorPhone} />

//                     {/* DIVIDER */}
//                     <div
//                         style={{
//                             borderTop: `1px solid ${P.border}`,
//                             marginBottom: 24,
//                         }}
//                     />

//                     {/* DEVICE HUB BUTTON */}
//                     <button
//                         onClick={() => navigate("/devices")}
//                         style={{
//                             width: "100%",
//                             padding: "14px",
//                             background: `linear-gradient(135deg, ${P.amber}, ${P.orange})`,
//                             border: "none",
//                             borderRadius: 12,
//                             color: P.surface,
//                             fontSize: 16,
//                             fontWeight: 700,
//                             cursor: "pointer",
//                             marginBottom: 12,
//                             fontFamily: "'Source Sans Pro', sans-serif",
//                         }}
//                     >
//                         Go to Device Hub
//                     </button>

//                     {/* LOGOUT BUTTON */}
//                     <button
//                         onClick={handleLogout}
//                         style={{
//                             width: "100%",
//                             padding: "14px",
//                             background: P.errorRed,
//                             border: "none",
//                             borderRadius: 12,
//                             color: P.surface,
//                             fontSize: 16,
//                             fontWeight: 700,
//                             cursor: "pointer",
//                             fontFamily: "'Source Sans Pro', sans-serif",
//                         }}
//                     >
//                         Logout
//                     </button>
//                 </div>
//             </div>

//             <VendorFooter />
//         </div>
//     );
// }

import { useNavigate } from "react-router-dom";
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

    return (
        <div
            style={{
                minHeight: "100vh",
                paddingBottom: "30px",
                background: P.bgGradient,
                fontFamily: "'Inter', sans-serif",
            }}
        >

            {/* AMBER BANNER + AVATAR */}
            <div style={{ position: "relative", marginBottom: 60 }}>
                {/* Amber banner */}
                <div
                    style={{
                        background: P.btnPrimary,
                        height: 130,
                        margin: "16px 20px 0",
                        borderRadius: 16,
                    }}
                />
                {/* Avatar circle overlapping banner */}
                <div
                    style={{
                        position: "absolute",
                        bottom: -50,
                        left: "50%",
                        transform: "translateX(-50%)",
                        width: 90,
                        height: 90,
                        borderRadius: "50%",
                        background: P.borderAdmin,
                    border: `4px solid ${P.surface}`,
                        overflow: "hidden",
                        boxShadow: "0 4px 12px rgba(0,0,0,0.12)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >
                    <svg
                        width="48"
                        height="48"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke={P.textAdminFaint}
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <circle cx="12" cy="8" r="4" />
                        <path d="M4 21c1.5-4 5-6 8-6s6.5 2 8 6" />
                    </svg>
                </div>
            </div>

            {/* VENDOR NAME */}
            <div
                style={{
                    textAlign: "center",
                    fontSize: 20,
                    fontWeight: 700,
                    color: P.textPrimary,
                    fontFamily: "'DM Sans', sans-serif",
                    marginBottom: 24,
                    paddingTop: 8,
                }}
            >
                {vendorName || "--"}
            </div>

            {/* INFO CARD */}
            <div
                style={{
                    margin: "0 20px",
                    background: P.surface,
                    borderRadius: 16,
                    padding: "4px 0",
                    boxShadow: P.shadowCard,
                    border: `1px solid ${P.border}`,
                    marginBottom: 24,
                }}
            >
                {/* Email Row */}
                <div
                    style={{
                        padding: "16px 20px",
                        borderBottom: "1px solid #F5F5F5",
                    }}
                >
                    <div
                        style={{
                            fontSize: 12,
                            color: P.textAmber,
                            fontWeight: 600,
                            fontFamily: "'Inter', sans-serif",
                            marginBottom: 4,
                        }}
                    >
                        Email :
                    </div>
                    <div
                        style={{
                            fontSize: 15,
                            fontWeight: 500,
                            color: P.textPrimary,
                            fontFamily: "'Inter', sans-serif",
                        }}
                    >
                        {vendorEmail || "--"}
                    </div>
                </div>

                {/* Phone Row */}
                <div
                    style={{
                        padding: "16px 20px",
                        borderBottom: "1px solid #F5F5F5",
                    }}
                >
                    <div
                        style={{
                            fontSize: 12,
                            color: P.textAmber,
                            fontWeight: 600,
                            fontFamily: "'Inter', sans-serif",
                            marginBottom: 4,
                        }}
                    >
                        Phone Number :
                    </div>
                    <div
                        style={{
                            fontSize: 15,
                            fontWeight: 600,
                            color: P.textAmberBright,
                            fontFamily: "'Inter', sans-serif",
                        }}
                    >
                        {vendorPhone || "--"}
                    </div>
                </div>

                {/* Registered Since Row */}
                <div
                    style={{
                        padding: "16px 20px",
                    }}
                >
                    <div
                        style={{
                            fontSize: 12,
                            color: P.textAmber,
                            fontWeight: 600,
                            fontFamily: "'Inter', sans-serif",
                            marginBottom: 4,
                        }}
                    >
                        Registered Since
                    </div>
                    <div
                        style={{
                            fontSize: 15,
                            fontWeight: 500,
                            color: P.textPrimary,
                            fontFamily: "'Inter', sans-serif",
                        }}
                    >
                        --
                    </div>
                </div>
            </div>

            {/* LOGOUT BUTTON */}
            <div style={{ margin: "0 20px" }}>
                <button
                    onClick={handleLogout}
                    style={{
                        width: "100%",
                        padding: "15px",
                        background: P.redLogout,
                        border: "none",
                        borderRadius: 50,
                        color: P.surface,
                        fontSize: 16,
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
                    <svg
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke={P.surface}
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                        <polyline points="16 17 21 12 16 7" />
                        <line x1="21" y1="12" x2="9" y2="12" />
                    </svg>
                    Logout
                </button>
            </div>

            {/* Back to Device Hub */}
<div
  style={{
    margin: "20px 20px 0",
  }}
>
  <button
    onClick={() => navigate("/devices")}
    style={{
  width: "100%",
  padding: "15px",
  border: `1px solid ${P.border}`,
  borderRadius: 50,
  cursor: "pointer",
  fontWeight: 700,
  fontSize: 16,
  color: P.textSecond,
  background: P.surface,
  fontFamily: "'DM Sans', sans-serif",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: 8,
  boxShadow: P.shadowCard,
  transition: "all 0.25s ease",
}}
    onMouseEnter={(e) => {
      e.currentTarget.style.background = P.surfaceLight;
      e.currentTarget.style.transform = "translateY(-2px)";
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.background = P.surface;
      e.currentTarget.style.transform = "translateY(0)";
    }}
  >
    ← Back to Device Hub
  </button>
</div>
        </div>
    );
}