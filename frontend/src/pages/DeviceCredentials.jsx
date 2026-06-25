import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";

function CredentialRow({
  label,
  value,
}) {
  return (
    <div
      style={{
        background: "#FFF7E8",
        padding: 18,
        borderRadius: 16,
      }}
    >
      <div
        style={{
          fontSize: 13,
          color: "#777",
          marginBottom: 6,
        }}
      >
        {label}
      </div>

      <div
        style={{
          fontSize: 17,
          fontWeight: 700,
          color: "#222",
          wordBreak: "break-all",
        }}
      >
        {value}
      </div>
    </div>
  );
}

export default function DeviceCredentials() {

  const navigate = useNavigate();

  const { certificateId } =
    useParams();

  const [data, setData] =
    useState(null);

  useEffect(() => {

    const load =
      async () => {

        const token =
          localStorage.getItem("vendorToken");

        const res =
          await fetch(
            // `http://localhost:3000/api/certs/credentials/${certificateId}`,
            `http://localhost:3000/api/certs/${certificateId}/credentials`,
            {
              headers: {
                Authorization:
                  `Bearer ${token}`
              }
            }
          );

        const json =
          await res.json();

        setData(json);
      };

    load();

//   }, []);

}, [certificateId]);

console.log("Credentials data:", data);

  if (!data)
    return <div>Loading...</div>;

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
        maxWidth: 600,
        margin: "0 auto",
        background: "#fff",
        borderRadius: 24,
        padding: 40,
        boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
      }}
    >
      <h1
        style={{
          fontSize: 30,
          fontWeight: 800,
          marginBottom: 8,
        }}
      >
        Device Credentials
      </h1>

      <p
        style={{
          color: "#666",
          marginBottom: 30,
        }}
      >
        MQTT connection details for this inverter
      </p>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 16,
        }}
      >
        <CredentialRow
          label="IMEI"
          value={data.device?.imei}
        />

        <CredentialRow
          label="Solution"
          value={data.device?.solution}
        />

        <CredentialRow
          label="Client ID"
          value={data.credentials?.client_id}
        />

        <CredentialRow
          label="Username"
          value={data.credentials?.username}
        />

        <CredentialRow
          label="Password"
          value={data.credentials?.password}
        />
      </div>
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
      color: "#555",
      background: "#fff",
      boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
    }}
  >
    ← Back to Device Hub
  </button>
</div>
  </div>
);
}