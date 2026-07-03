import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import P from "../theme/colors";

export default function DeviceHub() {
    const navigate = useNavigate();

    // const role = localStorage.getItem("role");

    const username = localStorage.getItem("vendorName");

    const handleLogout = () => {

  const loginType =
    localStorage.getItem("loginType");

  localStorage.clear();

  if (loginType === "vendor") {

    navigate("/vendor-login");

  } else {

    navigate("/login");
  }
};
    return (
        <div
            style={{
                minHeight: "100vh",
                background: P.bg,
                padding: 30,
                display: "flex",
                flexDirection: "column",
                boxSizing: "border-box"
            }}
        >
            {/* PAGE CONTENT */}
            <div style={{ flex: 1, width: "100%", maxWidth: 450, margin: "0 auto" }}>

                <Header />

                {/* WELCOME */}
                <div
                    style={{
                        marginBottom: 50,
                    }}
                >
                    <h1
                        style={{
                            fontSize: 34,
                            fontWeight: 800,
                            marginBottom: 8,
                            color: P.textPrimary,
                        }}
                    >
                        Welcome {username}
                    </h1>

                    <div
                        style={{
                            color: P.textSecond,
                            fontSize: 16,
                        }}
                    >
                        
                    </div>
                </div>

                {/* ACTION BUTTONS */}
                <div
                    style={{
                        display: "grid",
                        gap: 20,
                        maxWidth: 450,
                    }}
                >

                    <button
                        onClick={() =>
                            navigate("/register-device")
                        }
                        style={buttonStyle}
                    >
                        Register Device
                    </button>

                    <button
                        onClick={() =>
                            navigate("/my-devices")
                        }
                        style={buttonStyle}
                    >
                        My Devices
                    </button>
                </div>
            </div>

            {/* LOGOUT BUTTON AT BOTTOM */}
            <div
                style={{
                    width: "100%",
                    maxWidth: 450,
                    margin: "20px auto 0",
                }}
            >
                <button
                    onClick={handleLogout}
                    style={logoutStyle}
                >
                    Logout
                </button>
            </div>
        </div>
    );
}

const buttonStyle = {
    padding: "22px",
    border: "none",
    borderRadius: 18,
    background: `linear-gradient(135deg, ${P.amber}, ${P.orange})`,
    color: P.surface,
    fontSize: 20,
    fontWeight: 700,
    cursor: "pointer",
    width: "100%",
};

const logoutStyle = {
    width: "100%",
    padding: "22px",
    background: P.red,
    border: "none",
    borderRadius: 18,
    color: P.surface,
    fontSize: 20,
    fontWeight: 700,
    cursor: "pointer",
    fontFamily:
        "'Source Sans Pro', sans-serif",
};