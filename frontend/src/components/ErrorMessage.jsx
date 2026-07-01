import React from "react";
import { AlertCircle } from "lucide-react";
import P from "../theme/colors";

export default function ErrorMessage({ message }) {

    if (!message) return null;

    return (

        <div
            style={{
                background: P.errorBg,
                border: `1px solid ${P.borderError}`,
                color: P.errorRed,
                padding: "10px 14px",
                borderRadius: 8,
                marginBottom: 20,
                fontSize: 13,
                display: "flex",
                alignItems: "center",
                gap: 8,
                width: "100%",
                boxSizing: "border-box",
            }}
        >
            <AlertCircle
                size={16}
                color={P.errorRed}
                style={{ flexShrink: 0 }}
            />

            <span>{message}</span>

        </div>

    );

}