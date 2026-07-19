import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import ErrorMessage from "../components/ErrorMessage";
import ImeiInput from "../components/ImeiInput";
import P from "../theme/colors";

export default function RegisterDevice() {
  const navigate = useNavigate();

  const [imei, setImei] =
    useState("");
  const [deviceVersion, setDeviceVersion] = useState("");

  const [solutionType, setSolutionType] =
    useState("");

  // const [certData, setCertData] =
  //   useState(null);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  // const handleDownload = async (url, filename) => {
  //   try {
  //     const token = localStorage.getItem("vendorToken");
  //     const res = await fetch(`http://localhost:3000${url}`, {
  //       headers: {
  //         Authorization: `Bearer ${token}`
  //       }
  //     });

  //     if (!res.ok) throw new Error("Download failed");

  //     const blob = await res.blob();
  //     const downloadUrl = window.URL.createObjectURL(blob);
  //     const a = document.createElement("a");
  //     a.href = downloadUrl;
  //     a.download = filename;
  //     document.body.appendChild(a);
  //     a.click();
  //     window.URL.revokeObjectURL(downloadUrl);
  //     document.body.removeChild(a);
  //   } catch (err) {
  //     console.error("Download error:", err);
  //   }
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!/^\d{15,16}$/.test(imei)) {
      setError("IMEI must be 15 or 16 digits with no letters or symbols");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("vendorToken");

      const res =
        await fetch(
          // "http://localhost:3000/api/certs/generate",
                    "/api/certs/generate",

          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",

              Authorization:
                `Bearer ${token}`,
            },

            body: JSON.stringify({
  imei,
  solution: solutionType,
  deviceVersion,
}),
          }
        );

      // const data =
      //   await res.json();

      // if (!res.ok) {

      //   setError(
      //     data.error ||
      //     "Certificate generation failed"
      //   );

      //   return;
      // }


      const data =
        await res.json();

      console.log(
        "API RESPONSE:",
        data
      );

      if (!res.ok) {

        console.error(
          "Backend error:",
          data
        );

        setError(
          data.details ||
          data.error ||
          "Certificate generation failed"
        );

        return;
      }

      // console.log(
      //   "Certificate response:",
      //   data
      // );

      // setCertData(data);

      console.log("Response:", data);
      navigate("/devices");

    } catch (err) {

      console.error(err);

      setError(
        "Server error"
      );

    } finally {

      setLoading(false);
    }
  };

  const downloadButton = {
    width: "100%",
    padding: 14,
    border: "none",
    borderRadius: 12,
    cursor: "pointer",
    fontWeight: 700,
    color: P.surface,
    background: P.btnPrimary,
  };

  return (
    <div
      style={{
  minHeight: "100vh",
  background: P.bgGradient,
  padding: "160px 40px 20px",
  fontFamily: "'Inter', sans-serif",
}}
    >
      <div
        style={{
          maxWidth: 420,
          margin: "0 auto",
          background: P.surface,
          borderRadius: 24,
          padding: "32px 28px",
          boxShadow: "P.shadowCardLg, P.shadowCard",
          border: "1px solid ${P.border}",
        }}
      >

        <div
          style={{
            background: P.surfaceFaded,
            borderRadius: 16,
            padding: "20px 16px",
            marginBottom: 24,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <img
            src="/src/assets/logo.png"
            alt="Logo"
            style={{
              width: 120,
              height: 72,
              objectFit: "contain",
            }}
          />
        </div>

        <h1
          style={{
            fontSize: 22,
            fontWeight: 700,
            color: P.textPrimary,
            marginBottom: 6,
            fontFamily: "'DM Sans', sans-serif",
            textAlign: "center",
          }}
        >
          Register Device
        </h1>

        <p
          style={{
            color: P.textMuted,
            marginBottom: 24,
            fontSize: 13,
            textAlign: "center",
            fontFamily: "'Inter', sans-serif",
          }}
        >
          Add a new inverter device
        </p>

        <ErrorMessage message={error} />

        <form onSubmit={handleSubmit}>

          {/* IMEI */}
          <div
            style={{
              marginBottom: 14,
            }}
          >

            <ImeiInput
              value={imei}
              onChange={(e) => setImei(e.target.value)}
              placeholder="IMEI Number"
              required
              inputStyle={{
                padding: "15px 20px",
                borderRadius: 10,
                border: "none",
                background: P.surfaceForm,
                fontSize: 14,
                fontFamily: "'Inter', sans-serif",
                color: P.textPrimary,
                outline: "none",
              }}
            />
          </div>

          {/* Solution Type */}
          <div
            style={{
              marginBottom: 14,
              position: "relative",
            }}
          >
            {/* Custom dropdown arrow */}
            <svg
              style={{
                position: "absolute",
                right: 18,
                top: "50%",
                transform: "translateY(-50%)",
                pointerEvents: "none",
                color: P.textMuted,
              }}
              width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
            >
              <polyline points="6 9 12 15 18 9" />
            </svg>
            <select

              value={solutionType}
              onChange={(e) => setSolutionType(e.target.value)}
              style={{
                width: "100%",
                padding: "15px 20px",
                borderRadius: 10,
                border: "none",
                background: P.surfaceForm,
                fontSize: 14,
                fontFamily: "'Inter', sans-serif",
                color: solutionType ? P.textPrimary : P.textMuted,
                outline: "none",
                appearance: "none",
                WebkitAppearance: "none",
                cursor: "pointer",
              }}
              required
            >
              <option value="">
                Select Solution Type
              </option>

              <option value="ongridrooftop">
                On Grid Rooftop
              </option>

              <option value="offgridrooftop">
                Off Grid Rooftop
              </option>

              <option value="hybridrooftop">
                Hybrid Grid Rooftop
              </option>
            </select>
          </div>

          <div
  style={{
    marginBottom: 24,
  }}
>
  <input
    type="text"
    placeholder="Device Version"
    value={deviceVersion}
    onChange={(e) => setDeviceVersion(e.target.value)}
    style={{
      width: "100%",
      padding: "15px 20px",
      borderRadius: 10,
      border: "none",
      background: P.surfaceForm,
      fontSize: 14,
      fontFamily: "'Inter', sans-serif",
      color: P.textPrimary,
      boxSizing: "border-box",
      outline: "none",
    }}
    required
  />
</div>

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
              cursor: loading ? "not-allowed" : "pointer",
              color: P.surface,
              opacity: loading ? 0.7 : 1,
              background: P.btnPrimary,
              boxShadow: P.shadowBtn,
              fontFamily: "'DM Sans', sans-serif",
              letterSpacing: 0.3,
            }}
          >
            {loading ? "Registering..." : "Register Device"}
          </button>
        </form>

        {/* Certificate Result */}
        {/* {certData && (
          <div
            style={{
              marginTop: 30,
              padding: 24,
              borderRadius: 20,
              background:
                P.surfaceWarm,
            }}
          >
            <h3>
              Certificate Generated ✅
            </h3>

            <p>
              Download your files
            </p>

            <div
              style={{
                display: "flex",
                flexDirection:
                  "column",
                gap: 12,
              }}
            > */}


{/* 

              <button
                style={downloadButton}
                onClick={() =>
                  downloadFile(
                    certData.downloads.certificate,
                    "device.crt"
                  )
                }
              >
                Download Certificate
              </button>
              <button
                style={downloadButton}
                onClick={() =>
                  downloadFile(
                    certData.downloads.private_key,
                    "device.key"
                  )
                }
              >
                Download Private Key
              </button>

              <button
                style={downloadButton}
                onClick={() =>
                  downloadFile(
                    certData.downloads.ca_certificate,
                    "ca.crt"
                  )
                }
              >
                Download CA Certificate
              </button>

              <button
                style={downloadButton}
                onClick={() =>
                  navigate(
                    `/credentials/${certData.certificate_id}`
                  )
                }
              >
                Show Credentials
              </button> */}
{/* 

            </div>
          </div>
        )} */}
      </div>
      {/* Back Button */}
<div
  style={{
    maxWidth: 420,
    margin: "16px auto 0",
  }}
>
  <button
    onClick={() => navigate("/devices")}
    style={{
      width: "100%",
      padding: "14px 16px",
      border: "1px solid #E8E8E8",
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
  );
}

