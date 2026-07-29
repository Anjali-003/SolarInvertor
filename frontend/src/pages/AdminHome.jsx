import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import P from "../theme/colors";
import "./AdminHome.css";

export default function AdminHome() {
    const navigate = useNavigate();
    const canvasRef = useRef(null);

    const username = localStorage.getItem("adminName");

    const handleLogout = () => {
        const loginType = localStorage.getItem("loginType");
        localStorage.clear();
        if (loginType === "vendor") {
            navigate("/login");
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
                    flex: 1,
                    padding: 0,
                }}
            >
                {/* TOP SECTION */}

<div
    style={{
        display: "flex",
        flexDirection: "column",
        flex: 1,
        margin: "20px 20px 0",
    }}
>
                    {/* ADMIN DASHBOARD HEADING */}
                    <div
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
                            Admin
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
                            Welcome, {username || "Admin"}
                        </div>
                    </div>

                    {/* ACTION BUTTONS */}
                    <div
                        className="admin-cards-container"
                        style={{
                            flex: 1,
                            alignContent: "center",
                        }}
                    >

                        {/* PROFILE BUTTON */}
                        <button
                            className="admin-action-btn"
                            onClick={() => navigate("/admin/profile")}
                            style={actionBtn}
                        >
                            <div style={btnIconWrap}>
                                <svg
                                    width="22"
                                    height="22"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke={P.textWhite}
                                    strokeWidth="2.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <circle cx="12" cy="8" r="4" />
                                    <path d="M4 21c1.5-4 5-6 8-6s6.5 2 8 6" />
                                </svg>
                            </div>

                            <span style={btnLabel}>
                                Profile
                            </span>
                        </button>

                        {/* PENDING VENDORS BUTTON */}
                        <button
                            className="admin-action-btn"
                            onClick={() => navigate("/admin/pending")}
                            style={actionBtn}
                        >

                            <div style={btnIconWrap}>
                                <svg
                                    width="22"
                                    height="22"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke={P.textWhite}
                                    strokeWidth="2.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <rect x="3" y="3" width="7" height="7" rx="1" />
                                    <rect x="14" y="3" width="7" height="7" rx="1" />
                                    <rect x="3" y="14" width="7" height="7" rx="1" />
                                    <rect x="14" y="14" width="7" height="7" rx="1" />
                                </svg>
                            </div>

                            <span style={btnLabel}>
                                Pending Vendors
                            </span>
                        </button>

                        {/* UPLOAD IMEI BUTTON */}
                        <button
                            className="admin-action-btn"
                            onClick={() => navigate("/admin/upload-imei")}
                            style={actionBtn}
                        >

                            <div style={btnIconWrap}>
                                <svg
                                    width="22"
                                    height="22"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke={P.textWhite}
                                    strokeWidth="2.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <circle cx="12" cy="12" r="10" />
                                    <line x1="12" y1="8" x2="12" y2="16" />
                                    <line x1="8" y1="12" x2="16" y2="12" />
                                </svg>
                            </div>

                            <span style={btnLabel}>
                                Upload IMEI
                            </span>
                        </button>

                        {/* USERS BUTTON */}
                        <button
                            className="admin-action-btn"
                            onClick={() => navigate("/admin/users")}
                            style={actionBtn}
                        >

                            <div style={btnIconWrap}>
                                <svg
                                    width="22"
                                    height="22"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke={P.textWhite}
                                    strokeWidth="2.3"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <path d="M16 21v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2" />
                                    <circle cx="9.5" cy="7" r="3.5" />
                                    <path d="M20 21v-2a3.5 3.5 0 0 0-2.5-3.35" />
                                    <path d="M15.5 3.2a3.5 3.5 0 0 1 0 6.6" />
                                </svg>
                            </div>

                            <span style={btnLabel}>
                                Users
                            </span>
                        </button>
                    </div>
                </div>

                {/* LOGOUT BUTTON */}
                <div
                    style={{
                        padding: "20px",
                        position: "relative",
                        zIndex: 2,
                        marginTop: "auto",
                    }}
                >
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
            boxShadow: "0 4px 14px rgba(192,57,43,0.45)",
            letterSpacing: 0.3,
        }}
    >
        Logout
    </button>
</div>
            </div>
        </div>
    );
}

// ── Shared button styles ───────────────────────────────
const actionBtn = {
    width: "100%",
    aspectRatio: "1 / 1.2",

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