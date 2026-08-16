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

    const vendorName = localStorage.getItem("vendorName");
    const vendorEmail = localStorage.getItem("vendorEmail");
    const vendorPhone = localStorage.getItem("vendorPhone");
    const vendorRegisteredSince = localStorage.getItem(
        "vendorRegisteredSince"
    );

    const handleLogout = () => {
        localStorage.clear();
        navigate("/vendor-login");
    };

    const formatDate = (date) => {
        if (!date) return "--";

        const parsedDate = new Date(date);

        if (isNaN(parsedDate.getTime())) {
            return date;
        }

        return parsedDate.toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
        });
    };

    return (
        <div
            style={{
                width: "100%",
                minHeight: "100vh",
                padding: "20px",
                paddingBottom: 110,
                background: P.bgGradient,
                fontFamily: "'Inter', sans-serif",
                boxSizing: "border-box",
                overflowX: "hidden",
            }}
        >
            {/* =====================================================
                PAGE CONTAINER
                HEADER + ACCOUNT CARD HAVE THE SAME WIDTH
            ====================================================== */}
            <div
                style={{
                    width: "100%",
                    maxWidth: 420,
                    margin: "0 auto",
                    boxSizing: "border-box",
                }}
            >
                {/* =================================================
                    HEADER
                ================================================== */}
                <div
                    style={{
                        width: "100%",
                        height: 250,
                        boxSizing: "border-box",

                        borderRadius: 24,
                        background: P.btnPrimary,

                        position: "relative",
                        overflow: "hidden",

                        boxShadow:
                            "0 10px 30px rgba(0,0,0,0.12)",

                        marginBottom: 28,
                    }}
                >
                    <div
                        style={{
                            position: "relative",
                            zIndex: 2,

                            width: "100%",
                            height: "100%",

                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            justifyContent: "center",

                            padding: 20,
                            boxSizing: "border-box",

                            overflow: "hidden",
                        }}
                    >
                        {/* PROFILE CIRCLE */}
                        <div
                            style={{
                                width: 100,
                                height: 100,
                                flexShrink: 0,

                                borderRadius: "50%",
                                background: P.surface,

                                padding: 5,
                                boxSizing: "border-box",

                                boxShadow:
                                    "0 8px 24px rgba(0,0,0,0.20)",

                                marginBottom: 14,
                            }}
                        >
                            <div
                                style={{
                                    width: "100%",
                                    height: "100%",

                                    borderRadius: "50%",
                                    background: P.borderAdmin,

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
                                    <circle
                                        cx="12"
                                        cy="8"
                                        r="4"
                                    />
                                    <path d="M4 21c1.5-4 5-6 8-6s6.5 2 8 6" />
                                </svg>
                            </div>
                        </div>

                        {/* VENDOR NAME */}
                        <div
                            style={{
                                width: "100%",
                                minWidth: 0,

                                fontSize: 24,
                                fontWeight: 800,
                                color: P.surface,

                                fontFamily:
                                    "'DM Sans', sans-serif",

                                textAlign: "center",

                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                            }}
                        >
                            {vendorName || "Vendor"}
                        </div>

                        {/* SUBTITLE */}
                        <div
                            style={{
                                width: "100%",

                                marginTop: 5,

                                fontSize: 13,
                                color: "rgba(255,255,255,0.82)",

                                textAlign: "center",

                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                            }}
                        >
                            Vendor Account
                        </div>
                    </div>
                </div>

                {/* =================================================
                    ACCOUNT INFORMATION CARD
                ================================================== */}
                <div
                    style={{
                        width: "100%",
                        maxWidth: 420,

                        boxSizing: "border-box",

                        background: P.surface,
                        borderRadius: 22,

                        border: `1px solid ${P.border}`,
                        boxShadow: P.shadowCard,

                        overflow: "hidden",

                        marginBottom: 20,
                    }}
                >
                    {/* CARD HEADER */}
                    <div
                        style={{
                            width: "100%",
                            boxSizing: "border-box",

                            padding: "18px 20px",

                            borderBottom:
                                "1px solid #F1F1F1",

                            overflow: "hidden",
                        }}
                    >
                        <div
                            style={{
                                fontSize: 16,
                                fontWeight: 700,
                                color: P.textPrimary,

                                fontFamily:
                                    "'DM Sans', sans-serif",

                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                            }}
                        >
                            Account Information
                        </div>
                    </div>

                    {/* =================================================
                        EMAIL
                    ================================================== */}
                    <div style={infoRow}>
                        <div style={iconBox}>
                            <svg
                                width="19"
                                height="19"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <rect
                                    x="3"
                                    y="5"
                                    width="18"
                                    height="14"
                                    rx="2"
                                />
                                <polyline points="3 7 12 13 21 7" />
                            </svg>
                        </div>

                        <div style={contentBox}>
                            <div style={labelStyle}>
                                Email Address
                            </div>

                            <div style={valueStyle}>
                                {vendorEmail || "--"}
                            </div>
                        </div>
                    </div>

                    {/* =================================================
                        PHONE
                    ================================================== */}
                    <div style={infoRow}>
                        <div style={iconBox}>
                            <svg
                                width="19"
                                height="19"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <path d="M22 16.92v3a2 2 0 0 1-2.18 2A19.79 19.79 0 0 1 3.09 5.18 2 2 0 0 1 5.08 3h3a2 2 0 0 1 2 1.72c.12.9.33 1.78.62 2.63a2 2 0 0 1-.45 2.11L9 10.73a16 16 0 0 0 4.27 4.27l1.27-1.27a2 2 0 0 1 2.11-.45c.85.29 1.73.5 2.63.62A2 2 0 0 1 22 16.92z" />
                            </svg>
                        </div>

                        <div style={contentBox}>
                            <div style={labelStyle}>
                                Phone Number
                            </div>

                            <div style={valueStyle}>
                                {vendorPhone || "--"}
                            </div>
                        </div>
                    </div>

                    {/* =================================================
                        REGISTERED SINCE
                    ================================================== */}
                    <div
                        style={{
                            ...infoRow,
                            borderBottom: "none",
                        }}
                    >
                        <div style={iconBox}>
                            <svg
                                width="19"
                                height="19"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <rect
                                    x="3"
                                    y="4"
                                    width="18"
                                    height="18"
                                    rx="2"
                                />
                                <line
                                    x1="16"
                                    y1="2"
                                    x2="16"
                                    y2="6"
                                />
                                <line
                                    x1="8"
                                    y1="2"
                                    x2="8"
                                    y2="6"
                                />
                                <line
                                    x1="3"
                                    y1="10"
                                    x2="21"
                                    y2="10"
                                />
                            </svg>
                        </div>

                        <div style={contentBox}>
                            <div style={labelStyle}>
                                Registered Since
                            </div>

                            <div style={valueStyle}>
                                {formatDate(
                                    vendorRegisteredSince
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* =================================================
                    LOGOUT
                ================================================== */}
                <button
                    onClick={handleLogout}
                    style={{
                        width: "100%",
                        boxSizing: "border-box",

                        padding: "15px",

                        background: P.redLogout,
                        border: "none",
                        borderRadius: 50,

                        color: P.surface,

                        fontSize: 16,
                        fontWeight: 700,

                        fontFamily:
                            "'DM Sans', sans-serif",

                        cursor: "pointer",

                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 8,

                        boxShadow: P.shadowBtnRed,

                        marginBottom: 14,
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
                        <line
                            x1="21"
                            y1="12"
                            x2="9"
                            y2="12"
                        />
                    </svg>

                    Logout
                </button>
            </div>

            {/* =====================================================
                FIXED BACK BUTTON
            ====================================================== */}
            <div
                style={{
                    position: "fixed",
                    left: 35,
                    bottom:
                        "calc(36px + env(safe-area-inset-bottom))",
                    zIndex: 1000,
                }}
            >
                <button
                    onClick={() => navigate("/devices")}
                    aria-label="Back to devices"
                    style={{
                        width: 44,
                        height: 44,

                        borderRadius: "50%",

                        border:
                            `1px solid ${P.border}`,

                        background: P.surface,

                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",

                        padding: 0,
                        cursor: "pointer",

                        color: P.textSecond,

                        fontSize: 22,
                        fontWeight: 500,
                        lineHeight: 1,

                        fontFamily:
                            "'Inter', sans-serif",

                        boxShadow:
                            "0 4px 14px rgba(0, 0, 0, 0.16)",

                        WebkitTapHighlightColor:
                            "transparent",
                    }}
                >
                    ←
                </button>
            </div>
        </div>
    );
}

/* =========================================================
   SHARED STYLES
========================================================= */

const infoRow = {
    width: "100%",
    maxWidth: "100%",

    display: "flex",
    alignItems: "center",

    gap: 14,

    padding: "18px 20px",

    boxSizing: "border-box",

    borderBottom: "1px solid #F5F5F5",

    overflow: "hidden",
};

const iconBox = {
    width: 42,
    height: 42,
    minWidth: 42,
    maxWidth: 42,

    flexShrink: 0,

    borderRadius: 12,

    background: P.surfaceWarm,
    color: P.textAmber,

    display: "flex",
    alignItems: "center",
    justifyContent: "center",

    boxSizing: "border-box",
};

const contentBox = {
    flex: "1 1 0%",
    minWidth: 0,
    maxWidth: "100%",

    boxSizing: "border-box",

    overflow: "hidden",
};

const labelStyle = {
    fontSize: 11,
    color: P.textMuted,
    fontWeight: 600,

    marginBottom: 4,

    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
};

const valueStyle = {
    width: "100%",
    maxWidth: "100%",

    fontSize: 15,
    color: P.textPrimary,
    fontWeight: 600,

    minWidth: 0,

    overflowWrap: "anywhere",
    wordBreak: "break-word",

    overflow: "hidden",
};




// import { useNavigate } from "react-router-dom";
// import P from "../theme/colors";

// export default function VendorProfile() {
//     const navigate = useNavigate();

//     const vendorName = localStorage.getItem("vendorName");
//     const vendorEmail = localStorage.getItem("vendorEmail");
//     const vendorPhone = localStorage.getItem("vendorPhone");
//     const vendorRegisteredSince = localStorage.getItem(
//         "vendorRegisteredSince"
//     );

//     const handleLogout = () => {
//         localStorage.clear();
//         navigate("/vendor-login");
//     };

//     // Safely format registered date
//     const formatDate = (date) => {
//         if (!date) return "--";

//         const parsedDate = new Date(date);

//         if (isNaN(parsedDate.getTime())) {
//             return date;
//         }

//         return parsedDate.toLocaleDateString("en-IN", {
//             day: "2-digit",
//             month: "short",
//             year: "numeric",
//         });
//     };

//     return (
//         <div
//             style={{
//                 // minHeight: "100vh",
//                 // padding: "20px",
//                 // paddingBottom: "40px",
//                 // background: P.bgGradient,
//                 // fontFamily: "'Inter', sans-serif",
//                 // boxSizing: "border-box",
//                   minHeight: "100vh",
//         padding: "20px",
//         paddingBottom: 110,
//         background: P.bgGradient,
//         fontFamily: "'Inter', sans-serif",
//         boxSizing: "border-box",
//             }}
//         >
//             {/* PAGE CONTAINER */}
//             <div
//                 style={{
//                     // width: "100%",
//                     // maxWidth: 620,
//                     // margin: "0 auto",
//                     width: "100%",
//             maxWidth: 420,
//             margin: "0 auto",
//             boxSizing: "border-box",
//                 }}
//             >
//              {/* ================= HEADER ================= */}

// <div
//     style={{
//         width: "100%",
//         boxSizing: "border-box",

//         position: "relative",
//         marginBottom: 28,
//     }}
// >
//     {/* Orange banner */}
//     <div
//         style={{
//             height: 250,
//             borderRadius: 24,
//             background: P.btnPrimary,
//             position: "relative",
//             overflow: "hidden",
//             boxShadow: "0 10px 30px rgba(0,0,0,0.12)",

//              width: "100%",
//         boxSizing: "border-box",


//         }}
//     >
//         {/* Header content */}
//         <div
//             style={{
//                 position: "relative",
//                 zIndex: 2,
//                 height: "100%",
//                 display: "flex",
//                 flexDirection: "column",
//                 alignItems: "center",
//                 justifyContent: "center",
//                 padding: "20px",
//                 boxSizing: "border-box",
//             }}
//         >
//             {/* Profile circle */}
//             <div
//                 style={{
//                     width: 100,
//                     height: 100,
//                     borderRadius: "50%",
//                     background: P.surface,
//                     padding: 5,
//                     boxSizing: "border-box",
//                     boxShadow: "0 8px 24px rgba(0,0,0,0.20)",
//                     marginBottom: 14,
//                 }}
//             >
//                 <div
//                     style={{
//                         width: "100%",
//                         height: "100%",
//                         borderRadius: "50%",
//                         background: P.borderAdmin,
//                         display: "flex",
//                         alignItems: "center",
//                         justifyContent: "center",
//                     }}
//                 >
//                     <svg
//                         width="48"
//                         height="48"
//                         viewBox="0 0 24 24"
//                         fill="none"
//                         stroke={P.textAdminFaint}
//                         strokeWidth="1.5"
//                         strokeLinecap="round"
//                         strokeLinejoin="round"
//                     >
//                         <circle
//                             cx="12"
//                             cy="8"
//                             r="4"
//                         />
//                         <path d="M4 21c1.5-4 5-6 8-6s6.5 2 8 6" />
//                     </svg>
//                 </div>
//             </div>

//         {/* Vendor name */}
//         <div
//             style={{
//                 fontSize: 24,
//                 fontWeight: 800,
//                 color: P.surface,
//                 fontFamily: "'DM Sans', sans-serif",
//                 textAlign: "center",
//                 maxWidth: "100%",
//                 overflow: "hidden",
//                 textOverflow: "ellipsis",
//                 whiteSpace: "nowrap",
//             }}
//         >
//             {vendorName || "Vendor"}
//         </div>

//         {/* Subtitle */}
//         <div
//             style={{
//                 marginTop: 5,
//                 fontSize: 13,
//                 color: "rgba(255,255,255,0.82)",
//                 textAlign: "center",
//             }}
//         >
//             Vendor Account
//         </div>
//     </div>
// </div>

// </div>

//                 {/* ================= NAME ================= */}
//                 {/* <div
//                     style={{
//                         textAlign: "center",
//                         marginBottom: 28,
//                     }}
//                 >
//                     <h1
//                         style={{
//                             margin: 0,
//                             fontSize: 24,
//                             fontWeight: 800,
//                             color: P.textPrimary,
//                             fontFamily:
//                                 "'DM Sans', sans-serif",
//                         }}
//                     >
//                         {vendorName || "Vendor"}
//                     </h1> */}
// {/* 
//                     <div
//                         style={{
//                             marginTop: 8,
//                             display: "inline-flex",
//                             alignItems: "center",
//                             gap: 6,
//                             padding: "6px 13px",
//                             borderRadius: 20,
//                             background: P.surfaceWarm,
//                             color: P.textAmber,
//                             fontSize: 12,
//                             fontWeight: 600,
//                         }}
//                     >
//                         <span
//                             style={{
//                                 width: 7,
//                                 height: 7,
//                                 borderRadius: "50%",
//                                 background:
//                                     P.textAmberBright,
//                             }}
//                         />

//                         Vendor Account
//                     </div> */}
//                 </div>

//                 {/* ================= ACCOUNT INFO ================= */}
//                 <div
//                     style={{
//                         width: "100%",
//         boxSizing: "border-box",

//                         background: P.surface,
//                         borderRadius: 22,
//                         border: `1px solid ${P.border}`,
//                         boxShadow: P.shadowCard,
//                         overflow: "hidden",
//                         marginBottom: 20,
//                     }}
//                 >
//                     {/* Card header */}
//                     <div
//                         style={{
//                             padding: "18px 20px",
//                             borderBottom:
//                                 "1px solid #F1F1F1",
//                         }}
//                     >
//                         <div
//                             style={{
//                                 fontSize: 16,
//                                 fontWeight: 700,
//                                 color: P.textPrimary,
//                                 fontFamily:
//                                     "'DM Sans', sans-serif",
//                             }}
//                         >
//                             Account Information
//                         </div>

//                         {/* <div
//                             style={{
//                                 marginTop: 4,
//                                 fontSize: 12,
//                                 color: P.textMuted,
//                             }}
//                         >
//                             Your registered vendor details
//                         </div> */}
//                     </div>

//                     {/* EMAIL */}
//                     <div style={infoRow}>
//                         <div style={iconBox}>
//                             <svg
//                                 width="19"
//                                 height="19"
//                                 viewBox="0 0 24 24"
//                                 fill="none"
//                                 stroke="currentColor"
//                                 strokeWidth="2"
//                                 strokeLinecap="round"
//                                 strokeLinejoin="round"
//                             >
//                                 <rect
//                                     x="3"
//                                     y="5"
//                                     width="18"
//                                     height="14"
//                                     rx="2"
//                                 />
//                                 <polyline points="3 7 12 13 21 7" />
//                             </svg>
//                         </div>

//                         <div style={{ flex: 1, minWidth: 0 }}>
//                             <div style={labelStyle}>
//                                 Email Address
//                             </div>

//                             <div style={valueStyle}>
//                                 {vendorEmail || "--"}
//                             </div>
//                         </div>
//                     </div>

//                     {/* PHONE */}
//                     <div style={infoRow}>
//                         <div style={iconBox}>
//                             <svg
//                                 width="19"
//                                 height="19"
//                                 viewBox="0 0 24 24"
//                                 fill="none"
//                                 stroke="currentColor"
//                                 strokeWidth="2"
//                                 strokeLinecap="round"
//                                 strokeLinejoin="round"
//                             >
//                                 <path d="M22 16.92v3a2 2 0 0 1-2.18 2A19.79 19.79 0 0 1 3.09 5.18 2 2 0 0 1 5.08 3h3a2 2 0 0 1 2 1.72c.12.9.33 1.78.62 2.63a2 2 0 0 1-.45 2.11L9 10.73a16 16 0 0 0 4.27 4.27l1.27-1.27a2 2 0 0 1 2.11-.45c.85.29 1.73.5 2.63.62A2 2 0 0 1 22 16.92z" />
//                             </svg>
//                         </div>

//                         <div style={{ flex: 1, minWidth: 0 }}>
//                             <div style={labelStyle}>
//                                 Phone Number
//                             </div>

//                             <div style={valueStyle}>
//                                 {vendorPhone || "--"}
//                             </div>
//                         </div>
//                     </div>

//                     {/* REGISTERED SINCE */}
//                     <div
//                         style={{
//                             ...infoRow,
//                             borderBottom: "none",
//                         }}
//                     >
//                         <div style={iconBox}>
//                             <svg
//                                 width="19"
//                                 height="19"
//                                 viewBox="0 0 24 24"
//                                 fill="none"
//                                 stroke="currentColor"
//                                 strokeWidth="2"
//                                 strokeLinecap="round"
//                                 strokeLinejoin="round"
//                             >
//                                 <rect
//                                     x="3"
//                                     y="4"
//                                     width="18"
//                                     height="18"
//                                     rx="2"
//                                 />
//                                 <line
//                                     x1="16"
//                                     y1="2"
//                                     x2="16"
//                                     y2="6"
//                                 />
//                                 <line
//                                     x1="8"
//                                     y1="2"
//                                     x2="8"
//                                     y2="6"
//                                 />
//                                 <line
//                                     x1="3"
//                                     y1="10"
//                                     x2="21"
//                                     y2="10"
//                                 />
//                             </svg>
//                         </div>

//                         <div style={{ flex: 1 }}>
//                             <div style={labelStyle}>
//                                 Registered Since
//                             </div>

//                             <div style={valueStyle}>
//                                 {formatDate(
//                                     vendorRegisteredSince
//                                 )}
//                             </div>
//                         </div>
//                     </div>
//                 </div>

//                 {/* ================= LOGOUT ================= */}
//                 <button
//                     onClick={handleLogout}
//                     style={{
//                         width: "100%",
//                         padding: "15px",
//                         background: P.redLogout,
//                         border: "none",
//                         borderRadius: 50,
//                         color: P.surface,
//                         fontSize: 16,
//                         fontWeight: 700,
//                         fontFamily:
//                             "'DM Sans', sans-serif",
//                         cursor: "pointer",
//                         display: "flex",
//                         alignItems: "center",
//                         justifyContent: "center",
//                         gap: 8,
//                         boxShadow: P.shadowBtnRed,
//                         marginBottom: 14,
//                     }}
//                 >
//                     <svg
//                         width="18"
//                         height="18"
//                         viewBox="0 0 24 24"
//                         fill="none"
//                         stroke={P.surface}
//                         strokeWidth="2.5"
//                         strokeLinecap="round"
//                         strokeLinejoin="round"
//                     >
//                         <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
//                         <polyline points="16 17 21 12 16 7" />
//                         <line
//                             x1="21"
//                             y1="12"
//                             x2="9"
//                             y2="12"
//                         />
//                     </svg>

//                     Logout
//                 </button>

//                 {/* ================= BACK BUTTON ================= */}
//                 {/* <button
//                     onClick={() => navigate("/devices")}
//                     style={{
//                         width: "100%",
//                         padding: "14px",
//                         border: `1px solid ${P.border}`,
//                         borderRadius: 50,
//                         cursor: "pointer",
//                         fontWeight: 700,
//                         fontSize: 15,
//                         color: P.textSecond,
//                         background: P.surface,
//                         fontFamily:
//                             "'DM Sans', sans-serif",
//                         display: "flex",
//                         alignItems: "center",
//                         justifyContent: "center",
//                         gap: 8,
//                         boxShadow: P.shadowCard,
//                         transition:
//                             "all 0.25s ease",
//                     }}
//                     onMouseEnter={(e) => {
//                         e.currentTarget.style.background =
//                             P.surfaceLight;
//                         e.currentTarget.style.transform =
//                             "translateY(-2px)";
//                     }}
//                     onMouseLeave={(e) => {
//                         e.currentTarget.style.background =
//                             P.surface;
//                         e.currentTarget.style.transform =
//                             "translateY(0)";
//                     }}
//                 >
//                     <svg
//                         width="18"
//                         height="18"
//                         viewBox="0 0 24 24"
//                         fill="none"
//                         stroke="currentColor"
//                         strokeWidth="2"
//                         strokeLinecap="round"
//                         strokeLinejoin="round"
//                     >
//                         <polyline points="15 18 9 12 15 6" />
//                     </svg>

//                     Back to Dashboard
//                 </button> */}

//                 {/* BACK BUTTON — FIXED BOTTOM LEFT */}
// <div
//   style={{
//     position: "fixed",
//     left: 35,
//     bottom: "calc(36px + env(safe-area-inset-bottom))",
//     zIndex: 1000,
//   }}
// >
//   <button
//     onClick={() => navigate("/devices")}
//     aria-label="Back to devices"
//     style={{
//       width: 44,
//       height: 44,
//       borderRadius: "50%",

//       border: `1px solid ${P.border}`,
//       background: P.surface,

//       display: "flex",
//       alignItems: "center",
//       justifyContent: "center",

//       padding: 0,
//       cursor: "pointer",

//       color: P.textSecond,
//       fontSize: 22,
//       fontWeight: 500,
//       lineHeight: 1,
//       fontFamily: "'Inter', sans-serif",

//       boxShadow: "0 4px 14px rgba(0, 0, 0, 0.16)",

//       // Makes sure the button remains easy to tap
//       WebkitTapHighlightColor: "transparent",
//     }}
//   >
//     ←
//   </button>
// </div>
//             </div>
//     );
// }

// /* ================= SHARED STYLES ================= */

// const infoRow = {
//     display: "flex",
//     alignItems: "center",
//     gap: 14,
//     padding: "18px 20px",
//     borderBottom: "1px solid #F5F5F5",
// };

// const iconBox = {
//     width: 42,
//     height: 42,
//     minWidth: 42,
//     borderRadius: 12,
//     background: P.surfaceWarm,
//     color: P.textAmber,
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "center",
// };

// const labelStyle = {
//     fontSize: 11,
//     color: P.textMuted,
//     fontWeight: 600,
//     marginBottom: 4,
// };

// const valueStyle = {
//     fontSize: 15,
//     color: P.textPrimary,
//     fontWeight: 600,
//     wordBreak: "break-word",
//      minWidth: 0,
//     maxWidth: "100%",
//     overflowWrap: "anywhere",
// };





// import { useNavigate } from "react-router-dom";
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
    

//     return (
//         <div
//             style={{
//                 minHeight: "100vh",
//                 paddingBottom: "30px",
//                 background: P.bgGradient,
//                 fontFamily: "'Inter', sans-serif",
//             }}
//         >

//             {/* AMBER BANNER + AVATAR */}
//             <div style={{ position: "relative", marginBottom: 60 }}>
//                 {/* Amber banner */}
//                 <div
//                     style={{
//                         background: P.btnPrimary,
//                         height: 130,
//                         margin: "16px 20px 0",
//                         borderRadius: 16,
//                     }}
//                 />
//                 {/* Avatar circle overlapping banner */}
//                 <div
//                     style={{
//                         position: "absolute",
//                         bottom: -50,
//                         left: "50%",
//                         transform: "translateX(-50%)",
//                         width: 90,
//                         height: 90,
//                         borderRadius: "50%",
//                         background: P.borderAdmin,
//                     border: `4px solid ${P.surface}`,
//                         overflow: "hidden",
//                         boxShadow: "0 4px 12px rgba(0,0,0,0.12)",
//                         display: "flex",
//                         alignItems: "center",
//                         justifyContent: "center",
//                     }}
//                 >
//                     <svg
//                         width="48"
//                         height="48"
//                         viewBox="0 0 24 24"
//                         fill="none"
//                         stroke={P.textAdminFaint}
//                         strokeWidth="1.5"
//                         strokeLinecap="round"
//                         strokeLinejoin="round"
//                     >
//                         <circle cx="12" cy="8" r="4" />
//                         <path d="M4 21c1.5-4 5-6 8-6s6.5 2 8 6" />
//                     </svg>
//                 </div>
//             </div>

//             {/* VENDOR NAME */}
//             <div
//                 style={{
//                     textAlign: "center",
//                     fontSize: 20,
//                     fontWeight: 700,
//                     color: P.textPrimary,
//                     fontFamily: "'DM Sans', sans-serif",
//                     marginBottom: 24,
//                     paddingTop: 8,
//                 }}
//             >
//                 {vendorName || "--"}
//             </div>

//             {/* INFO CARD */}
//             <div
//                 style={{
//                     margin: "0 20px",
//                     background: P.surface,
//                     borderRadius: 16,
//                     padding: "4px 0",
//                     boxShadow: P.shadowCard,
//                     border: `1px solid ${P.border}`,
//                     marginBottom: 24,
//                 }}
//             >
//                 {/* Email Row */}
//                 <div
//                     style={{
//                         padding: "16px 20px",
//                         borderBottom: "1px solid #F5F5F5",
//                     }}
//                 >
//                     <div
//                         style={{
//                             fontSize: 12,
//                             color: P.textAmber,
//                             fontWeight: 600,
//                             fontFamily: "'Inter', sans-serif",
//                             marginBottom: 4,
//                         }}
//                     >
//                         Email :
//                     </div>
//                     <div
//                         style={{
//                             fontSize: 15,
//                             fontWeight: 500,
//                             color: P.textPrimary,
//                             fontFamily: "'Inter', sans-serif",
//                         }}
//                     >
//                         {vendorEmail || "--"}
//                     </div>
//                 </div>

//                 {/* Phone Row */}
//                 <div
//                     style={{
//                         padding: "16px 20px",
//                         borderBottom: "1px solid #F5F5F5",
//                     }}
//                 >
//                     <div
//                         style={{
//                             fontSize: 12,
//                             color: P.textAmber,
//                             fontWeight: 600,
//                             fontFamily: "'Inter', sans-serif",
//                             marginBottom: 4,
//                         }}
//                     >
//                         Phone Number :
//                     </div>
//                     <div
//                         style={{
//                             fontSize: 15,
//                             fontWeight: 600,
//                             color: P.textAmberBright,
//                             fontFamily: "'Inter', sans-serif",
//                         }}
//                     >
//                         {vendorPhone || "--"}
//                     </div>
//                 </div>

//                 {/* Registered Since Row */}
//                 <div
//                     style={{
//                         padding: "16px 20px",
//                     }}
//                 >
//                     <div
//                         style={{
//                             fontSize: 12,
//                             color: P.textAmber,
//                             fontWeight: 600,
//                             fontFamily: "'Inter', sans-serif",
//                             marginBottom: 4,
//                         }}
//                     >
//                         Registered Since
//                     </div>
//                     <div
//                         style={{
//                             fontSize: 15,
//                             fontWeight: 500,
//                             color: P.textPrimary,
//                             fontFamily: "'Inter', sans-serif",
//                         }}
//                     >
//                         --
//                     </div>
//                 </div>
//             </div>

//             {/* LOGOUT BUTTON */}
//             <div style={{ margin: "0 20px" }}>
//                 <button
//                     onClick={handleLogout}
//                     style={{
//                         width: "100%",
//                         padding: "15px",
//                         background: P.redLogout,
//                         border: "none",
//                         borderRadius: 50,
//                         color: P.surface,
//                         fontSize: 16,
//                         fontWeight: 700,
//                         fontFamily: "'DM Sans', sans-serif",
//                         cursor: "pointer",
//                         display: "flex",
//                         alignItems: "center",
//                         justifyContent: "center",
//                         gap: 8,
//                         boxShadow: P.shadowBtnRed,
//                     }}
//                 >
//                     <svg
//                         width="18"
//                         height="18"
//                         viewBox="0 0 24 24"
//                         fill="none"
//                         stroke={P.surface}
//                         strokeWidth="2.5"
//                         strokeLinecap="round"
//                         strokeLinejoin="round"
//                     >
//                         <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
//                         <polyline points="16 17 21 12 16 7" />
//                         <line x1="21" y1="12" x2="9" y2="12" />
//                     </svg>
//                     Logout
//                 </button>
//             </div>

//             {/* Back to Device Hub */}
// <div
//   style={{
//     margin: "20px 20px 0",
//   }}
// >
//   <button
//     onClick={() => navigate("/devices")}
//     style={{
//   width: "100%",
//   padding: "15px",
//   border: `1px solid ${P.border}`,
//   borderRadius: 50,
//   cursor: "pointer",
//   fontWeight: 700,
//   fontSize: 16,
//   color: P.textSecond,
//   background: P.surface,
//   fontFamily: "'DM Sans', sans-serif",
//   display: "flex",
//   alignItems: "center",
//   justifyContent: "center",
//   gap: 8,
//   boxShadow: P.shadowCard,
//   transition: "all 0.25s ease",
// }}
//     onMouseEnter={(e) => {
//       e.currentTarget.style.background = P.surfaceLight;
//       e.currentTarget.style.transform = "translateY(-2px)";
//     }}
//     onMouseLeave={(e) => {
//       e.currentTarget.style.background = P.surface;
//       e.currentTarget.style.transform = "translateY(0)";
//     }}
//   >
//     ← Back to Device Hub
//   </button>
// </div>
//         </div>
//     );
//}


















// const iconBox = {

//     width: 42,

//     height: 42,

//     minWidth: 42,

//     borderRadius: 12,

//     background: P.surfaceWarm,

//     color: P.textAmber,

//     display: "flex",

//     alignItems: "center",

//     justifyContent: "center",

// };


// import { useNavigate } from "react-router-dom";

// import P from "../theme/colors";



// export default function VendorProfile() {

//     const navigate = useNavigate();



//     const vendorName = localStorage.getItem("vendorName");

//     const vendorEmail = localStorage.getItem("vendorEmail");

//     const vendorPhone = localStorage.getItem("vendorPhone");

//     const vendorRegisteredSince = localStorage.getItem("vendorRegisteredSince");



//     const handleLogout = () => {

//         localStorage.clear();

//         navigate("/vendor-login");

//     };



//     const formatDate = (date) => {

//         if (!date) {

//             return "--";

//         }



//         const parsedDate = new Date(date);

//         return Number.isNaN(parsedDate.getTime())

//             ? date

//             : parsedDate.toLocaleDateString("en-IN", {

//                   day: "2-digit",

//                   month: "long",

//                   year: "numeric",

//               });

//     };



//     return (

//         <div

//             style={{

//                 minHeight: "100vh",

//                 background: P.bgGradient,

//                 fontFamily: "'Inter', sans-serif",

//                 padding: "clamp(20px, 5vw, 50px) 20px 30px",

//                 boxSizing: "border-box",

//             }}

//         >

//             <div

//                 style={{

//                     width: "100%",

//                     maxWidth: 600,

//                     margin: "0 auto",

//                 }}

//             >

//                 <div

//                     style={{

//                         position: "relative",

//                         margin: "16px 20px 70px",

//                         borderRadius: 24,

//                         overflow: "visible",

//                     }}

//                 >

//                     <div

//                         style={{

//                             height: 180,

//                             borderRadius: 24,

//                             background: `linear-gradient(135deg, ${P.btnPrimary} 0%, ${P.textAmberBright} 45%, ${P.btnPrimary} 100%)`,

//                             position: "relative",

//                             overflow: "hidden",

//                             boxShadow: "0 10px 30px rgba(0,0,0,0.12)",

//                         }}

//                     >

//                         <div

//                             style={{

//                                 position: "absolute",

//                                 width: 180,

//                                 height: 180,

//                                 borderRadius: "50%",

//                                 background: "rgba(255,255,255,0.10)",

//                                 right: -50,

//                                 top: -70,

//                             }}

//                         />



//                         <div

//                             style={{

//                                 position: "absolute",

//                                 width: 120,

//                                 height: 120,

//                                 borderRadius: "50%",

//                                 background: "rgba(255,255,255,0.08)",

//                                 left: -40,

//                                 bottom: -60,

//                             }}

//                         />



//                         <div

//                             style={{

//                                 position: "relative",

//                                 zIndex: 2,

//                                 padding: "28px 24px",

//                                 color: P.surface,

//                             }}

//                         >

//                             <div

//                                 style={{

//                                     fontSize: 12,

//                                     fontWeight: 700,

//                                     letterSpacing: 1.5,

//                                     textTransform: "uppercase",

//                                     opacity: 0.8,

//                                     marginBottom: 8,

//                                 }}

//                             >

//                                 Vendor Profile

//                             </div>



//                             <div

//                                 style={{

//                                     fontSize: 26,

//                                     fontWeight: 800,

//                                     fontFamily: "'DM Sans', sans-serif",

//                                 }}

//                             >

//                                 Welcome back

//                             </div>



//                             <div

//                                 style={{

//                                     fontSize: 14,

//                                     marginTop: 5,

//                                     opacity: 0.85,

//                                 }}

//                             >

//                                 Manage your vendor account

//                             </div>

//                         </div>

//                     </div>



//                     <div

//                         style={{

//                             position: "absolute",

//                             left: "50%",

//                             bottom: -50,

//                             transform: "translateX(-50%)",

//                             width: 100,

//                             height: 100,

//                             borderRadius: "50%",

//                             background: P.surface,

//                             border: `5px solid ${P.surface}`,

//                             boxShadow: "0 8px 24px rgba(0,0,0,0.16)",

//                             display: "flex",

//                             alignItems: "center",

//                             justifyContent: "center",

//                             zIndex: 5,

//                         }}

//                     >

//                         <div

//                             style={{

//                                 width: 86,

//                                 height: 86,

//                                 borderRadius: "50%",

//                                 background: P.borderAdmin,

//                                 display: "flex",

//                                 alignItems: "center",

//                                 justifyContent: "center",

//                             }}

//                         >

//                             <svg

//                                 width="48"

//                                 height="48"

//                                 viewBox="0 0 24 24"

//                                 fill="none"

//                                 stroke={P.textAdminFaint}

//                                 strokeWidth="1.5"

//                                 strokeLinecap="round"

//                                 strokeLinejoin="round"

//                             >

//                                 <circle cx="12" cy="8" r="4" />

//                                 <path d="M4 21c1.5-4 5-6 8-6s6.5 2 8 6" />

//                             </svg>

//                         </div>

//                     </div>

//                 </div>



//                 <div

//                     style={{

//                         padding: "62px 24px 26px",

//                         textAlign: "center",

//                     }}

//                 >

//                     <h1

//                         style={{

//                             margin: 0,

//                             fontSize: 24,

//                             fontWeight: 800,

//                             color: P.textPrimary,

//                             fontFamily: "'DM Sans', sans-serif",

//                         }}

//                     >

//                         {vendorName || "Vendor"}

//                     </h1>



//                     <div

//                         style={{

//                             marginTop: 7,

//                             display: "inline-flex",

//                             alignItems: "center",

//                             gap: 6,

//                             padding: "5px 12px",

//                             borderRadius: 20,

//                             background: P.surfaceWarm,

//                             color: P.textAmber,

//                             fontSize: 12,

//                             fontWeight: 600,

//                         }}

//                     >

//                         <span

//                             style={{

//                                 width: 7,

//                                 height: 7,

//                                 borderRadius: "50%",

//                                 background: P.textAmberBright,

//                             }}

//                         />



//                         Vendor Account

//                     </div>

//                 </div>



//                 <div

//                     style={{

//                         background: P.surface,

//                         borderRadius: 22,

//                         border: `1px solid ${P.border}`,

//                         boxShadow: P.shadowCard,

//                         overflow: "hidden",

//                         marginBottom: 20,

//                     }}

//                 >

//                     <div

//                         style={{

//                             padding: "18px 20px",

//                             borderBottom: "1px solid #F1F1F1",

//                         }}

//                     >

//                         <div

//                             style={{

//                                 fontSize: 16,

//                                 fontWeight: 700,

//                                 color: P.textPrimary,

//                                 fontFamily: "'DM Sans', sans-serif",

//                             }}

//                         >

//                             Account Information

//                         </div>



//                         <div

//                             style={{

//                                 marginTop: 4,

//                                 fontSize: 12,

//                                 color: P.textMuted,

//                             }}

//                         >

//                             Your registered vendor details

//                         </div>

//                     </div>



//                     <div

//                         style={{

//                             display: "flex",

//                             alignItems: "center",

//                             gap: 14,

//                             padding: "18px 20px",

//                             borderBottom: "1px solid #F5F5F5",

//                         }}

//                     >

//                         <div style={iconBox}>

//                             <svg

//                                 width="19"

//                                 height="19"

//                                 viewBox="0 0 24 24"

//                                 fill="none"

//                                 stroke="currentColor"

//                                 strokeWidth="2"

//                                 strokeLinecap="round"

//                                 strokeLinejoin="round"

//                             >

//                                 <rect x="3" y="5" width="18" height="14" rx="2" />

//                                 <polyline points="3 7 12 13 21 7" />

//                             </svg>

//                         </div>



//                         <div style={{ flex: 1 }}>

//                             <div style={labelStyle}>Email Address</div>

//                             <div style={valueStyle}>{vendorEmail || "--"}</div>

//                         </div>

//                     </div>



//                     <div

//                         style={{

//                             display: "flex",

//                             alignItems: "center",

//                             gap: 14,

//                             padding: "18px 20px",

//                             borderBottom: "1px solid #F5F5F5",

//                         }}

//                     >

//                         <div style={iconBox}>

//                             <svg

//                                 width="19"

//                                 height="19"

//                                 viewBox="0 0 24 24"

//                                 fill="none"

//                                 stroke="currentColor"

//                                 strokeWidth="2"

//                                 strokeLinecap="round"

//                                 strokeLinejoin="round"

//                             >

//                                 <path d="M22 16.92v3a2 2 0 0 1-2.18 2A19.79 19.79 0 0 1 3.09 5.18 2 2 0 0 1 5.08 3h3a2 2 0 0 1 2 1.72c.12.9.33 1.78.62 2.63a2 2 0 0 1-.45 2.11L9 10.73a16 16 0 0 0 4.27 4.27l1.27-1.27a2 2 0 0 1 2.11-.45c.85.29 1.73.5 2.63.62A2 2 0 0 1 22 16.92z" />

//                             </svg>

//                         </div>



//                         <div style={{ flex: 1 }}>

//                             <div style={labelStyle}>Phone Number</div>

//                             <div style={valueStyle}>{vendorPhone || "--"}</div>

//                         </div>

//                     </div>



//                     <div

//                         style={{

//                             display: "flex",

//                             alignItems: "center",

//                             gap: 14,

//                             padding: "18px 20px",

//                         }}

//                     >

//                         <div style={iconBox}>

//                             <svg

//                                 width="19"

//                                 height="19"

//                                 viewBox="0 0 24 24"

//                                 fill="none"

//                                 stroke="currentColor"

//                                 strokeWidth="2"

//                                 strokeLinecap="round"

//                                 strokeLinejoin="round"

//                             >

//                                 <rect x="3" y="4" width="18" height="18" rx="2" />

//                                 <line x1="16" y1="2" x2="16" y2="6" />

//                                 <line x1="8" y1="2" x2="8" y2="6" />

//                                 <line x1="3" y1="10" x2="21" y2="10" />

//                             </svg>

//                         </div>



//                         <div style={{ flex: 1 }}>

//                             <div style={labelStyle}>Registered Since</div>

//                             <div style={valueStyle}>{formatDate(vendorRegisteredSince)}</div>

//                         </div>

//                     </div>

//                 </div>



//                 <div

//                     style={{

//                         display: "flex",

//                         flexDirection: "column",

//                         gap: 12,

//                     }}

//                 >

//                     <button

//                         onClick={() => navigate("/devices")}

//                         style={{

//                             width: "100%",

//                             padding: "15px 18px",

//                             border: `1px solid ${P.border}`,

//                             borderRadius: 16,

//                             cursor: "pointer",

//                             fontWeight: 700,

//                             fontSize: 15,

//                             color: P.textSecond,

//                             background: P.surface,

//                             fontFamily: "'DM Sans', sans-serif",

//                             display: "flex",

//                             alignItems: "center",

//                             justifyContent: "center",

//                             gap: 9,

//                             boxShadow: P.shadowCard,

//                             transition: "all 0.2s ease",

//                         }}

//                         onMouseEnter={(e) => {

//                             e.currentTarget.style.transform = "translateY(-2px)";

//                             e.currentTarget.style.boxShadow = "0 8px 20px rgba(0,0,0,0.10)";

//                         }}

//                         onMouseLeave={(e) => {

//                             e.currentTarget.style.transform = "translateY(0)";

//                             e.currentTarget.style.boxShadow = P.shadowCard;

//                         }}

//                     >

//                         <svg

//                             width="18"

//                             height="18"

//                             viewBox="0 0 24 24"

//                             fill="none"

//                             stroke="currentColor"

//                             strokeWidth="2"

//                             strokeLinecap="round"

//                             strokeLinejoin="round"

//                         >

//                             <path d="M19 12H5" />

//                             <path d="M12 19l-7-7 7-7" />

//                         </svg>

//                         Back to Device Hub

//                     </button>



//                     <button

//                         onClick={handleLogout}

//                         style={{

//                             width: "100%",

//                             padding: "15px 18px",

//                             background: P.redLogout,

//                             border: "none",

//                             borderRadius: 16,

//                             color: P.surface,

//                             fontSize: 15,

//                             fontWeight: 700,

//                             fontFamily: "'DM Sans', sans-serif",

//                             cursor: "pointer",

//                             display: "flex",

//                             alignItems: "center",

//                             justifyContent: "center",

//                             gap: 9,

//                             boxShadow: P.shadowBtnRed,

//                             transition: "all 0.2s ease",

//                         }}

//                         onMouseEnter={(e) => {

//                             e.currentTarget.style.transform = "translateY(-2px)";

//                         }}

//                         onMouseLeave={(e) => {

//                             e.currentTarget.style.transform = "translateY(0)";

//                         }}

//                     >

//                         <svg

//                             width="18"

//                             height="18"

//                             viewBox="0 0 24 24"

//                             fill="none"

//                             stroke="currentColor"

//                             strokeWidth="2.5"

//                             strokeLinecap="round"

//                             strokeLinejoin="round"

//                         >

//                             <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />

//                             <polyline points="16 17 21 12 16 7" />

//                             <line x1="21" y1="12" x2="9" y2="12" />

//                         </svg>

//                         Logout

//                     </button>

//                 </div>

//             </div>

//         </div>

//     );

// }



// const iconBox = {

//     width: 42,

//     height: 42,

//     minWidth: 42,

//     borderRadius: 12,

//     background: P.surfaceWarm,

//     color: P.textAmber,

//     display: "flex",

//     alignItems: "center",

//     justifyContent: "center",

// };



// const labelStyle = {

//     fontSize: 11,

//     color: P.textMuted,

//     fontWeight: 600,

//     marginBottom: 4,

// };



// const valueStyle = {

//     fontSize: 15,

//     color: P.textPrimary,

//     fontWeight: 600,

//     wordBreak: "break-word",

// };

