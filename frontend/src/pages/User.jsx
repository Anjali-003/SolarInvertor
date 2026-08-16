// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { useInverter } from "../context/Context";
// import Footer from "../components/Footer";
// import DeviceInfo from "../components/DeviceInfo";
// import P from "../theme/colors";
// import PageHeader from "../components/PageHeader";

// export default function User() {

//     const navigate = useNavigate();
//     const username        = localStorage.getItem("username");
//     const email           = localStorage.getItem("email");
//     const phone           = localStorage.getItem("phone");
//     const registeredSince = localStorage.getItem("registeredSince");

//     const handleLogout = () => {
//         localStorage.clear();
//         navigate("/login");
//     };
//     const { data, lastUpdated } = useInverter();

//     const [userProfile, setUserProfile] = useState(null);

//     // imei number stored after login
//     const imei = localStorage.getItem("imei");

//     console.log("📍 IMEI from localStorage:", imei);

//     // FETCH USER PROFILE
//     useEffect(() => {
//         const token = localStorage.getItem("token");

//         const fetchProfile =
//             async () => {

//                 try {
                    

//                     console.log("🔍 Fetching profile for:", imei);

//                     // const res =
//                     //     await fetch(
//                     //         `http://localhost:3000/api/profile/${imei}`
//                     //     );

//                     const res =
//                         // await fetch(
//                         //     `http://localhost:3000/api/profile`
//                         // );
//                         await fetch(
//                             "http://localhost:3000/api/profile",
//                             //VPSCHANGE
//                             // "/api/profile",

//                             {
//                                 headers: {
//                                     Authorization: `Bearer ${token}`
//                                 }
//                             }
//                         );

//                     console.log("📊 Response status:", res.status);

//                     const json =
//                         await res.json();

//                     console.log("📦 Profile data:", json);

//                     if (!res.ok) {
//                         console.error("API Error:", json);
//                         return;
//                     }

//                     setUserProfile(json);

//                 } catch (err) {

//                     console.error(
//                         "❌ Failed to load profile",
//                         err
//                     );
//                 }
//             };

//         if (token) {
//             fetchProfile();
//         }

//     }, []);

//     // DEBUG: Log profile state
//     useEffect(() => {
//         console.log("👤 User Profile State:", userProfile);
//     }, [userProfile]);

//     return (
//         <div
//             style={{
//                 minHeight: "100vh",
//                 paddingBottom: "90px",
//                 background: P.bg,
//                 fontFamily: "'Inter', sans-serif",
//             }}
//         >
//         <PageHeader
//             title="PROFILE"
//             backPath="/"
//         />
//             {/* HEADER */}
//             {/* <Header
//                 data={data}
//                 lastUpdated={lastUpdated}
//             /> */}

//             {/* AMBER BANNER + AVATAR */}
//             <div style={{ position: "relative", marginBottom: 60 }}>
//                 {/* Amber banner */}
//                 <div
//                     style={{
//                         background: P.btnPrimary,
//                         height: 130,
//                         margin: "20px 20px 0",
//                         borderRadius: 16,
//                     }}
//                 />
//                 {/* Avatar circle — overlaps the banner */}
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
//                         border: "4px solid P.surface",
//                         overflow: "hidden",
//                         boxShadow: "0 4px 12px rgba(0,0,0,0.12)",
//                         display: "flex",
//                         alignItems: "center",
//                         justifyContent: "center",
//                     }}
//                 >
//                     {/* Default person icon if no photo */}
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

//             {/* USER NAME */}
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
//                 {username || "--"}
//             </div>

//             {/* INFO CARD */}
//             <div
//                 style={{
//                     margin: "0 20px",
//                     background: P.surface,
//                     borderRadius: 16,
//                     padding: "4px 0",
//                     boxShadow: P.shadowCard,
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
//                             color: "#",
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
//                         {email || "--"}
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
//                             color: "#",
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
//                             fontWeight: 500,
//                             color: P.textPrimary,
//                             fontFamily: "'Inter', sans-serif",
//                         }}
//                     >
//                         {phone || "--"}
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
//                             color: "#",
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
//                         {registeredSince || "--"}
//                     </div>
//                 </div>
//             </div>

//             {/* LOGOUT BUTTON */}
//             <div style={{ margin: "20px 20px" }}>
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
//                     <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
//                         <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
//                         <polyline points="16 17 21 12 16 7" />
//                         <line x1="21" y1="12" x2="9" y2="12" />
//                     </svg>
//                     Logout
//                 </button>
//             </div>

//             {/* FOOTER */}
//             <Footer data={data} />
//         </div>
//     );
// }






import { useNavigate } from "react-router-dom";
import P from "../theme/colors";
import Footer from "../components/Footer";

export default function User() {
    const navigate = useNavigate();

    const username = localStorage.getItem("username");
    const email = localStorage.getItem("email");
    const phone = localStorage.getItem("phone");
    const registeredSince = localStorage.getItem("registeredSince");

    const handleLogout = () => {
        localStorage.clear();
        navigate("/login");
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
                    PROFILE HEADER
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

                        {/* USER NAME */}

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
                            {username || "User"}
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
                            User Account
                        </div>
                    </div>
                </div>


                {/* =================================================
                    ACCOUNT INFORMATION
                ================================================== */}

                <div
                    style={{
                        width: "100%",

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
                                {email || "--"}
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
                                {phone || "--"}
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
                                {formatDate(registeredSince)}
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
{/* 
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
                    onClick={() => navigate("/")}
                    aria-label="Back to home"
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

            </div> */}

            <Footer />

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