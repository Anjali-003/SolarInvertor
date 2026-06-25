import { useNavigate } from "react-router-dom";
import Header from "../components/Header";

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
                // minHeight: "100vh",
                height: "100vh",
                overflow: "hidden",
                background: "#FFFDF5",
                padding: 30,
                display: "flex",
                flexDirection: "column",
                boxSizing: "border-box"
            }}
        >
            {/* PAGE CONTENT */}
            <div style={{ flex: 1 }}>

                <Header />

                {/* WELCOME */}
                <div
                    style={{
                        marginBottom: 40,
                    }}
                >
                    <h1
                        style={{
                            fontSize: 34,
                            fontWeight: 800,
                            marginBottom: 8,
                            color: "#2C1A06",
                        }}
                    >
                        Welcome {username}
                    </h1>

                    <div
                        style={{
                            color: "#7A5230",
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
                    position: "fixed",
                    bottom: 20,
                    left: 30,
                    right: 30,
                    maxWidth: 450,
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
    background:
        "linear-gradient(135deg,#FFB84D,#FF6B6B)",
    color: "white",
    fontSize: 20,
    fontWeight: 700,
    cursor: "pointer",
    width: "100%",
};

const logoutStyle = {
    width: "100%",
    padding: "22px",
    background: "#EF4444",
    border: "none",
    borderRadius: 12,
    color: "#fff",
    fontSize: 20,
    fontWeight: 700,
    cursor: "pointer",
    fontFamily:
        "'Source Sans Pro', sans-serif",
};