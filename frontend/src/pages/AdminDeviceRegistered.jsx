// =====================================================
// ADMIN DEVICE REGISTERED (SUCCESS SCREEN)
//
// Confirmation screen for an admin-registered device.
// =====================================================

import { useLocation, useNavigate } from "react-router-dom";
import P from "../theme/colors";

export default function AdminDeviceRegistered() {
  const navigate = useNavigate();
  const location = useLocation();

  const device = location.state?.device;

  // If user opens this URL directly without registration data
  if (!device) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: P.bgGradient,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: 20,
          fontFamily: "'Inter', sans-serif",
        }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: 420,
            background: P.surface,
            borderRadius: 24,
            padding: 32,
            textAlign: "center",
            boxShadow: P.shadowCardLg,
          }}
        >
          <h2
            style={{
              color: P.textPrimary,
              marginBottom: 10,
            }}
          >
            Device Not Found
          </h2>

          <p
            style={{
              color: P.textMuted,
              marginBottom: 24,
            }}
          >
            No recently registered device was found.
          </p>

          <button
            onClick={() => navigate("/admin/devices")}
            style={{
              width: "100%",
              padding: "14px 16px",
              border: "none",
              borderRadius: 50,
              cursor: "pointer",
              fontWeight: 700,
              fontSize: 15,
              color: P.textWhite,
              background: P.btnPrimary,
            }}
          >
            Go to Device Hub
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: P.bgGradient,
        padding: "120px 20px 40px",
        fontFamily: "'Inter', sans-serif",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 500,
          margin: "0 auto",
          background: P.surface,
          borderRadius: 24,
          padding: "36px 30px",
          boxShadow: P.shadowCardLg,
          border: `1px solid ${P.border}`,
        }}
      >
        {/* Success icon */}
        <div
          style={{
            width: 64,
            height: 64,
            margin: "0 auto 20px",
            borderRadius: "50%",
            background: P.surfaceSuccess,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <svg
            width="32"
            height="32"
            viewBox="0 0 24 24"
            fill="none"
            stroke={P.textSuccessMsg}
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>

        {/* Heading */}
        <h1
          style={{
            textAlign: "center",
            fontSize: 24,
            fontWeight: 700,
            color: P.textPrimary,
            marginBottom: 8,
            fontFamily: "'DM Sans', sans-serif",
          }}
        >
          Device Registered Successfully
        </h1>

        <p
          style={{
            textAlign: "center",
            color: P.textMuted,
            fontSize: 14,
            marginBottom: 30,
          }}
        >
          The device has been successfully registered.
        </p>

        {/* Device details */}
        <div
          style={{
            background: P.surfaceForm,
            borderRadius: 16,
            padding: 20,
          }}
        >
          {/* IMEI */}
          <div
            style={{
              paddingBottom: 16,
              marginBottom: 16,
              borderBottom: `1px solid ${P.border}`,
            }}
          >
            <div
              style={{
                fontSize: 12,
                color: P.textMuted,
                marginBottom: 6,
              }}
            >
              IMEI
            </div>

            <div
              style={{
                fontSize: 16,
                fontWeight: 600,
                color: P.textPrimary,
                wordBreak: "break-all",
              }}
            >
              {device.imei}
            </div>
          </div>

          {/* Solution */}
          <div
            style={{
              paddingBottom: 16,
              marginBottom: 16,
              borderBottom: `1px solid ${P.border}`,
            }}
          >
            <div
              style={{
                fontSize: 12,
                color: P.textMuted,
                marginBottom: 6,
              }}
            >
              Solution
            </div>

            <div
              style={{
                fontSize: 16,
                fontWeight: 600,
                color: P.textPrimary,
                wordBreak: "break-word",
              }}
            >
              {device.solution}
            </div>
          </div>

          {/* Device Version */}
          <div>
            <div
              style={{
                fontSize: 12,
                color: P.textMuted,
                marginBottom: 6,
              }}
            >
              Device Version
            </div>

            <div
              style={{
                fontSize: 16,
                fontWeight: 600,
                color: P.textPrimary,
              }}
            >
              {device.deviceVersion}
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div
          style={{
            marginTop: 24,
            display: "flex",
            flexDirection: "column",
            gap: 12,
          }}
        >
          {/* <button
            onClick={() => navigate("/admin/devices")}
            style={{
              width: "100%",
              padding: "14px 16px",
              border: "none",
              borderRadius: 50,
              cursor: "pointer",
              fontWeight: 700,
              fontSize: 15,
              color: P.textWhite,
              background: P.btnPrimary,
              boxShadow: P.shadowBtn,
            }}
          >
            Go to Device Hub
          </button> */}

          <button
            onClick={() => navigate("/admin/register-device")}
            style={{
              width: "100%",
              padding: "14px 16px",
              border: `1px solid ${P.border}`,
              borderRadius: 50,
              cursor: "pointer",
              fontWeight: 600,
              fontSize: 14,
              color: P.textWhite,
              background: P.btnPrimary,
            }}
          >
            Register Another Device
          </button>
        </div>
      </div>
      <div
        style={{
          position: "fixed",

          left: 30,

          bottom: "calc(36px + env(safe-area-inset-bottom))",

          zIndex: 1000,
        }}
      >
        <button
          type="button"
          onClick={() => navigate("/admin/devices")}
          aria-label="Back to dashboard"
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

            WebkitTapHighlightColor: "transparent",
          }}
        >
          ←
        </button>
      </div>
    </div>
  );
}
