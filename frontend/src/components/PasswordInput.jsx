import { useState, useRef, useEffect } from "react";
import P from "../theme/colors";

export default function PasswordInput({ value, onChange, placeholder = "Password", required = false, inputStyle = {} }) {

  const [visible, setVisible] = useState(false);
  const timerRef = useRef(null);

  const showPassword = () => {
    setVisible(true);
    // auto-hide after 3 seconds
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      setVisible(false);
    }, 3000);
  };

  const hidePassword = () => {
    setVisible(false);
    clearTimeout(timerRef.current);
  };

  // cleanup timer on unmount
  useEffect(() => {
    return () => clearTimeout(timerRef.current);
  }, []);

  return (
    <div style={{ position: "relative", width: "100%" }}>
      <input
        type={visible ? "text" : "password"}
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

      {/* EYE BUTTON */}
      <button
        type="button"
        onMouseDown={showPassword}
        onMouseUp={hidePassword}
        onMouseLeave={hidePassword}
        onTouchStart={showPassword}
        onTouchEnd={hidePassword}
        title="Hold to show password"
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
          color: visible ? P.deepAmber : P.textIcon,
        }}
      >
        {visible ? (
          // Eye-off icon (password visible)
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
            <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
            <line x1="1" y1="1" x2="23" y2="23"/>
          </svg>
        ) : (
          // Eye icon (password hidden)
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
            <circle cx="12" cy="12" r="3"/>
          </svg>
        )}
      </button>
    </div>
  );
}