import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useInverter } from "../context/Context";
import Footer from "../components/Footer";
import DeviceInfo from "../components/DeviceInfo";
import P from "../theme/colors";
import PageHeader from "../components/PageHeader";

export default function User() {

    const navigate = useNavigate();
    const username        = localStorage.getItem("username");
    const email           = localStorage.getItem("email");
    const phone           = localStorage.getItem("phone");
    const registeredSince = localStorage.getItem("registeredSince");

    const handleLogout = () => {
        localStorage.clear();
        navigate("/login");
    };
    const { data, lastUpdated } = useInverter();

    const [userProfile, setUserProfile] = useState(null);

    // imei number stored after login
    const imei = localStorage.getItem("imei");

    console.log("📍 IMEI from localStorage:", imei);

    // FETCH USER PROFILE
    useEffect(() => {
        const token = localStorage.getItem("token");

        const fetchProfile =
            async () => {

                try {
                    

                    console.log("🔍 Fetching profile for:", imei);

                    // const res =
                    //     await fetch(
                    //         `http://localhost:3000/api/profile/${imei}`
                    //     );

                    const res =
                        // await fetch(
                        //     `http://localhost:3000/api/profile`
                        // );
                        await fetch(
                            // "http://localhost:3000/api/profile",
                            "/api/profile",

                            {
                                headers: {
                                    Authorization: `Bearer ${token}`
                                }
                            }
                        );

                    console.log("📊 Response status:", res.status);

                    const json =
                        await res.json();

                    console.log("📦 Profile data:", json);

                    if (!res.ok) {
                        console.error("API Error:", json);
                        return;
                    }

                    setUserProfile(json);

                } catch (err) {

                    console.error(
                        "❌ Failed to load profile",
                        err
                    );
                }
            };

        if (token) {
            fetchProfile();
        }

    }, []);

    // DEBUG: Log profile state
    useEffect(() => {
        console.log("👤 User Profile State:", userProfile);
    }, [userProfile]);

    return (
        <div
            style={{
                minHeight: "100vh",
                paddingBottom: "90px",
                background: P.bg,
                fontFamily: "'Inter', sans-serif",
            }}
        >
        <PageHeader
            title="PROFILE"
            backPath="/"
        />
            {/* HEADER */}
            {/* <Header
                data={data}
                lastUpdated={lastUpdated}
            /> */}

            {/* AMBER BANNER + AVATAR */}
            <div style={{ position: "relative", marginBottom: 60 }}>
                {/* Amber banner */}
                <div
                    style={{
                        background: P.btnPrimary,
                        height: 130,
                        margin: "20px 20px 0",
                        borderRadius: 16,
                    }}
                />
                {/* Avatar circle — overlaps the banner */}
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
                        border: "4px solid P.surface",
                        overflow: "hidden",
                        boxShadow: "0 4px 12px rgba(0,0,0,0.12)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >
                    {/* Default person icon if no photo */}
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

            {/* USER NAME */}
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
                {username || "--"}
            </div>

            {/* INFO CARD */}
            <div
                style={{
                    margin: "0 20px",
                    background: P.surface,
                    borderRadius: 16,
                    padding: "4px 0",
                    boxShadow: P.shadowCard,
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
                            color: "#",
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
                        {email || "--"}
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
                            color: "#",
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
                            fontWeight: 500,
                            color: P.textPrimary,
                            fontFamily: "'Inter', sans-serif",
                        }}
                    >
                        {phone || "--"}
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
                            color: "#",
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
                        {registeredSince || "--"}
                    </div>
                </div>
            </div>

            {/* LOGOUT BUTTON */}
            <div style={{ margin: "20px 20px" }}>
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
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                        <polyline points="16 17 21 12 16 7" />
                        <line x1="21" y1="12" x2="9" y2="12" />
                    </svg>
                    Logout
                </button>
            </div>

            {/* FOOTER */}
            <Footer data={data} />
        </div>
    );
}