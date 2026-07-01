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
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
          }}
        >
          {/* LOGO */}
          <img
            src="/src/assets/logo.png"
            alt="logo"
            style={{
              width: 500,
              height: 120,
              justifyContent: "center",
              alignItems: "center",
              objectFit: "contain",
            }}
          />
        </div>
      </div>
    </div>
  );
}