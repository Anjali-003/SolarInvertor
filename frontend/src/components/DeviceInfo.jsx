import React from "react";
import P from "../theme/colors";
import { parseKeyword } from "../utils/parseKeyword";

export default function DeviceInfo({
  data,
  lastUpdated,
}) {
  const serialNumber =
    Object.keys(data || {}).find((key) =>
      key.startsWith("ASN_")
    )
      ? data[
          Object.keys(data).find((key) =>
            key.startsWith("ASN_")
          )
        ]
      : "--";

  const statusKey =
    Object.keys(data || {}).find((key) => {
      if (!key.includes("-")) return false;

      const parsed =
        parseKeyword(key);

      return parsed.parameter === "IST";
    });

  const inverterStatus =
    statusKey != null
      ? data[statusKey]
      : null;

  const statusText =
    inverterStatus === 1
      ? "ON"
      : inverterStatus === 0
      ? "OFF"
      : inverterStatus === 2
      ? "FAULT"
      : inverterStatus === 3
      ? "OTHER"
      : "--";

  const statusColor =
    inverterStatus === 1
      ? P.green
      : inverterStatus === 0
      ? P.red
      : inverterStatus === 2
      ? "#EF4444"
      : P.textMuted;

  return (
    <div
      style={{
        background: P.surface,
        borderRadius: 18,
        padding: "18px 22px",
        boxShadow:
          "0 4px 14px rgba(0,0,0,0.08)",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexWrap: "wrap",
        gap: 20,
        margin: "10px 24px 0",
      }}
    >
      {/* LEFT SECTION */}
      <div>
        <div
          style={{
            fontSize: 16,
            color: P.textMuted,
            marginBottom: 4,
            fontFamily:
              "'Source Sans Pro', sans-serif",
          }}
        >
          Serial Number
        </div>

        <div
          style={{
            fontSize: 17,
            fontWeight: 700,
            color: P.textPrimary,
            fontFamily:
              "'Source Sans Pro', sans-serif",
          }}
        >
          {serialNumber}
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            padding: "4px 8px",
            borderRadius: 10,
            background: `${statusColor}22`,
            border: `1px solid ${statusColor}`,
            marginTop: 8,
            width: "fit-content",
          }}
        >
          <div
            style={{
              width: 14,
              height: 14,
              borderRadius: 3,
              background: statusColor,
              boxShadow: `0 0 8px ${statusColor}88`,
            }}
          />

          <span
            style={{
              fontSize: 14,
              fontWeight: 700,
              color: statusColor,
              fontFamily:
                "'Source Sans Pro', sans-serif",
            }}
          >
            {statusText}
          </span>
        </div>
      </div>

      {/* RIGHT SECTION */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-end",
        }}
      >
        <div
          style={{
            fontSize: 15,
            color: P.textMuted,
            marginBottom: 6,
            fontFamily:
              "'Source Sans Pro', sans-serif",
          }}
        >
          Last Updated
        </div>

        <div
          style={{
            fontSize: 17,
            fontWeight: 700,
            color: P.textPrimary,
            marginBottom: 4,
            fontFamily:
              "'Source Sans Pro', sans-serif",
          }}
        >
          {lastUpdated
            ? new Date(
                lastUpdated
              ).toLocaleDateString()
            : "--"}
        </div>

        <div
          style={{
            fontSize: 17,
            fontWeight: 700,
            color: P.textPrimary,
            fontFamily:
              "'Source Sans Pro', sans-serif",
          }}
        >
          {lastUpdated
            ? new Date(
                lastUpdated
              ).toLocaleTimeString()
            : "--"}
        </div>
      </div>
    </div>
  );
}