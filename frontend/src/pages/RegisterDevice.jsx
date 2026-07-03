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
          "http://localhost:3000/api/certs/generate",
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

alert("Device registered successfully.");

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
    background:
      `linear-gradient(135deg, ${P.amber}, ${P.orange})`,
  };

  // const downloadFile = async (url, filename) => {

  //   try {

  //     const token =
  //       localStorage.getItem("vendorToken");

  //     const res = await fetch(url, {
  //       headers: {
  //         Authorization:
  //           `Bearer ${token}`
  //       }
  //     });

  //     if (!res.ok) {
  //       throw new Error(
  //         `Download failed: ${res.status}`
  //       );
  //     }

  //     const blob =
  //       await res.blob();

  //     const blobUrl =
  //       window.URL.createObjectURL(blob);

  //     const a =
  //       document.createElement("a");

  //     a.href = blobUrl;
  //     a.download = filename;

  //     document.body.appendChild(a);

  //     a.click();

  //     a.remove();

  //     window.URL.revokeObjectURL(
  //       blobUrl
  //     );

  //   } catch (err) {

  //     console.error(
  //       "Download error:",
  //       err
  //     );

  //     alert(
  //       "Failed to download file"
  //     );
  //   }
  // };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: P.bg,
        padding: "40px 20px",
      }}
    >
      <div
        style={{
          maxWidth: 500,
          margin: "0 auto",
          background: P.surface,
          borderRadius: 24,
          padding: 40,
          boxShadow:
            "0 10px 30px rgba(0,0,0,0.08)",
        }}
      >

        <Header />

        <h1
          style={{
            fontSize: 30,
            fontWeight: 800,
            marginBottom: 8,
          }}
        >
          Register Device
        </h1>

        <p
          style={{
            color: P.textLight,
            marginBottom: 30,
          }}
        >
          Add a new inverter device
        </p>

        <ErrorMessage message={error} />

        <form onSubmit={handleSubmit}>

          {/* IMEI */}
          <div
            style={{
              marginBottom: 20,
            }}
          >
            <label
              style={{
                display: "block",
                marginBottom: 8,
                fontWeight: 600,
              }}
            >
              IMEI Number
            </label>

            <ImeiInput
              value={imei}
              onChange={(e) => setImei(e.target.value)}
              placeholder="Enter IMEI"
              required
              inputStyle={{
                padding: "14px 16px",
                borderRadius: 12,
                border: `1px solid ${P.border}`,
                fontSize: 16,
              }}
            />
          </div>

          {/* Solution Type */}
          <div
            style={{
              marginBottom: 30,
            }}
          >
            <label
              style={{
                display: "block",
                marginBottom: 8,
                fontWeight: 600,
              }}
            >
              Solution Type
            </label>

            <select
              value={solutionType}
              onChange={(e) =>
                setSolutionType(
                  e.target.value
                )
              }
              style={{
                width: "100%",
                padding: "14px 16px",
                borderRadius: 12,
                border:
                  `1px solid ${P.border}`,
                fontSize: 16,
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
    marginBottom: 20,
  }}
>
  <label
    style={{
      display: "block",
      marginBottom: 8,
      fontWeight: 600,
    }}
  >
    Device Version
  </label>

  <input
    type="text"
    placeholder="Enter Device Version"
    value={deviceVersion}
    onChange={(e) => setDeviceVersion(e.target.value)}
    style={{
      width: "100%",
      padding: "14px 16px",
      borderRadius: 12,
      border: "1px solid #ddd",
      fontSize: 16,
      boxSizing: "border-box",
    }}
    required
  />
</div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              padding: 16,
              border: "none",
              borderRadius: 14,
              fontWeight: 700,
              fontSize: 16,
              cursor: "pointer",
              color: P.surface,
              opacity:
                loading
                  ? 0.7
                  : 1,
              background:
                `linear-gradient(135deg, ${P.amber}, ${P.orange})`,
            }}
          >
            {loading
              ? "Generating..."
              : "Register Device"}
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
    maxWidth: 500,
    margin: "20px auto 0",
  }}
>
  <button
    onClick={() => navigate("/devices")}
    style={{
      width: "100%",
      padding: 14,
      border: "none",
      borderRadius: 14,
      cursor: "pointer",
      fontWeight: 700,
      fontSize: 16,
      color: P.textSubtle,
      background: P.surface,
      boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
    }}
  >
    ← Back to Device Hub
  </button>
</div>
    </div>
  );
}

