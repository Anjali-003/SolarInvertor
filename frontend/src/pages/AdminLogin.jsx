import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";
import logo from "../assets/logo.png";

export default function AdminLogin() {

    const navigate = useNavigate();

    const [email, setEmail] = useState("");

    const [password, setPassword] = useState("");

    const [loading, setLoading] = useState(false);

    const [error, setError] = useState("");

    const handleLogin = async (e) => {

        e.preventDefault();

        try {

            setLoading(true);

            setError("");

            const { data } = await api.post(

                "/admin/login",

                {

                    email,

                    password

                }

            );

            localStorage.setItem(

                "adminToken",

                data.token

            );

            localStorage.setItem(

                "adminName",

                data.admin.name

            );

            localStorage.setItem(

                "adminEmail",

                data.admin.email

            );

            navigate("/admin");

        }

        catch (err) {

            if (err.response) {

                setError(

                    err.response.data.error ||

                    "Login failed"

                );

            }

            else {

                setError(

                    "Unable to connect to server."

                );

            }

        }

        finally {

            setLoading(false);

        }

    };

    return (

        <div
            style={{
                minHeight: "100vh",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                fontFamily: "'Segoe UI', sans-serif",
            }}
        >

            <div
                style={{
                    width: "100%",
                    maxWidth: 460,
                    padding: "55px 42px",
                    background: "rgba(255,255,255,0.75)",
                    backdropFilter: "blur(20px)",
                    borderRadius: 28,
                    border: "1px solid rgba(255,184,77,0.12)",
                    boxShadow: "0 18px 45px rgba(255,184,77,0.12)",
                }}
            >

                <div
                    style={{
                        textAlign: "center",
                        marginBottom: 30
                    }}
                >

                    <img
                        src={logo}
                        alt="logo"
                        style={{
                            width: 90,
                            marginBottom: 10
                        }}
                    />

                    <div
                        style={{
                            fontSize: 24,
                            fontWeight: 900,
                            color: "#1F2937"
                        }}
                    >
                        SOLAR INVERTER
                    </div>

                    <div
                        style={{
                            fontSize: 34,
                            fontWeight: 900,
                            background:
                                "linear-gradient(135deg,#FFB84D,#FF6B6B)",
                            WebkitBackgroundClip: "text",
                            WebkitTextFillColor: "transparent",
                        }}
                    >
                        Admin Portal
                    </div>

                </div>

                {

                    error && (

                        <div
                            style={{
                                background: "#FEE2E2",
                                color: "#B91C1C",
                                padding: 12,
                                borderRadius: 8,
                                marginBottom: 20
                            }}
                        >
                            {error}
                        </div>

                    )

                }

                <div
                    style={{
                        textAlign: "center",
                        fontSize: 20,
                        fontWeight: 600,
                        marginBottom: 25
                    }}
                >
                    Administrator Login
                </div>

                <form onSubmit={handleLogin}>

                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        style={inputStyle}
                    />

                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        style={inputStyle}
                    />

                    <button
                        type="submit"
                        disabled={loading}
                        style={buttonStyle}
                    >
                        {

                            loading

                                ? "Logging In..."

                                : "Login"

                        }
                    </button>

                </form>

            </div>

        </div>

    );

}

const inputStyle = {

    width: "100%",

    padding: "14px 16px",

    marginBottom: 14,

    border: "none",

    background: "#F3F4F6",

    borderRadius: 8,

    boxSizing: "border-box"

};

const buttonStyle = {

    width: "100%",

    padding: 14,

    background:
        "linear-gradient(135deg,#FFB84D,#FF6B6B)",

    border: "none",

    color: "#fff",

    fontWeight: 700,

    borderRadius: 8,

    cursor: "pointer",

    marginBottom: 20

};