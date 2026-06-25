import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useInverter } from "../context/Context";
import Header from "../components/Header";
import Footer from "../components/Footer";
import DeviceInfo from "../components/DeviceInfo";
import P from "../theme/colors";

export default function User() {

    const navigate = useNavigate();

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
                            "http://localhost:3000/api/profile",
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

    // LOGOUT
    const handleLogout = () => {

        localStorage.clear();

        navigate("/login");
    };

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
            }}
        >

            {/* HEADER */}
            {/* <Header
                data={data}
                lastUpdated={lastUpdated}
            /> */}
            <Header />

            <DeviceInfo
                data={data}
                lastUpdated={lastUpdated}
            />

            {/* PAGE CONTENT */}
            <div
                style={{
                    paddingTop: 12,
                    paddingLeft: 16,
                    paddingRight: 16,
                }}
            >

                {/* USER CONTAINER */}
                <div
                    style={{
                        background: P.surface,
                        border: `1px solid ${P.border}`,
                        borderRadius: 18,
                        padding: "24px",
                        boxShadow:
                            "0 2px 8px rgba(0,0,0,0.06)",
                    }}
                >

                    {/* TITLE */}
                    <div
                        style={{
                            fontSize: 24,
                            fontWeight: 700,
                            color: P.textPrimary,
                            marginBottom: 24,
                            fontFamily:
                                "'Source Sans Pro', sans-serif",
                        }}
                    >
                        User Profile
                    </div>

                    {/* USER NAME */}
                    <div style={{ marginBottom: 20 }}>
                        <div
                            style={{
                                fontSize: 14,
                                color: P.textMuted,
                                marginBottom: 6,
                                fontFamily:
                                    "'Source Sans Pro', sans-serif",
                            }}
                        >
                            User Name
                        </div>

                        <div
                            style={{
                                fontSize: 20,
                                fontWeight: 700,
                                color: P.textPrimary,
                                fontFamily:
                                    "'Source Sans Pro', sans-serif",
                            }}
                        >
                            {userProfile?.name
                                || "--"}
                        </div>
                    </div>

                    {/* EMAIL */}
                    <div style={{ marginBottom: 20 }}>
                        <div
                            style={{
                                fontSize: 14,
                                color: P.textMuted,
                                marginBottom: 6,
                                fontFamily:
                                    "'Source Sans Pro', sans-serif",
                            }}
                        >
                            Email
                        </div>

                        <div
                            style={{
                                fontSize: 18,
                                fontWeight: 600,
                                color: P.textPrimary,
                                fontFamily:
                                    "'Source Sans Pro', sans-serif",
                            }}
                        >
                            {userProfile?.email
                                || "--"}
                        </div>
                    </div>

                    {/* PHONE */}
                    <div style={{ marginBottom: 20 }}>
                        <div
                            style={{
                                fontSize: 14,
                                color: P.textMuted,
                                marginBottom: 6,
                                fontFamily:
                                    "'Source Sans Pro', sans-serif",
                            }}
                        >
                            Phone Number
                        </div>

                        <div
                            style={{
                                fontSize: 18,
                                fontWeight: 600,
                                color: P.textPrimary,
                                fontFamily:
                                    "'Source Sans Pro', sans-serif",
                            }}
                        >
                            {userProfile?.phone
                                || "--"}
                        </div>
                    </div>

                    {/* REGISTERED SINCE */}
                    <div style={{ marginBottom: 30 }}>
                        <div
                            style={{
                                fontSize: 14,
                                color: P.textMuted,
                                marginBottom: 6,
                                fontFamily:
                                    "'Source Sans Pro', sans-serif",
                            }}
                        >
                            Registered Since
                        </div>

                        <div
                            style={{
                                fontSize: 18,
                                fontWeight: 600,
                                color: P.textPrimary,
                                fontFamily:
                                    "'Source Sans Pro', sans-serif",
                            }}
                        >
                            {userProfile?.created_at
                                ? new Date(
                                    userProfile.created_at
                                ).toLocaleDateString()
                                : "--"}
                        </div>
                    </div>

                    {/* LOGOUT BUTTON */}
                    <button
                        onClick={handleLogout}
                        style={{
                            width: "100%",
                            padding: "14px",
                            background: "#EF4444",
                            border: "none",
                            borderRadius: 12,
                            color: "#fff",
                            fontSize: 16,
                            fontWeight: 700,
                            cursor: "pointer",
                            fontFamily:
                                "'Source Sans Pro', sans-serif",
                        }}
                    >
                        Logout
                    </button>
                </div>
            </div>

            {/* FOOTER */}
            <Footer data={data} />
        </div>
    );
}