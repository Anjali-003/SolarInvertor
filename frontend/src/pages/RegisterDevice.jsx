import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ErrorMessage from "../components/ErrorMessage";
import ImeiInput from "../components/ImeiInput";
import P from "../theme/colors";

export default function RegisterDevice() {
  const navigate = useNavigate();

  const [imei, setImei] = useState("");
  const [deviceVersion, setDeviceVersion] = useState("");
  const [solution, setSolution] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate IMEI
    if (!/^\d{15,16}$/.test(imei)) {
      setError(
        "IMEI must be 15 or 16 digits with no letters or symbols"
      );
      return;
    }

    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("vendorToken");

      const res = await fetch(
        "http://localhost:3000/api/certs/generate",
        // VPSCHANGE
                // "http://213.210.21.49:3001/api/certs/generate",

        "/api/certs/generate",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },

          body: JSON.stringify({
            imei,
            solution,
            deviceVersion,
          }),
        }
      );

      const data = await res.json();

      console.log("API RESPONSE:", data);

      if (!res.ok) {
        console.error("Backend error:", data);

        setError(
          data.details ||
            data.error ||
            "Device registration failed"
        );

        return;
      }

      console.log(
        "Device registration response:",
        data
      );

      navigate("/device-registered", {
        state: {
          device: data.device,
        },
      });
    } catch (err) {
      console.error(err);
      setError("Server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: P.bgGradient,
        fontFamily: "'Inter', sans-serif",

        display: "flex",
        flexDirection: "column",
        alignItems: "center",

        // Header starts from the top
        justifyContent: "flex-start",

        padding:
          "24px 20px 110px",

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
          maxWidth: 420,
          boxSizing: "border-box",

          background: P.surface,
          borderRadius: 24,

          padding:
            "18px 22px",

          marginBottom: 18,

          boxShadow:
            `${P.shadowCardLg}, ${P.shadowCard}`,

          border:
            `1px solid ${P.border}`,

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
            Register Device
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
            Add a new inverter device
          </p>
        </div>
      </div>

      {/* =====================================================
          REGISTRATION CARD
      ===================================================== */}
      <div
        style={{
          width: "100%",
          maxWidth: 420,
          boxSizing: "border-box",

          background: P.surface,
          borderRadius: 24,

          padding:
            "24px 22px",

          boxShadow:
            `${P.shadowCardLg}, ${P.shadowCard}`,

          border:
            `1px solid ${P.border}`,
        }}
      >
        {/* =================================================
            CARD HEADING
        ================================================= */}
        <div
          style={{
            marginBottom: 20,
          }}
        >
          <h2
            style={{
              margin: 0,

              fontSize: 20,
              fontWeight: 800,

              color: P.textPrimary,

              fontFamily:
                "'DM Sans', sans-serif",

              lineHeight: 1.2,
            }}
          >
            Device Details
          </h2>

          <p
            style={{
              margin: "5px 0 0",

              fontSize: 12,

              color: P.textMuted,

              fontFamily:
                "'Inter', sans-serif",

              lineHeight: 1.4,
            }}
          >
            Enter the details of your inverter device
          </p>
        </div>

        {/* =================================================
            ERROR MESSAGE
        ================================================= */}
        <ErrorMessage message={error} />

        {/* =================================================
            FORM
        ================================================= */}
        <form onSubmit={handleSubmit}>
          {/* =================================================
              IMEI
          ================================================= */}
          <div
            style={{
              marginBottom: 14,
            }}
          >
            <ImeiInput
              value={imei}
              onChange={(e) =>
                setImei(e.target.value)
              }
              placeholder="IMEI Number"
              required
              inputStyle={{
                width: "100%",

                padding: "15px 20px",

                borderRadius: 10,
                border: "none",

                background:
                  P.surfaceForm,

                fontSize: 14,

                fontFamily:
                  "'Inter', sans-serif",

                color: P.textPrimary,

                outline: "none",
                boxSizing: "border-box",
              }}
            />
          </div>
          {/* =================================================
              DEVICE VERSION
          ================================================= */}
          <div
            style={{
              marginBottom: 24,
            }}
          >
            <input
              type="text"
              placeholder="Device Version"
              value={deviceVersion}
              onChange={(e) =>
                setDeviceVersion(
                  e.target.value
                )
              }
              style={{
                width: "100%",

                padding: "15px 20px",

                borderRadius: 10,
                border: "none",

                background:
                  P.surfaceForm,

                fontSize: 14,

                fontFamily:
                  "'Inter', sans-serif",

                color: P.textPrimary,

                boxSizing: "border-box",
                outline: "none",
              }}
              required
            />
          </div>

          {/* =================================================
              SOLUTION
          ================================================= */}
          <div
            style={{
              marginBottom: 14,
            }}
          >
            <input
              type="text"
              placeholder="Device Type"
              value={solution}
              onChange={(e) =>
                setSolution(e.target.value)
              }
              style={{
                width: "100%",

                padding: "15px 20px",

                borderRadius: 10,
                border: "none",

                background:
                  P.surfaceForm,

                fontSize: 14,

                fontFamily:
                  "'Inter', sans-serif",

                color: P.textPrimary,

                boxSizing: "border-box",
                outline: "none",
              }}
              required
            />
          </div>

          

          {/* =================================================
              REGISTER BUTTON
          ================================================= */}
          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",

              padding: "15px 16px",

              border: "none",
              borderRadius: 50,

              fontWeight: 700,
              fontSize: 16,

              cursor: loading
                ? "not-allowed"
                : "pointer",

              color: P.surface,

              opacity: loading
                ? 0.7
                : 1,

              background:
                P.btnPrimary,

              boxShadow:
                P.shadowBtn,

              fontFamily:
                "'DM Sans', sans-serif",

              letterSpacing: 0.3,
            }}
          >
            {loading
              ? "Registering..."
              : "Register Device"}
          </button>
        </form>
      </div>

      {/* =====================================================
          FIXED BACK BUTTON
          BOTTOM LEFT
      ===================================================== */}
      <div
        style={{
          position: "fixed",

          left: 30,

          bottom:
            "calc(36px + env(safe-area-inset-bottom))",

          zIndex: 1000,
        }}
      >
        <button
          type="button"
          onClick={() =>
            navigate("/devices")
          }
          aria-label="Back to dashboard"
          style={{
            width: 44,
            height: 44,

            borderRadius: "50%",

            border:
              `1px solid ${P.border}`,

            background:
              P.surface,

            display: "flex",
            alignItems: "center",
            justifyContent: "center",

            padding: 0,

            cursor: "pointer",

            color:
              P.textSecond,

            fontSize: 22,
            fontWeight: 500,

            lineHeight: 1,

            fontFamily:
              "'Inter', sans-serif",

            boxShadow:
              "0 4px 14px rgba(0, 0, 0, 0.16)",

            WebkitTapHighlightColor:
              "transparent",
          }}
        >
          ←
        </button>
      </div>
    </div>
  );
}
