import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";
import P from "../theme/colors";
import ErrorMessage from "../components/ErrorMessage";
import PasswordInput from "../components/PasswordInput";
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

            const { data } = await api.post("/admin/login", { email, password });

            localStorage.setItem("adminToken", data.token);
            localStorage.setItem("adminName", data.admin.name);
            localStorage.setItem("adminEmail", data.admin.email);

            navigate("/admin");

        } catch (err) {
            if (err.response) {
                setError(err.response.data.error || "Login failed");
            } else {
                setError("Unable to connect to server.");
            }
        } finally {
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
                    width: "95%",
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
                        display: "flex",
                        justifyContent: "center",
                        marginBottom: 14,
                    }}
                >
                    <img
                        src={logo}
                        alt="Logo"
                        style={{
                            width: 400,
                            height: 120,
                            objectFit: "contain",
                        }}
                    />
                </div>

                <div
                    style={{
                        textAlign: "center",
                        fontSize: 20,
                        fontWeight: 600,
                        marginBottom: 25,
                        color: P.textPrimary,
                    }}
                >
                    Administrator Login
                </div>

                <ErrorMessage message={error} />

                <form onSubmit={handleLogin}>

                    <div style={{ marginBottom: 14 }}>
                        <input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            style={inputStyle}
                        />
                    </div>

                    <div style={{ marginBottom: 20 }}>
                        <PasswordInput
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Password"
                            required
                            inputStyle={inputStyle}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        style={buttonStyle}
                    >
                        {loading ? "Logging In..." : "Login"}
                    </button>

                </form>
            </div>
        </div>
    );
}

const inputStyle = {
    width: "100%",
    padding: "14px 16px",
    border: "none",
    background: P.surfaceFaded,
    borderRadius: 8,
    boxSizing: "border-box",
    fontSize: 15,
};

const buttonStyle = {
    width: "100%",
    padding: 14,
    background: P.btnPrimary,
    border: "none",
    color: "white",
    fontWeight: 700,
    fontSize: 15,
    borderRadius: 50,
    cursor: "pointer",
    marginBottom: 20,
};