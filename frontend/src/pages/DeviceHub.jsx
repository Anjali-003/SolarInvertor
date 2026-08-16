//import { useNavigate } from "react-router-dom";
//import Header from "../components/Header";
//import P from "../theme/colors";

//export default function DeviceHub() {
//    const navigate = useNavigate();

// const role = localStorage.getItem("role");

//    const username = localStorage.getItem("vendorName");

//    const handleLogout = () => {

//  const loginType =
//    localStorage.getItem("loginType");

//  localStorage.clear();

//  if (loginType === "vendor") {

//    navigate("/vendor-login");

//  } else {

//    navigate("/login");
//  }
//};
//    return (
//        <div
//            style={{
//                minHeight: "100vh",
//                background: P.bg,
//                padding: 30,
//                display: "flex",
//                flexDirection: "column",
//                boxSizing: "border-box"
//            }}
//        >
//            {/* PAGE CONTENT */}
//            <div style={{ flex: 1, width: "100%", maxWidth: 450, margin: "0 auto" }}>

//                <Header />

//                {/* WELCOME */}
//                <div
//                    style={{
//                        marginBottom: 50,
//                    }}
//                >
//                    <h1
//                        style={{
//                            fontSize: 34,
//                            fontWeight: 800,
//                            marginBottom: 8,
//                            color: P.textPrimary,
//                       }}
//                    >
//                        Welcome {username}
//                    </h1>
//
//                    <div
//                        style={{
//                            color: P.textSecond,
//                            fontSize: 16,
//                        }}
//                    >
//                        
//                    </div>
//                </div>

//                {/* ACTION BUTTONS */}
//                <div
//                    style={{
//                        display: "grid",
//                        gap: 20,
//                        maxWidth: 450,
//                    }}
//                >

//                    <button
//                        onClick={() =>
//                            navigate("/register-device")
//                        }
//                        style={buttonStyle}
//                    >
//                        Register Device
//                    </button>
//                  <button
//                        onClick={() =>
//                            navigate("/my-devices")
//                        }
//                        style={buttonStyle}
//                    >
//                        My Devices
//                    </button>
//               </div>
//           </div>

//            {/* LOGOUT BUTTON AT BOTTOM */}
//            <div
//                style={{
//                    width: "100%",
//                    maxWidth: 450,
//                    margin: "20px auto 0",
// }}
// >
//                 <button
//                     onClick={handleLogout}
//                     style={logoutStyle}
//                 >
//                     Logout
//                 </button>
//             </div>
//         </div>
//     );
// }

// const buttonStyle = {
//     padding: "22px",
//     border: "none",
//     borderRadius: 18,
//     background: `linear-gradient(135deg, ${P.amber}, ${P.orange})`,
//     color: P.surface,
//     fontSize: 20,
//     fontWeight: 700,
//     cursor: "pointer",
//     width: "100%",
// };

// const logoutStyle = {
//     width: "100%",
//     padding: "22px",
//     background: P.red,
//     border: "none",
//     borderRadius: 18,
//     color: P.surface,
//     fontSize: 20,
//     fontWeight: 700,
//     cursor: "pointer",
//     fontFamily:
//         "'Source Sans Pro', sans-serif",
// };

import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import P from "../theme/colors";
import "./DeviceHub.css";
import logo from "../assets/logo.png";

