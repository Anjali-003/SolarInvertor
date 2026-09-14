// =====================================================
// ADMIN DEVICES (ALL DEVICES)
//
// Shows every registered device.
// =====================================================

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import P from "../theme/colors";

export default function AdminDevices() {
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const loadDevices = async () => {
        try {
            setLoading(true);

            const token = localStorage.getItem("adminToken");

            if (!token) {
                console.error("No admin token found");

                setDevices([]);
                return;
            }

            const res = await fetch(
                "http://localhost:3000/api/admin/devices",
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const data = await res.json();

            console.log("Admin devices response:", {
                status: res.status,
                data,
            });

            if (!res.ok) {
                throw new Error(
                    data?.error ||
                    `Request failed with status ${res.status}`
                );
            }

            if (!Array.isArray(data)) {
                throw new Error(
                    "Invalid devices response from server"
                );
            }

            setDevices(data);

        } catch (err) {
            console.error(
                "Failed to load devices:",
                err
            );

            setDevices([]);

        } finally {
            setLoading(false);
        }
    };

    loadDevices();
}, []);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: P.bgGradient,
        fontFamily: "'Inter', sans-serif",
        paddingBottom: 110, // space for fixed bottom button
      }}
    >
      <div
        style={{
           width: "100%",
      maxWidth: 420,
      margin: "0 auto",
      padding: "20px 20px 110px",
      boxSizing: "border-box",
        }}
      >
      {/* =====================================================
          HEADER CARD
          LOGO + TITLE
      ===================================================== */}
      <div
        style={{
           width: "100%",
        boxSizing: "border-box",
        background: P.surface,
        borderRadius: 24,
        padding: "18px 22px",
        marginBottom: 18,
        boxShadow: `${P.shadowCardLg}, ${P.shadowCard}`,
        border: `1px solid ${P.border}`,
        display: "flex",
        alignItems: "center",
        gap: 18,
        }}
      >
        {/* LOGO */}
        <div
          style={{
            width: 76,
            height: 76,

            flexShrink: 0,

            display: "flex",
            alignItems: "center",
            justifyContent: "center",

            borderRadius: 14,
          }}
        >
          <img
            src="/src/assets/logo.png"
            alt="Company Logo"
            style={{
              width: 116,
              height: 116,
              objectFit: "contain",
            }}
          />
        </div>

        {/* TITLE + SUBTITLE */}
        <div
          style={{
            flex: 1,
            minWidth: 0,
          }}
        >
          <h1
            style={{
              margin: 0,

              fontSize: 26,
              fontWeight: 800,

              color: P.textPrimary,

              fontFamily:
                "'DM Sans', sans-serif",

              lineHeight: 1.15,
            }}
          >
              All Devices
          </h1>

          <p
            style={{
              margin: "5px 0 0",

              fontSize: 13,

              color: P.amber,

              fontFamily:
                "'Inter', sans-serif",

              lineHeight: 1.3,
            }}
          >
              All registered inverter devices
          </p>
        </div>
      </div>

        {/* =====================================================
            LOADING
        ===================================================== */}
        {loading && (
          <div
            style={{
              background: P.surface,
              padding: 30,
              borderRadius: 24,
              textAlign: "center",
              boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
              color: P.textSecond,
              fontSize: 14,
            }}
          >
            Loading devices...
          </div>
        )}

        {/* =====================================================
            EMPTY STATE
        ===================================================== */}
        {!loading && devices.length === 0 && (
          <div
            style={{
              background: P.surface,
              padding: 40,
              borderRadius: 24,
              textAlign: "center",
              boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
            }}
          >
            <h3
              style={{
                margin: "0 0 8px",
                color: P.textPrimary,
                fontFamily: "'DM Sans', sans-serif",
              }}
            >
              No devices found
            </h3>

          
          </div>
        )}

        {/* =====================================================
            DEVICE LIST
        ===================================================== */}
        {!loading && devices.length > 0 && (
          <div
            style={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        gap: 16,

              // Extra bottom space so last card is never hidden
              // behind the fixed button.
              paddingBottom: 30,
            }}
          >
            
            {devices.map((device) => (
              <div
                key={device.id}
                onClick={() => {
                  localStorage.setItem(
                    "selectedAdminDevice",
                    JSON.stringify(device)
                  );

                  navigate("/admin/devices/dashboard");
                }}
                style={{
  width: "100%",
  boxSizing: "border-box",

  background: P.surface,
  borderRadius: 18,
  padding: "20px 18px",

  boxShadow: "0 2px 12px rgba(0,0,0,0.07)",
  border: `1px solid ${P.border}`,

  cursor: "pointer",

  display: "flex",
  alignItems: "center",
  gap: 12,

  position: "relative",
  overflow: "hidden",

                  transition: "transform 0.15s ease",
                }}
                onMouseDown={(e) => {
                  e.currentTarget.style.transform = "scale(0.99)";
                }}
                onMouseUp={(e) => {
                  e.currentTarget.style.transform = "scale(1)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "scale(1)";
                }}
              >
                {/* =================================================
                    LEFT — DEVICE DETAILS
                ================================================= */}
                <div
                  style={{
                       flex: "1 1 0",
    minWidth: 0,
    maxWidth: "100%",
    overflow: "hidden",
                  }}
                >
                  {/* ACTIVE BADGE */}
                  <div
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 6,

                      background: P.amber,
                      color: P.surface,

                      fontSize: 11,
                      fontWeight: 700,

                      padding: "4px 10px",
                      borderRadius: 20,

                      marginBottom: 14,

                      fontFamily: "'Inter', sans-serif",
                    }}
                  >
                    <span
                      style={{
                        width: 6,
                        height: 6,
                        borderRadius: "50%",
                        background: "#FFFFFF",
                      }}
                    />

                    Active
                  </div>

                  {/* IMEI */}
                  <div
                    style={{
                      marginBottom: 12,
                    }}
                  >
                    <div
                      style={{
                        fontSize: 16,
                        fontWeight: 800,
                        color: P.textSecond,
                        fontFamily: "'Inter', sans-serif",
                        marginBottom: 3,
                      }}
                    >
                      IMEI
                    </div>

                    <div
  style={{
    fontSize: 18,
    fontWeight: 500,
    color: P.textMuted,
    fontFamily: "'Inter', sans-serif",

    width: "100%",
    maxWidth: "100%",

    overflowWrap: "anywhere",
    wordBreak: "break-word",

    lineHeight: 1.4,
  }}
>
  {device.imei || "—"}
</div>
                  </div>

                  {/* SOLUTION TYPE */}
                  <div>
                    <div
                      style={{
                        fontSize: 16,
                        fontWeight: 800,
                        color: P.textSecond,
                        fontFamily: "'Inter', sans-serif",
                        marginBottom: 3,
                      }}
                    >
                      Solution Type
                    </div>

                    <div
                      style={{
                        fontSize: 18,
                        fontWeight: 500,
                        color: P.textMuted,
                        fontFamily: "'Inter', sans-serif",
                        textTransform: "capitalize",
                      }}
                    >
                      {device.solution || "—"}
                    </div>
                  </div>
                </div>

                {/* =================================================
                    RIGHT — SOLAR PANEL IMAGE
                ================================================= */}
                <div
  style={{
    flex: "0 0 clamp(85px, 28vw, 125px)",
    height: 105,

    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  }}
>
  <img
    src="/src/assets/solar-panel.png"
    alt="Solar Panel"
    style={{
      width: "100%",
      maxWidth: 125,
      height: "auto",
      objectFit: "contain",
    }}
  />
</div>

                {/* RIGHT ARROW */}
                <div
                  style={{
                    position: "absolute",
                    right: 10,
                    bottom: 8,

                    fontSize: 18,
                    color: P.amber,
                    fontWeight: 700,
                  }}
                >
                  →
                </div>
              </div>
            ))}
          </div>
        )}

      {/* BACK BUTTON — FIXED BOTTOM LEFT */}
<div
  style={{
    position: "fixed",
    left: 35,
    bottom: "calc(36px + env(safe-area-inset-bottom))",
    zIndex: 1000,
  }}
>
  <button
    onClick={() => navigate("/admin")}
    aria-label="Back to admin home"
    style={{
      width: 44,
      height: 44,
      borderRadius: "50%",

      border: `1px solid ${P.border}`,
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
      fontFamily: "'Inter', sans-serif",

      boxShadow: "0 4px 14px rgba(0, 0, 0, 0.16)",

      // Makes sure the button remains easy to tap
      WebkitTapHighlightColor: "transparent",
    }}
  >
    ←
  </button>
</div>
      </div>
    </div>
  );
}
