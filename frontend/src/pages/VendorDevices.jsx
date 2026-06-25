import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";

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
              "http://localhost:3000/api/devices/my-devices",
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
        background: "#FFFDF5",
        padding: "40px 20px",
      }}
    >
      <div
        style={{
          maxWidth: 900,
          margin: "0 auto",
        }}
      >

        <Header />

        {/* Page Heading */}
        <div
          style={{
            marginBottom: 30,
          }}
        >
          <h1
            style={{
              fontSize: 32,
              fontWeight: 800,
              marginBottom: 8,
            }}
          >
            My Devices
          </h1>

          <p
            style={{
              color: "#666",
            }}
          >
            All registered inverter devices
          </p>
        </div>

        {/* Loading */}
        {loading && (
          <div
            style={{
              background: "#fff",
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
                background: "#fff",
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
                  color: "#666",
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
            display: "grid",
            gap: 20,
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
  localStorage.setItem(
    "selectedVendorDevice",
    JSON.stringify(device)
  );
  navigate("/vendor");
}}
              style={{
                background: "#fff",
                borderRadius: 24,
                padding: 24,
                cursor: "pointer",
                transition: "0.25s",
                boxShadow:
                  "0 10px 30px rgba(0,0,0,0.08)",
              }}
            >

              {/* Top Row */}
              <div
                style={{
                  display: "flex",
                  justifyContent:
                    "space-between",
                  alignItems:
                    "center",
                  marginBottom: 16,
                }}
              >
                <h3
                  style={{
                    margin: 0,
                    fontSize: 20,
                    fontWeight: 700,
                  }}
                >
                  Device #{device.id}
                </h3>

                <div
                  style={{
                    padding:
                      "8px 14px",
                    borderRadius: 999,
                    color: "white",
                    fontWeight: 700,
                    fontSize: 13,
                    background:
                      "linear-gradient(135deg,#FFB84D,#FF6B6B)",
                  }}
                >
                  Active
                </div>
              </div>

              {/* IMEI */}
              <div
                style={{
                  marginBottom: 12,
                }}
              >
                <div
                  style={{
                    fontSize: 13,
                    color: "#888",
                  }}
                >
                  IMEI
                </div>

                <div
                  style={{
                    fontWeight: 700,
                    fontSize: 16,
                  }}
                >
                  {device.imei}
                </div>
              </div>

              {/* Solution */}
              <div>
                <div
                  style={{
                    fontSize: 13,
                    color: "#888",
                  }}
                >
                  Solution Type
                </div>

                <div
                  style={{
                    fontWeight: 600,
                    color: "#444",
                  }}
                >
                  {device.solution}
                </div>
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
            onClick={() =>
              navigate("/devices")
            }
            style={{
              width: "100%",
              padding: 14,
              border: "none",
              borderRadius: 14,
              cursor: "pointer",
              fontWeight: 700,
              fontSize: 16,
              color: "#555",
              background: "#fff",
              boxShadow:
                "0 4px 12px rgba(0,0,0,0.08)",
            }}
          >
            ← Back to Device Hub
          </button>
        </div>

      </div>
    </div>
  );
}