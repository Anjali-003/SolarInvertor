import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import P from "../theme/colors";

export default function VendorDevices() {

  const [devices, setDevices] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const navigate =
    useNavigate();

  useEffect(() => {

    const loadDevices =
      async () => {

        try {

          const token =
            localStorage.getItem(
              "vendorToken"
            );

          const res =
            await fetch(
              // "http://localhost:3000/api/devices/my-devices",
              "/api/devices/my-devices",
              {
                headers: {
                  Authorization:
                    `Bearer ${token}`
                }
              }
            );

          const data =
            await res.json();

          console.log(data);

          if (Array.isArray(data)) {
            setDevices(data);
          }

        } catch (err) {

          console.error(err);

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
            padding: "32px 20px 40px",
            fontFamily: "'Inter', sans-serif",
          }}
    >
      <div
        style={{
          maxWidth: 480,
          margin: "0 auto",
        }}
      >

        <Header />

        {/* Page Heading */}
        <div
          style={{
            marginBottom: 25,
          }}
        >
          <h1
            style={{
              fontSize: 32,
              fontWeight: 800,
              color: P.textPrimary,
              fontFamily: "'DM Sans', sans-serif",
              textAlign: "center",
              marginBottom: 2,
            }}
          >
            My Devices
          </h1>

          <p
            style={{
              fontSize: 13,
                color: P.amber,
                fontFamily: "'Inter', sans-serif",
                textAlign: "center",
                fontStyle: "italic",
                marginTop: 0,
                marginBottom: 20,
            }}
          >
            All registered inverter devices
          </p>
        </div>

        {/* Loading */}
        {loading && (
          <div
            style={{
              background: P.surface,
              padding: 30,
              borderRadius: 24,
              textAlign: "center",
              boxShadow:
                "0 10px 30px rgba(0,0,0,0.08)",
            }}
          >
            Loading devices...
          </div>
        )}

        {/* Empty State */}
        {!loading &&
          devices.length === 0 && (
            <div
              style={{
                background: P.surface,
                padding: 40,
                borderRadius: 24,
                textAlign: "center",
                boxShadow:
                  "0 10px 30px rgba(0,0,0,0.08)",
              }}
            >
              <h3>
                No devices found
              </h3>

              <p
                style={{
                  color: P.textLight,
                }}
              >
                Register your first
                inverter device.
              </p>
            </div>
          )}

        {/* Device Cards */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 16,
            marginBottom: 24,
          }}
        >

          {devices.map(device => (

            <div
              key={device.id}
            //   onClick={() =>
            //     navigate(
            //     //   `/device/${device.id}`
            //     `/vendor/device/${device.id}/power`
            //     )
            //   }

              onClick={() => {
                localStorage.setItem("selectedVendorDevice", JSON.stringify(device));
                navigate("/vendor");
              }}
              style={{
                background: P.surface,
                borderRadius: 18,
                padding: "18px 18px 18px 20px",
                boxShadow: "0 2px 12px rgba(0,0,0,0.07)",
                border: `1px solid ${P.border}`,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: 12,
                position: "relative",
                overflow: "hidden",
              }}
            >
              {/* LEFT — text content */}
              <div style={{ flex: 1, minWidth: 0 }}>

                {/* Active badge */}
                <div
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    background: P.amber,
                    color: P.surface,
                    fontSize: 11,
                    fontWeight: 700,
                    padding: "3px 10px",
                    borderRadius: 20,
                    marginBottom: 10,
                    fontFamily: "'Inter', sans-serif",
                  }}
                >
                  Active
                </div>

                {/* Device ID */}
                <div style={{ marginBottom: 10 }}>
                  <span
                    style={{
                      fontSize: 15,
                      fontWeight: 1000,
                      color: P.textPrimary,
                      fontFamily: "'DM Sans', sans-serif",
                    }}
                  >
                    Device ID: {device.id}
                  </span>
                </div>

                {/* IMEI */}
                <div style={{ marginBottom: 10 }}>
                  <div
                    style={{
                      fontSize: 11,
                      fontWeight: 1000,
                      color: P.textMuted,
                      fontFamily: "'Inter', sans-serif",
                      marginBottom: 1,
                    }}
                  >
                    IMEI
                  </div>
                  <div
                    style={{
                      fontSize: 13,
                      fontWeight: 500,
                      color: P.textSecond,
                      fontFamily: "'Inter', sans-serif",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {device.imei}
                  </div>
                </div>

                {/* Solution Type */}
                <div>
                  <div
                    style={{
                      fontSize: 13,
                      fontWeight: 1000,
                      color: P.textMuted,
                      fontFamily: "'Inter', sans-serif",
                      marginBottom: 1,
                    }}
                  >
                    Solution Type
                  </div>
                  <div
                    style={{
                      fontSize: 13,
                      fontWeight: 500,
                      color: P.textSecond,
                      fontFamily: "'Inter', sans-serif",
                      textTransform: "capitalize",
                    }}
                  >
                    {device.solution || "—"}
                  </div>
                </div>
              </div>

              {/* RIGHT — solar panel image */}
              <div
                style={{
                  flexShrink: 0,
                  width: 170,
                  height: 100,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <img
                  src="/src/assets/solar-panel.png"
                  alt="Solar Panel"
                  style={{
                    width: 220,
                    height: 180,
                    objectFit: "contain",
                  }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Back Button */}
        <div
          style={{
            marginTop: 25,
          }}
        >
          <button
    onClick={() => navigate("/devices")}
    style={{
      width: "100%",
      padding: "14px 16px",
      border: `1px solid ${P.border}`,
      borderRadius: 50,
      cursor: "pointer",
      fontWeight: 600,
      fontSize: 14,
      color: P.textSecond,
      background: P.surface,
      fontFamily: "'Inter', sans-serif",
      boxShadow: P.shadowCard,
    }}
  >
    ← Back to Device Hub
  </button>
        </div>

      </div>
    </div>
  );
}