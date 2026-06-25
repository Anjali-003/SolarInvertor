import React from "react";
import P from "../theme/colors";

export default function Header() {
  return (
    <div
      style={{
        background: "transparent",
        padding: "20px 24px",
      }}
    >
      <div
        style={{
          padding: "16px 22px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 1,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 20,
          }}
        >
          {/* LOGO */}
          <div
            style={{
              width: 90,
              height: 90,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <img
              src="src/assets/logo.png"
              alt="Logo"
              style={{
                width: 95,
                height: 95,
                objectFit: "cover",
                transform: "scale(1.18)",
              }}
            />
          </div>

          {/* TITLE */}
          <div>
            <div
              style={{
                fontSize: 26,
                fontWeight: 900,
                color: P.textPrimary,
                lineHeight: 1,
                letterSpacing: -0.8,
                fontFamily:
                  "'Source Sans Pro', sans-serif",
              }}
            >
              SOLAR INVERTER
            </div>

            <div
              style={{
                fontSize: 36,
                fontWeight: 900,
                background:
                  "linear-gradient(135deg,#FFB84D,#FF6B6B)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                lineHeight: 1.1,
                letterSpacing: -0.8,
                fontFamily:
                  "'Source Sans Pro', sans-serif",
              }}
            >
              Monitor
            </div>

            <div
              style={{
                marginTop: 4,
                fontSize: 14,
                fontWeight: 600,
                color: P.textPrimary,
                letterSpacing: 0.4,
                textTransform: "uppercase",
                fontFamily:
                  "'Source Sans Pro', sans-serif",
              }}
            >
              SunPower. Simplified.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}