import React, { useState, useEffect, useRef } from "react";
import { Html5Qrcode } from "html5-qrcode";
import P from "../theme/colors";

export default function ImeiInput({ value, onChange, onValidationError, placeholder = "IMEI Number", inputStyle = {}, required = false }) {  const [scanning, setScanning] = useState(false);
  const scannerRef = useRef(null);
  const scannerId = "imei-qr-scanner";

  // Start camera scanner
  const startScanner = async () => {
    setScanning(true);
  };

  // Once scanning=true and div is mounted, initialize html5-qrcode
  useEffect(() => {
    if (!scanning) return;

    const html5QrCode = new Html5Qrcode(scannerId);
    scannerRef.current = html5QrCode;

    html5QrCode
      .start(
        { facingMode: "environment" }, // rear camera
        { fps: 10, qrbox: { width: 220, height: 220 } },
        (decodedText) => {
          // On successful scan: fill IMEI, stop scanner
          onChange({ target: { value: decodedText.trim() } });
          stopScanner();
        },
        () => {} // ignore per-frame errors silently
      )
      .catch((err) => {
        console.error("Camera error:", err);
        stopScanner();
      });

    return () => {
      // Cleanup if component unmounts while scanning
      if (scannerRef.current) {
        scannerRef.current.stop().catch(() => {});
      }
    };
  }, [scanning]);

  const stopScanner = () => {
    if (scannerRef.current) {
      scannerRef.current
        .stop()
        .then(() => {
          scannerRef.current = null;
          setScanning(false);
        })
        .catch(() => {
          scannerRef.current = null;
          setScanning(false);
        });
    } else {
      setScanning(false);
    }
  };

  return (
    <div style={{ width: "100%", boxSizing: "border-box" }}>
      {/* Input row with camera icon */}
      <div style={{ position: "relative", width: "100%" }}>
        <input
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          maxLength={16}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          required={required}
          style={{
            width: "100%",
            paddingRight: 44,
            boxSizing: "border-box",
            ...inputStyle,
          }}
        />

        {/* Camera icon button */}
        <button
          type="button"
          onClick={scanning ? stopScanner : startScanner}
          title={scanning ? "Close scanner" : "Scan QR code"}
          style={{
            position: "absolute",
            right: 10,
            top: "50%",
            transform: "translateY(-50%)",
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: scanning ? P.errorRed : P.textIcon,
          }}
        >
          {scanning ? (
            // X icon when scanner is open
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          ) : (
            // Camera icon
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
              <circle cx="12" cy="13" r="4"/>
            </svg>
          )}
        </button>
      </div>

      {/* QR Scanner viewport — only mounted when scanning */}
      {scanning && (
        <div
          style={{
            marginTop: 10,
            borderRadius: 10,
            overflow: "hidden",
            border: `1px solid ${P.border}`,
            background: "#000",
          }}
        >
          {/* html5-qrcode mounts the camera feed into this div */}
          <div id={scannerId} style={{ width: "100%" }} />

          <div
            style={{
              background: P.textDark,
              color: P.surface,
              fontSize: 12,
              textAlign: "center",
              padding: "6px 0",
            }}
          >
            Point camera at QR code — auto-fills on detect
          </div>
        </div>
      )}
    </div>
  );
}