export default function DeviceHub() {
    const navigate = useNavigate();
    const canvasRef = useRef(null);
    const username = localStorage.getItem("vendorName");
    const vendorEmail = localStorage.getItem("vendorEmail");
    const vendorPhone = localStorage.getItem("vendorPhone");

    const handleLogout = () => {
        const loginType = localStorage.getItem("loginType");
        localStorage.clear();
        if (loginType === "vendor") {
            navigate("/vendor-login");
        } else {
            navigate("/login");
        }
    };

    // ── WebGL shader background ──────────────────────────
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        function syncSize() {
            const w = canvas.clientWidth || 400;
            const h = canvas.clientHeight || 800;
            if (canvas.width !== w || canvas.height !== h) {
                canvas.width = w;
                canvas.height = h;
            }
        }
        if (typeof ResizeObserver !== "undefined") {
            new ResizeObserver(syncSize).observe(canvas);
        }
        syncSize();

        const gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
        if (!gl) return;

        const vs = `attribute vec2 a_position;
varying vec2 v_texCoord;
void main() {
  v_texCoord = a_position * 0.5 + 0.5;
  gl_Position = vec4(a_position, 0.0, 1.0);
}`;
        const fs = `precision highp float;
uniform float u_time;
varying vec2 v_texCoord;
void main() {
    vec2 uv = v_texCoord;
    vec2 grid = fract(uv * 10.0);
    float lines = smoothstep(0.0, 0.05, grid.x) * smoothstep(1.0, 0.95, grid.x) *
                  smoothstep(0.0, 0.05, grid.y) * smoothstep(1.0, 0.95, grid.y);
    vec3 color = vec3(0.1, 0.15, 0.2);
    float glint = sin(uv.x * 5.0 + uv.y * 3.0 + u_time * 0.8) * 0.5 + 0.5;
    glint = pow(glint, 20.0) * 0.2;
    color += glint;
    color *= lines * 0.5 + 0.8;
    color += vec3(0.05, 0.05, 0.1) * (1.0 - uv.y);
    gl_FragColor = vec4(color, 1.0);
}`;

        function cs(type, src) {
            const s = gl.createShader(type);
            gl.shaderSource(s, src);
            gl.compileShader(s);
            return s;
        }

        const prog = gl.createProgram();
        gl.attachShader(prog, cs(gl.VERTEX_SHADER, vs));
        gl.attachShader(prog, cs(gl.FRAGMENT_SHADER, fs));
        gl.linkProgram(prog);
        gl.useProgram(prog);

        const buf = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, buf);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);

        const pos = gl.getAttribLocation(prog, "a_position");
        gl.enableVertexAttribArray(pos);
        gl.vertexAttribPointer(pos, 2, gl.FLOAT, false, 0, 0);

        const uTime = gl.getUniformLocation(prog, "u_time");
        const uRes = gl.getUniformLocation(prog, "u_resolution");

        let animId;
        function render(t) {
            if (typeof ResizeObserver === "undefined") syncSize();
            gl.viewport(0, 0, canvas.width, canvas.height);
            if (uTime) gl.uniform1f(uTime, t * 0.001);
            if (uRes) gl.uniform2f(uRes, canvas.width, canvas.height);
            gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
            animId = requestAnimationFrame(render);
        }
        render(0);

        return () => {
            cancelAnimationFrame(animId);
        };
    }, []);

    return (
        <div
            style={{
                minHeight: "100vh",
                position: "relative",
                overflow: "hidden",
                fontFamily: "'Inter', sans-serif",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
            }}
        >
            {/* WEBGL CANVAS BACKGROUND */}
            <canvas
                ref={canvasRef}
                style={{
                    position: "absolute",
                    inset: 0,
                    width: "100%",
                    height: "100%",
                    zIndex: 0,
                }}
            />

            {/* DARK OVERLAY */}
            <div
                style={{
                    position: "absolute",
                    inset: 0,
                    background: "rgba(10, 15, 25, 0.55)",
                    zIndex: 1,
                }}
            />

            {/* CONTENT */}
            <div
                style={{
                    position: "relative",
                    zIndex: 2,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    minHeight: "100vh",
                    padding: "24px",
                }}
            >
                {/* TOP SECTION */}

                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        flex: 1,
                        minHeight: 0,
                    }}
                >
                    {/* VENDOR DASHBOARD HEADING */}

                    {/* VENDOR DASHBOARD HEADING + COMPANY LOGO */}
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 16,
                            marginBottom: 24,
                            width: "100%",
                            boxSizing: "border-box",
                        }} >
                        {/* COMPANY LOGO */}
                        <div style={{
                            width: 86,
                            height: 86,
                            flexShrink: 0,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            borderRadius: 16,
                            background: "rgba(255,255,255,0.10)",
                            border: "1px solid rgba(255,255,255,0.18)",
                            backdropFilter: "blur(8px)",
                            WebkitBackdropFilter: "blur(8px)",
                            boxShadow: "0 8px 24px rgba(0,0,0,0.20)",
                        }} >
                            <img src={logo} alt="Company Logo"
                                style={{
                                    width: 102,
                                    height: 102,
                                    objectFit: "contain",
                                    display: "block",
                                }} />
                        </div>
                        {/* DASHBOARD TITLE */}
                        <div style={{
                            flex: 1,
                            minWidth: 0,
                        }} >
                            <div style={{
                                fontSize: 28,
                                fontWeight: 800,
                                color: P.textWhite,
                                fontFamily: "'DM Sans', sans-serif",
                                lineHeight: 1.1,
                            }} >
                                Vendor
                            </div>
                            <div style={{
                                fontSize: 28,
                                fontWeight: 800,
                                color: P.textWhite,
                                fontFamily: "'DM Sans', sans-serif",
                                lineHeight: 1.1,
                            }} >
                                Dashboard </div>
                            <div style={{
                                marginTop: 6,
                                fontSize: 18,
                                color: "rgba(255,255,255,0.55)",
                                fontFamily: "'Inter', sans-serif",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                            }} >
                                Welcome, {username || "Vendor"}
                            </div>
                        </div>
                    </div>
                    {/* <div
                        style={{
                            marginBottom: 24,
                        }}
                    >
                        <div
                            style={{
                                fontSize: 28,
                                fontWeight: 800,
                                color: P.textWhite,
                                fontFamily: "'DM Sans', sans-serif",
                                lineHeight: 1.2,
                            }}
                        >
                            Vendor
                        </div>
                        <div
                            style={{
                                fontSize: 28,
                                fontWeight: 800,
                                color: P.textWhite,
                                fontFamily: "'DM Sans', sans-serif",
                                lineHeight: 1.2,
                            }}
                        >
                            Dashboard
                        </div>
                        <div
                            style={{
                                marginTop: 6,
                                fontSize: 14,
                                color: "rgba(255,255,255,0.55)",
                                fontFamily: "'Inter', sans-serif",
                            }}
                        >
                            Welcome, {username || "Vendor"}
                        </div>
                    </div> */}

                    {/* ACTION BUTTONS */}
                    <div className="cards-container">



                        {/* REGISTER DEVICES BUTTON */}
                        <button
                            onClick={() => navigate("/register-device")}
                            style={actionBtn}
                        >
                            <div style={btnIconWrap}>
                                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={P.textWhite} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <circle cx="12" cy="12" r="10" />
                                    <line x1="12" y1="8" x2="12" y2="16" />
                                    <line x1="8" y1="12" x2="16" y2="12" />
                                </svg>
                            </div>
                            <span style={btnLabel}>Register Devices</span>
                        </button>

                        {/* MY DEVICES BUTTON */}
                        <button
                            onClick={() => navigate("/my-devices")}
                            style={actionBtn}
                        >
                            <div style={btnIconWrap}>
                                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={P.textWhite} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <rect x="3" y="3" width="7" height="7" rx="1" />
                                    <rect x="14" y="3" width="7" height="7" rx="1" />
                                    <rect x="3" y="14" width="7" height="7" rx="1" />
                                    <rect x="14" y="14" width="7" height="7" rx="1" />
                                </svg>
                            </div>
                            <span style={btnLabel}>My Devices</span>
                        </button>

                        {/* PROFILE BUTTON */}
                        <button
                            onClick={() => navigate("/vendor/profile")}
                            style={actionBtn}
                        >
                            <div style={btnIconWrap}>
                                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={P.textWhite} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <circle cx="12" cy="8" r="4" />
                                    <path d="M4 21c1.5-4 5-6 8-6s6.5 2 8 6" />
                                </svg>
                            </div>
                            <span style={btnLabel}>Profile</span>
                        </button>
                    </div>
                </div>


                {/* LOGOUT BUTTON */}
                <button
                    onClick={handleLogout}
                    style={{
                        width: "100%",
                        padding: "15px",
                        background: P.redLogout,
                        border: "none",
                        borderRadius: 50,
                        color: P.textWhite,
                        fontSize: 16,
                        fontWeight: 700,
                        fontFamily: "'DM Sans', sans-serif",
                        cursor: "pointer",
                        marginTop: 20,
                        boxShadow: "0 4px 14px rgba(192,57,43,0.45)",
                        letterSpacing: 0.3,
                    }}
                >
                    Logout
                </button>
            </div>
        </div>
    );
}

// ── Shared button styles ───────────────────────────────
const actionBtn = {
    width: "100%",
    aspectRatio: "1 / 1",

    background: "rgba(255,255,255,0.10)",
    border: "1px solid rgba(255,255,255,0.18)",
    backdropFilter: "blur(8px)",
    WebkitBackdropFilter: "blur(8px)",

    borderRadius: 18,

    cursor: "pointer",

    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",

    gap: 14,

    boxShadow: "0 8px 32px rgba(0,0,0,0.18)",

    transition: "0.25s ease",
};

const btnIconWrap = {
    width: 60,
    height: 60,
    borderRadius: 12,
    background: "rgba(221, 212, 198, 0.25)",
    border: "1px solid rgba(255, 255, 255, 0.4)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
};

const btnLabel = {
    fontSize: 17,
    fontWeight: 600,
    color: P.textWhite,
    fontFamily: "'DM Sans', sans-serif",
    letterSpacing: 0.2,
    textAlign: "center",
};