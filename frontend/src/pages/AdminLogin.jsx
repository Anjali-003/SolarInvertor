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
                background: P.bgGradient,
                fontFamily: "'Inter', sans-serif",
                padding: "24px 16px",
            }}
        >
            <div
                style={{
                        width: "95%",
                        maxWidth: 400,
                        padding: "36px 28px 32px",
                        background: P.surface,
                        borderRadius: 24,
                        border: `1px solid ${P.border}`,
                        boxShadow: P.shadowCardLg,
                    }}
            >
                <div
    style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 24,
    }}
>
    <img
        src={logo}
        alt="Logo"
        style={{
            width: 220,
            height: 90,
            objectFit: "contain",
        }}
    />
</div>

                <div
                    style={{
                        textAlign: "center",
                        fontSize: 22,
                        fontWeight: 700,
                        marginBottom: 24,
                        fontFamily: "'DM Sans', sans-serif",
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
    padding: "15px 20px",
    border: "none",
    background: P.surfaceForm,
    borderRadius: 10,
    boxSizing: "border-box",
    fontSize: 14,
    fontFamily: "'Inter', sans-serif",
    color: P.textPrimary,
    outline: "none",
};

const buttonStyle = {
    width: "100%",
    padding: "15px 16px",
    background: P.btnPrimary,
    border: "none",
    color: P.textWhite,
    fontSize: 16,
    fontWeight: 700,
    borderRadius: 50,
    cursor: "pointer",
    marginBottom: 14,
    boxShadow: P.shadowBtn,
    fontFamily: "'DM Sans', sans-serif",
    letterSpacing: 0.3,
};